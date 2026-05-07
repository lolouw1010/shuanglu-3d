# Cloud Assets

This document records the current cloud runtime and operational assets for Shuanglu.

Last updated: 2026-05-07 07:48 CST

## Operating Policy

- Local MiniMac should not run the Shuanglu web service by default.
- Local repository is for code editing and documentation.
- Runtime verification should use the cloud deployment unless explicitly requested otherwise.
- Cloud production URL:

```txt
http://47.121.182.144/
```

- Cloud 3D test URL:

```txt
http://47.121.182.144/3d
```

## Local Repository

MiniMac repository path:

```txt
/Users/lizhe/Library/Mobile Documents/iCloud~md~obsidian/Documents/shuanglu/shuanglu
```

Current local Git state at takeover:

```txt
HEAD: 8b41eb1 Deploy 3D horse scale correction
Working tree: clean
```

Local service ports checked and intentionally left unused:

```txt
127.0.0.1:3000
127.0.0.1:3001
127.0.0.1:3002
127.0.0.1:3004
```

Local verification note:

- `npm test` ran all 27 tests successfully on MiniMac.
- Vitest then failed to write `node_modules/.vite/vitest/results.json` because of local iCloud/sandbox permissions.
- Treat that as a cache-write failure, not a rule-test failure.
- `npm run build` passed when allowed to write `.next`.

## SSH Access

Aliyun GD host:

```txt
47.121.182.144
```

MiniMac SSH key:

```txt
/Users/lizhe/.ssh/shuanglu_aliyun_gd
```

SSH command:

```bash
ssh -i /Users/lizhe/.ssh/shuanglu_aliyun_gd -o IdentitiesOnly=yes root@47.121.182.144
```

Previous Mac key path used in older records:

```txt
/Users/louie/Downloads/aliyun_test.pem
```

Do not rely on the old path on MiniMac.

## Server Runtime

Observed on 2026-05-07 07:33 CST:

```txt
Hostname: iZdygvq0meelhfZ
Uptime: 1 day, 11:59
Load average: 0.09, 0.03, 0.01
Node.js: v18.19.1
npm: 9.2.0
PM2: 6.0.14
Nginx: 1.24.0 (Ubuntu)
Disk: /dev/vda3 40G total, 9.0G used, 29G available, 25% used
```

Known runtime risk:

- The 3D dependency stack has warned in prior deployments that some packages prefer Node 20+.
- Current Node 18.19.1 can build and run the current app, but Node upgrade planning remains a future ops task.

## PM2 Processes

Observed PM2 process table:

```txt
gaokao-sprint-coach    online    internal port 3001
school-application     online    internal port 8000
shuanglu               online    internal port 3002
```

Shuanglu PM2 details:

```txt
Name: shuanglu
Status: online
Exec cwd: /opt/shuanglu
Script path: /usr/bin/npm
Script args: start -- --hostname 127.0.0.1 --port 3002
Node.js: 18.19.1
Watch: disabled
Error log: /root/.pm2/logs/shuanglu-error.log
Out log: /root/.pm2/logs/shuanglu-out.log
```

Operational boundary:

- `gaokao-sprint-coach` and `school-application` are separate services on the same host.
- Do not stop or reconfigure them when deploying Shuanglu.

## Network And Nginx

Listening ports observed:

```txt
0.0.0.0:80          nginx public HTTP
[::]:80             nginx public HTTP
0.0.0.0:8080        nginx public HTTP alternate
[::]:8080           nginx public HTTP alternate
0.0.0.0:22          sshd
[::]:22             sshd
127.0.0.1:3002      shuanglu Next.js
127.0.0.1:3001      gaokao-sprint-coach Next.js
127.0.0.1:8000      school-application Python
```

Nginx config directory:

```txt
/etc/nginx/conf.d
```

Relevant config file:

```txt
/etc/nginx/conf.d/shuanglu.conf
```

Current routing in `shuanglu.conf`:

```txt
/             -> http://127.0.0.1:3002
/gaokao       -> http://127.0.0.1:3001/gaokao
/gaokao/      -> http://127.0.0.1:3001/gaokao/
/school       -> 302 /school/
/school/      -> http://127.0.0.1:8000
```

Nginx verification:

```txt
nginx -t passed.
```

## Application Files

Production app path:

```txt
/opt/shuanglu
```

Backup root:

```txt
/opt/shuanglu_backups
```

Observed backups:

```txt
/opt/shuanglu_backups/node_modules.broken_20260501_183014
/opt/shuanglu_backups/partial_node_modules
/opt/shuanglu_backups/shuanglu_before_3d_isolated_7f73e37
/opt/shuanglu_backups/shuanglu_before_3d_scale_20260505_2005
/opt/shuanglu_backups/shuanglu_before_online_0108b27
/opt/shuanglu_backups/shuanglu_before_visual_20260502_2349
```

Important operational lesson:

- Do not leave broken or partial `node_modules` directories inside `/opt/shuanglu` or any active release root.
- Next.js may scan them during build and fail.
- Keep broken dependency backups under `/opt/shuanglu_backups`, outside the active project root.

## Cloud Verification

Verified on 2026-05-07 07:48 CST:

```bash
curl -I --max-time 20 http://47.121.182.144/
curl -I --max-time 20 http://47.121.182.144/3d
curl -s --max-time 20 -X POST http://47.121.182.144/api/rooms \
  -H 'Content-Type: application/json' \
  -d '{"playerId":"codex-cloud-only-test"}'
```

Result:

```txt
Public root path returned HTTP 200.
Public /3d path returned HTTP 200.
POST /api/rooms created room 3B24A7 and seated creator as white.
```

## Deployment Notes

Canonical deployment history remains in:

```txt
docs/DEPLOYMENT.md
```

For the current cloud-only testing workflow:

1. Make code changes locally.
2. Run local non-service checks only when needed.
3. Build and deploy to Aliyun.
4. Verify via cloud URLs and cloud API calls.
5. Keep this document and `docs/DEPLOYMENT.md` updated.
