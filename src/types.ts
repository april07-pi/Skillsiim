/**
 * Simunye Skills SA - Core Data & Simulation Types
 */

export type Language =
  | 'en'   // English
  | 'zu'   // isiZulu
  | 'xh'   // isiXhosa
  | 'af'   // Afrikaans
  | 'nso'  // Sepedi (Northern Sotho)
  | 'tn'   // Setswana
  | 'st'   // Sesotho
  | 'ts'   // Xitsonga
  | 'ss'   // siSwati
  | 'ven'  // Tshivenda
  | 'nr'   // isiNdebele
  | 'sasl'; // South African Sign Language

export type AudioMode = 'text_only' | 'text_audio' | 'text_sasl';

export interface LanguageMeta {
  code: Language;
  name: string;
  nativeName: string;
  provinceRegion: string;
  speakersMillions: string;
  isCoreBaseline?: boolean;
  isPreloadedDemo?: boolean;
  estimatedPackMB: number;
  hasAudioPack?: boolean;
  hasSaslPack?: boolean;
  flagSymbol: string;
}

export interface LanguagePackStatus {
  code: Language;
  isDownloaded: boolean;
  isDownloading?: boolean;
  downloadProgress?: number; // 0 to 100
  sizeMB: number;
  lastUpdated?: string;
}

export interface SaslGestureInstruction {
  stepId: number;
  gestureName: string;
  signDescription: string;
  visualIconName: string;
  captionText: string;
  actionSignType: 'point' | 'turn' | 'press' | 'check' | 'inspect' | 'caution';
}

export type PerformanceProfile = 'LOW' | 'STANDARD' | 'HIGH';

export type SkillCategory =
  | 'plumbing'
  | 'it_hardware'
  | 'entrepreneurship'
  | 'aviation'
  | 'electrical'
  | 'automotive'
  | 'agriculture'
  | 'construction'
  | 'hospitality'
  | 'beauty'
  | 'fashion'
  | 'retail'
  | 'office_admin'
  | 'it_support'
  | 'software_dev'
  | 'cybersecurity'
  | 'digital'
  | 'customer_service'
  | 'logistics'
  | 'manufacturing'
  | 'workplace_safety'
  | 'employability'
  | 'financial'
  | 'career';

export type SimulationFormat = '2D' | 'PSEUDO_3D' | 'LIGHTWEIGHT_3D';

export type MasteryLevel =
  | 'Not Started'
  | 'Learning'
  | 'Practising'
  | 'Competent'
  | 'Mastered';

export interface PracticalTool {
  id: string;
  name: string;
  nameZu: string;
  category: string;
  description: string;
  descriptionZu: string;
  icon: string;
  isCorrectForStep?: boolean;
  safetyNote?: string;
  safetyNoteZu?: string;
}

export interface PracticalPerformanceScore {
  overallScore: number;
  safetyScore: number;
  procedureScore: number;
  accuracyScore: number;
  independenceScore: number;
  toolSelectionScore: number;
  mistakesCount: number;
  hintsUsed: number;
  timeSpentSeconds: number;
  masteryLevel: MasteryLevel;
}

export interface InteractiveObject {
  id: string;
  name: string;
  nameZu: string;
  category: string;
  status: 'normal' | 'faulty' | 'active' | 'warning' | 'resolved';
  label: string;
  labelZu: string;
  icon: string;
  position: { x: number; y: number; z?: number };
  inspectText: string;
  inspectTextZu: string;
  actionRequired?: string;
}

export interface Choice {
  id: string;
  text: string;
  textZu: string;
  isCorrect: boolean;
  explanation: string;
  explanationZu: string;
  realWorldConsequence: string;
  realWorldConsequenceZu: string;
  xpReward: number;
  isSafetyCritical?: boolean;
}

export interface DecisionPoint {
  id: string;
  title: string;
  titleZu: string;
  prompt: string;
  promptZu: string;
  targetObjectId?: string;
  choices: Choice[];
}

export interface SimulationStep {
  stepId: number;
  title: string;
  titleZu: string;
  objective: string;
  objectiveZu: string;
  environmentName: string;
  format: SimulationFormat;
  objects: InteractiveObject[];
  decisionPoint: DecisionPoint;
  availableTools?: PracticalTool[];
  requiredToolId?: string;
  hint: string;
  hintZu: string;
}

export interface Simulation {
  id: string;
  skillId: string;
  title: string;
  titleZu: string;
  category: SkillCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  difficultyZu: 'Owasemva' | 'Omaphakathi' | 'Owesevile';
  estimatedDataMB: number;
  estimatedMinutes: number;
  iconName: string;
  description: string;
  descriptionZu: string;
  steps: SimulationStep[];
  realWorldContext: string;
  realWorldContextZu: string;
}

export interface SkillItem {
  id: string;
  title: string;
  titleZu: string;
  category: SkillCategory;
  icon: string;
  description: string;
  descriptionZu: string;
  estimatedDataMB: number;
  isOfflineReady: boolean;
  simulationsCount: number;
  learningPath: string[];
}

export interface Certificate {
  id: string;
  learnerName: string;
  skillId: string;
  skillTitle: string;
  score: number;
  verificationHash: string;
  issuedDate: string;
  category: SkillCategory;
}

export interface UserProgress {
  userId: string;
  learnerName: string;
  xp: number;
  level: number;
  streakDays: number;
  completedSimulations: Record<string, number>; // simulationId -> score percentage
  badges: string[];
  certificates: Certificate[];
  lastActive: string;
}

export interface DataSaverConfig {
  dataSaverEnabled: boolean;
  wifiOnlyDownloads: boolean;
  performanceProfile: PerformanceProfile;
  autoDetectPerformance: boolean;
  cachedLessons: string[]; // skill IDs cached locally
  totalDataUsedMB: number;
  maxAppFootprintBudgetMB: number;
}

export interface SyncQueueItem {
  id: string;
  timestamp: string;
  type: 'SIMULATION_COMPLETED' | 'PROGRESS_UPDATE' | 'CERTIFICATE_EARNED';
  data: any;
}
