import { useEffect, useState, ChangeEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus, Upload, X, Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  adminCreateProduct, adminDeleteImage, adminGetProduct, adminUpdateProduct, adminUploadImage,
  type ApiProduct, type ProductPayload,
} from '@/lib/products-api';
import { fetchCategories, type Category } from '@/lib/categories-api';

const TONES = ['sage', 'sand', 'mist', 'clay', 'sky', 'stone'];

type FormState = {
  id?: number;
  name: string;
  slug: string;
  category: string;
  tone: string;
  short_description: string;
  description: string;
  homologation: string;
  main_image: string;
  images: string[];
  usages: { crop: string; dose: string; target: string }[];
  composition: { name: string; percentage: string }[];
  benefits: string[];
  technical_sheet_url: string;
  is_active: number;
};

const empty: FormState = {
  name: '', slug: '', category: 'Fongicides', tone: 'sage',
  short_description: '', description: '', homologation: '',
  main_image: '', images: [], usages: [], composition: [], benefits: [],
  technical_sheet_url: '', is_active: 1,
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isNew = !id || id === 'nouveau';
  const nav = useNavigate();
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  void msg; // banner replaced by toasts
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => { fetchCategories().then(setCategories); }, []);

  useEffect(() => {
    if (isNew) return;
    adminGetProduct(Number(id))
      .then((p: ApiProduct) => setForm({
        id: p.id, name: p.name, slug: p.slug, category: p.category, tone: p.tone,
        short_description: p.short_description || '', description: p.description || '',
        homologation: p.homologation || '', main_image: p.main_image || '',
        images: p.images || [], usages: p.usages || [], composition: p.composition || [],
        benefits: p.benefits || [], technical_sheet_url: p.technical_sheet_url || '',
        is_active: p.is_active,
      }))
      .catch((e) => { setMsg({ type: 'err', text: e.message }); toast.error('Chargement échoué', { description: e.message }); })
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const set = (k: keyof FormState, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name.trim()) { toast.error('Le nom du produit est requis'); return; }
    setSaving(true); setMsg(null);
    try {
      const payload: ProductPayload = { ...form };
      if (isNew) {
        const r = await adminCreateProduct(payload);
        toast.success('Produit créé', { description: form.name });
        nav(`/admin/produits/${r.id}`, { replace: true });
      } else {
        await adminUpdateProduct({ ...payload, id: form.id });
        toast.success('Modifications enregistrées', { description: form.name });
      }
    } catch (e: any) {
      toast.error('Enregistrement échoué', { description: e.message });
    } finally { setSaving(false); }
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true); setMsg(null);
    try {
      const urls: string[] = [];
      for (const f of files) {
        const url = await adminUploadImage(f, form.id);
        urls.push(url);
      }
      setForm((f) => ({
        ...f,
        images: [...f.images, ...urls],
        main_image: f.main_image || urls[0],
      }));
      toast.success(urls.length > 1 ? `${urls.length} images téléversées` : 'Image téléversée');
    } catch (err: any) {
      toast.error('Téléversement échoué', { description: err.message });
    } finally { setUploading(false); e.target.value = ''; }
  };

  const removeImage = async (url: string) => {
    if (form.id) { try { await adminDeleteImage(form.id, url); } catch {} }
    setForm((f) => ({
      ...f,
      images: f.images.filter((i) => i !== url),
      main_image: f.main_image === url ? (f.images.find((i) => i !== url) || '') : f.main_image,
    }));
    toast.success('Image supprimée');
  };




  if (loading) return <div className="p-10 text-center text-sm text-ink/50">Chargement…</div>;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/admin/produits" className="rounded-lg p-2 text-ink/60 hover:bg-black/5"><ArrowLeft className="h-4 w-4" /></Link>
          <div>
            <h1 className="text-2xl font-semibold text-ink">{isNew ? 'Nouveau produit' : form.name || 'Modifier'}</h1>
            <p className="text-sm text-ink/60">{isNew ? 'Créer un nouveau produit au catalogue' : `ID #${form.id}`}</p>
          </div>
        </div>
        <button onClick={save} disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </button>
      </div>




      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="grid gap-6 lg:col-span-2">
          <Section title="Informations générales">
            <Field label="Nom du produit *">
              <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Slug (URL)">
                <input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="auto-généré" className={inputCls} />
              </Field>
              <Field label="Catégorie *">
                <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
                  {categories.length === 0 && <option value="">— Aucune catégorie —</option>}
                  {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  {form.category && !categories.some((c) => c.name === form.category) && (
                    <option value={form.category}>{form.category}</option>
                  )}
                </select>
              </Field>
            </div>
            <Field label="Description courte">
              <textarea rows={2} value={form.short_description} onChange={(e) => set('short_description', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Description détaillée">
              <textarea rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} className={inputCls} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Homologation">
                <input value={form.homologation} onChange={(e) => set('homologation', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Fiche technique (URL)">
                <input value={form.technical_sheet_url} onChange={(e) => set('technical_sheet_url', e.target.value)} className={inputCls} />
              </Field>
            </div>
          </Section>

          <Section title="Usages" action={
            <button onClick={() => set('usages', [...form.usages, { crop: '', dose: '', target: '' }])}
              className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <Plus className="h-3 w-3" /> Ajouter
            </button>
          }>
            {form.usages.length === 0 && <p className="text-sm text-ink/50">Aucun usage défini.</p>}
            <div className="grid gap-2">
              {form.usages.map((u, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                  <input placeholder="Culture" value={u.crop} onChange={(e) => {
                    const next = [...form.usages]; next[i] = { ...u, crop: e.target.value }; set('usages', next);
                  }} className={inputCls} />
                  <input placeholder="Dose" value={u.dose} onChange={(e) => {
                    const next = [...form.usages]; next[i] = { ...u, dose: e.target.value }; set('usages', next);
                  }} className={inputCls} />
                  <input placeholder="Cible" value={u.target} onChange={(e) => {
                    const next = [...form.usages]; next[i] = { ...u, target: e.target.value }; set('usages', next);
                  }} className={inputCls} />
                  <button onClick={() => set('usages', form.usages.filter((_, j) => j !== i))}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Composition" action={
            <button onClick={() => set('composition', [...form.composition, { name: '', percentage: '' }])}
              className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <Plus className="h-3 w-3" /> Ajouter
            </button>
          }>
            {form.composition.length === 0 && <p className="text-sm text-ink/50">Aucun ingrédient défini.</p>}
            <div className="grid gap-2">
              {form.composition.map((c, i) => (
                <div key={i} className="grid grid-cols-[1fr_140px_auto] gap-2">
                  <input placeholder="Substance active" value={c.name} onChange={(e) => {
                    const next = [...form.composition]; next[i] = { ...c, name: e.target.value }; set('composition', next);
                  }} className={inputCls} />
                  <input placeholder="Pourcentage" value={c.percentage} onChange={(e) => {
                    const next = [...form.composition]; next[i] = { ...c, percentage: e.target.value }; set('composition', next);
                  }} className={inputCls} />
                  <button onClick={() => set('composition', form.composition.filter((_, j) => j !== i))}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Bénéfices" action={
            <button onClick={() => set('benefits', [...form.benefits, ''])}
              className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <Plus className="h-3 w-3" /> Ajouter
            </button>
          }>
            {form.benefits.length === 0 && <p className="text-sm text-ink/50">Aucun bénéfice défini.</p>}
            <div className="grid gap-2">
              {form.benefits.map((b, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto] gap-2">
                  <input placeholder="Ex : Action rapide" value={b} onChange={(e) => {
                    const next = [...form.benefits]; next[i] = e.target.value; set('benefits', next);
                  }} className={inputCls} />
                  <button onClick={() => set('benefits', form.benefits.filter((_, j) => j !== i))}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Right column */}
        <div className="grid gap-6">
          <Section title="Statut">
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={!!form.is_active} onChange={(e) => set('is_active', e.target.checked ? 1 : 0)}
                className="h-4 w-4 rounded" />
              Produit actif (visible sur le site)
            </label>
            <Field label="Tonalité visuelle">
              <select value={form.tone} onChange={(e) => set('tone', e.target.value)} className={inputCls}>
                {TONES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </Section>

          <Section title="Images">
            <label className="mb-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/15 bg-black/[0.02] p-6 text-sm text-ink/60 hover:border-primary hover:text-primary">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? 'Téléversement…' : 'Téléverser des images'}
              <input type="file" multiple accept="image/*" className="hidden" onChange={onFile} />
            </label>
            <div className="grid grid-cols-2 gap-2">
              {form.images.map((url) => (
                <div key={url} className="group relative overflow-hidden rounded-lg border border-black/10 bg-[#EAF1E6]">
                  <img src={url} alt="" className="h-28 w-full object-contain" />
                  <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/60 p-1 opacity-0 transition group-hover:opacity-100">
                    <button title="Définir comme principale" onClick={() => set('main_image', url)}
                      className={`rounded p-1 ${form.main_image === url ? 'text-yellow-300' : 'text-white'} hover:bg-white/10`}>
                      <Star className="h-3.5 w-3.5" fill={form.main_image === url ? 'currentColor' : 'none'} />
                    </button>
                    <button onClick={() => removeImage(url)} className="rounded p-1 text-red-300 hover:bg-white/10">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {form.main_image === url && (
                    <span className="absolute left-1 top-1 rounded-full bg-yellow-400 px-1.5 py-0.5 text-[9px] font-medium text-black">Principale</span>
                  )}
                </div>
              ))}
            </div>
            {form.images.length === 0 && <p className="text-xs text-ink/50">Aucune image téléversée.</p>}
          </Section>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-primary";

function Section({ title, action, children }: any) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-ink">{title}</h3>
        {action}
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: any) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-medium text-ink/70">{label}</span>
      {children}
    </label>
  );
}
