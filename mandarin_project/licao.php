<?php
// licao.php
// Aqui eu mostro uma lição. O endereço é licao.php?id=4.
// A lição tem: o caminho (cidade, unidade e nível HSK), a explicação, as palavras novas e as frases
// (com som normal e devagar), um exercício com as palavras da lição, ligações para praticar mais
// e os botões para a lição anterior e para a seguinte.

require 'includes/sessao.php';
require 'includes/ligacao.php';
require 'includes/praticar-mais.php';

$id = (int) ($_GET['id'] ?? 0);

// Eu vou buscar a lição e, com JOIN, a unidade e a cidade a que ela pertence
$consulta = $pdo->prepare('
    SELECT l.id, l.titulo, l.minutos, l.explicacao,
           u.codigo, u.titulo AS unidade,
           c.id AS cidade_id, c.nome AS cidade, c.nome_zh AS cidade_zh, c.pinyin AS cidade_pinyin,
           c.hsk, c.ordem AS cidade_ordem
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

// As palavras novas e as frases de exemplo desta lição
$consulta = $pdo->prepare('SELECT hanzi, pinyin, traducao FROM palavras WHERE licao_id = ? ORDER BY id');
$consulta->execute([$id]);
$palavras = $consulta->fetchAll();

$consulta = $pdo->prepare('SELECT hanzi, pinyin, traducao FROM frases WHERE licao_id = ? ORDER BY id');
$consulta->execute([$id]);
$frases = $consulta->fetchAll();

// A ordem de todas as lições da rota, para saber o número desta lição e quais são a anterior e a seguinte
$ordem = $pdo->query('
    SELECT l.id, l.titulo, u.cidade_id
    FROM licoes l JOIN unidades u ON u.id = l.unidade_id
    ORDER BY u.cidade_id, u.codigo, l.ordem
')->fetchAll();
$posicao  = array_search($id, array_map('intval', array_column($ordem, 'id')));
$anterior = $ordem[$posicao - 1] ?? null;
$seguinte = $ordem[$posicao + 1] ?? null;

// Se a lição seguinte já é de outra cidade, o botão diz «Seguir para…» com o nome dessa cidade
$proxima_cidade = null;
if ($seguinte && $seguinte['cidade_id'] != $licao['cidade_id']) {
    $consulta = $pdo->prepare('SELECT id, nome, nome_zh FROM cidades WHERE id = ?');
    $consulta->execute([$seguinte['cidade_id']]);
    $proxima_cidade = $consulta->fetch();
}

// O aluno já fez esta lição?
$feita = false;
if (id_utilizador() !== null) {
    $consulta = $pdo->prepare('SELECT 1 FROM progresso WHERE utilizador_id = ? AND licao_id = ?');
    $consulta->execute([id_utilizador(), $id]);
    $feita = (bool) $consulta->fetch();
}

$titulo = $licao['titulo'];
$pagina = 'licao';
$css_extra = ['cidade'];
require 'includes/topo.php';
?>
<div class="licao">
  <!-- O caminho: cidade (com chinês, pinyin e som) e unidade -->
  <nav class="licao__caminho" aria-label="Onde estás">
    <a href="cidade.php?id=<?= (int) $licao['cidade_id'] ?>"><?= e($licao['cidade']) ?> <span lang="zh-CN"><?= e($licao['cidade_zh']) ?></span></a>
    <span class="licao__caminho-py"><?= e($licao['cidade_pinyin']) ?></span>
    <?= botoes_ouvir($licao['cidade_zh'], $licao['cidade_pinyin']) ?>
    <span class="licao__unidade">Unidade <?= e($licao['codigo']) ?> · <?= e($licao['unidade']) ?></span>
  </nav>

  <h1><?= e($licao['titulo']) ?></h1>

  <!-- O nível HSK e o lugar na rota: assim o aluno sabe até onde já chegou -->
  <ul class="licao__etiquetas">
    <li class="etiqueta etiqueta--hsk"><i class="i i-hsk" aria-hidden="true"></i> <?= e($licao['hsk']) ?></li>
    <li class="etiqueta"><i class="i i-rota" aria-hidden="true"></i> Lição <?= $posicao + 1 ?> de <?= count($ordem) ?></li>
    <li class="etiqueta"><i class="i i-relogio" aria-hidden="true"></i> Cerca de <?= (int) $licao['minutos'] ?> minutos</li>
  </ul>

  <?php if (isset($_GET['feita'])): ?>
    <p class="aviso-feita" role="status"><i class="i i-certo" aria-hidden="true"></i> Lição concluída! As palavras novas já estão nas tuas revisões.</p>
  <?php endif; ?>

  <!-- 1. A EXPLICAÇÃO -->
  <?php if ($licao['explicacao']): ?>
    <!-- nl2br mantém as mudanças de linha do texto que está na base de dados -->
    <p class="licao__explicacao"><?= nl2br(e($licao['explicacao'])) ?></p>
  <?php endif; ?>

  <!-- 2. AS PALAVRAS NOVAS -->
  <?php if ($palavras): ?>
    <h2><span class="licao__passo">1</span> Palavras novas</h2>
    <p class="licao__dica">Ouve cada palavra primeiro devagar e depois à velocidade normal. Repete em voz alta.</p>
    <ul class="palavras">
      <?php foreach ($palavras as $palavra): ?>
        <li class="palavra">
          <span class="palavra__hanzi" lang="zh-CN"><?= e($palavra['hanzi']) ?></span>
          <span class="palavra__pinyin"><?= e($palavra['pinyin']) ?></span>
          <span class="palavra__traducao"><?= e($palavra['traducao']) ?></span>
          <?= botoes_ouvir($palavra['hanzi'], $palavra['pinyin']) ?>
        </li>
      <?php endforeach; ?>
    </ul>
  <?php endif; ?>

  <!-- 3. AS FRASES -->
  <?php if ($frases): ?>
    <h2><span class="licao__passo">2</span> Frases de exemplo</h2>
    <ul class="frases">
      <?php foreach ($frases as $frase): ?>
        <li class="frase">
          <span class="frase__hanzi" lang="zh-CN"><?= e($frase['hanzi']) ?></span>
          <span class="frase__pinyin"><?= e($frase['pinyin']) ?></span>
          <span class="frase__traducao"><?= e($frase['traducao']) ?></span>
          <?= botoes_ouvir($frase['hanzi'], $frase['pinyin']) ?>
        </li>
      <?php endforeach; ?>
    </ul>
  <?php endif; ?>

  <!-- 4. O EXERCÍCIO: o js/licao.js faz as perguntas com as palavras desta lição -->
  <?php if (count($palavras) >= 3): ?>
    <h2><span class="licao__passo">3</span> Exercício</h2>
    <p class="licao__dica">Responde sem olhar para cima. No fim vês as palavras que erraste, para as reveres.</p>
    <div class="exercicio" id="exercicio">
      <button type="button" class="botao-cha" onclick="comecarExercicio()"><i class="i i-jogar" aria-hidden="true"></i> Começar o exercício</button>
    </div>
    <!-- As palavras vão para o JavaScript em JSON. JSON_HEX_TAG impede que um "<" feche o <script> antes do tempo. -->
    <script type="application/json" id="palavras-licao"><?= json_encode($palavras, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP) ?></script>
  <?php endif; ?>

  <!-- 5. CONTINUA A PRATICAR -->
  <?php if (!empty($praticar_mais[$licao['codigo']])): ?>
    <h2><span class="licao__passo"><?= count($palavras) >= 3 ? 4 : 3 ?></span> Continua a praticar</h2>
    <p class="licao__dica">Para aproveitares bem os teus 15 minutos, depois da lição passa por uma destas páginas.</p>
    <ul class="mais-pratica">
      <?php foreach ($praticar_mais[$licao['codigo']] as [$nome, $endereco, $descricao]): ?>
        <li>
          <a href="<?= e($endereco) ?>">
            <strong><?= e($nome) ?></strong>
            <span><?= e($descricao) ?></span>
          </a>
        </li>
      <?php endforeach; ?>
    </ul>
  <?php endif; ?>

  <!-- 6. O FIM: concluir e seguir para a próxima -->
  <div class="licao__fim">
    <?php if ($feita): ?>
      <p class="aviso-feita"><i class="i i-certo" aria-hidden="true"></i> Já concluíste esta lição.</p>
    <?php elseif (id_utilizador() !== null): ?>
      <form method="post" action="concluir-licao.php">
        <input type="hidden" name="csrf" value="<?= e(token_csrf()) ?>">
        <input type="hidden" name="licao_id" value="<?= (int) $licao['id'] ?>">
        <button class="botao-cha" type="submit"><i class="i i-certo" aria-hidden="true"></i> Concluir lição</button>
      </form>
    <?php else: ?>
      <p><a href="registo.php">Cria uma conta</a> ou <a href="entrar.php">inicia sessão</a> para guardar o teu progresso.</p>
    <?php endif; ?>

    <nav class="licao__navegacao" aria-label="Outras lições">
      <?php if ($anterior): ?>
        <a class="licao__nav licao__nav--anterior" href="licao.php?id=<?= (int) $anterior['id'] ?>">
          <span><i class="i i-anterior" aria-hidden="true"></i> Lição anterior</span>
          <strong><?= e($anterior['titulo']) ?></strong>
        </a>
      <?php endif; ?>

      <?php if ($proxima_cidade): ?>
        <a class="licao__nav licao__nav--seguinte licao__nav--cidade" href="cidade.php?id=<?= (int) $proxima_cidade['id'] ?>">
          <span>Acabaste <?= e($licao['cidade']) ?>! <i class="i i-seguinte" aria-hidden="true"></i></span>
          <strong>Seguir para <?= e($proxima_cidade['nome']) ?> <span lang="zh-CN"><?= e($proxima_cidade['nome_zh']) ?></span></strong>
        </a>
      <?php elseif ($seguinte): ?>
        <a class="licao__nav licao__nav--seguinte" href="licao.php?id=<?= (int) $seguinte['id'] ?>">
          <span>Próxima lição <i class="i i-seguinte" aria-hidden="true"></i></span>
          <strong><?= e($seguinte['titulo']) ?></strong>
        </a>
      <?php else: ?>
        <a class="licao__nav licao__nav--seguinte licao__nav--cidade" href="rota.php">
          <span>Chegaste ao fim da rota! <i class="i i-seguinte" aria-hidden="true"></i></span>
          <strong>Ver a rota completa</strong>
        </a>
      <?php endif; ?>
    </nav>
  </div>
</div>

<?php require 'includes/fim.php'; ?>
