import {
  GrowthMetricEvent,
  GrowthEventName,
  CampaignConfig,
  GrowthExperiment,
  WorkshopRegistration,
  ReferralRecord,
} from '@/types';

const STORAGE_KEYS = {
  EVENTS: 'projectpulse_analytics_events',
  SESSION: 'projectpulse_analytics_session',
  EXPERIMENTS: 'projectpulse_experiments',
  DEDUPE: 'projectpulse_analytics_dedupe',
} as const;

/** Campaign goals — configuration only, not achieved results. */
export const CAMPAIGN_CONFIG: CampaignConfig = {
  targetRegistrations: 500,
  budgetInr: 2000,
  durationDays: 7,
  label: 'NxtWave Growth Intern — Free AI Workshop Campaign',
};

const MAX_EVENTS = 2000;
const ALLOWED_EVENTS = new Set<GrowthEventName>([
  'page_view',
  'evolution_generated',
  'track_selected',
  'commit_card_created',
  'commit_card_downloaded',
  'share_link_copied',
  'project_forked',
  'workshop_registered',
  'referral_click',
  'referral_converted',
  'project_saved',
]);

function safeParseArray(raw: string | null): unknown[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function isValidEvent(value: unknown): value is GrowthMetricEvent {
  if (!value || typeof value !== 'object') return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.eventName === 'string' &&
    ALLOWED_EVENTS.has(e.eventName as GrowthEventName) &&
    typeof e.timestamp === 'string' &&
    typeof e.sessionId === 'string' &&
    (e.metadata === undefined || typeof e.metadata === 'object')
  );
}

/**
 * Anonymous session id for funnel continuity. Not a device fingerprint.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'session_node';
  try {
    const existing = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    if (existing && existing.startsWith('sess_')) return existing;
    const id = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(STORAGE_KEYS.SESSION, id);
    return id;
  } catch {
    return `sess_ephemeral_${Date.now()}`;
  }
}

export function parseUtmFromSearch(search: string): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  source?: string;
  ref?: string;
} {
  try {
    const clean = search.startsWith('?') ? search.slice(1) : search;
    const params = new URLSearchParams(clean);
    const utmSource = params.get('utm_source')?.trim().slice(0, 64) || undefined;
    const utmMedium = params.get('utm_medium')?.trim().slice(0, 64) || undefined;
    const utmCampaign = params.get('utm_campaign')?.trim().slice(0, 64) || undefined;
    const ref = params.get('ref')?.trim().toUpperCase().slice(0, 20) || undefined;
    let source: string | undefined;
    if (ref) source = 'referral';
    else if (utmSource) source = 'utm';
    else if (typeof document !== 'undefined' && document.referrer) source = 'direct_or_referrer';
    else source = 'direct';
    return { utmSource, utmMedium, utmCampaign, source, ref };
  } catch {
    return { source: 'direct' };
  }
}

function readDedupeSet(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const arr = safeParseArray(localStorage.getItem(STORAGE_KEYS.DEDUPE));
    return new Set(arr.filter((x): x is string => typeof x === 'string').slice(-500));
  } catch {
    return new Set();
  }
}

function writeDedupeSet(set: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.DEDUPE, JSON.stringify([...set].slice(-500)));
  } catch {
    // ignore
  }
}

/**
 * Records a typed analytics event. Skips invalid names and duplicate dedupeKeys.
 * Never stores emails, passwords, or private project content.
 */
export function trackEvent(
  eventName: GrowthEventName,
  metadata: Record<string, unknown> = {},
  options?: {
    dedupeKey?: string;
    source?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }
): { recorded: boolean; reason?: string; event?: GrowthMetricEvent } {
  if (!ALLOWED_EVENTS.has(eventName)) {
    return { recorded: false, reason: 'invalid_event' };
  }

  if (typeof window === 'undefined') {
    return { recorded: false, reason: 'no_browser' };
  }

  try {
    if (options?.dedupeKey) {
      const dedupe = readDedupeSet();
      if (dedupe.has(options.dedupeKey)) {
        return { recorded: false, reason: 'duplicate' };
      }
      dedupe.add(options.dedupeKey);
      writeDedupeSet(dedupe);
    }

    // Strip potentially sensitive keys from metadata
    const safeMeta: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(metadata)) {
      const key = k.toLowerCase();
      if (
        key.includes('email') ||
        key.includes('password') ||
        key.includes('phone') ||
        key.includes('secret')
      ) {
        continue;
      }
      if (typeof v === 'string') safeMeta[k] = v.slice(0, 120);
      else if (typeof v === 'number' || typeof v === 'boolean') safeMeta[k] = v;
      else if (v === null) safeMeta[k] = null;
    }

    const attribution =
      options?.utmSource || options?.source
        ? options
        : parseUtmFromSearch(window.location.search);

    const event: GrowthMetricEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      eventName,
      metadata: safeMeta,
      timestamp: new Date().toISOString(),
      sessionId: getOrCreateSessionId(),
      source: options?.source || attribution.source,
      utmSource: options?.utmSource || attribution.utmSource,
      utmMedium: options?.utmMedium || attribution.utmMedium,
      utmCampaign: options?.utmCampaign || attribution.utmCampaign,
      dedupeKey: options?.dedupeKey,
    };

    const events = getAnalyticsEvents();
    events.unshift(event);
    localStorage.setItem(
      STORAGE_KEYS.EVENTS,
      JSON.stringify(events.slice(0, MAX_EVENTS))
    );
    return { recorded: true, event };
  } catch {
    return { recorded: false, reason: 'storage_error' };
  }
}

export function getAnalyticsEvents(): GrowthMetricEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    return safeParseArray(localStorage.getItem(STORAGE_KEYS.EVENTS)).filter(isValidEvent);
  } catch {
    return [];
  }
}

export interface DateRangeFilter {
  from?: string; // ISO date YYYY-MM-DD or full ISO
  to?: string;
}

export function filterEventsByDate(
  events: GrowthMetricEvent[],
  range: DateRangeFilter
): GrowthMetricEvent[] {
  const fromMs = range.from ? new Date(range.from).getTime() : null;
  const toMs = range.to ? new Date(range.to).getTime() : null;
  return events.filter((e) => {
    const t = new Date(e.timestamp).getTime();
    if (Number.isNaN(t)) return false;
    if (fromMs !== null && !Number.isNaN(fromMs) && t < fromMs) return false;
    if (toMs !== null && !Number.isNaN(toMs)) {
      // Inclusive end-of-day if date-only
      const end = range.to && range.to.length <= 10 ? toMs + 86400000 - 1 : toMs;
      if (t > end) return false;
    }
    return true;
  });
}

export interface FunnelCounts {
  landingVisits: number;
  evolutionGenerated: number;
  commitCardDownloaded: number;
  projectSharedOrForked: number;
  workshopRegistered: number;
}

export function computeFunnel(events: GrowthMetricEvent[]): FunnelCounts {
  return {
    landingVisits: events.filter((e) => e.eventName === 'page_view').length,
    evolutionGenerated: events.filter((e) => e.eventName === 'evolution_generated').length,
    commitCardDownloaded: events.filter((e) => e.eventName === 'commit_card_downloaded').length,
    projectSharedOrForked: events.filter(
      (e) => e.eventName === 'share_link_copied' || e.eventName === 'project_forked'
    ).length,
    workshopRegistered: events.filter((e) => e.eventName === 'workshop_registered').length,
  };
}

export interface GrowthSourceBreakdown {
  referral: number;
  direct: number;
  utm: number;
  other: number;
  byUtmSource: Record<string, number>;
}

export function computeGrowthSources(events: GrowthMetricEvent[]): GrowthSourceBreakdown {
  const byUtmSource: Record<string, number> = {};
  let referral = 0;
  let direct = 0;
  let utm = 0;
  let other = 0;

  for (const e of events) {
    if (e.source === 'referral' || e.metadata?.via === 'referral') {
      referral += 1;
    } else if (e.utmSource) {
      utm += 1;
      byUtmSource[e.utmSource] = (byUtmSource[e.utmSource] || 0) + 1;
    } else if (!e.source || e.source === 'direct' || e.source === 'direct_or_referrer') {
      direct += 1;
    } else {
      other += 1;
    }
  }

  return { referral, direct, utm, other, byUtmSource };
}

export interface DailyBucket {
  date: string;
  events: number;
  registrations: number;
}

export function computeDailyTrend(events: GrowthMetricEvent[]): DailyBucket[] {
  const map = new Map<string, DailyBucket>();
  for (const e of events) {
    const d = new Date(e.timestamp);
    if (Number.isNaN(d.getTime())) continue;
    const key = d.toISOString().slice(0, 10);
    const bucket = map.get(key) || { date: key, events: 0, registrations: 0 };
    bucket.events += 1;
    if (e.eventName === 'workshop_registered') bucket.registrations += 1;
    map.set(key, bucket);
  }
  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export interface ReferralPerf {
  referralClicks: number;
  registrationsWithReferral: number;
  qualifiedReferrals: number;
  creditsAwarded: number;
  hasReferralData: boolean;
}

/**
 * Referral performance from analytics events + optional referral records.
 * Does not invent credits when ledger/records are absent.
 */
export function computeReferralPerf(
  events: GrowthMetricEvent[],
  referralRecords: ReferralRecord[] = []
): ReferralPerf {
  const referralClicks = events.filter((e) => e.eventName === 'referral_click').length;
  const registrationsWithReferral = events.filter(
    (e) => e.eventName === 'workshop_registered' && e.metadata?.hasReferralCode === true
  ).length;
  const qualifiedFromEvents = events.filter((e) => e.eventName === 'referral_converted').length;
  const qualifiedFromRecords = referralRecords.filter((r) => r.status === 'qualified').length;
  const qualifiedReferrals = Math.max(qualifiedFromEvents, qualifiedFromRecords);
  const creditsAwarded = referralRecords
    .filter((r) => r.status === 'qualified')
    .reduce((sum, r) => sum + (typeof r.creditsAwarded === 'number' ? r.creditsAwarded : 0), 0);

  return {
    referralClicks,
    registrationsWithReferral,
    qualifiedReferrals,
    creditsAwarded,
    hasReferralData:
      referralClicks > 0 ||
      registrationsWithReferral > 0 ||
      qualifiedReferrals > 0 ||
      referralRecords.length > 0,
  };
}

export function countActualRegistrations(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const regs = safeParseArray(localStorage.getItem('projectpulse_registrations'));
    return regs.filter(
      (r) => r && typeof r === 'object' && typeof (r as WorkshopRegistration).id === 'string'
    ).length;
  } catch {
    return 0;
  }
}

export function getExperiments(): GrowthExperiment[] {
  if (typeof window === 'undefined') return [];
  try {
    const arr = safeParseArray(localStorage.getItem(STORAGE_KEYS.EXPERIMENTS));
    return arr.filter(
      (x): x is GrowthExperiment =>
        !!x &&
        typeof x === 'object' &&
        typeof (x as GrowthExperiment).id === 'string' &&
        typeof (x as GrowthExperiment).hypothesis === 'string' &&
        Array.isArray((x as GrowthExperiment).variants)
    );
  } catch {
    return [];
  }
}

export function saveExperiment(exp: GrowthExperiment): { ok: boolean } {
  if (typeof window === 'undefined') return { ok: false };
  try {
    const list = getExperiments().filter((e) => e.id !== exp.id);
    list.unshift(exp);
    localStorage.setItem(STORAGE_KEYS.EXPERIMENTS, JSON.stringify(list.slice(0, 50)));
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export function deleteExperiment(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getExperiments().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXPERIMENTS, JSON.stringify(list));
  } catch {
    // ignore
  }
}

/** Seed a clearly labeled example experiment for empty consoles (optional UI action). */
export function createExampleExperiment(): GrowthExperiment {
  return {
    id: `exp_${Date.now()}`,
    hypothesis:
      'Showing the workshop CTA above the fold increases registration submissions vs below the fold.',
    metric: 'workshop_registered count (local prototype)',
    status: 'planned',
    createdAt: new Date().toISOString(),
    variants: [
      {
        id: 'var_a',
        name: 'Control — CTA in workshop section',
        description: 'Existing landing layout',
        resultLabel: 'insufficient_data',
        notes: 'No statistically significant result. Prototype only.',
      },
      {
        id: 'var_b',
        name: 'Variant — Hero CTA emphasis',
        description: 'Stronger hero CTA copy',
        observedMetric: undefined,
        resultLabel: 'insufficient_data',
        notes: 'Insufficient evidence for conversion lift claims.',
      },
    ],
  };
}
