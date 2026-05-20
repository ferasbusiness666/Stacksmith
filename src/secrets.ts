import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

import { getAppDataDirectory } from "./paths.js";

const serviceDirectory = path.join(getAppDataDirectory(), "secrets");
const openRouterKeyPath = path.join(serviceDirectory, "openrouter.key.dpapi");

export async function saveOpenRouterKey(apiKey: string): Promise<void> {
  const trimmed = apiKey.trim();
  if (!trimmed) {
    throw new Error("OpenRouter API key cannot be empty.");
  }

  const encrypted = encryptSecretForStorage(trimmed);
  await fs.mkdir(serviceDirectory, { recursive: true });
  await fs.writeFile(openRouterKeyPath, encrypted, "utf8");
}

export async function readOpenRouterKey(): Promise<string | null> {
  try {
    const encrypted = await fs.readFile(openRouterKeyPath, "utf8");
    return decryptSecretFromStorage(encrypted.trim());
  } catch {
    return null;
  }
}

export async function hasOpenRouterKey(): Promise<boolean> {
  return (await readOpenRouterKey()) !== null;
}

export async function deleteOpenRouterKey(): Promise<void> {
  await fs.rm(openRouterKeyPath, { force: true });
}

export function encryptSecretForStorage(secret: string): string {
  ensureWindowsDpapi();
  const script = `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Security
$inputValue = [Console]::In.ReadToEnd()
$bytes = [Text.Encoding]::UTF8.GetBytes($inputValue)
$protected = [Security.Cryptography.ProtectedData]::Protect($bytes, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser)
[Convert]::ToBase64String($protected)
`;
  return runPowerShell(script, secret);
}

export function decryptSecretFromStorage(secret: string): string {
  ensureWindowsDpapi();
  const script = `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Security
$inputValue = [Console]::In.ReadToEnd()
$bytes = [Convert]::FromBase64String($inputValue)
$plain = [Security.Cryptography.ProtectedData]::Unprotect($bytes, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser)
[Text.Encoding]::UTF8.GetString($plain)
`;
  return runPowerShell(script, secret);
}

function ensureWindowsDpapi(): void {
  if (process.platform !== "win32") {
    throw new Error("Secure OpenRouter key storage is currently implemented with Windows DPAPI only.");
  }
}

function runPowerShell(script: string, input: string): string {
  const result = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], {
    input,
    encoding: "utf8",
    windowsHide: true,
  });

  if (result.status !== 0) {
    throw new Error(
      "Secure credential storage failed. Windows DPAPI is unavailable in this session. Run Stacksmith from your normal Windows user session and try again.",
    );
  }

  return result.stdout.trim();
}
