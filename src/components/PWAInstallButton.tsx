import React, { useState } from 'react';
import { Check, Copy, Download, Smartphone, WifiOff, X } from 'lucide-react';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showMobileGuide, setShowMobileGuide] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (isInstalled) {
    return null;
  }

  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handlePrimaryClick = () => {
    if (isInstallable) {
      void install();
      return;
    }
    setShowMobileGuide(true);
  };

  const copyUrl = () => {
    if (!appUrl) return;
    void navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 1600);
  };

  return (
    <>
      <button
        type="button"
        onClick={handlePrimaryClick}
        className={`inline-flex items-center gap-1.5 font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
          compact ? 'px-3 py-2 text-xs' : 'px-3.5 py-2 text-xs'
        }`}
      >
        {isInstallable ? (
          <>
            <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>تثبيت على الجوال</span>
          </>
        ) : (
          <>
            <Smartphone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{isIOS ? 'تثبيت على الآيفون' : 'تشغيل على الجوال / APK'}</span>
          </>
        )}
      </button>

      {showMobileGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-guide-title"
        >
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 id="pwa-guide-title" className="text-sm font-bold">
                  تثبيت خَزْنَتِي على الجوال أو تحويله إلى APK
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileGuide(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs leading-relaxed">
              {/* App URL box */}
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-3">
                <span className="font-mono text-slate-700 dark:text-slate-300 truncate" dir="ltr">
                  {appUrl}
                </span>
                <button
                  type="button"
                  onClick={copyUrl}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium hover:border-indigo-400 shrink-0 cursor-pointer"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ الرابط</span>
                    </>
                  )}
                </button>
              </div>

              {isIOS ? (
                <div className="space-y-2">
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    خطوات التثبيت على iPhone / iPad (Safari):
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300">
                    <li>افتح رابط التطبيق في متصفح Safari.</li>
                    <li>اضغط على زر المشاركة (Share) في شريط المتصفح بالأسفل.</li>
                    <li>اختر <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.</li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      1. التثبيت الفوري كتطبيق أندرويد (موصى به — بدون متاجر):
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      افتح رابط التطبيق في متصفح <strong>Google Chrome</strong> على جوالك، ثم اضغط على قائمة النقاط الثلاث (⋮) بالأعلى واختر <strong>تثبيت التطبيق (Install app)</strong> أو <strong>الإضافة إلى الشاشة الرئيسية</strong>. سيعمل التطبيق بملء الشاشة وأيقونة مستقلة مثل أي تطبيق APK.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      2. استخراج ملف APK رسمي جاهز للتنزيل:
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      بما أن هذه البيئة سحابية لتطوير الويب ولا تحتوي على أداة Android Gradle لبناء ملفات APK مباشرة، يمكنك توليد ملف <strong>.apk</strong> موقّع خلال دقيقة واحدة مجاناً عبر خدمة <strong>PWABuilder</strong> (من مايكروسوفت):
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300">
                      <li>انشر التطبيق من زر المشاركة (Share) لتحصل على الرابط العام للتطبيق.</li>
                      <li>افتح موقع <span className="font-mono" dir="ltr">pwabuilder.com</span> والصق رابط التطبيق العام.</li>
                      <li>اختر <strong>Package for Stores → Android → Generate Package</strong> لتحميل ملف APK الجاهز للتثبيت.</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMobileGuide(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 cursor-pointer"
              >
                فهمت
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 px-3.5 py-2 text-xs font-medium text-amber-800 dark:text-amber-200 shadow-lg">
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>وضع عدم الاتصال — يتم عرض النسخة المخزنة مؤقتاً</span>
    </div>
  );
};
