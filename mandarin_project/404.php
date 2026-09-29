<?php
// 404.php
// Aqui eu mostro a página "não encontrada", quando alguém abre um endereço que não existe.
// O Apache chama este ficheiro por causa da linha ErrorDocument do .htaccess.

require 'includes/sessao.php';

// Eu digo ao browser (e ao Google) que a página não existe: código 404
http_response_code(404);

// O endereço pedido pode estar numa pasta que não existe (ex.: /cha/abc/def).
// Com a tag <base>, os caminhos css/... e img/... passam a contar a partir da pasta do site.
$pasta = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\') . '/';
?>
<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="<?= e($pasta) ?>">
  <title>Página não encontrada · Chá</title>
  <link rel="icon" href="img/logo-cha.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/fontes.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/erro.css">
</head>
<body>
<main class="erro">
  <a href="index.php" class="erro__logo" aria-label="Chá, página inicial"><img src="img/logo-cha.svg" alt="" width="56" height="56"></a>

  <p class="erro__codigo">404</p>
  <p class="erro__zh" lang="zh-CN">我迷路了</p>
  <p class="erro__py">wǒ mílù le · «perdi-me»</p>

  <h1>Esta página não existe</h1>
  <p>O endereço pode estar mal escrito, ou a página mudou de sítio. Aproveita e aprende uma frase: quando te perderes na China, diz <strong lang="zh-CN">我迷路了</strong>. Vais encontrá-la na lição <a href="licao.php?id=48">«Perdi as minhas coisas»</a>, da unidade 4.4.</p>

  <div class="erro__botoes">
    <a class="botao-cha" href="index.php">Voltar ao início</a>
    <a class="botao-cha erro__botao-claro" href="index.php#rota">Ver a rota</a>
  </div>
</main>
</body>
</html>
