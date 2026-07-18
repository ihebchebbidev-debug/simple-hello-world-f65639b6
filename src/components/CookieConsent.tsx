import { useEffect, useState } from 'react';
import { Cookie, Shield, X } from 'lucide-react';
import { getConsent, setConsent } from '@/lib/consent';

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // small delay so it doesn't fight the loading screen
    const t = setTimeout(() => { if (!getConsent()) setOpen(true); }, 900);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  const accept = () => { setConsent('accepted'); setOpen(false); };
  const decline = () => { setConsent('declined'); setOpen(false); };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:px-6 sm:pb-6" role="dialog" aria-live="polite" aria-label="Consentement aux cookies">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-black/5 bg-white/95 shadow-2xl backdrop-blur-xl">
        <div className="grid gap-4 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6 sm:p-6">
          <div className="hidden h-12 w-12 place-items-center rounded-xl bg-[#EAF1E6] text-primary sm:grid">
            <Cookie className="h-6 w-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Cookie className="h-4 w-4 text-primary sm:hidden" />
              <h3 className="text-sm font-semibold text-ink">Votre vie privée compte</h3>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink/70">
              Nous utilisons des cookies techniques et des statistiques de visite (pays, appareil, pages consultées) pour améliorer votre expérience sur Atlas Agricole.
              Aucune donnée n'est vendue à des tiers.
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink/50">
              <Shield className="h-3 w-3" />
              Conforme RGPD — vous pouvez modifier votre choix à tout moment.
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <button
              onClick={decline}
              className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-ink/80 transition hover:bg-black/5"
            >
              Refuser
            </button>
            <button
              onClick={accept}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              Accepter tout
            </button>
          </div>
        </div>

        <button
          onClick={decline}
          aria-label="Fermer"
          className="absolute right-3 top-3 rounded-lg p-1.5 text-ink/40 hover:bg-black/5 hover:text-ink sm:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
