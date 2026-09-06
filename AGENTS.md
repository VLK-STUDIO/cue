# Agent guide

Skills live in [`.agents/skills/`](.agents/skills/). `.claude/skills/` mirrors them. Read a skill's `SKILL.md` before applying it. Do not paraphrase a skill into the chat: follow it.

## Standing habits

- **unslop.** On every user-facing draft (docs, UI copy, PR text, commit messages, replies): read [`.agents/skills/unslop/SKILL.md`](.agents/skills/unslop/SKILL.md) and cut AI tells before you ship the text. User-invoked skill; this file is what makes it always-on.
- **Domain first.** If `CONTEXT.md` or `docs/adr/` exists, read them before naming types, tests, or seams. Changing the glossary or ADRs is `domain-modeling`, not casual renaming.

## Reach for a skill

Match the branch, then open that skill. One skill per branch unless a skill names another.

### Model-invoked (fire when the branch matches)

| Branch | Skill |
| --- | --- |
| Designing or deepening a module interface, placing a seam, making code more testable or AI-navigable | [`codebase-design`](.agents/skills/codebase-design/SKILL.md) |
| Sharpening terminology, writing or editing `CONTEXT.md`, recording or editing an ADR | [`domain-modeling`](.agents/skills/domain-modeling/SKILL.md) |
| UI polish, motion, press feedback, dialog/drawer/toast feel | [`emil-design-eng`](.agents/skills/emil-design-eng/SKILL.md) |
| Feature or bug fix test-first, red-green-refactor, integration tests | [`tdd`](.agents/skills/tdd/SKILL.md) |
| `turbo.json`, pipelines, `--filter` / `--affected`, cache, `apps/` + `packages/` layout | [`turborepo`](.agents/skills/turborepo/SKILL.md) |
| Creating or editing a skill, or editing this file / `CLAUDE.md` | [`writing-for-agents`](.agents/skills/writing-for-agents/SKILL.md) |

### User-invoked (only when the user asks, or names the skill)

| Branch | Skill |
| --- | --- |
| Relentless interview to sharpen a plan or design | [`grill-me`](.agents/skills/grill-me/SKILL.md) |
| Compact this conversation for a fresh agent | [`handoff`](.agents/skills/handoff/SKILL.md) |
| Scan for deepening opportunities, HTML report, then grill one | [`improve-codebase-architecture`](.agents/skills/improve-codebase-architecture/SKILL.md) |
| Strip AI tells from writing (also the standing habit above) | [`unslop`](.agents/skills/unslop/SKILL.md) |

When a user-invoked skill would clearly help and the user has not named it, name it once and ask. Do not run it unprompted.

## Completion

A skill-backed task is done when every step in that skill that applies has met its completion criterion, and any user-facing text has passed **unslop**.
