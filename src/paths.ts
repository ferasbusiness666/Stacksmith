import os from "node:os";
import path from "node:path";

export function getAppDataDirectory(): string {
  const base =
    process.platform === "win32"
      ? process.env.APPDATA ?? path.join(os.homedir(), "AppData", "Roaming")
      : process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), ".config");

  return path.join(base, "Stacksmith");
}

export function getDefaultWorkspacePath(): string {
  return path.join(os.homedir(), "Stacksmith", "projects");
}
