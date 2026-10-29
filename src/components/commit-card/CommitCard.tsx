import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Share2, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { EvolutionPath } from '@/types';
import { generateShareUrl, generateQrCodeDataUrl } from '@/utils/shareUrl';
import { getOrCreateCurrentUserProfile } from '@/utils/referralEngine';
import { trackEvent } from '@/utils/analytics';

interface CommitCardProps {
  originalProjectName: string;
  evolutionPath: EvolutionPath;
  domainName: string;
  onBackToEngine: () => void;
  onRegisterWorkshop: (projectTitle: string, trackTitle: string) => void;
}

export const CommitCard: React.FC<CommitCardProps> = ({
  originalProjectName,
  evolutionPath,
  domainName,
  onBackToEngine,
  onRegisterWorkshop,
}) => {
  const [authorName, setAuthorName] = useState('Student Creator');
  const [pledgeText, setPledgeText] = useState(
    'I commit 60 minutes to build the working foundation of this AI project.'
  );
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const [commitId] = useState(() => `PULSE-${Math.floor(1000 + Math.random() * 9000)}`);

  const cardRef = useRef<HTMLDivElement>(null);
  const currentUser = getOrCreateCurrentUserProfile();

  const shareUrl = generateShareUrl({
    title: evolutionPath.title,
    track: evolutionPath.track,
    authorName: authorName.trim() || undefined,
    domain: domainName,
    referralCode: currentUser.referralCode,
  });

  // Generate verified QR code whenever shareUrl updates
  useEffect(() => {
    let isMounted = true;
    generateQrCodeDataUrl(shareUrl)
      .then((url) => {
        if (isMounted) setQrCodeDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
      });
    return () => {
      isMounted = false;
    };
  }, [shareUrl]);

  // Handle Download PNG
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setExportError('');

    try {
      // Small timeout to ensure fonts and styles are fully rendered
      await new Promise((r) => setTimeout(r, 100));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High-DPI export for crispness
        backgroundColor: '#09090b',
        filter: (node) => {
          // Do not capture buttons or inputs marked with data-export-ignore
          return !(node instanceof HTMLElement && node.dataset.exportIgnore === 'true');
        },
      });

      const downloadLink = document.createElement('a');
      const safeFilename = `${originalProjectName.replace(/[^a-zA-Z0-9]/g, '_')}_CommitCard.png`;
      downloadLink.download = safeFilename;
      downloadLink.href = dataUrl;
      downloadLink.click();
      trackEvent('commit_card_downloaded', {
        track: evolutionPath.track,
        commitId,
      });
    } catch (err) {
      console.error('Download card error:', err);
      setExportError('Unable to export image directly. Please try taking a screenshot or copying the link.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Copy Link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      trackEvent('share_link_copied', { track: evolutionPath.track });
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
      setCopiedLink(false);
    }
  };

  // Handle Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ProjectPulse Lite: ${evolutionPath.title}`,
          text: `Check out my AI project direction: "${evolutionPath.title}" built for the 60-minute workshop!`,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const trackBadgeColors = {
    upgrade: 'emerald' as const,
    transform: 'cyan' as const,
    differentiate: 'purple' as const,
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Navigation Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
        <button
          onClick={onBackToEngine}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Back to Evolution Directions</span>
        </button>

        <div className="flex items-center gap-2">
          <Badge variant="emerald" size="sm" dot>
            Verified Commit Card
          </Badge>
          <span className="text-xs font-mono text-zinc-500">{commitId}</span>
        </div>
      </div>

      {/* Main Grid: Card Customizer + Rendered Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Personalization Controls */}
        <div className="lg:col-span-5 space-y-5 rounded-2xl border border-white/[0.08] bg-[#121215] p-5 sm:p-6 shadow-card-glow">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Personalize Your Card</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Set your builder name and pledge before exporting or sharing.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Builder Display Name</label>
              <input
                type="text"
                maxLength={30}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Commitment Statement</label>
              <textarea
                rows={2}
                maxLength={120}
                value={pledgeText}
                onChange={(e) => setPledgeText(e.target.value)}
                placeholder="I commit 60 minutes to build..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80 leading-relaxed"
              />
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1 text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Public Share Link</span>
              </div>
              <p className="break-all font-mono text-[10px] text-zinc-500">{shareUrl}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={handleDownloadImage}
              isLoading={isExporting}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download Commit Card (PNG)
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center"
                onClick={handleCopyLink}
                leftIcon={
                  copiedLink ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )
                }
              >
                {copiedLink ? 'Link Copied!' : 'Copy Link'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center"
                onClick={handleNativeShare}
                leftIcon={<Share2 className="w-3.5 h-3.5" />}
              >
                Share Card
              </Button>
            </div>

            <Button
              variant="glow"
              size="md"
              className="w-full justify-center pt-2"
              onClick={() => onRegisterWorkshop(originalProjectName, evolutionPath.title)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Register with this Commit
            </Button>

            {exportError && (
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center gap-2 text-[11px] text-red-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{exportError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: The Actual Rendered High-Resolution Commit Card */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div
            ref={cardRef}
            id="project-commit-card"
            className="w-full max-w-md rounded-2xl border border-white/[0.12] bg-[#0c0c0f] p-6 sm:p-7 text-zinc-100 shadow-2xl relative overflow-hidden"
            style={{
              backgroundImage:
                'radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 45%), radial-gradient(circle at 0% 100%, rgba(6, 182, 212, 0.08) 0%, transparent 45%)',
            }}
          >
            {/* Top Card Header */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm tracking-tight text-white">
                      ProjectPulse
                    </span>
                    <span className="text-[9px] font-mono uppercase px-1 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                      Lite
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-medium block">
                    AI Project Evolution Engine
                  </span>
                </div>
              </div>

              <Badge variant={trackBadgeColors[evolutionPath.track]} size="sm" dot>
                {evolutionPath.badgeLabel}
              </Badge>
            </div>

            {/* Project Content Body */}
            <div className="py-5 space-y-4">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
                  Baseline Project: {originalProjectName}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight leading-snug mt-0.5">
                  {evolutionPath.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  {evolutionPath.tagline}
                </p>
              </div>

              {/* Specific AI Capability Pill */}
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1">
                <span className="text-[10px] uppercase font-mono text-zinc-500 font-semibold block">
                  Core AI Capability
                </span>
                <p className="text-xs font-mono text-emerald-300">
                  {evolutionPath.specificAiCapability}
                </p>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5">
                {evolutionPath.recommendedStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/90 text-zinc-300 border border-zinc-700/60 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Student Builder Pledge */}
              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 to-zinc-900/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    Builder Commitment
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {authorName || 'Student Builder'}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 italic leading-relaxed">
                  “{pledgeText}”
                </p>
              </div>
            </div>

            {/* Bottom Card Footer with Verified QR Code */}
            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-4">
              <div className="space-y-1 max-w-[240px]">
                <div className="flex items-center gap-1.5">
                  <Badge variant="emerald" size="sm">
                    Free Workshop
                  </Badge>
                  <span className="text-[10px] text-zinc-500 font-mono">{commitId}</span>
                </div>
                <span className="text-[11px] font-semibold text-zinc-200 block">
                  Build Your First AI Project in 60 Minutes
                </span>
                <span className="text-[10px] text-zinc-500 block">
                  Scan QR code to inspect roadmap or fork this idea.
                </span>
              </div>

              {/* Verified Working QR Code */}
              <div className="shrink-0 p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Scan project QR code"
                    className="w-16 h-16 rounded object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 rounded bg-zinc-900 flex items-center justify-center text-zinc-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <span className="text-[11px] text-zinc-500 mt-3 text-center">
            Crisp 2x PNG rendering • Encodes verified live project link
          </span>
        </div>
      </div>
    </div>
  );
};
