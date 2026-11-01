import React from 'react';
import { RotateCcw, Building2, Wind, ArrowUpDown, Home, Sun, Snowflake, CalendarRange, Eye, X, Users, ShieldCheck, Video, MapPin } from 'lucide-react';
import type { FilterState } from '../types';
import { AREA_GROUPS, MATROUH_AREAS } from '../data/areas';
import { PRICE_RANGE } from '../utils/rental';

interface FilterBarProps {
  lang: 'ar' | 'en';
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  matchingCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  lang,
  filters,
  onFilterChange,
  onResetFilters,
  matchingCount,
}) => {
  const isAr = lang === 'ar';
  const range = PRICE_RANGE[filters.rentalTerm === 'all' ? 'summer' : filters.rentalTerm];

  return (
    <div className="bg-white/90 rounded-[1.75rem] p-5 shadow-[0_16px_40px_-28px_rgba(12,74,110,0.55)] border border-white mb-8 space-y-5 backdrop-blur-sm">
      
      {/* 0. Rental Term Tabs */}
      <div>
        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          {isAr ? 'نوع الإيجار' : 'Rental Type'}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {([
            { key: 'all', icon: <Home className="w-4 h-4" />, ar: 'الكل', en: 'All' },
            { key: 'summer', icon: <Sun className="w-4 h-4" />, ar: 'صيفي (يومي)', en: 'Summer (nightly)' },
            { key: 'winter', icon: <Snowflake className="w-4 h-4" />, ar: 'شتوي (شهري)', en: 'Winter (monthly)' },
            { key: 'yearly', icon: <CalendarRange className="w-4 h-4" />, ar: 'سنوي', en: 'Yearly lease' },
          ] as const).map((t) => {
            const active = filters.rentalTerm === t.key;
            return (
              <button
                key={t.key}
                onClick={() =>
                  onFilterChange({
                    rentalTerm: t.key,
                    maxPrice: PRICE_RANGE[t.key === 'all' ? 'summer' : t.key].max,
                  })
                }
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  active
                    ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-600/30'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                {t.icon}
                <span>{isAr ? t.ar : t.en}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* 1. Beach Area Horizontal Pills */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isAr ? 'اختر المنطقة: شاطئ، شارع، أو حي' : 'Choose a beach, street, or district'}
          </span>
          <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full">
            {matchingCount} {isAr ? 'شقة متاحة' : 'flats available'}
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <AreaPill
              active={filters.area === 'all'}
              label={isAr ? 'كل المناطق' : 'All areas'}
              onClick={() => onFilterChange({ area: 'all' })}
            />
          </div>
          {AREA_GROUPS.map((group) => (
            <div key={group.id}>
              <span className="block text-[11px] font-extrabold text-slate-400 mb-1.5">{isAr ? group.ar : group.en}</span>
              <div className="flex flex-wrap gap-2">
                {MATROUH_AREAS.filter((area) => area.group === group.id).map((area) => (
                  <AreaPill
                    key={area.key}
                    active={filters.area === area.key}
                    label={isAr ? area.nameAr : area.nameEn}
                    onClick={() => onFilterChange({ area: area.key })}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* 2. Secondary Filter Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        
        {/* Price Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>
              {filters.rentalTerm === 'winter' || filters.rentalTerm === 'yearly'
                ? (isAr ? 'أقصى إيجار شهري:' : 'Max Monthly Rent:')
                : (isAr ? 'أقصى سعر لليلة:' : 'Max Price per Night:')}
            </span>
            <span className="text-sky-600 font-extrabold">{filters.maxPrice.toLocaleString('en-US')} {isAr ? 'ج.م' : 'EGP'}</span>
          </div>
          <input
            type="range"
            min={range.min}
            max={range.max}
            step={range.step}
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
            className="w-full accent-sky-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>{range.min.toLocaleString('en-US')} {isAr ? 'ج.م' : 'EGP'}</span>
            <span>{range.max.toLocaleString('en-US')}+ {isAr ? 'ج.م' : 'EGP'}</span>
          </div>
        </div>

        {/* Bedrooms Selection */}
        <div className="space-y-1.5">
          <span className="block text-xs font-bold text-slate-700">
            {isAr ? 'عدد الغرف:' : 'Bedrooms:'}
          </span>
          <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1 rounded-2xl">
            {(['any', 1, 2, 3, 4] as const).map((num) => {
              const isSelected = filters.bedrooms === num;
              return (
                <button
                  key={num}
                  onClick={() => onFilterChange({ bedrooms: num })}
                  className={`py-1.5 text-xs font-bold rounded-xl transition-all ${
                    isSelected
                      ? 'bg-white text-sky-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {num === 'any' ? (isAr ? 'الكل' : 'All') : `${num}+`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Checkboxes */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <label className={`flex items-center gap-1.5 cursor-pointer text-xs font-bold select-none px-2.5 py-2 rounded-xl border ${filters.hasSeaView ? 'bg-sky-600 text-white border-sky-600' : 'text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
            <input
              type="checkbox"
              checked={filters.hasSeaView}
              onChange={(e) => onFilterChange({ hasSeaView: e.target.checked })}
              className="w-3.5 h-3.5 text-sky-600 rounded-sm"
            />
            <Eye className="w-3.5 h-3.5" />
            <span>{isAr ? 'رؤية بحر' : 'Sea view'}</span>
          </label>

          <label className={`flex items-center gap-1.5 cursor-pointer text-xs font-bold select-none px-2.5 py-2 rounded-xl border ${filters.hasElevator ? 'bg-sky-600 text-white border-sky-600' : 'text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
            <input
              type="checkbox"
              checked={filters.hasElevator}
              onChange={(e) => onFilterChange({ hasElevator: e.target.checked })}
              className="w-3.5 h-3.5 text-sky-600 rounded-sm"
            />
            <Building2 className={`w-3.5 h-3.5 ${filters.hasElevator ? 'text-white' : 'text-sky-600'}`} />
            <span>{isAr ? 'مصعد' : 'Elevator'}</span>
          </label>

          <label className={`flex items-center gap-1.5 cursor-pointer text-xs font-bold select-none px-2.5 py-2 rounded-xl border ${filters.hasAC ? 'bg-sky-600 text-white border-sky-600' : 'text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
            <input
              type="checkbox"
              checked={filters.hasAC}
              onChange={(e) => onFilterChange({ hasAC: e.target.checked })}
              className="w-3.5 h-3.5 text-sky-600 rounded-sm"
            />
            <Wind className={`w-3.5 h-3.5 ${filters.hasAC ? 'text-white' : 'text-sky-600'}`} />
            <span>{isAr ? 'تكييف' : 'AC'}</span>
          </label>

          <label className={`flex items-center gap-1.5 cursor-pointer text-xs font-bold select-none px-2.5 py-2 rounded-xl border ${filters.inspectOnly ? 'bg-emerald-600 text-white border-emerald-600' : 'text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
            <input type="checkbox" checked={filters.inspectOnly} onChange={(e) => onFilterChange({ inspectOnly: e.target.checked })} className="w-3.5 h-3.5 rounded-sm" />
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAr ? 'معاينة قبل الدفع' : 'Inspect first'}</span>
          </label>

          <label className={`flex items-center gap-1.5 cursor-pointer text-xs font-bold select-none px-2.5 py-2 rounded-xl border ${filters.hasVideo ? 'bg-purple-600 text-white border-purple-600' : 'text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
            <input type="checkbox" checked={filters.hasVideo} onChange={(e) => onFilterChange({ hasVideo: e.target.checked })} className="w-3.5 h-3.5 rounded-sm" />
            <Video className="w-3.5 h-3.5" />
            <span>{isAr ? 'فيديو جولة' : 'Video tour'}</span>
          </label>

          <label className={`flex items-center gap-1.5 cursor-pointer text-xs font-bold select-none px-2.5 py-2 rounded-xl border ${filters.nearBeach ? 'bg-sky-600 text-white border-sky-600' : 'text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
            <input type="checkbox" checked={filters.nearBeach} onChange={(e) => onFilterChange({ nearBeach: e.target.checked })} className="w-3.5 h-3.5 rounded-sm" />
            <MapPin className="w-3.5 h-3.5" />
            <span>{isAr ? 'حتى 100 متر' : 'Within 100m'}</span>
          </label>

          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50">
            <Users className="w-3.5 h-3.5 text-sky-600" />
            <select
              value={filters.guests}
              onChange={(e) => onFilterChange({ guests: Number(e.target.value) })}
              className="bg-transparent font-bold focus:outline-hidden"
            >
              <option value={0}>{isAr ? 'أي عدد' : 'Any guests'}</option>
              {[2, 4, 6, 8, 10].map((count) => (
                <option key={count} value={count}>{count}+ {isAr ? 'أفراد' : 'guests'}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Sort & Reset Actions */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute top-3 right-3 rtl:right-3 ltr:left-3 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-8 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="recommended">{isAr ? 'الأعلى تميزاً' : 'Recommended'}</option>
              <option value="price_asc">{isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
              <option value="price_desc">{isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              <option value="rating">{isAr ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
              <option value="distance">{isAr ? 'الأقرب للبحر' : 'Closest to the beach'}</option>
            </select>
          </div>

          <button
            onClick={onResetFilters}
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors"
            title={isAr ? 'إعادة ضبط الفلاتر' : 'Reset filters'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {(filters.searchQuery.trim() || filters.area !== 'all' || filters.rentalTerm !== 'all' || filters.bedrooms !== 'any' || filters.hasSeaView || filters.hasElevator || filters.hasAC || filters.guests > 0 || filters.inspectOnly || filters.hasVideo || filters.nearBeach) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-slate-400">{isAr ? 'الفلاتر النشطة' : 'Active filters'}</span>
          {filters.searchQuery.trim() && (
            <button type="button" onClick={() => onFilterChange({ searchQuery: '' })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-200">
              {filters.searchQuery.trim()}
              <X className="w-3 h-3" />
            </button>
          )}
          {filters.area !== 'all' && (
            <button type="button" onClick={() => onFilterChange({ area: 'all' })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 text-[11px] font-bold border border-sky-200">
              {isAr ? MATROUH_AREAS.find((b) => b.key === filters.area)?.nameAr : MATROUH_AREAS.find((b) => b.key === filters.area)?.nameEn}
              <X className="w-3 h-3" />
            </button>
          )}
          {filters.rentalTerm !== 'all' && (
            <button type="button" onClick={() => onFilterChange({ rentalTerm: 'all', maxPrice: 5000 })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 text-[11px] font-bold border border-sky-200">
              {filters.rentalTerm === 'summer' ? (isAr ? 'صيفي' : 'Summer') : filters.rentalTerm === 'winter' ? (isAr ? 'شتوي' : 'Winter') : (isAr ? 'سنوي' : 'Yearly')}
              <X className="w-3 h-3" />
            </button>
          )}
          {filters.bedrooms !== 'any' && (
            <button type="button" onClick={() => onFilterChange({ bedrooms: 'any' })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 text-[11px] font-bold border border-sky-200">
              {filters.bedrooms}+ {isAr ? 'غرف' : 'beds'}
              <X className="w-3 h-3" />
            </button>
          )}
          {filters.guests > 0 && (
            <button type="button" onClick={() => onFilterChange({ guests: 0 })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 text-[11px] font-bold border border-sky-200">
              {filters.guests}+ {isAr ? 'أفراد' : 'guests'}
              <X className="w-3 h-3" />
            </button>
          )}
          {filters.inspectOnly && (
            <button type="button" onClick={() => onFilterChange({ inspectOnly: false })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              {isAr ? 'معاينة قبل الدفع' : 'Inspect first'}
              <X className="w-3 h-3" />
            </button>
          )}
          {filters.hasVideo && (
            <button type="button" onClick={() => onFilterChange({ hasVideo: false })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 text-[11px] font-bold border border-purple-200">
              {isAr ? 'فيديو' : 'Video'}
              <X className="w-3 h-3" />
            </button>
          )}
          {filters.nearBeach && (
            <button type="button" onClick={() => onFilterChange({ nearBeach: false })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 text-[11px] font-bold border border-sky-200">
              {isAr ? 'حتى 100 متر' : 'Within 100m'}
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

    </div>
  );
};

const AreaPill: React.FC<{ active: boolean; label: string; onClick: () => void }> = ({ active, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`whitespace-nowrap px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all ${
      active
        ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
    }`}
  >
    {label}
  </button>
);
