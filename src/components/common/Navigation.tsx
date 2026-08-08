import React from 'react';
import { Language } from '../../types';
import { t } from '../../i18n/localization';
import { Home, BookOpen, PlayCircle, Shield, User } from 'lucide-react';

export type NavTab = 'home' | 'skills' | 'simulations' | 'datasaver' | 'profile';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  language,
}) => {
  const tabs: { id: NavTab; labelKey: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', labelKey: 'navHome', icon: Home },
    { id: 'skills', labelKey: 'navSkills', icon: BookOpen },
    { id: 'simulations', labelKey: 'navSimulations', icon: PlayCircle },
    { id: 'datasaver', labelKey: 'navDataSaver', icon: Shield },
    { id: 'profile', labelKey: 'navProfile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 text-slate-300 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 h-14 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center h-full w-full py-1 transition-colors relative ${
                isActive
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-400 rounded-full" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] mt-0.5 truncate max-w-[64px] px-0.5">
                {t(tab.labelKey, language)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
