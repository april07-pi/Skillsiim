import React from 'react';
import { Language, PerformanceProfile, UserProgress } from '../../types';
import { t } from '../../i18n/localization';
import { Play, BookOpen, Shield, Award, Cpu, Zap, HardDrive, CheckCircle2, ArrowRight, Wrench, Plane, Store, Laptop, Car } from 'lucide-react';

interface HomeScreenProps {
  language: Language;
  performanceProfile: PerformanceProfile;
  userProgress: UserProgress;
  onSelectSimulation: (simId: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  performanceProfile,
  userProgress,
  onSelectSimulation,
  onNavigateTab,
}) => {
  return (
    <div className="max-w-4xl mx-auto pb-24 px-3 py-4 text-slate-100">
      {/* Hero Call to Action Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/40 border border-slate-700/80 p-5 sm:p-6 mb-5 shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">
              South African Mobile First
            </span>
            <span className="text-xs text-amber-300 font-mono flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Practical Hands-On Engine
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight leading-tight mb-2">
            «"{t('slogan', language)}"»
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed mb-5">
            Virtually practise vocational trade tasks, test real tools, manage business budgets, and troubleshoot technical errors in realistic South African scenarios.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectSimulation('sim_plumbing_1')}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-xl transition active:scale-95"
            >
              <Wrench className="w-4 h-4" />
              <span>Practise Plumbing Trade</span>
            </button>

            <button
              onClick={() => onNavigateTab('skills')}
              className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Explore 10+ Vocational Trades</span>
            </button>
          </div>
        </div>
      </div>

      {/* Device Capability Notice Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 mb-5 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
              <span>{t('devicePerformanceNotice', language)}:</span>
              <span className="text-amber-400 font-mono font-extrabold">
                {performanceProfile} Profile
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t('lowEndOptimized', language)}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('datasaver')}
          className="text-xs text-amber-400 hover:underline shrink-0 font-medium hidden sm:block"
        >
          Manage
        </button>
      </div>

      {/* Learner Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">
            {t('statsSimulationsCompleted', language)}
          </span>
          <span className="text-lg font-black text-amber-400 font-mono">
            {Object.keys(userProgress.completedSimulations).length} / 4
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">
            {t('statsTotalXP', language)}
          </span>
          <span className="text-lg font-black text-emerald-400 font-mono">
            {userProgress.xp} XP
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">
            {t('statsStreak', language)}
          </span>
          <span className="text-lg font-black text-teal-400 font-mono">
            {userProgress.streakDays} Days
          </span>
        </div>
      </div>

      {/* Featured Practical Simulations Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
            Interactive Vocational Simulations
          </h3>
          <button
            onClick={() => onNavigateTab('simulations')}
            className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>View Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Sim 1: Plumbing */}
          <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 transition shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                  <Wrench className="w-3 h-3" />
                  PLUMBING TRADE
                </span>
                <span className="text-[11px] text-slate-400 font-mono">0.8 MB</span>
              </div>
              <h4 className="font-bold text-sm text-slate-100 mb-1">
                Leaking Main Pipe & Stopcock Repair
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                Shut off main water supply, test pressure, wrap PTFE tape, and replace worn rubber washers.
              </p>
            </div>

            <button
              onClick={() => onSelectSimulation('sim_plumbing_1')}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Practise Plumbing</span>
            </button>
          </div>

          {/* Sim 2: IT Hardware */}
          <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 transition shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30 flex items-center gap-1">
                  <Laptop className="w-3 h-3" />
                  IT HARDWARE
                </span>
                <span className="text-[11px] text-slate-400 font-mono">0.9 MB</span>
              </div>
              <h4 className="font-bold text-sm text-slate-100 mb-1">
                PC Power & RAM Component Repair
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                Grounded ESD anti-static safety, PSU voltage testing, and RAM stick contact cleaning.
              </p>
            </div>

            <button
              onClick={() => onSelectSimulation('sim_it_hardware_1')}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Practise IT Repair</span>
            </button>
          </div>

          {/* Sim 3: Spaza Business */}
          <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 transition shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                  <Store className="w-3 h-3" />
                  ENTREPRENEURSHIP
                </span>
                <span className="text-[11px] text-slate-400 font-mono">0.7 MB</span>
              </div>
              <h4 className="font-bold text-sm text-slate-100 mb-1">
                Township Spaza Shop Stocking & Cash Flow
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                Allocate R1,500 inventory budget, manage load-shedding risks & calculate profit margins.
              </p>
            </div>

            <button
              onClick={() => onSelectSimulation('sim_spaza_mgmt_1')}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Practise Spaza Biz</span>
            </button>
          </div>

          {/* Sim 4: Electrical DB Board */}
          <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 transition shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded border border-yellow-500/30 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  ELECTRICAL TRADE
                </span>
                <span className="text-[11px] text-slate-400 font-mono">0.8 MB</span>
              </div>
              <h4 className="font-bold text-sm text-slate-100 mb-1">
                DB Board Circuit Breaker & Fault Repair
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                Main isolator lockout, 600V CAT III multimeter busbar testing, and appliance short-circuit isolation.
              </p>
            </div>

            <button
              onClick={() => onSelectSimulation('sim_electrical_1')}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Practise Electrical</span>
            </button>
          </div>

          {/* Sim 5: Automotive Battery & Starting */}
          <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 transition shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 flex items-center gap-1">
                  <Car className="w-3 h-3" />
                  AUTOMOTIVE MECHANIC
                </span>
                <span className="text-[11px] text-slate-400 font-mono">0.8 MB</span>
              </div>
              <h4 className="font-bold text-sm text-slate-100 mb-1">
                Vehicle Engine Click-No-Start Diagnostics
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                12V load voltage testing, wire brush sulfation post scrubbing, and 14.2V alternator charge test.
              </p>
            </div>

            <button
              onClick={() => onSelectSimulation('sim_automotive_1')}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Practise Automotive</span>
            </button>
          </div>

          {/* Sim 6: Aviation Pre-Flight */}
          <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 transition shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 flex items-center gap-1">
                  <Plane className="w-3 h-3" />
                  AVIATION
                </span>
                <span className="text-[11px] text-slate-400 font-mono">0.8 MB</span>
              </div>
              <h4 className="font-bold text-sm text-slate-100 mb-1">
                Light Aircraft Pre-Flight Walkaround Inspection
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                Check pitot tube covers, perform fuel sump contamination checks, and verify control surface locks.
              </p>
            </div>

            <button
              onClick={() => onSelectSimulation('sim_aviation_preflight_1')}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Practise Pre-Flight</span>
            </button>
          </div>
        </div>
      </div>

      {/* Low-Data Footprint Guarantee Footer Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <HardDrive className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold text-slate-100 block">
              15 MB Application Size Guarantee
            </span>
            <span className="text-slate-400 text-[11px]">
              Lessons run 100% offline after installation without consuming extra data.
            </span>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('datasaver')}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-lg shrink-0"
        >
          Details
        </button>
      </div>
    </div>
  );
};
