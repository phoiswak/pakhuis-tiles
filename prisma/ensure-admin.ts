/**
 * Upserts Pakhuis staff without wiping production data.
 * Safe to run on every Vercel build.
 *
 * Portia and Annemarie can use the admin portal, but not Admin → Users.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const STAFF = [
  { email: "admin@pakhuis.co.za", name: "Pakhuis Admin", role: "ADMIN" },
  { email: "lincoln@pakhuis.co.za", name: "Lincoln", role: "ADMIN" },
  { email: "annemarie@pakhuis.co.za", name: "Annemarie", role: "STORE_MANAGER" },
  { email: "portia@pakhuis.co.za", name: "Portia", role: "STORE_MANAGER" },
] as const;

const DEMO_STAFF_TO_DISABLE = [
  "admin@pakhuistiles.co.za",
  "manager@pakhuistiles.co.za",
  "sales@pakhuistiles.co.za",
  "warehouse@pakhuistiles.co.za",
  "finance@pakhuistiles.co.za",
];

const permissions = JSON.stringify([
  "products:edit",
  "stock:manage",
  "customers:manage",
  "reports:view",
  "suppliers:manage",
  "orders:manage",
  "quotes:manage",
]);

async function main() {
  const password = process.env.ADMIN_PASSWORD || "P@kHu1s@23205";
  const passwordHash = await bcrypt.hash(password, 10);

  for (const member of STAFF) {
    await prisma.user.upsert({
      where: { email: member.email },
      update: {
        passwordHash,
        name: member.name,
        role: member.role,
        active: true,
        permissions,
      },
      create: {
        email: member.email,
        passwordHash,
        name: member.name,
        role: member.role,
        active: true,
        permissions,
      },
    });
    console.log(`Staff ready: ${member.email} (${member.role})`);
  }

  // Prevent old demo staff accounts from reaching /admin
  for (const email of DEMO_STAFF_TO_DISABLE) {
    await prisma.user.updateMany({
      where: { email },
      data: { role: "CUSTOMER", active: false },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
