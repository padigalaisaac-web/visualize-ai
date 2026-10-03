import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, XCircle, ArrowUpRight } from 'lucide-react';
import { DEMO_EXAMPLES } from '../data/demoData';
import type { DemoItem, VerdictType } from '../types/analysis';

interface DemoExamplesProps {
  onSelectDemo: (demo: DemoItem) => void;
  selectedDemoId?: string | null;
}

export const DemoExamples: React.FC<DemoExamplesProps> = ({
  onSelectDemo,
  selectedDemoId,
}) => {
  const getVerdictBadge = (verdict: VerdictType) => {
    switch (verdict) {
      case 'SUPPORTED':
        return (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            SUPPORTED
          </span>
        );
      case 'PARTIALLY_SUPPORTED':
        return (
          <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 border border-amber-500/20">
            <AlertTriangle className="h-3 w-3" />
            PARTIALLY SUPPORTED
          </span>
        );
      case 'NOT_SUPPORTED':
        return (
          <span className="flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-400 border border-rose-500/20">
            <XCircle className="h-3 w-3" />
            NOT SUPPORTED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="demo-examples" className="mt-16 w-full">
      <div className="mb-6 flex flex-col items-center justify-between gap-2 sm:flex-row">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Interactive Test Suite
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Try a Pre-Seeded Demo
          </h2>
          <p className="text-sm text-slate-400">
            Click any real-world scenario below to load the visual claim and evidence into the analyzer.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEMO_EXAMPLES.map((demo) => {
          const isSelected = selectedDemoId === demo.id;

          return (
            <div
              key={demo.id}
              onClick={() => onSelectDemo(demo)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectDemo(demo);
                }
              }}
              className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 bg-slate-900/90 ring-2 ring-indigo-500/50 shadow-xl shadow-indigo-500/10'
                  : 'border-white/10 bg-slate-900/50 hover:border-white/20 hover:bg-slate-900/80 hover:scale-[1.02]'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-semibold text-slate-500 uppercase">
                    {demo.id.toUpperCase()}
                  </span>
                  {getVerdictBadge(demo.expectedVerdict)}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {demo.title}
                </h3>

                {/* Previews Thumbnails */}
                <div className="my-4 grid grid-cols-2 gap-2">
                  <div className="overflow-hidden rounded-lg border border-indigo-500/20 bg-slate-950 p-1.5">
                    <span className="block text-[9px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                      Claim Image
                    </span>
                    <img
                      src={demo.claimImageUrl}
                      alt="Claim preview"
                      className="h-16 w-full object-contain rounded"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg border border-cyan-500/20 bg-slate-950 p-1.5">
                    <span className="block text-[9px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                      Evidence Image
                    </span>
                    <img
                      src={demo.evidenceImageUrl}
                      alt="Evidence preview"
                      className="h-16 w-full object-contain rounded"
                    />
                  </div>
                </div>

                {/* Claim & Evidence summary text */}
                <div className="space-y-2 text-xs">
                  <div className="rounded-lg bg-slate-950/60 p-2.5 border border-white/5">
                    <span className="font-semibold text-indigo-400">Claim: </span>
                    <span className="text-slate-300">{demo.claimShort}</span>
                  </div>
                  <div className="rounded-lg bg-slate-950/60 p-2.5 border border-white/5">
                    <span className="font-semibold text-cyan-400">Evidence: </span>
                    <span className="text-slate-300">{demo.evidenceShort}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold">
                <span className={isSelected ? 'text-indigo-400 font-bold' : 'text-slate-400 group-hover:text-white'}>
                  {isSelected ? 'Currently Loaded' : 'Load into Analyzer'}
                </span>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
