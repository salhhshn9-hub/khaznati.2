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
  VaultPreferences,
} from '../types/vault';

export interface PlatformPreset {
  key: string;
  label: string;
  recordType: RecordType;
  category: AccountCategory;
  defaultUrl: string;
  accentHex: string;
  shortCode: string;
}

export const PLATFORM_PRESETS: PlatformPreset[] = [
  { key: 'gmail', label: 'Gmail', recordType: 'email', category: 'email', defaultUrl: 'https://mail.google.com', accentHex: '#DC2626', shortCode: 'GM' },
  { key: 'outlook', label: 'Outlook / Hotmail', recordType: 'email', category: 'email', defaultUrl: 'https://outlook.live.com', accentHex: '#0284C7', shortCode: 'OL' },
  { key: 'icloud', label: 'iCloud Mail', recordType: 'email', category: 'email', defaultUrl: 'https://www.icloud.com', accentHex: '#2563EB', shortCode: 'IC' },
  { key: 'yahoo', label: 'Yahoo Mail', recordType: 'email', category: 'email', defaultUrl: 'https://mail.yahoo.com', accentHex: '#7C3AED', shortCode: 'YH' },
  { key: 'proton', label: 'Proton Mail', recordType: 'email', category: 'email', defaultUrl: 'https://mail.proton.me', accentHex: '#4F46E5', shortCode: 'PM' },
  { key: 'instagram', label: 'Instagram', recordType: 'app', category: 'social', defaultUrl: 'https://instagram.com', accentHex: '#E11D48', shortCode: 'IG' },
  { key: 'facebook', label: 'Facebook', recordType: 'app', category: 'social', defaultUrl: 'https://facebook.com', accentHex: '#1D4ED8', shortCode: 'FB' },
  { key: 'x', label: 'X (Twitter)', recordType: 'app', category: 'social', defaultUrl: 'https://x.com', accentHex: '#0F172A', shortCode: 'X' },
  { key: 'tiktok', label: 'TikTok', recordType: 'app', category: 'social', defaultUrl: 'https://tiktok.com', accentHex: '#18181B', shortCode: 'TT' },
  { key: 'snapchat', label: 'Snapchat', recordType: 'app', category: 'social', defaultUrl: 'https://snapchat.com', accentHex: '#CA8A04', shortCode: 'SC' },
  { key: 'youtube', label: 'YouTube', recordType: 'app', category: 'entertainment', defaultUrl: 'https://youtube.com', accentHex: '#DC2626', shortCode: 'YT' },
  { key: 'linkedin', label: 'LinkedIn', recordType: 'app', category: 'work', defaultUrl: 'https://linkedin.com', accentHex: '#0369A1', shortCode: 'IN' },
  { key: 'discord', label: 'Discord', recordType: 'app', category: 'gaming', defaultUrl: 'https://discord.com', accentHex: '#4F46E5', shortCode: 'DC' },
  { key: 'steam', label: 'Steam', recordType: 'app', category: 'gaming', defaultUrl: 'https://store.steampowered.com', accentHex: '#1E293B', shortCode: 'ST' },
  { key: 'playstation', label: 'PlayStation', recordType: 'app', category: 'gaming', defaultUrl: 'https://playstation.com', accentHex: '#1D4ED8', shortCode: 'PS' },
  { key: 'netflix', label: 'Netflix', recordType: 'app', category: 'entertainment', defaultUrl: 'https://netflix.com', accentHex: '#B91C1C', shortCode: 'NF' },
  { key: 'spotify', label: 'Spotify', recordType: 'app', category: 'entertainment', defaultUrl: 'https://spotify.com', accentHex: '#16A34A', shortCode: 'SP' },
  { key: 'amazon', label: 'Amazon', recordType: 'app', category: 'shopping', defaultUrl: 'https://amazon.sa', accentHex: '#D97706', shortCode: 'AZ' },
  { key: 'apple', label: 'Apple ID', recordType: 'app', category: 'work', defaultUrl: 'https://appleid.apple.com', accentHex: '#334155', shortCode: 'AP' },
  { key: 'github', label: 'GitHub', recordType: 'app', category: 'work', defaultUrl: 'https://github.com', accentHex: '#0F172A', shortCode: 'GH' },
  { key: 'absher', label: 'أبشر / خدمات حكومية', recordType: 'app', category: 'government', defaultUrl: 'https://absher.sa', accentHex: '#15803D', shortCode: 'AB' },
  { key: 'bank', label: 'حساب بنكي / مالي', recordType: 'app', category: 'finance', defaultUrl: '', accentHex: '#0F766E', shortCode: 'BK' },
  { key: 'custom', label: 'تطبيق / موقع مخصص', recordType: 'app', category: 'other', defaultUrl: '', accentHex: '#475569', shortCode: 'WB' },
];

export const CATEGORY_LABELS: Record<AccountCategory, string> = {
  email: 'بريد إلكتروني',
  social: 'تواصل اجتماعي',
  work: 'عمل وإنتاجية',
  finance: 'بنوك ومالية',
  gaming: 'ألعاب',
  entertainment: 'ترفيه وبث',
  shopping: 'تسوق إلكتروني',
  government: 'حكومي ورسمي',
  education: 'تعليم ودورات',
  other: 'أخرى',
};

export const LOGIN_METHOD_LABELS: Record<LoginMethod, string> = {
  email_password: 'بريد إلكتروني + كلمة مرور',
  google_oauth: 'تسجيل دخول عبر Google',
  apple_id: 'تسجيل دخول عبر Apple',
  phone_otp: 'رقم الجوال + رمز التحقق',
  username_password: 'اسم المستخدم + كلمة مرور',
  sso: 'دخول موحد (SSO)',
};

export const TWO_FACTOR_LABELS: Record<TwoFactorMethod, string> = {
  none: 'غير مفعل',
  authenticator: 'تطبيق المصادقة (Authenticator)',
  sms: 'رسالة نصية (SMS)',
  email: 'بريد الاسترداد',
  hardware_key: 'مفتاح أمان فعلي',
  biometric: 'بصمة / Passkey',
};

export const SUBSCRIPTION_LABELS: Record<SubscriptionStatus, string> = {
  none: 'بدون اشتراك',
  free: 'خطة مجانية',
  monthly: 'اشتراك شهري',
  yearly: 'اشتراك سنوي',
  lifetime: 'دفع لمرة واحدة',
};

export const STATUS_LABELS: Record<AccountStatus, string> = {
  active: 'نشط',
  suspended: 'مجمّد / مؤقت',
  needs_update: 'يحتاج تحديث أمان',
  archived: 'مؤرشف',
};

export function getPresetByKey(key: string): PlatformPreset {
  return PLATFORM_PRESETS.find((p) => p.key === key) || PLATFORM_PRESETS[PLATFORM_PRESETS.length - 1];
}

export function createEmptyAccountDraft(overrides?: Partial<VaultAccountDraft>): VaultAccountDraft {
  return {
    recordType: 'app',
    title: '',
    platformKey: 'custom',
    category: 'social',
    emailAddress: '',
    parentEmailId: '',
    username: '',
    displayName: '',
    password: '',
    loginMethod: 'email_password',
    websiteUrl: '',
    phoneNumber: '',
    recoveryEmail: '',
    recoveryPhone: '',
    registeredBirthdate: '',
    accountCreatedAt: '',
    lastPasswordChangedAt: new Date().toISOString().slice(0, 10),
    twoFactorEnabled: false,
    twoFactorMethod: 'none',
    backupCodes: '',
    securityQuestions: [],
    pinCode: '',
    subscriptionStatus: 'free',
    subscriptionCost: '',
    renewalDate: '',
    primaryDevice: '',
    status: 'active',
    isFavorite: false,
    notes: '',
    ...overrides,
  };
}

function clampStr(value: unknown, max: number): string {
  const s = typeof value === 'string' ? value.trim() : '';
  return s.length > max ? s.slice(0, max) : s;
}

function clampDate(value: unknown): string {
  const s = typeof value === 'string' ? value.trim() : '';
  return VAULT_LIMITS.datePattern.test(s) ? s : '';
}

export function generateSafeId(prefix = 'acc'): string {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 14)
      : Math.random().toString(36).slice(2, 12);
  return `${prefix}_${Date.now().toString(36)}_${randomPart}`;
}

/**
 * Ensures every field conforms strictly to firebase-blueprint.json & firestore.rules.
 */
export function sanitizeAccountPayload(
  draft: VaultAccountDraft,
  ownerId: string,
  accountId: string,
  validParentIds?: Set<string>
): Omit<VaultAccount, 'createdAt' | 'updatedAt'> {
  const safeParentId = clampStr(draft.parentEmailId, VAULT_LIMITS.idMax);
  const resolvedParentId =
    safeParentId && VAULT_LIMITS.idPattern.test(safeParentId) && (!validParentIds || validParentIds.has(safeParentId))
      ? safeParentId
      : '';

  const safeQuestions = (Array.isArray(draft.securityQuestions) ? draft.securityQuestions : [])
    .slice(0, VAULT_LIMITS.securityQuestionsMax)
    .map((item) => ({
      question: clampStr(item?.question, VAULT_LIMITS.securityQuestionTextMax),
      answer: clampStr(item?.answer, VAULT_LIMITS.securityQuestionTextMax),
    }))
    .filter((item) => item.question.length > 0 || item.answer.length > 0);

  return {
    id: clampStr(accountId, VAULT_LIMITS.idMax),
    ownerId: clampStr(ownerId, VAULT_LIMITS.idMax),
    recordType: draft.recordType === 'email' ? 'email' : 'app',
    title: clampStr(draft.title, VAULT_LIMITS.titleMax) || 'حساب بدون عنوان',
    platformKey: clampStr(draft.platformKey, VAULT_LIMITS.platformKeyMax) || 'custom',
    category: draft.category in CATEGORY_LABELS ? draft.category : 'other',
    emailAddress: clampStr(draft.emailAddress, VAULT_LIMITS.emailMax),
    parentEmailId: resolvedParentId,
    username: clampStr(draft.username, VAULT_LIMITS.usernameMax),
    displayName: clampStr(draft.displayName, VAULT_LIMITS.displayNameMax),
    password: typeof draft.password === 'string' ? draft.password.slice(0, VAULT_LIMITS.passwordMax) : '',
    loginMethod: draft.loginMethod in LOGIN_METHOD_LABELS ? draft.loginMethod : 'email_password',
    websiteUrl: clampStr(draft.websiteUrl, VAULT_LIMITS.websiteUrlMax),
    phoneNumber: clampStr(draft.phoneNumber, VAULT_LIMITS.phoneMax),
    recoveryEmail: clampStr(draft.recoveryEmail, VAULT_LIMITS.emailMax),
    recoveryPhone: clampStr(draft.recoveryPhone, VAULT_LIMITS.phoneMax),
    registeredBirthdate: clampDate(draft.registeredBirthdate),
    accountCreatedAt: clampDate(draft.accountCreatedAt),
    lastPasswordChangedAt: clampDate(draft.lastPasswordChangedAt),
    twoFactorEnabled: Boolean(draft.twoFactorEnabled),
    twoFactorMethod: draft.twoFactorEnabled
      ? draft.twoFactorMethod in TWO_FACTOR_LABELS && draft.twoFactorMethod !== 'none'
        ? draft.twoFactorMethod
        : 'authenticator'
      : 'none',
    backupCodes: typeof draft.backupCodes === 'string' ? draft.backupCodes.slice(0, VAULT_LIMITS.backupCodesMax) : '',
    securityQuestions: safeQuestions,
    pinCode: clampStr(draft.pinCode, VAULT_LIMITS.pinCodeMax),
    subscriptionStatus: draft.subscriptionStatus in SUBSCRIPTION_LABELS ? draft.subscriptionStatus : 'none',
    subscriptionCost: clampStr(draft.subscriptionCost, VAULT_LIMITS.subscriptionCostMax),
    renewalDate: clampDate(draft.renewalDate),
    primaryDevice: clampStr(draft.primaryDevice, VAULT_LIMITS.primaryDeviceMax),
    status: draft.status in STATUS_LABELS ? draft.status : 'active',
    isFavorite: Boolean(draft.isFavorite),
    notes: typeof draft.notes === 'string' ? draft.notes.slice(0, VAULT_LIMITS.notesMax) : '',
  };
}

export function sanitizePreferencesPayload(
  prefs: Partial<VaultPreferences>,
  ownerId: string
): Omit<VaultPreferences, 'createdAt' | 'updatedAt'> {
  return {
    ownerId: clampStr(ownerId, VAULT_LIMITS.idMax),
    realBirthdate: clampDate(prefs.realBirthdate),
    vaultPinHash: clampStr(prefs.vaultPinHash, VAULT_LIMITS.vaultPinHashMax),
    autoLockMinutes:
      typeof prefs.autoLockMinutes === 'number' && prefs.autoLockMinutes >= 0 && prefs.autoLockMinutes <= 120
        ? Math.round(prefs.autoLockMinutes)
        : 15,
    theme: prefs.theme === 'dark' ? 'dark' : 'light',
  };
}

export function calculateAgeFromBirthdate(dateStr: string): number | null {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const birth = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}

export function calculateAccountDuration(dateStr: string): { label: string; days: number } | null {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const created = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(created.getTime())) return null;
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  if (diffMs < 0) return { label: 'تاريخ مستقبلي', days: 0 };
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);

  if (years > 0 && months > 0) {
    return { label: `منذ ${years} ${years === 1 ? 'سنة' : years === 2 ? 'سنتين' : 'سنوات'} و ${months} ${months === 1 ? 'شهر' : months <= 10 ? 'أشهر' : 'شهراً'}`, days };
  }
  if (years > 0) {
    return { label: `منذ ${years} ${years === 1 ? 'سنة' : years === 2 ? 'سنتين' : 'سنوات'}`, days };
  }
  if (months > 0) {
    return { label: `منذ ${months} ${months === 1 ? 'شهر' : months === 2 ? 'شهرين' : months <= 10 ? 'أشهر' : 'شهراً'}`, days };
  }
  if (days > 0) {
    return { label: `منذ ${days} ${days === 1 ? 'يوم' : days === 2 ? 'يومين' : days <= 10 ? 'أيام' : 'يوماً'}`, days };
  }
  return { label: 'أُنشئ اليوم', days: 0 };
}

export function formatReadableDate(dateStr: string): string {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 'غير مسجل';
  return dateStr.replace(/-/g, '/');
}

export interface PasswordEvaluation {
  score: number; // 0-100
  label: string;
  tier: 'weak' | 'fair' | 'strong' | 'excellent';
  entropyBits: number;
}

export function evaluatePasswordStrength(password: string): PasswordEvaluation {
  if (!password) {
    return { score: 0, label: 'غير محددة', tier: 'weak', entropyBits: 0 };
  }

  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
  if (charsetSize === 0) charsetSize = 26;

  const entropyBits = Math.round(password.length * Math.log2(charsetSize));
  let score = Math.min(100, Math.round((entropyBits / 90) * 100));

  // Penalize repeated characters or common sequences
  if (/^(.)\1+$/.test(password)) score = Math.min(score, 15);
  if (password.length < 8) score = Math.min(score, 35);

  if (score < 40) return { score, label: 'ضعيفة', tier: 'weak', entropyBits };
  if (score < 65) return { score, label: 'متوسطة', tier: 'fair', entropyBits };
  if (score < 85) return { score, label: 'قوية', tier: 'strong', entropyBits };
  return { score, label: 'ممتازة', tier: 'excellent', entropyBits };
}

export interface PasswordGeneratorOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export function generateSecurePassword(opts: PasswordGeneratorOptions): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const nums = '23456789';
  const syms = '!@#$%^&*_-+=?';

  let pool = '';
  const guaranteed: string[] = [];

  if (opts.uppercase) {
    pool += upper;
    guaranteed.push(upper[secureRandomIndex(upper.length)]);
  }
  if (opts.lowercase) {
    pool += lower;
    guaranteed.push(lower[secureRandomIndex(lower.length)]);
  }
  if (opts.numbers) {
    pool += nums;
    guaranteed.push(nums[secureRandomIndex(nums.length)]);
  }
  if (opts.symbols) {
    pool += syms;
    guaranteed.push(syms[secureRandomIndex(syms.length)]);
  }

  if (!pool) {
    pool = lower + nums;
  }

  const length = Math.max(8, Math.min(48, opts.length));
  const chars: string[] = [...guaranteed];

  while (chars.length < length) {
    chars.push(pool[secureRandomIndex(pool.length)]);
  }

  // Fisher-Yates shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomIndex(i + 1);
    const tmp = chars[i];
    chars[i] = chars[j];
    chars[j] = tmp;
  }

  return chars.join('');
}

function secureRandomIndex(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`khaznati_pin_${pin}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export interface AuditReport {
  reusedPasswordGroups: { passwordMasked: string; accounts: VaultAccount[] }[];
  weakPasswordAccounts: VaultAccount[];
  noTwoFactorAccounts: VaultAccount[];
  oldPasswordAccounts: { account: VaultAccount; daysSinceChange: number }[];
  birthdateMismatches: {
    account: VaultAccount;
    reason: string;
    parentBirthdate?: string;
  }[];
  missingDatesAccounts: VaultAccount[];
}

export function buildVaultAuditReport(
  accounts: VaultAccount[],
  realBirthdate: string
): AuditReport {
  const emailMap = new Map<string, VaultAccount>();
  accounts.filter((a) => a.recordType === 'email').forEach((e) => emailMap.set(e.id, e));

  // Password reuse map
  const passwordBuckets = new Map<string, VaultAccount[]>();
  for (const acc of accounts) {
    if (acc.password && acc.loginMethod !== 'google_oauth' && acc.loginMethod !== 'apple_id') {
      const list = passwordBuckets.get(acc.password) || [];
      list.push(acc);
      passwordBuckets.set(acc.password, list);
    }
  }

  const reusedPasswordGroups = Array.from(passwordBuckets.entries())
    .filter(([, list]) => list.length > 1)
    .map(([pwd, list]) => ({
      passwordMasked: `${pwd.slice(0, 2)}${'•'.repeat(Math.max(4, pwd.length - 2))}`,
      accounts: list,
    }));

  const weakPasswordAccounts = accounts.filter((acc) => {
    if (!acc.password) return false;
    if (acc.loginMethod === 'google_oauth' || acc.loginMethod === 'apple_id') return false;
    return evaluatePasswordStrength(acc.password).tier === 'weak';
  });

  const noTwoFactorAccounts = accounts.filter(
    (acc) => acc.status === 'active' && !acc.twoFactorEnabled
  );

  const nowMs = Date.now();
  const oldPasswordAccounts: { account: VaultAccount; daysSinceChange: number }[] = [];
  for (const acc of accounts) {
    if (acc.lastPasswordChangedAt && /^\d{4}-\d{2}-\d{2}$/.test(acc.lastPasswordChangedAt)) {
      const changedMs = new Date(`${acc.lastPasswordChangedAt}T00:00:00`).getTime();
      const days = Math.floor((nowMs - changedMs) / (1000 * 60 * 60 * 24));
      if (days >= 180) {
        oldPasswordAccounts.push({ account: acc, daysSinceChange: days });
      }
    }
  }

  const birthdateMismatches: AuditReport['birthdateMismatches'] = [];
  for (const acc of accounts) {
    const parent = acc.parentEmailId ? emailMap.get(acc.parentEmailId) : undefined;
    if (acc.registeredBirthdate) {
      if (parent?.registeredBirthdate && acc.registeredBirthdate !== parent.registeredBirthdate) {
        birthdateMismatches.push({
          account: acc,
          reason: `يختلف عن تاريخ ميلاد البريد المرتبط (${formatReadableDate(parent.registeredBirthdate)})`,
          parentBirthdate: parent.registeredBirthdate,
        });
      } else if (realBirthdate && acc.registeredBirthdate !== realBirthdate) {
        birthdateMismatches.push({
          account: acc,
          reason: `مخالف لتاريخ ميلادك الحقيقي (${formatReadableDate(realBirthdate)})`,
          parentBirthdate: parent?.registeredBirthdate,
        });
      }
    }
  }

  const missingDatesAccounts = accounts.filter(
    (acc) => !acc.registeredBirthdate || !acc.accountCreatedAt
  );

  return {
    reusedPasswordGroups,
    weakPasswordAccounts,
    noTwoFactorAccounts,
    oldPasswordAccounts,
    birthdateMismatches,
    missingDatesAccounts,
  };
}

export function createSampleAccountsForUser(): {
  emails: { tempId: string; draft: VaultAccountDraft }[];
  apps: { parentTempId: string; draft: VaultAccountDraft }[];
} {
  const email1Temp = 'sample_email_1';
  const email2Temp = 'sample_email_2';

  return {
    emails: [
      {
        tempId: email1Temp,
        draft: createEmptyAccountDraft({
          recordType: 'email',
          title: 'البريد الشخصي الأساسي',
          platformKey: 'gmail',
          category: 'email',
          emailAddress: 'salem.personal@gmail.com',
          username: 'salem.personal',
          displayName: 'سالم العتيبي',
          password: 'K9#mP2$vL8xQ!nR4',
          loginMethod: 'email_password',
          websiteUrl: 'https://mail.google.com',
          phoneNumber: '+966 55 123 4567',
          recoveryEmail: 'salem.backup@outlook.com',
          recoveryPhone: '+966 50 987 6543',
          registeredBirthdate: '1997-04-12',
          accountCreatedAt: '2017-09-03',
          lastPasswordChangedAt: '2026-06-15',
          twoFactorEnabled: true,
          twoFactorMethod: 'authenticator',
          backupCodes: '8492-1049\n3391-7842\n5120-9941\n6701-2248',
          securityQuestions: [
            { question: 'اسم أول مدرسة التحقت بها؟', answer: 'مدرسة الفيصلية' },
            { question: 'المدينة التي ولدت فيها؟', answer: 'الرياض' },
          ],
          primaryDevice: 'iPhone 15 Pro / MacBook Air',
          status: 'active',
          isFavorite: true,
          notes: 'الإيميل الرسمي الرئيسي المرتبط بحسابات التواصل والبنوك.',
        }),
      },
      {
        tempId: email2Temp,
        draft: createEmptyAccountDraft({
          recordType: 'email',
          title: 'بريد الألعاب والاشتراكات',
          platformKey: 'outlook',
          category: 'email',
          emailAddress: 'salem.play@outlook.com',
          username: 'salem.play',
          displayName: 'Salem Gaming',
          password: 'G7@tZ5!wN3qB9*mK',
          loginMethod: 'email_password',
          websiteUrl: 'https://outlook.live.com',
          phoneNumber: '+966 55 123 4567',
          recoveryEmail: 'salem.personal@gmail.com',
          registeredBirthdate: '1995-01-01',
          accountCreatedAt: '2020-02-18',
          lastPasswordChangedAt: '2025-11-10',
          twoFactorEnabled: true,
          twoFactorMethod: 'sms',
          securityQuestions: [{ question: 'أفضل لعبة مفضلة؟', answer: 'Bloodborne' }],
          primaryDevice: 'PlayStation 5 / PC',
          status: 'active',
          isFavorite: false,
          notes: 'مخصص للمنصات الترفيهية والألعاب — انتبه أن تاريخ الميلاد المسجل به 1995/01/01.',
        }),
      },
    ],
    apps: [
      {
        parentTempId: email1Temp,
        draft: createEmptyAccountDraft({
          recordType: 'app',
          title: 'Instagram',
          platformKey: 'instagram',
          category: 'social',
          emailAddress: 'salem.personal@gmail.com',
          username: '@salem_lens',
          displayName: 'سالم | تصوير',
          password: 'Ig$84mN2#pQ7vX!w',
          loginMethod: 'email_password',
          websiteUrl: 'https://instagram.com',
          phoneNumber: '+966 55 123 4567',
          registeredBirthdate: '1997-04-12',
          accountCreatedAt: '2018-05-20',
          lastPasswordChangedAt: '2026-08-01',
          twoFactorEnabled: true,
          twoFactorMethod: 'authenticator',
          backupCodes: '1920-4810\n5519-0023',
          primaryDevice: 'iPhone 15 Pro',
          status: 'active',
          isFavorite: true,
          notes: 'حساب التصوير الشخصي.',
        }),
      },
      {
        parentTempId: email1Temp,
        draft: createEmptyAccountDraft({
          recordType: 'app',
          title: 'Facebook',
          platformKey: 'facebook',
          category: 'social',
          emailAddress: 'salem.personal@gmail.com',
          username: 'salem.alotaibi.97',
          displayName: 'Salem Alotaibi',
          password: 'Fb#31kL9@zR6mP!v',
          loginMethod: 'email_password',
          websiteUrl: 'https://facebook.com',
          phoneNumber: '+966 55 123 4567',
          registeredBirthdate: '1996-08-15',
          accountCreatedAt: '2016-03-11',
          lastPasswordChangedAt: '2024-09-12',
          twoFactorEnabled: false,
          twoFactorMethod: 'none',
          primaryDevice: 'iPhone 15 Pro',
          status: 'needs_update',
          isFavorite: false,
          notes: 'مربوط بصفحة المتجر القديمة — تم تسجيل تاريخ ميلاد قديم 1996 عند الإنشاء.',
        }),
      },
      {
        parentTempId: email1Temp,
        draft: createEmptyAccountDraft({
          recordType: 'app',
          title: 'Amazon',
          platformKey: 'amazon',
          category: 'shopping',
          emailAddress: 'salem.personal@gmail.com',
          username: 'salem.personal@gmail.com',
          displayName: 'سالم العتيبي',
          password: 'Amz!92pK4#vL8xQ$',
          loginMethod: 'email_password',
          websiteUrl: 'https://amazon.sa',
          phoneNumber: '+966 55 123 4567',
          registeredBirthdate: '1997-04-12',
          accountCreatedAt: '2021-11-25',
          lastPasswordChangedAt: '2026-01-14',
          twoFactorEnabled: true,
          twoFactorMethod: 'sms',
          subscriptionStatus: 'yearly',
          subscriptionCost: '140 ر.س / سنة',
          renewalDate: '2026-11-25',
          primaryDevice: 'iPhone 15 Pro',
          status: 'active',
          notes: 'اشتراك أمازون برايم السنوي.',
        }),
      },
      {
        parentTempId: email2Temp,
        draft: createEmptyAccountDraft({
          recordType: 'app',
          title: 'PlayStation Network',
          platformKey: 'playstation',
          category: 'gaming',
          emailAddress: 'salem.play@outlook.com',
          username: 'Salem_KSA95',
          displayName: 'Salem_KSA95',
          password: 'Psn@74wQ2#mZ8xL!',
          loginMethod: 'email_password',
          websiteUrl: 'https://playstation.com',
          registeredBirthdate: '1995-01-01',
          accountCreatedAt: '2020-12-01',
          lastPasswordChangedAt: '2026-04-20',
          twoFactorEnabled: true,
          twoFactorMethod: 'authenticator',
          pinCode: '4829',
          securityQuestions: [{ question: 'مكان ميلاد الوالد؟', answer: 'الدرعية' }],
          subscriptionStatus: 'yearly',
          subscriptionCost: '320 ر.س / سنة',
          renewalDate: '2026-12-01',
          primaryDevice: 'PlayStation 5',
          status: 'active',
          isFavorite: true,
          notes: 'الرمز السري للدخول السريع 4829 — تاريخ الميلاد مطابق لبريد الألعاب 1995.',
        }),
      },
      {
        parentTempId: email2Temp,
        draft: createEmptyAccountDraft({
          recordType: 'app',
          title: 'Netflix',
          platformKey: 'netflix',
          category: 'entertainment',
          emailAddress: 'salem.play@outlook.com',
          username: 'salem.play@outlook.com',
          displayName: 'ملف سالم',
          password: 'Nf!66tY3@pM9xR$w',
          loginMethod: 'email_password',
          websiteUrl: 'https://netflix.com',
          registeredBirthdate: '1995-01-01',
          accountCreatedAt: '2022-07-09',
          lastPasswordChangedAt: '2026-03-01',
          twoFactorEnabled: false,
          twoFactorMethod: 'none',
          pinCode: '1190',
          subscriptionStatus: 'monthly',
          subscriptionCost: '63 ر.س / شهر',
          renewalDate: '2026-12-09',
          primaryDevice: 'Smart TV / iPhone',
          status: 'active',
          notes: 'رمز قفل الملف الشخصي: 1190.',
        }),
      },
    ],
  };
}
