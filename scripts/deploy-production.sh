#!/usr/bin/env bash
set -euo pipefail

ssh_target="${SSH_TARGET:-root@linode-singapore}"
app_root="${APP_ROOT:-/opt/apps/shuanglu}"
temporary_port="${TEMPORARY_PORT:-3102}"

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

branch="$(git branch --show-current)"
if [[ "${branch}" != "main" ]]; then
  printf 'Refusing to deploy branch %s; expected main.\n' "${branch}" >&2
  exit 1
fi

git fetch --quiet origin main
revision="$(git rev-parse HEAD)"
origin_revision="$(git rev-parse origin/main)"
if [[ "${revision}" != "${origin_revision}" ]]; then
  printf 'Refusing to deploy: HEAD does not match origin/main.\n' >&2
  exit 1
fi

short_revision="${revision:0:7}"
release_name="$(date -u +%Y%m%dT%H%M%SZ)-${short_revision}"
temporary_directory="$(mktemp -d -t shuanglu-release)"
archive="${temporary_directory}/release.tar.gz"
trap 'rm -rf "${temporary_directory}"' EXIT

printf 'Verifying revision %s locally...\n' "${revision}"
npm ci --no-audit --no-fund
npm run typecheck
npm test
npm run build

git archive --format=tar.gz --output="${archive}" "${revision}"
scp -q "${archive}" "${ssh_target}:/tmp/${release_name}.tar.gz"

printf 'Building release %s on %s...\n' "${release_name}" "${ssh_target}"
ssh "${ssh_target}" bash -s -- \
  "${app_root}" "${release_name}" "${revision}" "${temporary_port}" <<'REMOTE'
set -euo pipefail

app_root="$1"
release_name="$2"
revision="$3"
temporary_port="$4"
release_dir="${app_root}/releases/${release_name}"
archive="/tmp/${release_name}.tar.gz"
previous_release="$(readlink -f "${app_root}/current" 2>/dev/null || true)"

cleanup() {
  rm -f "${archive}"
}
trap cleanup EXIT

install -d -o shuanglu -g shuanglu -m 750 "${app_root}/releases"
install -d -o shuanglu -g shuanglu -m 750 "${release_dir}"
tar -xzf "${archive}" -C "${release_dir}"
printf '%s\n' "${revision}" > "${release_dir}/REVISION"
chown -R shuanglu:shuanglu "${release_dir}"

sudo -u shuanglu env HOME="${app_root}" npm \
  --prefix "${release_dir}" ci --no-audit --no-fund
sudo -u shuanglu env HOME="${app_root}" npm \
  --prefix "${release_dir}" run build

smoke_log="/tmp/${release_name}-smoke.log"
sudo -u shuanglu env HOME="${app_root}" NODE_ENV=production \
  npm --prefix "${release_dir}" start -- \
  --hostname 127.0.0.1 --port "${temporary_port}" >"${smoke_log}" 2>&1 &
smoke_pid=$!
trap 'kill "${smoke_pid}" 2>/dev/null || true; cleanup' EXIT

for _ in $(seq 1 30); do
  if curl --silent --fail --max-time 2 \
    "http://127.0.0.1:${temporary_port}/" >/dev/null; then
    break
  fi
  sleep 1
done

curl --silent --fail --max-time 5 \
  "http://127.0.0.1:${temporary_port}/" >/dev/null
curl --silent --fail --max-time 5 \
  "http://127.0.0.1:${temporary_port}/3d" >/dev/null
kill "${smoke_pid}" 2>/dev/null || true
wait "${smoke_pid}" 2>/dev/null || true
trap cleanup EXIT

rm -f "${app_root}/current.next"
ln -s "${release_dir}" "${app_root}/current.next"
mv -Tf "${app_root}/current.next" "${app_root}/current"

live_ready=false
if systemctl restart shuanglu; then
  for _ in $(seq 1 30); do
    if curl --silent --fail --max-time 2 \
      http://127.0.0.1:3002/ >/dev/null; then
      live_ready=true
      break
    fi
    sleep 1
  done
fi

if [[ "${live_ready}" != "true" ]]; then
  if [[ -n "${previous_release}" && -d "${previous_release}" ]]; then
    rm -f "${app_root}/current.rollback"
    ln -s "${previous_release}" "${app_root}/current.rollback"
    mv -Tf "${app_root}/current.rollback" "${app_root}/current"
    systemctl restart shuanglu
  fi
  printf 'Deployment failed; previous release restored.\n' >&2
  exit 1
fi

systemctl is-active --quiet shuanglu
printf 'Deployed revision %s from %s\n' "${revision}" "${release_dir}"
REMOTE

"$(dirname "$0")/production-health-check.sh"
printf 'Production deployment completed: %s\n' "${revision}"
