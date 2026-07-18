import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

type Slide = { src: string; bg: string; alt: string };

export default function Lightbox({
  open,
  slides,
  index,
  onClose,
  onIndex,
}: {
  open: boolean;
  slides: Slide[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const prev = useCallback(() => onIndex((index - 1 + slides.length) % slides.length), [index, slides.length, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % slides.length), [index, slides.length, onIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, prev, next]);

  if (!open) return null;
  const s = slides[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Galerie produit"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/85 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Fermer"
        className="absolute right-4 top-4 sm:right-6 sm:top-6 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
      >
        <X className="h-5 w-5" strokeWidth={2} />
      </button>

      {/* Counter */}
      <span className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-white/80 ring-1 ring-white/15 backdrop-blur">
        {index + 1} / {slides.length}
      </span>

      {/* Prev */}
      {slides.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label="Image précédente"
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2} />
        </button>
      )}

      {/* Slide stage */}
      <div
        className={cn('relative flex h-full max-h-[80vh] w-full max-w-4xl items-center justify-center overflow-hidden rounded-[28px]', s.bg)}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={index}
          src={s.src}
          alt={s.alt}
          className="max-h-[75vh] w-auto max-w-[85%] object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.35)] animate-in zoom-in-95 fade-in duration-300"
        />
      </div>

      {/* Next */}
      {slides.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label="Image suivante"
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
        >
          <ChevronRight className="h-6 w-6" strokeWidth={2} />
        </button>
      )}

      {/* Thumbs */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2" onClick={(e) => e.stopPropagation()}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => onIndex(i)}
              aria-label={`Aller à l'image ${i + 1}`}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === index ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
