"""Gera a ilustração BJ1 (caderno 田字格) em SVG, com o texto convertido em caminhos.

Assim o SVG não depende de nenhuma fonte instalada. As duas fontes têm licença SIL OFL.

Uso:
    pip install fonttools brotli
    python ferramentas/gerar_bj1.py <pasta-das-fontes> mandarin_project/img/fotos

A pasta das fontes precisa ter:
    wk0.woff2, wk1.woff2   LXGW WenKai Bold, subconjuntos 118 e 119 do pacote npm
                           lxgw-wenkai-webfont@1.7.0 (files/lxgwwenkai-bold-subset-11{8,9}.woff2)
    lexend-latin.woff2, lexend-latin-ext.woff2
                           Lexend SemiBold do pacote npm @fontsource/lexend@5
                           (files/lexend-{latin,latin-ext}-600-normal.woff2)
"""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
import sys, os
OUT = os.path.abspath(sys.argv[2])
os.chdir(sys.argv[1])
HZ = [TTFont('wk0.woff2'), TTFont('wk1.woff2')]           # LXGW WenKai Bold (OFL)
PY = [TTFont('lexend-latin.woff2'), TTFont('lexend-latin-ext.woff2')]  # Lexend SemiBold (OFL)

def glyph(fonts, ch):
    for f in fonts:
        name = f.getBestCmap().get(ord(ch))
        if name:
            gs = f.getGlyphSet(); pen = SVGPathPen(gs); gs[name].draw(pen)
            return pen.getCommands(), gs[name].width
    raise KeyError(ch)

def text(fonts, s, cx, baseline, size, fill, opacity=1):
    parts, w = [], 0
    for ch in s:
        d, adv = glyph(fonts, ch); parts.append((d, w)); w += adv
    k = size / 1000; x = cx - w * k / 2
    op = f' opacity="{opacity}"' if opacity < 1 else ''
    return ''.join(f'<path transform="translate({x + off*k:.2f} {baseline:.2f}) scale({k:.4f} {-k:.4f})" d="{d}" fill="{fill}"{op}/>' for d, off in parts)

THEMES = {
  'claro':  dict(bg='#F7F5EF', paper='#FFFEFB', edge='#E6E2D8', cell='#FFFFFF', grid='#7FBFAE', ink='#18212B',
                 t1='#2F6FD0', t2='#2E9A48', t3='#B77C06'),
  'escuro': dict(bg='#0F1519', paper='#172026', edge='#24323A', cell='#1B262D', grid='#2F7F6C', ink='#E6ECEA',
                 t1='#6FA2F0', t2='#5CC878', t3='#E4AE3A'),
}
S, X0, Y1 = 170, 260, 170; Y2 = Y1 + S + 70
for tema, c in THEMES.items():
    chars = [('你', 'nǐ', c['t3']), ('好', 'hǎo', c['t3']), ('中', 'zhōng', c['t1']), ('文', 'wén', c['t2'])]
    def cell(x, y):
        return (f'<rect x="{x}" y="{y}" width="{S}" height="{S}" fill="{c["cell"]}" stroke="{c["grid"]}" stroke-width="2.5"/>'
                f'<path d="M{x} {y+S/2}H{x+S}M{x+S/2} {y}V{y+S}" stroke="{c["grid"]}" stroke-width="1.5" stroke-dasharray="7 6"/>')
    g = []
    for i, (hz, py, col) in enumerate(chars):
        x = X0 + i * S
        g.append(cell(x, Y1))
        g.append(text(PY, py, x + S/2, Y1 - 22, 40, col))
        g.append(text(HZ, hz, x + S/2, Y1 + S/2 + 0.36*118, 118, c['ink']))
    for i, (op_cell, op_hz) in enumerate([(1, .28), (.8, .16), (.55, .08), (.3, 0)]):
        x = X0 + i * S
        g.append(f'<g opacity="{op_cell}">{cell(x, Y2)}</g>')
        if op_hz: g.append(text(HZ, '你', x + S/2, Y2 + S/2 + 0.36*118, 118, c['ink'], op_hz))
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">'
           f'<title>Caderno 田字格 com 你好中文 e o pinyin colorido pelos tons</title>'
           f'<rect width="1200" height="800" fill="{c["bg"]}"/>'
           f'<g transform="rotate(-3 600 450)"><rect x="190" y="70" width="820" height="980" rx="10" fill="{c["paper"]}" stroke="{c["edge"]}" stroke-width="2"/>'
           f'{"".join(g)}</g></svg>')
    open(OUT + f'/bj1-pinyin-tons-{tema}.svg', 'w').write(svg)
