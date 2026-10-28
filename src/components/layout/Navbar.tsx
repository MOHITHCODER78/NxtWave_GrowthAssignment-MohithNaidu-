import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, Menu, X, ArrowUpRight, ArrowRight, Award, LayoutDashboard } from 'lucide-react';
import { ActiveTab } from '@/types';
import { getOrCreateCurrentUserProfile } from '@/utils/referralEngine';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenWorkshopModal: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenWorkshopModal,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentUser = getOrCreateCurrentUserProfile();

  const navLinks = [
    { id: 'explore', label: 'Explore projects', sectionId: 'explore-section' },
    { id: 'how-it-works', label: 'How it works', sectionId: 'how-it-works-section' },
    { id: 'the-workshop', label: 'The workshop', sectionId: 'workshop-section' },
  ];

  const handleLinkClick = (sectionId: string) => {
    if (activeTab !== 'landing') {
      onSelectTab('landing');
      setTimeout(() => {
        onNavigateSection?.(sectionId);
      }, 50);
    } else {
      onNavigateSection?.(sectionId);
    }
    setMobileMenuOpen(false);
  };

  const handleBrandClick = () => {
    onSelectTab('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#09090b]/90 backdrop-blur-md">
      {/* Human-written announcement bar */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-white/[0.06] px-4 py-2 text-center text-xs text-zinc-300">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3">
          <Badge variant="emerald" size="sm" dot>
            Free workshop
          </Badge>
          <span className="text-zinc-200 font-medium">
            Build your first AI project in 60 minutes
          </span>
          <span className="text-zinc-500 hidden sm:inline">·</span>
          <button
            onClick={onOpenWorkshopModal}
            className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 transition-colors underline underline-offset-2 cursor-pointer"
          >
            <span>Register free</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={handleBrandClick}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/15 transition-all">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                ProjectPulse
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/60">
                Lite
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.sectionId)}
                className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => onSelectTab('dashboard')}
              className={`text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'text-cyan-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onSelectTab('referrals')}
              className={`text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'referrals'
                  ? 'text-amber-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Rewards & Blueprints</span>
            </button>
          </nav>

          {/* Right Action CTA & Credits Pill */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onSelectTab('referrals')}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="View Project Credits Ledger"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>{currentUser.credits} Credits</span>
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectTab('dashboard')}
            >
              Dashboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectTab('evolution')}
            >
              Evolution Engine
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenWorkshopModal}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Get started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#0c0c0f] px-4 pt-3 pb-5 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.sectionId)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800/60 transition-colors"
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => {
                onSelectTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-cyan-400 hover:bg-zinc-800/60 transition-colors flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Student Dashboard</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('referrals');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-amber-400 hover:bg-zinc-800/60 transition-colors flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Rewards & Blueprints ({currentUser.credits} Credits)</span>
            </button>
          </div>
          <div className="pt-2 border-t border-zinc-800/80 flex flex-col gap-2">
            <Button
              variant="outline"
              size="md"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('dashboard');
              }}
            >
              Dashboard
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('evolution');
              }}
            >
              Evolution Engine
            </Button>
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWorkshopModal();
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Get started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
