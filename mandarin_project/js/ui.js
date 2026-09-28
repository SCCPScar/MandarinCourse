/**
 * ui.js
 * Toast, Scroll, Hamburger, Keyboard, Achievements, Onboarding, Daily, SRS, Streak, Share
 * 学中文 — Curso Completo de Mandarim
 */

function showToast(msg, duration=2500) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ═══════════════════════════════════════════════════════
// 📜 READING PROGRESS BAR + BACK TO TOP
// ═══════════════════════════════════════════════════════
window.addEventListener('scroll', () => {
  const bar = document.getElementById('read-bar');
  const btn = document.getElementById('back-top');
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (bar) bar.style.width = (total > 0 ? (scrolled / total * 100) : 0) + '%';
  if (btn) btn.style.display = scrolled > 400 ? 'block' : 'none';

  // Dynamic title
  const sections = document.querySelectorAll('section[id], div[id]');
  let current = '';
  sections.forEach(s => { if (s.offsetTop <= scrolled + 80) current = s.id; });
  const titleMap = {foundations:'Fundamentos',tones:'Tons',pinyin:'Pinyin',basics:'Básico',grammar:'Gramática',vocabulary:'Vocabulário',work:'Trabalho',characters:'Caracteres',quiz:'Quiz',plan:'Plano',features:'Funcionalidades',library:'Biblioteca'};
  if (titleMap[current]) document.title = titleMap[current] + ' — 学中文';
  else if (typeof ChaNav !== 'undefined') document.title = ChaNav.pageTitle();
}, {passive: true});

// (O menu do celular agora fica em js/nav.js)

// ═══════════════════════════════════════════════════════
// ⌨️ KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.code === 'Space') {
    e.preventDefault();
    const fc = document.querySelector('#tab-flash.active .flashcard');
    if (fc) fc.click();
  }
  if (e.code === 'Digit1') { const b = document.querySelector('#tab-flash.active .fc-btn.hard'); if(b) b.click(); }
  if (e.code === 'Digit2') { const b = document.querySelector('#tab-flash.active .fc-btn.ok'); if(b) b.click(); }
  if (e.code === 'Digit3') { const b = document.querySelector('#tab-flash.active .fc-btn.easy'); if(b) b.click(); }
  if (e.code === 'Enter' && e.ctrlKey) {
    const btn = document.getElementById('tutor-send');
    if (btn && !btn.disabled) btn.click();
  }
  if (e.code === 'Escape') closeDailyModal();
});

// ═══════════════════════════════════════════════════════
// 🏆 ACHIEVEMENTS
// ═══════════════════════════════════════════════════════
const BADGES = [
  { id:'badge-start',  check: s => true,              label:'🌱 Início'     },
  { id:'badge-10',     check: s => s.learnedCount>=10, label:'📚 10 palavras' },
  { id:'badge-50',     check: s => s.learnedCount>=50, label:'🎯 50 palavras' },
  { id:'badge-100',    check: s => s.learnedCount>=100,label:'💯 100 palavras'},
  { id:'badge-streak3',check: s => s.streak>=3,        label:'🔥 3 dias'      },
  { id:'badge-streak7',check: s => s.streak>=7,        label:'⚡ 7 dias'      },
  { id:'badge-streak30',check:s => s.streak>=30,       label:'👑 30 dias'     },
  { id:'badge-quiz',   check: s => s.quizDone,         label:'🧠 Quiz'        },
  { id:'badge-tutor',  check: s => s.tutorUsed,        label:'🤖 IA'          },
  { id:'badge-perfect',check: s => s.quizPerfect,      label:'⭐ Perfeito'    },
];
let earnedBadges = LS.get('badges', []);

function checkAchievements() {
  const stats = {
    learnedCount: Object.keys(LS.get('learned',{})).length,
    streak: LS.get('streak',0),
    quizDone: LS.get('quizDone',false),
    tutorUsed: LS.get('tutorUsed',false),
    quizPerfect: LS.get('quizPerfect',false),
  };
  let newlyEarned = false;
  BADGES.forEach(b => {
    const el = document.getElementById(b.id);
    if (!el) return;
    if (b.check(stats)) {
      if (!earnedBadges.includes(b.id)) {
        earnedBadges.push(b.id);
        LS.set('badges', earnedBadges);
        el.classList.add('earned','new');
        showToast('🏆 Conquista desbloqueada: ' + b.label);
        setTimeout(()=>el.classList.remove('new'), 600);
        newlyEarned = true;
      } else {
        el.classList.add('earned');
      }
    }
  });
  const cnt = document.getElementById('ach-count');
  if (cnt) cnt.textContent = earnedBadges.length + '/' + BADGES.length + ' conquistas';
}

// ═══════════════════════════════════════════════════════
// 🎓 ONBOARDING
// ═══════════════════════════════════════════════════════
let selectedLevel = null;
function selectLevel(btn, level) {
  document.querySelectorAll('.onboard-btn').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedLevel = level;
  document.getElementById('onboard-start').style.display = 'block';
}
function finishOnboard() {
  LS.set('onboarded', true);
  LS.set('level', selectedLevel || 'zero');
  document.getElementById('onboard-overlay').style.display = 'none';
  checkAchievements();
  showToast('🎉 Bem-vindo! Vamos começar a aprender mandarim!');
  // Scroll to suggested start based on level
  // Leva o aluno à página certa para o nível dele
  const targets = { zero:'introducao.html#foundations', basic:'sons.html#tones', inter:'basico.html#grammar', adv:'praticar.html#features' };
  const target = targets[selectedLevel] || targets.zero;
  setTimeout(() => ChaNav.go(target), 500);
}

// ═══════════════════════════════════════════════════════
// 📅 DAILY STUDY SESSION
// ═══════════════════════════════════════════════════════
function openDailyModal() {
  const learned = LS.get('learned',{});
  const learnedCount = Object.keys(learned).length;
  const streak = LS.get('streak',0);

  // Pick 3 SRS review words (ones due today) + 2 new words
  const srsData = LS.get('srs',{});
  const today = new Date().toDateString();
  const dueWords = allVocab.filter(w => {
    const d = srsData[w.zh];
    return d && d.nextReview && new Date(d.nextReview).toDateString() <= today;
  }).slice(0,3);
  const newWords = allVocab.filter(w => !learned[w.zh] && !srsData[w.zh]).slice(0,2);
  const sessionWords = [...dueWords, ...newWords];

  const steps = [
    { icon:'🔥', title:`Streak: ${streak} dia${streak!==1?'s':''}`, desc: streak>0 ? `Mantenha o ritmo! Você já estuda há ${streak} dia${streak!==1?'s':''} seguido${streak!==1?'s':''}.` : 'Comece hoje e construa o seu streak!', action: null },
    { icon:'📚', title:'Revisão SRS', desc: dueWords.length > 0 ? `Você tem ${dueWords.length} palavra${dueWords.length!==1?'s':''} para revisar hoje:` : 'Nenhuma palavra para revisar hoje! Aprenda palavras novas primeiro.', words: dueWords },
    { icon:'✨', title:'Palavras Novas', desc: newWords.length > 0 ? `Aprenda ${newWords.length} palavra${newWords.length!==1?'s':''} nova${newWords.length!==1?'s':''} hoje:` : 'Excelente! Você já aprendeu todas as palavras disponíveis.', words: newWords },
    { icon:'🎤', title:'Praticar Pronúncia', desc: 'Vá até a seção Funcionalidades → Pronúncia e pratique a gravação de 2 ou 3 frases.', action: 'praticar.html#features' },
    { icon:'🤖', title:'Tutor IA', desc: 'Faça uma pergunta ao tutor IA sobre mandarim ou peça para ele criar uma frase de prática.', action: 'praticar.html#features' },
  ];

  const html = steps.map((s,i) => `
    <div style="display:flex;gap:12px;padding:12px;border-radius:12px;background:var(--paper-mid);margin-bottom:8px;">
      <div style="font-size:28px;flex-shrink:0">${s.icon}</div>
      <div>
        <div style="font-weight:700;margin-bottom:2px">${s.title}</div>
        <div style="font-size:13px;color:var(--ink-light)">${s.desc}</div>
        ${s.words && s.words.length ? s.words.map(w=>`<span style="display:inline-block;margin:4px 4px 0 0;padding:3px 8px;background:var(--paper-dark);border-radius:8px;font-size:13px"><span style="font-family:var(--font-chinese);color:var(--red)">${w.zh}</span> <span style="color:var(--ink-light)">${w.py}</span> <span>${w.en}</span></span>`).join('') : ''}
        ${s.action ? `<a href="${s.action}" onclick="closeDailyModal()" style="display:inline-block;margin-top:6px;color:var(--red);font-size:13px;font-weight:600">Ir agora →</a>` : ''}
      </div>
    </div>
  `).join('');

  document.getElementById('daily-steps').innerHTML = html;
  document.getElementById('daily-modal').classList.add('open');
}
function closeDailyModal() {
  document.getElementById('daily-modal').classList.remove('open');
  LS.set('lastDaily', new Date().toDateString());
  checkAchievements();
}

// ═══════════════════════════════════════════════════════
// 🃏 SRS — SPACED REPETITION (SM-2 simplified)
// ═══════════════════════════════════════════════════════
let srsData = LS.get('srs', {});

function srsRate(word, quality) {
  // quality: 0=hard, 1=ok, 2=easy
  if (!srsData[word]) srsData[word] = { interval:1, ef:2.5, reps:0, nextReview: new Date().toISOString() };
  const card = srsData[word];
  if (quality === 0) {
    card.interval = 1; card.reps = 0;
  } else {
    card.reps += 1;
    if (card.reps === 1) card.interval = 1;
    else if (card.reps === 2) card.interval = 3;
    else card.interval = Math.round(card.interval * card.ef);
    card.ef = Math.max(1.3, card.ef + 0.1 - (2-quality)*(0.08+(2-quality)*0.02));
  }
  const next = new Date();
  next.setDate(next.getDate() + card.interval);
  card.nextReview = next.toISOString();
  srsData[word] = card;
  LS.set('srs', srsData);
}

// Hook into existing rateCard function to also update SRS
// rateCard merged into original above

// ═══════════════════════════════════════════════════════
// 📊 REAL STREAK SYSTEM
// ═══════════════════════════════════════════════════════
function updateStreakReal() {
  const today = new Date().toDateString();
  const lastStudy = LS.get('lastStudy', null);
  let streak = LS.get('streak', 0);

  if (lastStudy === today) {
    // Already studied today, streak unchanged
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastStudy === yesterday.toDateString()) {
      streak += 1;
    } else if (lastStudy !== today) {
      streak = 1; // Reset streak (missed a day)
    }
    LS.set('streak', streak);
    LS.set('lastStudy', today);
  }

  // Update banner
  const banner = document.getElementById('streak-text');
  if (banner) {
    if (streak >= 1) {
      banner.innerHTML = `<span class="streak-fire">🔥</span> ${streak} dia${streak!==1?'s':''} seguido${streak!==1?'s':''}! Continue assim!`;
      document.getElementById('streak-banner').style.display = '';
    }
  }
  checkAchievements();
  return streak;
}

// ═══════════════════════════════════════════════════════
// 📤 SHARE PROGRESS CARD
// ═══════════════════════════════════════════════════════
function generateShareCard() {
  const count = Object.keys(LS.get('learned',{})).length;
  const streak = LS.get('streak',0);
  const card = document.getElementById('share-card');
  if (!card) return;
  card.style.display = 'block';
  card.innerHTML = `
    <div class="sc-zh">学中文</div>
    <div class="sc-stat">${count} palavras</div>
    <p>Aprendi ${count} palavras em mandarim com ${streak} dia${streak!==1?'s':''} de streak! 🇨🇳</p>
    <p style="font-size:12px;opacity:.7">学中文 — Curso Gratuito de Mandarim</p>
  `;
  const text = `Aprendi ${count} palavras em mandarim! 🇨🇳🔥 ${streak} dias de estudo seguidos. #Mandarim #学中文`;
  if (navigator.share) {
    navigator.share({ title:'Meu progresso em mandarim', text });
  } else {
    navigator.clipboard?.writeText(text);
    showToast('📋 Texto copiado! Cole nas redes sociais.');
  }
}

// Add share button to notebook tab if it exists
