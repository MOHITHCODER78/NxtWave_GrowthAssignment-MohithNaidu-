import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, Menu, X, ArrowUpRight, BarChart3, Compass, LayoutDashboard } from 'lucide-react';
import { ActiveTab } from '@/types';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenWorkshopModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenWorkshopModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Overview', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'evolution', label: 'Evolution Engine', icon: <Compass className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Student Hub', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'admin', label: 'Growth Console', icon: <BarChart3 className="w-4 h-4" /> },
  ] as const;

  const handleNavClick = (tabId: ActiveTab) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#09090b]/85 backdrop-blur-md">
      {/* Top micro-announcement banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-cyan-950/60 border-b border-emerald-500/10 px-4 py-1.5 text-center text-xs text-zinc-300">
        <span className="inline-flex items-center gap-2">
          <Badge variant="emerald" size="sm" dot>
            Free Workshop
          </Badge>
          <span className="font-medium text-zinc-200 hidden sm:inline">
            Build Your First AI Project in 60 Minutes
          </span>
          <span className="text-zinc-400 hidden md:inline">— Limited Cohort Seats Available</span>
          <button
            onClick={onOpenWorkshopModal}
            className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-0.5 ml-1 transition-colors underline underline-offset-2"
          >
            Claim Seat <ArrowUpRight className="w-3 h-3" />
          </button>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors shadow-sm shadow-emerald-500/10">
              <Sparkles className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  ProjectPulse
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                  Lite
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 hidden sm:block font-medium">
                AI Project Evolution Platform
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as ActiveTab)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-800/80 text-white border border-zinc-700/60 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-400' : 'text-zinc-500'}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="glow"
              size="sm"
              onClick={onOpenWorkshopModal}
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Register for Free Workshop
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#0c0c0f] px-4 pt-3 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ActiveTab)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                    : 'text-zinc-300 hover:bg-zinc-800/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2">
            <Button
              variant="glow"
              size="md"
              className="w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWorkshopModal?.();
              }}
              rightIcon={<ArrowUpRight className="w-4 h-4" />}
            >
              Register for Free Workshop
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
