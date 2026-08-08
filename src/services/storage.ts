/**
 * Simunye Skills SA - Offline-First Storage Service
 * Handles user progress, simulation completions, data saver config, and sync queues
 */

import { UserProgress, DataSaverConfig, SyncQueueItem, Certificate, PerformanceProfile } from '../types';

const STORAGE_KEY_PROGRESS = 'simunye_user_progress_v1';
const STORAGE_KEY_DATASAVER = 'simunye_datasaver_config_v1';
const STORAGE_KEY_SYNC_QUEUE = 'simunye_sync_queue_v1';

export const initialProgress: UserProgress = {
  userId: 'usr_za_' + Math.random().toString(36).substr(2, 9),
  learnerName: 'Sibusiso Dlamini',
  xp: 350,
  level: 2,
  streakDays: 4,
  completedSimulations: {
    'sim_it_support_1': 90,
  },
  badges: ['kasi_tech_novice', 'cyber_guardian_initiate'],
  certificates: [
    {
      id: 'cert_it_001',
      learnerName: 'Sibusiso Dlamini',
      skillId: 'skill_it_support',
      skillTitle: 'IT & Network Diagnostic Fundamentals',
      score: 90,
      verificationHash: 'ZA-2026-IT-98214',
      issuedDate: new Date().toLocaleDateString('en-ZA'),
      category: 'digital',
    },
  ],
  lastActive: new Date().toISOString(),
};

export const initialDataSaverConfig: DataSaverConfig = {
  dataSaverEnabled: true,
  wifiOnlyDownloads: true,
  performanceProfile: 'LOW',
  autoDetectPerformance: true,
  cachedLessons: ['skill_it_support', 'skill_spaza_management', 'skill_cybersecurity'],
  totalDataUsedMB: 0.15,
  maxAppFootprintBudgetMB: 15.0,
};

export class StorageService {
  static getUserProgress(): UserProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return data ? JSON.parse(data) : initialProgress;
    } catch {
      return initialProgress;
    }
  }

  static saveUserProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  static getDataSaverConfig(): DataSaverConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEY_DATASAVER);
      return data ? JSON.parse(data) : initialDataSaverConfig;
    } catch {
      return initialDataSaverConfig;
    }
  }

  static saveDataSaverConfig(config: DataSaverConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY_DATASAVER, JSON.stringify(config));
    } catch (e) {
      console.warn('LocalStorage config save failed:', e);
    }
  }

  static getSyncQueue(): SyncQueueItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SYNC_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static enqueueSyncItem(type: SyncQueueItem['type'], data: any): void {
    const queue = this.getSyncQueue();
    const newItem: SyncQueueItem = {
      id: 'sync_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      type,
      data,
    };
    queue.push(newItem);
    try {
      localStorage.setItem(STORAGE_KEY_SYNC_QUEUE, JSON.stringify(queue));
    } catch (e) {
      console.warn('Sync queue push error', e);
    }
  }

  static clearSyncQueue(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_SYNC_QUEUE);
    } catch (e) {
      console.warn('Sync queue clear error', e);
    }
  }

  static recordSimulationCompletion(
    simulationId: string,
    scorePercentage: number,
    xpEarned: number,
    skillTitle: string,
    category: any
  ): { updatedProgress: UserProgress; newCertificate?: Certificate } {
    const current = this.getUserProgress();
    
    // Update score
    const existingScore = current.completedSimulations[simulationId] || 0;
    const newScore = Math.max(existingScore, scorePercentage);
    const updatedCompleted = {
      ...current.completedSimulations,
      [simulationId]: newScore,
    };

    // Update XP and Level calculation (100 XP per level)
    const newXp = current.xp + xpEarned;
    const newLevel = Math.floor(newXp / 250) + 1;

    // Check certificate generation
    let newCertificate: Certificate | undefined;
    if (newScore >= 70 && !current.certificates.some((c) => c.skillId === simulationId)) {
      const randomHash = 'ZA-' + new Date().getFullYear() + '-' + simulationId.toUpperCase().slice(-4) + '-' + Math.floor(1000 + Math.random() * 9000);
      newCertificate = {
        id: 'cert_' + Date.now(),
        learnerName: current.learnerName,
        skillId: simulationId,
        skillTitle,
        score: newScore,
        verificationHash: randomHash,
        issuedDate: new Date().toLocaleDateString('en-ZA'),
        category,
      };
    }

    const updatedCerts = newCertificate
      ? [...current.certificates, newCertificate]
      : current.certificates;

    const updatedProgress: UserProgress = {
      ...current,
      xp: newXp,
      level: newLevel,
      completedSimulations: updatedCompleted,
      certificates: updatedCerts,
      lastActive: new Date().toISOString(),
    };

    this.saveUserProgress(updatedProgress);
    this.enqueueSyncItem('SIMULATION_COMPLETED', { simulationId, scorePercentage, xpEarned });

    return { updatedProgress, newCertificate };
  }
}
