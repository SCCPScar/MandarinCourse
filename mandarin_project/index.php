<?php
// index.php
// Aqui eu mostro a página inicial do Chá. Ela explica o site a quem chega:
// 1) o topo, com a imagem da mesa de chá e o botão para começar (ou continuar);
// 2) o painel do aluno, se tiver sessão iniciada;
// 3) porque é que o site se chama Chá;
// 4) porque é que o site existe e em que princípios assenta;
// 5) se o mandarim é difícil;
// 6) porque escolher o Chá.
// A rota das cidades tem a sua própria página: rota.php.

require 'includes/sessao.php';
require 'includes/ligacao.php';

// Se houver sessão, eu vou buscar o nome do aluno, os dias seguidos e as lições feitas
$aluno = null;
$proxima = null;
if (id_utilizador() !== null) {
    $consulta = $pdo->prepare('
        SELECT u.nome, u.sequencia_dias,
               (SELECT COUNT(*) FROM progresso p WHERE p.utilizador_id = u.id) AS feitas
        FROM utilizadores u
        WHERE u.id = ?
    ');
    $consulta->execute([id_utilizador()]);
    $aluno = $consulta->fetch();

    // A próxima lição: a primeira, pela ordem da rota, que o aluno ainda não fez
    $consulta = $pdo->prepare('
        SELECT l.id, l.titulo
        FROM licoes l
        JOIN unidades u ON u.id = l.unidade_id
        WHERE l.id NOT IN (SELECT licao_id FROM progresso WHERE utilizador_id = ?)
        ORDER BY u.cidade_id, u.codigo, l.ordem
        LIMIT 1
    ');
    $consulta->execute([id_utilizador()]);
    $proxima = $consulta->fetch();
}

$titulo = 'Aprende mandarim na hora do chá';
$pagina = 'inicio';
$css_extra = ['inicio'];
require 'includes/topo.php';
?>

  <!-- 1. TOPO -->
  <!-- O texto fica à esquerda e a imagem num cartão à direita. No telemóvel o cartão passa para baixo. -->
  <section class="hero-cha hero-cha--cartao">
    <div class="hero-cha__texto">
      <p class="hero-cha__antes">Curso de mandarim gratuito, em português de Portugal</p>
      <h1>Aprende chinês na hora do chá</h1>
      <p>Cada lição demora cerca de 15 minutos: o tempo de beber uma chávena de chá. Lição a lição, segues uma rota de 12 meses por 6 cidades da China, do primeiro 你好 (nǐ hǎo) até ao nível 3 do HSK.</p>
      <?php if ($aluno && $proxima): ?>
        <a class="botao-cha" href="licao.php?id=<?= (int) $proxima['id'] ?>">Continuar: <?= e($proxima['titulo']) ?></a>
        <a class="botao-cha botao-cha--claro" href="rota.php">Ver a rota</a>
      <?php elseif ($aluno): ?>
        <a class="botao-cha" href="rota.php">Ver a rota</a>
      <?php else: ?>
        <a class="botao-cha" href="cidade.php?id=1">Começar em Pequim</a>
        <a class="botao-cha botao-cha--claro" href="rota.php">Ver a rota</a>
      <?php endif; ?>
    </div>

    <figure class="hero-cha__cartao">
      <picture>
        <source type="image/avif" srcset="img/fotos/hero-cartao-480.avif 480w, img/fotos/hero-cartao-928.avif 928w" sizes="(max-width: 767.98px) 80vw, 420px">
        <img src="img/fotos/hero-cartao-480.webp" srcset="img/fotos/hero-cartao-480.webp 480w, img/fotos/hero-cartao-928.webp 928w" sizes="(max-width: 767.98px) 80vw, 420px"
             width="928" height="1152" alt="Mesa de chá com um livro aberto, taças de porcelana verde, um bule de barro e uma pintura de montanhas ao fundo" fetchpriority="high">
      </picture>
      <figcaption>Imagem gerada com IA (Google Gemini)</figcaption>
    </figure>
  </section>

  <!-- 2. PAINEL DO ALUNO (só com sessão iniciada) -->
  <?php if ($aluno): ?>
    <section class="painel">
      <p class="painel__ola">Olá, <?= e($aluno['nome']) ?>!</p>
      <ul class="painel__numeros">
        <li><i class="i i-dias" aria-hidden="true"></i> <strong><?= (int) $aluno['sequencia_dias'] ?></strong> dias seguidos</li>
        <li><i class="i i-certo" aria-hidden="true"></i> <strong><?= (int) $aluno['feitas'] ?></strong> lições feitas</li>
      </ul>
      <a href="conta.php">A minha conta</a>
    </section>
  <?php endif; ?>

  <!-- 3. PORQUÊ «CHÁ» -->
  <section class="sobre sobre--nome">
    <div class="sobre__dentro sobre__dentro--duas">
      <div class="sobre__carimbo">
        <span class="sobre__zh zh-ex" lang="zh-CN">茶</span>
        <span class="sobre__py">chá</span>
        <?= botoes_ouvir('茶', 'chá') ?>
      </div>
      <div>
        <h2>Porquê «Chá»?</h2>
        <p>Porque a ideia do site é aprender um pouco todos os dias, no tempo de um chá. Não precisas de horas seguidas: precisas de voltar amanhã.</p>
        <p>E porque o chá liga as duas línguas. A palavra portuguesa «chá» veio do chinês 茶 (chá), trazida de Macau pelos portugueses no século XVI. Por isso dizemos «chá», como em Pequim, enquanto os ingleses dizem «tea», de «te», a forma usada na província de Fujian, no sul da China.</p>
        <p>Na rota vais passar por Chengdu, a cidade das casas de chá (茶馆, cháguǎn), onde as pessoas passam a tarde a conversar sem pressa. É esse o ritmo que queremos para ti.</p>
      </div>
    </div>
  </section>

  <!-- 4. PORQUE É QUE O SITE EXISTE -->
  <section class="sobre">
    <div class="sobre__dentro">
      <h2>Porque é que o Chá existe</h2>
      <p class="sobre__intro">Quase todos os cursos de mandarim estão em inglês ou em português do Brasil, e muitos são pagos ou estão cheios de anúncios. Quem vive em Portugal e quer começar acaba a saltar entre aplicações, vídeos e listas soltas, sem saber o que estudar a seguir. O Chá junta tudo num caminho só, gratuito e na nossa língua.</p>

      <ul class="principios">
        <li class="principio">
          <i class="i i-relogio" aria-hidden="true"></i>
          <h3>Pouco, mas todos os dias</h3>
          <p>Lições de 15 minutos e revisões curtas. A memória trabalha melhor com repetição espaçada do que com maratonas.</p>
        </li>
        <li class="principio">
          <i class="i i-ouvir" aria-hidden="true"></i>
          <h3>Ouvir antes de escrever</h3>
          <p>Todo o chinês do site se pode ouvir, à velocidade normal ou devagar. Primeiro os sons e os tons, depois os caracteres.</p>
        </li>
        <li class="principio">
          <i class="i i-mapa" aria-hidden="true"></i>
          <h3>Situações reais</h3>
          <p>Cada cidade da rota ensina o que farias lá: pedir comida em Xi'an, apanhar o comboio em Guilin, ir a uma entrevista em Xangai.</p>
        </li>
        <li class="principio">
          <i class="i i-conta" aria-hidden="true"></i>
          <h3>Gratuito e sem anúncios</h3>
          <p>Não pagas nada e não há publicidade. Só pedimos o nome e o e-mail se quiseres guardar o progresso, e podes apagar a conta quando quiseres.</p>
        </li>
      </ul>
    </div>
  </section>

  <!-- 5. É DIFÍCIL? -->
  <section class="sobre sobre--escuro">
    <div class="sobre__dentro">
      <h2>O mandarim é difícil?</h2>
      <p class="sobre__intro">Sejamos honestos: é uma das línguas que mais tempo leva a aprender para quem fala português. O Instituto do Serviço Exterior dos EUA (FSI), que forma diplomatas, põe o mandarim no grupo mais difícil, com cerca de 2200 horas de aulas para chegar a um nível profissional. Mas nem tudo é difícil.</p>
      <div class="dificil">
        <div class="dificil__coluna dificil__coluna--facil">
          <h3>O que é mais fácil do que parece</h3>
          <ul>
            <li>Os verbos não se conjugam: 我去 (wǒ qù), 你去 (nǐ qù), 他去 (tā qù): eu vou, tu vais, ele vai.</li>
            <li>Não há masculino nem feminino, nem plural nas palavras.</li>
            <li>O pinyin usa o nosso alfabeto, por isso lês desde o primeiro dia.</li>
            <li>Muitas palavras juntam outras que já sabes: 电 (diàn, eletricidade) + 脑 (nǎo, cérebro) = 电脑 (diànnǎo), computador.</li>
          </ul>
        </div>
        <div class="dificil__coluna dificil__coluna--dificil">
          <h3>O que pede mais treino</h3>
          <ul>
            <li>Os 4 tons: 妈 mā (mãe) e 马 mǎ (cavalo) só se distinguem pelo tom.</li>
            <li>Os caracteres: é preciso conhecer cerca de 900 para ler textos simples.</li>
            <li>Ouvir pessoas reais, que falam depressa e juntam as palavras.</li>
          </ul>
        </div>
      </div>
      <p class="sobre__nota">Por isso a rota começa pelos sons, repete as palavras em revisões e chega aos caracteres aos poucos. Para fazeres a rota em 12 meses, conta com cerca de 1 hora por dia: a lição, as revisões e a prática.</p>
    </div>
  </section>

  <!-- 6. PORQUÊ ESCOLHER O CHÁ -->
  <section class="sobre">
    <div class="sobre__dentro">
      <h2>Porquê escolher o Chá</h2>
      <ul class="vantagens">
        <li><strong>Em português de Portugal.</strong> As explicações, os exemplos e as traduções são escritos para quem fala como tu.</li>
        <li><strong>Um caminho com objetivo.</strong> A rota segue a norma oficial HSK 3.0: sabes sempre em que nível estás e o que falta.</li>
        <li><strong>Som em todo o lado.</strong> Cada palavra e cada frase em chinês tem um botão para ouvir, também devagar.</li>
        <li><strong>Tudo num só sítio.</strong> Lições, sons, gramática, vocabulário, caracteres, exercícios e uma biblioteca de recursos gratuitos.</li>
        <li><strong>Funciona sem conta.</strong> Podes estudar à vontade; a conta serve só para guardar o progresso.</li>
        <li><strong>Feito com cuidado com os teus dados.</strong> Guardamos o mínimo e cumprimos o RGPD.</li>
      </ul>

      <div class="convite">
        <p class="convite__zh" lang="zh-CN">我们开始吧！</p>
        <p class="convite__py">wǒmen kāishǐ ba! · Vamos começar!</p>
        <a class="botao-cha" href="<?= $proxima ? 'licao.php?id=' . (int) $proxima['id'] : 'cidade.php?id=1' ?>"><?= $aluno ? 'Continuar a rota' : 'Começar em Pequim' ?></a>
        <a class="botao-cha botao-cha--claro" href="introducao.php">Ler a introdução</a>
      </div>
    </div>
  </section>

<?php require 'includes/fim.php'; ?>
