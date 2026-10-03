import React from 'react';
import { 
  FileText, 
  Search, 
  GitCompare, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle,
  Lightbulb
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
    <div className="space-y-6">
      {/* 1. Numerical / Visual Flow Comparison (The "Wow Moment") */}
      {numerical_breakdown && numerical_breakdown.has_numerical_claim && (
        <div className="overflow-hidden rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300">
              Visual Evidence Flow &amp; Data Breakdown
            </h3>
            {numerical_breakdown.metric && (
              <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-mono text-indigo-300 border border-indigo-500/20">
                Metric: {numerical_breakdown.metric}
              </span>
            )}
          </div>

          {/* Stepped flow chart */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Step 1: Claimed */}
            <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                1. Claimed Figure
              </span>
              <p className="mt-2 text-xl font-extrabold text-white">
                {numerical_breakdown.claimed_value || 'Claimed Value'}
              </p>
              <span className="text-xs text-purple-300/70">From Claim Image</span>
            </div>

            {/* Step 2: Actual Observed */}
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                2. Actual In Evidence
              </span>
              <p className="mt-2 text-xl font-extrabold text-white">
                {numerical_breakdown.actual_value || 'Audited Value'}
              </p>
              <span className="text-xs text-cyan-300/70">From Evidence Image</span>
            </div>

            {/* Step 3: Calculated Discrepancy */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                3. Calculated Delta
              </span>
              <p className="mt-2 text-sm font-semibold text-slate-200">
                {numerical_breakdown.calculated_difference || 'Discrepancy analyzed'}
              </p>
            </div>

            {/* Step 4: Final Outcome */}
            <div
              className={`rounded-xl border p-4 text-center ${
                verdict === 'SUPPORTED'
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                  : verdict === 'PARTIALLY_SUPPORTED'
                  ? 'border-amber-500/30 bg-amber-950/20 text-amber-300'
                  : 'border-rose-500/30 bg-rose-950/20 text-rose-300'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                4. Gemma Verdict
              </span>
              <p className="mt-2 text-lg font-black tracking-tight">
                {verdict.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Side-by-Side: Extracted Claim vs Extracted Evidence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Claim */}
        <div className="flex flex-col rounded-2xl border border-indigo-500/20 bg-slate-900/60 p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Claim Extracted From Visual Input
            </h3>
          </div>
          <div className="flex-1 rounded-xl bg-slate-950/70 border border-white/5 p-4">
            <blockquote className="border-l-4 border-indigo-500 pl-4 text-base font-semibold text-white italic">
              “{claim}”
            </blockquote>
          </div>
        </div>

        {/* Right: Evidence Found */}
        <div className="flex flex-col rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Search className="h-5 w-5 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Evidence Found in Visual Input
            </h3>
          </div>
          <div className="flex-1 rounded-xl bg-slate-950/70 border border-white/5 p-4 space-y-2.5">
            {evidence && evidence.length > 0 ? (
              evidence.map((item, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400 mt-1" />
                  <p className="text-sm text-slate-200">{item}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic">No specific evidence points detected.</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Deep Comparison & The "Why?" Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Comparison */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <GitCompare className="h-5 w-5 text-purple-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Claim vs. Evidence Comparison
            </h3>
          </div>
          <div className="rounded-xl bg-slate-950/70 border border-white/5 p-4 text-sm leading-relaxed text-slate-300">
            {comparison}
          </div>
        </div>

        {/* Why? */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 to-slate-900/60 p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
              Why did Gemma 4 reach this verdict?
            </h3>
          </div>
          <div className="rounded-xl bg-slate-950/80 border border-indigo-500/20 p-4 text-sm leading-relaxed text-slate-100 font-medium">
            {explanation}
          </div>
        </div>
      </div>

      {/* 4. Key Findings & Missing Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Findings */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-lg">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3">
            Key Extracted Findings
          </h3>
          <ul className="space-y-2">
            {key_findings && key_findings.length > 0 ? (
              key_findings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-mono font-medium text-slate-400 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{finding}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-500 italic">No secondary key findings.</li>
            )}
          </ul>
        </div>

        {/* Missing Information */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Missing Information / Context
            </h3>
          </div>
          {missing_information && missing_information.length > 0 ? (
            <ul className="space-y-2">
              {missing_information.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl bg-slate-950/50 border border-white/5 p-4 text-xs text-slate-400">
              No critical information was missing. The provided visual evidence was complete for this verification.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
