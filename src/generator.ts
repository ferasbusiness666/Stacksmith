import fs from "node:fs/promises";
import path from "node:path";

import { isInsideDirectory } from "./workspace.js";
import type { Blueprint, GeneratedProjectPlan, ProjectFile } from "./types.js";

export function buildProjectGenerationPrompt(blueprint: Blueprint): string {
  return `You are Stacksmith's project file generator.

Return strict JSON only. Do not wrap the response in Markdown.

Create a complete starter project from this blueprint using only this allowed stack:
Allowed stack: React, Vite, TypeScript, small Node/TypeScript API layer, shared types, optional SQLite-ready files.
- React
- Vite
- TypeScript
- a small Node/TypeScript API layer
- shared types
- optional SQLite-ready files when databaseMode is sqlite

Return JSON with this shape:
{
  "files": [
    { "path": "package.json", "contents": "..." },
    { "path": "src/App.tsx", "contents": "..." }
  ],
  "runCommands": [
    { "command": "npm install", "cwd": "." },
    { "command": "npm run dev", "cwd": "." }
  ]
}

Rules:
- Use relative file paths only.
- Do not include absolute paths.
- Do not include ".." path segments.
- Do not write .env files. Use .env.example if needed.
- Do not include secrets.
- Keep generated app code self-contained.
- Include README.md, package.json, index.html, TypeScript config, app source, and API source.

Blueprint:
${JSON.stringify(blueprint, null, 2)}`;
}

export function parseGeneratedProjectPlan(text: string): GeneratedProjectPlan {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Provider did not return a JSON project file plan.");
  }

  const parsed = JSON.parse(trimmed.slice(start, end + 1)) as Partial<GeneratedProjectPlan>;
  const files: ProjectFile[] = Array.isArray(parsed.files)
    ? parsed.files.filter(isRecord).flatMap((file) => {
        const filePath = readText(file.path);
        const contents = readContents(file.contents);
        return filePath && contents !== null ? [{ path: filePath, contents }] : [];
      })
    : [];

  if (!files.length) {
    throw new Error("Provider did not return any project files.");
  }

  const runCommands = Array.isArray(parsed.runCommands)
    ? parsed.runCommands
        .filter(isRecord)
        .map((command) => ({ command: readText(command.command), cwd: readText(command.cwd) || "." }))
        .filter((command) => command.command)
    : [];

  return { files, runCommands };
}

export function validateGeneratedProjectPlan(projectPath: string, plan: GeneratedProjectPlan): GeneratedProjectPlan {
  const files = plan.files.map((file) => {
    validateGeneratedFilePath(projectPath, file.path);
    return { path: file.path.replaceAll("\\", "/"), contents: file.contents };
  });

  return {
    files,
    runCommands: plan.runCommands.map((command) => {
      const cwd = command.cwd.trim() || ".";
      validateGeneratedCommandCwd(projectPath, cwd);
      return { command: command.command.trim(), cwd };
    }),
  };
}

export async function writeProjectFiles(projectPath: string, files: ProjectFile[]): Promise<void> {
  await fs.mkdir(projectPath, { recursive: true });

  for (const file of files) {
    validateGeneratedFilePath(projectPath, file.path);
    const target = path.resolve(projectPath, file.path);
    if (!isInsideDirectory(projectPath, target)) {
      throw new Error(`Refusing to write outside generated project: ${file.path}`);
    }

    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, file.contents, "utf8");
  }
}

function validateGeneratedFilePath(projectPath: string, filePath: string): void {
  const normalized = filePath.replaceAll("\\", "/");
  if (!normalized || path.isAbsolute(filePath) || normalized.startsWith("/") || normalized.split("/").includes("..")) {
    throw new Error(`Unsafe generated file path: ${filePath}`);
  }

  const basename = path.posix.basename(normalized).toLowerCase();
  if (basename === ".env") {
    throw new Error("Generated projects may include .env.example, but not .env files with secrets.");
  }

  const target = path.resolve(projectPath, normalized);
  if (!isInsideDirectory(projectPath, target)) {
    throw new Error(`Generated file path escapes the project directory: ${filePath}`);
  }
}

function validateGeneratedCommandCwd(projectPath: string, cwd: string): void {
  const normalized = cwd.replaceAll("\\", "/");
  if (path.isAbsolute(cwd) || normalized.split("/").includes("..")) {
    throw new Error(`Unsafe generated command working directory: ${cwd}`);
  }

  const target = path.resolve(projectPath, cwd);
  if (!isInsideDirectory(projectPath, target)) {
    throw new Error(`Generated command working directory escapes the project directory: ${cwd}`);
  }
}

function readText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readContents(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
