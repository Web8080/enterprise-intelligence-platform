const services = [
  { name: 'API Gateway', status: 'Healthy', latency: '412ms', availability: '99.8%' },
  { name: 'Snowflake Warehouse', status: 'Healthy', latency: '1.1s', availability: '99.9%' },
  { name: 'Ingestion Pipeline', status: 'Warning', latency: '2.5s', availability: '97.2%' },
  { name: 'AI Assistant', status: 'Healthy', latency: '820ms', availability: '99.5%' },
];

export default function MonitoringPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Monitoring</p>
            <h1 className="mt-2 text-3xl font-bold">Platform operations overview</h1>
          </div>
          <button className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950">
            Refresh status
          </button>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          {[
            ['API health', '99.8%'],
            ['Service availability', '99.7%'],
            ['Pipeline health', '97.2%'],
            ['Error rate', '0.8%'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
              <div className="text-sm text-slate-400">{label}</div>
              <div className="mt-3 text-3xl font-bold text-cyan-300">{value}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
            <h2 className="mb-5 text-lg font-semibold">Service health</h2>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.name} className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="mt-1 text-xs text-slate-400">Latency: {service.latency}</div>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      service.status === 'Healthy'
                        ? 'bg-emerald-500/10 text-emerald-300'
                        : 'bg-amber-500/10 text-amber-300'
                    }`}>
                      {service.status}
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className={`h-full rounded-full ${
                        service.status === 'Healthy' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                      style={{ width: service.status === 'Healthy' ? '92%' : '76%' }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-slate-400">Availability: {service.availability}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
              <h2 className="mb-4 text-lg font-semibold">Warehouse utilisation</h2>
              <div className="flex items-end gap-2">
                {[48, 62, 58, 71, 84, 76, 89].map((value, index) => (
                  <div key={value + index} className="flex-1">
                    <div className="mb-2 flex h-28 items-end justify-center">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-cyan-500 to-blue-400"
                        style={{ height: `${value}%` }}
                      />
                    </div>
                    <div className="text-center text-[10px] text-slate-400">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
              <h2 className="mb-4 text-lg font-semibold">Incidents</h2>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">Queue lag increased by 11% on ingestion pipeline.</li>
                <li className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">No critical incidents on Snowflake compute.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
