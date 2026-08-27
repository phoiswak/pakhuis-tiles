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

/** Staff sessions expire one hour after login. Customer sessions last 30 days. */
const STAFF_SESSION_SECONDS = 60 * 60;
const CUSTOMER_SESSION_SECONDS = 30 * 24 * 60 * 60;

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: CUSTOMER_SESSION_SECONDS },
  jwt: { maxAge: CUSTOMER_SESSION_SECONDS },
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
        if (isStaffRole(user.role)) {
          token.staffLoginAt = Math.floor(Date.now() / 1000);
        }
      }

      if (isStaffRole(token.role)) {
        const loginAt = Number(token.staffLoginAt ?? token.iat ?? 0) || 0;
        const now = Math.floor(Date.now() / 1000);
        if (!loginAt || now - loginAt >= STAFF_SESSION_SECONDS) {
          return {};
        }
        token.exp = loginAt + STAFF_SESSION_SECONDS;
      }

      return token;
    },
    async session({ session, token }) {
      if (!token.id) {
        return {
          ...session,
          expires: new Date(0).toISOString(),
        };
      }

      session.user = {
        id: token.id,
        email: token.email || session.user?.email || "",
        name: session.user?.name || "",
        role: token.role || "CUSTOMER",
        permissions: token.permissions || [],
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

/** Only true ADMIN role — not other staff, never customers. */
export function isAdminRole(role?: string | null) {
  return role === "ADMIN";
}

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!isAdminRole(session?.user?.role)) {
    return null;
  }
  return session;
}
