/**
 * utils.js
 * Aqui eu junto as funções pequenas usadas em todo o site:
 * guardar dados no browser, escapar texto, separadores e o quiz rápido.
 */


// ═══ STORAGE (must be first) ═══
const LS={get:(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}}};

// ═══ ESCAPE HELPERS ═══
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
  { q: "O que significa 你好?", zh: "你好", options: ["Adeus", "Olá", "Obrigado", "Desculpa"], answer: 1 },
  { q: "Em que tom está mā?", zh: "mā", options: ["Tom a subir", "Tom a descer", "Tom alto e plano", "Tom que desce e sobe"], answer: 2 },
  { q: "O que significa 谢谢?", zh: "谢谢", options: ["Por favor", "Desculpa", "Obrigado", "Bem-vindo"], answer: 2 },
  { q: "Como se diz \"não percebo\"?", zh: "我不懂", options: ["wǒ bù dǒng", "wǒ bù hǎo", "wǒ bù lái", "wǒ bù gāo"], answer: 0 },
  { q: "Qual é o classificador para livros?", zh: "量词 para 书", options: ["个 gè", "张 zhāng", "本 běn", "条 tiáo"], answer: 2 },
  { q: "Como se pergunta \"quanto custa?\"", zh: "多少钱?", options: ["Nǐ hǎo ma?", "Duōshao qián?", "Zài nǎlǐ?", "Shénme shíhou?"], answer: 1 },
  { q: "Para que serve 不 (bù)?", zh: "不", options: ["Indica o passado", "Nega verbos e adjetivos", "Indica posse", "Faz perguntas"], answer: 1 },
  { q: "Que caractere significa \"pessoa\"?", zh: "Qual é \"pessoa\"?", options: ["口", "人", "心", "手"], answer: 1 },
  { q: "Como se pede a conta num restaurante?", zh: "买单 / 结账", options: ["Wǒ yào chī", "Tài guì le", "Mǎidān / jiézhàng", "Yǒu méiyǒu"], answer: 2 },
  { q: "O que exprime 我去过北京?", zh: "我去过北京", options: ["Vou a Pequim", "Estou em Pequim", "Já estive em Pequim (experiência de vida)", "Quero ir a Pequim"], answer: 2 },
  { q: "O que indica 的 (de)?", zh: "的", options: ["Uma ação terminada", "Uma pergunta", "Posse ou descrição", "Uma negação"], answer: 2 },
  { q: "Que número é 三十五 (sānshíwǔ)?", zh: "三十五", options: ["53", "35", "305", "350"], answer: 1 },
  { q: "Como se diz \"tenho uma reunião às 14h\"?", zh: "下午两点开会", options: ["Wǒ míngtiān yǒu huì", "Xiàwǔ liǎng diǎn kāihuì", "Wǒmen chī fàn ba", "Nǐ shì lǎoshī ma"], answer: 1 },
  { q: "Qual é a forma educada de \"tu\"?", zh: "\"Tu\" formal", options: ["你 nǐ", "他 tā", "您 nín", "我 wǒ"], answer: 2 },
  { q: "O que significa 加油?", zh: "加油", options: ["Pôr água", "Vai-te embora", "Força! Tu consegues!", "Tem cuidado"], answer: 2 },
];

let currentQuestions = [];
let currentQ = 0;
let score = 0;
let answered = false;

function shuffle(arr) { return arr.sort(() => Math.random() - 0.5); }

function startQuiz() {
  currentQuestions = shuffle([...quizData]).slice(0, 8);
  currentQ = 0; score = 0; answered = false;
  renderQuestion();
}

function renderQuestion() {
  const qa = document.getElementById('quiz-area');
  if (currentQ >= currentQuestions.length) {
    const pct = Math.round((score / currentQuestions.length) * 100);
    LS.set('quizDone',true); if(pct===100) LS.set('quizPerfect',true); if(typeof checkAchievements==='function') checkAchievements();
    const msg = pct >= 80 ? '🎉 Excelente! Estás pronto para o nível seguinte.' : pct >= 60 ? '👍 Bom trabalho! Revê as partes em que erraste.' : '📚 Continua a estudar e volta à gramática e ao vocabulário.';
    qa.innerHTML = `<div class="quiz-score">${score}/${currentQuestions.length} · ${pct}%</div><div class="quiz-feedback ${pct>=80?'good':'bad'}" style="text-align:center;font-size:16px">${msg}</div>`;
    document.querySelector('#quiz-container button').textContent = 'Tentar outra vez';
    return;
  }
  const q = currentQuestions[currentQ];
  answered = false;
  qa.innerHTML = `
    <div style="color:var(--ink-light);font-size:13px;margin-bottom:8px">Pergunta ${currentQ+1} de ${currentQuestions.length}</div>
    <div class="progress-bar-wrap"><div class="progress-bar" style="width:${(currentQ/currentQuestions.length)*100}%"></div></div>
    <div class="quiz-question" style="margin-top:1rem"><strong>${q.q}</strong></div>
    <div class="big-chinese">${q.zh}</div>
    <div class="quiz-options">
      ${q.options.map((o,i) => `<button class="quiz-btn" onclick="checkAnswer(${i})">${o}</button>`).join('')}
    </div>
    <div id="qfeedback"></div>
  `;
  document.querySelector('#quiz-container button').style.display = 'none';
}

function checkAnswer(i) {
  if (answered) return;
  answered = true;
  const q = currentQuestions[currentQ];
  const btns = document.querySelectorAll('.quiz-btn');
  btns[q.answer].classList.add('correct');
  if (i !== q.answer) btns[i].classList.add('wrong');
  else score++;
  const fb = document.getElementById('qfeedback');
  fb.className = 'quiz-feedback ' + (i === q.answer ? 'good' : 'bad');
  fb.textContent = i === q.answer ? '✓ Certo!' : `✗ A resposta certa é: ${q.options[q.answer]}`;
  setTimeout(() => { currentQ++; renderQuestion(); document.querySelector('#quiz-container button').style.display = currentQ >= currentQuestions.length ? 'inline-block' : 'none'; }, 1500);
}

// ═══════════════════════════════════════════════════════
// API TABS SWITCHER
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
}




// ═══ PINYIN DISPLAY TOGGLE ═══
function togglePinyinDisplay() {
  const cb = document.getElementById('show-pinyin-toggle');
  const show = cb ? cb.checked : true;
  document.querySelectorAll('.zh-with-pinyin').forEach(el => {
    el.classList.toggle('pinyin-hidden', !show);
  });
  // Also toggle pinyin visibility in tone cards and repeat words
  document.querySelectorAll('.ttc-py, #repeat-target-py, .repeat-py').forEach(el => {
    el.style.display = show ? '' : 'none';
  });
}

