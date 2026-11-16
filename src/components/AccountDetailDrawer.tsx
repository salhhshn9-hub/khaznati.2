import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Check,
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  Link2,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { VaultAccount } from '../types/vault';
import {
  CATEGORY_LABELS,
  LOGIN_METHOD_LABELS,
  STATUS_LABELS,
  SUBSCRIPTION_LABELS,
  TWO_FACTOR_LABELS,
  calculateAccountDuration,
  calculateAgeFromBirthdate,
  evaluatePasswordStrength,
  formatReadableDate,
} from '../utils/vaultHelpers';
import { PlatformIcon } from './PlatformIcon';

interface AccountDetailDrawerProps {
  account: VaultAccount | null;
  allAccounts: VaultAccount[];
  realBirthdate: string;
  onClose: () => void;
  onSelectAccount: (acc: VaultAccount) => void;
  onEdit: (acc: VaultAccount) => void;
  onDelete: (acc: VaultAccount) => Promise<void>;
  onToggleFavorite: (acc: VaultAccount) => Promise<void>;
  onAddLinkedApp: (parentEmail: VaultAccount) => void;
}

export const AccountDetailDrawer: React.FC<AccountDetailDrawerProps> = ({
  account,
  allAccounts,
  realBirthdate,
  onClose,
  onSelectAccount,
  onEdit,
  onDelete,
  onToggleFavorite,
  onAddLinkedApp,
}) => {
  const [revealPassword, setRevealPassword] = useState(false);
  const [revealBackup, setRevealBackup] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [revealedChildPwds, setRevealedChildPwds] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const linkedApps = useMemo(() => {
    if (!account || account.recordType !== 'email') return [];
    const normalizedEmail = account.emailAddress.trim().toLowerCase();
    return allAccounts.filter(
      (a) =>
        a.id !== account.id &&
        (a.parentEmailId === account.id ||
          (normalizedEmail &&
            a.recordType === 'app' &&
            a.emailAddress.trim().toLowerCase() === normalizedEmail))
    );
  }, [account, allAccounts]);

  const parentEmail = useMemo(() => {
    if (!account || account.recordType !== 'app') return null;
    if (account.parentEmailId) {
      return allAccounts.find((a) => a.id === account.parentEmailId) || null;
    }
    const normalized = account.emailAddress.trim().toLowerCase();
    if (!normalized) return null;
    return (
      allAccounts.find(
        (a) => a.recordType === 'email' && a.emailAddress.trim().toLowerCase() === normalized
      ) || null
    );
  }, [account, allAccounts]);

  if (!account) return null;

  const copyText = (value: string, key: string) => {
    if (!value) return;
    void navigator.clipboard.writeText(value);
    setCopiedField(key);
    setTimeout(() => {
      setCopiedField((curr) => (curr === key ? null : curr));
    }, 1600);
  };

  const registeredAge = calculateAgeFromBirthdate(account.registeredBirthdate);
  const createdDuration = calculateAccountDuration(account.accountCreatedAt);
  const pwdEval = evaluatePasswordStrength(account.password);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(account);
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  const renderCopyRow = (
    label: string,
    value: string,
    fieldKey: string,
    options?: { mono?: boolean; ltr?: boolean; secret?: boolean; revealed?: boolean; onToggleReveal?: () => void }
  ) => {
    if (!value) return null;
    const displayValue =
      options?.secret && !options?.revealed ? '••••••••••••' : value;

    return (
      <div className="py-2.5 flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 last:border-none">
        <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">{label}</span>
        <div className="flex items-center gap-2 min-w-0">
          <span
            dir={options?.ltr ? 'ltr' : undefined}
            className={`text-sm truncate ${
              options?.mono ? 'font-mono' : ''
            } text-slate-900 dark:text-slate-100`}
          >
            {displayValue}
          </span>
          {options?.secret && options.onToggleReveal && (
            <button
              type="button"
              onClick={options.onToggleReveal}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label={options.revealed ? 'إخفاء' : 'إظهار'}
            >
              {options.revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            type="button"
            onClick={() => copyText(value, fieldKey)}
            className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label={`نسخ ${label}`}
          >
            {copiedField === fieldKey ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/40 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <PlatformIcon platformKey={account.platformKey} recordType={account.recordType} size="md" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold truncate">{account.title}</h2>
                <button
                  type="button"
                  onClick={() => void onToggleFavorite(account)}
                  className="text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                  aria-label="تفضيل الحساب"
                >
                  <Star
                    className={`w-4 h-4 ${
                      account.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{account.recordType === 'email' ? 'بريد إلكتروني رئيسي' : 'حساب تطبيق / موقع'}</span>
                <span aria-hidden="true">·</span>
                <span>{CATEGORY_LABELS[account.category]}</span>
                <span aria-hidden="true">·</span>
                <span>{STATUS_LABELS[account.status]}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onEdit(account)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تعديل</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="إغلاق التفاصيل"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* 1. Vital Dates Dossier (User's Core Priority) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>التواريخ الحيوية للحساب</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/70 dark:bg-slate-800/30">
              <div className="space-y-1">
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  تاريخ الميلاد المسجّل
                </span>
                <p className="text-sm font-mono font-semibold tabular-nums" dir="ltr">
                  {formatReadableDate(account.registeredBirthdate)}
                </p>
                {registeredAge !== null && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                    العمر المسجل: {registeredAge} سنة
                  </p>
                )}
                {realBirthdate &&
                  account.registeredBirthdate &&
                  account.registeredBirthdate !== realBirthdate && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      مختلف عن ميلادك الحقيقي
                    </p>
                  )}
              </div>

              <div className="space-y-1">
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  تاريخ إنشاء الحساب
                </span>
                <p className="text-sm font-mono font-semibold tabular-nums" dir="ltr">
                  {formatReadableDate(account.accountCreatedAt)}
                </p>
                {createdDuration && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                    {createdDuration.label}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  آخر تحديث لكلمة المرور
                </span>
                <p className="text-sm font-mono font-semibold tabular-nums" dir="ltr">
                  {formatReadableDate(account.lastPasswordChangedAt)}
                </p>
                {account.password && (
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    القوة: {pwdEval.label}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 2. Credentials Matrix */}
          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              بيانات الدخول والهوية
            </h3>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl px-4 divide-y divide-slate-100 dark:divide-slate-800">
              {renderCopyRow('البريد الإلكتروني', account.emailAddress, 'email', {
                mono: true,
                ltr: true,
              })}
              {renderCopyRow('اسم المستخدم', account.username, 'username', {
                mono: true,
                ltr: true,
              })}
              {renderCopyRow('كلمة المرور', account.password, 'password', {
                mono: true,
                ltr: true,
                secret: true,
                revealed: revealPassword,
                onToggleReveal: () => setRevealPassword((v) => !v),
              })}
              {renderCopyRow('الاسم الظاهر', account.displayName, 'displayName')}
              {renderCopyRow('رقم الجوال', account.phoneNumber, 'phone', {
                mono: true,
                ltr: true,
              })}
              {renderCopyRow('رمز PIN السريع', account.pinCode, 'pinCode', {
                mono: true,
                ltr: true,
              })}
              <div className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500 dark:text-slate-400">طريقة الدخول</span>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {LOGIN_METHOD_LABELS[account.loginMethod]}
                </span>
              </div>
              {account.websiteUrl && (
                <div className="py-2.5 flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500 dark:text-slate-400">الرابط</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-600 dark:text-indigo-400 truncate" dir="ltr">
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{account.websiteUrl}</span>
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* 3. Parent Email Link (if app) OR Connected Apps List (if email) */}
          {account.recordType === 'app' && parentEmail && (
            <section className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                البريد الإلكتروني المرتبط بهذا الحساب
              </h3>
              <button
                type="button"
                onClick={() => onSelectAccount(parentEmail)}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 flex items-center justify-between gap-4 text-right transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <PlatformIcon platformKey={parentEmail.platformKey} recordType="email" size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{parentEmail.title}</p>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate" dir="ltr">
                      {parentEmail.emailAddress}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                  ميلاد البريد: {formatReadableDate(parentEmail.registeredBirthdate)}
                </div>
              </button>
            </section>
          )}

          {account.recordType === 'email' && (
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>التطبيقات والمواقع المسجّلة بهذا البريد ({linkedApps.length})</span>
                </div>
                <button
                  type="button"
                  onClick={() => onAddLinkedApp(account)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ربط تطبيق جديد</span>
                </button>
              </div>

              {linkedApps.length === 0 ? (
                <div className="p-5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    لا توجد تطبيقات أو مواقع مربوطة بهذا الإيميل حتى الآن.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-200 dark:divide-slate-800">
                  {linkedApps.map((child) => {
                    const pwdOpen = Boolean(revealedChildPwds[child.id]);
                    const birthMismatch =
                      account.registeredBirthdate &&
                      child.registeredBirthdate &&
                      account.registeredBirthdate !== child.registeredBirthdate;

                    return (
                      <div key={child.id} className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => onSelectAccount(child)}
                            className="flex items-center gap-3 min-w-0 text-right hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                          >
                            <PlatformIcon
                              platformKey={child.platformKey}
                              recordType={child.recordType}
                              size="sm"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate">{child.title}</p>
                              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate" dir="ltr">
                                {child.username || child.emailAddress}
                              </p>
                            </div>
                          </button>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {child.password && (
                              <>
                                <span className="text-xs font-mono text-slate-700 dark:text-slate-300" dir="ltr">
                                  {pwdOpen ? child.password : '••••••••'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setRevealedChildPwds((prev) => ({
                                      ...prev,
                                      [child.id]: !pwdOpen,
                                    }))
                                  }
                                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                                  aria-label="إظهار أو إخفاء كلمة المرور"
                                >
                                  {pwdOpen ? (
                                    <EyeOff className="w-3.5 h-3.5" />
                                  ) : (
                                    <Eye className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => copyText(child.password, `child_${child.id}`)}
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 cursor-pointer"
                                  aria-label="نسخ كلمة المرور"
                                >
                                  {copiedField === `child_${child.id}` ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                          <span>
                            الميلاد: <strong className="font-mono text-slate-700 dark:text-slate-300">{formatReadableDate(child.registeredBirthdate)}</strong>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            الإنشاء: <strong className="font-mono text-slate-700 dark:text-slate-300">{formatReadableDate(child.accountCreatedAt)}</strong>
                          </span>
                          {birthMismatch && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-amber-600 dark:text-amber-400">
                                تاريخ الميلاد مختلف عن البريد الرئيسي
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* 4. Security, Recovery & Backup Codes */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              الأمان والاسترداد
            </h3>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400">التحقق بخطوتين (2FA)</span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                    account.twoFactorEnabled
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {account.twoFactorEnabled ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : (
                    <ShieldAlert className="w-4 h-4" />
                  )}
                  <span>{TWO_FACTOR_LABELS[account.twoFactorMethod]}</span>
                </span>
              </div>

              {renderCopyRow('بريد الاسترداد', account.recoveryEmail, 'recEmail', {
                mono: true,
                ltr: true,
              })}
              {renderCopyRow('جوال الاسترداد', account.recoveryPhone, 'recPhone', {
                mono: true,
                ltr: true,
              })}

              {account.backupCodes && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      رموز الاسترداد الاحتياطية
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRevealBackup((v) => !v)}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        {revealBackup ? 'إخفاء' : 'إظهار'}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyText(account.backupCodes, 'backupCodes')}
                        className="text-xs text-slate-500 hover:text-indigo-600 cursor-pointer"
                      >
                        {copiedField === 'backupCodes' ? 'تم النسخ' : 'نسخ'}
                      </button>
                    </div>
                  </div>
                  <pre
                    dir="ltr"
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/70 text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap"
                  >
                    {revealBackup ? account.backupCodes : '••••-••••\n••••-••••'}
                  </pre>
                </div>
              )}

              {account.securityQuestions && account.securityQuestions.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    أسئلة الأمان ({account.securityQuestions.length})
                  </span>
                  <div className="space-y-2">
                    {account.securityQuestions.map((sq, idx) => {
                      const open = Boolean(revealedAnswers[idx]);
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0 space-y-0.5">
                            <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                              {sq.question}
                            </p>
                            <p className="text-xs font-mono text-slate-600 dark:text-slate-400">
                              {open ? sq.answer : '••••••••'}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setRevealedAnswers((prev) => ({ ...prev, [idx]: !open }))
                              }
                              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                              aria-label="إظهار الإجابة"
                            >
                              {open ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => copyText(sq.answer, `sq_${idx}`)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 cursor-pointer"
                              aria-label="نسخ الإجابة"
                            >
                              {copiedField === `sq_${idx}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 5. Subscription, Device & Notes */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              معلومات التشغيل والاشتراك والملاحظات
            </h3>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">الاشتراك</span>
                <span className="font-medium">
                  {SUBSCRIPTION_LABELS[account.subscriptionStatus]}
                  {account.subscriptionCost ? ` · ${account.subscriptionCost}` : ''}
                </span>
              </div>
              {account.renewalDate && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">تاريخ التجديد</span>
                  <span className="font-mono tabular-nums" dir="ltr">
                    {formatReadableDate(account.renewalDate)}
                  </span>
                </div>
              )}
              {account.primaryDevice && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">الجهاز الأساسي</span>
                  <span className="font-medium">{account.primaryDevice}</span>
                </div>
              )}
              {account.notes && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="block text-slate-500 dark:text-slate-400 mb-1">الملاحظات</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {account.notes}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Bottom Danger / Delete Zone */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between gap-4">
          {!confirmDelete ? (
            <>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف هذا السجل</span>
              </button>
              <button
                type="button"
                onClick={() => onEdit(account)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                تعديل البيانات
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {account.recordType === 'email' && linkedApps.length > 0
                  ? `سيتم فك ارتباط ${linkedApps.length} تطبيق مرتبط وحذف الإيميل نهائياً.`
                  : 'تأكيد الحذف النهائي؟'}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  تراجع
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => void handleConfirmDelete()}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-60 cursor-pointer"
                >
                  {deleting ? 'جاري الحذف...' : 'نعم، احذف'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
