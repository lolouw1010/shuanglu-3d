# Deployment Notes

This document records repository and deployment state for the Shuanglu prototype.

## GitHub

Status: synced.

- Repository: `louiezhelee-uway/shuanglu`
- Visibility at sync time: public
- Branch: `main`
- Latest synced commit: `921161631b11e92fcfa2f2a48e07d576f52e8fd5`
- Commit summary:
  - `dd43221` initial Shuanglu prototype
  - `95768b4` remote placeholder commit
  - `9211616` merge remote repository placeholder

The local repository excludes generated or machine-local files:

- `.next`
- `node_modules`
- `dist`
- `coverage`
- `.DS_Store`
- `.obsidian`
- `*.log`

## Verification Before Sync

Last verified before GitHub push:

```bash
npm test
```

Result:

```txt
8 test files passed
27 tests passed
```

```bash
npm run build
```

Result:

```txt
Next.js production build passed
```

## Aliyun GD Deployment

Status: blocked pending server connection target.

The local SSH configuration does not contain a working `aliyun-gd` host entry. Direct resolution of `aliyun-gd` failed.

Required deployment inputs:

- SSH host or SSH config alias
- SSH user
- Deployment path on server
- Intended public hostname or port
- Runtime preference:
  - static export behind Nginx, or
  - Node/Next process behind Nginx

Recommended MVP deployment approach:

1. Build locally or on server.
2. Run the Next.js app as a Node process on an internal port.
3. Put Nginx in front of that port.
4. Add a systemd service or process manager entry so the app restarts after reboot.

Do not deploy to an unconfirmed server alias.
