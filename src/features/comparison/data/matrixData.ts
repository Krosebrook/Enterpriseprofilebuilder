export interface Capability {
  id: string;
  category: 'Reasoning' | 'Coding' | 'Context' | 'Speed' | 'Cost' | 'Vision' | 'Audio' | 'Tools' | 'Compliance' | 'Enterprise';
  name: string;
}

export interface PlatformMatrix {
  id: string;
  name: string;
  provider: string;
  scores: Record<string, 0 | 1 | 2 | 3>; // 0: N/A, 1: Low, 2: Mid, 3: High/Best
}

export const CAPABILITIES: Capability[] = [
  // Reasoning
  { id: 'reasoning_complex', category: 'Reasoning', name: 'Complex Reasoning' },
  { id: 'reasoning_math', category: 'Reasoning', name: 'Math & Logic' },
  { id: 'reasoning_instruction', category: 'Reasoning', name: 'Instruction Following' },
  
  // Coding
  { id: 'code_generation', category: 'Coding', name: 'Code Generation' },
  { id: 'code_debugging', category: 'Coding', name: 'Debugging & Refactoring' },
  { id: 'code_polyglot', category: 'Coding', name: 'Polyglot Support' },

  // Context
  { id: 'context_window', category: 'Context', name: 'Context Window Size' },
  { id: 'context_recall', category: 'Context', name: 'Recall Accuracy' },
  
  // Speed
  { id: 'speed_ttft', category: 'Speed', name: 'Time to First Token' },
  { id: 'speed_tps', category: 'Speed', name: 'Tokens Per Second' },

  // Cost
  { id: 'cost_input', category: 'Cost', name: 'Input Cost ($/1M)' },
  { id: 'cost_output', category: 'Cost', name: 'Output Cost ($/1M)' },

  // Vision
  { id: 'vision_ocr', category: 'Vision', name: 'OCR Quality' },
  { id: 'vision_analysis', category: 'Vision', name: 'Image Analysis' },

  // Enterprise
  { id: 'ent_security', category: 'Enterprise', name: 'Security & Compliance' },
  { id: 'ent_privacy', category: 'Enterprise', name: 'Data Privacy (Zero Retention)' },
  { id: 'ent_deployment', category: 'Enterprise', name: 'On-Prem/VPC Option' },
  { id: 'ent_sla', category: 'Enterprise', name: 'SLA Availability' },

  // Tools
  { id: 'tool_calling', category: 'Tools', name: 'Function Calling' },
  { id: 'tool_json', category: 'Tools', name: 'JSON Mode Reliability' },
];

export const PLATFORMS: PlatformMatrix[] = [
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    scores: {
      reasoning_complex: 3, reasoning_math: 3, reasoning_instruction: 3,
      code_generation: 3, code_debugging: 3, code_polyglot: 3,
      context_window: 3, context_recall: 3,
      speed_ttft: 3, speed_tps: 3,
      cost_input: 2, cost_output: 2,
      vision_ocr: 3, vision_analysis: 3,
      ent_security: 3, ent_privacy: 3, ent_deployment: 2, ent_sla: 3,
      tool_calling: 3, tool_json: 3
    }
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    scores: {
      reasoning_complex: 3, reasoning_math: 3, reasoning_instruction: 3,
      code_generation: 3, code_debugging: 3, code_polyglot: 3,
      context_window: 3, context_recall: 2,
      speed_ttft: 3, speed_tps: 3,
      cost_input: 2, cost_output: 2,
      vision_ocr: 3, vision_analysis: 3,
      ent_security: 3, ent_privacy: 2, ent_deployment: 1, ent_sla: 3,
      tool_calling: 3, tool_json: 3
    }
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    scores: {
      reasoning_complex: 3, reasoning_math: 3, reasoning_instruction: 2,
      code_generation: 2, code_debugging: 2, code_polyglot: 2,
      context_window: 3, context_recall: 3, // 2M context
      speed_ttft: 2, speed_tps: 2,
      cost_input: 3, cost_output: 3,
      vision_ocr: 3, vision_analysis: 3,
      ent_security: 2, ent_privacy: 2, ent_deployment: 1, ent_sla: 2,
      tool_calling: 2, tool_json: 2
    }
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'Meta (Open Source)',
    scores: {
      reasoning_complex: 2, reasoning_math: 2, reasoning_instruction: 3,
      code_generation: 2, code_debugging: 2, code_polyglot: 2,
      context_window: 1, context_recall: 2,
      speed_ttft: 3, speed_tps: 3,
      cost_input: 3, cost_output: 3, // Cheap/Self-hosted
      vision_ocr: 0, vision_analysis: 0,
      ent_security: 2, ent_privacy: 3, ent_deployment: 3, ent_sla: 1,
      tool_calling: 2, tool_json: 2
    }
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large 2',
    provider: 'Mistral AI',
    scores: {
      reasoning_complex: 3, reasoning_math: 3, reasoning_instruction: 2,
      code_generation: 3, code_debugging: 2, code_polyglot: 3,
      context_window: 2, context_recall: 3,
      speed_ttft: 3, speed_tps: 3,
      cost_input: 2, cost_output: 2,
      vision_ocr: 0, vision_analysis: 0,
      ent_security: 3, ent_privacy: 3, ent_deployment: 2, ent_sla: 2,
      tool_calling: 3, tool_json: 3
    }
  }
];
