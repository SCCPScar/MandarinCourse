<?php
// index.php
// Aqui eu mostro a página inicial do Chá:
// 1) o hero com a foto das taças de chá;
// 2) o painel do aluno (ou o convite para criar conta);
// 3) a rota das 6 cidades, com o progresso de cada uma.

require 'includes/sessao.php';
require 'includes/ligacao.php';

// Se houver sessão, eu vou buscar o nome e os dias seguidos do aluno
$aluno = null;
if (id_utilizador() !== null) {
    $consulta = $pdo->prepare('SELECT nome, sequencia_dias FROM utilizadores WHERE id = ?');
    $consulta->execute([id_utilizador()]);
    $aluno = $consulta->fetch();
}

// Para cada cidade eu conto quantas lições existem e quantas o aluno já fez.
// LEFT JOIN: a cidade aparece mesmo que ainda não tenha lições.
// Sem sessão, o id é null e a contagem das feitas fica a 0.
$consulta = $pdo->prepare('
    SELECT c.id, c.nome, c.nome_zh, c.meses, c.tema, c.capa,
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

// Total de lições feitas em toda a rota (para o painel)
$feitas_total = array_sum(array_column($cidades, 'feitas'));
?>
<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chá · Aprende mandarim</title>
  <link rel="icon" href="img/logo-cha.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/fontes.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/dark.css">
  <link rel="stylesheet" href="css/nav.css">
  <link rel="stylesheet" href="css/transitions.css">
  <link rel="stylesheet" href="css/inicio.css">
</head>
<body>
<?php require 'includes/navegacao.php'; ?>

<main class="page" data-page="inicio">

  <!-- 1. HERO -->
  <section class="hero-cha">
    <!-- No telemóvel eu mostro uma foto vertical, no computador uma horizontal -->
    <picture>
      <source media="(max-width: 767.98px)" type="image/avif" srcset="img/fotos/hero-mobile-390.avif 390w, img/fotos/hero-mobile-780.avif 780w" sizes="100vw">
      <source media="(max-width: 767.98px)" type="image/webp" srcset="img/fotos/hero-mobile-390.webp 390w, img/fotos/hero-mobile-780.webp 780w" sizes="100vw">
      <source type="image/avif" srcset="img/fotos/hero-desktop-1280.avif 1280w, img/fotos/hero-desktop-1920.avif 1920w" sizes="100vw">
      <img class="hero-cha__foto" src="img/fotos/hero-desktop-1280.webp"
           srcset="img/fotos/hero-desktop-1280.webp 1280w, img/fotos/hero-desktop-1920.webp 1920w" sizes="100vw"
           alt="Mãos a servir chá em pequenas taças" fetchpriority="high">
    </picture>

    <div class="hero-cha__texto">
      <h1>Aprende mandarim ao teu ritmo</h1>
      <p>Uma rota de 12 meses por 6 cidades da China, com lições curtas todos os dias. Gratuito, para sempre.</p>
      <?php if ($aluno): ?>
        <a class="botao-cha" href="#rota">Continuar a rota</a>
      <?php else: ?>
        <a class="botao-cha" href="registo.php">Criar conta grátis</a>
        <a class="botao-cha botao-cha--claro" href="#rota">Ver a rota</a>
      <?php endif; ?>
    </div>

    <p class="credito credito--computador">Foto: Yang Louie, Unsplash</p>
    <p class="credito credito--telemovel">Foto: Joshua Fernandez, Unsplash</p>
  </section>

  <!-- 2. PAINEL DO ALUNO -->
  <section class="painel">
    <?php if ($aluno): ?>
      <p class="painel__ola">Olá, <?= e($aluno['nome']) ?>!</p>
      <ul class="painel__numeros">
        <li><strong><?= (int) $aluno['sequencia_dias'] ?></strong> dias seguidos</li>
        <li><strong><?= (int) $feitas_total ?></strong> lições feitas</li>
      </ul>
      <a href="conta.php">A minha conta</a>
    <?php else: ?>
      <p class="painel__ola">Guarda o teu progresso</p>
      <p>Com uma conta, as lições que fazes ficam guardadas e podes continuar noutro dispositivo.</p>
      <a href="entrar.php">Já tenho conta</a>
    <?php endif; ?>
  </section>

  <!-- 3. A ROTA DAS 6 CIDADES -->
  <section class="rota" id="rota">
    <h2>A tua rota</h2>
    <p class="rota__intro">Cada cidade dura cerca de 2 meses e tem 4 unidades. No fim, recebes o carimbo da cidade.</p>

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

          <?php if ($aluno && $cidade['total'] > 0 && $cidade['feitas'] == $cidade['total']): ?>
            <!-- O aluno fez todas as lições: eu mostro o carimbo da cidade (完成 = concluído) -->
            <span class="carimbo" lang="zh-CN" title="Cidade concluída"><?= e($cidade['nome_zh']) ?><br>完成</span>
          <?php endif; ?>

          <div class="cidade__texto">
            <p class="cidade__meses">Meses <?= e($cidade['meses']) ?></p>
            <h3><?= e($cidade['nome']) ?> <span lang="zh-CN"><?= e($cidade['nome_zh']) ?></span></h3>
            <p><?= e($cidade['tema']) ?></p>

            <?php if ($aluno && $cidade['total'] > 0): ?>
              <?php $percentagem = round($cidade['feitas'] / $cidade['total'] * 100); ?>
              <div class="progresso" role="progressbar" aria-valuenow="<?= $percentagem ?>" aria-valuemin="0" aria-valuemax="100"
                   aria-label="Progresso em <?= e($cidade['nome']) ?>">
                <div class="progresso__barra" style="width: <?= $percentagem ?>%"></div>
              </div>
              <p class="cidade__feitas"><?= (int) $cidade['feitas'] ?> de <?= (int) $cidade['total'] ?> lições</p>
            <?php elseif ($cidade['total'] > 0): ?>
              <p class="cidade__feitas"><?= (int) $cidade['total'] ?> lições disponíveis</p>
            <?php else: ?>
              <p class="cidade__feitas">Lições em preparação</p>
            <?php endif; ?>
          </div>
          </a>
        </li>
      <?php endforeach; ?>
    </ol>
  </section>

  <?php require 'includes/rodape-site.php'; ?>
</main>

<?php require 'includes/scripts.php'; ?>
</body>
</html>
