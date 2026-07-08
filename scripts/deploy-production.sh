#!/usr/bin/env bash
set -euo pipefail

ssh_target="${SSH_TARGET:-root@linode-singapore}"
app_root="${APP_ROOT:-/opt/apps/shuanglu-3d}"
temporary_port="${TEMPORARY_PORT:-3103}"

for command in git npm ssh scp curl tar; do
  command -v "${command}" >/dev/null || {
    printf 'Required command not found: %s\n' "${command}" >&2
    exit 1
  }
done

if [[ -n "$(git status --porcelain)" ]]; then
  printf 'Refusing to deploy: the working tree is not clean.\n' >&2
  exit 1
fi

if [[ "$(git branch --show-current)" != "main" ]]; then
  printf 'Refusing to deploy: expected main branch.\n' >&2
  exit 1
fi

git fetch --quiet origin main
revision="$(git rev-parse HEAD)"
if [[ "${revision}" != "$(git rev-parse origin/main)" ]]; then
  printf 'Refusing to deploy: HEAD does not match origin/main.\n' >&2
  exit 1
fi

release_name="$(date -u +%Y%m%dT%H%M%SZ)-${revision:0:7}"
temporary_directory="$(mktemp -d -t shuanglu-3d-release)"
archive="${temporary_directory}/release.tar.gz"
trap 'rm -rf "${temporary_directory}"' EXIT

npm ci --no-audit --no-fund
npm run typecheck
npm test
npm run build

git archive --format=tar.gz --output="${archive}" "${revision}"
scp -q "${archive}" "${ssh_target}:/tmp/${release_name}.tar.gz"

ssh "${ssh_target}" bash -s -- "${app_root}" "${release_name}" "${revision}" "${temporary_port}" <<'REMOTE'
set -euo pipefail

app_root="$1"
release_name="$2"
revision="$3"
temporary_port="$4"
release_dir="${app_root}/releases/${release_name}"
archive="/tmp/${release_name}.tar.gz"
previous_release="$(readlink -f "${app_root}/current" 2>/dev/null || true)"
trap 'rm -f "${archive}"' EXIT

install -d -o shuanglu3d -g shuanglu3d -m 750 "${app_root}/releases" "${release_dir}"
tar -xzf "${archive}" -C "${release_dir}"
printf '%s\n' "${revision}" > "${release_dir}/REVISION"
chown -R shuanglu3d:shuanglu3d "${release_dir}"

sudo -u shuanglu3d env HOME="${app_root}" npm --prefix "${release_dir}" ci --no-audit --no-fund
sudo -u shuanglu3d env HOME="${app_root}" npm --prefix "${release_dir}" run build

smoke_log="/tmp/${release_name}-smoke.log"
sudo -u shuanglu3d env HOME="${app_root}" NODE_ENV=production npm --prefix "${release_dir}" start -- --hostname 127.0.0.1 --port "${temporary_port}" >"${smoke_log}" 2>&1 &
smoke_pid=$!
trap 'kill "${smoke_pid}" 2>/dev/null || true; rm -f "${archive}"' EXIT

for _ in $(seq 1 30); do
  curl --silent --fail --max-time 2 "http://127.0.0.1:${temporary_port}/" >/dev/null && break
  sleep 1
done
curl --silent --fail --max-time 5 "http://127.0.0.1:${temporary_port}/" >/dev/null
curl --silent --fail --max-time 5 "http://127.0.0.1:${temporary_port}/3d" >/dev/null
kill "${smoke_pid}" 2>/dev/null || true
wait "${smoke_pid}" 2>/dev/null || true
trap 'rm -f "${archive}"' EXIT

ln -sfn "${release_dir}" "${app_root}/current.next"
mv -Tf "${app_root}/current.next" "${app_root}/current"

live_ready=false
if systemctl restart shuanglu-3d; then
  for _ in $(seq 1 30); do
    if curl --silent --fail --max-time 2 http://127.0.0.1:3003/ >/dev/null; then
      live_ready=true
      break
    fi
    sleep 1
  done
fi

if [[ "${live_ready}" != "true" ]]; then
  if [[ -n "${previous_release}" && -d "${previous_release}" ]]; then
    ln -sfn "${previous_release}" "${app_root}/current.rollback"
    mv -Tf "${app_root}/current.rollback" "${app_root}/current"
    systemctl restart shuanglu-3d
  fi
  printf 'Deployment failed; previous release restored.\n' >&2
  exit 1
fi

systemctl is-active --quiet shuanglu-3d
printf 'Deployed revision %s from %s\n' "${revision}" "${release_dir}"
REMOTE

printf 'Production deployment completed: %s\n' "${revision}"
