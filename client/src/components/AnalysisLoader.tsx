import React, { useEffect, useState } from 'react';
import { Check, Loader2, Terminal } from 'lucide-react';

interface AnalysisLoaderProps {
  modelName?: string;
}

const STEPS = [
  { id: '01', label: 'INGESTING CLAIM IMAGE', description: 'Extracting factual assertions, context, and claimed values' },
  { id: '02', label: 'PARSING EVIDENCE DATA', description: 'Extracting audited figures, tables, and visible proof from Image 2' },
  { id: '03', label: 'CROSS-REFERENCING ASSERTIONS', description: 'Evaluating claimed metrics against observed evidentiary points' },
  { id: '04', label: 'COMPUTING MATHEMATICAL BOUNDS', description: 'Verifying percentages, arithmetic differences, and margins' },
  { id: '05', label: 'SYNTHESIZING AUDIT VERDICT', description: 'Generating structured schema with justification and confidence' },
];

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ modelName = 'Gemma 4' }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Step progression timed to match typical multimodal model inference
    const intervals = [700, 1100, 1200, 1000];
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
    <div className="w-full rounded-xl border border-zinc-800 bg-[#12141a] p-6 sm:p-7 shadow-sm">
      {/* Top Banner */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-[#0c0d11] text-zinc-300">
          <Terminal className="h-5 w-5" />
        </div>

        <div className="flex items-center gap-2 mb-1.5 font-mono text-xs">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-zinc-300 uppercase tracking-wide">
            INSPECTION IN PROGRESS
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-500 uppercase">{modelName}</span>
        </div>

        <p className="font-mono text-xs text-zinc-500 max-w-md">
          Executing dual-image multimodal inference and mathematical discrepancy checks.
        </p>
      </div>

      {/* Sequential Steps List */}
      <div className="mx-auto max-w-lg space-y-2 font-mono">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                isCurrent
                  ? 'border-zinc-700 bg-zinc-850/80 text-zinc-200'
                  : isCompleted
                  ? 'border-zinc-850 bg-[#0c0d11]/70 text-zinc-400'
                  : 'border-zinc-900 bg-[#0c0d11]/30 text-zinc-650'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400">
                    <Check className="h-2.5 w-2.5" />
                  </div>
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 text-zinc-300 animate-spin" />
                ) : (
                  <div className="flex h-4 w-4 items-center justify-center rounded border border-zinc-800 text-[10px] text-zinc-600">
                    {step.id}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-xs font-semibold ${isCurrent ? 'text-white' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    {step.id} // {step.label}
                  </p>
                  {isCurrent && (
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400">
                      [RUNNING]
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                      [OK]
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5 font-sans">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Progress Bar */}
      <div className="mx-auto mt-5 max-w-lg">
        <div className="h-1 w-full overflow-hidden rounded bg-zinc-800">
          <div
            className="h-full bg-zinc-400 transition-all duration-300 ease-out"
            style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
