import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  GitFork, 
  Sparkles, 
  ArrowRight, 
  Users, 
  Check, 
  Info,
  GitCompare, 
  Edit3 
} from 'lucide-react';
import { 
  EvolutionTrack, 
  ProjectFork, 
  ForkFieldDiff, 
  CollaborationSuggestion,
  EvolutionPath
} from '@/types';
import { ParsedFriendParams } from '@/utils/shareUrl';
import { saveFork } from '@/utils/studentStorage';

interface FriendModeProps {
  friendParams: ParsedFriendParams;
  onExploreOwnProject: () => void;
  onGenerateCommitCard: (originalProject: string, path: EvolutionPath, domain: string) => void;
  onRegisterWorkshop: (projectTitle: string, trackTitle: string) => void;
}

export const FriendMode: React.FC<FriendModeProps> = ({
  friendParams,
  onExploreOwnProject,
  onGenerateCommitCard,
  onRegisterWorkshop,
}) => {
  const [friendName, setFriendName] = useState('Rohan Das');
  const [forkTitle, setForkTitle] = useState(
    `${friendParams.title} (Collaborative Fork)`
  );
  const [forkTrack, setForkTrack] = useState<EvolutionTrack>(
    friendParams.track === 'upgrade' ? 'transform' : 'differentiate'
  );
  const [targetUser, setTargetUser] = useState(
    'Hostel students and peer study groups'
  );
  const [problemSolved, setProblemSolved] = useState(
    'Extends the original project to support mobile offline usage and peer collaboration.'
  );
  const [specificAiCapability, setSpecificAiCapability] = useState(
    'Client-side vector search and voice summary transcription.'
  );
  const [keyApproach, setKeyApproach] = useState(
    'Runs lightweight models in browser WebAssembly to enable full offline functionality.'
  );
  const [techStack, setTechStack] = useState('React, TypeScript, WebAssembly, Tailwind CSS');
  const [activeTab, setActiveTab] = useState<'comparison' | 'edit'>('comparison');

  // Pre-seed known context for popular preset domains
  const originalAiCapability =
    friendParams.domain.toLowerCase().includes('weather')
      ? 'Contextual multi-variable threshold scoring & commute advice.'
      : friendParams.domain.toLowerCase().includes('attendance')
      ? '75% cutoff trajectory projection + rolling streak anomaly calculation.'
      : 'Specialized heuristic pattern synthesis & decision rules.';

  const originalTargetUser =
    friendParams.domain.toLowerCase().includes('weather')
      ? 'College students, daily commuters, and campus sports athletes.'
      : friendParams.domain.toLowerCase().includes('attendance')
      ? 'Undergraduate students, faculty mentors, and academic department coordinators.'
      : 'College students and department project reviewers.';

  const originalProblem =
    friendParams.domain.toLowerCase().includes('weather')
      ? 'Raw weather numbers are abstract and fail to provide actionable commute guidance.'
      : friendParams.domain.toLowerCase().includes('attendance')
      ? 'Students realize they have fallen below 75% cutoff too late in the semester.'
      : 'Standard student projects lack distinct, practical AI capabilities.';

  // Quick Pivot Suggestions for the friend
  const pivotSuggestions = [
    {
      label: 'Audio & Voice Assistant Pivot',
      track: 'transform' as EvolutionTrack,
      title: `${friendParams.title} — Audio Companion`,
      capability: 'Speech-to-text audio transcription and voice query response.',
      user: 'Commuting students and auditory learners.',
      problem: 'Typing queries on mobile while walking between campus blocks is inconvenient.',
      approach: 'Integrated Web Speech API / free Whisper transcription hook.',
      stack: 'React, Web Speech API, Tailwind CSS, TypeScript',
    },
    {
      label: 'Privacy-First On-Device Edge AI',
      track: 'differentiate' as EvolutionTrack,
      title: `${friendParams.title} — Edge Private Edition`,
      capability: 'Client-side inference using TensorFlow.js with zero server data uploads.',
      user: 'Privacy-conscious students and campus lab administrators.',
      problem: 'Uploading personal data or photos to cloud servers creates security liabilities.',
      approach: 'Loads lightweight models directly in browser memory using Web Workers.',
      stack: 'TensorFlow.js, Web Workers, React, TypeScript',
    },
    {
      label: 'Multi-User Collaborative Room',
      track: 'transform' as EvolutionTrack,
      title: `${friendParams.title} — Team Sync Hub`,
      capability: 'Automated activity summarization and shared state reconciliation.',
      user: 'Hostel roommates and final-year project teams.',
      problem: 'Single-user applications isolate teammates and require manual coordination.',
      approach: 'Real-time WebSocket event stream with automated daily digest cards.',
      stack: 'React, WebSockets, TypeScript, Tailwind CSS',
    },
  ];

  const applyPivotSuggestion = (s: typeof pivotSuggestions[0]) => {
    setForkTrack(s.track);
    setForkTitle(s.title);
    setSpecificAiCapability(s.capability);
    setTargetUser(s.user);
    setProblemSolved(s.problem);
    setKeyApproach(s.approach);
    setTechStack(s.stack);
    setActiveTab('comparison');
  };

  // Compute actual field differences between Parent and Fork
  const diffs: ForkFieldDiff[] = [
    {
      field: 'track',
      label: 'Evolution Track',
      originalValue: friendParams.track.toUpperCase(),
      forkValue: forkTrack.toUpperCase(),
      isChanged: friendParams.track !== forkTrack,
    },
    {
      field: 'author',
      label: 'Project Author',
      originalValue: friendParams.authorName,
      forkValue: friendName.trim() || 'Collaborator',
      isChanged: friendParams.authorName !== friendName.trim(),
    },
    {
      field: 'user',
      label: 'Target User',
      originalValue: originalTargetUser,
      forkValue: targetUser,
      isChanged: originalTargetUser !== targetUser,
    },
    {
      field: 'capability',
      label: 'AI Capability',
      originalValue: originalAiCapability,
      forkValue: specificAiCapability,
      isChanged: originalAiCapability !== specificAiCapability,
    },
    {
      field: 'approach',
      label: 'Technical Approach',
      originalValue: 'Baseline implementation using standard server API hooks.',
      forkValue: keyApproach,
      isChanged: true,
    },
  ];

  const changedCount = diffs.filter((d) => d.isChanged).length;

  // Grounded Collaboration Suggestions
  const collaborationSuggestions: CollaborationSuggestion[] = [
    {
      id: 'collab_1',
      title: 'Shared Data Model & API Contract',
      synergyType: 'Shared Data Model',
      description: `Both "${friendParams.title}" and "${forkTitle}" operate within ${friendParams.domain}. You can agree on a shared JSON schema so the fork can consume data produced by the original project.`,
    },
    {
      id: 'collab_2',
      title: 'Complementary Feature Integration',
      synergyType: 'Complementary Feature',
      description: `While ${friendParams.authorName}'s project focuses on ${friendParams.track} capabilities, your fork addresses ${forkTrack}. You can cross-link both tools as a dual-pane suite during college viva presentations.`,
    },
    {
      id: 'collab_3',
      title: 'Pair-Programming Workshop Strategy',
      synergyType: 'Workshop Pair',
      description: `During the free 60-minute workshop, work in parallel: one student scaffolds the core service while the other builds the client UI and interactive widgets.`,
    },
  ];

  // Save fork locally to prototype storage (same key as Student Dashboard)
  const handleSaveForkLocally = () => {
    const forkRecord: ProjectFork = {
      id: `fork_${Date.now()}`,
      parentProjectTitle: friendParams.title,
      parentAuthor: friendParams.authorName,
      parentTrack: friendParams.track,
      parentDomain: friendParams.domain,
      parentAiCapability: originalAiCapability,
      forkTitle: forkTitle.trim(),
      forkAuthor: friendName.trim() || 'Collaborator',
      forkTrack,
      problemSolved,
      targetUser,
      specificAiCapability,
      keyApproach,
      recommendedStack: techStack.split(',').map((s) => s.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };

    saveFork(forkRecord);
    setActiveTab('comparison');
  };

  // Convert Fork into an EvolutionPath to generate its own Commit Card
  const handleExportForkCommitCard = () => {
    const forkEvolutionPath: EvolutionPath = {
      id: `fork_path_${Date.now()}`,
      track: forkTrack,
      badgeLabel: `${forkTrack.toUpperCase()} FORK`,
      title: forkTitle,
      tagline: `A collaborative fork of ${friendParams.title} by ${friendName}`,
      overview: keyApproach,
      problemSolved,
      targetUser,
      specificAiCapability,
      whyUseful: 'Demonstrates collaborative software engineering and distinct architectural variation.',
      architecturalShift: keyApproach,
      recommendedStack: techStack.split(',').map((s) => s.trim()),
      difficulty: 'Intermediate',
      nextAction: 'Build this forked prototype in the free workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Fork repository & configure environment',
          focusArea: 'Fork Scaffold',
          actionableSteps: ['Clone parent project code.', 'Configure fork configuration variables.', 'Verify parent endpoints.'],
          deliverable: 'Running baseline fork with unique branch name.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement divergent AI capability',
          focusArea: 'Core Logic',
          actionableSteps: ['Implement new AI logic.', 'Integrate custom parameters.', 'Test model response.'],
          deliverable: 'Functional new capability verified in tests.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build fork-specific UI widget',
          focusArea: 'UI Integration',
          actionableSteps: ['Render distinct user inputs.', 'Connect state to parent schema.', 'Add visual comparison tag.'],
          deliverable: 'Interactive UI demonstrating the forked variation.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Document diff & prepare workshop showcase',
          focusArea: 'Review & Push',
          actionableSteps: ['Write README explaining what changed from parent project.', 'Verify zero console errors.', 'Commit to GitHub.'],
          deliverable: 'Published GitHub repository for the forked project.',
        },
      ],
    };

    onGenerateCommitCard(forkTitle, forkEvolutionPath, friendParams.domain);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header Context Banner */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 via-[#101014] to-[#121215] p-6 sm:p-8 space-y-4 shadow-card-glow relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" dot>
              Friend Mode Active
            </Badge>
            <Badge variant="zinc">
              {friendParams.domain}
            </Badge>
            <span className="text-xs text-zinc-400 font-mono">
              Shared by <span className="text-white font-medium">{friendParams.authorName}</span>
            </span>
          </div>

          <button
            onClick={onExploreOwnProject}
            className="text-xs text-zinc-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 transition-colors underline underline-offset-2 cursor-pointer"
          >
            Explore your own idea from scratch <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {friendParams.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl leading-relaxed">
            {friendParams.authorName} is exploring this {friendParams.track.toUpperCase()} direction for the free workshop. You can inspect their idea, fork it into your own variation, and compare what you both build.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-500">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>
            Shared via public Commit Card. Honest parameter resolution active (only URL-encoded metadata is displayed; roadmap is unencoded).
          </span>
        </div>
      </div>

      {/* Mode Navigation Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Side-by-Side Comparison</span>
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Customize Fork Settings</span>
          </button>
        </div>

        <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
          {changedCount} of {diffs.length} attributes distinct
        </span>
      </div>

      {/* VIEW A: FORK CUSTOMIZER DRAWER */}
      {activeTab === 'edit' && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#121215] p-6 sm:p-8 space-y-6 animate-in fade-in-50 duration-150">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GitFork className="w-4 h-4 text-emerald-400" />
              <span>Customize Your Project Fork</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Make this fork genuinely your own. Pick a one-click suggestion or edit the fields below.
            </p>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              One-Click Pivot Suggestions:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {pivotSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPivotSuggestion(s)}
                  className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-left space-y-1 transition-all cursor-pointer group"
                >
                  <span className="text-xs font-semibold text-zinc-200 group-hover:text-emerald-300 block">
                    {s.label}
                  </span>
                  <span className="text-[10px] text-zinc-500 block line-clamp-2">
                    {s.capability}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 text-xs pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Fork Project Title</label>
                <input
                  type="text"
                  value={forkTitle}
                  onChange={(e) => setForkTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Your Name (Friend)</label>
                <input
                  type="text"
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/80"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Target User</label>
                <input
                  type="text"
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Fork Direction Track</label>
                <select
                  value={forkTrack}
                  onChange={(e) => setForkTrack(e.target.value as EvolutionTrack)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/80"
                >
                  <option value="upgrade">Upgrade Track (Pragmatic enhancement)</option>
                  <option value="transform">Transform Track (Adjacent problem pivot)</option>
                  <option value="differentiate">Differentiate Track (Technically ambitious moat)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Specific AI Capability</label>
              <textarea
                rows={2}
                value={specificAiCapability}
                onChange={(e) => setSpecificAiCapability(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/80 leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Key Feature / Architectural Approach</label>
              <textarea
                rows={2}
                value={keyApproach}
                onChange={(e) => setKeyApproach(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/80 leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Technology Stack (Comma separated)</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/80"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={handleSaveForkLocally}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Apply Changes & View Comparison
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => setActiveTab('comparison')}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* VIEW B: SIDE-BY-SIDE COMPARISON & COLLABORATION VIEW */}
      {activeTab === 'comparison' && (
        <div className="space-y-8 animate-in fade-in-50 duration-150">
          {/* Side-by-Side Dual Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Original Idea */}
            <div className="rounded-2xl border border-zinc-800 bg-[#121215] p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-mono font-bold text-zinc-300">
                    A
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Original Project
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      By {friendParams.authorName}
                    </span>
                  </div>
                </div>

                <Badge variant={friendParams.track === 'upgrade' ? 'emerald' : friendParams.track === 'transform' ? 'cyan' : 'purple'} size="sm">
                  {friendParams.track.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  {friendParams.title}
                </h3>
                <span className="text-[11px] text-zinc-500 font-mono block">
                  Domain: {friendParams.domain}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block">
                    Target User
                  </span>
                  <p className="text-zinc-300 leading-relaxed">{originalTargetUser}</p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block">
                    AI Capability
                  </span>
                  <p className="text-zinc-300 leading-relaxed font-mono">{originalAiCapability}</p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block">
                    Problem Solved
                  </span>
                  <p className="text-zinc-400 leading-relaxed">{originalProblem}</p>
                </div>
              </div>
            </div>

            {/* Right: Friend's Forked Variation */}
            <div className="rounded-2xl border border-cyan-500/40 bg-[#121215] p-6 space-y-5 relative shadow-subtle-cyan">
              <div className="absolute -top-3 right-6">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-semibold flex items-center gap-1">
                  <GitFork className="w-3 h-3" /> Forked Variation
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xs font-mono font-bold text-cyan-400">
                    B
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Your Forked Direction
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      By {friendName || 'You'}
                    </span>
                  </div>
                </div>

                <Badge variant={forkTrack === 'upgrade' ? 'emerald' : forkTrack === 'transform' ? 'cyan' : 'purple'} size="sm">
                  {forkTrack.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  {forkTitle}
                </h3>
                <span className="text-[11px] text-zinc-500 font-mono block">
                  Pivot from {friendParams.title}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold block">
                    Target User (Forked)
                  </span>
                  <p className="text-zinc-200 leading-relaxed">{targetUser}</p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold block">
                    Divergent AI Capability
                  </span>
                  <p className="text-emerald-300 leading-relaxed font-mono">{specificAiCapability}</p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold block">
                    Distinct Approach
                  </span>
                  <p className="text-zinc-300 leading-relaxed">{keyApproach}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('edit')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit fork attributes
                </button>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Saved locally in browser
                </span>
              </div>
            </div>
          </div>

          {/* "What Changed?" Exact Field Diff Section */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#121215] p-6 space-y-4 shadow-card-glow">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <GitCompare className="w-4 h-4 text-emerald-400" />
                  <span>What Changed? (Objective Field Diff)</span>
                </h4>
                <p className="text-xs text-zinc-400">
                  Verified comparison based solely on actual field values (no invented differences).
                </p>
              </div>
              <Badge variant="emerald" size="sm">
                {changedCount} Differences Found
              </Badge>
            </div>

            <div className="space-y-2.5">
              {diffs.map((diff, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                    diff.isChanged
                      ? 'bg-zinc-900/90 border-zinc-800'
                      : 'bg-zinc-900/40 border-zinc-900 text-zinc-500'
                  }`}
                >
                  <span className="font-semibold text-zinc-300 sm:w-1/4">
                    {diff.label}:
                  </span>

                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 text-zinc-400">
                    <span className="line-through text-zinc-500 sm:w-1/2 truncate">
                      {diff.originalValue}
                    </span>
                    <span className="hidden sm:inline text-zinc-600">→</span>
                    <span className={diff.isChanged ? 'text-emerald-400 font-medium sm:w-1/2' : 'sm:w-1/2'}>
                      {diff.forkValue}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded shrink-0 self-start sm:self-center">
                    {diff.isChanged ? (
                      <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                        Distinct
                      </span>
                    ) : (
                      <span className="text-zinc-600 bg-zinc-800/60 px-1.5 py-0.5 rounded">
                        Identical
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Collaboration Suggestions Section */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#121215] p-6 space-y-4 shadow-card-glow">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Practical Collaboration Suggestions</span>
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                How both students can build these two projects symbiotically in the 60-minute workshop:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {collaborationSuggestions.map((sug) => (
                <div
                  key={sug.id}
                  className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2 hover:border-zinc-700 transition-colors"
                >
                  <Badge variant="cyan" size="sm">
                    {sug.synergyType}
                  </Badge>
                  <h5 className="text-xs font-bold text-zinc-100">
                    {sug.title}
                  </h5>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {sug.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 to-zinc-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-bold text-white">
                Ready to commit to your forked project?
              </h4>
              <p className="text-xs text-zinc-400">
                Generate your own downloadable Commit Card or register for the free workshop with this forked idea.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="primary"
                size="md"
                onClick={handleExportForkCommitCard}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Generate Fork Commit Card
              </Button>
              <Button
                variant="glow"
                size="md"
                onClick={() => onRegisterWorkshop(forkTitle, `${forkTrack.toUpperCase()} Fork`)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Register with this Fork
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
