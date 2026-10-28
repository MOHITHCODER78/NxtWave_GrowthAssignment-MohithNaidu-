import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import {
  LayoutDashboard,
  FolderKanban,
  GitFork,
  Award,
  Activity,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Share2,
  Lock,
  Unlock,
  GitCompare,
  Clock,
  AlertCircle,
  Info,
  BookOpen,
  X,
} from 'lucide-react';
import {
  SavedProject,
  ProjectFork,
  EvolutionPath,
  EvolutionTrack,
  RewardMilestone,
  DashboardActivityItem,
} from '@/types';
import {
  getSavedProjects,
  getSavedForks,
  getDashboardActivity,
  forkToEvolutionPath,
} from '@/utils/studentStorage';
import {
  getReferralStats,
  getOrCreateCurrentUserProfile,
} from '@/utils/referralEngine';
import { generateReferralOnlyUrl } from '@/utils/shareUrl';

interface StudentDashboardProps {
  onNavigateTab: (tab: 'landing' | 'evolution' | 'referrals') => void;
  onOpenWorkshopModal: () => void;
  onGenerateCommitCard: (
    originalProject: string,
    path: EvolutionPath,
    domain: string
  ) => void;
  onReopenFork: (fork: ProjectFork) => void;
}

type DashSection = 'overview' | 'projects' | 'forks' | 'rewards' | 'activity';

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return 'Unknown date';
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Unknown date';
  }
}

function trackBadgeVariant(
  track: EvolutionTrack
): 'emerald' | 'cyan' | 'purple' {
  if (track === 'upgrade') return 'emerald';
  if (track === 'transform') return 'cyan';
  return 'purple';
}

function activityLabel(kind: DashboardActivityItem['kind']): string {
  switch (kind) {
    case 'project_saved':
      return 'Saved';
    case 'fork_created':
      return 'Fork';
    case 'commit_card_generated':
      return 'Card';
    case 'workshop_registered':
      return 'Workshop';
    case 'referral_qualified':
      return 'Qualified';
    case 'referral_rejected':
      return 'Rejected';
    default:
      return 'Event';
  }
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigateTab,
  onOpenWorkshopModal,
  onGenerateCommitCard,
  onReopenFork,
}) => {
  const [section, setSection] = useState<DashSection>('overview');
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [forks, setForks] = useState<ProjectFork[]>([]);
  const [activity, setActivity] = useState<DashboardActivityItem[]>([]);
  const [referralAvailable, setReferralAvailable] = useState(true);
  const [stats, setStats] = useState(() => {
    try {
      return getReferralStats();
    } catch {
      return null;
    }
  });
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [compareFork, setCompareFork] = useState<ProjectFork | null>(null);
  const [blueprintModal, setBlueprintModal] = useState<RewardMilestone | null>(null);
  const [selectedProject, setSelectedProject] = useState<SavedProject | null>(null);

  const refresh = () => {
    setProjects(getSavedProjects());
    setForks(getSavedForks());
    setActivity(getDashboardActivity(25));
    try {
      setStats(getReferralStats());
      setReferralAvailable(true);
    } catch {
      setStats(null);
      setReferralAvailable(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const profile = stats?.profile ?? getOrCreateCurrentUserProfile();
  const referralLink = generateReferralOnlyUrl(profile.referralCode);
  const qualifyingCount = stats?.qualifyingCount ?? 0;
  const milestones = stats?.milestones ?? [];
  const ledger = stats?.ledger ?? [];
  const records = stats?.records ?? [];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(profile.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join the free AI project workshop',
          text: `Use my invite code ${profile.referralCode} to register.`,
          url: referralLink,
        });
      } catch {
        // cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const navItems: { id: DashSection; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'My Projects', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'forks', label: 'My Forks', icon: <GitFork className="w-4 h-4" /> },
    { id: 'rewards', label: 'Rewards', icon: <Award className="w-4 h-4" /> },
    { id: 'activity', label: 'Activity', icon: <Activity className="w-4 h-4" /> },
  ];

  const nextMilestone = milestones.find((m) => !m.isUnlocked);
  const progressTowardNext = nextMilestone
    ? Math.min(100, Math.round((qualifyingCount / nextMilestone.requiredReferrals) * 100))
    : 100;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-400">
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Student Dashboard</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back{profile.name ? `, ${profile.name}` : ''}
            </h1>
            <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
              Your locally saved directions, forks, and prototype referral progress — nothing here is invented.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab('evolution')}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Evolution Engine
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenWorkshopModal}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Register workshop
            </Button>
          </div>
        </div>
      </div>

      {/* Prototype notice */}
      <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-200/90">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
        <p>
          Data on this dashboard lives in your browser&apos;s local storage for this prototype.
          It is not synced across devices and is not a verified server-side account.
        </p>
      </div>

      {/* Section nav */}
      <nav
        className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin"
        aria-label="Dashboard sections"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSection(item.id)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
              section === item.id
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80 border border-transparent'
            }`}
            aria-current={section === item.id ? 'page' : undefined}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* OVERVIEW */}
      {section === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <MetricTile
              label="Saved directions"
              value={String(projects.length)}
              hint={projects.length === 0 ? 'None yet' : 'Local prototype'}
              onClick={() => setSection('projects')}
            />
            <MetricTile
              label="Saved forks"
              value={String(forks.length)}
              hint={forks.length === 0 ? 'None yet' : 'Local prototype'}
              onClick={() => setSection('forks')}
            />
            <MetricTile
              label="Project Credits"
              value={referralAvailable ? String(profile.credits) : '—'}
              hint={
                referralAvailable
                  ? 'From qualified referrals'
                  : 'Referral system unavailable'
              }
              onClick={() => setSection('rewards')}
            />
            <MetricTile
              label="Qualified referrals"
              value={referralAvailable ? String(qualifyingCount) : '—'}
              hint={
                nextMilestone
                  ? `Next: ${nextMilestone.tier} at ${nextMilestone.requiredReferrals}`
                  : 'All milestones unlocked'
              }
              onClick={() => setSection('rewards')}
            />
          </div>

          {referralAvailable && nextMilestone && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Referral progress</CardTitle>
                <CardDescription>
                  {qualifyingCount} of {nextMilestone.requiredReferrals} qualifying
                  registrations toward {nextMilestone.tier}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
                    style={{ width: `${progressTowardNext}%` }}
                    role="progressbar"
                    aria-valuenow={progressTowardNext}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Progress toward ${nextMilestone.tier}`}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Recent activity
                </CardTitle>
                <CardDescription>Derived from your saved local records only.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {activity.length === 0 ? (
                  <EmptyBlock
                    title="No activity yet"
                    body="Save a project direction, create a fork, or submit a workshop registration to see events here."
                    actions={
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onNavigateTab('evolution')}
                        >
                          Find a project upgrade
                        </Button>
                        <Button size="sm" variant="outline" onClick={onOpenWorkshopModal}>
                          Register workshop
                        </Button>
                      </>
                    }
                  />
                ) : (
                  <>
                    {activity.slice(0, 5).map((item) => (
                      <ActivityRow key={item.id} item={item} />
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => setSection('activity')}
                    >
                      View all activity
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Get started</CardTitle>
                <CardDescription>Useful next steps when your hub is empty or light.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <QuickAction
                  title="Generate project directions"
                  detail="Run the Evolution Engine, then save a direction to this dashboard."
                  onClick={() => onNavigateTab('evolution')}
                />
                <QuickAction
                  title="Open Rewards & Blueprints"
                  detail="Copy your referral code and track qualifying registrations."
                  onClick={() => onNavigateTab('referrals')}
                />
                <QuickAction
                  title="Register for the free workshop"
                  detail="Local prototype form — not a confirmed external registration."
                  onClick={onOpenWorkshopModal}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* MY PROJECTS */}
      {section === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">My Projects</h2>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onNavigateTab('evolution')}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Explore new directions
            </Button>
          </div>

          {projects.length === 0 ? (
            <EmptyBlock
              title="No saved projects yet"
              body="Generating directions does not auto-save them. Open the Evolution Engine, pick a track, and use Save to Dashboard."
              actions={
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onNavigateTab('evolution')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Open Evolution Engine
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => (
                <Card key={project.id} hover className="overflow-visible">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-2 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={trackBadgeVariant(project.path.track)} size="sm">
                            {project.path.track.toUpperCase()}
                          </Badge>
                          <Badge variant="zinc" size="sm">
                            {project.path.difficulty}
                          </Badge>
                          {project.path.sixtyMinuteStarterPlan?.length > 0 && (
                            <Badge variant="outline" size="sm">
                              Roadmap ready
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-white truncate">
                          {project.path.title}
                        </h3>
                        <p className="text-xs text-zinc-500">
                          From “{project.originalProject}” · {project.domain}
                        </p>
                        <p className="text-sm text-zinc-400 line-clamp-2">
                          {project.path.specificAiCapability}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.path.recommendedStack.slice(0, 5).map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-zinc-500 flex items-center gap-1 pt-1">
                          <Clock className="w-3 h-3" />
                          Saved {formatDate(project.savedAt)}
                        </p>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setSelectedProject(project)}
                        >
                          Open details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onGenerateCommitCard(
                              project.originalProject,
                              project.path,
                              project.domain
                            )
                          }
                          leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                        >
                          Commit Card
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onNavigateTab('evolution')}
                        >
                          Continue exploring
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MY FORKS */}
      {section === 'forks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">My Forks</h2>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onNavigateTab('landing')}
            >
              Back to landing
            </Button>
          </div>

          {forks.length === 0 ? (
            <EmptyBlock
              title="No forks saved yet"
              body="Open a friend’s share link, customize a fork in Friend Mode, and save it. Saved forks appear here after refresh."
              actions={
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onNavigateTab('landing')}
                >
                  How Friend Mode works
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4">
              {forks.map((fork) => (
                <Card key={fork.id} hover>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={trackBadgeVariant(fork.forkTrack)} size="sm">
                        {fork.forkTrack.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        Fork
                      </Badge>
                    </div>
                    <h3 className="text-base font-semibold text-white">{fork.forkTitle}</h3>
                    <p className="text-xs text-zinc-500">
                      Original: {fork.parentProjectTitle}
                      {fork.parentAuthor ? ` by ${fork.parentAuthor}` : ''}
                      {!fork.parentDomain ? ' · Original details incomplete' : ` · ${fork.parentDomain}`}
                    </p>
                    <p className="text-sm text-zinc-400">{fork.specificAiCapability}</p>
                    <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(fork.createdAt)}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onReopenFork(fork)}
                        leftIcon={<GitFork className="w-3.5 h-3.5" />}
                      >
                        Reopen in Friend Mode
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCompareFork(fork)}
                        leftIcon={<GitCompare className="w-3.5 h-3.5" />}
                      >
                        Compare
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          onGenerateCommitCard(
                            fork.forkTitle,
                            forkToEvolutionPath(fork),
                            fork.parentDomain || 'Engineering Project'
                          )
                        }
                        leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                      >
                        Commit Card
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REWARDS */}
      {section === 'rewards' && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-white">Referral & rewards</h2>

          {!referralAvailable || !stats ? (
            <EmptyBlock
              title="Referral data not available"
              body="The Phase 6 referral and rewards system is not available in this prototype build. Credits and milestones cannot be shown honestly without that state."
              actions={
                <Button size="sm" variant="outline" onClick={() => onNavigateTab('landing')}>
                  Return to overview
                </Button>
              }
            />
          ) : (
            <>
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                        Your referral code
                      </p>
                      <p className="text-2xl font-mono font-bold text-amber-300 tracking-wide mt-1">
                        {profile.referralCode}
                      </p>
                      <p className="text-sm text-zinc-400 mt-2">
                        Balance:{' '}
                        <span className="text-white font-semibold">{profile.credits}</span>{' '}
                        Project Credits
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleCopyCode}
                        leftIcon={
                          copiedCode ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )
                        }
                      >
                        {copiedCode ? 'Copied' : 'Copy code'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyLink}
                        leftIcon={
                          copiedLink ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )
                        }
                      >
                        {copiedLink ? 'Link copied' : 'Copy link'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleShare}
                        leftIcon={<Share2 className="w-3.5 h-3.5" />}
                      >
                        Share
                      </Button>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Credits are awarded only when a referred workshop registration qualifies in this
                    local prototype — not from viewing this dashboard or clicking buttons.
                  </p>
                </CardContent>
              </Card>

              <div className="grid sm:grid-cols-3 gap-3">
                {milestones.map((m) => (
                  <Card key={m.tier} className={m.isUnlocked ? 'border-emerald-500/25' : ''}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant={m.isUnlocked ? 'emerald' : 'zinc'} size="sm">
                          {m.tier}
                        </Badge>
                        {m.isUnlocked ? (
                          <Unlock className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-zinc-600" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-zinc-200">{m.blueprintTitle}</p>
                      <p className="text-xs text-zinc-500">
                        {m.requiredReferrals} qualifying · {m.creditsReward} credits
                      </p>
                      <Button
                        size="sm"
                        variant={m.isUnlocked ? 'secondary' : 'ghost'}
                        className="w-full"
                        disabled={!m.isUnlocked}
                        onClick={() => setBlueprintModal(m)}
                        leftIcon={<BookOpen className="w-3.5 h-3.5" />}
                      >
                        {m.isUnlocked ? 'View blueprint' : 'Locked'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Referral status</CardTitle>
                    <CardDescription>
                      {records.length === 0
                        ? 'No referral records in local storage yet.'
                        : `${qualifyingCount} qualified · local prototype only`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                    {records.length === 0 ? (
                      <p className="text-sm text-zinc-500">
                        Share your code. Qualifying registrations will appear here.
                      </p>
                    ) : (
                      records.slice(0, 10).map((r) => (
                        <div
                          key={r.id}
                          className="flex items-start justify-between gap-2 py-2 border-b border-zinc-800/80 last:border-0"
                        >
                          <div className="min-w-0">
                            <p className="text-sm text-zinc-200 truncate">{r.refereeEmailMasked}</p>
                            <p className="text-[11px] text-zinc-500">{formatDate(r.timestamp)}</p>
                            {r.rejectionReason && (
                              <p className="text-[11px] text-amber-400/90 mt-0.5">
                                {r.rejectionReason}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant={
                              r.status === 'qualified'
                                ? 'emerald'
                                : r.status === 'rejected'
                                  ? 'amber'
                                  : 'zinc'
                            }
                            size="sm"
                          >
                            {r.status}
                          </Badge>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Credit ledger</CardTitle>
                    <CardDescription>Entries created by the referral engine only.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                    {ledger.length === 0 ? (
                      <p className="text-sm text-zinc-500">No ledger entries yet.</p>
                    ) : (
                      ledger.slice(0, 10).map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-start justify-between gap-2 py-2 border-b border-zinc-800/80 last:border-0"
                        >
                          <div className="min-w-0">
                            <p className="text-sm text-zinc-300 truncate">{entry.reason}</p>
                            <p className="text-[11px] text-zinc-500">
                              {formatDate(entry.timestamp)}
                            </p>
                          </div>
                          <span className="text-sm font-mono text-emerald-400 shrink-0">
                            +{entry.delta}
                          </span>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateTab('referrals')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Open full Rewards hub
              </Button>
            </>
          )}
        </div>
      )}

      {/* ACTIVITY */}
      {section === 'activity' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Recent activity</h2>
          {activity.length === 0 ? (
            <EmptyBlock
              title="No activity history"
              body="Activity appears when you save projects, create forks, generate Commit Cards, submit the workshop form, or qualify referrals — all from real local records."
              actions={
                <>
                  <Button size="sm" variant="primary" onClick={() => onNavigateTab('evolution')}>
                    Find my project upgrade
                  </Button>
                  <Button size="sm" variant="outline" onClick={onOpenWorkshopModal}>
                    Register workshop
                  </Button>
                </>
              }
            />
          ) : (
            <Card>
              <CardContent className="p-4 sm:p-5 space-y-1">
                {activity.map((item) => (
                  <ActivityRow key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Project detail modal */}
      {selectedProject && (
        <ModalShell
          title={selectedProject.path.title}
          onClose={() => setSelectedProject(null)}
        >
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-2">
              <Badge variant={trackBadgeVariant(selectedProject.path.track)} size="sm">
                {selectedProject.path.track.toUpperCase()}
              </Badge>
              <Badge variant="zinc" size="sm">
                {selectedProject.domain}
              </Badge>
            </div>
            <p className="text-zinc-300 leading-relaxed">{selectedProject.path.overview}</p>
            <DetailRow label="Problem" value={selectedProject.path.problemSolved} />
            <DetailRow label="Target user" value={selectedProject.path.targetUser} />
            <DetailRow label="AI capability" value={selectedProject.path.specificAiCapability} />
            <DetailRow label="Next action" value={selectedProject.path.nextAction} />
            <div>
              <p className="text-xs text-zinc-500 mb-2">60-minute roadmap</p>
              <ul className="space-y-2">
                {selectedProject.path.sixtyMinuteStarterPlan.map((sprint) => (
                  <li
                    key={sprint.minuteRange}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"
                  >
                    <p className="font-medium text-zinc-200 text-xs">
                      {sprint.minuteRange} · {sprint.milestoneTitle}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">{sprint.deliverable}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  onGenerateCommitCard(
                    selectedProject.originalProject,
                    selectedProject.path,
                    selectedProject.domain
                  );
                  setSelectedProject(null);
                }}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Generate Commit Card
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setSelectedProject(null);
                  onNavigateTab('evolution');
                }}
              >
                Continue exploring
              </Button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Fork compare modal */}
      {compareFork && (
        <ModalShell
          title="What changed?"
          onClose={() => setCompareFork(null)}
        >
          <div className="space-y-3">
            <p className="text-xs text-zinc-500">
              Side-by-side comparison from locally saved fork data. Missing parent fields are labeled
              honestly.
            </p>
            <CompareRow
              label="Title"
              original={compareFork.parentProjectTitle || 'Unavailable'}
              fork={compareFork.forkTitle}
            />
            <CompareRow
              label="Track"
              original={compareFork.parentTrack?.toUpperCase() || 'Unavailable'}
              fork={compareFork.forkTrack.toUpperCase()}
            />
            <CompareRow
              label="AI capability"
              original={compareFork.parentAiCapability || 'Not stored with this fork'}
              fork={compareFork.specificAiCapability}
            />
            <CompareRow
              label="Problem"
              original="See original share link for full context"
              fork={compareFork.problemSolved}
            />
            <CompareRow
              label="Target user"
              original="Not stored for all forks"
              fork={compareFork.targetUser}
            />
            <div className="flex flex-wrap gap-2 pt-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  onReopenFork(compareFork);
                  setCompareFork(null);
                }}
              >
                Reopen fork
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setCompareFork(null)}>
                Close
              </Button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Blueprint modal */}
      {blueprintModal && (
        <ModalShell
          title={blueprintModal.blueprintTitle}
          onClose={() => setBlueprintModal(null)}
        >
          <div className="space-y-3">
            <Badge variant="emerald" size="sm">
              {blueprintModal.tier} unlocked
            </Badge>
            <p className="text-sm text-zinc-400">{blueprintModal.blueprintDescription}</p>
            <ol className="space-y-2 list-decimal pl-4 text-sm text-zinc-300">
              {blueprintModal.blueprintContent.map((step, i) => (
                <li key={i} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </ModalShell>
      )}
    </div>
  );
};

function MetricTile({
  label,
  value,
  hint,
  onClick,
}: {
  label: string;
  value: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-xl border border-white/[0.08] bg-[#121215] p-4 hover:border-white/[0.14] hover:bg-[#16161a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
    >
      <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-white mt-1 tabular-nums">{value}</p>
      <p className="text-[11px] text-zinc-500 mt-1 truncate">{hint}</p>
    </button>
  );
}

function EmptyBlock({
  title,
  body,
  actions,
}: {
  title: string;
  body: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-700/80 bg-zinc-900/40 px-5 py-10 text-center space-y-4">
      <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{body}</p>
      </div>
      {actions && <div className="flex flex-wrap justify-center gap-2">{actions}</div>}
    </div>
  );
}

function ActivityRow({ item }: { item: DashboardActivityItem }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-zinc-800/60 last:border-0">
      <Badge variant="zinc" size="sm" className="shrink-0 mt-0.5">
        {activityLabel(item.kind)}
      </Badge>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-zinc-200">{item.title}</p>
        <p className="text-xs text-zinc-500 truncate">{item.detail}</p>
        <p className="text-[11px] text-zinc-600 mt-0.5 flex items-center gap-1.5">
          {formatDate(item.timestamp)}
          {item.isPrototype && (
            <span className="text-amber-500/80">· local prototype</span>
          )}
        </p>
      </div>
    </div>
  );
}

function QuickAction({
  title,
  detail,
  onClick,
}: {
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-lg border border-zinc-800 bg-zinc-900/40 px-3.5 py-3 hover:border-zinc-700 hover:bg-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
    >
      <p className="text-sm font-medium text-zinc-100">{title}</p>
      <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{detail}</p>
    </button>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="text-sm text-zinc-300 mt-0.5 leading-relaxed">{value}</p>
    </div>
  );
}

function CompareRow({
  label,
  original,
  fork,
}: {
  label: string;
  original: string;
  fork: string;
}) {
  const changed = original !== fork;
  return (
    <div className="rounded-lg border border-zinc-800 overflow-hidden text-xs">
      <div className="px-3 py-1.5 bg-zinc-900/80 text-zinc-400 font-medium flex items-center justify-between">
        {label}
        {changed && (
          <Badge variant="cyan" size="sm">
            Changed
          </Badge>
        )}
      </div>
      <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800">
        <div className="p-3 space-y-1">
          <p className="text-[10px] uppercase text-zinc-600">Original</p>
          <p className="text-zinc-300 leading-relaxed">{original}</p>
        </div>
        <div className="p-3 space-y-1">
          <p className="text-[10px] uppercase text-zinc-600">Fork</p>
          <p className="text-zinc-200 leading-relaxed">{fork}</p>
        </div>
      </div>
    </div>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-white/[0.1] bg-[#121215] shadow-2xl p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-white pr-6">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
