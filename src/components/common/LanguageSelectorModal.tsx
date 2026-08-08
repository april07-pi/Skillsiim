import React, { useState } from 'react';
import { Language, AudioMode } from '../../types';
import { OFFICIAL_SA_LANGUAGES, getLanguageMeta } from '../../i18n/languages';
import { t } from '../../i18n/localization';
import { Globe, Check, X, Volume2, VolumeX, Eye, Sparkles, Download, ShieldCheck, HardDrive } from 'lucide-react';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  audioMode: AudioMode;
  onChangeAudioMode: (mode: AudioMode) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
  audioMode,
  onChangeAudioMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col text-slate-100 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-base text-slate-100">
                {t('selectLanguageTitle', currentLanguage)}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              12 Official South African Languages & SASL Pathway
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
          {/* Audio & Visual Pathway Selector */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {t('audioModeTitle', currentLanguage)}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => onChangeAudioMode('text_only')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                  audioMode === 'text_only'
                    ? 'bg-amber-500/15 border-amber-400 text-slate-100 ring-2 ring-amber-400/20'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <VolumeX className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-xs block">Text Only</span>
                  <span className="text-[10px] text-slate-400 block">Lowest data</span>
                </div>
              </button>

              <button
                onClick={() => onChangeAudioMode('text_audio')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                  audioMode === 'text_audio'
                    ? 'bg-amber-500/15 border-amber-400 text-slate-100 ring-2 ring-amber-400/20'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-xs block">Text + Voice</span>
                  <span className="text-[10px] text-slate-400 block">Compressed audio</span>
                </div>
              </button>

              <button
                onClick={() => onChangeAudioMode('text_sasl')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                  audioMode === 'text_sasl'
                    ? 'bg-indigo-500/20 border-indigo-400 text-slate-100 ring-2 ring-indigo-400/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <span className="text-base">🤟</span>
                <div>
                  <span className="font-bold text-xs block">SASL Visual</span>
                  <span className="text-[10px] text-indigo-300 block">Sign gesture guide</span>
                </div>
              </button>
            </div>
          </div>

          {/* 12 Official Languages Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Official Languages & Language Packs
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">
                Offline Ready (~0.2 MB)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {OFFICIAL_SA_LANGUAGES.map((langMeta) => {
                const isSelected = currentLanguage === langMeta.code;

                return (
                  <button
                    key={langMeta.code}
                    onClick={() => {
                      onSelectLanguage(langMeta.code);
                      if (langMeta.code === 'sasl') {
                        onChangeAudioMode('text_sasl');
                      }
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex items-start justify-between gap-3 relative ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 text-slate-100 ring-2 ring-amber-400/30'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {langMeta.flagSymbol}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-bold text-xs truncate text-slate-100">
                            {langMeta.nativeName}
                          </h5>
                          {langMeta.isCoreBaseline && (
                            <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded border border-slate-700">
                              Base
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {langMeta.provinceRegion}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-mono text-amber-400">
                            {langMeta.speakersMillions} Speakers
                          </span>
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1 rounded border border-emerald-800/60">
                            {langMeta.estimatedPackMB} MB Offline
                          </span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Guarantee Banner */}
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-2xl p-3 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Multilingual Architecture Guarantee:</strong> Language switching occurs dynamically in-memory without reinstalling the application or downloading duplicate 3D simulation assets.
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Active: <strong className="text-amber-400">{getLanguageMeta(currentLanguage).nativeName}</strong>
          </span>

          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition active:scale-95 shadow-md"
          >
            {t('btnGotIt', currentLanguage)}
          </button>
        </div>
      </div>
    </div>
  );
};
