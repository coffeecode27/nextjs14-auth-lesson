/**
 * An array of routes that are publicly accessible,
 * These routes will not require authentication
 * and these routes can be accessed both logged in and logged out users
 * @type {string[]}
 */
export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * An array of routes that are used for authentication only,
 * these routes can only be accessed by logged out users
 * and will redirect logged in users to "/settings" if they try to access these routes
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The routes that start with this prefix are used for API authentication purposes, and generally accessible
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after users logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
