import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Redirect to auth if not logged in and trying to access protected routes
  if (!user && request.nextUrl.pathname.startsWith('/chat')) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Redirect to chat if already logged in and trying to access auth page
  if (user && request.nextUrl.pathname === '/auth') {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/chat', '/chat/:path*', '/auth'],
};