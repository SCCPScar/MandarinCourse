# Ferramentas

Scripts que usei uma vez, no meu computador, para preparar ficheiros do site. O site não precisa deles para funcionar.

| Ficheiro | O que faz |
|---|---|
| `gerar_icones.sh` | Lê os ícones Lucide (licença ISC) e escreve o `css/icones.css`, com cada ícone como uma variável CSS |
| `gerar_bj1.py`, `gerar_gl2.py`, `gerar_sh23.py` | Desenham as ilustrações próprias de algumas unidades em SVG, com o texto chinês transformado em formas (assim o SVG não depende de fontes instaladas) |

Os scripts Python precisam do Python 3 e da biblioteca `fonttools` (`pip install fonttools brotli`).
