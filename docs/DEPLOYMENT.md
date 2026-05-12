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
- Deployment source: local working-tree archive for latest visual pass; earlier deployments used local Git archives.

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

## 2026-05-03 Visual Board Deployment

Status: deployed.

Purpose:

- Publish the first 3D-like lacquer-board visual pass directly to Aliyun GD.
- Include the new board shell, board point styling, and future piece asset slots.

Deployment package:

```txt
/tmp/shuanglu-visual-20260502-2349.tgz
```

Server upload target:

```txt
/tmp/shuanglu-visual-20260502-2349.tgz
```

Build directory:

```txt
/opt/shuanglu_release_20260502_2349
```

Previous production backup:

```txt
/opt/shuanglu_backups/shuanglu_before_visual_20260502_2349
```

Commands used:

```bash
tar -xzf /tmp/shuanglu-visual-20260502-2349.tgz -C /opt/shuanglu_release_20260502_2349
cd /opt/shuanglu_release_20260502_2349
npm ci --no-audit --no-fund
npm run build
pm2 stop shuanglu
mv /opt/shuanglu /opt/shuanglu_backups/shuanglu_before_visual_20260502_2349
mv /opt/shuanglu_release_20260502_2349 /opt/shuanglu
cd /opt/shuanglu
pm2 restart shuanglu --update-env
pm2 save
nginx -t
systemctl reload nginx
```

Verification:

```bash
curl -I --max-time 10 http://127.0.0.1:3002/
curl -I --max-time 20 http://47.121.182.144/
curl -s --max-time 20 http://47.121.182.144/_next/static/chunks/app/page-25097f5190129d22.js
```

Result:

```txt
Internal Next.js endpoint returned HTTP 200.
Public Nginx endpoint returned HTTP 200.
PM2 process shuanglu is online.
Nginx configuration test passed.
Public JavaScript bundle contains board-scene, board-shell, board-perspective, and white-horse-idle.
```

Open deployment note:

- This deployment used the local working tree for the server cutover, then the same visual changes were committed and pushed to GitHub as `47d6f60`.

## 2026-05-03 Online Room Deployment

Status: deployed.

Source commit:

```txt
0108b27 Add online room play MVP
```

Purpose:

- Publish the first online friend-play MVP.
- Add room-code creation, joining, polling sync, server-side roll validation, and server-side move validation.

Deployment package:

```txt
/tmp/shuanglu-online-0108b27.tgz
```

Server upload target:

```txt
/tmp/shuanglu-online-0108b27.tgz
```

Build directory:

```txt
/opt/shuanglu_release_online_0108b27
```

Previous production backup:

```txt
/opt/shuanglu_backups/shuanglu_before_online_0108b27
```

Commands used:

```bash
tar -xzf /tmp/shuanglu-online-0108b27.tgz -C /opt/shuanglu_release_online_0108b27
cd /opt/shuanglu_release_online_0108b27
npm ci --no-audit --no-fund
npm run build
pm2 stop shuanglu
mv /opt/shuanglu /opt/shuanglu_backups/shuanglu_before_online_0108b27
mv /opt/shuanglu_release_online_0108b27 /opt/shuanglu
cd /opt/shuanglu
pm2 restart shuanglu --update-env
pm2 save
nginx -t
systemctl reload nginx
```

Verification:

```bash
curl -I --max-time 20 http://47.121.182.144/
curl -s --max-time 20 -X POST http://47.121.182.144/api/rooms \
  -H 'Content-Type: application/json' \
  -d '{"playerId":"codex-white-test"}'
curl -s --max-time 20 -X POST http://47.121.182.144/api/rooms/E0FCE0 \
  -H 'Content-Type: application/json' \
  -d '{"playerId":"codex-black-test","action":"join"}'
curl -s --max-time 20 'http://47.121.182.144/api/rooms/E0FCE0?playerId=codex-white-test'
curl -s --max-time 20 -X POST http://47.121.182.144/api/rooms/E0FCE0 \
  -H 'Content-Type: application/json' \
  -d '{"playerId":"codex-white-test","action":"roll"}'
curl -s --max-time 20 -X POST http://47.121.182.144/api/rooms/E0FCE0 \
  -H 'Content-Type: application/json' \
  -d '{"playerId":"codex-white-test","action":"move","from":12,"to":6}'
```

Result:

```txt
Public app endpoint returned HTTP 200.
PM2 process shuanglu is online.
Nginx configuration test passed.
POST /api/rooms created room E0FCE0 and seated creator as white.
POST /api/rooms/E0FCE0 with join seated second player as black.
GET /api/rooms/E0FCE0 returned the room to the white player.
POST roll updated currentRoll and diceSteps server-side.
POST move applied a legal white move from 12 to 6 and updated moveHistory.
```

Operational note:

- Online rooms are in-memory in the Next.js Node process. Restarting PM2 clears active rooms.

## 2026-05-04 3D Isolated Test Route Deployment

Status: deployed.

Source commit:

```txt
7f73e37 Isolate 3D table test route
```

Purpose:

- Keep the stable online play flow on `/`.
- Add the experimental 3D table scene behind `/3d` and the `3D测试` menu entry.
- Add shareable online room links using `?room=<ROOM_ID>`.

Deployment package:

```txt
/tmp/shuanglu-3d-isolated-7f73e37.tgz
```

Server build directory:

```txt
/opt/shuanglu_release_3d_isolated_7f73e37
```

Previous production backup:

```txt
/opt/shuanglu_backups/shuanglu_before_3d_isolated_7f73e37
```

Commands used:

```bash
tar -xzf /tmp/shuanglu-3d-isolated-7f73e37.tgz -C /opt/shuanglu_release_3d_isolated_7f73e37
cd /opt/shuanglu_release_3d_isolated_7f73e37
npm ci --no-audit --no-fund
npm run build
pm2 stop shuanglu
mv /opt/shuanglu /opt/shuanglu_backups/shuanglu_before_3d_isolated_7f73e37
mv /opt/shuanglu_release_3d_isolated_7f73e37 /opt/shuanglu
cd /opt/shuanglu
pm2 restart shuanglu --update-env
pm2 save
nginx -t
systemctl reload nginx
```

Verification:

```bash
curl -I --max-time 20 http://47.121.182.144/
curl -I --max-time 20 http://47.121.182.144/3d
curl -s --max-time 20 -X POST http://47.121.182.144/api/rooms \
  -H 'Content-Type: application/json' \
  -d '{"playerId":"codex-share-test"}'
curl -I --max-time 20 'http://47.121.182.144/?room=77E484'
```

Result:

```txt
Public root path returned HTTP 200.
Public /3d path returned HTTP 200.
POST /api/rooms created room 77E484.
Public ?room=77E484 share URL returned HTTP 200.
PM2 process shuanglu is online.
Nginx configuration test passed.
```

Operational notes:

- `camera-controls@3.1.0`, pulled by the 3D dependency stack, warns that it prefers Node >=20.11.0. The server currently runs Node 18.19.1. The production build passed, but runtime QA on `/3d` is still required.
- The stable online play flow remains available on `/`; `/3d` is experimental.

## 2026-05-05 3D Horse Scale Deployment

Status: deployed after Aliyun instance reboot and recovery.

Purpose:

- Publish the `/3d` horse-to-board scale correction.
- Stop local development services so the user's laptop does not keep running the WebGL dev server.

Local actions completed:

- Stopped local project listeners on `127.0.0.1:3001` and `127.0.0.1:3004`.
- Verified no local listener remained on ports `3001` or `3004`.
- Ran local production build successfully:

```bash
npm run build
```

Result:

```txt
Next.js production build passed.
Routes include / and /3d.
```

Deployment package:

```txt
/tmp/shuanglu-3d-scale-20260505_1458.tgz
```

Server upload target:

```txt
/tmp/shuanglu-3d-scale-20260505_1458.tgz
```

Server release directory:

```txt
/opt/shuanglu_release_3d_scale_20260505_1458
```

Server actions completed before blockage:

```bash
scp /tmp/shuanglu-3d-scale-20260505_1458.tgz root@47.121.182.144:/tmp/shuanglu-3d-scale-20260505_1458.tgz
mkdir -p /opt/shuanglu_release_3d_scale_20260505_1458 /opt/shuanglu_backups
tar -xzf /tmp/shuanglu-3d-scale-20260505_1458.tgz -C /opt/shuanglu_release_3d_scale_20260505_1458
cd /opt/shuanglu_release_3d_scale_20260505_1458
npm ci --no-audit --no-fund
```

Initial blockage:

- `npm ci --no-audit --no-fund` emitted Node engine warnings already known from prior deployments, then stopped producing output.
- SSH later failed with `Connection timed out during banner exchange`.
- Public HTTP verification also timed out.
- The SSH session running `npm ci` ended with `Connection reset by peer`.

Important state boundary:

- Production PM2 cutover was not executed.
- `/opt/shuanglu` was not intentionally replaced during this attempt.
- No `pm2 restart shuanglu` or `systemctl reload nginx` command was reached.

Required recovery:

1. Reboot or recover the Aliyun instance from the provider console if SSH remains unavailable.
2. After SSH returns, inspect and stop any leftover `npm ci` process.
3. Prefer a lightweight release path because this version did not add dependencies:
   - copy `/opt/shuanglu/node_modules` into `/opt/shuanglu_release_3d_scale_20260505_1458`, or
   - run `npm ci` only after confirming the server has enough free memory and I/O headroom.
4. Build the release, then cut over PM2 only after `npm run build` succeeds.

Recovery completed:

- User rebooted the Aliyun instance from the provider side.
- SSH and public TCP connectivity recovered.
- Server uptime after recovery showed low load.
- The partial `node_modules` left by the interrupted install was incomplete and failed `next build` with `next: not found`.
- The partial dependency directory was moved out of the release root to:

```txt
/opt/shuanglu_backups/partial_node_modules/node_modules.partial_20260505_2000
```

- Copied the known-good dependency directory from current production:

```bash
cp -a /opt/shuanglu/node_modules /opt/shuanglu_release_3d_scale_20260505_1458/node_modules
```

- Rebuilt the release successfully:

```bash
cd /opt/shuanglu_release_3d_scale_20260505_1458
npm run build
```

Result:

```txt
Next.js production build passed.
Routes include / and /3d.
```

Production cutover completed:

```bash
pm2 stop shuanglu
mv /opt/shuanglu /opt/shuanglu_backups/shuanglu_before_3d_scale_20260505_2005
mv /opt/shuanglu_release_3d_scale_20260505_1458 /opt/shuanglu
cd /opt/shuanglu
pm2 restart shuanglu --update-env
pm2 save
nginx -t
systemctl reload nginx
```

Verification:

```bash
curl -I --max-time 20 http://47.121.182.144/
curl -I --max-time 20 http://47.121.182.144/3d
curl -s --max-time 20 -X POST http://47.121.182.144/api/rooms \
  -H 'Content-Type: application/json' \
  -d '{"playerId":"codex-deploy-test"}'
```

Result:

```txt
Public root path returned HTTP 200.
Public /3d path returned HTTP 200.
POST /api/rooms created room 89E372 and seated creator as white.
PM2 process shuanglu is online with cwd /opt/shuanglu.
Nginx configuration test passed.
```

Build artifact check:

```txt
.next/static/chunks/289.18259aa6c1daf79d.js contains 博物复原桌面.
.next/static/chunks/289.18259aa6c1daf79d.js contains scale:o?.4:.35.
```

Operational notes:

- Historical `shuanglu-error.log` still contains old `next: not found`, `Bus error`, and stale Server Action lines from earlier deployments. The current restart output shows `next start` ready on `127.0.0.1:3002`.
- The partial dependency directory must remain outside `/opt/shuanglu`; keeping broken dependency backups in a project root can make Next.js scan them during build.


## 2026-05-08 2D Usability Deployment

Purpose:

- Deploy the 2D board usability pass that restores clearer source selection and legal landing feedback after the bottle-shaped piece update.
- Preserve the MiniMac cloud-only runtime policy: no local Next.js service was started.

Local artifact:

```txt
/tmp/shuanglu-2d-usability-20260508-2206.tgz
```

Server release directory:

```txt
/opt/shuanglu_release_2d_usability_20260508_2206
```

Server backup directory:

```txt
/opt/shuanglu_backups/shuanglu_before_2d_usability_20260508_2206
```

Deployment method:

- Uploaded the working-tree archive to `/tmp/` on Aliyun GD.
- Extracted into a fresh release directory.
- Reused the existing production `node_modules` directory to avoid another heavy dependency install.
- Ran `npm run build` on the server.
- Replaced `/opt/shuanglu` only after the server build passed.
- Restarted only PM2 process `shuanglu`.
- Ran `nginx -t` before reloading Nginx.

Verification:

```txt
Server npm run build passed.
PM2 shuanglu is online.
Nginx configuration test passed.
http://47.121.182.144/ returned HTTP 200.
http://47.121.182.144/3d returned HTTP 200.
POST /api/rooms created room D8F1F1 and seated creator as white.
Cloud build artifacts contain 点取, 落马, and board-action-guide.
```

Non-Shuanglu services observed but not changed:

```txt
gaokao-sprint-coach online
school-application online
```


## 2026-05-09 One-Window 2D Layout Deployment

Purpose:

- Deploy the 2D layout pass that reduces top HUD height, removes the fixed-width board scroll, and makes the stable 2D board playable with less viewport dragging.
- Preserve the MiniMac cloud-only runtime policy: no local Next.js service was started.

Local artifact:

```txt
/tmp/shuanglu-one-window-2d-20260509-1929.tgz
```

Server release directory:

```txt
/opt/shuanglu_release_one_window_2d_20260509_1929
```

Server backup directory:

```txt
/opt/shuanglu_backups/shuanglu_before_one_window_2d_20260509_1929
```

Deployment method:

- Uploaded the working-tree archive to `/tmp/` on Aliyun GD.
- Extracted into a fresh release directory.
- Reused the existing production `node_modules` directory.
- Ran `npm run build` on the server.
- Replaced `/opt/shuanglu` only after the server build passed.
- Restarted only PM2 process `shuanglu`.
- Ran `nginx -t` before reloading Nginx.

Verification:

```txt
Server npm run build passed.
PM2 shuanglu is online.
Nginx configuration test passed.
http://47.121.182.144/ returned HTTP 200.
http://47.121.182.144/3d returned HTTP 200.
POST /api/rooms created room C5E553 and seated creator as white.
Cloud build artifacts contain max-w-[1780px], game-compact-hud, and min-h-[clamp(6.7rem,13.2vh,9rem)].
```

Non-Shuanglu services observed but not changed:

```txt
gaokao-sprint-coach online
school-application online
```


## 2026-05-11 2D Background Art Deployment

Purpose:

- Deploy the generated Song-era study/court background image for the stable 2D interface.
- Keep the generated scene decorative and subdued so the 2D board remains readable and playable.
- Preserve the MiniMac cloud-only runtime policy: no local Next.js service was started.

Generated workspace asset:

```txt
public/assets/backgrounds/song-study-court-bg.png
```

Local artifact:

```txt
/tmp/shuanglu-2d-bg-art-20260511-2110.tgz
```

Server release directory:

```txt
/opt/shuanglu_release_2d_bg_art_20260511_2110
```

Server backup directory:

```txt
/opt/shuanglu_backups/shuanglu_before_2d_bg_art_20260511_2110
```

Deployment method:

- Uploaded the working-tree archive to `/tmp/` on Aliyun GD.
- Extracted into a fresh release directory.
- Reused the existing production `node_modules` directory.
- Ran `npm run build` on the server.
- Replaced `/opt/shuanglu` only after the server build passed.
- Restarted only PM2 process `shuanglu`.
- Ran `nginx -t` before reloading Nginx.

Verification:

```txt
Server npm run build passed.
PM2 shuanglu is online.
Nginx configuration test passed.
http://47.121.182.144/ returned HTTP 200.
http://47.121.182.144/assets/backgrounds/song-study-court-bg.png returned HTTP 200, image/png, 1,805,345 bytes.
http://47.121.182.144/3d returned HTTP 200.
POST /api/rooms created room B3568C and seated creator as white.
Cloud build artifacts contain song-study-court-bg and game-shell-bg.
```

Non-Shuanglu services observed but not changed:

```txt
gaokao-sprint-coach online
school-application online
```
