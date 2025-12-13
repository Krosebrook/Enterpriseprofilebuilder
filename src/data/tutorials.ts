import { TechniqueTutorial } from '../types';

export const tutorialsData: TechniqueTutorial[] = [
  {
    techniqueId: 'chain-of-thought',
    title: 'Chain of Thought Prompting',
    scenarios: [
      {
        title: 'Complex Financial Analysis',
        problem: "You need to analyze Q3 financial data and project Q4 outcomes, but simply asking 'Analyze this' yields a generic summary.",
        goal: "Force Claude to show its reasoning steps before giving the final answer.",
        initialState: "Data: Q3 Revenue $1.2M, Expenses $900K. Q4 expected growth 10%, expenses +5%.",
        validation: {
          type: 'keyword',
          pattern: ['step-by-step', 'think', 'reasoning', 'chain of thought'],
          feedback: "Try explicitly asking Claude to 'think step-by-step' or 'show your reasoning' before the final answer.",
        },
        successResponse: {
          thinking: "1. First, I'll calculate Q3 Net Income.\n2. Then apply 10% growth to Revenue for Q4.\n3. Apply 5% growth to Expenses for Q4.\n4. Calculate Q4 Net Income.\n5. Compare Q3 vs Q4.",
          output: "Based on the step-by-step analysis:\n\nQ3 Net Income: $300K\nQ4 Projected Revenue: $1.32M\nQ4 Projected Expenses: $945K\nQ4 Projected Net Income: $375K\n\nResult: A 25% increase in Net Income.",
          explanation: "By asking for step-by-step reasoning, you ensure the math is verified at each stage, reducing errors significantly.",
        },
      },
      {
        title: 'Debugging Code Logic',
        problem: "You have a function that fails silently. Asking 'Fix this' gives a rewritten function without explanation.",
        goal: "Get Claude to trace the execution flow to find the bug.",
        initialState: "Function: calculateDiscount(price, userType) - returns wrong value for 'VIP' users.",
        validation: {
          type: 'keyword',
          pattern: ['trace', 'execution', 'step', 'walk through'],
          feedback: "Ask Claude to 'trace the execution' or 'walk through the code logic' for a specific input.",
        },
        successResponse: {
          thinking: "1. Analyzing input: price=100, userType='VIP'\n2. Checking if statement: userType === 'VIP'\n3. Found logic error: The switch case for 'VIP' is missing a break statement, falling through to default.",
          output: "The bug is a missing `break` statement in the switch case. \n\nTrace:\n- Input 'VIP' enters case 'VIP'\n- Applies 20% discount\n- No break found -> falls through to default\n- Re-applies 0% discount override.\n\nFix added below.",
          explanation: "Tracing execution forces the model to simulate the computer's logic, often catching subtle control flow errors.",
        },
      },
    ],
  },
  {
    techniqueId: 'role-prompting',
    title: 'Role-Based Prompting',
    scenarios: [
      {
        title: 'Technical Documentation',
        problem: "You need documentation for a new API endpoint, but the output is too marketing-focused.",
        goal: "Get precise, technical documentation suitable for senior engineers.",
        initialState: "API: POST /v1/users/batch - accepts JSON array of users.",
        validation: {
          type: 'keyword',
          pattern: ['act as', 'you are', 'role', 'senior engineer', 'technical writer'],
          feedback: "Assign a specific persona. Try 'Act as a Senior Technical Writer' or 'You are a Backend Engineer'.",
        },
        successResponse: {
          thinking: "Adopting persona: Senior Technical Writer. Focus: Clarity, accuracy, examples, edge cases. Tone: Professional, concise.",
          output: "## Batch User Creation\n\n**Endpoint:** `POST /v1/users/batch`\n\n**Description:** efficient bulk creation of user entities. Atomic transaction guaranteed.\n\n**Request Body:**\n```json\n[\n  { \"username\": \"...\" }\n]\n```\n**Error Handling:** Returns 400 if any user validation fails; entire batch rolls back.",
          explanation: "Assigning a role sets the tone, vocabulary, and priority of information (e.g., focusing on edge cases for engineers).",
        },
      },
    ],
  },
];
