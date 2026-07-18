import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit3, Trash2, Eye, EyeOff, Package } from 'lucide-react';
import { toast } from 'sonner';
import { adminDeleteProduct, adminListProducts, adminUpdateProduct, type ApiProduct } from '@/lib/products-api';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function AdminProducts() {
  const [items, setItems] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Tous');
  const [err, setErr] = useState('');
  const [toDelete, setToDelete] = useState<ApiProduct | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    adminListProducts()
      .then(setItems)
      .catch((e) => { setErr(e.message); toast.error('Erreur de chargement', { description: e.message }); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const categories = useMemo(() => ['Tous', ...Array.from(new Set(items.map((i) => i.category)))], [items]);

  const filtered = items.filter((p) => {
    if (cat !== 'Tous' && p.category !== cat) return false;
    if (q && !(`${p.name} ${p.short_description}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  const toggleActive = async (p: ApiProduct) => {
    try {
      await adminUpdateProduct({ id: p.id, name: p.name, category: p.category, is_active: p.is_active ? 0 : 1 });
      toast.success(p.is_active ? 'Produit désactivé' : 'Produit activé', {
        description: p.name,
      });
      // optimistic local update
      setItems((prev) => prev.map((it) => it.id === p.id ? { ...it, is_active: it.is_active ? 0 : 1 } : it));
    } catch (e: any) {
      toast.error('Impossible de modifier le statut', { description: e.message });
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const name = toDelete.name;
    try {
      await adminDeleteProduct(toDelete.id);
      // remove immediately for instant feedback, then refresh from server
      setItems((prev) => prev.filter((i) => i.id !== toDelete.id));
      toast.success('Produit supprimé', { description: `"${name}" a été retiré du catalogue.` });
      setToDelete(null);
      load();
    } catch (e: any) {
      toast.error('Suppression échouée', { description: e.message });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Produits</h1>
          <p className="text-sm text-ink/60">{items.length} produit(s) au catalogue</p>
        </div>
        <Link to="/admin/produits/nouveau" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:brightness-110">
          <Plus className="h-4 w-4" /> Nouveau produit
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-black/5 bg-white p-3 shadow-sm">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-black/10 bg-white px-3">
          <Search className="h-4 w-4 text-ink/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un produit…"
            className="w-full bg-transparent py-2 text-sm outline-none" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)}
          className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm">
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {err && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{err}</div>}

      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-sm text-ink/50">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-ink/50">
            <Package className="mx-auto mb-2 h-8 w-8 opacity-40" />
            Aucun produit trouvé
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {filtered.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-black/[0.02]">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#EAF1E6]">
                  {p.main_image ? (
                    <img src={p.main_image} alt={p.name} className="h-full w-full object-contain" />
                  ) : <div className="grid h-full w-full place-items-center text-xs text-ink/40">—</div>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-medium text-ink">{p.name}</h3>
                    {!p.is_active && <span className="rounded-full bg-black/10 px-2 py-0.5 text-[10px] text-ink/60">Inactif</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-ink/60">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{p.category}</span>
                    <span className="ml-2 truncate">{p.short_description}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button title={p.is_active ? 'Désactiver' : 'Activer'} onClick={() => toggleActive(p)}
                    className="rounded-lg p-2 text-ink/60 hover:bg-black/5">
                    {p.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <Link to={`/admin/produits/${p.id}`} className="rounded-lg p-2 text-ink/60 hover:bg-black/5">
                    <Edit3 className="h-4 w-4" />
                  </Link>
                  <button onClick={() => setToDelete(p)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer ce produit ?"
        description={toDelete ? `"${toDelete.name}" sera définitivement retiré du catalogue, ainsi que toutes ses images. Cette action est irréversible.` : ''}
        confirmLabel={deleting ? 'Suppression…' : 'Supprimer'}
        cancelLabel="Annuler"
        loading={deleting}
        tone="danger"
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setToDelete(null)}
      />
    </div>
  );
}
