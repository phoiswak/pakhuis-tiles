import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { isAdminEmail } from "@/lib/admin-allowlist";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });
        if (!user || !user.active) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        let permissions: string[] = [];
        try {
          permissions = JSON.parse(user.permissions || "[]") as string[];
        } catch {
          permissions = [];
        }

        // Only the allowlisted Pakhuis emails get admin access
        const finalRole = isAdminEmail(user.email) ? "ADMIN" : "CUSTOMER";

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: finalRole,
          permissions: finalRole === "ADMIN" ? permissions : [],
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
        token.email = user.email;
      }
      // Re-check allowlist on every request token refresh
      if (token.email && !isAdminEmail(String(token.email)) && token.role !== "CUSTOMER") {
        token.role = "CUSTOMER";
        token.permissions = [];
      }
      if (token.email && isAdminEmail(String(token.email))) {
        token.role = "ADMIN";
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: (token.email as string) || session.user?.email || "",
        name: session.user?.name || "",
        role: (token.role as string) || "CUSTOMER",
        permissions: (token.permissions as string[]) || [],
      };
      return session;
    },
  },
};

export function isStaffRole(role: string) {
  return role === "ADMIN";
}

/** Staff portal access: must be allowlisted admin email + ADMIN role */
export function canAccessAdmin(role?: string | null, email?: string | null) {
  return Boolean(role === "ADMIN" && isAdminEmail(email));
}

export async function requireStaffSession() {
  const session = await getServerSession(authOptions);
  if (!canAccessAdmin(session?.user?.role, session?.user?.email)) {
    return null;
  }
  return session;
}
