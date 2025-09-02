import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define your protected routes here (re-introduced locally)
const PROTECTED_ROUTES = [
  '/dashboard',
  '/dashboard/stations',
  '/dashboard/raffles',
  // Add other protected routes as needed
];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value; // Assuming token is in a cookie
  const pathname = request.nextUrl.pathname;

  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !accessToken) {
    // Redirect to login page if not authenticated
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed if authenticated or not a protected route
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*', // Protect all dashboard routes
    '/login', // Also run on login to redirect authenticated users
  ],
};
