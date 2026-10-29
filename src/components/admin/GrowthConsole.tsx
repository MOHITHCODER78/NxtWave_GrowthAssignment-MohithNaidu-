import React, { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import {
  BarChart3,
  ShieldAlert,
  Filter,
  FlaskConical,
  Activity,
  Users,
  Target,
  Coins,
  Calendar,
  Info,
  Trash2,
  Plus,
  RefreshCw,
} from 'lucide-react';
import {
  CAMPAIGN_CONFIG,
  getAnalyticsEvents,
  filterEventsByDate,
  computeFunnel,
  computeGrowthSources,
  computeDailyTrend,
  computeReferralPerf,
  countActualRegistrations,
  getExperiments,
  saveExperiment,
  deleteExperiment,
  createExampleExperiment,
  DateRangeFilter,
} from '@/utils/analytics';
import { getReferralStats } from '@/utils/referralEngine';
import { getBackendStatus } from '@/utils/backend';
import { GrowthExperiment, GrowthMetricEvent } from '@/types';

interface GrowthConsoleProps {
  onNavigateTab: (tab: 'landing' | 'evolution' | 'dashboard') => void;
}

function formatTs(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return 'Invalid';
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid';
  }
}

function FunnelBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono text-zinc-200 tabular-nums">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500/80 to-cyan-500/80 transition-all"
          style={{ width: `${max === 0 ? 0 : Math.max(pct, value > 0 ? 4 : 0)}%` }}
          role="presentation"
        />
      </div>
    </div>
  );
}

export const GrowthConsole: React.FC<GrowthConsoleProps> = ({ onNavigateTab }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [tick, setTick] = useState(0);
  const [experiments, setExperiments] = useState<GrowthExperiment[]>([]);
  const [hypo, setHypo] = useState('');
  const [metric, setMetric] = useState('workshop_registered');
  const backendStatus = getBackendStatus();

  const refresh = () => {
    setExperiments(getExperiments());
    setTick((t) => t + 1);
  };

  useEffect(() => {
    refresh();
  }, []);

  const range: DateRangeFilter = useMemo(() => ({ from: from || undefined, to: to || undefined }), [from, to]);

  const events = useMemo(() => {
    void tick;
    return filterEventsByDate(getAnalyticsEvents(), range);
  }, [range, tick]);

  const allEventsUnfiltered = useMemo(() => {
    void tick;
    return getAnalyticsEvents();
  }, [tick]);

  const funnel = useMemo(() => computeFunnel(events), [events]);
  const sources = useMemo(() => computeGrowthSources(events), [events]);
  const daily = useMemo(() => computeDailyTrend(events), [events]);
  const regs = useMemo(() => {
    void tick;
    return countActualRegistrations();
  }, [tick]);

  const referralPerf = useMemo(() => {
    void tick;
    let records: ReturnType<typeof getReferralStats>['records'] = [];
    try {
      records = getReferralStats().records;
    } catch {
      records = [];
    }
    return computeReferralPerf(events, records);
  }, [events, tick]);

  const maxFunnel = Math.max(
    funnel.landingVisits,
    funnel.evolutionGenerated,
    funnel.commitCardDownloaded,
    funnel.projectSharedOrForked,
    funnel.workshopRegistered,
    0
  );

  const maxDaily = Math.max(...daily.map((d) => d.events), 0);

  const handleAddExperiment = () => {
    if (!hypo.trim()) return;
    const exp: GrowthExperiment = {
      id: `exp_${Date.now()}`,
      hypothesis: hypo.trim().slice(0, 280),
      metric: metric.trim().slice(0, 80),
      status: 'planned',
      createdAt: new Date().toISOString(),
      variants: [
        {
          id: 'control',
          name: 'Control',
          description: 'Current experience',
          resultLabel: 'insufficient_data',
          notes: 'No conversion lift claimed — insufficient evidence.',
        },
        {
          id: 'variant',
          name: 'Variant',
          description: 'Proposed change',
          resultLabel: 'manual',
          notes: 'Any observed numbers below are manually entered or simulated.',
        },
      ],
    };
    saveExperiment(exp);
    setHypo('');
    refresh();
  };

  const handleSeedExample = () => {
    saveExperiment(createExampleExperiment());
    refresh();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in-50 duration-200">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Growth Intelligence Console</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Campaign analytics
            </h1>
            <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
              Funnel and attribution from recorded prototype events only. Empty ranges show empty
              charts — never fabricated KPIs.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh data
          </Button>
        </div>
      </div>

      {/* Prototype access notice */}
      <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-xs text-amber-100/90">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-200">Prototype mode — not authenticated admin access</p>
          <p className="leading-relaxed text-amber-100/80">
            No trusted server authentication exists yet. This console is visible in the client for
            review only. Real admin authorization and row-level security ship in Phase 9. Treat all
            numbers as local browser prototype telemetry.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="flex items-center justify-between gap-3 mb-2">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Backend status</p>
          <span className={`rounded-full border px-2 py-1 text-[10px] font-medium ${backendStatus.isSecurelyConfigured ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-300'}`}>
            {backendStatus.mode}
          </span>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">{backendStatus.warning}</p>
        {!backendStatus.isSecurelyConfigured && (
          <p className="mt-3 text-xs text-zinc-500">
            Environment keys are not configured. Use the example file at .env.example to add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY only when a real backend is ready.
          </p>
        )}
      </div>

      {/* Date filters */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex items-center gap-2 text-zinc-400 text-sm shrink-0 pb-1">
            <Filter className="w-4 h-4" />
            <span>Date range</span>
          </div>
          <label className="flex flex-col gap-1 text-xs text-zinc-500 flex-1">
            From
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-zinc-500 flex-1">
            To
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFrom('');
              setTo('');
            }}
          >
            Clear
          </Button>
        </CardContent>
      </Card>

      {/* 1. Campaign overview */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Campaign overview</h2>
        <p className="text-xs text-zinc-500 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          Target and budget are campaign configuration goals — not proof of results.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatTile
            icon={<Target className="w-4 h-4 text-emerald-400" />}
            label="Target registrations"
            value={String(CAMPAIGN_CONFIG.targetRegistrations)}
            hint="Goal (config)"
          />
          <StatTile
            icon={<Coins className="w-4 h-4 text-cyan-400" />}
            label="Budget"
            value={`₹${CAMPAIGN_CONFIG.budgetInr.toLocaleString('en-IN')}`}
            hint="Goal (config)"
          />
          <StatTile
            icon={<Calendar className="w-4 h-4 text-purple-300" />}
            label="Campaign length"
            value={`${CAMPAIGN_CONFIG.durationDays} days`}
            hint="Goal (config)"
          />
          <StatTile
            icon={<Users className="w-4 h-4 text-amber-400" />}
            label="Recorded registrations"
            value={String(regs)}
            hint="Local prototype forms"
          />
        </div>
      </section>

      {/* 2. Funnel */}
      <section className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Funnel analytics</CardTitle>
            <CardDescription>
              Distinct event types only — views ≠ clicks ≠ registrations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {maxFunnel === 0 ? (
              <EmptyChart
                message="No funnel events in this range."
                action={() => onNavigateTab('landing')}
                actionLabel="Open landing"
              />
            ) : (
              <>
                <FunnelBar label="Landing visits (page_view)" value={funnel.landingVisits} max={maxFunnel} />
                <FunnelBar
                  label="Evolution generated"
                  value={funnel.evolutionGenerated}
                  max={maxFunnel}
                />
                <FunnelBar
                  label="Commit Card downloaded"
                  value={funnel.commitCardDownloaded}
                  max={maxFunnel}
                />
                <FunnelBar
                  label="Shared / forked"
                  value={funnel.projectSharedOrForked}
                  max={maxFunnel}
                />
                <FunnelBar
                  label="Workshop registration submitted"
                  value={funnel.workshopRegistered}
                  max={maxFunnel}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* 3. Growth sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Growth sources</CardTitle>
            <CardDescription>Attribution from event source / UTM fields when present.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {events.length === 0 ? (
              <EmptyChart message="No events to attribute in this range." />
            ) : (
              <>
                <SourceRow label="Referral" value={sources.referral} />
                <SourceRow label="Direct" value={sources.direct} />
                <SourceRow label="UTM campaigns" value={sources.utm} />
                <SourceRow label="Other" value={sources.other} />
                {Object.keys(sources.byUtmSource).length > 0 && (
                  <div className="pt-2 border-t border-zinc-800 space-y-1">
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500">UTM sources</p>
                    {Object.entries(sources.byUtmSource).map(([k, v]) => (
                      <SourceRow key={k} label={k} value={v} />
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </section>

      {/* 4. Referral performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Referral performance</CardTitle>
          <CardDescription>
            Counts only where analytics events or referral records exist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!referralPerf.hasReferralData ? (
            <EmptyChart message="No referral clicks, registrations, or qualified records yet." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MiniStat label="Referral clicks" value={referralPerf.referralClicks} />
              <MiniStat
                label="Regs with referral"
                value={referralPerf.registrationsWithReferral}
              />
              <MiniStat label="Qualified" value={referralPerf.qualifiedReferrals} />
              <MiniStat label="Credits awarded" value={referralPerf.creditsAwarded} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. Daily trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily trend</CardTitle>
          <CardDescription>Events and registrations by real event timestamps.</CardDescription>
        </CardHeader>
        <CardContent>
          {daily.length === 0 ? (
            <EmptyChart message="No dated events in this filter range." />
          ) : (
            <div className="flex items-end gap-1.5 sm:gap-2 h-36 overflow-x-auto pb-1">
              {daily.map((d) => {
                const h = maxDaily > 0 ? Math.max(4, Math.round((d.events / maxDaily) * 100)) : 0;
                return (
                  <div
                    key={d.date}
                    className="flex flex-col items-center gap-1 min-w-[36px] flex-1"
                    title={`${d.date}: ${d.events} events, ${d.registrations} regs`}
                  >
                    <span className="text-[10px] font-mono text-zinc-500">{d.events}</span>
                    <div
                      className="w-full max-w-[28px] rounded-t bg-emerald-500/70"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[9px] text-zinc-600 font-mono">
                      {d.date.slice(5)}
                    </span>
                    {d.registrations > 0 && (
                      <span className="text-[9px] text-cyan-400">{d.registrations}r</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 6. Experiment tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-purple-300" />
            Experiment tracker
          </CardTitle>
          <CardDescription>
            Hypotheses and variants are manually tracked. Never claim statistical significance
            without sufficient evidence.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={hypo}
              onChange={(e) => setHypo(e.target.value)}
              placeholder="Hypothesis…"
              className="flex-1 rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              aria-label="Experiment hypothesis"
            />
            <input
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              placeholder="Metric"
              className="sm:w-48 rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              aria-label="Primary metric"
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={handleAddExperiment}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add
            </Button>
          </div>

          {experiments.length === 0 ? (
            <div className="space-y-3">
              <EmptyChart message="No experiments defined yet." />
              <Button size="sm" variant="outline" onClick={handleSeedExample}>
                Add labeled example (insufficient data)
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {experiments.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-zinc-100">{exp.hypothesis}</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Metric: {exp.metric} · {exp.status}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        deleteExperiment(exp.id);
                        refresh();
                      }}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-zinc-800"
                      aria-label="Delete experiment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {exp.variants.map((v) => (
                      <div
                        key={v.id}
                        className="text-xs rounded-lg border border-zinc-800 px-2.5 py-2 max-w-xs"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-medium text-zinc-200">{v.name}</span>
                          <Badge
                            variant={
                              v.resultLabel === 'insufficient_data' ? 'amber' : 'zinc'
                            }
                            size="sm"
                          >
                            {v.resultLabel}
                          </Badge>
                        </div>
                        <p className="text-zinc-500">{v.description}</p>
                        {typeof v.observedMetric === 'number' && (
                          <p className="text-zinc-400 mt-1 font-mono">
                            Observed (manual/sim): {v.observedMetric}
                          </p>
                        )}
                        {v.notes && <p className="text-zinc-600 mt-1">{v.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 7. Recent events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Recent events
          </CardTitle>
          <CardDescription>
            Showing {Math.min(events.length, 40)} of {events.length} filtered ·{' '}
            {allEventsUnfiltered.length} total stored
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <EmptyChart message="No analytics events recorded yet for this filter." />
          ) : (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-left text-xs min-w-[520px]">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800">
                    <th className="py-2 pr-3 font-medium">Time</th>
                    <th className="py-2 pr-3 font-medium">Event</th>
                    <th className="py-2 pr-3 font-medium">Source</th>
                    <th className="py-2 font-medium">Metadata</th>
                  </tr>
                </thead>
                <tbody>
                  {events.slice(0, 40).map((e) => (
                    <EventRow key={e.id} event={e} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

function StatTile({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-4">
      <div className="flex items-center gap-2 text-zinc-500 mb-2">
        {icon}
        <span className="text-[11px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-bold text-white tabular-nums">{value}</p>
      <p className="text-[11px] text-zinc-500 mt-1">{hint}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
      <p className="text-[11px] text-zinc-500">{label}</p>
      <p className="text-lg font-semibold text-white tabular-nums mt-0.5">{value}</p>
    </div>
  );
}

function SourceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-zinc-400">{label}</span>
      <span className="font-mono text-zinc-200 tabular-nums">{value}</span>
    </div>
  );
}

function EmptyChart({
  message,
  action,
  actionLabel,
}: {
  message: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-700 px-4 py-8 text-center space-y-3">
      <p className="text-sm text-zinc-500">{message}</p>
      {action && actionLabel && (
        <Button size="sm" variant="outline" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

function EventRow({ event }: { event: GrowthMetricEvent }) {
  const meta = Object.entries(event.metadata || {})
    .map(([k, v]) => `${k}=${String(v)}`)
    .join(', ')
    .slice(0, 80);
  return (
    <tr className="border-b border-zinc-800/60 text-zinc-300">
      <td className="py-2 pr-3 whitespace-nowrap text-zinc-500">{formatTs(event.timestamp)}</td>
      <td className="py-2 pr-3">
        <Badge variant="zinc" size="sm">
          {event.eventName}
        </Badge>
      </td>
      <td className="py-2 pr-3 font-mono text-[11px]">
        {event.source || '—'}
        {event.utmSource ? ` · ${event.utmSource}` : ''}
      </td>
      <td className="py-2 text-zinc-500 truncate max-w-[200px]" title={meta}>
        {meta || '—'}
      </td>
    </tr>
  );
}
