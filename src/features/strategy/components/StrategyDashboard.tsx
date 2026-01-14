import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import { ArrowUpRight, BookOpen, Printer, TrendingUp, Users, Zap, ShieldCheck } from 'lucide-react';
import { STRATEGY_DATA } from '../data/strategyData';

export function StrategyDashboard() {
  const { stats, recommendations, sources } = STRATEGY_DATA;

  const getIcon = (color: string) => {
    switch (color) {
      case 'emerald': return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'amber': return <Zap className="w-5 h-5 text-amber-600" />;
      case 'blue': return <Users className="w-5 h-5 text-blue-600" />;
      case 'purple': return <ShieldCheck className="w-5 h-5 text-purple-600" />;
      default: return <TrendingUp className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Strategy & Roadmap</h1>
          <p className="text-slate-500 mt-2">Executive summary and tiered platform recommendations for Q1 2026.</p>
        </div>
        <Button variant="outline">
          <Printer className="w-4 h-4 mr-2" />
          Print / PDF
        </Button>
      </div>

      {/* Key Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <StatsCard 
            key={stat.id}
            icon={getIcon(stat.color)}
            label={stat.label}
            value={stat.value}
            subtext={stat.subtext}
            trend={stat.trend}
          />
        ))}
      </div>

      <Separator />

      {/* Tiered Recommendations */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#E97132]" />
          Strategic Recommendations
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {recommendations.map(rec => (
            <RecommendationCard 
              key={rec.tier}
              {...rec}
            />
          ))}
        </div>
      </div>

      {/* Sources Footer */}
      <div className="bg-slate-50 rounded-lg p-6 border">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Research Sources & Methodology</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
          <ul className="list-disc pl-4 space-y-2">
            {sources.primary.map((source, idx) => (
              <li key={idx}>
                <span className="font-semibold">{source.name}:</span> {source.desc}
              </li>
            ))}
          </ul>
          <ul className="list-disc pl-4 space-y-2">
             {sources.secondary.map((source, idx) => (
              <li key={idx}>
                <span className="font-semibold">{source.name}:</span> {source.desc}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon, label, value, subtext, trend }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-slate-50 rounded-lg border">{icon}</div>
          <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-100">{trend}</Badge>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-xs text-slate-400">{subtext}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function RecommendationCard({ tier, title, models, color, description, useCases }: any) {
  return (
    <div className="flex flex-col h-full border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className={`${color} p-1`}></div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white mb-2 ${color}`}>
              {tier}
            </span>
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          </div>
        </div>
        
        <p className="text-sm text-slate-600 mb-6">{description}</p>
        
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-bold text-slate-900 uppercase">Recommended Models</h4>
          <div className="flex flex-wrap gap-2">
            {models.map((m: string) => (
              <Badge key={m} variant="secondary" className="bg-slate-100 text-slate-800 hover:bg-slate-200">
                {m}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <Separator className="mb-4" />
          <h4 className="text-xs font-bold text-slate-900 uppercase mb-3">Primary Use Cases</h4>
          <ul className="space-y-2">
            {useCases.map((uc: string, i: number) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                {uc}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
