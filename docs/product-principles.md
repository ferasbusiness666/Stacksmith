# Product Principles

These principles guide product, architecture, documentation, and contribution decisions.

## Local-First By Default

Stacksmith should run on the user's machine and generate projects into local workspaces. Cloud services can be supported later, but the local workflow should remain the default.

## Own Your Code

Generated projects should be ordinary codebases. Users should be able to inspect, edit, commit, move, deploy, or abandon Stacksmith without losing access to their app.

## Blueprint Before Build

Stacksmith should show a structured blueprint before creating or changing many files. The blueprint should explain the app plan, stack, data layer, generated files, commands, assumptions, and known limits.

## Clear Over Magical

The product should feel helpful and modern without hiding important details. Users should understand what Stacksmith is about to do and why.

## No Lock-In

Stacksmith should not force users into one hosting platform, one AI model, one database, or one generated project format. MVP choices can be narrow, but the architecture should not make them permanent.

## Model-Flexible

Stacksmith should support bring-your-own-model workflows. OpenRouter and Ollama are likely early targets. Other providers should be possible through provider adapters.

## Database-Aware

Stacksmith should understand the data layer. It should show database schema decisions in the blueprint before generation.

Early modes should include no database and SQLite. Supabase is a planned path for cloud database, auth, and storage workflows.

## Honest Status

Do not claim features are implemented when they are only planned.

Use clear labels:

- Planned.
- MVP target.
- Future.
- Not in MVP.

## Beginner-Friendly, Developer-Respectful

Stacksmith should help non-experts make progress, but it should lead them toward real software practices. It should not trap builders in a simplified toy environment.

## Safe File And Command Changes

Stacksmith should require approval before major or destructive actions, including:

- Creating many files.
- Deleting files.
- Changing database schemas.
- Running install commands.
- Running migrations.
- Modifying existing projects.

## One Excellent Stack First

For the MVP, one reliable generated stack is better than many broken stacks. Stack expansion should happen after the first path is credible.

## Open-Source Friendly

The repository should stay clear, serious, and contribution-friendly. Decisions that shape the product should be recorded in the decision log.
