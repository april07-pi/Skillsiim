import React, { useState } from 'react';
import { Language, SkillCategory, SkillItem } from '../../types';
import { SKILLS_CATALOGUE } from '../../simulations/simulationData';
import { t, getLocalizedText } from '../../i18n/localization';
import { BookOpen, Monitor, Store, ShieldAlert, FileText, Wallet, Zap, Play, Download, CheckCircle2, Filter, Wrench, Cpu, Plane, Car, Sprout, HardHat, Utensils, ShieldCheck } from 'lucide-react';

interface SkillsCatalogueProps {
  language: Language;
  onSelectSimulation: (simId: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  Cpu,
  Store,
  Plane,
  Zap,
  Car,
  Sprout,
  HardHat,
  Utensils,
  ShieldCheck,
  Monitor,
  ShieldAlert,
  FileText,
  Wallet,
};

export const SkillsCatalogue: React.FC<SkillsCatalogueProps> = ({
  language,
  onSelectSimulation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  const [downloadedSkills, setDownloadedSkills] = useState<string[]>([
    'skill_plumbing_basic',
    'skill_it_hardware_repair',
    'skill_spaza_practical_biz',
    'skill_aviation_preflight',
    'skill_electrical_domestic',
    'skill_automotive_basic',
  ]);

  const categories: { id: SkillCategory | 'all'; labelKey: string }[] = [
    { id: 'all', labelKey: 'categoryAll' },
    { id: 'plumbing', labelKey: 'categoryPlumbing' },
    { id: 'it_hardware', labelKey: 'categoryItHardware' },
    { id: 'entrepreneurship', labelKey: 'categoryEntrepreneurship' },
    { id: 'aviation', labelKey: 'categoryAviation' },
    { id: 'electrical', labelKey: 'categoryElectrical' },
    { id: 'automotive', labelKey: 'categoryAutomotive' },
    { id: 'agriculture', labelKey: 'categoryAgriculture' },
    { id: 'construction', labelKey: 'categoryConstruction' },
    { id: 'hospitality', labelKey: 'categoryHospitality' },
    { id: 'workplace_safety', labelKey: 'categorySafety' },
  ];

  const filteredSkills =
    selectedCategory === 'all'
      ? SKILLS_CATALOGUE
      : SKILLS_CATALOGUE.filter((s) => s.category === selectedCategory);

  const handleDownloadToggle = (skillId: string) => {
    if (downloadedSkills.includes(skillId)) {
      setDownloadedSkills(downloadedSkills.filter((id) => id !== skillId));
    } else {
      setDownloadedSkills([...downloadedSkills, skillId]);
    }
  };

  const getSimIdForSkill = (skillId: string): string => {
    const map: Record<string, string> = {
      skill_plumbing_basic: 'sim_plumbing_1',
      skill_it_hardware_repair: 'sim_it_hardware_1',
      skill_spaza_practical_biz: 'sim_spaza_mgmt_1',
      skill_aviation_preflight: 'sim_aviation_preflight_1',
      skill_electrical_domestic: 'sim_electrical_1',
      skill_automotive_basic: 'sim_automotive_1',
      skill_agriculture_crop: 'sim_spaza_mgmt_1',
      skill_construction_safety: 'sim_plumbing_1',
      skill_hospitality_service: 'sim_spaza_mgmt_1',
      skill_workplace_safety: 'sim_electrical_1',
    };
    return map[skillId] || 'sim_plumbing_1';
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 px-3 py-4 text-slate-100">
      {/* Catalog Title */}
      <div className="mb-4">
        <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          {t('skillsCatalogTitle', language)}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {t('skillsCatalogDesc', language)}
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as SkillCategory | 'all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {t(cat.labelKey, language)}
            </button>
          );
        })}
      </div>

      {/* Skill Tiles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredSkills.map((skill) => {
          const IconComp = iconMap[skill.icon] || BookOpen;
          const isDownloaded = downloadedSkills.includes(skill.id);
          const simId = getSimIdForSkill(skill.id);
          const title = getLocalizedText(skill, 'title', language);
          const description = getLocalizedText(skill, 'description', language);

          return (
            <div
              key={skill.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-md flex flex-col justify-between transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100 leading-tight">
                        {title}
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-amber-400 font-mono">
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {skill.estimatedDataMB} MB
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {description}
                </p>

                {/* Learning Path Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {skill.learningPath.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded-md border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectSimulation(simId)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{t('btnLaunchSim', language)}</span>
                </button>

                <button
                  onClick={() => handleDownloadToggle(skill.id)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1 transition ${
                    isDownloaded
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title="Download lesson for offline caching"
                >
                  {isDownloaded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="hidden sm:inline">Cached</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Save</span>
                    </>
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
