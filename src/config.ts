import fs from "node:fs/promises";
import path from "node:path";

import { getAppDataDirectory, getDefaultWorkspacePath } from "./paths.js";
import { hasOpenRouterKey } from "./secrets.js";
import type { AppSettings, PublicSettings } from "./types.js";

export const defaultSettings: AppSettings = {
  provider: "ollama",
  ollamaUrl: "http://127.0.0.1:11434",
  ollamaModel: "llama3.1",
  openRouterModel: "openai/gpt-4o-mini",
  databaseMode: "none",
  workspacePath: getDefaultWorkspacePath(),
  commandMode: "never",
  theme: "dark",
  accent: "blue",
  openRouterKeySaved: false,
};

export type SettingsDeps = {
  readSettings: () => Promise<Partial<AppSettings>>;
  hasOpenRouterKey: () => Promise<boolean>;
};

export function getSettingsPath(): string {
  return path.join(getAppDataDirectory(), "settings.json");
}

export async function readSettings(): Promise<AppSettings> {
  try {
    const raw = await fs.readFile(getSettingsPath(), "utf8");
    return updateSettings(defaultSettings, JSON.parse(raw) as Partial<AppSettings>);
  } catch {
    return { ...defaultSettings };
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await fs.mkdir(path.dirname(getSettingsPath()), { recursive: true });
  const safeSettings = { ...settings, openRouterKeySaved: undefined };
  await fs.writeFile(getSettingsPath(), `${JSON.stringify(safeSettings, null, 2)}\n`, "utf8");
}

export async function getPublicSettings(deps?: SettingsDeps): Promise<PublicSettings> {
  const settings = updateSettings(defaultSettings, await (deps?.readSettings ?? readSettings)());
  const keySaved = await (deps?.hasOpenRouterKey ?? hasOpenRouterKey)();
  return {
    ...settings,
    openRouterKeySaved: keySaved,
  };
}

export function updateSettings(current: Partial<AppSettings>, patch: Partial<AppSettings>): AppSettings {
  const merged = { ...defaultSettings, ...current };

  return {
    ...merged,
    provider: patch.provider === "openrouter" || patch.provider === "ollama" ? patch.provider : merged.provider,
    ollamaUrl: readUrlLike(patch.ollamaUrl, merged.ollamaUrl),
    ollamaModel: readText(patch.ollamaModel, merged.ollamaModel),
    openRouterModel: readText(patch.openRouterModel, merged.openRouterModel),
    databaseMode: patch.databaseMode === "sqlite" ? "sqlite" : patch.databaseMode === "none" ? "none" : merged.databaseMode,
    workspacePath: readText(patch.workspacePath, merged.workspacePath),
    commandMode:
      patch.commandMode === "manual" || patch.commandMode === "auto-safe" || patch.commandMode === "never"
        ? patch.commandMode
        : merged.commandMode,
    theme: patch.theme === "light" ? "light" : patch.theme === "dark" ? "dark" : merged.theme,
    accent: patch.accent === "green" || patch.accent === "slate" || patch.accent === "blue" ? patch.accent : merged.accent,
    openRouterKeySaved: merged.openRouterKeySaved,
  };
}

function readText(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function readUrlLike(value: unknown, fallback: string): string {
  const text = readText(value, fallback);
  return text.replace(/\/+$/g, "");
}
