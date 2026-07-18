import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Eye, Handshake, Leaf, ShieldCheck, FlaskConical, Users, Award } from 'lucide-react';
import Seo from '@/components/Seo';
import { Section, SectionHeader, Eyebrow } from '@/components/Section';
import Counter from '@/components/Counter';
import aboutAerial from '@/assets/aerial.jpg';
import aboutExpert from '@/assets/expert.jpg';


const TIMELINE = [
  { y: '2003', t: 'Fondation', d: 'Création d\'Atlas Agricole S.A. par Habib Mabrouk à Tunis.' },
  { y: '2008', t: 'Expansion nationale', d: 'Ouverture d\'un réseau commercial couvrant toutes les régions.' },
  { y: '2014', t: 'Partenariats internationaux', d: 'Accords avec les grands manufacturiers mondiaux.' },
  { y: '2019', t: 'Innovation durable', d: 'Lancement d\'une gamme biostimulants et solutions bio.' },
  { y: '2024', t: '20+ ans d\'expertise', d: '400+ clients, 68 produits, 9 ingénieurs agronomes.' },
];

export default function About() {
  return (
    <>
      <Seo
        title="À propos — Atlas Agricole S.A. | 20+ ans d'expertise agricole en Tunisie"
        description="Atlas Agricole S.A., fondée en 2003, est un acteur majeur de la distribution d'intrants agricoles en Tunisie. Découvrez notre mission, vision et équipe."
        path="/a-propos"
      />

      <section className="bg-grad-soft pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>À propos de nous</Eyebrow>
            <h1 className="mt-5 text-hero font-extrabold text-ink">
              Depuis 2003, nous cultivons <span className="text-primary-700">l'avenir de l'agriculture</span> tunisienne.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/65">
              Atlas Agricole S.A. est spécialisée dans l'importation et la distribution d'intrants
              agricoles pour les agriculteurs professionnels. Notre engagement : allier performance,
              durabilité et proximité pour soutenir chaque exploitation.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="relative">
              <img
                src={aboutAerial}
                alt="Champ agricole"
                className="aspect-[4/3] w-full rounded-hero object-cover shadow-premium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { i: Target, t: 'Notre mission', d: 'Accompagner les agriculteurs tunisiens avec des produits de haute qualité qui améliorent la productivité tout en respectant l\'environnement.' },
            { i: Eye, t: 'Notre vision', d: 'Devenir la référence tunisienne de l\'agriculture durable, en connectant les innovations mondiales aux réalités du terrain.' },
            { i: Handshake, t: 'Nos valeurs', d: 'Confiance, expertise technique, innovation et responsabilité environnementale — au cœur de chaque décision.' },
          ].map(({ i: I, t, d }, idx) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="card p-8"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-50 text-primary-700"><I className="h-6 w-6" /></span>
              <h3 className="mt-5 text-xl font-bold text-ink">{t}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/65">{d}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Company overview */}
      <Section className="bg-white">
        <div className="grid items-start gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader eyebrow="Notre histoire" title="Un savoir-faire construit sur deux décennies." />
          </div>
          <div className="lg:col-span-7">
            <p className="text-[17px] leading-relaxed text-ink/75">
              Fondée en 2003, Atlas Agricole S.A. est aujourd'hui l'un des leaders de la distribution
              d'intrants agricoles en Tunisie. Nous nous appuyons sur des partenariats avec les plus
              grands manufacturiers mondiaux pour proposer des solutions innovantes, adaptées aux
              besoins spécifiques de l'agriculture tunisienne.
            </p>
            <p className="mt-4 text-[17px] leading-relaxed text-ink/75">
              Notre gamme couvre les produits phytosanitaires (fongicides, insecticides, herbicides),
              les engrais, les biostimulants et les adjuvants — soit plus de 60 produits homologués
              utilisés sur l'ensemble des cultures tunisiennes.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { i: Users, v: 400, s: '+', l: 'Clients' },
                { i: Award, v: 68, s: '+', l: 'Produits' },
                { i: FlaskConical, v: 9, s: '', l: 'Ingénieurs' },
                { i: ShieldCheck, v: 20, s: '+', l: 'Années' },
              ].map(({ i: I, v, s, l }) => (
                <div key={l} className="rounded-2xl bg-primary-50/60 p-5">
                  <I className="h-5 w-5 text-primary-700" />
                  <p className="mt-3 text-3xl font-extrabold text-ink"><Counter to={v} suffix={s} /></p>
                  <p className="text-sm text-ink/60">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* TIMELINE */}
      <Section>
        <SectionHeader eyebrow="Notre parcours" title="20+ ans d'engagement pour l'agriculture." />
        <ol className="relative mt-14 border-l-2 border-primary-100 pl-6 md:pl-10">
          {TIMELINE.map((s, i) => (
            <motion.li
              key={s.y}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-10 last:mb-0"
            >
              <span className="absolute -left-[34px] top-1 grid h-6 w-6 place-items-center rounded-full bg-primary text-[10px] font-bold text-white ring-8 ring-surface md:-left-[46px]">
                <Leaf className="h-3 w-3" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary-700">{s.y}</p>
              <h3 className="mt-1 text-xl font-bold text-ink">{s.t}</h3>
              <p className="mt-1 max-w-xl text-ink/65">{s.d}</p>
            </motion.li>
          ))}
        </ol>
      </Section>

      {/* Leadership */}
      <Section className="bg-white">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <img
              src={aboutExpert}
              alt="Direction Atlas Agricole"
              className="aspect-[4/5] w-full rounded-img object-cover shadow-card"
            />
          </div>
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow="Direction"
              title="Une équipe d'agronomes au service du terrain."
              description="Sous la direction de Habib Mabrouk, fondateur et Directeur Général, notre équipe rassemble 20 collaborateurs dont 9 ingénieurs agronomes déployés dans toutes les régions du pays."
            />
            <ul className="mt-8 space-y-3">
              {[
                'Support technique dédié par région',
                'Formation continue des équipes de terrain',
                'Recommandations personnalisées par culture',
                'Suivi de programmes phytosanitaires complets',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] text-ink/80">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" /> {t}
                </li>
              ))}
            </ul>
            <Link to="/contact" className="btn-primary mt-8 w-fit">
              Contacter notre équipe <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
