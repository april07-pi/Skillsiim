import React from 'react';
import { PracticalTool, Language } from '../../types';
import { t, getLocalizedText } from '../../i18n/localization';
import { Wrench, ShieldCheck, Hammer, Settings, Circle, CheckCircle2, RotateCcw, Cpu, BatteryCharging, Zap, DollarSign, CreditCard, Key, Lock, Droplet, FileText, ShieldAlert } from 'lucide-react';

interface ToolboxSelectorProps {
  availableTools: PracticalTool[];
  selectedToolId: string | null;
  onSelectTool: (toolId: string) => void;
  language: Language;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  ShieldCheck,
  Hammer,
  Settings,
  Circle,
  CheckCircle2,
  RotateCcw,
  Cpu,
  BatteryCharging,
  Zap,
  DollarSign,
  CreditCard,
  Key,
  Lock,
  Droplet,
  FileText,
  ShieldAlert,
};

export const ToolboxSelector: React.FC<ToolboxSelectorProps> = ({
  availableTools,
  selectedToolId,
  onSelectTool,
  language,
}) => {
  if (!availableTools || availableTools.length === 0) return null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 mb-4 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Wrench className="w-4 h-4" />
          {t('toolboxTitle', language)}
        </h4>
        <span className="text-[10px] text-slate-400 font-mono">
          {t('toolboxSubtitle', language)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {availableTools.map((tool) => {
          const IconComponent = iconMap[tool.icon] || Wrench;
          const isSelected = selectedToolId === tool.id;
          const name = getLocalizedText(tool, 'name', language);
          const description = getLocalizedText(tool, 'description', language);

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onSelectTool(tool.id)}
              className={`p-2.5 rounded-xl border text-left transition flex items-start gap-2.5 relative ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-400 text-slate-100 ring-2 ring-amber-400/30'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-amber-400'
                }`}
              >
                <IconComponent className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h5 className="font-bold text-xs truncate">
                    {name}
                  </h5>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                  {description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
