import QRCode from 'qrcode';
import { EvolutionTrack } from '@/types';

export interface SharePayload {
  title: string;
  track: EvolutionTrack;
  authorName?: string;
  domain?: string;
}

export interface ParsedFriendParams {
  isValid: boolean;
  title: string;
  track: EvolutionTrack;
  authorName: string;
  domain: string;
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
 * Encodes only public project parameters (title, track, author display name).
 * Contains ZERO private student PII (no emails, phone numbers, or passwords).
 */
export function generateShareUrl(payload: SharePayload): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://projectpulse.live';
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

  return `${origin}/?${params.toString()}`;
}

/**
 * Safely parses and validates Friend Mode query parameters.
 * Validates track values and sanitizes all string inputs.
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

    const sanitizedTitle = sanitize(rawTitle);
    const sanitizedAuthor = sanitize(rawAuthor) || 'Fellow Student';
    const sanitizedDomain = sanitize(rawDomain) || 'Engineering Project';

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
        isMalformed: true,
      };
    }

    return {
      isValid: true,
      title: sanitizedTitle,
      track,
      authorName: sanitizedAuthor,
      domain: sanitizedDomain,
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
