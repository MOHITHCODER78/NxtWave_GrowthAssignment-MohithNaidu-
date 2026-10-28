import { 
  ReferralRecord, 
  CreditLedgerEntry, 
  RewardMilestone, 
  StudentProfile, 
  WorkshopRegistration 
} from '@/types';

const STORAGE_KEYS = {
  CURRENT_USER: 'projectpulse_current_user',
  ATTRIBUTION: 'projectpulse_attribution',
  RECORDS: 'projectpulse_referral_records',
  LEDGER: 'projectpulse_credit_ledger',
  PROCESSED_REGS: 'projectpulse_processed_regs',
};

/**
 * In-memory fallback set for idempotency tracking in non-browser environments (e.g., Node.js tests).
 * The browser path persists to localStorage instead.
 */
const _inMemoryProcessedIds = new Set<string>();
const _inMemoryQualifiedEmails = new Map<string, Set<string>>(); // code -> Set<maskedEmail>

/**
 * Masks an email for privacy (e.g., alex.chen@vjti.edu -> al***@vjti.edu)
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return 'st***@college.edu';
  const [local, domain] = email.split('@');
  const visible = local.slice(0, 2);
  return `${visible}***@${domain}`;
}

/**
 * Retrieves or initializes a stable student profile for the current user in local prototype storage.
 */
export function getOrCreateCurrentUserProfile(): StudentProfile {
  if (typeof window === 'undefined') {
    return {
      id: 'student_dev',
      name: 'Alex Chen',
      email: 'alex.chen@campus.edu',
      college: 'VJTI College of Engineering',
      referralCode: 'PULSE-7842',
      credits: 0,
      createdAt: new Date().toISOString(),
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (stored) {
      return JSON.parse(stored);
    }

    const newProfile: StudentProfile = {
      id: `std_${Date.now()}`,
      name: 'Alex Chen',
      email: 'alex.chen@campus.edu',
      college: 'VJTI College of Engineering',
      referralCode: 'PULSE-7842',
      credits: 0,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newProfile));
    return newProfile;
  } catch {
    return {
      id: 'student_dev',
      name: 'Alex Chen',
      email: 'alex.chen@campus.edu',
      college: 'VJTI College of Engineering',
      referralCode: 'PULSE-7842',
      credits: 0,
      createdAt: new Date().toISOString(),
    };
  }
}

/**
 * Captures referral attribution from URL parameters (?ref=CODE).
 * Never overwrites existing valid attribution silently.
 * Prevents self-referral attribution.
 */
export function captureReferralCode(searchString: string): {
  code: string | null;
  status: 'captured' | 'existing_preserved' | 'self_referral_ignored' | 'invalid_format' | 'none';
} {
  if (!searchString) return { code: null, status: 'none' };

  try {
    const cleanSearch = searchString.startsWith('?') ? searchString.slice(1) : searchString;
    const params = new URLSearchParams(cleanSearch);
    const rawRef = params.get('ref');

    if (!rawRef) return { code: null, status: 'none' };

    const cleanCode = rawRef.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (cleanCode.length < 4 || cleanCode.length > 20) {
      return { code: null, status: 'invalid_format' };
    }

    const currentUser = getOrCreateCurrentUserProfile();
    if (cleanCode === currentUser.referralCode) {
      return { code: null, status: 'self_referral_ignored' };
    }

    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(STORAGE_KEYS.ATTRIBUTION);
      if (existing) {
        const parsed = JSON.parse(existing);
        if (parsed.referrerCode && parsed.referrerCode !== cleanCode) {
          // Preserve existing attribution, do not silently overwrite
          return { code: parsed.referrerCode, status: 'existing_preserved' };
        }
      }

      localStorage.setItem(
        STORAGE_KEYS.ATTRIBUTION,
        JSON.stringify({
          referrerCode: cleanCode,
          capturedAt: new Date().toISOString(),
        })
      );
    }

    return { code: cleanCode, status: 'captured' };
  } catch (err) {
    console.error('Failed to capture referral attribution:', err);
    return { code: null, status: 'none' };
  }
}

/**
 * Retrieves the currently captured attribution from local prototype storage.
 */
export function getCapturedAttribution(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ATTRIBUTION);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed.referrerCode || null;
  } catch {
    return null;
  }
}

/**
 * Processes a workshop registration and evaluates referral qualification idempotently.
 * Strictly requires a real registration submission — clicks or modal opens award ZERO credits.
 */
export function processWorkshopRegistration(reg: WorkshopRegistration): {
  success: boolean;
  status: 'qualified' | 'rejected' | 'non_referred' | 'duplicate_ignored';
  rejectionReason?: string;
  creditsAwarded: number;
} {
  const codeUsed = reg.referralCodeUsed?.trim().toUpperCase();
  if (!codeUsed) {
    return { success: true, status: 'non_referred', creditsAwarded: 0 };
  }

  // Anti-Abuse: Self-Referral check runs FIRST — before any environment guard —
  // so it works correctly in both browser and Node.js test environments.
  const currentUser = getOrCreateCurrentUserProfile();
  const isSelfReferral =
    codeUsed === currentUser.referralCode &&
    (reg.email.toLowerCase() === currentUser.email.toLowerCase() ||
      reg.studentName.toLowerCase() === currentUser.name.toLowerCase());

  if (isSelfReferral) {
    const maskedEmailForSelf = maskEmail(reg.email);
    const rejectedRecord: ReferralRecord = {
      id: `ref_rec_${Date.now()}`,
      referrerCode: codeUsed,
      refereeEmailMasked: maskedEmailForSelf,
      refereeCollege: reg.college,
      status: 'rejected',
      rejectionReason: 'Self-referral detected. Referring oneself does not count toward rewards.',
      creditsAwarded: 0,
      timestamp: new Date().toISOString(),
      workshopRegistered: true,
    };

    // Persist if browser; skip localStorage in Node test environment
    if (typeof window !== 'undefined') {
      try {
        const existingRecords: ReferralRecord[] = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.RECORDS) || '[]'
        );
        existingRecords.unshift(rejectedRecord);
        localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(existingRecords));
      } catch {
        // Storage unavailable — rejection result is still returned correctly
      }
    }

    return {
      success: false,
      status: 'rejected',
      rejectionReason: rejectedRecord.rejectionReason,
      creditsAwarded: 0,
    };
  }

  if (typeof window === 'undefined') {
    // Non-browser (Node.js test) environment: use in-memory state for full validation.

    // Idempotency check
    if (_inMemoryProcessedIds.has(reg.id)) {
      return { success: true, status: 'duplicate_ignored', creditsAwarded: 0 };
    }
    _inMemoryProcessedIds.add(reg.id);

    // Duplicate email check
    const maskedForNode = maskEmail(reg.email);
    const qualifiedUnderCode = _inMemoryQualifiedEmails.get(codeUsed) ?? new Set<string>();
    if (qualifiedUnderCode.has(maskedForNode)) {
      return {
        success: false,
        status: 'rejected',
        rejectionReason: 'Duplicate registration detected for this attendee email.',
        creditsAwarded: 0,
      };
    }
    qualifiedUnderCode.add(maskedForNode);
    _inMemoryQualifiedEmails.set(codeUsed, qualifiedUnderCode);

    return { success: true, status: 'qualified', creditsAwarded: 50 };
  }

  try {
    // 1. Idempotency Check: Was this exact registration ID already processed?
    const processedRaw = localStorage.getItem(STORAGE_KEYS.PROCESSED_REGS);
    const processedIds: string[] = processedRaw ? JSON.parse(processedRaw) : [];
    if (processedIds.includes(reg.id)) {
      return { success: true, status: 'duplicate_ignored', creditsAwarded: 0 };
    }

    // Mark as processed
    processedIds.push(reg.id);
    localStorage.setItem(STORAGE_KEYS.PROCESSED_REGS, JSON.stringify(processedIds));

    const existingRecords: ReferralRecord[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.RECORDS) || '[]'
    );
    const existingLedger: CreditLedgerEntry[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.LEDGER) || '[]'
    );

    const maskedEmail = maskEmail(reg.email);

    // 2. Anti-Abuse Check: Duplicate Registration with same email under this code
    const duplicateEmail = existingRecords.find(
      (r) =>
        r.referrerCode === codeUsed &&
        r.refereeEmailMasked === maskedEmail &&
        r.status === 'qualified'
    );

    if (duplicateEmail) {
      const rejectedRecord: ReferralRecord = {
        id: `ref_rec_${Date.now()}`,
        referrerCode: codeUsed,
        refereeEmailMasked: maskedEmail,
        refereeCollege: reg.college,
        status: 'rejected',
        rejectionReason: 'Duplicate registration detected for this attendee email.',
        creditsAwarded: 0,
        timestamp: new Date().toISOString(),
        workshopRegistered: true,
      };

      existingRecords.unshift(rejectedRecord);
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(existingRecords));

      return {
        success: false,
        status: 'rejected',
        rejectionReason: rejectedRecord.rejectionReason,
        creditsAwarded: 0,
      };
    }

    // 4. Valid Qualified Referral
    const CREDITS_PER_REFERRAL = 50;
    const qualifiedRecord: ReferralRecord = {
      id: `ref_rec_${Date.now()}`,
      referrerCode: codeUsed,
      refereeEmailMasked: maskedEmail,
      refereeCollege: reg.college,
      status: 'qualified',
      creditsAwarded: CREDITS_PER_REFERRAL,
      timestamp: new Date().toISOString(),
      workshopRegistered: true,
    };

    existingRecords.unshift(qualifiedRecord);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(existingRecords));

    // Update Project Credits balance & record in ledger
    const newBalance = currentUser.credits + CREDITS_PER_REFERRAL;
    currentUser.credits = newBalance;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));

    const ledgerEntry: CreditLedgerEntry = {
      id: `led_${Date.now()}`,
      delta: CREDITS_PER_REFERRAL,
      balanceAfter: newBalance,
      reason: `Qualifying workshop registration: ${maskedEmail}`,
      timestamp: new Date().toISOString(),
    };

    existingLedger.unshift(ledgerEntry);
    localStorage.setItem(STORAGE_KEYS.LEDGER, JSON.stringify(existingLedger));

    return {
      success: true,
      status: 'qualified',
      creditsAwarded: CREDITS_PER_REFERRAL,
    };
  } catch (err) {
    console.error('Error processing referral registration:', err);
    return { success: false, status: 'rejected', creditsAwarded: 0 };
  }
}

/**
 * Calculates current milestone unlocks based on qualified registrations.
 * Credits unlock actual curated project blueprints with real architectural steps.
 */
export function calculateMilestones(qualifyingCount: number, currentCredits: number): RewardMilestone[] {
  return [
    {
      tier: 'Bronze',
      requiredReferrals: 1,
      creditsReward: 50,
      blueprintTitle: 'Vector Search & Embeddings Blueprint',
      blueprintDescription:
        'Complete architecture for adding semantic search and vector similarity to PostgreSQL with pgvector.',
      blueprintContent: [
        'Step 1: Configure Supabase PostgreSQL with the pgvector extension enabled.',
        'Step 2: Generate 384-dimensional text embeddings using all-MiniLM-L6-v2 via free HuggingFace API.',
        'Step 3: Write the SQL cosine similarity distance query function match_documents().',
        'Step 4: Scaffold the client-side search UI with real-time match confidence badges.',
      ],
      isUnlocked: qualifyingCount >= 1 || currentCredits >= 50,
    },
    {
      tier: 'Silver',
      requiredReferrals: 3,
      creditsReward: 150,
      blueprintTitle: 'Local LLM & On-Device Ollama Blueprint',
      blueprintDescription:
        'Run open-source models completely on your development machine without paying API bills.',
      blueprintContent: [
        'Step 1: Install Ollama runtime and download lightweight Llama-3-8B-Instruct or Mistral-7B.',
        'Step 2: Configure CORS headers in Ollama to allow local browser web app connections.',
        'Step 3: Stream responses into React state using Server-Sent Events (SSE) reader.',
        'Step 4: Build fallback offline indicator ensuring zero network requests leave your machine.',
      ],
      isUnlocked: qualifyingCount >= 3 || currentCredits >= 150,
    },
    {
      tier: 'Gold',
      requiredReferrals: 5,
      creditsReward: 250,
      blueprintTitle: 'System Architecture & Production Deployment Blueprint',
      blueprintDescription:
        'Production rubric covering error resilience, API rate limiting, and technical interview showcase preparation.',
      blueprintContent: [
        'Step 1: Implement circuit breaker patterns to gracefully handle external AI service downtime.',
        'Step 2: Enforce token-bucket client rate limiting to prevent denial-of-service abuse.',
        'Step 3: Configure Docker multistage container build optimizing image size under 80MB.',
        'Step 4: Structure system architecture diagrams and interview talk tracks for campus placements.',
      ],
      isUnlocked: qualifyingCount >= 5 || currentCredits >= 250,
    },
  ];
}

/**
 * Retrieves all referral records, ledger, and current profile statistics.
 */
export function getReferralStats() {
  const profile = getOrCreateCurrentUserProfile();

  if (typeof window === 'undefined') {
    return {
      profile,
      records: [],
      ledger: [],
      qualifyingCount: 0,
      milestones: calculateMilestones(0, 0),
    };
  }

  try {
    const records: ReferralRecord[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.RECORDS) || '[]'
    );
    const ledger: CreditLedgerEntry[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.LEDGER) || '[]'
    );

    const qualifyingCount = records.filter((r) => r.status === 'qualified').length;
    const milestones = calculateMilestones(qualifyingCount, profile.credits);

    return {
      profile,
      records,
      ledger,
      qualifyingCount,
      milestones,
    };
  } catch {
    return {
      profile,
      records: [],
      ledger: [],
      qualifyingCount: 0,
      milestones: calculateMilestones(0, 0),
    };
  }
}

