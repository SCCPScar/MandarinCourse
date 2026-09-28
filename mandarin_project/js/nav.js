/**
 * nav.js
 * Barra de navegação: esconder/mostrar no scroll, letras que rolam no hover,
 * link da página atual (aria-current) e menu em tela inteira no celular.
 *
 * Regra de ouro deste arquivo: o JavaScript só muda ATRIBUTOS no <body>
 * (data-scrolling-direction, data-scrolling-started, data-menu-open).
 * Quem anima é o CSS (css/nav.css).
 * 学中文 — Curso Completo de Mandarim
 */

const ChaNav = (() => {
  const body = document.body;
  const header = document.querySelector('[data-site-nav]');
  const menu = document.getElementById('site-menu');
  const toggle = header?.querySelector('.site-nav__toggle');
  const mobileQuery = window.matchMedia('(max-width: 767.98px)');

  let fontsReady = false;
  let pageTitle = document.title;

  // ═══ 1. ESCONDER / MOSTRAR NO SCROLL ═══
  const START_AFTER = 50;       // só esconde depois de 50px
  const MIN_DELTA = 10;         // ignora movimentos pequenos (evita "tremer")
  let lastY = window.scrollY;
  let ticking = false;

  function updateScrollState() {
    ticking = false;
    const y = Math.max(0, window.scrollY);
    body.dataset.scrollingStarted = String(y > START_AFTER);
    const delta = y - lastY;
    if (Math.abs(delta) < MIN_DELTA) return;   // não atualiza lastY: pequenos passos vão somando
    body.dataset.scrollingDirection = delta > 0 ? 'down' : 'up';
    lastY = y;
  }

  // requestAnimationFrame: no máximo 1 atualização por frame, por mais eventos de scroll que cheguem
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateScrollState); }
  }, { passive: true });

  // Mostra a barra (estado inicial de cada página)
  function reveal() {
    lastY = window.scrollY;
    body.dataset.scrollingDirection = 'up';
    body.dataset.scrollingStarted = 'false';
  }

  // ═══ 2. LETRAS QUE ROLAM ═══
  // "Sons" → <span class="roll" aria-hidden="true"><span class="roll__char" style="--char:0">S</span>…</span>
  // O texto completo fica no aria-label, para leitores de tela lerem "Sons" e não "S, o, n, s".
  function splitLink(link, label) {
    link.setAttribute('aria-label', label);
    if (!fontsReady) { link.textContent = label; return; }
    const roll = document.createElement('span');
    roll.className = 'roll';
    roll.setAttribute('aria-hidden', 'true');
    Array.from(label).forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'roll__char';
      span.style.setProperty('--char', i);
      span.textContent = ch;
      roll.appendChild(span);
    });
    link.replaceChildren(roll);
  }

  function setLabel(link, label) { splitLink(link, label); }

  function splitAll() {
    header?.querySelectorAll('.site-nav__link').forEach(link => {
      splitLink(link, link.getAttribute('aria-label') || link.textContent.trim());
    });
  }

  // Esperar pelas fontes: assim cada letra já é medida com a fonte certa
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    fontsReady = true;
    splitAll();
  });

  // ═══ 3. PÁGINA ATUAL (aria-current) ═══
  function normalizePath(pathname) {
    // O endereço "/" abre o index.php, por isso eu trato os dois como a mesma página
    return pathname.endsWith('/') ? pathname + 'index.php' : pathname;
  }

  function updateCurrent() {
    const here = normalizePath(window.location.pathname);
    header?.querySelectorAll('.site-nav__link').forEach(link => {
      const there = normalizePath(new URL(link.href, window.location.href).pathname);
      if (there === here) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  // ═══ 4. MENU DO TELEMÓVEL ═══
  function isOpen() { return body.dataset.menuOpen === 'true'; }

  function focusables() {
    // O botão "Fechar" + tudo o que se pode focar dentro do menu
    return [toggle, ...menu.querySelectorAll('a[href], button:not([disabled])')];
  }

  function open() {
    if (!menu || !toggle) return;
    body.dataset.menuOpen = 'true';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.textContent = currentLangLabel('close');
    const page = document.querySelector('main.page');
    if (page) page.inert = true;              // o conteúdo por trás fica "desligado"
    // Espera um frame para o menu ficar visível antes de lhe dar foco
    requestAnimationFrame(() => menu.querySelector('.site-nav__link')?.focus());
  }

  function close(returnFocus = true) {
    if (!isOpen()) return;
    body.dataset.menuOpen = 'false';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = currentLangLabel('menu');
    const page = document.querySelector('main.page');
    if (page) page.inert = false;
    if (returnFocus) toggle.focus();
  }

  function currentLangLabel(which) {
    const en = typeof currentLang !== 'undefined' && currentLang === 'en';
    if (which === 'close') return en ? 'Close' : 'Fechar';
    return 'Menu';
  }

  toggle?.addEventListener('click', () => (isOpen() ? close() : open()));

  document.addEventListener('keydown', e => {
    if (!isOpen()) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    // Foco preso: do último salta para o primeiro e vice-versa
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Se a tela passar a ser largo (ex.: rodar o tablet), o menu de celular fecha
  mobileQuery.addEventListener('change', e => { if (!e.matches) close(false); });

  // ═══ 5. CLIQUES NOS LINKS ═══
  header?.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    // Link da página em que já estamos: não recarrega, só volta ao topo
    if (link.getAttribute('aria-current') === 'page') {
      e.preventDefault();
      close(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // Outros links internos: o menu fecha e o navegador abre a página nova com a transição
    if (isOpen()) close(false);
  });

  // ═══ 6. NAVEGAR POR CÓDIGO ═══
  // Ex.: ChaNav.go('sons.html#tones'). Na mesma página, só rola até a seção.
  function go(url) {
    const target = new URL(url, window.location.href);
    const samePage = normalizePath(target.pathname) === normalizePath(window.location.pathname);
    if (samePage) {
      const el = target.hash && document.getElementById(target.hash.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.location.href = target.href;
  }

  updateCurrent();
  reveal();

  return {
    setLabel, updateCurrent, reveal, open, close, isOpen, go,
    pageTitle() { return pageTitle; },
    setPageTitle(title) { pageTitle = title; }
  };
})();
