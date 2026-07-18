import { useEffect, useState } from 'react';
import logo from '@/assets/atlas-logo.png';
import loadingBg from '@/assets/loading-bg.jpg';

const DURATION_MS = 1800;

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION_MS);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const t1 = setTimeout(() => setFading(true), DURATION_MS);
    const t2 = setTimeout(() => setGone(true), DURATION_MS + 600);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  const pct = Math.round(progress * 100);
  const R = 54;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - progress);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-white transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden={fading}
      role="status"
      aria-label="Chargement Atlas Agricole"
    >
      {/* Background image — covers desktop & mobile */}
      <img
        src={loadingBg}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Soft white wash to keep center airy on all viewports */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.55)_45%,rgba(255,255,255,0.15)_100%)]" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Logo */}
        <img
          src={logo}
          alt="Atlas Agricole S.A."
          className="h-16 w-auto animate-fade-in sm:h-20 md:h-24"
        />

        {/* Circular progress */}
        <div className="relative mt-14 h-32 w-32 sm:h-36 sm:w-36">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="#2f6b3a"
              strokeOpacity="0.15"
              strokeWidth="4"
            />
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="#2f6b3a"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 80ms linear' }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-2xl font-light tabular-nums text-ink/60 sm:text-3xl">
              {pct}%
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p className="mt-16 font-display text-base italic text-ink/40 sm:text-lg">
          Cultivons l'excellence…
        </p>
      </div>
    </div>
  );
}
