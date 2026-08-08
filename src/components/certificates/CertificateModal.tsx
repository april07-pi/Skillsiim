import React from 'react';
import { Certificate, Language } from '../../types';
import { t } from '../../i18n/localization';
import { Award, ShieldCheck, X, Share2, Download, QrCode } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
  language: Language;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose,
  language,
}) => {
  if (!certificate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 text-slate-100 shadow-2xl relative overflow-hidden">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 bg-slate-800 rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Frame */}
        <div className="border-4 border-double border-amber-500/50 p-5 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative text-center shadow-inner">
          {/* Header Seal */}
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black mx-auto mb-3 shadow-lg">
            <Award className="w-7 h-7" />
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block mb-1">
            {t('certificateHeader', language)}
          </span>

          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
            {t('certificateSubHeader', language)}
          </h3>

          <p className="text-xs text-slate-400 italic mb-1">
            {t('certificateCertifies', language)}
          </p>

          <h2 className="text-lg font-black text-amber-300 tracking-wide underline decoration-amber-500/40 decoration-2 mb-3">
            {certificate.learnerName}
          </h2>

          <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed mb-3">
            {t('certificateHasCompleted', language)}
          </p>

          <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-3 max-w-xs mx-auto mb-4">
            <h4 className="font-bold text-sm text-slate-100">
              {certificate.skillTitle}
            </h4>
            <span className="text-xs font-mono text-emerald-400 font-bold block mt-1">
              Score Competency: {certificate.score}%
            </span>
          </div>

          {/* Verification Block */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-[11px] text-slate-400">
            <div className="text-left">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">
                {t('certificateHashLabel', language)}
              </span>
              <span className="font-mono font-bold text-amber-400">
                {certificate.verificationHash}
              </span>
              <span className="block text-[10px] text-slate-500 mt-0.5">
                Issued: {certificate.issuedDate}
              </span>
            </div>

            <div className="w-12 h-12 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
              <QrCode className="w-10 h-10 text-slate-950" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => {
              alert('Certificate downloaded to local storage as verified JSON badge.');
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>{t('btnPrintShare', language)}</span>
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
          >
            {t('btnCloseModal', language)}
          </button>
        </div>
      </div>
    </div>
  );
};
