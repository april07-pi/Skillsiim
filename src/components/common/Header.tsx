import React from 'react';
import { Language, PerformanceProfile } from '../../types';
import { getLanguageMeta } from '../../i18n/languages';
import { t } from '../../i18n/localization';
import { Globe, Cpu, Wifi, WifiOff, HardDrive, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onOpenLanguageModal: () => void;
  performanceProfile: PerformanceProfile;
  onPerformanceProfileChange: (profile: PerformanceProfile) => void;
  isOnline: boolean;
  dataSaverEnabled: boolean;
  onOpenDataSaver: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onOpenLanguageModal,
  performanceProfile,
  onPerformanceProfileChange,
  isOnline,
  dataSaverEnabled,
  onOpenDataSaver,
}) => {
  const meta = getLanguageMeta(language);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-md px-3 py-2.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-emerald-600 to-teal-700 flex items-center justify-center font-bold text-white shadow-sm text-lg tracking-wider border border-amber-400/30">
            ZA
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base tracking-tight text-white leading-none">
                Simunye<span className="text-amber-400 font-semibold">Skills</span>
              </h1>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                SA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t('tagline', language)}
            </p>
          </div>
        </div>

        {/* Status Indicators & Multilingual 12-Language Selector Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* App Footprint Badge */}
          <button
            onClick={onOpenDataSaver}
            className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs transition"
            title="Application download size budget meter"
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[11px]">2.1 MB / 15 MB</span>
          </button>

          {/* Data Saver Pill */}
          {dataSaverEnabled && (
            <button
              onClick={onOpenDataSaver}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-medium hover:bg-emerald-900/60 transition"
              title="Data Saver active"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xs:inline text-[11px]">Data Saver</span>
            </button>
          )}

          {/* Online/Offline Status */}
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${
              isOnline
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                : 'bg-amber-950/40 text-amber-300 border-amber-800/60'
            }`}
          >
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="text-[11px]">
              {isOnline ? t('onlinePill', language) : t('offlinePill', language)}
            </span>
          </div>

          {/* Performance Profile Selector Pill */}
          <button
            onClick={() => {
              const next: Record<PerformanceProfile, PerformanceProfile> = {
                LOW: 'STANDARD',
                STANDARD: 'HIGH',
                HIGH: 'LOW',
              };
              onPerformanceProfileChange(next[performanceProfile]);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition"
            title="Tap to toggle low-end performance mode"
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-bold text-[11px] text-amber-300">
              {performanceProfile}
            </span>
          </button>

          {/* 12-Language Selector Button */}
          <button
            onClick={onOpenLanguageModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition active:scale-95"
            title="Select South African language (12 Official SA Languages)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="uppercase font-extrabold">{language}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
