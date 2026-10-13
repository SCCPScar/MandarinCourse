<?php
// basico.php
// Aqui eu escrevo o conteúdo da página «Frases, números e gramática».
// O início (head e navegação) vem de includes/topo.php e o fim (rodapé e scripts) de includes/fim.php.

require 'includes/sessao.php';

$titulo = 'Frases, números e gramática';
$pagina = 'basico';
require 'includes/topo.php';
?>
<?= cabeca_pagina('Básico', '基础', 'jīchǔ', 'As frases do primeiro dia, os números e as horas. Decora-as antes de tudo o resto e repete-as em voz alta.', 'selo') ?>
<div class="container">

<!-- ============================================================ -->
<!-- MÓDULO 4: BÁSICO -->
<!-- ============================================================ -->
<div class="section-header anchor" id="tools-basics">
  <div class="section-num">1</div>
  <h2>Frases essenciais para o primeiro dia <span class="zh">基础用语</span> <span class="section-header__py">jīchǔ yòngyǔ</span></h2>
</div>
<p class="section-intro">Estas são as frases que vais usar todos os dias. Decora-as antes de tudo o resto e pratica até saírem sem pensar.</p>

<div class="tabs">
  <button class="tab-btn active" onclick="abrirSeparador(event,'greetings')">Cumprimentos</button>
  <button class="tab-btn" onclick="abrirSeparador(event,'polite')">Frases de cortesia</button>
  <button class="tab-btn" onclick="abrirSeparador(event,'questions')">Perguntas essenciais</button>
  <button class="tab-btn" onclick="abrirSeparador(event,'shopping')">Compras e comida</button>
</div>

<div id="greetings" class="tab-content active">
<div class="table-wrap">
<table class="phrase-table">
  <tr><th>Chinês</th><th>Pinyin</th><th>Português</th><th>Quando usar</th></tr>
  <tr><td class="zh-cell">你好</td><td class="py-cell">nǐ hǎo</td><td>Olá</td><td class="use-cell">Cumprimento do dia a dia</td></tr>
  <tr><td class="zh-cell">您好</td><td class="py-cell">nín hǎo</td><td>Olá (formal e educado)</td><td class="use-cell">Para pessoas mais velhas e chefes</td></tr>
  <tr><td class="zh-cell">大家好</td><td class="py-cell">dàjiā hǎo</td><td>Olá a todos</td><td class="use-cell">Para um grupo</td></tr>
  <tr><td class="zh-cell">早上好</td><td class="py-cell">zǎoshang hǎo</td><td>Bom dia</td><td class="use-cell">Até às 11h, mais ou menos</td></tr>
  <tr><td class="zh-cell">下午好</td><td class="py-cell">xiàwǔ hǎo</td><td>Boa tarde</td><td class="use-cell">Das 12h às 18h</td></tr>
  <tr><td class="zh-cell">晚上好</td><td class="py-cell">wǎnshang hǎo</td><td>Boa noite</td><td class="use-cell">Depois das 18h</td></tr>
  <tr><td class="zh-cell">再见</td><td class="py-cell">zàijiàn</td><td>Adeus</td><td class="use-cell">Despedida normal</td></tr>
  <tr><td class="zh-cell">拜拜</td><td class="py-cell">bāibāi</td><td>Xau</td><td class="use-cell">Informal, vem do inglês «bye bye»</td></tr>
  <tr><td class="zh-cell">好久不见</td><td class="py-cell">hǎo jiǔ bù jiàn</td><td>Há quanto tempo!</td><td class="use-cell">O inglês «long time no see» vem desta frase!</td></tr>
  <tr><td class="zh-cell">你吃了吗?</td><td class="py-cell">nǐ chī le ma?</td><td>Já comeste?</td><td class="use-cell">Cumprimento informal (é cultural)</td></tr>
  <tr><td class="zh-cell">最近怎么样?</td><td class="py-cell">zuìjìn zěnmeyàng?</td><td>Como tens andado?</td><td class="use-cell">Para saber como a pessoa está</td></tr>
  <tr><td class="zh-cell">还好</td><td class="py-cell">hái hǎo</td><td>Vou andando / Bem</td><td class="use-cell">Resposta habitual</td></tr>
</table>
</div>
</div>

<div id="polite" class="tab-content">
<div class="table-wrap">
<table class="phrase-table">
  <tr><th>Chinês</th><th>Pinyin</th><th>Português</th><th>Notas</th></tr>
  <tr><td class="zh-cell">谢谢</td><td class="py-cell">xièxie</td><td>Obrigado</td><td class="use-cell">Diz muitas vezes!</td></tr>
  <tr><td class="zh-cell">非常感谢</td><td class="py-cell">fēicháng gǎnxiè</td><td>Muito obrigado</td><td class="use-cell">Agradecimento formal ou forte</td></tr>
  <tr><td class="zh-cell">不客气</td><td class="py-cell">bú kèqi</td><td>De nada</td><td class="use-cell">Resposta habitual</td></tr>
  <tr><td class="zh-cell">对不起</td><td class="py-cell">duìbuqǐ</td><td>Desculpa (a sério)</td><td class="use-cell">Para pedir desculpa por um erro</td></tr>
  <tr><td class="zh-cell">不好意思</td><td class="py-cell">bù hǎoyìsi</td><td>Com licença / Desculpa</td><td class="use-cell">Desculpa leve ou para chamar a atenção</td></tr>
  <tr><td class="zh-cell">没关系</td><td class="py-cell">méi guānxi</td><td>Não faz mal</td><td class="use-cell">Resposta a um pedido de desculpa</td></tr>
  <tr><td class="zh-cell">请</td><td class="py-cell">qǐng</td><td>Por favor</td><td class="use-cell">Antes de um pedido</td></tr>
  <tr><td class="zh-cell">麻烦你了</td><td class="py-cell">máfan nǐ le</td><td>Desculpa o incómodo</td><td class="use-cell">Quando pedes um favor</td></tr>
  <tr><td class="zh-cell">没问题</td><td class="py-cell">méi wèntí</td><td>Não há problema</td><td class="use-cell">Muito usado!</td></tr>
  <tr><td class="zh-cell">当然</td><td class="py-cell">dāngrán</td><td>Claro</td><td class="use-cell">Para concordar</td></tr>
  <tr><td class="zh-cell">我明白了</td><td class="py-cell">wǒ míngbái le</td><td>Percebo</td><td class="use-cell">Para mostrar que percebeste</td></tr>
  <tr><td class="zh-cell">我不懂</td><td class="py-cell">wǒ bù dǒng</td><td>Não percebo</td><td class="use-cell">Muito útil para quem está a aprender!</td></tr>
</table>
</div>
</div>

<div id="questions" class="tab-content">
<div class="table-wrap">
<table class="phrase-table">
  <tr><th>Chinês</th><th>Pinyin</th><th>Português</th><th>Estrutura</th></tr>
  <tr><td class="zh-cell">这是什么?</td><td class="py-cell">zhè shì shénme?</td><td>O que é isto?</td><td class="use-cell">什么 (shénme) = o quê</td></tr>
  <tr><td class="zh-cell">你叫什么名字?</td><td class="py-cell">nǐ jiào shénme míngzi?</td><td>Como te chamas?</td><td class="use-cell">叫 (jiào) = chamar-se</td></tr>
  <tr><td class="zh-cell">你是哪里人?</td><td class="py-cell">nǐ shì nǎlǐ rén?</td><td>De onde és?</td><td class="use-cell">哪里 (nǎlǐ) = onde</td></tr>
  <tr><td class="zh-cell">厕所在哪里?</td><td class="py-cell">cèsuǒ zài nǎlǐ?</td><td>Onde é a casa de banho?</td><td class="use-cell">在哪里 (zài nǎlǐ) = onde fica</td></tr>
  <tr><td class="zh-cell">这个多少钱?</td><td class="py-cell">zhège duōshao qián?</td><td>Quanto custa isto?</td><td class="use-cell">多少钱 (duōshao qián) = quanto dinheiro</td></tr>
  <tr><td class="zh-cell">现在几点?</td><td class="py-cell">xiànzài jǐ diǎn?</td><td>Que horas são?</td><td class="use-cell">几点 (jǐ diǎn) = que horas</td></tr>
  <tr><td class="zh-cell">为什么?</td><td class="py-cell">wèi shénme?</td><td>Porquê?</td><td class="use-cell">为什么 (wèishénme) = por que razão</td></tr>
  <tr><td class="zh-cell">怎么去…?</td><td class="py-cell">zěnme qù…?</td><td>Como vou para…?</td><td class="use-cell">怎么 (zěnme) = como</td></tr>
  <tr><td class="zh-cell">你会说中文吗?</td><td class="py-cell">nǐ huì shuō Zhōngwén ma?</td><td>Falas chinês?</td><td class="use-cell">吗 (ma) = partícula de pergunta</td></tr>
  <tr><td class="zh-cell">能说慢一点吗?</td><td class="py-cell">néng shuō màn yīdiǎn ma?</td><td>Podes falar mais devagar?</td><td class="use-cell">Essencial para quem aprende!</td></tr>
  <tr><td class="zh-cell">能再说一遍吗?</td><td class="py-cell">néng zài shuō yī biàn ma?</td><td>Podes repetir?</td><td class="use-cell">再 (zài) = outra vez</td></tr>
</table>
</div>
</div>

<div id="shopping" class="tab-content">
<div class="table-wrap">
<table class="phrase-table">
  <tr><th>Chinês</th><th>Pinyin</th><th>Português</th><th>Situação</th></tr>
  <tr><td class="zh-cell">我要这个</td><td class="py-cell">wǒ yào zhège</td><td>Quero este</td><td class="use-cell">Para pedir ou comprar</td></tr>
  <tr><td class="zh-cell">给我看看</td><td class="py-cell">gěi wǒ kànkan</td><td>Deixa-me ver</td><td class="use-cell">Compras</td></tr>
  <tr><td class="zh-cell">太贵了</td><td class="py-cell">tài guì le</td><td>Muito caro</td><td class="use-cell">Para regatear nos mercados</td></tr>
  <tr><td class="zh-cell">能便宜点吗?</td><td class="py-cell">néng piányí diǎn ma?</td><td>Pode fazer mais barato?</td><td class="use-cell">Regatear no mercado</td></tr>
  <tr><td class="zh-cell">我不要</td><td class="py-cell">wǒ bú yào</td><td>Não quero</td><td class="use-cell">Para recusar vendedores</td></tr>
  <tr><td class="zh-cell">买单 / 结账</td><td class="py-cell">mǎidān / jiézhàng</td><td>A conta, por favor</td><td class="use-cell">Nos restaurantes</td></tr>
  <tr><td class="zh-cell">好吃</td><td class="py-cell">hǎo chī</td><td>Delicioso</td><td class="use-cell">Sobre a comida</td></tr>
  <tr><td class="zh-cell">不辣的</td><td class="py-cell">bù là de</td><td>Sem picante</td><td class="use-cell">Para pedir comida</td></tr>
  <tr><td class="zh-cell">打包</td><td class="py-cell">dǎbāo</td><td>Para levar</td><td class="use-cell">Restaurantes</td></tr>
  <tr><td class="zh-cell">扫一扫</td><td class="py-cell">sǎo yī sǎo</td><td>Ler o código (QR code)</td><td class="use-cell">Faz-se todos os dias na China!</td></tr>
</table>
</div>
</div>

<!-- ============================================================ -->
<!-- MÓDULO 5: NÚMEROS -->
<!-- ============================================================ -->
<div class="section-header anchor" id="basics">
  <div class="section-num">2</div>
  <h2>Números e horas <span class="zh">数字和时间</span> <span class="section-header__py">shùzì hé shíjiān</span></h2>
</div>

<div class="num-grid">
  <div class="num-card"><div class="digit">0</div><div class="zh">零</div><div class="pinyin">líng</div></div>
  <div class="num-card"><div class="digit">1</div><div class="zh">一</div><div class="pinyin">yī</div></div>
  <div class="num-card"><div class="digit">2</div><div class="zh">二/两</div><div class="pinyin">èr / liǎng</div></div>
  <div class="num-card"><div class="digit">3</div><div class="zh">三</div><div class="pinyin">sān</div></div>
  <div class="num-card"><div class="digit">4</div><div class="zh">四</div><div class="pinyin">sì</div></div>
  <div class="num-card"><div class="digit">5</div><div class="zh">五</div><div class="pinyin">wǔ</div></div>
  <div class="num-card"><div class="digit">6</div><div class="zh">六</div><div class="pinyin">liù</div></div>
  <div class="num-card"><div class="digit">7</div><div class="zh">七</div><div class="pinyin">qī</div></div>
  <div class="num-card"><div class="digit">8</div><div class="zh">八</div><div class="pinyin">bā</div></div>
  <div class="num-card"><div class="digit">9</div><div class="zh">九</div><div class="pinyin">jiǔ</div></div>
  <div class="num-card"><div class="digit">10</div><div class="zh">十</div><div class="pinyin">shí</div></div>
  <div class="num-card"><div class="digit">100</div><div class="zh">百</div><div class="pinyin">bǎi</div></div>
  <div class="num-card"><div class="digit">1000</div><div class="zh">千</div><div class="pinyin">qiān</div></div>
  <div class="num-card"><div class="digit">10,000</div><div class="zh">万</div><div class="pinyin">wàn</div></div>
  <div class="num-card"><div class="digit">100M</div><div class="zh">亿</div><div class="pinyin">yì</div></div>
</div>

<div class="tip"><strong>A lógica dos números:</strong> Os números de 11 a 99 são perfeitamente lógicos: 十一 (shíyī) = 10 + 1 = 11, 二十五 (èrshíwǔ) = 2 × 10 + 5 = 25, 三百六十五 (sānbǎi liùshíwǔ) = 365. Não há formas irregulares!</div>
<div class="warning"><strong>两 (liǎng) ou 二 (èr):</strong> Os dois querem dizer «dois», mas 两 (liǎng) usa-se para contar coisas (两个人 (liǎng ge rén) = 2 pessoas). 二 (èr) usa-se nos números (第二 (dì-èr) = segundo, 二十 (èrshí) = 20).</div>

<div class="grammar-box" style="margin-top:1.5rem">
  <h3>Dizer as horas</h3>
  <div class="formula">
    <span class="placeholder">[hora]</span> 点 (diǎn) <span class="placeholder">[minutos]</span> 分 (fēn) → [hora] horas e [minutos] minutos
  </div>
  <ul class="example-list">
    <li><span class="zh-ex">三点</span><span class="py-ex">sān diǎn</span><span class="en-ex">3 horas</span></li>
    <li><span class="zh-ex">三点半</span><span class="py-ex">sān diǎn bàn</span><span class="en-ex">3h30 (três e meia)</span></li>
    <li><span class="zh-ex">三点十五分</span><span class="py-ex">sān diǎn shíwǔ fēn</span><span class="en-ex">3:15</span></li>
    <li><span class="zh-ex">下午五点</span><span class="py-ex">xiàwǔ wǔ diǎn</span><span class="en-ex">17h (5 da tarde)</span></li>
    <li><span class="zh-ex">早上九点半</span><span class="py-ex">zǎoshang jiǔ diǎn bàn</span><span class="en-ex">9h30 (da manhã)</span></li>
  </ul>
</div>

</div><!-- /container -->

<?php require 'includes/fim.php'; ?>
