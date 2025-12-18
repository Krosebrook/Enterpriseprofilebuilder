
  # Enterprise Profile Builder

  This is a code bundle for Enterprise Profile Builder. The original project is available at https://www.figma.com/design/BxL9KerTYKvxWcSTvaoXPn/Enterprise-Profile-Builder.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## WSL: Fixing `gemini` / `copilot` CLI path issues

  If you’re on WSL and `gemini`/`copilot` resolve to Windows npm shims under `/mnt/c/.../AppData/Roaming/npm`, they often fail (Node/toolchain mismatch).

  - Diagnose: `bash scripts/doctor-ai-clis.sh`
  - Fix PATH for current shell: `. scripts/fix-ai-cli-paths.sh`
  - Install WSL-local CLIs (requires network): `bash scripts/install-ai-clis-wsl.sh`
  
