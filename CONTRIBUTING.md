# Contributing

This repo is a pnpm + Turborepo monorepo for `@vlkoss/cue`. The root [README.md](./README.md) is for people _using_ the package. This file is for people _changing_ it.

## Setup

- Node `>=24`
- pnpm `11` (see `packageManager` in the root `package.json`)

```sh
pnpm install
```

## Layout

| Path                         | Role                                        |
| ---------------------------- | ------------------------------------------- |
| `packages/react`             | `@vlkoss/cue` library                       |
| `packages/typescript-config` | Shared TypeScript config                    |
| `apps/docs`                  | Fumadocs site (landing + docs + live demos) |

Agent skills live under [`.agents/skills/`](./.agents/skills/). See [AGENTS.md](./AGENTS.md) when working with an agent in this repo.

## Scripts

From the repo root:

```sh
pnpm dev          # docs and library watch via turbo
pnpm build        # build packages
pnpm test         # unit tests
pnpm check-types  # typecheck
pnpm lint         # lint
pnpm format       # check formatting
pnpm format:fix   # write formatting
pnpm changeset    # add a changeset for a library change
```

Filter a single package:

```sh
pnpm --filter @vlkoss/cue test
pnpm --filter docs dev
```

## Library workflow

Source is TypeScript under `packages/react/src`. Workspace installs resolve that source. `pnpm publish` swaps the entry to `dist/` via `publishConfig`.

```sh
pnpm --filter @vlkoss/cue build
pnpm --filter @vlkoss/cue test
```

## Versioning and publishing

`@vlkoss/cue` is versioned with [Changesets](https://github.com/changesets/changesets). Private apps and configs are not published.

### Add a changeset

When a PR changes the library, run:

```sh
pnpm changeset
```

Select `@vlkoss/cue`, pick major / minor / patch, write a one-line summary, and commit the new file under `.changeset/`.

### Release on CI

Pushes to `main` run [`.github/workflows/release.yml`](./.github/workflows/release.yml):

1. Pending changesets open a "Version Packages" PR (bumps version, updates `CHANGELOG.md`).
2. Merging that PR publishes to npm.

The workflow needs an `NPM_TOKEN` repository secret with publish access to the `@vlkoss` scope. For a first publish, create the `@vlkoss` org (or claim the scope) on npm if it does not exist yet.

### Release locally

```sh
pnpm version-packages
pnpm release
```

You must be logged in to npm (`npm login`) with publish rights.

## shadcn registry

Single source of truth: `registry.json` plus `registry/cue.ts` (a re-export of `@vlkoss/cue`). That powers:

- GitHub installs: `npx shadcn@latest add mauroerta/cue/cue`
- Hosted installs after docs build: `https://cue.vlkstudio.com/r/cue.json`

`apps/docs/public/r` is **generated** by `pnpm registry:build` (inlined item JSON for the CLI). It is gitignored. Docs `dev` and `build` both regenerate it so the site never serves a stale hand-copied catalog.

## Docs site

Content is MDX in `apps/docs/content/docs`. Live demos use `@vlkoss/cue` from the workspace. Sidebar order is controlled by `meta.json` files (Fumadocs page tree).

```sh
pnpm --filter docs dev
```

## Pull requests

1. Keep changes scoped. Prefer one concern per PR.
2. Add or update tests when behavior changes (`packages/react`).
3. If the library changed, add a changeset (`pnpm changeset`).
4. Run `pnpm check-types`, `pnpm test`, and `pnpm lint` before opening the PR.
5. Match existing naming and file layout. Do not invent parallel abstractions next to working ones.

## License

By contributing, you agree your contributions are licensed under the [MIT License](./LICENSE).
