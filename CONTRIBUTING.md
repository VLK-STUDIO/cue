# Contributing

This repo is a pnpm + Turborepo monorepo for `@vlkoss/cue`. The root [README.md](./README.md) is for people *using* the package. This file is for people *changing* it.

## Setup

- Node `>=24`
- pnpm `11` (see `packageManager` in the root `package.json`)

```sh
pnpm install
```

## Layout

| Path | Role |
| --- | --- |
| `packages/react` | `@vlkoss/cue` library |
| `packages/typescript-config` | Shared TypeScript config |
| `apps/playground` | Vite app that exercises the library |
| `apps/docs` | Fumadocs site (landing + docs + live demos) |

Agent skills live under [`.agents/skills/`](./.agents/skills/). See [AGENTS.md](./AGENTS.md) when working with an agent in this repo.

## Scripts

From the repo root:

```sh
pnpm dev          # playground, docs, and library watch via turbo
pnpm build        # build packages
pnpm test         # unit tests
pnpm check-types  # typecheck
pnpm lint         # lint
pnpm format       # check formatting
pnpm format:fix   # write formatting
```

Filter a single package:

```sh
pnpm --filter @vlkoss/cue test
pnpm --filter docs dev
pnpm --filter playground dev
```

## Library workflow

Source is TypeScript under `packages/react/src`. Workspace installs resolve that source. `pnpm publish` swaps the entry to `dist/` via `publishConfig`.

```sh
pnpm --filter @vlkoss/cue build
pnpm --filter @vlkoss/cue test
```

Publish only after a clean build:

```sh
pnpm --filter @vlkoss/cue publish
```

## Docs site

Content is MDX in `apps/docs/content/docs`. Live demos use `@vlkoss/cue` from the workspace. Sidebar order is controlled by `meta.json` files (Fumadocs page tree).

```sh
pnpm --filter docs dev
```

## Pull requests

1. Keep changes scoped. Prefer one concern per PR.
2. Add or update tests when behavior changes (`packages/react`).
3. Run `pnpm check-types`, `pnpm test`, and `pnpm lint` before opening the PR.
4. Match existing naming and file layout. Do not invent parallel abstractions next to working ones.

## License

By contributing, you agree your contributions are licensed under the [MIT License](./LICENSE).
