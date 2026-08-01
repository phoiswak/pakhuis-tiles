import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const STAFF_ROLES = new Set([
  "ADMIN",
  "STORE_MANAGER",
  "SALES",
  "WAREHOUSE",
  "FINANCE",
]);

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

        // Role comes from the database (Users table) — not a hardcoded email list
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions,
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

export function isStaffRole(role?: string | null) {
  return Boolean(role && STAFF_ROLES.has(role));
}

/** Admin portal access is based on the user's role in the database. */
export function canAccessAdmin(role?: string | null, _email?: string | null) {
  return isStaffRole(role);
}

export async function requireStaffSession() {
  const session = await getServerSession(authOptions);
  if (!canAccessAdmin(session?.user?.role, session?.user?.email)) {
    return null;
  }
  return session;
}
