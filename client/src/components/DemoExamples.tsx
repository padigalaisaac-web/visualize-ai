import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ArrowUpRight, FolderGit2 } from 'lucide-react';
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
          <span className="flex items-center gap-1 rounded border border-emerald-800/60 bg-emerald-950/30 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            EXPECTED: SUPPORTED
          </span>
        );
      case 'PARTIALLY_SUPPORTED':
        return (
          <span className="flex items-center gap-1 rounded border border-amber-800/60 bg-amber-950/30 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-400">
            <AlertTriangle className="h-3 w-3" />
            EXPECTED: PARTIALLY_SUPPORTED
          </span>
        );
      case 'NOT_SUPPORTED':
        return (
          <span className="flex items-center gap-1 rounded border border-rose-800/60 bg-rose-950/30 px-2 py-0.5 font-mono text-[10px] font-semibold text-rose-400">
            <XCircle className="h-3 w-3" />
            EXPECTED: NOT_SUPPORTED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="demo-examples" className="mt-14 w-full">
      <div className="mb-5 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center pb-3 border-b border-zinc-850">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <FolderGit2 className="h-3.5 w-3.5 text-zinc-400" />
            <span className="font-semibold uppercase tracking-wider">
              BENCHMARK VECTORS
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
            Pre-Seeded Evaluation Suite
          </h2>
          <p className="text-xs text-zinc-400">
            Click any test scenario to populate the input panels with high-resolution visual claims and evidence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              className={`group flex flex-col justify-between rounded-xl border p-4 transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'border-zinc-400 bg-[#161822] shadow-sm'
                  : 'border-zinc-800 bg-[#12141a] hover:border-zinc-700 hover:bg-[#151720]'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="font-mono text-[11px] font-semibold text-zinc-500 uppercase">
                    TEST // {demo.id.toUpperCase()}
                  </span>
                  {getVerdictBadge(demo.expectedVerdict)}
                </div>

                <h3 className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors">
                  {demo.title}
                </h3>

                {/* Previews Thumbnails */}
                <div className="my-3 grid grid-cols-2 gap-2">
                  <div className="overflow-hidden rounded border border-zinc-800 bg-[#0c0d11] p-1">
                    <span className="block font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
                      INPUT 1: CLAIM
                    </span>
                    <img
                      src={demo.claimImageUrl}
                      alt="Claim preview"
                      className="h-14 w-full object-contain rounded-sm"
                    />
                  </div>
                  <div className="overflow-hidden rounded border border-zinc-800 bg-[#0c0d11] p-1">
                    <span className="block font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
                      INPUT 2: EVIDENCE
                    </span>
                    <img
                      src={demo.evidenceImageUrl}
                      alt="Evidence preview"
                      className="h-14 w-full object-contain rounded-sm"
                    />
                  </div>
                </div>

                {/* Claim & Evidence summary text */}
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="rounded border border-zinc-850 bg-[#0c0d11] p-2">
                    <span className="text-zinc-500">CLAIM: </span>
                    <span className="text-zinc-300">{demo.claimShort}</span>
                  </div>
                  <div className="rounded border border-zinc-850 bg-[#0c0d11] p-2">
                    <span className="text-zinc-500">EVIDENCE: </span>
                    <span className="text-zinc-300">{demo.evidenceShort}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-2.5 border-t border-zinc-850 flex items-center justify-between font-mono text-xs">
                <span className={isSelected ? 'text-zinc-200 font-bold' : 'text-zinc-500 group-hover:text-zinc-300'}>
                  {isSelected ? '[LOADED IN ANALYZER]' : 'LOAD BENCHMARK'}
                </span>
                <div className="flex h-5 w-5 items-center justify-center rounded border border-zinc-800 text-zinc-500 group-hover:border-zinc-600 group-hover:text-zinc-300">
                  <ArrowUpRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
