import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, Leaf, MessageSquare, ClipboardCheck, Sprout,
  TrendingUp, RefreshCw, FlaskConical, ShieldCheck,
  ChevronRight,
} from 'lucide-react';

import Seo from '@/components/Seo';
import { Section, SectionHeader, Eyebrow } from '@/components/Section';
import Counter from '@/components/Counter';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/data/products';
import {
  IconLeaf, IconSprout, IconUsers, IconGlobeLeaf, IconBadgeCheck,
  IconShieldLeaf, IconFlask, IconHandshake, IconSend, IconMessage,
} from '@/components/icons/AtlasIcons';
import heroField from '@/assets/hero-field.jpg';
import handsPlant from '@/assets/hands-plant.jpg';
import leafDecor from '@/assets/leaf-decor.png';
import expertiseImg from '@/assets/expertise.jpg';
import approachBg from '@/assets/approach-bg.jpg';
import detailImg from '@/assets/detail.jpg';
import iconLocal from '@/assets/icon-local.png';
import iconTechnology from '@/assets/icon-technology.png';
import iconSustainability from '@/assets/icon-sustainability.png';
import iconPartnership from '@/assets/icon-partnership.png';
import PartnersMarquee from '@/components/PartnersMarquee';


const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.06, ease } }),
};

function LineIcon({ Icon }: { Icon: any }) {
  return (
    <span className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-primary-100 bg-primary-50/60 text-primary-700">
      <Icon strokeWidth={1.5} className="h-[18px] w-[18px]" />
    </span>
  );
}

/** Hero leaves — subtle static decor with soft parallax. No spinning. */
function HeroLeaves({ targetRef }: { targetRef: React.RefObject<HTMLElement> }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);
  const o = useTransform(scrollYProgress, [0, 0.75, 1], [0.9, 0.6, 0]);

  const common = 'pointer-events-none absolute select-none';

  return (
    <>
      <motion.img
        src={leafDecor} alt="" aria-hidden
        style={{ y: y1, opacity: o, rotate: -18 }}
        className={`${common} -left-6 top-6 h-16 w-16 sm:h-20 sm:w-20 md:-left-10 md:top-10 md:h-28 md:w-28`}
      />
      <motion.img
        src={leafDecor} alt="" aria-hidden
        style={{ y: y2, opacity: o, rotate: 140 }}
        className={`${common} -bottom-2 right-6 h-14 w-14 sm:right-14 sm:h-20 sm:w-20 md:h-24 md:w-24`}
      />
    </>
  );
}


export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  return (
    <>
      <Seo
        title="Atlas Agricole S.A. — Intrants agricoles premium en Tunisie"
        description="Depuis 2003, Atlas Agricole accompagne les agriculteurs tunisiens avec des solutions phytosanitaires, nutritionnelles et biostimulantes de qualité internationale."
        path="/"
      />

      {/* HERO — split with curved-left field image flush to right edge on desktop */}
      <section ref={heroRef} className="relative overflow-hidden bg-surface pt-28 sm:pt-32 md:pt-36">
        <div className="container-x">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Copy */}
            <div className="relative z-10 lg:col-span-6 lg:pt-6">
              {/* soft ambient glow behind headline */}
              <div aria-hidden className="pointer-events-none absolute -left-16 -top-10 h-72 w-72 rounded-full bg-primary-100/60 blur-3xl" />

              <motion.span
                initial="hidden" animate="show" variants={fadeUp}
                className="relative inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-700"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                Agriculture durable
              </motion.span>

              <motion.h1
                initial="hidden" animate="show" variants={fadeUp} custom={1}
                className="relative mt-6 font-display text-[clamp(2.25rem,4.6vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.025em] text-ink"
              >
                Intrants agricoles{' '}
                <span className="text-primary-600">de qualité internationale</span>,
                pour l'agriculture tunisienne.
              </motion.h1>

              <motion.p
                initial="hidden" animate="show" variants={fadeUp} custom={2}
                className="relative mt-6 max-w-lg text-[16px] leading-[1.7] text-ink/65"
              >
                Depuis 2003, Atlas Agricole importe et distribue des solutions
                phytosanitaires, nutritionnelles et biostimulantes homologuées,
                avec l'accompagnement technique de nos ingénieurs agronomes.
              </motion.p>


              <motion.div
                initial="hidden" animate="show" variants={fadeUp} custom={3}
                className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
              >
                <Link to="/produits" className="btn-primary w-full justify-center sm:w-auto">
                  Découvrir nos produits <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
                <Link
                  to="/a-propos"
                  className="inline-flex w-full items-center justify-center rounded-btn border border-ink/15 bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-primary-600 hover:text-primary-700 sm:w-auto"
                >
                  En savoir plus
                </Link>
              </motion.div>
            </div>

            {/* Image — flush to the right edge of the viewport on desktop */}
            <div className="relative lg:col-span-6">
              <div className="relative lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[calc(50vw+24px)] lg:pr-0">
                <div
                  className="relative h-[280px] w-full overflow-hidden rounded-[48px] shadow-premium sm:h-[380px] md:h-[520px] lg:h-[620px] lg:rounded-none lg:rounded-l-[160px]"
                >
                  <img
                    src={heroField}
                    alt="Champ agricole tunisien au coucher du soleil"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Parallax leaves — drift downward as user scrolls */}
                <HeroLeaves targetRef={heroRef} />
              </div>
              {/* Placeholder to preserve grid height on desktop when image is absolute */}
              <div className="hidden lg:block lg:h-[620px]" aria-hidden />
            </div>
          </div>

          {/* Floating stats card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease }}
            className="relative z-20 mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-2 rounded-3xl bg-white p-4 shadow-premium ring-1 ring-black/5 md:mt-14 md:grid-cols-4 md:gap-0 md:p-6"
          >
            {[
              { I: IconUsers, k: '+400', l: 'Clients directs' },
              { I: IconLeaf, k: '+60', l: 'Produits' },
              { I: IconGlobeLeaf, k: 'Partenaires', l: 'du monde entier' },
              { I: IconBadgeCheck, k: 'Qualité', l: 'certifiée' },
            ].map((s, i) => (
              <div
                key={s.l}
                className={`flex items-center gap-4 px-2 py-3 md:px-6 ${
                  i > 0 ? 'md:border-l md:border-ink/10' : ''
                }`}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-600">
                  <s.I className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-display text-xl font-extrabold leading-tight text-ink md:text-2xl">
                    {s.k}
                  </p>
                  <p className="text-[13px] text-ink/55">{s.l}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* À PROPOS DU PROJET — editorial white card */}
      <Section className="!pt-8 md:!pt-12">
        <div className="rounded-[32px] bg-white p-8 shadow-soft ring-1 ring-black/5 md:p-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Text */}
            <div>
              <h2 className="inline-flex items-center gap-2 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-tight text-ink">
                À propos du projet
                <Leaf strokeWidth={1.75} className="h-6 w-6 text-primary-600" />
              </h2>
              <div className="mt-6 space-y-5 text-[15.5px] leading-[1.7] text-ink/65">
                <p>
                  Atlas Agricole S.A. conçoit une expérience digitale premium
                  mettant en valeur son expertise, la qualité de ses produits
                  et son engagement pour une agriculture durable en Tunisie.
                </p>
                <p>
                  Le nouveau design propose une interface moderne, épurée
                  et intuitive, pensée pour inspirer confiance et faciliter
                  la prise de contact.
                </p>
              </div>
            </div>

            {/* Image with floating badge */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-[28px] shadow-card ring-1 ring-black/5">
                <img
                  src={handsPlant}
                  alt="Mains tenant une jeune pousse et de la terre"
                  loading="lazy"
                  className="aspect-[5/4] w-full object-cover"
                />
              </div>
              <div className="absolute -left-3 top-8 grid h-16 w-16 place-items-center rounded-full bg-primary-600 text-white shadow-premium ring-4 ring-white md:-left-6 md:h-20 md:w-20">
                <Leaf strokeWidth={1.75} className="h-7 w-7 md:h-9 md:w-9" />
              </div>
            </div>
          </div>

          {/* Objectifs */}
          <div className="mt-14 border-t border-ink/8 pt-10">
            <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink">
              Objectifs
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { I: IconShieldLeaf, t: 'Renforcer', s: 'la confiance' },
                { I: IconSend, t: 'Mettre en avant', s: 'les produits' },
                { I: IconMessage, t: 'Faciliter la prise', s: 'de contact' },
                { I: IconHandshake, t: "Valoriser l'expertise", s: 'et les partenariats' },
              ].map((o) => (
                <div
                  key={o.t}
                  className="group flex flex-col items-center rounded-2xl border border-ink/8 bg-white px-4 py-8 text-center transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-card"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                    <o.I className="h-7 w-7" />
                  </span>
                  <p className="mt-5 text-[15px] font-bold text-ink">{o.t}</p>
                  <p className="text-[13.5px] text-ink/55">{o.s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* PARTNERS */}
      <Section className="!py-6 md:!py-8">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/40">
          Partenaires internationaux
        </p>
        <div className="mt-4">
          <PartnersMarquee />
        </div>
      </Section>



      {/* APPROACH — numbered process */}
      <Section className="!pt-8">
        <SectionHeader
          eyebrow="Notre approche"
          title={<>Une méthode simple,<br /><span className="text-primary-700">des résultats durables.</span></> as any}
          description="De l'écoute à la croissance, cinq étapes qui structurent chaque collaboration avec Atlas Agricole."
          align="center"
        />
        <div className="relative mt-8">
          {/* Connector line (desktop) */}
          <div className="pointer-events-none absolute left-0 right-0 top-[76px] hidden h-px border-t border-dashed border-ink/15 md:block" />
          <div className="grid gap-6 md:grid-cols-5 md:gap-4">
            {[
              { n: '01', I: MessageSquare, t: 'Écoute & conseil', d: "Nous analysons vos besoins et vos objectifs pour proposer les meilleures solutions." },
              { n: '02', I: ClipboardCheck, t: 'Solutions sur mesure', d: 'Des produits adaptés à votre culture, votre sol et votre environnement.' },
              { n: '03', I: Sprout, t: 'Mise en œuvre', d: "Un accompagnement dans l'application et le suivi de nos solutions sur le terrain." },
              { n: '04', I: TrendingUp, t: 'Suivi & performance', d: "Nous mesurons les résultats et ajustons nos recommandations pour plus d'efficacité." },
              { n: '05', I: RefreshCw, t: 'Croissance durable', d: 'Des solutions innovantes pour des récoltes durables et une agriculture tournée vers l\'avenir.' },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08, duration: 0.6, ease }}
                className="relative rounded-card bg-white p-6 text-center shadow-soft ring-1 ring-black/[0.04]"
              >
                <span className="num-chip mx-auto">{s.n}</span>
                <s.I strokeWidth={1.5} className="mx-auto mt-5 h-7 w-7 text-primary-700" />
                <h3 className="mt-4 text-[15px] font-bold text-ink">{s.t}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/60">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* EXPERTISE — compact full-bleed background image with green overlay */}
      <section className="relative isolate overflow-hidden py-5 md:py-7">
        {/* Background image */}
        <img
          src={expertiseImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        {/* Green overlays — no black */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-900/92 via-primary-800/85 to-primary-700/80" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(67,160,71,0.28),transparent_55%)]" />

        <div className="container-x">
          <div className="grid items-center gap-5 lg:grid-cols-12 lg:gap-8">
            {/* Compact stats card */}
            <div className="relative lg:col-span-4">
              <div className="rounded-card border border-white/15 bg-white/10 p-3.5 text-white shadow-premium backdrop-blur-md">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/90 text-primary-900">
                  <img src={iconSustainability} alt="" className="h-4 w-4 object-contain" />
                </span>
                <h3 className="mt-2 font-display text-sm font-bold leading-snug text-white">
                  Innovation locale, impact durable.
                </h3>
                <div className="mt-2.5 grid grid-cols-3 gap-2 border-t border-white/15 pt-2.5 text-white">
                  <div>
                    <div className="font-display text-sm font-extrabold">20+</div>
                    <div className="text-[9px] uppercase tracking-wider text-white/70">Années</div>
                  </div>
                  <div>
                    <div className="font-display text-sm font-extrabold">60+</div>
                    <div className="text-[9px] uppercase tracking-wider text-white/70">Produits</div>
                  </div>
                  <div>
                    <div className="font-display text-sm font-extrabold">400+</div>
                    <div className="text-[9px] uppercase tracking-wider text-white/70">Clients</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0 lg:col-span-8">
              <h2 className="break-words font-display text-[clamp(1.375rem,2.6vw,2rem)] font-extrabold leading-[1.12] text-white">
                Une expertise locale, <span className="text-accent">un impact global.</span>
              </h2>
              <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-white/90">
                Des solutions performantes pour les agriculteurs tunisiens.
              </p>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { icon: iconLocal, t: 'Expertise locale' },
                  { icon: iconTechnology, t: 'Technologies avancées' },
                  { icon: iconSustainability, t: 'Engagement durable' },
                  { icon: iconPartnership, t: 'Partenariats solides' },
                ].map((f) => (
                  <div key={f.t} className="group flex min-w-0 items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 backdrop-blur-sm transition-colors hover:border-accent/50 hover:bg-white/10">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 ring-1 ring-white/20">
                      <img src={f.icon} alt="" className="h-4 w-4 object-contain" />
                    </span>
                    <h4 className="break-words text-[13px] font-semibold text-white">{f.t}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* FEATURED PRODUCTS */}
      <Section className="bg-white">
        <div className="grid gap-6 lg:grid-cols-[1fr,auto] lg:items-end lg:gap-10">
          <SectionHeader
            eyebrow="Nos produits"
            title="Une gamme complète pour toutes vos cultures."
            description="Plus de 60 produits homologués couvrant la protection des cultures, la nutrition et la biostimulation."
          />
          <Link to="/produits" className="link-under self-start lg:self-end">
            Voir le catalogue <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {(showAllProducts ? PRODUCTS : PRODUCTS.slice(0, 6)).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
        {PRODUCTS.length > 6 && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllProducts((s) => !s)}
              className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-6 py-3 text-[14px] font-semibold text-primary-700 shadow-sm transition-all hover:bg-primary-50 hover:shadow-md"
            >
              {showAllProducts ? 'Voir moins' : 'Voir plus'}
              <ChevronRight className={`h-4 w-4 transition-transform ${showAllProducts ? 'rotate-90' : ''}`} strokeWidth={1.75} />
            </button>
          </div>
        )}
      </Section>

      {/* NUMBERS BAND — image background */}
      <section className="relative overflow-hidden">
        <img
          src={approachBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-primary-900/85" />
        <div className="container-x relative py-6 text-white md:py-8">
          <div className="max-w-2xl">
            <Eyebrow>
              <span className="text-accent">En chiffres</span>
            </Eyebrow>
            <h2 className="mt-2 font-display text-section font-extrabold text-white">
              Vingt ans de terrain,<br />au service des agriculteurs.
            </h2>
          </div>
          <div className="mt-5 grid gap-y-4 gap-x-8 sm:grid-cols-2 md:grid-cols-4">
            {[
              { v: 400, s: '+', l: 'Clients satisfaits' },
              { v: 68, s: '+', l: 'Produits disponibles' },
              { v: 15, s: '+', l: 'Partenaires internationaux' },
              { v: 100, s: '%', l: 'Qualité certifiée' },
            ].map((k) => (
              <div key={k.l} className="border-t border-white/15 pt-3">
                <p className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                  <Counter to={k.v} suffix={k.s} />
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/60">{k.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY ATLAS — editorial with side image */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <Eyebrow>Pourquoi Atlas</Eyebrow>
              <h2 className="mt-4 text-section font-extrabold text-ink">
                Quatre engagements pour la réussite de nos partenaires.
              </h2>
              <div className="mt-8 overflow-hidden rounded-card ring-1 ring-black/5">
                <img
                  src={detailImg}
                  alt="Épi de blé au petit matin"
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="divide-y divide-ink/10">
              {[
                { I: ShieldCheck, t: 'Confiance', d: '20+ ans au service des agriculteurs tunisiens, avec la même exigence de qualité et de traçabilité sur chaque référence.' },
                { I: FlaskConical, t: 'Expertise scientifique', d: '9 ingénieurs agronomes dédiés au conseil technique de terrain, formés en continu aux dernières avancées.' },
                { I: Sprout, t: 'Innovation', d: 'Des solutions à la pointe issues de partenariats mondiaux avec les leaders de la protection et de la nutrition végétale.' },
                { I: Leaf, t: 'Durabilité', d: 'Une agriculture plus responsable, respectueuse de l\'environnement et des ressources tunisiennes.' },
              ].map(({ I, t, d }, idx) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: idx * 0.06, duration: 0.6, ease }}
                  className="grid grid-cols-[auto,1fr] gap-6 py-8 first:pt-0"
                >
                  <LineIcon Icon={I} />
                  <div>
                    <h3 className="text-xl font-bold text-ink">{t}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink/65">{d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* COVERAGE — regions & cultures served (replaces generic testimonials) */}
      <Section className="bg-white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow>Sur le terrain</Eyebrow>
            <h2 className="mt-4 text-section font-extrabold text-ink">
              Une présence de proximité,<br />
              <span className="text-primary-700">de Bizerte à Médenine.</span>
            </h2>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink/65">
              Nos ingénieurs agronomes se déplacent sur les exploitations pour
              diagnostiquer, recommander et suivre la mise en œuvre. Le conseil
              technique fait partie du produit.
            </p>
            <Link to="/contact" className="link-under mt-6 inline-flex">
              Prendre rendez-vous avec un ingénieur
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                'Sfax', 'Nabeul', 'Béja', 'Kairouan', 'Sousse',
                'Bizerte', 'Médenine', 'Zaghouan', 'Jendouba',
              ].map((r) => (
                <div
                  key={r}
                  className="rounded-2xl border border-ink/8 bg-surface px-4 py-3 text-[14px] font-medium text-ink/80"
                >
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-primary-500 align-middle" />
                  {r}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-ink/8 bg-surface p-5">
              <p className="text-[13px] uppercase tracking-[0.18em] text-ink/45">Cultures couvertes</p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/75">
                Céréales · Oliviers · Maraîchage · Agrumes · Arboriculture · Vigne · Cultures protégées
              </p>
            </div>
          </div>
        </div>
      </Section>


      {/* CTA */}
      <Section>
        <div className="relative overflow-hidden rounded-hero bg-ink">
          <img
            src={expertiseImg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
          <div className="relative grid items-center gap-10 p-8 md:grid-cols-2 md:p-16">
            <div className="text-white">
              <Eyebrow><span className="text-accent">Contact</span></Eyebrow>
              <h2 className="mt-4 font-display text-section font-extrabold text-white">Un projet, une culture, une question ?</h2>
              <p className="mt-4 max-w-lg text-white/75">
                Décrivez-nous votre exploitation. Un ingénieur vous rappelle
                pour construire un programme adapté à votre terroir.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 md:justify-end">
              <Link to="/contact" className="btn-primary">
                Demander un devis <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              <Link to="/produits" className="btn-outline !border-white/25 !text-white hover:!border-white">
                Voir les produits
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
