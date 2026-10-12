<?php
// folha.php
// Aqui eu faço uma folha de treino para imprimir e praticar os caracteres à mão.
// O endereço traz os caracteres: folha.php?c=人大中
// Cada linha tem o caractere modelo (com pinyin), três cópias claras para cobrir por cima
// e caixas vazias para escrever sozinho. As caixas são 田字格 (tiánzìgé), como nos cadernos chineses.

require 'includes/sessao.php';
require 'includes/ligacao.php';

// Eu só aceito caracteres chineses (\p{Han}), sem repetir, e no máximo 20 por folha.
// Assim ninguém consegue pôr outra coisa na página através do endereço.
preg_match_all('/\p{Han}/u', $_GET['c'] ?? '', $encontrados);
$caracteres = array_slice(array_values(array_unique($encontrados[0])), 0, 20);

// O pinyin vem do dicionário do site (as palavras das lições). Se um caractere não estiver lá, fica sem pinyin.
$pinyin = [];
if ($caracteres) {
    $marcas = implode(',', array_fill(0, count($caracteres), '?'));   // ?,?,? … um por caractere
    $consulta = $pdo->prepare("SELECT hanzi, pinyin FROM palavras WHERE hanzi IN ($marcas)");
    $consulta->execute($caracteres);
    foreach ($consulta->fetchAll() as $linha) {
        $pinyin[$linha['hanzi']] = $linha['pinyin'];
    }
}

$titulo = 'Folha de treino';
$pagina = 'folha';
$css_extra = ['folha'];
require 'includes/topo.php';
?>
<div class="folha">
  <div class="folha__topo">
    <div>
      <h1>Folha de treino <span lang="zh-CN">练字</span> <span class="folha__py">liànzì</span></h1>
      <p>Escreve cada caractere devagar, pela ordem dos traços. Primeiro cobre as cópias claras, depois escreve sozinho nas caixas vazias.</p>
    </div>
    <?php if ($caracteres): ?>
      <button type="button" class="botao-cha" onclick="window.print()"><i class="i i-imprimir" aria-hidden="true"></i> Imprimir</button>
    <?php endif; ?>
  </div>

  <?php if (!$caracteres): ?>
    <p class="folha__vazia">Não há caracteres para treinar. Volta a <a href="praticar.php#tab-hanzi">Praticar › Traços</a> e escolhe um conjunto ou escreve os teus caracteres.</p>
  <?php else: ?>
    <?php foreach ($caracteres as $c): ?>
      <div class="folha__linha">
        <!-- O modelo: o caractere a negro, com o pinyin por cima -->
        <div class="tzg tzg--modelo">
          <span class="tzg__py"><?= e($pinyin[$c] ?? '') ?></span>
          <span lang="zh-CN"><?= e($c) ?></span>
        </div>
        <!-- Três cópias claras para cobrir com o lápis -->
        <?php for ($i = 0; $i < 3; $i++): ?>
          <div class="tzg tzg--claro"><span lang="zh-CN"><?= e($c) ?></span></div>
        <?php endfor; ?>
        <!-- Caixas vazias para escrever sozinho -->
        <?php for ($i = 0; $i < 6; $i++): ?>
          <div class="tzg"></div>
        <?php endfor; ?>
      </div>
    <?php endforeach; ?>
    <p class="folha__rodape">Chá · Aprende chinês na hora do chá · Folha gerada para: <span lang="zh-CN"><?= e(implode(' ', $caracteres)) ?></span></p>
  <?php endif; ?>
</div>

<?php require 'includes/fim.php'; ?>
