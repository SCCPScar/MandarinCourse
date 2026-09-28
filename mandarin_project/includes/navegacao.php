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
      <button class="onboard-btn" onclick="selectLevel(this,'zero')"><strong>Nunca estudei mandarim</strong><span>Começas em Pequim, pelos sons e pelos tons</span></button>
      <button class="onboard-btn" onclick="selectLevel(this,'basic')"><strong>Sei algumas palavras e o pinyin</strong><span>Começas em Xi'an</span></button>
      <button class="onboard-btn" onclick="selectLevel(this,'inter')"><strong>Consigo ter conversas simples</strong><span>Começas em Chengdu</span></button>
      <button class="onboard-btn" onclick="selectLevel(this,'adv')"><strong>Quero aperfeiçoar o que já sei</strong><span>Começas em Hangzhou</span></button>
      <button id="onboard-start" onclick="finishOnboard()" style="display:none">Começar a aprender</button>
      <p class="onboard-credito">Foto: Nuno Alberto, Unsplash</p>
    </div>
  </div>
</div>

<!-- JANELA DA SESSÃO DE HOJE -->
<div id="daily-modal">
  <div id="daily-box">
    <button onclick="closeDailyModal()" aria-label="Fechar" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:20px;cursor:pointer;color:var(--ink-light)">✕</button>
    <h2>📅 Sessão de hoje</h2>
    <p style="color:var(--ink-light);font-size:14px;margin-bottom:16px">A tua sessão diária, com cerca de 10 minutos.</p>
    <div id="daily-steps"></div>
    <button onclick="closeDailyModal()" style="margin-top:16px;background:var(--jade);color:#fff;border:none;padding:12px 24px;border-radius:10px;font-size:15px;cursor:pointer;font-family:var(--font-main)">✓ Marcar como concluída</button>
  </div>
</div>

<header class="site-nav" data-site-nav>
  <a class="site-nav__logo" href="index.php" aria-label="Chá, página inicial">
    <img class="site-nav__mark" src="img/logo-cha.svg" alt="" width="30" height="30">
  </a>
  <nav class="site-nav__menu" id="site-menu" aria-label="Principal">
    <ul class="site-nav__links">
        <li><a class="site-nav__link" href="index.php">Início</a></li>
        <li><a class="site-nav__link" href="introducao.html">Introdução</a></li>
        <li><a class="site-nav__link" href="sons.html">Sons</a></li>
        <li><a class="site-nav__link" href="basico.html">Básico</a></li>
        <li><a class="site-nav__link" href="vocabulario.html">Vocabulário</a></li>
        <li><a class="site-nav__link" href="caracteres.html">Caracteres</a></li>
        <li><a class="site-nav__link" href="praticar.html">Praticar</a></li>
        <li><a class="site-nav__link" href="biblioteca.html">Biblioteca</a></li>
    </ul>
    <div class="site-nav__tools">
      <button type="button" class="site-nav__tool" onclick="openDailyModal()">📅 Hoje</button>
      <button type="button" class="site-nav__tool" id="dark-toggle" onclick="toggleDark()">🌙 Escuro</button>
      <a class="site-nav__tool" href="conta.php">👤 Conta</a>
    </div>
  </nav>
  <button type="button" class="site-nav__toggle" aria-expanded="false" aria-controls="site-menu">Menu</button>
</header>
