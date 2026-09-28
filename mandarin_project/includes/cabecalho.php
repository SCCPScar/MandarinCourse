<?php
// cabecalho.php
// Aqui eu escrevo o início de cada página da conta (head + barra de topo).
// Antes do include, a página define $titulo.
?>
<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= e($titulo) ?> · Chá</title>
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/transitions.css">
  <link rel="stylesheet" href="css/conta.css">
</head>
<body>
<header class="conta-topo">
  <a href="index.html" class="conta-logo" aria-label="Chá, voltar ao início">茶</a>
  <a href="index.html" class="conta-voltar">← Voltar ao curso</a>
</header>
<main class="page conta">
