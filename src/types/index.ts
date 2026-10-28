export type EvolutionTrack = 'upgrade' | 'transform' | 'differentiate';

export interface StarterSprint {
  minuteRange: '0–15m' | '15–30m' | '30–45m' | '45–60m';
  milestoneTitle: string;
  focusArea: string;
  actionableSteps: string[];
  deliverable: string;
}

export interface EvolutionPath {
  id: string;
  track: EvolutionTrack;
  badgeLabel: string;
  title: string;
  tagline: string;
  overview: string;
  problemSolved: string;
  targetUser: string;
  specificAiCapability: string;
  whyUseful: string;
  architecturalShift: string;
  recommendedStack: string[];
  sixtyMinuteStarterPlan: StarterSprint[];
  difficulty: 'Beginner Friendly' | 'Intermediate' | 'Advanced';
  nextAction: string;
}

export interface ProjectEvolutionResult {
  originalProject: string;
  domain: string;
  paths: {
    upgrade: EvolutionPath;
    transform: EvolutionPath;
    differentiate: EvolutionPath;
  };
}

export interface CommitCardData {
  id: string;
  authorName: string;
  authorCollege?: string;
  projectTitle: string;
  selectedTrack: EvolutionTrack;
  trackTitle: string;
  pledgeStatement: string;
  keyTechStack: string[];
  shareSlug: string;
  forkCount: number;
  referralCode: string;
  createdAt: string;
}

export interface ProjectFork {
  id: string;
  parentProjectTitle: string;
  parentAuthor: string;
  parentTrack: EvolutionTrack;
  parentDomain: string;
  parentAiCapability?: string;
  forkTitle: string;
  forkAuthor: string;
  forkTrack: EvolutionTrack;
  problemSolved: string;
  targetUser: string;
  specificAiCapability: string;
  keyApproach: string;
  recommendedStack: string[];
  createdAt: string;
}

export interface ForkFieldDiff {
  field: string;
  label: string;
  originalValue: string;
  forkValue: string;
  isChanged: boolean;
}

export interface CollaborationSuggestion {
  id: string;
  title: string;
  description: string;
  synergyType: 'Shared Data Model' | 'API Contract' | 'Complementary Feature' | 'Workshop Pair';
}

export type ReferralStatus = 'pending' | 'qualified' | 'rejected';

export interface ReferralRecord {
  id: string;
  referrerCode: string;
  refereeEmailMasked: string;
  refereeCollege: string;
  status: ReferralStatus;
  rejectionReason?: string;
  creditsAwarded: number;
  timestamp: string;
  workshopRegistered: boolean;
}

export interface CreditLedgerEntry {
  id: string;
  delta: number;
  balanceAfter: number;
  reason: string;
  timestamp: string;
}

export interface RewardMilestone {
  tier: 'Bronze' | 'Silver' | 'Gold';
  requiredReferrals: number;
  creditsReward: number;
  blueprintTitle: string;
  blueprintDescription: string;
  blueprintContent: string[];
  isUnlocked: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  referralCode: string;
  referredBy?: string;
  credits: number;
  createdAt: string;
}

export interface WorkshopRegistration {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  college: string;
  yearOfStudy: string;
  selectedProjectTrack?: string;
  referralCodeUsed?: string;
  verified: boolean;
  registeredAt: string;
}

export interface GrowthMetricEvent {
  id: string;
  eventName:
    | 'page_view'
    | 'evolution_generated'
    | 'track_selected'
    | 'commit_card_created'
    | 'commit_card_downloaded'
    | 'share_link_copied'
    | 'project_forked'
    | 'workshop_registered'
    | 'referral_converted';
  metadata: Record<string, unknown>;
  timestamp: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
}

/** Locally persisted evolution direction (Phase 7 Student Dashboard). */
export interface SavedProject {
  id: string;
  originalProject: string;
  domain: string;
  path: EvolutionPath;
  savedAt: string;
}

/** Lightweight local record when a Commit Card view is opened. */
export interface CommitCardRecord {
  id: string;
  projectTitle: string;
  track: EvolutionTrack;
  domain: string;
  createdAt: string;
}

export type DashboardActivityKind =
  | 'project_saved'
  | 'fork_created'
  | 'commit_card_generated'
  | 'workshop_registered'
  | 'referral_qualified'
  | 'referral_rejected';

export interface DashboardActivityItem {
  id: string;
  kind: DashboardActivityKind;
  title: string;
  detail: string;
  timestamp: string;
  /** True when the source is browser localStorage prototype data. */
  isPrototype: boolean;
}

export type ActiveTab = 'landing' | 'evolution' | 'referrals' | 'dashboard' | 'admin' | 'friend-view';
