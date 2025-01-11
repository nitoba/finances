// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from './lib/auth/current-session.server'

const publicRoutes = ['/auth']

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = !publicRoutes.includes(path)

  const session = await getSession()

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth', req.nextUrl))
  }

  if (!isProtectedRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    {
      source: '/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)',
      missing: [{ type: 'header', key: 'next-action' }],
    },
  ],
}
