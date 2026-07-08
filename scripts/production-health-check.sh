#!/usr/bin/env bash
set -euo pipefail

base_url="${1:-https://3d.shuanglu.uway.click}"

health_body="$(curl --silent --show-error --max-time 20 "${base_url}/health")"
if [[ "${health_body}" != "ok" ]]; then
  printf 'Health check failed: %s/health returned %q\n' "${base_url}" "${health_body}" >&2
  exit 1
fi

for path in / /3d; do
  status="$(curl --silent --show-error --location --max-time 20 --output /dev/null --write-out '%{http_code}' "${base_url}${path}")"
  if [[ "${status}" != "200" ]]; then
    printf 'Health check failed: %s%s returned %s\n' "${base_url}" "${path}" "${status}" >&2
    exit 1
  fi
  printf 'OK %s%s -> 200\n' "${base_url}" "${path}"
done
