import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin-allowlist";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string | undefined;
    const email = req.nextauth.token?.email as string | undefined;
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      (role !== "ADMIN" || !isAdminEmail(email))
    ) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/admin", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/account")) return !!token;
        if (req.nextUrl.pathname.startsWith("/admin")) return !!token;
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
