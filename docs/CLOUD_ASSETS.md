# Cloud Runtime And Assets

Last updated: 2026-07-06 CST

This document records the current Shuanglu production runtime. Historical Aliyun deployment details remain in `docs/DEPLOYMENT.md`.

## Production Endpoints

```txt
https://shuanglu.uway.click/
https://shuanglu.uway.click/3d
https://shuanglu.uway.click/health
```

The stable playable interface is `/`. The `/3d` route remains an isolated visual spike.

## Local Repository

Primary workspace:

```txt
/Users/lizhe/Projects/shuanglu
```

Do not use the iCloud/Obsidian directory as the program workspace. The repository, dependencies, and build cache create many files that do not belong in document sync.

The supported Node.js major version is pinned in `.nvmrc` and `package.json`:

```txt
Node.js 20
```

## Linode Access

```txt
Tailscale node: linode-singapore
Tailscale IP: 100.110.183.126
Public IP: 139.162.57.49
Recommended SSH user: uway
Administrative SSH user: root
```

Use Tailscale SSH:

```bash
ssh uway@linode-singapore
ssh root@linode-singapore
```

Public TCP port 22 is intentionally blocked by UFW. Do not open public SSH without first disabling password authentication and unrestricted root login.

## Server Runtime

Verified on 2026-07-06 CST:

```txt
Operating system: Ubuntu 24.04.4 LTS
Node.js: 20.20.2
npm: 11.16.0
Application user: shuanglu
Application root: /opt/apps/shuanglu
Active release: /opt/apps/shuanglu/current
Internal address: 127.0.0.1:3002
Service manager: systemd
Service unit: shuanglu.service
```

The service runs as the non-login `shuanglu` user. The tracked unit template is `ops/systemd/shuanglu.service`.

Useful checks:

```bash
systemctl status shuanglu --no-pager
systemctl is-enabled shuanglu
curl -fsS http://127.0.0.1:3002/ >/dev/null
```

## Nginx And TLS

The active Nginx proxy runs in the Docker container named `nginx` with host networking and restart policy `always`.

Host mounts:

```txt
/home/web/nginx.conf -> /etc/nginx/nginx.conf
/home/web/conf.d -> /etc/nginx/conf.d
/home/web/certs -> /etc/nginx/certs
/home/web/letsencrypt -> /var/www/letsencrypt
```

The Shuanglu virtual-host template is tracked at `ops/nginx/shuanglu.uway.click.conf`.

Useful checks:

```bash
docker ps --filter name=nginx
docker exec nginx nginx -t
curl -fsS https://shuanglu.uway.click/health
```

The certificate is issued by Let's Encrypt. The `shuanglu-certbot-renew.timer` unit runs the pinned `certbot/certbot:v5.6.0` container twice daily. Renewal uses the webroot `/var/www/letsencrypt` and deploys the renewed certificate into `/home/web/certs` through `ops/scripts/deploy-certificate.sh`.

## Release Model

Production releases use this layout:

```txt
/opt/apps/shuanglu/
├── releases/
│   └── <UTC timestamp>-<short Git revision>/
└── current -> releases/<active release>/
```

Each release contains a `REVISION` file with the full Git commit. Deployments build and smoke-test an independent release before switching `current`.

The canonical deployment command is:

```bash
./scripts/deploy-production.sh
```

The script refuses to deploy a dirty working tree, a non-`main` branch, or a revision that does not match `origin/main`. It runs local verification, builds the release on Linode, tests it on a temporary port, switches the symlink, restarts `shuanglu.service`, and restores the previous release if the live health check fails.

Public health verification is also available separately:

```bash
./scripts/production-health-check.sh
```

## Runtime State

Online rooms are held in the Next.js process memory. Restarting `shuanglu.service` clears active rooms. There is currently no production database or user-upload directory for Shuanglu.

## Tracked Assets

Runtime art assets are stored under `public/assets` and versioned in Git. The cloud server must not be treated as the only copy of generated art.

Key groups:

```txt
public/assets/backgrounds
public/assets/characters
public/assets/concepts
public/assets/pieces
public/assets/ui
```

## Operational Boundaries

- Do not build inside the active release directory.
- Do not replace `node_modules` in the active release.
- Do not expose port 3002 publicly.
- Do not print certificate private keys or application secrets in logs.
- Do not expand the current in-memory room architecture without an explicit product requirement.
- Keep `/3d` isolated from the stable 2D online flow until it passes its own QA.
