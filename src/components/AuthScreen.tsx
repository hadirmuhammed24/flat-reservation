import React, { useState } from 'react';
import { ArrowLeft, LockKeyhole, Mail, UserRound } from 'lucide-react';
import type { AuthError } from '../utils/accounts';

interface AuthScreenProps {
  lang: 'ar' | 'en';
  mode: 'login' | 'register';
  onMode: (mode: 'login' | 'register') => void;
  onClose: () => void;
  /** When true, the catalog stays hidden until sign-in or registration succeeds. */
  required?: boolean;
  onLogin: (email: string, password: string) => Promise<AuthError | null>;
  onRegister: (input: { name: string; email: string; password: string; confirm: string }) => Promise<AuthError | null>;
}

const ERRORS: Record<AuthError, { ar: string; en: string }> = {
  invalid_email: { ar: 'اكتب بريداً إلكترونياً صحيحاً.', en: 'Enter a valid email address.' },
  weak_password: { ar: 'كلمة المرور لازم تكون 8 أحرف على الأقل.', en: 'Password must be at least 8 characters.' },
  short_name: { ar: 'اكتب اسمك.', en: 'Enter your name.' },
  exists: { ar: 'هذا البريد مسجّل بالفعل. سجّل الدخول.', en: 'This email is already registered. Sign in instead.' },
  mismatch: { ar: 'كلمتا المرور غير متطابقتين.', en: 'The two passwords do not match.' },
  bad_login: { ar: 'البريد أو كلمة المرور غير صحيحة.', en: 'Email or password is incorrect.' },
};

export const AuthScreen: React.FC<AuthScreenProps> = ({
  lang,
  mode,
  onMode,
  onClose,
  required = false,
  onLogin,
  onRegister,
}) => {
  const isAr = lang === 'ar';
  const isRegister = mode === 'register';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<AuthError | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result = isRegister
      ? await onRegister({ name, email, password, confirm })
      : await onLogin(email, password);
    setBusy(false);
    if (result) setError(result);
  };

  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_70px_-36px_rgba(12,74,110,0.55)] border border-white">
        <div className="relative hidden lg:flex flex-col justify-between p-10 text-sky-950 bg-sky-50 min-h-[560px]">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-sky-50/80 to-cyan-50/40" />
          <div className="relative">
            <p className="text-xs font-extrabold tracking-[0.22em] uppercase text-sky-600">
              {isAr ? 'مصايف مرسى مطروح' : 'Matrouh Escapes'}
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight">
              {required
                ? (isAr ? 'ادخل أولاً لتشاهد الشقق' : 'Sign in before the flats open')
                : (isAr ? 'حسابك يحمي رقم المالك وإعلانك' : 'Your account protects owner numbers and new listings')}
            </h1>
          </div>
          <p className="relative text-sm text-sky-800/80 leading-relaxed max-w-sm">
            {required
              ? (isAr
                ? 'الدليل والأسعار وبيانات المالك لا تظهر قبل تسجيل الدخول أو إنشاء حساب.'
                : 'The catalog, prices, and owner details stay hidden until you sign in or create an account.')
              : (isAr
                ? 'تصفح الشقق بدون حساب. سجل الدخول قبل التواصل مع المالك أو إضافة شقة.'
                : 'Browse flats freely. Sign in before contacting an owner or publishing a listing.')}
          </p>
        </div>

        <div className="p-6 sm:p-10">
          {!required && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              {isAr ? 'العودة للشقق' : 'Back to flats'}
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 mb-6">
            <button
              type="button"
              onClick={() => { setError(null); onMode('login'); }}
              className={`py-2.5 rounded-xl text-sm font-extrabold ${!isRegister ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-500'}`}
            >
              {isAr ? 'تسجيل الدخول' : 'Sign in'}
            </button>
            <button
              type="button"
              onClick={() => { setError(null); onMode('register'); }}
              className={`py-2.5 rounded-xl text-sm font-extrabold ${isRegister ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-500'}`}
            >
              {isAr ? 'حساب جديد' : 'Create account'}
            </button>
          </div>

          <h2 className="text-2xl font-black text-slate-900">
            {isRegister
              ? (isAr ? 'أنشئ حسابك' : 'Create your account')
              : (isAr ? 'أهلاً بعودتك' : 'Welcome back')}
          </h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            {required
              ? (isAr
                ? 'الدخول إلزامي قبل عرض الشقق. كلمة المرور تُحفظ مشفّرة على هذا الجهاز.'
                : 'Sign-in is required before the flats are shown. Your password is stored as a hash on this device.')
              : (isAr
                ? 'كلمة المرور تُحفظ مشفّرة على هذا الجهاز، وليست كنص ظاهر.'
                : 'Your password is stored as a hash on this device, never as plain text.')}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {isRegister && (
              <label className="block">
                <span className="text-xs font-bold text-slate-700">{isAr ? 'الاسم' : 'Name'}</span>
                <span className="relative mt-1 block">
                  <UserRound className="w-4 h-4 text-sky-600 absolute top-3.5 start-3" />
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 ps-10 pe-3 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </span>
              </label>
            )}

            <label className="block">
              <span className="text-xs font-bold text-slate-700">{isAr ? 'البريد الإلكتروني' : 'Email'}</span>
              <span className="relative mt-1 block">
                <Mail className="w-4 h-4 text-sky-600 absolute top-3.5 start-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 ps-10 pe-3 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </span>
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-700">{isAr ? 'كلمة المرور' : 'Password'}</span>
              <span className="relative mt-1 block">
                <LockKeyhole className="w-4 h-4 text-sky-600 absolute top-3.5 start-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 ps-10 pe-3 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </span>
            </label>

            {isRegister && (
              <label className="block">
                <span className="text-xs font-bold text-slate-700">{isAr ? 'تأكيد كلمة المرور' : 'Confirm password'}</span>
                <span className="relative mt-1 block">
                  <LockKeyhole className="w-4 h-4 text-sky-600 absolute top-3.5 start-3" />
                  <input
                    type="password"
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                    autoComplete="new-password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 ps-10 pe-3 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </span>
              </label>
            )}

            {error && (
              <p className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2" role="alert">
                {isAr ? ERRORS[error].ar : ERRORS[error].en}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-700 to-cyan-600 text-white font-extrabold shadow-md shadow-sky-700/25 disabled:opacity-60"
            >
              {busy
                ? (isAr ? 'جارٍ الحفظ...' : 'Saving...')
                : isRegister
                  ? (isAr ? 'إنشاء الحساب' : 'Create account')
                  : (isAr ? 'دخول' : 'Sign in')}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};
