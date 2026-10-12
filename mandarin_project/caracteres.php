<?php
// caracteres.php
// Aqui eu escrevo o conteúdo da página «Caracteres».
// O início (head e navegação) vem de includes/topo.php e o fim (rodapé e scripts) de includes/fim.php.

require 'includes/sessao.php';

$titulo = 'Caracteres';
$pagina = 'caracteres';
$usa_hanzi = true;
require 'includes/topo.php';
?>
<?= cabeca_pagina('Caracteres', '汉字', 'hànzì', 'Como funcionam os caracteres chineses: os radicais, a ordem dos traços e a diferença entre simplificados e tradicionais.', 'jade') ?>
<div class="container">

<!-- ============================================================ -->
<!-- MÓDULO 9: CARACTERES -->
<!-- ============================================================ -->
<div class="section-header anchor" id="characters">
  <div class="section-num">1</div>
  <h2>Caracteres chineses: como os aprender <span class="zh">汉字</span> <span class="section-header__py">hànzì</span></h2>
</div>
<p class="section-intro">Os caracteres parecem assustadores, mas seguem padrões. Existem cerca de 50 000, mas bastam uns 2000 para ler jornais e uns 3500 para o dia a dia. A maioria junta peças mais simples.</p>

<div class="tabs">
  <button class="tab-btn active" onclick="switchTab(event,'radicals')">Radicais (raízes)</button>
  <button class="tab-btn" onclick="switchTab(event,'stroke-order')">Ordem dos traços</button>
  <button class="tab-btn" onclick="switchTab(event,'top100')">Os mais usados</button>
  <button class="tab-btn" onclick="switchTab(event,'simplified')">Simplificado ou tradicional</button>
</div>

<div id="radicals" class="tab-content active">
  <p class="section-intro">A maioria dos caracteres é feita de radicais, peças que dão uma pista sobre o significado. Com cerca de 100 radicais consegues decifrar milhares de caracteres.</p>
  <div class="table-wrap">
  <table class="phrase-table">
    <tr><th>Radical</th><th>Pista do significado</th><th>Exemplos</th></tr>
    <tr><td class="zh-cell">氵(水)</td><td>água</td><td>河 (hé) rio, 海 (hǎi) mar, 洗 (xǐ) lavar, 游 (yóu) nadar, 泳 (yǒng) nadar</td></tr>
    <tr><td class="zh-cell">火 (灬)</td><td>fogo</td><td>热 (rè) quente, 烧 (shāo) queimar, 炒 (chǎo) saltear, 煮 (zhǔ) cozer</td></tr>
    <tr><td class="zh-cell">木</td><td>madeira / árvore</td><td>树 árvore, 桌 (zhuō) mesa, 椅 (yǐ) cadeira, 林 (lín) floresta</td></tr>
    <tr><td class="zh-cell">口</td><td>boca / abertura</td><td>吃 (chī) comer, 喝 (hē) beber, 说 (shuō) falar, 唱 (chàng) cantar, 叫 (jiào) chamar</td></tr>
    <tr><td class="zh-cell">人 (亻)</td><td>pessoa</td><td>他 (tā) ele, 你 (nǐ) tu, 做 (zuò) fazer, 们 (men) marca de plural</td></tr>
    <tr><td class="zh-cell">心 (忄)</td><td>coração / mente</td><td>想 (xiǎng) pensar, 忘 (wàng) esquecer, 爱 (ài) amar, 怕 (pà) ter medo</td></tr>
    <tr><td class="zh-cell">女</td><td>mulher</td><td>妈 (mā) mãe, 姐 (jiě) irmã, 她 (tā) ela, 好 (hǎo) bom</td></tr>
    <tr><td class="zh-cell">手 (扌)</td><td>mão</td><td>打 (dǎ) bater / fazer, 拿 (ná) segurar, 找 (zhǎo) procurar, 推 (tuī) empurrar</td></tr>
    <tr><td class="zh-cell">目</td><td>olho</td><td>看 (kàn) olhar, 睡 (shuì) dormir, 睁 (zhēng) abrir os olhos, 盲 (máng) cego</td></tr>
    <tr><td class="zh-cell">言 (讠)</td><td>fala</td><td>说 (shuō) falar, 话 (huà) fala, 谢 (xiè) agradecer, 请 (qǐng) convidar</td></tr>
    <tr><td class="zh-cell">金 (钅)</td><td>metal / dinheiro</td><td>钱 (qián) dinheiro, 银 (yín) prata, 铁 (tiě) ferro, 钟 relógio</td></tr>
    <tr><td class="zh-cell">土</td><td>terra / chão</td><td>地 (dì) chão, 城 (chéng) cidade, 坐 (zuò) sentar, 在 (zài) em / estar</td></tr>
    <tr><td class="zh-cell">日</td><td>sol / dia</td><td>明 (míng) claro, 晴 (qíng) soalheiro, 时 (shí) tempo, 是 (shì) ser</td></tr>
    <tr><td class="zh-cell">月</td><td>lua / mês</td><td>期 período, 朋 (péng) amigo (duas luas!), 脸 (liǎn) cara</td></tr>
    <tr><td class="zh-cell">走</td><td>andar / ir</td><td>跑 (pǎo) correr, 跳 (tiào) saltar, 路 (lù) estrada, 跟 (gēn) seguir</td></tr>
  </table>
  </div>
  <div class="tip"><strong>Truque para memorizar:</strong> 好 (hǎo, bom) = mulher 女 (nǚ) + criança 子 (zǐ). Uma mulher com uma criança = bom! Muitos caracteres têm histórias assim.</div>
</div>

<div id="stroke-order" class="tab-content">
  <p class="section-intro">A ordem dos traços importa: muda o aspeto do caractere quando escreves depressa e é essencial para o telemóvel reconhecer a tua letra. Segue estas regras:</p>
  <div class="grammar-box">
    <h3>As 8 regras da ordem dos traços</h3>
    <ol style="padding-left:1.5rem; line-height:2.2; color:var(--ink-mid);">
      <li><strong>De cima para baixo</strong>: 三 (sān, três). Primeiro a linha de cima, depois a do meio e por fim a de baixo</li>
      <li><strong>Da esquerda para a direita</strong>: 川 (chuān, rio). Primeiro o traço da esquerda, depois o do meio e por fim o da direita</li>
      <li><strong>O horizontal antes do vertical</strong> (quando se cruzam): 十 (shí, dez). Primeiro o horizontal</li>
      <li><strong>Primeiro a moldura, depois o interior, e fecha no fim</strong>: 国 (guó, país). Moldura, interior e por fim o traço de baixo</li>
      <li><strong>O centro antes dos lados</strong> (nos caracteres simétricos): 小 (xiǎo, pequeno). Primeiro o traço do meio</li>
      <li><strong>Os traços inclinados para a esquerda vêm antes dos inclinados para a direita</strong>: 人 (rén, pessoa). Primeiro o traço da esquerda</li>
      <li><strong>O horizontal de baixo fica para o fim</strong>: 王 (wáng, rei). Três horizontais e um vertical, com o horizontal de baixo no fim</li>
      <li><strong>Os traços que varrem da direita para a esquerda ficam para o fim</strong></li>
    </ol>
  </div>
  <div class="stroke-info"><strong>Para praticar:</strong> Instala a aplicação <strong>Skritter</strong> (skritter.com) para treinar a ordem dos traços. A versão gratuita chega para quem está a começar.</div>
  <div class="tip"><strong>Atalho moderno:</strong> No trabalho vais escrever sobretudo no telemóvel ou no computador, com o teclado de pinyin. Não precisas de uma letra perfeita, mas precisas de reconhecer os caracteres quando lês.</div>
</div>

<div id="top100" class="tab-content">
  <p class="section-intro">Estes caracteres aparecem em quase tudo o que vais ler. Aprende primeiro a reconhecê-los.</p>
  <div class="card-grid">
    <div class="card"><div class="zh">的</div><div class="pinyin">de</div><div class="en">partícula de posse (a mais usada!)</div></div>
    <div class="card"><div class="zh">一</div><div class="pinyin">yī</div><div class="en">um / uma</div></div>
    <div class="card"><div class="zh">是</div><div class="pinyin">shì</div><div class="en">ser</div></div>
    <div class="card"><div class="zh">不</div><div class="pinyin">bù</div><div class="en">não</div></div>
    <div class="card"><div class="zh">了</div><div class="pinyin">le</div><div class="en">partícula de ação terminada</div></div>
    <div class="card"><div class="zh">人</div><div class="pinyin">rén</div><div class="en">pessoa / pessoas</div></div>
    <div class="card"><div class="zh">我</div><div class="pinyin">wǒ</div><div class="en">eu / me</div></div>
    <div class="card"><div class="zh">在</div><div class="pinyin">zài</div><div class="en">em / estar / a fazer</div></div>
    <div class="card"><div class="zh">有</div><div class="pinyin">yǒu</div><div class="en">ter / haver</div></div>
    <div class="card"><div class="zh">他</div><div class="pinyin">tā</div><div class="en">ele</div></div>
    <div class="card"><div class="zh">这</div><div class="pinyin">zhè</div><div class="en">este / isto</div></div>
    <div class="card"><div class="zh">中</div><div class="pinyin">zhōng</div><div class="en">meio / China</div></div>
    <div class="card"><div class="zh">大</div><div class="pinyin">dà</div><div class="en">grande</div></div>
    <div class="card"><div class="zh">来</div><div class="pinyin">lái</div><div class="en">vir</div></div>
    <div class="card"><div class="zh">上</div><div class="pinyin">shàng</div><div class="en">em cima / sobre</div></div>
    <div class="card"><div class="zh">国</div><div class="pinyin">guó</div><div class="en">país / nação</div></div>
    <div class="card"><div class="zh">到</div><div class="pinyin">dào</div><div class="en">chegar / até</div></div>
    <div class="card"><div class="zh">说</div><div class="pinyin">shuō</div><div class="en">dizer / falar</div></div>
    <div class="card"><div class="zh">和</div><div class="pinyin">hé</div><div class="en">e / com</div></div>
    <div class="card"><div class="zh">要</div><div class="pinyin">yào</div><div class="en">querer / precisar / ir (futuro)</div></div>
    <div class="card"><div class="zh">就</div><div class="pinyin">jiù</div><div class="en">então / mesmo / logo</div></div>
    <div class="card"><div class="zh">出</div><div class="pinyin">chū</div><div class="en">sair / saída</div></div>
    <div class="card"><div class="zh">会</div><div class="pinyin">huì</div><div class="en">saber fazer / ir (futuro) / reunião</div></div>
    <div class="card"><div class="zh">可</div><div class="pinyin">kě</div><div class="en">poder (可以)</div></div>
    <div class="card"><div class="zh">以</div><div class="pinyin">yǐ</div><div class="en">usar / com (可以, 以前)</div></div>
    <div class="card"><div class="zh">也</div><div class="pinyin">yě</div><div class="en">também</div></div>
    <div class="card"><div class="zh">时</div><div class="pinyin">shí</div><div class="en">tempo (时候)</div></div>
    <div class="card"><div class="zh">年</div><div class="pinyin">nián</div><div class="en">ano</div></div>
    <div class="card"><div class="zh">得</div><div class="pinyin">de/dé/děi</div><div class="en">obter / complemento / ter de</div></div>
    <div class="card"><div class="zh">们</div><div class="pinyin">men</div><div class="en">marca de plural (我们)</div></div>
  </div>
</div>

<div id="simplified" class="tab-content">
  <div class="grammar-box">
    <h3>Simplificado (简体 (jiǎntǐ)) ou tradicional (繁體 (fántǐ))</h3>
    <p style="margin-bottom:12px; color:var(--ink-light);">Para a China continental, aprende o simplificado. O tradicional usa-se em Taiwan, Hong Kong e Macau.</p>
    <div class="table-wrap">
    <table class="phrase-table">
      <tr><th>Simplificado</th><th>Tradicional</th><th>Pinyin</th><th>Significado</th></tr>
      <tr><td class="zh-cell">爱</td><td class="zh-cell" style="font-size:1.125rem">愛</td><td class="py-cell">ài</td><td>amor</td></tr>
      <tr><td class="zh-cell">书</td><td class="zh-cell" style="font-size:1.125rem">書</td><td class="py-cell">shū</td><td>livro</td></tr>
      <tr><td class="zh-cell">说</td><td class="zh-cell" style="font-size:1.125rem">說</td><td class="py-cell">shuō</td><td>falar</td></tr>
      <tr><td class="zh-cell">国</td><td class="zh-cell" style="font-size:1.125rem">國</td><td class="py-cell">guó</td><td>país</td></tr>
      <tr><td class="zh-cell">车</td><td class="zh-cell" style="font-size:1.125rem">車</td><td class="py-cell">chē</td><td>carro / veículo</td></tr>
      <tr><td class="zh-cell">门</td><td class="zh-cell" style="font-size:1.125rem">門</td><td class="py-cell">mén</td><td>porta / portão</td></tr>
      <tr><td class="zh-cell">长</td><td class="zh-cell" style="font-size:1.125rem">長</td><td class="py-cell">cháng/zhǎng</td><td>comprido / crescer</td></tr>
    </table>
    </div>
  </div>
  <div class="tip"><strong>Boa notícia:</strong> Se aprenderes primeiro o simplificado, cerca de 70% do tradicional vai parecer-te familiar. Muitos caracteres são iguais nos dois sistemas.</div>
</div>

</div><!-- /container -->

<?php require 'includes/fim.php'; ?>
