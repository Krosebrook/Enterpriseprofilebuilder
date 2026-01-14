import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Activity, 
  Download,
  Calendar
} from 'lucide-react';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { usageData, modelUsageData, userActivityData } from './data/analyticsData';

export function AnalyticsDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <SectionHeader 
          title="Advanced Analytics" 
          description="Monitor agent usage, token consumption, and operational costs across the organization."
          icon={Activity}
        />
        <div className="flex gap-2">
           <Button variant="outline" size="sm">
             <Calendar className="w-4 h-4 mr-2" />
             Last 7 Days
           </Button>
           <Button variant="outline" size="sm">
             <Download className="w-4 h-4 mr-2" />
             Export Report
           </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Prompts" 
          value="1,245" 
          change="+12.5%" 
          trend="up"
          icon={TrendingUp}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <KpiCard 
          title="Tokens Consumed" 
          value="3.2M" 
          change="+8.1%" 
          trend="up"
          icon={Activity}
          color="text-purple-600"
          bg="bg-purple-50"
        />
        <KpiCard 
          title="Est. Cost" 
          value="$42.50" 
          change="-2.3%" 
          trend="down"
          icon={CreditCard}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <KpiCard 
          title="Active Users" 
          value="84" 
          change="+4" 
          trend="up"
          icon={Users}
          color="text-amber-600"
          bg="bg-amber-50"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Usage Trend */}
        <div className="lg:col-span-2">
           <Card className="h-full">
             <div className="mb-6">
               <h3 className="font-bold text-slate-900 text-lg">Usage Trends</h3>
               <p className="text-slate-500 text-sm">Daily prompt volume and token consumption</p>
             </div>
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                   <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   />
                   <Line type="monotone" dataKey="prompts" stroke="#d97706" strokeWidth={3} dot={{ r: 4, fill: '#d97706', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="Prompts" />
                   <Line type="monotone" dataKey="tokens" stroke="#4f46e5" strokeWidth={3} dot={false} name="Tokens (x100)" />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           </Card>
        </div>

        {/* Model Distribution */}
        <div className="lg:col-span-1">
           <Card className="h-full">
             <div className="mb-6">
               <h3 className="font-bold text-slate-900 text-lg">Model Distribution</h3>
               <p className="text-slate-500 text-sm">Usage by AI model</p>
             </div>
             <div className="h-[200px] w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={modelUsageData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {modelUsageData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
               {/* Center Text */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-slate-900">1.2k</span>
                    <span className="text-xs text-slate-500">Total Runs</span>
                  </div>
               </div>
             </div>
             <div className="mt-6 space-y-3">
               {modelUsageData.map((item, i) => (
                 <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                       <span className="text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-medium text-slate-900">{item.value}%</span>
                 </div>
               ))}
             </div>
           </Card>
        </div>
      </div>

      {/* Top Users Table */}
      <Card>
        <div className="mb-6">
           <h3 className="font-bold text-slate-900 text-lg">Top Active Users</h3>
           <p className="text-slate-500 text-sm">Most active team members by request volume</p>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-sm text-left">
             <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs font-semibold">
               <tr>
                 <th className="px-4 py-3 rounded-tl-lg">User</th>
                 <th className="px-4 py-3">Role</th>
                 <th className="px-4 py-3">Requests</th>
                 <th className="px-4 py-3 rounded-tr-lg text-right">Last Active</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {userActivityData.map((user) => (
                 <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                   <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                   <td className="px-4 py-3">
                     <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                       {user.role}
                     </span>
                   </td>
                   <td className="px-4 py-3 text-slate-600">{user.requests.toLocaleString()}</td>
                   <td className="px-4 py-3 text-right text-slate-400">{user.lastActive}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </Card>
    </div>
  );
}

function KpiCard({ title, value, change, trend, icon: Icon, color, bg }: any) {
  return (
    <Card className="flex items-center gap-4 p-6">
      <div className={`p-3 rounded-xl ${bg} ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="flex items-baseline gap-2">
           <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
           <span className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
             {change}
           </span>
        </div>
      </div>
    </Card>
  );
}
