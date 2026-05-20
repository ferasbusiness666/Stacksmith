# Stacksmith

The local AI app studio for builders.

Build websites, apps, and tools with your own AI, your own database, and code you actually own.

Stacksmith is an installable local AI app studio for people who want the speed of AI-assisted building without giving up ownership of their workflow. The planned product runs on your machine, opens a browser studio on localhost, connects to your chosen AI provider, creates a reviewable blueprint, and then generates a clean local project after approval.

**Status:** Stacksmith now has an early working local MVP. The localhost studio can save local settings, connect to Ollama or OpenRouter, generate a structured blueprint with the selected provider, require approval, and write a generated React full-stack project into the user's local Stacksmith workspace. Cloud hosting, Supabase implementation, automatic command execution, and generated-project chat patching are not implemented yet.

## Why Stacksmith Exists

AI app builders have made it faster to turn ideas into software, but many are built around hosted platforms, fixed model choices, fixed backend choices, and project formats that are hard to move away from.

Stacksmith is designed around a different default: local-first software creation. The goal is to help builders create serious apps while keeping the generated code, database decisions, model configuration, and development workflow under their control.

Stacksmith is local-only for now. It does not deploy itself, host itself, create a public URL, or run unless the user manually starts it with the CLI.

## How It Works

The current local MVP flow is:

1. Run `stacksmith studio`.
2. Open the local browser studio at `http://localhost:PORT`.
3. Start a new chat and describe what you want to build.
4. Choose Ollama or OpenRouter in Settings.
5. Pick the active model from the chat composer.
6. Choose a database mode and work directory for the chat.
7. Generate a structured blueprint.
8. Review and approve the blueprint.
9. Generate a local project.
10. Run the displayed commands manually.

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

The current studio is local-only. Prompt submission calls the configured provider to create a blueprint. Project generation writes files only after approval and only inside the selected chat work directory, which defaults to:

```text
~/Stacksmith/projects
```

Stacksmith shows install/run commands for generated apps, but it does not run them automatically in this MVP.

Each chat starts in Blueprint mode. The work directory can be changed while planning, but it locks after Stacksmith writes project files for that chat.

## Provider Setup

Stacksmith supports two early provider paths:

- **Ollama:** local model calls through `http://127.0.0.1:11434`.
- **OpenRouter:** cloud model calls with a user-supplied API key.

OpenRouter keys are stored with Windows DPAPI in this MVP. The key can be saved or replaced from Settings, but it is never returned to the browser UI.

## Command Safety

Stacksmith includes a command safety review layer for future command execution.

Command modes:

- **Never run commands:** default safest mode; commands are displayed only.
- **Manual approval:** every command requires user approval.
- **Auto-approve safe commands:** a command must pass safety review, and if needed a separate command-checker AI, before it can be considered safe.

This MVP does not automatically execute generated project commands. The safety layer is present so command execution can be added later without bypassing review.

## Planned MVP

The first real version should focus on a local browser studio and one reliable generated-app path.

Current MVP capabilities:

- Local CLI command to start the studio.
- Browser studio served from localhost.
- AI provider connection for Ollama and OpenRouter.
- Prompt input.
- Blueprint generation and review.
- Approval gate before code generation.
- Project generation from a clean React full-stack template.
- Local run command guidance.
- No-database and SQLite project modes.
- Command safety review foundation.

OpenAI, Anthropic, Google, xAI, and other providers are future expansion candidates.

Supabase is an important planned database path, especially for auth, storage, and cloud database workflows, but it is not implemented in the current MVP.

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
- Not a production-ready app generator.
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
