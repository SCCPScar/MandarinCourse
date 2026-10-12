<?php
// biblioteca.php
// Aqui eu escrevo o conteúdo da página «Biblioteca».
// O início (head e navegação) vem de includes/topo.php e o fim (rodapé e scripts) de includes/fim.php.

require 'includes/sessao.php';

$titulo = 'Biblioteca';
$pagina = 'biblioteca';
require 'includes/topo.php';
?>
<?= cabeca_pagina('Biblioteca', '图书馆', 'túshūguǎn', 'Recursos gratuitos e legais para continuares a aprender fora do Chá, organizados por nível.', 'ouro') ?>
<div class="container">

<!-- ============================================================ -->
<!-- BIBLIOTECA GRATUITA -->
<!-- ============================================================ -->
<div class="section-header anchor" id="library">
  <div class="section-num">1</div>
  <h2>Biblioteca gratuita: manuais e materiais reais <span class="zh">免费资源库</span> <span class="section-header__py">miǎnfèi zīyuánkù</span></h2>
</div>
<p class="section-intro">Todos estes recursos são gratuitos e legais. Carrega num link para abrir no browser ou descarregar. Estão organizados do nível iniciante ao avançado. As listas do HSK seguem o formato antigo (HSK 2.0).</p>

<!-- Estilos dos cartões da biblioteca -->
<!-- PRINCIPIANTE -->
<div class="lib-section lib-section--iniciante">
  <h3>Iniciante: do zero ao HSK 2</h3>
  <div class="lib-grid">

    <div class="lib-card">
      <i class="i i-caderno lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Curso básico de mandarim do FSI</div>
      <div class="lib-desc">O curso completo do Foreign Service Institute dos EUA, usado para formar diplomatas. É do domínio público e está guardado no Internet Archive: os manuais em PDF e as gravações em áudio estão em páginas separadas. Está em inglês.</div>
      <div class="lib-tags"><span class="lib-tag tag-pdf">PDF</span><span class="lib-tag tag-audio">Áudio</span></div>
      <a class="lib-btn" href="https://archive.org/details/FSI-StandardChinese-StudentTexts" target="_blank" rel="noopener">Abrir os manuais</a>
      <a class="lib-btn secondary" href="https://archive.org/details/FSIStandardChinese" target="_blank" rel="noopener" style="margin-top:4px">Ouvir os áudios</a>
    </div>

    <div class="lib-card">
      <i class="i i-livro lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Lista de vocabulário do HSK 1</div>
      <div class="lib-desc">A lista oficial do HSK 1, com as 150 palavras que tens de saber. Está no Wiktionary, com o pinyin e a tradução em inglês de cada palavra. Estuda estas primeiro.</div>
      <div class="lib-tags"><span class="lib-tag tag-web">Site</span></div>
      <a class="lib-btn" href="https://en.wiktionary.org/wiki/Appendix:HSK_list_of_Mandarin_words_v2.0/level_1" target="_blank" rel="noopener">Ver a lista</a>
    </div>

    <div class="lib-card">
      <i class="i i-livro lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Lista de vocabulário do HSK 2</div>
      <div class="lib-desc">A lista oficial do HSK 2, com mais 150 palavras (300 no total). Com elas já consegues ter conversas simples do dia a dia.</div>
      <div class="lib-tags"><span class="lib-tag tag-web">Site</span></div>
      <a class="lib-btn" href="https://en.wiktionary.org/wiki/Appendix:HSK_list_of_Mandarin_words_v2.0/level_2" target="_blank" rel="noopener">Ver a lista</a>
    </div>

    <div class="lib-card">
      <i class="i i-jogar lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Yoyo Chinese: vídeos para iniciantes</div>
      <div class="lib-desc">O canal de YouTube de Yangyang Cheng. Explicações muito claras, em inglês, ideais para quem está a começar. Fala do pinyin, dos tons e da gramática básica em centenas de vídeos gratuitos.</div>
      <div class="lib-tags"><span class="lib-tag tag-video">Vídeo</span></div>
      <a class="lib-btn" href="https://www.youtube.com/@yoyochinese" target="_blank" rel="noopener">Ver no YouTube</a>
    </div>

    <div class="lib-card">
      <i class="i i-teclado lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Aplicação HelloChinese (gratuita)</div>
      <div class="lib-desc">A melhor aplicação gratuita para começar, melhor do que o Duolingo para mandarim. Cobre o pinyin, os tons, mais de 1500 palavras e a gramática, organizada como um curso. Para iOS e Android.</div>
      <div class="lib-tags"><span class="lib-tag tag-app">Aplicação</span></div>
      <a class="lib-btn" href="https://www.hellochinese.cc/" target="_blank" rel="noopener">Instalar a aplicação</a>
    </div>

    <div class="lib-card">
      <i class="i i-livro lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Tabela interativa de pinyin (Purple Culture)</div>
      <div class="lib-desc">Carrega em cada sílaba do pinyin e ouve-a dita por um falante nativo. É a referência de pronúncia de pinyin gratuita mais completa na internet.</div>
      <div class="lib-tags"><span class="lib-tag tag-web">Site</span><span class="lib-tag tag-audio">Áudio</span></div>
      <a class="lib-btn" href="https://www.purpleculture.net/chinese-pinyin-chart/" target="_blank" rel="noopener">Abrir a tabela</a>
    </div>

    <div class="lib-card">
      <i class="i i-teclado lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Anki com baralhos do HSK (cartões gratuitos)</div>
      <div class="lib-desc">O Anki é o sistema de cartões com revisão espaçada mais conhecido do mundo, e é gratuito. No AnkiWeb há baralhos do HSK feitos por outros alunos: escolhe um com boas avaliações para treinar o vocabulário com áudio e caracteres.</div>
      <div class="lib-tags"><span class="lib-tag tag-app">Aplicação</span></div>
      <a class="lib-btn" href="https://ankiweb.net/shared/decks/HSK" target="_blank" rel="noopener">Ver os baralhos do HSK</a>
      <a class="lib-btn secondary" href="https://apps.ankiweb.net/" target="_blank" rel="noopener" style="margin-top:4px">Instalar o Anki</a>
    </div>

    <div class="lib-card">
      <i class="i i-ouvidos lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Coffee Break Chinese: podcast para iniciantes</div>
      <div class="lib-desc">Lições em áudio gratuitas, de 15 a 20 minutos, com a professora Crystal e o aluno Mark. Ela explica como a língua funciona, passo a passo. Ótimo para treinar a escuta desde o primeiro dia. Está em inglês.</div>
      <div class="lib-tags"><span class="lib-tag tag-audio">Áudio</span></div>
      <a class="lib-btn" href="https://coffeebreaklanguages.com/coffeebreakchinese/" target="_blank" rel="noopener">Começar a ouvir</a>
    </div>

  </div>
</div>

<!-- INTERMÉDIO -->
<div class="lib-section lib-section--intermedio">
  <h3>Intermédio: HSK 3 e HSK 4</h3>
  <div class="lib-grid">

    <div class="lib-card">
      <i class="i i-livro lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Lista de vocabulário do HSK 3</div>
      <div class="lib-desc">As 300 palavras novas oficiais do HSK 3 (600 no total). Neste nível já descreves experiências e emoções e resolves a maioria das situações do dia a dia.</div>
      <div class="lib-tags"><span class="lib-tag tag-web">Site</span></div>
      <a class="lib-btn" href="https://en.wiktionary.org/wiki/Appendix:HSK_list_of_Mandarin_words_v2.0/level_3" target="_blank" rel="noopener">Ver a lista</a>
    </div>

    <div class="lib-card">
      <i class="i i-livro lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Lista de vocabulário do HSK 4</div>
      <div class="lib-desc">Mais 600 palavras para o HSK 4 (1200 no total). É o nível em que consegues conversar sobre a maioria dos temas e lidar com muitas situações de trabalho.</div>
      <div class="lib-tags"><span class="lib-tag tag-web">Site</span></div>
      <a class="lib-btn" href="https://en.wiktionary.org/wiki/Appendix:HSK_list_of_Mandarin_words_v2.0/level_4" target="_blank" rel="noopener">Ver a lista</a>
    </div>

    <div class="lib-card">
      <i class="i i-livro lib-icone" aria-hidden="true"></i>
      <div class="lib-title">AllSet Learning: Chinese Grammar Wiki</div>
      <div class="lib-desc">A referência gratuita de gramática de mandarim mais completa, em inglês. Cada estrutura é explicada com exemplos e organizada por nível (do A1 ao C1). Guarda-a nos favoritos.</div>
      <div class="lib-tags"><span class="lib-tag tag-web">Site</span></div>
      <a class="lib-btn" href="https://resources.allsetlearning.com/chinese/grammar/" target="_blank" rel="noopener">Abrir a Grammar Wiki</a>
    </div>

    <div class="lib-card">
      <i class="i i-jogar lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Mandarin Corner: vídeos de nível intermédio</div>
      <div class="lib-desc">Um ótimo canal de YouTube com entrevistas reais na rua, chinês falado devagar e lições de nível intermédio. Excelente para habituar o ouvido ao mandarim verdadeiro.</div>
      <div class="lib-tags"><span class="lib-tag tag-video">Vídeo</span></div>
      <a class="lib-btn" href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Ver no YouTube</a>
    </div>

    <div class="lib-card">
      <i class="i i-teclado lib-icone" aria-hidden="true"></i>
      <div class="lib-title">DU Chinese: leituras por nível (versão gratuita)</div>
      <div class="lib-desc">Lê textos reais em chinês adaptados ao teu nível. A versão gratuita tem dezenas de histórias, do nível iniciante ao intermédio. Ler é uma das formas mais rápidas de aprender vocabulário.</div>
      <div class="lib-tags"><span class="lib-tag tag-app">Aplicação</span><span class="lib-tag tag-web">Site</span></div>
      <a class="lib-btn" href="https://www.duchinese.net/" target="_blank" rel="noopener">Começar a ler</a>
    </div>

    <div class="lib-card">
      <i class="i i-teclado lib-icone" aria-hidden="true"></i>
      <div class="lib-title">HelloTalk: aplicação de intercâmbio de línguas</div>
      <div class="lib-desc">Fala com nativos de mandarim que querem aprender a tua língua, por texto, voz ou vídeo, de graça. A melhor forma gratuita de praticar conversas reais com pessoas reais.</div>
      <div class="lib-tags"><span class="lib-tag tag-app">Aplicação</span></div>
      <a class="lib-btn" href="https://www.hellotalk.com/" target="_blank" rel="noopener">Encontrar um parceiro</a>
    </div>

    <div class="lib-card">
      <i class="i i-livro lib-icone" aria-hidden="true"></i>
      <div class="lib-title">HSK Academy: testes de treino gratuitos</div>
      <div class="lib-desc">Exames de treino gratuitos, no estilo oficial, do HSK 1 ao 6. Vês a tua pontuação e descobres os pontos fracos. A melhor forma gratuita de medir o teu nível.</div>
      <div class="lib-tags"><span class="lib-tag tag-web">Site</span></div>
      <a class="lib-btn" href="https://hsk.academy/" target="_blank" rel="noopener">Fazer um teste</a>
    </div>

  </div>
</div>

<!-- AVANÇADO E TRABALHO -->
<div class="lib-section lib-section--avancado">
  <h3>Avançado e profissional: HSK 5 e HSK 6</h3>
  <div class="lib-grid">

    <div class="lib-card">
      <i class="i i-livro lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Lista de vocabulário do HSK 5</div>
      <div class="lib-desc">Mais 1300 palavras para o HSK 5 (2500 no total). É o nível profissional: consegues ler jornais, escrever e-mails de trabalho e participar em reuniões em chinês.</div>
      <div class="lib-tags"><span class="lib-tag tag-web">Site</span></div>
      <a class="lib-btn" href="https://en.wiktionary.org/wiki/Appendix:HSK_list_of_Mandarin_words_v2.0/level_5" target="_blank" rel="noopener">Ver a lista</a>
    </div>

    <div class="lib-card">
      <i class="i i-livro lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Lista de vocabulário do HSK 6</div>
      <div class="lib-desc">Mais 2500 palavras para o HSK 6 (5000 no total). Um nível quase nativo: debates, escreves textos académicos e percebes televisão sem legendas.</div>
      <div class="lib-tags"><span class="lib-tag tag-web">Site</span></div>
      <a class="lib-btn" href="https://en.wiktionary.org/wiki/Appendix:HSK_list_of_Mandarin_words_v2.0/level_6" target="_blank" rel="noopener">Ver a lista</a>
    </div>

    <div class="lib-card">
      <i class="i i-livro lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Diário do Povo (人民日报), edição online</div>
      <div class="lib-desc">O principal jornal da China, gratuito na internet. Ler notícias todos os dias é um dos melhores treinos avançados: vocabulário, frases e temas reais, dos que vais discutir no trabalho.</div>
      <div class="lib-tags"><span class="lib-tag tag-web">Site</span></div>
      <a class="lib-btn" href="http://www.people.com.cn/" target="_blank" rel="noopener">Ler as notícias</a>
    </div>

    <div class="lib-card">
      <i class="i i-jogar lib-icone" aria-hidden="true"></i>
      <div class="lib-title">CCTV: televisão chinesa gratuita online</div>
      <div class="lib-desc">Vê televisão chinesa em direto ou quando quiseres, de graça: notícias, documentários e programas. É imersão total. Começa pelas notícias do CCTV-1.</div>
      <div class="lib-tags"><span class="lib-tag tag-video">Vídeo</span></div>
      <a class="lib-btn" href="https://tv.cctv.com/" target="_blank" rel="noopener">Ver a CCTV</a>
    </div>

    <div class="lib-card">
      <i class="i i-teclado lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Dicionário Pleco (aplicação gratuita)</div>
      <div class="lib-desc">A aplicação de dicionário de chinês gratuita mais completa. Procuras caracteres a desenhá-los, com a câmara ou pelo pinyin. Tem a ordem dos traços, frases de exemplo e áudio. Indispensável.</div>
      <div class="lib-tags"><span class="lib-tag tag-app">Aplicação</span></div>
      <a class="lib-btn" href="https://www.pleco.com/" target="_blank" rel="noopener">Instalar o Pleco</a>
    </div>

    <div class="lib-card">
      <i class="i i-jogar lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Bilibili (哔哩哔哩): plataforma de vídeos chinesa</div>
      <div class="lib-desc">A maior plataforma de vídeos da China, parecida com o YouTube. Milhões de vídeos em chinês sobre todos os temas: jogos, culinária, viagens, ciência. Vê o que gostas e aprende sem dar por isso.</div>
      <div class="lib-tags"><span class="lib-tag tag-video">Vídeo</span></div>
      <a class="lib-btn" href="https://www.bilibili.com/" target="_blank" rel="noopener">Abrir o Bilibili</a>
    </div>

    <div class="lib-card">
      <i class="i i-livro lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Leitura em chinês (Mandarin Bean)</div>
      <div class="lib-desc">Artigos gratuitos por nível, do iniciante ao avançado. Cada artigo tem pinyin, lista de vocabulário e perguntas de compreensão. Ótimos para treinar a leitura com método.</div>
      <div class="lib-tags"><span class="lib-tag tag-web">Site</span></div>
      <a class="lib-btn" href="https://mandarinbean.com/" target="_blank" rel="noopener">Ler os artigos</a>
    </div>

    <div class="lib-card">
      <i class="i i-teclado lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Skritter: escrever caracteres (versão gratuita)</div>
      <div class="lib-desc">Aprende a escrever caracteres com a ordem certa dos traços. A aplicação ensina e testa a tua escrita. A versão gratuita tem os caracteres iniciais, o suficiente para começar bem.</div>
      <div class="lib-tags"><span class="lib-tag tag-app">Aplicação</span></div>
      <a class="lib-btn" href="https://skritter.com/" target="_blank" rel="noopener">Praticar a escrita</a>
    </div>

  </div>
</div>

<!-- FERRAMENTAS DE CONSULTA -->
<div class="lib-section lib-section--ferramentas">
  <h3>Ferramentas para todos os dias</h3>
  <div class="lib-grid">

    <div class="lib-card">
      <i class="i i-livro lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Dicionário MDBG</div>
      <div class="lib-desc">O melhor dicionário gratuito de chinês e inglês na internet. Procura caracteres, palavras ou pinyin. Mostra a ordem dos traços, os radicais, o nível do HSK e frases de exemplo. Guarda-o nos favoritos.</div>
      <div class="lib-tags"><span class="lib-tag tag-web">Site</span></div>
      <a class="lib-btn" href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">Abrir o dicionário</a>
    </div>

    <div class="lib-card">
      <i class="i i-livro lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Yellowbridge: explorar caracteres</div>
      <div class="lib-desc">Procura qualquer caractere e vê os radicais, a origem, a animação dos traços, as palavras relacionadas e a frequência. Ajuda-te a perceber PORQUE é que os caracteres são como são.</div>
      <div class="lib-tags"><span class="lib-tag tag-web">Site</span></div>
      <a class="lib-btn" href="https://www.yellowbridge.com/chinese/" target="_blank" rel="noopener">Explorar caracteres</a>
    </div>

    <div class="lib-card">
      <i class="i i-livro lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Tatoeba: frases de exemplo</div>
      <div class="lib-desc">Uma base de dados gratuita e aberta, com milhares de frases em chinês escritas por falantes nativos, muitas com tradução para português. Procura uma palavra e vês como se usa numa frase verdadeira.</div>
      <div class="lib-tags"><span class="lib-tag tag-web">Site</span><span class="lib-tag tag-audio">Áudio</span></div>
      <a class="lib-btn" href="https://tatoeba.org/" target="_blank" rel="noopener">Procurar exemplos</a>
    </div>

    <div class="lib-card">
      <i class="i i-teclado lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Google Tradutor: escrever em chinês</div>
      <div class="lib-desc">Usa a escrita à mão para desenhar caracteres que não conheces, ou cola um texto em chinês e toca em cada palavra para ver o significado. Não serve para aprender, mas ajuda quando ficas encalhado.</div>
      <div class="lib-tags"><span class="lib-tag tag-app">Aplicação</span><span class="lib-tag tag-web">Site</span></div>
      <a class="lib-btn" href="https://translate.google.com/?sl=zh-CN&tl=en" target="_blank" rel="noopener">Abrir o Tradutor</a>
    </div>

    <div class="lib-card">
      <i class="i i-livro lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Conversor de pinyin (online)</div>
      <div class="lib-desc">Cola qualquer texto em chinês e recebe logo o pinyin com os acentos. Útil quando encontras um texto novo e queres saber a pronúncia antes de aprender os caracteres.</div>
      <div class="lib-tags"><span class="lib-tag tag-web">Site</span></div>
      <a class="lib-btn" href="https://www.chineseconverter.com/en/convert/chinese-to-pinyin" target="_blank" rel="noopener">Converter para pinyin</a>
    </div>

    <div class="lib-card">
      <i class="i i-livro lib-icone" aria-hidden="true"></i>
      <div class="lib-title">Os quatro tons de cada sílaba (Arch Chinese)</div>
      <div class="lib-desc">Uma tabela com todas as sílabas do pinyin. Carrega numa sílaba para veres os tons que ela tem e depois carrega em cada tom para o ouvires. Repete em voz alta a seguir. Para te gravares e comparares, usa a secção Praticar do Chá.</div>
      <div class="lib-tags"><span class="lib-tag tag-web">Site</span><span class="lib-tag tag-audio">Áudio</span></div>
      <a class="lib-btn" href="https://www.archchinese.com/chinese_pinyin.html" target="_blank" rel="noopener">Ouvir os tons</a>
    </div>

  </div>
</div>

<!-- PERCURSO RECOMENDADO -->
<div class="grammar-box" style="border-left-color: var(--gold);">
  <h3>Um dia de estudo com estes recursos</h3>
  <div class="table-wrap">
  <table class="phrase-table">
    <tr><th>Quando</th><th>Atividade</th><th>Recurso</th><th>Duração</th></tr>
    <tr><td>Manhã</td><td>Rever os cartões</td><td>Anki (baralho do HSK)</td><td>20 min</td></tr>
    <tr><td>Manhã</td><td>Lição nova</td><td>HelloChinese ou Coffee Break Chinese</td><td>20 min</td></tr>
    <tr><td>Tarde</td><td>Estudar gramática</td><td>Grammar Wiki da AllSet Learning</td><td>15 min</td></tr>
    <tr><td>Tarde</td><td>Treinar a leitura</td><td>DU Chinese ou Mandarin Bean</td><td>15 min</td></tr>
    <tr><td>Noite</td><td>Ouvir e ver</td><td>Mandarin Corner ou CCTV</td><td>20 min</td></tr>
    <tr><td>Noite</td><td>Treinar a fala</td><td>HelloTalk com um nativo</td><td>15 min</td></tr>
    <tr><td>Sempre que precisares</td><td>Procurar palavras</td><td>Pleco e MDBG</td><td>Quando for preciso</td></tr>
  </table>
  </div>
</div>

</div><!-- /container -->

<?php require 'includes/fim.php'; ?>
