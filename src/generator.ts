import fs from "node:fs/promises";
import path from "node:path";

import { isInsideDirectory } from "./workspace.js";
import type { Blueprint, ProjectFile } from "./types.js";

export function createProjectFiles(blueprint: Blueprint): ProjectFile[] {
  const packageJson = {
    name: slugPackageName(blueprint.projectName),
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: {
      dev: "tsx scripts/dev.ts",
      "dev:web": "vite",
      "dev:api": "tsx server/index.ts",
      build: "tsc && vite build",
      preview: "vite preview",
    },
    dependencies: {
      "@vitejs/plugin-react": "^4.4.1",
      vite: "^6.3.5",
      typescript: "^5.8.3",
      tsx: "^4.19.4",
      react: "^19.1.0",
      "react-dom": "^19.1.0",
      express: "^5.1.0",
      cors: "^2.8.5",
    },
    devDependencies: {
      "@types/cors": "^2.8.17",
      "@types/express": "^5.0.1",
      "@types/node": "^22.15.19",
      "@types/react": "^19.1.4",
      "@types/react-dom": "^19.1.5",
    },
  };

  const files: ProjectFile[] = [
    { path: "package.json", contents: `${JSON.stringify(packageJson, null, 2)}\n` },
    { path: ".env.example", contents: "VITE_API_URL=http://127.0.0.1:5174\n" },
    { path: "index.html", contents: indexHtml() },
    { path: "tsconfig.json", contents: tsconfig() },
    { path: "vite.config.ts", contents: viteConfig() },
    { path: "README.md", contents: readme(blueprint) },
    { path: "src/main.tsx", contents: mainTsx() },
    { path: "src/App.tsx", contents: appTsx(blueprint) },
    { path: "src/styles.css", contents: stylesCss() },
    { path: "server/index.ts", contents: serverTs(blueprint) },
    { path: "shared/types.ts", contents: sharedTypes(blueprint) },
    { path: "scripts/dev.ts", contents: devScript() },
  ];

  if (blueprint.databaseMode === "sqlite") {
    files.push({ path: "data/schema.sql", contents: sqliteSchema(blueprint) });
  }

  return files;
}

export async function writeProjectFiles(projectPath: string, files: ProjectFile[]): Promise<void> {
  await fs.mkdir(projectPath, { recursive: true });

  for (const file of files) {
    const target = path.resolve(projectPath, file.path);
    if (!isInsideDirectory(projectPath, target)) {
      throw new Error(`Refusing to write outside generated project: ${file.path}`);
    }

    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, file.contents, "utf8");
  }
}

function slugPackageName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "stacksmith-app";
}

function indexHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Stacksmith App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

function tsconfig(): string {
  return `{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "server", "shared", "scripts"]
}
`;
}

function viteConfig(): string {
  return `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/api": "http://127.0.0.1:5174"
    }
  }
});
`;
}

function readme(blueprint: Blueprint): string {
  return `# ${blueprint.projectName}

Generated locally by Stacksmith.

${blueprint.summary}

## Stack

${blueprint.generatedStack.map((item) => `- ${item}`).join("\n")}

## Run Locally

\`\`\`bash
npm install
npm run dev
\`\`\`

The web app runs on http://127.0.0.1:5173 and the API runs on http://127.0.0.1:5174.

## Database

Mode: ${blueprint.databaseMode}

${blueprint.databaseMode === "sqlite" ? "A starter SQLite schema is included at data/schema.sql. Runtime SQLite wiring is intentionally left for the next implementation pass." : "No database is wired in this generated project."}

## Not Generated Yet

${blueprint.notGeneratedYet.map((item) => `- ${item}`).join("\n")}
`;
}

function mainTsx(): string {
  return `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;
}

function appTsx(blueprint: Blueprint): string {
  const blueprintJson = JSON.stringify(blueprint, null, 2);
  return `import type { GeneratedBlueprint } from "../shared/types";

const blueprint: GeneratedBlueprint = ${blueprintJson};

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Generated by Stacksmith</p>
        <h1>{blueprint.projectName}</h1>
        <p>{blueprint.summary}</p>
      </section>

      <section className="grid">
        <Panel title="Screens" items={blueprint.screens} />
        <Panel title="Components" items={blueprint.components} />
        <Panel title="Data" items={blueprint.dataModels} />
        <Panel title="API" items={blueprint.apiRoutes} />
      </section>
    </main>
  );
}

function Panel(props: { title: string; items: string[] }) {
  return (
    <article className="panel">
      <h2>{props.title}</h2>
      <ul>
        {props.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
`;
}

function stylesCss(): string {
  return `:root {
  color: #17202a;
  background: #f5f7fa;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  margin: 0;
}

.app-shell {
  margin: 0 auto;
  max-width: 1080px;
  padding: 48px 22px;
}

.hero {
  border-bottom: 1px solid #d8dee6;
  padding-bottom: 28px;
}

.eyebrow {
  color: #287a61;
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 10px;
}

h1 {
  font-size: clamp(34px, 6vw, 64px);
  line-height: 1;
  margin: 0;
}

.hero p:last-child {
  color: #526070;
  font-size: 18px;
  max-width: 720px;
}

.grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  margin-top: 28px;
}

.panel {
  background: #ffffff;
  border: 1px solid #d8dee6;
  border-radius: 8px;
  padding: 18px;
}

.panel h2 {
  font-size: 15px;
  margin: 0 0 12px;
}

.panel ul {
  color: #526070;
  margin: 0;
  padding-left: 18px;
}
`;
}

function serverTs(blueprint: Blueprint): string {
  return `import express from "express";
import cors from "cors";

const app = express();
const port = 5174;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, project: ${JSON.stringify(blueprint.projectName)} });
});

app.get("/api/blueprint", (_req, res) => {
  res.json(${JSON.stringify(blueprint, null, 2)});
});

app.listen(port, "127.0.0.1", () => {
  console.log(\`API running at http://127.0.0.1:\${port}\`);
});
`;
}

function sharedTypes(blueprint: Blueprint): string {
  const keys = Object.keys(blueprint).map((key) => `  ${key}: ${Array.isArray(blueprint[key as keyof Blueprint]) ? "string[]" : "string"};`);
  return `export type GeneratedBlueprint = {
${keys.join("\n")}
};
`;
}

function devScript(): string {
  return `import { spawn } from "node:child_process";

const web = spawn("npm", ["run", "dev:web"], { stdio: "inherit", shell: true });
const api = spawn("npm", ["run", "dev:api"], { stdio: "inherit", shell: true });

function stop() {
  web.kill();
  api.kill();
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
`;
}

function sqliteSchema(blueprint: Blueprint): string {
  return `-- Starter SQLite schema for ${blueprint.projectName}
-- Review and edit before using with a real app.

create table if not exists items (
  id text primary key,
  title text not null,
  status text not null default 'new',
  created_at text not null default current_timestamp
);
`;
}
