import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, Shield, Info, Sparkles } from 'lucide-react';
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
          subtext: 'The provided visual evidence directly confirms the claim.',
          icon: CheckCircle2,
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/30',
          textColor: 'text-emerald-400',
          glowColor: 'shadow-emerald-500/15',
          gradient: 'from-emerald-500/20 via-slate-900 to-slate-950',
        };
      case 'PARTIALLY_SUPPORTED':
        return {
          label: 'PARTIALLY SUPPORTED',
          badgeText: 'Partial Evidence Match',
          subtext: 'Some parts of the claim are supported, but key assertions are contradicted or unverified.',
          icon: AlertTriangle,
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
          textColor: 'text-amber-400',
          glowColor: 'shadow-amber-500/15',
          gradient: 'from-amber-500/20 via-slate-900 to-slate-950',
        };
      case 'NOT_SUPPORTED':
        return {
          label: 'NOT SUPPORTED',
          badgeText: 'Evidence Contradicts Claim',
          subtext: 'The visual evidence contradicts the claim or clearly fails to substantiate it.',
          icon: XCircle,
          bgColor: 'bg-rose-500/10',
          borderColor: 'border-rose-500/30',
          textColor: 'text-rose-400',
          glowColor: 'shadow-rose-500/15',
          gradient: 'from-rose-500/20 via-slate-900 to-slate-950',
        };
      case 'INSUFFICIENT_EVIDENCE':
      default:
        return {
          label: 'INSUFFICIENT EVIDENCE',
          badgeText: 'Inconclusive Data',
          subtext: 'The provided evidence lacks sufficient information to confirm or refute the claim.',
          icon: HelpCircle,
          bgColor: 'bg-slate-500/10',
          borderColor: 'border-slate-500/30',
          textColor: 'text-slate-300',
          glowColor: 'shadow-slate-500/15',
          gradient: 'from-slate-500/20 via-slate-900 to-slate-950',
        };
    }
  };

  const config = getVerdictConfig(verdict);
  const IconComponent = config.icon;

  const confidenceDisplay = {
    high: { label: 'High', bars: 3, color: 'bg-emerald-400 text-emerald-400' },
    medium: { label: 'Medium', bars: 2, color: 'bg-amber-400 text-amber-400' },
    low: { label: 'Low', bars: 1, color: 'bg-rose-400 text-rose-400' },
  }[confidence] || { label: 'Medium', bars: 2, color: 'bg-amber-400 text-amber-400' };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${config.borderColor} bg-gradient-to-b ${config.gradient} p-6 sm:p-8 shadow-2xl ${config.glowColor}`}
    >
      {/* Top badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-slate-300 border border-white/10">
            <Shield className="h-3.5 w-3.5 text-indigo-400" />
            Verification Verdict
          </span>
          {isDemo ? (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300 border border-amber-500/20">
              <Sparkles className="h-3 w-3" />
              Demo result
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/20">
              <Sparkles className="h-3 w-3" />
              Live Gemma 4 Analysis
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
          <span>Model: <span className="text-slate-200">{modelUsed}</span></span>
          {analyzedAt && (
            <span className="hidden sm:inline text-slate-500">
              {new Date(analyzedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>


      {/* Main Verdict Display */}
      <div className="my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl ${config.bgColor} border ${config.borderColor}`}
          >
            <IconComponent className={`h-10 w-10 sm:h-12 sm:w-12 ${config.textColor}`} />
          </div>

          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${config.textColor}`}>
              {config.badgeText}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              {config.label}
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              {config.subtext}
            </p>
          </div>
        </div>

        {/* Confidence Indicator */}
        <div className="shrink-0 rounded-xl border border-white/10 bg-slate-950/60 p-4 sm:w-56">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Model Confidence
            </span>
            <span className={`text-xs font-bold uppercase font-mono ${confidenceDisplay.color}`}>
              {confidenceDisplay.label}
            </span>
          </div>

          <div className="flex gap-1.5 h-2 mb-2">
            {[1, 2, 3].map((bar) => (
              <div
                key={bar}
                className={`flex-1 rounded-full ${
                  bar <= confidenceDisplay.bars
                    ? confidence === 'high'
                      ? 'bg-emerald-400'
                      : confidence === 'medium'
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>

          <p className="text-[11px] leading-tight text-slate-400 flex items-start gap-1">
            <Info className="h-3 w-3 shrink-0 text-slate-400 mt-0.5" />
            <span>Represents model evaluation based on supplied visual information, not mathematical certainty.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
