import { useEffect, useState } from 'react';
import { Globe, Smartphone, Monitor, Users, Search, RefreshCw } from 'lucide-react';
import { adminListVisitors, adminVisitorStats, type Visitor, type VisitorStats } from '@/lib/products-api';

export default function AdminVisitors() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [rows, setRows] = useState<Visitor[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([adminVisitorStats(), adminListVisitors(300)])
      .then(([s, v]) => { setStats(s); setRows(v.data); setTotal(v.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = rows.filter((r) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return `${r.ip_address} ${r.country} ${r.city} ${r.device_type} ${r.browser} ${r.page_url}`.toLowerCase().includes(s);
  });

  const fmt = (d: string) => new Date(d.replace(' ', 'T')).toLocaleString('fr-FR');

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Visiteurs</h1>
          <p className="text-sm text-ink/60">{total.toLocaleString('fr-FR')} visite(s) enregistrée(s)</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm hover:bg-black/5">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Actualiser
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat title="Total" value={stats?.total ?? 0} Icon={Users} />
        <MiniStat title="Aujourd'hui" value={stats?.today ?? 0} Icon={Globe} />
        <MiniStat title="Cette semaine" value={stats?.this_week ?? 0} Icon={Monitor} />
        <MiniStat title="IPs uniques" value={stats?.unique_ips ?? 0} Icon={Smartphone} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Pays">
          <BarList items={(stats?.by_country || []).map((c) => ({ label: c.country, value: c.count }))} />
        </Panel>
        <Panel title="Appareils">
          <BarList items={(stats?.by_device || []).map((d) => ({ label: d.device_type || 'inconnu', value: d.count }))} />
        </Panel>
        <Panel title="Navigateurs">
          <BarList items={(stats?.by_browser || []).map((b) => ({ label: b.browser || 'inconnu', value: b.count }))} />
        </Panel>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-black/5 p-3">
          <Search className="h-4 w-4 text-ink/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher (IP, pays, page…)"
            className="w-full bg-transparent py-1 text-sm outline-none" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/[0.02] text-xs uppercase text-ink/60">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">IP</th>
                <th className="p-3">Localisation</th>
                <th className="p-3">Appareil</th>
                <th className="p-3">Navigateur</th>
                <th className="p-3">Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-black/[0.02]">
                  <td className="whitespace-nowrap p-3 text-ink/70">{fmt(r.visited_at)}</td>
                  <td className="p-3 font-mono text-xs text-ink">{r.ip_address}</td>
                  <td className="p-3 text-ink/80">
                    {[r.city, r.region, r.country].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td className="p-3">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs capitalize text-primary">{r.device_type || '—'}</span>
                  </td>
                  <td className="p-3 text-ink/70">{r.browser} / {r.os}</td>
                  <td className="max-w-[240px] truncate p-3 text-xs text-ink/60">{r.page_url}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-10 text-center text-ink/50">Aucun visiteur</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ title, value, Icon }: any) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between text-xs text-ink/60">
        <span>{title}</span> <Icon className="h-4 w-4" />
      </div>
      <div className="mt-2 text-2xl font-semibold text-ink">{Number(value).toLocaleString('fr-FR')}</div>
    </div>
  );
}

function Panel({ title, children }: any) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}

function BarList({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (items.length === 0) return <p className="text-sm text-ink/50">—</p>;
  return (
    <div className="grid gap-2">
      {items.slice(0, 8).map((i) => (
        <div key={i.label} className="grid gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="truncate text-ink/80">{i.label}</span>
            <span className="text-ink/60">{i.value}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-black/5">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(i.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
