# Changesets

Versioning for `@vlkoss/cue` uses [Changesets](https://github.com/changesets/changesets).

## Add a changeset

When a PR changes the published package, run:

```sh
pnpm changeset
```

Pick `@vlkoss/cue`, choose major / minor / patch, and write a short summary. Commit the file under `.changeset/`.

## Release

On `main`, the release workflow opens a "Version Packages" PR when changesets are pending. Merging that PR bumps the version, updates the changelog, and publishes to npm.

Locally:

```sh
pnpm version-packages   # consume changesets, bump version, write CHANGELOG
pnpm release            # build @vlkoss/cue and publish
```
