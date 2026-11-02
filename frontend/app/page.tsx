'use client';

import { useEffect, useState } from 'react';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

function DashboardChart({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 100 - ((value - min) / (max - min || 1)) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-32 w-full">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke="#60a5fa"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <polyline points={`0,100 ${points} 100,100`} fill="url(#chartFill)" opacity="0.8" />
    </svg>
  );
}

export default function Home() {
  const [overview, setOverview] = useState<any>(null);
  const [monitoring, setMonitoring] = useState<any>(null);
  const [question, setQuestion] = useState('Which properties have the highest rental arrears?');
  const [aiReply, setAiReply] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [overviewRes, monitoringRes] = await Promise.all([
          fetch(`${apiBase}/api/v1/dashboard/overview`),
          fetch(`${apiBase}/api/v1/monitoring`),
        ]);
        const overviewJson = await overviewRes.json();
        const monitoringJson = await monitoringRes.json();
        setOverview(overviewJson);
        setMonitoring(monitoringJson);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const askAi = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/ai/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const json = await res.json();
      setAiReply(json);
    } catch (error) {
      console.error('AI request failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!overview || !monitoring) {
    return <div className="flex min-h-screen items-center justify-center text-slate-200">Loading enterprise dashboard…</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-2xl shadow-sky-950/30 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-sky-300">Enterprise Intelligence Platform</p>
            <h1 className="mt-2 text-3xl font-bold">Property Operations Intelligence</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200">Northgate Property Group</button>
            <button className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-900">Generate insight</button>
          </div>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Total properties', value: formatNumber(overview.total_properties), delta: '+4.1%', trend: 'up' },
            { label: 'Total rental income', value: overview.total_rental_income, delta: '+8.2%', trend: 'up' },
            { label: 'Outstanding arrears', value: overview.outstanding_arrears, delta: '-2.4%', trend: 'down' },
            { label: 'Occupancy rate', value: overview.occupancy_rate, delta: '+1.3%', trend: 'up' },
          ].map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/20">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{metric.label}</span>
                <span className={metric.trend === 'up' ? 'text-emerald-400' : 'text-amber-400'}>{metric.delta}</span>
              </div>
              <div className="mt-4 text-3xl font-bold">{metric.value}</div>
            </div>
          ))}
        </section>

        <div className="mb-8 grid gap-8 xl:grid-cols-[1.5fr_0.9fr]">
          <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Revenue trends</h2>
              <span className="rounded-full border border-sky-400/60 bg-sky-500/10 px-2 py-1 text-xs text-sky-300">Portfolio performance</span>
            </div>
            <DashboardChart values={overview.revenue_trend} />
            <div className="mt-4 grid grid-cols-8 gap-2 text-center text-xs text-slate-400">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
            <h2 className="mb-4 text-lg font-semibold">AI-generated business insights</h2>
            <ul className="space-y-3 text-sm text-slate-300">
              {overview.alerts.map((alert: string) => (
                <li key={alert} className="rounded-xl border border-slate-700 bg-slate-800/80 p-3">
                  {alert}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <section className="mb-8 grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
            <h3 className="text-lg font-semibold">Data quality</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex justify-between"><span>Schema drift</span><span className="text-emerald-400">Low</span></div>
              <div className="flex justify-between"><span>Duplicate records</span><span className="text-emerald-400">0.2%</span></div>
              <div className="flex justify-between"><span>Freshness SLA</span><span className="text-sky-300">95.4%</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
            <h3 className="text-lg font-semibold">Operational spend</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex justify-between"><span>Maintenance</span><span>$612K</span></div>
              <div className="flex justify-between"><span>Utilities</span><span>$224K</span></div>
              <div className="flex justify-between"><span>Insurance</span><span>$118K</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
            <h3 className="text-lg font-semibold">Monitoring status</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex justify-between"><span>API health</span><span className="text-emerald-400">{monitoring.api_health}%</span></div>
              <div className="flex justify-between"><span>Pipeline health</span><span className="text-amber-300">{monitoring.pipeline_health}%</span></div>
              <div className="flex justify-between"><span>Warehouse util</span><span>{monitoring.warehouse_utilisation}%</span></div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">AI Intelligence Assistant</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-emerald-300">Grounded queries</span>
            </div>
            <div className="flex gap-3">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                className="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 outline-none"
                placeholder="Ask about arrears, occupancy, income, or maintenance"
              />
              <button onClick={askAi} className="rounded-xl bg-sky-500 px-4 py-2 font-semibold text-slate-900">
                Ask
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800/80 p-4">
              {aiReply ? (
                <>
                  <p className="text-sm text-sky-300">Confidence: {aiReply.confidence}</p>
                  <p className="mt-3 text-base text-slate-100">{aiReply.answer}</p>
                  <div className="mt-4 rounded-lg bg-slate-950/70 p-3 font-mono text-xs text-slate-300">
                    {aiReply.sql}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                    {aiReply.references.map((ref: string) => (
                      <span key={ref} className="rounded-full border border-slate-600 bg-slate-700 px-2 py-1">{ref}</span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-slate-400">No query yet. Try asking for arrears or revenue insights.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
            <h2 className="mb-4 text-lg font-semibold">Security and governance</h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-3">
                <div className="text-sm text-slate-400">Governance status</div>
                <div className="mt-2 text-2xl font-bold text-emerald-400">Compliant</div>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-3">
                <div className="text-sm text-slate-400">Policy coverage</div>
                <div className="mt-2 text-2xl font-bold">42 access policies</div>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-3">
                <div className="text-sm text-slate-400">AI access monitoring</div>
                <div className="mt-2 text-lg font-bold text-amber-300">2 alerts needing review</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
