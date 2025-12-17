# Kyle's Extensions & Integrations Guide
**Version:** 1.0.0 | **Last Updated:** December 11, 2025 | **Role:** Staff Engineer (AppSec + Platform)

---

## 📋 TABLE OF CONTENTS

1. [Browser Extensions](#browser-extensions) (Chrome, Firefox, Edge)
2. [VS Code Extension](#vs-code-extension) (IDE integration)
3. [Slack Integration](#slack-integration) (Team collaboration)
4. [Automation Platforms](#automation-platforms) (Zapier, Make, n8n)
5. [GitHub Actions](#github-actions) (CI/CD integration)
6. [Custom Integrations](#custom-integrations) (Webhooks, API, MCP)

---

## 🌐 BROWSER EXTENSIONS

### Status: ⚠️ THIRD-PARTY (Not Official Anthropic Extensions)

### Available Extensions (As of Dec 2025)

#### 1. Claude Sidebar (Unofficial)
**Platforms:** Chrome, Firefox, Edge  
**What it does:** Adds Claude to browser sidebar for quick access  
**Install:**
```
Chrome: Web Store → Search "Claude Sidebar" → Add to Chrome
Firefox: Add-ons → Search "Claude Sidebar" → Add to Firefox
Edge: Extensions → Search "Claude Sidebar" → Get
```

**Features:**
- ✅ Open Claude in sidebar (no new tab needed)
- ✅ Context menu integration ("Ask Claude about this")
- ✅ Page summarization (right-click → "Summarize with Claude")
- ✅ Keyboard shortcut (Ctrl+Shift+C to toggle sidebar)

**Setup:**
1. Install extension
2. Click extension icon → Sign in to Claude
3. Grant permissions:
   - ✅ Read page content (for summarization)
   - ⚠️ Access all websites (review privacy policy)
4. Configure shortcuts: Extensions → Keyboard shortcuts → Set hotkey

**Use Cases:**
- Reading article → Sidebar → "Summarize this article"
- Viewing competitor website → Sidebar → "Analyze this landing page for UX patterns"
- Debugging error → Sidebar → "Explain this stack trace: [paste]"

**Privacy Considerations:**
- ⚠️ Extension can read all page content
- ⚠️ May send page text to Claude API
- ✅ Use only on public websites (not confidential internal tools)
- ✅ Review extension permissions before installing

---

#### 2. Claude Context Menu (Unofficial)
**Platforms:** Chrome, Firefox  
**What it does:** Adds "Ask Claude" to right-click context menu  

**Features:**
- ✅ Right-click selected text → "Ask Claude"
- ✅ Quick definitions, explanations, translations
- ✅ Code review (select code → right-click → "Review for security")

**Install:**
```
Chrome Web Store: Search "Claude Context Menu"
```

**Setup:**
1. Install extension
2. Right-click any selected text
3. "Ask Claude about this" option appears
4. Customize prompts in extension settings

**Custom Prompts (Advanced):**
```javascript
// Extension settings → Custom prompts
{
  "Security Review": "Review this code for OWASP Top 10 vulnerabilities: {{selection}}",
  "Simplify": "Explain this in simple terms: {{selection}}",
  "Translate": "Translate to Spanish: {{selection}}"
}
```

---

#### 3. Claude Page Reader (Unofficial)
**Platforms:** Chrome  
**What it does:** Sends entire page content to Claude for analysis  

**Features:**
- ✅ One-click "Read this page to Claude"
- ✅ Automatic content extraction (removes ads, navbars)
- ✅ Supports PDFs (if browser can render)

**Use Cases:**
- Research papers → Extract key findings
- Documentation → Summarize API changes
- Long articles → TL;DR + key takeaways

---

### Browser Extension Best Practices

#### Security Guidelines
❌ **DON'T:**
- Install on work laptop without IT approval
- Use on confidential company pages (Notion, internal tools)
- Grant "access all websites" permission without review
- Share extension auth tokens

✅ **DO:**
- Install only from official stores (Chrome Web Store, Firefox Add-ons)
- Review permissions before installing
- Use on public websites only
- Revoke access if extension seems suspicious

#### Workflow Integration
**Example: Research Workflow**
1. Find article on web search
2. Click extension icon or right-click
3. "Summarize this article focusing on [topic]"
4. Claude extracts key points in sidebar
5. Copy summary to Notion research doc

**Example: Code Review**
1. View pull request on GitHub
2. Select problematic code block
3. Right-click → "Ask Claude" → "Review for security issues"
4. Claude analyzes in sidebar
5. Copy findings to PR comment

---

### Creating Your Own Browser Extension

**If no official extension exists, build custom:**

**Manifest v3 Example (Chrome):**
```json
// manifest.json
{
  "manifest_version": 3,
  "name": "Claude Quick Ask",
  "version": "1.0",
  "permissions": ["contextMenus", "activeTab"],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html"
  }
}
```

**Background Script:**
```javascript
// background.js
chrome.contextMenus.create({
  id: "askClaude",
  title: "Ask Claude: %s",
  contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const selectedText = info.selectionText;
  // Open popup with selected text
  chrome.action.openPopup();
  // Send text to popup
  chrome.storage.local.set({ query: selectedText });
});
```

**Popup Interface:**
```html
<!-- popup.html -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body { width: 400px; padding: 10px; }
    #result { max-height: 300px; overflow-y: auto; }
  </style>
</head>
<body>
  <h3>Ask Claude</h3>
  <div id="query"></div>
  <button id="send">Send to Claude</button>
  <div id="result"></div>
  
  <script src="popup.js"></script>
</body>
</html>
```

**Popup Logic:**
```javascript
// popup.js
document.getElementById('send').addEventListener('click', async () => {
  const query = document.getElementById('query').textContent;
  
  // Call Claude API
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_API_KEY',  // Store securely!
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [{ role: 'user', content: query }]
    })
  });
  
  const data = await response.json();
  document.getElementById('result').textContent = data.content[0].text;
});
```

---

## 💻 VS CODE EXTENSION

### Status: ⚠️ UNOFFICIAL (Community-Built)

### Installation

**Method 1: VS Code Marketplace**
```
1. Open VS Code
2. Extensions panel (Ctrl+Shift+X)
3. Search "Claude"
4. Install "Claude for VS Code" (check publisher reputation)
5. Reload VS Code
```

**Method 2: Manual Install (VSIX)**
```bash
# Download .vsix file from GitHub releases
code --install-extension claude-vscode-1.0.0.vsix
```

### Setup

#### Step 1: Configure API Key
```
1. VS Code → Settings (Ctrl+,)
2. Search "Claude"
3. Find "Claude: API Key"
4. Enter your Anthropic API key (starts with sk-ant-api03-)
5. Save settings
```

**Or via settings.json:**
```json
{
  "claude.apiKey": "sk-ant-api03-...",
  "claude.model": "claude-sonnet-4-5-20250929",
  "claude.maxTokens": 4096,
  "claude.systemPrompt": "You are a security-focused staff engineer..."
}
```

#### Step 2: Load System Prompt
```json
// settings.json
{
  "claude.systemPromptPath": "/Users/kyle/.claude/system-prompt-v4.1.txt"
}
```

**Create system prompt file:**
```bash
mkdir -p ~/.claude
# Copy your v4.1 prompt to this file
vim ~/.claude/system-prompt-v4.1.txt
```

### Features

#### 1. Inline Chat (Ask About Code)
**How:**
1. Select code in editor
2. Right-click → "Ask Claude"
3. Type question in chat panel
4. Claude analyzes selected code + question

**Use Cases:**
```python
# Select this function
def authenticate_user(username, password):
    query = f"SELECT * FROM users WHERE username='{username}'"
    # ... more code

# Right-click → Ask Claude → "Review for security issues"
# Claude: "SQL injection vulnerability detected on line 2..."
```

#### 2. Code Actions (Quick Fixes)
**How:**
1. Cursor on code with issue
2. Lightbulb icon appears (or Ctrl+.)
3. Select "Ask Claude to fix"

**Example:**
```javascript
// Cursor here
const response = await fetch(url);  // ⚠️ No error handling
const data = await response.json();

// Ctrl+. → "Ask Claude: Add error handling"
// Claude generates:
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Fetch failed:', error);
  throw error;  // Re-throw for caller to handle
}
```

#### 3. Code Generation
**Command Palette:**
```
Ctrl+Shift+P → "Claude: Generate Code"
Prompt: "Create a React component for user authentication form with validation"
```

**Claude generates in new editor tab:**
```tsx
import React, { useState } from 'react';

interface AuthFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!username) newErrors.username = 'Username required';
    if (password.length < 8) newErrors.password = 'Password must be 8+ chars';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(username, password);
    }
  };

  // ... rest of component
};
```

#### 4. Explain Code
**How:**
1. Select complex code
2. Right-click → "Claude: Explain"
3. Explanation appears in panel

**Example:**
```python
# Select this
@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Claude explains:
# "This is a memoized Fibonacci implementation using Python's lru_cache decorator.
# The @lru_cache stores results of recent calls (up to 128) to avoid recomputation.
# This reduces time complexity from O(2^n) to O(n) for repeated calls..."
```

#### 5. Refactor Suggestions
**How:**
1. Select code block
2. Ctrl+Shift+P → "Claude: Suggest Refactoring"
3. Claude proposes improvements

**Example:**
```javascript
// Before
function processUsers(users) {
  let result = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].active) {
      result.push({
        name: users[i].name,
        email: users[i].email
      });
    }
  }
  return result;
}

// Claude suggests:
const processUsers = (users) => 
  users
    .filter(user => user.active)
    .map(({ name, email }) => ({ name, email }));
```

#### 6. Test Generation
**How:**
1. Select function
2. Ctrl+Shift+P → "Claude: Generate Tests"
3. Test file created

**Example:**
```typescript
// Original function
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Claude generates tests:
import { validateEmail } from './validators';

describe('validateEmail', () => {
  it('should accept valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.user+tag@domain.co.uk')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
  });

  it('should reject emails with spaces', () => {
    expect(validateEmail('user @example.com')).toBe(false);
  });
});
```

### VS Code Shortcuts

**Add to keybindings.json:**
```json
[
  {
    "key": "ctrl+shift+a",
    "command": "claude.askAboutSelection",
    "when": "editorHasSelection"
  },
  {
    "key": "ctrl+shift+e",
    "command": "claude.explainSelection",
    "when": "editorHasSelection"
  },
  {
    "key": "ctrl+shift+t",
    "command": "claude.generateTests",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+shift+g",
    "command": "claude.generateCode"
  }
]
```

### VS Code Integration Workflows

#### Workflow 1: Security Code Review
```
1. Open PR in VS Code (via GitHub extension)
2. Select changed files
3. Ctrl+Shift+A → "Review all changes for security issues"
4. Claude analyzes diff
5. Copy findings → PR comment
```

#### Workflow 2: Debugging Assistant
```
1. Hit breakpoint in debugger
2. Select problematic variable
3. Ctrl+Shift+E → "Why is this value unexpected?"
4. Claude explains based on code context
5. Suggests fixes
```

#### Workflow 3: Documentation Generation
```
1. Select function
2. Ctrl+Shift+P → "Claude: Generate JSDoc"
3. Claude writes comprehensive documentation
4. Review and commit
```

### VS Code Extension Best Practices

✅ **DO:**
- Review generated code before using (don't blindly accept)
- Use for exploration and learning (ask "why" questions)
- Combine with human review (Claude assists, you decide)
- Keep API key secure (use VS Code secrets, not settings.json)

❌ **DON'T:**
- Paste confidential code (use on public/open-source projects only)
- Share API key in settings sync
- Deploy generated code without testing
- Rely 100% on Claude (always verify security-critical code)

---

## 💬 SLACK INTEGRATION

### Status: ✅ OFFICIAL ANTHROPIC CONNECTOR (If Available) or Custom Bot

### Setup: Method 1 (Official Connector)

**If Anthropic provides Slack integration:**
```
1. Slack workspace → Apps → Browse App Directory
2. Search "Claude"
3. Add to Slack
4. Authorize permissions:
   - Read messages (in channels Claude is invited to)
   - Post messages
   - Read files
5. Invite Claude to channels: /invite @Claude
```

### Setup: Method 2 (Custom Bot via API)

**Create custom Slack bot:**

#### Step 1: Create Slack App
```
1. https://api.slack.com/apps → Create New App
2. Name: "Claude Assistant"
3. Workspace: [Your workspace]
4. OAuth & Permissions → Scopes:
   - chat:write
   - channels:history
   - files:read
   - im:history
5. Install to Workspace
6. Copy Bot Token (xoxb-...)
```

#### Step 2: Deploy Bot Server
```python
# File: slack-claude-bot.py
import os
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler
import anthropic

# Initialize Slack app
app = App(token=os.environ.get("SLACK_BOT_TOKEN"))

# Initialize Claude
claude = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# System prompt
SYSTEM_PROMPT = """You are Claude, assisting the engineering team at Intinc.
Focus on security, architecture, and code review.
Be concise in Slack (aim for <500 words unless asked for detail)."""

@app.message()
def handle_message(message, say):
    # Only respond to direct mentions or DMs
    if 'bot_id' in message:
        return  # Ignore bot messages
    
    text = message['text']
    
    # Call Claude API
    response = claude.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": text}]
    )
    
    # Reply in thread
    say(
        text=response.content[0].text,
        thread_ts=message.get('thread_ts', message['ts'])
    )

@app.command("/claude")
def handle_slash_command(ack, command, say):
    ack()  # Acknowledge command
    
    query = command['text']
    
    # Call Claude
    response = claude.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": query}]
    )
    
    say(response.content[0].text)

if __name__ == "__main__":
    handler = SocketModeHandler(app, os.environ["SLACK_APP_TOKEN"])
    handler.start()
```

**Run bot:**
```bash
export SLACK_BOT_TOKEN="xoxb-..."
export SLACK_APP_TOKEN="xapp-..."  # Socket mode token
export ANTHROPIC_API_KEY="sk-ant-api03-..."

python slack-claude-bot.py
```

**Deploy to production:**
```bash
# Use systemd, Docker, or cloud service (Heroku, Railway, Fly.io)
# Example: Docker
docker build -t slack-claude-bot .
docker run -d \
  -e SLACK_BOT_TOKEN="$SLACK_BOT_TOKEN" \
  -e SLACK_APP_TOKEN="$SLACK_APP_TOKEN" \
  -e ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" \
  slack-claude-bot
```

### Slack Usage Patterns

#### Slash Commands
```
/claude What's the best way to implement rate limiting in Node.js?

/claude Review this code for security issues:
```python
def login(username, password):
    query = f"SELECT * FROM users WHERE username='{username}'"
    ...
```
```

#### Direct Messages
```
@Claude Can you explain how JWT tokens work?

@Claude I'm getting this error: [paste error message]
What's causing it?
```

#### Channel Mentions
```
In #engineering channel:
@Claude What's our current incident response protocol?

In #security channel:
@Claude Can you create a threat model for our new auth system?
```

#### File Analysis
```
1. Upload file to Slack (e.g., architecture diagram)
2. Comment: @Claude Can you convert this to Mermaid syntax?
3. Claude analyzes image → Generates diagram code
```

### Slack-Specific Features

#### Thread Support
```
User: @Claude How do we handle user sessions?
Claude: [Explains session management]
User (in thread): What about JWT vs session cookies?
Claude: [Continues conversation in thread, remembers context]
```

#### Code Formatting
```
Claude automatically formats code responses:

User: @Claude Generate a password validator
Claude:
```python
import re

def validate_password(password: str) -> tuple[bool, str]:
    if len(password) < 12:
        return False, "Password must be 12+ characters"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain uppercase"
    # ... more checks
    return True, "Password is strong"
```
```

#### Reaction-Based Actions
```python
# Advanced: React to messages for actions
@app.event("reaction_added")
def handle_reaction(event, say):
    if event['reaction'] == 'eyes':  # 👀 emoji
        # User wants Claude to review this message
        message = get_message(event['item']['channel'], event['item']['ts'])
        
        response = claude.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=2048,
            messages=[{
                "role": "user",
                "content": f"Review this for security issues:\n\n{message['text']}"
            }]
        )
        
        say(
            text=response.content[0].text,
            thread_ts=event['item']['ts']
        )
```

**Usage:**
```
User posts code snippet → React with 👀 emoji → Claude reviews in thread
```

### Slack Best Practices

#### Response Length
✅ **Keep responses concise** (Slack is fast-paced)
```python
# Configure in system prompt:
"Be concise in Slack. Aim for <500 words. Use bullet points. Link to docs for details."
```

#### Threading
✅ **Always reply in thread** (keeps channels clean)
```python
say(
    text=response_text,
    thread_ts=message.get('thread_ts', message['ts'])  # Always thread
)
```

#### Rate Limiting
✅ **Implement rate limits** (prevent abuse)
```python
from collections import defaultdict
import time

user_requests = defaultdict(list)

@app.message()
def handle_message(message, say):
    user_id = message['user']
    now = time.time()
    
    # Clean old requests (>1 hour)
    user_requests[user_id] = [
        t for t in user_requests[user_id] if now - t < 3600
    ]
    
    # Check limit (10 requests/hour)
    if len(user_requests[user_id]) >= 10:
        say("Rate limit exceeded. Try again later.")
        return
    
    user_requests[user_id].append(now)
    
    # Process message...
```

#### Error Handling
✅ **Graceful failures**
```python
try:
    response = claude.messages.create(...)
    say(response.content[0].text)
except anthropic.APIError as e:
    say(f"⚠️ Error: {e.message}. Please try again.")
except Exception as e:
    say("❌ Something went wrong. Contact @kyle for help.")
    log_error(e)
```

---

## ⚙️ AUTOMATION PLATFORMS

### Zapier Integration

#### Setup
```
1. Zapier → Create Zap
2. Trigger: [Any app] (e.g., Gmail, Typeform, Webhook)
3. Action: Webhooks by Zapier → POST
4. URL: https://api.anthropic.com/v1/messages
5. Headers:
   - Content-Type: application/json
   - x-api-key: [Your Anthropic API key]
   - anthropic-version: 2023-06-01
6. Data:
   {
     "model": "claude-sonnet-4-5-20250929",
     "max_tokens": 2048,
     "messages": [
       {"role": "user", "content": "{{trigger_data}}"}
     ]
   }
7. Test → Save
```

#### Use Cases

**Use Case 1: Email Auto-Responder**
```
Trigger: New email in Gmail (with label "Support")
Action 1: Webhooks (call Claude API)
  Prompt: "Analyze this support email and draft a response: {{email_body}}"
Action 2: Gmail → Send email (with Claude's draft)
```

**Use Case 2: Form Analysis**
```
Trigger: New Typeform response
Action 1: Webhooks (call Claude)
  Prompt: "Categorize this feedback: {{form_responses}}"
Action 2: Google Sheets → Add row (with category from Claude)
```

**Use Case 3: Slack Alert Summarization**
```
Trigger: New message in Slack channel (#alerts)
Action 1: Webhooks (call Claude)
  Prompt: "Summarize this alert and suggest next steps: {{slack_message}}"
Action 2: Slack → Post to #engineering (with summary)
```

---

### Make (Integromat) Integration

#### Setup
```
1. Make → Create Scenario
2. Add module: HTTP → Make a Request
3. Method: POST
4. URL: https://api.anthropic.com/v1/messages
5. Headers:
   Add item:
     - Name: x-api-key
     - Value: [Your API key]
   Add item:
     - Name: Content-Type
     - Value: application/json
   Add item:
     - Name: anthropic-version
     - Value: 2023-06-01
6. Body:
   {
     "model": "claude-sonnet-4-5-20250929",
     "max_tokens": 2048,
     "messages": [
       {"role": "user", "content": "{{input}}"}
     ]
   }
7. Parse response: JSON → Parse JSON
8. Map: {{content[0].text}}
```

#### Use Cases

**Use Case 1: Multi-Step Research**
```
Module 1: HTTP Request → Google Custom Search API
Module 2: Iterator → Loop through search results
Module 3: HTTP Request → Fetch each URL content
Module 4: HTTP Request → Claude API
  Prompt: "Summarize this article: {{module3.content}}"
Module 5: Google Sheets → Append row (URL, summary)
```

**Use Case 2: Image Analysis Pipeline**
```
Module 1: Webhook (receive image URL)
Module 2: HTTP → Download image
Module 3: Base64 → Encode image
Module 4: HTTP → Claude API (with vision)
  Body: {
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 2048,
    "messages": [{
      "role": "user",
      "content": [
        {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": "{{base64}}"}},
        {"type": "text", "text": "Describe this image"}
      ]
    }]
  }
Module 5: Airtable → Create record (image URL, description)
```

---

### n8n Integration (Self-Hosted)

#### Setup
```
1. n8n → Create Workflow
2. Add node: HTTP Request
3. Method: POST
4. URL: https://api.anthropic.com/v1/messages
5. Authentication: Generic Credential Type → Header Auth
   - Name: x-api-key
   - Value: {{$credentials.anthropicApiKey}}
6. Options → Add "anthropic-version" header: 2023-06-01
7. Body:
   {
     "model": "claude-sonnet-4-5-20250929",
     "max_tokens": 2048,
     "messages": [
       {"role": "user", "content": "={{$json.prompt}}"}
     ]
   }
8. Output: {{$json.content[0].text}}
```

#### Use Cases (FlashFusion-Specific)

**Use Case 1: Automated Brand Kit Review**
```
Trigger: Webhook (FlashFusion creator submits brand kit)
Node 1: Set Variables
  - colors = {{$json.brand.colors}}
  - fonts = {{$json.brand.fonts}}
Node 2: HTTP → Claude API
  Prompt: "Review this brand kit for accessibility:
  Colors: {{colors}}
  Fonts: {{fonts}}
  Check WCAG 2.1 AA contrast ratios."
Node 3: IF (Claude found issues)
  TRUE → Linear: Create issue
  FALSE → Notion: Log approval
Node 4: Webhook Response (send result to FlashFusion)
```

**Use Case 2: Product Description Generator**
```
Trigger: Printify webhook (new product created)
Node 1: HTTP → Claude API
  Prompt: "Generate SEO-optimized product description:
  Product: {{$json.product.name}}
  Category: {{$json.product.category}}
  Target: Etsy sellers"
Node 2: Set Variables
  - description = {{Claude response}}
Node 3: HTTP → Shopify API (update product description)
Node 4: HTTP → Etsy API (update product description)
```

**Use Case 3: Support Ticket Triage**
```
Trigger: Intercom webhook (new ticket)
Node 1: HTTP → Claude API
  Prompt: "Categorize this support ticket:
  Subject: {{$json.ticket.subject}}
  Body: {{$json.ticket.body}}
  
  Categories: Brand Kit Issue, Publishing Error, Payment, Other
  Priority: Low, Medium, High, Urgent"
Node 2: Set Variables
  - category = {{Parse Claude response}}
  - priority = {{Parse Claude response}}
Node 3: Linear → Create issue (with category, priority)
Node 4: Intercom → Tag ticket
```

---

## 🔧 GITHUB ACTIONS

### Setup: Claude in CI/CD

#### Workflow File
```yaml
# File: .github/workflows/claude-review.yml
name: Claude Security Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  security-review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Full history for diff
      
      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v35
        with:
          files: |
            **/*.ts
            **/*.js
            **/*.py
      
      - name: Review with Claude
        if: steps.changed-files.outputs.any_changed == 'true'
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          # Install dependencies
          pip install anthropic
          
          # Run review script
          python .github/scripts/claude-review.py \
            --files "${{ steps.changed-files.outputs.all_changed_files }}" \
            --output review-report.md
      
      - name: Post review to PR
        if: steps.changed-files.outputs.any_changed == 'true'
        uses: actions/github-script@v6
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('review-report.md', 'utf8');
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## 🔒 Claude Security Review\n\n${report}`
            });
```

#### Review Script
```python
# File: .github/scripts/claude-review.py
import anthropic
import sys
import os
import argparse

def review_file(client, filepath, system_prompt):
    with open(filepath, 'r') as f:
        code = f.read()
    
    response = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=4096,
        system=system_prompt,
        messages=[{
            "role": "user",
            "content": f"""[PROD] Security review for: {filepath}

```
{code}
```

Focus:
- OWASP Top 10
- Input validation
- Secrets management
- Error handling (Cause → Fix → Retry)
- RLS compliance (if applicable)

Format findings as:
- **CRITICAL**: [Issue] - Line [N]
- **HIGH**: [Issue] - Line [N]
- **MEDIUM**: [Issue] - Line [N]
"""
        }]
    )
    
    return response.content[0].text

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--files', required=True)
    parser.add_argument('--output', default='review-report.md')
    args = parser.parse_args()
    
    client = anthropic.Anthropic(api_key=os.environ['ANTHROPIC_API_KEY'])
    
    # Load system prompt
    with open('.github/config/system-prompt.txt', 'r') as f:
        system_prompt = f.read()
    
    files = args.files.split()
    
    report = []
    critical_count = 0
    
    for filepath in files:
        print(f"Reviewing {filepath}...")
        review = review_file(client, filepath, system_prompt)
        report.append(f"### {filepath}\n\n{review}\n\n")
        
        if "**CRITICAL**" in review:
            critical_count += 1
    
    # Write report
    with open(args.output, 'w') as f:
        f.write('\n'.join(report))
    
    # Exit with error if critical findings
    if critical_count > 0:
        print(f"❌ {critical_count} critical findings detected")
        sys.exit(1)
    
    print("✅ No critical findings")
    sys.exit(0)

if __name__ == '__main__':
    main()
```

### GitHub Actions Use Cases

#### Use Case 1: Automated Commit Messages
```yaml
# .github/workflows/commit-msg.yml
name: Generate Commit Message

on:
  workflow_dispatch:
    inputs:
      branch:
        description: 'Branch name'
        required: true

jobs:
  generate-msg:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Get diff
        run: |
          git diff HEAD~1 HEAD > diff.txt
      
      - name: Generate message
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          python .github/scripts/generate-commit-msg.py \
            --diff diff.txt \
            --output commit-msg.txt
      
      - name: Display message
        run: cat commit-msg.txt
```

#### Use Case 2: Documentation Auto-Update
```yaml
# .github/workflows/docs-update.yml
name: Update Documentation

on:
  push:
    paths:
      - 'src/**/*.ts'

jobs:
  update-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Generate API docs
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          python .github/scripts/generate-docs.py \
            --source src/ \
            --output docs/api.md
      
      - name: Commit docs
        run: |
          git config user.name "Claude Bot"
          git config user.email "bot@intinc.com"
          git add docs/api.md
          git commit -m "docs: Auto-update API documentation"
          git push
```

---

## 🔗 CUSTOM INTEGRATIONS

### Webhook Integration

#### Receive Webhooks from External Services
```python
# File: webhook-server.py
from flask import Flask, request
import anthropic
import os

app = Flask(__name__)
client = anthropic.Anthropic(api_key=os.environ['ANTHROPIC_API_KEY'])

@app.route('/webhook/analyze', methods=['POST'])
def analyze_webhook():
    data = request.json
    
    # Call Claude
    response = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"Analyze this webhook data: {data}"
        }]
    )
    
    return {
        "analysis": response.content[0].text,
        "status": "success"
    }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

**Deploy:**
```bash
# Run locally
python webhook-server.py

# Or deploy to cloud (Heroku, Fly.io, Railway)
flyctl deploy
```

**Use:**
```bash
# External service sends POST to:
# https://your-domain.com/webhook/analyze

curl -X POST https://your-domain.com/webhook/analyze \
  -H "Content-Type: application/json" \
  -d '{"event": "new_user", "user_id": 123}'
```

---

### Custom MCP Server

#### Create Your Own MCP Server
```python
# File: custom-mcp-server.py
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# Define tools
TOOLS = [
    {
        "name": "get_flashfusion_metrics",
        "description": "Get FlashFusion platform metrics",
        "input_schema": {
            "type": "object",
            "properties": {
                "metric": {
                    "type": "string",
                    "enum": ["active_creators", "mrr", "churn_rate"]
                }
            }
        }
    }
]

@app.route('/mcp', methods=['POST'])
def mcp_endpoint():
    request_data = request.json
    tool_name = request_data['tool']
    tool_input = request_data['input']
    
    if tool_name == 'get_flashfusion_metrics':
        metric = tool_input['metric']
        
        # Fetch from database (example)
        if metric == 'active_creators':
            value = query_database("SELECT COUNT(*) FROM creators WHERE last_active > NOW() - INTERVAL '30 days'")
        elif metric == 'mrr':
            value = query_database("SELECT SUM(amount) FROM subscriptions WHERE status = 'active'")
        elif metric == 'churn_rate':
            value = calculate_churn()
        
        return jsonify({
            "content": [{
                "type": "text",
                "text": f"{metric}: {value}"
            }]
        })

@app.route('/mcp/tools', methods=['GET'])
def list_tools():
    return jsonify({"tools": TOOLS})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
```

**Use in Claude:**
```
1. Deploy MCP server: https://your-domain.com/mcp
2. Claude → Settings → Connectors → Add Custom MCP
3. URL: https://your-domain.com/mcp
4. Test: Ask "What's the current MRR for FlashFusion?"
5. Claude calls your MCP server → Gets real-time data
```

---

## 📋 INTEGRATION CHECKLIST

### Essential Integrations (Priority 1)
- [ ] **Web platform** (claude.ai) - Primary workspace
- [ ] **Mobile app** - On-the-go access
- [ ] **GitHub MCP** - Code review, PRs, issues
- [ ] **Linear MCP** - Project tracking
- [ ] **Notion MCP** - Documentation

### Power User Integrations (Priority 2)
- [ ] **VS Code extension** - IDE integration
- [ ] **Claude Code CLI** - Terminal workflows
- [ ] **Slack bot** - Team collaboration
- [ ] **n8n workflows** - FlashFusion automation
- [ ] **GitHub Actions** - CI/CD security scans

### Advanced Integrations (Priority 3)
- [ ] **Browser extension** - Quick page analysis
- [ ] **Custom MCP server** - Internal tools
- [ ] **API access** - Custom applications
- [ ] **Zapier/Make** - Business process automation

---

## 🚀 NEXT STEPS

1. **Start with web platform** (foundation)
2. **Add mobile app** (convenience)
3. **Try one automation** (n8n or Zapier)
4. **Explore VS Code extension** (if coding daily)
5. **Build custom integration** (for unique needs)

---

**Related Guides:**
- Personal Quick Reference Guide
- Platform-Specific Setup Guide
- Interactive Prompting Guide

**Last Updated:** December 11, 2025  
**Maintained By:** Kyle  
**Version:** 1.0.0
