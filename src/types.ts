export type ProviderName = "ollama" | "openrouter";
export type DatabaseMode = "none" | "sqlite";
export type CommandMode = "never" | "manual" | "auto-safe";
export type StudioMode = "blueprint" | "build" | "debug" | "chat";

export type ChatHistoryMessage = {
  role: "user" | "assistant";
  text: string;
};

export type PersistedMessage = ChatHistoryMessage & {
  error?: boolean;
  memory?: boolean;
};

export type AppSettings = {
  provider: ProviderName;
  ollamaUrl: string;
  ollamaModel: string;
  openRouterModel: string;
  databaseMode: DatabaseMode;
  workspacePath: string;
  commandMode: CommandMode;
  theme: "light" | "dark";
  accent: "blue" | "green" | "slate";
  openRouterKeySaved?: boolean;
};

export type PublicSettings = AppSettings & {
  openRouterKeySaved: boolean;
};

export type AvailableModel = {
  id: string;
  name: string;
  provider: ProviderName;
  source: "fetched" | "fallback" | "custom";
};

export type Blueprint = {
  projectName: string;
  summary: string;
  targetUsers: string[];
  screens: string[];
  components: string[];
  dataModels: string[];
  apiRoutes: string[];
  auth: string;
  databaseMode: DatabaseMode;
  envVars: string[];
  fileStructure: string[];
  integrations: string[];
  risks: string[];
  unclearRequirements: string[];
  buildSteps: string[];
  generatedStack: string[];
  notGeneratedYet: string[];
};

export type ProjectFile = {
  path: string;
  contents: string;
};

export type CommandDecision = "approved" | "rejected" | "needs_user_approval";

export type CommandReviewInput = {
  command: string;
  cwd: string;
  workspacePath: string;
  purpose: string;
  expectedEffect?: string;
};

export type CommandReview = {
  decision: CommandDecision;
  reason: string;
  saferAlternative?: string;
};

export type GeneratedProjectSummary = {
  projectPath: string;
  files: string[];
  runCommands: Array<{ command: string; cwd: string }>;
};

export type PersistedSession = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  workDirectory: string;
  workDirectoryLocked: boolean;
  generatedProjectPath: string;
  databaseMode: DatabaseMode;
  provider: ProviderName;
  model: string;
  mode: StudioMode;
  messages: PersistedMessage[];
  blueprint: Blueprint | null;
  awaitingBlueprintDecision: boolean;
  refiningBlueprint: boolean;
  generatedProject: GeneratedProjectSummary | null;
};

export type PersistedHistoryState = {
  version: 1;
  activeSessionId: string | null;
  sessions: PersistedSession[];
};
