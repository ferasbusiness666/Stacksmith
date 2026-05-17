# Architecture

This document describes Stacksmith's high-level architecture direction. It is not an implementation claim.

Stacksmith itself is the local studio application. Generated apps are separate projects inside a workspace.

## Core Separation

Stacksmith should keep a clear boundary between:

1. Stacksmith core and studio.
2. Generated projects.
3. Provider adapters.
4. Database adapters.
5. Blueprint engine.
6. Code generation engine.
7. Runner and preview system.

This separation helps keep generated apps portable and keeps Stacksmith from becoming tied to one model, database, or framework.

## Planned Modules

### CLI

Starts Stacksmith from the terminal. The first planned command is `stacksmith studio`, which should start the local server and open or print the localhost URL.

### Studio Server

Runs locally and coordinates the product workflow. It should serve the studio UI, manage local settings, call provider adapters, validate blueprints, trigger generation, and report progress.

### Studio UI

The browser interface for builders. It should support project creation, provider setup, database mode selection, prompt entry, blueprint review, approval, generation progress, preview guidance, and chat-based edits.

### Workspace Manager

Manages where generated projects live. It should keep Stacksmith's own files separate from generated project folders.

### Provider Adapters

Hide model-provider differences behind a small internal interface. Early adapters may target OpenRouter and Ollama. Future adapters can support OpenAI, Anthropic, Google, xAI, and compatible providers.

### Blueprint Engine

Turns user intent and model output into a structured, reviewable blueprint. The blueprint should capture product shape, screens, data model, API routes, auth needs, file structure, environment variables, build steps, risks, unclear requirements, and generation boundaries.

### Codegen Engine

Turns an approved blueprint into project files. It should generate from templates and structured decisions, not from unbounded free-form text alone.

### Template System

Provides reliable foundations for generated projects. The MVP should start with one high-quality stack before adding alternatives.

### Database Adapters

Represent database modes and schema decisions. Early modes should include no database and SQLite. Supabase should be a planned path for auth, storage, and cloud database workflows.

### Runner And Preview

Helps users run or preview generated apps locally. It should show commands clearly and avoid running major commands without approval.

### Safety And Approval Layer

Protects users from unexpected file, command, and database changes. Major actions should be reviewed before execution.

### Project Memory

Stores project context that helps future blueprint updates and chat edits. This should be local-first and transparent.

## Conceptual Flow

1. User runs `stacksmith studio`.
2. CLI starts the local studio server.
3. Browser studio opens on localhost.
4. User creates a project and enters an app idea.
5. User chooses an AI provider and database mode.
6. Provider adapter sends the planning request to the selected model.
7. Blueprint engine produces a structured blueprint.
8. User reviews risks, assumptions, schema, files, and build steps.
9. User approves generation.
10. Codegen engine writes a generated project into the workspace.
11. Runner/preview shows local run steps.
12. Chat/edit mode proposes future changes through reviewable plans or diffs.

## Architecture Principles

- Keep Stacksmith separate from generated projects.
- Keep providers behind adapters.
- Keep database modes behind adapters.
- Prefer structured blueprints over direct code dumping.
- Validate plans before writing files.
- Require approval for destructive or high-impact actions.
- Keep generated projects portable.
- Start with one excellent generated stack.

## Future Stack Options

Possible future generated stacks include:

- Next.js.
- Expo or React Native.
- Vue.
- Svelte.
- FastAPI.
- PostgreSQL.
- Supabase.

These are future options, not MVP commitments.
