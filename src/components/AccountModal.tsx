import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Eye,
  EyeOff,
  KeyRound,
  Link2,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  X,
} from 'lucide-react';
import {
  AccountCategory,
  AccountStatus,
  LoginMethod,
  RecordType,
  SubscriptionStatus,
  TwoFactorMethod,
  VAULT_LIMITS,
  VaultAccount,
  VaultAccountDraft,
} from '../types/vault';
import {
  CATEGORY_LABELS,
  LOGIN_METHOD_LABELS,
  PLATFORM_PRESETS,
  STATUS_LABELS,
  SUBSCRIPTION_LABELS,
  TWO_FACTOR_LABELS,
  calculateAccountDuration,
  calculateAgeFromBirthdate,
  createEmptyAccountDraft,
  evaluatePasswordStrength,
  generateSecurePassword,
  getPresetByKey,
} from '../utils/vaultHelpers';
import { PlatformIcon } from './PlatformIcon';

interface AccountModalProps {
  isOpen: boolean;
  editingAccount: VaultAccount | null;
  initialDraftOverrides?: Partial<VaultAccountDraft>;
  emailIdentities: VaultAccount[];
  realBirthdate: string;
  onClose: () => void;
  onSave: (draft: VaultAccountDraft, existingId?: string) => Promise<void>;
}

type ModalTab = 'identity' | 'dates' | 'security' | 'extra';

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  editingAccount,
  initialDraftOverrides,
  emailIdentities,
  realBirthdate,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('identity');
  const [draft, setDraft] = useState<VaultAccountDraft>(() => createEmptyAccountDraft());
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab('identity');
    setErrorMsg('');
    setShowPassword(false);

    if (editingAccount) {
      setDraft({
        recordType: editingAccount.recordType,
        title: editingAccount.title,
        platformKey: editingAccount.platformKey,
        category: editingAccount.category,
        emailAddress: editingAccount.emailAddress,
        parentEmailId: editingAccount.parentEmailId,
        username: editingAccount.username,
        displayName: editingAccount.displayName,
        password: editingAccount.password,
        loginMethod: editingAccount.loginMethod,
        websiteUrl: editingAccount.websiteUrl,
        phoneNumber: editingAccount.phoneNumber,
        recoveryEmail: editingAccount.recoveryEmail,
        recoveryPhone: editingAccount.recoveryPhone,
        registeredBirthdate: editingAccount.registeredBirthdate,
        accountCreatedAt: editingAccount.accountCreatedAt,
        lastPasswordChangedAt: editingAccount.lastPasswordChangedAt,
        twoFactorEnabled: editingAccount.twoFactorEnabled,
        twoFactorMethod: editingAccount.twoFactorMethod,
        backupCodes: editingAccount.backupCodes,
        securityQuestions: editingAccount.securityQuestions || [],
        pinCode: editingAccount.pinCode,
        subscriptionStatus: editingAccount.subscriptionStatus,
        subscriptionCost: editingAccount.subscriptionCost,
        renewalDate: editingAccount.renewalDate,
        primaryDevice: editingAccount.primaryDevice,
        status: editingAccount.status,
        isFavorite: editingAccount.isFavorite,
        notes: editingAccount.notes,
      });
    } else {
      const base = createEmptyAccountDraft(initialDraftOverrides);
      if (base.parentEmailId && !base.emailAddress) {
        const parent = emailIdentities.find((e) => e.id === base.parentEmailId);
        if (parent) {
          base.emailAddress = parent.emailAddress;
        }
      }
      setDraft(base);
    }
  }, [isOpen, editingAccount, initialDraftOverrides, emailIdentities]);

  const parentEmailRecord = useMemo(
    () => emailIdentities.find((e) => e.id === draft.parentEmailId),
    [emailIdentities, draft.parentEmailId]
  );

  const pwdEval = useMemo(() => evaluatePasswordStrength(draft.password), [draft.password]);
  const registeredAge = useMemo(
    () => calculateAgeFromBirthdate(draft.registeredBirthdate),
    [draft.registeredBirthdate]
  );
  const createdDuration = useMemo(
    () => calculateAccountDuration(draft.accountCreatedAt),
    [draft.accountCreatedAt]
  );

  if (!isOpen) return null;

  const handleSelectPreset = (key: string) => {
    const preset = getPresetByKey(key);
    setDraft((prev) => ({
      ...prev,
      platformKey: preset.key,
      recordType: editingAccount ? prev.recordType : preset.recordType,
      category: preset.category,
      title: prev.title || (preset.key === 'custom' ? '' : preset.label),
      websiteUrl: prev.websiteUrl || preset.defaultUrl,
      parentEmailId: preset.recordType === 'email' && !editingAccount ? '' : prev.parentEmailId,
    }));
  };

  const handleSelectParentEmail = (parentId: string) => {
    const parent = emailIdentities.find((e) => e.id === parentId);
    setDraft((prev) => ({
      ...prev,
      parentEmailId: parentId,
      emailAddress: parent ? parent.emailAddress : prev.emailAddress,
    }));
  };

  const handleGeneratePassword = () => {
    const generated = generateSecurePassword({
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    });
    setDraft((prev) => ({
      ...prev,
      password: generated,
      lastPasswordChangedAt: new Date().toISOString().slice(0, 10),
    }));
    setShowPassword(true);
  };

  const handleAddSecurityQuestion = () => {
    if (draft.securityQuestions.length >= VAULT_LIMITS.securityQuestionsMax) return;
    setDraft((prev) => ({
      ...prev,
      securityQuestions: [...prev.securityQuestions, { question: '', answer: '' }],
    }));
  };

  const handleRemoveSecurityQuestion = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      securityQuestions: prev.securityQuestions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim()) {
      setErrorMsg('يرجى إدخال اسم الحساب أو المنصة.');
      setActiveTab('identity');
      return;
    }
    if (draft.recordType === 'email' && !draft.emailAddress.trim()) {
      setErrorMsg('يرجى إدخال عنوان البريد الإلكتروني.');
      setActiveTab('identity');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    try {
      await onSave(draft, editingAccount?.id);
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'تعذر حفظ الحساب.');
    } finally {
      setSaving(false);
    }
  };

  const availableEmails = emailIdentities.filter((e) => e.id !== editingAccount?.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
    >
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <PlatformIcon platformKey={draft.platformKey} recordType={draft.recordType} size="sm" />
            <div className="min-w-0">
              <h2 id="account-modal-title" className="text-base font-bold truncate">
                {editingAccount ? `تعديل: ${editingAccount.title}` : 'إضافة سجل جديد للخزنة'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {draft.recordType === 'email'
                  ? 'هوية بريد إلكتروني رئيسية يمكن ربط التطبيقات بها'
                  : 'حساب تطبيق أو موقع إلكتروني'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto">
          {(
            [
              { id: 'identity', label: 'الهوية وبيانات الدخول' },
              { id: 'dates', label: 'تاريخ الميلاد والإنشاء' },
              { id: 'security', label: 'الأمان والاسترداد' },
              { id: 'extra', label: 'الاشتراك والملاحظات' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/50 text-xs text-rose-700 dark:text-rose-300">
                {errorMsg}
              </div>
            )}

            {activeTab === 'identity' && (
              <div className="space-y-5">
                {/* Record Type Segmented Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      نوع السجل
                    </span>
                    <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      {(
                        [
                          { value: 'email', label: 'بريد إلكتروني رئيسي' },
                          { value: 'app', label: 'تطبيق / موقع' },
                        ] as { value: RecordType; label: string }[]
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setDraft((prev) => ({
                              ...prev,
                              recordType: opt.value,
                              category: opt.value === 'email' ? 'email' : prev.category === 'email' ? 'social' : prev.category,
                              parentEmailId: opt.value === 'email' ? '' : prev.parentEmailId,
                            }))
                          }
                          className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            draft.recordType === opt.value
                              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="platform-preset" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      اختيار منصة جاهزة
                    </label>
                    <select
                      id="platform-preset"
                      value={draft.platformKey}
                      onChange={(e) => handleSelectPreset(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {PLATFORM_PRESETS.map((preset) => (
                        <option key={preset.key} value={preset.key}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="acc-title" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      اسم الحساب / التطبيق *
                    </label>
                    <input
                      id="acc-title"
                      type="text"
                      required
                      maxLength={VAULT_LIMITS.titleMax}
                      value={draft.title}
                      onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                      placeholder={
                        draft.recordType === 'email'
                          ? 'مثال: البريد الشخصي الأساسي'
                          : 'مثال: Instagram، Facebook، البنك الأهلي'
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="acc-category" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      التصنيف
                    </label>
                    <select
                      id="acc-category"
                      value={draft.category}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, category: e.target.value as AccountCategory }))
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {(Object.keys(CATEGORY_LABELS) as AccountCategory[]).map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_LABELS[cat]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Parent Email Link (if app) */}
                {draft.recordType === 'app' && (
                  <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>ربط الحساب ببريد إلكتروني مسجل في الخزنة</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label htmlFor="parent-email-select" className="block text-xs text-slate-600 dark:text-slate-400">
                          البريد المرتبط (من خزنتك)
                        </label>
                        <select
                          id="parent-email-select"
                          value={draft.parentEmailId}
                          onChange={(e) => handleSelectParentEmail(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">— غير مربوط ببريد من الخزنة —</option>
                          {availableEmails.map((em) => (
                            <option key={em.id} value={em.id}>
                              {em.title} ({em.emailAddress})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="acc-login-method" className="block text-xs text-slate-600 dark:text-slate-400">
                          طريقة تسجيل الدخول
                        </label>
                        <select
                          id="acc-login-method"
                          value={draft.loginMethod}
                          onChange={(e) =>
                            setDraft((p) => ({ ...p, loginMethod: e.target.value as LoginMethod }))
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {(Object.keys(LOGIN_METHOD_LABELS) as LoginMethod[]).map((lm) => (
                            <option key={lm} value={lm}>
                              {LOGIN_METHOD_LABELS[lm]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email & Username */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="acc-email" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      {draft.recordType === 'email' ? 'عنوان البريد الإلكتروني *' : 'البريد الإلكتروني للحساب'}
                    </label>
                    <input
                      id="acc-email"
                      type="email"
                      dir="ltr"
                      maxLength={VAULT_LIMITS.emailMax}
                      value={draft.emailAddress}
                      onChange={(e) => setDraft((p) => ({ ...p, emailAddress: e.target.value }))}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="acc-username" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      اسم المستخدم (Username)
                    </label>
                    <input
                      id="acc-username"
                      type="text"
                      dir="ltr"
                      maxLength={VAULT_LIMITS.usernameMax}
                      value={draft.username}
                      onChange={(e) => setDraft((p) => ({ ...p, username: e.target.value }))}
                      placeholder="@username"
                      className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Password + Strength + Generator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="acc-password" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      كلمة المرور
                    </label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>توليد كلمة مرور قوية</span>
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="acc-password"
                      type={showPassword ? 'text' : 'password'}
                      dir="ltr"
                      maxLength={VAULT_LIMITS.passwordMax}
                      value={draft.password}
                      onChange={(e) => setDraft((p) => ({ ...p, password: e.target.value }))}
                      placeholder="••••••••••••"
                      className="w-full pl-11 pr-3 py-2.5 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                      aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {draft.password && (
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            pwdEval.tier === 'weak'
                              ? 'bg-rose-500'
                              : pwdEval.tier === 'fair'
                                ? 'bg-amber-500'
                                : pwdEval.tier === 'strong'
                                  ? 'bg-emerald-500'
                                  : 'bg-indigo-600'
                          }`}
                          style={{ width: `${pwdEval.score}%` }}
                        />
                      </div>
                      <span className="text-slate-600 dark:text-slate-400 tabular-nums whitespace-nowrap">
                        القوة: {pwdEval.label} · {pwdEval.entropyBits} بت
                      </span>
                    </div>
                  )}
                </div>

                {/* Display Name, Phone, URL */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="acc-display-name" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      الاسم الظاهر في الحساب
                    </label>
                    <input
                      id="acc-display-name"
                      type="text"
                      maxLength={VAULT_LIMITS.displayNameMax}
                      value={draft.displayName}
                      onChange={(e) => setDraft((p) => ({ ...p, displayName: e.target.value }))}
                      placeholder="الاسم المعروض"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="acc-phone" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      رقم الجوال المسجل
                    </label>
                    <input
                      id="acc-phone"
                      type="tel"
                      dir="ltr"
                      maxLength={VAULT_LIMITS.phoneMax}
                      value={draft.phoneNumber}
                      onChange={(e) => setDraft((p) => ({ ...p, phoneNumber: e.target.value }))}
                      placeholder="+966 5X XXX XXXX"
                      className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="acc-url" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      رابط الموقع / الدخول
                    </label>
                    <input
                      id="acc-url"
                      type="text"
                      dir="ltr"
                      maxLength={VAULT_LIMITS.websiteUrlMax}
                      value={draft.websiteUrl}
                      onChange={(e) => setDraft((p) => ({ ...p, websiteUrl: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'dates' && (
              <div className="space-y-5">
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>توثيق التواريخ الدقيقة للحساب</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    كثير من التطبيقات والمنصات تطلب تاريخ الميلاد المسجل في الحساب أو تاريخ الإنشاء التقريبي عند الاسترداد أو التوثيق. سجلها هنا بدقة لكل حساب على حدة.
                  </p>
                </div>

                {/* Registered Birthdate */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label htmlFor="acc-birthdate" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      تاريخ الميلاد المسجّل داخل هذا الحساب
                    </label>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {realBirthdate && (
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((p) => ({ ...p, registeredBirthdate: realBirthdate }))
                          }
                          className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          نسخ تاريخ ميلادي الحقيقي ({realBirthdate})
                        </button>
                      )}
                      {parentEmailRecord?.registeredBirthdate && (
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((p) => ({
                              ...p,
                              registeredBirthdate: parentEmailRecord.registeredBirthdate,
                            }))
                          }
                          className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          نسخ من البريد المرتبط ({parentEmailRecord.registeredBirthdate})
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    id="acc-birthdate"
                    type="date"
                    dir="ltr"
                    value={draft.registeredBirthdate}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, registeredBirthdate: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono tabular-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {registeredAge !== null && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                      العمر المسجّل في الحساب حالياً: <strong className="text-slate-900 dark:text-slate-100">{registeredAge} سنة</strong>
                      {realBirthdate && draft.registeredBirthdate !== realBirthdate && (
                        <span className="text-amber-600 dark:text-amber-400 mr-2">
                          · ملاحظة: يختلف عن تاريخ ميلادك الحقيقي ({realBirthdate})
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* Account Created Date & Last Password Change */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="acc-created-date" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      متى تم إنشاء الحساب؟ (تاريخ الإنشاء)
                    </label>
                    <input
                      id="acc-created-date"
                      type="date"
                      dir="ltr"
                      value={draft.accountCreatedAt}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, accountCreatedAt: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-sm font-mono tabular-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {createdDuration && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                        عمر الحساب: <strong className="text-slate-900 dark:text-slate-100">{createdDuration.label}</strong>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="acc-pwd-changed" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      تاريخ آخر تحديث لكلمة المرور
                    </label>
                    <input
                      id="acc-pwd-changed"
                      type="date"
                      dir="ltr"
                      value={draft.lastPasswordChangedAt}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, lastPasswordChangedAt: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-sm font-mono tabular-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-5">
                {/* 2FA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      التحقق بخطوتين (2FA)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((p) => ({
                          ...p,
                          twoFactorEnabled: !p.twoFactorEnabled,
                          twoFactorMethod: !p.twoFactorEnabled ? 'authenticator' : 'none',
                        }))
                      }
                      className={`w-full px-3 py-2 text-sm font-medium rounded-lg border flex items-center justify-between transition-colors cursor-pointer ${
                        draft.twoFactorEnabled
                          ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>{draft.twoFactorEnabled ? 'مفعل ومحمي' : 'غير مفعل'}</span>
                      </span>
                      <span className="text-xs">{draft.twoFactorEnabled ? 'إيقاف' : 'تفعيل'}</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="acc-2fa-method" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      وسيلة التحقق
                    </label>
                    <select
                      id="acc-2fa-method"
                      disabled={!draft.twoFactorEnabled}
                      value={draft.twoFactorMethod}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          twoFactorMethod: e.target.value as TwoFactorMethod,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {(Object.keys(TWO_FACTOR_LABELS) as TwoFactorMethod[]).map((m) => (
                        <option key={m} value={m}>
                          {TWO_FACTOR_LABELS[m]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Recovery Email, Recovery Phone, PIN */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="acc-rec-email" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      بريد الاسترداد البديل
                    </label>
                    <input
                      id="acc-rec-email"
                      type="email"
                      dir="ltr"
                      maxLength={VAULT_LIMITS.emailMax}
                      value={draft.recoveryEmail}
                      onChange={(e) => setDraft((p) => ({ ...p, recoveryEmail: e.target.value }))}
                      placeholder="recovery@example.com"
                      className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="acc-rec-phone" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      جوال الاسترداد البديل
                    </label>
                    <input
                      id="acc-rec-phone"
                      type="tel"
                      dir="ltr"
                      maxLength={VAULT_LIMITS.phoneMax}
                      value={draft.recoveryPhone}
                      onChange={(e) => setDraft((p) => ({ ...p, recoveryPhone: e.target.value }))}
                      placeholder="+966 5X..."
                      className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="acc-pin" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      رمز PIN / رمز الملف الشخصي
                    </label>
                    <input
                      id="acc-pin"
                      type="text"
                      dir="ltr"
                      maxLength={VAULT_LIMITS.pinCodeMax}
                      value={draft.pinCode}
                      onChange={(e) => setDraft((p) => ({ ...p, pinCode: e.target.value }))}
                      placeholder="مثال: 4829"
                      className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Backup Codes */}
                <div className="space-y-1.5">
                  <label htmlFor="acc-backup-codes" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    رموز الاسترداد الاحتياطية (Backup Codes)
                  </label>
                  <textarea
                    id="acc-backup-codes"
                    rows={3}
                    dir="ltr"
                    maxLength={VAULT_LIMITS.backupCodesMax}
                    value={draft.backupCodes}
                    onChange={(e) => setDraft((p) => ({ ...p, backupCodes: e.target.value }))}
                    placeholder="8492-1049&#10;3391-7842"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Security Questions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>أسئلة الأمان وإجاباتها (حد أقصى 5)</span>
                    </span>
                    {draft.securityQuestions.length < VAULT_LIMITS.securityQuestionsMax && (
                      <button
                        type="button"
                        onClick={handleAddSecurityQuestion}
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة سؤال أمان</span>
                      </button>
                    )}
                  </div>

                  {draft.securityQuestions.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      لا توجد أسئلة أمان مضافة لهذا الحساب.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {draft.securityQuestions.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-1 sm:grid-cols-11 gap-2 items-center">
                          <input
                            type="text"
                            maxLength={VAULT_LIMITS.securityQuestionTextMax}
                            value={item.question}
                            onChange={(e) => {
                              const next = [...draft.securityQuestions];
                              next[idx] = { ...next[idx], question: e.target.value };
                              setDraft((p) => ({ ...p, securityQuestions: next }));
                            }}
                            placeholder="سؤال الأمان..."
                            className="sm:col-span-5 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                          />
                          <input
                            type="text"
                            maxLength={VAULT_LIMITS.securityQuestionTextMax}
                            value={item.answer}
                            onChange={(e) => {
                              const next = [...draft.securityQuestions];
                              next[idx] = { ...next[idx], answer: e.target.value };
                              setDraft((p) => ({ ...p, securityQuestions: next }));
                            }}
                            placeholder="الإجابة السرية..."
                            className="sm:col-span-5 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSecurityQuestion(idx)}
                            className="sm:col-span-1 p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex justify-center cursor-pointer"
                            aria-label="حذف السؤال"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'extra' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="acc-status" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      حالة الحساب
                    </label>
                    <select
                      id="acc-status"
                      value={draft.status}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, status: e.target.value as AccountStatus }))
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {(Object.keys(STATUS_LABELS) as AccountStatus[]).map((st) => (
                        <option key={st} value={st}>
                          {STATUS_LABELS[st]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="acc-device" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      الجهاز الأساسي المسجّل عليه
                    </label>
                    <input
                      id="acc-device"
                      type="text"
                      maxLength={VAULT_LIMITS.primaryDeviceMax}
                      value={draft.primaryDevice}
                      onChange={(e) => setDraft((p) => ({ ...p, primaryDevice: e.target.value }))}
                      placeholder="مثال: iPhone 15 Pro / MacBook"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Subscription */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="acc-sub-status" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      نوع الاشتراك
                    </label>
                    <select
                      id="acc-sub-status"
                      value={draft.subscriptionStatus}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          subscriptionStatus: e.target.value as SubscriptionStatus,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {(Object.keys(SUBSCRIPTION_LABELS) as SubscriptionStatus[]).map((sub) => (
                        <option key={sub} value={sub}>
                          {SUBSCRIPTION_LABELS[sub]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="acc-sub-cost" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      التكلفة (إن وجدت)
                    </label>
                    <input
                      id="acc-sub-cost"
                      type="text"
                      maxLength={VAULT_LIMITS.subscriptionCostMax}
                      value={draft.subscriptionCost}
                      onChange={(e) => setDraft((p) => ({ ...p, subscriptionCost: e.target.value }))}
                      placeholder="مثال: 45 ر.س / شهر"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="acc-renewal" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      تاريخ التجديد القادم
                    </label>
                    <input
                      id="acc-renewal"
                      type="date"
                      dir="ltr"
                      value={draft.renewalDate}
                      onChange={(e) => setDraft((p) => ({ ...p, renewalDate: e.target.value }))}
                      className="w-full px-3 py-2 text-sm font-mono tabular-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="acc-notes" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    ملاحظات وتفاصيل إضافية
                  </label>
                  <textarea
                    id="acc-notes"
                    rows={4}
                    maxLength={VAULT_LIMITS.notesMax}
                    value={draft.notes}
                    onChange={(e) => setDraft((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="اكتب أي تفاصيل تريد تذكرها عن هذا الحساب..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between gap-4">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.isFavorite}
                onChange={(e) => setDraft((p) => ({ ...p, isFavorite: e.target.checked }))}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>تثبيت في المفضلة</span>
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {saving ? 'جاري الحفظ...' : editingAccount ? 'حفظ التعديلات' : 'إضافة إلى الخزنة'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
