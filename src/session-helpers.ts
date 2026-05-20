export type TokenMessage = {
  text?: string;
};

export type ChatUsageEstimate = {
  contextLimit: number;
  percentUsed: number;
  tokensUsed: number;
};

export function estimateTokens(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) {
    return 0;
  }

  return Math.max(1, Math.ceil(trimmed.length / 4));
}

export function estimateChatUsage(messages: TokenMessage[], contextLimit = 128000): ChatUsageEstimate {
  const tokensUsed = messages.reduce((total, message) => total + estimateTokens(message.text ?? ""), 0);
  return {
    contextLimit,
    percentUsed: Math.min(100, Math.round((tokensUsed / contextLimit) * 100)),
    tokensUsed,
  };
}

export function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) {
    return [...items];
  }

  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

export function removeSessionById<T extends { id: string }>(
  sessions: T[],
  activeSessionId: string | null,
  removedSessionId: string,
): { sessions: T[]; activeSessionId: string | null } {
  const nextSessions = sessions.filter((session) => session.id !== removedSessionId);
  const nextActiveSessionId =
    activeSessionId === removedSessionId ? (nextSessions[0] ? nextSessions[0].id : null) : activeSessionId;

  return { sessions: nextSessions, activeSessionId: nextActiveSessionId };
}

export function canEditWorkDirectory(workDirectoryLocked: boolean): boolean {
  return !workDirectoryLocked;
}

export function resolveFolderPickerInitialPath(explicitInitialPath: string | undefined, homeDirectory: string): string {
  return explicitInitialPath && explicitInitialPath.trim() ? explicitInitialPath.trim() : homeDirectory;
}
