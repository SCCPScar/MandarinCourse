/**
 * navegacao.js
 * Aqui eu controlo a barra de navegação do topo:
 *   1. escondo a barra quando o aluno desce na página e mostro-a quando sobe;
 *   2. faço as letras dos links "rolarem" quando o rato passa por cima;
 *   3. abro e fecho o menu em ecrã inteiro no telemóvel.
 *
 * A minha regra neste ficheiro: o JavaScript só muda ATRIBUTOS no <body>
 * (data-scrolling-direction, data-scrolling-started e data-menu-open).
 * Quem faz as animações é o CSS (css/nav.css), que olha para esses atributos.
 * A página atual (aria-current) é marcada pelo PHP, em includes/navegacao.php.
 */

const barraDoTopo = document.querySelector('[data-site-nav]');
const menu = document.getElementById('site-menu');
const botaoMenu = document.querySelector('.site-nav__toggle');

// ═══ 1. ESCONDER A BARRA AO DESCER ═══
let ultimaPosicao = window.scrollY;

window.addEventListener('scroll', function () {
  const posicao = Math.max(0, window.scrollY);
  // Só começo a esconder depois de o aluno descer 50 px
  document.body.dataset.scrollingStarted = String(posicao > 50);

  // Ignoro movimentos pequenos (menos de 10 px), para a barra não "tremer"
  const diferenca = posicao - ultimaPosicao;
  if (Math.abs(diferenca) < 10) {
    return;
  }
  document.body.dataset.scrollingDirection = diferenca > 0 ? 'down' : 'up';
  ultimaPosicao = posicao;
}, { passive: true });

// Quando a página abre, a barra está à vista
document.body.dataset.scrollingDirection = 'up';
document.body.dataset.scrollingStarted = 'false';

// ═══ 2. LETRAS QUE ROLAM ═══
// Troco o texto de cada link por uma letra em cada <span>. Ex.: "Sons" fica
//   <span class="roll"><span class="roll__char" style="--char: 0">S</span>...</span>
// O --char é o número da letra: o CSS usa-o para cada letra começar a mexer um pouco depois da anterior.
// O nome completo fica no aria-label, para os leitores de ecrã lerem "Sons" e não "S, o, n, s".
function separarLetras(link) {
  const nome = link.textContent.trim();
  link.setAttribute('aria-label', nome);

  const caixa = document.createElement('span');
  caixa.className = 'roll';
  caixa.setAttribute('aria-hidden', 'true');
  Array.from(nome).forEach(function (letra, numero) {
    const span = document.createElement('span');
    span.className = 'roll__char';
    span.style.setProperty('--char', numero);
    span.textContent = letra;
    caixa.appendChild(span);
  });
  link.replaceChildren(caixa);
}

// Espero que as fontes carreguem, para cada letra já ser medida com a fonte certa
document.fonts.ready.then(function () {
  document.querySelectorAll('.site-nav__link').forEach(separarLetras);
});

// ═══ 3. MENU DO TELEMÓVEL ═══
function menuAberto() {
  return document.body.dataset.menuOpen === 'true';
}

function abrirMenu() {
  document.body.dataset.menuOpen = 'true';
  botaoMenu.setAttribute('aria-expanded', 'true');
  botaoMenu.textContent = 'Fechar';
  // inert "desliga" o conteúdo por trás do menu: não se pode carregar nem chegar lá com o Tab
  document.querySelector('main.page').inert = true;
  // Espero um quadro para o menu já estar visível antes de lhe dar o foco
  requestAnimationFrame(function () {
    menu.querySelector('.site-nav__link').focus();
  });
}

function fecharMenu(devolverFoco) {
  if (!menuAberto()) {
    return;
  }
  document.body.dataset.menuOpen = 'false';
  botaoMenu.setAttribute('aria-expanded', 'false');
  botaoMenu.textContent = 'Menu';
  document.querySelector('main.page').inert = false;
  if (devolverFoco) {
    botaoMenu.focus();
  }
}

if (botaoMenu) {
  botaoMenu.addEventListener('click', function () {
    if (menuAberto()) {
      fecharMenu(true);
    } else {
      abrirMenu();
    }
  });
}

// Com o menu aberto: Esc fecha, e o Tab anda só dentro do menu
// (do último elemento salta para o primeiro e vice-versa)
document.addEventListener('keydown', function (evento) {
  if (!menuAberto()) {
    return;
  }
  if (evento.key === 'Escape') {
    evento.preventDefault();
    fecharMenu(true);
    return;
  }
  if (evento.key !== 'Tab') {
    return;
  }
  const elementos = [botaoMenu, ...menu.querySelectorAll('a[href], button:not([disabled])')];
  const primeiro = elementos[0];
  const ultimo = elementos[elementos.length - 1];
  if (evento.shiftKey && document.activeElement === primeiro) {
    evento.preventDefault();
    ultimo.focus();
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault();
    primeiro.focus();
  }
});

// Se o ecrã ficar largo (por exemplo, ao rodar o tablet), fecho o menu do telemóvel.
// O valor 1199.98px é o mesmo do css/nav.css.
window.matchMedia('(max-width: 1199.98px)').addEventListener('change', function (evento) {
  if (!evento.matches) {
    fecharMenu(false);
  }
});

// ═══ CLIQUES NOS LINKS DA BARRA ═══
if (barraDoTopo) {
  barraDoTopo.addEventListener('click', function (evento) {
    const link = evento.target.closest('a');
    if (!link) {
      return;
    }
    // Link da página em que já estou: não recarrego, só volto ao topo
    if (link.getAttribute('aria-current') === 'page') {
      evento.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    fecharMenu(false);
  });
}
