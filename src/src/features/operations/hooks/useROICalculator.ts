import { useState, useEffect } from 'react';
import { getROIAnalytics } from '../../../utils/analytics';

export function useROICalculator() {
  const [activeUsers, setActiveUsers] = useState(125);
  const [hourlyRate, setHourlyRate] = useState(75);
  const [hoursSavedPerWeek, setHoursSavedPerWeek] = useState(5);
  const [adoptionRate, setAdoptionRate] = useState(82);
  const [investment, setInvestment] = useState(100000);
  
  // Simulated live data sync
  useEffect(() => {
    // In a real app, this might subscribe to a websocket or poll an API
    const initialData = getROIAnalytics();
    if (initialData) {
       // We could sync with the mock util here if we wanted to enforce consistency
       // For now, we allow local overrides for the calculator playground
    }
  }, []);

  const weeklySavings = activeUsers * (adoptionRate / 100) * hoursSavedPerWeek * hourlyRate;
  const annualSavings = weeklySavings * 52;
  const roi = ((annualSavings - investment) / investment) * 100;
  const paybackMonths = investment > 0 ? (investment / (weeklySavings * 4.33)) : 0;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  const getChartData = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthlyValue = weeklySavings * 4.33;
      const cumulativeValue = monthlyValue * month;
      return {
        month,
        cumulativeValue,
        netValue: cumulativeValue - investment,
        isPositive: cumulativeValue > investment,
        heightPercent: Math.min((cumulativeValue / annualSavings) * 100, 100)
      };
    });
  };

  return {
    inputs: {
      activeUsers,
      setActiveUsers,
      hourlyRate,
      setHourlyRate,
      hoursSavedPerWeek,
      setHoursSavedPerWeek,
      adoptionRate,
      setAdoptionRate,
      investment,
      setInvestment
    },
    metrics: {
      weeklySavings,
      annualSavings,
      roi,
      paybackMonths,
      formattedAnnualSavings: formatter.format(annualSavings),
      formattedInvestment: formatter.format(investment)
    },
    chartData: getChartData()
  };
}
