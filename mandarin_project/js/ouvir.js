/**
 * ouvir.js
 * Aqui eu faço com que o chinês das páginas se possa ouvir: cartões de vocabulário,
 * tabelas de frases, exemplos de gramática, números, tons e diálogos.
 * Basta carregar no elemento (ou usar Enter no teclado) e a voz do browser lê o chinês.
 */

// Os elementos que eu torno "ouvíveis"
const ALVOS_OUVIR = '.card, .zh-cell, .zh-ex, .tone-card .example, .num-card, .bubble';

// Eu tiro só os caracteres chineses (e a pontuação chinesa) de um texto.
// 一-鿿 é o intervalo Unicode dos caracteres chineses mais comuns.
function soChines(texto) {
  return (texto.match(/[一-鿿，。？！、]+/g) || []).join('');
}

// Em cada elemento eu prefiro o texto de .zh; se não houver, uso o texto do próprio elemento
function chinesDe(el) {
  const zh = el.querySelector('.zh');
  return soChines((zh || el).textContent);
}

ChaPage.onInit(container => {
  container.querySelectorAll(ALVOS_OUVIR).forEach(el => {
    const texto = chinesDe(el);
    if (!texto || el.hasAttribute('onclick')) return;   // sem chinês, ou já tem outra ação
    el.classList.add('pode-ouvir');
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');                     // assim também se chega lá com a tecla Tab
    el.setAttribute('title', 'Carrega para ouvir');
    el.setAttribute('aria-label', 'Ouvir ' + texto);
  });
});

// Um só "ouvinte" para a página inteira (delegação de eventos):
// quando se carrega num elemento .pode-ouvir, eu leio o chinês dele.
document.addEventListener('click', e => {
  if (e.target.closest('button, a, input')) return;       // os botões e links continuam a fazer o que faziam
  const el = e.target.closest('.pode-ouvir');
  if (el) speakText(chinesDe(el));
});
document.addEventListener('keydown', e => {
  const el = e.target.closest && e.target.closest('.pode-ouvir');
  if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); speakText(chinesDe(el)); }
});

// Se o computador não tiver nenhuma voz chinesa, eu aviso uma vez, para o aluno saber porque não ouve nada
function avisarSemVozChinesa() {
  const vozes = speechSynthesis.getVoices();
  if (!vozes.length) return;                              // as vozes ainda não carregaram
  const temChines = vozes.some(v => v.lang.toLowerCase().startsWith('zh') || v.lang.toLowerCase().startsWith('cmn'));
  if (!temChines && !sessionStorage.getItem('aviso-voz')) {
    sessionStorage.setItem('aviso-voz', '1');
    showToast('🔇 Este browser não tem voz chinesa. Para ouvires o chinês, usa o Chrome ou o Edge.', 6000);
  }
}
if ('speechSynthesis' in window) {
  speechSynthesis.addEventListener('voiceschanged', avisarSemVozChinesa);
  setTimeout(avisarSemVozChinesa, 1500);
}
