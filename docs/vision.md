# Vision

Stacksmith is the local AI app studio for builders.

It should help people build websites, apps, tools, dashboards, SaaS products, mobile apps, and full-stack projects with AI while keeping ownership of their code, database choices, and workflow.

The product should feel like a serious studio, not a tiny script or random AI wrapper. It should make app generation faster while keeping the process understandable, reviewable, and local-first.

## Why Local-First Matters

Local-first means the user runs Stacksmith on their own machine and generates projects into a workspace they control.

This matters because builders should be able to:

- Inspect generated files directly.
- Run projects without a hosted platform dependency.
- Commit generated code to their own repository.
- Move projects to another editor or deployment target.
- Work with local databases and local models where appropriate.

Stacksmith can eventually support cloud services, but cloud services should be choices, not requirements.

## Why Code Ownership Matters

The core promise is simple: build apps locally with AI and own the code.

Generated projects should be normal codebases. A user should be able to keep working even if they stop using Stacksmith. The product should avoid hidden runtime dependencies, platform-only project formats, or generation patterns that make the code hard to understand.

Ownership also means the user can review what changed. Stacksmith should make large file changes, schema changes, command execution, migrations, and destructive edits explicit before they happen.

## Why Bring-Your-Own-Model Matters

Stacksmith should be model-flexible. Users should be able to choose an AI provider that fits their budget, privacy needs, performance needs, and local workflow.

Likely early provider targets are:

- OpenRouter.
- Ollama and local models.

Future provider expansion can include:

- OpenAI.
- Anthropic.
- Google.
- xAI.
- Other OpenAI-compatible providers.

The product should not be designed around one permanent model company.

## Why Blueprint-First Matters

Blueprint-first generation is the center of Stacksmith.

Stacksmith should not instantly generate code from one prompt. It should first create a structured blueprint that the user can review. A strong blueprint should include:

- App summary.
- Target users.
- Pages and screens.
- Components.
- Data models and database tables.
- API routes.
- Auth requirements.
- File structure.
- Environment variables.
- Integrations.
- Risks.
- Unclear requirements.
- Build steps.
- What will be generated.
- What will not be generated yet.

The blueprint gives builders a chance to correct direction before files are written.

## Who Stacksmith Is For

Stacksmith is for builders, including:

- Developers.
- Beginner developers.
- Founders.
- Students.
- Designers.
- Technical non-coders.
- Indie hackers.
- Agency teams.
- People who want to build software without platform lock-in.

It should be beginner-friendly without becoming toy-like. It should explain enough for new builders while respecting developers who want direct control.

## What Success Looks Like

Stacksmith succeeds when a builder can:

- Start the local studio.
- Describe an app clearly.
- Review a blueprint that captures product and technical intent.
- Approve generation with confidence.
- Receive a clean local project.
- Understand how to run and inspect the result.
- Continue editing through chat without losing control of the code.

The long-term goal is a trusted local studio for serious AI-assisted software building. The near-term goal is much smaller: prove one excellent local browser studio flow before expanding.
