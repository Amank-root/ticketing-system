import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the client IP address
  // @ts-ignore
  const ip = request.ip || 'unknown';
  
  // Store IP in headers for server components/API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-forwarded-for', ip);

  // Continue with the modified request
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Apply this middleware to API routes
export const config = {
  matcher: '/api/:path*',
};