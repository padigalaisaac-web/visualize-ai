import React from 'react';
import { X, Eye, Terminal } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl border border-zinc-800 bg-[#12141a] p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-850">
          <div className="flex h-9 w-9 items-center justify-center rounded border border-zinc-800 bg-[#0c0d11] text-zinc-300">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wide">
              SYSTEM ARCHITECTURE // HOW IT WORKS
            </h3>
            <p className="text-xs text-zinc-400">
              Gemma 4 Multimodal Cross-Verification Pipeline
            </p>
          </div>
        </div>

        {/* Core Architecture */}
        <div className="space-y-5 text-xs text-zinc-300">
          <div>
            <h4 className="font-mono font-semibold text-zinc-200 mb-1.5 flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded border border-zinc-700 bg-zinc-850 text-[10px] text-zinc-300">01</span>
              THE PROBLEM: CLAIMS VS. AUDITED DATA
            </h4>
            <p className="text-zinc-400 leading-relaxed font-sans text-xs">
              Promotional flyers, decks, social graphics, and advertisements often assert dramatic claims. But does the accompanying document, chart, or balance sheet actually substantiate that figure? VisualProof AI eliminates human bias and hallucination through automated, rigorous cross-examination.
            </p>
          </div>

          <div>
            <h4 className="font-mono font-semibold text-zinc-200 mb-1.5 flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded border border-zinc-700 bg-zinc-850 text-[10px] text-zinc-300">02</span>
              DUAL VISUAL INPUT INGESTION
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="rounded border border-zinc-800 bg-[#0c0d11] p-3">
                <span className="font-bold text-zinc-300 uppercase block mb-1">INPUT 01: CLAIM</span>
                <p className="text-zinc-400 font-sans text-[11px]">A visual asset asserting a factual claim (e.g. &quot;Sales increased by 300%&quot;).</p>
              </div>
              <div className="rounded border border-zinc-800 bg-[#0c0d11] p-3">
                <span className="font-bold text-zinc-300 uppercase block mb-1">INPUT 02: EVIDENCE</span>
                <p className="text-zinc-400 font-sans text-[11px]">Audited evidence, data sheet, report, or financial breakdown containing the ground truth.</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-mono font-semibold text-zinc-200 mb-1.5 flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded border border-zinc-700 bg-zinc-850 text-[10px] text-zinc-300">03</span>
              GEMMA 4 MULTIMODAL CROSS-EXAMINATION
            </h4>
            <p className="text-zinc-400 leading-relaxed font-sans text-xs mb-2.5">
              Both images are submitted directly to Gemma 4 via the Google Gemini API. Gemma extracts claim entities, tabulates visual proof from tables and charts, computes percentage discrepancies, and outputs a validated JSON schema with one of four verdicts:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="rounded border border-emerald-900/60 bg-emerald-950/20 p-2 text-emerald-300">
                • SUPPORTED: Evidence directly confirms claim
              </div>
              <div className="rounded border border-rose-900/60 bg-rose-950/20 p-2 text-rose-300">
                • NOT_SUPPORTED: Evidence contradicts claim
              </div>
              <div className="rounded border border-amber-900/60 bg-amber-950/20 p-2 text-amber-300">
                • PARTIALLY_SUPPORTED: Partial support with discrepancies
              </div>
              <div className="rounded border border-zinc-800 bg-zinc-900/40 p-2 text-zinc-300">
                • INSUFFICIENT_EVIDENCE: Data lacks necessary context
              </div>
            </div>
          </div>

          <div className="rounded border border-zinc-800 bg-[#0c0d11] p-3.5">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-300 mb-1">
              <Terminal className="h-3.5 w-3.5 text-zinc-400" />
              <span>CHALLENGE: BEST USE OF GEMMA 4 (MLH HYDERABAD)</span>
            </div>
            <p className="font-sans text-xs text-zinc-400">
              Meets all hackathon criteria: direct use of Gemma 4 through the Gemini API, spatial visual chart interpretation, single focused user story, and immediate results within 30 seconds.
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-6 pt-4 border-t border-zinc-850 flex justify-end">
          <button
            onClick={onClose}
            className="rounded border border-zinc-300 bg-zinc-100 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-950 hover:bg-white transition-colors"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
