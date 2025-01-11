// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from './lib/auth/current-session.server'

const authRoutes = ['/auth']

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  const session = await getSession()

  // Verificar se o usuário está autenticado
  if (!session) {
    if (!authRoutes.includes(path)) {
      // Redirecionar para /auth se não estiver autenticado e não estiver acessando uma rota de autenticação
      return NextResponse.redirect(new URL('/auth', req.nextUrl))
    }
    return NextResponse.next() // Permitir acesso à rota de autenticação
  }

  const user = session.user

  // Regras para usuários autenticados
  if (user.monthlySalary === 0) {
    if (path === '/auth') {
      // Usuário com salário 0 tentando acessar /auth, redireciona para /
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
    if (path !== '/') {
      // Usuário com salário 0 tentando acessar qualquer outra rota que não seja /
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
    return NextResponse.next() // Permitir acesso à rota /
  }

  // Usuário autenticado com salário > 0
  if (authRoutes.includes(path)) {
    // Redirecionar para /dashboard se tentar acessar uma rota de autenticação
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next() // Permitir acesso às outras rotas
}

export const config = {
  matcher: [
    {
      source: '/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)',
      missing: [{ type: 'header', key: 'next-action' }],
    },
  ],
}
