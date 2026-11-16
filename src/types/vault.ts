export type RecordType = 'email' | 'app';

export type AccountCategory =
  | 'email'
  | 'social'
  | 'work'
  | 'finance'
  | 'gaming'
  | 'entertainment'
  | 'shopping'
  | 'government'
  | 'education'
  | 'other';

export type LoginMethod =
  | 'email_password'
  | 'google_oauth'
  | 'apple_id'
  | 'phone_otp'
  | 'username_password'
  | 'sso';

export type TwoFactorMethod =
  | 'none'
  | 'authenticator'
  | 'sms'
  | 'email'
  | 'hardware_key'
  | 'biometric';

export type SubscriptionStatus = 'none' | 'free' | 'monthly' | 'yearly' | 'lifetime';

export type AccountStatus = 'active' | 'suspended' | 'needs_update' | 'archived';

export interface SecurityQuestionItem {
  question: string;
  answer: string;
}

export interface VaultAccount {
  id: string;
  ownerId: string;
  recordType: RecordType;
  title: string;
  platformKey: string;
  category: AccountCategory;
  emailAddress: string;
  parentEmailId: string;
  username: string;
  displayName: string;
  password: string;
  loginMethod: LoginMethod;
  websiteUrl: string;
  phoneNumber: string;
  recoveryEmail: string;
  recoveryPhone: string;
  registeredBirthdate: string;
  accountCreatedAt: string;
  lastPasswordChangedAt: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: TwoFactorMethod;
  backupCodes: string;
  securityQuestions: SecurityQuestionItem[];
  pinCode: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionCost: string;
  renewalDate: string;
  primaryDevice: string;
  status: AccountStatus;
  isFavorite: boolean;
  notes: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type VaultAccountDraft = Omit<VaultAccount, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>;

export interface VaultPreferences {
  ownerId: string;
  realBirthdate: string;
  vaultPinHash: string;
  autoLockMinutes: number;
  theme: 'light' | 'dark';
  createdAt?: unknown;
  updatedAt?: unknown;
}

/**
 * Synchronized verbatim with firebase-blueprint.json & firestore.rules
 */
export const VAULT_LIMITS = {
  idMax: 128,
  idPattern: /^[a-zA-Z0-9_-]+$/,
  datePattern: /^(\d{4}-\d{2}-\d{2})?$/,
  titleMax: 120,
  platformKeyMax: 60,
  emailMax: 160,
  usernameMax: 120,
  displayNameMax: 120,
  passwordMax: 512,
  websiteUrlMax: 300,
  phoneMax: 40,
  dateMax: 20,
  backupCodesMax: 1000,
  securityQuestionsMax: 5,
  securityQuestionTextMax: 200,
  pinCodeMax: 32,
  subscriptionCostMax: 40,
  primaryDeviceMax: 100,
  notesMax: 2000,
  vaultPinHashMax: 128,
} as const;
