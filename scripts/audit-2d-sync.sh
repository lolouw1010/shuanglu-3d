#!/usr/bin/env bash
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
baseline_file="${root}/.upstream-2d-revision"

if [[ ! -f "${baseline_file}" ]]; then
  printf 'Missing %s\n' "${baseline_file}" >&2
  exit 1
fi

baseline="$(tr -d '[:space:]' < "${baseline_file}")"
git fetch --quiet upstream-2d main

printf '%s\n' '--- upstream commits not yet reviewed ---'
git log --oneline "${baseline}..upstream-2d/main"

printf '%s\n' '--- changes in required-sync paths ---'
git diff --stat "${baseline}..upstream-2d/main" -- \
  src/game src/server src/online src/store tests
