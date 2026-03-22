import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// O Next.js 16 espera que a função se chame 'proxy'
export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthRoute = ["/login", "/cadastro", "/recuperar-senha"].some(path => pathname.startsWith(path));
  const isPrivateRoute = ["/home", "/perfil", "/campanhas", "/faturamento", "/admin"].some(path => pathname.startsWith(path));

  if (isPrivateRoute) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    try {
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload.role as string;

      if (userRole === "CUSTOMER" && ["/faturamento", "/campanhas"].some(path => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/home", req.url));
      }
      return NextResponse.next();
    } catch (err) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  if (isAuthRoute && token) {
    try {
      await jwtVerify(token, secret);
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
    "/faturamento/:path*",
    "/admin/:path*",
    "/login",
    "/cadastro",
    "/recuperar-senha",
  ]
};