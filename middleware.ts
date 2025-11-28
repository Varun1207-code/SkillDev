import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/auth'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value

    // Define protected routes
    const protectedRoutes = ['/dashboard', '/test', '/recommendations', '/chat', '/admin']
    const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        const payload = await verifyJWT(token)
        if (!payload) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/test/:path*', '/recommendations/:path*', '/chat/:path*'],
}
