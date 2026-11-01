import React from 'react';
import { Waves, Phone, MessageCircle, Heart, MapPin, Compass } from 'lucide-react';
import type { AreaKey } from '../types';
import type { AppPage } from './SitePages';
import { MATROUH_AREAS } from '../data/areas';

interface FooterProps {
  lang: 'ar' | 'en';
  onBeach: (area: AreaKey) => void;
  onPage: (page: AppPage) => void;
}

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC<FooterProps> = ({ lang, onBeach, onPage }) => {
  const isAr = lang === 'ar';

  return (
    <footer className="bg-white/80 text-slate-600 pt-16 pb-12 border-t border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Intro */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
                <Waves className="w-6 h-6" />
              </div>
              <span className="font-black text-xl text-sky-800">
                {isAr ? 'مصايف مرسى مطروح' : 'Matrouh Escapes'}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isAr
                ? 'المنصة الأولى المخصصة لخدمة حجز الشقق والشاليهات المصيفية في مرسى مطروح مباشرة من الملاك، بأعلى معايير المصداقية وبدون عمولات وسيط.'
                : 'The dedicated portal for renting chalets and holiday flats across Marsa Matrouh directly from owners, without middleman commissions.'}
            </p>
            <div className="flex items-center gap-3 text-sky-700">
              <a
                href="https://wa.me/201012345678"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="tel:+201012345678"
                className="p-2.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-500 hover:text-white transition-colors"
                title="Call us"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Famous Beaches Guide */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-cyan-500" />
              <span>{isAr ? 'مناطق وشوارع مطروح' : 'Matrouh areas and streets'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              {MATROUH_AREAS.filter((area) => ['alam_el_roum', 'alexandria_st', 'souq_libya', 'ageeba', 'corniche', 'el_zohour', 'porto_matrouh', 'el_negaila'].includes(area.key)).map((area) => (
                <li key={area.key}>
                  <button type="button" onClick={() => onBeach(area.key as AreaKey)} className="hover:text-sky-600 text-start">
                    {isAr ? area.nameAr : area.nameEn}
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => onPage('beaches')} className="text-sky-600 font-bold">
                  {isAr ? 'كل المناطق' : 'All areas'}
                </button>
              </li>
            </ul>
          </div>

          {/* Vacation Tips */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'نصائح للمصطافين' : 'Vacationer Tips'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>{isAr ? 'سوق ليبيا الشهير بالزيوت والأعشاب والمكسرات' : 'Vibrant Libyan Souk for local herbs, oils & nuts'}</li>
              <li>{isAr ? 'أشهى المأكولات البدوية وأسماك البحر المتوسط' : 'Authentic Bedouin cuisine & fresh Mediterranean seafood'}</li>
              <li>{isAr ? 'جولات اللنشات البحرية في لسان الفيروز' : 'Speedboat and cruise tours at Al-Fayrouz bay'}</li>
              <li>{isAr ? 'شراء النعناع واللب المطروحي الشهير' : 'Traditional Matrouhi dried mint and fresh snacks'}</li>
            </ul>
          </div>

          {/* Quick Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-sky-900 uppercase tracking-wider">
              {isAr ? 'خدمة الملاك والنزلاء' : 'Guest & Host Support'}
            </h4>
            <p className="text-xs text-slate-500">
              {isAr
                ? 'هل تمتلك شقة أو شاليه في مطروح وتريد تأجيره؟ تواصل معنا لنشر وحدتك فوراً.'
                : 'Do you own a property in Marsa Matrouh? Contact us to list your property.'}
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => onPage('policy')} className="px-3 py-1.5 rounded-xl bg-sky-50 text-xs font-bold text-sky-800">
                {isAr ? 'الضمان' : 'Guarantee'}
              </button>
              <button type="button" onClick={() => onPage('services')} className="px-3 py-1.5 rounded-xl bg-amber-50 text-xs font-bold text-amber-800">
                {isAr ? 'الخدمات' : 'Services'}
              </button>
            </div>
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100 space-y-1">
              <span className="text-[11px] text-slate-500 block">{isAr ? 'الخط الساخن للمصايف:' : 'Support Hotline:'}</span>
              <span className="text-sm font-extrabold text-sky-600 font-mono">+20 10 1234 5678</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-sky-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {CURRENT_YEAR} {isAr ? 'جميع الحقوق محفوظة - شقق وشاليهات مرسى مطروح' : 'Marsa Matrouh Flats & Chalets. All rights reserved.'}
          </p>
          <p className="flex items-center gap-1">
            <span>{isAr ? 'صُنِع بحب لعشاق بحر مطروح' : 'Crafted with love for Marsa Matrouh lovers'}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>

      </div>
    </footer>
  );
};
