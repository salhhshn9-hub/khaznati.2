import React, { useMemo, useState } from 'react';
import { Check, Copy, RefreshCw } from 'lucide-react';
import {
  PasswordGeneratorOptions,
  evaluatePasswordStrength,
  generateSecurePassword,
} from '../utils/vaultHelpers';

export const PasswordGeneratorView: React.FC = () => {
  const [options, setOptions] = useState<PasswordGeneratorOptions>({
    length: 18,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const [password, setPassword] = useState<string>(() =>
    generateSecurePassword({
      length: 18,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    })
  );
  const [copied, setCopied] = useState(false);

  const evaluation = useMemo(() => evaluatePasswordStrength(password), [password]);

  const regenerate = (nextOpts: PasswordGeneratorOptions = options) => {
    setOptions(nextOpts);
    setPassword(generateSecurePassword(nextOpts));
    setCopied(false);
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-bold">مولّد كلمات المرور الآمن</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          توليد كلمات مرور عشوائية عالية التعقيد محلياً داخل المتصفح دون إرسالها لأي خادم خارجي
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
        {/* Output Display */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-4">
          <span
            dir="ltr"
            className="text-lg sm:text-xl font-mono font-semibold tracking-wide break-all select-all text-slate-900 dark:text-slate-100"
          >
            {password}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => regenerate()}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="توليد كلمة مرور جديدة"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
            </button>
          </div>
        </div>

        {/* Strength Meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">مقياس القوة</span>
            <span className="font-medium tabular-nums">
              {evaluation.label} · {evaluation.entropyBits} بت عشوائية
            </span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                evaluation.tier === 'weak'
                  ? 'bg-rose-500'
                  : evaluation.tier === 'fair'
                    ? 'bg-amber-500'
                    : evaluation.tier === 'strong'
                      ? 'bg-emerald-500'
                      : 'bg-indigo-600'
              }`}
              style={{ width: `${evaluation.score}%` }}
            />
          </div>
        </div>

        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="pwd-len-slider" className="font-medium text-slate-700 dark:text-slate-300">
              طول كلمة المرور
            </label>
            <span className="font-mono font-bold tabular-nums">{options.length} حرف</span>
          </div>
          <input
            id="pwd-len-slider"
            type="range"
            min={8}
            max={40}
            value={options.length}
            onChange={(e) => regenerate({ ...options, length: Number(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Character Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(
            [
              { key: 'uppercase', label: 'أحرف كبيرة (A–Z)' },
              { key: 'lowercase', label: 'أحرف صغيرة (a–z)' },
              { key: 'numbers', label: 'أرقام (0–9)' },
              { key: 'symbols', label: 'رموز خاصة (!@#$%)' },
            ] as const
          ).map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40"
            >
              <span className="text-xs font-medium">{item.label}</span>
              <input
                type="checkbox"
                checked={options[item.key]}
                onChange={(e) => {
                  const next = { ...options, [item.key]: e.target.checked };
                  if (!next.uppercase && !next.lowercase && !next.numbers && !next.symbols) return;
                  regenerate(next);
                }}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
