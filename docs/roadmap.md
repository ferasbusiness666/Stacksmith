# Roadmap

This roadmap describes planned phases. It does not claim these features are implemented.

## Phase 0: Product Foundation And Docs

Status: current foundation work.

Goals:

- Define product identity.
- Document the local-first and blueprint-first direction.
- Clarify MVP scope.
- Capture architecture boundaries.
- Establish terminology and contribution style.

## Phase 1: Local Studio Shell

Status: planned.

Goals:

- Add a CLI entrypoint for `stacksmith studio`.
- Start a local server.
- Open or print a localhost URL.
- Serve a minimal browser studio shell.
- Keep all functionality clearly marked as early.

## Phase 2: Blueprint Generation

Status: planned.

Goals:

- Add prompt intake.
- Add provider configuration.
- Support an early provider path such as OpenRouter or Ollama.
- Generate structured blueprints.
- Show blueprint sections for app plan, screens, data, APIs, files, risks, and unknowns.

## Phase 3: First App Generation

Status: planned.

Goals:

- Generate one clean app stack from an approved blueprint.
- Write projects into a local workspace.
- Keep generated apps separate from Stacksmith core.
- Provide clear run instructions.

## Phase 4: Database-Aware Generation

Status: planned.

Goals:

- Support no-database and SQLite modes.
- Show schema decisions in the blueprint.
- Generate database-aware project files from approved plans.
- Avoid schema or migration changes without approval.

## Phase 5: Chat Edit And Fix Loop

Status: planned.

Goals:

- Let users request changes through chat.
- Keep major edits reviewable before applying them.
- Add a basic fix flow for errors and logs.
- Preserve user ownership of the code.

## Phase 6: Supabase And Provider Expansion

Status: planned.

Goals:

- Add Supabase as a cloud database, auth, and storage path.
- Expand provider adapters beyond the first MVP choices.
- Improve settings and provider management.

## Phase 7: Mobile, Apps, Plugins, And Later Ecosystem

Status: future.

Goals:

- Explore mobile app generation.
- Explore additional app stacks.
- Explore plugin and template ecosystems.
- Explore MCP-connected services and bring-your-own integrations.
- Explore existing-project support.
