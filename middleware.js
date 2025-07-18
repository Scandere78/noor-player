// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Gérer les erreurs d'API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      return NextResponse.next();
    } catch (error) {
      console.error('Erreur middleware API:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Erreur interne du serveur' }),
        { status: 500, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*']
};
