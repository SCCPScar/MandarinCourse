<?php
// navegacao.php
// Aqui eu escrevo a parte de cima que é igual em todas as páginas do curso:
// a barra de leitura, as janelas (boas-vindas e sessão de hoje) e a barra de navegação.
?>
<div id="read-bar"></div>
<button id="back-top" onclick="window.scrollTo({top:0,behavior:'smooth'})" aria-label="Voltar ao topo">↑</button>
<div id="toast"></div>

<!-- JANELA DE BOAS-VINDAS (só aparece na primeira visita) -->
<div id="onboard-overlay" style="display:none">
  <div id="onboard-box" role="dialog" aria-modal="true" aria-labelledby="onboard-titulo">
    <!-- No computador a foto fica ao lado; no telemóvel fica em cima -->
    <picture class="onboard-foto">
      <source media="(max-width: 767.98px)" type="image/avif" srcset="img/fotos/g2-onboarding-mobile-390.avif 390w, img/fotos/g2-onboarding-mobile-780.avif 780w" sizes="100vw">
      <source media="(max-width: 767.98px)" type="image/webp" srcset="img/fotos/g2-onboarding-mobile-390.webp 390w, img/fotos/g2-onboarding-mobile-780.webp 780w" sizes="100vw">
      <source type="image/avif" srcset="img/fotos/g2-onboarding-desktop-340.avif 340w, img/fotos/g2-onboarding-desktop-680.avif 680w" sizes="340px">
      <img src="img/fotos/g2-onboarding-desktop-340.webp" srcset="img/fotos/g2-onboarding-desktop-340.webp 340w, img/fotos/g2-onboarding-desktop-680.webp 680w" sizes="340px" alt="Rua antiga de Xangai à chuva, com lanternas vermelhas">
    </picture>
    <div class="onboard-texto">
      <img src="img/logo-cha.svg" alt="" width="40" height="40">
      <h2 id="onboard-titulo">Boas-vindas ao Chá!</h2>
      <p>Qual é o teu nível de mandarim? Assim sei por onde começar.</p>
      <button class="onboard-btn" onclick="escolherNivel(this,'zero')"><strong>Nunca estudei mandarim</strong><span>Começas em Pequim, pelos sons e pelos tons</span></button>
      <button class="onboard-btn" onclick="escolherNivel(this,'basic')"><strong>Sei algumas palavras e o pinyin</strong><span>Começas em Xi'an</span></button>
      <button class="onboard-btn" onclick="escolherNivel(this,'inter')"><strong>Consigo ter conversas simples</strong><span>Começas em Chengdu</span></button>
      <button class="onboard-btn" onclick="escolherNivel(this,'adv')"><strong>Quero aperfeiçoar o que já sei</strong><span>Começas em Hangzhou</span></button>
      <button id="onboard-start" onclick="terminarBoasVindas()" style="display:none">Começar a aprender</button>
      <p class="onboard-credito">Foto: Nuno Alberto, Unsplash</p>
    </div>
  </div>
</div>

<!-- JANELA DA SESSÃO DE HOJE -->
<div id="daily-modal">
  <div id="daily-box">
    <button class="hoje-fechar" onclick="fecharSessaoDeHoje()" aria-label="Fechar">✕</button>
    <h2><i class="i i-hoje" aria-hidden="true"></i> Sessão de hoje</h2>
    <p class="hoje-intro">A tua sessão diária, com cerca de 10 minutos.</p>
    <div id="daily-steps"></div>
    <button class="hoje-concluir" onclick="fecharSessaoDeHoje()">✓ Marcar como concluída</button>
  </div>
</div>

<header class="site-nav" data-site-nav>
  <a class="site-nav__logo" href="index.php" aria-label="Chá, página inicial">
    <img class="site-nav__mark" src="img/logo-cha.svg" alt="" width="40" height="40">
    <span class="site-nav__nome">Chá</span>
  </a>
  <nav class="site-nav__menu" id="site-menu" aria-label="Principal">
    <ul class="site-nav__links">
      <?php
      // Os links do menu: endereço => nome que aparece.
      // A página que está aberta ganha aria-current="page" (fica sublinhada e os leitores de ecrã dizem "página atual").
      $links_do_menu = [
          'index.php'       => 'Início',
          'rota.php'        => 'A rota',
          'introducao.php'  => 'Introdução',
          'sons.php'        => 'Sons',
          'basico.php'      => 'Básico',
          'gramatica.php'   => 'Gramática',
          'vocabulario.php' => 'Vocabulário',
          'caracteres.php'  => 'Caracteres',
          'cultura.php'     => 'Cultura',
          'praticar.php'    => 'Praticar',
          'biblioteca.php'  => 'Biblioteca',
      ];
      // basename() tira as pastas do caminho: "/cha/sons.php" fica "sons.php"
      $pagina_aberta = basename($_SERVER['SCRIPT_NAME']);
      foreach ($links_do_menu as $endereco => $nome):
          $atual = ($endereco === $pagina_aberta) ? ' aria-current="page"' : '';
      ?>
        <li><a class="site-nav__link" href="<?= $endereco ?>"<?= $atual ?>><?= $nome ?></a></li>
      <?php endforeach; ?>
    </ul>
    <div class="site-nav__tools">
      <button type="button" class="site-nav__tool" onclick="abrirSessaoDeHoje()" title="Sessão de hoje"><i class="i i-hoje" aria-hidden="true"></i> <span class="site-nav__texto">Hoje</span></button>
      <button type="button" class="site-nav__tool" id="dark-toggle" onclick="trocarModoEscuro()" title="Mudar para o modo escuro"><i class="i i-escuro" aria-hidden="true"></i> <span class="site-nav__texto">Escuro</span></button>
      <a class="site-nav__tool" href="conta.php" title="A minha conta"><i class="i i-conta" aria-hidden="true"></i> <span class="site-nav__texto">Conta</span></a>
    </div>
  </nav>
  <button type="button" class="site-nav__toggle" aria-expanded="false" aria-controls="site-menu">Menu</button>
</header>
