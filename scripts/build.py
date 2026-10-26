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
    html = re.sub(r"window\.AB_VARIANT = '[A-D]';", "window.AB_VARIANT = '%s';" % letter, html)
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
m = inner(os.path.join(SRC, 'Merci__1_.html'))
m = m.replace('<div role="img" aria-label="Emplacement de la vidéo', '<!-- VIDÉO : remplacer ce bloc par l’embed (iframe 16/9) -->\n    <div id="video-merci" role="img" aria-label="Emplacement de la vidéo', 1)

pages = {'a': variant(a, 'A', False, False), 'b': variant(a, 'B', True, False),
         'c': variant(c, 'C', False, True), 'd': variant(c, 'D', True, True), 'merci': m}
for k, v in pages.items():
    os.makedirs(os.path.join(OUT, k), exist_ok=True)
    open(os.path.join(OUT, k, 'index.html'), 'w', encoding='utf-8').write(v + '\n')
    print(k, len(v))
