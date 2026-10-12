<?php
// gramatica.php
// Aqui eu mostro as 10 estruturas de gramática essenciais do mandarim.
// Antes estavam no fim da página Básico; os testers acharam (e bem) que a gramática merece uma página só sua.

require 'includes/sessao.php';

$titulo = 'Gramática';
$pagina = 'gramatica';
require 'includes/topo.php';
?>
<?= cabeca_pagina('Gramática', '语法', 'yǔfǎ', 'As 10 estruturas que te deixam dizer milhares de coisas. A gramática do mandarim tem regras de ordem das palavras muito fixas: quando conheces as estruturas, basta trocar o vocabulário.', 'ameixa') ?>

<div class="container">

<div class="section-header anchor" id="grammar">
  <div class="section-num">1</div>
  <h2>As 10 estruturas essenciais <span class="zh">基本句型</span> <span class="section-header__py">jīběn jùxíng</span></h2>
</div>
<p class="section-intro">Estuda uma estrutura de cada vez, pela ordem. Carrega em qualquer frase em chinês para a ouvires.</p>

<!-- Índice: salta direto para a estrutura que queres rever -->
<nav class="indice" aria-label="Estruturas">
  <ol>
    <li><a href="#estrutura-1">a frase básica (sujeito + verbo + objeto)</a></li>
    <li><a href="#estrutura-2">是 (shì), o «ser» com nomes</a></li>
    <li><a href="#estrutura-3">有 (yǒu), «ter» e «haver»</a></li>
    <li><a href="#estrutura-4">negar com 不 (bù) e 没 (méi)</a></li>
    <li><a href="#estrutura-5">perguntas com 吗 (ma) e 呢 (ne)</a></li>
    <li><a href="#estrutura-6">的 (de), posse e descrição</a></li>
    <li><a href="#estrutura-7">想 (xiǎng), 要 (yào), 会 (huì), 能 (néng) e 可以 (kěyǐ), os verbos modais</a></li>
    <li><a href="#estrutura-8">o tempo na frase</a></li>
    <li><a href="#estrutura-9">os classificadores (量词 (liàngcí), liàngcí)</a></li>
    <li><a href="#estrutura-10">as partículas de aspeto 了 (le), 过 (guo) e 着 (zhe)</a></li>
  </ol>
</nav>

<div class="grammar-box anchor" id="estrutura-1">
  <h3>Estrutura 1: a frase básica (sujeito + verbo + objeto)</h3>
  <div class="formula"><span class="placeholder">Sujeito</span> + <span class="placeholder">Verbo</span> + <span class="placeholder">Objeto</span></div>
  <ul class="example-list">
    <li><span class="zh-ex">我爱你</span><span class="py-ex">wǒ ài nǐ</span><span class="en-ex">Amo-te</span></li>
    <li><span class="zh-ex">他喝茶</span><span class="py-ex">tā hē chá</span><span class="en-ex">Ele bebe chá</span></li>
    <li><span class="zh-ex">我们学中文</span><span class="py-ex">wǒmen xué Zhōngwén</span><span class="en-ex">Nós estudamos chinês</span></li>
    <li><span class="zh-ex">她吃米饭</span><span class="py-ex">tā chī mǐfàn</span><span class="en-ex">Ela come arroz</span></li>
  </ul>
</div>

<div class="grammar-box anchor" id="estrutura-2">
  <h3>Estrutura 2: 是 (shì), o «ser» com nomes</h3>
  <div class="formula"><span class="placeholder">Sujeito</span> + 是 (shì) + <span class="placeholder">Nome / identidade</span></div>
  <div class="tip" style="margin:8px 0">Não uses 是 (shì) com adjetivos! «Ela é bonita» = 她很漂亮 (tā hěn piàoliang) (e não 她是漂亮 (tā shì piàoliang))</div>
  <ul class="example-list">
    <li><span class="zh-ex">我是学生</span><span class="py-ex">wǒ shì xuésheng</span><span class="en-ex">Sou estudante</span></li>
    <li><span class="zh-ex">他是老师</span><span class="py-ex">tā shì lǎoshī</span><span class="en-ex">Ele é professor</span></li>
    <li><span class="zh-ex">我是葡萄牙人</span><span class="py-ex">wǒ shì Pútáoyárén</span><span class="en-ex">Sou português</span></li>
    <li><span class="zh-ex">这是我的书</span><span class="py-ex">zhè shì wǒ de shū</span><span class="en-ex">Este é o meu livro</span></li>
  </ul>
</div>

<div class="grammar-box anchor" id="estrutura-3">
  <h3>Estrutura 3: 有 (yǒu), «ter» e «haver»</h3>
  <div class="formula"><span class="placeholder">Sujeito</span> + 有 (yǒu) + <span class="placeholder">Objeto</span></div>
  <ul class="example-list">
    <li><span class="zh-ex">我有一个哥哥</span><span class="py-ex">wǒ yǒu yīgè gēge</span><span class="en-ex">Tenho um irmão mais velho</span></li>
    <li><span class="zh-ex">这里有厕所吗?</span><span class="py-ex">zhèlǐ yǒu cèsuǒ ma?</span><span class="en-ex">Há uma casa de banho aqui?</span></li>
    <li><span class="zh-ex">我没有钱</span><span class="py-ex">wǒ méiyǒu qián</span><span class="en-ex">Não tenho dinheiro</span></li>
    <li><span class="zh-ex">桌子上有书</span><span class="py-ex">zhuōzi shàng yǒu shū</span><span class="en-ex">Há livros em cima da mesa</span></li>
  </ul>
</div>

<div class="grammar-box anchor" id="estrutura-4">
  <h3>Estrutura 4: negar com 不 (bù) e 没 (méi)</h3>
  <div class="formula">不 bù = nega hábitos, estados e o futuro | 没 méi = nega o passado e ações terminadas</div>
  <ul class="example-list">
    <li><span class="zh-ex">我不喜欢</span><span class="py-ex">wǒ bù xǐhuān</span><span class="en-ex">Não gosto (em geral)</span></li>
    <li><span class="zh-ex">我不去</span><span class="py-ex">wǒ bú qù</span><span class="en-ex">Não vou (é uma decisão)</span></li>
    <li><span class="zh-ex">我没去</span><span class="py-ex">wǒ méi qù</span><span class="en-ex">Não fui (facto passado)</span></li>
    <li><span class="zh-ex">我没吃饭</span><span class="py-ex">wǒ méi chī fàn</span><span class="en-ex">Ainda não comi</span></li>
  </ul>
</div>

<div class="grammar-box anchor" id="estrutura-5">
  <h3>Estrutura 5: perguntas com 吗 (ma) e 呢 (ne)</h3>
  <div class="formula">Frase + 吗 (ma)? = pergunta de sim ou não | Frase + 呢 (ne)? = «E…?»</div>
  <ul class="example-list">
    <li><span class="zh-ex">你是老师吗?</span><span class="py-ex">nǐ shì lǎoshī ma?</span><span class="en-ex">És professor?</span></li>
    <li><span class="zh-ex">你去吗?</span><span class="py-ex">nǐ qù ma?</span><span class="en-ex">Vais?</span></li>
    <li><span class="zh-ex">我很好，你呢?</span><span class="py-ex">wǒ hěn hǎo, nǐ ne?</span><span class="en-ex">Estou bem, e tu?</span></li>
    <li><span class="zh-ex">这个呢?</span><span class="py-ex">zhège ne?</span><span class="en-ex">E este?</span></li>
  </ul>
</div>

<div class="grammar-box anchor" id="estrutura-6">
  <h3>Estrutura 6: 的 (de), posse e descrição</h3>
  <div class="formula"><span class="placeholder">Dono / descrição</span> + 的 (de) + <span class="placeholder">Coisa</span></div>
  <ul class="example-list">
    <li><span class="zh-ex">我的书</span><span class="py-ex">wǒ de shū</span><span class="en-ex">o meu livro</span></li>
    <li><span class="zh-ex">中国的文化</span><span class="py-ex">Zhōngguó de wénhuà</span><span class="en-ex">a cultura chinesa</span></li>
    <li><span class="zh-ex">漂亮的女孩</span><span class="py-ex">piàoliang de nǚhái</span><span class="en-ex">rapariga bonita</span></li>
    <li><span class="zh-ex">他买的东西</span><span class="py-ex">tā mǎi de dōngxi</span><span class="en-ex">as coisas que ele comprou</span></li>
  </ul>
</div>

<div class="grammar-box anchor" id="estrutura-7">
  <h3>Estrutura 7: 想 (xiǎng), 要 (yào), 会 (huì), 能 (néng) e 可以 (kěyǐ), os verbos modais</h3>
  <div class="formula"><span class="placeholder">Sujeito</span> + [modal] + <span class="placeholder">Verbo</span></div>
  <ul class="example-list">
    <li><span class="zh-ex">我想去</span><span class="py-ex">wǒ xiǎng qù</span><span class="en-ex">Quero ir (desejo)</span></li>
    <li><span class="zh-ex">我要吃饭</span><span class="py-ex">wǒ yào chī fàn</span><span class="en-ex">Quero / preciso de comer (intenção)</span></li>
    <li><span class="zh-ex">我会说中文</span><span class="py-ex">wǒ huì shuō Zhōngwén</span><span class="en-ex">Sei falar chinês (capacidade aprendida)</span></li>
    <li><span class="zh-ex">我能来</span><span class="py-ex">wǒ néng lái</span><span class="en-ex">Posso vir (possibilidade ou autorização)</span></li>
    <li><span class="zh-ex">你可以走了</span><span class="py-ex">nǐ kěyǐ zǒu le</span><span class="en-ex">Já podes sair (autorização)</span></li>
  </ul>
</div>

<div class="grammar-box anchor" id="estrutura-8">
  <h3>Estrutura 8: o tempo na frase</h3>
  <div class="formula">Tempo → Sujeito → Lugar → Verbo → Objeto (o tempo também pode vir logo a seguir ao sujeito). Em português, o tempo e o lugar costumam ir para o fim da frase; em chinês vêm antes do verbo.</div>
  <ul class="example-list">
    <li><span class="zh-ex">昨天我在北京吃了北京烤鸭</span><span class="py-ex">Zuótiān wǒ zài Běijīng chī le Běijīng kǎoyā</span><span class="en-ex">Ontem comi pato à Pequim em Pequim</span></li>
    <li><span class="zh-ex">下午两点开会</span><span class="py-ex">xiàwǔ liǎng diǎn kāihuì</span><span class="en-ex">Reunião às 14h</span></li>
  </ul>
  <div class="tip" style="margin-top:8px"><i class="i i-relogio" aria-hidden="true"></i> <strong>Palavras de tempo:</strong> 今天 jīntiān (hoje) | 明天 míngtiān (amanhã) | 昨天 zuótiān (ontem) | 现在 xiànzài (agora) | 以前 yǐqián (antes) | 以后 yǐhòu (depois)</div>
</div>

<div class="grammar-box anchor" id="estrutura-9">
  <h3>Estrutura 9: os classificadores (量词 (liàngcí), liàngcí)</h3>
  <div class="formula"><span class="placeholder">Número</span> + <span class="placeholder">Classificador</span> + <span class="placeholder">Nome</span></div>
  <div class="warning" style="margin:8px 0">Não podes dizer «um livro» diretamente: precisas de um classificador. Diz-se 一本书 (yī běn shū), e não 一书 (yì shū).</div>
  <div class="table-wrap" style="margin-top:10px">
  <table class="phrase-table">
    <tr><th>Classificador</th><th>Pinyin</th><th>Usa-se para</th><th>Exemplo</th></tr>
    <tr><td class="zh-cell">个</td><td class="py-cell">gè</td><td>Geral (pessoas e coisas)</td><td>一个人 (yí ge rén) (uma pessoa), 两个苹果 (liǎng ge píngguǒ) (duas maçãs)</td></tr>
    <tr><td class="zh-cell">本</td><td class="py-cell">běn</td><td>Livros e cadernos</td><td>三本书 (sān běn shū) (três livros)</td></tr>
    <tr><td class="zh-cell">张</td><td class="py-cell">zhāng</td><td>Coisas planas (papel, mesas, caras)</td><td>一张纸 (yì zhāng zhǐ) (uma folha de papel)</td></tr>
    <tr><td class="zh-cell">条</td><td class="py-cell">tiáo</td><td>Coisas compridas e flexíveis (peixes, rios, estradas)</td><td>两条鱼 (liǎng tiáo yú) (dois peixes)</td></tr>
    <tr><td class="zh-cell">杯</td><td class="py-cell">bēi</td><td>Copos e chávenas de bebida</td><td>一杯水 (yì bēi shuǐ) (um copo de água)</td></tr>
    <tr><td class="zh-cell">件</td><td class="py-cell">jiàn</td><td>Peças de roupa e assuntos</td><td>一件事 (yí jiàn shì) (um assunto)</td></tr>
    <tr><td class="zh-cell">辆</td><td class="py-cell">liàng</td><td>Veículos</td><td>两辆车 (liǎng liàng chē) (dois carros)</td></tr>
    <tr><td class="zh-cell">只</td><td class="py-cell">zhī</td><td>Animais pequenos e uma peça de um par</td><td>三只猫 (sān zhī māo) (três gatos)</td></tr>
    <tr><td class="zh-cell">位</td><td class="py-cell">wèi</td><td>Pessoas (com respeito)</td><td>两位客人 (liǎng wèi kèrén) (dois convidados)</td></tr>
  </table>
  </div>
</div>

<div class="grammar-box anchor" id="estrutura-10">
  <h3>Estrutura 10: as partículas de aspeto 了 (le), 过 (guo) e 着 (zhe)</h3>
  <div class="formula">了 (le) le = ação terminada ou mudança | 过 guò = experiência passada | 着 (zhe) zhe = estado que continua</div>
  <ul class="example-list">
    <li><span class="zh-ex">我吃了</span><span class="py-ex">wǒ chī le</span><span class="en-ex">Comi / já comi (terminado)</span></li>
    <li><span class="zh-ex">我去过北京</span><span class="py-ex">wǒ qùguo Běijīng</span><span class="en-ex">Já estive em Pequim (experiência de vida)</span></li>
    <li><span class="zh-ex">他站着</span><span class="py-ex">tā zhàn zhe</span><span class="en-ex">Ele está de pé (posição que continua)</span></li>
    <li><span class="zh-ex">天气变冷了</span><span class="py-ex">tiānqì biàn lěng le</span><span class="en-ex">O tempo arrefeceu (mudança)</span></li>
  </ul>
</div>

</div><!-- /container -->

<?php require 'includes/fim.php'; ?>
