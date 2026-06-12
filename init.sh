#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "== Harness verification =="
"$ROOT_DIR/.agent-harness/scripts/init.sh" "$@"

if [[ "${HARNESS_SKIP_TEST_LAYERS:-}" == "1" ]]; then
  echo "skip frontend project recovery: HARNESS_SKIP_TEST_LAYERS=1"
  exit 0
fi

echo "== Frontend toolchain =="
if ! command -v node >/dev/null 2>&1; then
  echo "node is required to verify the frontend project" >&2
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required to verify the frontend project" >&2
  exit 1
fi
node --version
npm --version

echo "== Frontend dependencies =="
(
  cd "$ROOT_DIR"
  if [[ ! -d node_modules ]]; then
    npm ci
  else
    npm ls --depth=0 >/dev/null
  fi
)

echo "== Frontend typecheck =="
(cd "$ROOT_DIR" && npm run typecheck)

echo "== Frontend tests =="
(cd "$ROOT_DIR" && npm run test -- --runInBand)

echo "== Frontend build =="
(cd "$ROOT_DIR" && npm run build)

echo "frontend project recovery passed"
