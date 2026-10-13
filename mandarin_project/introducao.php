<?php
// introducao.php
// Aqui eu escrevo o conteúdo da página «Introdução».
// O início (head e navegação) vem de includes/topo.php e o fim (rodapé e scripts) de includes/fim.php.

require 'includes/sessao.php';

$titulo = 'Introdução';
$pagina = 'introducao';
require 'includes/topo.php';
?>
<!-- TOPO (HERO) -->

<div id="streak-banner"><span id="streak-text"></span></div>
<div id="potd">
  <div class="potd-label"><i class="i i-hoje" aria-hidden="true"></i> Frase do dia</div>
  <div class="potd-zh" id="potd-zh">加油</div>
  <div class="potd-py" id="potd-py">jiā yóu</div>
  <div class="potd-en" id="potd-en">Força! Tu consegues!</div>
  <div class="potd-ex" id="potd-ex">考试加油！ Boa sorte no exame!</div>
  <button id="speak-potd" onclick="falar(document.getElementById('potd-zh').textContent)"><i class="i i-ouvir" aria-hidden="true"></i></button>
</div>

<section class="hero hero--foto">
  <div class="hero__texto">
  <h1>Introdução ao <span>mandarim</span></h1>
  <p>Antes de começares a rota, conhece a língua: como funciona, quanto tempo demora e que recursos gratuitos existem.</p>
  <div class="hero-stats">
    <div class="hero-stat"><div class="num">6</div><div class="label">Cidades</div></div>
    <div class="hero-stat"><div class="num">24</div><div class="label">Unidades</div></div>
    <div class="hero-stat"><div class="num">72</div><div class="label">Lições</div></div>
    <div class="hero-stat"><div class="num">523</div><div class="label">Palavras novas</div></div>
  </div>
  </div>
  <!-- Foto ao lado do texto (vertical, 4:5). No telemóvel fica por baixo, mais pequena. -->
  <figure class="hero__foto">
    <picture>
      <source type="image/avif" srcset="img/fotos/g3-sobre-640.avif 640w, img/fotos/g3-sobre-960.avif 960w" sizes="(max-width: 899px) 280px, 360px">
      <img src="img/fotos/g3-sobre-640.webp" srcset="img/fotos/g3-sobre-640.webp 640w, img/fotos/g3-sobre-960.webp 960w" sizes="(max-width: 899px) 280px, 360px" alt="Copo de chá com leite e pérolas de tapioca ao lado de um caderno e de um teclado" width="640" height="800">
    </picture>
    <figcaption>Foto: Kevin Canlas, Unsplash</figcaption>
  </figure>
</section>

<div id="progress-overview">
  <h2 class="ach-titulo"><i class="i i-certo" aria-hidden="true"></i> O teu progresso no vocabulário</h2>
  <p class="ach-texto">Quantas palavras de cada tema já aprendeste nos <a class="ach-link" href="praticar.php#tab-flash">cartões de memória do Praticar</a> (uma palavra conta quando a avalias como Razoável ou Fácil).</p>
  <div class="po-grid" id="po-grid"></div>
</div>

<!-- AS CONQUISTAS: medalhas que o aluno ganha ao estudar (o js/conquistas.js marca as que já ganhou) -->
<div id="achievements-bar">
  <div class="ach-topo">
    <h2 class="ach-titulo"><i class="i i-medalha" aria-hidden="true"></i> As tuas conquistas</h2>
    <p class="ach-texto">Ganhas uma medalha ao aprender palavras, fazer testes e estudar vários dias seguidos. As que já tens ficam douradas.</p>
  </div>
  <!-- Cada medalha diz o que é preciso fazer. Não são botões: só mudam de cor quando as ganhas. -->
  <ul class="medalhas">
    <li class="medalha" id="badge-start"><i class="i i-medalha" aria-hidden="true"></i><strong>Início</strong><span>Abriste o curso pela primeira vez</span><em class="medalha__estado">Por conquistar</em></li>
    <li class="medalha" id="badge-10"><i class="i i-medalha" aria-hidden="true"></i><strong>10 palavras</strong><span>Marca 10 palavras como aprendidas</span><em class="medalha__estado">Por conquistar</em></li>
    <li class="medalha" id="badge-50"><i class="i i-medalha" aria-hidden="true"></i><strong>50 palavras</strong><span>Marca 50 palavras como aprendidas</span><em class="medalha__estado">Por conquistar</em></li>
    <li class="medalha" id="badge-100"><i class="i i-medalha" aria-hidden="true"></i><strong>100 palavras</strong><span>Marca 100 palavras como aprendidas</span><em class="medalha__estado">Por conquistar</em></li>
    <li class="medalha" id="badge-streak3"><i class="i i-medalha" aria-hidden="true"></i><strong>3 dias</strong><span>Estuda 3 dias seguidos</span><em class="medalha__estado">Por conquistar</em></li>
    <li class="medalha" id="badge-streak7"><i class="i i-medalha" aria-hidden="true"></i><strong>7 dias</strong><span>Estuda 7 dias seguidos</span><em class="medalha__estado">Por conquistar</em></li>
    <li class="medalha" id="badge-streak30"><i class="i i-medalha" aria-hidden="true"></i><strong>30 dias</strong><span>Estuda 30 dias seguidos</span><em class="medalha__estado">Por conquistar</em></li>
    <li class="medalha" id="badge-quiz"><i class="i i-medalha" aria-hidden="true"></i><strong>Quiz</strong><span>Faz um quiz até ao fim</span><em class="medalha__estado">Por conquistar</em></li>
    <li class="medalha" id="badge-perfect"><i class="i i-medalha" aria-hidden="true"></i><strong>Perfeito</strong><span>Acerta todas as perguntas de um quiz</span><em class="medalha__estado">Por conquistar</em></li>
  </ul>
  <span class="ach-contagem" id="ach-count"></span>
</div>

<div class="container">

<!-- ============================================================ -->
<!-- MÓDULO 1: FUNDAMENTOS -->
<!-- ============================================================ -->
<div class="section-header anchor" id="foundations">
  <div class="section-num">1</div>
  <h2>Porquê mandarim? Uma visão geral <span class="zh">为什么学中文?</span> <span class="section-header__py">wèishénme xué zhōngwén?</span></h2>
</div>
<p class="section-intro">Antes de começar, vale a pena perceber como a língua funciona. O mandarim é lógico e regular: os verbos não se conjugam e não há género nem plural. As partes mais difíceis são os tons e os caracteres, mas as duas aprendem-se com o método certo.</p>

<div class="hsk-grid">
  <div class="hsk-card">
    <h3>HSK 1 e 2 (iniciante)</h3>
    <p><strong>150 a 300 palavras</strong></p>
    <p>Cumprimentos, números e objetos do dia a dia</p>
    <p>Duração: 2 a 3 meses</p>
  </div>
  <div class="hsk-card">
    <h3>HSK 3 e 4 (intermédio)</h3>
    <p><strong>600 a 1200 palavras</strong></p>
    <p>Manter conversas e falar do dia a dia</p>
    <p>Duração: 6 a 12 meses</p>
  </div>
  <div class="hsk-card">
    <h3>HSK 5 e 6 (avançado)</h3>
    <p><strong>2500 a 5000 palavras</strong></p>
    <p>Trabalhar, debater e ler jornais</p>
    <p>Duração: 1 ano e meio a 3 anos</p>
  </div>
  <div class="hsk-card">
    <h3><i class="i i-trofeu" aria-hidden="true"></i> Nível profissional</h3>
    <p><strong>Mais de 3000 palavras</strong></p>
    <p>Conversas de trabalho, e-mails e reuniões</p>
    <p>Objetivo a longo prazo: HSK 5</p>
  </div>
</div>

<div class="tip"><strong>Ideia-chave:</strong> Em muitos pontos, a gramática do mandarim é mais simples do que a portuguesa: não há tempos verbais (o contexto e as palavras de tempo fazem esse trabalho), não há artigos («o», «a», «um») nem terminações de plural. O teu esforço vai sobretudo para os tons, o vocabulário e, mais tarde, os caracteres.</div>

<!-- ============================================================ -->
<!-- MÓDULO 12: PLANO DE ESTUDO -->
<!-- ============================================================ -->
<div class="section-header anchor" id="plan">
  <div class="section-num">2</div>
  <h2>O teu plano de 12 meses <span class="zh">学习计划</span> <span class="section-header__py">xuéxí jìhuà</span></h2>
</div>
<p class="section-intro">Com 1 hora por dia, 6 dias por semana, a rota leva cerca de 12 meses. Com menos tempo por dia demora mais, e está tudo bem: estudar todos os dias vale mais do que estudar muito de uma vez.</p>

<div class="plan-grid">
  <div class="plan-card plan-card--selo">
    <h3>Meses 1 e 2 · Pequim 北京 <span class="py-inline">Běijīng</span></h3>
    <ul>
      <li>Os sons do pinyin e os 4 tons</li>
      <li>Cumprimentos, nome e nacionalidade</li>
      <li>Números, idade e família</li>
      <li>Datas e horas</li>
      <li>Cerca de 250 palavras e 100 caracteres</li>
    </ul>
  </div>
  <div class="plan-card plan-card--dourado">
    <h3>Meses 3 e 4 · Xi'an 西安 <span class="py-inline">Xī'ān</span></h3>
    <ul>
      <li>Pedir comida numa banca</li>
      <li>Perguntar preços e regatear</li>
      <li>Pedir e perceber direções</li>
      <li>Pagar com QR code</li>
      <li>Nível 1 do HSK 3.0 concluído</li>
    </ul>
  </div>
  <div class="plan-card plan-card--jade">
    <h3>Meses 5 e 6 · Chengdu 成都 <span class="py-inline">Chéngdū</span></h3>
    <ul>
      <li>Falar da tua rotina</li>
      <li>Gostos e tempo livre</li>
      <li>Fazer convites e combinar planos</li>
      <li>O tempo e as mensagens</li>
      <li>Cerca de 850 palavras</li>
    </ul>
  </div>
  <div class="plan-card plan-card--azul">
    <h3>Meses 7 e 8 · Guilin 桂林 <span class="py-inline">Guìlín</span></h3>
    <ul>
      <li>Comprar bilhetes de comboio</li>
      <li>Fazer o check-in no hotel</li>
      <li>Descrever lugares</li>
      <li>Pedir ajuda numa emergência</li>
      <li>Nível 2 do HSK 3.0 concluído</li>
    </ul>
  </div>
  <div class="plan-card plan-card--ameixa">
    <h3>Meses 9 e 10 · Hangzhou 杭州 <span class="py-inline">Hángzhōu</span></h3>
    <ul>
      <li>Comparar coisas</li>
      <li>Contar o que aconteceu</li>
      <li>Dar e justificar a tua opinião</li>
      <li>Compras online e serviços</li>
      <li>Cerca de 1750 palavras</li>
    </ul>
  </div>
  <div class="plan-card plan-card--tinta">
    <h3>Meses 11 e 12 · Xangai 上海 <span class="py-inline">Shànghǎi</span></h3>
    <ul>
      <li>Casa, banco e serviços</li>
      <li>O vocabulário do trabalho</li>
      <li>Uma entrevista de emprego simples</li>
      <li>Ler sinais, ementas e notícias simples</li>
      <li>Nível 3 do HSK 3.0 concluído</li>
    </ul>
  </div>
  <div class="plan-card plan-card--cinzento">
    <h3>Um dia normal (1 hora)</h3>
    <ul>
      <li>15 a 20 min: uma lição nova</li>
      <li>15 min: revisão espaçada</li>
      <li>20 a 25 min: caracteres, escuta ou pronúncia</li>
      <li>Ao sábado: revisão geral da semana e pronúncia</li>
      <li>Ao domingo: descanso</li>
    </ul>
  </div>
</div>

<div class="grammar-box grammar-box--dourada grammar-box--afastada">
  <h3>Recursos gratuitos</h3>
  <p class="texto-cinzento">Carrega no nome para abrires o site ou a aplicação (abre num separador novo). Há mais recursos na <a href="biblioteca.php">Biblioteca</a>.</p>
  <ul class="lista-espacada">
    <li><strong><a href="https://www.hellochinese.cc/" target="_blank" rel="noopener">HelloChinese</a></strong> (aplicação): a melhor aplicação gratuita para começar, com ótimo treino de pinyin</li>
    <li><strong><a href="https://www.duolingo.com/" target="_blank" rel="noopener">Duolingo Chinese</a></strong> (aplicação): boa para criar o hábito diário e rever vocabulário</li>
    <li><strong><a href="https://apps.ankiweb.net/" target="_blank" rel="noopener">Anki</a></strong> (aplicação e site): cartões de memória gratuitos; há baralhos do HSK no AnkiWeb</li>
    <li><strong><a href="https://coffeebreaklanguages.com/coffeebreakchinese/" target="_blank" rel="noopener">Coffee Break Chinese</a></strong> (podcast): lições em áudio gratuitas para iniciantes</li>
    <li><strong><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a></strong> (YouTube): ótimo para treinar a escuta nos níveis intermédio e avançado</li>
    <li><strong><a href="https://hsk.academy/" target="_blank" rel="noopener">HSK Online</a></strong> (hsk.academy): testes de treino do HSK gratuitos</li>
    <li><strong><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a></strong> (aplicação): o melhor dicionário de chinês gratuito, com pesquisa de caracteres</li>
    <li><strong><a href="https://www.tandem.net/" target="_blank" rel="noopener">Tandem</a> / <a href="https://www.hellotalk.com/" target="_blank" rel="noopener">HelloTalk</a></strong> (aplicação): encontra falantes nativos para trocar conversas</li>
    <li><strong><a href="https://news.cctv.com/" target="_blank" rel="noopener">CCTV 新闻 (xīnwén)</a></strong>: notícias da televisão chinesa online, gratuitas (avançado)</li>
    <li><strong><a href="https://skritter.com/" target="_blank" rel="noopener">Skritter</a></strong> (skritter.com): treino da ordem dos traços (tem versão gratuita)</li>
    <li><strong><a href="https://resources.allsetlearning.com/chinese/grammar/" target="_blank" rel="noopener">Chinese Grammar Wiki</a></strong> (resources.allsetlearning.com): referência de gramática gratuita</li>
    <li><strong><a href="https://www.bilibili.com/" target="_blank" rel="noopener">Bilibili</a></strong> (bilibili.com): plataforma de vídeos chinesa, parecida com o YouTube. Ótima para imersão!</li>
  </ul>
</div>

<div class="tip">
  <strong>A regra número 1:</strong> <em>Fala desde o primeiro dia.</em> Mesmo que erres os tons, mesmo que a gramática saia torta, fala. Os chineses valorizam muito qualquer esforço e vão ajudar-te. O maior erro de quem aprende é esperar até estar «pronto» para falar. Já estás pronto. 加油！(jiāyóu: à letra «pôr óleo», quer dizer «força, tu consegues!»)
</div>

</div><!-- /container -->

<?php require 'includes/fim.php'; ?>
