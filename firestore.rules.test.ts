/**
 * Security Rules Verification Spec for Personal Account Vault
 * Verifies the "Dirty Dozen" adversarial payloads against /users/{userId}/accounts/{accountId}
 * and /users/{userId}/preferences/{prefId}.
 */

export interface DirtyDozenCase {
  id: number;
  name: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  auth: { uid: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expected: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_CASES: DirtyDozenCase[] = [
  {
    id: 1,
    name: 'Unauthenticated read',
    operation: 'get',
    path: '/users/userA/accounts/acc1',
    auth: null,
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Unverified email create',
    operation: 'create',
    path: '/users/userA/accounts/acc1',
    auth: { uid: 'userA', email_verified: false },
    payload: { id: 'acc1', ownerId: 'userA', title: 'Gmail' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Cross-tenant read',
    operation: 'get',
    path: '/users/userA/accounts/acc1',
    auth: { uid: 'userB', email_verified: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Cross-tenant list',
    operation: 'list',
    path: '/users/userA/accounts',
    auth: { uid: 'userB', email_verified: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Identity spoofing ownerId',
    operation: 'create',
    path: '/users/userA/accounts/acc1',
    auth: { uid: 'userA', email_verified: true },
    payload: { id: 'acc1', ownerId: 'userB', title: 'Spoofed' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Shadow ghost field injection',
    operation: 'create',
    path: '/users/userA/accounts/acc1',
    auth: { uid: 'userA', email_verified: true },
    payload: { id: 'acc1', ownerId: 'userA', isAdmin: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Orphaned parentEmailId reference',
    operation: 'create',
    path: '/users/userA/accounts/acc2',
    auth: { uid: 'userA', email_verified: true },
    payload: { id: 'acc2', ownerId: 'userA', recordType: 'app', parentEmailId: 'missing_parent' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'ID poisoning with invalid characters',
    operation: 'create',
    path: '/users/userA/accounts/bad$id',
    auth: { uid: 'userA', email_verified: true },
    payload: { id: 'bad$id', ownerId: 'userA' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Resource exhaustion notes > 2000 chars',
    operation: 'create',
    path: '/users/userA/accounts/acc1',
    auth: { uid: 'userA', email_verified: true },
    payload: { id: 'acc1', ownerId: 'userA', notes: 'x'.repeat(2500) },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Security questions array overflow (> 5)',
    operation: 'create',
    path: '/users/userA/accounts/acc1',
    auth: { uid: 'userA', email_verified: true },
    payload: {
      id: 'acc1',
      ownerId: 'userA',
      securityQuestions: new Array(6).fill({ question: 'q', answer: 'a' }),
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Client-forged createdAt timestamp',
    operation: 'create',
    path: '/users/userA/accounts/acc1',
    auth: { uid: 'userA', email_verified: true },
    payload: { id: 'acc1', ownerId: 'userA', createdAt: '2020-01-01T00:00:00Z' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Immutable ownerId mutation on update',
    operation: 'update',
    path: '/users/userA/accounts/acc1',
    auth: { uid: 'userA', email_verified: true },
    payload: { ownerId: 'userB' },
    expected: 'PERMISSION_DENIED',
  },
];
