# Monta o HTML da lista de palavras (depois o Chromium transforma-o em PDF)
import json, html, unicodedata, re
d = json.load(open('palavras.json', encoding='utf-8'))
e = html.escape

def chave_pinyin(py):
    s = unicodedata.normalize('NFD', py.lower().replace('ü', 'v').replace('ǖ', 'v').replace('ǘ', 'v').replace('ǚ', 'v').replace('ǜ', 'v'))
    return re.sub(r'[^a-z ]', '', ''.join(c for c in s if not unicodedata.combining(c))).strip()

def tabela(linhas, com_onde=False):
    cab = '<tr><th class="c-zh">Chinês</th><th class="c-py">Pinyin</th><th>Português</th>' + ('<th class="c-onde">Onde aparece</th>' if com_onde else '') + '</tr>'
    corpo = ''
    for w in linhas:
        corpo += f'<tr><td class="zh">{e(w["zh"])}</td><td class="py">{e(w["py"])}</td><td>{e(w["pt"])}</td>' + (f'<td class="onde">{e(w["onde"])}</td>' if com_onde else '') + '</tr>'
    return f'<table>{cab}{corpo}</table>'

indice = {}  # (zh, py) -> {pt, onde[]}
def registar(w, onde):
    k = (w['zh'], w['py'])
    if k not in indice:
        indice[k] = {'zh': w['zh'], 'py': w['py'], 'pt': w['pt'], 'onde': []}
    if onde not in indice[k]['onde']:
        indice[k]['onde'].append(onde)

# ── Parte 1: lições ──
p1 = ''
cidade_atual = None
total1 = 0
for l in d['licoes']:
    if not l['palavras']:
        continue
    if l['cidade'] != cidade_atual:
        cidade_atual = l['cidade']
        p1 += f'<h2>{e(l["cidade"])} <span class="zh-tit">{e(l["cidade_zh"])}</span></h2>'
    p1 += f'<h3>Lição {l["id"]} · {e(l["titulo"])} <span class="unid">(unidade {e(l["unidade"])})</span></h3>'
    p1 += tabela(l['palavras'])
    total1 += len(l['palavras'])
    for w in l['palavras']:
        registar(w, f'Lição {l["id"]}')

# ── Parte 2: o resto do site, sem repetir o que já está nas lições ──
ja = set(indice)
def bloco(titulo, palavras, onde, nota=''):
    novas = []
    for w in palavras:
        registar(w, onde)
        if (w['zh'], w['py']) not in ja:
            ja.add((w['zh'], w['py'])); novas.append(w)
    if not novas:
        return '', 0
    return f'<h3>{e(titulo)} <span class="unid">({len(novas)})</span></h3>' + (f'<p class="nota">{e(nota)}</p>' if nota else '') + tabela(novas), len(novas)

TEMAS = {'pessoas': 'Pessoas', 'verbos': 'Verbos', 'adjetivos': 'Adjetivos', 'lugares': 'Lugares', 'comida': 'Comida e bebida', 'tempo': 'Tempo'}
p2, total2 = '<h2>Vocabulário das ferramentas do Praticar</h2><p class="nota">As palavras dos cartões de memória, do dicionário e do jogo de caracteres.</p>', 0
for chave, nome in TEMAS.items():
    h, n = bloco(nome, [w for w in d['pratica'] if w['tema'] == chave], 'Praticar (vocabulário)')
    p2 += h; total2 += n
h, n = bloco('Cultura das cidades', [{'zh': w['zh'], 'py': w['py'], 'pt': w['pt']} for w in d['cultura']], 'Cultura (cidades)', 'As curiosidades culturais de cada cidade da rota.')
p2 += '<h2>Páginas de conteúdo</h2>' + h; total2 += n
for pg in d['paginas']:
    h, n = bloco('Página ' + pg['pagina'], pg['palavras'], pg['pagina'])
    p2 += h; total2 += n

# ── Parte 3: índice alfabético ──
todas = sorted(indice.values(), key=lambda w: (chave_pinyin(w['py']), w['py'], w['zh']))
for w in todas:
    w['onde'] = '; '.join(w['onde'][:4]) + (' …' if len(w['onde']) > 4 else '')
p3 = tabela(todas, com_onde=True)

css = '''
@page { size: A4; margin: 18mm 16mm 18mm 16mm; }
body { font-family: Carlito, Calibri, sans-serif; color: #18212B; font-size: 10pt; line-height: 1.2; }
.zh, .zh-tit { font-family: "WenQuanYi Zen Hei", sans-serif; }
h1 { font-size: 26pt; margin: 0 0 4mm; color: #0E7C66; }
h2 { font-size: 16pt; color: #0E7C66; border-bottom: 2px solid #D8EEE8; padding-bottom: 1mm; margin: 7mm 0 3mm; break-after: avoid; }
h3 { font-size: 11pt; margin: 3.5mm 0 1mm; break-after: avoid; }
.unid { font-weight: normal; color: #5B6873; font-size: 9.5pt; }
.parte { break-before: page; font-size: 20pt; color: #C8361F; margin: 0 0 3mm; }
table { width: 100%; border-collapse: collapse; margin-bottom: 2mm; }
th { background: #0E7C66; color: #fff; text-align: left; font-size: 9pt; padding: 0.8mm 2mm; }
td { padding: 0.45mm 2mm; border-bottom: 1px solid #E3EAE7; vertical-align: top; }
tr { break-inside: avoid; }
tr:nth-child(even) td { background: #F4F7F6; }
td.zh { font-size: 12pt; white-space: nowrap; }
td.py { color: #0A5C4C; font-style: italic; white-space: nowrap; }
td.onde { color: #5B6873; font-size: 9pt; }
.c-zh { width: 22%; } .c-py { width: 22%; } .c-onde { width: 22%; }
.nota { color: #5B6873; margin: 0 0 2mm; }
.resumo td { border: none; padding: 0.6mm 2mm; background: none !important; }
.capa-sub { color: #5B6873; font-size: 12pt; margin-bottom: 6mm; }
'''
total3 = len(todas)
capa = f'''<h1>Chá 茶 · Palavras em chinês do site</h1>
<p class="capa-sub">Lista de todas as palavras e expressões em chinês do site, com o pinyin e a tradução em português.</p>
<table class="resumo">
<tr><td><b>Parte 1</b></td><td>Palavras das lições, por cidade e por lição</td><td><b>{total1}</b></td></tr>
<tr><td><b>Parte 2</b></td><td>Outras palavras do site (Praticar e páginas de conteúdo), sem repetir as das lições</td><td><b>{total2}</b></td></tr>
<tr><td><b>Parte 3</b></td><td>Índice alfabético pelo pinyin, com todas as palavras e onde aparecem</td><td><b>{total3}</b></td></tr>
</table>
<p class="nota">As 222 frases de exemplo das lições e as frases de gramática e dos diálogos não estão nesta lista, porque são frases e não palavras soltas. As traduções são as que aparecem no site.</p>'''
doc = f'''<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><title>Palavras em chinês do Chá</title><style>{css}</style></head><body>
{capa}
<h1 class="parte" style="break-before:auto;margin-top:8mm">Parte 1 · Palavras das lições</h1>{p1}
<h1 class="parte">Parte 2 · Outras palavras do site</h1>{p2}
<h1 class="parte">Parte 3 · Índice alfabético</h1>{p3}
</body></html>'''
open('lista.html', 'w', encoding='utf-8').write(doc)
print(total1, total2, total3)
