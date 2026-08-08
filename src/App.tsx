/**
 * Simunye Skills SA - Main Application Entry
 * Mobile-First South African Skills Simulation Application for Low-End Smartphones
 */

import React, { useState, useEffect } from 'react';
import { Language, AudioMode, PerformanceProfile, UserProgress, DataSaverConfig } from './types';
import { StorageService } from './services/storage';
import { detectDeviceCapabilities } from './services/deviceDetector';
import { DEMO_SIMULATIONS } from './simulations/simulationData';

import { Header } from './components/common/Header';
import { Navigation, NavTab } from './components/common/Navigation';
import { LanguageSelectorModal } from './components/common/LanguageSelectorModal';

import { HomeScreen } from './components/home/HomeScreen';
import { SkillsCatalogue } from './components/skills/SkillsCatalogue';
import { SimulationContainer } from './components/simulations/SimulationContainer';
import { DataSaverScreen } from './components/datasaver/DataSaverScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [audioMode, setAudioMode] = useState<AudioMode>('text_only');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [performanceProfile, setPerformanceProfile] = useState<PerformanceProfile>('LOW');
  const [activeSimulationId, setActiveSimulationId] = useState<string | null>(null);

  const [userProgress, setUserProgress] = useState<UserProgress>(StorageService.getUserProgress());
  const [dataSaverConfig, setDataSaverConfig] = useState<DataSaverConfig>(StorageService.getDataSaverConfig());
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Auto detect performance capabilities & setup online/offline listeners
  useEffect(() => {
    const diag = detectDeviceCapabilities();
    if (dataSaverConfig.autoDetectPerformance) {
      setPerformanceProfile(diag.recommendedProfile);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handlePerformanceProfileChange = (profile: PerformanceProfile) => {
    setPerformanceProfile(profile);
    const updated = { ...dataSaverConfig, performanceProfile: profile };
    setDataSaverConfig(updated);
    StorageService.saveDataSaverConfig(updated);
  };

  const handleUpdateDataSaverConfig = (updated: DataSaverConfig) => {
    setDataSaverConfig(updated);
    StorageService.saveDataSaverConfig(updated);
  };

  const handleLaunchSimulation = (simId: string) => {
    setActiveSimulationId(simId);
  };

  const handleCompleteSimulation = (scorePercentage: number, xpEarned: number) => {
    if (!activeSimulationId) return;

    const sim = DEMO_SIMULATIONS[activeSimulationId];
    const { updatedProgress, newCertificate } = StorageService.recordSimulationCompletion(
      activeSimulationId,
      scorePercentage,
      xpEarned,
      sim ? sim.title : 'Practical Skills Simulation',
      sim ? sim.category : 'digital'
    );

    setUserProgress(updatedProgress);
    setActiveSimulationId(null);
    setActiveTab('profile');

    if (newCertificate) {
      alert(`🎉 Congratulations! You demonstrated ${scorePercentage}% competency and earned a South African Micro-Credential! View it in your Profile.`);
    } else {
      alert(`Simulation completed! Score: ${scorePercentage}%. +${xpEarned} XP added.`);
    }
  };

  const currentSimulation = activeSimulationId ? DEMO_SIMULATIONS[activeSimulationId] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col justify-between">
      {/* Top Header */}
      <Header
        language={language}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        performanceProfile={performanceProfile}
        onPerformanceProfileChange={handlePerformanceProfileChange}
        isOnline={isOnline}
        dataSaverEnabled={dataSaverConfig.dataSaverEnabled}
        onOpenDataSaver={() => setActiveTab('datasaver')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentSimulation ? (
          <SimulationContainer
            simulation={currentSimulation}
            language={language}
            performanceProfile={performanceProfile}
            isOnline={isOnline}
            onCompleteSimulation={handleCompleteSimulation}
            onBackToCatalog={() => setActiveSimulationId(null)}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeScreen
                language={language}
                performanceProfile={performanceProfile}
                userProgress={userProgress}
                onSelectSimulation={handleLaunchSimulation}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsCatalogue
                language={language}
                onSelectSimulation={handleLaunchSimulation}
              />
            )}

            {activeTab === 'simulations' && (
              <SkillsCatalogue
                language={language}
                onSelectSimulation={handleLaunchSimulation}
              />
            )}

            {activeTab === 'datasaver' && (
              <DataSaverScreen
                language={language}
                onSelectLanguage={handleLanguageChange}
                config={dataSaverConfig}
                onUpdateConfig={handleUpdateDataSaverConfig}
                isOnline={isOnline}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileScreen
                language={language}
                userProgress={userProgress}
                performanceProfile={performanceProfile}
                onPerformanceProfileChange={handlePerformanceProfileChange}
              />
            )}
          </>
        )}
      </main>

      {/* 12-Language & SASL Pathway Modal */}
      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={language}
        onSelectLanguage={handleLanguageChange}
        audioMode={audioMode}
        onChangeAudioMode={setAudioMode}
      />

      {/* Bottom Mobile Navigation */}
      {!currentSimulation && (
        <Navigation
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          language={language}
        />
      )}
    </div>
  );
}
