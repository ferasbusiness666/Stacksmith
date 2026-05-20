# Decision Log

This log records product and architecture decisions that shape Stacksmith. Keep entries dated, short, and honest about status.

## 2026-05-17: Name Is Stacksmith

Status: accepted.

Decision: The project name is Stacksmith.

Reasoning: The name suggests building and shaping software stacks without tying the product to one framework, provider, or platform.

## 2026-05-17: Tagline Is The Local AI App Studio For Builders

Status: accepted.

Decision: The tagline is "The local AI app studio for builders."

Reasoning: This clearly communicates the product category, local-first direction, and audience.

## 2026-05-17: Start With Documentation Before Implementation

Status: accepted.

Decision: The repository starts with product and architecture documentation before studio implementation.

Reasoning: Stacksmith's scope could expand too quickly without a clear foundation. The docs should help future tasks understand what to build and what not to build yet.

## 2026-05-17: Local Browser Studio Is The Initial Interface

Status: accepted.

Decision: The first real product interface should be a local browser studio started from a CLI command such as `stacksmith studio`.

Reasoning: A browser studio can feel like a serious product while still running locally on the user's machine.

## 2026-05-17: Blueprint-First Workflow

Status: accepted.

Decision: Stacksmith should generate a reviewable blueprint before generating or changing project files.

Reasoning: Blueprint-first generation makes assumptions, file changes, data models, integrations, and risks visible before code is written.

## 2026-05-17: Bring-Your-Own-Model Direction

Status: accepted.

Decision: Stacksmith should be model-flexible and support bring-your-own-model workflows.

Reasoning: The product should not be locked to one AI company. Early targets can be narrow, but provider adapters should allow expansion.

## 2026-05-17: SQLite And Supabase Direction

Status: accepted.

Decision: Stacksmith should support no-database and SQLite modes early, with Supabase as a planned cloud database path.

Reasoning: SQLite supports local-first apps and simple full-stack projects. Supabase is useful later for auth, storage, cloud database, and deployable applications.

## 2026-05-17: Start With One Generated Stack First

Status: accepted.

Decision: The MVP should start with one high-quality generated stack before adding many frameworks.

Reasoning: One reliable path is more valuable than many incomplete paths. Stack expansion should follow after the first workflow is credible.

## 2026-05-17: Public Open-Source Repo

Status: accepted.

Decision: Stacksmith should be developed as a public open-source project.

Reasoning: The project benefits from clear docs, transparent decisions, contributor feedback, and trust around local-first code generation.

## 2026-05-17: Phase 1 Uses A Minimal Node Studio Shell

Status: accepted.

Decision: Phase 1 starts with a TypeScript CLI command, a lightweight Node HTTP server, a plain HTML/CSS localhost studio shell, and a `/health` route.

Reasoning: This creates the first runnable local studio surface without adding React, Vite, AI provider logic, database integration, blueprint generation, or project generation too early.

## 2026-05-17: Phase 1 UI Uses A Local-Only Workspace Layout

Status: accepted.

Decision: The Phase 1 studio UI uses a local-only workspace layout with a sidebar, sample placeholder chat history, a main chat/project workspace, and a dedicated Settings view.

Reasoning: A workspace layout better matches the intended developer/builder tool than a dashboard of unrelated cards. Settings-like placeholders should stay out of the main workspace, and sample history must be clearly marked as inert.

Implications:

- The studio remains manually started from the CLI and bound to localhost.
- No cloud hosting, production hosting, public access, persistence, AI calls, database connections, Supabase integration, blueprint generation, or project generation are added by this UI refresh.
- Settings and sample chat history remain placeholder-only until later phases.

## 2026-05-17: Phase 2 Starts With Local Mock Blueprint Flow

Status: superseded by 2026-05-17: Phase 2 Uses Normal Chat Shell And Full Settings Screen.

Decision: Phase 2 begins with deterministic client-side mock blueprint logic before provider integration.

Reasoning: This makes the studio flow interactive and testable without introducing API keys, network calls, persistence, database work, or project generation before the local product shape is clear.

Implications:

- Prompt submission creates a local mock blueprint in the browser only.
- Sample chat history remains placeholder-only and is not persisted.
- Settings move into a normal modal preferences surface.
- Real provider-backed blueprint generation remains future work.

## 2026-05-17: Phase 2 Uses Normal Chat Shell And Full Settings Screen

Status: accepted.

Decision: Phase 2 removes blueprint-style mock output from the chat and uses a normal chat shell with a full app-style settings screen.

Reasoning: The studio should feel like a clean builder tool rather than a dashboard or task list. Settings need enough space for General, Appearance, Personalization, MCP, Skills, Providers, Database, Safety, and Local Server categories.

Implications:

- Prompt submission returns a short deterministic local chat response, not a structured blueprint.
- Light/dark mode and accent color controls apply only for the current browser session.
- MCP, Skills, Providers, Database, and Supabase rows remain placeholders.
- No persistence, provider calls, database connections, project generation, hosting, or new backend routes are added.

## 2026-05-18: Working MVP Adds Provider Blueprints And Local Generation

Status: accepted.

Decision: Stacksmith's first working MVP supports Ollama and OpenRouter provider adapters, provider-backed blueprint generation, approval-based local project generation, and a React full-stack generated app template.

Reasoning: The product needs to prove the full local-first loop before adding advanced features. One generated stack and two provider paths are enough to validate the core promise without turning Stacksmith into a large platform too early.

Implications:

- Generated projects are written outside Stacksmith core under the configured user workspace.
- OpenRouter keys are saved through Windows DPAPI and are not returned to the browser UI.
- Supabase, hosting, automatic command execution, and generated-project chat patching remain future work.

## 2026-05-18: Command Safety Is Designed Before Command Execution

Status: accepted.

Decision: Stacksmith adds command safety modes and a command review endpoint before enabling automatic command execution.

Reasoning: Generated app commands can affect the user's machine. The product should establish review policy, workspace boundaries, hard rejection rules, and command-checker AI behavior before commands are allowed to run automatically.

Implications:

- The MVP displays generated app commands but does not run them automatically.
- Auto-safe mode cannot auto-approve commands when the checker AI is unavailable or uncertain.
- Destructive commands, credential exposure, force pushes, downloaded scripts piped into shells, and system-directory changes must never be auto-approved.

## 2026-05-18: Chat Startup And Work Directory Lock

Status: accepted.

Decision: The local studio opens directly into a new chat, starts each chat in Blueprint mode, and moves work-directory selection into a dedicated chat-level control.

Reasoning: Chat sessions should stay separate from future project/folder grouping, and the work directory should be explicit before files are written. Once Stacksmith generates project files, that chat's work directory is locked so later changes do not silently redirect edits or generated output.

Implications:

- New Chat creates a plain empty chat immediately instead of opening project setup.
- Project settings only cover project name and database mode.
- Build generation uses the active chat work directory and locks it after files are written.
- The Windows folder picker is a local-only convenience with manual path entry as fallback.

## Template

Use this format for future entries:

```markdown
## YYYY-MM-DD: Decision Title

Status: proposed | accepted | superseded

Decision: Short statement of the decision.

Reasoning: Why this decision was made.
```
