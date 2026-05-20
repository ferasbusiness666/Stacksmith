import fs from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

import { normalizeBlueprint } from "./blueprints.js";
import { getPublicSettings, readSettings, saveSettings, updateSettings } from "./config.js";
import { validateGeneratedProjectPlan, writeProjectFiles } from "./generator.js";
import { getAboutMetadata } from "./metadata.js";
import {
  completeTextWithProvider,
  generateBlueprintWithProvider,
  generateProjectFilesWithProvider,
  getProviderHealth,
  listAvailableModels,
  resolveProviderModelSettings,
  testProviderConfig,
} from "./providers.js";
import { loadHistory, saveHistory, sanitizeHistoryState } from "./history.js";
import { HttpInputError, getDefaultJsonBodyLimit, isAllowedLocalOrigin, parseJsonBodyText } from "./http-security.js";
import { saveOpenRouterKey } from "./secrets.js";
import { studioHtml } from "./studio-page.js";
import { createCommandReviewLog, createCommandReviewPrompt, parseCheckerReview, reviewCommand } from "./safety.js";
import { resolveFolderPickerInitialPath } from "./session-helpers.js";
import type {
  AppSettings,
  Blueprint,
  ChatHistoryMessage,
  CommandReviewInput,
  DatabaseMode,
  ProviderName,
  StudioMode,
} from "./types.js";
import { createAvailableProjectPlan, ensureWorkspace, resolveProjectStatusWorkspace } from "./workspace.js";

const HOST = "127.0.0.1";
const PORT = 4317;

function send(res: ServerResponse, statusCode: number, contentType: string, body: string): void {
  res.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
  send(res, statusCode, "application/json; charset=utf-8", JSON.stringify(body));
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.byteLength;
    if (totalBytes > getDefaultJsonBodyLimit()) {
      throw new HttpInputError("JSON body is too large.");
    }
    chunks.push(buffer);
  }

  const body = Buffer.concat(chunks).toString("utf8");
  return parseJsonBodyText(body);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readSettingsPatch(body: Record<string, unknown>): Partial<AppSettings> {
  const settingsValue = isRecord(body.settings) ? body.settings : body;
  return settingsValue as Partial<AppSettings>;
}

function readOptionalPath(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? path.resolve(value.trim()) : undefined;
}

function readProviderName(value: unknown): ProviderName | undefined {
  return value === "openrouter" || value === "ollama" ? value : undefined;
}

function readDatabaseMode(value: unknown): DatabaseMode | undefined {
  return value === "sqlite" || value === "none" ? value : undefined;
}

function readStudioMode(value: unknown): StudioMode {
  return value === "debug" || value === "chat" || value === "build" || value === "blueprint" ? value : "chat";
}

function readHistory(value: unknown): ChatHistoryMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((message): message is Record<string, unknown> => isRecord(message))
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : message.role === "user" ? "user" : undefined,
      text: readString(message.text).trim(),
    }))
    .filter((message): message is ChatHistoryMessage => (message.role === "assistant" || message.role === "user") && !!message.text);
}

function readSelectedSettings(settings: AppSettings, body: Record<string, unknown>): AppSettings {
  return resolveProviderModelSettings(settings, {
    provider: readProviderName(body.provider),
    model: readString(body.model).trim(),
    databaseMode: readDatabaseMode(body.databaseMode),
  });
}

function settingsPatchForSelectedModel(body: Record<string, unknown>): Partial<AppSettings> {
  const provider = readProviderName(body.provider);
  const model = readString(body.model).trim();
  if (!provider || !model) {
    return {};
  }

  return provider === "openrouter" ? { provider, openRouterModel: model } : { provider, ollamaModel: model };
}

async function appendCommandReview(settings: AppSettings, input: CommandReviewInput, review: unknown): Promise<void> {
  const logPath = path.join(settings.workspacePath, ".stacksmith", "command-reviews.jsonl");
  await fs.mkdir(path.dirname(logPath), { recursive: true });
  await fs.appendFile(logPath, createCommandReviewLog(input, review as ReturnType<typeof reviewCommand>), "utf8");
}

function pickWindowsDirectory(initialPath: string): string | null {
  if (process.platform !== "win32") {
    return null;
  }

  const script = `
$ErrorActionPreference = 'Stop'
$shell = New-Object -ComObject Shell.Application
$folder = $shell.BrowseForFolder(0, 'Choose Stacksmith work directory', 0, '${initialPath.replaceAll("'", "''")}')
if ($folder -and $folder.Self -and $folder.Self.Path) { $folder.Self.Path }
`;
  const result = spawnSync("powershell.exe", ["-NoProfile", "-STA", "-Command", script], {
    encoding: "utf8",
    windowsHide: false,
  });

  if (result.status !== 0) {
    throw new Error("Folder picker could not be opened. Paste a folder path manually.");
  }

  const selected = result.stdout.trim();
  return selected ? path.resolve(selected) : null;
}

export async function startStudioServer(): Promise<void> {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", `http://${HOST}:${PORT}`);

    try {
      if (isMutatingMethod(req.method) && !isAllowedLocalOrigin(req.headers.origin, String(PORT))) {
        sendJson(res, 403, { error: "Rejected non-local browser origin." });
        return;
      }

      if (url.pathname === "/health") {
        send(res, 200, "application/json; charset=utf-8", JSON.stringify({ ok: true, phase: "1-shell" }));
        return;
      }

      if (url.pathname === "/") {
        send(res, 200, "text/html; charset=utf-8", studioHtml);
        return;
      }

      if (url.pathname === "/api/settings" && req.method === "GET") {
        sendJson(res, 200, await getPublicSettings());
        return;
      }

      if (url.pathname === "/api/history" && req.method === "GET") {
        sendJson(res, 200, await loadHistory());
        return;
      }

      if (url.pathname === "/api/about" && req.method === "GET") {
        sendJson(res, 200, getAboutMetadata());
        return;
      }

      if (url.pathname === "/api/history" && req.method === "POST") {
        const body = await readJson(req);
        const history = sanitizeHistoryState(body);
        await saveHistory(history);
        sendJson(res, 200, history);
        return;
      }

      if (url.pathname === "/api/settings" && req.method === "POST") {
        const body = await readJson(req);
        if (!isRecord(body)) {
          sendJson(res, 400, { error: "Settings payload must be an object." });
          return;
        }

        if (typeof body.openRouterApiKey === "string" && body.openRouterApiKey.trim()) {
          await saveOpenRouterKey(body.openRouterApiKey);
        }

        const nextSettings = updateSettings(await readSettings(), readSettingsPatch(body));
        await saveSettings(nextSettings);
        sendJson(res, 200, await getPublicSettings());
        return;
      }

      if (url.pathname === "/api/providers/health" && req.method === "POST") {
        const body = await readJson(req);
        const provider =
          isRecord(body) && (body.provider === "ollama" || body.provider === "openrouter") ? body.provider : undefined;
        sendJson(res, 200, await getProviderHealth(await readSettings(), { provider }));
        return;
      }

      if (url.pathname === "/api/models" && req.method === "GET") {
        sendJson(res, 200, await listAvailableModels(await readSettings()));
        return;
      }

      if (url.pathname === "/api/providers/test" && req.method === "POST") {
        const body = await readJson(req);
        if (!isRecord(body) || !readProviderName(body.provider)) {
          sendJson(res, 400, { error: "Provider test payload must include provider." });
          return;
        }

        sendJson(
          res,
          200,
          await testProviderConfig(await readSettings(), {
            provider: readProviderName(body.provider) as ProviderName,
            ollamaUrl: readString(body.ollamaUrl).trim() || undefined,
            openRouterApiKey: readString(body.openRouterApiKey).trim() || undefined,
          }),
        );
        return;
      }

      if (url.pathname === "/api/providers" && req.method === "POST") {
        const body = await readJson(req);
        const provider = isRecord(body) ? readProviderName(body.provider) : undefined;
        if (!isRecord(body) || !provider) {
          sendJson(res, 400, { error: "Provider payload must include provider." });
          return;
        }

        if (provider === "openrouter" && typeof body.openRouterApiKey === "string" && body.openRouterApiKey.trim()) {
          await saveOpenRouterKey(body.openRouterApiKey);
        }

        const patch: Partial<AppSettings> =
          provider === "ollama"
            ? { provider, ollamaUrl: readString(body.ollamaUrl).trim() || undefined }
            : { provider };
        const nextSettings = updateSettings(await readSettings(), patch);
        await saveSettings(nextSettings);
        sendJson(res, 200, await getPublicSettings());
        return;
      }

      if (url.pathname === "/api/workdirs/pick" && req.method === "POST") {
        const body = await readJson(req);
        const initialPath = resolveFolderPickerInitialPath(
          isRecord(body) ? readString(body.initialPath).trim() || undefined : undefined,
          os.homedir(),
        );
        const selectedPath = pickWindowsDirectory(initialPath);
        sendJson(res, 200, {
          selectedPath,
          supported: process.platform === "win32",
        });
        return;
      }

      if (url.pathname === "/api/chat" && req.method === "POST") {
        const body = await readJson(req);
        if (!isRecord(body)) {
          sendJson(res, 400, { error: "Chat payload must be an object." });
          return;
        }

        const prompt = readString(body.prompt).trim();
        if (!prompt) {
          sendJson(res, 400, { error: "Prompt is required." });
          return;
        }

        const mode = readStudioMode(body.mode);
        if (mode !== "chat" && mode !== "debug") {
          sendJson(res, 400, { error: "Chat endpoint supports chat and debug modes only." });
          return;
        }

        const selectedSettings = readSelectedSettings(await readSettings(), body);
        const history = readHistory(body.history);
        await saveSettings(updateSettings(await readSettings(), settingsPatchForSelectedModel(body)));
        const systemPrompt =
          mode === "debug"
            ? "You are Stacksmith Debug Mode. Help the user diagnose local app errors. Do not claim to run commands or edit files. Ask for missing logs when needed."
            : "You are Stacksmith, a local-first AI app studio for builders. Answer conversationally and keep responses concise.";
        const text = await completeTextWithProvider(selectedSettings, prompt, {
          provider: selectedSettings.provider,
          model: selectedSettings.provider === "openrouter" ? selectedSettings.openRouterModel : selectedSettings.ollamaModel,
          systemPrompt,
          history,
        });
        sendJson(res, 200, { message: text });
        return;
      }

      if (url.pathname === "/api/blueprints" && req.method === "POST") {
        const body = await readJson(req);
        if (!isRecord(body)) {
          sendJson(res, 400, { error: "Blueprint payload must be an object." });
          return;
        }

        const prompt = readString(body.prompt).trim();
        if (!prompt) {
          sendJson(res, 400, { error: "Prompt is required." });
          return;
        }

        const currentSettings = await readSettings();
        const settings = readSelectedSettings(currentSettings, body);
        const history = readHistory(body.history);
        await saveSettings(
          updateSettings(currentSettings, {
            ...settingsPatchForSelectedModel(body),
            databaseMode: readDatabaseMode(body.databaseMode),
          }),
        );
        const blueprint = await generateBlueprintWithProvider({
          prompt,
          settings,
          databaseMode: settings.databaseMode,
          provider: settings.provider,
          model: settings.provider === "openrouter" ? settings.openRouterModel : settings.ollamaModel,
          history,
        });
        sendJson(res, 200, { blueprint });
        return;
      }

      if (url.pathname === "/api/projects/generate" && req.method === "POST") {
        const body = await readJson(req);
        if (!isRecord(body)) {
          sendJson(res, 400, { error: "Project generation payload must be an object." });
          return;
        }

        const blueprint = normalizeBlueprint(body.blueprint) as Blueprint;
        const currentSettings = await readSettings();
        const settings = readSelectedSettings(currentSettings, body);
        const workspacePath = readOptionalPath(body.workDirectory) ?? settings.workspacePath;
        const plan = await createAvailableProjectPlan({
          workspacePath,
          projectName: blueprint.projectName,
        });
        const generatedPlan = await generateProjectFilesWithProvider({
          blueprint,
          settings,
          provider: settings.provider,
          model: settings.provider === "openrouter" ? settings.openRouterModel : settings.ollamaModel,
        });
        const validatedPlan = validateGeneratedProjectPlan(plan.projectPath, generatedPlan);
        await ensureWorkspace(workspacePath);
        await writeProjectFiles(plan.projectPath, validatedPlan.files);
        const runCommands = validatedPlan.runCommands.length
          ? validatedPlan.runCommands.map((command) => ({
              command: command.command,
              cwd: command.cwd === "." ? plan.projectPath : path.resolve(plan.projectPath, command.cwd),
            }))
          : [
              { command: "npm install", cwd: plan.projectPath },
              { command: "npm run dev", cwd: plan.projectPath },
            ];
        sendJson(res, 200, {
          projectPath: plan.projectPath,
          files: validatedPlan.files.map((file) => file.path),
          runCommands,
        });
        return;
      }

      if (url.pathname === "/api/projects/status" && req.method === "GET") {
        const settings = await readSettings();
        const projectPath = readString(url.searchParams.get("path"));
        const selectedWorkDirectory = readString(url.searchParams.get("workDirectory")) || undefined;
        try {
          resolveProjectStatusWorkspace(settings.workspacePath, selectedWorkDirectory, projectPath);
        } catch {
          sendJson(res, 400, { error: "Project path must be inside the selected work directory." });
          return;
        }

        try {
          const stat = await fs.stat(projectPath);
          sendJson(res, 200, { exists: stat.isDirectory(), projectPath });
        } catch {
          sendJson(res, 200, { exists: false, projectPath });
        }
        return;
      }

      if (url.pathname === "/api/commands/review" && req.method === "POST") {
        const body = await readJson(req);
        if (!isRecord(body)) {
          sendJson(res, 400, { error: "Command review payload must be an object." });
          return;
        }

        const settings = await readSettings();
        const input: CommandReviewInput = {
          command: readString(body.command),
          cwd: readString(body.cwd, settings.workspacePath),
          workspacePath: settings.workspacePath,
          purpose: readString(body.purpose, "Review a generated project command"),
          expectedEffect: typeof body.expectedEffect === "string" ? body.expectedEffect : undefined,
        };
        let review = reviewCommand(input);

        if (settings.commandMode === "never") {
          review = {
            decision: "needs_user_approval",
            reason: "Command execution is disabled. Stacksmith will show commands instead of running them.",
          };
        } else if (settings.commandMode === "manual" && review.decision === "approved") {
          review = {
            decision: "needs_user_approval",
            reason: "Manual approval mode requires the user to approve every command.",
          };
        } else if (settings.commandMode === "auto-safe" && review.decision !== "rejected") {
          try {
            const checkerText = await completeTextWithProvider(settings, createCommandReviewPrompt(input), { json: true });
            review = parseCheckerReview(checkerText);
          } catch {
            review = {
              decision: "needs_user_approval",
              reason: "The command checker AI was unavailable, so the command was not auto-approved.",
            };
          }
        }

        await appendCommandReview(settings, input, review);
        sendJson(res, 200, { review });
        return;
      }

      send(res, 404, "text/plain; charset=utf-8", "Not found");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendJson(res, error instanceof HttpInputError ? error.statusCode : 500, { error: message });
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(PORT, HOST, () => {
      server.off("error", reject);
      resolve();
    });
  }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      throw new Error(`Port ${PORT} is already in use. Stop the other process or free the port, then run again.`);
    }

    throw error;
  });

  console.log("Stacksmith local studio");
  console.log(`Studio: http://${HOST}:${PORT}`);
  console.log(`Health: http://${HOST}:${PORT}/health`);
  console.log("Local-only MVP server. No hosting or public access is enabled.");
}

function isMutatingMethod(method: string | undefined): boolean {
  return method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";
}
