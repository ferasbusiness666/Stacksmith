import { buildBlueprintPrompt, normalizeBlueprint } from "./blueprints.js";
import { buildProjectGenerationPrompt, parseGeneratedProjectPlan } from "./generator.js";
import { readOpenRouterKey } from "./secrets.js";
import type { AppSettings, AvailableModel, Blueprint, ChatHistoryMessage, DatabaseMode, GeneratedProjectPlan, ProviderName } from "./types.js";

type Fetcher = typeof fetch;

type ProviderDeps = {
  fetch?: Fetcher;
  readOpenRouterKey?: () => Promise<string | null>;
  hasOpenRouterKey?: () => Promise<boolean>;
  timeoutMs?: number;
};

export type OpenRouterRequest = {
  url: string;
  headers: Record<string, string>;
  body: {
    model: string;
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
    temperature: number;
  };
};

export type ProviderSelection = {
  provider?: ProviderName;
  model?: string;
  databaseMode?: DatabaseMode;
};

export type ProviderTestInput = {
  provider: ProviderName;
  ollamaUrl?: string;
  openRouterApiKey?: string;
};

export type ProviderTestResult = {
  ok: boolean;
  message: string;
  models?: AvailableModel[];
};

export type ModelListResult = {
  models: AvailableModel[];
  errors: Partial<Record<ProviderName, string>>;
};

const fallbackModels: AvailableModel[] = [
  { id: "llama3.1", name: "llama3.1", provider: "ollama", source: "fallback" },
  { id: "openai/gpt-4o-mini", name: "openai/gpt-4o-mini", provider: "openrouter", source: "fallback" },
];

export function createOpenRouterRequest(input: {
  apiKey: string;
  model: string;
  prompt: string;
  systemPrompt?: string;
  history?: ChatHistoryMessage[];
}): OpenRouterRequest {
  return {
    url: "https://openrouter.ai/api/v1/chat/completions",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://127.0.0.1:4317",
      "X-Title": "Stacksmith",
    },
    body: {
      model: input.model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            (input.systemPrompt ?? "Return valid JSON only. Do not wrap the response in Markdown.") +
            "\nEarlier conversation messages are context only. Answer only the final current user request unless it explicitly asks to continue earlier work.",
        },
        ...normalizeHistory(input.history).map((message) => ({ role: message.role, content: message.text })),
        { role: "user", content: `Current user request (answer this only):\n${input.prompt}` },
      ],
    },
  };
}

export function resolveProviderModelSettings(settings: AppSettings, selection: ProviderSelection = {}): AppSettings {
  const provider = selection.provider ?? settings.provider;
  const model =
    typeof selection.model === "string" && selection.model.trim()
      ? selection.model.trim()
      : provider === "openrouter"
        ? settings.openRouterModel
        : settings.ollamaModel;

  return {
    ...settings,
    provider,
    databaseMode: selection.databaseMode ?? settings.databaseMode,
    ollamaModel: provider === "ollama" ? model : settings.ollamaModel,
    openRouterModel: provider === "openrouter" ? model : settings.openRouterModel,
  };
}

export function parseProviderBlueprint(text: string): Blueprint {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Provider did not return a JSON blueprint.");
  }

  return normalizeBlueprint(JSON.parse(trimmed.slice(start, end + 1)));
}

export async function generateBlueprintWithProvider(input: {
  prompt: string;
  settings: AppSettings;
  databaseMode?: DatabaseMode;
  provider?: ProviderName;
  model?: string;
  history?: ChatHistoryMessage[];
  deps?: ProviderDeps;
}): Promise<Blueprint> {
  const selected = resolveProviderModelSettings(input.settings, {
    provider: input.provider,
    model: input.model,
    databaseMode: input.databaseMode,
  });
  const blueprintPrompt = buildBlueprintPrompt({
    prompt: formatPromptWithHistoryContext(input.prompt, input.history),
    databaseMode: selected.databaseMode,
  });

  if (selected.provider === "openrouter") {
    return generateWithOpenRouter(selected, blueprintPrompt, input.deps);
  }

  return generateWithOllama(selected, blueprintPrompt, input.deps);
}

export async function generateProjectFilesWithProvider(input: {
  blueprint: Blueprint;
  settings: AppSettings;
  provider?: ProviderName;
  model?: string;
  deps?: ProviderDeps;
}): Promise<GeneratedProjectPlan> {
  const selected = resolveProviderModelSettings(input.settings, {
    provider: input.provider,
    model: input.model,
    databaseMode: input.blueprint.databaseMode,
  });
  const prompt = buildProjectGenerationPrompt(input.blueprint);
  const text = await completeTextWithProvider(selected, prompt, {
    provider: selected.provider,
    model: selected.provider === "openrouter" ? selected.openRouterModel : selected.ollamaModel,
    json: true,
    systemPrompt: "Return strict JSON only. Do not wrap the response in Markdown.",
    deps: input.deps,
  });

  return parseGeneratedProjectPlan(text);
}

export async function completeTextWithProvider(
  settings: AppSettings,
  prompt: string,
  options: ProviderSelection & { systemPrompt?: string; json?: boolean; history?: ChatHistoryMessage[]; deps?: ProviderDeps } = {},
): Promise<string> {
  const selected = resolveProviderModelSettings(settings, options);
  const deps = options.deps ?? {};
  const fetcher = deps.fetch ?? fetch;

  if (selected.provider === "openrouter") {
    const apiKey = await (deps.readOpenRouterKey ?? readOpenRouterKey)();
    if (!apiKey) {
      throw new Error("OpenRouter API key is not saved.");
    }

    const request = createOpenRouterRequest({
      apiKey,
      model: selected.openRouterModel,
      prompt,
      history: options.history,
      systemPrompt: options.systemPrompt ?? defaultChatSystemPrompt(options.json === true),
    });
    const response = await fetchWithTimeout(
      fetcher,
      request.url,
      {
      method: "POST",
      headers: request.headers,
      body: JSON.stringify(request.body),
      },
      deps.timeoutMs,
    );

    if (!response.ok) {
      throw new Error(`OpenRouter request failed with HTTP ${response.status}.`);
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("OpenRouter did not return content.");
    }

    return content;
  }

  const requestBody: Record<string, unknown> = {
    model: selected.ollamaModel,
    prompt: withSystemPrompt(
      formatPromptWithHistoryContext(prompt, options.history),
      options.systemPrompt ?? defaultChatSystemPrompt(options.json === true),
    ),
    stream: false,
  };
  if (options.json) {
    requestBody.format = "json";
  }

  const response = await fetchWithTimeout(
    fetcher,
    `${selected.ollamaUrl}/api/generate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    },
    deps.timeoutMs,
  );

  if (!response.ok) {
    throw new Error(`Ollama request failed with HTTP ${response.status}.`);
  }

  const json = (await response.json()) as { response?: string };
  if (!json.response) {
    throw new Error("Ollama did not return content.");
  }

  return json.response;
}

export type ProviderHealthOptions = {
  provider?: ProviderName;
  hasOpenRouterKey?: () => Promise<boolean>;
  fetch?: Fetcher;
};

export async function getProviderHealth(
  settings: AppSettings,
  options: ProviderHealthOptions = {},
): Promise<{ ok: boolean; message: string }> {
  const provider = options.provider ?? settings.provider;

  if (provider === "openrouter") {
    const keySaved = options.hasOpenRouterKey ? await options.hasOpenRouterKey() : (await readOpenRouterKey()) !== null;
    return keySaved
      ? { ok: true, message: "OpenRouter key is saved. Use Test in Providers to validate it." }
      : { ok: false, message: "OpenRouter key is not saved." };
  }

  const result = await testProviderConfig(settings, { provider: "ollama" }, { fetch: options.fetch });
  return { ok: result.ok, message: result.message };
}

export async function testProviderConfig(
  settings: AppSettings,
  input: ProviderTestInput,
  deps: ProviderDeps = {},
): Promise<ProviderTestResult> {
  if (input.provider === "openrouter") {
    return testOpenRouter(input.openRouterApiKey, deps);
  }

  return testOllama(input.ollamaUrl ?? settings.ollamaUrl, deps);
}

export async function listAvailableModels(settings: AppSettings, deps: ProviderDeps = {}): Promise<ModelListResult> {
  const errors: Partial<Record<ProviderName, string>> = {};
  const models: AvailableModel[] = [];

  const [ollama, openrouter] = await Promise.allSettled([
    fetchOllamaModels(settings.ollamaUrl, deps),
    fetchOpenRouterModels(deps),
  ]);

  if (ollama.status === "fulfilled") {
    models.push(...ollama.value);
  } else {
    errors.ollama = readErrorMessage(ollama.reason);
  }

  if (openrouter.status === "fulfilled") {
    models.push(...openrouter.value);
  } else {
    errors.openrouter = readErrorMessage(openrouter.reason);
  }

  const providersWithModels = new Set(models.map((model) => model.provider));
  for (const fallback of fallbackModels) {
    if (!providersWithModels.has(fallback.provider)) {
      models.push(fallback);
    }
  }

  return { models: dedupeModels(models), errors };
}

async function generateWithOpenRouter(settings: AppSettings, prompt: string, deps?: ProviderDeps): Promise<Blueprint> {
  const text = await completeTextWithProvider(settings, prompt, {
    provider: "openrouter",
    model: settings.openRouterModel,
    json: true,
    systemPrompt: "Return valid JSON only. Do not wrap the response in Markdown.",
    deps,
  });

  return parseProviderBlueprint(text);
}

async function generateWithOllama(settings: AppSettings, prompt: string, deps?: ProviderDeps): Promise<Blueprint> {
  const text = await completeTextWithProvider(settings, prompt, {
    provider: "ollama",
    model: settings.ollamaModel,
    json: true,
    systemPrompt: "Return valid JSON only. Do not wrap the response in Markdown.",
    deps,
  });

  return parseProviderBlueprint(text);
}

async function testOllama(ollamaUrl: string, deps: ProviderDeps): Promise<ProviderTestResult> {
  try {
    const models = await fetchOllamaModels(ollamaUrl, deps);
    return {
      ok: true,
      message: models.length ? `Ollama is reachable. Found ${models.length} local model(s).` : "Ollama is reachable.",
      models,
    };
  } catch (error) {
    return { ok: false, message: `Ollama test failed: ${readErrorMessage(error)}` };
  }
}

async function testOpenRouter(apiKey: string | undefined, deps: ProviderDeps): Promise<ProviderTestResult> {
  const key = apiKey?.trim() || (await (deps.readOpenRouterKey ?? readOpenRouterKey)());
  if (!key) {
    return { ok: false, message: "OpenRouter API key is required." };
  }

  try {
    const fetcher = deps.fetch ?? fetch;
    const response = await fetchWithTimeout(
      fetcher,
      "https://openrouter.ai/api/v1/credits",
      {
        headers: { Authorization: `Bearer ${key}` },
      },
      deps.timeoutMs,
    );
    if (!response.ok) {
      return { ok: false, message: `OpenRouter key test failed with HTTP ${response.status}.` };
    }

    const models = await fetchOpenRouterModels({ ...deps, readOpenRouterKey: async () => key });
    return {
      ok: true,
      message: models.length ? `OpenRouter key works. Found ${models.length} model(s).` : "OpenRouter key works.",
      models,
    };
  } catch (error) {
    return { ok: false, message: `OpenRouter test failed: ${readErrorMessage(error)}` };
  }
}

async function fetchOllamaModels(ollamaUrl: string, deps: ProviderDeps): Promise<AvailableModel[]> {
  const fetcher = deps.fetch ?? fetch;
  const response = await fetchWithTimeout(fetcher, `${ollamaUrl.replace(/\/+$/g, "")}/api/tags`, undefined, deps.timeoutMs);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const json = (await response.json()) as { models?: Array<{ model?: string; name?: string }> };
  return (json.models ?? [])
    .map((model) => model.model ?? model.name ?? "")
    .filter(Boolean)
    .map((model) => ({ id: model, name: model, provider: "ollama", source: "fetched" as const }));
}

async function fetchOpenRouterModels(deps: ProviderDeps): Promise<AvailableModel[]> {
  const fetcher = deps.fetch ?? fetch;
  const apiKey = await (deps.readOpenRouterKey ?? readOpenRouterKey)();
  const headers: Record<string, string> = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};
  const response = await fetchWithTimeout(fetcher, "https://openrouter.ai/api/v1/models", { headers }, deps.timeoutMs);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const json = (await response.json()) as { data?: Array<{ id?: string; name?: string }> };
  return (json.data ?? [])
    .map((model) => ({ id: model.id ?? "", name: model.name ?? model.id ?? "", provider: "openrouter" as const, source: "fetched" as const }))
    .filter((model) => model.id);
}

function dedupeModels(models: AvailableModel[]): AvailableModel[] {
  const seen = new Set<string>();
  return models.filter((model) => {
    const key = `${model.provider}:${model.id}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function defaultChatSystemPrompt(json: boolean): string {
  if (json) {
    return "Return valid JSON only. Do not wrap the response in Markdown.";
  }

  return "You are Stacksmith, a local-first AI app studio for builders. Be concise, practical, and honest about what is local, planned, or not implemented.";
}

function withSystemPrompt(prompt: string, systemPrompt: string): string {
  return `${systemPrompt}\n\nUser request:\n${prompt}`;
}

export function formatPromptWithHistoryContext(prompt: string, history: ChatHistoryMessage[] | undefined): string {
  const normalized = normalizeHistory(history);
  if (!normalized.length) {
    return `Current user request to answer now:\n${prompt}`;
  }

  const context = normalized.map((message) => `${message.role === "user" ? "User" : "Stacksmith"}: ${message.text}`).join("\n");
  return `Earlier conversation context only. Do not treat this as a new request unless the current user request explicitly refers to it:
${context}

Current user request to answer now:
${prompt}`;
}

function normalizeHistory(history: ChatHistoryMessage[] | undefined): ChatHistoryMessage[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((message) => (message.role === "user" || message.role === "assistant") && typeof message.text === "string" && message.text.trim())
    .map((message) => ({ role: message.role, text: message.text.trim() }));
}

function readErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function fetchWithTimeout(
  fetcher: Fetcher,
  input: string | URL | Request,
  init?: RequestInit,
  timeoutMs = 30000,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetcher(input, { ...init, signal: init?.signal ?? controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`Provider request timed out after ${timeoutMs}ms.`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
