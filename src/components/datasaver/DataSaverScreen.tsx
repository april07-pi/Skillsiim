import React, { useState } from 'react';
import { Language, DataSaverConfig } from '../../types';
import { t } from '../../i18n/localization';
import { StorageService } from '../../services/storage';
import { LanguagePacksManager } from '../common/LanguagePacksManager';
import { ShieldCheck, HardDrive, Wifi, RefreshCw, Trash2, CheckCircle2, Download, AlertCircle, Cpu } from 'lucide-react';

interface DataSaverScreenProps {
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  config: DataSaverConfig;
  onUpdateConfig: (config: DataSaverConfig) => void;
  isOnline: boolean;
}

export const DataSaverScreen: React.FC<DataSaverScreenProps> = ({
  language,
  onSelectLanguage,
  config,
  onUpdateConfig,
  isOnline,
}) => {
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleToggleDataSaver = () => {
    onUpdateConfig({ ...config, dataSaverEnabled: !config.dataSaverEnabled });
  };

  const handleToggleWifiOnly = () => {
    onUpdateConfig({ ...config, wifiOnlyDownloads: !config.wifiOnlyDownloads });
  };

  const handleClearCache = () => {
    onUpdateConfig({ ...config, cachedLessons: [], totalDataUsedMB: 0.05 });
    StorageService.clearSyncQueue();
    alert('Local lesson cache cleared successfully. Initial app size remains 2.1 MB.');
  };

  const handleTriggerSync = async () => {
    setSyncing(true);
    setSyncMessage(null);

    const queue = StorageService.getSyncQueue();

    if (!isOnline) {
      setTimeout(() => {
        setSyncing(false);
        setSyncMessage('Offline mode active. Progress queued locally and will auto-sync when online.');
      }, 400);
      return;
    }

    try {
      const progress = StorageService.getUserProgress();
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: progress.userId,
          syncItems: queue,
          performanceProfile: config.performanceProfile,
        }),
      });
      const data = await res.json();
      StorageService.clearSyncQueue();
      setSyncMessage(data.message || 'Sync completed successfully!');
    } catch {
      setSyncMessage('Sync attempted. Queued items saved locally.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 px-3 py-4 text-slate-100">
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          {t('dataSaverTitle', language)}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {t('dataSaverDesc', language)}
        </p>
      </div>

      {/* 15 MB Budget Meter Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-5 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-amber-400" />
            Initial App Download Footprint
          </span>
          <span className="font-mono text-xs font-extrabold text-emerald-400">
            2.1 MB / 15.0 MB Target
          </span>
        </div>

        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden mb-2 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            style={{ width: `${(2.1 / 15.0) * 100}%` }}
          />
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          {t('dataMeterText', language)}
        </p>
      </div>

      {/* Main Data Controls Toggle List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-5 space-y-4 shadow-md">
        {/* Toggle 1: Aggressive Data Saver */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h4 className="font-bold text-xs text-slate-100">
              {t('toggleDataSaver', language)}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Disables non-essential background animations and compresses payload sizes.
            </p>
          </div>

          <button
            onClick={handleToggleDataSaver}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
              config.dataSaverEnabled ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                config.dataSaverEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: Wi-Fi Only Sync */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h4 className="font-bold text-xs text-slate-100">
              {t('toggleWifiOnly', language)}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Prevents mobile data synchronization unless connected to Wi-Fi.
            </p>
          </div>

          <button
            onClick={handleToggleWifiOnly}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
              config.wifiOnlyDownloads ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                config.wifiOnlyDownloads ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Sync Trigger Button */}
        <div className="pt-1">
          <button
            onClick={handleTriggerSync}
            disabled={syncing}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{t('btnSyncNow', language)}</span>
          </button>

          {syncMessage && (
            <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Offline 12 Languages & SASL Pack Manager */}
      <LanguagePacksManager
        currentLanguage={language}
        onSelectLanguage={onSelectLanguage}
      />

      {/* Local Cached Lessons Storage */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
            <Download className="w-4 h-4 text-amber-400" />
            {t('cachedLessonsTitle', language)} ({config.cachedLessons.length})
          </h3>

          <button
            onClick={handleClearCache}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('btnClearCache', language)}</span>
          </button>
        </div>

        <div className="space-y-2">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span>IT Support & Network Diagnostic Pack</span>
            <span className="font-mono text-emerald-400">0.8 MB</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span>Spaza Shop & Small Business Pack</span>
            <span className="font-mono text-emerald-400">0.7 MB</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span>Workplace Cybersecurity Pack</span>
            <span className="font-mono text-emerald-400">0.6 MB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
