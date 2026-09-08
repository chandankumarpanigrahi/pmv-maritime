import { NextResponse } from "next/server";

// Known aggressive site cloner and offline scraper user agents
const BLOCKED_USER_AGENTS = [
  "httrack",
  "webcopier",
  "teleport",
  "offline explorer",
  "cyotek",
  "webstripper",
  "pagegrabber",
  "sitecheck",
  "grabnet",
  "webzip",
  "nikto",
  "sqlmap",
];

export function proxy(request) {
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

  // Check if request is from a known offline site cloner / scraper
  const isBlocked = BLOCKED_USER_AGENTS.some((bot) => userAgent.includes(bot));

  if (isBlocked) {
    return new NextResponse(
      "Access Denied: Automated site scrapers and cloners are not permitted.",
      {
        status: 403,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Retry-After": "86400",
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static chunks)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
