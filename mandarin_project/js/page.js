/**
 * page.js
 * Ciclo de vida das páginas: o que corre quando uma página abre e o que se limpa quando sai.
 *
 * Por que é preciso? Com o Barba, o browser NÃO recarrega o site ao mudar de página:
 * só troca o conteúdo do <main>. Por isso o evento DOMContentLoaded só acontece uma vez,
 * e cada página nova tem de ser "ligada" manualmente (e a antiga "desligada").
 *
 * Uso:
 *   ChaPage.onInit(fn)    → fn(container) corre em cada página que abre
 *   ChaPage.onCleanup(fn) → fn() corre quando a página atual vai sair
 * 学中文 — Curso Completo de Mandarim
 */

const ChaPage = (() => {
  const inits = [];
  const cleanups = [];

  // Corre uma função sem deixar que um erro numa parte estrague as outras
  function safeRun(fn, arg) {
    try { fn(arg); } catch (err) { console.error('[ChaPage]', err); }
  }

  return {
    onInit(fn) { inits.push(fn); },
    onCleanup(fn) { cleanups.push(fn); },

    init(container) {
      inits.forEach(fn => safeRun(fn, container));
      // Se algum dia usarmos o ScrollTrigger do GSAP, recalcula as posições na página nova
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    },

    destroy() {
      cleanups.forEach(fn => safeRun(fn));
      // Destrói animações ligadas ao scroll da página antiga (se existirem)
      if (window.ScrollTrigger) window.ScrollTrigger.getAll().forEach(t => t.kill());
    }
  };
})();
