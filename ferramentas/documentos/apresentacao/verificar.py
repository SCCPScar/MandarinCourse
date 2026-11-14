# verificar.py: procura problemas de paginação na apresentação, sem depender do programa que a abre.
# Para cada caixa de texto, calcula quanto espaço o texto precisa com as medidas reais da letra
# (Carlito tem exatamente as mesmas medidas da Calibri) e avisa quando:
#   - o texto não cabe na caixa (ia passar por cima do que está por baixo);
#   - uma caixa de texto se sobrepõe a outra caixa de texto ou a uma imagem;
#   - alguma coisa sai do diapositivo ou fica colada à borda.
# Uso: python3 verificar.py "Apresentação - Chá.pptx"
import sys
from pptx import Presentation
from pptx.util import Emu
from PIL import ImageFont

POL = 914400  # EMU numa polegada
FONTES = {
    (False, False): '/usr/share/fonts/truetype/crosextra/Carlito-Regular.ttf',
    (True, False): '/usr/share/fonts/truetype/crosextra/Carlito-Bold.ttf',
    (False, True): '/usr/share/fonts/truetype/crosextra/Carlito-Italic.ttf',
    (True, True): '/usr/share/fonts/truetype/crosextra/Carlito-BoldItalic.ttf',
}
_cache = {}


def fonte(negrito, italico, tamanho):
    chave = (negrito, italico, round(tamanho * 4))
    if chave not in _cache:
        _cache[chave] = ImageFont.truetype(FONTES[(negrito, italico)], int(tamanho * 4))  # medido a 4x para ter precisão
    return _cache[chave]


def largura(texto, negrito, italico, tamanho):
    # em pontos
    return fonte(negrito, italico, tamanho).getlength(texto) / 4


def linhas_necessarias(partes, largura_caixa):
    """partes: lista de (texto, negrito, italico, tamanho). Devolve (n.º de linhas, maior tamanho)."""
    linhas, atual, maior = 1, 0.0, max((p[3] for p in partes), default=18)
    for texto, neg, ita, tam in partes:
        for i, palavra in enumerate(texto.split(' ')):
            w = largura(palavra + ' ', neg, ita, tam)
            if atual + largura(palavra, neg, ita, tam) > largura_caixa and atual > 0:
                linhas += 1
                atual = w
            else:
                atual += w
    return linhas, maior


def main(caminho):
    p = Presentation(caminho)
    W, H = p.slide_width / POL, p.slide_height / POL
    problemas = 0
    for n, slide in enumerate(p.slides, 1):
        caixas = []  # (nome, x, y, w, h, tipo)
        for sh in slide.shapes:
            if sh.left is None:
                continue
            x, y, w, h = sh.left / POL, sh.top / POL, sh.width / POL, sh.height / POL
            if x < 0.3 or y < 0.2 or x + w > W - 0.3 or y + h > H - 0.2:
                print(f'Diapositivo {n}: «{sh.name}» sai do diapositivo ou fica colado à borda ({x:.2f}, {y:.2f}, {w:.2f} x {h:.2f})')
                problemas += 1
            if sh.shape_type == 13:  # imagem
                caixas.append((sh.name, x, y, w, h, 'imagem'))
            if not sh.has_text_frame or not sh.text_frame.text.strip():
                continue
            tf = sh.text_frame
            margem_h = ((tf.margin_left or 0) + (tf.margin_right or 0)) / POL
            margem_v = ((tf.margin_top or 0) + (tf.margin_bottom or 0)) / POL
            largura_util = (w - margem_h) * 72
            altura = 0.0
            for par in tf.paragraphs:
                partes = []
                for r in par.runs:
                    tam = r.font.size.pt if r.font.size else (par.font.size.pt if par.font.size else (36 if sh.is_placeholder else 18))
                    if any('一' <= c <= '鿿' for c in r.text):
                        tam *= 1.15  # os caracteres chineses usam outra letra, mais alta e mais larga
                    partes.append((r.text, bool(r.font.bold), bool(r.font.italic), tam))
                if not partes:
                    continue
                tem_marca = par._p.pPr is not None and par._p.pPr.find('{http://schemas.openxmlformats.org/drawingml/2006/main}buChar') is not None
                nl, maior = linhas_necessarias(partes, largura_util - (20 if tem_marca else 0))
                depois = par.space_after.pt if par.space_after is not None else 0
                altura += nl * maior * 1.2 + depois
            precisa = altura / 72 + margem_v
            if precisa > h + 0.02:
                print(f'Diapositivo {n}: o texto «{tf.text[:45]}...» precisa de {precisa:.2f} pol. e a caixa tem {h:.2f}')
                problemas += 1
            caixas.append((tf.text[:30], x, y, w, max(h, precisa), 'texto'))
        # sobreposições entre caixas de texto, e entre texto e imagens
        for i in range(len(caixas)):
            for j in range(i + 1, len(caixas)):
                a, b = caixas[i], caixas[j]
                if a[5] == 'imagem' and b[5] == 'imagem':
                    continue
                sx = min(a[1] + a[3], b[1] + b[3]) - max(a[1], b[1])
                sy = min(a[2] + a[4], b[2] + b[4]) - max(a[2], b[2])
                if sx > 0.05 and sy > 0.05:
                    print(f'Diapositivo {n}: «{a[0]}» sobrepõe-se a «{b[0]}»')
                    problemas += 1
    print(f'{problemas} problema(s) encontrados em {len(p.slides)} diapositivos')
    return problemas


if __name__ == '__main__':
    sys.exit(1 if main(sys.argv[1]) else 0)
