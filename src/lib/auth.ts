import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
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
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: session.user?.email || "",
        name: session.user?.name || "",
        role: token.role,
        permissions: token.permissions || [],
      };
      return session;
    },
  },
};

export function isStaffRole(role: string) {
  return ["ADMIN", "STORE_MANAGER", "SALES", "WAREHOUSE", "FINANCE"].includes(role);
}

export async function requireStaffSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || !isStaffRole(session.user.role)) {
    return null;
  }
  return session;
}
