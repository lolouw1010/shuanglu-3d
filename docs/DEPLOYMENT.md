# 3D Deployment

Status: not deployed.

The 3D application must not reuse the 2D production directory, service, port, certificate, or release symlink.

## Planned Boundary

```txt
Application root: /opt/apps/shuanglu-3d
Service: shuanglu-3d.service
Internal port: 127.0.0.1:3003
Planned hostname: 3d.shuanglu.uway.click
```

The existing 2D production application remains:

```txt
Application root: /opt/apps/shuanglu
Service: shuanglu.service
Internal port: 127.0.0.1:3002
Hostname: shuanglu.uway.click
```

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

BigNAS is currently powered off and is not part of the active deployment or Git synchronization path. GitHub is authoritative until BigNAS returns.
