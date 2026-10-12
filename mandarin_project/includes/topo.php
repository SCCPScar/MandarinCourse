<?php
// topo.php
// Aqui eu escrevo o início de todas as páginas do curso: o <head>, a navegação e a abertura do <main>.
// Assim a navegação existe num só ficheiro: se eu a mudar aqui, muda em todas as páginas.
//
// Antes de incluir este ficheiro, cada página define:
//   $titulo     → o texto do separador do browser
//   $pagina     → o nome curto da página (vai para data-page, que o CSS e o JavaScript usam)
//   $css_extra  → (opcional) os CSS só dessa página, sem ".css", por exemplo ['inicio']
//   $usa_hanzi  → (opcional) true se a página anima traços de caracteres com o Hanzi Writer
?>
<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= e($titulo) ?> · Chá</title>

  <!-- Ícone do separador: o carimbo 茶 -->
  <link rel="icon" href="img/logo-cha.svg" type="image/svg+xml">

  <!-- Fontes da marca, guardadas no próprio site -->
  <link rel="stylesheet" href="css/fontes.css">

  <!-- CSS comum a todas as páginas -->
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/icones.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/dark.css">
  <link rel="stylesheet" href="css/nav.css">
  <link rel="stylesheet" href="css/transitions.css">
  <?php foreach ($css_extra ?? [] as $css): ?>
  <link rel="stylesheet" href="css/<?= e($css) ?>.css">
  <?php endforeach; ?>

  <?php if (!empty($usa_hanzi)): ?>
  <!-- Hanzi Writer: anima a ordem dos traços dos caracteres -->
  <script src="https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js"></script>
  <?php endif; ?>
</head>
<body>
<?php require __DIR__ . '/navegacao.php'; ?>

<main class="page" data-page="<?= e($pagina) ?>">
