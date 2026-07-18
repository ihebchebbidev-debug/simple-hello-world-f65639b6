import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUp, Phone, Mail, MapPin, Leaf } from 'lucide-react';
import logo from '@/assets/atlas-logo.png';
import fieldImg from '@/assets/hero-field.jpg';
import leafDecor from '@/assets/leaf-decor.png';
import { fetchCategories, type Category } from '@/lib/categories-api';


const Facebook = (p: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.5-1.5H16.5V5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.4-3.7 3.9V11H8v3h2.5v7h3z" />
  </svg>
);
const Twitter = (p: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1C18.1 4.5 17 4 15.8 4c-2.3 0-4.1 1.9-4.1 4.1 0 .3 0 .6.1.9C8.3 8.9 5.2 7.2 3.1 4.7c-.4.6-.6 1.3-.6 2.1 0 1.4.7 2.7 1.8 3.4-.7 0-1.3-.2-1.8-.5v.1c0 2 1.4 3.7 3.3 4.1-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.7 2.1 2.9 3.9 2.9-1.4 1.1-3.2 1.8-5.2 1.8-.3 0-.7 0-1-.1C3.5 19.6 5.7 20.3 8 20.3c7.6 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.2z" />
  </svg>
);
const Linkedin = (p: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v13H0V8zm7.5 0H12v1.78c.68-1.03 2.06-2.1 4.28-2.1C21.1 7.68 22 10.05 22 13.4V21h-5v-6.8c0-1.62-.03-3.7-2.25-3.7-2.26 0-2.6 1.76-2.6 3.58V21h-5V8z" />
  </svg>
);

const NAV_COLS = [
  {
    title: 'Entreprise',
    links: [
      { to: '/a-propos', label: 'À propos' },
      { to: '/a-propos', label: 'Notre mission' },
      { to: '/a-propos', label: 'Nos valeurs' },
      { to: '/a-propos', label: 'Carrières' },
      { to: '/actualites', label: 'Actualités' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { to: '/produits', label: 'Documentation' },
      { to: '/produits', label: 'Fiches techniques' },
      { to: '/produits', label: 'Guides & conseils' },
      { to: '/contact', label: 'FAQ' },
    ],
  },
];

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    fetchCategories()
      .then((cats) => setCategories([...cats].sort((a, b) => a.sort_order - b.sort_order)))
      .catch(() => {});
  }, []);

  const productsCol = {
    title: 'Catégories',
    links: [
      ...categories.slice(0, 6).map((c) => ({
        to: `/produits?category=${encodeURIComponent(c.name)}`,
        label: c.name,
      })),
      { to: '/produits', label: 'Voir tous les produits' },
    ],
  };
  const navCols = [NAV_COLS[0], productsCol, ...NAV_COLS.slice(1)];

  return (

    <footer className="mt-24">
      {/* Top CTA band removed */}

      {/* ============ MAIN DARK FOOTER ============ */}
      <div className="bg-[#0F3123] text-white">
        <div className="container-x pt-8 pb-4">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-3">
              <img src={logo} alt="Atlas Agricole S.A." className="h-10 w-auto brightness-0 invert" style={{ filter: 'brightness(0) invert(1)' }} />
              <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-white/70">
                Spécialiste dans l'importation et la commercialisation d'intrants agricoles
                de haute qualité en Tunisie.
              </p>

              <p className="mt-4 text-[12px] text-white/60">Suivez-nous :</p>
              <div className="mt-3 flex items-center gap-3">
                {[
                  { I: Facebook, l: 'Facebook' },
                  { I: Twitter, l: 'Twitter' },
                  { I: Linkedin, l: 'LinkedIn' },
                ].map(({ I, l }) => (
                  <a
                    key={l}
                    href="#"
                    aria-label={l}
                    className="text-white/80 transition-colors hover:text-accent"
                  >
                    <I className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:col-span-6 lg:gap-6">
              {navCols.map((col) => (
                <div key={col.title}>
                  <h4 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white">
                    {col.title}
                  </h4>
                  <span className="mt-2 block h-px w-8 bg-accent" />
                  <ul className="mt-3 space-y-2 text-[13px]">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link to={l.to} className="text-white/70 transition-colors hover:text-white">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="lg:col-span-3">
              <h4 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white">Contact</h4>
              <span className="mt-2 block h-px w-8 bg-accent" />
              <ul className="mt-3 space-y-3 text-[13px]">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ring-1 ring-white/15">
                    <Phone className="h-3 w-3 text-accent" strokeWidth={2} />
                  </span>
                  <span className="text-white/80">Tél : 72 640 296 / 72 640 396<br />Fax : 72 640 796</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ring-1 ring-white/15">
                    <Mail className="h-3 w-3 text-accent" strokeWidth={2} />
                  </span>
                  <span className="text-white/80">atlasagricole@planet.tn</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ring-1 ring-white/15">
                    <MapPin className="h-3 w-3 text-accent" strokeWidth={2} />
                  </span>
                  <span className="text-white/80">
                    Zone Industrielle Djebel El Oust<br />1111 Zaghouan, Tunisie
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-6 h-px w-full bg-white/10" />

          {/* Bottom bar */}
          <div className="flex flex-col items-start justify-between gap-2 pt-3 text-[12px] text-white/55 md:flex-row md:items-center">
            <p>© {new Date().getFullYear()} Atlas Agricole S.A. Tous droits réservés.</p>
            <div className="flex items-center gap-6">
              <p>
                Développé par{' '}
                <a
                  href="https://ihebchebbi.pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white/80 transition-colors hover:text-white"
                >
                  IHEB CHEBBI
                </a>
              </p>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Retour en haut"
                className="ml-2 grid h-9 w-9 place-items-center rounded-full ring-1 ring-white/20 transition-colors hover:bg-white hover:text-ink"
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
