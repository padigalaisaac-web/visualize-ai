import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, Shield, Info } from 'lucide-react';
import type { VerdictType, ConfidenceType } from '../types/analysis';

interface VerdictCardProps {
  verdict: VerdictType;
  confidence: ConfidenceType;
  isDemo?: boolean;
  modelUsed?: string;
  analyzedAt?: string;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({
  verdict,
  confidence,
  isDemo = false,
  modelUsed = 'gemma-4-31b-it',
  analyzedAt,
}) => {
  const getVerdictConfig = (v: VerdictType) => {
    switch (v) {
      case 'SUPPORTED':
        return {
          label: 'SUPPORTED',
          badgeText: 'Claim Directly Supported',
          subtext: 'The provided visual evidence directly confirms and substantiates the claim.',
          icon: CheckCircle2,
          bgColor: 'bg-emerald-950/30',
          borderColor: 'border-emerald-800/60',
          textColor: 'text-emerald-400',
          bannerBg: 'bg-emerald-950/10',
        };
      case 'PARTIALLY_SUPPORTED':
        return {
          label: 'PARTIALLY SUPPORTED',
          badgeText: 'Partial Evidence Match',
          subtext: 'Some elements of the claim align with evidence, but key figures or assertions are contradicted or unverified.',
          icon: AlertTriangle,
          bgColor: 'bg-amber-950/30',
          borderColor: 'border-amber-800/60',
          textColor: 'text-amber-400',
          bannerBg: 'bg-amber-950/10',
        };
      case 'NOT_SUPPORTED':
        return {
          label: 'NOT SUPPORTED',
          badgeText: 'Evidence Contradicts Claim',
          subtext: 'The visual evidence directly contradicts the claim or demonstrably fails to substantiate the figures.',
          icon: XCircle,
          bgColor: 'bg-rose-950/30',
          borderColor: 'border-rose-800/60',
          textColor: 'text-rose-400',
          bannerBg: 'bg-rose-950/10',
        };
      case 'INSUFFICIENT_EVIDENCE':
      default:
        return {
          label: 'INSUFFICIENT EVIDENCE',
          badgeText: 'Inconclusive Data',
          subtext: 'The provided evidence lacks sufficient measurable context to confirm or refute the claim.',
          icon: HelpCircle,
          bgColor: 'bg-zinc-900',
          borderColor: 'border-zinc-700',
          textColor: 'text-zinc-300',
          bannerBg: 'bg-zinc-900/30',
        };
    }
  };

  const config = getVerdictConfig(verdict);
  const IconComponent = config.icon;

  const confidenceDisplay = {
    high: { label: 'HIGH', bars: 3, textColor: 'text-emerald-400', barColor: 'bg-emerald-500' },
    medium: { label: 'MEDIUM', bars: 2, textColor: 'text-amber-400', barColor: 'bg-amber-500' },
    low: { label: 'LOW', bars: 1, textColor: 'text-rose-400', barColor: 'bg-rose-500' },
  }[confidence] || { label: 'MEDIUM', bars: 2, textColor: 'text-amber-400', barColor: 'bg-amber-500' };

  return (
    <div className={`overflow-hidden rounded-xl border ${config.borderColor} ${config.bannerBg} bg-[#12141a] p-6 sm:p-7 shadow-sm`}>
      {/* Top telemetry bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-zinc-800">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="flex items-center gap-1.5 rounded border border-zinc-700 bg-zinc-850 px-2 py-0.5 text-zinc-300">
            <Shield className="h-3 w-3 text-zinc-400" />
            VERDICT // 01
          </span>

          {isDemo ? (
            <span className="rounded border border-amber-900/50 bg-amber-950/30 px-2 py-0.5 text-[11px] text-amber-400">
              DEMO BENCHMARK
            </span>
          ) : (
            <span className="rounded border border-emerald-900/50 bg-emerald-950/30 px-2 py-0.5 text-[11px] text-emerald-400">
              LIVE GEMMA 4 INFERENCE
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
          <span>MODEL: <span className="text-zinc-200">{modelUsed}</span></span>
          {analyzedAt && (
            <span className="hidden sm:inline text-zinc-500">
              TIME: {new Date(analyzedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Main Verdict Display */}
      <div className="my-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div
            className={`flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-lg ${config.bgColor} border ${config.borderColor}`}
          >
            <IconComponent className={`h-8 w-8 ${config.textColor}`} />
          </div>

          <div>
            <span className={`font-mono text-xs uppercase tracking-wider font-semibold ${config.textColor}`}>
              {config.badgeText}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mt-0.5">
              {config.label}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
              {config.subtext}
            </p>
          </div>
        </div>

        {/* Confidence Indicator - Clean tabular layout */}
        <div className="shrink-0 rounded-lg border border-zinc-800 bg-[#0c0d11] p-3.5 sm:w-56 font-mono text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-500 uppercase">
              CONFIDENCE
            </span>
            <span className={`font-bold ${confidenceDisplay.textColor}`}>
              {confidenceDisplay.label} ({confidenceDisplay.bars}/3)
            </span>
          </div>

          <div className="flex gap-1.5 h-1.5 mb-2">
            {[1, 2, 3].map((bar) => (
              <div
                key={bar}
                className={`flex-1 rounded-sm ${
                  bar <= confidenceDisplay.bars
                    ? confidenceDisplay.barColor
                    : 'bg-zinc-800'
                }`}
              />
            ))}
          </div>

          <p className="font-sans text-[11px] leading-tight text-zinc-500 flex items-start gap-1">
            <Info className="h-3 w-3 shrink-0 text-zinc-600 mt-0.5" />
            <span>Derived from visual clarity &amp; mathematical completeness.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
