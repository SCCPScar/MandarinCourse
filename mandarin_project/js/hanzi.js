/**
 * hanzi.js
 * HanziWriter — Animação e Quiz de Caracteres
 * 学中文 — Curso Completo de Mandarim
 */

// ═══ HANZIWRITER ═══
let hanziWriterInstance = null;

// ═══ HANZIWRITER FUNCTIONS ═══
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
      strokeColor:'#C0392B', radicalColor:'#922B21',
      outlineColor:'#E8E0CC', showOutline:true,
      strokeAnimationSpeed:1, delayBetweenStrokes:200, rendererType:'svg'
    });
    if (hint) hint.textContent = 'Click ▶ Animate ou ✏️ Quiz Me';
  } catch(e) { if (hint) hint.textContent = 'Caractere não encontrado.'; }
}

function animateHanzi() {
  const char = (document.getElementById('hanzi-input')||{}).value||'';
  if (!char || !/[\u4e00-\u9fff]/.test(char)) {
    const h = document.getElementById('hanzi-hint');
    if (h) h.textContent = 'Por favor insira um caractere chinês primeiro.';
    return;
  }
  if (!hanziWriterInstance) { loadChar(char); setTimeout(()=>{ if(hanziWriterInstance) hanziWriterInstance.animateCharacter(); },400); }
  else { hanziWriterInstance.animateCharacter(); }
  const h = document.getElementById('hanzi-hint');
  if (h) h.textContent = 'Observe a ordem dos traços!';
}

function quizHanzi() {
  const char = (document.getElementById('hanzi-input')||{}).value||'';
  if (!char || !/[\u4e00-\u9fff]/.test(char)) {
    const h = document.getElementById('hanzi-hint');
    if (h) h.textContent = 'Por favor insira um caractere chinês primeiro.';
    return;
  }
  if (!hanziWriterInstance) { loadChar(char); setTimeout(startQuizMode, 500); }
  else { startQuizMode(); }
}

function startQuizMode() {
  const h = document.getElementById('hanzi-hint');
  if (h) h.textContent = '✏️ Desenhe o caractere! Siga a ordem dos traços.';
  if (!hanziWriterInstance) return;
  hanziWriterInstance.quiz({
    onMistake: () => { const h=document.getElementById('hanzi-hint'); if(h) h.textContent='❌ Traço errado! O vermelho mostra o correto.'; },
    onCorrectStroke: (d) => { const h=document.getElementById('hanzi-hint'); if(h) h.textContent=`✓ Traço ${d.strokeNum+1} correto! Continue…`; },
    onComplete: (d) => { const h=document.getElementById('hanzi-hint'); if(h) h.textContent=d.totalMistakes===0?'🎉 Perfeito! Sem erros!':`✓ Feito! ${d.totalMistakes} erro(s). Tente de novo!`; }
  });
}

// ═══ DARK MODE ═══
function toggleDark(){document.body.classList.toggle('dark');const d=document.body.classList.contains('dark');const t=i18n[currentLang]||i18n.pt;document.getElementById('dark-toggle').textContent=d?t.dark_btn_light:t.dark_btn_dark;LS.set('dark',d);}
// Script is at bottom of <body> so DOM is already ready — no need to wait for DOMContentLoaded
if(LS.get('dark',false)){document.body.classList.add('dark');const dt=document.getElementById('dark-toggle');if(dt)dt.textContent='☀️ Light';}

