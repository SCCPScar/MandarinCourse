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


// ═══ CONJUNTOS DE CARACTERES PARA TREINAR ═══
// Os caracteres mais úteis do HSK 1 e 2, arrumados por temas, com o pinyin.
// Antes havia só 10 caracteres soltos; os testers pediram mais.
const CONJUNTOS_TRACOS = [
  { nome: 'Números', chars: [['一','yī'],['二','èr'],['三','sān'],['四','sì'],['五','wǔ'],['六','liù'],['七','qī'],['八','bā'],['九','jiǔ'],['十','shí'],['百','bǎi'],['千','qiān']] },
  { nome: 'Pessoas', chars: [['人','rén'],['我','wǒ'],['你','nǐ'],['他','tā'],['她','tā'],['们','men'],['女','nǚ'],['子','zǐ'],['父','fù'],['母','mǔ']] },
  { nome: 'Natureza', chars: [['日','rì'],['月','yuè'],['水','shuǐ'],['火','huǒ'],['山','shān'],['木','mù'],['土','tǔ'],['天','tiān'],['雨','yǔ'],['花','huā']] },
  { nome: 'Verbos', chars: [['吃','chī'],['喝','hē'],['说','shuō'],['看','kàn'],['听','tīng'],['写','xiě'],['学','xué'],['去','qù'],['来','lái'],['买','mǎi']] },
  { nome: 'Lugares e coisas', chars: [['中','zhōng'],['国','guó'],['家','jiā'],['门','mén'],['车','chē'],['书','shū'],['茶','chá'],['饭','fàn'],['钱','qián'],['路','lù']] },
  { nome: 'Palavras pequenas', chars: [['大','dà'],['小','xiǎo'],['好','hǎo'],['不','bù'],['是','shì'],['有','yǒu'],['的','de'],['在','zài'],['很','hěn'],['上','shàng'],['下','xià']] },
];

// Mostro os conjuntos no separador «Traços». Cada caractere é um botão com o pinyin por baixo.
function mostrarConjuntosTracos() {
  const caixa = document.getElementById('hanzi-presets');
  if (!caixa) return;
  caixa.innerHTML = CONJUNTOS_TRACOS.map((c, i) => `
    <div class="conjunto-tracos">
      <div class="conjunto-tracos__topo">
        <h5>${c.nome}</h5>
        <a class="conjunto-tracos__imprimir" href="folha.php?c=${encodeURIComponent(c.chars.map(x => x[0]).join(''))}" target="_blank" rel="noopener"><i class="i i-imprimir" aria-hidden="true"></i> Folha para imprimir</a>
      </div>
      <div class="conjunto-tracos__lista">
        ${c.chars.map(([zh, py]) => `<button type="button" class="preset-char" onclick="loadChar('${zh}')"><span lang="zh-CN">${zh}</span><small>${py}</small></button>`).join('')}
      </div>
    </div>`).join('');
}
ChaPage.onInit(mostrarConjuntosTracos);

// Abro a folha de treino com o caractere que está escrito na caixa (ou com vários, se o aluno escrever vários)
function imprimirFolhaTracos() {
  const valor = (document.getElementById('hanzi-folha')?.value || document.getElementById('hanzi-input')?.value || '').trim();
  window.open('folha.php?c=' + encodeURIComponent(valor), '_blank', 'noopener');
}
