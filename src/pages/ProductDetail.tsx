import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, ShieldCheck, Leaf, FlaskConical, CircleCheck,
  Download, ChevronRight, ChevronLeft, Sprout, Search, Expand, X,
} from 'lucide-react';
import Seo from '@/components/Seo';
import { Eyebrow } from '@/components/Section';
import { fetchProduct, fetchProducts } from '@/lib/products-api';
import { CATEGORIES, type Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Lightbox from '@/components/Lightbox';
import { cn } from '@/lib/cn';

/** Tinted background stages — used both for main gallery slides and for the flat detail sections. */
const TONE_FLAT: Record<Product['tone'], string> = {
  sage:  'bg-[#EAF1E6]',
  sand:  'bg-[#F2ECE0]',
  mist:  'bg-[#E8EFEA]',
  clay:  'bg-[#F1E6DE]',
  sky:   'bg-[#E4ECF2]',
  stone: 'bg-[#ECEBE7]',
};

const TONE_STAGES: Record<Product['tone'], string[]> = {
  sage:  ['bg-gradient-to-br from-[#F3F8EF] to-[#E4EFD8]', 'bg-gradient-to-tr from-[#E9F1DC] to-[#F7FBEF]', 'bg-gradient-to-b from-[#EEF6E7] to-[#DDE9CC]'],
  sand:  ['bg-gradient-to-br from-[#FAF3E4] to-[#F5E7C4]', 'bg-gradient-to-tr from-[#F7EBCE] to-[#FDF7E7]', 'bg-gradient-to-b from-[#F9EED4] to-[#EDDBAE]'],
  mist:  ['bg-gradient-to-br from-[#EEF5EE] to-[#DCEBE0]', 'bg-gradient-to-tr from-[#E3EEE4] to-[#F3F9F3]', 'bg-gradient-to-b from-[#E8F1E9] to-[#CFDFD3]'],
  clay:  ['bg-gradient-to-br from-[#FBEDE2] to-[#F5D9C4]', 'bg-gradient-to-tr from-[#F7E1CE] to-[#FEF3E7]', 'bg-gradient-to-b from-[#FAE7D5] to-[#EDC7A6]'],
  sky:   ['bg-gradient-to-br from-[#EAF1F6] to-[#D5E4EE]', 'bg-gradient-to-tr from-[#DFE9F1] to-[#F3F7FB]', 'bg-gradient-to-b from-[#E4EDF3] to-[#C4D6E3]'],
  stone: ['bg-gradient-to-br from-[#F1EFEA] to-[#E4E0D5]', 'bg-gradient-to-tr from-[#EAE6DB] to-[#F6F3EC]', 'bg-gradient-to-b from-[#EDE9DE] to-[#D6D0BE]'],
};

export default function ProductDetail() {
  const { slug = '' } = useParams();
  const [p, setP] = useState<Product | undefined>();
  const [all, setAll] = useState<Product[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  // Related filters
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('Tous');

  useEffect(() => { fetchProduct(slug).then(setP); setActiveSlide(0); }, [slug]);
  useEffect(() => { fetchProducts().then(setAll); }, []);

  const slides = useMemo(() => {
    if (!p) return [];
    const stages = TONE_STAGES[p.tone];
    return stages.map((bg, i) => ({
      src: p.image,
      bg,
      alt: `${p.name} — vue ${i + 1}`,
    }));
  }, [p]);

  const related = useMemo(() => {
    if (!p) return [];
    const needle = q.trim().toLowerCase();
    return all
      .filter((x) => x.slug !== p.slug)
      .filter((x) => cat === 'Tous' ? true : x.category === cat)
      .filter((x) => !needle || x.name.toLowerCase().includes(needle) || x.shortDescription.toLowerCase().includes(needle) || x.category.toLowerCase().includes(needle))
      .slice(0, 6);
  }, [all, p, q, cat]);

  if (!p) {
    return (
      <div className="container-x pt-40 pb-32 text-center">
        <p className="text-ink/60">Chargement du produit…</p>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: p.name,
        description: p.shortDescription,
        category: p.category,
        image: p.image,
        brand: { '@type': 'Brand', name: 'Atlas Agricole S.A.' },
        manufacturer: { '@type': 'Organization', name: 'Atlas Agricole S.A.' },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Homologation', value: p.homologation },
          ...p.usages.map((u) => ({
            '@type': 'PropertyValue', name: `Usage — ${u.crop}`, value: `${u.dose} — ${u.target}`,
          })),
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: '/' },
          { '@type': 'ListItem', position: 2, name: 'Produits', item: '/produits' },
          { '@type': 'ListItem', position: 3, name: p.name, item: `/produits/${p.slug}` },
        ],
      },
    ],
  };

  const benefits = [
    { I: ShieldCheck, t: 'Homologué' },
    { I: FlaskConical, t: 'Qualité laboratoire' },
    { I: Leaf, t: 'Respect des cultures' },
    { I: CircleCheck, t: 'Support technique' },
  ];

  const prevSlide = () => setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % slides.length);

  return (
    <>
      <Seo
        title={`${p.name} — ${p.category} | Atlas Agricole`}
        description={p.shortDescription}
        path={`/produits/${p.slug}`}
        jsonLd={jsonLd}
      />

      {/* Breadcrumb */}
      <section className="pt-24 sm:pt-28 md:pt-32">
        <div className="container-x">
          <nav className="flex flex-wrap items-center gap-y-1 text-[12px] sm:text-[13px] text-ink/45" aria-label="Fil d'Ariane">
            <Link to="/" className="hover:text-primary-700">Accueil</Link>
            <ChevronRight className="mx-1 inline h-3 w-3" strokeWidth={1.5} />
            <Link to="/produits" className="hover:text-primary-700">Produits</Link>
            <ChevronRight className="mx-1 inline h-3 w-3" strokeWidth={1.5} />
            <span className="text-ink/80 truncate max-w-[60vw]">{p.name}</span>
          </nav>
        </div>
      </section>

      {/* ================= HERO — Gallery + Info ================= */}
      <section className="pb-14 pt-6 sm:pb-16 sm:pt-8 md:pb-24 md:pt-10">
        <div className="container-x">
          <div className="grid items-start gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-14">

            {/* ===== Gallery column ===== */}
            <div className="lg:col-span-6">
              {/* Main stage */}
              <div className={cn(
                'group relative flex aspect-[4/5] w-full items-end justify-center overflow-hidden rounded-[28px] sm:rounded-hero p-6 sm:p-10',
                slides[activeSlide].bg,
              )}>
                {/* Top badges */}
                <span className="absolute left-4 top-4 sm:left-6 sm:top-6 rounded-full bg-white/80 px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/70 backdrop-blur ring-1 ring-black/[0.04]">
                  {p.category}
                </span>
                <span className="absolute right-4 top-4 sm:right-6 sm:top-6 rounded-full bg-white/80 px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-primary-800 backdrop-blur ring-1 ring-black/[0.04]">
                  Atlas Agricole
                </span>

                {/* Image (click to zoom) */}
                <button
                  type="button"
                  onClick={() => setLightbox(true)}
                  aria-label="Agrandir l'image"
                  className="relative flex h-full w-full items-center justify-center focus:outline-none"
                >
                  <img
                    key={activeSlide}
                    src={slides[activeSlide].src}
                    alt={slides[activeSlide].alt}
                    className="h-[82%] sm:h-[86%] w-auto max-w-[80%] object-contain drop-shadow-[0_36px_50px_rgba(30,40,30,0.22)] transition-transform duration-500 group-hover:scale-[1.03] animate-in fade-in duration-300"
                  />
                </button>

                {/* Zoom pill */}
                <button
                  type="button"
                  onClick={() => setLightbox(true)}
                  className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-ink/70 ring-1 ring-black/[0.04] backdrop-blur transition hover:bg-white"
                >
                  <Expand className="h-3.5 w-3.5" strokeWidth={2} /> Agrandir
                </button>

                {/* Prev / Next — desktop only, thumbnails handle mobile */}
                {slides.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevSlide}
                      aria-label="Image précédente"
                      className="hidden sm:grid absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 place-items-center rounded-full bg-white/85 text-ink ring-1 ring-black/[0.05] backdrop-blur shadow-sm transition hover:bg-white hover:shadow-md"
                    >
                      <ChevronLeft className="h-5 w-5" strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Image suivante"
                      className="hidden sm:grid absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 place-items-center rounded-full bg-white/85 text-ink ring-1 ring-black/[0.05] backdrop-blur shadow-sm transition hover:bg-white hover:shadow-md"
                    >
                      <ChevronRight className="h-5 w-5" strokeWidth={2} />
                    </button>
                  </>
                )}

              </div>

              {/* Thumbnails */}
              {slides.length > 1 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {slides.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      aria-label={`Voir l'image ${i + 1}`}
                      aria-current={i === activeSlide}
                      className={cn(
                        'relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl ring-1 transition-all',
                        s.bg,
                        i === activeSlide
                          ? 'ring-2 ring-primary shadow-[0_8px_20px_-10px_rgba(24,94,32,0.6)]'
                          : 'ring-black/[0.05] hover:ring-primary/40',
                      )}
                    >
                      <img
                        src={s.src}
                        alt=""
                        aria-hidden
                        className="h-[75%] w-auto max-w-[75%] object-contain drop-shadow-md"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ===== Info column ===== */}
            <div className="lg:col-span-6 lg:pt-4">
              <Eyebrow>{p.category}</Eyebrow>
              <h1 className="mt-4 sm:mt-5 font-display text-[clamp(1.9rem,5.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
                {p.name}
              </h1>
              <p className="mt-5 sm:mt-6 max-w-xl text-[15px] sm:text-[17px] leading-[1.65] text-ink/65">
                {p.description}
              </p>

              {/* Benefit chips */}
              <ul className="mt-6 sm:mt-8 flex flex-wrap gap-2">
                {benefits.map(({ I, t }) => (
                  <li
                    key={t}
                    className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 sm:px-3.5 sm:py-2 text-[12px] sm:text-[13px] font-medium text-primary-800 ring-1 ring-primary-100"
                  >
                    <I strokeWidth={1.5} className="h-4 w-4" /> {t}
                  </li>
                ))}
              </ul>

              {/* Highlights row */}
              <dl className="mt-8 sm:mt-10 grid grid-cols-3 gap-3 sm:gap-6 border-t border-ink/10 pt-6 sm:pt-8">
                <div>
                  <dt className="text-[10px] sm:text-[11px] uppercase tracking-widest text-ink/45">Catégorie</dt>
                  <dd className="mt-1.5 text-[13px] sm:text-[15px] font-semibold text-ink truncate">{p.category}</dd>
                </div>
                <div>
                  <dt className="text-[10px] sm:text-[11px] uppercase tracking-widest text-ink/45">Cultures</dt>
                  <dd className="mt-1.5 text-[13px] sm:text-[15px] font-semibold text-ink">{p.usages.length}</dd>
                </div>
                <div>
                  <dt className="text-[10px] sm:text-[11px] uppercase tracking-widest text-ink/45">Homolog.</dt>
                  <dd className="mt-1.5 text-[13px] sm:text-[15px] font-semibold text-ink truncate">Oui</dd>
                </div>
              </dl>

              {/* CTAs — consistent equal-height row */}
              <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link to="/contact" className="btn-primary w-full justify-center">
                  Demander un devis <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
                <button type="button" className="btn-outline w-full justify-center">
                  <Download className="h-4 w-4" strokeWidth={1.75} /> Fiche technique
                </button>
                <Link to="/produits" className="btn-ghost w-full justify-center sm:col-span-2">
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Retour au catalogue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Usages + Homologation ================= */}
      <section className="border-t border-ink/[0.06] bg-white py-16 sm:py-20 md:py-24">
        <div className="container-x grid gap-12 sm:gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow>Usages recommandés</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-tight text-ink">
              Doses et cultures
            </h2>
            <p className="mt-4 max-w-xl text-[14px] sm:text-[15px] leading-relaxed text-ink/60">
              Recommandations issues de nos essais terrain. Adaptez la dose en
              fonction du stade de la culture et de la pression parasitaire.
            </p>

            <ul className="mt-8 sm:mt-10 divide-y divide-ink/[0.08]">
              {p.usages.map((u, i) => (
                <li key={i} className="grid grid-cols-12 gap-x-3 gap-y-3 py-5 items-baseline">
                  <div className="col-span-2 sm:col-span-1 font-display text-sm font-bold text-primary-700">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="col-span-10 sm:col-span-4">
                    <p className="text-[14px] sm:text-[15px] font-semibold text-ink flex items-center gap-2">
                      <Sprout strokeWidth={1.5} className="h-4 w-4 shrink-0 text-primary-700" /> {u.crop}
                    </p>
                  </div>
                  <div className="col-span-6 col-start-3 sm:col-span-3 sm:col-start-auto">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-ink/40">Dose</p>
                    <p className="mt-1 text-[14px] sm:text-[15px] text-ink/80">{u.dose}</p>
                  </div>
                  <div className="col-span-6 sm:col-span-4">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-ink/40">Cible</p>
                    <p className="mt-1 text-[14px] sm:text-[15px] text-ink/80">{u.target}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-5">
            <div className="space-y-5 lg:sticky lg:top-28">
              <div className={cn('rounded-card p-6 sm:p-7 ring-1 ring-black/[0.04]', TONE_FLAT[p.tone])}>
                <Eyebrow>Homologation</Eyebrow>
                <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-ink/80">
                  {p.homologation}
                </p>
              </div>

              <div className="rounded-card bg-ink p-6 sm:p-7 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
                  Conseil terrain
                </p>
                <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-white/80">
                  Nos ingénieurs agronomes vous accompagnent pour établir un
                  programme adapté à votre exploitation.
                </p>
                <Link
                  to="/contact"
                  className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-white underline underline-offset-4 hover:text-accent"
                >
                  Prendre rendez-vous <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
              </div>

              <div className="rounded-card border border-dashed border-ink/15 p-5 sm:p-6 text-[12px] sm:text-[13px] leading-relaxed text-ink/60">
                Utilisez les produits phytopharmaceutiques avec précaution.
                Avant toute utilisation, lisez l'étiquette et les informations
                concernant le produit.
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ================= Related — with search + filter ================= */}
      <section className="pb-20 pt-16 sm:pb-24 sm:pt-20 bg-[#FAFAF7]">
        <div className="container-x">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>Explorer davantage</Eyebrow>
              <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-tight text-ink">
                Autres produits du catalogue
              </h2>
            </div>
            <Link to="/produits" className="link-under self-start sm:self-auto">
              Voir tout <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>

          {/* Inline search + filters */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" strokeWidth={2} />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un produit…"
                className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-10 text-[13.5px] text-ink placeholder:text-ink/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Rechercher un produit"
              />
              {q && (
                <button
                  onClick={() => setQ('')}
                  aria-label="Effacer la recherche"
                  className="absolute right-3 top-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded-full text-ink/40 hover:bg-black/5 hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              )}
            </div>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value as (typeof CATEGORIES)[number])}
              className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Filtrer par catégorie"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Category pills — horizontal scroll on mobile */}
          <div className="mt-4 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  'shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition',
                  cat === c
                    ? 'border-primary bg-primary text-white'
                    : 'border-black/10 bg-white text-ink/70 hover:border-primary/40 hover:text-primary-700',
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-10 sm:mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => <ProductCard key={r.id} p={r} />)}
          </div>

          {related.length === 0 && (
            <div className="mt-12 text-center">
              <p className="text-ink/60">Aucun produit ne correspond à ces filtres.</p>
              <button
                onClick={() => { setQ(''); setCat('Tous'); }}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white px-5 py-2.5 text-[13px] font-semibold text-primary-700 hover:bg-primary/5"
              >
                Réinitialiser
              </button>
            </div>
          )}
        </div>
      </section>

      <Lightbox
        open={lightbox}
        slides={slides}
        index={activeSlide}
        onClose={() => setLightbox(false)}
        onIndex={setActiveSlide}
      />
    </>
  );
}
