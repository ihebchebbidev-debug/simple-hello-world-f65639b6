import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import Seo from '@/components/Seo';
import { Eyebrow } from '@/components/Section';

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <Seo
        title="Contact — Atlas Agricole S.A."
        description="Contactez Atlas Agricole S.A. pour toute demande de devis, information produit ou accompagnement technique."
        path="/contact"
      />

      <section className="bg-grad-soft pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-x grid items-end gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>Contact</Eyebrow>
            <h1 className="mt-5 text-hero font-extrabold text-ink">Parlons de vos <span className="text-primary-700">projets agricoles</span>.</h1>
            <p className="mt-5 max-w-xl text-lg text-ink/65">
              Notre équipe d'ingénieurs agronomes vous répond sous 24h et vous accompagne dans le
              choix des meilleures solutions.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-4">
            {[
              { i: Phone, t: 'Téléphone', d: '72 640 296 / 72 640 396' },
              { i: Mail, t: 'Email', d: 'atlasagricole@planet.tn' },
              { i: MapPin, t: 'Siège', d: 'Zone Industrielle Djebel El Oust, 1111 Zaghouan, Tunisie' },
              { i: MessageCircle, t: 'Fax', d: '72 640 796' },
            ].map(({ i: I, t, d }) => (
              <div key={t} className="card flex items-start gap-4 p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-700"><I className="h-5 w-5" /></span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-ink/50">{t}</p>
                  <p className="mt-1 font-semibold text-ink">{d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-8">
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="card p-8 md:p-10"
            >
              <h2 className="text-2xl font-bold text-ink">Demander un devis</h2>
              <p className="mt-2 text-sm text-ink/60">Renseignez vos besoins, nous revenons vers vous rapidement.</p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label="Nom complet" name="name" required />
                <Field label="Société / Exploitation" name="company" />
                <Field label="Email" name="email" type="email" required />
                <Field label="Téléphone" name="phone" type="tel" />
                <div className="sm:col-span-2">
                  <Field label="Culture / Besoin" name="need" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-ink/70">Message</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full rounded-btn border border-ink/10 bg-white px-4 py-3 text-[15px] focus:border-primary focus:outline-none"
                    placeholder="Décrivez votre besoin…"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary mt-8">
                Envoyer la demande <ArrowRight className="h-4 w-4" />
              </button>

              {sent && (
                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-primary-50 p-4 text-sm text-primary-700">
                  <CheckCircle2 className="h-5 w-5" /> Merci ! Votre demande a bien été envoyée.
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="container-x mt-16">
          <div className="overflow-hidden rounded-hero shadow-card ring-1 ring-black/5">
            <iframe
              title="Localisation Atlas Agricole"
              src="https://www.google.com/maps?q=Tunis&output=embed"
              className="h-[380px] w-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = 'text', required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-ink/70">{label}{required && <span className="text-danger"> *</span>}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-btn border border-ink/10 bg-white px-4 py-3 text-[15px] focus:border-primary focus:outline-none"
      />
    </div>
  );
}
