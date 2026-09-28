"""Gera a ilustração GL2 (receção de hotel em Guilin) em SVG, com o texto convertido em caminhos.

Assim o SVG não depende de nenhuma fonte instalada. As duas fontes têm licença SIL OFL.

Uso:
    pip install fonttools brotli
    python ferramentas/gerar_gl2.py <pasta-das-fontes> mandarin_project/img/fotos

A pasta das fontes precisa ter:
    lxgwwenkai-bold-subset-*.woff2   LXGW WenKai Bold, pasta files/ do pacote npm lxgw-wenkai-webfont@1.7.0
                                     (o script procura sozinho o subconjunto de cada caractere)
    lexend-latin.woff2               Lexend SemiBold do pacote npm @fontsource/lexend@5
                                     (files/lexend-latin-600-normal.woff2)
"""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
import sys, os, glob
OUT = os.path.abspath(sys.argv[2])
os.chdir(sys.argv[1])
HZ = [TTFont(f) for f in sorted(glob.glob('lxgwwenkai-bold-subset-*.woff2'))]  # LXGW WenKai Bold (OFL)
NUM = [TTFont('lexend-latin.woff2')]                                           # Lexend SemiBold (OFL)

def glyph(fonts, ch):
    for f in fonts:
        name = f.getBestCmap().get(ord(ch))
        if name:
            gs = f.getGlyphSet(); pen = SVGPathPen(gs); gs[name].draw(pen)
            return pen.getCommands(), gs[name].width
    raise KeyError(ch)

def text(fonts, s, cx, baseline, size, fill):
    # Centra o texto em cx; cada letra passa a ser um <path>
    parts, w = [], 0
    for ch in s:
        d, adv = glyph(fonts, ch); parts.append((d, w)); w += adv
    k = size / 1000; x = cx - w * k / 2
    return ''.join(f'<path transform="translate({x + off*k:.2f} {baseline:.2f}) scale({k:.4f} {-k:.4f})" d="{d}" fill="{fill}"/>' for d, off in parts)

THEMES = {
  'claro':  dict(wall='#F4F7F6', low='#E3ECE9', floor='#C9D6D2', seal='#E0442E', gold='#E8A317', ink='#18212B',
                 jade='#0E7C66', jade2='#0B6655', wood='#E9D8B8', card='#FFFFFF', sky='#DCEFF0', hill='#5FA890', hill2='#3E8C74'),
  'escuro': dict(wall='#0F1519', low='#141D22', floor='#1B262D', seal='#C8361F', gold='#E8A317', ink='#E6ECEA',
                 jade='#12957B', jade2='#0E7C66', wood='#6B5A43', card='#E6ECEA', sky='#1E3A40', hill='#2F7F6C', hill2='#246352'),
}
for tema, c in THEMES.items():
    g = []
    # Parede, rodapé e chão
    g.append(f'<rect width="1200" height="800" fill="{c["wall"]}"/>')
    g.append(f'<rect y="430" width="1200" height="330" fill="{c["low"]}"/>')
    g.append(f'<rect y="760" width="1200" height="40" fill="{c["floor"]}"/>')
    # Placa com o nome do hotel: 桂林酒店 (Hotel Guilin) e, por baixo, 欢迎光临 (bem-vindo)
    g.append(f'<rect x="370" y="60" width="460" height="130" rx="14" fill="{c["seal"]}"/>')
    g.append(f'<rect x="384" y="74" width="432" height="102" rx="8" fill="none" stroke="{c["gold"]}" stroke-width="3"/>')
    g.append(text(HZ, '桂林酒店', 600, 158, 78, c['gold']))
    g.append(text(HZ, '欢迎光临', 600, 250, 40, c['ink']))
    # Quadro com os montes de Guilin e o rio
    g.append(f'<rect x="96" y="150" width="232" height="190" rx="6" fill="{c["wood"]}"/>')
    g.append(f'<rect x="112" y="166" width="200" height="158" fill="{c["sky"]}"/>')
    g.append(f'<path d="M112 324V270C140 270 150 196 170 196C190 196 196 262 214 262C230 262 240 214 258 214C276 214 286 290 312 286V324Z" fill="{c["hill"]}"/>')
    g.append(f'<path d="M112 324V296C150 296 176 250 196 250C214 250 222 300 244 300C262 300 280 268 312 272V324Z" fill="{c["hill2"]}"/>')
    g.append(f'<path d="M112 314H312" stroke="{c["sky"]}" stroke-width="6"/>')
    # Lanterna pendurada à direita
    g.append(f'<path d="M1000 0V120" stroke="{c["ink"]}" stroke-width="3"/>')
    g.append(f'<rect x="976" y="116" width="48" height="12" rx="3" fill="{c["gold"]}"/>')
    g.append(f'<ellipse cx="1000" cy="180" rx="62" ry="54" fill="{c["seal"]}"/>')
    g.append(f'<path d="M1000 126C974 150 974 210 1000 234M1000 126C1026 150 1026 210 1000 234" stroke="{c["gold"]}" stroke-width="3" fill="none"/>')
    g.append(f'<rect x="976" y="232" width="48" height="12" rx="3" fill="{c["gold"]}"/>')
    g.append(f'<path d="M1000 244V280" stroke="{c["gold"]}" stroke-width="4"/>')
    # Balcão da receção com a placa 前台 (receção)
    g.append(f'<rect x="170" y="470" width="860" height="290" fill="{c["jade"]}"/>')
    g.append(f'<path d="M170 560H1030M170 660H1030" stroke="{c["jade2"]}" stroke-width="4"/>')
    g.append(f'<rect x="150" y="440" width="900" height="36" rx="6" fill="{c["wood"]}"/>')
    g.append(f'<rect x="505" y="530" width="190" height="100" rx="10" fill="{c["wall"]}"/>')
    g.append(text(HZ, '前台', 600, 600, 62, c['ink']))
    # Em cima do balcão: cartão do quarto (房卡), campainha e planta
    g.append(f'<rect x="902" y="386" width="56" height="56" rx="8" fill="{c["seal"]}"/>')
    g.append(f'<path d="M930 388C910 350 906 322 920 300M930 388C936 344 950 318 972 306M930 388C926 356 930 330 942 312" stroke="{c["hill2"]}" stroke-width="8" stroke-linecap="round" fill="none"/>')
    g.append(f'<g transform="rotate(-8 330 408)"><rect x="240" y="372" width="180" height="64" rx="8" fill="{c["card"]}" stroke="{c["jade"]}" stroke-width="3"/>'
             f'<rect x="240" y="372" width="26" height="64" rx="4" fill="{c["jade"]}"/>'
             f'{text(HZ, "房卡", 318, 414, 30, "#18212B")}{text(NUM, "806", 385, 414, 24, "#0E7C66")}</g>')
    g.append(f'<rect x="770" y="430" width="100" height="12" rx="4" fill="{c["ink"]}"/>')
    g.append(f'<path d="M780 430C780 390 800 372 820 372C840 372 860 390 860 430Z" fill="{c["gold"]}"/>')
    g.append(f'<circle cx="820" cy="366" r="8" fill="{c["gold"]}"/>')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">'
           f'<title>Receção de hotel com a placa 前台, o nome 桂林酒店, um cartão de quarto e uma campainha</title>'
           f'{"".join(g)}</svg>')
    open(OUT + f'/gl2-ilustracao-{tema}.svg', 'w').write(svg)
