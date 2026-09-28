/**
 * utils.js
 * Storage, Utils, Tabs, i18n, Theme, Quiz vars
 * 学中文 — Curso Completo de Mandarim
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

const quizData = [
  { q: "What does 你好 mean?", zh: "你好", options: ["Goodbye", "Hello", "Thank you", "Sorry"], answer: 1 },
  { q: "Which tone is mā?", zh: "mā", options: ["Rising tone", "Falling tone", "High flat tone", "Dipping tone"], answer: 2 },
  { q: "What does 谢谢 mean?", zh: "谢谢", options: ["Please", "Sorry", "Thank you", "Welcome"], answer: 2 },
  { q: "How do you say 'I don't understand'?", zh: "我不懂", options: ["wǒ bù dǒng", "wǒ bù hǎo", "wǒ bù lái", "wǒ bù gāo"], answer: 0 },
  { q: "What is the measure word for books?", zh: "量词 for 书", options: ["个 gè", "张 zhāng", "本 běn", "条 tiáo"], answer: 2 },
  { q: "How do you say 'How much?' in Chinese?", zh: "多少钱?", options: ["Nǐ hǎo ma?", "Duōshao qián?", "Zài nǎlǐ?", "Shénme shíhou?"], answer: 1 },
  { q: "What does 不 (bù) do?", zh: "不", options: ["Marks past tense", "Negates verbs/adjectives", "Shows possession", "Marks questions"], answer: 1 },
  { q: "Which character means 'person'?", zh: "Which is 'person'?", options: ["口", "人", "心", "手"], answer: 1 },
  { q: "How do you ask for the bill at a restaurant?", zh: "买单 / 结账", options: ["Wǒ yào chī", "Tài guì le", "Mǎidān / jiézhàng", "Yǒu méiyǒu"], answer: 2 },
  { q: "What does 我去过北京 express?", zh: "我去过北京", options: ["I will go to Beijing", "I am in Beijing", "I have been to Beijing (life experience)", "I want to go to Beijing"], answer: 2 },
  { q: "What does 的 (de) indicate?", zh: "的", options: ["Completion of action", "Question", "Possession/modification", "Negation"], answer: 2 },
  { q: "What is 三十五 (sānshíwǔ)?", zh: "三十五", options: ["53", "35", "305", "350"], answer: 1 },
  { q: "How do you say 'I have a meeting at 2pm'?", zh: "下午两点开会", options: ["Wǒ míngtiān yǒu huì", "Xiàwǔ liǎng diǎn kāihuì", "Wǒmen chī fàn ba", "Nǐ shì lǎoshī ma"], answer: 1 },
  { q: "Which is the polite form of 'you'?", zh: "Formal 'you'", options: ["你 nǐ", "他 tā", "您 nín", "我 wǒ"], answer: 2 },
  { q: "What does 加油 mean?", zh: "加油", options: ["Add water", "Go away", "You've got this / Keep going!", "Be careful"], answer: 2 },
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
    const msg = pct >= 80 ? '🎉 Excellent! You\'re ready for the next level!' : pct >= 60 ? '👍 Good work! Review the sections you missed.' : '📚 Keep studying — revisit the grammar and vocabulary sections.';
    qa.innerHTML = `<div class="quiz-score">${score}/${currentQuestions.length} — ${pct}%</div><div class="quiz-feedback ${pct>=80?'good':'bad'}" style="text-align:center;font-size:16px">${msg}</div>`;
    document.querySelector('#quiz-container button').textContent = 'Try Again →';
    return;
  }
  const q = currentQuestions[currentQ];
  answered = false;
  qa.innerHTML = `
    <div style="color:var(--ink-light);font-size:13px;margin-bottom:8px">Question ${currentQ+1} of ${currentQuestions.length}</div>
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
  fb.textContent = i === q.answer ? '✓ Correct!' : `✗ The answer is: ${q.options[q.answer]}`;
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




// ═══ LANGUAGE (PT/EN) ═══
const i18n = {
  pt: {
    nav_foundations:'Fundamentos', nav_tones:'Tons', nav_pinyin:'Pinyin',
    nav_basics:'Básico', nav_grammar:'Gramática', nav_vocabulary:'Vocabulário',
    nav_work:'Trabalho', nav_characters:'Caracteres', nav_quiz:'Quiz',
    nav_plan:'Plano de Estudo', nav_features:'⚡ Funcionalidades', nav_library:'Biblioteca',
    nav_home:'Início', nav_sounds:'Sons', nav_practice:'Praticar',
    dark_btn_dark:'🌙 Escuro', dark_btn_light:'☀️ Claro',
    lang_btn:'🇵🇹 PT',
    hero_title:'Fale <span>Mandarim</span> — Do Zero ao Fluente',
    hero_sub:'Um curso completo, gratuito e intensivo para chegar ao mandarim conversacional e profissional.',
    stat_modules:'Módulos', stat_words:'Palavras Essenciais', stat_patterns:'Padrões de Gramática', stat_level:'Nível Alvo',
    potd_label:'📅 Frase do Dia',
    tab_tutor:'🤖 Tutor IA', tab_conv:'💬 Conversação', tab_flash:'🃏 Flashcards',
    tab_sb:'🔧 Construtor de Frases', tab_chargame:'🎮 Jogo de Caracteres',
    tab_speak:'🔊 Falar', tab_dict:'🔤 Dicionário', tab_hanzi:'✍️ Traços',
    tab_notebook:'📓 Caderno', tab_timer:'⏱️ Temporizador', tab_culture:'🏮 Cultura',
    tab_keyboard:'⌨️ Teclado', tab_mic:'🎤 Pronúncia',
    show_pinyin:'Mostrar Pinyin nos caracteres',
    tone1:'1º — Alto Plano ―', tone2:'2º — Subindo ↗', tone3:'3º — Caindo-Subindo ↘↗', tone4:'4º — Caindo ↘',
    record_btn:'🎤 Iniciar Gravação', hear_target:'🔊 Ouvir Alvo',
    send_btn:'Enviar →', placeholder_tutor:'Pergunte algo em mandarim…',
  },
  en: {
    nav_foundations:'Foundations', nav_tones:'Tones', nav_pinyin:'Pinyin',
    nav_basics:'Basics', nav_grammar:'Grammar', nav_vocabulary:'Vocabulary',
    nav_work:'Work', nav_characters:'Characters', nav_quiz:'Quiz',
    nav_plan:'Study Plan', nav_features:'⚡ Features', nav_library:'Library',
    nav_home:'Home', nav_sounds:'Sounds', nav_practice:'Practice',
    dark_btn_dark:'🌙 Dark', dark_btn_light:'☀️ Light',
    lang_btn:'🇬🇧 EN',
    hero_title:'Speak <span>Mandarin</span> — From Zero to Fluent',
    hero_sub:'A complete, free, intensive course to reach conversational and professional Mandarin.',
    stat_modules:'Core Modules', stat_words:'Essential Words', stat_patterns:'Grammar Patterns', stat_level:'Target Level',
    potd_label:'📅 Phrase of the Day',
    tab_tutor:'🤖 AI Tutor', tab_conv:'💬 Conversation', tab_flash:'🃏 Flashcards',
    tab_sb:'🔧 Sentence Builder', tab_chargame:'🎮 Char Game',
    tab_speak:'🔊 Speak', tab_dict:'🔤 Dictionary', tab_hanzi:'✍️ Strokes',
    tab_notebook:'📓 Notebook', tab_timer:'⏱️ Timer', tab_culture:'🏮 Culture',
    tab_keyboard:'⌨️ Keyboard', tab_mic:'🎤 Pronunciation',
    show_pinyin:'Show Pinyin on characters',
    tone1:'1st — High Flat ―', tone2:'2nd — Rising ↗', tone3:'3rd — Dipping ↘↗', tone4:'4th — Falling ↘',
    record_btn:'🎤 Start Recording', hear_target:'🔊 Hear Target',
    send_btn:'Send →', placeholder_tutor:'Ask anything about Mandarin…',
  }
};

let currentLang = LS.get('lang','pt');

function applyLang(lang) {
  const t = i18n[lang];
  currentLang = lang;
  LS.set('lang', lang);
  // Links da barra de navegação (o nav.js volta a dividir o texto em letras)
  document.querySelectorAll('.site-nav__link[data-i18n]').forEach(a => {
    const label = t[a.dataset.i18n];
    if (!label) return;
    if (typeof ChaNav !== 'undefined') ChaNav.setLabel(a, label); else a.textContent = label;
  });
  document.documentElement.lang = lang === 'pt' ? 'pt' : 'en';
  // Lang button
  const lb = document.getElementById('lang-toggle');
  if(lb) lb.textContent = lang==='pt' ? '🇬🇧 EN' : '🇵🇹 PT';
  // Dark button
  const db = document.getElementById('dark-toggle');
  if(db) db.textContent = document.body.classList.contains('dark') ? t.dark_btn_light : t.dark_btn_dark;
  // Hero
  const h1 = document.querySelector('.hero h1');
  if(h1) h1.innerHTML = t.hero_title;
  const hp = document.querySelector('.hero > p');
  if(hp) hp.textContent = t.hero_sub;
  // Hero stats labels
  const statLabels = document.querySelectorAll('.hero-stat .label');
  ['stat_modules','stat_words','stat_patterns','stat_level'].forEach((k,i)=>{ if(statLabels[i]) statLabels[i].textContent = t[k]; });
  // POTD label
  const pl = document.querySelector('.potd-label');
  if(pl) pl.textContent = t.potd_label;
  // Feature tab buttons (second group only — the big features section)
  const featureTabBtns = document.querySelectorAll('#features .api-tab-btn, #features ~ * .api-tab-btn');
  // Apply to all api-tab-btn in the features section
  document.querySelectorAll('[onclick*="tab-tutor"],[onclick*="tab-conv"],[onclick*="tab-flash"],[onclick*="tab-sb"],[onclick*="tab-chargame"],[onclick*="tab-speak"],[onclick*="tab-dict"],[onclick*="tab-hanzi"],[onclick*="tab-notebook"],[onclick*="tab-timer"],[onclick*="tab-culture"],[onclick*="tab-keyboard"],[onclick*="tab-mic"]').forEach(btn => {
    const oc = btn.getAttribute('onclick')||'';
    if(oc.includes('tab-tutor')) btn.textContent = t.tab_tutor;
    else if(oc.includes('tab-conv')) btn.textContent = t.tab_conv;
    else if(oc.includes('tab-flash')) btn.textContent = t.tab_flash;
    else if(oc.includes('tab-sb')) btn.textContent = t.tab_sb;
    else if(oc.includes('tab-chargame')) btn.textContent = t.tab_chargame;
    else if(oc.includes('tab-speak')) btn.textContent = t.tab_speak;
    else if(oc.includes('tab-dict')) btn.textContent = t.tab_dict;
    else if(oc.includes('tab-hanzi')) btn.textContent = t.tab_hanzi;
    else if(oc.includes('tab-notebook')) btn.textContent = t.tab_notebook;
    else if(oc.includes('tab-timer')) btn.textContent = t.tab_timer;
    else if(oc.includes('tab-culture')) btn.textContent = t.tab_culture;
    else if(oc.includes('tab-keyboard')) btn.textContent = t.tab_keyboard;
    else if(oc.includes('tab-mic')) btn.textContent = t.tab_mic;
  });
  // Tone labels
  const toneCards = document.querySelectorAll('.ttc-tone');
  ['tone1','tone2','tone3','tone4'].forEach((k,i)=>{ if(toneCards[i]) toneCards[i].textContent = t[k]; });
  // Record button
  document.querySelectorAll('#tone-mic-btn').forEach(b=>{ if(!b.classList.contains('recording')) b.textContent = t.record_btn; });
  // Show pinyin label
  document.querySelectorAll('[data-i18n="show_pinyin"]').forEach(el=>{ el.textContent = t.show_pinyin; });
  // Tutor placeholder
  const ti = document.getElementById('tutor-input');
  if(ti) ti.placeholder = t.placeholder_tutor;
  // Send button
  document.querySelectorAll('#tutor-send').forEach(b=>{ if(!b.disabled) b.textContent = t.send_btn; });
}

function toggleLang() {
  applyLang(currentLang === 'pt' ? 'en' : 'pt');
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

