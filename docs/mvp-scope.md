# MVP Scope

The MVP should prove the smallest serious version of Stacksmith:

Prompt -> Blueprint -> Approve -> Generate -> Run locally -> Edit with chat.

The MVP should be focused, but not so narrow that it only produces landing pages. The first version should demonstrate that Stacksmith can plan and generate a real local project with a data-aware path.

## MVP Target

The first real version should be a local browser studio.

The user should eventually run:

```bash
stacksmith studio
```

Then Stacksmith should open:

```text
http://localhost:PORT
```

Inside the studio, the user should be able to:

- Create a new project.
- Enter an app idea.
- Choose or connect an AI provider.
- Choose a database mode.
- Generate a blueprint.
- Approve the blueprint.
- Generate a local project.
- Run or preview the app locally.
- Chat to edit or refine the project.

## MVP Features

MVP target features:

- Local CLI command to start the browser studio.
- Local studio server.
- Browser-based studio UI.
- New project flow.
- AI provider connection.
- Prompt input.
- Blueprint generation.
- Blueprint review and approval.
- Project generation from a template.
- Local workspace output.
- Local preview or run command guidance.
- Basic chat edits after generation.
- No-database mode for static sites and simple apps.
- SQLite mode for local full-stack apps.

## Provider Scope

Likely MVP provider targets:

- OpenRouter.
- Ollama/local models.

Planned provider expansion:

- OpenAI.
- Anthropic.
- Google.
- xAI.
- Other OpenAI-compatible providers.

The provider system should be adapter-based so Stacksmith does not become locked to one AI company.

## Database Scope

MVP-friendly database modes:

- No database, for landing pages, portfolios, simple websites, and static tools.
- SQLite, for local full-stack apps and offline-friendly projects.

Planned or optional early path:

- Supabase, for auth, cloud database, storage, and deployable app workflows.

Future database options:

- PostgreSQL.
- MySQL.
- Neon.
- Firebase.
- MCP-connected services and custom integrations.

Stacksmith should show the planned database schema in the blueprint before generating database-aware projects.

## First Generated Stack Direction

The first generated stack should be one excellent path, not many partial paths.

A likely first stack is:

- React.
- Vite.
- TypeScript.
- Tailwind CSS.
- Simple API layer.
- SQLite.
- Prisma or Drizzle.

This is a direction, not an implemented stack.

## Not In MVP

The MVP should not include:

- Mobile app generation.
- Marketplace.
- Plugin ecosystem.
- Multi-user cloud accounts.
- Team collaboration.
- Production hosting.
- Many frameworks.
- Full MCP ecosystem.
- Advanced deployment.
- Visual drag-and-drop builder.
- Existing-project editing as a primary flow.
- Full autonomous debugging.

Existing-project support is important later, but new project generation should come first.

## MVP Quality Bar

The MVP should feel like the beginning of a real product. It should be narrow, honest, and reliable.

The correct first milestone is not maximum feature coverage. It is a local studio flow that proves blueprint-first generation can produce a clean project the user owns.
