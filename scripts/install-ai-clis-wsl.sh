#!/usr/bin/env bash
set -euo pipefail

echo "This installer targets WSL/Linux."
echo "It will:"
echo "  1) Ensure Node.js >= 20 is available (via nvm)"
echo "  2) Install WSL-local CLIs: @google/gemini-cli and @github/copilot"
echo

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "missing required command: $1" >&2; exit 1; }
}

need_cmd bash
need_cmd curl

if ! command -v nvm >/dev/null 2>&1; then
  echo "Installing nvm..."
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
fi

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
else
  echo "nvm install completed but nvm.sh not found at $NVM_DIR/nvm.sh" >&2
  exit 1
fi

user_npmrc="${HOME}/.npmrc"
if [[ -f "$user_npmrc" ]] && grep -Eq '^(prefix|globalconfig)=' "$user_npmrc"; then
  echo "Detected incompatible npm config in $user_npmrc (prefix/globalconfig)."
  echo "Backing it up to ${user_npmrc}.bak and removing those keys (recommended for nvm)."
  cp -f "$user_npmrc" "${user_npmrc}.bak"
  # Remove only the incompatible keys; keep everything else.
  sed -i -E '/^(prefix|globalconfig)=/d' "$user_npmrc"
fi

echo "Installing Node 22 (LTS)..."
nvm install 22
nvm use 22
nvm alias default 22

echo "Installing CLIs..."
npm install -g @google/gemini-cli @github/copilot

echo
echo "Done."
echo "Next:"
echo "  - Source PATH fix for current shell: . ./scripts/fix-ai-cli-paths.sh"
echo "  - Or add this to ~/.bashrc: . /mnt/d/Enterpriseprofilebuilder/scripts/fix-ai-cli-paths.sh"
