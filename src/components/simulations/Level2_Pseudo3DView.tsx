import React, { useState } from 'react';
import { InteractiveObject, Language } from '../../types';
import { Monitor, Server, Cable, BatteryCharging, Terminal, Settings, Package, Smartphone, ShoppingBag, DollarSign, CreditCard, Mail, Usb, PhoneCall, ZoomIn, ZoomOut, RotateCcw, Sparkles, Info } from 'lucide-react';

interface Level2_Pseudo3DViewProps {
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

export const Level2_Pseudo3DView: React.FC<Level2_Pseudo3DViewProps> = ({
  objects,
  selectedObject,
  onSelectObject,
  language,
}) => {
  const [zoom, setZoom] = useState<number>(1);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden my-2 shadow-lg relative">
      {/* HUD Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs text-slate-300">
        <span className="flex items-center gap-1.5 font-medium text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          Pseudo-3D Isometric Canvas (Level 2)
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.15, 1.4))}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.15, 0.8))}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Isometric Canvas Container */}
      <div className="relative w-full h-[280px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden flex items-center justify-center p-2">
        {/* Isometric Grid Surface Background */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="isoGrid"
              width="40"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 40 12 L 20 24 L 0 12 Z"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#isoGrid)" />
        </svg>

        {/* Isometric 3D Floor Room Box */}
        <div
          className="relative w-full max-w-[420px] h-[220px] transition-transform duration-300"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Floor Polygon */}
          <div className="absolute inset-x-8 bottom-4 top-12 bg-slate-800/60 rounded-3xl border border-slate-700/50 transform -skew-x-12 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/20 via-transparent to-amber-950/20 rounded-3xl" />
          </div>

          {/* Interactive Objects Placed in Isometric Hotspots */}
          {objects.map((obj) => {
            const IconComponent = iconMap[obj.icon] || Info;
            const isSelected = selectedObject?.id === obj.id;
            const isFaulty = obj.status === 'faulty' || obj.status === 'warning';

            return (
              <div
                key={obj.id}
                onClick={() => onSelectObject(obj)}
                className="absolute cursor-pointer group transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{
                  left: `${obj.position.x}%`,
                  top: `${obj.position.y}%`,
                }}
              >
                {/* Hotspot Pulse Ring */}
                {isFaulty && (
                  <div className="absolute -inset-3 rounded-full bg-amber-500/20 animate-ping pointer-events-none" />
                )}

                {/* 3D Isometric Object Box */}
                <div
                  className={`relative p-3 rounded-2xl border flex flex-col items-center justify-center shadow-lg transition-all transform group-hover:scale-110 active:scale-95 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-300 ring-4 ring-amber-400/40 -translate-y-2'
                      : isFaulty
                      ? 'bg-slate-900 border-amber-500 text-amber-400 animate-bounce'
                      : 'bg-slate-900/90 border-slate-700 text-teal-300 hover:border-teal-400'
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                  <span className="text-[10px] font-bold mt-1 text-center truncate max-w-[80px] px-1">
                    {language === 'zu' ? obj.nameZu : obj.name}
                  </span>

                  {/* Pin Indicator */}
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shadow-sm" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-900 px-3 py-1.5 text-[11px] text-slate-400 text-center border-t border-slate-800">
        {language === 'zu'
          ? 'Thinta enye yezinto ezikuso isithombe se-Pseudo-3D ukuze uyihlolisise.'
          : 'Tap any object in the Pseudo-3D canvas scene to inspect diagnostic details.'}
      </div>
    </div>
  );
};
