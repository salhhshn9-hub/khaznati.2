import React, { useMemo, useState } from 'react';
import { Calendar, Search } from 'lucide-react';
import { VaultAccount } from '../types/vault';
import {
  calculateAccountDuration,
  calculateAgeFromBirthdate,
  formatReadableDate,
} from '../utils/vaultHelpers';
import { PlatformIcon } from './PlatformIcon';

interface DatesTimelineViewProps {
  accounts: VaultAccount[];
  realBirthdate: string;
  onSelectAccount: (acc: VaultAccount) => void;
}

export const DatesTimelineView: React.FC<DatesTimelineViewProps> = ({
  accounts,
  realBirthdate,
  onSelectAccount,
}) => {
  const [filterText, setFilterText] = useState('');
  const [onlyMismatches, setOnlyMismatches] = useState(false);

  const emailById = useMemo(
    () => new Map(accounts.filter((a) => a.recordType === 'email').map((e) => [e.id, e])),
    [accounts]
  );

  const filtered = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    return accounts.filter((acc) => {
      if (q) {
        const hay = `${acc.title} ${acc.emailAddress} ${acc.username} ${acc.registeredBirthdate} ${acc.accountCreatedAt}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (onlyMismatches) {
        const parent = acc.parentEmailId ? emailById.get(acc.parentEmailId) : undefined;
        const differsParent =
          parent?.registeredBirthdate &&
          acc.registeredBirthdate &&
          parent.registeredBirthdate !== acc.registeredBirthdate;
        const differsReal =
          realBirthdate && acc.registeredBirthdate && realBirthdate !== acc.registeredBirthdate;
        return Boolean(differsParent || differsReal);
      }
      return true;
    });
  }, [accounts, filterText, onlyMismatches, emailById, realBirthdate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">جدول تواريخ الميلاد والإنشاء لجميع الحسابات</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            مرجع شامل يوضح تاريخ الميلاد المسجّل وعمر الحساب وتاريخ إنشائه في كل إيميل وتطبيق وموقع
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="ابحث بالسنة أو الإيميل أو التطبيق..."
              className="pr-9 pl-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setOnlyMismatches((v) => !v)}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              onlyMismatches
                ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
            }`}
          >
            التواريخ المختلفة فقط
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-medium">لا توجد حسابات مطابقة للتصفية</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/30">
                  <th className="py-3 px-5 font-medium">الحساب / المنصة</th>
                  <th className="py-3 px-4 font-medium">البريد المرتبط</th>
                  <th className="py-3 px-4 font-medium">تاريخ الميلاد المسجّل</th>
                  <th className="py-3 px-4 font-medium">العمر المسجّل</th>
                  <th className="py-3 px-4 font-medium">تاريخ إنشاء الحساب</th>
                  <th className="py-3 px-5 font-medium">عمر الحساب</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filtered.map((acc) => {
                  const regAge = calculateAgeFromBirthdate(acc.registeredBirthdate);
                  const createdDur = calculateAccountDuration(acc.accountCreatedAt);
                  const parent = acc.parentEmailId ? emailById.get(acc.parentEmailId) : undefined;
                  const mismatch =
                    (parent?.registeredBirthdate &&
                      acc.registeredBirthdate &&
                      parent.registeredBirthdate !== acc.registeredBirthdate) ||
                    (realBirthdate &&
                      acc.registeredBirthdate &&
                      realBirthdate !== acc.registeredBirthdate);

                  return (
                    <tr
                      key={acc.id}
                      onClick={() => onSelectAccount(acc)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <PlatformIcon
                            platformKey={acc.platformKey}
                            recordType={acc.recordType}
                            size="sm"
                          />
                          <div>
                            <p className="font-semibold text-sm">{acc.title}</p>
                            <p className="text-xs text-slate-500">
                              {acc.recordType === 'email' ? 'بريد إلكتروني' : 'تطبيق / موقع'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600 dark:text-slate-400" dir="ltr">
                        {acc.emailAddress || '—'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs tabular-nums" dir="ltr">
                        <span
                          className={
                            mismatch
                              ? 'text-amber-600 dark:text-amber-400 font-semibold'
                              : 'text-slate-800 dark:text-slate-200'
                          }
                        >
                          {formatReadableDate(acc.registeredBirthdate)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs tabular-nums text-slate-600 dark:text-slate-400">
                        {regAge !== null ? `${regAge} سنة` : '—'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs tabular-nums text-slate-800 dark:text-slate-200" dir="ltr">
                        {formatReadableDate(acc.accountCreatedAt)}
                      </td>
                      <td className="py-3.5 px-5 text-xs tabular-nums text-slate-600 dark:text-slate-400">
                        {createdDur ? createdDur.label : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
