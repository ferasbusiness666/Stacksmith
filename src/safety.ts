import path from "node:path";

import type { CommandReview, CommandReviewInput } from "./types.js";
import { isInsideDirectory } from "./workspace.js";

const destructivePatterns = [
  /\brm\s+(-[a-zA-Z]*r[a-zA-Z]*f|-rf|-fr)\b/i,
  /\bRemove-Item\b.*\b-Recurse\b/i,
  /\bdel\s+\/[sq]\b/i,
  /\brmdir\s+\/[sq]\b/i,
  /\bgit\s+reset\s+--hard\b/i,
  /\bgit\s+push\b.*\s--force\b/i,
  /\bcurl\b.*\|\s*(sh|bash|powershell|pwsh)\b/i,
  /\biwr\b.*\|\s*(iex|powershell|pwsh)\b/i,
  /\bInvoke-WebRequest\b.*\|\s*Invoke-Expression\b/i,
  /\bsetx\b/i,
];

const safePatterns = [
  /^npm install$/,
  /^npm run dev$/,
  /^npm run build$/,
  /^npm test$/,
  /^npm run dev:web$/,
  /^npm run dev:api$/,
];

export function reviewCommand(input: CommandReviewInput): CommandReview {
  const command = input.command.trim();
  if (!command) {
    return { decision: "rejected", reason: "Empty commands cannot be reviewed or run." };
  }

  if (!isInsideDirectory(input.workspacePath, input.cwd)) {
    return {
      decision: "rejected",
      reason: "The command working directory is outside the configured Stacksmith workspace.",
      saferAlternative: "Run commands only inside the generated project folder.",
    };
  }

  if (touchesSystemDirectory(command) || destructivePatterns.some((pattern) => pattern.test(command))) {
    return {
      decision: "rejected",
      reason: "The command is destructive, affects system state, or could expose credentials.",
      saferAlternative: "Use a project-local npm script or ask for manual approval with a clear explanation.",
    };
  }

  if (safePatterns.some((pattern) => pattern.test(command))) {
    return { decision: "approved", reason: "The command is a common project-local npm command inside the workspace." };
  }

  return {
    decision: "needs_user_approval",
    reason: "The command is not on the low-risk allowlist and should be reviewed by the user or checker AI.",
  };
}

export function createCommandReviewPrompt(input: CommandReviewInput): string {
  return `You are Stacksmith's separate command safety checker.

Review this command and return JSON with decision approved, rejected, or needs_user_approval.

Command: ${input.command}
Working directory: ${input.cwd}
Workspace: ${input.workspacePath}
Purpose: ${input.purpose}
Expected effect: ${input.expectedEffect ?? "Not provided"}

Reject destructive commands, credential exposure, system directory changes, force pushes, downloaded scripts piped into shells, and commands outside the workspace.`;
}

export function parseCheckerReview(text: string): CommandReview {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return {
      decision: "needs_user_approval",
      reason: "The command checker did not return a structured safety decision.",
    };
  }

  const parsed = JSON.parse(text.slice(start, end + 1)) as Partial<CommandReview>;
  if (parsed.decision === "approved" || parsed.decision === "rejected" || parsed.decision === "needs_user_approval") {
    return {
      decision: parsed.decision,
      reason: typeof parsed.reason === "string" && parsed.reason.trim() ? parsed.reason.trim() : "No reason provided.",
      saferAlternative:
        typeof parsed.saferAlternative === "string" && parsed.saferAlternative.trim()
          ? parsed.saferAlternative.trim()
          : undefined,
    };
  }

  return {
    decision: "needs_user_approval",
    reason: "The command checker returned an invalid safety decision.",
  };
}

export function createCommandReviewLog(input: CommandReviewInput, review: CommandReview): string {
  return `${JSON.stringify({
    timestamp: new Date().toISOString(),
    command: redactSecrets(input.command),
    cwd: path.resolve(input.cwd),
    purpose: input.purpose,
    decision: review.decision,
    reason: review.reason,
  })}\n`;
}

function touchesSystemDirectory(command: string): boolean {
  return /\b(C:\\Windows|C:\\Program Files|\/etc|\/usr|\/bin|\/System|~\/\.ssh)\b/i.test(command);
}

function redactSecrets(value: string): string {
  return value
    .replace(/\bAuthorization:\s*Bearer\s+["']?[^"'\s]+["']?/gi, "Authorization: Bearer [redacted]")
    .replace(/\b(Bearer)\s+sk-[A-Za-z0-9._-]+/g, "$1 [redacted]")
    .replace(/\bsk-[A-Za-z0-9._-]+/g, "[redacted]")
    .replace(/(https?:\/\/)([^:@\s/]+):([^@\s/]+)@/gi, "$1[redacted]@")
    .replace(/(--(?:api-key|token|password|secret)(?:=|\s+))\S+/gi, "$1[redacted]")
    .replace(/((?:api[_-]?key|token|password|secret)=)\S+/gi, "$1[redacted]");
}
