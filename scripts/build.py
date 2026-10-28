# Génère a/ b/ c/ d/ merci/ à partir des 3 sources (usage unique)
import re, os, sys
SRC = sys.argv[1]; OUT = sys.argv[2]

def inner(path):
    lines = open(path, encoding='utf-8').read().split('\n')
    # le fichier exporté enveloppe le vrai document : on garde de la ligne 2 jusqu'au 1er </body></html>
    end = next(i for i, l in enumerate(lines) if i > 1 and l.strip() == '</body></html>')
    html = '\n'.join(lines[1:end + 1])
    html = re.sub(r'<!-- Navigation de prévisualisation[^\n]*\n<nav id="nav-preview".*?</nav>\n?', '', html, flags=re.S)
    assert 'nav-preview' not in html
    return html


PH_STUB = '!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group identify setPersonProperties alias get_distinct_id getSessionId getSessionReplayUrl startSessionRecording stopSessionRecording".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);'
PH_KEY = "phc_BxUGtgfbp9335KbqKZAKiRe35gsaDbY5vyymyMz8fENZ"
def posthog(page, signup):
    js = PH_STUB + "\nposthog.init('%s',{api_host:'https://eu.i.posthog.com',ui_host:'https://eu.posthog.com',person_profiles:'identified_only'});\n" % PH_KEY
    js += "posthog.register({variant: window.AB_VARIANT || null, client: 'sinvestir', page: '%s'});\n" % page
    if signup:
        js += "window.phTrackSignup = function(){ try { posthog.capture('inscription', { variant: window.AB_VARIANT }, { send_instantly: true, transport: 'sendBeacon' }); } catch (e) {} };\n"
    return '<script>\n' + js + '</script>'

LEGAL_RE = re.compile(r'<p class="legal".*?</p>', re.S)

def checkbox(dark):
    color = '#AEB7C9' if dark else 'var(--muted)'
    return ('<label class="check" style="margin-top:2px;color:%s"><input type="checkbox" name="optin_communications" value="1" required>'
            '<span>J’accepte que mes données personnelles soient utilisées pour gérer mon inscription et me transmettre les informations et rappels liés à cet événement '
            '(emails, SMS et messages vocaux préenregistrés). Pour en savoir plus, consultez la '
            '<a href="https://sinvestir.fr/politique-de-confidentialite/" target="_blank" rel="noopener" style="color:inherit">politique de confidentialité</a>.</span></label>') % color

CHECK_CSS = ('.check{display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.5;text-align:left;cursor:pointer}'
             '.check input{flex:none;width:18px;height:18px;margin:1px 0 0;accent-color:var(--gold)}\n')

def variant(html, letter, consent, dark):
    html = re.sub(r"<script>window\.AB_VARIANT = '[A-D]';</script>", lambda m: "<script>window.AB_VARIANT = '%s';</script>\n" % letter + posthog('live-novembre-2026', True), html)
    html = re.sub(r"window\.AB_VARIANT \|\| '[A-D]'", "window.AB_VARIANT || '%s'" % letter, html)
    html = html.replace("var THANK_YOU_URL = ''; // À RENSEIGNER : URL de la page de confirmation", "var THANK_YOU_URL = '/merci';")
    # consentement envoyé au webhook (case cochée ou non) + présence de la case
    html = html.replace("var oc = f.querySelector('[name=optin_communications]'); if (oc) body.optin_communications = oc.checked;", "")
    html = html.replace("{ page_url: location.href, variant: variant });",
                        "{ page_url: location.href, variant: variant });\n    var oc = f.querySelector('[name=optin_communications]'); body.consent_checkbox = !!oc; body.optin_communications = oc ? oc.checked : null;")
    assert "consent_checkbox" in html and "/merci" in html
    if consent:
        assert len(LEGAL_RE.findall(html)) == 1
        html = LEGAL_RE.sub('', html)
        html = re.sub(r'(<button type="submit")', lambda m: checkbox(dark) + '\n        ' + m.group(1), html, count=1)
        if '.check{' not in html:
            html = html.replace('</style>', CHECK_CSS + '</style>', 1)
    return html

a = inner(os.path.join(SRC, 'Last_version__1_.html'))
c = inner(os.path.join(SRC, 'LP_2__1_.html'))
# C/D : portrait studio de Matthieu dans la carte intervenant (assets/matthieu-portrait.webp)
import base64
_portrait = base64.b64encode(open(os.path.join(os.path.dirname(__file__), '..', 'assets', 'matthieu-portrait.webp'), 'rb').read()).decode()
_n = len(re.findall(r'<img src="data:image/webp;base64,[A-Za-z0-9+/=]+" alt="Matthieu Louvet" ', c))
assert _n == 1, _n
c = re.sub(r'<img src="data:image/webp;base64,[A-Za-z0-9+/=]+" alt="Matthieu Louvet" ',
           lambda m: '<img src="data:image/webp;base64,%s" alt="Matthieu Louvet" ' % _portrait, c)
# C/D : même portrait dans la section « Qui suis-je ? » (à la place de la photo de conférence)
_bio = base64.b64encode(open(os.path.join(os.path.dirname(__file__), '..', 'assets', 'matthieu-bio.webp'), 'rb').read()).decode()
_pat = r'<img src="data:image/webp;base64,[A-Za-z0-9+/=]+" alt="Matthieu Louvet en conférence devant un public" '
assert len(re.findall(_pat, c)) == 1
c = re.sub(_pat, lambda m: '<img src="data:image/webp;base64,%s" alt="Matthieu Louvet, fondateur de S’investir" ' % _bio, c)
m = inner(os.path.join(SRC, 'Merci__1_.html'))
m = m.replace('</title>', '</title>\n<script>window.AB_VARIANT = new URLSearchParams(location.search).get(\'variant\');</script>\n' + posthog('merci-live-novembre-2026', False), 1)
# Vidéo hébergée sur Vercel (media/), 1080p, lecteur maison : lecture / pause / revoir.
VIDEO = """<!-- VIDÉO : fichier media/merci-v2-1080p.mp4 (+ media/merci-v2-poster.jpg) -->
    <div id="video-merci" style="position:relative;width:100%;max-width:760px;aspect-ratio:16/9;border-radius:20px;overflow:hidden;background:#000;box-shadow:0 24px 50px rgba(11,26,53,0.25)">
      <video id="vm-video" src="/media/merci-v2-1080p.mp4" poster="/media/merci-v2-poster.jpg" preload="metadata" playsinline disablepictureinpicture controlslist="nodownload noplaybackrate noremoteplayback" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000"></video>
      <div id="vm-cover" data-state="start" role="button" tabindex="0" aria-label="Lire la vidéo" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;cursor:pointer;background:linear-gradient(180deg,rgba(5,11,22,0),rgba(5,11,22,0.35))">
        <span class="vm-play" aria-hidden="true" style="width:84px;height:84px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold2));display:flex;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(0,0,0,0.4)"><span style="width:0;height:0;border-left:26px solid var(--navy);border-top:16px solid transparent;border-bottom:16px solid transparent;margin-left:7px"></span></span>
        <span class="vm-replay" style="display:none;align-items:center;gap:10px;padding:14px 26px;border-radius:999px;font-weight:700;font-size:16px;line-height:1;color:var(--navy);background:linear-gradient(135deg,var(--gold),var(--gold2))">↻ Revoir la vidéo</span>
      </div>
    </div>
    <script>
    (function(){
      var v = document.getElementById('vm-video'), cover = document.getElementById('vm-cover');
      var play = cover.querySelector('.vm-play'), replay = cover.querySelector('.vm-replay');
      var BG = cover.style.background;
      function show(state){
        cover.dataset.state = state;
        cover.setAttribute('aria-label', state === 'playing' ? 'Mettre en pause' : state === 'ended' ? 'Revoir la vidéo' : 'Lire la vidéo');
        if (state === 'playing') { cover.style.background = 'transparent'; play.style.display = 'none'; replay.style.display = 'none'; return; }
        cover.style.background = state === 'start' ? BG : state === 'ended' ? 'linear-gradient(150deg,#16305A,var(--navy2))' : 'rgba(5,11,22,0.45)';
        play.style.display = state === 'ended' ? 'none' : 'flex';
        replay.style.display = state === 'ended' ? 'inline-flex' : 'none';
      }
      function toggle(){
        if (cover.dataset.state === 'ended') v.currentTime = 0;
        if (v.paused || v.ended) v.play(); else v.pause();
      }
      cover.addEventListener('click', toggle);
      cover.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
      v.addEventListener('play', function(){ show('playing'); });
      v.addEventListener('pause', function(){ if (!v.ended) show('paused'); });
      v.addEventListener('ended', function(){ show('ended'); });
      v.addEventListener('contextmenu', function(e){ e.preventDefault(); });
    })();
    </script>"""
start = m.index('<div role="img" aria-label="Emplacement de la vidéo')
end = m.index('Emplacement de la vidéo de Matthieu</span>\n    </div>', start) + len('Emplacement de la vidéo de Matthieu</span>\n    </div>')
m = m[:start] + VIDEO + m[end:]

pages = {'a': variant(a, 'A', False, False), 'b': variant(a, 'B', True, False),
         'c': variant(c, 'C', False, True), 'd': variant(c, 'D', True, True), 'merci': m}

# Page Google Ads (/ga) : version B + astérisque sur la headline + mentions légales sous le logo du footer
GA_MENTION = ('<p style="margin:0;font-size:12.5px;line-height:1.65;max-width:720px">* Les résultats mentionnés sur cette page sont donnés à titre indicatif '
              'et peuvent être vérifiés sur simple demande. Ils ne constituent en aucun cas une promesse de gain. Les résultats obtenus sont souvent '
              'proportionnels aux efforts fournis et aux risques encourus.<br>Ce service est proposé par la société MATTHIEU LOUVET – S’INVESTIR, '
              'en partenariat avec la société Join Venture (Leads.fr), immatriculée à l’ORIAS sous le numéro 20005729 en qualité d’intermédiaire '
              'en opérations de banque et en services de paiement (IOBSP) dans la catégorie mandataire d’intermédiaire.</p>')
def google_ads(html):
    html = variant(html, 'GA', True, False)
    assert html.count('les 10 prochaines années.</span></h1>') == 1
    html = html.replace('les 10 prochaines années.</span></h1>', 'les 10 prochaines années.*</span></h1>')
    j = html.rindex('<footer')
    k = html.index('alt="S’investir"></a>', j) + len('alt="S’investir"></a>')
    return html[:k] + '\n      ' + GA_MENTION + html[k:]
pages['ga'] = google_ads(a)
# Vocabulaire : on parle de « challenge » partout
WORDING = [('<title>Last version</title>', '<title>Challenge S’investir · 8 au 10 novembre 2026</title>'),
           ('<title>LP 2</title>', '<title>Challenge S’investir · 8 au 10 novembre 2026</title>'),
           ('<title>Merci</title>', '<title>Inscription confirmée · Challenge S’investir</title>'),
           ('L’événement démarre le', 'Le challenge démarre le'),
           ('L’événement commence dans', 'Le challenge commence dans'),
           ('liés à cet événement', 'liés à ce challenge'),
           ('pendant l’événement', 'pendant le challenge'),
           ('le jour de l’événement', 'le jour du challenge')]
def wording(html):
    for old, new in WORDING:
        html = html.replace(old, new)
    low = html.lower()
    assert 'événement' not in low and 'bootcamp' not in low and 'sommet' not in low
    return html

# Meta Pixel (codes fournis par Adrien). Deux pixels :
#  - 1296900680676100 : toutes les pages (A, B, C, D, GA) + merci
#  - 2007406146543619 : pages A, B, C, D + merci (sauf inscrits venant de /ga)
# Un seul chargement de fbevents.js, init des pixels, puis un seul « track »
# (deux snippets copiés tels quels feraient compter le PageView deux fois au 1er pixel).
PIXEL_MAIN, PIXEL_OPTIN = '1296900680676100', '2007406146543619'
def meta_pixel(page):
    event = 'Contact' if page == 'merci' else 'PageView'
    if page == 'merci':
        inits = ("fbq('init', '%s');\n"
                 "if (new URLSearchParams(location.search).get('variant') !== 'GA') fbq('init', '%s');\n") % (PIXEL_MAIN, PIXEL_OPTIN)
        ids = [PIXEL_MAIN, PIXEL_OPTIN]
    elif page == 'ga':
        inits = "fbq('init', '%s');\n" % PIXEL_MAIN
        ids = [PIXEL_MAIN]
    else:
        inits = "fbq('init', '%s');\nfbq('init', '%s');\n" % (PIXEL_MAIN, PIXEL_OPTIN)
        ids = [PIXEL_MAIN, PIXEL_OPTIN]
    noscript = ''.join('<noscript><img height="1" width="1" style="display:none"\nsrc="https://www.facebook.com/tr?id=%s&ev=PageView&noscript=1"\n/></noscript>\n' % i for i in ids)
    return ("""<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
""" + inits + "fbq('track', '%s');\n</script>\n" % event + noscript + "<!-- End Meta Pixel Code -->\n")

for k, v in pages.items():
    v = wording(v)
    assert v.count('</head>') == 1
    v = v.replace('</head>', meta_pixel(k) + '</head>')
    os.makedirs(os.path.join(OUT, k), exist_ok=True)
    open(os.path.join(OUT, k, 'index.html'), 'w', encoding='utf-8').write(v + '\n')
    print(k, len(v))
