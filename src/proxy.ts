import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const staffRoles = new Set([
  "ADMIN",
  "STORE_MANAGER",
  "SALES",
  "WAREHOUSE",
  "FINANCE",
]);

export default withAuth(
  function proxy(req) {
    const role = req.nextauth.token?.role as string | undefined;
    const path = req.nextUrl.pathname;

    // Customers (and anyone without a staff role) cannot enter the admin portal
    if (path.startsWith("/admin") && (!role || !staffRoles.has(role))) {
      return NextResponse.redirect(new URL("/staff", req.url));
    }

    // Only ADMIN can open the Users page (add people)
    if (path.startsWith("/admin/users") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
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
