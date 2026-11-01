import type { AmenityKey, AreaKey, Flat, RentalTerm } from '../types';
import { AREA_KEYS } from '../data/areas';

const AREAS: AreaKey[] = AREA_KEYS;

const TERMS: RentalTerm[] = ['summer', 'winter', 'yearly'];

const AMENITIES: AmenityKey[] = [
  'wifi',
  'ac',
  'parking',
  'kitchen',
  'balcony',
  'tv',
  'washer',
  'pool',
  'beach_access',
  'elevator',
  'sea_view',
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object';

const num = (value: unknown, fallback = 0) => {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  return Number.isFinite(n) ? n : fallback;
};

const positive = (value: unknown) => {
  const n = num(value, NaN);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

const pair = (value: unknown, fallbackAr: string, fallbackEn: string) => {
  if (!isRecord(value)) return { ar: fallbackAr, en: fallbackEn };
  const ar = typeof value.ar === 'string' ? value.ar.trim() : '';
  const en = typeof value.en === 'string' ? value.en.trim() : '';
  return {
    ar: ar || en || fallbackAr,
    en: en || ar || fallbackEn,
  };
};

export const pickLang = (
  value: { ar?: string; en?: string } | undefined,
  lang: 'ar' | 'en',
  fallback = '',
) => {
  const ar = value?.ar?.trim() || '';
  const en = value?.en?.trim() || '';
  const chosen = lang === 'ar' ? ar || en : en || ar;
  return chosen || fallback;
};

export const safeImages = (images: unknown): string[] => {
  if (!Array.isArray(images)) return [];
  return images
    .filter((url): url is string => typeof url === 'string' && /^https?:\/\//i.test(url.trim()))
    .map((url) => url.trim());
};

export const phoneDigits = (phone: string | undefined) => (phone || '').replace(/\D/g, '');

export const canCall = (phone: string | undefined) => phoneDigits(phone).length >= 8;

export const whatsappDigits = (phone: string | undefined) => {
  const digits = phoneDigits(phone);
  return digits.length >= 8 ? digits : null;
};

export const formatMoney = (amount: number | undefined | null) => {
  if (amount == null || !Number.isFinite(amount) || amount <= 0) return null;
  return amount.toLocaleString('en-US');
};

/** Prefer an explicit metre value, then a number written in the distance text. */
export const readMeters = (flat: Pick<Flat, 'distanceMeters' | 'distanceToBeach'>): number | undefined => {
  if (flat.distanceMeters != null && Number.isFinite(flat.distanceMeters) && flat.distanceMeters > 0) {
    return Math.round(flat.distanceMeters);
  }
  const text = `${flat.distanceToBeach?.ar || ''} ${flat.distanceToBeach?.en || ''}`;
  const match = text.match(/(\d+)\s*(?:m\b|متر)/i);
  if (match) return Number(match[1]);
  if (/مباشرة|أول نمرة|direct|first line|private beach entrance/i.test(text)) return 40;
  return undefined;
};

export const floorLabel = (floor: number | string | undefined, lang: 'ar' | 'en') => {
  if (floor === '' || floor === '—' || floor == null) {
    return lang === 'ar' ? 'الدور غير محدد' : 'Floor not set';
  }
  if (floor === 0 || floor === '0') {
    return lang === 'ar' ? 'الدور الأرضي' : 'Ground floor';
  }
  return lang === 'ar' ? `الدور ${floor}` : `Floor ${floor}`;
};

/** Repair listings saved before every field existed, and drop rows that cannot be shown. */
export const normalizeFlat = (raw: unknown): Flat | null => {
  if (!isRecord(raw)) return null;
  const id = typeof raw.id === 'string' ? raw.id.trim() : '';
  if (!id) return null;

  const title = pair(raw.title, 'شقة في مرسى مطروح', 'Flat in Marsa Matrouh');
  const area = AREAS.includes(raw.area as AreaKey) ? (raw.area as AreaKey) : 'corniche';
  const rentalTerms = Array.isArray(raw.rentalTerms)
    ? raw.rentalTerms.filter((term): term is RentalTerm => TERMS.includes(term as RentalTerm))
    : [];
  const inspection = isRecord(raw.inspectionPolicy) ? pair(raw.inspectionPolicy, '', '') : undefined;
  const hasPolicy = !!inspection && (inspection.ar.length > 0 || inspection.en.length > 0);

  return {
    id,
    rentalTerms: rentalTerms.length > 0 ? rentalTerms : undefined,
    winterMonthlyPrice: positive(raw.winterMonthlyPrice),
    yearlyMonthlyPrice: positive(raw.yearlyMonthlyPrice),
    title,
    area,
    areaName: pair(raw.areaName, 'مرسى مطروح', 'Marsa Matrouh'),
    pricePerNight: Math.max(0, num(raw.pricePerNight, 0)),
    originalPrice: positive(raw.originalPrice),
    bedrooms: Math.max(0, Math.round(num(raw.bedrooms, 0))),
    bathrooms: Math.max(0, Math.round(num(raw.bathrooms, 0))),
    beds: Math.max(0, Math.round(num(raw.beds, 0))),
    maxGuests: Math.max(1, Math.round(num(raw.maxGuests, 1))),
    floor: typeof raw.floor === 'number' || typeof raw.floor === 'string' ? raw.floor : '—',
    hasElevator: raw.hasElevator === true,
    hasSeaView: raw.hasSeaView === true,
    distanceToBeach: pair(raw.distanceToBeach, 'مرسى مطروح', 'Marsa Matrouh'),
    images: safeImages(raw.images),
    videoUrl: typeof raw.videoUrl === 'string' && raw.videoUrl.trim() ? raw.videoUrl.trim() : undefined,
    canInspectBeforePay: raw.canInspectBeforePay === true,
    inspectionPolicy: hasPolicy ? inspection : undefined,
    rating: Math.min(5, Math.max(0, num(raw.rating, 0))),
    reviewCount: Math.max(0, Math.round(num(raw.reviewCount, 0))),
    amenities: Array.isArray(raw.amenities)
      ? raw.amenities.filter((item): item is AmenityKey => AMENITIES.includes(item as AmenityKey))
      : [],
    description: pair(raw.description, '', ''),
    phoneContact: typeof raw.phoneContact === 'string' ? raw.phoneContact.trim() : '',
    whatsappNumber: typeof raw.whatsappNumber === 'string' ? raw.whatsappNumber.trim() : '',
    distanceMeters: positive(raw.distanceMeters),
    videoFilmedOn: typeof raw.videoFilmedOn === 'string' && raw.videoFilmedOn.trim() ? raw.videoFilmedOn.trim() : undefined,
    ownerId: typeof raw.ownerId === 'string' && raw.ownerId.trim() ? raw.ownerId.trim() : undefined,
    isFeatured: raw.isFeatured === true,
    isSuperhost: raw.isSuperhost === true,
  };
};

export const normalizeFlats = (raw: unknown, fallback: Flat[]) => {
  if (!Array.isArray(raw)) return fallback;
  const flats = raw.map(normalizeFlat).filter((flat): flat is Flat => flat !== null);
  return flats.length > 0 ? flats : fallback;
};
