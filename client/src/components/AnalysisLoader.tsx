import React, { useEffect, useState } from 'react';
import { Eye, CheckCircle2, Loader2, Sparkles, Cpu } from 'lucide-react';

interface AnalysisLoaderProps {
  modelName?: string;
}

const STEPS = [
  { id: 1, label: 'Reading claim', description: 'Extracting factual claim statement and visual context from Image 1' },
  { id: 2, label: 'Understanding evidence', description: 'Parsing visual data, tables, charts, and metrics from Image 2' },
  { id: 3, label: 'Comparing information', description: 'Cross-referencing claim assertions against audited evidence' },
  { id: 4, label: 'Checking consistency', description: 'Verifying mathematical bounds, percentages, and factual consistency' },
  { id: 5, label: 'Generating verdict', description: 'Synthesizing objective verdict and structured explanation' },
];

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ modelName = 'Gemma 4' }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Step progression timed to match typical multimodal model inference
    const intervals = [700, 1100, 1200, 1000]; // ms per step transition
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step < STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(timer);
      }
    }, intervals[Math.min(step, intervals.length - 1)] || 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-indigo-500/30 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
      {/* Top Banner */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
          <Eye className="h-8 w-8 text-indigo-400 animate-pulse" />
          <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500">
            <Sparkles className="h-3 w-3 text-white animate-spin" />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/20">
            <Cpu className="h-3.5 w-3.5" />
            {modelName} Multimodal Engine
          </span>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight sm:text-2xl">
          Analyzing Visual Evidence
        </h3>
        <p className="text-sm text-slate-400 max-w-md">
          Gemma 4 is inspecting both visual inputs to determine if the facts objectively substantiate the claim.
        </p>
      </div>

      {/* Sequential Steps List */}
      <div className="mx-auto max-w-lg space-y-3">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-4 rounded-xl border p-3.5 transition-all duration-300 ${
                isCurrent
                  ? 'border-indigo-500/50 bg-indigo-500/10 shadow-md shadow-indigo-500/10'
                  : isCompleted
                  ? 'border-emerald-500/20 bg-slate-950/40 text-slate-400'
                  : 'border-white/5 bg-slate-950/20 text-slate-600'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-700 text-[11px] font-mono font-medium text-slate-500">
                    {step.id}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? 'text-white'
                        : isCompleted
                        ? 'text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-indigo-400 animate-pulse">
                      In Progress...
                    </span>
                  )}
                  {isCompleted && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                      Done
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Progress Bar */}
      <div className="mx-auto mt-6 max-w-lg">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-500 ease-out"
            style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
