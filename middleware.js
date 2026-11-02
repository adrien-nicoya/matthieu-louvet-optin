// Split A/C sur "/" — 50 % chacun, variante collante 30 jours via cookie.
// B et D sont coupées (02/11/2026) : un ancien cookie b/d est re-tiré entre a et c.
// Forcer une variante pour tester : /?v=a (ou b, c, d — les pages B/D restent accessibles). Les UTM sont conservés.
export const config = { matcher: '/' };

const ACTIVE = ['a', 'c'];
const FORCEABLE = ['a', 'b', 'c', 'd'];
const COOKIE = 'lp_variant';

export default function middleware(request) {
  const url = new URL(request.url);
  const forced = (url.searchParams.get('v') || '').toLowerCase();
  const cookie = (request.headers.get('cookie') || '').match(new RegExp(COOKIE + '=([a-d])'));
  const variant = FORCEABLE.includes(forced) ? forced
    : cookie && ACTIVE.includes(cookie[1]) ? cookie[1]
    : ACTIVE[Math.floor(Math.random() * ACTIVE.length)];

  url.pathname = '/' + variant;
  url.searchParams.delete('v');

  return new Response(null, {
    headers: {
      'x-middleware-rewrite': url.toString(),
      'set-cookie': `${COOKIE}=${variant}; Path=/; Max-Age=2592000; SameSite=Lax; Secure`,
      'cache-control': 'private, no-store',
    },
  });
}
