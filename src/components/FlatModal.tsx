import React, { useEffect, useState } from 'react';
import {
  X,
  MapPin,
  Bed,
  Bath,
  Users,
  Building,
  Wifi,
  Wind,
  Tv,
  Car,
  UtensilsCrossed,
  Sun,
  ShieldCheck,
  Phone,
  MessageCircle,
  CheckCircle2,
  Waves,
  Video,
  Image as ImageIcon,
  Clock,
  UserCheck,
  Heart,
  Share2,
  Zap,
  Star,
} from 'lucide-react';
import type { Flat, AmenityKey, RentalTerm } from '../types';
import { getTerms, getTermPrice, TERM_LABELS } from '../utils/rental';
import { canCall, floorLabel, pickLang, whatsappDigits } from '../utils/display';
import { holdAmount, isPeakDate, type GuestReview, type RecordDraft, type ReportReason, type StayRequest } from '../utils/stay';
import { PhotoFrame } from './PhotoFrame';

interface FlatModalProps {
  flat: Flat | null;
  lang: 'ar' | 'en';
  signedIn: boolean;
  saved: boolean;
  onToggleSave: () => void;
  openRequest: StayRequest | null;
  reviews: GuestReview[];
  onRecord: (draft: RecordDraft) => { code: string };
  onReject: () => { flat: Flat; sameArea: boolean }[];
  onKeep: () => void;
  onAddReview: (rating: number, text: string) => 'signin' | 'short' | null;
  onReport: (reason: ReportReason) => 'ok' | 'duplicate' | 'signed_out';
  onShare: () => Promise<boolean>;
  onPickAlternative: (flat: Flat) => void;
  onRequestSignIn: () => void;
  onClose: () => void;
}

const AMENITY_LABELS: Record<AmenityKey, { ar: string; en: string; icon: React.ReactNode }> = {
  wifi: { ar: 'واي فاي فائق السرعة', en: 'High-speed Wi-Fi', icon: <Wifi className="w-4 h-4" /> },
  ac: { ar: 'تكييف هواء بكل الغرف', en: 'Full Air Conditioning', icon: <Wind className="w-4 h-4" /> },
  balcony: { ar: 'بلكونة / تراس واسع', en: 'Large Balcony / Terrace', icon: <Sun className="w-4 h-4" /> },
  kitchen: { ar: 'مطبخ أمريكي متكامل', en: 'Fully Equipped Kitchen', icon: <UtensilsCrossed className="w-4 h-4" /> },
  parking: { ar: 'موقف سيارات مجاني', en: 'Free Parking Space', icon: <Car className="w-4 h-4" /> },
  beach_access: { ar: 'نزول مباشر للشاطئ', en: 'Direct Beach Access', icon: <Waves className="w-4 h-4" /> },
  elevator: { ar: 'مصعد بالعمارة', en: 'Building Elevator', icon: <Building className="w-4 h-4" /> },
  tv: { ar: 'شاشة سمارت ودش', en: 'Smart TV & Satellite', icon: <Tv className="w-4 h-4" /> },
  washer: { ar: 'غسالة ملابس أوتوماتيك', en: 'Automatic Washing Machine', icon: <CheckCircle2 className="w-4 h-4" /> },
  pool: { ar: 'حمام سباحة خاص/مشترك', en: 'Swimming Pool', icon: <Waves className="w-4 h-4" /> },
  sea_view: { ar: 'إطلالة بحر مباشرة', en: 'Direct Sea View', icon: <Waves className="w-4 h-4" /> },
};

export const FlatModal: React.FC<FlatModalProps> = ({ flat, ...rest }) => {
  if (!flat) return null;
  return <FlatModalContent key={flat.id} flat={flat} {...rest} />;
};

const FlatModalContent: React.FC<Omit<FlatModalProps, 'flat'> & { flat: Flat }> = ({
  flat,
  lang,
  signedIn,
  saved,
  onToggleSave,
  openRequest,
  reviews,
  onRecord,
  onReject,
  onKeep,
  onAddReview,
  onReport,
  onShare,
  onPickAlternative,
  onRequestSignIn,
  onClose,
}) => {
  const isAr = lang === 'ar';
  const images = flat.images ?? [];
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video'>(flat.videoUrl && images.length === 0 ? 'video' : 'photos');
  const [activeBookingMode, setActiveBookingMode] = useState<'inspect' | 'reserve'>(flat.canInspectBeforePay ? 'inspect' : 'reserve');
  const [videoFailed, setVideoFailed] = useState(false);

  const [selectedImg, setSelectedImg] = useState(0);
  const imageIndex = images.length > 0 ? selectedImg % images.length : 0;
  
  // Direct Reservation dates
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestCount, setGuestCount] = useState(2);

  // Inspection meeting details
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectionTime, setInspectionTime] = useState('11:00 AM');
  const [slip, setSlip] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<{ flat: Flat; sameArea: boolean }[]>([]);
  const [copied, setCopied] = useState(false);
  const [reviewScore, setReviewScore] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const [reportNote, setReportNote] = useState('');

  // Calculate nights
  const getNights = () => {
    if (!checkIn || !checkOut) return 1;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 1;
  };

  const terms = getTerms(flat);
  const [term, setTerm] = useState<RentalTerm>(terms[0]);
  const isSummer = term === 'summer';
  const unitPrice = getTermPrice(flat, term);
  const [months, setMonths] = useState(6);
  const monthOptions = term === 'yearly' ? [12, 24] : [1, 2, 3, 4, 5, 6, 7];
  const effectiveMonths = monthOptions.includes(months) ? months : monthOptions[monthOptions.length > 2 ? 5 : 0];

  const datesInvalid = Boolean(isSummer && checkIn && checkOut && new Date(checkOut) <= new Date(checkIn));
  const nights = datesInvalid ? 0 : getNights();
  const units = isSummer ? nights : effectiveMonths;
  const totalPrice = unitPrice != null && units > 0 ? units * unitPrice : undefined;
  const termLabel = TERM_LABELS[term];
  const title = pickLang(flat.title, lang, isAr ? 'شقة في مرسى مطروح' : 'Flat in Marsa Matrouh');
  const areaName = pickLang(flat.areaName, lang, isAr ? 'مرسى مطروح' : 'Marsa Matrouh');
  const distance = pickLang(flat.distanceToBeach, lang);
  const description = pickLang(flat.description, lang);
  const wa = whatsappDigits(flat.whatsappNumber) ?? whatsappDigits(flat.phoneContact);
  const call = canCall(flat.phoneContact) ? flat.phoneContact : canCall(flat.whatsappNumber) ? flat.whatsappNumber : null;
  const guestCap = Math.max(1, flat.maxGuests || 1);
  const guests = Math.min(Math.max(1, guestCount), guestCap);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const peakStay = isSummer && (isPeakDate(checkIn) || isPeakDate(checkOut));
  const hold = isSummer ? holdAmount(totalPrice, unitPrice) : undefined;

  const openWhatsApp = (text: string) => {
    if (!wa) return;
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const confirmRequest = (draft: RecordDraft, message: string) => {
    if (!signedIn) {
      onRequestSignIn();
      return;
    }
    const { code } = onRecord(draft);
    setSlip(code);
    setAlternatives([]);
    const withCode = `${message}\n${isAr ? 'كود الوثيقة' : 'Slip code'}: ${code}`;
    openWhatsApp(withCode);
  };

  const handleWhatsAppBooking = () => {
    if (datesInvalid) return;
    const priceBit = totalPrice != null
      ? (isAr ? ` الإجمالي المتوقع: ${totalPrice.toLocaleString('en-US')} ج.م.` : ` Estimated total: ${totalPrice.toLocaleString('en-US')} EGP.`)
      : (isAr ? ' السعر عند الطلب.' : ' Price on request.');
    const datesInfo = isSummer
      ? checkIn && checkOut
        ? (isAr ? ` من تاريخ ${checkIn} إلى ${checkOut} (${nights} ليالي)` : ` from ${checkIn} to ${checkOut} (${nights} nights)`)
        : ''
      : (isAr
          ? `${checkIn ? ` ابتداءً من ${checkIn}` : ''} لمدة ${effectiveMonths} شهر`
          : `${checkIn ? ` starting ${checkIn}` : ''} for ${effectiveMonths} months`);
    const text = isAr
      ? `السلام عليكم، أرغب في حجز (${termLabel.ar}): "${title}" في (${areaName})${datesInfo} لعدد ${guests} أفراد.${priceBit} هل الوحدة متاحة؟`
      : `Hello, I'd like to book (${termLabel.en}) "${title}" at (${areaName})${datesInfo} for ${guests} guests.${priceBit} Is it available?`;
    confirmRequest(
      { kind: 'direct', whenLabel: datesInfo.trim() || (isAr ? 'موعد يُحدد مع المالك' : 'Time to confirm with the owner'), details: text },
      text,
    );
  };

  const handleWhatsAppInspection = () => {
    const when = isAr
      ? `${inspectionDate || 'يوم الوصول'} الساعة ${inspectionTime}`
      : `${inspectionDate || 'arrival day'} at ${inspectionTime}`;
    const text = isAr
      ? `السلام عليكم، أرغب في تأكيد موعد لمقابلة المالك ومعاينة: "${title}" في (${areaName}) يوم ${when} قبل سداد قيمة الإقامة. مكان اللقاء أمام مدخل العمارة. هل الموعد مناسب؟`
      : `Hello, I'd like to schedule an on-site inspection for "${title}" at (${areaName}) on ${when} before paying. Meeting point: the building entrance. Is this time convenient?`;
    confirmRequest({ kind: 'arrival', whenLabel: when, details: text }, text);
  };

  const handleSameDay = (minutes: 30 | 60) => {
    const when = isAr ? `خلال ${minutes} دقيقة` : `within ${minutes} minutes`;
    const text = isAr
      ? `السلام عليكم، أنا موجود في مرسى مطروح وأطلب معاينة فورية لـ "${title}" في (${areaName}) ${when}.`
      : `Hello, I am already in Marsa Matrouh and want a same-day viewing of "${title}" at (${areaName}) ${when}.`;
    confirmRequest({ kind: 'sameday', whenLabel: when, details: text }, text);
  };

  const handleHold = () => {
    if (datesInvalid) return;
    const amountText = hold != null
      ? (isAr ? `${hold.toLocaleString('en-US')} ج.م` : `${hold.toLocaleString('en-US')} EGP`)
      : (isAr ? 'يُحدد مع المالك' : 'to confirm with the owner');
    const when = checkIn && checkOut ? `${checkIn} → ${checkOut}` : (isAr ? 'تواريخ تُحدد مع المالك' : 'dates to confirm');
    const text = isAr
      ? `السلام عليكم، أريد حفظ "${title}" في (${areaName}) بعربون جدية ${amountText} عن ${when} لعدد ${guests} أفراد. العربون لا يُسلّم إلا بعد المعاينة وموافقتي، ويُرد إذا اختلفت الشقة عن الصور والفيديو.`
      : `Hello, I want to hold "${title}" at (${areaName}) with a seriousness amount of ${amountText} for ${when}, ${guests} guests. The hold is released only after inspection and my approval, and is returned if the flat does not match the photos and video.`;
    confirmRequest({ kind: 'hold', whenLabel: when, details: text, holdAmount: hold }, text);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-sky-100/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      
      {/* Modal Dialog Card */}
      <div
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 bg-slate-50/70 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
              <MapPin className="w-3.5 h-3.5" />
              <span>{areaName}</span>
              {distance && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-medium">{distance}</span>
                </>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSave}
              className="p-2 rounded-2xl bg-white text-rose-500 shadow-2xs"
              aria-label={isAr ? 'حفظ' : 'Save'}
            >
              <Heart className={`w-5 h-5 ${saved ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => {
                onShare()
                  .then(() => setCopied(true))
                  .catch(() => setCopied(false));
              }}
              className="p-2 rounded-2xl bg-white text-sky-700 shadow-2xs"
              aria-label={isAr ? 'مشاركة الرابط' : 'Share link'}
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Media Header Switcher: Photos vs Video Tour */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveMediaTab('photos')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeMediaTab === 'photos'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{isAr ? `معرض الصور (${images.length})` : `Photos (${images.length})`}</span>
              </button>

              {flat.videoUrl && (
                <button
                  onClick={() => setActiveMediaTab('video')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    activeMediaTab === 'video'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{isAr ? 'فيديو الجولة الحقيقية 🎥' : 'Video Tour Walkthrough 🎥'}</span>
                </button>
              )}
            </div>

            {flat.canInspectBeforePay && (
              <div className="hidden sm:inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isAr ? 'معاينة ومقابلة المالك قبل الدفع متاحة' : 'Meet Owner & Inspect Before Pay'}</span>
              </div>
            )}
          </div>

          {/* Media Player Area */}
          <div className="space-y-3">
            {activeMediaTab === 'photos' ? (
              <>
                <div className="aspect-16/9 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                  <PhotoFrame
                    src={images[imageIndex]}
                    alt={title}
                    fallbackLabel={isAr ? 'لا توجد صور بعد' : 'No photos yet'}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                </div>

                {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImg(idx)}
                      className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        imageIndex === idx ? 'border-sky-600 scale-105 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <PhotoFrame src={img} alt="" fallbackLabel="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                )}
              </>
            ) : (
              <div className="aspect-16/9 w-full rounded-2xl overflow-hidden bg-black shadow-inner flex flex-col justify-center">
                {videoFailed || !flat.videoUrl ? (
                  <p className="text-center text-sm text-slate-300 px-6">
                    {isAr ? 'تعذر تشغيل فيديو الجولة. جرّب الصور أو تواصل مع المالك.' : 'This video tour could not be played. Try the photos or contact the host.'}
                  </p>
                ) : /youtube\.com|youtu\.be/i.test(flat.videoUrl) ? (
                  <a
                    href={flat.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-auto inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 text-sm font-extrabold"
                  >
                    <Video className="w-4 h-4" />
                    {isAr ? 'فتح فيديو الجولة' : 'Open the video tour'}
                  </a>
                ) : (
                  <video
                    src={flat.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                    onError={() => setVideoFailed(true)}
                  >
                    {isAr ? 'متصفحك لا يدعم تشغيل الفيديو.' : 'Your browser does not support video playback.'}
                  </video>
                )}
              </div>
            )}
            {activeMediaTab === 'video' && (
              <p className="text-xs font-bold text-slate-500">
                {flat.videoFilmedOn
                  ? (isAr ? `تاريخ تصوير الجولة: ${flat.videoFilmedOn}` : `Walkthrough filmed on ${flat.videoFilmedOn}`)
                  : (isAr ? 'تاريخ تصوير الجولة غير مسجّل بعد. اطلبه من المالك قبل المعاينة.' : 'The filming date is not recorded yet. Ask the owner before the viewing.')}
              </p>
            )}
            {copied && (
              <p className="text-xs font-bold text-sky-700">{isAr ? 'تم نسخ رابط الشقة.' : 'Flat link copied.'}</p>
            )}
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-sky-50/60 p-4 rounded-2xl border border-sky-100">
            <div className="flex items-center gap-2.5">
              <Bed className="w-5 h-5 text-sky-600" />
              <div>
                <span className="block text-[11px] text-slate-500 font-medium">{isAr ? 'غرف النوم' : 'Bedrooms'}</span>
                <span className="text-sm font-bold text-slate-800">
                  {flat.bedrooms > 0 ? `${flat.bedrooms} ${isAr ? 'غرف' : 'Rooms'}` : (isAr ? 'استوديو' : 'Studio')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Bath className="w-5 h-5 text-sky-600" />
              <div>
                <span className="block text-[11px] text-slate-500 font-medium">{isAr ? 'الحمامات' : 'Bathrooms'}</span>
                <span className="text-sm font-bold text-slate-800">{flat.bathrooms} {isAr ? 'حمام' : 'Baths'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-sky-600" />
              <div>
                <span className="block text-[11px] text-slate-500 font-medium">{isAr ? 'أقصى عدد ضيوف' : 'Max Guests'}</span>
                <span className="text-sm font-bold text-slate-800">{flat.maxGuests} {isAr ? 'أفراد' : 'Guests'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Building className="w-5 h-5 text-sky-600" />
              <div>
                <span className="block text-[11px] text-slate-500 font-medium">{isAr ? 'رقم الطابق والمصعد' : 'Floor & Lift'}</span>
                <span className="text-sm font-bold text-slate-800">
                  {floorLabel(flat.floor, lang)} {flat.hasElevator ? (isAr ? '(مصعد)' : '(lift)') : (isAr ? '(بدون مصعد)' : '(no lift)')}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              {isAr ? 'وصف الشقة ومميزات الموقع' : 'Property Description & Location Features'}
            </h3>
            <p className={`text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 ${description ? 'text-slate-600' : 'text-slate-400 italic'}`}>
              {description || (isAr ? 'لم يُضف وصف لهذه الوحدة بعد. اسأل المالك عن الفرش والموقع.' : 'No description yet. Ask the host about furnishing and location.')}
            </p>
          </div>

          {/* Amenities Checklist */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              {isAr ? 'الخدمات والمرافق المتوفرة' : 'Available Amenities & Services'}
            </h3>
            {(flat.amenities ?? []).length === 0 ? (
              <p className="text-sm text-slate-400 italic">
                {isAr ? 'لم تُذكر المرافق. اطلب التفاصيل من المالك قبل الحجز.' : 'Amenities were not listed. Ask the host before you book.'}
              </p>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {(flat.amenities ?? []).map((amenity) => {
                const item = AMENITY_LABELS[amenity];
                if (!item) return null;
                return (
                  <div
                    key={amenity}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700"
                  >
                    <span className="text-sky-600">{item.icon}</span>
                    <span>{isAr ? item.ar : item.en}</span>
                  </div>
                );
              })}
            </div>
            )}
          </div>

          {(slip || openRequest) && (
            <div className="rounded-3xl border border-sky-200 bg-sky-50 p-4 space-y-2">
              <p className="text-xs font-black tracking-widest text-sky-800">{slip || openRequest?.code}</p>
              <p className="text-sm font-bold text-slate-800">
                {isAr ? 'وثيقة الموعد محفوظة في طلباتي على هذا الجهاز.' : 'The slip is saved under My requests on this device.'}
              </p>
              {openRequest?.status === 'open' && (
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={onKeep} className="px-3 py-2 rounded-2xl bg-emerald-600 text-white text-xs font-extrabold">
                    {isAr ? 'أعجبتني بعد المعاينة' : 'I accept after viewing'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlternatives(onReject())}
                    className="px-3 py-2 rounded-2xl bg-rose-600 text-white text-xs font-extrabold"
                  >
                    {isAr ? 'غير مطابقة، بدون رسوم' : 'Not a match, no fee'}
                  </button>
                </div>
              )}
              {openRequest?.status === 'rejected' && (
                <p className="text-xs font-bold text-rose-700">{isAr ? 'تم تسجيل الرفض بدون أي التزام مالي.' : 'The refusal is recorded with no payment due.'}</p>
              )}
              {openRequest?.status === 'kept' && (
                <p className="text-xs font-bold text-emerald-700">{isAr ? 'تم تسجيل موافقتك بعد المعاينة.' : 'Your acceptance after the viewing is recorded.'}</p>
              )}
            </div>
          )}

          {alternatives.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-black text-slate-900">{isAr ? 'ثلاث بدائل قريبة' : 'Three nearby alternatives'}</h3>
              <div className="grid sm:grid-cols-3 gap-2">
                {alternatives.map((item) => (
                  <button
                    key={item.flat.id}
                    type="button"
                    onClick={() => onPickAlternative(item.flat)}
                    className="text-start rounded-2xl border border-slate-200 p-3 hover:border-sky-300"
                  >
                    <span className="block text-[11px] font-bold text-sky-700">
                      {item.sameArea ? (isAr ? 'نفس المنطقة' : 'Same area') : (isAr ? 'سعر قريب' : 'Similar price')}
                    </span>
                    <span className="block text-xs font-extrabold text-slate-900 line-clamp-2">{pickLang(item.flat.title, lang)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-slate-200 p-4 space-y-3">
            <h3 className="text-sm font-black text-slate-900">{isAr ? 'تقييم بعد الإقامة' : 'Review after the stay'}</h3>
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500">{isAr ? 'لا توجد تقييمات نزلاء على هذا الجهاز بعد.' : 'No guest reviews on this device yet.'}</p>
            ) : (
              <div className="space-y-2">
                {reviews.map((review) => (
                  <p key={review.id} className="text-xs text-slate-700">
                    <span className="font-extrabold">{review.name}</span>
                    {' · '}
                    {review.rating}/5
                    {' — '}
                    {review.text}
                  </p>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-1 text-xs font-bold text-slate-600">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <select value={reviewScore} onChange={(e) => setReviewScore(Number(e.target.value))} className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
                  {[5, 4, 3, 2, 1].map((score) => (
                    <option key={score} value={score}>{score}</option>
                  ))}
                </select>
              </label>
              <input
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={isAr ? 'ماذا طابق الإعلان؟' : 'What matched the listing?'}
                className="flex-1 min-w-40 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  const result = onAddReview(reviewScore, reviewText);
                  if (result === 'signin') onRequestSignIn();
                  else if (result === 'short') setReviewNote(isAr ? 'اكتب 8 أحرف على الأقل.' : 'Write at least 8 characters.');
                  else {
                    setReviewText('');
                    setReviewNote(isAr ? 'تم حفظ تقييمك على هذا الجهاز.' : 'Your review is saved on this device.');
                  }
                }}
                className="px-3 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold"
              >
                {isAr ? 'نشر' : 'Post'}
              </button>
            </div>
            {reviewNote && <p className="text-xs font-bold text-slate-500">{reviewNote}</p>}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-500">{isAr ? 'شكوى عدم مطابقة:' : 'Mismatch report:'}</span>
              {([
                ['mismatch', isAr ? 'الشقة مختلفة' : 'Flat differed'],
                ['missed', isAr ? 'المالك لم يحضر' : 'Owner missed it'],
                ['other', isAr ? 'سبب آخر' : 'Other'],
              ] as const).map(([reason, label]) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => {
                    const result = onReport(reason);
                    if (result === 'signed_out') onRequestSignIn();
                    else if (result === 'duplicate') setReportNote(isAr ? 'سجّلت شكوى على هذه الشقة من قبل.' : 'You already reported this flat.');
                    else setReportNote(isAr ? 'وصلت الشكوى. ثلاث حسابات مختلفة تخفي الشقة من هذا الجهاز.' : 'Report saved. Three different accounts hide the flat on this device.');
                  }}
                  className="px-2.5 py-1 rounded-full border border-rose-200 text-rose-700 text-[11px] font-bold"
                >
                  {label}
                </button>
              ))}
            </div>
            {reportNote && <p className="text-xs font-bold text-rose-700">{reportNote}</p>}
          </div>

          {/* Reservation & Meet Owner Booking Box */}
          <div className="bg-gradient-to-br from-white via-sky-50 to-cyan-50 text-sky-950 p-5 sm:p-6 rounded-3xl shadow-[0_18px_40px_-28px_rgba(14,165,233,0.65)] border border-sky-100 space-y-5">
            
            {/* Mode Selector Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveBookingMode('inspect')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
                    activeBookingMode === 'inspect'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                      : 'bg-white text-sky-800 hover:bg-sky-100 border border-sky-100'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{isAr ? 'مقابلة المالك ومعاينة قبل الدفع' : 'Meet Owner & Inspect First'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveBookingMode('reserve')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
                    activeBookingMode === 'reserve'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                      : 'bg-white text-sky-800 hover:bg-sky-100 border border-sky-100'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>{isAr ? 'حساب التكلفة والحجز المباشر' : 'Direct Booking Calculator'}</span>
                </button>
              </div>

              <div className="text-end space-y-1.5">
                {terms.length > 1 && (
                  <div className="flex gap-1 justify-end">
                    {terms.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTerm(t)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all ${
                          term === t ? 'bg-cyan-400 text-slate-900' : 'bg-white text-sky-800 hover:bg-sky-100 border border-sky-100'
                        }`}
                      >
                        {t === 'summer' ? (isAr ? 'صيفي' : 'Summer') : t === 'winter' ? (isAr ? 'شتوي' : 'Winter') : (isAr ? 'سنوي' : 'Yearly')}
                      </button>
                    ))}
                  </div>
                )}
                <span className="text-xs text-sky-700 font-bold block">{isAr ? termLabel.ar : termLabel.en}</span>
                <span className="text-xl sm:text-2xl font-black text-sky-600">
                  {unitPrice != null ? (
                    <>
                      {unitPrice.toLocaleString('en-US')} <span className="text-xs font-semibold text-sky-700">{isAr ? termLabel.unitAr : termLabel.unitEn}</span>
                    </>
                  ) : (
                    <span className="text-base text-amber-800">{isAr ? 'السعر عند الطلب' : 'Price on request'}</span>
                  )}
                </span>
              </div>
            </div>

            {/* TAB 1: Meet Owner & Inspect Before Pay Flow */}
            {activeBookingMode === 'inspect' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {!flat.canInspectBeforePay && (
                  <p className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-2xl px-3 py-2">
                    {isAr
                      ? 'هذه الوحدة لا تتيح المعاينة قبل الدفع. يمكنك السؤال عن الموعد، أو حساب التكلفة من تبويب الحجز.'
                      : 'This listing does not offer inspection before payment. You can still ask, or use the booking calculator.'}
                  </p>
                )}
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <span className="font-extrabold text-emerald-700 block">
                      {isAr ? 'ضمان المعاينة على الطبيعة قبل الدفع:' : 'Physical Inspection Guarantee:'}
                    </span>
                    <p className="text-emerald-800/90 leading-relaxed">
                      {pickLang(flat.inspectionPolicy, lang) || (isAr
                            ? 'ستلتقي بالمالك أمام العقار لمعاينة الشقة، ولن تدفع قيمة الإقامة إلا بعد التأكد من مطابقتها واستلام المفتاح.'
                            : 'Meet the host at the property and pay only after you are satisfied and receive the keys.')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSameDay(30)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-400 text-amber-950 text-xs font-extrabold"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    {isAr ? 'معاينة خلال 30 دقيقة' : 'Viewing within 30 minutes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSameDay(60)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white text-sky-800 border border-sky-100 text-xs font-extrabold"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    {isAr ? 'معاينة خلال ساعة' : 'Viewing within an hour'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-sky-700 mb-1">
                      {isAr ? 'تاريخ المعاينة المتوقع (يوم الوصول):' : 'Preferred Inspection Date:'}
                    </label>
                    <input
                      type="date"
                      value={inspectionDate}
                      onChange={(e) => setInspectionDate(e.target.value)}
                      className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-sky-700 mb-1">
                      {isAr ? 'الوقت المفضل للمقابلة:' : 'Preferred Time Slot:'}
                    </label>
                    <select
                      value={inspectionTime}
                      onChange={(e) => setInspectionTime(e.target.value)}
                      className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                    >
                      <option value="11:00 AM" className="text-slate-900">11:00 AM - {isAr ? 'صباحاً' : 'Morning'}</option>
                      <option value="01:00 PM" className="text-slate-900">01:00 PM - {isAr ? 'ظهراً (وقت وصول السوبر جيت)' : 'Noon'}</option>
                      <option value="03:00 PM" className="text-slate-900">03:00 PM - {isAr ? 'عصراً' : 'Afternoon'}</option>
                      <option value="06:00 PM" className="text-slate-900">06:00 PM - {isAr ? 'مساءً' : 'Evening'}</option>
                      <option value="09:00 PM" className="text-slate-900">09:00 PM - {isAr ? 'ليلاً' : 'Night'}</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                  <div className="text-xs text-slate-500">
                    <span>{isAr ? 'مكان اللقاء: أمام مدخل العمارة في ' : 'Meeting Point: Building entrance at '}</span>
                    <strong className="text-sky-900">{areaName}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {!signedIn ? (
                      <button
                        type="button"
                        onClick={onRequestSignIn}
                        className="px-5 py-3 rounded-2xl bg-sky-500 text-white text-sm font-extrabold shadow-md shadow-sky-200"
                      >
                        {isAr ? 'سجل الدخول للتواصل مع المالك' : 'Sign in to contact the owner'}
                      </button>
                    ) : call && (
                    <a
                      href={`tel:${call}`}
                      className="p-3 rounded-2xl bg-white border border-sky-200 hover:bg-sky-50 text-sky-700 transition-colors"
                      title={isAr ? 'اتصال مباشر بالمالك' : 'Call Host'}
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                    )}

                    {signedIn && wa ? (
                    <button
                      onClick={handleWhatsAppInspection}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{isAr ? 'تأكيد موعد المعاينة عبر واتساب' : 'Schedule Inspection via WhatsApp'}</span>
                    </button>
                    ) : signedIn ? (
                      <span className="text-xs font-bold text-amber-800">{isAr ? 'لا يوجد رقم واتساب' : 'No WhatsApp number'}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Direct Stay Booking Calculator Flow */}
            {activeBookingMode === 'reserve' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-sky-700 mb-1">
                      {isAr ? 'تاريخ الوصول:' : 'Check-in Date:'}
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-sky-700 mb-1">
                      {isSummer ? (isAr ? 'تاريخ المغادرة:' : 'Check-out Date:') : (isAr ? 'مدة الإيجار:' : 'Lease length:')}
                    </label>
                    {isSummer ? (
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-400"
                      />
                    ) : (
                      <select
                        value={effectiveMonths}
                        onChange={(e) => setMonths(Number(e.target.value))}
                        className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-400 cursor-pointer"
                      >
                        {monthOptions.map((m) => (
                          <option key={m} value={m} className="text-slate-900">
                            {m} {isAr ? 'شهر' : 'months'}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-sky-700 mb-1">
                      {isAr ? 'عدد الأفراد:' : 'Guests:'}
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-400 cursor-pointer"
                    >
                      {Array.from({ length: guestCap }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n} className="text-slate-900">
                          {n} {isAr ? 'أفراد' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {datesInvalid && (
                  <p className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl px-3 py-2">
                    {isAr ? 'تاريخ المغادرة لازم يكون بعد تاريخ الوصول.' : 'Check-out has to be after check-in.'}
                  </p>
                )}

                {isSummer && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 space-y-2">
                    <p className="text-xs font-extrabold text-amber-900">
                      {peakStay
                        ? (isAr ? 'ذروة يوليو وأغسطس: يمكن حفظ الشقة بعربون جدية.' : 'July and August peak: you can hold the flat with a seriousness amount.')
                        : (isAr ? 'حفظ بعربون جدية، وأهميته أكبر في يوليو وأغسطس.' : 'A seriousness hold is available, and matters most in July and August.')}
                    </p>
                    <p className="text-[11px] text-amber-800/90 leading-relaxed">
                      {hold != null
                        ? (isAr
                          ? `المبلغ المسجّل ${hold.toLocaleString('en-US')} ج.م، وهو الأقل بين ليلة واحدة و10% من الإقامة. الموقع لا يستلم هذا المبلغ. يُدفع للمالك فقط بعد المعاينة وموافقتك، ويُرد إذا رفضت لعدم المطابقة.`
                          : `The recorded amount is ${hold.toLocaleString('en-US')} EGP, the smaller of one night and 10% of the stay. This site does not collect it. It is paid to the owner only after you inspect and accept, and returned if you reject a mismatch.`)
                        : (isAr ? 'أدخل السعر والتواريخ ليظهر مبلغ العربون. بدون سعر، يُتفق على المبلغ مع المالك بعد المعاينة.' : 'Add a price and dates to show the hold. Without a price, the amount is agreed with the owner after the viewing.')}
                    </p>
                    {signedIn && wa && (
                      <button
                        type="button"
                        onClick={handleHold}
                        disabled={datesInvalid}
                        className="px-4 py-2 rounded-2xl bg-amber-300 text-amber-950 text-xs font-extrabold disabled:opacity-40"
                      >
                        {isAr ? 'حفظ الشقة وإرسال الكود' : 'Hold the flat and send the code'}
                      </button>
                    )}
                  </div>
                )}

                <div className="pt-3 border-t border-sky-100 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <span className="text-xs text-sky-700 block">
                      {isSummer
                        ? (isAr ? `إجمالي الإقامة (${nights} ليالي):` : `Total Stay (${nights} nights):`)
                        : (isAr ? `إجمالي الإيجار (${effectiveMonths} شهر):` : `Total Rent (${effectiveMonths} months):`)}
                    </span>
                    <span className="text-2xl font-black text-sky-600">
                      {totalPrice != null
                        ? `${totalPrice.toLocaleString('en-US')} ${isAr ? 'جنيه مصري' : 'EGP'}`
                        : (isAr ? 'السعر عند الطلب' : 'Price on request')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!signedIn ? (
                      <button
                        type="button"
                        onClick={onRequestSignIn}
                        className="px-5 py-3 rounded-2xl bg-sky-500 text-white text-sm font-extrabold shadow-md shadow-sky-200"
                      >
                        {isAr ? 'سجل الدخول للحجز' : 'Sign in to book'}
                      </button>
                    ) : call && (
                    <a
                      href={`tel:${call}`}
                      className="p-3 rounded-2xl bg-white border border-sky-200 hover:bg-sky-50 text-sky-700 transition-colors"
                      title={isAr ? 'اتصال بالمالك' : 'Call Host'}
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                    )}

                    {signedIn && wa ? (
                    <button
                      onClick={handleWhatsAppBooking}
                      disabled={datesInvalid}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-extrabold text-sm shadow-lg shadow-sky-500/30 transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{isAr ? 'تأكيد الحجز بالواتساب' : 'Book via WhatsApp'}</span>
                    </button>
                    ) : signedIn ? (
                      <span className="text-xs font-bold text-amber-800">{isAr ? 'لا يوجد رقم واتساب' : 'No WhatsApp number'}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
