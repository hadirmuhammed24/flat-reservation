import type { AreaKey, Flat } from '../types';
import { getTermPrice } from './rental';

export type RequestKind = 'arrival' | 'sameday' | 'hold' | 'direct';
export type RequestStatus = 'open' | 'rejected' | 'kept';
export type ReportReason = 'mismatch' | 'missed' | 'other';

export interface StayRequest {
  id: string;
  code: string;
  kind: RequestKind;
  status: RequestStatus;
  flatId: string;
  titleAr: string;
  titleEn: string;
  area: AreaKey;
  accountId: string;
  guestName: string;
  whenLabel: string;
  details: string;
  holdAmount?: number;
  createdAt: string;
}

export interface RecordDraft {
  kind: RequestKind;
  whenLabel: string;
  details: string;
  holdAmount?: number;
}

export interface GuestReview {
  id: string;
  flatId: string;
  accountId: string;
  name: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface MismatchReport {
  id: string;
  flatId: string;
  accountId: string;
  reason: ReportReason;
  createdAt: string;
}

const REQUESTS_KEY = 'matrouh_requests_v1';
const SAVED_KEY = 'matrouh_saved_v1';
const REVIEWS_KEY = 'matrouh_reviews_v1';
const REPORTS_KEY = 'matrouh_reports_v1';

const readList = <T>(key: string): T[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

export const loadRequests = () => readList<StayRequest>(REQUESTS_KEY);
export const loadSaved = () => readList<string>(SAVED_KEY).filter((id) => typeof id === 'string');
export const loadReviews = () => readList<GuestReview>(REVIEWS_KEY);
export const loadReports = () => readList<MismatchReport>(REPORTS_KEY);

export const persistRequests = (rows: StayRequest[]) => localStorage.setItem(REQUESTS_KEY, JSON.stringify(rows));
export const persistSaved = (ids: string[]) => localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
export const persistReviews = (rows: GuestReview[]) => localStorage.setItem(REVIEWS_KEY, JSON.stringify(rows));
export const persistReports = (rows: MismatchReport[]) => localStorage.setItem(REPORTS_KEY, JSON.stringify(rows));

export const makeCode = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `MT-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')}`;
};

/** July and August are the peak holding season in the plan. */
export const isPeakDate = (iso: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const month = Number(iso.slice(5, 7));
  return month === 7 || month === 8;
};

/** The smaller of one night and 10% of the stay. Nothing is charged in the browser. */
export const holdAmount = (total: number | undefined, nightly: number | undefined) => {
  const night = nightly != null && nightly > 0 ? nightly : undefined;
  const ten = total != null && total > 0 ? Math.round(total * 0.1) : undefined;
  if (night != null && ten != null) return Math.min(night, ten);
  return night ?? ten;
};

export const suggestAlternatives = (all: Flat[], current: Flat) => {
  const price = getTermPrice(current, 'summer') ?? current.pricePerNight ?? 0;
  return all
    .filter((flat) => flat.id !== current.id)
    .sort((a, b) => {
      const areaRank = (flat: Flat) => (flat.area === current.area ? 0 : 1);
      const gap = (flat: Flat) => Math.abs((getTermPrice(flat, 'summer') ?? flat.pricePerNight ?? 0) - price);
      if (areaRank(a) !== areaRank(b)) return areaRank(a) - areaRank(b);
      return gap(a) - gap(b);
    })
    .slice(0, 3)
    .map((flat) => ({ flat, sameArea: flat.area === current.area }));
};

/** A listing leaves the catalog on this device after three different accounts report it. */
export const hiddenFlatIds = (reports: MismatchReport[]) => {
  const byFlat = new Map<string, Set<string>>();
  for (const report of reports) {
    if (!report.flatId || !report.accountId) continue;
    const accounts = byFlat.get(report.flatId) ?? new Set<string>();
    accounts.add(report.accountId);
    byFlat.set(report.flatId, accounts);
  }
  const hidden = new Set<string>();
  for (const [flatId, accounts] of byFlat) {
    if (accounts.size >= 3) hidden.add(flatId);
  }
  return hidden;
};
