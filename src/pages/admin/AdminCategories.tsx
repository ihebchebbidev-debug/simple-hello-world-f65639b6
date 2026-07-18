import { useEffect, useState } from 'react';
import { Plus, Tag, Edit3, Trash2, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createCategory, deleteCategory, fetchCategories, updateCategory, type Category } from '@/lib/categories-api';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function AdminCategories() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    fetchCategories().then(setItems).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const startNew = () => setEditing({ name: '', slug: '', description: '', sort_order: items.length + 1 });
  const startEdit = (c: Category) => setEditing({ ...c });

  const save = async () => {
    if (!editing?.name?.trim()) { toast.error('Le nom est requis'); return; }
    setSaving(true);
    try {
      if (editing.id) {
        await updateCategory({
          id: editing.id, name: editing.name, slug: editing.slug || undefined,
          description: editing.description || '', sort_order: Number(editing.sort_order || 0),
        });
        toast.success('Catégorie mise à jour', { description: editing.name });
      } else {
        await createCategory({
          name: editing.name!, slug: editing.slug || undefined,
          description: editing.description || '', sort_order: Number(editing.sort_order || 0),
        });
        toast.success('Catégorie créée', { description: editing.name });
      }
      setEditing(null);
      load();
    } catch (e: any) {
      toast.error('Enregistrement échoué', { description: e.message });
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const name = toDelete.name;
    try {
      await deleteCategory(toDelete.id);
      setItems((prev) => prev.filter((i) => i.id !== toDelete.id));
      toast.success('Catégorie supprimée', { description: name });
      setToDelete(null);
      load();
    } catch (e: any) {
      toast.error('Suppression impossible', { description: e.message });
    } finally { setDeleting(false); }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Catégories</h1>
          <p className="text-sm text-ink/60">{items.length} catégorie(s) disponible(s)</p>
        </div>
        {!editing && (
          <button onClick={startNew} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:brightness-110">
            <Plus className="h-4 w-4" /> Nouvelle catégorie
          </button>
        )}
      </div>


      {editing && (
        <div className="rounded-2xl border border-primary/30 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-ink">{editing.id ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h3>
            <button onClick={() => setEditing(null)} className="rounded-lg p-1.5 text-ink/60 hover:bg-black/5"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-ink/70">Nom *</span>
              <input value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-ink/70">Slug (URL)</span>
              <input value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="auto-généré" className={inputCls} />
            </label>
            <label className="grid gap-1.5 sm:col-span-2">
              <span className="text-xs font-medium text-ink/70">Description</span>
              <textarea rows={2} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={inputCls} />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-ink/70">Ordre d'affichage</span>
              <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={inputCls} />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setEditing(null)} className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm hover:bg-black/5">Annuler</button>
            <button onClick={save} disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Enregistrer
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-sm text-ink/50">Chargement…</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-ink/50">
            <Tag className="mx-auto mb-2 h-8 w-8 opacity-40" /> Aucune catégorie
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {items.map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-4 hover:bg-black/[0.02]">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Tag className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-ink">{c.name}</h3>
                  <p className="mt-0.5 text-xs text-ink/60">
                    <code className="rounded bg-black/5 px-1.5 py-0.5 text-[11px]">{c.slug}</code>
                    <span className="ml-2">Ordre : {c.sort_order}</span>
                    {c.description && <span className="ml-2 truncate">— {c.description}</span>}
                  </p>
                </div>
                <button onClick={() => startEdit(c)} className="rounded-lg p-2 text-ink/60 hover:bg-black/5"><Edit3 className="h-4 w-4" /></button>
                <button onClick={() => setToDelete(c)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer cette catégorie ?"
        description={toDelete ? `"${toDelete.name}" sera définitivement supprimée. Si des produits utilisent encore cette catégorie, la suppression sera bloquée.` : ''}
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

const inputCls = "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-primary";
