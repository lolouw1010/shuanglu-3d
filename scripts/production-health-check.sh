#!/usr/bin/env bash
set -euo pipefail

base_url="${1:-https://shuanglu.uway.click}"

check_status() {
  local path="$1"
  local expected="$2"
  local status

  status="$(curl --silent --show-error --location --max-time 20 \
    --output /dev/null --write-out '%{http_code}' "${base_url}${path}")"

  if [[ "${status}" != "${expected}" ]]; then
    printf 'Health check failed: %s%s returned %s, expected %s\n' \
      "${base_url}" "${path}" "${status}" "${expected}" >&2
    return 1
  fi

  printf 'OK %s%s -> %s\n' "${base_url}" "${path}" "${status}"
}

health_body="$(curl --silent --show-error --max-time 20 "${base_url}/health")"
if [[ "${health_body}" != "ok" ]]; then
  printf 'Health check failed: %s/health returned %q\n' "${base_url}" "${health_body}" >&2
  exit 1
fi
printf 'OK %s/health -> ok\n' "${base_url}"

check_status "/" "200"
check_status "/3d" "200"
