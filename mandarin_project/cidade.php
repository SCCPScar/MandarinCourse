<?php
// cidade.php
// Aqui eu mostro uma cidade da rota. O endereço é cidade.php?id=1 (1 = Pequim, 2 = Xi'an…).
// A página tem: a capa (com o nome em chinês, o pinyin e o som), o que a cidade tem de especial,
// o progresso do aluno, as 4 unidades (com a explicação de cada foto e as lições),
// a cultura da cidade e os botões para a cidade anterior e para a seguinte.

require 'includes/sessao.php';
require 'includes/ligacao.php';

// (int) garante que o id é um número, mesmo que alguém escreva outra coisa no endereço
$id = (int) ($_GET['id'] ?? 0);

$consulta = $pdo->prepare('SELECT * FROM cidades WHERE id = ?');
$consulta->execute([$id]);
$cidade = $consulta->fetch();

// Se a cidade não existe, eu volto para a página da rota
if (!$cidade) {
    header('Location: rota.php');
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

// Contas para a barra de progresso e para o botão «Começar» (a primeira lição que falta)
$todas = array_merge(...array_values($licoes ?: [[]]));
$total = count($todas);
$feitas = count(array_filter($todas, fn($l) => $l['feita']));
$percentagem = $total > 0 ? round($feitas / $total * 100) : 0;
$primeira_por_fazer = null;
foreach ($todas as $l) {
    if (!$l['feita']) { $primeira_por_fazer = $l; break; }
}

// A cultura desta cidade
$consulta = $pdo->prepare('SELECT * FROM cultura WHERE cidade_id = ? ORDER BY id');
$consulta->execute([$id]);
$cultura = $consulta->fetchAll();

// A cidade anterior e a seguinte na rota
$consulta = $pdo->prepare('SELECT id, nome, nome_zh FROM cidades WHERE ordem = ?');
$consulta->execute([$cidade['ordem'] - 1]);
$cidade_anterior = $consulta->fetch();
$consulta->execute([$cidade['ordem'] + 1]);
$cidade_seguinte = $consulta->fetch();

$titulo = $cidade['nome'];
$pagina = 'cidade';
$css_extra = ['cidade', 'rota'];
require 'includes/topo.php';
?>

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
      <p class="capa__meses">Cidade <?= (int) $cidade['ordem'] ?> de 6 · Meses <?= e($cidade['meses']) ?> · <?= e($cidade['hsk']) ?></p>
      <h1><?= e($cidade['nome']) ?> <span lang="zh-CN"><?= e($cidade['nome_zh']) ?></span></h1>
      <p class="capa__pinyin"><?= e($cidade['pinyin']) ?> <?= botoes_ouvir($cidade['nome_zh'], $cidade['pinyin']) ?></p>
      <p><?= e($cidade['tema']) ?></p>
    </div>
  </header>

  <!-- SOBRE A CIDADE -->
  <section class="sobre-cidade">
    <div class="sobre-cidade__texto">
      <h2>Porquê <?= e($cidade['nome']) ?>?</h2>
      <p><?= e($cidade['descricao']) ?></p>
      <p class="sobre-cidade__meta"><strong>No fim desta cidade já consegues</strong> <?= e($cidade['consegues']) ?></p>
    </div>

    <!-- Progresso nesta cidade: barra grande e o botão para a primeira lição que falta -->
    <div class="rota-geral sobre-cidade__progresso">
      <?php if (id_utilizador() !== null): ?>
        <p class="rota-geral__numeros"><strong><?= $feitas ?></strong> de <?= $total ?> lições feitas</p>
      <?php else: ?>
        <p class="rota-geral__numeros"><strong><?= $total ?></strong> lições nesta cidade</p>
      <?php endif; ?>
      <div class="progresso" role="progressbar" aria-valuenow="<?= $percentagem ?>" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso em <?= e($cidade['nome']) ?>">
        <div class="progresso__barra" style="width: <?= $percentagem ?>%"></div>
      </div>
      <p class="rota-geral__pct"><?= $percentagem ?>% desta cidade concluída</p>
      <?php if ($primeira_por_fazer): ?>
        <a class="botao-cha" href="licao.php?id=<?= (int) $primeira_por_fazer['id'] ?>"><?= $feitas ? 'Continuar' : 'Começar' ?>: <?= e($primeira_por_fazer['titulo']) ?></a>
      <?php endif; ?>
    </div>
  </section>

  <!-- AS 4 UNIDADES -->
  <section class="unidades">
    <?php foreach ($unidades as $unidade): ?>
      <article class="unidade">
        <?php if ($unidade['foto']): ?>
          <figure class="unidade__figura">
            <picture>
              <source type="image/avif" srcset="img/fotos/<?= e($unidade['foto']) ?>-800.avif">
              <img class="unidade__foto" src="img/fotos/<?= e($unidade['foto']) ?>-800.webp" alt="<?= e($unidade['legenda'] ?? '') ?>" loading="lazy">
            </picture>
            <?php if ($unidade['legenda']): ?>
              <!-- A legenda explica o que a foto mostra e o chinês que aparece nela -->
              <figcaption><?= e($unidade['legenda']) ?></figcaption>
            <?php endif; ?>
          </figure>
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

  <!-- A CULTURA DESTA CIDADE -->
  <?php if ($cultura): ?>
    <section class="cultura-secao">
      <h2>A cultura de <?= e($cidade['nome']) ?></h2>
      <p>Coisas que vais encontrar nesta cidade. Carrega em «Ouvir» para ouvires a palavra em chinês.</p>
      <ul class="cultura-lista">
        <?php foreach ($cultura as $item): ?>
          <li class="cultura-item">
            <div class="cultura-item__topo">
              <span class="cultura-item__zh" lang="zh-CN"><?= e($item['hanzi']) ?></span>
              <span class="cultura-item__py"><?= e($item['pinyin']) ?></span>
            </div>
            <h4><?= e($item['titulo']) ?></h4>
            <p><?= e($item['texto']) ?></p>
            <?= botoes_ouvir($item['hanzi'], $item['pinyin']) ?>
          </li>
        <?php endforeach; ?>
      </ul>
    </section>
  <?php endif; ?>

  <!-- CIDADE ANTERIOR E SEGUINTE -->
  <nav class="cidades-nav" aria-label="Outras cidades">
    <?php if ($cidade_anterior): ?>
      <a class="licao__nav licao__nav--anterior" href="cidade.php?id=<?= (int) $cidade_anterior['id'] ?>">
        <span><i class="i i-anterior" aria-hidden="true"></i> Cidade anterior</span>
        <strong><?= e($cidade_anterior['nome']) ?> <span lang="zh-CN"><?= e($cidade_anterior['nome_zh']) ?></span></strong>
      </a>
    <?php endif; ?>
    <?php if ($cidade_seguinte): ?>
      <a class="licao__nav licao__nav--seguinte" href="cidade.php?id=<?= (int) $cidade_seguinte['id'] ?>">
        <span>Próxima cidade <i class="i i-seguinte" aria-hidden="true"></i></span>
        <strong><?= e($cidade_seguinte['nome']) ?> <span lang="zh-CN"><?= e($cidade_seguinte['nome_zh']) ?></span></strong>
      </a>
    <?php else: ?>
      <a class="licao__nav licao__nav--seguinte" href="rota.php">
        <span>Última cidade da rota <i class="i i-seguinte" aria-hidden="true"></i></span>
        <strong>Ver a rota completa</strong>
      </a>
    <?php endif; ?>
  </nav>

<?php require 'includes/fim.php'; ?>
