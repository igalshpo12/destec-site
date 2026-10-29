import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/server/auth';

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(`${process.env.SITE_URL || req.nextUrl.origin}/account`, { status: 303 });
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
  return res;
}
