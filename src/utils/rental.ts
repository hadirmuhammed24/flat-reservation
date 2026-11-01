import type { Flat, RentalTerm } from '../types';

export const RENTAL_TERMS: RentalTerm[] = ['summer', 'winter', 'yearly'];

export const TERM_LABELS: Record<RentalTerm, { ar: string; en: string; unitAr: string; unitEn: string }> = {
  summer: { ar: 'صيفي (يومي)', en: 'Summer (nightly)', unitAr: 'ج.م / ليلة', unitEn: 'EGP / night' },
  winter: { ar: 'شتوي (شهري)', en: 'Winter (monthly)', unitAr: 'ج.م / شهر', unitEn: 'EGP / month' },
  yearly: { ar: 'سنوي', en: 'Yearly lease', unitAr: 'ج.م / شهر', unitEn: 'EGP / month' },
};

export const getTerms = (flat: Flat): RentalTerm[] =>
  flat.rentalTerms && flat.rentalTerms.length > 0 ? flat.rentalTerms : ['summer'];

export const getTermPrice = (flat: Flat, term: RentalTerm): number | undefined => {
  if (!getTerms(flat).includes(term)) return undefined;
  const raw = term === 'summer'
    ? flat.pricePerNight
    : term === 'winter'
      ? flat.winterMonthlyPrice
      : flat.yearlyMonthlyPrice;
  if (raw == null || !Number.isFinite(raw) || raw <= 0) return undefined;
  return raw;
};

/** Term shown on cards: the filtered term if offered, otherwise the first offered one */
export const getDisplayTerm = (flat: Flat, selected: RentalTerm | 'all'): RentalTerm => {
  const terms = getTerms(flat);
  if (selected !== 'all' && terms.includes(selected)) return selected;
  return terms[0];
};

export const PRICE_RANGE: Record<RentalTerm, { min: number; max: number; step: number }> = {
  summer: { min: 1000, max: 5000, step: 200 },
  winter: { min: 3000, max: 20000, step: 500 },
  yearly: { min: 3000, max: 20000, step: 500 },
};
