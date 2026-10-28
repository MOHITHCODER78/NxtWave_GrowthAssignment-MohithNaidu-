import {
  SavedProject,
  ProjectFork,
  WorkshopRegistration,
  CommitCardRecord,
  DashboardActivityItem,
  EvolutionPath,
  EvolutionTrack,
  ReferralRecord,
} from '@/types';

export const STUDENT_STORAGE_KEYS = {
  PROJECTS: 'projectpulse_saved_projects',
  FORKS: 'projectpulse_forks',
  REGISTRATIONS: 'projectpulse_registrations',
  COMMIT_CARDS: 'projectpulse_commit_cards',
  REFERRAL_RECORDS: 'projectpulse_referral_records',
} as const;

function safeParseArray(raw: string | null): unknown[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function isEvolutionTrack(value: unknown): value is EvolutionTrack {
  return value === 'upgrade' || value === 'transform' || value === 'differentiate';
}

function isValidEvolutionPath(value: unknown): value is EvolutionPath {
  if (!value || typeof value !== 'object') return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === 'string' &&
    isEvolutionTrack(p.track) &&
    typeof p.title === 'string' &&
    typeof p.specificAiCapability === 'string' &&
    Array.isArray(p.recommendedStack) &&
    Array.isArray(p.sixtyMinuteStarterPlan)
  );
}

function isValidSavedProject(value: unknown): value is SavedProject {
  if (!value || typeof value !== 'object') return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === 'string' &&
    typeof p.originalProject === 'string' &&
    typeof p.domain === 'string' &&
    typeof p.savedAt === 'string' &&
    isValidEvolutionPath(p.path)
  );
}

function isValidFork(value: unknown): value is ProjectFork {
  if (!value || typeof value !== 'object') return false;
  const f = value as Record<string, unknown>;
  return (
    typeof f.id === 'string' &&
    typeof f.forkTitle === 'string' &&
    typeof f.parentProjectTitle === 'string' &&
    isEvolutionTrack(f.forkTrack) &&
    isEvolutionTrack(f.parentTrack) &&
    typeof f.createdAt === 'string' &&
    Array.isArray(f.recommendedStack)
  );
}

function isValidRegistration(value: unknown): value is WorkshopRegistration {
  if (!value || typeof value !== 'object') return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.studentName === 'string' &&
    typeof r.email === 'string' &&
    typeof r.registeredAt === 'string'
  );
}

function isValidCommitCardRecord(value: unknown): value is CommitCardRecord {
  if (!value || typeof value !== 'object') return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === 'string' &&
    typeof c.projectTitle === 'string' &&
    isEvolutionTrack(c.track) &&
    typeof c.createdAt === 'string'
  );
}

function isValidReferralRecord(value: unknown): value is ReferralRecord {
  if (!value || typeof value !== 'object') return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.referrerCode === 'string' &&
    (r.status === 'pending' || r.status === 'qualified' || r.status === 'rejected') &&
    typeof r.timestamp === 'string'
  );
}

/**
 * Returns validated saved projects. Malformed entries are skipped.
 */
export function getSavedProjects(): SavedProject[] {
  if (typeof window === 'undefined') return [];
  try {
    return safeParseArray(localStorage.getItem(STUDENT_STORAGE_KEYS.PROJECTS)).filter(
      isValidSavedProject
    );
  } catch {
    return [];
  }
}

export function getSavedProjectById(id: string): SavedProject | null {
  return getSavedProjects().find((p) => p.id === id) ?? null;
}

/**
 * Persists an evolution direction. Does not auto-save on generate —
 * callers must invoke this from an explicit Save action.
 */
export function saveProject(input: {
  originalProject: string;
  domain: string;
  path: EvolutionPath;
}): { ok: boolean; project?: SavedProject; error?: string } {
  if (typeof window === 'undefined') {
    return { ok: false, error: 'Storage unavailable in this environment.' };
  }

  if (!isValidEvolutionPath(input.path)) {
    return { ok: false, error: 'Invalid project direction data.' };
  }

  try {
    const list = getSavedProjects();
    const duplicate = list.find(
      (p) =>
        p.path.id === input.path.id &&
        p.originalProject === input.originalProject &&
        p.path.track === input.path.track
    );
    if (duplicate) {
      return { ok: true, project: duplicate };
    }

    const project: SavedProject = {
      id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      originalProject: input.originalProject.trim().slice(0, 160),
      domain: input.domain.trim().slice(0, 120),
      path: input.path,
      savedAt: new Date().toISOString(),
    };

    list.unshift(project);
    localStorage.setItem(STUDENT_STORAGE_KEYS.PROJECTS, JSON.stringify(list));
    return { ok: true, project };
  } catch {
    return { ok: false, error: 'Could not write to local prototype storage.' };
  }
}

export function getSavedForks(): ProjectFork[] {
  if (typeof window === 'undefined') return [];
  try {
    return safeParseArray(localStorage.getItem(STUDENT_STORAGE_KEYS.FORKS)).filter(isValidFork);
  } catch {
    return [];
  }
}

export function getSavedForkById(id: string): ProjectFork | null {
  return getSavedForks().find((f) => f.id === id) ?? null;
}

/**
 * Saves a fork using the same key Friend Mode already uses.
 */
export function saveFork(fork: ProjectFork): { ok: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { ok: false, error: 'Storage unavailable.' };
  }
  if (!isValidFork(fork)) {
    return { ok: false, error: 'Invalid fork record.' };
  }
  try {
    const list = getSavedForks();
    if (list.some((f) => f.id === fork.id)) {
      return { ok: true };
    }
    list.push(fork);
    localStorage.setItem(STUDENT_STORAGE_KEYS.FORKS, JSON.stringify(list));
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not save fork.' };
  }
}

export function getWorkshopRegistrations(): WorkshopRegistration[] {
  if (typeof window === 'undefined') return [];
  try {
    return safeParseArray(localStorage.getItem(STUDENT_STORAGE_KEYS.REGISTRATIONS)).filter(
      isValidRegistration
    );
  } catch {
    return [];
  }
}

export function getCommitCardRecords(): CommitCardRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    return safeParseArray(localStorage.getItem(STUDENT_STORAGE_KEYS.COMMIT_CARDS)).filter(
      isValidCommitCardRecord
    );
  } catch {
    return [];
  }
}

export function recordCommitCardGenerated(input: {
  projectTitle: string;
  track: EvolutionTrack;
  domain: string;
}): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getCommitCardRecords();
    const record: CommitCardRecord = {
      id: `cc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      projectTitle: input.projectTitle.slice(0, 160),
      track: input.track,
      domain: input.domain.slice(0, 120),
      createdAt: new Date().toISOString(),
    };
    list.unshift(record);
    localStorage.setItem(
      STUDENT_STORAGE_KEYS.COMMIT_CARDS,
      JSON.stringify(list.slice(0, 50))
    );
  } catch {
    // Prototype storage failure is non-fatal
  }
}

function getReferralRecordsSafe(): ReferralRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    return safeParseArray(
      localStorage.getItem(STUDENT_STORAGE_KEYS.REFERRAL_RECORDS)
    ).filter(isValidReferralRecord);
  } catch {
    return [];
  }
}

/**
 * Builds a recent-activity feed from real persisted prototype records only.
 * Never invents placeholder events.
 */
export function getDashboardActivity(limit = 20): DashboardActivityItem[] {
  const items: DashboardActivityItem[] = [];

  for (const p of getSavedProjects()) {
    items.push({
      id: `act_proj_${p.id}`,
      kind: 'project_saved',
      title: 'Project direction saved',
      detail: `${p.path.title} · ${p.path.track}`,
      timestamp: p.savedAt,
      isPrototype: true,
    });
  }

  for (const f of getSavedForks()) {
    items.push({
      id: `act_fork_${f.id}`,
      kind: 'fork_created',
      title: 'Fork created',
      detail: `${f.forkTitle} (from ${f.parentProjectTitle})`,
      timestamp: f.createdAt,
      isPrototype: true,
    });
  }

  for (const c of getCommitCardRecords()) {
    items.push({
      id: `act_cc_${c.id}`,
      kind: 'commit_card_generated',
      title: 'Commit Card generated',
      detail: `${c.projectTitle} · ${c.track}`,
      timestamp: c.createdAt,
      isPrototype: true,
    });
  }

  for (const r of getWorkshopRegistrations()) {
    items.push({
      id: `act_reg_${r.id}`,
      kind: 'workshop_registered',
      title: 'Workshop form submitted',
      detail: `Local prototype registration · ${r.selectedProjectTrack || 'General'}`,
      timestamp: r.registeredAt,
      isPrototype: true,
    });
  }

  for (const r of getReferralRecordsSafe()) {
    if (r.status === 'qualified') {
      items.push({
        id: `act_ref_${r.id}`,
        kind: 'referral_qualified',
        title: 'Referral qualified',
        detail: `${r.refereeEmailMasked} · +${r.creditsAwarded} credits (local prototype)`,
        timestamp: r.timestamp,
        isPrototype: true,
      });
    } else if (r.status === 'rejected') {
      items.push({
        id: `act_ref_${r.id}`,
        kind: 'referral_rejected',
        title: 'Referral rejected',
        detail: r.rejectionReason || 'Not eligible',
        timestamp: r.timestamp,
        isPrototype: true,
      });
    }
  }

  return items
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

/**
 * Converts a saved fork into an EvolutionPath for Commit Card reuse.
 */
export function forkToEvolutionPath(fork: ProjectFork): EvolutionPath {
  return {
    id: `fork_path_${fork.id}`,
    track: fork.forkTrack,
    badgeLabel: `${fork.forkTrack.toUpperCase()} FORK`,
    title: fork.forkTitle,
    tagline: `A collaborative fork of ${fork.parentProjectTitle}`,
    overview: fork.keyApproach,
    problemSolved: fork.problemSolved,
    targetUser: fork.targetUser,
    specificAiCapability: fork.specificAiCapability,
    whyUseful: fork.keyApproach,
    architecturalShift: fork.keyApproach,
    recommendedStack: fork.recommendedStack,
    sixtyMinuteStarterPlan: [
      {
        minuteRange: '0–15m',
        milestoneTitle: 'Set up fork baseline',
        focusArea: 'Foundation',
        actionableSteps: [
          'Clone or scaffold from the original idea.',
          'Rename the project to your fork title.',
          'Confirm the distinguishing capability.',
        ],
        deliverable: 'Named fork with clear differentiation.',
      },
      {
        minuteRange: '15–30m',
        milestoneTitle: 'Implement core AI hook',
        focusArea: 'Capability',
        actionableSteps: [
          `Wire ${fork.specificAiCapability}`,
          'Add a minimal UI surface for the capability.',
        ],
        deliverable: 'Working capability demo path.',
      },
      {
        minuteRange: '30–45m',
        milestoneTitle: 'Polish for workshop demo',
        focusArea: 'UX',
        actionableSteps: [
          'Add empty and loading states.',
          'Document the difference vs the original.',
        ],
        deliverable: 'Demo-ready fork walkthrough.',
      },
      {
        minuteRange: '45–60m',
        milestoneTitle: 'Share and compare',
        focusArea: 'Collaboration',
        actionableSteps: [
          'Generate a Commit Card.',
          'Compare with the original project.',
        ],
        deliverable: 'Shareable fork link.',
      },
    ],
    difficulty: 'Intermediate',
    nextAction: 'Build this forked prototype in the free workshop.',
  };
}
