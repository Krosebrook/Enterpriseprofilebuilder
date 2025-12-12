export interface TutorialScenario {
  id: string;
  title: string;
  problem: string;
  goal: string;
  initialState: string;
  validation: {
    type: 'keyword' | 'regex' | 'structure';
    pattern: string | string[]; // keywords or regex string
    feedback: string;
  };
  successResponse: {
    thinking: string;
    output: string;
    explanation: string;
  };
}

export interface TechniqueTutorial {
  techniqueId: string; // Matches ID in best-practices.ts
  scenarios: TutorialScenario[];
}

export const tutorialsData: TechniqueTutorial[] = [
  {
    techniqueId: 'adv-bp-1', // Chain-of-Thought
    scenarios: [
      {
        id: 'cot-1',
        title: 'Complex Logic Debugging',
        problem: 'You have a Python function that is calculating pricing tiers incorrectly for enterprise customers, but the logic seems fine at first glance.',
        goal: 'Ask Claude to find the bug, ensuring it analyzes the logic thoroughly before answering to avoid a superficial response.',
        initialState: 'Here is the code: [Python Code Block]',
        validation: {
          type: 'keyword',
          pattern: ['step-by-step', 'think', 'reasoning', 'chain of thought'],
          feedback: 'To activate Chain-of-Thought, you must explicitly ask Claude to "think step-by-step" or "explain your reasoning" before giving the final answer.'
        },
        successResponse: {
          thinking: '1. Analyzing the discount tier logic...\n2. Tier 1 is < $10k, Tier 2 is $10k-$50k.\n3. Wait, the code uses `if price > 10000` followed by `elif price > 50000`. The second condition will never be reached because the first one catches it.\n4. Identifying this as a logic ordering bug.',
          output: 'I found the issue. The order of your `if/elif` statements is incorrect. You check for `> 10000` first, which catches everything larger than 10k, including 50k. You should check for the largest value first.',
          explanation: 'By asking for step-by-step thinking, Claude broke down the conditional logic line-by-line and caught the unreachable code error that it might have missed in a quick scan.'
        }
      },
      {
        id: 'cot-2',
        title: 'Strategic Decision Making',
        problem: 'Your company needs to decide between building a feature in-house or buying a vendor solution. The factors are cost, time, and control.',
        goal: 'Get a nuanced recommendation that weighs all factors.',
        initialState: 'Context: We have $50k budget, 2 engineers, and need this in Q1.',
        validation: {
          type: 'keyword',
          pattern: ['step-by-step', 'weigh', 'pros and cons', 'analyze'],
          feedback: 'Try asking Claude to "think through the pros and cons step-by-step" or "evaluate each factor sequentially".'
        },
        successResponse: {
          thinking: '1. Evaluating Build: Cost = 2 engineers x 3 months = $90k. Over budget. Time = 3 months. Control = High.\n2. Evaluating Buy: Cost = $30k/year. Under budget. Time = 2 weeks. Control = Low.\n3. Comparison: Build is too expensive for current budget.',
          output: 'Recommendation: Buy. Building in-house exceeds your $50k budget (estimated $90k in engineering time). Buying fits the budget ($30k) and meets the Q1 timeline, despite lower control.',
          explanation: 'Chain-of-Thought forced Claude to calculate the implicit costs before jumping to a recommendation.'
        }
      }
    ]
  },
  {
    techniqueId: 'adv-bp-2', // Few-Shot
    scenarios: [
      {
        id: 'few-1',
        title: 'Data Normalization',
        problem: 'You have a list of messy phone numbers in different formats that need to be standardized to E.164 format (+15551234567).',
        goal: 'Ensure Claude formats them exactly right without writing a regex explanation.',
        initialState: 'Raw data: (555) 123-4567, 555.987.6543, 555-555-5555',
        validation: {
          type: 'structure',
          pattern: ['Input:', 'Output:'], // Simple check for few-shot pattern
          feedback: 'Few-shot prompting requires providing examples. Try including lines like "Input: ... Output: ..."'
        },
        successResponse: {
          thinking: 'Recognizing pattern from examples. User wants strictly +1XXXXXXXXXX format.',
          output: '+15551234567\n+15559876543\n+15555555555',
          explanation: 'By providing examples (shots), you showed Claude the exact format rule without needing to describe it in words.'
        }
      },
      {
        id: 'few-2',
        title: 'Tone Transfer',
        problem: 'You need to rewrite technical error messages into friendly, non-technical warnings for end users.',
        goal: 'Teach Claude the specific "friendly" style you want.',
        initialState: 'Error: 500 Internal Server Error (DB_CONN_FAIL)',
        validation: {
          type: 'structure',
          pattern: ['Technical:', 'Friendly:'],
          feedback: 'Provide examples of the transformation. E.g., "Technical: 404 Not Found -> Friendly: Oops! We couldn\'t find that page."'
        },
        successResponse: {
          thinking: 'Mapping "Technical" to "Friendly" style based on provided examples.',
          output: 'Friendly: "It looks like our system is having a hiccup. Please try again in a few minutes!"',
          explanation: 'The examples calibrated Claude\'s tone much better than just saying "be friendly".'
        }
      }
    ]
  },
  {
    techniqueId: 'adv-bp-3', // XML Tag Structuring
    scenarios: [
      {
        id: 'xml-1',
        title: 'Complex Analysis Request',
        problem: 'You need Claude to analyze a specific customer email, but your prompt is getting long and confusing with instructions mixed with the email text.',
        goal: 'Use XML tags to clearly separate your instructions from the data.',
        initialState: 'Email text: "Hi, I am unhappy with the..." Instructions: Summarize sentiment.',
        validation: {
          type: 'keyword',
          pattern: ['<email>', '<instructions>', '<text>', '<data>'],
          feedback: 'Wrap the data in XML tags like <email>...</email> or <text>...</text> to clearly distinguish it from your instructions.'
        },
        successResponse: {
          thinking: 'Parsing content inside <email> tags. Ignoring instructions as data.',
          output: 'Sentiment: Negative. Key complaint: Billing error.',
          explanation: 'XML tags prevent "leakage" where Claude might confuse the email content with your instructions.'
        }
      }
    ]
  },
  {
    techniqueId: 'adv-bp-4', // Prefill Response
    scenarios: [
      {
        id: 'prefill-1',
        title: 'Enforcing JSON Output',
        problem: 'You need a strict JSON list of names from a text, with no markdown formatting or chatter.',
        goal: 'Force Claude to start outputting JSON immediately.',
        initialState: 'Extract names from: "John, Sarah, Mike"',
        validation: {
          type: 'keyword',
          pattern: ['['], // simplistic check for starting the JSON array
          feedback: 'To prefill, type the beginning of the response you want. For a JSON list, try typing "[" at the end of your prompt (simulating the Assistant role).'
        },
        successResponse: {
          thinking: 'User started response with "[". Continuing valid JSON.',
          output: '["John", "Sarah", "Mike"]',
          explanation: 'By prefilling "[", you skipped the "Here is the JSON:" chatter and forced a valid array format.'
        }
      }
    ]
  }
];
