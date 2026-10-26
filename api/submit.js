// Reçoit le formulaire et le relaie au webhook Make (URL jamais exposée côté navigateur).
const WEBHOOK = process.env.MAKE_WEBHOOK_URL || 'https://hook.eu1.make.com/h21ft50tj9i8641xdb4yoid696p7vp4k';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const prenom = String(b.prenom || '').trim();
  const email = String(b.email || '').trim().toLowerCase();
  const tel = String(b.tel || '').trim();
  if (!prenom || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !tel) {
    return res.status(400).json({ ok: false, error: 'invalid' });
  }

  const payload = {
    ...b,
    prenom, email, tel,
    submitted_at: new Date().toISOString(),
    ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim(),
    user_agent: req.headers['user-agent'] || '',
    referer: req.headers['referer'] || '',
    country: req.headers['x-vercel-ip-country'] || '',
  };

  try {
    const r = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error('Make ' + r.status);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ ok: false });
  }
}
