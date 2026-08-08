import React from 'react';
import { InteractiveObject, Language } from '../../types';
import { Monitor, Server, Cable, BatteryCharging, Terminal, Settings, Package, Smartphone, ShoppingBag, DollarSign, CreditCard, Mail, Usb, PhoneCall, Info, CheckCircle2 } from 'lucide-react';

interface Level1_2DViewProps {
  objects: InteractiveObject[];
  selectedObject: InteractiveObject | null;
  onSelectObject: (obj: InteractiveObject) => void;
  language: Language;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Monitor,
  Server,
  Cable,
  BatteryCharging,
  Terminal,
  Settings,
  Package,
  Smartphone,
  ShoppingBag,
  DollarSign,
  CreditCard,
  Mail,
  Usb,
  PhoneCall,
};

export const Level1_2DView: React.FC<Level1_2DViewProps> = ({
  objects,
  selectedObject,
  onSelectObject,
  language,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 my-2 shadow-inner">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          2D Touch Environment (Low-End Battery Saver)
        </span>
        <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
          0.0 MB GPU
        </span>
      </div>

      <p className="text-xs text-slate-300 mb-3">
        {language === 'zu'
          ? 'Thinta enye yezinto ezansi ukuyihlola noma ukubona ukuthi yini inkinga:'
          : 'Tap any object below to inspect its status or identify potential issues:'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {objects.map((obj) => {
          const IconComponent = iconMap[obj.icon] || Info;
          const isSelected = selectedObject?.id === obj.id;
          const isFaulty = obj.status === 'faulty' || obj.status === 'warning';

          return (
            <button
              key={obj.id}
              onClick={() => onSelectObject(obj)}
              className={`p-3 rounded-xl border text-left transition-all relative flex items-start gap-3 ${
                isSelected
                  ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/30'
                  : isFaulty
                  ? 'bg-amber-950/20 border-amber-800/60 hover:bg-amber-950/40'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                  isFaulty
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                }`}
              >
                <IconComponent className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-xs text-slate-100 truncate">
                    {language === 'zu' ? obj.nameZu : obj.name}
                  </h4>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {language === 'zu' ? obj.labelZu : obj.label}
                </p>
                {isFaulty && (
                  <span className="inline-block mt-1 text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-semibold">
                    {obj.status.toUpperCase()}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
