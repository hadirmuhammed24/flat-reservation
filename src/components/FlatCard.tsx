import React, { useState } from 'react';
import {
  MapPin,
  Bed,
  Bath,
  Users,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Building,
  Video,
  ShieldCheck,
  Sparkles,
  Heart,
} from 'lucide-react';
import type { Flat, RentalTerm } from '../types';
import { getDisplayTerm, getTermPrice, getTerms, TERM_LABELS } from '../utils/rental';
import { canCall, floorLabel, formatMoney, pickLang, whatsappDigits } from '../utils/display';
import { PhotoFrame } from './PhotoFrame';

interface FlatCardProps {
  flat: Flat;
  term?: RentalTerm | 'all';
  lang: 'ar' | 'en';
  signedIn: boolean;
  saved: boolean;
  onToggleSave: () => void;
  onRequestSignIn: () => void;
  onSelect: (flat: Flat) => void;
}

const TERM_CHIP: Record<RentalTerm, string> = {
  summer: 'bg-amber-300/95 text-amber-950',
  winter: 'bg-indigo-600/95 text-white',
  yearly: 'bg-teal-600/95 text-white',
};

export const FlatCard: React.FC<FlatCardProps> = ({ flat, term = 'all', lang, signedIn, saved, onToggleSave, onRequestSignIn, onSelect }) => {
  const isAr = lang === 'ar';
  const displayTerm = getDisplayTerm(flat, term);
  const displayPrice = getTermPrice(flat, displayTerm);
  const priceLabel = formatMoney(displayPrice);
  const unit = TERM_LABELS[displayTerm];
  const terms = getTerms(flat);
  const images = flat.images ?? [];
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const imageIndex = images.length > 0 ? currentImgIndex % images.length : 0;
  const title = pickLang(flat.title, lang, isAr ? 'شقة في مرسى مطروح' : 'Flat in Marsa Matrouh');
  const areaName = pickLang(flat.areaName, lang, isAr ? 'مرسى مطروح' : 'Marsa Matrouh');
  const distance = pickLang(flat.distanceToBeach, lang);
  const wa = whatsappDigits(flat.whatsappNumber) ?? whatsappDigits(flat.phoneContact);
  const call = canCall(flat.phoneContact) ? flat.phoneContact : canCall(flat.whatsappNumber) ? flat.whatsappNumber : null;
  const noPhotos = isAr ? 'لا توجد صور بعد' : 'No photos yet';
  const showStrike =
    displayTerm === 'summer' &&
    flat.originalPrice != null &&
    displayPrice != null &&
    flat.originalPrice > displayPrice;

  const stepImage = (e: React.MouseEvent, direction: 1 | -1) => {
    e.stopPropagation();
    if (images.length < 2) return;
    setCurrentImgIndex((prev) => (prev + direction + images.length) % images.length);
  };

  const whatsappMessage = encodeURIComponent(
    isAr
      ? `السلام عليكم، أرغب في الاستفسار عن إيجار (${unit.ar}): "${title}" في (${areaName})${priceLabel ? ` بسعر ${priceLabel} ${unit.unitAr}` : ''}.`
      : `Hello, I'm interested in renting (${unit.en}): "${title}" at (${areaName})${priceLabel ? ` for ${priceLabel} ${unit.unitEn}` : ''}.`
  );

  return (
    <div
      onClick={() => onSelect(flat)}
      className="group bg-white/95 rounded-[1.85rem] overflow-hidden ring-1 ring-slate-200/80 shadow-[0_10px_30px_-18px_rgba(12,74,110,0.55)] hover:shadow-[0_28px_50px_-20px_rgba(14,116,144,0.45)] hover:ring-amber-200/80 transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1.5 h-full"
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <PhotoFrame
          src={images[imageIndex]}
          alt={title}
          fallbackLabel={noPhotos}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sky-950/35 via-transparent to-white/10 pointer-events-none" />

        <div className="absolute bottom-3 start-3 px-3 py-1.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg pointer-events-none flex items-baseline gap-1">
          {priceLabel ? (
            <>
              <span className="text-lg font-black text-sky-900">{priceLabel}</span>
              <span className="text-[10px] font-bold text-slate-500">{isAr ? unit.unitAr : unit.unitEn}</span>
            </>
          ) : (
            <span className="text-xs font-black text-amber-800">{isAr ? 'السعر عند الطلب' : 'Price on request'}</span>
          )}
        </div>

        <div className="absolute bottom-3 end-3 flex gap-1 pointer-events-none">
          {terms.map((t) => (
            <span key={t} className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold backdrop-blur-md ${TERM_CHIP[t]}`}>
              {t === 'summer' ? (isAr ? 'صيفي' : 'Summer') : t === 'winter' ? (isAr ? 'شتوي' : 'Winter') : (isAr ? 'سنوي' : 'Yearly')}
            </span>
          ))}
        </div>

        <div className="absolute top-3 inset-x-3 flex items-start justify-between pointer-events-none gap-2">
          <div className="flex flex-col gap-1 items-start">
            {flat.canInspectBeforePay && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-600/95 text-white backdrop-blur-md shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAr ? 'معاينة قبل الدفع' : 'Inspect First'}</span>
              </span>
            )}
            {flat.videoUrl && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-600/90 text-white backdrop-blur-md shadow-xs">
                <Video className="w-3.5 h-3.5" />
                <span>{isAr ? 'فيديو جولة' : 'Video Tour'}</span>
              </span>
            )}
            {flat.hasSeaView && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-600/90 text-white backdrop-blur-md shadow-xs">
                <Eye className="w-3.5 h-3.5" />
                <span>{isAr ? 'إطلالة بحر' : 'Sea View'}</span>
              </span>
            )}
            {flat.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/95 text-amber-950 backdrop-blur-md shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'مميز' : 'Featured'}</span>
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleSave();
              }}
              className="pointer-events-auto p-2 rounded-full bg-white/90 text-rose-500 shadow-md"
              aria-label={isAr ? 'حفظ الشقة' : 'Save flat'}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-rose-500' : ''}`} />
            </button>
            {flat.reviewCount > 0 ? (
              <div className="flex items-center gap-1 bg-black/55 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-bold">
                <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>{flat.rating.toFixed(1)}</span>
                <span className="text-slate-300 text-[10px]">({flat.reviewCount})</span>
              </div>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-slate-700">
                {isAr ? 'إعلان جديد' : 'New listing'}
              </span>
            )}
          </div>
        </div>

        {images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => stepImage(e, -1)}
              className="p-1.5 rounded-full bg-white/85 hover:bg-white text-slate-800 backdrop-blur-md shadow-md transition-all hover:scale-110"
              aria-label={isAr ? 'الصورة السابقة' : 'Previous photo'}
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
            <button
              onClick={(e) => stepImage(e, 1)}
              className="p-1.5 rounded-full bg-white/85 hover:bg-white text-slate-800 backdrop-blur-md shadow-md transition-all hover:scale-110"
              aria-label={isAr ? 'الصورة التالية' : 'Next photo'}
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-12 end-3 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === imageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-sky-800 font-bold mb-1.5">
            <span className="flex items-center gap-1 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="truncate">{areaName}</span>
            </span>
            {distance && (
              <span className="text-[11px] text-slate-500 font-medium text-end line-clamp-1">{distance}</span>
            )}
          </div>

          <h2 className="text-base font-extrabold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2 leading-snug">
            {title}
          </h2>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-3 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {flat.bedrooms > 0
                  ? `${flat.bedrooms} ${isAr ? 'غرف' : 'Beds'}`
                  : (isAr ? 'استوديو' : 'Studio')}
              </span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              <span>{flat.bathrooms} {isAr ? 'حمام' : 'Baths'}</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{isAr ? `يتسع لـ ${flat.maxGuests}` : `Up to ${flat.maxGuests}`}</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{floorLabel(flat.floor, lang)}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            {showStrike ? (
              <span className="text-xs text-slate-400 line-through">
                {formatMoney(flat.originalPrice)} {isAr ? 'ج.م' : 'EGP'}
              </span>
            ) : (
              <span className="text-[11px] font-bold text-emerald-700">
                {isAr ? 'تواصل مباشر مع المالك' : 'Direct from owner'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {signedIn && call ? (
              <a
                href={`tel:${call}`}
                onClick={(e) => e.stopPropagation()}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title={isAr ? 'اتصال مباشر' : 'Call'}
              >
                <Phone className="w-4 h-4" />
              </a>
            ) : null}

            {signedIn && wa ? (
              <a
                href={`https://wa.me/${wa}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
              </a>
            ) : signedIn ? (
              <span className="text-[11px] font-bold text-slate-400 px-2">
                {isAr ? 'لا يوجد رقم تواصل' : 'No contact number'}
              </span>
            ) : (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onRequestSignIn();
                }}
                className="px-3 py-2 rounded-2xl bg-sky-500 text-white text-[11px] font-bold shadow-sm shadow-sky-200"
              >
                {isAr ? 'سجل للتواصل' : 'Sign in to contact'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
