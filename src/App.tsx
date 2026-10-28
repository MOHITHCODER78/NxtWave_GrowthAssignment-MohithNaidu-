import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { LandingPage } from '@/components/landing/LandingPage';
import { EvolutionEngine } from '@/components/evolution/EvolutionEngine';
import { CommitCard } from '@/components/commit-card/CommitCard';
import { FriendMode } from '@/components/friend/FriendMode';
import { ReferralHub } from '@/components/referral/ReferralHub';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { WorkshopModal } from '@/components/workshop/WorkshopModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ActiveTab, WorkshopRegistration, EvolutionPath, ProjectFork } from '@/types';
import { parseFriendUrlParams, ParsedFriendParams } from '@/utils/shareUrl';
import { captureReferralCode } from '@/utils/referralEngine';
import { recordCommitCardGenerated } from '@/utils/studentStorage';
import { BarChart3, GitFork, Award } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [workshopModalOpen, setWorkshopModalOpen] = useState(false);
  const [prefilledProject, setPrefilledProject] = useState('');

  // Commit Card State (Phase 4)
  const [commitCardData, setCommitCardData] = useState<{
    originalProject: string;
    path: EvolutionPath;
    domain: string;
  } | null>(null);

  // Friend Mode State (Phase 5)
  const [friendParams, setFriendParams] = useState<ParsedFriendParams | null>(null);

  // Parse URL parameters and capture referral attribution on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      captureReferralCode(window.location.search);
      const parsed = parseFriendUrlParams(window.location.search);
      if (parsed) {
        setFriendParams(parsed);
      }
    }
  }, []);

  const handleRegistered = (reg: WorkshopRegistration) => {
    console.log('Registration completed:', reg);
  };

  const handleNavigateSection = (sectionId: string) => {
    setCommitCardData(null);
    setFriendParams(null);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectProjectForWorkshop = (projectTitle: string, trackTitle: string) => {
    setPrefilledProject(`${projectTitle} — ${trackTitle}`);
  };

  const handleGenerateCommitCard = (
    originalProject: string,
    path: EvolutionPath,
    domain: string
  ) => {
    recordCommitCardGenerated({
      projectTitle: path.title || originalProject,
      track: path.track,
      domain,
    });
    setFriendParams(null);
    setCommitCardData({ originalProject, path, domain });
  };

  const handleReopenFork = (fork: ProjectFork) => {
    setCommitCardData(null);
    setActiveTab('landing');
    setFriendParams({
      isValid: true,
      title: fork.parentProjectTitle || 'Untitled Project Idea',
      track: fork.parentTrack || 'upgrade',
      authorName: fork.parentAuthor || 'Fellow Student',
      domain: fork.parentDomain || 'Engineering Project',
      isMalformed: !fork.parentProjectTitle,
    });
  };

  // Demo simulator for testing Friend Mode directly without URL manual typing
  const handleSimulateFriendLink = () => {
    setCommitCardData(null);
    setFriendParams({
      isValid: true,
      title: 'Smart Lecture Digest Assistant',
      track: 'transform',
      authorName: 'Alex Chen',
      domain: 'Academic Operations & Campus Systems',
      referralCode: 'PULSE-7842',
      isMalformed: false,
    });
  };

  // Demo simulator for testing Referral Link directly
  const handleSimulateReferralLink = () => {
    captureReferralCode('?ref=PULSE-8912');
    setWorkshopModalOpen(true);
  };

  return (
    <AppShell
      activeTab={activeTab}
      onSelectTab={(tab) => {
        setCommitCardData(null);
        setFriendParams(null);
        setActiveTab(tab);
      }}
      onOpenWorkshopModal={() => setWorkshopModalOpen(true)}
      onNavigateSection={handleNavigateSection}
    >
      {/* Reviewer Shortcut Banner for Phase 5 & 6 testing */}
      {!friendParams && !commitCardData && activeTab === 'landing' && (
        <div className="mb-6 p-3 rounded-xl border border-amber-500/20 bg-zinc-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="amber" size="sm" dot>
              Phase 6 Active
            </Badge>
            <span className="text-zinc-300">
              Referral Attribution & Milestone Rewards Engine
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSimulateFriendLink}
              className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1.5 underline underline-offset-2 cursor-pointer"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Simulate Friend Link</span>
            </button>
            <button
              onClick={handleSimulateReferralLink}
              className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1.5 underline underline-offset-2 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Simulate ?ref=PULSE-8912 Registration</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW: FRIEND MODE (Phase 5) */}
      {friendParams ? (
        <FriendMode
          friendParams={friendParams}
          onExploreOwnProject={() => {
            setFriendParams(null);
            setActiveTab('evolution');
          }}
          onGenerateCommitCard={handleGenerateCommitCard}
          onRegisterWorkshop={(pTitle, tTitle) => {
            handleSelectProjectForWorkshop(pTitle, tTitle);
            setWorkshopModalOpen(true);
          }}
        />
      ) : commitCardData ? (
        /* VIEW: COMMIT CARD (Phase 4) */
        <CommitCard
          originalProjectName={commitCardData.originalProject}
          evolutionPath={commitCardData.path}
          domainName={commitCardData.domain}
          onBackToEngine={() => setCommitCardData(null)}
          onRegisterWorkshop={(pTitle, tTitle) => {
            handleSelectProjectForWorkshop(pTitle, tTitle);
            setWorkshopModalOpen(true);
          }}
        />
      ) : (
        /* STANDARD PRODUCT VIEWS */
        <>
          {/* 1. Landing Page View (Phase 2) */}
          {activeTab === 'landing' && (
            <LandingPage
              onOpenWorkshopModal={() => setWorkshopModalOpen(true)}
              onNavigateTab={(tab) => {
                setCommitCardData(null);
                setFriendParams(null);
                setActiveTab(tab);
              }}
            />
          )}

          {/* 2. Evolution Engine Tab (Phase 3) */}
          {activeTab === 'evolution' && (
            <EvolutionEngine
              onSelectProjectForWorkshop={handleSelectProjectForWorkshop}
              onOpenWorkshopModal={() => setWorkshopModalOpen(true)}
              onGenerateCommitCard={handleGenerateCommitCard}
            />
          )}

          {/* 3. Referral & Rewards Hub (Phase 6 Core Feature) */}
          {activeTab === 'referrals' && (
            <ReferralHub
              onOpenWorkshopModal={() => setWorkshopModalOpen(true)}
              onExploreProjects={() => setActiveTab('evolution')}
            />
          )}

          {/* 4. Student Dashboard (Phase 7) */}
          {activeTab === 'dashboard' && (
            <StudentDashboard
              onNavigateTab={(tab) => {
                setCommitCardData(null);
                setFriendParams(null);
                setActiveTab(tab);
              }}
              onOpenWorkshopModal={() => setWorkshopModalOpen(true)}
              onGenerateCommitCard={handleGenerateCommitCard}
              onReopenFork={handleReopenFork}
            />
          )}

          {/* 5. Growth Console Placeholder (Phase 8) */}
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
        </>
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
