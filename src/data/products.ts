export type Product = {
  id: string;
  slug: string;
  name: string;
  category: 'Fongicides' | 'Insecticides' | 'Herbicides' | 'Engrais' | 'Biostimulants' | 'Adjuvants';
  shortDescription: string;
  description: string;
  image: string;
  /** Soft background tint token used behind the packshot */
  tone: 'sage' | 'sand' | 'mist' | 'clay' | 'sky' | 'stone';
  homologation: string;
  usages: { crop: string; dose: string; target: string }[];
  // ---- optional extras (populated by backend) ----
  images?: string[];
  composition?: { name: string; percentage: string }[];
  benefits?: string[];
  technical_sheet_url?: string;
  is_active?: number;
  apiId?: number;
};

export const CATEGORIES = [
  'Tous',
  'Fongicides',
  'Insecticides',
  'Herbicides',
  'Engrais',
  'Biostimulants',
  'Adjuvants',
] as const;

import bottleGreen from '@/assets/bottle-green.png';
import bottleAmber from '@/assets/bottle-amber.png';
import bagWhite from '@/assets/bag-white.png';

const CAT_IMG: Record<string, string> = {
  Fongicides: bottleGreen,
  Insecticides: bottleAmber,
  Herbicides: bottleAmber,
  Engrais: bagWhite,
  Biostimulants: bottleGreen,
  Adjuvants: bottleAmber,
};


export const PRODUCTS: Product[] = [
  {
    id: '1',
    tone: 'clay',
    slug: 'trebon-30-ec',
    name: 'Trebon 30 EC',
    category: 'Insecticides',
    shortDescription: 'Insecticide à large spectre pour la protection des cultures maraîchères et arboricoles.',
    description:
      "Trebon 30 EC est un insecticide de contact et d'ingestion à base d'étofenprox, offrant une action rapide et une longue persistance contre un large spectre de ravageurs.",
    image: CAT_IMG['Insecticides'],
    homologation: 'AMM n° 2456 — Ministère de l\'Agriculture (Tunisie)',
    usages: [
      { crop: 'Tomate', dose: '0.5 L/ha', target: 'Noctuelles, aleurodes' },
      { crop: 'Agrumes', dose: '0.75 L/ha', target: 'Cératite, cochenilles' },
      { crop: 'Olivier', dose: '0.6 L/ha', target: 'Mouche de l\'olive' },
    ],
  },
  {
    id: '2',
    tone: 'sage',
    slug: 'atlas-cuivre-fx',
    name: 'Atlas Cuivre FX',
    category: 'Fongicides',
    shortDescription: 'Fongicide cuprique préventif à haute adhérence pour cultures pérennes.',
    description:
      "Atlas Cuivre FX assure une protection préventive optimale contre les maladies cryptogamiques grâce à une formulation micronisée à forte tenue à la pluie.",
    image: CAT_IMG['Fongicides'],
    homologation: 'AMM n° 3120 — Homologué usage professionnel',
    usages: [
      { crop: 'Vigne', dose: '2 kg/ha', target: 'Mildiou, black rot' },
      { crop: 'Olivier', dose: '3 kg/ha', target: 'Œil de paon' },
      { crop: 'Agrumes', dose: '2.5 kg/ha', target: 'Mal secco' },
    ],
  },
  {
    id: '3',
    tone: 'sand',
    slug: 'herbatlas-pro',
    name: 'Herbatlas Pro',
    category: 'Herbicides',
    shortDescription: 'Herbicide sélectif post-levée pour céréales et grandes cultures.',
    description:
      "Herbatlas Pro contrôle efficacement les graminées et dicotylédones résistantes tout en préservant la culture, grâce à une double matière active de nouvelle génération.",
    image: CAT_IMG['Herbicides'],
    homologation: 'AMM n° 4089',
    usages: [
      { crop: 'Blé dur', dose: '1 L/ha', target: 'Ray-grass, folle avoine' },
      { crop: 'Orge', dose: '0.8 L/ha', target: 'Dicotylédones annuelles' },
    ],
  },
  {
    id: '4',
    tone: 'sky',
    slug: 'nutrimax-npk',
    name: 'NutriMax NPK 20-20-20',
    category: 'Engrais',
    shortDescription: 'Engrais soluble équilibré à haute pureté pour fertigation.',
    description:
      "Formulation cristalline soluble à 100%, enrichie en oligo-éléments chélatés, idéale pour la fertigation goutte-à-goutte des cultures intensives.",
    image: CAT_IMG['Engrais'],
    homologation: 'Conforme normes EC — Grade horticole',
    usages: [
      { crop: 'Serres maraîchères', dose: '3-5 kg/1000 m²', target: 'Croissance & floraison' },
      { crop: 'Arboriculture', dose: '25 kg/ha', target: 'Fertigation continue' },
    ],
  },
  {
    id: '5',
    tone: 'mist',
    slug: 'biostim-algae',
    name: 'BioStim Algae',
    category: 'Biostimulants',
    shortDescription: 'Biostimulant à base d\'algues brunes (Ascophyllum nodosum).',
    description:
      "Extrait d'algues à haute concentration en cytokinines et auxines naturelles, stimulant la vigueur racinaire, la floraison et la résistance au stress hydrique.",
    image: CAT_IMG['Biostimulants'],
    homologation: 'Intrant utilisable en agriculture biologique',
    usages: [
      { crop: 'Toutes cultures', dose: '2-3 L/ha', target: 'Stress hydrique, nouaison' },
    ],
  },
  {
    id: '6',
    tone: 'stone',
    slug: 'atlas-wet',
    name: 'Atlas Wet',
    category: 'Adjuvants',
    shortDescription: 'Adjuvant mouillant-pénétrant pour bouillies phytosanitaires.',
    description:
      "Améliore l'étalement, l'adhérence et la pénétration des produits phytosanitaires, réduisant les doses tout en maximisant l'efficacité des traitements.",
    image: CAT_IMG['Adjuvants'],
    homologation: 'Adjuvant homologué AMM 5001',
    usages: [
      { crop: 'Bouillies fongicides/insecticides', dose: '0.1%', target: 'Amélioration de l\'efficacité' },
    ],
  },
];
