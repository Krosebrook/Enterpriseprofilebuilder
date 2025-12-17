# Claude MCP Server Catalog
## Complete Integration Reference | INT Inc | December 2025

---

## Overview

The Model Context Protocol (MCP) securely connects Claude to enterprise data sources, enabling real-time fetching, action execution, and context-aware responses. All connections are RBAC-enforced and audit-logged.

**Key Properties:**
- OAuth 2.0 or API Key authentication
- SSE (Server-Sent Events) for cloud-hosted
- stdio for local process communication
- Automatic token refresh
- Audit trail logging

---

# CATEGORY 1: PROJECT MANAGEMENT

## 1.1 Atlassian (Jira + Confluence)

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.atlassian.com/v1/sse` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Ticket creation, sprint planning, documentation |

**Capabilities:**
- Create/update Jira issues
- Search across projects
- Read Confluence pages
- Generate sprint reports

**Example Prompt:**
```
"Create a Jira ticket in project CORE:
Title: Implement OAuth refresh token handling
Type: Task
Priority: High
Labels: security, auth
Description: [details]"
```

## 1.2 Linear

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.linear.app/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Issue tracking, roadmap, cycle planning |

**Capabilities:**
- Create/update issues
- Assign to team members
- Set priority and status
- Link to parent issues

**Example Prompt:**
```
"Create a Linear issue:
Team: Engineering
Title: Add rate limiting to API
Priority: Urgent
Due: next Friday"
```

## 1.3 monday.com

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.monday.com/sse` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Work management, status updates |

---

# CATEGORY 2: CRM & SALES

## 2.1 HubSpot

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.hubspot.com/anthropic` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Contact lookup, deal pipeline, activity logging |

**Capabilities:**
- Search contacts and companies
- Read deal pipeline stages
- Log activities
- Retrieve engagement history

**Example Prompt:**
```
"Find all deals in 'Negotiation' stage with value over $50k"
```

## 2.2 Close

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.close.com/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Sales CRM, lead management |

## 2.3 Intercom

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.intercom.com/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Customer communication, support tickets |

---

# CATEGORY 3: PAYMENTS & FINANCE

## 3.1 Stripe

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.stripe.com` |
| **Auth Type** | API Key |
| **Platforms** | Web, Desktop |
| **Use Cases** | Revenue data, subscription analysis, payment status |

**Capabilities:**
- Retrieve customer subscriptions
- Analyze MRR/ARR
- Check payment status
- List invoices

**Example Prompt:**
```
"Show me all customers with failed payments in the last 7 days"
```

**Security Note:** Never store card numbers. Use Stripe tokenization only.

## 3.2 Plaid

| Property | Value |
|----------|-------|
| **MCP URL** | `https://api.dashboard.plaid.com/mcp/sse` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Bank connections, financial data |

---

# CATEGORY 4: AUTOMATION & WORKFLOWS

## 4.1 Zapier

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.zapier.com/api/mcp/a/[YOUR_ID]/mcp` |
| **Auth Type** | API Key |
| **Platforms** | Web, Desktop |
| **Use Cases** | Workflow automation, trigger actions |

**Capabilities:**
- Trigger Zaps
- Read workflow status
- Create new automations
- Debug failed runs

## 4.2 n8n

| Property | Value |
|----------|-------|
| **MCP URL** | Custom per instance (e.g., `https://[instance].app.n8n.cloud/mcp-server/http`) |
| **Auth Type** | API Key |
| **Platforms** | Desktop (primary) |
| **Use Cases** | Complex workflow orchestration |

**Capabilities:**
- Design workflows visually
- Execute multi-step automations
- Error handling and retries
- Webhook triggers

**Example Configuration:**
```json
{
  "mcpServers": {
    "n8n": {
      "type": "url",
      "url": "https://your-instance.app.n8n.cloud/mcp-server/http",
      "env": {
        "N8N_API_KEY": "${N8N_API_KEY}"
      }
    }
  }
}
```

---

# CATEGORY 5: DEVELOPER TOOLS

## 5.1 GitHub

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.github.com` (or via gitmcp.io) |
| **Auth Type** | Personal Access Token |
| **Platforms** | Desktop (primary), Web |
| **Use Cases** | Code review, PR management, issue tracking |

**Capabilities:**
- Read repositories
- Create/merge PRs
- Search code
- Manage issues

**Configuration:**
```json
{
  "mcpServers": {
    "github": {
      "type": "sse",
      "url": "https://mcp.github.com",
      "env": {
        "GITHUB_TOKEN": "${GITHUB_PAT}"
      }
    }
  }
}
```

## 5.2 Vercel

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.vercel.com` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Deployments, logs, environment variables |

**Capabilities:**
- Check deployment status
- Read logs
- Manage environment variables
- Trigger redeployments

## 5.3 Netlify

| Property | Value |
|----------|-------|
| **MCP URL** | `https://netlify-mcp.netlify.app/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Static site deployments |

## 5.4 Sentry

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.sentry.dev/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Error tracking, performance monitoring |

**Capabilities:**
- Retrieve recent errors
- Analyze error trends
- Get stack traces
- Check performance metrics

## 5.5 Playwright MCP

| Property | Value |
|----------|-------|
| **MCP URL** | `https://gitmcp.io/microsoft/playwright-mcp` |
| **Auth Type** | None (local) |
| **Platforms** | Desktop |
| **Use Cases** | Browser automation, testing |

## 5.6 Cloudflare

| Property | Value |
|----------|-------|
| **MCP URL** | `https://bindings.mcp.cloudflare.com/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Edge deployments, Workers, D1 databases |

---

# CATEGORY 6: DESIGN & MEDIA

## 6.1 Figma

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.figma.com/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Design file access, component inspection |

**Capabilities:**
- Read design files
- Extract component specifications
- Access design tokens
- Export assets

## 6.2 Canva

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.canva.com/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Design creation, template management |

## 6.3 Cloudinary

| Property | Value |
|----------|-------|
| **MCP URL** | `https://asset-management.mcp.cloudinary.com/sse` |
| **Auth Type** | API Key |
| **Platforms** | Web, Desktop |
| **Use Cases** | Image/video asset management |

**Capabilities:**
- Upload media
- Apply transformations
- Manage folders
- Optimize images

## 6.4 Invideo

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.invideo.io/sse` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web |
| **Use Cases** | Video creation |

---

# CATEGORY 7: KNOWLEDGE & DOCUMENTATION

## 7.1 Notion

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.notion.com/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Documentation, wikis, databases |

**Capabilities:**
- Read pages and databases
- Create new pages
- Update existing content
- Search across workspace

## 7.2 Hugging Face

| Property | Value |
|----------|-------|
| **MCP URL** | `https://huggingface.co/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Model discovery, documentation |

---

# CATEGORY 8: COMMUNICATION

## 8.1 Slack

| Property | Value |
|----------|-------|
| **MCP URL** | Via workspace integration |
| **Auth Type** | OAuth 2.0 (workspace approval) |
| **Platforms** | Web, Desktop |
| **Use Cases** | Message search, channel updates |

## 8.2 Google Drive

| Property | Value |
|----------|-------|
| **MCP URL** | Via Google Cloud integration |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Document access, file search |

**Capabilities:**
- Search files
- Read documents
- Access spreadsheets
- List folder contents

## 8.3 Gmail

| Property | Value |
|----------|-------|
| **MCP URL** | Via Google Cloud integration |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web |
| **Use Cases** | Email search, thread analysis |

## 8.4 Fireflies.ai

| Property | Value |
|----------|-------|
| **MCP URL** | `https://api.fireflies.ai/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web |
| **Use Cases** | Meeting transcripts, action items |

## 8.5 Fellow.ai

| Property | Value |
|----------|-------|
| **MCP URL** | `https://fellow.app/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web |
| **Use Cases** | Meeting notes, action items |

---

# CATEGORY 9: SPECIALTY

## 9.1 Stytch

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.stytch.dev/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Authentication management |

## 9.2 GoDaddy

| Property | Value |
|----------|-------|
| **MCP URL** | `https://api.godaddy.com/v1/domains/mcp` |
| **Auth Type** | API Key |
| **Platforms** | Web |
| **Use Cases** | Domain management |

## 9.3 CData Connect AI

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.cloud.cdata.com/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web, Desktop |
| **Use Cases** | Data connectivity |

## 9.4 Daloopa

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.daloopa.com/server/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web |
| **Use Cases** | Financial data extraction |

## 9.5 Scholar Gateway

| Property | Value |
|----------|-------|
| **MCP URL** | `https://connector.scholargateway.ai/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web |
| **Use Cases** | Academic research |

## 9.6 Jam

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.jam.dev/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web |
| **Use Cases** | Bug reporting |

## 9.7 Melon

| Property | Value |
|----------|-------|
| **MCP URL** | `https://mcp.melon.com/mcp` |
| **Auth Type** | OAuth 2.0 |
| **Platforms** | Web |
| **Use Cases** | Media management |

---

# CONFIGURATION TEMPLATES

## Claude Desktop Full Config Example

```json
{
  "mcpServers": {
    "github": {
      "type": "sse",
      "url": "https://mcp.github.com",
      "env": {
        "GITHUB_TOKEN": "${GITHUB_PAT}"
      }
    },
    "linear": {
      "type": "url",
      "url": "https://mcp.linear.app/mcp"
    },
    "stripe": {
      "type": "url",
      "url": "https://mcp.stripe.com",
      "env": {
        "STRIPE_API_KEY": "${STRIPE_API_KEY}"
      }
    },
    "sentry": {
      "type": "url",
      "url": "https://mcp.sentry.dev/mcp"
    },
    "notion": {
      "type": "url",
      "url": "https://mcp.notion.com/mcp"
    },
    "vercel": {
      "type": "url",
      "url": "https://mcp.vercel.com"
    }
  }
}
```

## Environment Variables Template (.env)

```bash
# GitHub
GITHUB_PAT=ghp_xxxxxxxxxxxx

# Stripe
STRIPE_API_KEY=sk_live_xxxxxxxxxxxx

# n8n
N8N_API_KEY=xxxxxxxxxxxx

# Cloudinary
CLOUDINARY_API_KEY=xxxxxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxxxxx
```

---

# SECURITY BEST PRACTICES

## Authentication

- ✅ Use OAuth 2.0 when available (automatic token refresh)
- ✅ Store API keys in environment variables only
- ✅ Rotate tokens quarterly
- ✅ Use principle of least privilege

## Access Control

- ✅ Grant minimal necessary permissions
- ✅ Audit connector usage monthly
- ✅ Disconnect unused connectors
- ✅ Never use admin accounts for connectors

## Monitoring

- ✅ Enable audit logging
- ✅ Set up alerts for unusual activity
- ✅ Review access patterns weekly
- ✅ Document all authorized integrations

---

# TROUBLESHOOTING

| Issue | Likely Cause | Solution |
|-------|--------------|----------|
| "Unauthorized" error | Token expired | Re-authenticate via Settings |
| MCP server not found | Config syntax error | Validate JSON in config file |
| Slow responses | Rate limiting | Check API quotas |
| Missing data | Permission scope | Expand OAuth scopes |
| Desktop only | MCP type mismatch | Some servers require stdio (local) |

---

*INT Inc MCP Server Catalog | v1.0 | December 2025*
