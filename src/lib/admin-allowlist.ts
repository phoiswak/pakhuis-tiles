/** Only these emails may access /admin and see the Admin menu. */
export const ADMIN_EMAILS = [
  "admin@pakhuis.co.za",
  "annemarie@pakhuis.co.za",
  "lincoln@pakhuis.co.za",
  "portia@pakhuis.co.za",
] as const;

const adminSet = new Set(
  ADMIN_EMAILS.map((email) => email.toLowerCase()),
);

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return adminSet.has(email.toLowerCase().trim());
}
