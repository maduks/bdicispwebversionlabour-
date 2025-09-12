import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const user = request.cookies.get('user')
  console.log("user: ",user)
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/dashboard/my-listings',
    '/dashboard/add-listing',
    '/dashboard/profile',
    '/kyc-verification'
  ]

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !user) {
    // Redirect to login if trying to access protected route without authentication
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is authenticated but hasn't completed KYC
  // if (user) {
  //   const userData = JSON.parse(user.value)
  //   if (!userData.isKYCVerified && pathname !== '/kyc-verification') {
  //     return NextResponse.redirect(new URL('/kyc-verification', request.url))
  //   }
  // }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/kyc-verification',
  ],
} 