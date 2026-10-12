/**
 * hanzi.js
 * Aqui eu uso a biblioteca HanziWriter para animar os traços dos caracteres
 * e para o aluno praticar a escrita.
 */

// ═══ HANZI WRITER ═══
let hanziWriterInstance = null;

// ═══ FUNÇÕES DO HANZI WRITER ═══
function loadChar(char) {
  const input = document.getElementById('hanzi-input');
  if (input) input.value = char;
  const hint = document.getElementById('hanzi-hint');
  const svg = document.getElementById('hanzi-target');
  if (!svg) return;
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  if (hint) hint.textContent = '';
  try {
    hanziWriterInstance = HanziWriter.create('hanzi-target', char, {
      width:200, height:200, padding:16,
      strokeColor:'#C8361F', radicalColor:'#A32A18',
      outlineColor:'#D5DEDB', showOutline:true,
      strokeAnimationSpeed:1, delayBetweenStrokes:200, rendererType:'svg'
    });
    if (hint) hint.innerHTML = 'Carrega em <i class="i i-jogar" aria-hidden="true"></i> Animar ou <i class="i i-escrever" aria-hidden="true"></i> Praticar';
  } catch(e) { if (hint) hint.textContent = 'Caractere não encontrado.'; }
}

function animateHanzi() {
  const char = (document.getElementById('hanzi-input')||{}).value||'';
  if (!char || !/[\u4e00-\u9fff]/.test(char)) {
    const h = document.getElementById('hanzi-hint');
    if (h) h.textContent = 'Escreve primeiro um caractere chinês.';
    return;
  }
  if (!hanziWriterInstance) { loadChar(char); setTimeout(()=>{ if(hanziWriterInstance) hanziWriterInstance.animateCharacter(); },400); }
  else { hanziWriterInstance.animateCharacter(); }
  const h = document.getElementById('hanzi-hint');
  if (h) h.textContent = 'Repara na ordem dos traços!';
}

function quizHanzi() {
  const char = (document.getElementById('hanzi-input')||{}).value||'';
  if (!char || !/[\u4e00-\u9fff]/.test(char)) {
    const h = document.getElementById('hanzi-hint');
    if (h) h.textContent = 'Escreve primeiro um caractere chinês.';
    return;
  }
  if (!hanziWriterInstance) { loadChar(char); setTimeout(startQuizMode, 500); }
  else { startQuizMode(); }
}

function startQuizMode() {
  const h = document.getElementById('hanzi-hint');
  if (h) h.innerHTML = '<i class="i i-escrever" aria-hidden="true"></i> Desenha o caractere e segue a ordem dos traços.';
  if (!hanziWriterInstance) return;
  hanziWriterInstance.quiz({
    onMistake: () => { const h=document.getElementById('hanzi-hint'); if(h) h.textContent='Traço errado! O vermelho mostra o traço certo.'; },
    onCorrectStroke: (d) => { const h=document.getElementById('hanzi-hint'); if(h) h.textContent=`✓ Traço ${d.strokeNum+1} certo! Continua…`; },
    onComplete: (d) => { const h=document.getElementById('hanzi-hint'); if(h) h.textContent=d.totalMistakes===0?'Perfeito! Sem erros!':`✓ Feito! ${d.totalMistakes} erro(s). Tenta outra vez!`; }
  });
}

// ═══ MODO ESCURO ═══
// Eu troco a classe "dark" no <body> e guardo a escolha no browser.
function toggleDark() {
  const escuro = document.body.classList.toggle('dark');
  mostrarBotaoEscuro(escuro);
  LS.set('dark', escuro);
}
// O botão mostra sempre o modo para onde se vai (no escuro, oferece o claro)
function mostrarBotaoEscuro(escuro) {
  const botao = document.getElementById('dark-toggle');
  if (!botao) return;
  botao.innerHTML = escuro
    ? '<i class="i i-claro" aria-hidden="true"></i> <span class="site-nav__texto">Claro</span>'
    : '<i class="i i-escuro" aria-hidden="true"></i> <span class="site-nav__texto">Escuro</span>';
  botao.title = escuro ? 'Mudar para o modo claro' : 'Mudar para o modo escuro';
}
// O script está no fim do <body>, por isso a página já existe quando isto corre
if (LS.get('dark', false)) {
  document.body.classList.add('dark');
  mostrarBotaoEscuro(true);
}

