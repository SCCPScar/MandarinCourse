/**
 * utils.js
 * Aqui eu junto as funções pequenas usadas em todo o site:
 * guardar dados no browser, escapar texto, separadores e o quiz rápido.
 */


// ═══ ARMAZENAMENTO NO BROWSER (tem de vir primeiro) ═══
const LS={get:(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}}};

// ═══ ESCAPAR TEXTO ═══
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function escHtml(s){return esc(s);}

function switchTab(e, id) {
  const parent = e.target.closest('.tabs').parentElement;
  parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  e.target.classList.add('active');
  const el = parent.querySelector('#' + id);
  if (el) el.classList.add('active');
}

// As perguntas do quiz rápido (a página escolhe 8 ao acaso)
const quizData = [
  { q: "O que significa 你好?", zh: "你好", py: "nǐ hǎo", options: ["Adeus", "Olá", "Obrigado", "Desculpa"], answer: 1 },
  { q: "Em que tom está mā?", zh: "mā", options: ["Tom a subir", "Tom a descer", "Tom alto e plano", "Tom que desce e sobe"], answer: 2 },
  { q: "O que significa 谢谢?", zh: "谢谢", py: "xièxie", options: ["Por favor", "Desculpa", "Obrigado", "Bem-vindo"], answer: 2 },
  { q: "Como se diz \"não percebo\"?", zh: "我不懂", py: "wǒ bù dǒng", options: ["wǒ bù dǒng", "wǒ bù hǎo", "wǒ bù lái", "wǒ bù gāo"], answer: 0 },
  { q: "Qual é o classificador para livros?", zh: "量词 para 书", py: "liàngcí para shū", options: ["个 gè", "张 zhāng", "本 běn", "条 tiáo"], answer: 2 },
  { q: "Como se pergunta \"quanto custa?\"", zh: "多少钱?", py: "duōshao qián?", options: ["Nǐ hǎo ma?", "Duōshao qián?", "Zài nǎlǐ?", "Shénme shíhou?"], answer: 1 },
  { q: "Para que serve 不 (bù)?", zh: "不", py: "bù", options: ["Indica o passado", "Nega verbos e adjetivos", "Indica posse", "Faz perguntas"], answer: 1 },
  { q: "Que caractere significa \"pessoa\"?", zh: "Qual é \"pessoa\"?", options: ["口", "人", "心", "手"], answer: 1 },
  { q: "Como se pede a conta num restaurante?", zh: "买单 / 结账", py: "mǎidān / jiézhàng", options: ["Wǒ yào chī", "Tài guì le", "Mǎidān / jiézhàng", "Yǒu méiyǒu"], answer: 2 },
  { q: "O que exprime 我去过北京?", zh: "我去过北京", py: "wǒ qùguo Běijīng", options: ["Vou a Pequim", "Estou em Pequim", "Já estive em Pequim (experiência de vida)", "Quero ir a Pequim"], answer: 2 },
  { q: "O que indica 的 (de)?", zh: "的", py: "de", options: ["Uma ação terminada", "Uma pergunta", "Posse ou descrição", "Uma negação"], answer: 2 },
  { q: "Que número é 三十五 (sānshíwǔ)?", zh: "三十五", py: "sānshíwǔ", options: ["53", "35", "305", "350"], answer: 1 },
  { q: "Como se diz \"tenho uma reunião às 14h\"?", zh: "下午两点开会", py: "xiàwǔ liǎng diǎn kāihuì", options: ["Wǒ míngtiān yǒu huì", "Xiàwǔ liǎng diǎn kāihuì", "Wǒmen chī fàn ba", "Nǐ shì lǎoshī ma"], answer: 1 },
  { q: "Qual é a forma educada de \"tu\"?", zh: "\"Tu\" formal", options: ["你 nǐ", "他 tā", "您 nín", "我 wǒ"], answer: 2 },
  { q: "O que significa 加油?", zh: "加油", py: "jiāyóu", options: ["Pôr água", "Vai-te embora", "Força! Tu consegues!", "Tem cuidado"], answer: 2 },
];

let currentQuestions = [];
let currentQ = 0;
let score = 0;
let answered = false;
let erradas = [];   // as perguntas que o aluno errou, para mostrar no fim

function shuffle(arr) { return arr.sort(() => Math.random() - 0.5); }

// Começa um quiz com 8 perguntas ao acaso (ou só com as que o aluno errou da última vez)
function startQuiz(soAsErradas) {
  currentQuestions = soAsErradas && erradas.length ? [...erradas] : shuffle([...quizData]).slice(0, 8);
  currentQ = 0; score = 0; answered = false; erradas = [];
  document.getElementById('quiz-comecar').style.display = 'none';
  renderQuestion();
}

function renderQuestion() {
  const qa = document.getElementById('quiz-area');
  if (currentQ >= currentQuestions.length) { mostrarFimQuiz(); return; }
  const q = currentQuestions[currentQ];
  answered = false;
  // Se a pergunta mostra chinês, ponho o pinyin e os botões Ouvir / Devagar (o texto vem do quizData, que é meu)
  const chines = soChines(q.zh);
  qa.innerHTML = `
    <div style="color:var(--ink-light);font-size:0.875rem;margin-bottom:8px">Pergunta ${currentQ+1} de ${currentQuestions.length}</div>
    <div class="progress-bar-wrap"><div class="progress-bar" style="width:${(currentQ/currentQuestions.length)*100}%"></div></div>
    <div class="quiz-question" style="margin-top:1rem"><strong>${q.q}</strong></div>
    <div class="big-chinese">${q.zh}</div>
    ${q.py ? `<div class="quiz-pinyin">${q.py}</div>` : ''}
    ${chines ? `<div class="quiz-ouvir">${botoesOuvir(chines, q.py || chines)}</div>` : ''}
    <div class="quiz-options">
      ${q.options.map((o,i) => `<button class="quiz-btn" onclick="checkAnswer(${i})">${o}</button>`).join('')}
    </div>
    <div id="qfeedback"></div>
  `;
}

// O aluno responde: mostro a certa e a errada, e o botão «Próxima pergunta».
// Já não passa sozinho à pergunta seguinte: assim há tempo para ler a correção.
function checkAnswer(i) {
  if (answered) return;
  answered = true;
  const q = currentQuestions[currentQ];
  const btns = document.querySelectorAll('.quiz-btn');
  btns.forEach(b => b.disabled = true);
  btns[q.answer].classList.add('correct');
  if (i !== q.answer) { btns[i].classList.add('wrong'); erradas.push(q); }
  else score++;
  const ultima = currentQ === currentQuestions.length - 1;
  const fb = document.getElementById('qfeedback');
  fb.className = 'quiz-feedback ' + (i === q.answer ? 'good' : 'bad');
  fb.innerHTML = (i === q.answer ? '✓ Certo!' : `✗ A resposta certa é: <strong>${q.options[q.answer]}</strong>`)
    + `<div><button type="button" class="botao-cha quiz-seguinte" id="quiz-seguinte">${ultima ? 'Ver o resultado' : 'Próxima pergunta'} <i class="i i-seguinte" aria-hidden="true"></i></button></div>`;
  const seguinte = document.getElementById('quiz-seguinte');
  seguinte.addEventListener('click', () => { currentQ++; renderQuestion(); });
  seguinte.focus();
}

// No fim: a pontuação, uma mensagem e a lista das perguntas erradas com a resposta certa
function mostrarFimQuiz() {
  const qa = document.getElementById('quiz-area');
  const pct = Math.round((score / currentQuestions.length) * 100);
  LS.set('quizDone',true); if(pct===100) LS.set('quizPerfect',true); if(typeof checkAchievements==='function') checkAchievements();
  const msg = pct >= 80 ? 'Excelente! Estás pronto para o nível seguinte.' : pct >= 60 ? 'Bom trabalho! Revê as perguntas em que erraste.' : 'Continua a estudar e volta à gramática e ao vocabulário.';
  const lista = erradas.map(q => `<li><strong>${q.q}</strong> <span class="quiz-certa">${q.options[q.answer]}</span></li>`).join('');
  qa.innerHTML = `<div class="quiz-score">${score}/${currentQuestions.length} · ${pct}%</div>
    <div class="quiz-feedback ${pct>=80?'good':'bad'}" style="text-align:center;font-size:1rem">${msg}</div>
    ${erradas.length ? `<h4 class="quiz-erradas-titulo">Para estudar depois</h4><ul class="quiz-erradas">${lista}</ul>
      <button type="button" class="botao-cha" onclick="startQuiz(true)"><i class="i i-repetir" aria-hidden="true"></i> Repetir as que errei</button>` : ''}`;
  const comecar = document.getElementById('quiz-comecar');
  comecar.textContent = 'Fazer outro quiz';
  comecar.style.display = 'inline-block';
}


// ═══════════════════════════════════════════════════════
// TROCAR DE SEPARADOR
// ═══════════════════════════════════════════════════════
function switchApiTab(e, id) {
  const btn = e.target;
  const tabBar = btn.parentElement;
  const container = tabBar.parentElement;
  tabBar.querySelectorAll('.api-tab-btn').forEach(b => b.classList.remove('active'));
  container.querySelectorAll('.api-tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const target = container.querySelector('#' + id);
  if (target) target.classList.add('active');
  // Se saio do separador do jogo de caracteres, o jogo para (senão continuava a falar escondido)
  if (id !== 'tab-chargame' && typeof pararCG === 'function') pararCG();
}




// ═══ MOSTRAR OU ESCONDER O PINYIN ═══
function togglePinyinDisplay() {
  const cb = document.getElementById('show-pinyin-toggle');
  const show = cb ? cb.checked : true;
  document.querySelectorAll('.zh-with-pinyin').forEach(el => {
    el.classList.toggle('pinyin-hidden', !show);
  });
  // Também mostro ou escondo o pinyin nos cartões dos tons e nas palavras para repetir
  document.querySelectorAll('.ttc-py, #repeat-target-py, .repeat-py').forEach(el => {
    el.style.display = show ? '' : 'none';
  });
}

