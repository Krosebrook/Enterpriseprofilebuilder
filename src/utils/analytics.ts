import { Section, Role } from '../types';

// Mock database for analytics
const ANALYTICS_DATA = {
  totalUsers: 142,
  activeUsers7d: 118,
  avgTimeSavedPerUser: 4.2, // hours/week
  hourlyRate: 75, // blended rate
  adoptionRate: 0.83,
  implementationCost: 134000,
  projectedAnnualSavings: 0
};

// Calculate derived stats
ANALYTICS_DATA.projectedAnnualSavings = 
  ANALYTICS_DATA.totalUsers * 
  ANALYTICS_DATA.adoptionRate * 
  ANALYTICS_DATA.avgTimeSavedPerUser * 
  52 * 
  ANALYTICS_DATA.hourlyRate;

export const trackPageView = (section: Section, role: Role) => {
  // In a real app, this would send data to an analytics service
  console.log(`[Analytics] Page View: ${section} (Role: ${role})`);
};

export const trackTaskCompletion = (taskId: string, completed: boolean) => {
  console.log(`[Analytics] Task ${taskId} ${completed ? 'completed' : 'uncompleted'}`);
};

export const trackSearch = (query: string, resultCount: number) => {
  if (query.length > 2) {
    console.log(`[Analytics] Search: "${query}" (${resultCount} results)`);
  }
};

// New function to fetch ROI data
export const getROIAnalytics = () => {
  // In a real app, this would fetch from an API
  // We'll return the mock data with slight random variance to simulate "live" updates
  const calculateVariance = () => 1 + (Math.random() * 0.05 - 0.025); // +/- 2.5%
  
  return {
    users: Math.floor(ANALYTICS_DATA.totalUsers * calculateVariance()),
    activeUsers: Math.floor(ANALYTICS_DATA.activeUsers7d * calculateVariance()),
    timeSaved: +(ANALYTICS_DATA.avgTimeSavedPerUser * calculateVariance()).toFixed(1),
    savings: Math.floor(ANALYTICS_DATA.projectedAnnualSavings * calculateVariance()),
    cost: ANALYTICS_DATA.implementationCost,
    roi: +(ANALYTICS_DATA.projectedAnnualSavings / ANALYTICS_DATA.implementationCost).toFixed(1),
    paybackMonths: +(ANALYTICS_DATA.implementationCost / (ANALYTICS_DATA.projectedAnnualSavings / 12)).toFixed(1)
  };
};
