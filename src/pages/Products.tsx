import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import {
  Grid3x3, Sprout, Shield, Bug, Wheat, Beaker,
  Leaf, ArrowRight, Search, X,
} from 'lucide-react';
import Seo from '@/components/Seo';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES, type Product } from '@/data/products';
import { fetchProducts } from '@/lib/products-api';
import { cn } from '@/lib/cn';
import leafDecor from '@/assets/leaf-decor.png';
import tractorImg from '@/assets/hero.jpg';
import productsHeroBg from '@/assets/products-hero-bg.jpg';

const CAT_ICON: Record<(typeof CATEGORIES)[number], any> = {
  Tous: Grid3x3,
  Fongicides: Shield,
  Insecticides: Bug,
  Herbicides: Wheat,
  Engrais: Sprout,
  Biostimulants: Leaf,
  Adjuvants: Beaker,
};

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const initialCat = (() => {
    const v = searchParams.get('category');
    return v && (CATEGORIES as readonly string[]).includes(v) ? (v as (typeof CATEGORIES)[number]) : 'Tous';
  })();
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>(initialCat);
  const [crop, setCrop] = useState<string>('Toutes cultures');
  const [q, setQ] = useState('');

  useEffect(() => { fetchProducts().then(setProducts); }, []);

  // Sync category from URL (e.g. footer links)
  useEffect(() => {
    const v = searchParams.get('category');
    if (v && (CATEGORIES as readonly string[]).includes(v)) {
      setCat(v as (typeof CATEGORIES)[number]);
    } else if (!v) {
      setCat('Tous');
    }
  }, [searchParams]);

  // Keep URL in sync when user clicks pills
  useEffect(() => {
    const current = searchParams.get('category') ?? '';
    const target = cat === 'Tous' ? '' : cat;
    if (current !== target) {
      const next = new URLSearchParams(searchParams);
      if (target) next.set('category', target); else next.delete('category');
      setSearchParams(next, { replace: true });
    }
     
  }, [cat]);


  const crops = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => p.usages.forEach((u) => s.add(u.crop)));
    return ['Toutes cultures', ...Array.from(s).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) => {
      if (cat !== 'Tous' && p.category !== cat) return false;
      if (crop !== 'Toutes cultures' && !p.usages.some((u) => u.crop === crop)) return false;
      if (needle && !(
        p.name.toLowerCase().includes(needle) ||
        p.shortDescription.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle) ||
        p.usages.some((u) => u.target.toLowerCase().includes(needle) || u.crop.toLowerCase().includes(needle))
      )) return false;
      return true;
    });
  }, [products, cat, crop, q]);

  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: '/' },
          { '@type': 'ListItem', position: 2, name: 'Produits', item: '/produits' },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Catalogue Atlas Agricole',
        numberOfItems: filtered.length,
        itemListElement: filtered.slice(0, 30).map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `/produits/${p.slug}`,
          name: p.name,
        })),
      },
    ],
  }), [filtered]);

  const activeFilters = (cat !== 'Tous') || (crop !== 'Toutes cultures') || q.trim().length > 0;

  return (
    <>
      <Seo
        title="Catalogue produits — Fongicides, Insecticides, Engrais | Atlas Agricole"
        description="Explorez le catalogue Atlas Agricole : fongicides, insecticides, herbicides, engrais, biostimulants et adjuvants. Filtrez par culture (olivier, agrumes, vigne, blé…)."
        path="/produits"
        jsonLd={jsonLd}
      />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden pt-28 pb-10 md:pt-32 md:pb-14">
        <img
          src={productsHeroBg}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/95" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-white/70 via-transparent to-white/70" />
        <img src={leafDecor} alt="" aria-hidden className="pointer-events-none absolute -left-10 top-24 h-40 w-40 -rotate-[20deg] opacity-25" />
        <img src={leafDecor} alt="" aria-hidden className="pointer-events-none absolute right-4 bottom-4 h-32 w-32 rotate-[160deg] opacity-20" />

        <div className="container-x relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.28em] text-primary-700">
              Nos produits premium
              <Leaf className="h-4 w-4" strokeWidth={1.75} />
            </p>
            <h1 className="mt-4 font-display text-[clamp(1.9rem,4.2vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
              Des produits premium pour des <span className="text-primary-700">résultats durables.</span>
            </h1>
            <p className="mt-4 text-[15px] leading-[1.65] text-ink/65">
              Découvrez notre sélection de solutions agricoles de haute qualité,
              sélectionnées pour leur efficacité et leur respect de l'environnement.
            </p>
          </div>
        </div>
      </section>

      {/* ============ FILTER BAR ============ */}
      <section className="sticky top-[68px] z-30 border-y border-black/[0.05] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container-x space-y-4 py-5">
          {/* Category pills */}
          <div className="flex gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((c) => {
              const Icon = CAT_ICON[c];
              const active = cat === c;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all',
                    active
                      ? 'border-primary bg-primary text-white shadow-[0_8px_20px_-8px_rgba(24,94,32,0.5)]'
                      : 'border-black/10 bg-white text-ink/75 hover:border-primary/40 hover:text-primary-700',
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={active ? 2 : 1.75} />
                  {c}
                </button>
              );
            })}
          </div>

          {/* Search + crop select */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" strokeWidth={2} />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un produit, une cible, une matière active…"
                className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-[13.5px] text-ink placeholder:text-ink/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Rechercher un produit"
              />
            </div>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Filtrer par culture"
            >
              {crops.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {activeFilters && (
              <button
                onClick={() => { setCat('Tous'); setCrop('Toutes cultures'); setQ(''); }}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2.5 text-[13px] font-semibold text-ink/70 hover:border-primary/40 hover:text-primary-700"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2} /> Effacer
              </button>
            )}
          </div>

          <p className="text-[12px] font-medium text-ink/50">
            {filtered.length} produit{filtered.length > 1 ? 's' : ''} {activeFilters ? 'correspondant à vos filtres' : 'au catalogue'}
          </p>
        </div>
      </section>

      {/* ============ PRODUCT GRID ============ */}
      <section className="bg-[#FAFAF7] py-16 md:py-20">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>

          {filtered.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-ink/60">Aucun produit ne correspond à ces filtres.</p>
              <button
                onClick={() => { setCat('Tous'); setCrop('Toutes cultures'); setQ(''); }}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white px-5 py-2.5 text-[13px] font-semibold text-primary-700 hover:bg-primary/5"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="pb-24">
        <div className="container-x">
          <div className="relative grid overflow-hidden rounded-[28px] bg-[#0F3123] text-white md:grid-cols-[minmax(0,340px)_1fr] md:items-stretch">
            <div className="relative h-56 md:h-auto">
              <img src={tractorImg} alt="Tracteur au coucher du soleil" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0F3123]" />
              <img src={leafDecor} alt="" aria-hidden className="pointer-events-none absolute -right-4 bottom-4 h-24 w-24 rotate-[30deg] opacity-90" />
            </div>
            <div className="flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12">
              <div className="max-w-xl">
                <h3 className="font-display text-[clamp(1.35rem,2.2vw,1.75rem)] font-bold leading-tight tracking-[-0.01em]">
                  Vous ne trouvez pas le produit qu'il vous faut ?
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-white/70">
                  Notre équipe est là pour vous conseiller et vous proposer la solution adaptée à vos besoins.
                </p>
              </div>
              <Link
                to="/contact"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-semibold text-ink transition-colors hover:bg-accent"
              >
                Demander un conseil
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
