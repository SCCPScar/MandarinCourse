/**
 * page.js
 * Ciclo de vida das páginas: o que roda quando uma página abre e o que se limpa quando ela sai.
 *
 * Cada link carrega uma página nova de verdade (a transição é feita pelo próprio
 * navegador, em css/transitions.css). Por isso basta:
 *   - ligar a página quando o HTML estiver pronto (DOMContentLoaded);
 *   - desligar microfone, voz e temporizadores quando a página sai (pagehide).
 *
 * Uso:
 *   ChaPage.onInit(fn)    → fn(container) roda quando a página abre (container = <main class="page">)
 *   ChaPage.onCleanup(fn) → fn() roda quando a página vai sair
 */

const ChaPage = (() => {
  const inits = [];
  const cleanups = [];

  // Executa uma função sem deixar que um erro numa parte estrague as outras
  function safeRun(fn, arg) {
    try { fn(arg); } catch (err) { console.error('[ChaPage]', err); }
  }

  function init(container) {
    inits.forEach(fn => safeRun(fn, container));
  }

  function destroy() {
    cleanups.forEach(fn => safeRun(fn));
  }

  // Os scripts ficam no fim do <body>, então quando o DOMContentLoaded chega
  // todos os ficheiros já registaram as suas funções com onInit.
  document.addEventListener('DOMContentLoaded', () => {
    init(document.querySelector('main.page') || document.body);
  });

  // pagehide acontece ao sair para outra página (também quando ela vai para o cache do "voltar")
  window.addEventListener('pagehide', destroy);

  return {
    onInit(fn) { inits.push(fn); },
    onCleanup(fn) { cleanups.push(fn); },
    init,
    destroy
  };
})();
