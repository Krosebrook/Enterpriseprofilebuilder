#!/usr/bin/env bash
set -euo pipefail

echo "== AI CLI Doctor =="
echo

print_cmd() {
  local name="$1"
  echo "## ${name}"
  if command -v "${name}" >/dev/null 2>&1; then
    local path
    path="$(command -v "${name}")"
    echo "path: ${path}"
  else
    echo "path: (not found)"
  fi
  "${name}" --version >/dev/null 2>&1 && echo "version: $(${name} --version 2>/dev/null | head -n 1)" || true
  echo
}

print_cmd node
print_cmd npm
print_cmd gemini
print_cmd copilot
print_cmd gh

if command -v gh >/dev/null 2>&1; then
  if gh copilot --help >/dev/null 2>&1; then
    echo "gh copilot: available"
  else
    echo "gh copilot: NOT available (install via: gh extension install github/gh-copilot)"
  fi
fi

echo
echo "== PATH checks =="
echo "$PATH" | tr ':' '\n' | nl -ba | sed -n '1,40p'
echo

windows_npm="/mnt/c/Users/${USER}/AppData/Roaming/npm"
if echo "$PATH" | tr ':' '\n' | grep -Fxq "$windows_npm"; then
  echo "warn: Windows npm global bin is in PATH: ${windows_npm}"
  echo "      This commonly breaks WSL when it shadows Linux CLIs."
fi

linux_npm="${HOME}/.npm-global/bin"
if echo "$PATH" | tr ':' '\n' | grep -Fxq "$linux_npm"; then
  echo "ok: WSL npm global bin is in PATH: ${linux_npm}"
else
  echo "warn: WSL npm global bin is NOT in PATH: ${linux_npm}"
  echo "      Add it so WSL-installed CLIs are found first."
fi

