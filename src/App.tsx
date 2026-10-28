import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { LandingPage } from '@/components/landing/LandingPage';
import { EvolutionEngine } from '@/components/evolution/EvolutionEngine';
import { WorkshopModal } from '@/components/workshop/WorkshopModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ActiveTab, WorkshopRegistration } from '@/types';
import { LayoutDashboard, BarChart3 } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [workshopModalOpen, setWorkshopModalOpen] = useState(false);
  const [prefilledProject, setPrefilledProject] = useState('');

  const handleRegistered = (reg: WorkshopRegistration) => {
    // Keep in session state for Phase 6 referral linkage
    console.log('Registration completed:', reg);
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectProjectForWorkshop = (projectTitle: string, trackTitle: string) => {
    setPrefilledProject(`${projectTitle} — ${trackTitle}`);
  };

  return (
    <AppShell
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onOpenWorkshopModal={() => setWorkshopModalOpen(true)}
      onNavigateSection={handleNavigateSection}
    >
      {/* 1. Landing Page View (Phase 2) */}
      {activeTab === 'landing' && (
        <LandingPage
          onOpenWorkshopModal={() => setWorkshopModalOpen(true)}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* 2. Evolution Engine Tab (Phase 3 Core Feature) */}
      {activeTab === 'evolution' && (
        <EvolutionEngine
          onSelectProjectForWorkshop={handleSelectProjectForWorkshop}
          onOpenWorkshopModal={() => setWorkshopModalOpen(true)}
        />
      )}

      {/* 3. Student Hub Placeholder (Phase 7) */}
      {activeTab === 'dashboard' && (
        <div className="max-w-3xl mx-auto py-12 text-center space-y-6 animate-in fade-in-50 duration-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <Badge variant="cyan" dot>Phase 7 Ahead</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Student Hub & Credits</h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Track your generated project roadmaps, referral attribution links, and unlocked Project Credits.
            </p>
          </div>
          <Button variant="secondary" onClick={() => setActiveTab('landing')}>
            Back to Overview
          </Button>
        </div>
      )}

      {/* 4. Growth Console Placeholder (Phase 8) */}
      {activeTab === 'admin' && (
        <div className="max-w-3xl mx-auto py-12 text-center space-y-6 animate-in fade-in-50 duration-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <Badge variant="purple" dot>Phase 8 Ahead</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Growth Intelligence Console</h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Server-authenticated funnel analytics, conversion drop-offs, and live event telemetry.
            </p>
          </div>
          <Button variant="secondary" onClick={() => setActiveTab('landing')}>
            Back to Overview
          </Button>
        </div>
      )}

      {/* Workshop Registration Modal */}
      <WorkshopModal
        isOpen={workshopModalOpen}
        onClose={() => setWorkshopModalOpen(false)}
        onRegistered={handleRegistered}
        initialProjectTitle={prefilledProject}
      />
    </AppShell>
  );
}
