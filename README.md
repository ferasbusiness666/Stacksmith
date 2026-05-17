# Stacksmith

The local AI app studio for builders.

Build websites, apps, and tools with your own AI, your own database, and code you actually own.

Stacksmith is an installable local AI app studio for people who want the speed of AI-assisted building without giving up ownership of their workflow. The planned product runs on your machine, opens a browser studio on localhost, connects to your chosen AI provider, creates a reviewable blueprint, and then generates a clean local project after approval.

**Status:** Stacksmith is currently in the Phase 2 local chat shell stage. A localhost studio shell exists with normal chat-style local mock responses and session-only appearance controls; real AI blueprint generation, AI provider calls, database integration, cloud hosting, public hosting, and project generation are not implemented yet.

## Why Stacksmith Exists

AI app builders have made it faster to turn ideas into software, but many are built around hosted platforms, fixed model choices, fixed backend choices, and project formats that are hard to move away from.

Stacksmith is designed around a different default: local-first software creation. The goal is to help builders create serious apps while keeping the generated code, database decisions, model configuration, and development workflow under their control.

Stacksmith is local-only for now. It does not deploy itself, host itself, create a public URL, or run unless the user manually starts it with the CLI.

## How It Works

The planned full flow is:

1. Run `stacksmith studio`.
2. Open the local browser studio at `http://localhost:PORT`.
3. Create a project and describe what you want to build.
4. Choose or connect an AI provider.
5. Choose a database mode.
6. Generate a structured blueprint.
7. Review and approve the blueprint.
8. Generate a local project.
9. Run and preview the app locally.
10. Refine the project through chat-based edits.

The most important product idea is blueprint-first generation. Stacksmith should not jump from a vague prompt directly to a large codebase. It should first show what it plans to build, what it will not build yet, which files and commands are involved, and which assumptions need review.

## Run The Local Studio Shell

Install dependencies:

```bash
npm install
```

Start the local studio shell for development:

```bash
npm run dev -- studio
```

Build and run the compiled CLI:

```bash
npm run build
npm start
```

The studio shell runs at:

```text
http://127.0.0.1:4317
```

The server binds to localhost for local studio use only. There is no external hosting, production hosting, cloud runtime, or public access in Phase 1.

Health check:

```text
http://127.0.0.1:4317/health
```

The current studio is still local-only. Prompt submission creates a short deterministic chat response with client-side UI logic only. It does not call AI providers, connect databases, save chats, write files, or generate app projects. Settings controls are placeholder-only except for session-only light/dark mode and accent color controls; sample history items are not saved chats.

## Planned MVP

The first real version should focus on a local browser studio and one reliable generated-app path.

MVP targets:

- Local CLI command to start the studio.
- Browser studio served from localhost.
- New project flow.
- AI provider connection.
- Prompt input.
- Blueprint generation and review.
- Approval gate before code generation.
- Project generation from a clean template.
- Local run or preview guidance.
- Basic chat edits after generation.
- No-database and SQLite project modes.

Likely early provider targets are OpenRouter and Ollama. OpenAI, Anthropic, Google, xAI, and other providers are future expansion candidates.

Supabase is an important planned database path, especially for auth, storage, and cloud database workflows, but it should not block the first local-first MVP.

## What Makes Stacksmith Different

Stacksmith is inspired by the usefulness of modern AI app builders, but its positioning is independent.

- It runs locally instead of being platform-first.
- Users bring their own model or API key.
- Generated projects should be normal codebases.
- Users can choose local database workflows first and cloud database workflows later.
- The product should understand the data layer, not only generate frontend screens.
- Blueprint approval comes before code generation.
- The repository is open source and should be understandable to contributors.

## What Stacksmith Is Not

- Not a hosted SaaS app builder.
- Not a proprietary deployment platform.
- Not a clone of another product.
- Not a visual drag-and-drop builder.
- Not a promise that AI can replace code review, testing, or judgment.
- Not currently a working studio.
- Not trying to support every framework, model, database, and deployment target in the MVP.

## Roadmap

- **Phase 0:** Product foundation and documentation.
- **Phase 1:** Local studio shell.
- **Phase 2:** Blueprint generation.
- **Phase 3:** First app generation.
- **Phase 4:** Database-aware generation.
- **Phase 5:** Chat edit and fix loop.
- **Phase 6:** Supabase and provider expansion.
- **Phase 7:** Mobile apps, plugins, and broader ecosystem work.

See [docs/roadmap.md](docs/roadmap.md) for more detail.

## Documentation

- [Vision](docs/vision.md)
- [Product Principles](docs/product-principles.md)
- [MVP Scope](docs/mvp-scope.md)
- [Architecture](docs/architecture.md)
- [Terminology](docs/terminology.md)
- [Roadmap](docs/roadmap.md)
- [Decision Log](docs/decision-log.md)

## Contributing

Stacksmith is early. The most useful contributions right now are documentation improvements, product thinking, architecture feedback, issue writing, and focused discussion around templates, provider adapters, and database modes.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing changes.

## License

MIT. See [LICENSE](LICENSE).
