/**
 * transitions.js
 * Transição de página "empurrar cartão" com Barba.js (modo sync) + GSAP.
 *
 * Como funciona, em resumo:
 *  1. O Barba intercepta o clique num link interno e vai buscar a página nova por fetch.
 *  2. A página ATUAL é metida num "cartão" do tamanho do ecrã (fixo, com overflow: clip),
 *     sem perder a posição de scroll. O cartão encolhe e sai pela esquerda a rodar.
 *  3. A página NOVA entra noutro cartão pela direita, ao mesmo tempo (0.1s depois).
 *  4. No fim, os cartões são removidos, o scroll volta ao topo e a página nova é "ligada".
 * A barra de navegação está fora do <main>, por isso nunca se mexe.
 * 学中文 — Curso Completo de Mandarim
 */

(() => {
  const html = document.documentElement;
  const firstPage = document.querySelector('[data-barba="container"]');

  // A primeira página abre sempre da forma normal
  ChaNav.setPageTitle(document.title);
  ChaPage.init(firstPage);

  // Sem transição quando: o utilizador pediu menos movimento, as bibliotecas não carregaram,
  // ou o site foi aberto como ficheiro (file://), onde o Barba não consegue ir buscar páginas.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !window.barba || !window.gsap || window.location.protocol === 'file:') return;

  // Nós é que controlamos o scroll entre páginas, não o browser
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  let savedScroll = 0;
  let pendingHash = '';   // o Barba descarta o "#secção" do link, por isso guardamo-lo aqui

  // ─── Utilitários ────────────────────────────────────────────
  const normalizePath = p => (p.endsWith('/') ? p + 'index.html' : p);

  // Altura da barra fixa = espaço que o <body> reserva no topo
  const navOffset = () => parseFloat(getComputedStyle(document.body).paddingTop) || 0;

  // Mete uma página dentro de um cartão fixo do tamanho do ecrã.
  // offsetY põe a página na mesma posição em que estava visível.
  function wrapInCard(page, modifier, offsetY) {
    const card = document.createElement('div');
    card.className = `page-card page-card--${modifier}`;
    page.parentNode.insertBefore(card, page);
    card.appendChild(page);
    page.style.marginTop = `${offsetY}px`;
    return card;
  }

  // Tira a página do cartão e devolve-a ao sítio normal
  function unwrapCard(card, page) {
    card.parentNode.insertBefore(page, card);
    card.remove();
    page.style.marginTop = '';
  }

  // Links que NÃO devem ter transição (o browser trata deles normalmente)
  function prevent({ el, href }) {
    if (!el || !href) return true;
    if (el.target && el.target !== '_self') return true;           // target="_blank"
    if (el.hasAttribute('download')) return true;
    const raw = el.getAttribute('href') || '';
    if (raw.startsWith('#')) return true;                           // âncora na mesma página
    if (/^(mailto|tel|sms|javascript):/i.test(raw)) return true;
    let url;
    try { url = new URL(href, window.location.href); } catch { return true; }
    if (url.origin !== window.location.origin) return true;         // link externo
    if (normalizePath(url.pathname) === normalizePath(window.location.pathname)) return true; // mesma página
    return false;
  }

  // ─── Barba ──────────────────────────────────────────────────
  barba.hooks.before(({ trigger }) => {
    if (trigger instanceof Element && trigger.href) pendingHash = new URL(trigger.href, window.location.href).hash;
    else if (trigger !== 'barba') pendingHash = '';   // botões voltar/avançar do browser
    savedScroll = window.scrollY;
    html.classList.add('is-transitioning');   // bloqueia cliques + cursor de espera
    ChaNav.close(false);                       // o menu do telemóvel fecha sozinho
  });

  // Antes de sair: desligar o que pertence à página antiga (microfone, timers…)
  barba.hooks.beforeLeave(() => ChaPage.destroy());

  barba.hooks.after(({ next }) => {
    // Título da página nova
    const title = new DOMParser().parseFromString(next.html, 'text/html').title;
    if (title) { document.title = title; ChaNav.setPageTitle(title); }

    ChaNav.updateCurrent();   // aria-current no link certo
    ChaNav.reveal();          // a barra volta a aparecer
    ChaPage.init(next.container);

    // Se o link tinha #secção (ex.: sons.html#tones), vai até lá e repõe o "#" no endereço
    const hash = pendingHash.replace(/^#/, '');
    pendingHash = '';
    const target = hash && document.getElementById(hash);
    if (target) {
      history.replaceState(history.state, '', `${window.location.pathname}${window.location.search}#${hash}`);
      target.scrollIntoView();
    }

    // Acessibilidade: o foco passa para o conteúdo novo, sem saltar o scroll
    next.container.setAttribute('tabindex', '-1');
    next.container.focus({ preventScroll: true });

    html.classList.remove('is-transitioning');
  });

  barba.init({
    prevent,
    timeout: 8000,
    // Se o fetch falhar, faz a navegação normal em vez de ficar parado
    requestError: (trigger, action, url) => {
      if (action === 'click' || action === 'barba') window.location.href = url;
      return false;
    },
    transitions: [{
      name: 'card-push',
      sync: true,   // a página antiga sai e a nova entra ao mesmo tempo

      leave({ current }) {
        const card = wrapInCard(current.container, 'leaving', navOffset() - savedScroll);
        return gsap.timeline()
          // 1) encolhe e fica um pouco transparente
          .to(card, { scale: 0.8, opacity: 0.8, duration: 0.6, ease: 'power2.inOut' })
          // 2) desliza para a esquerda e roda (começa antes de o passo 1 acabar)
          .to(card, { xPercent: -50, rotation: -5, duration: 0.45, ease: 'power2.in' }, '-=0.25');
        // O Barba remove esta página no fim; o cartão sai com ela (ver afterLeave)
      },

      afterLeave({ current }) {
        const card = current.container.closest('.page-card');
        if (card) card.remove();
      },

      enter({ next }) {
        const card = wrapInCard(next.container, 'entering', navOffset());
        window.scrollTo(0, 0);   // as duas páginas estão em cartões fixos, por isso nada salta
        gsap.set(card, { xPercent: 100, rotation: 5, scale: 0.85 });
        return gsap.to(card, {
          xPercent: 0, rotation: 0, scale: 1,
          duration: 0.8,
          delay: 0.1,
          ease: 'power3.inOut',
          onComplete: () => unwrapCard(card, next.container)
        });
      }
    }]
  });

  // O ChaNav.go() passa a usar a transição
  ChaNav.useRouter(href => {
    pendingHash = new URL(href, window.location.href).hash;
    barba.go(href);
  });
})();
