import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { X, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { WorkshopRegistration } from '@/types';

interface WorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered?: (reg: WorkshopRegistration) => void;
  initialReferralCode?: string;
  initialProjectTitle?: string;
}

export const WorkshopModal: React.FC<WorkshopModalProps> = ({
  isOpen,
  onClose,
  onRegistered,
  initialReferralCode = '',
  initialProjectTitle = '',
}) => {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phone: '',
    college: '',
    yearOfStudy: '3rd Year',
    projectIdea: initialProjectTitle,
    referralCode: initialReferralCode,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.studentName.trim() || !formData.email.trim() || !formData.college.trim()) {
      setErrorMsg('Please complete your name, email, and college name.');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMsg('Please provide a valid college or personal email.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newRegistration: WorkshopRegistration = {
        id: `reg_${Date.now()}`,
        studentName: formData.studentName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        college: formData.college.trim(),
        yearOfStudy: formData.yearOfStudy,
        selectedProjectTrack: formData.projectIdea || 'General AI Exploration',
        referralCodeUsed: formData.referralCode.trim().toUpperCase() || undefined,
        verified: true,
        registeredAt: new Date().toISOString(),
      };

      try {
        const stored = localStorage.getItem('projectpulse_registrations');
        const existing: WorkshopRegistration[] = stored ? JSON.parse(stored) : [];
        existing.push(newRegistration);
        localStorage.setItem('projectpulse_registrations', JSON.stringify(existing));
      } catch {
        // Fallback gracefully
      }

      setIsSubmitting(false);
      setSubmitted(true);
      onRegistered?.(newRegistration);
    }, 700);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="workshop-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#121215] shadow-2xl p-6 sm:p-7 space-y-6 text-zinc-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="emerald" size="sm" dot>
                Free workshop
              </Badge>
              <span className="text-xs text-zinc-400">NxtWave Assignment</span>
            </div>
            <h2 id="workshop-dialog-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {submitted ? 'Registration Confirmed' : 'Build your first AI project in 60 minutes'}
            </h2>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="space-y-6 py-2 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="text-lg font-semibold text-white">
                You're in, {formData.studentName}!
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We've registered your spot for the workshop. A starter checklist has been prepared for your session.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 text-left text-xs space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Attendee</span>
                <span className="text-zinc-200 font-medium">{formData.studentName}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>College</span>
                <span className="text-zinc-200 font-medium">{formData.college}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Workshop Format</span>
                <span className="text-emerald-400 font-medium">4x 15-Minute Sprints</span>
              </div>
              {formData.referralCode && (
                <div className="flex items-center justify-between text-zinc-400 pt-1 border-t border-zinc-800">
                  <span>Referral Code Applied</span>
                  <span className="font-mono text-cyan-400">{formData.referralCode.toUpperCase()}</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button variant="primary" className="w-full" onClick={resetAndClose}>
                Back to projects
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-zinc-400 leading-relaxed">
              No coding tests or prior AI experience needed. We'll start with standard project patterns and show you how to connect models in four straightforward steps.
            </p>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Full name <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Chen"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Email address <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  College / University <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VJTI Mumbai / SRM / NIT"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Year of study
                </label>
                <select
                  value={formData.yearOfStudy}
                  onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Recent Graduate">Recent Graduate</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Project you're working on (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Campus Attendance Tracker or Blog Website"
                value={formData.projectIdea}
                onChange={(e) => setFormData({ ...formData, projectIdea: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Referral code (if a friend invited you)
              </label>
              <input
                type="text"
                placeholder="e.g. PULSE-7842"
                value={formData.referralCode}
                onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 font-mono uppercase focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80"
              />
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1 text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero spam guarantee</span>
              </div>
              <p>Your details are used only to send you the workshop link and starter code files.</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Register for the free workshop
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
