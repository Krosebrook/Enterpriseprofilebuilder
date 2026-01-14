import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import { Slider } from '../../../components/ui/slider';
import { Separator } from '../../../components/ui/separator';
import { Download, DollarSign, TrendingUp, Users, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ROICalculator() {
  // State for Inputs
  const [employees, setEmployees] = useState(1000);
  const [avgSalary, setAvgSalary] = useState(120000);
  const [adoptionRate, setAdoptionRate] = useState(40); // %
  const [productivityGain, setProductivityGain] = useState(2.5); // hours/week
  const [licenseCost, setLicenseCost] = useState(30); // $/user/month

  // Calculations
  const results = useMemo(() => {
    const activeUsers = Math.floor(employees * (adoptionRate / 100));
    const hourlyRate = avgSalary / (52 * 40); // Simple 40h week
    
    // Costs
    const annualLicenseCost = activeUsers * licenseCost * 12;
    const implementationCost = activeUsers * 200; // Fixed one-time setup estimation
    const totalYear1Cost = annualLicenseCost + implementationCost;

    // Gains
    const weeklyHoursSaved = activeUsers * productivityGain;
    const annualHoursSaved = weeklyHoursSaved * 48; // 48 working weeks
    const annualValueSaved = annualHoursSaved * hourlyRate;

    // ROI
    const netBenefit = annualValueSaved - totalYear1Cost;
    const roiPercent = (netBenefit / totalYear1Cost) * 100;

    return {
      activeUsers,
      annualLicenseCost,
      totalYear1Cost,
      annualValueSaved,
      netBenefit,
      roiPercent
    };
  }, [employees, avgSalary, adoptionRate, productivityGain, licenseCost]);

  // Chart Data (3 Year Projection)
  const chartData = [
    {
      name: 'Year 1',
      Cost: Math.round(results.totalYear1Cost),
      Value: Math.round(results.annualValueSaved),
    },
    {
      name: 'Year 2',
      Cost: Math.round(results.annualLicenseCost), // No implementation cost
      Value: Math.round(results.annualValueSaved * 1.1), // 10% efficiency gain
    },
    {
      name: 'Year 3',
      Cost: Math.round(results.annualLicenseCost),
      Value: Math.round(results.annualValueSaved * 1.2), // 20% efficiency gain
    },
  ];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
      {/* Inputs Panel */}
      <div className="w-full lg:w-1/3 bg-slate-50 border-r p-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Parameters</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Total Employees</Label>
            <div className="relative">
              <Users className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                type="number" 
                value={employees} 
                onChange={(e) => setEmployees(Number(e.target.value))}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
             <Label>Avg. Annual Salary ($)</Label>
             <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                type="number" 
                value={avgSalary} 
                onChange={(e) => setAvgSalary(Number(e.target.value))}
                className="pl-9"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Adoption Rate</Label>
              <span className="text-sm font-medium text-slate-700">{adoptionRate}%</span>
            </div>
            <Slider 
              value={[adoptionRate]} 
              onValueChange={(val) => setAdoptionRate(val[0])} 
              max={100} 
              step={5}
            />
            <p className="text-xs text-slate-500">
              {results.activeUsers} active users estimated.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Productivity Gain (Hours/Week)</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                type="number" 
                value={productivityGain} 
                onChange={(e) => setProductivityGain(Number(e.target.value))}
                className="pl-9"
                step={0.5}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>License Cost ($/User/Mo)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                type="number" 
                value={licenseCost} 
                onChange={(e) => setLicenseCost(Number(e.target.value))}
                className="pl-9"
              />
            </div>
          </div>

          <Button className="w-full mt-4 bg-[#E97132] hover:bg-[#D66429]">
            <Download className="w-4 h-4 mr-2" />
            Export ROI Report
          </Button>
        </div>
      </div>

      {/* Results Panel */}
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Projected Value Analysis</h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-slate-500 uppercase">Annual Cost</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(results.totalYear1Cost)}</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 border-emerald-100">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-emerald-600 uppercase">Annual Value</p>
              <p className="text-xl font-bold text-emerald-900 mt-1">{formatCurrency(results.annualValueSaved)}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-blue-600 uppercase">Net Benefit</p>
              <p className="text-xl font-bold text-blue-900 mt-1">{formatCurrency(results.netBenefit)}</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-100">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-purple-600 uppercase">ROI</p>
              <p className="text-xl font-bold text-purple-900 mt-1 flex items-center gap-1">
                {results.roiPercent.toFixed(0)}%
                <TrendingUp className="w-4 h-4" />
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3-Year ROI Projection</CardTitle>
            <CardDescription>Estimated cost vs. value generated based on efficiency gains.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(val) => `$${val/1000}k`} tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(val: number) => formatCurrency(val)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
                <Bar dataKey="Cost" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Value" fill="#E97132" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Assumptions Footer */}
        <div className="text-xs text-slate-400 italic">
          * Calculations assume 48 working weeks/year. Year 2 and Year 3 project 10% and 20% efficiency compounding respectively.
          Implementation cost estimated at $200 per user one-time.
        </div>
      </div>
    </div>
  );
}
