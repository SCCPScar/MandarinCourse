# Junta todas as palavras chinesas do site: base de dados, vocabulário do Praticar e páginas de conteúdo
import re, json, html
P = '/home/user/MandarinCourse/'
ZH = re.compile(r'[一-鿿]')

def tuplos(sql, tabela):
    i = sql.index(f'INSERT INTO {tabela} ')
    i = sql.index('VALUES', i) + 6
    fim = sql.index(';\n', i)
    s = sql[i:fim]
    out, atual, campo, k, dentro = [], None, '', 0, False
    vals = []
    while k < len(s):
        c = s[k]
        if dentro:
            if c == "'" and k + 1 < len(s) and s[k+1] == "'": campo += "'"; k += 2; continue
            if c == '\\' : campo += s[k+1]; k += 2; continue
            if c == "'": dentro = False
            else: campo += c
        else:
            if c == "'": dentro = True; campo = campo  # string
            elif c == '(': vals = []; campo = ''
            elif c == ',': vals.append(campo.strip()); campo = ''
            elif c == ')': vals.append(campo.strip()); out.append(vals); campo = ''
            else: campo += c
        k += 1
    return out

sql = open(P + 'base_de_dados/cha.sql', encoding='utf-8').read()
cidades = {int(t[0]): t for t in tuplos(sql, 'cidades')}
unidades = {int(t[0]): t for t in tuplos(sql, 'unidades')}
licoes = {int(t[0]): t for t in tuplos(sql, 'licoes')}
palavras = tuplos(sql, 'palavras')
cultura = tuplos(sql, 'cultura')
print(len(cidades), len(unidades), len(licoes), len(palavras), len(cultura))

licoes_out = []
for lid in sorted(licoes):
    l = licoes[lid]; u = unidades[int(l[1])]; c = cidades[int(u[1])]
    ps = [{'zh': p[1], 'py': p[2], 'pt': p[3]} for p in palavras if int(p[0]) == lid]
    licoes_out.append({'id': lid, 'cidade': c[2], 'cidade_zh': c[3], 'unidade': u[2] + ' ' + u[3], 'titulo': l[3], 'palavras': ps})
cultura_out = [{'cidade': cidades[int(t[0])][2], 'zh': t[1], 'py': t[2], 'pt': t[3]} for t in cultura]

# Vocabulário do Praticar (js/palavras.js)
js = open(P + 'mandarin_project/js/palavras.js', encoding='utf-8').read()
bloco = js[js.index('const VOCABULARIO'):]
bloco = bloco[:bloco.index('\n};') ]
pratica = []
tema = None
for linha in bloco.split('\n'):
    m = re.match(r"\s*(\w+): \[", linha)
    if m: tema = m.group(1)
    m = re.search(r"zh: '([^']*)', py: '([^']*)', pt: '([^']*)'", linha)
    if m: pratica.append({'tema': tema, 'zh': m.group(1), 'py': m.group(2), 'pt': m.group(3)})

# Páginas de conteúdo
NOMES = {'sons.php': 'Sons', 'basico.php': 'Básico', 'gramatica.php': 'Gramática', 'vocabulario.php': 'Vocabulário',
         'caracteres.php': 'Caracteres', 'cultura.php': 'Cultura', 'praticar.php': 'Praticar', 'introducao.php': 'Introdução',
         'index.php': 'Início', 'biblioteca.php': 'Biblioteca', '404.php': 'Página 404', 'rota.php': 'A rota'}
limpa = lambda t: html.unescape(re.sub(r'<[^>]+>', '', t)).strip()
paginas = []
for f, nome in NOMES.items():
    t = open(P + 'mandarin_project/' + f, encoding='utf-8').read()
    achadas = []
    for m in re.finditer(r'<div class="zh">(.*?)</div>\s*<div class="pinyin">(.*?)</div>\s*<div class="en">(.*?)</div>', t, re.S):
        achadas.append((m.group(1), m.group(2), m.group(3)))
    for m in re.finditer(r'<td class="zh-cell">([^<]*)</td>\s*<td class="py-cell">([^<]*)</td>\s*<td[^>]*>((?:(?!</td>).)*)</td>', t):
        achadas.append((m.group(1), m.group(2), m.group(3)))
    for m in re.finditer(r'<td class="zh-cell">([^<]*)</td>\s*<td class="zh-cell zh-cell--tradicional">([^<]*)</td>\s*<td class="py-cell">([^<]*)</td>\s*<td>([^<]*)</td>', t):
        achadas.append((m.group(1) + ' (' + m.group(2) + ')', m.group(3), m.group(4)))
    for m in re.finditer(r"cabeca_pagina\('([^']*)', '([^']*)', '([^']*)'", t):
        achadas.append((m.group(2), m.group(3), m.group(1)))
    for m in re.finditer(r'<h2>([^<]*)<span class="zh">([^<]*)</span>\s*<span class="section-header__py">([^<]*)</span>\s*</h2>', t):
        achadas.append((m.group(2), m.group(3), m.group(1)))
    for m in re.finditer(r'<div class="zh">([^<]*)</div>\s*<div>([^<=]*)=\s*([^<]*)</div>', t):
        achadas.append((m.group(1), m.group(2), m.group(3)))
    for m in ([] if f != 'caracteres.php' else re.finditer(r'([一-鿿]{1,4}) \(([a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü ]+)\),? ([a-zà-úçãõâêô][a-zà-úçãõâêô ]{1,25})', limpa(t))):
        achadas.append((m.group(1), m.group(2), m.group(3)))
    vistas = set(); lista = []
    for zh, py, pt in achadas:
        zh, py, pt = limpa(zh), limpa(py), limpa(pt).rstrip(' .,;:')
        if not ZH.search(zh) or (zh, py) in vistas: continue
        vistas.add((zh, py)); lista.append({'zh': zh, 'py': py, 'pt': pt})
    paginas.append({'pagina': nome, 'palavras': lista})
    print(nome, len(lista))

json.dump({'licoes': licoes_out, 'cultura': cultura_out, 'pratica': pratica, 'paginas': paginas}, open('palavras.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('pratica', len(pratica))
