import React from 'react';
import { Search, MapPin, Eye, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import type { AreaKey, FilterState } from '../types';
import { AREA_GROUPS, MATROUH_AREAS } from '../data/areas';

interface HeroBannerProps {
  lang: 'ar' | 'en';
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onSearch: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  lang,
  filters,
  onFilterChange,
  onSearch,
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="relative overflow-hidden bg-sky-50 text-sky-950 pt-16 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"
          alt="Marsa Matrouh Mediterranean Sea"
          className="w-full h-full object-cover scale-105 opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-sky-50/75 to-[#f5fbff]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(125,211,252,0.45),transparent_58%)]" />
      </div>

      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-200/50 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-100/70 rounded-full blur-3xl pointer-events-none animate-float [animation-delay:-4s]" />

      {/* Animated waves */}
      <div className="absolute bottom-0 inset-x-0 h-16 overflow-hidden pointer-events-none" dir="ltr" aria-hidden="true">
        <svg className="absolute bottom-0 w-[200%] h-full animate-wave-slow opacity-30" viewBox="0 0 2400 100" preserveAspectRatio="none">
          <path fill="#f5fbff" d="M0 50 Q150 10 300 50 T600 50 T900 50 T1200 50 T1500 50 T1800 50 T2100 50 T2400 50 V100 H0Z" />
        </svg>
        <svg className="absolute bottom-0 w-[200%] h-3/4 animate-wave" viewBox="0 0 2400 100" preserveAspectRatio="none">
          <path fill="#ffffff" d="M0 60 Q150 20 300 60 T600 60 T900 60 T1200 60 T1500 60 T1800 60 T2100 60 T2400 60 V100 H0Z" />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto text-center space-y-6 animate-rise">
        
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-sky-100 text-xs sm:text-sm font-semibold text-sky-700 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>
            {isAr
              ? 'موسم صيف 2026 - احجز شقتك المفروشة بأفضل سعر'
              : 'Summer 2026 Season - Reserve Top Furnished Flats at Best Rates'}
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
          {isAr ? (
            <>
              عِش متعة الصيف في <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 text-shimmer">مرسى مطروح</span>
            </>
          ) : (
            <>
              Experience Paradise in <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 text-shimmer">Marsa Matrouh</span>
            </>
          )}
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-lg text-sky-800/80 font-normal leading-relaxed">
          {isAr
            ? 'شقق وشاليهات فندقية بإطلالات بحرية مباشرة على أجمل شواطئ البحر الأبيض المتوسط: عجيبة، الأبيض، كليوباترا، والغرام مع تواصل مباشر وسريع مع المالك.'
            : 'Explore waterfront chalets and luxury apartments overlooking Egypt’s most crystal turquoise shores: Ageeba, Al-Abyad, Cleopatra, and Al-Gharam.'}
        </p>

        {/* Quick Search Floating Box */}
        <div className="mt-8 bg-white/90 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-[0_24px_60px_-32px_rgba(14,165,233,0.55)] text-slate-800 border border-white max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center">
            
            {/* Search keyword */}
            <div className="sm:col-span-4 text-start">
              <label className="block text-xs font-bold text-slate-500 mb-1 px-1">
                {isAr ? 'بحث بالاسم أو الكلمة' : 'Keyword / Name'}
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-sky-600 absolute top-3.5 right-3 rtl:right-3 ltr:left-3 pointer-events-none" />
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                  placeholder={isAr ? 'مثال: علم الروم، شارع الإسكندرية...' : 'e.g. Alam El-Roum, Alexandria Street...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-9 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Beach Area Selector */}
            <div className="sm:col-span-4 text-start">
              <label className="block text-xs font-bold text-slate-500 mb-1 px-1">
                {isAr ? 'المنطقة أو الشارع' : 'Area or street'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-sky-600 absolute top-3.5 right-3 rtl:right-3 ltr:left-3 pointer-events-none" />
                <select
                  value={filters.area}
                  onChange={(e) => onFilterChange({ area: e.target.value as AreaKey })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-9 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium cursor-pointer"
                >
                  <option value="all">{isAr ? 'كل مناطق مطروح' : 'All Matrouh areas'}</option>
                  {AREA_GROUPS.map((group) => (
                    <optgroup key={group.id} label={isAr ? group.ar : group.en}>
                      {MATROUH_AREAS.filter((area) => area.group === group.id).map((area) => (
                        <option key={area.key} value={area.key}>
                          {isAr ? area.nameAr : area.nameEn}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            {/* Sea View Toggle */}
            <div className="sm:col-span-2 flex items-center justify-center pt-2 sm:pt-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.hasSeaView}
                  onChange={(e) => onFilterChange({ hasSeaView: e.target.checked })}
                  className="w-4 h-4 text-sky-600 rounded-sm focus:ring-sky-500 border-slate-300"
                />
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-sky-600" />
                  {isAr ? 'رؤية بحر' : 'Sea View'}
                </span>
              </label>
            </div>

            {/* Search Submit Button */}
            <div className="sm:col-span-2 pt-1 sm:pt-4">
              <button
                onClick={onSearch}
                className="w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-bold rounded-2xl shadow-md shadow-sky-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
              >
                <Search className="w-4 h-4" />
                <span>{isAr ? 'عرض الشقق' : 'Show Flats'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 max-w-2xl mx-auto gap-3 pt-6">
          {[
            { v: String(MATROUH_AREAS.filter((b) => b.key !== 'all').length), l: isAr ? 'منطقة وشارع' : 'Areas' },
            { v: '0%', l: isAr ? 'عمولة وسيط' : 'Commission' },
            { v: '24/7', l: isAr ? 'تواصل مباشر' : 'Direct Contact' },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-white/80 backdrop-blur-md border border-sky-100 py-3 shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-sky-600">{s.v}</div>
              <div className="text-[11px] sm:text-xs text-sky-800/70 font-semibold">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Feature bullets below */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-emerald-800 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{isAr ? 'قابل المالك وعاين الشقة بنفسك قبل ما تدفع' : 'Meet Owner & Inspect Flat Before Paying'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-full text-violet-800 font-bold">
            <CheckCircle2 className="w-4 h-4 text-violet-500" />
            <span>{isAr ? 'صور وفيديو جولة عند توفرهما' : 'Photos, and a video tour when one exists'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-full text-sky-800 font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'أسعار مباشرة بدون أي عمولات وسيط' : 'Direct from Host, Zero Commission'}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
