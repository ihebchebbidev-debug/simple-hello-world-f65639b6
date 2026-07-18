import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Sprout, Globe2, HeartHandshake, TrendingUp, ShieldCheck } from 'lucide-react';
import Seo from '@/components/Seo';
import { Section, SectionHeader, Eyebrow } from '@/components/Section';
import aerial from '@/assets/aerial.jpg';

const PILLARS = [
  { i: Sprout, t: 'Productivité durable', d: 'Augmenter les rendements sans compromettre la santé des sols ni celle des générations futures.' },
  { i: ShieldCheck, t: 'Qualité homologuée', d: 'Uniquement des intrants certifiés, testés et conformes aux standards internationaux.' },
  { i: HeartHandshake, t: 'Proximité terrain', d: 'Un accompagnement humain, technique et personnalisé, région par région.' },
  { i: Globe2, t: 'Innovation mondiale', d: 'Partenariats avec les leaders mondiaux pour amener le meilleur en Tunisie.' },
  { i: TrendingUp, t: 'Croissance partagée', d: 'La réussite des agriculteurs est la mesure première de notre performance.' },
  { i: Target, t: 'Précision agronomique', d: 'Des recommandations par culture, par saison, par exploitation.' },
];

export default function NotreMission() {
  return (
    <>
      <Seo title="Notre mission — Atlas Agricole S.A." description="La mission d'Atlas Agricole : accompagner les agriculteurs tunisiens avec des intrants de qualité, une expertise agronomique et une vision durable." path="/notre-mission" />

      <section className="bg-grad-soft pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>Notre mission</Eyebrow>
            <h1 className="mt-5 text-hero font-extrabold text-ink">
              Cultiver la performance, <span className="text-primary-700">durablement</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/65">
              Notre mission est d'apporter aux agriculteurs tunisiens des solutions d'intrants
              de haute qualité, associées à un accompagnement agronomique de terrain, pour
              produire plus, mieux, et de manière durable.
            </p>
            <Link to="/contact" className="btn-primary mt-8 w-fit">
              Parler à un agronome <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="lg:col-span-5">
            <img src={aerial} alt="Champ agricole" className="aspect-[4/3] w-full rounded-hero object-cover shadow-premium" />
          </div>
        </div>
      </section>

      <Section>
        <SectionHeader eyebrow="Nos engagements" title="Six piliers pour une mission tenue." />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map(({ i: I, t, d }, idx) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="card p-8"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-50 text-primary-700"><I className="h-6 w-6" /></span>
              <h3 className="mt-5 text-xl font-bold text-ink">{t}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/65">{d}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeader eyebrow="Notre promesse" title="Un partenaire, pas un simple fournisseur." />
            <p className="mt-4 text-[17px] leading-relaxed text-ink/75">
              Chez Atlas Agricole, nous refusons la logique transactionnelle. Chaque client
              bénéficie d'un suivi technique par un ingénieur agronome dédié à sa région,
              d'un accès aux dernières innovations mondiales et d'un service logistique
              fiable, année après année.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {['Ingénieur agronome dédié','Livraison sur exploitation','Programme phytosanitaire complet','Formations terrain gratuites'].map((t)=>(
                <div key={t} className="card p-5 text-[15px] font-semibold text-ink">{t}</div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
