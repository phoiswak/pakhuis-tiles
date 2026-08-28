/**
 * Initial staff accounts seeded on deploy (see prisma/ensure-admin.ts).
 * Access control itself uses the User.role column in the database —
 * admins can add more staff under Admin → Users.
 */
export const SEED_ADMIN_EMAILS = [
  "admin@pakhuis.co.za",
  "lincoln@pakhuis.co.za",
] as const;

/** @deprecated Use database roles; kept for any remaining imports */
export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return SEED_ADMIN_EMAILS.includes(
    email.toLowerCase().trim() as (typeof SEED_ADMIN_EMAILS)[number],
  );
}
