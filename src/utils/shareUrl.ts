import QRCode from 'qrcode';
import { EvolutionTrack } from '@/types';

export interface SharePayload {
  title: string;
  track: EvolutionTrack;
  authorName?: string;
  domain?: string;
  referralCode?: string;
}

export interface ParsedFriendParams {
  isValid: boolean;
  title: string;
  track: EvolutionTrack;
  authorName: string;
  domain: string;
  referralCode?: string;
  isMalformed?: boolean;
}

/**
 * Sanitizes input strings by trimming and stripping HTML/script characters.
 */
function sanitize(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>"';\\()]/g, '')
    .trim()
    .slice(0, 120);
}

/**
 * Generates a privacy-safe canonical project share URL.
 * Combines Friend Mode and Referral attribution parameters seamlessly.
 * Encodes only public project parameters. Contains ZERO private student PII.
 */
export function generateShareUrl(payload: SharePayload): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://localhost';
  const params = new URLSearchParams();
  
  params.set('view', 'friend');
  params.set('title', payload.title);
  params.set('track', payload.track);
  if (payload.authorName && payload.authorName.trim()) {
    params.set('by', payload.authorName.trim());
  }
  if (payload.domain) {
    params.set('domain', payload.domain);
  }
  if (payload.referralCode && payload.referralCode.trim()) {
    params.set('ref', payload.referralCode.trim().toUpperCase());
  }

  return `${origin}/?${params.toString()}`;
}

/**
 * Generates a direct personal referral link without Friend Mode parameters.
 */
export function generateReferralOnlyUrl(referralCode: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://localhost';
  return `${origin}/?ref=${encodeURIComponent(referralCode.trim().toUpperCase())}`;
}

/**
 * Safely parses and validates Friend Mode query parameters, including optional referral attribution.
 */
export function parseFriendUrlParams(searchString: string): ParsedFriendParams | null {
  if (!searchString || !searchString.includes('view=friend')) {
    return null;
  }

  try {
    const cleanSearch = searchString.startsWith('?') ? searchString.slice(1) : searchString;
    const params = new URLSearchParams(cleanSearch);

    const rawTitle = params.get('title');
    const rawTrack = params.get('track');
    const rawAuthor = params.get('by');
    const rawDomain = params.get('domain');
    const rawRef = params.get('ref');

    const sanitizedTitle = sanitize(rawTitle);
    const sanitizedAuthor = sanitize(rawAuthor) || 'Fellow Student';
    const sanitizedDomain = sanitize(rawDomain) || 'Engineering Project';
    const sanitizedRef = rawRef ? sanitize(rawRef).toUpperCase() : undefined;

    // Validate track strictly
    let track: EvolutionTrack = 'upgrade';
    let isMalformed = false;

    if (rawTrack === 'upgrade' || rawTrack === 'transform' || rawTrack === 'differentiate') {
      track = rawTrack;
    } else if (rawTrack) {
      isMalformed = true;
    }

    if (!sanitizedTitle) {
      return {
        isValid: false,
        title: 'Untitled Project Idea',
        track: 'upgrade',
        authorName: sanitizedAuthor,
        domain: sanitizedDomain,
        referralCode: sanitizedRef,
        isMalformed: true,
      };
    }

    return {
      isValid: true,
      title: sanitizedTitle,
      track,
      authorName: sanitizedAuthor,
      domain: sanitizedDomain,
      referralCode: sanitizedRef,
      isMalformed,
    };
  } catch (err) {
    console.error('Error parsing friend URL parameters:', err);
    return null;
  }
}

/**
 * Generates a valid high-resolution QR code data URL encoding the given target URL.
 * Guarantees a valid, scannable QR code with clean quiet-zone margins.
 */
export async function generateQrCodeDataUrl(targetUrl: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(targetUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: '#ffffff',
        light: '#09090b',
      },
      errorCorrectionLevel: 'M',
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR code data URL:', err);
    throw err;
  }
}
