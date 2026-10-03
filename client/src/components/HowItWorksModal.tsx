import React from 'react';
import { X, Eye, Cpu } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">How VisualProof AI Works</h3>
            <p className="text-xs text-slate-400">
              Gemma 4 Multimodal Evidence Verification Pipeline
            </p>
          </div>
        </div>

        {/* Core Architecture */}
        <div className="space-y-6 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-bold text-white">1</span>
              The Problem: Claims vs. Real Evidence
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Every day, advertisements, investor pitches, social media posts, and news graphics assert dramatic claims. But does the accompanying document, chart, or balance sheet actually substantiate that assertion? VisualProof AI eliminates the guesswork through automated cross-examination.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-bold text-white">2</span>
              Dual Visual Inputs
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-indigo-500/30 bg-slate-950 p-3">
                <span className="font-bold text-indigo-400 uppercase">Input 1: Claim</span>
                <p className="mt-1 text-slate-400">A graphic, slide, flyer, or headline asserting a factual statement (e.g. &quot;Sales up 300%&quot;).</p>
              </div>
              <div className="rounded-xl border border-cyan-500/30 bg-slate-950 p-3">
                <span className="font-bold text-cyan-400 uppercase">Input 2: Evidence</span>
                <p className="mt-1 text-slate-400">An audited financial report, benchmark test, or ledger table containing the underlying truth.</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-bold text-white">3</span>
              Gemma 4 Multimodal Cross-Verification
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Both images are ingested into Gemma 4 via the Google Gemini API. Gemma reads the claim tokens, inspects the evidence tables, computes exact percentage deltas and mathematical bounds, and outputs a strict JSON verification schema with one of four verdicts:
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="rounded-lg bg-emerald-950/30 border border-emerald-500/30 p-2 text-emerald-300">
                • SUPPORTED: Evidence directly confirms claim
              </div>
              <div className="rounded-lg bg-rose-950/30 border border-rose-500/30 p-2 text-rose-300">
                • NOT_SUPPORTED: Evidence contradicts claim
              </div>
              <div className="rounded-lg bg-amber-950/30 border border-amber-500/30 p-2 text-amber-300">
                • PARTIALLY_SUPPORTED: Some parts true, some false
              </div>
              <div className="rounded-lg bg-slate-950/40 border border-slate-700/50 p-2 text-slate-300">
                • INSUFFICIENT_EVIDENCE: Ambiguous or missing data
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">
              <Cpu className="h-4 w-4" />
              MLH Hacktoberfest Hack Day Hyderabad
            </div>
            <p className="text-xs text-slate-300">
              Built specifically for the &quot;Best Use of Gemma 4&quot; challenge, highlighting Gemma 4&apos;s multimodal reasoning, spatial chart parsing, and structured fact-checking capabilities.
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Got it, take me to analyzer
          </button>
        </div>
      </div>
    </div>
  );
};
