import React from 'react';
import { ShieldCheck, Terminal, Layers } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#0c0d11]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold tracking-tight text-zinc-100 sm:text-lg">
                VISUALPROOF<span className="text-zinc-500 font-normal">.AI</span>
              </span>
              <span className="hidden items-center rounded border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-400 sm:inline-flex">
                v1.0 // Gemma 4
              </span>
            </div>
            <p className="hidden text-xs text-zinc-400 sm:block">
              Does the evidence actually support the claim?
            </p>
          </div>
        </div>

        {/* Engine Status & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status pill */}
          <div className="hidden md:flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 font-mono text-xs text-zinc-300">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                backendHealth
                  ? hasKey
                    ? 'bg-emerald-400'
                    : 'bg-amber-400'
                  : 'bg-zinc-600'
              }`}
            />
            <span className="text-[11px] text-zinc-300">
              {backendHealth ? (hasKey ? `${modelName}` : `${modelName} [Demo Mode]`) : 'Connecting...'}
            </span>
          </div>

          <button
            onClick={onOpenHowItWorks}
            className="flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            <Terminal className="h-3.5 w-3.5 text-zinc-400" />
            <span>Specifications</span>
          </button>

          <button
            onClick={onScrollToDemos}
            className="flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            <Layers className="h-3.5 w-3.5 text-zinc-400" />
            <span>Test Cases</span>
          </button>
        </div>
      </div>
    </header>
  );
};
