import React from 'react';
import { Sparkles, ShieldCheck, Terminal, Award } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#09090b] text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Workshop Focus */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-zinc-200 text-sm">ProjectPulse Lite</span>
              <Badge variant="emerald" size="sm">
                NxtWave Assignment
              </Badge>
            </div>
            <p className="text-zinc-400 leading-relaxed max-w-md text-xs">
              Built to inspire engineering students to turn ordinary college projects into practical
              AI prototypes. Designed as the growth engine for the free masterclass{' '}
              <span className="text-zinc-200 font-medium">“Build Your First AI Project in 60 Minutes.”</span>
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-500">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Deterministic Heuristic Engine Active
              </span>
              <span>•</span>
              <span>Zero-Cost AI Architecture</span>
            </div>
          </div>

          {/* Workshop Details */}
          <div className="space-y-2.5">
            <h4 className="text-zinc-200 font-semibold uppercase tracking-wider text-[11px]">
              Workshop Curriculum
            </h4>
            <ul className="space-y-1.5 text-zinc-400">
              <li className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Sprint 1: Scaffold & Free APIs</span>
              </li>
              <li className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Sprint 2: Prompt & Model Pipelines</span>
              </li>
              <li className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Sprint 3: Dynamic UI Integration</span>
              </li>
              <li className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Sprint 4: Evaluation & Polish</span>
              </li>
            </ul>
          </div>

          {/* Growth & Trust */}
          <div className="space-y-2.5">
            <h4 className="text-zinc-200 font-semibold uppercase tracking-wider text-[11px]">
              Attribution & Trust
            </h4>
            <ul className="space-y-1.5 text-zinc-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Verified Referral Attribution</span>
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Project Credit Ledger</span>
              </li>
              <li className="text-[11px] text-zinc-500 pt-1">
                Data secured with verified rate limiting & anti-abuse checks.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} ProjectPulse Lite. Built for NxtWave Growth Intern Assignment.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-300 transition-colors">Privacy First</span>
            <span>•</span>
            <span className="hover:text-zinc-300 transition-colors">No Paid APIs Required</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">v1.0.0-rc</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
