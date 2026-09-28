<?php
// cidade.php
// Aqui eu mostro uma cidade da rota: a capa, as 4 unidades e as lições de cada unidade.
// O endereço é cidade.php?id=1 (1 = Pequim, 2 = Xi'an…).

require 'includes/sessao.php';
require 'includes/ligacao.php';

// (int) garante que o id é um número, mesmo que alguém escreva outra coisa no endereço
$id = (int) ($_GET['id'] ?? 0);

$consulta = $pdo->prepare('SELECT * FROM cidades WHERE id = ?');
$consulta->execute([$id]);
$cidade = $consulta->fetch();

// Se a cidade não existe, eu volto para a página inicial
if (!$cidade) {
    header('Location: index.php');
    exit;
}

// As unidades desta cidade
$consulta = $pdo->prepare('SELECT * FROM unidades WHERE cidade_id = ? ORDER BY codigo');
$consulta->execute([$id]);
$unidades = $consulta->fetchAll();

// Todas as lições da cidade, com a indicação se o aluno já as fez (feita = 1 ou 0)
$consulta = $pdo->prepare('
    SELECT l.id, l.unidade_id, l.titulo, l.minutos,
           (p.licao_id IS NOT NULL) AS feita
    FROM licoes l
    JOIN unidades u ON u.id = l.unidade_id
    LEFT JOIN progresso p ON p.licao_id = l.id AND p.utilizador_id = ?
    WHERE u.cidade_id = ?
    ORDER BY l.unidade_id, l.ordem
');
$consulta->execute([id_utilizador(), $id]);

// Eu arrumo as lições por unidade: $licoes[id_da_unidade] = [lição, lição, …]
$licoes = [];
foreach ($consulta->fetchAll() as $licao) {
    $licoes[$licao['unidade_id']][] = $licao;
}
?>
<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= e($cidade['nome']) ?> · Chá</title>
  <link rel="icon" href="img/logo-cha.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/fontes.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/dark.css">
  <link rel="stylesheet" href="css/nav.css">
  <link rel="stylesheet" href="css/transitions.css">
  <link rel="stylesheet" href="css/cidade.css">
</head>
<body>
<?php require 'includes/navegacao.php'; ?>

<main class="page" data-page="cidade">

  <!-- CAPA DA CIDADE -->
  <header class="capa">
    <?php if ($cidade['capa']): ?>
      <picture>
        <source media="(max-width: 767.98px)" type="image/avif" srcset="img/fotos/<?= e($cidade['capa']) ?>-capa-mobile-780.avif">
        <source media="(max-width: 767.98px)" type="image/webp" srcset="img/fotos/<?= e($cidade['capa']) ?>-capa-mobile-780.webp">
        <source type="image/avif" srcset="img/fotos/<?= e($cidade['capa']) ?>-capa-desktop-1600.avif">
        <img class="capa__foto" src="img/fotos/<?= e($cidade['capa']) ?>-capa-desktop-1600.webp" alt="">
      </picture>
    <?php endif; ?>
    <div class="capa__texto">
      <p class="capa__meses">Cidade <?= (int) $cidade['ordem'] ?> de 6 · Meses <?= e($cidade['meses']) ?></p>
      <h1><?= e($cidade['nome']) ?> <span lang="zh-CN"><?= e($cidade['nome_zh']) ?></span></h1>
      <p><?= e($cidade['tema']) ?></p>
    </div>
  </header>

  <?php if (isset($_GET['feita'])): ?>
    <p class="aviso-feita" role="status">Lição concluída! As palavras novas já estão nas tuas revisões.</p>
  <?php endif; ?>

  <!-- AS 4 UNIDADES -->
  <section class="unidades">
    <?php foreach ($unidades as $unidade): ?>
      <article class="unidade">
        <?php if ($unidade['foto']): ?>
          <picture>
            <source type="image/avif" srcset="img/fotos/<?= e($unidade['foto']) ?>-800.avif">
            <img class="unidade__foto" src="img/fotos/<?= e($unidade['foto']) ?>-800.webp" alt="" loading="lazy">
          </picture>
        <?php endif; ?>

        <div class="unidade__texto">
          <p class="unidade__codigo">Unidade <?= e($unidade['codigo']) ?></p>
          <h2><?= e($unidade['titulo']) ?></h2>

          <?php if (empty($licoes[$unidade['id']])): ?>
            <p class="unidade__vazia">Lições em preparação.</p>
          <?php else: ?>
            <ol class="licoes">
              <?php foreach ($licoes[$unidade['id']] as $licao): ?>
                <li>
                  <a href="licao.php?id=<?= (int) $licao['id'] ?>" class="<?= $licao['feita'] ? 'feita' : '' ?>">
                    <span class="licoes__titulo"><?= e($licao['titulo']) ?></span>
                    <span class="licoes__estado"><?= $licao['feita'] ? '✓ Feita' : $licao['minutos'] . ' min' ?></span>
                  </a>
                </li>
              <?php endforeach; ?>
            </ol>
          <?php endif; ?>
        </div>
      </article>
    <?php endforeach; ?>
  </section>

  <p class="voltar"><a href="index.php#rota">← Voltar à rota</a></p>
</main>

<?php require 'includes/scripts.php'; ?>
</body>
</html>
