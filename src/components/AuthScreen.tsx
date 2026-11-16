import React, { useState } from 'react';
import { Calendar, KeyRound, Link2, Lock, ShieldCheck, Sun, Moon } from 'lucide-react';
import { OfflineIndicator } from './PWAInstallButton';

interface AuthScreenProps {
  onSignIn: () => Promise<void>;
  signingIn: boolean;
  authError: string | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onSignIn,
  signingIn,
  authError,
  theme,
  onToggleTheme,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Clean 3-zone top bar */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-lg font-bold tracking-tight">خَزْنَتِي</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <span className="whitespace-nowrap shrink-0">خريطة الإيميلات</span>
            <span className="whitespace-nowrap shrink-0">التواريخ الحيوية</span>
            <span className="whitespace-nowrap shrink-0">تدقيق الأمان</span>
          </nav>

          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
            aria-label="تبديل المظهر"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
          </button>
        </div>
      </header>

      {/* Main 2-column balanced workspace entry */}
      <main className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 lg:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 tracking-wide">
                إدارة الهوية الرقمية والحسابات الشخصية
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold leading-snug text-balance">
                كل إيميل، كلمة مرور، وتاريخ ميلاد أو إنشاء — منظّم في خزنة واحدة لا تنسى
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                اربط كل بريد إلكتروني بجميع التطبيقات والمواقع المسجّلة به مثل إنستقرام وفيسبوك والمنصات البنكية، مع توثيق دقيق لتاريخ الميلاد المسجّل في كل حساب، وتاريخ إنشائه، وأسئلة الأمان، ورموز الاسترداد.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>شجرة الإيميلات والتطبيقات</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  افتح أي إيميل لترى فوراً كل حساب مسجل به مع كلمة مروره واسم المستخدم الخاص به.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>متتبع تواريخ الميلاد والإنشاء</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  اعرف تاريخ الميلاد المسجل داخل كل تطبيق ومتى أنشأت الحساب لتسهيل الاسترداد دائماً.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>تدقيق التكرار والأمان</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  يكشف كلمات المرور المكررة والضعيفة، وتضارب تواريخ الميلاد، والحسابات التي ينقصها تحقق بخطوتين.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <KeyRound className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>رموز استرداد وقفل الخزنة</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  حفظ أسئلة الأمان، رموز الطوارئ، قفل برمز PIN شخصي، ونسخ احتياطي مشفّر JSON.
                </p>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              {authError && (
                <div className="p-3 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/50 text-xs text-rose-700 dark:text-rose-300">
                  {authError}
                </div>
              )}
              <button
                type="button"
                onClick={() => void onSignIn()}
                disabled={signingIn}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {signingIn ? 'جاري فتح الخزنة...' : 'تسجيل الدخول بحساب Google لفتح خزنتك'}
                </span>
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                بياناتك محفوظة في مساحتك السحابية المعزولة ولا يمكن لأي مستخدم آخر الوصول إليها.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="relative flex-1 min-h-[280px] bg-slate-900">
              {!imgError ? (
                <img
                  src="/src/assets/images/vault_security_art_1794861464643.jpg"
                  alt="خزنة أمان رقمية لحفظ الحسابات وكلمات المرور"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-slate-300 bg-gradient-to-br from-slate-800 to-slate-950">
                  <ShieldCheck className="w-16 h-16 text-indigo-400 mb-4" />
                  <p className="text-sm font-medium">خَزْنَتِي لحفظ الهويات الرقمية</p>
                </div>
              )}
            </div>
            <div className="p-6 bg-slate-900 text-slate-200 border-t border-slate-800 space-y-2">
              <p className="text-sm font-semibold">تنظيم دقيق للتفاصيل الحساسة</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                بمجرد تسجيل الدخول، يمكنك إضافة إيميلاتك الأساسية ثم ربط حسابات التواصل والعمل والألعاب تحت كل إيميل مع تواريخها الكاملة.
              </p>
            </div>
          </div>
        </div>
      </main>
      <OfflineIndicator />
    </div>
  );
};
