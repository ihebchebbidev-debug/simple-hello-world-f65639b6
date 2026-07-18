import { API } from './config';

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at?: string;
};

const FALLBACK: Category[] = [
  { id: 1, name: 'Fongicides', slug: 'fongicides', description: null, sort_order: 1 },
  { id: 2, name: 'Insecticides', slug: 'insecticides', description: null, sort_order: 2 },
  { id: 3, name: 'Herbicides', slug: 'herbicides', description: null, sort_order: 3 },
  { id: 4, name: 'Engrais', slug: 'engrais', description: null, sort_order: 4 },
  { id: 5, name: 'Biostimulants', slug: 'biostimulants', description: null, sort_order: 5 },
  { id: 6, name: 'Adjuvants', slug: 'adjuvants', description: null, sort_order: 6 },
];

async function j(r: Response) {
  const t = await r.text();
  try { return JSON.parse(t); } catch { throw new Error(t.slice(0, 200)); }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const r = await fetch(API.categoriesList);
    const d = await j(r);
    if (!d.success) throw new Error(d.error);
    return (d.data as Category[]).length ? d.data : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export async function createCategory(payload: { name: string; slug?: string; description?: string; sort_order?: number }) {
  const r = await fetch(API.categoryCreate, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  const d = await j(r); if (!d.success) throw new Error(d.error); return d;
}

export async function updateCategory(payload: { id: number; name?: string; slug?: string; description?: string; sort_order?: number }) {
  const r = await fetch(API.categoryUpdate, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  const d = await j(r); if (!d.success) throw new Error(d.error); return d;
}

export async function deleteCategory(id: number) {
  const r = await fetch(API.categoryDelete(id), { method: 'POST' });
  const d = await j(r); if (!d.success) throw new Error(d.error); return d;
}
