import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Leaf, Users, Lightbulb, Handshake, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '@/components/Seo';
import { Section, SectionHeader, Eyebrow } from '@/components/Section';
import expert from '@/assets/expert.jpg';

const VALUES = [
  { i: ShieldCheck, t: 'Confiance', d: 'Nos engagements sont tenus. Nos produits sont conformes. Nos conseils sont honnêtes.' },
  { i: Award, t: 'Expertise', d: '20+ ans d\'expérience et 9 ingénieurs agronomes au service du terrain tunisien.' },
  { i: Lightbulb, t: 'Innovation', d: 'Nous rapprochons les innovations mondiales des besoins réels de nos agriculteurs.' },
  { i: Leaf, t: 'Responsabilité', d: 'La durabilité environnementale guide chacune de nos recommandations.' },
  { i: Handshake, t: 'Proximité', d: 'Nous privilégions la relation de terrain, humaine et durable.' },
  { i: Users, t: 'Collectif', d: 'La réussite se construit en équipe : clients, partenaires et collaborateurs.' },
];

export default function NosValeurs() {
  return (
    <>
      <Seo title="Nos valeurs — Atlas Agricole S.A." description="Les valeurs qui guident Atlas Agricole : confiance, expertise, innovation, responsabilité, proximité et collectif." path="/nos-valeurs" />

      <section className="bg-grad-soft pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>Nos valeurs</Eyebrow>
            <h1 className="mt-5 text-hero font-extrabold text-ink">
              Ce qui nous fait <span className="text-primary-700">avancer</span>, chaque jour.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/65">
              Six valeurs ancrées dans notre culture d'entreprise et vécues sur le terrain
              par toutes nos équipes, du siège aux exploitations.
            </p>
          </div>
          <div className="lg:col-span-5">
            <img src={expert} alt="Équipe Atlas Agricole" className="aspect-[4/5] w-full rounded-hero object-cover shadow-premium" />
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VALUES.map(({ i: I, t, d }, idx) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="card group p-8"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary group-hover:text-white">
                <I className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-ink">{t}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/65">{d}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <SectionHeader eyebrow="Notre culture" title="Des valeurs qui se vivent, se mesurent, se partagent." />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { k: '100%', l: 'Produits homologués' },
            { k: '24 h', l: 'Temps de réponse client' },
            { k: '9', l: 'Ingénieurs sur le terrain' },
          ].map((s)=>(
            <div key={s.l} className="rounded-2xl bg-primary-50/60 p-8 text-center">
              <p className="text-4xl font-extrabold text-primary-700">{s.k}</p>
              <p className="mt-2 text-ink/70">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link to="/contact" className="btn-primary"> Travaillons ensemble <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </Section>
    </>
  );
}
