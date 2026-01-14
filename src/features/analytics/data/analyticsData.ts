export const usageData = [
  { date: 'Jan 1', prompts: 120, tokens: 45000, cost: 2.5 },
  { date: 'Jan 2', prompts: 132, tokens: 48000, cost: 2.8 },
  { date: 'Jan 3', prompts: 101, tokens: 38000, cost: 2.1 },
  { date: 'Jan 4', prompts: 154, tokens: 52000, cost: 3.2 },
  { date: 'Jan 5', prompts: 190, tokens: 68000, cost: 4.1 },
  { date: 'Jan 6', prompts: 210, tokens: 75000, cost: 4.5 },
  { date: 'Jan 7', prompts: 185, tokens: 62000, cost: 3.8 },
];

export const modelUsageData = [
  { name: 'Claude 3.5 Sonnet', value: 65, color: '#d97706' }, // amber-600
  { name: 'Claude 3 Opus', value: 25, color: '#4f46e5' }, // indigo-600
  { name: 'Claude 3 Haiku', value: 10, color: '#10b981' }, // emerald-500
];

export const userActivityData = [
  { id: 1, name: 'Alice Chen', role: 'Engineering', requests: 1240, lastActive: '2 mins ago' },
  { id: 2, name: 'Bob Smith', role: 'Marketing', requests: 850, lastActive: '15 mins ago' },
  { id: 3, name: 'Charlie Kim', role: 'Product', requests: 620, lastActive: '1 hour ago' },
  { id: 4, name: 'Dana Scully', role: 'Research', requests: 450, lastActive: '3 hours ago' },
  { id: 5, name: 'Eve Polastri', role: 'Security', requests: 310, lastActive: '1 day ago' },
];
