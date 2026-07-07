# 2D Upstream Sync

The 3D application is an independent codebase. It does not import or link runtime code from the 2D application.

## Upstream

```txt
Remote: upstream-2d
Repository: https://github.com/lolouw1010/shuanglu.git
Initial fork: a792bf5bba974022401c402a1b6193d40deffb0a
```

The push URL for `upstream-2d` is intentionally disabled.

## Required Sync

Review and normally cherry-pick focused commits that change:

```txt
src/game
src/server
src/online
shared state behavior in src/store
rule and server tests
security-sensitive validation
```

## Reimplement Instead Of Copying

Review player-facing UX fixes, error reasons, reconnect behavior, and rule guidance. Reproduce the behavior in the 3D presentation without copying 2D-specific layout or CSS.

## Skip

Do not copy 2D parchment layout, image crops, board CSS, 2D-only animation, or 2D production operations.

## Workflow

```bash
./scripts/audit-2d-sync.sh
git fetch upstream-2d main
git cherry-pick <focused-commit>
npm run typecheck
npm test
npm run build
```

After reviewing all listed upstream commits, update `.upstream-2d-revision` to the reviewed commit even when some presentation-only commits were intentionally skipped.

BigNAS is not part of the active sync path while it is powered off. GitHub is the authoritative remote until BigNAS returns.
