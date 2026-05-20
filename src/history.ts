import fs from "node:fs/promises";
import path from "node:path";

import { normalizeBlueprint } from "./blueprints.js";
import { getAppDataDirectory } from "./paths.js";
import type {
  DatabaseMode,
  GeneratedProjectSummary,
  PersistedHistoryState,
  PersistedMessage,
  PersistedSession,
  ProviderName,
  StudioMode,
} from "./types.js";

export function getHistoryPath(): string {
  return path.join(getAppDataDirectory(), "history.json");
}

export async function loadHistory(options: { filePath?: string } = {}): Promise<PersistedHistoryState> {
  try {
    const raw = await fs.readFile(options.filePath ?? getHistoryPath(), "utf8");
    return sanitizeHistoryState(JSON.parse(raw) as unknown);
  } catch {
    return emptyHistory();
  }
}

export async function saveHistory(
  history: PersistedHistoryState,
  options: { filePath?: string } = {},
): Promise<void> {
  const filePath = options.filePath ?? getHistoryPath();
  const sanitized = sanitizeHistoryState(history);
  const tempPath = `${filePath}.${process.pid}.tmp`;

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(tempPath, `${JSON.stringify(sanitized, null, 2)}\n`, "utf8");
  await fs.rename(tempPath, filePath);
}

export function sanitizeHistoryState(value: unknown): PersistedHistoryState {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.sessions)) {
    return emptyHistory();
  }

  const sessions = value.sessions.map(sanitizeSession).filter((session): session is PersistedSession => session !== null);
  const requestedActiveSessionId = typeof value.activeSessionId === "string" ? value.activeSessionId : null;
  const activeSessionId = sessions.some((session) => session.id === requestedActiveSessionId)
    ? requestedActiveSessionId
    : sessions[0]?.id ?? null;

  return { version: 1, activeSessionId, sessions };
}

function sanitizeSession(value: unknown): PersistedSession | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readText(value.id);
  if (!id) {
    return null;
  }

  const provider = readProvider(value.provider);
  const model = readText(value.model) || (provider === "openrouter" ? "openai/gpt-4o-mini" : "llama3.1");
  const blueprint = value.blueprint ? normalizeBlueprint(value.blueprint) : null;
  const generatedProject = sanitizeGeneratedProject(value.generatedProject);

  return {
    id,
    title: readText(value.title) || "New chat",
    createdAt: readIsoDate(value.createdAt),
    updatedAt: readIsoDate(value.updatedAt),
    workDirectory: readText(value.workDirectory),
    workDirectoryLocked: value.workDirectoryLocked === true,
    generatedProjectPath: readText(value.generatedProjectPath),
    databaseMode: readDatabaseMode(value.databaseMode),
    provider,
    model,
    mode: readMode(value.mode),
    messages: Array.isArray(value.messages)
      ? value.messages.map(sanitizeMessage).filter((message): message is PersistedMessage => message !== null)
      : [],
    blueprint,
    awaitingBlueprintDecision: value.awaitingBlueprintDecision === true && !!blueprint && !generatedProject,
    refiningBlueprint: value.refiningBlueprint === true,
    generatedProject,
  };
}

function sanitizeMessage(value: unknown): PersistedMessage | null {
  if (!isRecord(value) || value.pending === true) {
    return null;
  }

  const role = value.role === "assistant" ? "assistant" : value.role === "user" ? "user" : null;
  const text = readText(value.text);
  if (!role || !text) {
    return null;
  }

  return {
    role,
    text,
    error: value.error === true || undefined,
    memory: value.memory === false ? false : true,
  };
}

function sanitizeGeneratedProject(value: unknown): GeneratedProjectSummary | null {
  if (!isRecord(value)) {
    return null;
  }

  const projectPath = readText(value.projectPath);
  if (!projectPath) {
    return null;
  }

  return {
    projectPath,
    files: readStringArray(value.files),
    runCommands: Array.isArray(value.runCommands)
      ? value.runCommands
          .filter(isRecord)
          .map((command) => ({ command: readText(command.command), cwd: readText(command.cwd) }))
          .filter((command) => command.command && command.cwd)
      : [],
  };
}

function emptyHistory(): PersistedHistoryState {
  return { version: 1, activeSessionId: null, sessions: [] };
}

function readText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean) : [];
}

function readIsoDate(value: unknown): string {
  const text = readText(value);
  return text && !Number.isNaN(Date.parse(text)) ? text : new Date().toISOString();
}

function readDatabaseMode(value: unknown): DatabaseMode {
  return value === "sqlite" ? "sqlite" : "none";
}

function readProvider(value: unknown): ProviderName {
  return value === "openrouter" ? "openrouter" : "ollama";
}

function readMode(value: unknown): StudioMode {
  return value === "build" || value === "debug" || value === "chat" || value === "blueprint" ? value : "blueprint";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
