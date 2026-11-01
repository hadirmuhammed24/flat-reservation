import React from 'react';
import {
  Anchor,
  Camera,
  ClipboardList,
  KeyRound,
  LifeBuoy,
  MapPin,
  ShieldCheck,
  Ship,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react';
import type { AreaKey, Flat } from '../types';
import { AREA_GROUPS, MATROUH_AREAS } from '../data/areas';
import type { StayRequest } from '../utils/stay';
import { pickLang } from '../utils/display';
import { PhotoFrame } from './PhotoFrame';

export type AppPage = 'home' | 'saved' | 'requests' | 'beaches' | 'policy' | 'services' | 'mine';

const SUPPORT = '201012345678';

const waLink = (text: string) => `https://wa.me/${SUPPORT}?text=${encodeURIComponent(text)}`;

interface NavProps {
  lang: 'ar' | 'en';
  page: AppPage;
  savedCount: number;
  requestCount: number;
  onNavigate: (page: AppPage) => void;
}

export const SiteNav: React.FC<NavProps> = ({ lang, page, savedCount, requestCount, onNavigate }) => {
  const isAr = lang === 'ar';
  const items: { id: AppPage; ar: string; en: string }[] = [
    { id: 'home', ar: 'الدليل', en: 'Catalog' },
    { id: 'saved', ar: `المحفوظة (${savedCount})`, en: `Saved (${savedCount})` },
    { id: 'requests', ar: `طلباتي (${requestCount})`, en: `My requests (${requestCount})` },
    { id: 'mine', ar: 'شقتي', en: 'My listings' },
    { id: 'beaches', ar: 'المناطق', en: 'Areas' },
    { id: 'policy', ar: 'الضمان', en: 'Guarantee' },
    { id: 'services', ar: 'الخدمات', en: 'Services' },
  ];
  return (
    <nav className="bg-white/70 border-b border-sky-100 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto py-3 scrollbar-none">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`whitespace-nowrap px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all ${
              page === item.id ? 'bg-sky-500 text-white shadow-md shadow-sky-300/40' : 'bg-sky-50/80 text-sky-800 hover:bg-white'
            }`}
          >
            {isAr ? item.ar : item.en}
          </button>
        ))}
      </div>
    </nav>
  );
};

const PageShell: React.FC<{ title: string; lede: string; children: React.ReactNode }> = ({ title, lede, children }) => (
  <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
    <div>
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-2xl">{lede}</p>
    </div>
    {children}
  </main>
);

export const SavedPage: React.FC<{
  lang: 'ar' | 'en';
  flats: Flat[];
  onOpen: (flat: Flat) => void;
  onRemove: (id: string) => void;
}> = ({ lang, flats, onOpen, onRemove }) => {
  const isAr = lang === 'ar';
  return (
    <PageShell
      title={isAr ? 'الشقق المحفوظة' : 'Saved flats'}
      lede={isAr ? 'تبقى على هذا الجهاز حتى تقارنها أو تفتح واحدة وتكمل المعاينة.' : 'Kept on this device so you can compare them and continue an inspection.'}
    >
      {flats.length === 0 ? (
        <p className="bg-white rounded-3xl border border-slate-200 p-8 text-sm font-bold text-slate-500">
          {isAr ? 'لم تحفظ شقة بعد. اضغط القلب على البطاقة.' : 'Nothing saved yet. Use the heart on a card.'}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {flats.map((flat) => (
            <article key={flat.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex">
              <button type="button" onClick={() => onOpen(flat)} className="w-32 shrink-0">
                <PhotoFrame src={flat.images?.[0]} alt="" fallbackLabel="" className="w-full h-full object-cover min-h-28" />
              </button>
              <div className="p-4 flex-1 space-y-2">
                <button type="button" onClick={() => onOpen(flat)} className="text-start font-extrabold text-slate-900 line-clamp-2">
                  {pickLang(flat.title, lang)}
                </button>
                <p className="text-xs text-sky-800 font-bold">{pickLang(flat.areaName, lang)}</p>
                <button type="button" onClick={() => onRemove(flat.id)} className="text-xs font-bold text-rose-600">
                  {isAr ? 'إزالة' : 'Remove'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
};

const KIND: Record<StayRequest['kind'], { ar: string; en: string }> = {
  arrival: { ar: 'مقابلة عند الوصول', en: 'Meet on arrival' },
  sameday: { ar: 'معاينة فورية', en: 'Same-day viewing' },
  hold: { ar: 'عربون جدية', en: 'Seriousness hold' },
  direct: { ar: 'حجز مباشر', en: 'Direct booking' },
};

const STATUS: Record<StayRequest['status'], { ar: string; en: string }> = {
  open: { ar: 'بانتظار المعاينة', en: 'Waiting for the viewing' },
  rejected: { ar: 'مرفوضة بدون رسوم', en: 'Rejected, no fee' },
  kept: { ar: 'أعجبتك بعد المعاينة', en: 'Accepted after viewing' },
};

export const RequestsPage: React.FC<{
  lang: 'ar' | 'en';
  rows: StayRequest[];
  signedIn: boolean;
  onOpenFlat: (flatId: string) => void;
  onSignIn: () => void;
}> = ({ lang, rows, signedIn, onOpenFlat, onSignIn }) => {
  const isAr = lang === 'ar';
  return (
    <PageShell
      title={isAr ? 'وثائق المواعيد والحجز' : 'Appointment and booking slips'}
      lede={
        isAr
          ? 'كل طلب يأخذ كوداً. الموقع لا يحصّل مالاً. العربون، إن ذُكر، يُدفع للمالك فقط بعد أن تعاين وتوافق.'
          : 'Each request gets a code. This site does not collect money. A hold, if noted, is paid to the owner only after you inspect and accept.'
      }
    >
      {!signedIn ? (
        <button type="button" onClick={onSignIn} className="px-5 py-3 rounded-2xl bg-sky-700 text-white text-sm font-extrabold">
          {isAr ? 'سجل الدخول لعرض طلباتك' : 'Sign in to see your requests'}
        </button>
      ) : rows.length === 0 ? (
        <p className="bg-white rounded-3xl border border-slate-200 p-8 text-sm font-bold text-slate-500">
          {isAr ? 'لا توجد طلبات. افتح شقة واختر المعاينة أو الحجز أو الحفظ بعربون.' : 'No requests yet. Open a flat and choose inspection, booking, or a hold.'}
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <article key={row.id} className="bg-white rounded-3xl border border-slate-200 p-5 flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-black tracking-widest text-sky-700">{row.code}</p>
                <h3 className="font-extrabold text-slate-900">{isAr ? row.titleAr : row.titleEn}</h3>
                <p className="text-xs text-slate-500">
                  {isAr ? KIND[row.kind].ar : KIND[row.kind].en}
                  {' · '}
                  {row.whenLabel}
                </p>
                <p className="text-xs font-bold text-emerald-700">{isAr ? STATUS[row.status].ar : STATUS[row.status].en}</p>
                {row.holdAmount != null && (
                  <p className="text-xs text-amber-800 font-bold">
                    {isAr ? `عربون مسجّل: ${row.holdAmount.toLocaleString('en-US')} ج.م` : `Recorded hold: ${row.holdAmount.toLocaleString('en-US')} EGP`}
                  </p>
                )}
              </div>
              <button type="button" onClick={() => onOpenFlat(row.flatId)} className="px-4 py-2 rounded-2xl bg-sky-500 text-white text-xs font-bold">
                {isAr ? 'فتح الشقة' : 'Open flat'}
              </button>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
};

export const BeachesPage: React.FC<{
  lang: 'ar' | 'en';
  onPick: (area: AreaKey) => void;
}> = ({ lang, onPick }) => {
  const isAr = lang === 'ar';
  return (
    <PageShell
      title={isAr ? 'مناطق مرسى مطروح' : 'Marsa Matrouh areas'}
      lede={isAr ? 'شواطئ، شوارع، أحياء، وقرى. اختر مكاناً لعرض شققه، والمسافة للبحر مكتوبة في كل إعلان.' : 'Beaches, streets, districts, and villages. Pick a place to see its flats. Each listing states the distance to the sea.'}
    >
      <div className="space-y-8">
        {AREA_GROUPS.map((group) => (
          <section key={group.id} className="space-y-3">
            <h3 className="text-sm font-black text-slate-500">{isAr ? group.ar : group.en}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {MATROUH_AREAS.filter((area) => area.group === group.id).map((area) => (
                <button
                  key={area.key}
                  type="button"
                  onClick={() => onPick(area.key)}
                  className="text-start bg-white rounded-3xl border border-slate-200 p-5 hover:border-sky-300 hover:shadow-lg transition-all space-y-2"
                >
                  <span className="inline-flex items-center gap-2 text-sky-800 font-black">
                    <MapPin className="w-4 h-4" />
                    {isAr ? area.nameAr : area.nameEn}
                  </span>
                  <p className="text-sm text-slate-600 leading-relaxed">{isAr ? area.noteAr : area.noteEn}</p>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
};

export const PolicyPage: React.FC<{ lang: 'ar' | 'en' }> = ({ lang }) => {
  const isAr = lang === 'ar';
  const items = [
    {
      icon: <ClipboardList className="w-5 h-5" />,
      ar: 'وثيقة الموعد',
      en: 'Appointment slip',
      bodyAr: 'كل معاينة أو حجز أو عربون يأخذ كوداً يظهر في طلباتي. أرسل الكود للمالك على واتساب مع الموعد وعدد الأفراد.',
      bodyEn: 'Every viewing, booking, or hold gets a code in My requests. Send that code to the owner on WhatsApp with the time and guest count.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      ar: 'مطابقة المواصفات',
      en: 'The flat must match',
      bodyAr: 'الشقة التي تستلمها هي المعروضة: الصور، والفيديو إن وُجد، والتكييف، والفرش، والمسافة للبحر.',
      bodyEn: 'The flat you receive is the one shown: photos, the video when one exists, air conditioning, furniture, and the beach distance.',
    },
    {
      icon: <LifeBuoy className="w-5 h-5" />,
      ar: 'حق الرفض',
      en: 'Right to refuse',
      bodyAr: 'إذا اختلفت الإطلالة أو تعطّل التكييف أو كانت النظافة غير مقبولة، ارفض من صفحة الشقة. لا رسوم، وتظهر حتى ثلاث بدائل.',
      bodyEn: 'If the view, air conditioning, or cleanliness does not match, reject it from the flat page. There is no fee, and up to three alternatives appear.',
    },
    {
      icon: <Anchor className="w-5 h-5" />,
      ar: 'تكرار المخالفة',
      en: 'Repeated mismatch',
      bodyAr: 'إذا سجّل ثلاثة حسابات مختلفة شكوى عدم مطابقة أو تأخير معاينة على نفس الشقة، تختفي من الدليل على هذا الجهاز.',
      bodyEn: 'If three different accounts report a mismatch or a missed viewing on the same flat, it leaves the catalog on this device.',
    },
  ];
  return (
    <PageShell
      title={isAr ? 'الضمان وحل الخلاف' : 'Guarantee and disputes'}
      lede={isAr ? 'المعاينة قبل دفع باقي الإقامة. الموقع يسجّل الطلب ولا يستلم العربون.' : 'Inspect before paying the rest of the stay. The site records the request and does not take the deposit.'}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <article key={item.en} className="bg-white rounded-3xl border border-slate-200 p-5 space-y-2">
            <span className="text-sky-700">{item.icon}</span>
            <h3 className="font-black text-slate-900">{isAr ? item.ar : item.en}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{isAr ? item.bodyAr : item.bodyEn}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
};

export const ServicesPage: React.FC<{ lang: 'ar' | 'en' }> = ({ lang }) => {
  const isAr = lang === 'ar';
  const items = [
    {
      icon: <Camera className="w-5 h-5" />,
      ar: 'تصوير وفيديو الجولة',
      en: 'Photo and video visit',
      bodyAr: 'مندوب يصور الألبوم وفيديو المدخل والمصعد والصالة والإطلالة. السعر الرمزي 500 جنيه مرة واحدة، ويُتفق عليه مع المندوب.',
      bodyEn: 'A visit for the album and a walkthrough of the entrance, lift, rooms, and view. The token price is 500 EGP once, agreed with the visitor.',
      text: isAr ? 'أريد حجز تصوير شقة في مرسى مطروح' : 'I want a photo visit for a flat in Marsa Matrouh',
    },
    {
      icon: <KeyRound className="w-5 h-5" />,
      ar: 'تسليم المفتاح للمالك خارج مطروح',
      en: 'Key handover for owners away from Matrouh',
      bodyAr: 'للمالك في القاهرة أو الإسكندرية أو الدلتا: المندوب يقابل النزيل، يعاين، يسلّم المفتاح، ويحوّل المبلغ للمالك بعد الموافقة.',
      bodyEn: 'For an owner in Cairo, Alexandria, or the Delta: a representative meets the guest, inspects, hands over the key, and sends the payment after acceptance.',
      text: isAr ? 'أريد خدمة تسليم مفتاح شقة في مطروح' : 'I want key handover for a Matrouh flat',
    },
    {
      icon: <Ship className="w-5 h-5" />,
      ar: 'رحلات اللنش',
      en: 'Boat trips',
      bodyAr: 'رحلات من الغرام والفيروز. اطلبها بعد تثبيت الشقة حتى لا تدفع لرحلة قبل أن تتأكد من السكن.',
      bodyEn: 'Trips from Al-Gharam and Al-Fayrouz. Ask after the flat is confirmed so you do not pay for a trip before the stay is certain.',
      text: isAr ? 'أريد رحلة لنش في مطروح بعد تثبيت الشقة' : 'I want a Matrouh boat trip after the flat is confirmed',
    },
    {
      icon: <UtensilsCrossed className="w-5 h-5" />,
      ar: 'مطاعم الأسماك',
      en: 'Seafood tables',
      bodyAr: 'ترشيح مطاعم السمك والأكل البدوي حسب الشاطئ الذي اخترته.',
      bodyEn: 'A seafood or Bedouin table suggestion based on the beach you picked.',
      text: isAr ? 'أريد ترشيح مطعم قريب من شقتي في مطروح' : 'I want a restaurant near my Matrouh flat',
    },
  ];
  return (
    <PageShell
      title={isAr ? 'خدمات المصيف' : 'Stay services'}
      lede={isAr ? 'الطلب يصل لخدمة العملاء على واتساب. لا يوجد دفع داخل الصفحة.' : 'The request goes to support on WhatsApp. Nothing is paid on this page.'}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <article key={item.en} className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3">
            <span className="text-sky-700">{item.icon}</span>
            <h3 className="font-black text-slate-900">{isAr ? item.ar : item.en}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{isAr ? item.bodyAr : item.bodyEn}</p>
            <a href={waLink(item.text)} target="_blank" rel="noreferrer" className="inline-flex text-xs font-extrabold text-emerald-700">
              {isAr ? 'اطلب الخدمة' : 'Ask for this'}
            </a>
          </article>
        ))}
      </div>
    </PageShell>
  );
};

export const MinePage: React.FC<{
  lang: 'ar' | 'en';
  flats: Flat[];
  signedIn: boolean;
  onOpen: (flat: Flat) => void;
  onDelete: (id: string) => void;
  onSignIn: () => void;
  onAdd: () => void;
}> = ({ lang, flats, signedIn, onOpen, onDelete, onSignIn, onAdd }) => {
  const isAr = lang === 'ar';
  return (
    <PageShell
      title={isAr ? 'شققك المنشورة' : 'Listings you published'}
      lede={isAr ? 'تظهر هنا الشقق التي أضفتها وأنت مسجّل على هذا الجهاز.' : 'Flats you added while signed in on this device appear here.'}
    >
      {!signedIn ? (
        <button type="button" onClick={onSignIn} className="px-5 py-3 rounded-2xl bg-sky-700 text-white text-sm font-extrabold">
          {isAr ? 'سجل الدخول' : 'Sign in'}
        </button>
      ) : (
        <>
          <button type="button" onClick={onAdd} className="px-4 py-2 rounded-2xl bg-sky-50 text-sky-800 text-xs font-extrabold border border-sky-200">
            {isAr ? 'أضف شقة' : 'Add a flat'}
          </button>
          {flats.length === 0 ? (
            <p className="text-sm font-bold text-slate-500">{isAr ? 'لم تنشر شقة بعد.' : 'You have not published a flat yet.'}</p>
          ) : (
            <div className="space-y-3">
              {flats.map((flat) => (
                <article key={flat.id} className="bg-white rounded-3xl border border-slate-200 p-4 flex items-center justify-between gap-3">
                  <button type="button" onClick={() => onOpen(flat)} className="text-start font-extrabold text-slate-900">
                    {pickLang(flat.title, lang)}
                  </button>
                  <button type="button" onClick={() => onDelete(flat.id)} className="p-2 rounded-xl text-rose-600 hover:bg-rose-50" aria-label={isAr ? 'حذف' : 'Delete'}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </PageShell>
  );
};
