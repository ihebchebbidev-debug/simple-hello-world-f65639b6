import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, Globe, Smartphone, Monitor, TrendingUp, Plus, Eye } from 'lucide-react';
import { adminListProducts, adminVisitorStats, type VisitorStats, type ApiProduct } from '@/lib/products-api';

function Card({ title, value, Icon, tone = 'primary', foot }: any) {
  const tones: any = {
    primary: 'from-[#DDE9CC] to-[#EAF1E6] text-primary',
    amber: 'from-[#F5D9C4] to-[#FBEDE2] text-amber-700',
    sky: 'from-[#D5E4EE] to-[#EAF1F6] text-sky-700',
    sand: 'from-[#F5E7C4] to-[#FAF3E4] text-yellow-800',
  };
  return (
    <div className={`rounded-2xl border border-black/5 bg-gradient-to-br ${tones[tone]} p-5 shadow-sm`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide opacity-70">{title}</span>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-3xl font-semibold text-ink">{value}</div>
      {foot && <div className="mt-1 text-xs text-ink/60">{foot}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    adminVisitorStats().then(setStats).catch((e) => setErr(e.message));
    adminListProducts().then(setProducts).catch(() => {});
  }, []);

  const activeCount = products.filter((p) => p.is_active).length;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Tableau de bord</h1>
        <p className="text-sm text-ink/60">Aperçu de votre activité et de vos produits</p>
      </div>

      {err && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Erreur API: {err}. Vérifiez que le backend est déployé sur draminesaid.com/directadmin/atlasagricol/</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Visiteurs totaux" value={stats?.total ?? '—'} Icon={Users} foot={`${stats?.unique_ips ?? 0} IP uniques`} />
        <Card title="Aujourd'hui" value={stats?.today ?? '—'} Icon={TrendingUp} tone="amber" foot={`${stats?.this_week ?? 0} cette semaine`} />
        <Card title="Ce mois" value={stats?.this_month ?? '—'} Icon={Globe} tone="sky" />
        <Card title="Produits actifs" value={`${activeCount}/${products.length}`} Icon={Package} tone="sand" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-ink">Top pays</h3>
            <Globe className="h-4 w-4 text-ink/40" />
          </div>
          <div className="grid gap-2">
            {(stats?.by_country || []).slice(0, 8).map((c) => (
              <div key={c.country} className="flex items-center justify-between text-sm">
                <span className="text-ink/80">{c.country}</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{c.count}</span>
              </div>
            ))}
            {(!stats || stats.by_country.length === 0) && <p className="text-sm text-ink/50">Aucune donnée</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-ink">Répartition appareils</h3>
            <Smartphone className="h-4 w-4 text-ink/40" />
          </div>
          <div className="grid gap-2">
            {(stats?.by_device || []).map((d) => (
              <div key={d.device_type} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 capitalize text-ink/80">
                  {d.device_type === 'mobile' ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                  {d.device_type || 'inconnu'}
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-ink">Actions rapides</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/produits/nouveau" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:brightness-110">
            <Plus className="h-4 w-4" /> Nouveau produit
          </Link>
          <Link to="/admin/produits" className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-black/5">
            <Package className="h-4 w-4" /> Gérer les produits
          </Link>
          <Link to="/admin/visiteurs" className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-black/5">
            <Eye className="h-4 w-4" /> Voir les visiteurs
          </Link>
        </div>
      </div>
    </div>
  );
}
