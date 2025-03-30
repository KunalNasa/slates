import { NextRequest, NextResponse } from 'next/server';


export const config = {
  matcher: ['/room/:path*', '/signup', '/signin', '/'],
};

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const token = request.cookies.get('jwt')?.value;
  console.log("token : ", token);
  if(token && ( url.pathname.startsWith('/signin') || url.pathname.startsWith('/signup') || url.pathname === '/')){
    return NextResponse.redirect(new URL('/room', request.url))
  }
  if(!token && url.pathname.startsWith('/room')){
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return NextResponse.next();
}