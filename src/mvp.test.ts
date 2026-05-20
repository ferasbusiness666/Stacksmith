import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { normalizeBlueprint } from "./blueprints.js";
import { createProjectFiles } from "./generator.js";
import { getPublicSettings, updateSettings } from "./config.js";
import { loadHistory, sanitizeHistoryState, saveHistory } from "./history.js";
import { isAllowedLocalOrigin, parseJsonBodyText } from "./http-security.js";
import {
  completeTextWithProvider,
  createOpenRouterRequest,
  generateBlueprintWithProvider,
  getProviderHealth,
  listAvailableModels,
  parseProviderBlueprint,
  resolveProviderModelSettings,
  testProviderConfig,
} from "./providers.js";
import {
  canEditWorkDirectory,
  estimateChatUsage,
  estimateTokens,
  moveItem,
  removeSessionById,
  resolveFolderPickerInitialPath,
} from "./session-helpers.js";
import { decryptSecretFromStorage, encryptSecretForStorage } from "./secrets.js";
import { createCommandReviewLog, reviewCommand } from "./safety.js";
import { createProjectPlan, isInsideDirectory, resolveProjectStatusWorkspace, slugifyProjectName } from "./workspace.js";

describe("workspace safety", () => {
  it("creates safe project slugs", () => {
    assert.equal(slugifyProjectName("Invoice Dashboard!!!"), "invoice-dashboard");
    assert.equal(slugifyProjectName("../bad path"), "bad-path");
    assert.equal(slugifyProjectName(""), "stacksmith-project");
  });

  it("keeps generated paths inside the configured workspace", () => {
    const workspace = path.join(os.tmpdir(), "stacksmith-tests");
    const plan = createProjectPlan({ workspacePath: workspace, projectName: "Local CRM" });

    assert.equal(plan.slug, "local-crm");
    assert.equal(isInsideDirectory(workspace, plan.projectPath), true);
    assert.equal(isInsideDirectory(workspace, path.dirname(workspace)), false);
  });

  it("uses a selected work directory when planning generated project paths", () => {
    const selectedWorkDirectory = path.join(os.tmpdir(), "stacksmith-selected-workdir");
    const plan = createProjectPlan({ workspacePath: selectedWorkDirectory, projectName: "Generated CRM" });

    assert.equal(plan.projectPath, path.join(selectedWorkDirectory, "generated-crm"));
    assert.equal(isInsideDirectory(selectedWorkDirectory, plan.projectPath), true);
  });
});

describe("session UI helpers", () => {
  it("defaults folder picking to the user home directory unless an explicit path is provided", () => {
    assert.equal(resolveFolderPickerInitialPath(undefined, "C:\\Users\\NewUser"), "C:\\Users\\NewUser");
    assert.equal(resolveFolderPickerInitialPath("", "C:\\Users\\NewUser"), "C:\\Users\\NewUser");
    assert.equal(resolveFolderPickerInitialPath("  D:\\Projects  ", "C:\\Users\\NewUser"), "D:\\Projects");
  });

  it("estimates chat token and context usage locally", () => {
    assert.equal(estimateTokens(""), 0);
    assert.equal(estimateTokens("hi"), 1);

    const usage = estimateChatUsage([{ text: "hello world" }, { text: "another message" }], 100);

    assert.equal(usage.contextLimit, 100);
    assert.equal(usage.tokensUsed > 0, true);
    assert.equal(usage.percentUsed > 0, true);
  });

  it("reorders and removes current-session chats without persistence state", () => {
    assert.deepEqual(moveItem(["a", "b", "c"], 0, 2), ["b", "c", "a"]);
    assert.deepEqual(moveItem(["a", "b", "c"], -1, 2), ["a", "b", "c"]);

    const deletedActive = removeSessionById([{ id: "a" }, { id: "b" }], "a", "a");
    assert.deepEqual(deletedActive.sessions, [{ id: "b" }]);
    assert.equal(deletedActive.activeSessionId, "b");

    const deletedInactive = removeSessionById([{ id: "a" }, { id: "b" }], "a", "b");
    assert.deepEqual(deletedInactive.sessions, [{ id: "a" }]);
    assert.equal(deletedInactive.activeSessionId, "a");

    const deletedLast = removeSessionById([{ id: "a" }], "a", "a");
    assert.deepEqual(deletedLast.sessions, []);
    assert.equal(deletedLast.activeSessionId, null);
  });

  it("blocks work-directory editing after the chat is locked", () => {
    assert.equal(canEditWorkDirectory(false), true);
    assert.equal(canEditWorkDirectory(true), false);
  });
});

describe("blueprints", () => {
  it("normalizes incomplete provider output into a safe blueprint", () => {
    const blueprint = normalizeBlueprint({
      projectName: "Invoice Dashboard",
      summary: "Track invoices locally.",
      screens: ["Dashboard"],
    });

    assert.equal(blueprint.projectName, "Invoice Dashboard");
    assert.equal(blueprint.databaseMode, "none");
    assert.deepEqual(blueprint.screens, ["Dashboard"]);
    assert.ok(blueprint.notGeneratedYet.includes("Production hosting"));
  });
});

describe("provider adapters", () => {
  it("builds OpenRouter requests without exposing unrelated settings", () => {
    const request = createOpenRouterRequest({
      apiKey: "sk-test",
      model: "openai/gpt-4o-mini",
      prompt: "Build a CRM",
    });

    assert.equal(request.url, "https://openrouter.ai/api/v1/chat/completions");
    assert.equal(request.headers.Authorization, "Bearer sk-test");
    assert.equal(request.body.model, "openai/gpt-4o-mini");
    assert.match(request.body.messages[1].content, /Build a CRM/);
  });

  it("includes current chat history in OpenRouter requests", () => {
    const request = createOpenRouterRequest({
      apiKey: "sk-test",
      model: "openai/gpt-4o-mini",
      prompt: "Add filters",
      history: [
        { role: "user", text: "Build an invoice app" },
        { role: "assistant", text: "I can help plan that." },
      ],
    });

    assert.equal(request.body.messages[1].role, "user");
    assert.equal(request.body.messages[1].content, "Build an invoice app");
    assert.equal(request.body.messages[2].role, "assistant");
    assert.equal(request.body.messages[3].content, "Add filters");
  });

  it("parses JSON blueprint responses wrapped in model text", () => {
    const blueprint = parseProviderBlueprint('Sure. {"projectName":"CRM","summary":"Local CRM","screens":["Home"]}');

    assert.equal(blueprint.projectName, "CRM");
    assert.equal(blueprint.summary, "Local CRM");
  });

  it("checks a specific provider health target without changing active provider", async () => {
    const health = await getProviderHealth(
      {
        provider: "ollama",
        ollamaUrl: "http://127.0.0.1:11434",
        ollamaModel: "llama3.1",
        openRouterModel: "openai/gpt-4o-mini",
        databaseMode: "none",
        workspacePath: "/tmp/stacksmith",
        commandMode: "never",
        theme: "dark",
        accent: "blue",
      },
      {
        provider: "openrouter",
        hasOpenRouterKey: async () => false,
      },
    );

    assert.equal(health.ok, false);
    assert.match(health.message, /OpenRouter key/);
  });

  it("lists Ollama and OpenRouter models without returning secrets", async () => {
    const fetcher = async (url: string | URL | Request) => {
      const target = String(url);
      if (target.endsWith("/api/tags")) {
        return new Response(JSON.stringify({ models: [{ model: "qwen2.5-coder" }] }));
      }
      if (target === "https://openrouter.ai/api/v1/models") {
        return new Response(JSON.stringify({ data: [{ id: "openai/gpt-4o-mini", name: "GPT-4o Mini" }] }));
      }
      return new Response("{}", { status: 404 });
    };

    const models = await listAvailableModels(
      {
        provider: "ollama",
        ollamaUrl: "http://127.0.0.1:11434",
        ollamaModel: "llama3.1",
        openRouterModel: "openai/gpt-4o-mini",
        databaseMode: "none",
        workspacePath: "/tmp/stacksmith",
        commandMode: "never",
        theme: "dark",
        accent: "blue",
      },
      { fetch: fetcher as typeof fetch, readOpenRouterKey: async () => "sk-test" },
    );

    assert.equal(models.models.some((model) => model.id === "qwen2.5-coder" && model.provider === "ollama"), true);
    assert.equal(models.models.some((model) => model.id === "openai/gpt-4o-mini" && model.provider === "openrouter"), true);
    assert.equal(JSON.stringify(models).includes("sk-test"), false);
  });

  it("tests an unsaved OpenRouter key without requiring stored credentials", async () => {
    const authorizations: string[] = [];
    const fetcher = async (url: string | URL | Request, init?: RequestInit) => {
      const headers = init?.headers as Record<string, string> | undefined;
      if (headers?.Authorization) {
        authorizations.push(headers.Authorization);
      }
      if (String(url) === "https://openrouter.ai/api/v1/credits") {
        return new Response(JSON.stringify({ data: { total_credits: 1 } }));
      }
      return new Response(JSON.stringify({ data: [] }));
    };

    const result = await testProviderConfig(
      {
        provider: "openrouter",
        ollamaUrl: "http://127.0.0.1:11434",
        ollamaModel: "llama3.1",
        openRouterModel: "openai/gpt-4o-mini",
        databaseMode: "none",
        workspacePath: "/tmp/stacksmith",
        commandMode: "never",
        theme: "dark",
        accent: "blue",
      },
      { provider: "openrouter", openRouterApiKey: "sk-temp" },
      { fetch: fetcher as typeof fetch, readOpenRouterKey: async () => null },
    );

    assert.equal(result.ok, true);
    assert.deepEqual(authorizations, ["Bearer sk-temp", "Bearer sk-temp"]);
  });

  it("uses the selected provider and model for chat completion", async () => {
    let requestModel = "";
    let messages: Array<{ role: string; content: string }> = [];
    const fetcher = async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body ?? "{}")) as { model?: string; messages?: Array<{ role: string; content: string }> };
      requestModel = body.model ?? "";
      messages = body.messages ?? [];
      return new Response(JSON.stringify({ choices: [{ message: { content: "Ready." } }] }));
    };

    const text = await completeTextWithProvider(
      {
        provider: "ollama",
        ollamaUrl: "http://127.0.0.1:11434",
        ollamaModel: "llama3.1",
        openRouterModel: "openai/gpt-4o-mini",
        databaseMode: "none",
        workspacePath: "/tmp/stacksmith",
        commandMode: "never",
        theme: "dark",
        accent: "blue",
      },
      "hello",
      {
        provider: "openrouter",
        model: "anthropic/claude-3.5-sonnet",
        history: [{ role: "user", text: "Previous request" }],
        deps: { fetch: fetcher as typeof fetch, readOpenRouterKey: async () => "sk-test" },
      },
    );

    assert.equal(text, "Ready.");
    assert.equal(requestModel, "anthropic/claude-3.5-sonnet");
    assert.equal(messages.some((message) => message.role === "user" && message.content === "Previous request"), true);
  });

  it("includes current chat history in Ollama prompts", async () => {
    let prompt = "";
    const fetcher = async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body ?? "{}")) as { prompt?: string };
      prompt = body.prompt ?? "";
      return new Response(JSON.stringify({ response: "Ready." }));
    };

    const text = await completeTextWithProvider(
      {
        provider: "ollama",
        ollamaUrl: "http://127.0.0.1:11434",
        ollamaModel: "llama3.1",
        openRouterModel: "openai/gpt-4o-mini",
        databaseMode: "none",
        workspacePath: "/tmp/stacksmith",
        commandMode: "never",
        theme: "dark",
        accent: "blue",
      },
      "What changed?",
      {
        provider: "ollama",
        history: [
          { role: "user", text: "Build a CRM" },
          { role: "assistant", text: "I generated a blueprint." },
        ],
        deps: { fetch: fetcher as typeof fetch },
      },
    );

    assert.equal(text, "Ready.");
    assert.match(prompt, /Current chat context/);
    assert.match(prompt, /User: Build a CRM/);
    assert.match(prompt, /Stacksmith: I generated a blueprint/);
    assert.match(prompt, /Latest user message:\nWhat changed\?/);
  });

  it("includes current chat context in blueprint prompts", async () => {
    let blueprintPrompt = "";
    const fetcher = async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body ?? "{}")) as { messages?: Array<{ content: string }> };
      blueprintPrompt = body.messages?.at(-1)?.content ?? "";
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  projectName: "CRM",
                  summary: "Track customers.",
                  screens: ["Home"],
                }),
              },
            },
          ],
        }),
      );
    };

    const blueprint = await generateBlueprintWithProvider({
      prompt: "Add contacts",
      provider: "openrouter",
      model: "openai/gpt-4o-mini",
      databaseMode: "sqlite",
      settings: {
        provider: "openrouter",
        ollamaUrl: "http://127.0.0.1:11434",
        ollamaModel: "llama3.1",
        openRouterModel: "openai/gpt-4o-mini",
        databaseMode: "none",
        workspacePath: "/tmp/stacksmith",
        commandMode: "never",
        theme: "dark",
        accent: "blue",
      },
      history: [{ role: "user", text: "Build a local CRM" }],
      deps: { fetch: fetcher as typeof fetch, readOpenRouterKey: async () => "sk-test" },
    });

    assert.equal(blueprint.projectName, "CRM");
    assert.match(blueprintPrompt, /Current chat context/);
    assert.match(blueprintPrompt, /Build a local CRM/);
    assert.match(blueprintPrompt, /Add contacts/);
  });

  it("resolves active provider and model settings without changing unrelated models", () => {
    const settings = resolveProviderModelSettings(
      {
        provider: "ollama",
        ollamaUrl: "http://127.0.0.1:11434",
        ollamaModel: "llama3.1",
        openRouterModel: "openai/gpt-4o-mini",
        databaseMode: "none",
        workspacePath: "/tmp/stacksmith",
        commandMode: "never",
        theme: "dark",
        accent: "blue",
      },
      { provider: "openrouter", model: "meta-llama/llama-3.1-8b-instruct", databaseMode: "sqlite" },
    );

    assert.equal(settings.provider, "openrouter");
    assert.equal(settings.openRouterModel, "meta-llama/llama-3.1-8b-instruct");
    assert.equal(settings.ollamaModel, "llama3.1");
    assert.equal(settings.databaseMode, "sqlite");
  });

  it("times out provider requests instead of hanging indefinitely", async () => {
    const fetcher = async (_url: string | URL | Request, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
      });

    await assert.rejects(
      completeTextWithProvider(
        {
          provider: "ollama",
          ollamaUrl: "http://127.0.0.1:11434",
          ollamaModel: "llama3.1",
          openRouterModel: "openai/gpt-4o-mini",
          databaseMode: "none",
          workspacePath: "/tmp/stacksmith",
          commandMode: "never",
          theme: "dark",
          accent: "blue",
        },
        "hello",
        { deps: { fetch: fetcher as typeof fetch, timeoutMs: 5 } },
      ),
      /timed out/i,
    );
  });
});

describe("http security helpers", () => {
  it("allows localhost origins and non-browser local tooling only", () => {
    assert.equal(isAllowedLocalOrigin(undefined), true);
    assert.equal(isAllowedLocalOrigin("http://127.0.0.1:4317"), true);
    assert.equal(isAllowedLocalOrigin("http://localhost:4317"), true);
    assert.equal(isAllowedLocalOrigin("https://evil.example"), false);
  });

  it("returns clean errors for malformed or oversized JSON bodies", () => {
    assert.throws(() => parseJsonBodyText("{bad json", 1024), /Malformed JSON/);
    assert.throws(() => parseJsonBodyText("x".repeat(1025), 1024), /too large/);
    assert.deepEqual(parseJsonBodyText('{"ok":true}', 1024), { ok: true });
  });
});

describe("persistent history", () => {
  it("round-trips sanitized full chat history without pending messages or secrets", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "stacksmith-history-"));
    const filePath = path.join(dir, "history.json");
    const history = sanitizeHistoryState({
      version: 1,
      activeSessionId: "chat-1",
      sessions: [
        {
          id: "chat-1",
          title: "CRM",
          createdAt: "2026-05-19T00:00:00.000Z",
          updatedAt: "2026-05-19T00:00:01.000Z",
          workDirectory: "D:\\Projects",
          workDirectoryLocked: true,
          generatedProjectPath: "D:\\Projects\\crm",
          databaseMode: "sqlite",
          provider: "openrouter",
          model: "openai/gpt-4o-mini",
          mode: "blueprint",
          messages: [
            { role: "user", text: "Build a CRM", memory: true },
            { role: "assistant", text: "Loading", pending: true, memory: false },
            { role: "assistant", text: "Ready", memory: true },
          ],
          blueprint: normalizeBlueprint({ projectName: "CRM", summary: "Track customers." }),
          awaitingBlueprintDecision: true,
          refiningBlueprint: false,
          generatedProject: { projectPath: "D:\\Projects\\crm", files: ["package.json"], runCommands: [] },
          openRouterApiKey: "sk-should-not-survive",
        },
      ],
    });

    await saveHistory(history, { filePath });
    const loaded = await loadHistory({ filePath });

    assert.equal(loaded.activeSessionId, "chat-1");
    assert.equal(loaded.sessions[0].messages.length, 2);
    assert.equal(JSON.stringify(loaded).includes("sk-should-not-survive"), false);
    assert.equal(loaded.sessions[0].blueprint?.projectName, "CRM");
  });

  it("sanitizes invalid history and keeps delete-all state blank", () => {
    const empty = sanitizeHistoryState({ version: 1, activeSessionId: "missing", sessions: [] });
    assert.equal(empty.activeSessionId, null);
    assert.deepEqual(empty.sessions, []);

    const sanitized = sanitizeHistoryState({
      version: 1,
      activeSessionId: "invalid",
      sessions: [{ id: "", title: "", messages: "bad" }],
    });
    assert.equal(sanitized.activeSessionId, null);
    assert.deepEqual(sanitized.sessions, []);
  });
});

describe("config public settings", () => {
  it("never returns the OpenRouter key value", async () => {
    const settings = await getPublicSettings({
      readSettings: async () => ({ provider: "openrouter", openRouterKeySaved: true }),
      hasOpenRouterKey: async () => true,
    });

    assert.equal(settings.provider, "openrouter");
    assert.equal(settings.openRouterKeySaved, true);
    assert.equal(Object.hasOwn(settings, "openRouterApiKey"), false);
  });

  it("updates non-secret settings with safe defaults", async () => {
    const settings = updateSettings(
      { provider: "ollama", databaseMode: "none" },
      { provider: "openrouter", databaseMode: "sqlite", commandMode: "manual" },
    );

    assert.equal(settings.provider, "openrouter");
    assert.equal(settings.databaseMode, "sqlite");
    assert.equal(settings.commandMode, "manual");
  });

  it("maps supported command modes and rejects unknown command modes", () => {
    assert.equal(updateSettings({ commandMode: "never" }, { commandMode: "manual" }).commandMode, "manual");
    assert.equal(updateSettings({ commandMode: "never" }, { commandMode: "auto-safe" }).commandMode, "auto-safe");
    assert.equal(updateSettings({ commandMode: "manual" }, { commandMode: "never" }).commandMode, "never");
    assert.equal(updateSettings({ commandMode: "manual" }, { commandMode: "auto-run-risky" as never }).commandMode, "manual");
  });

  it("updates active provider and model without requiring provider credential fields", () => {
    const settings = updateSettings(
      { provider: "ollama", ollamaModel: "llama3.1", openRouterModel: "openai/gpt-4o-mini" },
      { provider: "openrouter", openRouterModel: "anthropic/claude-3.5-sonnet" },
    );

    assert.equal(settings.provider, "openrouter");
    assert.equal(settings.openRouterModel, "anthropic/claude-3.5-sonnet");
    assert.equal(settings.ollamaModel, "llama3.1");
  });

  it("saves provider configuration without wiping active model choices", () => {
    const settings = updateSettings(
      { provider: "openrouter", ollamaModel: "qwen2.5-coder", openRouterModel: "meta-llama/llama-3.1-8b-instruct" },
      { ollamaUrl: "http://127.0.0.1:11434" },
    );

    assert.equal(settings.provider, "openrouter");
    assert.equal(settings.ollamaModel, "qwen2.5-coder");
    assert.equal(settings.openRouterModel, "meta-llama/llama-3.1-8b-instruct");
  });
});

describe("secret storage", () => {
  it("round-trips OpenRouter secrets through Windows DPAPI without returning plain text", { skip: process.platform !== "win32" }, () => {
    const encrypted = encryptSecretForStorage("sk-stacksmith-test");

    assert.notEqual(encrypted, "sk-stacksmith-test");
    assert.equal(decryptSecretFromStorage(encrypted), "sk-stacksmith-test");
  });
});

describe("generator", () => {
  it("creates a React full-stack project file set", () => {
    const blueprint = normalizeBlueprint({
      projectName: "Invoice Dashboard",
      summary: "Track invoices.",
      databaseMode: "sqlite",
      screens: ["Dashboard"],
    });
    const files = createProjectFiles(blueprint);
    const paths = files.map((file) => file.path).sort();

    assert.ok(paths.includes("package.json"));
    assert.ok(paths.includes("README.md"));
    assert.ok(paths.includes("src/App.tsx"));
    assert.ok(paths.includes("server/index.ts"));
    assert.ok(paths.includes("shared/types.ts"));
    assert.ok(paths.includes(".env.example"));
    assert.match(files.find((file) => file.path === "package.json")?.contents ?? "", /vite/);
  });
});

describe("command safety", () => {
  it("approves low-risk workspace commands", () => {
    const decision = reviewCommand({
      command: "npm install",
      cwd: path.join(os.homedir(), "Stacksmith", "projects", "demo"),
      workspacePath: path.join(os.homedir(), "Stacksmith", "projects"),
      purpose: "Install generated app dependencies",
    });

    assert.equal(decision.decision, "approved");
  });

  it("rejects destructive commands outside the workspace", () => {
    const decision = reviewCommand({
      command: "rm -rf C:\\Users",
      cwd: "C:\\",
      workspacePath: path.join(os.homedir(), "Stacksmith", "projects"),
      purpose: "Clean files",
    });

    assert.equal(decision.decision, "rejected");
  });

  it("requires user approval for ambiguous shell commands", () => {
    const decision = reviewCommand({
      command: "npm run migrate",
      cwd: path.join(os.homedir(), "Stacksmith", "projects", "demo"),
      workspacePath: path.join(os.homedir(), "Stacksmith", "projects"),
      purpose: "Run project migration",
    });

    assert.equal(decision.decision, "needs_user_approval");
  });

  it("redacts common secret shapes from command review logs", () => {
    const line = createCommandReviewLog(
      {
        command:
          "curl -H \"Authorization: Bearer sk-secret\" https://user:pass@example.com --api-key sk-test token=abc password=hunter2",
        cwd: path.join(os.homedir(), "Stacksmith", "projects", "demo"),
        workspacePath: path.join(os.homedir(), "Stacksmith", "projects"),
        purpose: "Test redaction",
      },
      { decision: "needs_user_approval", reason: "Manual review." },
    );

    assert.equal(line.includes("sk-secret"), false);
    assert.equal(line.includes("sk-test"), false);
    assert.equal(line.includes("hunter2"), false);
    assert.equal(line.includes("user:pass@example.com"), false);
  });
});

describe("project status workspace selection", () => {
  it("validates project status against the selected chat work directory when provided", () => {
    const globalWorkspace = path.join(os.tmpdir(), "stacksmith-global");
    const selectedWorkDirectory = path.join(os.tmpdir(), "stacksmith-selected");
    const projectPath = path.join(selectedWorkDirectory, "app");

    assert.equal(resolveProjectStatusWorkspace(globalWorkspace, selectedWorkDirectory, projectPath), selectedWorkDirectory);
    assert.throws(() => resolveProjectStatusWorkspace(globalWorkspace, selectedWorkDirectory, path.join(globalWorkspace, "app")));
  });
});
