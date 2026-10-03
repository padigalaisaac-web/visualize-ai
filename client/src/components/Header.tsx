import React from 'react';
import { Eye, ShieldCheck, Sparkles, HelpCircle, Cpu } from 'lucide-react';
import type { HealthResponse } from '../services/api';

interface HeaderProps {
  backendHealth: HealthResponse | null;
  onOpenHowItWorks: () => void;
  onScrollToDemos: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  backendHealth,
  onOpenHowItWorks,
  onScrollToDemos,
}) => {
  const modelName = backendHealth?.model_configured || 'gemma-4-31b-it';
  const hasKey = backendHealth?.api_key_present;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <div className="relative">
                <Eye className="h-5 w-5 text-indigo-400" />
                <ShieldCheck className="absolute -bottom-1 -right-1.5 h-3.5 w-3.5 text-emerald-400" />
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
                VisualProof <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI</span>
              </span>
              <span className="hidden items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-indigo-300 sm:inline-flex">
                <Cpu className="h-3 w-3" />
                Gemma 4
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">
              Does the evidence actually support the claim?
            </p>
          </div>
        </div>

        {/* Navigation & Status */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
            <span
              className={`h-2 w-2 rounded-full ${
                backendHealth
                  ? hasKey
                    ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                    : 'bg-amber-400 shadow-sm shadow-amber-400/50'
                  : 'bg-rose-400'
              }`}
            />
            <span className="font-mono text-[11px]">
              {backendHealth ? (hasKey ? `${modelName}` : `${modelName} (Demo Ready)`) : 'Connecting...'}
            </span>
          </div>

          <button
            onClick={onOpenHowItWorks}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/50 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-indigo-500/40 hover:bg-slate-800 hover:text-white"
          >
            <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
            <span>How it works</span>
          </button>

          <button
            onClick={onScrollToDemos}
            className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300 transition-colors hover:bg-purple-500/20 hover:text-white"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>Examples</span>
          </button>
        </div>
      </div>
    </header>
  );
};
