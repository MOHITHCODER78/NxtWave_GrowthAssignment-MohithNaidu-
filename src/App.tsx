import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { ActiveTab } from '@/types';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Terminal, 
  Cpu, 
  Share2, 
  X,
  ExternalLink
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [workshopModalOpen, setWorkshopModalOpen] = useState(false);
  const [testButtonLoading, setTestButtonLoading] = useState(false);

  const handleSimulateAction = () => {
    setTestButtonLoading(true);
    setTimeout(() => {
      setTestButtonLoading(false);
    }, 1200);
  };

  return (
    <AppShell
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onOpenWorkshopModal={() => setWorkshopModalOpen(true)}
    >
      {/* Phase 1 Foundation & System Preview Shell */}
      <div className="space-y-12">
        {/* Foundation Hero Banner */}
        <section className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/90 to-[#101014] p-6 sm:p-10 overflow-hidden shadow-card-glow">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="emerald" dot>
                Phase 1 Active
              </Badge>
              <Badge variant="zinc">
                Tailwind CSS v3.4.19
              </Badge>
              <Badge variant="cyan">
                React 19 + TypeScript Strict
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Visual Foundation &{' '}
              <span className="gradient-text-emerald">Design System Shell</span>
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
              Welcome to <span className="text-zinc-200 font-medium">ProjectPulse Lite</span>. 
              The application foundation, dark zinc/slate design tokens, responsive typography, 
              and accessible layout components have been initialized to support the upcoming 
              student project evolution and growth loops.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="glow"
                onClick={() => setWorkshopModalOpen(true)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Inspect Workshop Modal
              </Button>
              <Button
                variant="secondary"
                isLoading={testButtonLoading}
                onClick={handleSimulateAction}
                leftIcon={<Terminal className="w-4 h-4 text-emerald-400" />}
              >
                Test Interactive State
              </Button>
            </div>
          </div>
        </section>

        {/* Design System Primitives Validation Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <span>Design System Primitives & Tokens</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Zinc/Slate palette, restrained Emerald/Cyan accents, accessible button states, and badge tokens.
              </p>
            </div>
            <Badge variant="emerald" size="sm">
              Phase 1 Scope
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Buttons & Interactive Elements */}
            <Card hover glow="emerald">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="emerald" size="sm">Buttons</Badge>
                  <Cpu className="w-4 h-4 text-emerald-400" />
                </div>
                <CardTitle className="text-base pt-2">Button Variants</CardTitle>
                <CardDescription>
                  Custom accessible variants with keyboard focus states and micro-interactions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" size="sm">Primary</Button>
                  <Button variant="secondary" size="sm">Secondary</Button>
                  <Button variant="outline" size="sm">Outline</Button>
                  <Button variant="ghost" size="sm">Ghost</Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button variant="glow" size="sm" rightIcon={<Sparkles className="w-3.5 h-3.5" />}>
                    Glow CTA
                  </Button>
                  <Button variant="secondary" size="sm" disabled>
                    Disabled
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-zinc-500 justify-between">
                <span>Active scale [0.98]</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </CardFooter>
            </Card>

            {/* Card 2: Badges & Track Indicators */}
            <Card hover glow="cyan">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="cyan" size="sm">Tags</Badge>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <CardTitle className="text-base pt-2">Evolution Track Badges</CardTitle>
                <CardDescription>
                  Color-coded tokens for Upgrade, Advanced Transformation, and Differentiate tracks.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="emerald" dot>Upgrade Track</Badge>
                  <Badge variant="cyan" dot>Transform Track</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="purple" dot>Differentiate Track</Badge>
                  <Badge variant="amber" dot>Milestone Lock</Badge>
                  <Badge variant="zinc">Starter Sprint</Badge>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-zinc-500 justify-between">
                <span>Semantic tokens</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              </CardFooter>
            </Card>

            {/* Card 3: Layout & Responsive Breakpoints */}
            <Card hover>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="zinc" size="sm">Layout</Badge>
                  <Share2 className="w-4 h-4 text-zinc-400" />
                </div>
                <CardTitle className="text-base pt-2">Responsive AppShell</CardTitle>
                <CardDescription>
                  Tailwind breakpoints with mobile drawer navigation and fixed announcement header.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-zinc-400">
                <div className="flex items-center justify-between py-1 border-b border-zinc-800">
                  <span>Current Navigation Tab</span>
                  <span className="font-mono text-emerald-400 uppercase font-semibold">
                    {activeTab}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-zinc-800">
                  <span>Background Theme</span>
                  <span className="font-mono text-zinc-300">#09090b (Dark Zinc)</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Mobile Drawer</span>
                  <span className="text-emerald-400 font-medium">Verified Active</span>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-zinc-500 justify-between">
                <span>Zero Layout Shift</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Phase Roadmap Progress Indicator */}
        <section className="p-5 sm:p-6 rounded-xl border border-white/[0.06] bg-zinc-900/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">
                Phase 1 Execution Verification Checklist
              </h3>
              <p className="text-xs text-zinc-400">
                Strict adherence to the 1-phase-at-a-time mandate.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                Phase 1 of 10 Ready
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-zinc-900/80 border border-emerald-500/30 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-zinc-200 block">Project Foundation</span>
                <span className="text-zinc-500">React 19, TypeScript strict, Vite bundler configured.</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/80 border border-emerald-500/30 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-zinc-200 block">Tailwind CSS Verified</span>
                <span className="text-zinc-500">Tailwind v3.4.19 with custom zinc/emerald tokens.</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/80 border border-emerald-500/30 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-zinc-200 block">Responsive AppShell</span>
                <span className="text-zinc-500">Navbar, mobile drawer, announcements, and footer.</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-start gap-2.5 text-zinc-400">
              <span className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
              <div>
                <span className="font-medium text-zinc-300 block">Phase 2: Landing Page</span>
                <span className="text-zinc-500">Awaiting your review before beginning.</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-start gap-2.5 text-zinc-400">
              <span className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
              <div>
                <span className="font-medium text-zinc-300 block">Phase 3: Evolution Engine</span>
                <span className="text-zinc-500">Deterministic 3-track generator.</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-start gap-2.5 text-zinc-400">
              <span className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center text-[10px] shrink-0 mt-0.5">4</span>
              <div>
                <span className="font-medium text-zinc-300 block">Phase 4: Commit Card</span>
                <span className="text-zinc-500">Downloadable PNG card with valid QR code.</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Accessible Workshop Modal Preview (Verification for Action Triggers) */}
      {workshopModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-white/[0.12] bg-[#121215] p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Badge variant="emerald" dot>
                  Confirmed Masterclass
                </Badge>
              </div>
              <button
                onClick={() => setWorkshopModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Build Your First AI Project in 60 Minutes
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Transform ordinary ideas into a tangible AI portfolio project. 
                Static, authentic CTA verified without artificial countdown tickers.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-400">Curriculum</span>
                <span className="font-medium text-emerald-400">4x 15-Minute Sprints</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-400">Access Tier</span>
                <span className="font-medium text-zinc-200">100% Free for Students</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-400">Attribution</span>
                <span className="font-mono text-zinc-300">NxtWave Assignment</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="glow"
                className="w-full"
                onClick={() => {
                  alert('Workshop registration will be fully wired in Phase 6 with referral attribution!');
                  setWorkshopModalOpen(false);
                }}
                rightIcon={<ExternalLink className="w-4 h-4" />}
              >
                Register for Free Workshop
              </Button>
              <Button
                variant="outline"
                onClick={() => setWorkshopModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

