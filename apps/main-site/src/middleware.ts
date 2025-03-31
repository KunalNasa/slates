import { NextRequest, NextResponse } from 'next/server';
import { fetchUserDetails } from './lib/decodeToken';


export const config = {
  matcher: ['/room/:path*', '/signup', '/signin', '/'],
};

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const token = request.cookies.get('jwt')?.value;
  const rooms = request.cookies.get('rooms')?.value;

  if(token && ( url.pathname.startsWith('/signin') || url.pathname.startsWith('/signup') || url.pathname === '/')){
    return NextResponse.redirect(new URL('/room', request.url));
  }
  if(!token && url.pathname.startsWith('/room')){
    return NextResponse.redirect(new URL('/signin', request.url))
  }
  if(url.pathname === '/room/:id'){
    if (rooms) {
      // const parsedRooms = JSON.parse(rooms);
      // const params = useParams();
      // const id = params.id;
      // if (Array.isArray(parsedRooms)) {
      // const isUserAllowed = parsedRooms.find((item) => {
      //   item.id === id 
      // })
      // if(!isUserAllowed){
      //   //TODO : Configure logic
      // }
    }
  }

  return NextResponse.next();
}