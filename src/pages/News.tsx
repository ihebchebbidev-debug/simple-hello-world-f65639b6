import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar } from 'lucide-react';
import Seo from '@/components/Seo';
import { Eyebrow } from '@/components/Section';
import newsBiostim from '@/assets/about.jpg';
import newsEvent from '@/assets/cta.jpg';
import newsReg from '@/assets/hands-plant.jpg';

const POSTS = [
  {
    t: 'Lancement de notre gamme biostimulants 2026',
    d: '2026-06-12',
    e: 'Une nouvelle gamme d\'extraits d\'algues et acides aminés pour stimuler la vigueur des cultures.',
    img: newsBiostim,
    c: 'Innovation',
  },
  {
    t: 'Journée technique olivier — Sfax',
    d: '2026-04-04',
    e: 'Retour sur notre rencontre avec 120 producteurs pour parler protection intégrée.',
    img: newsEvent,
    c: 'Événement',
  },
  {
    t: 'Nouvelle homologation Trebon 30 EC',
    d: '2026-02-18',
    e: 'Le Ministère renouvelle l\'homologation pour trois nouveaux usages.',
    img: newsReg,
    c: 'Réglementaire',
  },
];


export default function News() {
  return (
    <>
      <Seo
        title="Actualités — Atlas Agricole S.A."
        description="Les dernières actualités, innovations et événements techniques d'Atlas Agricole S.A."
        path="/actualites"
      />
      <section className="bg-grad-soft pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-x">
          <Eyebrow>Actualités</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-hero font-extrabold text-ink">L'actualité agricole d'<span className="text-primary-700">Atlas</span>.</h1>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-x grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <Link key={p.t} to="#" className="group card card-hover overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={p.img} alt={p.t} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-700 backdrop-blur">{p.c}</span>
              </div>
              <div className="p-6">
                <p className="flex items-center gap-2 text-xs text-ink/50"><Calendar className="h-3.5 w-3.5" /> {new Date(p.d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <h2 className="mt-2 text-xl font-bold leading-tight text-ink">{p.t}</h2>
                <p className="mt-2 text-sm text-ink/65">{p.e}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary-700">Lire l'article <ArrowUpRight className="h-4 w-4" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
