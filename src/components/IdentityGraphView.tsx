import React, { useMemo, useState } from 'react';
import { Calendar, Check, Copy, Eye, EyeOff, Link2, Mail, Plus, ShieldCheck } from 'lucide-react';
import { VaultAccount } from '../types/vault';
import {
  calculateAccountDuration,
  calculateAgeFromBirthdate,
  formatReadableDate,
} from '../utils/vaultHelpers';
import { PlatformIcon } from './PlatformIcon';

interface IdentityGraphViewProps {
  accounts: VaultAccount[];
  onSelectAccount: (acc: VaultAccount) => void;
  onAddLinkedApp: (parentEmail: VaultAccount) => void;
  onAddNewEmail: () => void;
}

export const IdentityGraphView: React.FC<IdentityGraphViewProps> = ({
  accounts,
  onSelectAccount,
  onAddLinkedApp,
  onAddNewEmail,
}) => {
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { emailTrees, standaloneApps } = useMemo(() => {
    const emails = accounts.filter((a) => a.recordType === 'email');
    const apps = accounts.filter((a) => a.recordType === 'app');
    const emailById = new Map(emails.map((e) => [e.id, e]));
    const emailByAddress = new Map(
      emails
        .filter((e) => e.emailAddress.trim())
        .map((e) => [e.emailAddress.trim().toLowerCase(), e])
    );

    const childrenByEmailId = new Map<string, VaultAccount[]>();
    emails.forEach((e) => childrenByEmailId.set(e.id, []));

    const unlinked: VaultAccount[] = [];

    for (const app of apps) {
      let matchedParent: VaultAccount | undefined;
      if (app.parentEmailId && emailById.has(app.parentEmailId)) {
        matchedParent = emailById.get(app.parentEmailId);
      } else if (app.emailAddress.trim()) {
        matchedParent = emailByAddress.get(app.emailAddress.trim().toLowerCase());
      }

      if (matchedParent) {
        childrenByEmailId.get(matchedParent.id)?.push(app);
      } else {
        unlinked.push(app);
      }
    }

    return {
      emailTrees: emails.map((email) => ({
        email,
        apps: childrenByEmailId.get(email.id) || [],
      })),
      standaloneApps: unlinked,
    };
  }, [accounts]);

  const copyText = (val: string, key: string) => {
    if (!val) return;
    void navigator.clipboard.writeText(val);
    setCopiedId(key);
    setTimeout(() => setCopiedId((c) => (c === key ? null : c)), 1500);
  };

  if (emailTrees.length === 0 && standaloneApps.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center space-y-4">
        <Mail className="w-10 h-10 text-slate-400 mx-auto" />
        <div className="space-y-1">
          <h3 className="text-base font-semibold">لا توجد هويات بريدية مسجلة بعد</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            ابدأ بإضافة بريدك الإلكتروني الأساسي، ثم اربط تحته تطبيقاتك مثل إنستقرام وفيسبوك لتظهر هنا في خريطة مترابطة.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddNewEmail}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة أول بريد إلكتروني</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">خريطة الإيميلات والتطبيقات المرتبطة</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            كل بريد إلكتروني في رأس المجموعة مع جميع التطبيقات والمواقع المسجلة به وتواريخها الخاصة
          </p>
        </div>
        <button
          type="button"
          onClick={onAddNewEmail}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة بريد رئيسي جديد</span>
        </button>
      </div>

      <div className="space-y-6">
        {emailTrees.map(({ email, apps }) => {
          const emailOpen = Boolean(revealedIds[email.id]);
          const emailAge = calculateAgeFromBirthdate(email.registeredBirthdate);
          const emailDuration = calculateAccountDuration(email.accountCreatedAt);

          return (
            <div
              key={email.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
            >
              {/* Parent Email Header */}
              <div className="p-5 bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <PlatformIcon platformKey={email.platformKey} recordType="email" size="lg" />
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectAccount(email)}
                        className="text-base font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                      >
                        {email.title}
                      </button>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs font-mono text-slate-700 dark:text-slate-300" dir="ltr">
                        {email.emailAddress}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyText(email.emailAddress, `em_${email.id}`)}
                        className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
                        aria-label="نسخ الإيميل"
                      >
                        {copiedId === `em_${email.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          تاريخ الميلاد: <strong className="font-mono text-slate-700 dark:text-slate-200">{formatReadableDate(email.registeredBirthdate)}</strong>
                          {emailAge !== null ? ` (${emailAge} سنة)` : ''}
                        </span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        تاريخ الإنشاء: <strong className="font-mono text-slate-700 dark:text-slate-200">{formatReadableDate(email.accountCreatedAt)}</strong>
                        {emailDuration ? ` (${emailDuration.label})` : ''}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{apps.length} تطبيقات مرتبطة</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {email.password && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                      <span className="text-xs font-mono" dir="ltr">
                        {emailOpen ? email.password : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setRevealedIds((p) => ({ ...p, [email.id]: !emailOpen }))
                        }
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                        aria-label="كشف كلمة مرور الإيميل"
                      >
                        {emailOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyText(email.password, `pwd_${email.id}`)}
                        className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
                        aria-label="نسخ كلمة مرور الإيميل"
                      >
                        {copiedId === `pwd_${email.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => onAddLinkedApp(email)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/70 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ربط تطبيق</span>
                  </button>
                </div>
              </div>

              {/* Connected Apps Table */}
              {apps.length === 0 ? (
                <div className="px-6 py-5 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>لا توجد تطبيقات مرتبطة بهذا البريد حالياً.</span>
                  <button
                    type="button"
                    onClick={() => onAddLinkedApp(email)}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    أضف أول تطبيق الآن
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                        <th className="py-2.5 px-5 font-medium">التطبيق / الموقع</th>
                        <th className="py-2.5 px-4 font-medium">اسم المستخدم</th>
                        <th className="py-2.5 px-4 font-medium">كلمة المرور</th>
                        <th className="py-2.5 px-4 font-medium">تاريخ الميلاد بالحساب</th>
                        <th className="py-2.5 px-4 font-medium">تاريخ الإنشاء</th>
                        <th className="py-2.5 px-5 font-medium text-left">الحماية</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                      {apps.map((app) => {
                        const open = Boolean(revealedIds[app.id]);
                        const birthDiffers =
                          email.registeredBirthdate &&
                          app.registeredBirthdate &&
                          email.registeredBirthdate !== app.registeredBirthdate;

                        return (
                          <tr
                            key={app.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            <td className="py-3 px-5">
                              <button
                                type="button"
                                onClick={() => onSelectAccount(app)}
                                className="flex items-center gap-2.5 text-right font-medium hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                              >
                                <PlatformIcon
                                  platformKey={app.platformKey}
                                  recordType="app"
                                  size="sm"
                                />
                                <span className="whitespace-nowrap">{app.title}</span>
                              </button>
                            </td>
                            <td className="py-3 px-4 font-mono text-xs text-slate-700 dark:text-slate-300" dir="ltr">
                              <div className="flex items-center justify-end gap-1.5">
                                <span className="truncate max-w-[160px]">
                                  {app.username || '—'}
                                </span>
                                {app.username && (
                                  <button
                                    type="button"
                                    onClick={() => copyText(app.username, `u_${app.id}`)}
                                    className="text-slate-400 hover:text-indigo-600 cursor-pointer"
                                    aria-label="نسخ اسم المستخدم"
                                  >
                                    {copiedId === `u_${app.id}` ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-xs" dir="ltr">
                              {app.password ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <span>{open ? app.password : '••••••••'}</span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRevealedIds((p) => ({ ...p, [app.id]: !open }))
                                    }
                                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                                    aria-label="إظهار كلمة المرور"
                                  >
                                    {open ? (
                                      <EyeOff className="w-3.5 h-3.5" />
                                    ) : (
                                      <Eye className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => copyText(app.password, `p_${app.id}`)}
                                    className="text-slate-400 hover:text-indigo-600 cursor-pointer"
                                    aria-label="نسخ كلمة المرور"
                                  >
                                    {copiedId === `p_${app.id}` ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-xs font-mono tabular-nums" dir="ltr">
                              <span
                                className={
                                  birthDiffers
                                    ? 'text-amber-600 dark:text-amber-400 font-semibold'
                                    : 'text-slate-700 dark:text-slate-300'
                                }
                              >
                                {formatReadableDate(app.registeredBirthdate)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-xs font-mono tabular-nums text-slate-700 dark:text-slate-300" dir="ltr">
                              {formatReadableDate(app.accountCreatedAt)}
                            </td>
                            <td className="py-3 px-5 text-left text-xs">
                              {app.twoFactorEnabled ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  <span>2FA</span>
                                </span>
                              ) : (
                                <span className="text-slate-400">بدون 2FA</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}

        {/* Standalone Unlinked Apps */}
        {standaloneApps.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-sm font-semibold">
              <Link2 className="w-4 h-4 text-slate-500" />
              <span>حسابات وتطبيقات غير مربوطة ببريد في الخزنة ({standaloneApps.length})</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {standaloneApps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => onSelectAccount(app)}
                  className="w-full px-5 py-3 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-right transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <PlatformIcon platformKey={app.platformKey} recordType="app" size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{app.title}</p>
                      <p className="text-xs font-mono text-slate-500 truncate" dir="ltr">
                        {app.emailAddress || app.username || 'بدون بريد'}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-mono tabular-nums shrink-0" dir="ltr">
                    {formatReadableDate(app.registeredBirthdate)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
