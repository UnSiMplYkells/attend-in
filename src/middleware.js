import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(8, "10 s"),
  analytics: true,
});

export async function middleware(request) {
  if (
    request.nextUrl.pathname.startsWith("/api") ||
    request.method === "POST"
  ) {

    const ip = request.ip ?? "127.0.0.1";

    const { success, pending, limit, reset, remaining } =
      await ratelimit.limit(ip);

    if (!success) {
      // If they hit the limit, block the request and return a 429 status
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        },
      );
    }
  }

  // If safe, continue to the requested route
  return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};


// import { NextResponse } from "next/server";
// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";

// const redis = Redis.fromEnv();

// // Limit 1: Stops rapid-fire button mashing
// const burstLimiter = new Ratelimit({
//   redis: redis,
//   limiter: Ratelimit.slidingWindow(8, "10 s"),
//   prefix: "@upstash/burst",
// });

// // Limit 2: Stops "low and slow" scripts over a 24-hour period
// const dailyLimiter = new Ratelimit({
//   redis: redis,
//   limiter: Ratelimit.slidingWindow(30, "1 d"), // Max 30 requests per day
//   prefix: "@upstash/daily",
// });

// export async function middleware(request) {
//   if (
//     request.nextUrl.pathname.startsWith("/api") ||
//     request.method === "POST"
//   ) {
//     const ip = request.ip ?? "127.0.0.1";

//     // 1. Check the Burst Limit first (cheaper and faster)
//     const burst = await burstLimiter.limit(ip);
//     if (!burst.success) {
//       return NextResponse.json(
//         { error: "Too many requests. Please slow down." },
//         { status: 429 },
//       );
//     }

//     // 2. Check the Daily Limit
//     const daily = await dailyLimiter.limit(ip);
//     if (!daily.success) {
//       return NextResponse.json(
//         { error: "Daily action limit reached. Try again tomorrow." },
//         { status: 429 },
//       );
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };