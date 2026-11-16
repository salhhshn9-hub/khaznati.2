import React, { useState } from 'react';
import { Lock, LogOut, ShieldAlert } from 'lucide-react';
import { hashPin } from '../utils/vaultHelpers';

interface VaultLockScreenProps {
  expectedPinHash: string;
  userEmail: string;
  onUnlock: () => void;
  onSignOut: () => Promise<void>;
}

export const VaultLockScreen: React.FC<VaultLockScreenProps> = ({
  expectedPinHash,
  userEmail,
  onUnlock,
  onSignOut,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('أدخل رمز القفل للمتابعة.');
      return;
    }
    setChecking(true);
    setError('');
    try {
      const hashed = await hashPin(pin.trim());
      if (hashed === expectedPinHash) {
        setPin('');
        onUnlock();
      } else {
        setError('رمز القفل غير صحيح. حاول مرة أخرى.');
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 space-y-6">
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">الخزنة مقفلة</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono" dir="ltr">
            {userEmail}
          </p>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="vault-pin-input" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              رمز قفل الخزنة (PIN)
            </label>
            <input
              id="vault-pin-input"
              type="password"
              inputMode="numeric"
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              dir="ltr"
              className="w-full px-4 py-3 text-center text-lg tracking-widest font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={checking}
            className="w-full py-2.5 px-4 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-60 cursor-pointer"
          >
            {checking ? 'جاري التحقق...' : 'فتح الخزنة'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-center">
          <button
            type="button"
            onClick={() => void onSignOut()}
            className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج من الحساب</span>
          </button>
        </div>
      </div>
    </div>
  );
};
