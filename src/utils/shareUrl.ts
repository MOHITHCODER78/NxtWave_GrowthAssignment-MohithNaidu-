import QRCode from 'qrcode';
import { EvolutionTrack } from '@/types';

export interface SharePayload {
  title: string;
  track: EvolutionTrack;
  authorName?: string;
  domain?: string;
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
