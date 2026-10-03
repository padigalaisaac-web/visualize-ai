import React from 'react';
import { 
  FileText, 
  Search, 
  GitCompare, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import type { AnalysisResult } from '../types/analysis';

interface EvidenceCardProps {
  result: AnalysisResult;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ result }) => {
  const {
    claim,
    evidence,
    comparison,
    explanation,
    key_findings,
    missing_information,
    numerical_breakdown,
    verdict,
  } = result;

  return (
    <div className="space-y-5">
      {/* 1. Numerical / Visual Flow Comparison (Tabular Audit Ledger) */}
      {numerical_breakdown && numerical_breakdown.has_numerical_claim && (
        <div className="rounded-xl border border-zinc-800 bg-[#12141a] p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-850">
            <div className="flex items-center gap-2 font-mono text-xs">
              <TrendingUp className="h-4 w-4 text-zinc-400" />
              <span className="font-semibold uppercase tracking-wider text-zinc-300">
                AUDITED DATA FLOW // NUMERICAL DELTA
              </span>
            </div>
            {numerical_breakdown.metric && (
              <span className="rounded border border-zinc-750 bg-zinc-850 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
                METRIC: {numerical_breakdown.metric}
              </span>
            )}
          </div>

          {/* Stepped tabular comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Step 1: Claimed */}
            <div className="rounded-lg border border-zinc-800 bg-[#0c0d11] p-3.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 block">
                01 // CLAIMED FIGURE
              </span>
              <p className="mt-1.5 font-mono text-lg font-bold text-zinc-100">
                {numerical_breakdown.claimed_value || 'Claimed Value'}
              </p>
              <span className="font-mono text-[10px] text-zinc-500 block mt-0.5">Image 01 Context</span>
            </div>

            {/* Step 2: Actual Observed */}
            <div className="rounded-lg border border-zinc-800 bg-[#0c0d11] p-3.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 block">
                02 // AUDITED IN EVIDENCE
              </span>
              <p className="mt-1.5 font-mono text-lg font-bold text-zinc-100">
                {numerical_breakdown.actual_value || 'Observed Value'}
              </p>
              <span className="font-mono text-[10px] text-zinc-500 block mt-0.5">Image 02 Context</span>
            </div>

            {/* Step 3: Calculated Discrepancy */}
            <div className="rounded-lg border border-zinc-800 bg-[#0c0d11] p-3.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 block">
                03 // CALCULATED DELTA
              </span>
              <p className="mt-1.5 font-mono text-sm font-semibold text-zinc-200">
                {numerical_breakdown.calculated_difference || 'Discrepancy computed'}
              </p>
              <span className="font-mono text-[10px] text-zinc-500 block mt-0.5">Direct Calculation</span>
            </div>

            {/* Step 4: Final Outcome */}
            <div
              className={`rounded-lg border p-3.5 ${
                verdict === 'SUPPORTED'
                  ? 'border-emerald-800/60 bg-emerald-950/20 text-emerald-300'
                  : verdict === 'PARTIALLY_SUPPORTED'
                  ? 'border-amber-800/60 bg-amber-950/20 text-amber-300'
                  : 'border-rose-800/60 bg-rose-950/20 text-rose-300'
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-75 block">
                04 // AUDIT OUTCOME
              </span>
              <p className="mt-1.5 font-mono text-base font-bold">
                {verdict.replace('_', ' ')}
              </p>
              <span className="font-mono text-[10px] opacity-75 block mt-0.5">Gemma 4 Conclusion</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Side-by-Side: Extracted Claim vs Extracted Evidence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Claim */}
        <div className="flex flex-col rounded-xl border border-zinc-800 bg-[#12141a] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3 font-mono text-xs text-zinc-400">
            <FileText className="h-4 w-4 text-zinc-400" />
            <span className="font-semibold uppercase tracking-wider">
              CLAIM EXTRACTED (INPUT 01)
            </span>
          </div>
          <div className="flex-1 rounded-lg bg-[#0c0d11] border border-zinc-850 p-4">
            <blockquote className="border-l-2 border-zinc-600 pl-3 font-mono text-sm text-zinc-200">
              “{claim}”
            </blockquote>
          </div>
        </div>

        {/* Right: Evidence Found */}
        <div className="flex flex-col rounded-xl border border-zinc-800 bg-[#12141a] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3 font-mono text-xs text-zinc-400">
            <Search className="h-4 w-4 text-zinc-400" />
            <span className="font-semibold uppercase tracking-wider">
              EVIDENCE LOCATED (INPUT 02)
            </span>
          </div>
          <div className="flex-1 rounded-lg bg-[#0c0d11] border border-zinc-850 p-4 space-y-2">
            {evidence && evidence.length > 0 ? (
              evidence.map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-xs font-mono text-zinc-300">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400 mt-0.5" />
                  <p>{item}</p>
                </div>
              ))
            ) : (
              <p className="text-xs font-mono text-zinc-500 italic">No specific evidence points detected.</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Deep Comparison & Rationale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Comparison */}
        <div className="rounded-xl border border-zinc-800 bg-[#12141a] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3 font-mono text-xs text-zinc-400">
            <GitCompare className="h-4 w-4 text-zinc-400" />
            <span className="font-semibold uppercase tracking-wider">
              CROSS-EXAMINATION COMPARISON
            </span>
          </div>
          <div className="rounded-lg bg-[#0c0d11] border border-zinc-850 p-4 text-xs sm:text-sm leading-relaxed text-zinc-300 font-mono">
            {comparison}
          </div>
        </div>

        {/* Why? */}
        <div className="rounded-xl border border-zinc-800 bg-[#12141a] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3 font-mono text-xs text-zinc-300">
            <HelpCircle className="h-4 w-4 text-zinc-400" />
            <span className="font-semibold uppercase tracking-wider">
              VERDICT RATIONALE &amp; EXPLANATION
            </span>
          </div>
          <div className="rounded-lg bg-[#0c0d11] border border-zinc-850 p-4 text-xs sm:text-sm leading-relaxed text-zinc-200">
            {explanation}
          </div>
        </div>
      </div>

      {/* 4. Key Findings & Missing Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Key Findings */}
        <div className="rounded-xl border border-zinc-800 bg-[#12141a] p-5 shadow-sm">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
            VERIFIED OBSERVATIONS
          </h3>
          <ul className="space-y-2">
            {key_findings && key_findings.length > 0 ? (
              key_findings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-zinc-700 bg-zinc-850 text-[10px] font-mono text-zinc-400 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{finding}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-zinc-500 italic">No secondary observations noted.</li>
            )}
          </ul>
        </div>

        {/* Missing Context */}
        <div className="rounded-xl border border-zinc-800 bg-[#12141a] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3 font-mono text-xs text-zinc-400">
            <AlertCircle className="h-3.5 w-3.5 text-zinc-500" />
            <span className="font-semibold uppercase tracking-wider">
              MISSING CONTEXT / INFORMATION GAPS
            </span>
          </div>
          {missing_information && missing_information.length > 0 ? (
            <ul className="space-y-2">
              {missing_information.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-zinc-400 font-mono">
                  <span className="text-zinc-600 font-bold">&gt;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg bg-[#0c0d11] border border-zinc-850 p-3 text-xs font-mono text-zinc-500">
              No information gaps detected. The visual inputs provided adequate factual coverage.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
