"""Gera as ilustrações SH2 (secretária de escritório) e SH3 (currículo 简历) em SVG, com o texto em caminhos.

Assim o SVG não depende de nenhuma fonte instalada. As duas fontes têm licença SIL OFL.

Uso:
    pip install fonttools brotli
    python ferramentas/gerar_sh23.py <pasta-das-fontes> mandarin_project/img/fotos

A pasta das fontes é a mesma do gerar_gl2.py:
    lxgwwenkai-bold-subset-*.woff2   LXGW WenKai Bold (pacote npm lxgw-wenkai-webfont@1.7.0, pasta files/)
    lexend-latin.woff2               Lexend SemiBold (pacote npm @fontsource/lexend@5)
"""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
import sys, os, glob
OUT = os.path.abspath(sys.argv[2])
os.chdir(sys.argv[1])
FONTS = [TTFont(f) for f in sorted(glob.glob('lxgwwenkai-bold-subset-*.woff2'))] + [TTFont('lexend-latin.woff2')]

def glyph(ch):
    for f in FONTS:
        name = f.getBestCmap().get(ord(ch))
        if name:
            gs = f.getGlyphSet(); pen = SVGPathPen(gs); gs[name].draw(pen)
            return pen.getCommands(), gs[name].width
    raise KeyError(ch)

def text(s, x, baseline, size, fill, centro=False):
    # Cada letra passa a ser um <path>; com centro=True o texto fica centrado em x
    parts, w = [], 0
    for ch in s:
        if ch == ' ':
            w += 300; continue
        d, adv = glyph(ch); parts.append((d, w)); w += adv
    k = size / 1000
    if centro: x -= w * k / 2
    return ''.join(f'<path transform="translate({x + off*k:.2f} {baseline:.2f}) scale({k:.4f} {-k:.4f})" d="{d}" fill="{fill}"/>' for d, off in parts)

TEMAS = {
  'claro':  dict(wall='#F4F7F6', low='#E3ECE9', wood='#E9D8B8', wood2='#D8C29C', ink='#18212B', grey='#8A969F',
                 paper='#FFFFFF', line='#DCE4E1', jade='#0E7C66', seal='#E0442E', gold='#E8A317', sky='#DCEFF0', city='#9FB8B2', screen='#FFFFFF'),
  'escuro': dict(wall='#0F1519', low='#141D22', wood='#6B5A43', wood2='#58493A', ink='#E6ECEA', grey='#8A969F',
                 paper='#1B262D', line='#2A3940', jade='#12957B', seal='#C8361F', gold='#E8A317', sky='#1E3A40', city='#2F4B52', screen='#1B262D'),
}

def svg(titulo, corpo):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><title>{titulo}</title>{corpo}</svg>')

for tema, c in TEMAS.items():
    # ---------- SH2: secretária com o e-mail, o post-it e o calendário ----------
    g = [f'<rect width="1200" height="800" fill="{c["wall"]}"/>']
    # Janela com a silhueta de Xangai (a Torre Pérola do Oriente)
    g.append(f'<rect x="820" y="90" width="300" height="300" rx="10" fill="{c["sky"]}" stroke="{c["wood2"]}" stroke-width="10"/>')
    g.append(f'<path d="M830 380V300H870V270H900V380ZM910 380V230H950V380ZM960 380V330H990V380ZM1030 380V250H1060V380ZM1070 380V310H1110V380Z" fill="{c["city"]}"/>')
    g.append(f'<path d="M1000 380V200M1000 150V120" stroke="{c["city"]}" stroke-width="6"/><circle cx="1000" cy="175" r="22" fill="{c["city"]}"/><circle cx="1000" cy="290" r="14" fill="{c["city"]}"/><path d="M994 380V296H1006V380Z" fill="{c["city"]}"/>')
    g.append(f'<path d="M970 90V390M820 240H1120" stroke="{c["wood2"]}" stroke-width="6"/>')
    # Calendário na parede: setembro (九月) com a reunião (开会) marcada
    g.append(f'<rect x="570" y="60" width="200" height="210" rx="10" fill="{c["paper"]}" stroke="{c["line"]}" stroke-width="3"/>')
    g.append(f'<rect x="570" y="60" width="200" height="50" rx="10" fill="{c["seal"]}"/><rect x="570" y="95" width="200" height="15" fill="{c["seal"]}"/>')
    g.append(text('九月', 670, 98, 34, '#FFFFFF', True))
    for i in range(4):
        for j in range(5):
            g.append(f'<rect x="{588 + j*34}" y="{124 + i*34}" width="26" height="26" rx="4" fill="{c["line"]}"/>')
    g.append(f'<circle cx="703" cy="171" r="20" fill="none" stroke="{c["seal"]}" stroke-width="4"/>')
    g.append(text('开会', 670, 262, 26, c['seal'], True))
    # Monitor com o e-mail (邮件) do diretor Wang (王经理)
    g.append(f'<rect x="170" y="140" width="380" height="290" rx="14" fill="{c["ink"]}"/>')
    g.append(f'<rect x="184" y="154" width="352" height="262" rx="6" fill="{c["screen"]}"/>')
    g.append(f'<rect x="184" y="154" width="352" height="48" rx="6" fill="{c["jade"]}"/><rect x="184" y="190" width="352" height="12" fill="{c["jade"]}"/>')
    g.append(text('邮件', 206, 188, 30, '#FFFFFF'))
    g.append(f'<circle cx="222" cy="240" r="18" fill="{c["gold"]}"/>')
    g.append(text('王经理', 252, 250, 30, c['ink']))
    g.append(text('明天上午十点开会', 206, 305, 32, c['ink']))
    for k, w in enumerate([300, 260, 280]):
        g.append(f'<rect x="206" y="{330 + k*24}" width="{w}" height="10" rx="5" fill="{c["line"]}"/>')
    g.append(f'<path d="M335 430L320 520H400L385 430Z" fill="{c["ink"]}"/>')
    # Post-it amarelo no canto do monitor: 星期五以前 (antes de sexta-feira)
    g.append(f'<g transform="rotate(6 545 385)"><rect x="470" y="330" width="150" height="110" fill="#F6D365"/>'
             f'{text("星期五", 545, 377, 30, "#18212B", True)}{text("以前！", 545, 420, 30, "#18212B", True)}</g>')
    # Secretária com o telemóvel, a chávena de chá e a planta
    g.append(f'<rect y="620" width="1200" height="180" fill="{c["low"]}"/>')
    g.append(f'<rect x="80" y="518" width="1040" height="34" rx="8" fill="{c["wood"]}"/>')
    g.append(f'<rect x="120" y="552" width="30" height="210" fill="{c["wood2"]}"/><rect x="1050" y="552" width="30" height="210" fill="{c["wood2"]}"/>')
    g.append(f'<rect x="250" y="490" width="220" height="28" rx="6" fill="{c["grey"]}"/>')
    g.append(f'<rect x="560" y="492" width="44" height="26" rx="6" fill="{c["ink"]}"/>')
    g.append(f'<path d="M700 450H770V505C770 515 762 518 735 518C708 518 700 515 700 505Z" fill="{c["paper"]}" stroke="{c["line"]}" stroke-width="3"/><path d="M770 465C795 465 795 495 770 495" fill="none" stroke="{c["line"]}" stroke-width="6"/>')
    g.append(text('茶', 735, 500, 34, c['jade'], True))
    g.append(f'<rect x="900" y="470" width="56" height="48" rx="8" fill="{c["seal"]}"/>')
    g.append(f'<path d="M928 472C908 436 904 408 918 386M928 472C934 428 948 402 970 390M928 472C924 440 928 414 940 396" stroke="{c["jade"]}" stroke-width="8" stroke-linecap="round" fill="none"/>')
    open(OUT + f'/sh2-escritorio-{tema}.svg', 'w').write(svg('Secretária de escritório com um e-mail (邮件) do 王经理, um post-it 星期五以前 e um calendário com 开会', ''.join(g)))

    # ---------- SH3: currículo (简历) em cima da mesa ----------
    g = [f'<rect width="1200" height="800" fill="{c["wood"]}"/>']
    g.append(f'<path d="M0 160H1200M0 420H1200M0 660H1200" stroke="{c["wood2"]}" stroke-width="3" opacity=".6"/>')
    g.append(f'<g transform="rotate(-4 520 420)">')
    g.append(f'<rect x="250" y="40" width="540" height="740" rx="8" fill="{c["paper"]}" stroke="{c["line"]}" stroke-width="3"/>')
    g.append(text('简历', 520, 140, 72, c['ink'], True))
    g.append(f'<rect x="300" y="170" width="440" height="6" rx="3" fill="{c["jade"]}"/>')
    # Moldura da fotografia só com uma silhueta (sem rosto)
    g.append(f'<rect x="610" y="205" width="120" height="150" rx="8" fill="{c["line"]}"/><circle cx="670" cy="262" r="30" fill="{c["grey"]}"/><path d="M620 355C624 312 716 312 720 355Z" fill="{c["grey"]}"/>')
    campos = [('姓名：', '玛丽亚'), ('专业：', '计算机'), ('经验：', '两年'), ('语言：', '葡萄牙语')]
    for i, (k, v) in enumerate(campos):
        y = 245 + i * 62
        g.append(text(k, 300, y, 34, c['jade'])); g.append(text(v, 400, y, 34, c['ink']))
    g.append(text('英语  中文', 400, 492, 34, c['ink']))
    for k, w in enumerate([420, 380, 400, 300]):
        g.append(f'<rect x="300" y="{540 + k*36}" width="{w}" height="12" rx="6" fill="{c["line"]}"/>')
    g.append('</g>')
    # Cartão de marcação da entrevista: 面试 10:00
    g.append(f'<g transform="rotate(5 950 250)"><rect x="850" y="170" width="220" height="150" rx="10" fill="#F6D365"/>'
             f'{text("面试", 960, 235, 50, "#18212B", True)}{text("10:00", 960, 292, 40, "#C8361F", True)}</g>')
    # Caneta e chávena de chá
    g.append(f'<g transform="rotate(-30 900 560)"><rect x="820" y="545" width="220" height="22" rx="11" fill="{c["jade"]}"/><path d="M1040 545L1075 556L1040 567Z" fill="{c["ink"]}"/><rect x="840" y="545" width="12" height="22" fill="{c["gold"]}"/></g>')
    g.append(f'<circle cx="160" cy="620" r="90" fill="{c["paper"]}" stroke="{c["line"]}" stroke-width="4"/><circle cx="160" cy="620" r="62" fill="#B5854B"/>')
    open(OUT + f'/sh3-curriculo-{tema}.svg', 'w').write(svg('Currículo (简历) em chinês com 姓名, 专业：计算机, 语言：葡萄牙语 英语 中文 e um cartão 面试 10:00', ''.join(g)))
