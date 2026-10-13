<?php
// funcoes.php
// Aqui eu junto as funções pequenas que várias páginas usam para escrever HTML.
// O sessao.php inclui este ficheiro, por isso estão disponíveis em todas as páginas.

// Os dois botões para ouvir o chinês: à velocidade normal e devagar.
// O texto a ler fica no data-falar; a função falar (js/data.js) usa a voz do browser.
// $rotulo é o que o leitor de ecrã diz, por exemplo o pinyin da palavra.
function botoes_ouvir($hanzi, $rotulo = '') {
    $falar  = e($hanzi);
    $rotulo = e($rotulo !== '' ? $rotulo : $hanzi);
    return '<span class="ouvir-par">'
         . '<button type="button" class="ouvir-btn" data-falar="' . $falar . '" onclick="falar(this.dataset.falar, VELOCIDADE_NORMAL)" aria-label="Ouvir ' . $rotulo . '">'
         . '<i class="i i-ouvir" aria-hidden="true"></i> Ouvir</button>'
         . '<button type="button" class="ouvir-btn ouvir-btn--devagar" data-falar="' . $falar . '" onclick="falar(this.dataset.falar, VELOCIDADE_DEVAGAR)" aria-label="Ouvir devagar ' . $rotulo . '">'
         . '<i class="i i-devagar" aria-hidden="true"></i> Devagar</button>'
         . '</span>';
}

// O cabeçalho colorido no topo de cada página: o título, o nome em chinês com pinyin e som,
// e uma frase a explicar o que há na página. $cor é uma das cores da marca (jade, selo, ouro, azul, ameixa).
function cabeca_pagina($titulo, $hanzi, $pinyin, $texto, $cor = 'jade') {
    return '<header class="cabeca-pagina cabeca-pagina--' . e($cor) . '">'
         . '<div class="cabeca-pagina__dentro">'
         . '<h1>' . e($titulo) . '</h1>'
         . '<p class="cabeca-pagina__zh"><span lang="zh-CN">' . e($hanzi) . '</span> <span class="cabeca-pagina__py">' . e($pinyin) . '</span> '
         . botoes_ouvir($hanzi, $pinyin) . '</p>'
         . '<p class="cabeca-pagina__texto">' . e($texto) . '</p>'
         . '</div></header>';
}

// Devolve o endereço de um CSS ou JS com a data do ficheiro no fim, por exemplo "css/base.css?v=1760300000".
// Quando eu mudo o ficheiro, a data muda e o endereço também: assim o browser é obrigado a ir buscar
// a versão nova, em vez de usar a cópia antiga que tinha guardada (cache busting).
function versao($caminho) {
    $ficheiro = __DIR__ . '/../' . $caminho;
    return $caminho . '?v=' . (is_file($ficheiro) ? filemtime($ficheiro) : '0');
}
