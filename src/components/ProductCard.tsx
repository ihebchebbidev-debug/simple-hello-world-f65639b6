import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Droplets, Shield, Sprout, Tractor } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Product } from '@/data/products';

const TONE: Record<Product['tone'], { bg: string; glow: string; chip: string; chipText: string }> = {
  sage:  { bg: 'bg-white', glow: 'from-[#C9DEB0]/60', chip: 'bg-white/80', chipText: 'text-[#3F6B21]' },
  sand:  { bg: 'bg-white', glow: 'from-[#EBD494]/60', chip: 'bg-white/80', chipText: 'text-[#8A6A15]' },
  mist:  { bg: 'bg-white', glow: 'from-[#BFD8C4]/60', chip: 'bg-white/80', chipText: 'text-[#2E5B36]' },
  clay:  { bg: 'bg-white', glow: 'from-[#EDBE9C]/60', chip: 'bg-white/80', chipText: 'text-[#8A4A1E]' },
  sky:   { bg: 'bg-white', glow: 'from-[#B5CFDE]/60', chip: 'bg-white/80', chipText: 'text-[#215B7A]' },
  stone: { bg: 'bg-white', glow: 'from-[#CFC9B7]/60', chip: 'bg-white/80', chipText: 'text-[#5A4E36]' },
};

const CAT_ICON: Record<string, any> = {
  Fongicides: Shield,
  Insecticides: Shield,
  Herbicides: Droplets,
  Engrais: Sprout,
  Biostimulants: Leaf,
  'Engrais & Biostimulants': Sprout,
  Adjuvants: Tractor,
};

export default function ProductCard({ p }: { p: Product }) {
  const tone = TONE[p.tone] || TONE.sage;
  const CatIcon = CAT_ICON[p.category] || Leaf;

  return (
    <Link
      to={`/produits/${p.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_1px_2px_rgba(20,30,20,0.04),0_10px_28px_-14px_rgba(20,30,20,0.12)] ring-1 ring-black/[0.05] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_1px_2px_rgba(20,30,20,0.04),0_28px_56px_-22px_rgba(20,60,30,0.25)]"
    >
      {/* ===== Packshot stage — TOP, large ===== */}
      <div className={cn('relative aspect-[4/3] w-full overflow-hidden', tone.bg)}>
        {/* soft radial glow behind bottle */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl opacity-60"
          style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.9), transparent 70%)' }}
        />


        {/* category chip — floating top-left */}
        <span className={cn('absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold backdrop-blur-md ring-1 ring-black/[0.04] shadow-sm', tone.chip, tone.chipText)}>
          <CatIcon className="h-3 w-3" strokeWidth={2.2} />
          {p.category}
        </span>

        {/* the packshot */}
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="absolute inset-0 m-auto h-[82%] w-auto max-w-[70%] object-contain drop-shadow-[0_24px_32px_rgba(20,40,20,0.22)] transition-transform duration-700 ease-out group-hover:scale-[1.06] group-hover:-translate-y-1"
        />
      </div>

      {/* ===== Info — BOTTOM ===== */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[19px] font-extrabold leading-tight tracking-tight text-ink">
          {p.name}
        </h3>

        <p className="mt-2.5 line-clamp-2 text-[13px] leading-[1.65] text-ink/60">
          {p.shortDescription}
        </p>

        {/* Voir plus — real CTA */}
        <div className="mt-5 flex items-center justify-between border-t border-black/[0.06] pt-4">
          <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-primary-700 transition-colors group-hover:text-primary">
            Voir plus
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary-700 transition-all group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_8px_16px_-6px_rgba(24,94,32,0.5)]">
            <ArrowRight className="h-4 w-4 -rotate-45 transition-transform group-hover:rotate-0" strokeWidth={2.2} />
          </span>
        </div>
      </div>
    </Link>
  );
}
