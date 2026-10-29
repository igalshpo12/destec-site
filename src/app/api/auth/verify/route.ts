import { NextRequest, NextResponse } from 'next/server';
import { authEnabled, consumeLoginToken, sessionCookieValue, sessionCookieOptions, SESSION_COOKIE } from '@/lib/server/auth';

// The link in the e-mail. A valid token → session cookie → /account; anything else → /account
// with an error flag (expired, used, or not ours).
export async function GET(req: NextRequest) {
  const site = process.env.SITE_URL || req.nextUrl.origin;
  if (!authEnabled()) return NextResponse.redirect(`${site}/account?login=unavailable`);
  const email = await consumeLoginToken(req.nextUrl.searchParams.get('token') || '');
  if (!email) return NextResponse.redirect(`${site}/account?login=invalid`);
  const res = NextResponse.redirect(`${site}/account`);
  res.cookies.set(SESSION_COOKIE, sessionCookieValue(email), sessionCookieOptions());
  return res;
}
