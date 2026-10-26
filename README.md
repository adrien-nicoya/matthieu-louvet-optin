# S'investir — 3 soirées (8-10 nov. 2026)

| URL | Contenu |
|---|---|
| `/` | Split 25/25/25/25 vers A, B, C ou D (cookie `lp_variant`, 30 j). Forcer : `/?v=a` |
| `/a` | Last version — mention légale implicite |
| `/b` | Last version — case de consentement obligatoire |
| `/c` | LP 2 — mention légale implicite |
| `/d` | LP 2 — case de consentement obligatoire |
| `/merci` | Thank you (vidéo à intégrer : bloc `#video-merci`) |

Formulaire → `POST /api/submit` → webhook Make (env `MAKE_WEBHOOK_URL`, fallback codé en dur).

Payload envoyé à Make : `prenom, email, tel, utm_*, page_url, variant (A-D), consent_checkbox (bool), optin_communications (bool|null), submitted_at, ip, user_agent, referer, country`.

Après inscription : redirection `/merci?utm_…&variant=X`.

`scripts/build.py` : regénère a/b/c/d/merci depuis les HTML sources si besoin.
