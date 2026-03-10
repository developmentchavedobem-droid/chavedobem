import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isPrivateRoute =
    pathname.startsWith("/home") ||
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/campanhas") ||
    pathname.startsWith("/bilhetes");

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/cadastro") ||
    pathname.startsWith("/recuperar-senha");

  if (isPrivateRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET as string);
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL("/login", req.url));

      response.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0
      });

      return response;
    }
  }

  if (isAuthRoute && token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET as string);
      return NextResponse.redirect(new URL("/home", req.url));
    } catch {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/perfil/:path*",
    "/campanhas/:path*",
    "/bilhetes/:path*",
    "/login",
    "/cadastro",
    "/recuperar-senha"
  ]
};