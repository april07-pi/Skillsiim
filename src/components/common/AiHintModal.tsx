import React, { useState } from 'react';
import { Language } from '../../types';
import { t } from '../../i18n/localization';
import { Bot, Sparkles, X, WifiOff, CheckCircle2 } from 'lucide-react';

interface AiHintModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  scenarioTitle: string;
  defaultHint: string;
  isOnline: boolean;
}

export const AiHintModal: React.FC<AiHintModalProps> = ({
  isOpen,
  onClose,
  language,
  scenarioTitle,
  defaultHint,
  isOnline,
}) => {
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [source, setSource] = useState<string>('Pre-Authored Local Decision Tree');

  if (!isOpen) return null;

  const fetchAiHint = async () => {
    setLoading(true);
    setAiResponse(null);

    if (!isOnline) {
      setTimeout(() => {
        setAiResponse(defaultHint);
        setSource('Offline Pre-Authored Mentor Decision Tree');
        setLoading(false);
      }, 300);
      return;
    }

    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Give me a concise workplace advice hint for this South African simulation task: "${scenarioTitle}".`,
          scenario: scenarioTitle,
          language,
        }),
      });
      const data = await res.json();
      setAiResponse(data.hint || defaultHint);
      setSource(data.source || 'Simunye AI Engine');
    } catch {
      setAiResponse(defaultHint);
      setSource('Local Fallback Mentor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 text-slate-100 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-100">
              {t('aiHintTitle', language)}
            </h3>
            <p className="text-xs text-amber-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {scenarioTitle}
            </p>
          </div>
        </div>

        <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800 mb-4 min-h-[100px] flex flex-col justify-between">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-6 text-slate-400 gap-2">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">{t('aiHintLoading', language)}</p>
            </div>
          ) : aiResponse ? (
            <div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                "{aiResponse}"
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {source}
                </span>
                <span className="text-slate-500">
                  {isOnline ? 'Online Verified' : 'Offline Engine'}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-slate-300 mb-2">
                Standard hint: <span className="text-amber-200 font-medium">{defaultHint}</span>
              </p>
              {!isOnline && (
                <div className="flex items-center gap-1.5 text-xs text-amber-400/90 bg-amber-950/40 p-2 rounded-lg border border-amber-800/40 mt-1">
                  <WifiOff className="w-4 h-4 shrink-0" />
                  <span>Offline mode active. Utilizing local pre-authored decision logic.</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!aiResponse && (
            <button
              onClick={fetchAiHint}
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Mentor for Advice</span>
            </button>
          )}
          <button
            onClick={onClose}
            className={`py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition ${
              aiResponse ? 'w-full' : ''
            }`}
          >
            {t('btnGotIt', language)}
          </button>
        </div>
      </div>
    </div>
  );
};
