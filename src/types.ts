export type AreaKey =
  | 'all'
  | 'ageeba'
  | 'al_abyad'
  | 'alam_el_roum'
  | 'cleopatra'
  | 'al_gharam'
  | 'beau_site'
  | 'corniche'
  | 'rommel'
  | 'al_fayrouz'
  | 'public_beach'
  | 'downtown'
  | 'el_zohour'
  | 'el_montazah'
  | 'awqaf'
  | 'senoussi'
  | 'port_area'
  | 'airport_area'
  | 'el_negaila'
  | 'garawla'
  | 'umm_el_rakham'
  | 'alexandria_st'
  | 'port_said_st'
  | 'gomhoreya_st'
  | 'army_st'
  | 'nasr_st'
  | 'souq_libya'
  | 'july_st'
  | 'porto_matrouh'
  | 'jolie_ville'
  | 'marbella'
  | 'amoun'
  | 'hawaii'
  | 'palm_beach'
  | 'carolina'
  | 'valencia'
  | 'green_beach'
  | 'cleopatra_village';

export type AmenityKey =
  | 'wifi'
  | 'ac'
  | 'parking'
  | 'kitchen'
  | 'balcony'
  | 'tv'
  | 'washer'
  | 'pool'
  | 'beach_access'
  | 'elevator'
  | 'sea_view';

export type RentalTerm = 'summer' | 'winter' | 'yearly';

export interface Flat {
  id: string;
  /** Terms the owner offers; defaults to summer (nightly) when missing */
  rentalTerms?: RentalTerm[];
  /** Monthly price for winter season rental (Oct–May) */
  winterMonthlyPrice?: number;
  /** Monthly price for a yearly lease */
  yearlyMonthlyPrice?: number;
  title: {
    ar: string;
    en: string;
  };
  area: AreaKey;
  areaName: {
    ar: string;
    en: string;
  };
  pricePerNight: number;
  originalPrice?: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  maxGuests: number;
  floor: number | string;
  hasElevator: boolean;
  hasSeaView: boolean;
  distanceToBeach: {
    ar: string;
    en: string;
  };
  images: string[];
  videoUrl?: string;
  canInspectBeforePay?: boolean;
  inspectionPolicy?: {
    ar: string;
    en: string;
  };
  rating: number;
  reviewCount: number;
  amenities: AmenityKey[];
  description: {
    ar: string;
    en: string;
  };
  phoneContact: string;
  whatsappNumber: string;
  /** Metres to the beach when the owner entered a number. Text distance is still shown. */
  distanceMeters?: number;
  /** When the walkthrough was filmed, if the owner recorded it. */
  videoFilmedOn?: string;
  /** Account that published the listing on this device. */
  ownerId?: string;
  isFeatured?: boolean;
  isSuperhost?: boolean;
}

export interface FilterState {
  rentalTerm: RentalTerm | 'all';
  area: AreaKey;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number | 'any';
  hasSeaView: boolean;
  hasElevator: boolean;
  hasAC: boolean;
  /** 0 means any party size */
  guests: number;
  inspectOnly: boolean;
  hasVideo: boolean;
  nearBeach: boolean;
  sortBy: 'recommended' | 'price_asc' | 'price_desc' | 'rating' | 'distance';
}
