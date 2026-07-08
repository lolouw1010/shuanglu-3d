# 3D Deployment

Status: independent Linode production configuration ready.

Public hostname: `https://3d.shuanglu.uway.click`

The 3D application must not reuse the 2D production directory, service, port, certificate, or release symlink.

## Planned Boundary

```txt
Application root: /opt/apps/shuanglu-3d
Service: shuanglu-3d.service
Internal port: 127.0.0.1:3003
Hostname: 3d.shuanglu.uway.click
```

The existing 2D production application remains:

```txt
Application root: /opt/apps/shuanglu
Service: shuanglu.service
Internal port: 127.0.0.1:3002
Hostname: shuanglu.uway.click
```

## Deployment Files

```txt
ops/systemd/shuanglu-3d.service
ops/systemd/shuanglu-3d-certbot-renew.service
ops/systemd/shuanglu-3d-certbot-renew.timer
ops/nginx/3d.shuanglu.uway.click.conf
ops/scripts/deploy-certificate.sh
scripts/deploy-production.sh
scripts/production-health-check.sh
```

The deployment script requires a clean `main` equal to `origin/main`, verifies Node dependencies, typechecks, tests, and builds locally, then creates an immutable server release. The server builds again, smoke-tests on port 3103, atomically switches `current`, and restores the previous release if port 3003 does not become ready.

## Deployment Gate

Do not create the 3D production service until all of these pass independently:

- Node.js 20 clean install.
- Typecheck.
- Rule tests.
- Production build.
- Fixed-camera desktop browser smoke test.
- Compact viewport smoke test.
- Board source/target click test.
- WebGL failure behavior.
- Independent release and rollback script review.

Run from the independent 3D repository:

```sh
./scripts/deploy-production.sh
./scripts/production-health-check.sh
```

Certificate renewal is restricted to the `3d.shuanglu.uway.click` certificate and reloads Docker Nginx only after certificate and Nginx validation succeed.

BigNAS is currently powered off and is not part of the active deployment or Git synchronization path. GitHub is authoritative until BigNAS returns.
