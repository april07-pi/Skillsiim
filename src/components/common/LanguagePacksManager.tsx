import React, { useState } from 'react';
import { Language, LanguagePackStatus } from '../../types';
import { OFFICIAL_SA_LANGUAGES, getLanguageMeta } from '../../i18n/languages';
import { t } from '../../i18n/localization';
import { HardDrive, Download, CheckCircle2, RefreshCw, Trash2, ShieldCheck, FileText, Globe } from 'lucide-react';

interface LanguagePacksManagerProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LanguagePacksManager: React.FC<LanguagePacksManagerProps> = ({
  currentLanguage,
  onSelectLanguage,
}) => {
  const [downloadedPacks, setDownloadedPacks] = useState<string[]>([
    'en',
    'zu',
    'xh',
    'af',
    'nso',
    'tn',
    'st',
    'ts',
    'ss',
    'ven',
    'nr',
    'sasl',
  ]);
  const [downloadingCode, setDownloadingCode] = useState<string | null>(null);

  const handleToggleDownload = (code: string) => {
    if (downloadedPacks.includes(code)) {
      if (code === 'en') return; // Cannot delete base English pack
      setDownloadedPacks(downloadedPacks.filter((c) => c !== code));
    } else {
      setDownloadingCode(code);
      setTimeout(() => {
        setDownloadedPacks((prev) => [...prev, code]);
        setDownloadingCode(null);
      }, 600);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg mb-6 text-slate-100">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100">
              {t('languagePacksTitle', currentLanguage)}
            </h3>
            <p className="text-xs text-slate-400">
              Manage offline translation dictionaries & SASL visual packs (~0.2 MB each)
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
          {downloadedPacks.length} / 12 Cached
        </span>
      </div>

      {/* Language Packs List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {OFFICIAL_SA_LANGUAGES.map((meta) => {
          const isDownloaded = downloadedPacks.includes(meta.code);
          const isDownloading = downloadingCode === meta.code;
          const isSelected = currentLanguage === meta.code;

          return (
            <div
              key={meta.code}
              className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-400/60'
                  : 'bg-slate-950/80 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-lg">{meta.flagSymbol}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-slate-200 truncate">
                      {meta.nativeName}
                    </h4>
                    {isSelected && (
                      <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-1.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {meta.estimatedPackMB} MB • {meta.provinceRegion.split(',')[0]}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSelectLanguage(meta.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Use
                </button>

                <button
                  onClick={() => handleToggleDownload(meta.code)}
                  disabled={meta.code === 'en'}
                  className={`p-1.5 rounded-lg border text-xs flex items-center justify-center transition ${
                    isDownloaded
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                  title={isDownloaded ? 'Cached locally' : 'Download language pack'}
                >
                  {isDownloading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  ) : isDownloaded ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
