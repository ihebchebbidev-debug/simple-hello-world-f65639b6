export type Product = {
  id: string;
  slug: string;
  name: string;
  category: 'Fongicides' | 'Insecticides' | 'Herbicides' | 'Engrais' | 'Biostimulants' | 'Adjuvants' | 'Engrais & Biostimulants';
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
  'Engrais & Biostimulants',
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
  'Engrais & Biostimulants': bagWhite,
  Adjuvants: bottleAmber,
};


export const PRODUCTS: Product[] = [];
