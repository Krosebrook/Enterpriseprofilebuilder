/**
 * Real Agent Executor with Claude API Integration
 * Implements the ReAct (Reasoning + Acting) Pattern
 * 
 * Phase 11 - Production Implementation
 */

import { Tool } from './framework';
import { toolRegistry } from '../../features/agents/tools';
import { executeToolWithGovernance, governanceManager } from './governance';
import { agentDebugger } from './debug';

export interface ExecutionStep {
  type: 'thought' | 'action' | 'observation' | 'answer';
  content: string;
  metadata?: any;
  timestamp: number;
}

export interface ExecutionResult {
  steps: ExecutionStep[];
  finalResponse: string;
  success: boolean;
  error?: string;
}

export interface AgentExecutorConfig {
  agentName: string;
  agentRole: string;
  agentGoal: string;
  toolIds: string[];
  model: string;
  temperature: number;
  maxIterations?: number;
  dryRun?: boolean;
}

export class RealAgentExecutor {
  private tools: Tool[];
  private config: AgentExecutorConfig;
  private projectId: string;
  private publicAnonKey: string;

  constructor(config: AgentExecutorConfig) {
    this.config = {
      maxIterations: 5,
      dryRun: false,
      ...config
    };
    
    this.tools = config.toolIds
      .map(id => toolRegistry[id])
      .filter(t => t !== undefined);

    // Import Supabase credentials dynamically
    try {
      const info = require('../../utils/supabase/info');
      this.projectId = info.projectId;
      this.publicAnonKey = info.publicAnonKey;
    } catch (e) {
      console.warn('Supabase info not available, using defaults');
      this.projectId = '';
      this.publicAnonKey = '';
    }
  }

  /**
   * Execute the agent with real Claude API using ReAct pattern
   */
  async execute(userInput: string): Promise<ExecutionResult> {
    agentDebugger.info('Executor', `Starting execution for agent: ${this.config.agentName}`, { userInput });
    
    const steps: ExecutionStep[] = [];
    let iteration = 0;
    let completed = false;
    let finalAnswer = '';

    try {
      while (iteration < (this.config.maxIterations || 5) && !completed) {
        iteration++;
        agentDebugger.debug('Executor', `Iteration ${iteration} started`);

        // Step 1: Send to Claude for reasoning
        const systemPrompt = this.buildSystemPrompt();
        const conversationHistory = this.buildConversationHistory(steps, userInput);

        steps.push({
          type: 'thought',
          content: `Iteration ${iteration}: Analyzing task and determining next action...`,
          timestamp: Date.now()
        });

        const claudeResponse = await this.callClaude(conversationHistory, systemPrompt);
        agentDebugger.debug('Executor', 'Received Claude response', { response: claudeResponse.substring(0, 200) });

        // Step 2: Parse Claude's response for tool calls or final answer
        const parsed = this.parseClaudeResponse(claudeResponse);
        agentDebugger.debug('Executor', 'Parsed response', parsed);

        if (parsed.type === 'tool_call') {
          agentDebugger.info('Executor', `Tool call detected: ${parsed.toolName}`, parsed.params);
          
          // Execute the tool
          steps.push({
            type: 'action',
            content: `Calling tool: ${parsed.toolName}`,
            metadata: { tool: parsed.toolName, params: parsed.params },
            timestamp: Date.now()
          });

          const tool = this.tools.find(t => t.name === parsed.toolName);
          if (!tool) {
            agentDebugger.warn('Executor', `Tool not found: ${parsed.toolName}`);
            steps.push({
              type: 'observation',
              content: `Error: Tool "${parsed.toolName}" not found in available tools.`,
              timestamp: Date.now()
            });
            continue;
          }

          try {
            // Execute tool with governance checks (respecting dry-run mode)
            let toolResult;
            if (this.config.dryRun) {
              agentDebugger.info('Executor', `DRY RUN: Simulating ${parsed.toolName}`);
              toolResult = {
                success: true,
                output: `[DRY RUN] Would call ${parsed.toolName} with params: ${JSON.stringify(parsed.params)}`,
                data: { dryRun: true }
              };
            } else {
              agentDebugger.info('Executor', `Executing tool with governance: ${parsed.toolName}`);
              // Use governance wrapper for real execution
              toolResult = await executeToolWithGovernance(
                `agent-${this.config.agentName}`,
                this.config.agentName,
                tool,
                parsed.params,
                this.config.dryRun || false
              );
            }

            agentDebugger.info('Executor', `Tool execution successful: ${parsed.toolName}`, toolResult);
            steps.push({
              type: 'observation',
              content: toolResult.output,
              metadata: { success: toolResult.success, data: toolResult.data },
              timestamp: Date.now()
            });
          } catch (error: any) {
            agentDebugger.error('Executor', `Tool execution failed: ${parsed.toolName}`, error);
            steps.push({
              type: 'observation',
              content: `Error executing tool: ${error.message}`,
              metadata: { error: error.message },
              timestamp: Date.now()
            });
          }
        } else if (parsed.type === 'final_answer') {
          agentDebugger.info('Executor', 'Final answer received, completing execution');
          // Agent has concluded
          finalAnswer = parsed.answer;
          completed = true;
          
          steps.push({
            type: 'answer',
            content: finalAnswer,
            timestamp: Date.now()
          });
        } else {
          agentDebugger.warn('Executor', 'Unknown response format, treating as conversational');
          // Fallback: treat as conversational response
          finalAnswer = claudeResponse;
          completed = true;
          
          steps.push({
            type: 'answer',
            content: finalAnswer,
            timestamp: Date.now()
          });
        }
      }

      if (!completed) {
        agentDebugger.warn('Executor', 'Max iterations reached without completion');
        finalAnswer = "I've reached my maximum iteration limit. Let me summarize what I found.";
        steps.push({
          type: 'answer',
          content: finalAnswer,
          timestamp: Date.now()
        });
      }

      agentDebugger.info('Executor', 'Execution completed successfully');
      return {
        steps,
        finalResponse: finalAnswer,
        success: true
      };

    } catch (error: any) {
      agentDebugger.error('Executor', 'Critical execution error', error);
      console.error('Agent execution error:', error);
      
      steps.push({
        type: 'observation',
        content: `Critical error: ${error.message}`,
        metadata: { error: error.message },
        timestamp: Date.now()
      });

      return {
        steps,
        finalResponse: `I encountered an error: ${error.message}`,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Build the system prompt that teaches Claude the ReAct pattern
   */
  private buildSystemPrompt(): string {
    const toolDocs = this.tools.map(t => {
      const params = Object.entries(t.parameters)
        .map(([key, val]: [string, any]) => `  - ${key} (${val.type}): ${val.description || ''}`)
        .join('\n');
      
      return `**${t.name}**\n${t.description}\nParameters:\n${params}`;
    }).join('\n\n');

    return `You are ${this.config.agentName}, a ${this.config.agentRole}.

Your goal: ${this.config.agentGoal}

You have access to the following tools:
${toolDocs || 'No tools available.'}

**Instructions:**
You must follow the ReAct (Reasoning + Acting) pattern:

1. **Thought**: Analyze the user's request and decide what to do next.
2. **Action**: If you need to use a tool, output it in this EXACT format:
   TOOL_CALL: tool_name
   PARAMS: {"param1": "value1", "param2": "value2"}
3. **Observation**: You will receive the tool's output.
4. **Repeat** steps 1-3 if needed.
5. **Final Answer**: When you have enough information, provide your final answer prefixed with:
   FINAL_ANSWER: [your response here]

**Important Rules:**
- ALWAYS use the TOOL_CALL format exactly as shown if calling a tool
- ONLY call tools that are in your available tools list
- If no tool is needed, proceed directly to FINAL_ANSWER
- Be concise in your reasoning
- ${this.config.dryRun ? '**DRY RUN MODE**: Tools will not actually execute.' : 'Tools will execute for real.'}`;
  }

  /**
   * Build conversation history for Claude
   */
  private buildConversationHistory(steps: ExecutionStep[], userInput: string): string {
    let history = `User Request: ${userInput}\n\n`;
    
    for (const step of steps) {
      if (step.type === 'thought') {
        history += `Thought: ${step.content}\n`;
      } else if (step.type === 'action') {
        history += `Action: ${step.content}\n`;
        if (step.metadata) {
          history += `Tool: ${step.metadata.tool}, Params: ${JSON.stringify(step.metadata.params)}\n`;
        }
      } else if (step.type === 'observation') {
        history += `Observation: ${step.content}\n`;
      }
    }

    history += `\nWhat should you do next? (Remember to use TOOL_CALL or FINAL_ANSWER format)`;
    
    return history;
  }

  /**
   * Call Claude API via Supabase Edge Function
   */
  private async callClaude(prompt: string, systemPrompt: string): Promise<string> {
    if (!this.projectId || !this.publicAnonKey) {
      throw new Error('Supabase configuration not available. Cannot call Claude API.');
    }

    const endpoint = `https://${this.projectId}.supabase.co/functions/v1/make-server-0864fd03/chat`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.publicAnonKey}`
      },
      body: JSON.stringify({
        prompt,
        systemPrompt,
        model: this.config.model,
        temperature: this.config.temperature,
        maxTokens: 2048,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Handle Claude API response format
    if (data.content && Array.isArray(data.content) && data.content[0]?.text) {
      return data.content[0].text;
    } else if (data.error) {
      throw new Error(`Claude API returned error: ${data.error}`);
    } else if (typeof data === 'string') {
      return data;
    }
    
    throw new Error('Unexpected response format from Claude API');
  }

  /**
   * Parse Claude's response to detect tool calls or final answers
   */
  private parseClaudeResponse(response: string): 
    | { type: 'tool_call', toolName: string, params: any }
    | { type: 'final_answer', answer: string }
    | { type: 'unknown', content: string } 
  {
    // Check for FINAL_ANSWER
    const finalAnswerMatch = response.match(/FINAL_ANSWER:\s*([\s\S]+)/i);
    if (finalAnswerMatch) {
      return {
        type: 'final_answer',
        answer: finalAnswerMatch[1].trim()
      };
    }

    // Check for TOOL_CALL
    const toolCallMatch = response.match(/TOOL_CALL:\s*(\w+)/i);
    const paramsMatch = response.match(/PARAMS:\s*({[\s\S]*?})/i);
    
    if (toolCallMatch) {
      const toolName = toolCallMatch[1].toLowerCase();
      let params = {};
      
      if (paramsMatch) {
        try {
          params = JSON.parse(paramsMatch[1]);
        } catch (e) {
          console.warn('Failed to parse tool params:', paramsMatch[1]);
        }
      }
      
      return {
        type: 'tool_call',
        toolName,
        params
      };
    }

    // If no structured format detected, treat as unknown
    return {
      type: 'unknown',
      content: response
    };
  }
}