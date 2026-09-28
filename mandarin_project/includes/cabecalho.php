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
  <link rel="icon" href="img/logo-cha.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/fontes.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/transitions.css">
  <link rel="stylesheet" href="css/conta.css">
</head>
<body>
<header class="conta-topo">
  <a href="index.php" class="conta-logo" aria-label="Chá, voltar ao início"><img src="img/logo-cha.svg" alt="" width="36" height="36"></a>
  <a href="index.php" class="conta-voltar">← Voltar ao curso</a>
</header>
<main class="page conta">
