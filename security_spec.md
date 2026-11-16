# Security Specification — Personal Account Vault

## 1. Data Invariants
1. **Strict Private Ownership (PII Isolation)**: Every account document (`/users/{userId}/accounts/{accountId}`) and preference document (`/users/{userId}/preferences/{prefId}`) is readable, writable, and deletable ONLY by the verified user whose `request.auth.uid == userId` AND `request.auth.token.email_verified == true`.
2. **Identity Integrity**: `ownerId` inside any document must equal `request.auth.uid` and `userId` path parameter on create, and must remain immutable on update.
3. **Path Variable Hardening**: All path parameters (`userId`, `accountId`, `prefId`) must match `^[a-zA-Z0-9_-]+$` and be <= 128 characters. For `/accounts/{accountId}`, document `id` must match `{accountId}`.
4. **Parent Email Consistency**: If an account specifies a non-empty `parentEmailId`, that parent email document must exist under `/users/{userId}/accounts/{parentEmailId}` (enforced via `exists()` on create/update when `parentEmailId != ''`).
5. **Temporal Integrity & Immutability**: `createdAt` must equal `request.time` on create and remain immutable on update. `updatedAt` must equal `request.time` on both create and update.
6. **Strict Key & Size Limits**: Every string has explicit `.size()` bounds; `securityQuestions` list is bounded to <= 5 items with strict field shapes; no shadow/ghost keys allowed via `keys().hasAll(...) && keys().hasOnly(...)` and `affectedKeys().hasOnly(...)`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Read/Write**: Reading or writing `/users/uid1/accounts/acc1` when `request.auth == null` -> `PERMISSION_DENIED`.
2. **Unverified Email Spoof**: Authenticated user with `email_verified: false` attempting to create an account -> `PERMISSION_DENIED`.
3. **Cross-Tenant Read**: User B (`uid2`) reading `/users/uid1/accounts/acc1` -> `PERMISSION_DENIED`.
4. **Cross-Tenant List**: User B (`uid2`) listing `/users/uid1/accounts` -> `PERMISSION_DENIED`.
5. **Identity Spoofing on Create**: User A (`uid1`) creating `/users/uid1/accounts/acc1` with `ownerId: "uid2"` -> `PERMISSION_DENIED`.
6. **Shadow / Ghost Field Injection**: User A creating `/users/uid1/accounts/acc1` with extra key `isAdmin: true` -> `PERMISSION_DENIED`.
7. **Orphaned Parent Email Link**: Creating an `app` account with `parentEmailId: "non_existent_email"` -> `PERMISSION_DENIED`.
8. **ID Poisoning**: Creating `/users/uid1/accounts/bad$id!@#` or 200-char ID -> `PERMISSION_DENIED`.
9. **Resource Exhaustion (1MB String)**: Creating an account with `notes` > 2000 chars or `password` > 512 chars -> `PERMISSION_DENIED`.
10. **Array Overflow**: Creating an account with 6 `securityQuestions` (> 5 limit) -> `PERMISSION_DENIED`.
11. **Timestamp Forgery / Mutation**: Creating with client-forged `createdAt` or updating `createdAt` to a new value -> `PERMISSION_DENIED`.
12. **Immutable Field Tampering**: Updating `ownerId` or `id` on an existing account -> `PERMISSION_DENIED`.
