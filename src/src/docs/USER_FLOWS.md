# User Flows & System Architecture Map

## Overview
This document maps the critical user flows, page interactions, and system logic for the **Enterprise Claude Profile Builder**. It reflects the current state (Phase 11) and aligns with the **Project Organization Master** index.

---

## 1. Quick Start Guide (By Role)

### 👨‍💼 Executive / Leadership Flow
**Goal:** Assess ROI and strategic value.
1.  **Entry:** Dashboard (`/`) or ROI Calculator (`/operations`).
2.  **Action:** Review "Strategic Insight" card in `ROIFramework`.
3.  **Interaction:** Adjust "Adoption Rate" slider to see projected savings.
4.  **Outcome:** Validate business case for Phase 1 pilot.

### 👨‍💻 Technical Lead Flow
**Goal:** Verify architecture and integration readiness.
1.  **Entry:** **"Deployment"** sidebar link.
2.  **View:** `Deployment.tsx` dashboard.
3.  **Action:** Check off "Core Architecture" phase tasks.
4.  **Deep Dive:** Navigate to **"Agent Builder"** (`/agents`) to test the new Phase 11 Runtime.
5.  **Outcome:** Sign off on technical readiness.

### 🎨 Designer Flow
**Goal:** Validate UI patterns against Design System.
1.  **Entry:** **"Ecosystem Explorer"** (`/ecosystem`).
2.  **Action:** Verify card layouts and badge styles match `INT_PLATFORM_EXPLORER_FIGMA_GUIDELINES.md`.
3.  **Outcome:** Ensure visual consistency across new modules.

### 💼 Sales Flow
**Goal:** Customize demo for a prospect.
1.  **Entry:** **"Agent Builder"** (`/agents`).
2.  **Action:** Create a "Sales Assistant" agent.
3.  **Config:** Set Role to "Sales Rep" and enable "CRM" tool (simulated).
4.  **Test:** Use Playground to demonstrate "Summarize recent deals".
5.  **Outcome:** tailored demo for client meeting.

---

## 2. AI Agent Builder (Phase 11)
**Goal:** Enable users to design, configure, and test autonomous agents.

### Flow A: Create New Agent
1.  **Entry:** User clicks **"Agent Builder"** in the sidebar.
2.  **View:** `AgentBuilder.tsx` renders in 'library' mode (`AgentLibrary` component).
3.  **Action:** User clicks **"Create New Agent"** button.
4.  **System:**
    - `useAgentStore.createNewAgent()` is called.
    - View switches to 'builder'.
    - Default values (Name: "New Agent", Model: "Sonnet") are loaded.
5.  **Configuration (Tab 1):**
    - User edits Name, Role, Goal.
    - User selects Model (Sonnet vs Opus) and Temperature.
    - **Component:** `AgentConfiguration.tsx`.
6.  **Tools (Tab 2):**
    - User switches to "Tools & Skills" tab.
    - User toggles integrations (Slack, GitHub, Jira).
    - **Component:** `ToolSelector.tsx`.
    - **Logic:** Updates `selectedToolIds` in store.
7.  **Save:**
    - User clicks **"Save Agent"**.
    - **Validation:** Check if name is empty.
    - **System:** `saveCurrentAgent()` persists data to `savedAgents` array (localStorage).
    - Toast notification confirms success.

### Flow B: Test Agent (Playground)
1.  **Context:** User is in 'builder' mode (creating or editing).
2.  **Component:** `TestPlayground.tsx` (Right panel).
3.  **Action:** User types a message (e.g., "Summarize the #general channel").
4.  **System:**
    - `AgentExecutor` class is instantiated with current config.
    - `executor.execute(userMsg)` is called.
    - **Simulation:** The executor uses "Mock Reasoning" to detect keywords (e.g., "Slack") and simulate a tool call.
5.  **Feedback:**
    - UI shows "Thinking..." animation (`isThinking` state).
    - Thoughts/Reasoning steps are rendered (if available).
    - Final response is displayed in chat.

### Flow C: Edit Existing Agent
1.  **Entry:** "Agent Library" view.
2.  **Action:** User clicks **"Edit"** on an agent card.
3.  **System:**
    - `loadAgent(id)` retrieves data from store.
    - View switches to 'builder'.
    - Form fields populate with agent data.

---

## 3. Integration Marketplace (Phase 10)
**Goal:** Manage connections to external tools.

### Flow: Browse & Configure
1.  **Entry:** **"Tools & Connectors"** sidebar link.
2.  **Component:** `IntegrationMarketplace.tsx`.
3.  **Action:** User views available integrations (Slack, GitHub, etc.).
4.  **Logic:** Data sourced from `src/data/integrations.ts`.
5.  **Status:** 'active' integrations are usable in Agent Builder.
6.  **Install:** Clicking "Install" adds ID to `installedIntegrations` store and shows Success Toast.

---

## 4. Deployment Dashboard
**Goal:** Track rollout progress.

### Flow: View Progress
1.  **Entry:** **"Deployment"** sidebar link.
2.  **Component:** `Deployment.tsx`.
3.  **Interaction:** User checks off tasks in phases.
4.  **Storage:** Progress saved to LocalStorage via `useLocalStorage`.

---

## 5. Ecosystem Explorer
**Goal:** Visualize the Claude stack.

### Flow: Exploration
1.  **Entry:** **"Ecosystem Explorer"** sidebar link.
2.  **Component:** `EcosystemExplorer.tsx`.
3.  **Features:**
    - **Catalog:** List of platforms.
    - **Stack Configurator:** Interactive wizard.
    - **Map:** Visual node graph (if implemented).

---

## Technical Architecture

### State Management
- **Zustand:** Used for complex feature state (`useAgentStore`, `useEcosystemStore`).
- **Context API:** Used for global app shell state (`NavigationContext`, `ToastContext`).

### Routing
- **Manual Routing:** `ContentViewer.tsx` switches components based on `activeSection` string from `NavigationContext`.

### Backend (Supabase)
- **Role:** Auth (optional), Vector Store (future), Edge Functions (future).
- **Current:** LocalStorage is primary for user preferences and draft agents in this prototype.
