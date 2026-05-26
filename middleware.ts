import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_ONLY_ROUTES = ["/estadisticas"];
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = ADMIN_ONLY_ROUTES.some((r) => pathname.startsWith(r));
  if (!isAdminRoute) return NextResponse.next();

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const role = payload.role as string;

    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/estadisticas/:path*"],
};