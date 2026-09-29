<?php
// creditos.php
// Aqui eu mostro quem fez as fotografias, as fontes e as bibliotecas que o site usa.
// As fotografias vêm do ficheiro dados/fotos-creditos.csv, para eu só ter de as registar num sítio.

require 'includes/sessao.php';

// Eu leio o CSV linha a linha. A primeira linha tem os nomes das colunas, por isso salto-a.
$fotos = [];
$ficheiro = fopen('dados/fotos-creditos.csv', 'r');
fgetcsv($ficheiro, 0, ',', '"', '');
while (($linha = fgetcsv($ficheiro, 0, ',', '"', '')) !== false) {
    // Colunas: id, local, url, fotógrafo, perfil do fotógrafo, fonte, licença, data
    $fotos[] = [
        'local'     => $linha[1],
        'fotografo' => $linha[3],
        'perfil'    => $linha[4],
        'fonte'     => $linha[5],
    ];
}
fclose($ficheiro);

$titulo = 'Créditos';
require 'includes/cabecalho.php';
?>
<section class="conta-caixa creditos">
  <h1>Créditos</h1>
  <p>O Chá só existe graças ao trabalho de outras pessoas. Aqui eu agradeço a cada uma.</p>

  <h2>Fotografias</h2>
  <p>As fotografias são do <a href="https://unsplash.com" target="_blank" rel="noopener">Unsplash</a> e usam a licença Unsplash, que permite o uso gratuito. Em algumas eu desfoquei rostos, matrículas ou números de telefone, para proteger quem aparece nelas.</p>
  <table class="creditos-tabela">
    <thead>
      <tr><th>Onde aparece</th><th>Autor</th></tr>
    </thead>
    <tbody>
      <?php foreach ($fotos as $foto): ?>
        <tr>
          <td><?= e($foto['local']) ?></td>
          <td>
            <?php if ($foto['perfil'] !== '' && $foto['perfil'] !== 'PENDENTE'): ?>
              <a href="<?= e($foto['perfil']) ?>" target="_blank" rel="noopener"><?= e($foto['fotografo']) ?></a>
            <?php elseif ($foto['fotografo'] === 'PENDENTE'): ?>
              Unsplash (autor a confirmar)
            <?php else: ?>
              <?= e($foto['fotografo']) ?>
            <?php endif; ?>
          </td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>

  <h2>Fontes de letra</h2>
  <p>Todas têm a licença livre <a href="https://openfontlicense.org" target="_blank" rel="noopener">SIL Open Font License</a>.</p>
  <ul>
    <li><strong>Bricolage Grotesque</strong>, nos títulos.</li>
    <li><strong>Lexend</strong>, no texto.</li>
    <li><strong>Ma Shan Zheng</strong>, no carimbo 茶 do logótipo.</li>
    <li><strong>LXGW WenKai</strong>, nos caracteres chineses das ilustrações.</li>
  </ul>

  <h2>Bibliotecas</h2>
  <ul>
    <li><strong><a href="https://hanziwriter.org" target="_blank" rel="noopener">Hanzi Writer</a></strong>, de David Chanin (licença MIT), para animar a ordem dos traços dos caracteres. Os dados dos traços vêm do projeto Make Me a Hanzi.</li>
  </ul>

  <h2>Ilustrações</h2>
  <p>As ilustrações das unidades 1.1 (pinyin e tons), 6.2 (no trabalho) e 6.3 (entrevista de emprego) foram feitas por mim para este projeto.</p>
</section>
<?php require 'includes/rodape.php'; ?>
