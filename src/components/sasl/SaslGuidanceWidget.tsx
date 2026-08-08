import React, { useState } from 'react';
import { Language, SaslGestureInstruction } from '../../types';
import { Eye, Hand, Sparkles, VolumeX, ShieldCheck, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

interface SaslGuidanceWidgetProps {
  stepId: number;
  stepTitle: string;
  stepObjective: string;
  language: Language;
}

export const SaslGuidanceWidget: React.FC<SaslGuidanceWidgetProps> = ({
  stepId,
  stepTitle,
  stepObjective,
  language,
}) => {
  const [isPlayingMotion, setIsPlayingMotion] = useState(true);

  // Pre-authored visual gesture cards mapping for vocational simulation steps
  const getGestureForStep = (id: number): SaslGestureInstruction => {
    switch (id) {
      case 1:
        return {
          stepId: 1,
          gestureName: 'SHUT OFF VALVE (ROTATE CLOCKWISE)',
          signDescription: 'Hold hands in two-fist posture, rotate right hand clockwise in firm twisting movement to indicate closing main water valve.',
          visualIconName: 'RotateCcw',
          captionText: 'Sign: [VALVE] -> [TURN] -> [STOP WATER]',
          actionSignType: 'turn',
        };
      case 2:
        return {
          stepId: 2,
          gestureName: 'PRESSURE MULTIMETER INSPECT',
          signDescription: 'Extend left palm flat like a gauge, tap right index finger twice to signal testing pressure voltage level.',
          visualIconName: 'Check',
          captionText: 'Sign: [GAUGE] -> [INSPECT] -> [READ LEVEL]',
          actionSignType: 'check',
        };
      case 3:
        return {
          stepId: 3,
          gestureName: 'WRAP PTFE TAPE (CLOCKWISE SEAL)',
          signDescription: 'Hold thumb and index finger together, wrap around left index finger 5-6 times tight to demonstrate pipe thread seal.',
          visualIconName: 'RotateCcw',
          captionText: 'Sign: [THREAD] -> [TAPE WRAP] -> [SEAL TIGHT]',
          actionSignType: 'caution',
        };
      default:
        return {
          stepId,
          gestureName: 'CHECK & VERIFY COMPONENT',
          signDescription: 'Point index finger to component, make thumbs-up sign to verify correct placement.',
          visualIconName: 'CheckCircle2',
          captionText: 'Sign: [INSPECT] -> [VERIFY] -> [SAFE]',
          actionSignType: 'inspect',
        };
    }
  };

  const gesture = getGestureForStep(stepId);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 rounded-2xl p-3.5 mb-4 shadow-lg animate-fadeIn text-slate-100">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-indigo-500/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold text-sm">
            🤟
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>South African Sign Language (SASL) Guidance</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Non-Audio Visual Pathway Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <VolumeX className="w-3 h-3 text-indigo-400" />
            100% Visual
          </span>
        </div>
      </div>

      {/* Interactive Visual Gesture Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
        {/* Animated Gesture Placeholder Avatar Box */}
        <div className="sm:col-span-1 bg-slate-950 border border-indigo-500/30 rounded-xl p-3 text-center relative overflow-hidden group">
          <div className="absolute top-1 right-1">
            <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-800">
              SASL Pose
            </span>
          </div>

          <div className="my-2 relative flex items-center justify-center">
            {/* Visual Ripple effect representing sign gesture motion */}
            <div className={`w-14 h-14 rounded-full bg-indigo-500/10 border-2 border-indigo-400/60 flex items-center justify-center text-2xl transition-transform ${isPlayingMotion ? 'animate-pulse scale-105' : ''}`}>
              👐
            </div>
            <div className="absolute bottom-0 right-1/4 bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full shadow">
              {gesture.actionSignType.toUpperCase()}
            </div>
          </div>

          <p className="text-[10px] font-mono font-bold text-indigo-300 truncate">
            {gesture.gestureName}
          </p>

          <button
            onClick={() => setIsPlayingMotion(!isPlayingMotion)}
            className="mt-2 text-[10px] text-slate-400 hover:text-indigo-300 underline font-medium block mx-auto"
          >
            {isPlayingMotion ? 'Pause Motion' : 'Replay Gesture'}
          </button>
        </div>

        {/* Gesture Description & Visual Captions */}
        <div className="sm:col-span-2">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 mb-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
              Sign Language Description
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {gesture.signDescription}
            </p>
          </div>

          <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-2 text-[11px] font-mono text-indigo-200 flex items-center gap-2">
            <Hand className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">{gesture.captionText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
