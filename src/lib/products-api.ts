import { type Product } from '@/data/products';
import { API } from './config';

// Raw shape returned by PHP backend
export type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  category: string;
  tone: string;
  short_description: string | null;
  description: string | null;
  homologation: string | null;
  main_image: string | null;
  images: string[];
  usages: { crop: string; dose: string; target: string }[];
  composition: { name: string; percentage: string }[];
  benefits: string[];
  technical_sheet_url: string | null;
  is_active: number;
  created_at?: string;
  updated_at?: string;
};

const VALID_TONES = ['sage', 'sand', 'mist', 'clay', 'sky', 'stone'] as const;

function normalizeImage(url: string | null | undefined): string {
  if (!url) return '';
  if (url.includes('/uploads/')) {
    const filename = url.split('/uploads/').pop();
    if (filename) {
      return `http://draminesaid.com/directadmin/atlasagricol/backend/uploads/${filename}`;
    }
  }
  return url;
}

function normalize(p: ApiProduct): Product {
  const tone = (VALID_TONES.includes(p.tone as any) ? p.tone : 'sage') as Product['tone'];
  const mainImg = normalizeImage(p.main_image || p.images?.[0]);
  const images = (p.images || []).map(normalizeImage);
  return {
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    category: p.category as Product['category'],
    tone,
    shortDescription: p.short_description || '',
    description: p.description || '',
    image: mainImg,
    homologation: p.homologation || '',
    usages: Array.isArray(p.usages) ? p.usages : [],
    // extras (typed loosely on Product)
    images,
    composition: p.composition || [],
    benefits: p.benefits || [],
    technical_sheet_url: p.technical_sheet_url || undefined,
    is_active: p.is_active,
    apiId: p.id,
  } as Product;
}

async function safeJson(r: Response) {
  const t = await r.text();
  try { return JSON.parse(t); } catch { throw new Error(t.slice(0, 200)); }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const r = await fetch(API.productsList);
    const j = await safeJson(r);
    if (!j.success) throw new Error(j.error || 'API error');
    return (j.data as ApiProduct[]).map(normalize);
  } catch (e) {
    console.warn('[products-api] error fetching products:', e);
    return [];
  }
}

export async function fetchProduct(slug: string): Promise<Product | undefined> {
  try {
    const r = await fetch(API.productGet(slug));
    const j = await safeJson(r);
    if (!j.success) throw new Error(j.error || 'not found');
    return normalize(j.data as ApiProduct);
  } catch (e) {
    console.warn('[products-api] error fetching product:', e);
    return undefined;
  }
}

// ============= Admin CRUD =============

export type ProductPayload = {
  id?: number;
  name: string;
  slug?: string;
  category: string;
  tone?: string;
  short_description?: string;
  description?: string;
  homologation?: string;
  main_image?: string | null;
  images?: string[];
  usages?: { crop: string; dose: string; target: string }[];
  composition?: { name: string; percentage: string }[];
  benefits?: string[];
  technical_sheet_url?: string;
  is_active?: number;
};

export async function adminListProducts(): Promise<ApiProduct[]> {
  const r = await fetch(`${API.productsList}?include_inactive=1`);
  const j = await safeJson(r);
  if (!j.success) throw new Error(j.error);
  return j.data;
}

export async function adminGetProduct(id: number): Promise<ApiProduct> {
  const r = await fetch(API.productGet(String(id), true));
  const j = await safeJson(r);
  if (!j.success) throw new Error(j.error);
  return j.data;
}

export async function adminCreateProduct(payload: ProductPayload) {
  const r = await fetch(API.productCreate, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const j = await safeJson(r);
  if (!j.success) throw new Error(j.error);
  return j;
}

export async function adminUpdateProduct(payload: ProductPayload) {
  const r = await fetch(API.productUpdate, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const j = await safeJson(r);
  if (!j.success) throw new Error(j.error);
  return j;
}

export async function adminDeleteProduct(id: number) {
  const r = await fetch(API.productDelete(id), { method: 'POST' });
  const j = await safeJson(r);
  if (!j.success) throw new Error(j.error);
  return j;
}

export async function adminUploadImage(file: File, productId?: number): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  if (productId) fd.append('product_id', String(productId));
  const r = await fetch(API.imageUpload, { method: 'POST', body: fd });
  const j = await safeJson(r);
  if (!j.success) throw new Error(j.error);
  return j.url as string;
}

export async function adminDeleteImage(productId: number, url: string) {
  const r = await fetch(API.imageDelete, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, url }),
  });
  const j = await safeJson(r);
  if (!j.success) throw new Error(j.error);
  return j;
}

// ============= Visitors =============

export type Visitor = {
  id: number;
  ip_address: string;
  country: string | null;
  region: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  user_agent: string | null;
  page_url: string | null;
  referrer: string | null;
  language: string | null;
  screen_size: string | null;
  visited_at: string;
};

export type VisitorStats = {
  total: number;
  unique_ips: number;
  today: number;
  this_week: number;
  this_month: number;
  by_country: { country: string; count: number }[];
  by_device: { device_type: string; count: number }[];
  by_browser: { browser: string; count: number }[];
  by_region: { country: string; region: string; count: number }[];
  last_7_days: { day: string; count: number }[];
};

export async function adminListVisitors(limit = 200, offset = 0) {
  const r = await fetch(`${API.visitorsList}?limit=${limit}&offset=${offset}`);
  const j = await safeJson(r);
  if (!j.success) throw new Error(j.error);
  return j as { success: true; data: Visitor[]; total: number };
}

export async function adminVisitorStats() {
  const r = await fetch(API.visitorsStats);
  const j = await safeJson(r);
  if (!j.success) throw new Error(j.error);
  return j.data as VisitorStats;
}
