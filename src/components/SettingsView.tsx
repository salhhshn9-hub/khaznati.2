import React, { useState } from 'react';
import { Calendar, Database, Download, Lock, ShieldCheck, Upload } from 'lucide-react';
import { VaultAccount, VaultPreferences } from '../types/vault';
import { hashPin } from '../utils/vaultHelpers';

interface SettingsViewProps {
  preferences: VaultPreferences;
  accounts: VaultAccount[];
  onSavePreferences: (updates: Partial<VaultPreferences>) => Promise<void>;
  onImportAccounts: (rawAccounts: unknown[]) => Promise<number>;
  onSeedSampleData: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  preferences,
  accounts,
  onSavePreferences,
  onImportAccounts,
  onSeedSampleData,
}) => {
  const [realBirthdate, setRealBirthdate] = useState(preferences.realBirthdate || '');
  const [autoLockMinutes, setAutoLockMinutes] = useState(preferences.autoLockMinutes ?? 15);
  const [newPin, setNewPin] = useState('');
  const [savingBase, setSavingBase] = useState(false);
  const [savingPin, setSavingPin] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSaveBaseline = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBase(true);
    setStatusMessage(null);
    try {
      await onSavePreferences({ realBirthdate, autoLockMinutes });
      setStatusMessage('تم حفظ الإعدادات المرجعية بنجاح.');
    } finally {
      setSavingBase(false);
    }
  };

  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      setStatusMessage('يجب أن يتكون رمز القفل من 4 أرقام أو أحرف على الأقل.');
      return;
    }
    setSavingPin(true);
    setStatusMessage(null);
    try {
      const hashed = await hashPin(newPin.trim());
      await onSavePreferences({ vaultPinHash: hashed });
      setNewPin('');
      setStatusMessage('تم تفعيل رمز قفل الخزنة.');
    } finally {
      setSavingPin(false);
    }
  };

  const handleRemovePin = async () => {
    setSavingPin(true);
    setStatusMessage(null);
    try {
      await onSavePreferences({ vaultPinHash: '' });
      setStatusMessage('تم إلغاء قفل رمز PIN للخزنة.');
    } finally {
      setSavingPin(false);
    }
  };

  const handleExportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      realBirthdate: preferences.realBirthdate,
      accounts: accounts.map(({ createdAt: _c, updatedAt: _u, ...rest }) => rest),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `khaznati-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage('تم تصدير النسخة الاحتياطية بصيغة JSON.');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatusMessage(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.accounts) ? parsed.accounts : [];
      if (list.length === 0) {
        setStatusMessage('الملف لا يحتوي على حسابات صالحة للاستيراد.');
        return;
      }
      const importedCount = await onImportAccounts(list);
      setStatusMessage(`تم استيراد ${importedCount} سجل بنجاح إلى خزنتك.`);
    } catch {
      setStatusMessage('تعذّر قراءة ملف النسخة الاحتياطية. تأكد من صحة صيغة JSON.');
    } finally {
      e.target.value = '';
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    setStatusMessage(null);
    try {
      await onSeedSampleData();
      setStatusMessage('تمت إضافة بيانات تجريبية مترابطة لتجربة جميع المزايا.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-bold">إعدادات الخزنة والأمان</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          ضبط تاريخ الميلاد المرجعي، قفل الخزنة برمز PIN، والنسخ الاحتياطي للبيانات
        </p>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 text-xs font-medium text-indigo-800 dark:text-indigo-200">
          {statusMessage}
        </div>
      )}

      {/* 1. Real Birthdate Baseline & Auto-Lock */}
      <form
        onSubmit={(e) => void handleSaveBaseline(e)}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5"
      >
        <div className="flex items-center gap-2 text-sm font-bold">
          <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>تاريخ الميلاد الحقيقي والمرجع التلقائي</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="pref-birthdate" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              تاريخ ميلادك الحقيقي (للمقارنة مع الحسابات)
            </label>
            <input
              id="pref-birthdate"
              type="date"
              dir="ltr"
              value={realBirthdate}
              onChange={(e) => setRealBirthdate(e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono tabular-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="pref-autolock" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              القفل التلقائي للخزنة (بالدقائق، 0 للتعطيل)
            </label>
            <input
              id="pref-autolock"
              type="number"
              min={0}
              max={120}
              dir="ltr"
              value={autoLockMinutes}
              onChange={(e) => setAutoLockMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm font-mono tabular-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingBase}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60 transition-colors cursor-pointer"
          >
            {savingBase ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>
        </div>
      </form>

      {/* 2. Vault PIN Lock */}
      <form
        onSubmit={(e) => void handleSetPin(e)}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>قفل الخزنة برمز سري (PIN)</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {preferences.vaultPinHash ? 'مفعّل حالياً' : 'غير مفعّل'}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          يضيف طبقة حماية إضافية لقفل الشاشة أمام أي شخص يستخدم جهازك حتى بعد تسجيل دخولك.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="password"
            inputMode="numeric"
            dir="ltr"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            placeholder="أدخل رمزاً جديداً (4+ أرقام)"
            className="flex-1 min-w-[200px] px-3 py-2 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
          <button
            type="submit"
            disabled={savingPin}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {preferences.vaultPinHash ? 'تحديث الرمز' : 'تفعيل الرمز'}
          </button>
          {preferences.vaultPinHash && (
            <button
              type="button"
              disabled={savingPin}
              onClick={() => void handleRemovePin()}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              إلغاء القفل
            </button>
          )}
        </div>
      </form>

      {/* 3. Backup Export / Import & Sample Seed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>النسخ الاحتياطي ونقل البيانات</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تصدير نسخة احتياطية (JSON)</span>
          </button>

          <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>استيراد من ملف JSON</span>
            <input type="file" accept=".json,application/json" onChange={(e) => void handleImportFile(e)} className="hidden" />
          </label>

          <button
            type="button"
            disabled={seeding}
            onClick={() => void handleSeed()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer"
          >
            <Database className="w-4 h-4" />
            <span>{seeding ? 'جاري الإضافة...' : 'إضافة أمثلة تجريبية (إيميلات + تطبيقات)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
