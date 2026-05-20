import fs from "node:fs/promises";
import path from "node:path";

export type ProjectPlan = {
  slug: string;
  projectPath: string;
};

export function slugifyProjectName(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

  return slug || "stacksmith-project";
}

export function isInsideDirectory(parent: string, child: string): boolean {
  const relative = path.relative(path.resolve(parent), path.resolve(child));
  return relative === "" || (!!relative && !relative.startsWith("..") && !path.isAbsolute(relative));
}

export function createProjectPlan(input: { workspacePath: string; projectName: string }): ProjectPlan {
  const slug = slugifyProjectName(input.projectName);
  const projectPath = path.resolve(input.workspacePath, slug);

  if (!isInsideDirectory(input.workspacePath, projectPath)) {
    throw new Error("Generated project path must stay inside the configured workspace.");
  }

  return { slug, projectPath };
}

export function resolveProjectStatusWorkspace(
  globalWorkspacePath: string,
  selectedWorkDirectory: string | undefined,
  projectPath: string,
): string {
  const candidateWorkspace = selectedWorkDirectory?.trim() ? selectedWorkDirectory : globalWorkspacePath;
  if (!isInsideDirectory(candidateWorkspace, projectPath)) {
    throw new Error("Project path must be inside the selected Stacksmith work directory.");
  }

  return candidateWorkspace;
}

export async function createAvailableProjectPlan(input: {
  workspacePath: string;
  projectName: string;
}): Promise<ProjectPlan> {
  const initial = createProjectPlan(input);
  let candidate = initial.projectPath;
  let suffix = 2;

  while (await exists(candidate)) {
    candidate = path.resolve(input.workspacePath, `${initial.slug}-${suffix}`);
    suffix += 1;
  }

  if (!isInsideDirectory(input.workspacePath, candidate)) {
    throw new Error("Generated project path must stay inside the configured workspace.");
  }

  return { slug: path.basename(candidate), projectPath: candidate };
}

export async function ensureWorkspace(workspacePath: string): Promise<void> {
  await fs.mkdir(workspacePath, { recursive: true });
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
