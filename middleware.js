// Split A/B/C/D sur "/" — 25 % chacun, variante collante 30 jours via cookie.
// Forcer une variante pour tester : /?v=a (ou b, c, d). Les UTM sont conservés.
export const config = { matcher: '/' };

const VARIANTS = ['a', 'b', 'c', 'd'];
const COOKIE = 'lp_variant';

export default function middleware(request) {
  const url = new URL(request.url);
  const forced = (url.searchParams.get('v') || '').toLowerCase();
  const cookie = (request.headers.get('cookie') || '').match(new RegExp(COOKIE + '=([a-d])'));
  const variant = VARIANTS.includes(forced) ? forced
    : cookie ? cookie[1]
    : VARIANTS[Math.floor(Math.random() * VARIANTS.length)];

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
