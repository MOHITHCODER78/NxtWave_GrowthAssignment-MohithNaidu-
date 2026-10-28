import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Award, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  Users, 
  Lock, 
  Unlock, 
  Info,
  Clock,
  ArrowRight,
  BookOpen,
  X
} from 'lucide-react';
import { getReferralStats } from '@/utils/referralEngine';
import { generateReferralOnlyUrl } from '@/utils/shareUrl';
import { RewardMilestone } from '@/types';

interface ReferralHubProps {
  onOpenWorkshopModal: () => void;
  onExploreProjects: () => void;
}

export const ReferralHub: React.FC<ReferralHubProps> = ({
  onOpenWorkshopModal,
  onExploreProjects,
}) => {
  const [stats] = useState(() => getReferralStats());
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeBlueprintModal, setActiveBlueprintModal] = useState<RewardMilestone | null>(null);

  const currentUser = stats.profile;
  const referralLink = generateReferralOnlyUrl(currentUser.referralCode);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentUser.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me at the free AI project workshop!',
          text: `Use my invite code ${currentUser.referralCode} to register for the free 60-minute AI project workshop!`,
          url: referralLink,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const qualifyingCount = stats.qualifyingCount;
  const progressPercent = Math.min(100, Math.round((qualifyingCount / 5) * 100));

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header & Vision */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-400">
          <Award className="w-3.5 h-3.5" />
          <span>Referral Attribution & Rewards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Build together. Unlock advanced project blueprints.
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Invite peers who want to build real AI projects. When friends complete qualifying registrations, you both earn Project Credits to unlock curated technical blueprints.
        </p>
      </div>

      {/* 1. PERSONAL REFERRAL CODE CARD */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#121215] p-6 sm:p-8 space-y-6 shadow-card-glow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
              Your Personal Referral Code
            </span>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider">
                {currentUser.referralCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Copy code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              leftIcon={copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copiedLink ? 'Link Copied!' : 'Copy Referral Link'}
            </Button>
            <Button
              variant="glow"
              size="sm"
              onClick={handleNativeShare}
              leftIcon={<Share2 className="w-3.5 h-3.5" />}
            >
              Share with Friends
            </Button>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">
              Overall Milestone Progress: <strong className="text-white">{qualifyingCount} Qualified Referrals</strong>
            </span>
            <span className="font-mono text-emerald-400">{progressPercent}% to Gold Tier</span>
          </div>
          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 font-mono">
            <span>0 Referrals</span>
            <span className={qualifyingCount >= 1 ? 'text-amber-400 font-bold' : ''}>Bronze (1)</span>
            <span className={qualifyingCount >= 3 ? 'text-cyan-400 font-bold' : ''}>Silver (3)</span>
            <span className={qualifyingCount >= 5 ? 'text-emerald-400 font-bold' : ''}>Gold (5)</span>
          </div>
        </div>
      </div>

      {/* 2. THREE MILESTONE TIERS & UNLOCKED BLUEPRINTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Milestone Tiers & Project Blueprints</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Unlocks curated technical blueprints and architectures as friends register.
            </p>
          </div>
          <Badge variant="emerald" size="sm">
            {stats.milestones.filter((m) => m.isUnlocked).length} of 3 Unlocked
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.milestones.map((m) => {
            const tierColors = {
              Bronze: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
              Silver: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400',
              Gold: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
            };

            return (
              <div
                key={m.tier}
                className={`rounded-2xl border p-5 sm:p-6 space-y-4 relative flex flex-col justify-between transition-all ${
                  m.isUnlocked
                    ? 'border-white/[0.12] bg-[#121215] shadow-card-glow'
                    : 'border-zinc-800/80 bg-zinc-950/40 opacity-80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${tierColors[m.tier]}`}>
                      {m.tier} Tier · {m.requiredReferrals} Ref
                    </span>
                    {m.isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <Unlock className="w-3.5 h-3.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    {m.blueprintTitle}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {m.blueprintDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>Reward Value</span>
                    <span className="font-mono text-zinc-300 font-medium">+{m.creditsReward} Credits</span>
                  </div>

                  {m.isUnlocked ? (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full justify-center"
                      onClick={() => setActiveBlueprintModal(m)}
                      leftIcon={<BookOpen className="w-3.5 h-3.5" />}
                    >
                      Read Blueprint
                    </Button>
                  ) : (
                    <div className="text-[11px] text-zinc-500 text-center py-1.5 font-mono">
                      Requires {m.requiredReferrals - qualifyingCount} more qualified registration(s)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. CREDITS BALANCE & TRANSACTION LEDGER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Balance Card */}
        <div className="md:col-span-4 rounded-2xl border border-white/[0.08] bg-[#121215] p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
              Project Credits Balance
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white font-mono">
                {currentUser.credits}
              </span>
              <span className="text-xs text-emerald-400 font-medium">Available Credits</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Earn Rate:</span>
              <span className="text-zinc-200 font-mono">+50 Credits/Registration</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Qualification Rule:</span>
              <span className="text-emerald-400">Verified Workshop Registration</span>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Credits are awarded only when a friend submits a valid workshop registration. Clicks, page visits, and modal opens do not award credits.
          </p>
        </div>

        {/* Right: Transparent Transaction Ledger */}
        <div className="md:col-span-8 rounded-2xl border border-white/[0.08] bg-[#121215] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Project Credits Transaction Ledger</span>
            </h3>
            <span className="text-xs text-zinc-500 font-mono">
              {stats.ledger.length} Transactions
            </span>
          </div>

          {stats.ledger.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-xs text-zinc-400">
                No credit transactions recorded yet.
              </p>
              <p className="text-[11px] text-zinc-500">
                Share your referral link with friends. When they register for the workshop, credit events will log here transparently.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {stats.ledger.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-medium text-zinc-200 block">
                      {entry.reason}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-emerald-400 font-bold block">
                      +{entry.delta}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Bal: {entry.balanceAfter}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. PRIVACY-SAFE REFERRAL ACTIVITY LIST */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#121215] p-6 space-y-4 shadow-card-glow">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Referral Attribution Activity</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Real registrations attributed to your code with privacy-masked identifiers.
            </p>
          </div>
          <Badge variant="cyan" size="sm">
            {stats.records.length} Total Recorded
          </Badge>
        </div>

        {stats.records.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <p className="text-xs text-zinc-400">
              No friends have registered using your code yet.
            </p>
            <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
              Send your referral link to classmates or hostel roommates. Qualifying registrations will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {stats.records.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-mono font-medium text-zinc-200 block">
                    {rec.refereeEmailMasked}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    {rec.refereeCollege}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {rec.status === 'qualified' && (
                    <Badge variant="emerald" size="sm" dot>
                      Qualified (+{rec.creditsAwarded} Credits)
                    </Badge>
                  )}
                  {rec.status === 'pending' && (
                    <Badge variant="amber" size="sm" dot>
                      Pending Verification
                    </Badge>
                  )}
                  {rec.status === 'rejected' && (
                    <div className="text-right">
                      <Badge variant="zinc" size="sm">
                        Rejected
                      </Badge>
                      {rec.rejectionReason && (
                        <span className="text-[10px] text-zinc-500 block mt-0.5">
                          {rec.rejectionReason}
                        </span>
                      )}
                    </div>
                  )}

                  <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                    {new Date(rec.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. NEXT ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="primary"
          onClick={onOpenWorkshopModal}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Register for the free workshop
        </Button>
        <Button
          variant="secondary"
          onClick={onExploreProjects}
          leftIcon={<Sparkles className="w-4 h-4 text-emerald-400" />}
        >
          Explore project directions
        </Button>
      </div>

      {/* 6. HONEST PROTOTYPE NOTICE */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 flex items-start gap-3 text-xs text-zinc-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-zinc-200 block">
            Prototype Storage & Anti-Abuse Transparency
          </span>
          <p className="leading-relaxed">
            Referral records, Project Credits, and attribution are persisted in local browser prototype storage. 
            Client-side checks prevent obvious self-referrals and duplicate emails. Full cryptographic backend verification, server-side PostgreSQL constraints, and device rate-limiting are prepared for Phase 9 database integration.
          </p>
        </div>
      </div>

      {/* BLUEPRINT DETAIL MODAL (When clicking 'Read Blueprint') */}
      {activeBlueprintModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.12] bg-[#121215] p-6 sm:p-7 shadow-2xl space-y-5 text-zinc-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div className="space-y-1">
                <Badge variant="emerald" size="sm" dot>
                  Unlocked Blueprint
                </Badge>
                <h3 className="text-lg font-bold text-white">
                  {activeBlueprintModal.blueprintTitle}
                </h3>
              </div>
              <button
                onClick={() => setActiveBlueprintModal(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {activeBlueprintModal.blueprintDescription}
            </p>

            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Architectural Implementation Guide:
              </span>
              <div className="space-y-2 text-xs">
                {activeBlueprintModal.blueprintContent.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 leading-relaxed">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={() => setActiveBlueprintModal(null)}
              >
                Done Reading
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
