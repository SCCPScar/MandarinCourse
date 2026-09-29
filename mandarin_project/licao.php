<?php
// licao.php
// Aqui eu mostro uma lição: a explicação, as palavras novas e as frases (com áudio) e o botão para a concluir.
// O endereço é licao.php?id=4.

require 'includes/sessao.php';
require 'includes/ligacao.php';

$id = (int) ($_GET['id'] ?? 0);

// Eu vou buscar a lição e, com JOIN, a unidade e a cidade a que ela pertence
$consulta = $pdo->prepare('
    SELECT l.id, l.titulo, l.minutos, l.explicacao,
           u.codigo, u.titulo AS unidade,
           c.id AS cidade_id, c.nome AS cidade
    FROM licoes l
    JOIN unidades u ON u.id = l.unidade_id
    JOIN cidades c ON c.id = u.cidade_id
    WHERE l.id = ?
');
$consulta->execute([$id]);
$licao = $consulta->fetch();

if (!$licao) {
    header('Location: index.php');
    exit;
}

// As palavras novas desta lição
$consulta = $pdo->prepare('SELECT hanzi, pinyin, traducao FROM palavras WHERE licao_id = ? ORDER BY id');
$consulta->execute([$id]);
$palavras = $consulta->fetchAll();

// As frases de exemplo desta lição
$consulta = $pdo->prepare('SELECT hanzi, pinyin, traducao FROM frases WHERE licao_id = ? ORDER BY id');
$consulta->execute([$id]);
$frases = $consulta->fetchAll();

// O aluno já fez esta lição?
$feita = false;
if (id_utilizador() !== null) {
    $consulta = $pdo->prepare('SELECT 1 FROM progresso WHERE utilizador_id = ? AND licao_id = ?');
    $consulta->execute([id_utilizador(), $id]);
    $feita = (bool) $consulta->fetch();
}
?>
<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= e($licao['titulo']) ?> · Chá</title>
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

<main class="page licao" data-page="licao">
  <p class="licao__caminho">
    <a href="cidade.php?id=<?= (int) $licao['cidade_id'] ?>"><?= e($licao['cidade']) ?></a>
    · Unidade <?= e($licao['codigo']) ?> · <?= e($licao['unidade']) ?>
  </p>
  <h1><?= e($licao['titulo']) ?></h1>
  <p class="licao__tempo">Cerca de <?= (int) $licao['minutos'] ?> minutos</p>

  <?php if ($licao['explicacao']): ?>
    <!-- nl2br mantém as mudanças de linha do texto que está na base de dados -->
    <p class="licao__explicacao"><?= nl2br(e($licao['explicacao'])) ?></p>
  <?php endif; ?>

  <?php if ($palavras): ?>
    <h2>Palavras novas</h2>
    <ul class="palavras">
      <?php foreach ($palavras as $palavra): ?>
        <li class="palavra">
          <span class="palavra__hanzi" lang="zh-CN"><?= e($palavra['hanzi']) ?></span>
          <span class="palavra__pinyin"><?= e($palavra['pinyin']) ?></span>
          <span class="palavra__traducao"><?= e($palavra['traducao']) ?></span>
          <!-- O texto a ler fica no data-falar; a função speakText (js/data.js) usa a voz do browser -->
          <button type="button" class="palavra__ouvir" data-falar="<?= e($palavra['hanzi']) ?>"
                  onclick="speakText(this.dataset.falar)" aria-label="Ouvir <?= e($palavra['pinyin']) ?>">🔊</button>
        </li>
      <?php endforeach; ?>
    </ul>
  <?php else: ?>
    <p>Esta lição é sobre os sons do mandarim. Pratica-os na página <a href="sons.html">Sons</a> e depois volta aqui para a concluir.</p>
  <?php endif; ?>

  <?php if ($frases): ?>
    <h2>Frases de exemplo</h2>
    <ul class="frases">
      <?php foreach ($frases as $frase): ?>
        <li class="frase">
          <button type="button" class="palavra__ouvir" data-falar="<?= e($frase['hanzi']) ?>"
                  onclick="speakText(this.dataset.falar)" aria-label="Ouvir a frase">🔊</button>
          <span class="frase__hanzi" lang="zh-CN"><?= e($frase['hanzi']) ?></span>
          <span class="frase__pinyin"><?= e($frase['pinyin']) ?></span>
          <span class="frase__traducao"><?= e($frase['traducao']) ?></span>
        </li>
      <?php endforeach; ?>
    </ul>
  <?php endif; ?>

  <div class="licao__fim">
    <?php if ($feita): ?>
      <p class="aviso-feita">✓ Já concluíste esta lição.</p>
    <?php elseif (id_utilizador() !== null): ?>
      <form method="post" action="concluir-licao.php">
        <input type="hidden" name="csrf" value="<?= e(token_csrf()) ?>">
        <input type="hidden" name="licao_id" value="<?= (int) $licao['id'] ?>">
        <button class="botao-cha" type="submit">Concluir lição</button>
      </form>
    <?php else: ?>
      <p><a href="registo.php">Cria uma conta</a> ou <a href="entrar.php">inicia sessão</a> para guardar o teu progresso.</p>
    <?php endif; ?>
    <p><a href="cidade.php?id=<?= (int) $licao['cidade_id'] ?>">← Voltar a <?= e($licao['cidade']) ?></a></p>
  </div>
  <?php require 'includes/rodape-site.php'; ?>
</main>

<?php require 'includes/scripts.php'; ?>
</body>
</html>
