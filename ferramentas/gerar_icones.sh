#!/bin/bash
# Gera css/icones.css a partir dos SVG do Lucide. Uso: bash gerar_icones.sh <pasta-lucide> <ficheiro-saida>
# Antes de correr: descarregar os SVG do Lucide (https://cdn.jsdelivr.net/npm/lucide-static@0.469.0/icons/NOME.svg) para uma pasta.
# Exemplo: bash ferramentas/gerar_icones.sh pasta-com-os-svg mandarin_project/css/icones.css
L=$1; OUT=$2
ICONES="ouvir:volume-2 sem-som:volume-x devagar:turtle gravar:mic parar:square jogar:play pausa:pause hoje:calendar-days escuro:moon claro:sun conta:user dias:flame trofeu:trophy relogio:timer repetir:rotate-ccw procurar:search caderno:notebook-pen escrever:pencil certo:check errado:x ideia:lightbulb livro:book-open ouvidos:headphones jogo:gamepad-2 teclado:keyboard local:map-pin medalha:award seguinte:arrow-right anterior:arrow-left mapa:map imprimir:printer hsk:graduation-cap rota:route"
{
cat <<'CAB'
/*
 * icones.css
 * Aqui eu guardo os ícones do site. São do Lucide (lucide.dev), com licença livre ISC.
 *
 * Como funcionam: cada ícone é um desenho SVG usado como máscara (mask).
 * A máscara recorta um quadrado pintado com currentColor, que é a cor do texto à volta.
 * Por isso o ícone fica sempre da mesma cor do texto, também no modo escuro.
 *
 * Uso no HTML: <i class="i i-ouvir" aria-hidden="true"></i>
 * (aria-hidden porque o ícone é só decoração: o leitor de ecrã lê o texto do botão)
 */

.i {
  display: inline-block;
  width: 1.15em;
  height: 1.15em;
  vertical-align: -0.2em;
  flex-shrink: 0;
  background: currentColor;
  -webkit-mask: var(--icone) center / contain no-repeat;
  mask: var(--icone) center / contain no-repeat;
}

/* Um pequeno movimento quando o rato passa no botão, como no lucide-animated */
@media (prefers-reduced-motion: no-preference) {
  button:hover .i, a:hover .i, .pode-ouvir:hover .i { animation: icone-mexe 0.45s ease; }
}
@keyframes icone-mexe {
  0%, 100% { transform: none; }
  30% { transform: scale(1.15) rotate(-8deg); }
  60% { transform: scale(1.05) rotate(5deg); }
}

/* Os desenhos ficam em variáveis, para eu os poder usar também noutros CSS (ex.: ::after) */
:root {
CAB
for par in $ICONES; do n=${par%%:*}; f=${par#*:}
  svg=$(grep -v "^<!--" "$L/$f.svg" | tr '\n' ' ' | sed -E 's/ +/ /g; s/ class="[^"]*"//; s/"/'"'"'/g; s/#/%23/g; s/</%3C/g; s/>/%3E/g')
  echo "  --icone-$n: url(\"data:image/svg+xml,$svg\");"
done
echo "}"; echo; echo "/* Uma classe por ícone */"
for par in $ICONES; do n=${par%%:*}; echo ".i-$n { --icone: var(--icone-$n); }"; done
} > "$OUT"
