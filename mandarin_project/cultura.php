<?php
// cultura.php
// Aqui eu mostro a cultura chinesa numa página só sua (os testers pediram um separador para isso):
// 1) a cultura de cada uma das 6 cidades da rota, com o chinês, o pinyin e o som (vem da tabela cultura);
// 2) a cultura do dia a dia: regras à mesa, presentes, trabalho, festas… (antes estava escondida
//    num separador da página Praticar).

require 'includes/sessao.php';
require 'includes/ligacao.php';

$cidades = $pdo->query('SELECT id, nome, nome_zh, pinyin FROM cidades ORDER BY ordem')->fetchAll();

// A cultura de todas as cidades, arrumada por cidade: $cultura[id_da_cidade] = [item, item, …]
$cultura = [];
foreach ($pdo->query('SELECT * FROM cultura ORDER BY cidade_id, id') as $item) {
    $cultura[$item['cidade_id']][] = $item;
}

$titulo = 'Cultura';
$pagina = 'cultura';
$css_extra = ['rota'];
require 'includes/topo.php';
?>
<?= cabeca_pagina('Cultura', '文化', 'wénhuà', 'Aprender uma língua é também conhecer quem a fala. Aqui ficam as curiosidades de cada cidade da rota e as regras do dia a dia que te vão poupar alguns embaraços na China.', 'ouro') ?>

<div class="container">

<!-- 1. A CULTURA DE CADA CIDADE -->
<div class="section-header anchor" id="cidades">
  <div class="section-num">1</div>
  <h2>A cultura de cada cidade <span class="zh">城市文化</span> <span class="section-header__py">chéngshì wénhuà</span></h2>
</div>
<p class="section-intro">Quatro coisas que vais encontrar em cada paragem da rota. Carrega em «Ouvir» para ouvires a palavra em chinês.</p>

<!-- Atalhos para cada cidade -->
<nav class="indice indice--cidades" aria-label="Cidades">
  <ol>
    <?php foreach ($cidades as $cidade): ?>
      <li><a href="#cidade-<?= (int) $cidade['id'] ?>"><?= e($cidade['nome']) ?> <span lang="zh-CN"><?= e($cidade['nome_zh']) ?></span></a></li>
    <?php endforeach; ?>
  </ol>
</nav>

<?php foreach ($cidades as $cidade): ?>
  <div class="cultura-cidade anchor" id="cidade-<?= (int) $cidade['id'] ?>">
    <h3>
      <a href="cidade.php?id=<?= (int) $cidade['id'] ?>"><?= e($cidade['nome']) ?> <span lang="zh-CN"><?= e($cidade['nome_zh']) ?></span></a>
      <span class="py-inline"><?= e($cidade['pinyin']) ?></span>
    </h3>
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

<!-- 2. A CULTURA DO DIA A DIA -->
<div class="section-header anchor" id="dia-a-dia">
  <div class="section-num">2</div>
  <h2>No dia a dia <span class="zh">日常礼仪</span> <span class="section-header__py">rìcháng lǐyí</span></h2>
</div>
<p class="section-intro">As regras de boa educação, de trabalho e de festa que os chineses esperam que conheças. Saber isto vale tanto como saber as palavras.</p>

<div class="culture-grid">
  <div class="culture-card"><h3>Cartões de visita · 名片 <span class="py-inline">míngpiàn</span></h3><ul><li>Dá e recebe com as duas mãos</li><li>Olha para o cartão uns segundos e nunca escrevas nele</li><li>Nunca o ponhas no bolso de trás</li><li>Tem cartões com o verso em chinês</li><li>Nas reuniões, deixa os cartões em cima da mesa</li></ul></div>
  <div class="culture-card"><h3>Regras à mesa · 餐桌礼仪 <span class="py-inline">cānzhuō lǐyí</span></h3><ul><li>Espera que o anfitrião se sente e comece</li><li>Quem convida paga: não discutas a conta</li><li>Brinde: 干杯 (gānbēi) = Saúde!</li><li>Prova um pouco de tudo o que te oferecem</li><li>Deixar um pouco de comida no prato mostra que já estás satisfeito</li><li>Não espetes os pauzinhos de pé na tigela de arroz: lembra os funerais</li></ul></div>
  <div class="culture-card"><h3>Oferecer presentes · 送礼 <span class="py-inline">sònglǐ</span></h3><ul><li>Nunca ofereças relógios de parede: 送钟 (sòng zhōng) soa como «acompanhar um funeral»</li><li>Nunca ofereças peras: 梨 (lí) soa como 离 (lí), «separação»</li><li>Oferece em números pares: dá sorte</li><li>Os envelopes vermelhos 红包 (hóngbāo) com dinheiro são sempre boa ideia</li><li>Não abras o presente logo à frente de quem o deu</li></ul></div>
  <div class="culture-card"><h3>Relações · 关系 <span class="py-inline">guānxi</span></h3><ul><li>关系 (guānxi) são os contactos: nos negócios contam muito</li><li>Cria confiança antes de fazer negócio</li><li>O WeChat é a principal ferramenta de trabalho</li><li>Dirige-te primeiro às pessoas mais velhas ou com cargo mais alto</li><li>A harmonia, 和谐 (héxié), vale mais do que o confronto</li></ul></div>
  <div class="culture-card"><h3>Tecnologia e pagamentos · 扫码 <span class="py-inline">sǎo mǎ</span></h3><ul><li>Usa-se o WeChat Pay e o Alipay em todo o lado</li><li>扫一扫 (sǎo yī sǎo) = ler o código QR</li><li>O Google, o WhatsApp e o Instagram não funcionam sem VPN</li><li>O Baidu é o motor de pesquisa mais usado; a Didi é a aplicação de táxis</li><li>Configura o WeChat antes de chegares à China</li></ul></div>
  <div class="culture-card"><h3>No escritório · 办公室 <span class="py-inline">bàngōngshì</span></h3><ul><li>Fazer horas extra, 加班 (jiābān), é comum</li><li>Não recuses os convites dos colegas</li><li>给面子 (gěi miànzi), «dar face»: nunca envergonhes ninguém</li><li>Nunca critiques ninguém em público</li><li>Tratamento: 王总 (Wáng zǒng) = Diretor Wang</li></ul></div>
  <div class="culture-card"><h3>O Ano Novo Chinês · 春节 <span class="py-inline">Chūnjié</span></h3><ul><li>É a festa mais importante do ano e muda de data: entre o fim de janeiro e meados de fevereiro</li><li>As famílias juntam-se para o jantar de reunião, 团圆饭 (tuányuánfàn)</li><li>Dá-se 红包 (hóngbāo) às crianças e aos mais novos</li><li>Diz-se 新年快乐 (xīnnián kuàilè): Feliz Ano Novo</li><li>Milhões de pessoas viajam ao mesmo tempo: evita marcar viagens nessa altura</li></ul></div>
  <div class="culture-card"><h3>Números da sorte e do azar · 数字 <span class="py-inline">shùzì</span></h3><ul><li>八 (bā), oito, soa parecido com 发 (fā), «ficar rico»: é o número da sorte</li><li>四 (sì), quatro, soa como 死 (sǐ), «morte»: muitos prédios não têm 4.º andar</li><li>六 (liù), seis, lembra «tudo corre bem»</li><li>Os números de telefone com muitos 8 são mais caros</li><li>Os Jogos Olímpicos de Pequim começaram a 8/8/2008, às 8 da noite</li></ul></div>
</div>

</div><!-- /container -->

<?php require 'includes/fim.php'; ?>
