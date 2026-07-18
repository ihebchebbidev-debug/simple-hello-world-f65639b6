import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Phone, Mail } from 'lucide-react';

const SocialIcon = ({ path }: { path: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d={path} /></svg>
);
const SOCIALS = [
  { l: 'Facebook', p: 'M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.5-1.5H16.5V5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.4-3.7 3.9V11H8v3h2.5v7h3z' },
  { l: 'Twitter', p: 'M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1-1.5-1.6-4-1.7-5.6-.2-.9.9-1.3 2.2-1.1 3.5C9 8.5 6 6.9 4 4.4 3 6 3.5 8.1 5 9.1c-.6 0-1.2-.2-1.7-.5 0 1.7 1.2 3.2 2.8 3.5-.5.2-1.1.2-1.6.1.5 1.4 1.8 2.4 3.3 2.5-1.4 1.1-3.1 1.6-4.8 1.4 1.6 1 3.4 1.6 5.3 1.6 6.4 0 9.9-5.3 9.9-9.9V7.1c.7-.5 1.3-1 1.8-1.2z' },
  { l: 'LinkedIn', p: 'M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v13H0V8zm7.5 0H12v1.78c.68-1.03 2.06-2.1 4.28-2.1C21.1 7.68 22 10.05 22 13.4V21h-5v-6.8c0-1.62-.03-3.7-2.25-3.7-2.26 0-2.6 1.76-2.6 3.58V21h-5V8z' },
];
import { cn } from '@/lib/cn';
import logo from '@/assets/atlas-logo.png';

const NAV = [
  { to: '/', label: 'Accueil' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/produits', label: 'Nos produits' },
  { to: '/actualites', label: 'Actualités' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-expo',
        scrolled || open ? 'bg-white/95 shadow-soft backdrop-blur-xl' : 'bg-white',
      )}
    >
      {/* Utility top bar */}
      <div className="hidden border-b border-ink/5 lg:block">
        <div className="container-x flex h-6 items-center justify-between text-[11px] text-ink/60">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <Phone strokeWidth={1.75} className="h-3 w-3 text-primary-600" />
              72 640 296 / 72 640 396
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail strokeWidth={1.75} className="h-3 w-3 text-primary-600" />
              atlasagricole@planet.tn
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-ink/45">Suivez-nous :</span>
            {SOCIALS.map((s) => (
              <a key={s.l} href="#" aria-label={s.l} className="text-ink/50 transition-colors hover:text-primary-700">
                <SocialIcon path={s.p} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x flex h-[80px] items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="Atlas Agricole S.A. accueil">
          <img src={logo} alt="Atlas Agricole S.A." className="h-10 w-auto md:h-11" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative px-4 py-2 text-[15px] font-medium transition-colors duration-300',
                  isActive
                    ? 'text-primary-700 after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:rounded-full after:bg-primary-600'
                    : 'text-ink/75 hover:text-primary-700',
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link to="/contact" className="btn-primary">
            Demande de devis <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-full bg-white/70 text-ink shadow-soft ring-1 ring-black/5 lg:hidden"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile fullscreen */}
      <div
        className={cn(
          'fixed inset-x-0 top-[104px] origin-top overflow-hidden bg-white transition-[max-height,opacity] duration-500 ease-expo lg:hidden',
          open ? 'max-h-[90vh] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <nav className="container-x flex flex-col gap-1 py-6">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between rounded-2xl px-4 py-4 text-lg font-semibold',
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-ink hover:bg-primary-50/70',
                )
              }
            >
              {n.label} <ArrowRight className="h-5 w-5 opacity-40" />
            </NavLink>
          ))}
          <Link to="/contact" className="btn-primary mt-3 w-full">
            Demande de devis <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
