'use client';

import { useEffect, useMemo, useState } from 'react';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

type ViewKey =
  | 'overview'
  | 'portfolio'
  | 'sales'
  | 'finance'
  | 'operations'
  | 'governance'
  | 'insights'
  | 'integrations'
  | 'settings';

const navigation: { key: ViewKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'sales', label: 'Sales' },
  { key: 'finance', label: 'Finance' },
  { key: 'operations', label: 'Operations' },
  { key: 'governance', label: 'Governance' },
  { key: 'insights', label: 'AI Assistant' },
  { key: 'integrations', label: 'Integrations' },
  { key: 'settings', label: 'Settings' },
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

const defaultSales = {
  organisation: 'Northgate Property Group',
  period: 'Q3 2026',
  pipeline_value: '$8.4M',
  closed_won_mtd: '$1.26M',
  win_rate: '32.4%',
  avg_deal_cycle_days: 46,
  active_deals: 38,
  quarter_target: '$3.1M',
  target_attainment: '81%',
  metrics: [
    { label: 'Pipeline value', value: '$8.4M', delta: '+12.6%', trend: 'up' },
    { label: 'Closed won (MTD)', value: '$1.26M', delta: '+6.4%', trend: 'up' },
    { label: 'Win rate', value: '32.4%', delta: '+2.1pp', trend: 'up' },
    { label: 'Avg deal cycle', value: '46 days', delta: '-4 days', trend: 'down' },
  ],
  monthly_sales: [
    { month: 'Jul', won: 920000, target: 1000000 },
    { month: 'Aug', won: 1080000, target: 1050000 },
    { month: 'Sep', won: 1260000, target: 1050000 },
  ],
  channels: [
    { name: 'Broker network', value: 42 },
    { name: 'Direct enterprise', value: 31 },
    { name: 'Partner referrals', value: 17 },
    { name: 'Inbound marketing', value: 10 },
  ],
  pipeline: [
    {
      id: 'OPP-2041',
      account: 'Harbor Capital Assets',
      city: 'London',
      value: '$1.84M',
      stage: 'Negotiation',
      owner: 'Aisha Chen',
      close_date: '2026-11-18',
    },
    {
      id: 'OPP-2058',
      account: 'Marina Heights Partners',
      city: 'Dubai',
      value: '$1.42M',
      stage: 'Proposal',
      owner: 'Marco Silva',
      close_date: '2026-12-02',
    },
    {
      id: 'OPP-2073',
      account: 'Orchard Core Investors',
      city: 'Singapore',
      value: '$1.16M',
      stage: 'Discovery',
      owner: 'Nadia Patel',
      close_date: '2026-12-15',
    },
    {
      id: 'OPP-2089',
      account: 'Harbour Point Living',
      city: 'Toronto',
      value: '$980K',
      stage: 'Contracting',
      owner: 'Aisha Chen',
      close_date: '2026-11-09',
    },
  ],
  targets: [
    { region: 'EMEA', target: '$1.25M', attainment: 88 },
    { region: 'APAC', target: '$0.95M', attainment: 76 },
    { region: 'Americas', target: '$0.90M', attainment: 79 },
  ],
};

const defaultAssistant = {
  name: 'AI Assistant',
  status: 'online',
  model: 'Snowflake Cortex',
  grounded: true,
  capabilities: [
    'Portfolio and sales question answering',
    'SQL provenance and source references',
    'Confidence and limitation reporting',
  ],
  suggested_questions: [
    'Which properties have the highest rental arrears?',
    'What is the sales pipeline coverage by region?',
    'Summarise occupancy and maintenance risks for the executive team.',
  ],
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
  const [sales, setSales] = useState<any>(defaultSales);
  const [assistant, setAssistant] = useState<any>(defaultAssistant);
  const [question, setQuestion] = useState('Which properties have the highest rental arrears?');
  const [aiReply, setAiReply] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<ViewKey>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [preferences, setPreferences] = useState({
    emailDigest: true,
    aiAuditLog: true,
    weeklyBoardPack: false,
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [overviewRes, monitoringRes, salesRes, assistantRes] = await Promise.all([
          fetch(`${apiBase}/api/v1/dashboard/overview`),
          fetch(`${apiBase}/api/v1/monitoring`),
          fetch(`${apiBase}/api/v1/sales`),
          fetch(`${apiBase}/api/v1/ai/assistant`),
        ]);

        if (!overviewRes.ok || !monitoringRes.ok) {
          throw new Error('Dashboard API returned an error response');
        }

        const overviewJson = await overviewRes.json();
        const monitoringJson = await monitoringRes.json();
        const salesJson = salesRes.ok ? await salesRes.json() : defaultSales;
        const assistantJson = assistantRes.ok ? await assistantRes.json() : defaultAssistant;
        setOverview(overviewJson);
        setMonitoring(monitoringJson);
        setSales(salesJson);
        setAssistant(assistantJson);
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
        setSales(defaultSales);
        setAssistant(defaultAssistant);
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

  const openAssistant = () => {
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

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return [] as { id: string; label: string; hint: string; view: ViewKey }[];
    }

    const sectionMatches = navigation
      .filter((item) => item.label.toLowerCase().includes(query))
      .map((item) => ({
        id: `section-${item.key}`,
        label: item.label,
        hint: 'Section',
        view: item.key,
      }));

    const portfolioMatches = cityPortfolios
      .filter((portfolio) => `${portfolio.city} ${portfolio.name}`.toLowerCase().includes(query))
      .map((portfolio) => ({
        id: `portfolio-${portfolio.city}`,
        label: portfolio.name,
        hint: `${portfolio.city} portfolio`,
        view: 'portfolio' as ViewKey,
      }));

    const dealMatches = (sales.pipeline ?? defaultSales.pipeline)
      .filter((deal: any) => `${deal.account} ${deal.id} ${deal.city}`.toLowerCase().includes(query))
      .map((deal: any) => ({
        id: deal.id,
        label: deal.account,
        hint: `${deal.id} · ${deal.stage} · ${deal.value}`,
        view: 'sales' as ViewKey,
      }));

    return [...sectionMatches, ...portfolioMatches, ...dealMatches].slice(0, 6);
  }, [searchQuery, cityPortfolios, sales.pipeline]);

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

              <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
                <div className="relative w-full md:w-80">
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search properties, deals, or sections"
                    aria-label="Search the platform"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-100"
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => {
                            setActiveView(result.view);
                            setSearchQuery('');
                          }}
                          className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition hover:bg-slate-50"
                        >
                          <span className="text-sm font-medium text-slate-800">{result.label}</span>
                          <span className="text-xs text-slate-500">{result.hint}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={openAssistant}
                  className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
                >
                  AI assistant
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
            <>
              <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {portfolioWidgets.map((widget) => (
                  <div key={widget.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">{widget.label}</p>
                    <p className="mt-4 text-3xl font-bold text-slate-900">{widget.value}</p>
                  </div>
                ))}
              </section>

              <div className="mb-8 grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Property portfolio</h2>
                      <p className="text-sm text-slate-500">Occupancy and revenue across priority city portfolios.</p>
                    </div>
                    <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-1 text-xs text-sky-700">
                      248 properties
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.12em] text-slate-500">
                          <th className="pb-3 pr-4 font-medium">Portfolio</th>
                          <th className="pb-3 pr-4 font-medium">City</th>
                          <th className="pb-3 pr-4 font-medium">Occupancy</th>
                          <th className="pb-3 pr-4 font-medium">Revenue</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {cityPortfolios.map((portfolio) => (
                          <tr key={portfolio.city} className="text-slate-700">
                            <td className="py-3 pr-4 font-medium text-slate-900">{portfolio.name}</td>
                            <td className="py-3 pr-4">{portfolio.city}</td>
                            <td className="py-3 pr-4">{portfolio.occupancy}</td>
                            <td className="py-3 pr-4 font-semibold">{portfolio.revenue}</td>
                            <td className="py-3">
                              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                                {portfolio.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Portfolio composition</h2>
                  <p className="mt-1 text-sm text-slate-500">Share of assets by property type.</p>
                  <div className="mt-5 space-y-4">
                    {[
                      { label: 'Residential', value: 62, color: 'bg-sky-500' },
                      { label: 'Commercial', value: 18, color: 'bg-violet-500' },
                      { label: 'Mixed-use', value: 14, color: 'bg-emerald-500' },
                      { label: 'Student accommodation', value: 6, color: 'bg-amber-500' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-slate-600">{item.label}</span>
                          <span className="font-semibold text-slate-900">{item.value}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Leasing velocity</p>
                    <p className="mt-2 text-2xl font-bold text-emerald-600">+4.8% MoM</p>
                    <p className="text-xs text-slate-500">Ahead of the 3.5% quarterly target</p>
                  </div>
                </aside>
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Watchlist</h3>
                  <div className="mt-4 space-y-3 text-sm">
                    {[
                      ['Westfield Townhomes', 'Occupancy 91.8% · target 95%', 'amber'],
                      ['North Shore cluster', 'Arrears trending upward', 'rose'],
                      ['Parkview Suites', 'Two overdue work orders', 'sky'],
                    ].map(([name, detail, tone]) => (
                      <div key={name} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-800">{name}</span>
                          <span className={`h-2 w-2 rounded-full ${tone === 'rose' ? 'bg-rose-500' : tone === 'amber' ? 'bg-amber-500' : 'bg-sky-500'}`} />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Lease expiries</h3>
                  <p className="mt-1 text-sm text-slate-500">Next 90 days</p>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    {[
                      ['Nov 2026', '18 leases', 'bg-rose-500'],
                      ['Dec 2026', '27 leases', 'bg-amber-500'],
                      ['Jan 2027', '14 leases', 'bg-sky-500'],
                    ].map(([month, count, color]) => (
                      <div key={month} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <span>{month}</span>
                        <span className="flex items-center gap-2 font-medium text-slate-900">
                          <span className={`h-2 w-2 rounded-full ${color}`} /> {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Occupancy target</h3>
                  <div className="mt-4 flex items-end gap-3">
                    <span className="text-4xl font-bold text-slate-900">94.8%</span>
                    <span className="pb-1 text-sm text-emerald-600">+1.3pp</span>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: '94.8%' }} />
                  </div>
                  <p className="mt-3 text-sm text-slate-500">Target 95.0% · 0.2 points to close.</p>
                  <div className="mt-5 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600">Occupied units</span><span className="font-medium text-slate-900">7,982</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Vacant units</span><span className="font-medium text-slate-900">438</span></div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeView === 'sales' && (
            <>
              <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {(sales.metrics ?? defaultSales.metrics).map((metric: any) => (
                  <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{metric.label}</span>
                      <span className={metric.trend === 'up' ? 'text-emerald-600' : 'text-amber-600'}>{metric.delta}</span>
                    </div>
                    <div className="mt-4 text-3xl font-bold text-slate-900">{metric.value}</div>
                  </div>
                ))}
              </section>

              <div className="mb-8 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Sales performance</h2>
                      <p className="text-sm text-slate-500">Closed won against quarterly target · {sales.period}</p>
                    </div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                      {sales.target_attainment} of target
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {(sales.monthly_sales ?? defaultSales.monthly_sales).map((month: any) => {
                      const maxValue = Math.max(
                        ...(sales.monthly_sales ?? defaultSales.monthly_sales).map((item: any) =>
                          Math.max(item.won, item.target),
                        ),
                      );
                      return (
                        <div key={month.month} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex h-32 items-end justify-center gap-2">
                            <div
                              className="w-1/3 rounded-t-md bg-sky-500"
                              style={{ height: `${Math.max((month.won / maxValue) * 100, 8)}%` }}
                              title={`Closed won: $${month.won.toLocaleString()}`}
                            />
                            <div
                              className="w-1/3 rounded-t-md bg-slate-300"
                              style={{ height: `${Math.max((month.target / maxValue) * 100, 8)}%` }}
                              title={`Target: $${month.target.toLocaleString()}`}
                            />
                          </div>
                          <div className="mt-3 text-center text-sm font-medium text-slate-700">{month.month}</div>
                          <div className="text-center text-xs text-slate-500">${(month.won / 1000000).toFixed(2)}M won</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sky-500" /> Closed won</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-300" /> Target</span>
                  </div>
                </section>

                <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-slate-900">Regional targets</h2>
                  <div className="space-y-4">
                    {(sales.targets ?? defaultSales.targets).map((target: any) => (
                      <div key={target.region}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">{target.region}</span>
                          <span className="text-slate-500">{target.attainment}% of {target.target}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${target.attainment >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${target.attainment}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>

              <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Active pipeline</h2>
                    <p className="text-sm text-slate-500">{sales.active_deals} deals · {sales.pipeline_value} pipeline value</p>
                  </div>
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-1 text-xs text-sky-700">Live opportunities</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.12em] text-slate-500">
                        <th className="pb-3 pr-4 font-medium">Account</th>
                        <th className="pb-3 pr-4 font-medium">City</th>
                        <th className="pb-3 pr-4 font-medium">Value</th>
                        <th className="pb-3 pr-4 font-medium">Stage</th>
                        <th className="pb-3 pr-4 font-medium">Owner</th>
                        <th className="pb-3 font-medium">Close date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(sales.pipeline ?? defaultSales.pipeline).map((deal: any) => (
                        <tr key={deal.id} className="text-slate-700">
                          <td className="py-3 pr-4 font-medium text-slate-900">{deal.account}</td>
                          <td className="py-3 pr-4">{deal.city}</td>
                          <td className="py-3 pr-4 font-semibold">{deal.value}</td>
                          <td className="py-3 pr-4">
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{deal.stage}</span>
                          </td>
                          <td className="py-3 pr-4">{deal.owner}</td>
                          <td className="py-3 text-slate-500">{deal.close_date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {(sales.channels ?? defaultSales.channels).map((channel: any) => (
                  <div key={channel.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">{channel.name}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{channel.value}%</p>
                    <p className="text-xs text-slate-500">of sourced pipeline</p>
                  </div>
                ))}
              </section>
            </>
          )}

          {activeView === 'finance' && (
            <>
              <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {financeWidgets.map((widget) => (
                  <div key={widget.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">{widget.label}</p>
                    <p className="mt-4 text-3xl font-bold text-slate-900">{widget.value}</p>
                  </div>
                ))}
              </section>

              <div className="mb-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Revenue and collections</h2>
                      <p className="text-sm text-slate-500">Monthly rental income · trailing six months</p>
                    </div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                      +8.2% YoY
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-3">
                    {[
                      { month: 'Jan', value: 1.10 },
                      { month: 'Feb', value: 1.18 },
                      { month: 'Mar', value: 1.23 },
                      { month: 'Apr', value: 1.265 },
                      { month: 'May', value: 1.33 },
                      { month: 'Jun', value: 1.41 },
                    ].map((item) => (
                      <div key={item.month} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex h-36 items-end justify-center">
                          <div
                            className="w-2/3 rounded-t-md bg-gradient-to-t from-sky-600 to-sky-400"
                            style={{ height: `${(item.value / 1.5) * 100}%` }}
                            title={`$${item.value}M`}
                          />
                        </div>
                        <div className="mt-3 text-center text-sm font-medium text-slate-700">{item.month}</div>
                        <div className="text-center text-xs text-slate-500">${item.value}M</div>
                      </div>
                    ))}
                  </div>
                </section>

                <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Arrears ageing</h2>
                  <p className="mt-1 text-sm text-slate-500">Outstanding balance by age band.</p>
                  <div className="mt-5 space-y-4">
                    {[
                      { band: '0–30 days', value: 112000, share: 45, color: 'bg-emerald-500' },
                      { band: '31–60 days', value: 68000, share: 27, color: 'bg-sky-500' },
                      { band: '61–90 days', value: 41000, share: 17, color: 'bg-amber-500' },
                      { band: '90+ days', value: 27600, share: 11, color: 'bg-rose-500' },
                    ].map((bucket) => (
                      <div key={bucket.band}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-slate-600">{bucket.band}</span>
                          <span className="font-semibold text-slate-900">${(bucket.value / 1000).toFixed(1)}K</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className={`h-full rounded-full ${bucket.color}`} style={{ width: `${bucket.share}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                    <div className="flex justify-between"><span>Collection rate</span><span className="font-semibold text-emerald-600">96.2%</span></div>
                    <div className="mt-2 flex justify-between"><span>At-risk accounts</span><span className="font-semibold text-amber-600">14</span></div>
                  </div>
                </aside>
              </div>

              <div className="mb-8 grid gap-6 xl:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Cost breakdown</h2>
                  <div className="mt-5 space-y-3 text-sm">
                    {[
                      ['Maintenance', '$612K', 68, 'bg-sky-500'],
                      ['Utilities', '$224K', 25, 'bg-emerald-500'],
                      ['Insurance', '$118K', 13, 'bg-violet-500'],
                      ['Administration', '$96K', 11, 'bg-amber-500'],
                    ].map(([label, value, width, color]) => (
                      <div key={String(label)} className="flex items-center gap-4">
                        <span className="w-28 text-slate-600">{label}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
                        </div>
                        <span className="w-16 text-right font-medium text-slate-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Quarterly forecast</h2>
                  <p className="mt-1 text-sm text-slate-500">Expected receipts against plan.</p>
                  <div className="mt-5 space-y-3 text-sm">
                    {[
                      ['Gross rent', '$4.82M', '$4.71M', '+2.3%'],
                      ['Collections', '$1.33M', '$1.28M', '+3.9%'],
                      ['Maintenance', '$612K', '$640K', '-4.4%'],
                      ['Net operating income', '$3.44M', '$3.31M', '+3.9%'],
                    ].map(([label, actual, plan, variance]) => (
                      <div key={label} className="grid grid-cols-4 items-center rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <span className="text-slate-600">{label}</span>
                        <span className="font-semibold text-slate-900">{actual}</span>
                        <span className="text-slate-500">{plan}</span>
                        <span className={`text-right font-medium ${variance.startsWith('+') ? 'text-emerald-600' : 'text-amber-600'}`}>{variance}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-4 text-[10px] uppercase tracking-[0.14em] text-slate-400">
                    <span>Metric</span><span>Actual</span><span>Plan</span><span className="text-right">Variance</span>
                  </div>
                </section>
              </div>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Recent transactions</h2>
                  <span className="text-xs text-slate-500">Synced from finance ledger</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.12em] text-slate-500">
                        <th className="pb-3 pr-4 font-medium">Reference</th>
                        <th className="pb-3 pr-4 font-medium">Portfolio</th>
                        <th className="pb-3 pr-4 font-medium">Type</th>
                        <th className="pb-3 pr-4 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {[
                        ['TXN-8841', 'Canary Wharf Residences', 'Rent receipt', '$184,200', 'Reconciled'],
                        ['TXN-8856', 'Marina Heights', 'Service charge', '$62,400', 'Reconciled'],
                        ['TXN-8873', 'Harbour Point Living', 'Rent receipt', '$91,800', 'Pending'],
                        ['TXN-8890', 'Orchard Core Suites', 'Deposit', '$44,500', 'Reconciled'],
                      ].map(([ref, portfolio, type, amount, status]) => (
                        <tr key={ref}>
                          <td className="py-3 pr-4 font-medium text-slate-900">{ref}</td>
                          <td className="py-3 pr-4">{portfolio}</td>
                          <td className="py-3 pr-4">{type}</td>
                          <td className="py-3 pr-4 font-semibold">{amount}</td>
                          <td className="py-3">
                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${status === 'Reconciled' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {activeView === 'operations' && (
            <>
              <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {opsWidgets.map((widget) => (
                  <div key={widget.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">{widget.label}</p>
                    <p className="mt-4 text-3xl font-bold text-slate-900">{widget.value}</p>
                  </div>
                ))}
              </section>

              <div className="mb-8 grid gap-6 xl:grid-cols-[1.5fr_0.5fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Work order queue</h2>
                      <p className="text-sm text-slate-500">Active maintenance jobs across the portfolio.</p>
                    </div>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-700">
                      4 critical
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.12em] text-slate-500">
                          <th className="pb-3 pr-4 font-medium">Work order</th>
                          <th className="pb-3 pr-4 font-medium">Property</th>
                          <th className="pb-3 pr-4 font-medium">Priority</th>
                          <th className="pb-3 pr-4 font-medium">Status</th>
                          <th className="pb-3 pr-4 font-medium">Age</th>
                          <th className="pb-3 font-medium">Assigned</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {[
                          ['WO-4401', 'Bayside Residences', 'High', 'In progress', '3 days', 'PlumbCo'],
                          ['WO-4412', 'Parkview Suites', 'Medium', 'Queued', '2 days', 'Internal'],
                          ['WO-4427', 'Westfield Townhomes', 'Critical', 'In progress', '1 day', 'ElectraServ'],
                          ['WO-4438', 'Harbour Point Living', 'Low', 'Scheduled', '5 days', 'HVAC Partners'],
                          ['WO-4441', 'Marina Heights', 'Medium', 'Queued', '4 days', 'Internal'],
                        ].map(([id, property, priority, status, age, assigned]) => (
                          <tr key={id}>
                            <td className="py-3 pr-4 font-medium text-slate-900">{id}</td>
                            <td className="py-3 pr-4">{property}</td>
                            <td className="py-3 pr-4">
                              <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                priority === 'Critical'
                                  ? 'bg-rose-50 text-rose-700'
                                  : priority === 'High'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-slate-100 text-slate-600'
                              }`}>{priority}</span>
                            </td>
                            <td className="py-3 pr-4">{status}</td>
                            <td className="py-3 pr-4">{age}</td>
                            <td className="py-3">{assigned}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Spend by category</h2>
                  <div className="mt-5 space-y-4">
                    {[
                      ['Plumbing', '$167K', 82],
                      ['Electrical', '$116K', 57],
                      ['HVAC', '$92K', 45],
                      ['General repairs', '$74K', 36],
                      ['Grounds', '$58K', 28],
                    ].map(([label, value, width]) => (
                      <div key={String(label)}>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="text-slate-600">{label}</span>
                          <span className="font-semibold text-slate-900">{value}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-sky-500" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">SLA performance</h3>
                  <div className="mt-4 flex items-end gap-3">
                    <span className="text-4xl font-bold text-slate-900">92.6%</span>
                    <span className="pb-1 text-sm text-emerald-600">+2.4pp</span>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: '92.6%' }} />
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between"><span>Within SLA</span><span className="font-medium text-slate-900">1,284 jobs</span></div>
                    <div className="flex justify-between"><span>Breached</span><span className="font-medium text-amber-600">103 jobs</span></div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Vendor scorecard</h3>
                  <div className="mt-4 space-y-3 text-sm">
                    {[
                      ['PlumbCo', '4.6', 'bg-emerald-500'],
                      ['ElectraServ', '4.2', 'bg-sky-500'],
                      ['HVAC Partners', '3.9', 'bg-amber-500'],
                      ['GroundWorks', '3.6', 'bg-rose-500'],
                    ].map(([vendor, rating, color]) => (
                      <div key={String(vendor)} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <span className="text-slate-700">{vendor}</span>
                        <span className="flex items-center gap-2 font-medium text-slate-900">
                          <span className={`h-2 w-2 rounded-full ${color}`} /> {rating} / 5
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Upcoming maintenance</h3>
                  <div className="mt-4 space-y-3 text-sm">
                    {[
                      ['Nov 04', 'Annual HVAC inspection', 'Bayside Residences'],
                      ['Nov 07', 'Fire safety audit', 'Canary Wharf Residences'],
                      ['Nov 12', 'Lift servicing', 'Orchard Core Suites'],
                      ['Nov 18', 'Roof survey', 'Harbour Point Living'],
                    ].map(([date, task, property]) => (
                      <div key={`${date}-${task}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-800">{task}</span>
                          <span className="text-xs text-sky-600">{date}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{property}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeView === 'governance' && (
            <>
              <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {governanceWidgets.map((widget) => (
                  <div key={widget.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">{widget.label}</p>
                    <p className="mt-4 text-3xl font-bold text-slate-900">{widget.value}</p>
                  </div>
                ))}
              </section>

              <div className="mb-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Roles and permissions</h2>
                      <p className="text-sm text-slate-500">Workspace access across the organisation.</p>
                    </div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                      Compliant
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.12em] text-slate-500">
                          <th className="pb-3 pr-4 font-medium">Role</th>
                          <th className="pb-3 pr-4 font-medium">Owner</th>
                          <th className="pb-3 pr-4 font-medium">Scope</th>
                          <th className="pb-3 pr-4 font-medium">MFA</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {[
                          ['Portfolio Admin', 'Aisha Chen', 'All portfolios', 'Enabled', 'Active'],
                          ['Finance Manager', 'Marco Silva', 'Finance + sales', 'Enabled', 'Active'],
                          ['Data Steward', 'Nadia Patel', 'Governance + data', 'Enabled', 'Active'],
                          ['Regional Ops Lead', 'Tomas Keller', 'EMEA operations', 'Pending', 'Review'],
                          ['AI Auditor', 'System', 'AI interaction logs', 'Enabled', 'Active'],
                        ].map(([role, owner, scope, mfa, status]) => (
                          <tr key={role}>
                            <td className="py-3 pr-4 font-medium text-slate-900">{role}</td>
                            <td className="py-3 pr-4">{owner}</td>
                            <td className="py-3 pr-4">{scope}</td>
                            <td className="py-3 pr-4">
                              <span className={`rounded-full px-2 py-1 text-xs font-medium ${mfa === 'Enabled' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{mfa}</span>
                            </td>
                            <td className="py-3">
                              <span className={`rounded-full px-2 py-1 text-xs font-medium ${status === 'Active' ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'}`}>{status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Compliance posture</h2>
                  <div className="mt-5 space-y-3">
                    {[
                      ['Row-level security', 'Enforced'],
                      ['Data masking', '16 rules'],
                      ['AI audit trail', 'Enabled'],
                      ['Access reviews', 'Up to date'],
                      ['Suspicious activity', '2 to review'],
                    ].map(([control, state]) => (
                      <div key={control} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                        <span className="text-slate-600">{control}</span>
                        <span className={`font-medium ${state.includes('review') ? 'text-amber-600' : 'text-emerald-600'}`}>{state}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                    <p className="font-semibold">2 alerts need review</p>
                    <p className="mt-1 text-xs">Unusual finance export and repeated admin authentication failures.</p>
                  </div>
                </aside>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Audit events</h2>
                  <div className="mt-5 space-y-4">
                    {[
                      ['08:14', 'Aisha Chen', 'Exported finance snapshot', 'Approved', 'emerald'],
                      ['09:02', 'System', 'Dataset refresh completed', 'Success', 'emerald'],
                      ['09:41', 'Marco Silva', 'Viewed sales pipeline', 'Logged', 'sky'],
                      ['10:18', 'Nadia Patel', 'Updated masking policy', 'Approved', 'emerald'],
                      ['11:05', 'System', 'AI query executed', 'Logged', 'sky'],
                    ].map(([time, actor, action, status, tone]) => (
                      <div key={`${time}-${action}`} className="flex gap-3">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-300" />
                        <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-800">{action}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tone === 'emerald' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>{status}</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">{actor} · {time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Data access policies</h2>
                  <div className="mt-5 space-y-3 text-sm">
                    {[
                      ['Finance and arrears', 'EIP_ADMIN, EIP_ANALYST', 'Amounts masked outside finance'],
                      ['Sales pipeline', 'Sales leadership', 'Region-level row filtering'],
                      ['Tenant records', 'Property teams', 'PII masked by default'],
                      ['AI interactions', 'AI Auditor', 'Read-only, audited access'],
                    ].map(([dataset, roles, detail]) => (
                      <div key={dataset} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-800">{dataset}</span>
                          <span className="text-xs text-slate-500">{roles}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{detail}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}

          {activeView === 'integrations' && (
            <>
              <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Connected systems</h2>
                    <p className="text-sm text-slate-500">Manage the sources and destinations feeding the enterprise intelligence platform.</p>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    3 of 6 connected
                  </span>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[
                  { name: 'Snowflake', category: 'Data warehouse', status: 'Connected', lastSync: '4 minutes ago', detail: 'Raw, staging, curated and mart schemas.' },
                  { name: 'Yardi', category: 'Property management', status: 'Connected', lastSync: '18 minutes ago', detail: 'Property, lease and rent roll feeds.' },
                  { name: 'Salesforce', category: 'Sales CRM', status: 'Connected', lastSync: '32 minutes ago', detail: 'Opportunity, account and pipeline data.' },
                  { name: 'Stripe', category: 'Payments', status: 'Available', lastSync: 'Not connected', detail: 'Invoice and payment reconciliation.' },
                  { name: 'Slack', category: 'Notifications', status: 'Available', lastSync: 'Not connected', detail: 'Operational alerts and AI summaries.' },
                  { name: 'Power BI', category: 'Business intelligence', status: 'Available', lastSync: 'Not connected', detail: 'Curated mart distribution for executives.' },
                ].map((integration) => (
                  <div key={integration.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">{integration.category}</p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-900">{integration.name}</h3>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                          integration.status === 'Connected'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {integration.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{integration.detail}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                      <span>{integration.lastSync}</span>
                      <button className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-100">
                        {integration.status === 'Connected' ? 'Manage' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            </>
          )}

          {activeView === 'settings' && (
            <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Organisation profile</h2>
                  <p className="mt-1 text-sm text-slate-500">Workspace identity and reporting defaults.</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <label className="text-sm text-slate-600">
                      Organisation name
                      <input
                        defaultValue={overview.organisation ?? 'Northgate Property Group'}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-100"
                      />
                    </label>
                    <label className="text-sm text-slate-600">
                      Default reporting period
                      <select
                        defaultValue={overview.date_range ?? 'Q3 2026'}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-100"
                      >
                        <option>Q3 2026</option>
                        <option>Q2 2026</option>
                        <option>Year to date</option>
                      </select>
                    </label>
                    <label className="text-sm text-slate-600">
                      Primary timezone
                      <select
                        defaultValue="Europe/London"
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-100"
                      >
                        <option>Europe/London</option>
                        <option>Asia/Dubai</option>
                        <option>America/Toronto</option>
                        <option>Asia/Singapore</option>
                      </select>
                    </label>
                    <label className="text-sm text-slate-600">
                      Default currency
                      <select
                        defaultValue="USD"
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-100"
                      >
                        <option>USD</option>
                        <option>GBP</option>
                        <option>EUR</option>
                        <option>SGD</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
                  <p className="mt-1 text-sm text-slate-500">Choose what the platform sends to your team.</p>
                  <div className="mt-5 space-y-3">
                    {[
                      { key: 'emailDigest', label: 'Daily executive email digest', detail: 'Portfolio, sales and arrears summary each morning.' },
                      { key: 'aiAuditLog', label: 'AI assistant audit logging', detail: 'Record every assistant question and generated SQL.' },
                      { key: 'weeklyBoardPack', label: 'Weekly board pack export', detail: 'PDF pack delivered every Monday at 07:00.' },
                    ].map((item) => (
                      <label key={item.key} className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <span>
                          <span className="block text-sm font-medium text-slate-800">{item.label}</span>
                          <span className="mt-1 block text-xs text-slate-500">{item.detail}</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={preferences[item.key as keyof typeof preferences]}
                          onChange={(event) =>
                            setPreferences((current) => ({ ...current, [item.key]: event.target.checked }))
                          }
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Data and security</h2>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <span className="text-slate-600">Snowflake connection</span>
                      <span className="font-medium text-emerald-600">Ready</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <span className="text-slate-600">Row-level access policies</span>
                      <span className="font-medium text-slate-900">42 active</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <span className="text-slate-600">AI audit trail</span>
                      <span className="font-medium text-slate-900">{preferences.aiAuditLog ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Workspace roles</h2>
                  <div className="mt-4 space-y-3 text-sm">
                    {[
                      ['Portfolio Admin', 'Aisha Chen', 'Full access'],
                      ['Finance Manager', 'Marco Silva', 'Finance + sales'],
                      ['Data Steward', 'Nadia Patel', 'Governance + data'],
                    ].map(([role, owner, access]) => (
                      <div key={role} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div>
                          <div className="font-medium text-slate-800">{role}</div>
                          <div className="text-xs text-slate-500">{owner}</div>
                        </div>
                        <span className="text-xs text-slate-600">{access}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 w-full rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500">
                    Save settings
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeView === 'insights' && (
            <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">AI Assistant</h2>
                    <p className="text-sm text-slate-500">{assistant.model} · {assistant.status}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-emerald-600">Grounded queries</span>
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {(assistant.suggested_questions ?? defaultAssistant.suggested_questions).map((suggestion: string) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setQuestion(suggestion);
                        void askAi(suggestion);
                      }}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                    >
                      {suggestion}
                    </button>
                  ))}
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
