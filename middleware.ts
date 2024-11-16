import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

// menggunakan auth.config untuk meng-ekstrak auth yg akan digunakan dalam middleware
const { auth } = NextAuth(authConfig);

export default auth((req): any => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth; // boolean

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // pengecekan apakah user sedang berada pada api route, jika iya maka tidak akan melakukan apa apa (allowed)
  if (isApiAuthRoute) {
    return null;
  }

  // pengecekan apakah user mencoba mengakses halaman dengan url auth route (login, register)
  if (isAuthRoute) {
    // jika iya, maka cek apakah user sudah login, jika sudah, redirect ke halaman default(/settings)
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    }
    // jika belum, maka biarkan user dihalaman itu
    return null;
  }

  // pengecekan apakah status login user bernilai false (user belum login), dan bukan sedang mengakses public route
  if (!isLoggedIn && !isPublicRoute) {
    // jika iya, redirect ke halaman login dengan membawa callback url (url dari halaman sebelumnya yg dicoba akses)
    let callbackUrl = nextUrl.pathname; // mengambil pathname saja (tanpa query string)
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl); // encode callback url
    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }
  // jika bukan, biarkan user dihalaman itu
  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
