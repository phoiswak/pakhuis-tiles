import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/account/profile");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const customer = await prisma.customer.findUnique({ where: { userId: session.user.id } });
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-xl px-4 py-12 md:px-6 md:py-16">
      <p className="section-kicker">Account</p>
      <h1 className="mt-2 font-display text-4xl text-ink">Update profile</h1>
      <div className="mt-8 border border-stone-line bg-white p-6">
        <ProfileForm
          name={user.name}
          phone={user.phone || ""}
          companyName={customer?.companyName || ""}
          physicalAddress={customer?.physicalAddress || ""}
          deliveryAddress={customer?.deliveryAddress || ""}
        />
      </div>
    </div>
  );
}
