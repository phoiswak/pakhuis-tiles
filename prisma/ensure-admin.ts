/**
 * Upserts Pakhuis admin users without wiping production data.
 * Safe to run on every Vercel build.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMINS = [
  { email: "admin@pakhuis.co.za", name: "Pakhuis Admin" },
  { email: "annemarie@pakhuis.co.za", name: "Annemarie" },
  { email: "lincoln@pakhuis.co.za", name: "Lincoln" },
  { email: "portia@pakhuis.co.za", name: "Portia" },
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

  for (const admin of ADMINS) {
    await prisma.user.upsert({
      where: { email: admin.email },
      update: {
        passwordHash,
        name: admin.name,
        role: "ADMIN",
        active: true,
        permissions,
      },
      create: {
        email: admin.email,
        passwordHash,
        name: admin.name,
        role: "ADMIN",
        active: true,
        permissions,
      },
    });
    console.log(`Admin ready: ${admin.email}`);
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
