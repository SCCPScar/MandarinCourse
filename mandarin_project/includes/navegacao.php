<?php
// navegacao.php
// Aqui eu escrevo a parte de cima que é igual em todas as páginas do curso:
// a barra de leitura, as janelas (boas-vindas e sessão de hoje) e a barra de navegação.
?>
<div id="read-bar"></div>
<button id="back-top" onclick="window.scrollTo({top:0,behavior:'smooth'})" aria-label="Voltar ao topo">↑</button>
<div id="toast"></div>

<!-- ONBOARDING MODAL -->
<div id="onboard-overlay" style="display:none">
  <div id="onboard-box">
    <div style="font-size:48px;margin-bottom:12px">🇨🇳</div>
    <h2>Bem-vindo ao 学中文!</h2>
    <p>Vamos personalizar sua experiência. Qual é o seu nível de mandarim?</p>
    <button class="onboard-btn" onclick="selectLevel(this,'zero')">🌱 Iniciante total — nunca estudei mandarim</button>
    <button class="onboard-btn" onclick="selectLevel(this,'basic')">📖 Básico — conheço algumas palavras e o pinyin</button>
    <button class="onboard-btn" onclick="selectLevel(this,'inter')">🎯 Intermediário — consigo ter conversas simples</button>
    <button class="onboard-btn" onclick="selectLevel(this,'adv')">🚀 Avançado — quero aperfeiçoar e expandir</button>
    <br>
    <button id="onboard-start" onclick="finishOnboard()" style="display:none">Começar a aprender →</button>
  </div>
</div>

<!-- DAILY STUDY MODAL -->
<div id="daily-modal">
  <div id="daily-box">
    <button onclick="closeDailyModal()" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:20px;cursor:pointer;color:var(--ink-light)">✕</button>
    <h2>📅 Sessão de Hoje</h2>
    <p style="color:var(--ink-light);font-size:14px;margin-bottom:16px">Sua sessão diária personalizada — ~10 minutos</p>
    <div id="daily-steps"></div>
    <button onclick="closeDailyModal()" style="margin-top:16px;background:var(--red);color:#fff;border:none;padding:12px 24px;border-radius:10px;font-size:15px;cursor:pointer;font-family:var(--font-main)">✓ Marcar como Completo</button>
  </div>
</div>

<header class="site-nav" data-site-nav>
  <a class="site-nav__logo" href="index.php" aria-label="Chá, página inicial">
    <img class="site-nav__mark" src="img/logo-cha.svg" alt="" width="30" height="30">
  </a>
  <nav class="site-nav__menu" id="site-menu" aria-label="Principal">
    <ul class="site-nav__links">
        <li><a class="site-nav__link" href="index.php" data-i18n="nav_home">Início</a></li>
        <li><a class="site-nav__link" href="introducao.html" data-i18n="nav_intro">Introdução</a></li>
        <li><a class="site-nav__link" href="sons.html" data-i18n="nav_sounds">Sons</a></li>
        <li><a class="site-nav__link" href="basico.html" data-i18n="nav_basics">Básico</a></li>
        <li><a class="site-nav__link" href="vocabulario.html" data-i18n="nav_vocabulary">Vocabulário</a></li>
        <li><a class="site-nav__link" href="caracteres.html" data-i18n="nav_characters">Caracteres</a></li>
        <li><a class="site-nav__link" href="praticar.html" data-i18n="nav_practice">Praticar</a></li>
        <li><a class="site-nav__link" href="biblioteca.html" data-i18n="nav_library">Biblioteca</a></li>
    </ul>
    <div class="site-nav__tools">
      <button type="button" class="site-nav__tool" onclick="openDailyModal()">📅 Hoje</button>
      <button type="button" class="site-nav__tool" id="lang-toggle" onclick="toggleLang()">🇬🇧 EN</button>
      <button type="button" class="site-nav__tool" id="dark-toggle" onclick="toggleDark()">🌙 Dark</button>
      <a class="site-nav__tool" href="conta.php">👤 Conta</a>
    </div>
  </nav>
  <button type="button" class="site-nav__toggle" aria-expanded="false" aria-controls="site-menu">Menu</button>
</header>
