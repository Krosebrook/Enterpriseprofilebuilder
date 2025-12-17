# Kyle's Platform-Specific Setup Guide
**Version:** 1.0.0 | **Last Updated:** December 11, 2025 | **Role:** Staff Engineer (AppSec + Platform)

---

## 📱 PLATFORM OVERVIEW

Claude is available across 5 platforms. Each has unique strengths, limitations, and optimal use cases.

| Platform | Best For | Limitations | Setup Time |
|----------|----------|-------------|------------|
| **Web (claude.ai)** | Primary workspace, artifacts, long conversations | Desktop only | 5 min ✅ |
| **Mobile App** | Quick questions, voice input, on-the-go | Limited artifacts, smaller screen | 10 min |
| **Desktop App** | File integration, offline-ready, native feel | Limited availability, early access | 15 min |
| **Claude Code (CLI)** | Terminal workflows, Git integration, automation | Requires setup, command-line comfort | 30 min |
| **API Access** | Custom integrations, automation, scale | Requires coding, costs per token | 1 hour |

---

## 🌐 PLATFORM 1: WEB (claude.ai)

### Status: ✅ PRIMARY PLATFORM (Most Feature-Complete)

### Initial Setup (5 Minutes)

#### Step 1: Account & Authentication
1. Go to https://claude.ai
2. Sign in with: Google / Email / SSO (if Intinc has Enterprise)
3. Verify email (if using email auth)
4. **Security:** Enable 2FA (Settings → Security → Two-Factor Authentication)

#### Step 2: Configure System Preferences
1. Click Settings ⚙️ (top right)
2. Click **Profile** (left sidebar)
3. Scroll to **Custom Instructions** or **System Preferences**
4. Paste your v4.1 system prompt (4,500+ words)
5. Click **Save Changes**
6. **Verify:** Ask "What's my current system prompt version?" → Expect "v4.1"

#### Step 3: Enable Features
1. Settings → **Features**
2. Enable:
   - ✅ Web Search
   - ✅ Memory (View/Edit memories)
   - ✅ Artifacts
   - ✅ Code Execution
   - ✅ File Upload
3. Click **Save**

#### Step 4: Connect MCP Servers
1. Settings → **Connectors** or **Integrations**
2. Authorize these (based on your needs):
   - ✅ **GitHub** (code, PRs, issues)
   - ✅ **Linear** (project tracking)
   - ✅ **Vercel** (deployments, analytics)
   - ✅ **Stripe** (FlashFusion revenue)
   - ✅ **n8n** (workflow automation)
   - ✅ **Notion** (documentation)
   - ✅ **Slack** (team comms)
   - ✅ **Sentry** (error tracking)
   - ✅ **Figma** (design files)
3. Each connector requires OAuth authorization
4. **Test:** Ask "List my active MCP servers and their status"

#### Step 5: Configure Memory
1. Settings → **Memory**
2. Review auto-generated memories
3. **Add manually:**
   ```
   I work at Intinc as Staff Engineer (AppSec + Platform)
   I founded FlashFusion (AI-powered SaaS for creators)
   I have a daughter named Kinsley (build educational apps for her)
   I use R-I-S-E and F-L-O-W prompting frameworks
   I prefer security-first approach (OWASP, SOC 2, HIPAA)
   ```
4. **Set boundaries:**
   - Settings → Memory → **Never remember:** [Topics you want excluded]
   - Example: Personal health info, financial passwords, etc.

### Web-Specific Features

#### Artifacts (Most Powerful on Web)
- **What:** Standalone documents (code, markdown, HTML, presentations)
- **How to trigger:** 
  - Explicit: "Create an artifact with..."
  - Auto: Claude detects when content >20 lines or complex
- **Rendering:** HTML, React, SVG, Mermaid all render natively
- **Actions:**
  - View in sidebar
  - Edit and iterate
  - Download (copy to clipboard or export)
  - Share (via link, if enabled)
  - Version (iterate without losing original)

**Example:**
```
[PROD] Create a security audit checklist artifact for API endpoints.
Format: Markdown with checkboxes.
Include: OWASP Top 10, input validation, error handling, auth.
```

#### Multi-File Upload (Unique to Web)
- **Drag & drop** multiple files into chat
- **Supported types:** PDF, DOCX, CSV, XLSX, images, code files
- **Max size:** 20MB per file, 100MB total per conversation
- **Use cases:**
  - Upload codebase (5-10 files) → Ask "Review for security issues"
  - Upload P&L + budget → Ask "Analyze variances"
  - Upload design mockups → Ask "Accessibility audit"

#### Web Search (Most Seamless on Web)
- **How to enable:** Toggle "Web search" in conversation header
- **Or:** Type `/search [query]`
- **Result display:** Inline citations with source links
- **Best practices:**
  - Be specific: "Search for SaaS churn benchmarks 2024-2025"
  - Verify sources: Reuters > Medium
  - Cross-check conflicting info

#### Long Conversations (Web Handles Best)
- **Context window:** 200K tokens (~150,000 words)
- **Best practices:**
  - Periodically summarize: "Summarize key decisions so far"
  - Use artifacts to externalize large outputs
  - If performance degrades, start new conversation and reference old one

### Web Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Open search (if enabled) |
| `/` | Focus search bar |
| `Ctrl/Cmd + Enter` | Send message |
| `Esc` | Stop generation |
| `Ctrl/Cmd + Shift + C` | Copy last response |
| `Shift + Enter` | New line in input (don't send) |
| `Ctrl/Cmd + /` | Show keyboard shortcuts |

### Web Performance Tips

#### Speed Up Responses
- **Be specific** (vague prompts = clarifying questions = slower)
- **Use [SPIKE] prefix** for quick iterations
- **Limit file uploads** to relevant files only
- **Avoid re-uploading** same files (Claude remembers in conversation)

#### Reduce Token Usage (Cost Optimization)
- **Summarize large files** before asking questions
- **Use artifacts** (externalizes content from context)
- **Batch related questions** (ask 3-5 at once vs 3-5 separate messages)
- **Leverage memory** (store preferences, don't repeat explanations)

### Web Troubleshooting

#### Problem: "Claude isn't using my system preferences"
**Solution:**
1. Test: "What's my current system prompt version?"
2. If ≠ v4.1, re-paste system preferences
3. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
4. Clear cache: Settings → Privacy → Clear browsing data

#### Problem: "Artifacts not rendering"
**Solution:**
1. Check browser: Chrome, Edge, Firefox (latest versions)
2. Disable browser extensions (try incognito mode)
3. Check Settings → Features → Artifacts = Enabled
4. Try simpler artifact first (markdown before React)

#### Problem: "File upload failing"
**Solution:**
1. Check file size (<20MB)
2. Verify file type (PDF, DOCX, CSV, images, code)
3. Try different file or smaller version
4. Check browser console for errors (F12 → Console tab)

#### Problem: "MCP server not responding"
**Solution:**
1. Settings → Connectors → Verify server = Connected (green)
2. Try disconnecting and reconnecting
3. Check MCP provider status page (e.g., https://status.github.com)
4. Contact Anthropic support if persistent

---

## 📱 PLATFORM 2: MOBILE APP (iOS/Android)

### Status: ⚠️ SECONDARY PLATFORM (Good for On-the-Go, Limited Features)

### Initial Setup (10 Minutes)

#### Step 1: Download App
- **iOS:** App Store → Search "Claude" → Install
- **Android:** Google Play → Search "Claude" → Install
- **Requirements:** iOS 14+ or Android 8+

#### Step 2: Sign In
1. Open app
2. Sign in with same account as web (Google/Email/SSO)
3. Grant permissions:
   - ✅ Camera (for photo uploads)
   - ✅ Photos (for image uploads)
   - ✅ Microphone (for voice input)
   - ⚠️ Location (optional, for location-aware queries)

#### Step 3: Sync Settings
- **Good news:** System preferences sync from web automatically
- **Verify:** Ask "What's my current system prompt version?" → Should be v4.1
- **If not synced:** Re-paste system prompt in mobile app settings

#### Step 4: Enable Mobile-Specific Features
1. Settings (gear icon)
2. Enable:
   - ✅ Voice input (speak instead of type)
   - ✅ Camera access (photo-based queries)
   - ✅ Offline mode (limited, for cached conversations)
   - ✅ Notifications (if you want updates)

### Mobile-Specific Features

#### Voice Input (Mobile Only)
- **How:** Tap microphone icon in chat input
- **Use cases:**
  - Dictate code review notes while commuting
  - Ask questions hands-free
  - Capture thoughts quickly
- **Accuracy:** Very good for English, improving for technical terms
- **Tip:** Speak punctuation ("comma", "period", "new line")

**Example voice input:**
> "Review this function for security issues period Check for input validation comma error handling comma and secrets management period"

#### Photo Upload (Mobile Only)
- **How:** Tap camera icon → Take photo or select from library
- **Use cases:**
  - Scan whiteboard from architecture session → Ask "Convert to digital diagram"
  - Photo of error message → Ask "What's causing this?"
  - Screenshot of UI → Ask "Accessibility audit"
  - Photo of handwritten notes → Ask "Transcribe and organize"

**Example:**
1. Take photo of whiteboard (architecture diagram)
2. Upload to Claude
3. Ask: "Convert this architecture to Mermaid diagram artifact"

#### Quick Share (Mobile Only)
- **iOS:** Share sheet → Select Claude → Ask question about shared content
- **Android:** Share → Claude → Ask question
- **Use cases:**
  - Share article URL → Ask "Summarize key points"
  - Share PDF → Ask "Extract action items"
  - Share image → Ask "Describe this"

### Mobile Gestures

| Gesture | Action |
|---------|--------|
| **Tap & hold message** | Copy message text |
| **Swipe left on message** | Delete message |
| **Swipe right on message** | Re-generate response |
| **Pull down** | Refresh conversation list |
| **Pinch to zoom** | (on images in chat) |

### Mobile Limitations

❌ **Not Available on Mobile:**
- Complex artifacts (HTML/React render as code only)
- Code execution (Python sandbox not available)
- Multi-file uploads (1 file at a time only)
- MCP server integrations (no GitHub/Linear/etc. access)
- Advanced formatting (limited markdown rendering)

✅ **Available on Mobile:**
- Basic chat (Q&A, explanations, brainstorming)
- Web search (same as desktop)
- Memory (synced from web)
- File upload (1 at a time: PDF, images, DOCX)
- Voice input and photo uploads
- Markdown artifacts (view and copy code)

### Mobile Best Practices

#### Optimize for Small Screen
- **Ask concise questions** (verbose answers hard to read)
- **Request bullet points** over paragraphs
- **Use voice input** for longer questions
- **Switch to web** for complex work (artifacts, multi-file)

#### Use Mobile for Specific Scenarios
✅ **Great for:**
- Quick questions while away from desk
- Voice-to-text idea capture
- Photo-based queries (whiteboards, screenshots, errors)
- Reading/reviewing outputs from earlier web sessions
- On-call incident triage (quick diagnostics)

❌ **Not great for:**
- Architecture design (need artifacts)
- Multi-file code review (desktop better)
- Long conversations (context harder to track)
- Complex debugging (limited code execution)

### Mobile Troubleshooting

#### Problem: "Voice input not working"
**Solution:**
1. Check microphone permission: Settings → Privacy → Microphone → Claude = ON
2. Ensure quiet environment (reduce background noise)
3. Speak clearly, moderate pace
4. Try dictation mode instead of continuous speech

#### Problem: "Photo upload failing"
**Solution:**
1. Check photo permission: Settings → Privacy → Photos → Claude = ON
2. Reduce photo size (try lower resolution)
3. Check file format (JPG, PNG, HEIC supported)
4. Ensure good lighting (affects OCR quality)

#### Problem: "App crashes frequently"
**Solution:**
1. Update app (App Store/Play Store)
2. Restart phone
3. Clear app cache: Settings → Apps → Claude → Clear Cache
4. Reinstall app if persistent

---

## 💻 PLATFORM 3: DESKTOP APP (macOS/Windows/Linux)

### Status: ⚠️ EARLY ACCESS (Not Widely Available Yet)

### Initial Setup (15 Minutes)

#### Step 1: Download Desktop App
- **Official source:** https://claude.ai/download (when available)
- **Platforms:** macOS 11+, Windows 10+, Linux (Ubuntu 20.04+)
- **Size:** ~150MB

#### Step 2: Install
- **macOS:** Open .dmg → Drag to Applications → Launch
- **Windows:** Run installer .exe → Follow prompts
- **Linux:** .deb or .AppImage → Follow distro-specific instructions

#### Step 3: Sign In
1. Launch Claude desktop app
2. Sign in (same account as web)
3. Grant permissions:
   - ✅ File system access (for file uploads)
   - ✅ Notifications (optional)
   - ⚠️ Accessibility (macOS, for global hotkeys)

#### Step 4: Configure Desktop-Specific Settings
1. Preferences → General
   - Launch at startup (Yes/No)
   - Global hotkey (e.g., Cmd+Shift+C to open)
   - Theme (Light/Dark/Auto)
2. Preferences → Privacy
   - Offline mode settings
   - Cache size limits

### Desktop-Specific Features

#### Native File Access (Desktop Only)
- **Drag & drop** files from Finder/Explorer directly into chat
- **File paths work:** `/Users/kyle/projects/flashfusion/src/api.ts`
- **Faster uploads:** No browser upload latency

**Example:**
1. Drag `/project/security-audit.md` into Claude
2. Ask: "Review this audit report, flag gaps"

#### Global Hotkey (Desktop Only)
- **Configure:** Preferences → Keyboard → Global hotkey
- **Default:** `Cmd+Shift+C` (macOS) or `Ctrl+Shift+C` (Windows/Linux)
- **Use case:** Activate Claude from anywhere, anytime
  - Writing code in VS Code → Hotkey → Ask Claude
  - Reading email → Hotkey → Summarize thread

#### Offline Mode (Experimental)
- **How:** Preferences → Offline → Enable
- **What works offline:**
  - View cached conversations
  - Copy/paste previous outputs
  - Search conversation history
- **What doesn't work:**
  - New questions (requires internet)
  - Web search
  - MCP servers
  - File uploads

#### System Integration
- **Clipboard access:** Copy code from IDE → Hotkey → Paste in Claude (auto-detects)
- **Notifications:** Desktop notifications for long-running tasks
- **Menu bar icon:** (macOS) Quick access from menu bar

### Desktop Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + N` | New conversation |
| `Cmd/Ctrl + O` | Open conversation |
| `Cmd/Ctrl + W` | Close conversation |
| `Cmd/Ctrl + ,` | Preferences |
| `Cmd/Ctrl + Q` | Quit app |
| `Cmd/Ctrl + Shift + C` | Global hotkey (if enabled) |
| `Cmd/Ctrl + F` | Search conversations |

### Desktop vs Web: Feature Comparison

| Feature | Web | Desktop | Winner |
|---------|-----|---------|--------|
| Artifacts | ✅ Full support | ✅ Full support | Tie |
| Code Execution | ✅ Yes | ✅ Yes | Tie |
| File Upload | ✅ Drag & drop | ✅ **Native file picker** | Desktop |
| MCP Servers | ✅ Yes | ✅ Yes | Tie |
| Global Hotkey | ❌ No | ✅ **Yes** | Desktop |
| Offline Mode | ❌ No | ✅ **Limited** | Desktop |
| Cross-device sync | ✅ **Automatic** | ⚠️ Manual | Web |
| Performance | ⚠️ Browser-dependent | ✅ **Native** | Desktop |

### Desktop Best Practices

#### When to Use Desktop Over Web
✅ **Use Desktop when:**
- Working with local files frequently (upload 5+ files per day)
- Need global hotkey for quick access
- Prefer native app feel (faster, less browser overhead)
- Want offline access to conversation history
- Privacy-conscious (less browser tracking)

#### When to Use Web Over Desktop
✅ **Use Web when:**
- Switching between devices (phone → laptop → tablet)
- Collaborating (sharing links to conversations)
- Testing new features (web gets updates first)
- No admin rights to install apps

### Desktop Troubleshooting

#### Problem: "App won't launch"
**Solution:**
1. Check OS version (macOS 11+, Windows 10+, Ubuntu 20.04+)
2. Try re-installing (fresh download)
3. Check error logs:
   - macOS: `~/Library/Logs/Claude/`
   - Windows: `%APPDATA%\Claude\logs\`
   - Linux: `~/.config/Claude/logs/`

#### Problem: "Global hotkey not working"
**Solution:**
1. Check hotkey conflicts (another app using same combo?)
2. Grant accessibility permission (macOS: System Preferences → Security & Privacy → Accessibility → Claude)
3. Try different hotkey combination

#### Problem: "Slow performance"
**Solution:**
1. Check RAM usage (Task Manager/Activity Monitor)
2. Clear cache: Preferences → Advanced → Clear Cache
3. Reduce cached conversations: Preferences → Storage → Limit = 50

---

## 🖥️ PLATFORM 4: CLAUDE CODE (CLI)

### Status: 🚀 ADVANCED (Terminal-First, Requires Setup)

### Initial Setup (30 Minutes)

#### Step 1: Prerequisites
```bash
# Check Node.js version (need 18+)
node --version  # Should be v18.0.0 or higher

# Check npm version
npm --version  # Should be 8.0.0 or higher

# If missing, install Node.js from nodejs.org
```

#### Step 2: Install Claude Code CLI
```bash
# Install globally via npm
npm install -g @anthropic-ai/claude-code

# Verify installation
claude-code --version

# Should output: claude-code v1.x.x
```

#### Step 3: Authenticate
```bash
# Initialize auth
claude-code auth login

# This opens browser → Sign in → Authorize CLI
# Token is saved to ~/.claude-code/config.json
```

#### Step 4: Configure Default Settings
```bash
# Create config file
claude-code config init

# Edit ~/.claude-code/config.json
# Set defaults:
{
  "model": "claude-sonnet-4-5-20250929",
  "max_tokens": 4096,
  "temperature": 0.7,
  "system_prompt_path": "~/system-prompt-v4.1.txt",
  "mcp_servers": [
    {"name": "github", "url": "https://api.github.com/mcp"},
    {"name": "linear", "url": "https://mcp.linear.app/mcp"}
  ]
}
```

#### Step 5: Test Installation
```bash
# Simple test
claude-code chat "What's my current system prompt version?"

# Expected output: "v4.1 - Staff Engineer (AppSec + Platform)"
```

### Claude Code CLI Commands

#### Basic Chat
```bash
# Interactive mode (conversation)
claude-code chat

# Single question
claude-code chat "Review this code for security issues"

# With file input
claude-code chat "Audit this file" --file ./api.ts

# With system prompt override
claude-code chat "Explain this" --system "You are a security expert"
```

#### File Operations
```bash
# Generate code
claude-code generate "Python script to validate CSV" --output validate.py

# Review existing file
claude-code review ./src/auth.ts --focus security

# Diff/edit file
claude-code edit ./config.yaml --instruction "Add rate limiting config"

# Batch review (all files in directory)
claude-code review ./src/**/*.ts --format json > review-report.json
```

#### Git Integration
```bash
# Review PR before creating
claude-code review-pr --branch feature/auth-v2

# Generate commit message
git diff --staged | claude-code commit-msg

# Explain git diff
git diff main..feature | claude-code explain

# Generate PR description
claude-code pr-description --base main --head feature/auth
```

#### MCP Server Integration
```bash
# List active MCP servers
claude-code mcp list

# Test MCP server
claude-code mcp test github

# Call MCP tool directly
claude-code mcp call github list_repos --org krosebrook

# Create Linear issue from CLI
claude-code mcp call linear create_issue \
  --title "Security: Review auth flow" \
  --description "Found in code review" \
  --priority high
```

#### Workflow Automation
```bash
# Run pre-commit hook (security scan)
claude-code workflow run pre-commit

# Run nightly security audit
claude-code workflow run security-audit --schedule "0 2 * * *"

# Custom workflow
claude-code workflow run --file .claude/workflows/deploy-check.yml
```

### CLI Best Practices

#### Shell Aliases for Efficiency
Add to `~/.bashrc` or `~/.zshrc`:
```bash
# Quick chat
alias cc='claude-code chat'

# Security review
alias cc-sec='claude-code review --focus security'

# Generate commit message
alias cc-commit='git diff --staged | claude-code commit-msg'

# PR description
alias cc-pr='claude-code pr-description'

# Explain error
alias cc-explain='claude-code explain'
```

**Usage:**
```bash
cc "What's wrong with this function?"
cc-sec ./src/api.ts
cc-commit  # Generates commit message from staged changes
```

#### Scripting with Claude Code
```bash
#!/bin/bash
# File: security-check.sh
# Daily security audit script

echo "Running security audit..."

# 1. Review all TypeScript files
claude-code review ./src/**/*.ts \
  --focus security \
  --format json \
  --output security-report.json

# 2. Check for secrets
claude-code scan-secrets ./src \
  --output secrets-report.json

# 3. Generate summary
claude-code summarize \
  --files security-report.json secrets-report.json \
  --output daily-security-summary.md

# 4. Create Linear issue if critical findings
CRITICAL_COUNT=$(jq '.findings[] | select(.severity=="critical") | length' security-report.json)

if [ "$CRITICAL_COUNT" -gt 0 ]; then
  claude-code mcp call linear create_issue \
    --title "CRITICAL: $CRITICAL_COUNT security findings" \
    --description "$(cat daily-security-summary.md)" \
    --priority urgent \
    --assignee kyle
fi

echo "Audit complete. Report: daily-security-summary.md"
```

#### Pipe to Claude
```bash
# Pipe error logs to Claude for analysis
tail -f /var/log/app.log | grep ERROR | claude-code explain

# Pipe test failures
npm test 2>&1 | grep FAIL | claude-code debug

# Pipe system metrics
top -l 1 | claude-code analyze --focus performance
```

### CLI Advanced Features

#### Context Management
```bash
# Save conversation context
claude-code context save --name auth-review

# Load context in new session
claude-code chat --context auth-review

# List saved contexts
claude-code context list

# Delete old contexts
claude-code context delete auth-review
```

#### Custom Tools (Extend Claude)
```bash
# Create custom tool definition
cat > ~/.claude-code/tools/security-scan.json <<EOF
{
  "name": "security_scan",
  "description": "Run OWASP ZAP scan",
  "parameters": {
    "url": {"type": "string", "required": true},
    "depth": {"type": "integer", "default": 3}
  },
  "command": "zap-cli quick-scan --self-contained {{url}} --depth {{depth}}"
}
EOF

# Use custom tool
claude-code chat "Scan https://flashfusion.app for vulnerabilities" \
  --tool security_scan
```

#### Batch Processing
```bash
# Review all PRs in repo
for pr in $(gh pr list --json number --jq '.[].number'); do
  claude-code review-pr --pr $pr --output review-pr-$pr.md
done

# Audit all repos in GitHub org
for repo in $(gh repo list krosebrook --json name --jq '.[].name'); do
  gh repo clone krosebrook/$repo
  claude-code review ./$repo --focus security --output audit-$repo.json
done
```

### CLI Troubleshooting

#### Problem: "Authentication failed"
**Solution:**
```bash
# Re-authenticate
claude-code auth logout
claude-code auth login

# Check token
cat ~/.claude-code/config.json | jq '.auth_token'

# If expired, login again
```

#### Problem: "MCP server not found"
**Solution:**
```bash
# List configured servers
claude-code mcp list

# Test connectivity
claude-code mcp test [server-name]

# Re-add server
claude-code mcp add github https://api.github.com/mcp
```

#### Problem: "Command not found: claude-code"
**Solution:**
```bash
# Check if installed globally
npm list -g @anthropic-ai/claude-code

# If missing, reinstall
npm install -g @anthropic-ai/claude-code

# Add npm global bin to PATH (if needed)
export PATH="$PATH:$(npm config get prefix)/bin"
```

---

## 🔌 PLATFORM 5: API ACCESS (For Developers)

### Status: 🔧 ADVANCED (Programmatic Access, Custom Integrations)

### Initial Setup (1 Hour)

#### Step 1: Get API Key
1. Go to https://console.anthropic.com
2. Sign in (same account or separate API account)
3. Navigate to **API Keys**
4. Click **Create Key**
5. Name it: "Kyle - FlashFusion Development"
6. Copy key (starts with `sk-ant-api03-...`)
7. **Store securely:** 
   ```bash
   # Add to ~/.bashrc or ~/.zshrc
   export ANTHROPIC_API_KEY="sk-ant-api03-..."
   
   # Or use .env file (for projects)
   echo "ANTHROPIC_API_KEY=sk-ant-api03-..." > .env
   ```

#### Step 2: Install SDK
```bash
# Python
pip install anthropic --break-system-packages

# Node.js
npm install @anthropic-ai/sdk

# Verify
python -c "import anthropic; print(anthropic.__version__)"
# OR
node -e "console.log(require('@anthropic-ai/sdk').VERSION)"
```

#### Step 3: Test Connection
**Python:**
```python
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)

message = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What's my system prompt version?"}
    ]
)

print(message.content[0].text)
# Expected: "I don't have a system prompt in API mode. You need to send it per request."
```

**Node.js:**
```javascript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await client.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1024,
  messages: [
    {role: 'user', content: 'Hello, Claude!'}
  ],
});

console.log(message.content[0].text);
```

### API Usage Patterns

#### Basic Request with System Prompt
```python
import anthropic
import os

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# Load your v4.1 system prompt
with open('system-prompt-v4.1.txt', 'r') as f:
    system_prompt = f.read()

message = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    system=system_prompt,  # Your v4.1 prompt here
    messages=[
        {
            "role": "user", 
            "content": "[PROD] Review this function for security issues: [CODE]"
        }
    ]
)

print(message.content[0].text)
```

#### Streaming Responses
```python
# Python
with client.messages.stream(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    system=system_prompt,
    messages=[{"role": "user", "content": "Explain how JWT works"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

```javascript
// Node.js
const stream = await client.messages.stream({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  system: systemPrompt,
  messages: [{role: 'user', content: 'Explain OAuth 2.0'}],
});

for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta') {
    process.stdout.write(chunk.delta.text);
  }
}
```

#### Multi-Turn Conversations
```python
# Maintain conversation history
conversation = []

# Turn 1
conversation.append({
    "role": "user",
    "content": "Design a secure auth system for FlashFusion"
})

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    system=system_prompt,
    messages=conversation
)

conversation.append({
    "role": "assistant",
    "content": response.content[0].text
})

# Turn 2 (with context from Turn 1)
conversation.append({
    "role": "user",
    "content": "Now add 2FA support"
})

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    system=system_prompt,
    messages=conversation
)
```

#### File Upload (Vision)
```python
import base64

# Read image
with open('architecture-diagram.png', 'rb') as f:
    image_data = base64.standard_b64encode(f.read()).decode('utf-8')

message = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": image_data
                    }
                },
                {
                    "type": "text",
                    "text": "Convert this architecture diagram to Mermaid syntax"
                }
            ]
        }
    ]
)
```

#### Using MCP Servers via API
```python
message = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    system=system_prompt,
    messages=[
        {
            "role": "user",
            "content": "Create a Linear issue: Security review needed for auth flow"
        }
    ],
    mcp_servers=[
        {
            "type": "url",
            "url": "https://mcp.linear.app/mcp",
            "name": "linear"
        }
    ]
)
```

### API Best Practices

#### Token Optimization
```python
# Count tokens before sending (approximation)
def estimate_tokens(text):
    return len(text) // 4  # Rough estimate: 1 token ≈ 4 chars

user_input = "Review this 500-line file..."
estimated_tokens = estimate_tokens(user_input)

if estimated_tokens > 100000:
    print("Warning: This request may be expensive. Consider summarizing first.")
```

#### Error Handling
```python
from anthropic import APIError, RateLimitError, APITimeoutError

try:
    message = client.messages.create(...)
except RateLimitError as e:
    print(f"Rate limit hit. Retry after: {e.retry_after} seconds")
    time.sleep(e.retry_after)
    # Retry request
except APITimeoutError:
    print("Request timed out. Try shorter input or increase timeout.")
except APIError as e:
    print(f"API error: {e.status_code} - {e.message}")
```

#### Rate Limiting
```python
import time
from collections import deque

class RateLimiter:
    def __init__(self, max_requests_per_minute=50):
        self.max_rpm = max_requests_per_minute
        self.requests = deque()
    
    def wait_if_needed(self):
        now = time.time()
        # Remove requests older than 1 minute
        while self.requests and self.requests[0] < now - 60:
            self.requests.popleft()
        
        if len(self.requests) >= self.max_rpm:
            sleep_time = 60 - (now - self.requests[0])
            print(f"Rate limit reached. Sleeping {sleep_time:.2f}s")
            time.sleep(sleep_time)
        
        self.requests.append(time.time())

# Usage
limiter = RateLimiter(max_requests_per_minute=50)

for task in tasks:
    limiter.wait_if_needed()
    response = client.messages.create(...)
```

#### Caching (Prompt Caching)
```python
# For repeated queries with same system prompt, use prompt caching
# (Currently in beta, check Anthropic docs for latest)

message = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    system=[
        {
            "type": "text",
            "text": system_prompt,
            "cache_control": {"type": "ephemeral"}  # Cache this
        }
    ],
    messages=[{"role": "user", "content": "Quick question..."}]
)

# Subsequent requests with same system prompt = faster + cheaper
```

### API Use Cases for Kyle

#### Automated Security Scanning (CI/CD)
```python
# File: .github/workflows/security-scan.yml
# Trigger on every PR

import anthropic
import sys

def scan_pr_files(files):
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    
    findings = []
    for file in files:
        with open(file, 'r') as f:
            code = f.read()
        
        response = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=4096,
            system=load_system_prompt(),
            messages=[{
                "role": "user",
                "content": f"[PROD] Security review:\n\n```\n{code}\n```"
            }]
        )
        
        findings.append({
            "file": file,
            "review": response.content[0].text
        })
    
    return findings

# Run on PR files
if __name__ == "__main__":
    changed_files = sys.argv[1:]  # From git diff
    results = scan_pr_files(changed_files)
    
    # Post to Linear if critical findings
    for result in results:
        if "CRITICAL" in result["review"]:
            create_linear_issue(result)
```

#### FlashFusion Creator Support Bot
```python
# Automated support ticket analysis
def analyze_support_ticket(ticket):
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    
    response = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=2048,
        system="""You are FlashFusion support assistant.
        Analyze support tickets and suggest responses.
        Focus: Brand kit issues, publishing errors, payment questions.""",
        messages=[{
            "role": "user",
            "content": f"Ticket: {ticket['title']}\n\n{ticket['description']}"
        }]
    )
    
    return {
        "category": extract_category(response),
        "suggested_response": response.content[0].text,
        "priority": extract_priority(response)
    }
```

#### Batch Documentation Generation
```python
# Generate API docs for all endpoints
def generate_api_docs(endpoints):
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    
    docs = []
    for endpoint in endpoints:
        response = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=4096,
            messages=[{
                "role": "user",
                "content": f"""[PROD] Generate OpenAPI 3.0 docs for:
                
                Endpoint: {endpoint['path']}
                Method: {endpoint['method']}
                Code: {endpoint['handler_code']}
                
                Include: Request schema, response schema, examples, error codes."""
            }]
        )
        
        docs.append({
            "endpoint": endpoint['path'],
            "documentation": response.content[0].text
        })
    
    return docs
```

### API Monitoring & Analytics

#### Track Usage
```python
# Log every API call for analysis
import logging

logging.basicConfig(filename='claude-api-usage.log', level=logging.INFO)

def log_api_call(request, response):
    logging.info({
        "timestamp": time.time(),
        "model": request["model"],
        "input_tokens": response.usage.input_tokens,
        "output_tokens": response.usage.output_tokens,
        "cost": calculate_cost(response.usage),
        "latency_ms": response.latency_ms
    })

# After each call
response = client.messages.create(...)
log_api_call(request_data, response)
```

#### Cost Tracking
```python
# Calculate costs (as of Dec 2025, check latest pricing)
def calculate_cost(usage):
    # Claude Sonnet 4.5 pricing (example, verify current rates)
    input_cost_per_mtok = 3.00   # $3 per million input tokens
    output_cost_per_mtok = 15.00  # $15 per million output tokens
    
    input_cost = (usage.input_tokens / 1_000_000) * input_cost_per_mtok
    output_cost = (usage.output_tokens / 1_000_000) * output_cost_per_mtok
    
    return input_cost + output_cost

# Track daily spend
daily_spend = 0.0
for call in api_calls_today:
    daily_spend += calculate_cost(call.usage)

if daily_spend > 50.00:  # Alert if >$50/day
    send_alert("API spend exceeds budget!")
```

### API Troubleshooting

#### Problem: "API key invalid"
**Solution:**
```bash
# Verify key is set
echo $ANTHROPIC_API_KEY

# Should start with sk-ant-api03-
# If not set, re-export
export ANTHROPIC_API_KEY="sk-ant-api03-..."

# Test key
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-sonnet-4-5-20250929","max_tokens":10,"messages":[{"role":"user","content":"test"}]}'
```

#### Problem: "Rate limit exceeded"
**Solution:**
- Implement rate limiter (see code above)
- Batch requests (combine multiple questions)
- Upgrade plan (higher rate limits for paid tiers)
- Retry with exponential backoff

#### Problem: "Request too large"
**Solution:**
- Check total tokens (input + context) < 200K
- Summarize large files before sending
- Split into multiple requests
- Use prompt caching for repeated system prompts

---

## 🔄 PLATFORM COMPARISON MATRIX

| Feature | Web | Mobile | Desktop | CLI | API |
|---------|-----|--------|---------|-----|-----|
| **Ease of Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Artifacts** | ✅ Full | ⚠️ Limited | ✅ Full | ✅ Full | ✅ Via Code |
| **Code Execution** | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **MCP Servers** | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **File Upload** | ✅ Multi | ✅ Single | ✅ Native | ✅ CLI | ✅ Programmatic |
| **Voice Input** | ❌ No | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Photo Upload** | ⚠️ Manual | ✅ Camera | ⚠️ Manual | ❌ No | ✅ Base64 |
| **Global Hotkey** | ❌ No | ❌ No | ✅ Yes | ⚠️ Alias | N/A |
| **Offline Mode** | ❌ No | ⚠️ Limited | ✅ Yes | ❌ No | ❌ No |
| **Automation** | ❌ No | ❌ No | ❌ No | ✅ Scripts | ✅ Full |
| **Cost** | Free tier | Free tier | Free tier | Free tier | Pay per token |
| **Best For** | Primary work | Quick Q&A | Local files | Git workflow | Integration |

---

## 🎯 PLATFORM SELECTION GUIDE

### Daily Workflow Recommendation (Kyle's Setup)

**Morning (8am - 12pm): Desktop App**
- Launch via global hotkey
- Review overnight alerts (GitHub, Linear, Sentry)
- Security code reviews (drag files from VS Code)
- Architecture planning sessions

**Midday (12pm - 2pm): Mobile App**
- Lunch break quick questions
- Voice input for ideas/notes
- Photo whiteboard diagrams from meetings
- Quick status checks

**Afternoon (2pm - 6pm): Web Browser**
- Deep work (architecture, documentation)
- Multi-file uploads (large codebases)
- Artifact creation (presentations, reports)
- Collaboration (sharing links with team)

**Evening (6pm+): CLI**
- Pre-commit hooks (automated security scans)
- Git workflow (PR reviews, commit messages)
- Batch processing (audit all repos)
- Automation scripts (nightly security checks)

**Background: API**
- CI/CD integration (automated PR reviews)
- FlashFusion support bot (ticket analysis)
- Scheduled jobs (daily security audits)
- Custom integrations (Linear, Notion, Slack)

### Platform-Specific Scenarios

| Scenario | Recommended Platform | Why |
|----------|---------------------|-----|
| **Security code review** | Desktop or CLI | Native file access, terminal integration |
| **Quick question on-the-go** | Mobile | Voice input, always available |
| **Architecture design** | Web | Artifacts render best, collaboration |
| **Git workflow** | CLI | Direct Git integration, automation |
| **Team collaboration** | Web | Share links, co-working |
| **Automated scanning** | API | Programmatic, CI/CD integration |
| **Whiteboard photo → diagram** | Mobile | Camera access, OCR |
| **Multi-file codebase review** | Web or Desktop | Drag & drop multiple files |
| **Daily standup prep** | CLI | Script to fetch GitHub/Linear updates |
| **Late-night debugging** | Desktop | Global hotkey, offline mode |

---

## 📋 PLATFORM SETUP CHECKLIST

### Web (claude.ai) - ✅ Complete This First
- [ ] Create account and verify email
- [ ] Enable 2FA (Settings → Security)
- [ ] Paste v4.1 system prompt (Settings → Profile → Custom Instructions)
- [ ] Enable features (Web Search, Memory, Artifacts, Code Execution)
- [ ] Connect MCP servers (GitHub, Linear, Vercel, Stripe, n8n, Notion, Slack, Sentry)
- [ ] Configure memory (add work context, FlashFusion, preferences)
- [ ] Test: "What's my current system prompt version?" → "v4.1"
- [ ] Bookmark claude.ai

### Mobile - ⚠️ Setup When Needed
- [ ] Download app (iOS App Store or Google Play)
- [ ] Sign in (same account as web)
- [ ] Grant permissions (camera, microphone, photos)
- [ ] Test voice input (tap microphone icon)
- [ ] Test photo upload (tap camera icon)
- [ ] Enable notifications (if desired)

### Desktop - ⚠️ Optional (Early Access)
- [ ] Download from https://claude.ai/download (when available)
- [ ] Install and sign in
- [ ] Configure global hotkey (Preferences → Keyboard)
- [ ] Test file drag & drop
- [ ] Enable offline mode (Preferences → Offline)

### CLI (Claude Code) - ⚠️ For Power Users
- [ ] Install Node.js 18+ (`node --version`)
- [ ] Install CLI (`npm install -g @anthropic-ai/claude-code`)
- [ ] Authenticate (`claude-code auth login`)
- [ ] Configure defaults (`claude-code config init`)
- [ ] Set system prompt path in config
- [ ] Add shell aliases (`.bashrc` or `.zshrc`)
- [ ] Test: `cc "Hello"` (if alias set)

### API - 🔧 For Developers
- [ ] Get API key (https://console.anthropic.com → API Keys)
- [ ] Store securely (`export ANTHROPIC_API_KEY=...`)
- [ ] Install SDK (`pip install anthropic` or `npm install @anthropic-ai/sdk`)
- [ ] Test connection (Python or Node.js script)
- [ ] Load system prompt from file
- [ ] Implement rate limiting
- [ ] Set up error handling
- [ ] Configure logging and cost tracking

---

## 🚀 NEXT STEPS

1. **Complete Web setup first** (primary platform, most features)
2. **Install mobile app** (for on-the-go access)
3. **Try CLI** (if comfortable with terminal)
4. **Explore API** (for automation needs)
5. **Desktop app** (when available, for local file workflows)

---

**Related Guides:**
- Personal Quick Reference Guide (daily shortcuts, troubleshooting)
- Extensions & Integrations Guide (browser, VS Code, Slack, Zapier)
- Interactive Prompting Guide (frameworks, examples, self-assessment)

---

**Last Updated:** December 11, 2025  
**Maintained By:** Kyle  
**Version:** 1.0.0
