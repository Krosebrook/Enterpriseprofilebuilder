import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Activity, Users, DollarSign, Zap, TrendingUp } from 'lucide-react';

export function ROIFramework() {
  // Live ROI Calculation State
  const [activeUsers, setActiveUsers] = useState(125); // Default simulated
  const [hourlyRate, setHourlyRate] = useState(75);
  const [hoursSavedPerWeek, setHoursSavedPerWeek] = useState(5);
  const [adoptionRate, setAdoptionRate] = useState(82);
  const [investment, setInvestment] = useState(100000);

  // Derived Calculations
  const weeklySavings = activeUsers * (adoptionRate / 100) * hoursSavedPerWeek * hourlyRate;
  const annualSavings = weeklySavings * 52;
  const roi = ((annualSavings - investment) / investment) * 100;
  const paybackMonths = (investment / (weeklySavings * 4.33));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" />
              Live Inputs
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Users</label>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-slate-400" />
                  <input 
                    type="number" 
                    value={activeUsers}
                    onChange={(e) => setActiveUsers(Number(e.target.value))}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Adoption Rate (%)</label>
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <div className="flex-1 flex items-center gap-2">
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={adoptionRate}
                      onChange={(e) => setAdoptionRate(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono w-12 text-right">{adoptionRate}%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Avg Hourly Rate ($)</label>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <input 
                    type="number" 
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hours Saved / User / Week</label>
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-slate-400" />
                  <input 
                    type="number" 
                    value={hoursSavedPerWeek}
                    onChange={(e) => setHoursSavedPerWeek(Number(e.target.value))}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>

               <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Investment ($)</label>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <input 
                    type="number" 
                    value={investment}
                    onChange={(e) => setInvestment(Number(e.target.value))}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="bg-slate-100 p-4 rounded-lg text-xs text-slate-500">
            <p className="mb-2 font-bold">Formula:</p>
            <code>ROI = (Annual Savings - Investment) / Investment</code>
            <p className="mt-2">
              Based on Larridin framework & LSE research on AI productivity.
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="bg-emerald-900 text-white border-none shadow-xl">
               <div className="p-2">
                 <p className="text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">Annual Savings</p>
                 <div className="text-3xl font-bold font-mono">
                   ${annualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                 </div>
                 <div className="mt-2 flex items-center gap-2 text-xs text-emerald-200">
                   <TrendingUp className="w-3 h-3" />
                   <span>Based on current adoption</span>
                 </div>
               </div>
             </Card>

             <Card className="bg-slate-900 text-white border-none shadow-xl">
               <div className="p-2">
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">ROI (Year 1)</p>
                 <div className="text-3xl font-bold font-mono text-amber-400">
                   {roi.toLocaleString(undefined, { maximumFractionDigits: 0 })}%
                 </div>
                 <div className="mt-2 text-xs text-slate-400">
                   Payback in <span className="text-white font-bold">{paybackMonths.toFixed(1)} months</span>
                 </div>
               </div>
             </Card>
          </div>

          <Card>
            <h3 className="font-bold text-slate-900 mb-4">Projected Value Over Time</h3>
            <div className="h-48 flex items-end justify-between gap-2 border-b border-slate-200 pb-2 px-2">
               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
                 const monthlyValue = (weeklySavings * 4.33);
                 const cumulativeValue = monthlyValue * month;
                 const isPositive = cumulativeValue > investment;
                 const heightPercent = Math.min((cumulativeValue / (annualSavings)) * 100, 100);
                 
                 return (
                   <div key={month} className="flex-1 flex flex-col justify-end items-center group relative">
                     {/* Tooltip */}
                     <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-xs p-2 rounded z-10 whitespace-nowrap">
                       Month {month}: ${(cumulativeValue - investment).toLocaleString()} net
                     </div>
                     
                     <div 
                        className={`w-full rounded-t transition-all ${isPositive ? 'bg-emerald-500' : 'bg-rose-400'}`}
                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                     />
                     <span className="text-[10px] text-slate-500 mt-2">M{month}</span>
                   </div>
                 );
               })}
            </div>
            <div className="flex justify-center gap-8 mt-4 text-xs">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-rose-400 rounded-sm" />
                 <span className="text-slate-600">Investment Recovery</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                 <span className="text-slate-600">Net Profit</span>
               </div>
            </div>
          </Card>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4">
            <div className="p-2 bg-amber-100 rounded-full h-fit text-amber-600">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 text-sm">Strategic Insight</h4>
              <p className="text-sm text-amber-800 mt-1">
                With {activeUsers} users and {adoptionRate}% adoption, you are on track to generate 
                <span className="font-bold"> ${(annualSavings / 1000000).toFixed(2)}M</span> in productivity value this year. 
                Increasing adoption by just 10% would add another <span className="font-bold">${((activeUsers * 0.10 * hoursSavedPerWeek * hourlyRate * 52) / 1000).toFixed(0)}k</span> in annual value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
