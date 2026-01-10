import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export function SuccessMetrics() {
  const metrics = [
    {
      category: "Activation",
      items: [
        { label: "Users Logged In (30d)", target: "90%+" },
        { label: "Onboarding Complete", target: "80%+" },
        { label: "Time to First Value", target: "< 7 days" }
      ]
    },
    {
      category: "Adoption",
      items: [
        { label: "Weekly Active Users", target: "70%+" },
        { label: "Daily Active Users", target: "40%+" },
        { label: "Feature Usage", target: "3+ per week" }
      ]
    },
    {
      category: "Business Value",
      items: [
        { label: "Time Saved / User", target: "5+ hrs/week" },
        { label: "Error Reduction", target: "30%+" },
        { label: "Cost ROI (12mo)", target: "5x" }
      ]
    },
    {
      category: "Satisfaction",
      items: [
        { label: "Net Promoter Score", target: "50+" },
        { label: "User Satisfaction", target: "4.5/5 stars" },
        { label: "Support Volume", target: "< 5% users/mo" }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {metrics.map((section) => (
        <Card key={section.category} className="hover:shadow-md transition-shadow">
          <h4 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">{section.category} Metrics</h4>
          <div className="space-y-4">
            {section.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-slate-600">{item.label}</span>
                <Badge variant="success" className="font-mono">{item.target}</Badge>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
