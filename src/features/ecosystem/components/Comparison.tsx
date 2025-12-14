import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { plans, departments } from '../../../data/ecosystem';
import { Calculator, Check, X, DollarSign, TrendingUp, Clock } from 'lucide-react';

export function Comparison() {
  // Calculator State
  const [numUsers, setNumUsers] = useState(10);
  const [selectedDeptId, setSelectedDeptId] = useState(departments[0].id);
  const [avgSalary, setAvgSalary] = useState(75000);
  const [selectedPlanId, setSelectedPlanId] = useState('team');
  const [results, setResults] = useState<{
    annualCost: number;
    productivityValue: number;
    netValue: number;
    roi: number;
    paybackMonths: number;
  } | null>(null);

  // Calculate TCO whenever inputs change
  useEffect(() => {
    const dept = departments.find(d => d.id === selectedDeptId);
    const plan = plans.find(p => p.id === selectedPlanId);
    
    if (!dept || !plan) return;

    // Calculate costs
    let monthlyCost = 0;
    if (plan.id === 'free') monthlyCost = 0;
    else if (plan.id === 'pro') monthlyCost = 20;
    else if (plan.id === 'team') monthlyCost = 25 * numUsers;
    else monthlyCost = 30 * numUsers; // Enterprise estimate

    const annualCost = monthlyCost * 12;

    // Calculate productivity value
    // Parse ROI string "25% time savings..." -> 0.25
    const roiMatch = dept.roi.match(/(\d+)%/);
    const productivityPct = roiMatch ? parseInt(roiMatch[1]) / 100 : 0.25;
    
    const hoursPerYear = 2080;
    const hourlyRate = avgSalary / hoursPerYear;
    const hoursSaved = hoursPerYear * productivityPct * numUsers;
    const productivityValue = hoursSaved * hourlyRate;

    const netValue = productivityValue - annualCost;
    const roi = annualCost > 0 ? ((productivityValue / annualCost - 1) * 100) : 0;
    const paybackMonths = annualCost > 0 ? (annualCost / (productivityValue / 12)) : 0;

    setResults({
      annualCost,
      productivityValue,
      netValue,
      roi,
      paybackMonths
    });
  }, [numUsers, selectedDeptId, avgSalary, selectedPlanId]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Calculator Section */}
        <Card className="flex-1 shadow-md border-t-4 border-t-[#0066FF]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calculator className="w-6 h-6 text-[#0066FF]" />
              <CardTitle>TCO Calculator</CardTitle>
            </div>
            <CardDescription>Estimate total cost of ownership and ROI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Users</label>
                  <input
                    type="number"
                    min="1"
                    value={numUsers}
                    onChange={(e) => setNumUsers(parseInt(e.target.value) || 0)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <select
                    value={selectedDeptId}
                    onChange={(e) => setSelectedDeptId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Average Salary ($)</label>
                  <input
                    type="number"
                    step="1000"
                    value={avgSalary}
                    onChange={(e) => setAvgSalary(parseInt(e.target.value) || 0)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Plan</label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - {p.price}</option>
                    ))}
                  </select>
                </div>
              </div>

              {results && (
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm opacity-90">Annual Cost</div>
                      <div className="text-2xl font-bold flex items-center">
                        <DollarSign className="w-5 h-5 mr-1" />
                        {results.annualCost.toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm opacity-90">Productivity Gain</div>
                      <div className="text-2xl font-bold flex items-center">
                        <TrendingUp className="w-5 h-5 mr-1" />
                        ${Math.round(results.productivityValue).toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-1 pt-4 border-t border-white/20">
                      <div className="text-sm opacity-90">Net Value</div>
                      <div className="text-2xl font-bold">
                        ${Math.round(results.netValue).toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-1 pt-4 border-t border-white/20">
                      <div className="text-sm opacity-90">Payback Period</div>
                      <div className="text-2xl font-bold flex items-center">
                        <Clock className="w-5 h-5 mr-1" />
                        {results.paybackMonths.toFixed(1)} mo
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 text-center">
                    <div className="text-sm opacity-90">Return on Investment (ROI)</div>
                    <div className="text-4xl font-extrabold mt-1">{Math.round(results.roi)}%</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Assumptions Sidebar */}
        <Card className="md:w-80 shadow-sm bg-gray-50 dark:bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-lg">Assumptions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex gap-2">
                <span className="text-[#0066FF]">•</span>
                2,080 work hours per year
              </li>
              <li className="flex gap-2">
                <span className="text-[#0066FF]">•</span>
                Productivity gains vary by department (25%-60%)
              </li>
              <li className="flex gap-2">
                <span className="text-[#0066FF]">•</span>
                ROI = (Productivity Value / Cost - 1) × 100
              </li>
              <li className="flex gap-2">
                <span className="text-[#0066FF]">•</span>
                Payback period is time to break even
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Feature Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Comparison</CardTitle>
          <CardDescription>Detailed feature breakdown across tiers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-tl-lg">Feature</th>
                  <th className="px-4 py-3 font-semibold">Free</th>
                  <th className="px-4 py-3 font-semibold">Pro</th>
                  <th className="px-4 py-3 font-semibold">Team</th>
                  <th className="px-4 py-3 font-semibold rounded-tr-lg">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <tr>
                  <td className="px-4 py-3 font-medium">All Platforms</td>
                  <td className="px-4 py-3 text-gray-300"><X className="w-5 h-5"/></td>
                  <td className="px-4 py-3 text-green-500"><Check className="w-5 h-5"/></td>
                  <td className="px-4 py-3 text-green-500"><Check className="w-5 h-5"/></td>
                  <td className="px-4 py-3 text-green-500"><Check className="w-5 h-5"/></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">MCP Servers</td>
                  <td className="px-4 py-3 text-gray-300"><X className="w-5 h-5"/></td>
                  <td className="px-4 py-3 text-green-500"><Check className="w-5 h-5"/></td>
                  <td className="px-4 py-3 text-green-500"><Check className="w-5 h-5"/></td>
                  <td className="px-4 py-3 text-green-500"><Check className="w-5 h-5"/></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Team Workspaces</td>
                  <td className="px-4 py-3 text-gray-300"><X className="w-5 h-5"/></td>
                  <td className="px-4 py-3 text-gray-300"><X className="w-5 h-5"/></td>
                  <td className="px-4 py-3 text-green-500"><Check className="w-5 h-5"/></td>
                  <td className="px-4 py-3 text-green-500"><Check className="w-5 h-5"/></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">SSO Integration</td>
                  <td className="px-4 py-3 text-gray-300"><X className="w-5 h-5"/></td>
                  <td className="px-4 py-3 text-gray-300"><X className="w-5 h-5"/></td>
                  <td className="px-4 py-3 text-gray-300"><X className="w-5 h-5"/></td>
                  <td className="px-4 py-3 text-green-500"><Check className="w-5 h-5"/></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Zero Data Retention</td>
                  <td className="px-4 py-3 text-gray-300"><X className="w-5 h-5"/></td>
                  <td className="px-4 py-3 text-gray-300"><X className="w-5 h-5"/></td>
                  <td className="px-4 py-3 text-gray-300"><X className="w-5 h-5"/></td>
                  <td className="px-4 py-3 text-green-500"><Check className="w-5 h-5"/></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
