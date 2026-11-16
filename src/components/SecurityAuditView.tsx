import React, { useMemo } from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { VaultAccount } from '../types/vault';
import { buildVaultAuditReport, formatReadableDate } from '../utils/vaultHelpers';
import { PlatformIcon } from './PlatformIcon';

interface SecurityAuditViewProps {
  accounts: VaultAccount[];
  realBirthdate: string;
  onEditAccount: (acc: VaultAccount) => void;
  onSelectAccount: (acc: VaultAccount) => void;
}

export const SecurityAuditView: React.FC<SecurityAuditViewProps> = ({
  accounts,
  realBirthdate,
  onEditAccount,
  onSelectAccount,
}) => {
  const report = useMemo(
    () => buildVaultAuditReport(accounts, realBirthdate),
    [accounts, realBirthdate]
  );

  const totalFindings =
    report.reusedPasswordGroups.length +
    report.weakPasswordAccounts.length +
    report.birthdateMismatches.length +
    report.noTwoFactorAccounts.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">مركز التدقيق الأمني وتضارب التواريخ</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تحليل تلقائي لكلمات المرور المكررة والضعيفة، وحالة التحقق بخطوتين، واختلافات تواريخ الميلاد بين الحسابات
          </p>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">تباين تواريخ الميلاد</span>
          <p className="text-2xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
            {report.birthdateMismatches.length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">كلمات مرور مكررة</span>
          <p className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
            {report.reusedPasswordGroups.length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">كلمات مرور ضعيفة</span>
          <p className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
            {report.weakPasswordAccounts.length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">بدون تحقق بخطوتين</span>
          <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
            {report.noTwoFactorAccounts.length}
          </p>
        </div>
      </div>

      {accounts.length > 0 && totalFindings === 0 && report.missingDatesAccounts.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 rounded-xl p-8 flex items-center gap-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <h3 className="text-sm font-bold">الخزنة في حالة ممتازة</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              جميع حساباتك تستخدم كلمات مرور فريدة وقوية وتواريخ ميلاد متطابقة مع تفعيل التحقق بخطوتين.
            </p>
          </div>
        </div>
      )}

      {/* 1. Birthdate Mismatch Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>سجل اختلافات تواريخ الميلاد بين الحسابات</span>
          </div>
          {realBirthdate && (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums" dir="ltr">
              ميلادك المرجعي: {formatReadableDate(realBirthdate)}
            </span>
          )}
        </div>

        {report.birthdateMismatches.length === 0 ? (
          <p className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
            لا توجد اختلافات مسجلة في تواريخ الميلاد حالياً.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {report.birthdateMismatches.map(({ account, reason }) => (
              <div
                key={account.id}
                className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-4"
              >
                <button
                  type="button"
                  onClick={() => onSelectAccount(account)}
                  className="flex items-center gap-3 text-right min-w-0 cursor-pointer"
                >
                  <PlatformIcon
                    platformKey={account.platformKey}
                    recordType={account.recordType}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{account.title}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">{reason}</p>
                  </div>
                </button>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-mono tabular-nums text-slate-700 dark:text-slate-300" dir="ltr">
                    {formatReadableDate(account.registeredBirthdate)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onEditAccount(account)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>مراجعة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2. Reused Passwords */}
      {report.reusedPasswordGroups.length > 0 && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-sm font-semibold">
            <KeyRound className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>كلمات مرور مكررة عبر أكثر من حساب</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {report.reusedPasswordGroups.map((group, idx) => (
              <div key={idx} className="p-5 space-y-3">
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  كلمة المرور ({group.passwordMasked}) مستخدمة في {group.accounts.length} حسابات:
                </p>
                <div className="flex flex-wrap gap-3">
                  {group.accounts.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => onEditAccount(acc)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-xs font-medium cursor-pointer"
                    >
                      <PlatformIcon
                        platformKey={acc.platformKey}
                        recordType={acc.recordType}
                        size="sm"
                      />
                      <span>{acc.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Weak Passwords & Missing 2FA & Missing Dates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>كلمات مرور ضعيفة ({report.weakPasswordAccounts.length})</span>
          </div>
          {report.weakPasswordAccounts.length === 0 ? (
            <p className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
              لا توجد كلمات مرور ضعيفة.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {report.weakPasswordAccounts.map((acc) => (
                <div key={acc.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{acc.title}</span>
                  <button
                    type="button"
                    onClick={() => onEditAccount(acc)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    تقوية الكلمة
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-sm font-semibold">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>حسابات بدون تحقق بخطوتين ({report.noTwoFactorAccounts.length})</span>
          </div>
          {report.noTwoFactorAccounts.length === 0 ? (
            <p className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
              جميع الحسابات النشطة محمية بالتحقق بخطوتين.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {report.noTwoFactorAccounts.map((acc) => (
                <div key={acc.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{acc.title}</span>
                  <button
                    type="button"
                    onClick={() => onEditAccount(acc)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    تحديث الحالة
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 4. Missing Dates Reminder */}
      {report.missingDatesAccounts.length > 0 && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-sm font-semibold">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>حسابات ينقصها تاريخ الميلاد أو تاريخ الإنشاء ({report.missingDatesAccounts.length})</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {report.missingDatesAccounts.map((acc) => (
              <div key={acc.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{acc.title}</p>
                  <p className="text-xs text-slate-500">
                    {!acc.registeredBirthdate && !acc.accountCreatedAt
                      ? 'ينقصه تاريخ الميلاد وتاريخ الإنشاء'
                      : !acc.registeredBirthdate
                        ? 'ينقصه تاريخ الميلاد المسجل'
                        : 'ينقصه تاريخ إنشاء الحساب'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onEditAccount(acc)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  إكمال التواريخ
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
