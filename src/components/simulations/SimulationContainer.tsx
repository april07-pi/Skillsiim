import React, { useState } from 'react';
import { Simulation, Language, PerformanceProfile, InteractiveObject, Choice, SimulationFormat, PracticalPerformanceScore, MasteryLevel } from '../../types';
import { t, getLocalizedText } from '../../i18n/localization';
import { Level1_2DView } from './Level1_2DView';
import { Level2_Pseudo3DView } from './Level2_Pseudo3DView';
import { Level3_Lightweight3DView } from './Level3_Lightweight3DView';
import { ToolboxSelector } from './ToolboxSelector';
import { SaslGuidanceWidget } from '../sasl/SaslGuidanceWidget';
import { AiHintModal } from '../common/AiHintModal';
import { CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Award, Sparkles, HelpCircle, Layers, Check, X, ShieldAlert, Wrench, ShieldCheck, Trophy } from 'lucide-react';

interface SimulationContainerProps {
  simulation: Simulation;
  language: Language;
  performanceProfile: PerformanceProfile;
  isOnline: boolean;
  onCompleteSimulation: (scorePercentage: number, xpEarned: number) => void;
  onBackToCatalog: () => void;
}

export const SimulationContainer: React.FC<SimulationContainerProps> = ({
  simulation,
  language,
  performanceProfile,
  isOnline,
  onCompleteSimulation,
  onBackToCatalog,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formatOverride, setFormatOverride] = useState<SimulationFormat | null>(null);
  const [selectedObject, setSelectedObject] = useState<InteractiveObject | null>(null);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isAiHintOpen, setIsAiHintOpen] = useState(false);

  // Performance tracking state
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [safetyMistakesCount, setSafetyMistakesCount] = useState(0);
  const [incorrectToolSelectionCount, setIncorrectToolSelectionCount] = useState(0);
  const [stepScores, setStepScores] = useState<number[]>([]);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [showFinalSummary, setShowFinalSummary] = useState(false);
  const [finalPerformance, setFinalPerformance] = useState<PracticalPerformanceScore | null>(null);

  const currentStep = simulation.steps[currentStepIndex];
  const activeFormat: SimulationFormat =
    formatOverride ||
    (performanceProfile === 'LOW'
      ? '2D'
      : performanceProfile === 'STANDARD'
      ? 'PSEUDO_3D'
      : 'LIGHTWEIGHT_3D');

  const simTitle = getLocalizedText(simulation, 'title', language);
  const stepTitle = getLocalizedText(currentStep, 'title', language);
  const stepObjective = getLocalizedText(currentStep, 'objective', language);
  const realWorldContext = getLocalizedText(simulation, 'realWorldContext', language);

  const handleSelectObject = (obj: InteractiveObject) => {
    setSelectedObject(obj);
  };

  const handleOpenHint = () => {
    setHintsUsedCount((prev) => prev + 1);
    setIsAiHintOpen(true);
  };

  const handleConfirmChoice = (choice: Choice) => {
    if (currentStep.requiredToolId && selectedToolId !== currentStep.requiredToolId) {
      setIncorrectToolSelectionCount((prev) => prev + 1);
    }

    setSelectedChoice(choice);
    setShowFeedbackModal(true);

    if (choice.isCorrect) {
      setStepScores((prev) => [...prev, 100]);
      setTotalXpEarned((xp) => xp + choice.xpReward);
    } else {
      setStepScores((prev) => [...prev, 0]);
      setMistakesCount((prev) => prev + 1);
      if (choice.isSafetyCritical) {
        setSafetyMistakesCount((prev) => prev + 1);
      }
    }
  };

  const calculatePerformanceMetrics = (): PracticalPerformanceScore => {
    const totalSteps = simulation.steps.length;
    const correctSteps = stepScores.filter((s) => s === 100).length + (selectedChoice?.isCorrect ? 1 : 0);

    const accuracyScore = Math.round((correctSteps / totalSteps) * 100);
    const safetyScore = Math.max(0, 100 - safetyMistakesCount * 50);
    const toolSelectionScore = Math.max(0, 100 - incorrectToolSelectionCount * 30);
    const independenceScore = Math.max(0, 100 - hintsUsedCount * 15);
    const procedureScore = Math.round((accuracyScore + toolSelectionScore) / 2);

    const overallScore = Math.round(
      accuracyScore * 0.35 + safetyScore * 0.25 + procedureScore * 0.2 + independenceScore * 0.2
    );

    let masteryLevel: MasteryLevel = 'Learning';
    if (overallScore >= 90 && safetyScore === 100) {
      masteryLevel = 'Mastered';
    } else if (overallScore >= 75) {
      masteryLevel = 'Competent';
    } else if (overallScore >= 50) {
      masteryLevel = 'Practising';
    }

    return {
      overallScore,
      safetyScore,
      procedureScore,
      accuracyScore,
      independenceScore,
      toolSelectionScore,
      mistakesCount,
      hintsUsed: hintsUsedCount,
      timeSpentSeconds: 180,
      masteryLevel,
    };
  };

  const handleProceedNext = () => {
    setShowFeedbackModal(false);
    setSelectedChoice(null);
    setSelectedObject(null);
    setSelectedToolId(null);

    if (currentStepIndex < simulation.steps.length - 1) {
      setCurrentStepIndex((idx) => idx + 1);
    } else {
      const perf = calculatePerformanceMetrics();
      setFinalPerformance(perf);
      setShowFinalSummary(true);
    }
  };

  const handleRetryStep = () => {
    setShowFeedbackModal(false);
    setSelectedChoice(null);
  };

  const handleFinishSimulation = () => {
    if (!finalPerformance) return;
    onCompleteSimulation(finalPerformance.overallScore, totalXpEarned);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-3 py-4 text-slate-100">
      {/* Simulation Header Breadcrumb & Format Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 border border-slate-800 p-3 rounded-2xl mb-4 shadow-md">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            {simulation.category.toUpperCase()}
          </span>
          <h2 className="text-base font-bold text-slate-100 mt-1">
            {simTitle}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const formats: SimulationFormat[] = ['2D', 'PSEUDO_3D', 'LIGHTWEIGHT_3D'];
              const nextFormat = formats[(formats.indexOf(activeFormat) + 1) % formats.length];
              setFormatOverride(nextFormat);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition"
            title="Toggle simulation rendering mode"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Mode: {activeFormat}</span>
          </button>

          <button
            onClick={onBackToCatalog}
            className="text-xs text-slate-400 hover:text-slate-200 underline px-2"
          >
            Exit
          </button>
        </div>
      </div>

      {!showFinalSummary ? (
        <>
          {/* Step Progress Bar */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5">
              <span>
                {t('simStep', language)} {currentStepIndex + 1} / {simulation.steps.length}:{' '}
                <strong className="text-slate-100">
                  {stepTitle}
                </strong>
              </span>
              <span className="text-amber-400 font-mono font-bold">
                +{totalXpEarned} XP
              </span>
            </div>

            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                style={{
                  width: `${((currentStepIndex + 1) / simulation.steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* SASL Visual Guidance Component (if SASL active or requested) */}
          {language === 'sasl' && (
            <SaslGuidanceWidget
              stepId={currentStepIndex + 1}
              stepTitle={stepTitle}
              stepObjective={stepObjective}
              language={language}
            />
          )}

          {/* Real-World Context Banner */}
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3 mb-4 flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/90 leading-relaxed">
              <strong>South African Vocational Context:</strong>{' '}
              {realWorldContext}
            </p>
          </div>

          {/* Interactive Equipment / Virtual Toolbox */}
          {currentStep.availableTools && currentStep.availableTools.length > 0 && (
            <ToolboxSelector
              availableTools={currentStep.availableTools}
              selectedToolId={selectedToolId}
              onSelectTool={(id) => setSelectedToolId(id)}
              language={language}
            />
          )}

          {/* Active Rendering Canvas View (2D / Pseudo-3D / Lightweight 3D) */}
          {activeFormat === '2D' && (
            <Level1_2DView
              objects={currentStep.objects}
              selectedObject={selectedObject}
              onSelectObject={handleSelectObject}
              language={language}
            />
          )}

          {activeFormat === 'PSEUDO_3D' && (
            <Level2_Pseudo3DView
              objects={currentStep.objects}
              selectedObject={selectedObject}
              onSelectObject={handleSelectObject}
              language={language}
            />
          )}

          {activeFormat === 'LIGHTWEIGHT_3D' && (
            <Level3_Lightweight3DView
              objects={currentStep.objects}
              selectedObject={selectedObject}
              onSelectObject={handleSelectObject}
              language={language}
            />
          )}

          {/* Inspection Panel for Selected Object */}
          {selectedObject && (
            <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 my-4 shadow-lg animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <h4 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {getLocalizedText(selectedObject, 'name', language)}
                </h4>
                <button
                  onClick={() => setSelectedObject(null)}
                  className="text-xs text-slate-400 hover:text-slate-100 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {getLocalizedText(selectedObject, 'inspectText', language)}
              </p>
            </div>
          )}

          {/* Decision Point & Options */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 my-4 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                {getLocalizedText(currentStep.decisionPoint, 'title', language)}
              </h3>

              <button
                onClick={handleOpenHint}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('btnGetAiHint', language)}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed font-medium">
              {getLocalizedText(currentStep.decisionPoint, 'prompt', language)}
            </p>

            {/* Choice Buttons */}
            <div className="space-y-2.5">
              {currentStep.decisionPoint.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleConfirmChoice(choice)}
                  className="w-full text-left p-3.5 rounded-xl border bg-slate-950/80 border-slate-800 hover:border-amber-500/60 hover:bg-slate-800/60 transition flex items-start gap-3 group active:scale-[0.99]"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700 transition">
                    →
                  </div>
                  <span className="text-xs text-slate-200 leading-relaxed font-medium group-hover:text-slate-100">
                    {getLocalizedText(choice, 'text', language)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Detailed Practical Skill Performance Report */
        finalPerformance && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-fadeIn text-slate-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black mx-auto mb-3 shadow-lg">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-100">
                Practical Skill Competency Assessment
              </h2>
              <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 border border-amber-400/40 text-amber-300">
                Mastery Status: {finalPerformance.masteryLevel}
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-5 text-center shadow-inner">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Overall Practical Skill Score
              </span>
              <span className="text-4xl font-black text-amber-400 font-mono">
                {finalPerformance.overallScore}%
              </span>
              <p className="text-xs text-slate-300 mt-2">
                {finalPerformance.overallScore >= 75
                  ? 'You demonstrated the required practical competence for this vocational module.'
                  : 'Practise this procedure again before progressing to the next level.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Safety Protocol</span>
                <span className="text-lg font-extrabold font-mono text-emerald-400">{finalPerformance.safetyScore}%</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Procedure Accuracy</span>
                <span className="text-lg font-extrabold font-mono text-teal-400">{finalPerformance.procedureScore}%</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Tool Selection</span>
                <span className="text-lg font-extrabold font-mono text-amber-400">{finalPerformance.toolSelectionScore}%</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Independence</span>
                <span className="text-lg font-extrabold font-mono text-indigo-400">{finalPerformance.independenceScore}%</span>
              </div>
            </div>

            <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3.5 mb-6 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Educational Simulation Disclaimer:</strong> This digital badge represents successful completion of interactive simulated vocational training. It does NOT replace formal trade test certification, TVET college diplomas, or supervised physical apprenticeship.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFinishSimulation}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-lg"
              >
                <Award className="w-4 h-4" />
                <span>Claim Skill Micro-Credential</span>
              </button>
            </div>
          </div>
        )
      )}

      {/* Real-World Consequences & Feedback Modal */}
      {showFeedbackModal && selectedChoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 text-slate-100 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  selectedChoice.isCorrect
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {selectedChoice.isCorrect ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <AlertTriangle className="w-7 h-7" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-100">
                  {selectedChoice.isCorrect
                    ? t('simCorrectAnswer', language)
                    : t('simWrongAnswer', language)}
                </h3>
                <span className="text-xs font-semibold text-slate-400">
                  {selectedChoice.isCorrect
                    ? `+${selectedChoice.xpReward} XP Earned`
                    : 'Safe Mistake Reflection'}
                </span>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 mb-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Technical Procedure Explanation
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {getLocalizedText(selectedChoice, 'explanation', language)}
              </p>
            </div>

            {/* Real World Consequence */}
            <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3.5 mb-5">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                {t('realWorldConsequenceTitle', language)}
              </h4>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {getLocalizedText(selectedChoice, 'realWorldConsequence', language)}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2">
              {!selectedChoice.isCorrect && (
                <button
                  onClick={handleRetryStep}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('btnTryAgain', language)}</span>
                </button>
              )}

              <button
                onClick={handleProceedNext}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg active:scale-95"
              >
                <span>
                  {currentStepIndex < simulation.steps.length - 1
                    ? t('btnNextStep', language)
                    : t('btnCompleteSimulation', language)}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Tutor Modal */}
      <AiHintModal
        isOpen={isAiHintOpen}
        onClose={() => setIsAiHintOpen(false)}
        language={language}
        scenarioTitle={stepTitle}
        defaultHint={getLocalizedText(currentStep, 'hint', language)}
        isOnline={isOnline}
      />
    </div>
  );
};
