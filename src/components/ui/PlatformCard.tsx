import React from "react";
import { cn } from "./utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { Check, Plus, Info, ChevronRight } from "lucide-react";

export interface PlatformCardProps {
  id: string;
  name: string;
  provider: string;
  logoUrl?: string;
  priority: "baseline" | "high" | "specialized" | "optional";
  description: string;
  pricing: string;
  contextWindow: string;
  strengths: string[];
  isSelected?: boolean;
  onSelect?: () => void;
  onDetails?: () => void;
  className?: string;
}

export function PlatformCard({
  id,
  name,
  provider,
  logoUrl,
  priority,
  description,
  pricing,
  contextWindow,
  strengths,
  isSelected = false,
  onSelect,
  onDetails,
  className,
}: PlatformCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-lg border bg-white p-5 transition-all duration-200",
        "hover:shadow-md hover:-translate-y-0.5",
        isSelected
          ? "border-[#E97132] shadow-[0_4px_16px_rgba(233,113,50,0.2)]"
          : "border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.05)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={name} className="w-8 h-8 object-contain" />
            ) : (
              <div className="text-lg font-bold text-slate-400">{name.charAt(0)}</div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">{name}</h3>
            <p className="text-xs text-slate-500">{provider}</p>
          </div>
        </div>
        <Badge variant={priority} className="uppercase text-[10px] tracking-wider px-1.5">
          {priority}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px]">
        {description}
      </p>

      {/* Quick Stats */}
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-700">Cost:</span>
          {pricing}
        </div>
        <div className="w-px h-3 bg-slate-200" />
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-700">Context:</span>
          {contextWindow}
        </div>
      </div>

      {/* Strengths */}
      <div className="flex-1 space-y-2 mb-6">
        {strengths.slice(0, 3).map((strength, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
            <Check className="w-3.5 h-3.5 text-[#E97132] mt-0.5 shrink-0" />
            <span>{strength}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto pt-2">
        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className={cn(
            "flex-1 gap-2",
            isSelected ? "bg-[#E97132] hover:bg-[#D66429]" : "hover:text-[#E97132] hover:border-[#E97132]"
          )}
          onClick={onSelect}
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4" />
              Selected
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Compare
            </>
          )}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600" onClick={onDetails}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
