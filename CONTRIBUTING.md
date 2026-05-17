# Contributing To Stacksmith

Stacksmith is currently in the planning and foundation stage. The most useful contributions right now help clarify the product, reduce ambiguity, and prepare the repo for careful implementation.

## What Helps Now

Good early contributions include:

- Documentation improvements.
- Product thinking.
- Architecture feedback.
- Clear issues.
- Roadmap discussion.
- Template ideas.
- Provider adapter research.
- Database adapter research.

Code contributions will matter more after the foundation is stable and the first implementation tasks are defined.

## Contribution Principles

Contributions should be:

- Focused.
- Honest about what is implemented versus planned.
- Consistent with the local-first direction.
- Clear about tradeoffs.
- Easy to review.
- Respectful of beginner builders and experienced developers.

Avoid changes that:

- Add a large architecture before a narrow workflow exists.
- Introduce platform lock-in without discussion.
- Claim planned features are complete.
- Add generated app code without review context.
- Expand MVP scope before the first local studio flow is credible.

## Documentation Contributions

For docs changes:

- Keep language modern, direct, and not overhyped.
- Do not call Stacksmith a clone.
- Use planned, MVP target, future, or not in MVP when describing unfinished features.
- Update related docs when changing product scope, architecture, or terminology.
- Add decision-log entries for choices that shape future work.

## Future Code Contributions

For future code changes:

- Keep changes small and tied to documented MVP goals.
- Avoid adding dependencies without a clear reason.
- Include tests when behavior is added.
- Make file and command side effects explicit.
- Explain what is intentionally out of scope.

## Current Development Setup

There is no working studio implementation yet.

The repository currently contains documentation and a placeholder `package.json`. Do not expect `npm run dev` to start the studio until implementation work begins.

## Decision Log

Use `docs/decision-log.md` for decisions that affect product direction, architecture, supported stacks, provider strategy, database strategy, or contribution expectations.
