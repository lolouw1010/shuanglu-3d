# Deployment Notes

This document records repository and deployment state for the Shuanglu prototype.

## GitHub

Status: synced.

- Repository: `louiezhelee-uway/shuanglu`
- Visibility at sync time: public
- Branch: `main`
- Application commit deployed: `b7b9e554787ae3f62e08f2b8f7160c84bf2f6982`
- Commit summary:
  - `b7b9e55` add deployment tracking and GitHub sync notes
  - `9211616` merge remote repository placeholder
  - `dd43221` initial Shuanglu prototype
  - `95768b4` remote placeholder commit

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

Status: deployed.

Deployment target:

- Public URL: `http://47.121.182.144/`
- Server: `47.121.182.144`
- SSH user: `root`
- Application path: `/opt/shuanglu`
- Internal app address: `127.0.0.1:3002`
- Process manager: PM2
- PM2 process name: `shuanglu`
- Reverse proxy: Nginx
- Nginx config file: `/etc/nginx/conf.d/shuanglu.conf`
- Deployment source: local Git archive from commit `bd798b2`

Runtime model:

1. Build and run the Next.js application as a Node process.
2. Bind the app to `127.0.0.1:3002`.
3. Use Nginx as the public reverse proxy on port `80`.
4. Match the IP host `47.121.182.144` in a dedicated Nginx server block.
5. Leave the existing `college.hkuway.com` server block in place.

Server commands used:

```bash
mkdir -p /opt/shuanglu
tar -xzf /tmp/shuanglu-deploy-b7b9e55.tgz -C /opt/shuanglu
cd /opt/shuanglu
npm ci
npm run build
pm2 start npm --name shuanglu -- start -- --hostname 127.0.0.1 --port 3002
pm2 save
nginx -t
systemctl reload nginx
```

Verification:

```bash
curl -I --max-time 10 http://127.0.0.1:3002/
```

Result:

```txt
HTTP/1.1 200 OK
```

```bash
curl -s --max-time 20 http://47.121.182.144/
```

Result:

```txt
The public response contains <title>双陆 Shuanglu.
```

Operational notes:

- The server's existing Nginx config already serves `college.hkuway.com`.
- The Shuanglu app uses a separate Nginx server block for `47.121.182.144`, so the existing site was not intentionally replaced.
- The server could not reliably fetch the GitHub repository directly during deployment, so the deployed package was uploaded from the local verified Git commit.
- `npm ci` reported 7 moderate severity dependency advisories. They were not auto-fixed because `npm audit fix --force` may introduce breaking changes.

## 2026-05-01 Recovery Notes

After deploying the bar re-entry UX fix, the server became unresponsive during an interrupted dependency install. The instance was rebooted from the Aliyun console.

Observed after reboot:

- Nginx was online.
- Public HTTP returned `502 Bad Gateway`.
- PM2 process `shuanglu` was repeatedly restarting.
- `pm2 logs shuanglu` showed `next: not found`, then `Bus error (core dumped)` after a partial repair attempt.

Recovery steps:

```bash
pm2 stop shuanglu
cd /opt/shuanglu
mv node_modules node_modules.broken_20260501_183014
npm ci --no-audit --no-fund
mkdir -p /opt/shuanglu_backups
mv /opt/shuanglu/node_modules.broken_* /opt/shuanglu_backups/
npm run build
pm2 restart shuanglu --update-env
pm2 save
```

Important operational lesson:

- Do not leave backup directories such as `node_modules.broken_*` inside the Next.js project root. Next.js/TypeScript may scan them during build.
- If a dependency install is interrupted, prefer moving `node_modules` out of the app directory and running a clean `npm ci --no-audit --no-fund`.

Recovery verification:

```bash
curl -I --max-time 10 http://127.0.0.1:3002/
curl -I --max-time 20 http://47.121.182.144/
```

Result:

```txt
Both internal Next.js and public Nginx endpoints returned HTTP 200.
The public JavaScript bundle contains 点这里复马.
```
