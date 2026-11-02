'use client';

import { useEffect, useMemo, useState } from 'react';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

type ViewKey = 'overview' | 'portfolio' | 'finance' | 'operations' | 'governance' | 'insights';

const navigation: { key: ViewKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'finance', label: 'Finance' },
  { key: 'operations', label: 'Operations' },
  { key: 'governance', label: 'Governance' },
  { key: 'insights', label: 'AI Insights' },
];

const defaultOverview = {
  organisation: 'Northgate Property Group',
  date_range: 'Q3 2026',
  total_properties: 248,
  total_rental_income: '$4.82M',
  outstanding_arrears: '$248.6K',
  occupancy_rate: '94.8%',
  maintenance_expenditure: '$612K',
  alerts: [
    'Three high-value units require arrears review within 7 days.',
    'One portfolio is trending below occupancy target in the North Shore cluster.',
    'Two maintenance suppliers exceeded budget thresholds last month.',
  ],
  revenue_trend: [78, 82, 88, 94, 96, 101, 109, 118],
};

const defaultMonitoring = {
  api_health: 99.8,
  service_availability: 99.7,
  pipeline_health: 97.2,
  warehouse_utilisation: 68,
  error_rate: 0.8,
  latency_ms: 412,
};

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

function CompanyLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-slate-900 shadow-sm ring-1 ring-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-sky-700 opacity-95" />
        <svg viewBox="0 0 64 64" className="relative z-10 h-7 w-7" aria-label="Panda property company logo" role="img">
          <circle cx="32" cy="32" r="26" fill="#f8fafc" opacity="0.96" />
          <circle cx="22" cy="24" r="7" fill="#111827" />
          <circle cx="42" cy="24" r="7" fill="#111827" />
          <circle cx="18.5" cy="21.5" r="2" fill="#f8fafc" />
          <circle cx="45.5" cy="21.5" r="2" fill="#f8fafc" />
          <path d="M20 38c4 6 20 6 24 0" fill="none" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
          <path d="M12 14c5-6 18-7 22-7 8 0 18 4 22 10-1-1-4-2-6-2-3 0-4 1-5 3-4-2-7-3-11-3-6 0-13 2-17 6-3 3-5 5-7 8-1-2-2-4-3-6Z" fill="#e2e8f0" opacity="0.8" />
          <path d="M24 12c2-4 7-7 14-7 5 0 9 2 12 5-3 0-7 2-9 4-2-1-5-2-9-2-3 0-6 1-8 3Z" fill="#fff" opacity="0.55" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Northgate</div>
        <div className="text-sm font-semibold text-slate-800">Property Group</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [overview, setOverview] = useState<any>(defaultOverview);
  const [monitoring, setMonitoring] = useState<any>(defaultMonitoring);
  const [question, setQuestion] = useState('Which properties have the highest rental arrears?');
  const [aiReply, setAiReply] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<ViewKey>('overview');

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [overviewRes, monitoringRes] = await Promise.all([
          fetch(`${apiBase}/api/v1/dashboard/overview`),
          fetch(`${apiBase}/api/v1/monitoring`),
        ]);

        if (!overviewRes.ok || !monitoringRes.ok) {
          throw new Error('Dashboard API returned an error response');
        }

        const overviewJson = await overviewRes.json();
        const monitoringJson = await monitoringRes.json();
        setOverview(overviewJson);
        setMonitoring(monitoringJson);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
        setOverview({
          organisation: 'Northgate Property Group',
          date_range: 'Q3 2026',
          total_properties: 248,
          total_rental_income: '$4.82M',
          outstanding_arrears: '$248.6K',
          occupancy_rate: '94.8%',
          maintenance_expenditure: '$612K',
          alerts: [
            'Three high-value units require arrears review within 7 days.',
            'One portfolio is trending below occupancy target in the North Shore cluster.',
            'Two maintenance suppliers exceeded budget thresholds last month.',
          ],
          revenue_trend: [78, 82, 88, 94, 96, 101, 109, 118],
        });
        setMonitoring({
          api_health: 99.8,
          service_availability: 99.7,
          pipeline_health: 97.2,
          warehouse_utilisation: 68,
          error_rate: 0.8,
          latency_ms: 412,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const askAi = async (customQuestion = question) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/ai/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: customQuestion }),
      });
      const json = await res.json();
      setAiReply(json);
    } catch (error) {
      console.error('AI request failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsight = () => {
    setQuestion('Summarise the portfolio health, arrears risk, and the top actions for executive review.');
    void askAi('Summarise the portfolio health, arrears risk, and the top actions for executive review.');
    setActiveView('insights');
  };

  const cityPortfolios = useMemo(
    () => [
      { city: 'London', name: 'Canary Wharf Residences', occupancy: '96.4%', revenue: '$1.4M', status: 'Strong demand' },
      { city: 'Dubai', name: 'Marina Heights', occupancy: '92.8%', revenue: '$1.1M', status: 'Rising occupancy' },
      { city: 'Toronto', name: 'Harbour Point Living', occupancy: '94.7%', revenue: '$980K', status: 'Stable income' },
      { city: 'Singapore', name: 'Orchard Core Suites', occupancy: '97.1%', revenue: '$1.7M', status: 'Top performer' },
    ],
    [],
  );

  const portfolioWidgets = useMemo(
    () => [
      { label: 'Portfolio count', value: '12 active portfolios', tone: 'sky' },
      { label: 'Tenant population', value: '8,420 residents', tone: 'emerald' },
      { label: 'High-risk assets', value: '6 watchlist properties', tone: 'amber' },
      { label: 'Leasing velocity', value: '4.8% MoM', tone: 'violet' },
    ],
    [],
  );

  const financeWidgets = useMemo(
    () => [
      { label: 'Gross rent', value: '$4.82M', tone: 'emerald' },
      { label: 'Collections', value: '$1.33M', tone: 'sky' },
      { label: 'Cash outstanding', value: '$248.6K', tone: 'amber' },
      { label: 'Forecast variance', value: '+3.1%', tone: 'violet' },
    ],
    [],
  );

  const opsWidgets = useMemo(
    () => [
      { label: 'Open work orders', value: '37', tone: 'amber' },
      { label: 'Avg resolution', value: '41 hrs', tone: 'sky' },
      { label: 'Critical incidents', value: '4', tone: 'rose' },
      { label: 'Vendor SLA', value: '92.6%', tone: 'emerald' },
    ],
    [],
  );

  const governanceWidgets = useMemo(
    () => [
      { label: 'Access policies', value: '42', tone: 'sky' },
      { label: 'AIOps reviews', value: '2 alerts', tone: 'amber' },
      { label: 'Audit events', value: '14,920', tone: 'emerald' },
      { label: 'Risk posture', value: 'Compliant', tone: 'violet' },
    ],
    [],
  );

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex max-w-[1600px] gap-6 p-4 xl:p-6">
        <aside className="hidden w-[260px] shrink-0 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm xl:block">
          <div className="mb-8">
            <CompanyLogo />
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveView(item.key)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  activeView === item.key
                    ? 'bg-sky-100 text-sky-700 ring-1 ring-sky-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{item.label}</span>
                <span className="h-2 w-2 rounded-full bg-current opacity-70" />
              </button>
            ))}
          </nav>

        </aside>

        <div className="flex-1">
          <header className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-600">Property Operations Intelligence</p>
              </div>

              <div className="flex items-center gap-3">
                <button className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                  Northgate Property Group
                </button>
                <button
                  onClick={generateInsight}
                  className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
                >
                  Generate insight
                </button>
              </div>
            </div>
          </header>

          <div className="xl:hidden">
            <nav className="mb-8 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
              {navigation.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveView(item.key)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                    activeView === item.key
                      ? 'bg-sky-100 text-sky-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {activeView === 'overview' && (
            <>
              <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Total properties', value: formatNumber(overview.total_properties), delta: '+4.1%', trend: 'up' },
                  { label: 'Total rental income', value: overview.total_rental_income, delta: '+8.2%', trend: 'up' },
                  { label: 'Outstanding arrears', value: overview.outstanding_arrears, delta: '-2.4%', trend: 'down' },
                  { label: 'Occupancy rate', value: overview.occupancy_rate, delta: '+1.3%', trend: 'up' },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{metric.label}</span>
                      <span className={metric.trend === 'up' ? 'text-emerald-600' : 'text-amber-600'}>{metric.delta}</span>
                    </div>
                    <div className="mt-4 text-3xl font-bold text-slate-900">{metric.value}</div>
                  </div>
                ))}
              </section>

              <section className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Portfolio by city</h2>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600">Global portfolio mix</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {cityPortfolios.map((portfolio) => (
                    <div key={portfolio.city} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">{portfolio.city}</span>
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">{portfolio.status}</span>
                      </div>
                      <h3 className="text-base font-semibold text-slate-900">{portfolio.name}</h3>
                      <div className="mt-4 space-y-2 text-sm text-slate-600">
                        <div className="flex items-center justify-between">
                          <span>Occupancy</span>
                          <span className="font-semibold text-slate-900">{portfolio.occupancy}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Revenue</span>
                          <span className="font-semibold text-slate-900">{portfolio.revenue}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="mb-8 grid gap-8 xl:grid-cols-[1.5fr_0.9fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Revenue trends</h2>
                    <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-1 text-xs text-sky-700">Portfolio performance</span>
                  </div>
                  <DashboardChart values={overview.revenue_trend} />
                  <div className="mt-4 grid grid-cols-8 gap-2 text-center text-xs text-slate-500">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month) => (
                      <span key={month}>{month}</span>
                    ))}
                  </div>
                </section>

                <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-slate-900">AI-generated business insights</h2>
                  <ul className="space-y-3 text-sm text-slate-600">
                    {overview.alerts.map((alert: string) => (
                      <li key={alert} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        {alert}
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>

              <section className="mb-8 grid gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Data quality</h3>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div className="flex justify-between"><span>Schema drift</span><span className="text-emerald-600">Low</span></div>
                    <div className="flex justify-between"><span>Duplicate records</span><span className="text-emerald-600">0.2%</span></div>
                    <div className="flex justify-between"><span>Freshness SLA</span><span className="text-sky-600">95.4%</span></div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Operational spend</h3>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div className="flex justify-between"><span>Maintenance</span><span>$612K</span></div>
                    <div className="flex justify-between"><span>Utilities</span><span>$224K</span></div>
                    <div className="flex justify-between"><span>Insurance</span><span>$118K</span></div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Monitoring status</h3>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div className="flex justify-between"><span>API health</span><span className="text-emerald-600">{monitoring.api_health}%</span></div>
                    <div className="flex justify-between"><span>Pipeline health</span><span className="text-amber-600">{monitoring.pipeline_health}%</span></div>
                    <div className="flex justify-between"><span>Warehouse util</span><span>{monitoring.warehouse_utilisation}%</span></div>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeView === 'portfolio' && (
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {portfolioWidgets.map((widget) => (
                <div key={widget.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">{widget.label}</p>
                  <p className="mt-4 text-2xl font-bold text-slate-900">{widget.value}</p>
                </div>
              ))}
            </section>
          )}

          {activeView === 'finance' && (
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {financeWidgets.map((widget) => (
                <div key={widget.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">{widget.label}</p>
                  <p className="mt-4 text-2xl font-bold text-slate-900">{widget.value}</p>
                </div>
              ))}
            </section>
          )}

          {activeView === 'operations' && (
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {opsWidgets.map((widget) => (
                <div key={widget.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">{widget.label}</p>
                  <p className="mt-4 text-2xl font-bold text-slate-900">{widget.value}</p>
                </div>
              ))}
            </section>
          )}

          {activeView === 'governance' && (
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {governanceWidgets.map((widget) => (
                <div key={widget.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">{widget.label}</p>
                  <p className="mt-4 text-2xl font-bold text-slate-900">{widget.value}</p>
                </div>
              ))}
            </section>
          )}

          {activeView !== 'overview' && activeView !== 'insights' && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
              This section is ready for live operational data, workflow metrics, and drill-down views when the Snowflake connection is activated.
            </div>
          )}

          {activeView === 'insights' && (
            <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">AI Intelligence Assistant</h2>
                  <span className="text-xs uppercase tracking-[0.2em] text-emerald-600">Grounded queries</span>
                </div>
                <div className="flex gap-3">
                  <input
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none"
                    placeholder="Ask about arrears, occupancy, income, or maintenance"
                  />
                  <button onClick={() => void askAi()} className="rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white">
                    Ask
                  </button>
                </div>

                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  {aiReply ? (
                    <>
                      <p className="text-sm text-sky-700">Confidence: {aiReply.confidence}</p>
                      <p className="mt-3 text-base text-slate-800">{aiReply.answer}</p>
                      <div className="mt-4 rounded-lg bg-white p-3 font-mono text-xs text-slate-700">
                        {aiReply.sql}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                        {aiReply.references.map((ref: string) => (
                          <span key={ref} className="rounded-full border border-slate-200 bg-white px-2 py-1">{ref}</span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-500">No query yet. Try asking for arrears or revenue insights.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Security and governance</h2>
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-sm text-slate-500">Governance status</div>
                    <div className="mt-2 text-2xl font-bold text-emerald-600">Compliant</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-sm text-slate-500">Policy coverage</div>
                    <div className="mt-2 text-2xl font-bold text-slate-900">42 access policies</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-sm text-slate-500">AI access monitoring</div>
                    <div className="mt-2 text-lg font-bold text-amber-600">2 alerts needing review</div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
