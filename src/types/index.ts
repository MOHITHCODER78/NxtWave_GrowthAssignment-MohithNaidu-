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
  architecturalShift: string;
  recommendedStack: string[];
  sixtyMinuteStarterPlan: StarterSprint[];
  difficulty: 'Beginner Friendly' | 'Intermediate' | 'Advanced';
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

export type ActiveTab = 'landing' | 'evolution' | 'dashboard' | 'admin' | 'friend-view';
