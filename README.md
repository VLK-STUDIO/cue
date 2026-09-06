# overlay-manager

Turborepo for the `@overlay-manager` packages — an imperative React overlay API.

## Packages

- [`packages/react`](./packages/react) — `@overlay-manager/react`
- [`packages/typescript-config`](./packages/typescript-config) — shared TypeScript config
- [`apps/playground`](./apps/playground) — Vite app that exercises the React package

## Scripts

```sh
pnpm dev          # playground + library watch
pnpm build        # compile the library
pnpm test         # unit tests
pnpm check-types  # typecheck every package
```

Publish from the library package after `pnpm build`:

```sh
pnpm --filter @overlay-manager/react publish
```
