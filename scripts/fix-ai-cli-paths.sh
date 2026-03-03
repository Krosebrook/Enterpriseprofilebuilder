#!/usr/bin/env bash
# Source this file: `. scripts/fix-ai-cli-paths.sh`
set -euo pipefail

dedupe_path() {
  awk -v RS=':' -v ORS=':' '!seen[$0]++{print}' <<<"${PATH}" | sed 's/:$//'
}

remove_path_entry() {
  local entry="$1"
  PATH="$(awk -v RS=':' -v ORS=':' -v drop="$entry" '$0!=drop{print}' <<<"${PATH}" | sed 's/:$//')"
}

prepend_path_entry() {
  local entry="$1"
  if [[ -d "$entry" ]]; then
    PATH="${entry}:${PATH}"
  fi
}

# Prefer WSL-managed npm globals and local user bin over imported Windows npm shims.
prepend_path_entry "${HOME}/.local/bin"
prepend_path_entry "${HOME}/.npm-global/bin"

# Remove Windows npm global bin if present; its shims often break under WSL (Node/toolchain mismatch).
remove_path_entry "/mnt/c/Users/${USER}/AppData/Roaming/npm"

PATH="$(dedupe_path)"
export PATH

if [[ -s "${HOME}/.nvm/nvm.sh" ]]; then
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  # shellcheck disable=SC1091
  . "${HOME}/.nvm/nvm.sh"
  nvm use default >/dev/null 2>&1 || true
fi

echo "PATH updated for this shell:"
echo " - prepended: ${HOME}/.npm-global/bin"
echo " - prepended: ${HOME}/.local/bin"
echo " - removed:   /mnt/c/Users/${USER}/AppData/Roaming/npm"
