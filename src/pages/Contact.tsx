import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, ArrowRight, CircleCheck, AlertCircle, Loader2 } from 'lucide-react';
import { z } from 'zod';
import Seo from '@/components/Seo';
import { Eyebrow } from '@/components/Section';
import { API_BASE } from '@/lib/config';

const CONTACT_API_URL =
  (import.meta.env.VITE_CONTACT_API_URL as string | undefined)?.trim() ||
  `${API_BASE}/contact.php`;

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Nom trop court').max(100),
  company: z.string().trim().max(150).optional().or(z.literal('')),
  email: z.string().trim().email('Email invalide').max(255),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  need: z.string().trim().max(200).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Message trop court (10 caractères min.)').max(2000),
});

type FormState = z.infer<typeof contactSchema>;

const INITIAL: FormState = { name: '', company: '', email: '', phone: '', need: '', message: '' };

export default function Contact() {
  const [values, setValues] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setErrorMsg('');

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormState;
        if (!fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || `Erreur serveur (${res.status})`);
      }
      setStatus('sent');
      setValues(INITIAL);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err?.message || 'Impossible d\'envoyer le message. Réessayez plus tard.');
    }
  };

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
            <form onSubmit={onSubmit} noValidate className="card p-8 md:p-10">
              <h2 className="text-2xl font-bold text-ink">Demander un devis</h2>
              <p className="mt-2 text-sm text-ink/60">Renseignez vos besoins, nous revenons vers vous rapidement.</p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label="Nom complet" name="name" required value={values.name} onChange={set('name')} error={errors.name} />
                <Field label="Société / Exploitation" name="company" value={values.company || ''} onChange={set('company')} error={errors.company} />
                <Field label="Email" name="email" type="email" required value={values.email} onChange={set('email')} error={errors.email} />
                <Field label="Téléphone" name="phone" type="tel" value={values.phone || ''} onChange={set('phone')} error={errors.phone} />
                <div className="sm:col-span-2">
                  <Field label="Culture / Besoin" name="need" value={values.need || ''} onChange={set('need')} error={errors.need} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-ink/70">Message <span className="text-danger">*</span></label>
                  <textarea
                    rows={5}
                    value={values.message}
                    onChange={set('message')}
                    maxLength={2000}
                    className={`w-full rounded-btn border bg-white px-4 py-3 text-[15px] focus:outline-none ${errors.message ? 'border-danger focus:border-danger' : 'border-ink/10 focus:border-primary'}`}
                    placeholder="Décrivez votre besoin…"
                  />
                  {errors.message && <p className="mt-1 text-xs text-danger">{errors.message}</p>}
                </div>
              </div>

              <button type="submit" disabled={status === 'sending'} className="btn-primary mt-8 disabled:opacity-60">
                {status === 'sending' ? (<><Loader2 className="h-4 w-4 animate-spin" /> Envoi…</>) : (<>Envoyer la demande <ArrowRight className="h-4 w-4" /></>)}
              </button>

              {status === 'sent' && (
                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-primary-50 p-4 text-sm text-primary-700">
                  <CircleCheck className="h-5 w-5" /> Merci ! Votre demande a bien été envoyée.
                </div>
              )}
              {status === 'error' && (
                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-danger/10 p-4 text-sm text-danger">
                  <AlertCircle className="h-5 w-5" /> {errorMsg}
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="container-x mt-16">
          <div className="overflow-hidden rounded-hero shadow-card ring-1 ring-black/5">
            <iframe
              title="Localisation Atlas Agricole"
              src="https://www.google.com/maps?ll=36.558917,10.079904&z=11&t=m&hl=fr&gl=TN&mapclient=embed&cid=13886376752818731652&output=embed"
              className="h-[380px] w-full border-0"
              loading="lazy"
            />
          </div>
        </div>
        <div className="container-x mt-24 mb-16">
          <div className="mb-12 text-center">
            <Eyebrow>Sur le terrain</Eyebrow>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-ink">Notre équipe à votre écoute</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-ink/65">
              Toujours proches de vous, nos ingénieurs et technico-commerciaux sillonnent la Tunisie pour vous accompagner au quotidien sur vos exploitations.
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {REPRESENTATIVES.map((rep) => (
              <div key={rep.zone} className="card group relative flex flex-col justify-between overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-premium ring-1 ring-black/5 hover:ring-primary/20">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />
                
                <div className="relative z-10">
                  <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary group-hover:text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h3 className="mb-4 font-bold leading-snug text-ink">{rep.zone}</h3>
                  <p className="font-semibold text-primary-700">{rep.name}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink/50">{rep.role}</p>
                </div>
                
                <div className="relative z-10 mt-6 border-t border-ink/5 pt-4">
                  <a href={`tel:${rep.phone.replace(/[^0-9+]/g, '')}`} className="group/phone flex w-max items-center gap-2 text-sm font-medium text-ink/75 transition-colors hover:text-primary">
                    <Phone className="h-4 w-4 text-ink/40 transition-colors group-hover/phone:text-primary" />
                    {rep.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const REPRESENTATIVES = [
  { zone: 'Ben Arous / Mornag', name: 'Mr Haythem Arfaoui', role: 'Représentant Technico-Commercial', phone: '(+216) 93 946 660' },
  { zone: 'Cap Bon', name: 'Mr Mohamed Yeddis', role: 'Représentant Technico-Commercial', phone: '(+216) 98 646 728' },
  { zone: 'Sahel / Kairouan', name: 'Mr Mehdi Dhaouadi', role: 'Représentant Technico-Commercial', phone: '(+216) 99 521 236' },
  { zone: 'Sfax / Gabes / Sud', name: 'Mr Yasser Karray', role: 'Représentant Technico-Commercial', phone: '(+216) 98 420 843' },
  { zone: 'Kef / Jendouba / Kasserine / Gafsa', name: 'Mr Hamdi Cherni', role: 'Représentant Technico-Commercial', phone: '(+216) 96 014 136' },
  { zone: 'Béja / Siliana / Zaghouan', name: 'Mr Mohamed Salah Gassoumi', role: 'Représentant Technico-Commercial', phone: '(+216) 98 669 651' },
  { zone: 'Bizerte / Manouba / Kalaat Andalous', name: 'Mr Mohamed Nabi', role: 'Représentant Technico-Commercial', phone: '(+216) 97 161 920' },
];

function Field({
  label, name, type = 'text', required = false, value, onChange, error,
}: {
  label: string; name: string; type?: string; required?: boolean;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-ink/70">
        {label}{required && <span className="text-danger"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        maxLength={255}
        className={`w-full rounded-btn border bg-white px-4 py-3 text-[15px] focus:outline-none ${error ? 'border-danger focus:border-danger' : 'border-ink/10 focus:border-primary'}`}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
