import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Admin/Lecturer routes
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN" && token?.role !== "LECTURER") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      // Only ADMIN can access /admin/users
      if (pathname.startsWith("/admin/users") && token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/modules/:path*", "/profile/:path*", "/admin/:path*"],
};
