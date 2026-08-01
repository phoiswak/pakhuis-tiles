import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const staffRoles = new Set(["ADMIN", "STORE_MANAGER", "SALES", "WAREHOUSE", "FINANCE"]);

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string | undefined;
    if (req.nextUrl.pathname.startsWith("/admin") && (!role || !staffRoles.has(role))) {
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
