<?php
// rota.php
// Aqui eu mostro a rota de 12 meses: o progresso geral, as 6 cidades (com o nível HSK de cada uma)
// e, no fim, a cultura de cada cidade, com o chinês, o pinyin e o som.

require 'includes/sessao.php';
require 'includes/ligacao.php';

// Para cada cidade eu conto quantas lições existem e quantas o aluno já fez.
// LEFT JOIN: a cidade aparece mesmo que ainda não tenha lições.
// Sem sessão, o id é null e a contagem das feitas fica a 0.
$consulta = $pdo->prepare('
    SELECT c.id, c.nome, c.nome_zh, c.pinyin, c.meses, c.tema, c.hsk, c.capa,
           COUNT(l.id) AS total,
           COUNT(p.licao_id) AS feitas
    FROM cidades c
    LEFT JOIN unidades u ON u.cidade_id = c.id
    LEFT JOIN licoes l ON l.unidade_id = u.id
    LEFT JOIN progresso p ON p.licao_id = l.id AND p.utilizador_id = ?
    GROUP BY c.id
    ORDER BY c.ordem
');
$consulta->execute([id_utilizador()]);
$cidades = $consulta->fetchAll();

// Totais da rota inteira, para a barra de progresso geral
$total_licoes = array_sum(array_column($cidades, 'total'));
$feitas_total = array_sum(array_column($cidades, 'feitas'));
$percentagem_geral = $total_licoes > 0 ? round($feitas_total / $total_licoes * 100) : 0;

// A cultura de todas as cidades, arrumada por cidade: $cultura[id_da_cidade] = [item, item, …]
$cultura = [];
foreach ($pdo->query('SELECT * FROM cultura ORDER BY cidade_id, id') as $item) {
    $cultura[$item['cidade_id']][] = $item;
}

$titulo = 'A rota';
$pagina = 'rota';
$css_extra = ['rota'];
require 'includes/topo.php';
?>
<section class="rota" id="rota">
  <h1>A rota de 12 meses</h1>
  <p class="rota__intro">Seis cidades da China, cada uma com cerca de 2 meses e 4 unidades. Em cada cidade aprendes o que precisarias para lá viver: em Pequim os sons, em Xi'an a comida, em Xangai o trabalho. No fim da rota tens o nível 3 do HSK 3.0, cerca de 2245 palavras.</p>

  <!-- Progresso geral: uma barra grande e centrada -->
  <div class="rota-geral">
    <?php if (id_utilizador() !== null): ?>
      <p class="rota-geral__numeros"><strong><?= (int) $feitas_total ?></strong> de <?= (int) $total_licoes ?> lições feitas</p>
    <?php else: ?>
      <p class="rota-geral__numeros"><strong><?= (int) $total_licoes ?></strong> lições à tua espera</p>
    <?php endif; ?>
    <div class="progresso" role="progressbar" aria-valuenow="<?= $percentagem_geral ?>" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso na rota">
      <div class="progresso__barra" style="width: <?= $percentagem_geral ?>%"></div>
    </div>
    <?php if (id_utilizador() === null): ?>
      <p><a href="registo.php">Cria uma conta</a> para o teu progresso ficar guardado.</p>
    <?php endif; ?>
  </div>

  <ol class="rota__lista">
    <?php foreach ($cidades as $cidade): ?>
      <li class="cidade">
        <!-- O cartão inteiro é um link para a página da cidade -->
        <a class="cidade__link" href="cidade.php?id=<?= (int) $cidade['id'] ?>">
        <?php if ($cidade['capa']): ?>
          <picture>
            <source type="image/avif" srcset="img/fotos/<?= e($cidade['capa']) ?>-capa-desktop-960.avif">
            <img class="cidade__foto" src="img/fotos/<?= e($cidade['capa']) ?>-capa-desktop-960.webp" alt="" loading="lazy">
          </picture>
        <?php else: ?>
          <!-- Sem foto: eu mostro o nome em chinês em grande -->
          <div class="cidade__foto cidade__foto--vazia" aria-hidden="true"><?= e($cidade['nome_zh']) ?></div>
        <?php endif; ?>

        <?php if ($cidade['total'] > 0 && $cidade['feitas'] == $cidade['total']): ?>
          <!-- O aluno fez todas as lições: eu mostro o carimbo da cidade (完成 = concluído) -->
          <span class="carimbo" lang="zh-CN" title="Cidade concluída"><?= e($cidade['nome_zh']) ?><br>完成</span>
        <?php endif; ?>

        <div class="cidade__texto">
          <p class="cidade__meses">Meses <?= e($cidade['meses']) ?></p>
          <h3><?= e($cidade['nome']) ?> <span lang="zh-CN"><?= e($cidade['nome_zh']) ?></span></h3>
          <span class="cidade__pinyin"><?= e($cidade['pinyin']) ?></span>
          <span class="cidade__hsk"><?= e($cidade['hsk']) ?></span>
          <p><?= e($cidade['tema']) ?></p>

          <?php if (id_utilizador() !== null && $cidade['total'] > 0): ?>
            <?php $percentagem = round($cidade['feitas'] / $cidade['total'] * 100); ?>
            <div class="progresso" role="progressbar" aria-valuenow="<?= $percentagem ?>" aria-valuemin="0" aria-valuemax="100"
                 aria-label="Progresso em <?= e($cidade['nome']) ?>">
              <div class="progresso__barra" style="width: <?= $percentagem ?>%"></div>
            </div>
            <p class="cidade__feitas"><?= (int) $cidade['feitas'] ?> de <?= (int) $cidade['total'] ?> lições</p>
          <?php else: ?>
            <p class="cidade__feitas"><?= (int) $cidade['total'] ?> lições</p>
          <?php endif; ?>
        </div>
        </a>
      </li>
    <?php endforeach; ?>
  </ol>
</section>

<!-- CULTURA: o que cada cidade tem de especial, com o chinês para ouvir -->
<section class="cultura-secao" id="cultura">
  <h2>A cultura de cada cidade</h2>
  <p>Aprender uma língua é também conhecer quem a fala. Aqui ficam algumas coisas que vais encontrar em cada paragem da rota. Carrega em «Ouvir» para ouvires a palavra em chinês.</p>

  <?php foreach ($cidades as $cidade): ?>
    <div class="cultura-cidade">
      <h3><a href="cidade.php?id=<?= (int) $cidade['id'] ?>"><?= e($cidade['nome']) ?> <span lang="zh-CN"><?= e($cidade['nome_zh']) ?></span></a></h3>
      <ul class="cultura-lista">
        <?php foreach ($cultura[$cidade['id']] ?? [] as $item): ?>
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
    </div>
  <?php endforeach; ?>
</section>

<?php require 'includes/fim.php'; ?>
