import { getToken } from "next-auth/jwt";

import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(req.nextUrl.origin);
  }

  // Redirection if the user is not authenticated
  if (!token && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(`${req.nextUrl.origin}/login`);
  }

  // blocking navigation to login page if user is authenticated

  const isTokenExpired =
    token && Date.now() >= token?.data?.validity?.refresh_until * 1000;
  if (isTokenExpired && req.nextUrl.pathname !== "/login") {
    console.log("Token expired, redirecting to /login and clearing cookies");
    const response = NextResponse.redirect(`${req.nextUrl.origin}/login`);
    response.cookies.set("next-auth.session-token", "", { maxAge: 0 });
    response.cookies.set("next-auth.csrf-token", "", { maxAge: 0 });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
