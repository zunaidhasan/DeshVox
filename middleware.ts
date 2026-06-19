import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-deshvox-tenant", request.headers.get("host") ?? "local");
  response.headers.set("x-content-type-options", "nosniff");
  response.headers.set("x-frame-options", "DENY");
  response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  response.headers.set("permissions-policy", "camera=(), geolocation=(), payment=()");
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"]
};
