import React from 'react';
import { Waves, PlusCircle, Globe, MessageCircle, LogIn, LogOut } from 'lucide-react';
import type { Account } from '../utils/accounts';

interface NavbarProps {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  onOpenAddModal: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onSignOut: () => void;
  onHome: () => void;
  account: Account | null;
  totalFlats: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  onOpenAddModal,
  onOpenAuth,
  onSignOut,
  onHome,
  account,
  totalFlats,
}) => {
  const isAr = lang === 'ar';

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-sky-100 shadow-[0_10px_30px_-18px_rgba(14,165,233,0.45)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <button type="button" onClick={onHome} className="flex items-center gap-3 text-start">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-cyan-300 to-teal-300 flex items-center justify-center text-white shadow-md shadow-sky-300/40 transform hover:scale-105 transition-all">
              <Waves className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                  {isAr ? 'مصايف مرسى مطروح' : 'Matrouh Escapes'}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800 border border-cyan-200">
                  {totalFlats} {isAr ? 'شقة متاحة' : 'Flats'}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {isAr ? 'شقق وشاليهات مصيفية مباشرة من المالك' : 'Direct Chalets & Vacation Flats from Owners'}
              </p>
            </div>
          </button>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Language Switcher */}
            <button
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 transition-colors"
              title={isAr ? 'Switch to English' : 'التحويل للعربية'}
            >
              <Globe className="w-4 h-4 text-sky-600" />
              <span>{isAr ? 'EN' : 'عربي'}</span>
            </button>

            {/* List Property / Add Flat Button */}
            {account ? (
              <button
                type="button"
                onClick={onSignOut}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-700 border border-slate-200"
                title={account.email}
              >
                <LogOut className="w-4 h-4" />
                <span className="max-w-24 truncate">{account.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 border border-slate-200"
              >
                <LogIn className="w-4 h-4 text-sky-600" />
                <span>{isAr ? 'دخول' : 'Sign in'}</span>
              </button>
            )}

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 shadow-2xs transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4 text-sky-600" />
              <span>{isAr ? 'أضف شقتك للإيجار' : 'List Your Flat'}</span>
            </button>

            {/* Direct Support WhatsApp */}
            <a
              href="https://wa.me/201012345678?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AD%D8%AC%D8%B2%20%D8%B4%D9%82%D8%A9%20%D9%81%D9%8A%20%D9%85%D8%B1%D8%B3%D9%89%20%D9%85%D8%B7%D8%B1%D9%88%D8%AD"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isAr ? 'خدمة العملاء' : 'WhatsApp Us'}</span>
            </a>

          </div>

        </div>
      </div>
    </header>
  );
};
