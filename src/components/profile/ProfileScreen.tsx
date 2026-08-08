import React, { useState } from 'react';
import { Language, UserProgress, PerformanceProfile, Certificate } from '../../types';
import { t } from '../../i18n/localization';
import { CertificateModal } from '../certificates/CertificateModal';
import { User, Award, Shield, Cpu, Zap, CheckCircle2, Trophy, Sparkles } from 'lucide-react';

interface ProfileScreenProps {
  language: Language;
  userProgress: UserProgress;
  performanceProfile: PerformanceProfile;
  onPerformanceProfileChange: (profile: PerformanceProfile) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  language,
  userProgress,
  performanceProfile,
  onPerformanceProfileChange,
}) => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const badgeIcons: Record<string, string> = {
    kasi_tech_novice: '💻 Kasi Tech Novice',
    cyber_guardian_initiate: '🛡️ Cyber Guardian',
    spaza_mogul: '🏪 Spaza Mogul',
    troubleshooter_pro: '⚡ Network Master',
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 px-3 py-4 text-slate-100">
      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-5 shadow-xl flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-teal-600 flex items-center justify-center font-black text-slate-950 text-2xl shadow-lg border border-amber-400/40 shrink-0">
          SD
        </div>

        <div>
          <h2 className="font-extrabold text-lg text-slate-100 leading-snug">
            {userProgress.learnerName}
          </h2>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block mt-0.5">
            Level {userProgress.level} Learner • {userProgress.xp} Total XP
          </span>
          <p className="text-[11px] text-slate-400 mt-1">
            South African Youth Skills Pathway • Active {userProgress.streakDays} Day Streak
          </p>
        </div>
      </div>

      {/* Earned Micro-Certificates Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-5 shadow-md">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-amber-400" />
          {t('certificatesTitle', language)} ({userProgress.certificates.length})
        </h3>

        {userProgress.certificates.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-3 text-center">
            No certificates earned yet. Complete a simulation with 70%+ score to claim your credential.
          </p>
        ) : (
          <div className="space-y-2.5">
            {userProgress.certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 hover:border-amber-500/40 transition"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-100">
                    {cert.skillTitle}
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Score: {cert.score}% • Issued: {cert.issuedDate}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedCertificate(cert)}
                  className="py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition"
                >
                  {t('btnViewCertificate', language)}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Earned Badges Collection */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-5 shadow-md">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-amber-400" />
          {t('badgeCollection', language)}
        </h3>

        <div className="flex flex-wrap gap-2">
          {userProgress.badges.map((badgeKey) => (
            <span
              key={badgeKey}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs"
            >
              {badgeIcons[badgeKey] || badgeKey}
            </span>
          ))}
        </div>
      </div>

      {/* Performance Profile Switcher Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 mb-3">
          <Cpu className="w-5 h-5 text-amber-400" />
          {t('performanceSettingsTitle', language)}
        </h3>

        <div className="space-y-2.5">
          {/* LOW */}
          <button
            onClick={() => onPerformanceProfileChange('LOW')}
            className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
              performanceProfile === 'LOW'
                ? 'bg-amber-500/10 border-amber-400 text-slate-100'
                : 'bg-slate-950 border-slate-800 hover:bg-slate-800/40'
            }`}
          >
            <div>
              <h4 className="font-bold text-xs text-amber-400">LOW Profile (2D UI)</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {t('profileLowDesc', language)}
              </p>
            </div>
            {performanceProfile === 'LOW' && (
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            )}
          </button>

          {/* STANDARD */}
          <button
            onClick={() => onPerformanceProfileChange('STANDARD')}
            className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
              performanceProfile === 'STANDARD'
                ? 'bg-amber-500/10 border-amber-400 text-slate-100'
                : 'bg-slate-950 border-slate-800 hover:bg-slate-800/40'
            }`}
          >
            <div>
              <h4 className="font-bold text-xs text-amber-400">STANDARD Profile (Pseudo-3D SVG)</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {t('profileStdDesc', language)}
              </p>
            </div>
            {performanceProfile === 'STANDARD' && (
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            )}
          </button>

          {/* HIGH */}
          <button
            onClick={() => onPerformanceProfileChange('HIGH')}
            className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
              performanceProfile === 'HIGH'
                ? 'bg-amber-500/10 border-amber-400 text-slate-100'
                : 'bg-slate-950 border-slate-800 hover:bg-slate-800/40'
            }`}
          >
            <div>
              <h4 className="font-bold text-xs text-amber-400">HIGH Profile (Lightweight WebGL 3D)</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {t('profileHighDesc', language)}
              </p>
            </div>
            {performanceProfile === 'HIGH' && (
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
        language={language}
      />
    </div>
  );
};
