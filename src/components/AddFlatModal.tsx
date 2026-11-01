import React, { useEffect, useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import type { Flat, AreaKey, RentalTerm } from '../types';
import { AREA_GROUPS, MATROUH_AREAS } from '../data/areas';
import { canCall, whatsappDigits } from '../utils/display';

interface AddFlatModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  onAddFlat: (flat: Flat) => void;
}

export const AddFlatModal: React.FC<AddFlatModalProps> = ({
  isOpen,
  onClose,
  lang,
  onAddFlat,
}) => {
  if (!isOpen) return null;
  return <AddFlatForm onClose={onClose} lang={lang} onAddFlat={onAddFlat} />;
};

const AddFlatForm: React.FC<Omit<AddFlatModalProps, 'isOpen'>> = ({
  onClose,
  lang,
  onAddFlat,
}) => {
  const isAr = lang === 'ar';

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [area, setArea] = useState<AreaKey>('al_abyad');
  const [price, setPrice] = useState(2000);
  const [winterPrice, setWinterPrice] = useState(6000);
  const [yearlyPrice, setYearlyPrice] = useState(4500);
  const [rentalTerms, setRentalTerms] = useState<RentalTerm[]>(['summer']);
  const toggleTerm = (t: RentalTerm) =>
    setRentalTerms((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [maxGuests, setMaxGuests] = useState(5);
  const [floor, setFloor] = useState(2);
  const [hasSeaView, setHasSeaView] = useState(true);
  const [hasElevator, setHasElevator] = useState(true);
  const [phone, setPhone] = useState('+201000000000');
  const [whatsapp, setWhatsapp] = useState('+201000000000');
  const [descAr, setDescAr] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
  );
  const [videoUrl, setVideoUrl] = useState('');
  const [canInspectBeforePay, setCanInspectBeforePay] = useState(true);
  const [meters, setMeters] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim()) {
      setFormError(isAr ? 'اكتب عنوان الشقة بالعربية.' : 'Add an Arabic title.');
      return;
    }
    if (rentalTerms.length === 0) {
      setFormError(isAr ? 'اختر نوع إيجار واحد على الأقل.' : 'Choose at least one rental type.');
      return;
    }
    if (rentalTerms.includes('summer') && (!Number.isFinite(price) || price < 500)) {
      setFormError(isAr ? 'سعر الليلة لازم يكون 500 جنيه أو أكثر.' : 'Nightly price must be at least 500 EGP.');
      return;
    }
    if (rentalTerms.includes('winter') && (!Number.isFinite(winterPrice) || winterPrice <= 0)) {
      setFormError(isAr ? 'اكتب الإيجار الشهري للموسم الشتوي.' : 'Add the winter monthly rent.');
      return;
    }
    if (rentalTerms.includes('yearly') && (!Number.isFinite(yearlyPrice) || yearlyPrice <= 0)) {
      setFormError(isAr ? 'اكتب الإيجار الشهري للعقد السنوي.' : 'Add the yearly monthly rent.');
      return;
    }
    if (!canCall(phone) && !whatsappDigits(whatsapp)) {
      setFormError(isAr ? 'أضف رقم واتساب أو هاتف صحيح (8 أرقام على الأقل).' : 'Add a valid WhatsApp or phone number (at least 8 digits).');
      return;
    }
    const photo = imageUrl.trim();
    if (photo && !/^https?:\/\//i.test(photo)) {
      setFormError(isAr ? 'رابط الصورة لازم يبدأ بـ http أو https، أو اتركه فارغاً.' : 'Photo link must start with http or https, or leave it empty.');
      return;
    }
    const clip = videoUrl.trim();
    if (clip && !/^https?:\/\//i.test(clip)) {
      setFormError(isAr ? 'رابط الفيديو لازم يبدأ بـ http أو https، أو اتركه فارغاً.' : 'Video link must start with http or https, or leave it empty.');
      return;
    }
    const beachMetres = meters.trim() === '' ? undefined : Number(meters);
    if (beachMetres != null && (!Number.isFinite(beachMetres) || beachMetres <= 0)) {
      setFormError(isAr ? 'اكتب المسافة للبحر بالمتر، أو اتركها فارغة.' : 'Enter the beach distance in metres, or leave it empty.');
      return;
    }
    setFormError('');

    const selectedAreaObj = MATROUH_AREAS.find((b) => b.key === area);

    const newFlat: Flat = {
      id: `custom-flat-${Date.now()}`,
      rentalTerms,
      winterMonthlyPrice: rentalTerms.includes('winter') ? Number(winterPrice) : undefined,
      yearlyMonthlyPrice: rentalTerms.includes('yearly') ? Number(yearlyPrice) : undefined,
      title: {
        ar: titleAr.trim(),
        en: titleEn.trim() || titleAr.trim(),
      },
      area,
      areaName: {
        ar: selectedAreaObj ? selectedAreaObj.nameAr : 'مرسى مطروح',
        en: selectedAreaObj ? selectedAreaObj.nameEn : 'Marsa Matrouh',
      },
      pricePerNight: rentalTerms.includes('summer') ? Number(price) : 0,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      beds: Number(bedrooms) * 2,
      maxGuests: Number(maxGuests),
      floor,
      hasElevator,
      hasSeaView,
      distanceMeters: beachMetres,
      distanceToBeach: beachMetres
        ? { ar: `${beachMetres} متر من الشاطئ`, en: `${beachMetres}m from the beach` }
        : {
            ar: hasSeaView ? 'إطلالة بحرية مباشرة' : 'خطوات بسيطة من الشاطئ',
            en: hasSeaView ? 'Direct sea view' : 'Walking distance to beach',
          },
      images: photo ? [photo] : [],
      videoUrl: clip || undefined,
      canInspectBeforePay,
      rating: 0,
      reviewCount: 0,
      amenities: ['wifi', 'ac', 'kitchen', 'balcony', 'parking', 'tv'],
      description: {
        ar: descAr || 'شقة مميزة ومجهزة بالكامل لقضاء عطلة مصيفية رائعة في مرسى مطروح.',
        en: 'A superb fully equipped apartment ready for an unforgettable holiday in Marsa Matrouh.',
      },
      phoneContact: canCall(phone) ? phone.trim() : '',
      whatsappNumber: whatsappDigits(whatsapp) ? whatsapp.trim() : phone.trim(),
      isFeatured: false,
      isSuperhost: false,
    };

    onAddFlat(newFlat);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-sky-100/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-sky-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-600 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {isAr ? 'أضف شقتك أو شاليهك للإيجار' : 'List Your Flat or Chalet for Rent'}
              </h2>
              <p className="text-xs text-slate-500">
                {isAr ? 'اعرض وحدتك مباشرة للمصطافين في مرسى مطروح' : 'Reach vacationers directly with zero commission'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'عنوان الشقة (عربي)*' : 'Title (Arabic)*'}
              </label>
              <input
                type="text"
                required
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder={isAr ? 'مثال: شاليه سوبر لوكس على شاطئ الأبيض' : 'e.g. Super Lux Chalet at Al-Abyad'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'عنوان الشقة (إنجليزي - اختياري)' : 'Title (English - Optional)'}
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Super Lux Chalet at Al-Abyad"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>
          </div>

          {/* Rental terms & pricing */}
          <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4 space-y-3">
            <span className="block text-xs font-bold text-slate-700">
              {isAr ? 'نوع الإيجار والأسعار* (اختر واحداً أو أكثر)' : 'Rental types & prices* (choose one or more)'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {([
                { k: 'summer', ar: 'صيفي - السعر لليلة', en: 'Summer - per night', val: price, set: setPrice, min: 500, step: 50 },
                { k: 'winter', ar: 'شتوي - الإيجار الشهري', en: 'Winter - per month', val: winterPrice, set: setWinterPrice, min: 1000, step: 100 },
                { k: 'yearly', ar: 'سنوي - الإيجار الشهري', en: 'Yearly - per month', val: yearlyPrice, set: setYearlyPrice, min: 1000, step: 100 },
              ] as const).map((t) => {
                const on = rentalTerms.includes(t.k);
                return (
                  <div key={t.k} className={`rounded-xl border p-3 space-y-2 transition-colors ${on ? 'bg-white border-sky-300' : 'bg-slate-50 border-slate-200'}`}>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggleTerm(t.k)}
                        className="w-3.5 h-3.5 text-sky-600 rounded-sm"
                      />
                      <span>{isAr ? t.ar : t.en}</span>
                    </label>
                    <input
                      type="number"
                      disabled={!on}
                      required={on}
                      min={t.min}
                      step={t.step}
                      value={t.val}
                      onChange={(e) => t.set(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium disabled:opacity-40"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'المنطقة أو الشارع*' : 'Area or street*'}
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value as AreaKey)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium cursor-pointer"
              >
                {AREA_GROUPS.map((group) => (
                  <optgroup key={group.id} label={isAr ? group.ar : group.en}>
                    {MATROUH_AREAS.filter((item) => item.group === group.id).map((item) => (
                      <option key={item.key} value={item.key}>
                        {isAr ? item.nameAr : item.nameEn}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'عدد الغرف* (0 = استوديو)' : 'Bedrooms* (0 = studio)'}
              </label>
              <input
                type="number"
                required
                min={0}
                max={10}
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'عدد الحمامات' : 'Bathrooms'}
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'أقصى عدد نزلاء' : 'Max Guests'}
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={maxGuests}
                onChange={(e) => setMaxGuests(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'الدور / الطابق' : 'Floor'}
              </label>
              <input
                type="number"
                min={0}
                max={20}
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'رقم الواتساب للتواصل' : 'WhatsApp Number'}
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+201012345678"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'رقم الهاتف للاتصال' : 'Phone Call Number'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+201012345678"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isAr ? 'المسافة للبحر بالمتر (اختياري)' : 'Metres to the beach (optional)'}
            </label>
            <input
              type="number"
              min={1}
              value={meters}
              onChange={(e) => setMeters(e.target.value)}
              placeholder={isAr ? 'مثال: 80' : 'Example: 80'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={hasSeaView}
                onChange={(e) => setHasSeaView(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded-sm"
              />
              <span>{isAr ? 'إطلالة مباشرة على البحر' : 'Direct Sea View'}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={hasElevator}
                onChange={(e) => setHasElevator(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded-sm"
              />
              <span>{isAr ? 'يوجد مصعد بالعمارة' : 'Building Elevator'}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <input
                type="checkbox"
                checked={canInspectBeforePay}
                onChange={(e) => setCanInspectBeforePay(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm"
              />
              <span>{isAr ? 'أوافق على إتاحة المعاينة الميدانية للنزيل قبل سداد المبلغ' : 'Allow on-site inspection before payment'}</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'رابط صورة رئيسية للشقة (URL)' : 'Main Photo Image URL'}
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'رابط فيديو جولة للشقة (MP4 / YouTube)' : 'Video Tour Walkthrough URL'}
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://.../video.mp4"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isAr ? 'وصف إضافي للشقة ومميزاتها' : 'Description'}
            </label>
            <textarea
              rows={3}
              value={descAr}
              onChange={(e) => setDescAr(e.target.value)}
              placeholder={isAr ? 'اكتب تفاصيل الفرش، التكييف، القرب من المطاعم...' : 'Write flat details...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {formError && (
            <p className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2" role="alert">
              {formError}
            </p>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-bold"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-extrabold text-sm shadow-md shadow-sky-600/30 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة الشقة الآن' : 'Publish Flat'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
