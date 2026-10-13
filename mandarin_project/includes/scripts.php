<?php
// scripts.php
// Aqui eu carrego o JavaScript do site, um ficheiro por tema.
// A ordem importa: os primeiros têm as funções que os outros usam.
?>
<script src="<?= versao('js/base.js') ?>"></script>        <!-- guardar no browser, escapar texto, separadores -->
<script src="<?= versao('js/pagina.js') ?>"></script>      <!-- aoAbrirPagina() e aoSairDaPagina() -->
<script src="<?= versao('js/interface.js') ?>"></script>   <!-- avisos, barra de leitura, atalhos -->
<script src="<?= versao('js/tema.js') ?>"></script>        <!-- modo escuro -->
<script src="<?= versao('js/ouvir.js') ?>"></script>       <!-- voz e botões Ouvir / Devagar -->
<script src="<?= versao('js/palavras.js') ?>"></script>    <!-- as 114 palavras e o progresso -->
<script src="<?= versao('js/estudo.js') ?>"></script>      <!-- dias seguidos e temporizador -->
<script src="<?= versao('js/cartoes.js') ?>"></script>     <!-- cartões de memória e revisão espaçada -->
<script src="<?= versao('js/conquistas.js') ?>"></script>  <!-- medalhas, boas-vindas, sessão de hoje -->
<script src="<?= versao('js/construtor.js') ?>"></script>  <!-- construtor de frases -->
<script src="<?= versao('js/quiz.js') ?>"></script>        <!-- quiz rápido -->
<script src="<?= versao('js/jogo.js') ?>"></script>        <!-- jogo de caracteres -->
<script src="<?= versao('js/caderno.js') ?>"></script>     <!-- dicionário e caderno -->
<script src="<?= versao('js/hanzi.js') ?>"></script>       <!-- ordem dos traços -->
<script src="<?= versao('js/pronuncia.js') ?>"></script>   <!-- treino de pronúncia -->
<script src="<?= versao('js/licao.js') ?>"></script>       <!-- exercício das lições -->
<script src="<?= versao('js/navegacao.js') ?>"></script>   <!-- barra de navegação -->
