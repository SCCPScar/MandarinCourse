/**
 * init.js
 * Inicialização — regista o que corre em cada página (ver js/page.js)
 * 学中文 — Curso Completo de Mandarim
 */

// Botão "Partilhar Progresso" no caderno (só nas páginas que têm o caderno)
ChaPage.onInit(() => {
  const nb = document.getElementById('tab-notebook');
  if (nb && !nb.querySelector('#share-card')) {
    const shareDiv = document.createElement('div');
    shareDiv.style.cssText = 'margin-top:16px;text-align:center';
    shareDiv.innerHTML = `
      <button onclick="generateShareCard()" style="background:var(--red);color:#fff;border:none;padding:10px 20px;border-radius:10px;font-size:14px;cursor:pointer;font-family:var(--font-main)">📤 Partilhar Progresso</button>
      <div id="share-card"></div>
    `;
    nb.appendChild(shareDiv);
  }
});

// ═══════════════════════════════════════════════════════
// 🎮 INIT ALL NEW FEATURES
// ═══════════════════════════════════════════════════════
// ── Corre UMA vez, quando o site abre ──────────────────────
// Onboarding na primeira visita (o modal fica fora do <main>, por isso não se repete)
if (!LS.get('onboarded', false)) {
  setTimeout(() => {
    document.getElementById('onboard-overlay').style.display = 'flex';
  }, 800);
}

// ── Corre em CADA página que abre ──────────────────────────
ChaPage.onInit(() => {
  applyLang(currentLang);
  updateStreakReal();
  if (LS.get('onboarded', false)) checkAchievements();

  // Dica de atalhos de teclado nos flashcards
  const flashTab = document.getElementById('tab-flash');
  if (flashTab && !flashTab.querySelector('.fc-shortcuts')) {
    const hint = document.createElement('div');
    hint.className = 'fc-shortcuts';
    hint.style.cssText = 'font-size:12px;color:var(--ink-light);text-align:center;margin-top:8px;';
    hint.innerHTML = 'Atalhos: <span class="kbd">Espaço</span> virar carta · <span class="kbd">1</span> Difícil · <span class="kbd">2</span> OK · <span class="kbd">3</span> Fácil';
    flashTab.appendChild(hint);
  }

  // Cada função só atua se a página tiver os elementos dela
  [updateProgress, setPotd, initFC, renderScenarios, renderNb, updateStreak].forEach(fn => {
    try { fn(); } catch (err) { /* esta página não tem este bloco */ }
  });
  if (document.getElementById('hanzi-target')) loadChar('中');
  const rs=document.getElementById('speak-rate');const rl=document.getElementById('speak-rate-label');if(rs&&rl)rs.addEventListener('input',()=>{rl.textContent=rs.value+'×';});
});



// ═══════════════════════════════════════════════════════════════
// 🎤 PRONUNCIATION & TONE TRAINER
// ═══════════════════════════════════════════════════════════════

// --- Mic Sub-tabs ---
function switchMicTab(e, id) {
  document.querySelectorAll('.mic-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.mic-tab-content').forEach(c => c.classList.remove('active'));
  e.target.classList.add('active');
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

// --- Shared Audio Context ---
let audioCtx = null, micStream = null, analyser = null, pitchSrc = null;

async function getMic() {
  if (micStream) return micStream;
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    return micStream;
  } catch (e) {
    alert('Microphone access denied. Please allow microphone access in your browser settings and try again.');
    return null;
  }
}

function initAudioCtx(stream) {
  if (audioCtx) { try { audioCtx.close(); } catch(e){} }
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.7;
  pitchSrc = audioCtx.createMediaStreamSource(stream);
  pitchSrc.connect(analyser);
}

// ═══ YIN PITCH DETECTION ═══
function detectPitch(buf, sampleRate) {
  const SIZE = buf.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);
  const threshold = 0.1;
  let rmsLevel = 0;
  for (let i = 0; i < SIZE; i++) rmsLevel += buf[i] * buf[i];
  rmsLevel = Math.sqrt(rmsLevel / SIZE);
  if (rmsLevel < 0.01) return -1; // silence

  // Autocorrelation pitch detection
  const correlations = new Array(MAX_SAMPLES).fill(0);
  for (let i = 0; i < MAX_SAMPLES; i++) {
    for (let j = 0; j < MAX_SAMPLES; j++) {
      correlations[i] += buf[j] * buf[j + i];
    }
  }
  let d = 0;
  while (d < MAX_SAMPLES && correlations[d] > correlations[d + 1]) d++;
  let maxVal = -1, maxPos = -1;
  for (let i = d; i < MAX_SAMPLES; i++) {
    if (correlations[i] > maxVal) { maxVal = correlations[i]; maxPos = i; }
  }
  if (maxPos === -1) return -1;
  let T0 = maxPos;
  const x1 = correlations[T0 - 1], x2 = correlations[T0], x3 = correlations[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 -= b / (2 * a);
  return sampleRate / T0;
}

// ═══════════════════════
// TONE VISUALIZER
// ═══════════════════════
let toneRecording = false, toneAnimFrame = null;
let pitchHistory = [], selectedTone = 1;
let toneCanvas, toneCtx, waveCanvas, waveCtx;

const TONE_COLORS = { 1: '#1A5276', 2: '#1E8449', 3: '#D4AC0D', 4: '#C0392B' };
const TONE_NAMES = { 1: '1st — High Flat', 2: '2nd — Rising', 3: '3rd — Dipping', 4: '4th — Falling' };

// Ideal tone paths (normalised 0–1, y=0 is TOP of canvas = highest pitch)
const TONE_PATHS = {
  1: [.15,.15,.14,.15,.15,.14,.15,.15], // flat high
  2: [.85,.78,.68,.56,.43,.32,.22,.15], // rising (start low, go high)
  3: [.45,.52,.62,.72,.78,.72,.60,.45], // dip then rise
  4: [.15,.22,.32,.45,.58,.70,.82,.90], // falling (start high, go low)
};

function selectTone(card, tone) {
  document.querySelectorAll('.tone-target-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  selectedTone = tone;
  pitchHistory = [];
  clearToneCanvas();
}

function clearToneCanvas() {
  if (!toneCtx) initToneCanvas();
  drawToneGuide();
  pitchHistory = [];
  const fb = document.getElementById('tone-feedback');
  if (fb) fb.innerHTML = '';
}

function initToneCanvas() {
  toneCanvas = document.getElementById('tone-canvas');
  waveCanvas = document.getElementById('wave-canvas');
  if (!toneCanvas || !waveCanvas) return;
  toneCanvas.width = toneCanvas.parentElement.clientWidth || 600;
  toneCanvas.height = 140;
  waveCanvas.width = waveCanvas.parentElement?.clientWidth || 600;
  waveCanvas.height = 80;
  toneCtx = toneCanvas.getContext('2d');
  waveCtx = waveCanvas.getContext('2d');
  drawToneGuide();
}

function drawToneGuide() {
  if (!toneCtx) return;
  const W = toneCanvas.width, H = toneCanvas.height;
  toneCtx.clearRect(0, 0, W, H);

  // Background gradient
  const bg = toneCtx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, 'rgba(26,26,46,0.06)');
  bg.addColorStop(1, 'rgba(26,26,46,0.01)');
  toneCtx.fillStyle = bg;
  toneCtx.fillRect(0, 0, W, H);

  // Horizontal guide lines
  const levels = [
    { y: 0.1, label: 'High (5)', color: 'rgba(192,57,43,.2)' },
    { y: 0.32, label: 'Mid-high (4)', color: 'rgba(212,172,13,.15)' },
    { y: 0.54, label: 'Mid (3)', color: 'rgba(30,132,73,.15)' },
    { y: 0.76, label: 'Low (2)', color: 'rgba(26,82,118,.15)' },
    { y: 0.92, label: 'Very low (1)', color: 'rgba(100,100,100,.1)' },
  ];
  levels.forEach(l => {
    toneCtx.strokeStyle = l.color;
    toneCtx.lineWidth = 1;
    toneCtx.setLineDash([4, 4]);
    toneCtx.beginPath();
    toneCtx.moveTo(40, H * l.y);
    toneCtx.lineTo(W - 10, H * l.y);
    toneCtx.stroke();
    toneCtx.setLineDash([]);
    toneCtx.fillStyle = 'rgba(86,101,115,.7)';
    toneCtx.font = '9px Inter, sans-serif';
    toneCtx.fillText(l.label, 2, H * l.y + 4);
  });

  // Draw ideal tone guide path in gold
  const path = TONE_PATHS[selectedTone];
  const col = TONE_COLORS[selectedTone];
  const stepW = (W - 60) / (path.length - 1);
  toneCtx.strokeStyle = '#D4AC0D';
  toneCtx.lineWidth = 2.5;
  toneCtx.setLineDash([6, 4]);
  toneCtx.beginPath();
  path.forEach((v, i) => {
    const x = 50 + i * stepW;
    const y = H * (0.05 + v * 0.88);
    i === 0 ? toneCtx.moveTo(x, y) : toneCtx.lineTo(x, y);
  });
  toneCtx.stroke();
  toneCtx.setLineDash([]);

  // Label
  toneCtx.fillStyle = col;
  toneCtx.font = 'bold 12px Inter, sans-serif';
  toneCtx.fillText(TONE_NAMES[selectedTone], 50, 14);
  toneCtx.fillStyle = '#D4AC0D';
  toneCtx.fillText('── Target', W - 90, 14);
}

function drawPitchLine() {
  if (!toneCtx || pitchHistory.length < 2) return;
  const W = toneCanvas.width, H = toneCanvas.height;
  // Redraw guide first
  drawToneGuide();

  const validPitches = pitchHistory.filter(p => p > 0);
  if (validPitches.length < 2) return;

  const minHz = Math.min(...validPitches) * 0.95;
  const maxHz = Math.max(...validPitches) * 1.05;
  const range = maxHz - minHz || 1;

  toneCtx.strokeStyle = '#C0392B';
  toneCtx.lineWidth = 3;
  toneCtx.lineJoin = 'round';
  toneCtx.lineCap = 'round';
  toneCtx.shadowColor = 'rgba(192,57,43,.4)';
  toneCtx.shadowBlur = 6;
  toneCtx.beginPath();

  const stepW = (W - 60) / Math.max(pitchHistory.length - 1, 1);
  let started = false;
  pitchHistory.forEach((hz, i) => {
    if (hz <= 0) return;
    const x = 50 + i * stepW;
    const norm = 1 - (hz - minHz) / range;
    const y = H * (0.05 + norm * 0.88);
    if (!started) { toneCtx.moveTo(x, y); started = true; }
    else toneCtx.lineTo(x, y);
  });
  toneCtx.stroke();
  toneCtx.shadowBlur = 0;
}

function drawWaveform(dataArray) {
  if (!waveCtx) return;
  const W = waveCanvas.width, H = waveCanvas.height;
  waveCtx.fillStyle = '#1A1A2E';
  waveCtx.fillRect(0, 0, W, H);
  waveCtx.strokeStyle = '#C0392B';
  waveCtx.lineWidth = 1.5;
  waveCtx.beginPath();
  const sliceW = W / dataArray.length;
  let x = 0;
  dataArray.forEach((v, i) => {
    const y = (v / 255) * H;
    i === 0 ? waveCtx.moveTo(x, y) : waveCtx.lineTo(x, y);
    x += sliceW;
  });
  waveCtx.stroke();
}

async function toggleToneRecording() {
  if (!toneCanvas) initToneCanvas();
  const btn = document.getElementById('tone-mic-btn');
  if (toneRecording) {
    // Stop
    toneRecording = false;
    if (toneAnimFrame) cancelAnimationFrame(toneAnimFrame);
    btn.className = 'mic-btn idle';
    btn.textContent = '🎤 Start Recording';
    analyzeToneResult();
    return;
  }
  const stream = await getMic();
  if (!stream) return;
  initAudioCtx(stream);
  toneRecording = true;
  pitchHistory = [];
  btn.className = 'mic-btn recording';
  btn.textContent = '⏹ Stop Recording';
  document.getElementById('tone-feedback').innerHTML = '';
  clearToneCanvas();

  const bufLen = analyser.fftSize;
  const floatBuf = new Float32Array(bufLen);
  const byteBuf = new Uint8Array(analyser.frequencyBinCount);

  let frameCount = 0;
  function loop() {
    if (!toneRecording) return;
    toneAnimFrame = requestAnimationFrame(loop);
    frameCount++;
    // Pitch every 3 frames
    if (frameCount % 3 === 0) {
      analyser.getFloatTimeDomainData(floatBuf);
      const hz = detectPitch(floatBuf, audioCtx.sampleRate);
      pitchHistory.push(hz);
      drawPitchLine();
    }
    // Waveform every frame
    analyser.getByteTimeDomainData(byteBuf);
    drawWaveform(byteBuf);
  }
  loop();

  // Auto-stop after 3s
  setTimeout(() => {
    if (toneRecording) {
      toneRecording = false;
      if (toneAnimFrame) cancelAnimationFrame(toneAnimFrame);
      btn.className = 'mic-btn idle';
      btn.textContent = '🎤 Start Recording';
      analyzeToneResult();
    }
  }, 3000);
}

function analyzeToneResult() {
  const validPitches = pitchHistory.filter(p => p > 0);
  if (validPitches.length < 4) {
    document.getElementById('tone-feedback').innerHTML = '<div class="feedback-badge fb-try">😕 Too short — try again, speak clearly for 1-2 seconds</div>';
    return;
  }
  // Analyse shape
  const n = validPitches.length;
  const firstThird = validPitches.slice(0, Math.floor(n / 3));
  const lastThird = validPitches.slice(Math.floor(2 * n / 3));
  const mid = validPitches.slice(Math.floor(n / 3), Math.floor(2 * n / 3));
  const avgFirst = firstThird.reduce((a, b) => a + b, 0) / firstThird.length;
  const avgLast = lastThird.reduce((a, b) => a + b, 0) / lastThird.length;
  const avgMid = mid.reduce((a, b) => a + b, 0) / mid.length;
  const totalRange = Math.max(...validPitches) - Math.min(...validPitches);
  const avgAll = validPitches.reduce((a, b) => a + b, 0) / validPitches.length;

  let score = 0, feedbackText = '', cls = '';

  if (selectedTone === 1) {
    // Should be flat: low range
    const flatness = 1 - Math.min(totalRange / avgAll, 1);
    score = Math.round(flatness * 100);
    const good = totalRange < avgAll * 0.18;
    feedbackText = good ? '✓ Flat and steady — great 1st tone!' : `Try to keep your pitch completely flat. Range: ${Math.round(totalRange)}Hz (aim for < ${Math.round(avgAll * 0.18)}Hz)`;
    cls = good ? 'fb-great' : score > 50 ? 'fb-good' : 'fb-try';
  } else if (selectedTone === 2) {
    // Should rise: last > first
    const rise = avgLast - avgFirst;
    score = Math.round(Math.max(0, Math.min(rise / 60, 1)) * 100);
    const good = rise > 30;
    feedbackText = good ? '✓ Nice rising tone — great 2nd tone!' : `Your pitch needs to rise more. Rise: ${Math.round(rise)}Hz (aim for > 30Hz rise)`;
    cls = good ? 'fb-great' : score > 40 ? 'fb-good' : 'fb-try';
  } else if (selectedTone === 3) {
    // Should dip: mid lower than both ends
    const dip = Math.min(avgFirst, avgLast) - avgMid;
    score = Math.round(Math.max(0, Math.min(dip / 50, 1)) * 100);
    const good = dip > 20;
    feedbackText = good ? '✓ Good dipping shape — solid 3rd tone!' : `The pitch should dip down in the middle then rise. Dip: ${Math.round(dip)}Hz (aim for > 20Hz)`;
    cls = good ? 'fb-great' : score > 40 ? 'fb-good' : 'fb-try';
  } else if (selectedTone === 4) {
    // Should fall: last < first
    const fall = avgFirst - avgLast;
    score = Math.round(Math.max(0, Math.min(fall / 60, 1)) * 100);
    const good = fall > 30;
    feedbackText = good ? '✓ Sharp falling tone — excellent 4th tone!' : `Your pitch needs to fall more sharply. Fall: ${Math.round(fall)}Hz (aim for > 30Hz drop)`;
    cls = good ? 'fb-great' : score > 40 ? 'fb-good' : 'fb-try';
  }

  const fb = document.getElementById('tone-feedback');
  fb.innerHTML = `
    <div class="feedback-badge ${cls}">${feedbackText}</div>
    <div style="margin-top:6px;font-size:12px;color:var(--ink-light)">Pitch range: ${Math.round(Math.min(...validPitches))}–${Math.round(Math.max(...validPitches))} Hz &nbsp;|&nbsp; Score: ${score}/100</div>
  `;

  // Save score
  savePronunAttempt({ type: 'tone', tone: selectedTone, score, correct: score >= 60 });
}

function playTargetTone() {
  const toneWords = { 1: '妈', 2: '麻', 3: '马', 4: '骂' };
  speakText(toneWords[selectedTone], 0.7);
}

// ═══════════════════════
// REPEAT PRACTICE
// ═══════════════════════
const repeatWords = {
  greetings: [
    { zh: '你好', py: 'nǐ hǎo', en: 'Hello' },
    { zh: '谢谢', py: 'xièxie', en: 'Thank you' },
    { zh: '再见', py: 'zàijiàn', en: 'Goodbye' },
    { zh: '早上好', py: 'zǎoshang hǎo', en: 'Good morning' },
    { zh: '不客气', py: 'bú kèqi', en: "You're welcome" },
  ],
  numbers: [
    { zh: '一二三', py: 'yī èr sān', en: 'One two three' },
    { zh: '四五六', py: 'sì wǔ liù', en: 'Four five six' },
    { zh: '七八九十', py: 'qī bā jiǔ shí', en: 'Seven eight nine ten' },
    { zh: '一百', py: 'yī bǎi', en: 'One hundred' },
    { zh: '一千', py: 'yī qiān', en: 'One thousand' },
  ],
  food: [
    { zh: '米饭', py: 'mǐfàn', en: 'Rice' },
    { zh: '好吃', py: 'hǎo chī', en: 'Delicious' },
    { zh: '我要这个', py: 'wǒ yào zhège', en: 'I want this one' },
    { zh: '太辣了', py: 'tài là le', en: 'Too spicy' },
    { zh: '买单', py: 'mǎidān', en: 'The bill please' },
  ],
  work: [
    { zh: '你好', py: 'nǐ hǎo', en: 'Hello' },
    { zh: '我同意', py: 'wǒ tóngyì', en: 'I agree' },
    { zh: '没问题', py: 'méi wèntí', en: 'No problem' },
    { zh: '收到谢谢', py: 'shōudào xièxie', en: 'Received, thank you' },
    { zh: '请问', py: 'qǐngwèn', en: 'May I ask' },
  ],
  tones: [
    { zh: '买卖', py: 'mǎi mài', en: 'Buy / Sell (3rd & 4th)' },
    { zh: '妈麻马骂', py: 'mā má mǎ mà', en: 'All four tones on "ma"' },
    { zh: '书熟鼠树', py: 'shū shú shǔ shù', en: 'All four tones on "shu"' },
    { zh: '飞', py: 'fēi', en: 'Fly (1st tone)' },
    { zh: '学习', py: 'xuéxí', en: 'Study (2nd 2nd)' },
  ],
};
let repeatTarget = null, repeatRecording = false, repeatRecognizer = null;

function loadRepeatWords() {
  const cat = document.getElementById('repeat-category')?.value || 'greetings';
  const words = repeatWords[cat] || [];
  const list = document.getElementById('repeat-word-list');
  if (!list) return;
  list.innerHTML = words.map((w, i) => `
    <div class="repeat-word" id="rw-${i}">
      <div class="rw-zh">${w.zh}</div>
      <div class="rw-py">${w.py}</div>
      <div style="font-size:12px;color:var(--ink-light);flex:1">${w.en}</div>
      <button class="speak-btn" onclick="speakText('${w.zh}',0.7)">🔊</button>
      <button onclick="startRepeatWord(${i})" style="background:var(--red);color:#fff;border:none;padding:5px 12px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font-main)">Practice →</button>
      <div class="rw-result" id="rwr-${i}"></div>
    </div>`).join('');
  document.getElementById('repeat-active-wrap').style.display = 'none';
}

function startRepeatWord(i) {
  const cat = document.getElementById('repeat-category')?.value || 'greetings';
  repeatTarget = repeatWords[cat][i];
  document.getElementById('repeat-target-zh').textContent = repeatTarget.zh;
  document.getElementById('repeat-target-py').textContent = repeatTarget.py;
  document.getElementById('repeat-target-en').textContent = repeatTarget.en;
  document.getElementById('repeat-active-wrap').style.display = 'block';
  document.getElementById('repeat-result').textContent = '';
  document.getElementById('repeat-active-wrap').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  speakText(repeatTarget.zh, 0.7);
}

function hearRepeatTarget() {
  if (repeatTarget) speakText(repeatTarget.zh, 0.7);
}

async function toggleRepeatRecording() {
  if (repeatRecording) {
    repeatRecording = false;
    document.getElementById('repeat-mic-btn').className = 'mic-btn idle';
    document.getElementById('repeat-mic-btn').textContent = '🎤 Say It';
    if (repeatRecognizer) { try { repeatRecognizer.stop(); } catch(e){} }
    return;
  }
  if (!repeatTarget) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    document.getElementById('repeat-result').innerHTML = '<span style="color:var(--red)">⚠️ Speech recognition not supported. Use Chrome or Edge.</span>';
    return;
  }
  repeatRecognizer = new SR();
  repeatRecognizer.lang = 'zh-CN';
  repeatRecognizer.interimResults = false;
  repeatRecognizer.maxAlternatives = 3;
  repeatRecording = true;
  document.getElementById('repeat-mic-btn').className = 'mic-btn recording';
  document.getElementById('repeat-mic-btn').textContent = '⏹ Stop';
  document.getElementById('repeat-result').textContent = '🎤 Listening…';

  repeatRecognizer.onresult = e => {
    repeatRecording = false;
    document.getElementById('repeat-mic-btn').className = 'mic-btn idle';
    document.getElementById('repeat-mic-btn').textContent = '🎤 Say It';
    const alts = Array.from(e.results[0]).map(a => a.transcript.trim());
    const heard = alts[0];
    const target = repeatTarget.zh;
    const correct = alts.some(a => a.includes(target) || target.includes(a) || similarity(a, target) > 0.6);
    const res = document.getElementById('repeat-result');
    if (correct) {
      res.innerHTML = `<span class="recog-match">✓ 太好了！(tài hǎo le!) — Recognised: "${esc(heard)}"</span>`;
    } else {
      res.innerHTML = `<span class="recog-miss">✗ Heard: "${esc(heard)}" — Target: "${esc(target)}" — Try again!</span>`;
    }
    savePronunAttempt({ type: 'repeat', word: target, heard, correct });
    // Update word list row
    const cat = document.getElementById('repeat-category')?.value || 'greetings';
    const words = repeatWords[cat] || [];
    words.forEach((w, i) => {
      if (w.zh === target) {
        const el = document.getElementById(`rwr-${i}`);
        if (el) { el.textContent = correct ? '✓' : '✗'; el.className = 'rw-result ' + (correct ? 'ok' : 'bad'); }
      }
    });
  };
  repeatRecognizer.onerror = e => {
    repeatRecording = false;
    document.getElementById('repeat-mic-btn').className = 'mic-btn idle';
    document.getElementById('repeat-mic-btn').textContent = '🎤 Say It';
    document.getElementById('repeat-result').innerHTML = `<span style="color:var(--red)">⚠️ Error: ${esc(e.error)}. Make sure mic is allowed.</span>`;
  };
  repeatRecognizer.onend = () => {
    repeatRecording = false;
    document.getElementById('repeat-mic-btn').className = 'mic-btn idle';
    document.getElementById('repeat-mic-btn').textContent = '🎤 Say It';
  };
  repeatRecognizer.start();
}

// ═══════════════════════
// SPEECH RECOGNITION (FREE PLAY)
// ═══════════════════════
let recogRecording = false, recogRecognizer = null, recogPromptText = '';

function setRecogPrompt(el) {
  recogPromptText = el.textContent;
  document.getElementById('recog-target-display').innerHTML = `<span style="font-family:var(--font-chinese);font-size:22px;color:var(--ink)">Say: </span><span style="font-family:var(--font-chinese);font-size:22px;color:var(--red);font-weight:700">${el.textContent}</span>`;
}

async function toggleRecogRecording() {
  const btn = document.getElementById('recog-mic-btn');
  if (recogRecording) {
    recogRecording = false;
    btn.className = 'mic-btn idle'; btn.textContent = '🎤 Record';
    if (recogRecognizer) { try { recogRecognizer.stop(); } catch(e){} }
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    document.getElementById('recog-result').innerHTML = '<p style="color:var(--red)">⚠️ Speech recognition not supported in this browser. Please use Chrome or Edge.</p>';
    return;
  }
  recogRecognizer = new SR();
  recogRecognizer.lang = 'zh-CN';
  recogRecognizer.interimResults = true;
  recogRecognizer.maxAlternatives = 5;
  recogRecording = true;
  btn.className = 'mic-btn recording'; btn.textContent = '⏹ Stop';
  document.getElementById('recog-result').innerHTML = '<p style="color:var(--ink-light);font-size:13px">🎤 Listening — speak clearly in Mandarin…</p>';
  document.getElementById('recog-ai-feedback').innerHTML = '';

  recogRecognizer.onresult = e => {
    const interim = Array.from(e.results).filter(r => !r.isFinal).map(r => r[0].transcript).join('');
    const finals = Array.from(e.results).filter(r => r.isFinal).map(r => r[0].transcript).join('');
    const display = finals || interim;
    document.getElementById('recog-result').innerHTML = `
      <div style="margin-bottom:6px;font-size:12px;color:var(--ink-light)">${e.results[0]?.isFinal ? '✓ Final' : '⏳ Interim'} transcription:</div>
      <div class="recog-zh">${display}</div>
    `;
    if (e.results[e.results.length - 1]?.isFinal) {
      recogRecording = false;
      btn.className = 'mic-btn idle'; btn.textContent = '🎤 Record';
      if (recogPromptText) getRecogAIFeedback(recogPromptText, finals || interim);
    }
  };
  recogRecognizer.onerror = e => {
    recogRecording = false;
    btn.className = 'mic-btn idle'; btn.textContent = '🎤 Record';
    document.getElementById('recog-result').innerHTML = `<p style="color:var(--red)">⚠️ ${e.error === 'not-allowed' ? 'Microphone access denied.' : 'Error: ' + esc(e.error)}</p>`;
  };
  recogRecognizer.onend = () => {
    recogRecording = false;
    btn.className = 'mic-btn idle'; btn.textContent = '🎤 Record';
  };
  recogRecognizer.start();
}

async function getRecogAIFeedback(target, heard) {
  const fb = document.getElementById('recog-ai-feedback');
  fb.innerHTML = '<p style="color:var(--ink-light);font-size:13px">🤖 Analysing your pronunciation…</p>';
  try {
    const reply = await askClaude({
      maxTokens: 300,
      messages: [{ role: "user", content: `A Mandarin learner was asked to say: "${target}"\nThe speech recognition heard: "${heard}"\n\nGive brief pronunciation feedback in English (3-4 sentences max). Note: 1) Did they say it correctly? 2) What specific sounds or tones might be wrong? 3) One concrete tip to improve. Be encouraging. If it was correct, congratulate them.` }]
    });
    const match = heard === target || similarity(heard, target) > 0.7;
    fb.innerHTML = `
      <div style="background:${match ? 'var(--green-light)' : 'var(--blue-light)'};border-radius:10px;padding:12px 16px;border-left:4px solid ${match ? 'var(--green)' : 'var(--blue)'}">
        <div style="font-size:12px;font-weight:700;color:${match ? 'var(--green)' : 'var(--blue)'};margin-bottom:6px">🤖 AI Pronunciation Coach</div>
        <div style="font-size:13px;color:var(--ink-mid)">${formatAIText(reply)}</div>
      </div>`;
    savePronunAttempt({ type: 'recog', target, heard, correct: match });
  } catch (e) {
    fb.innerHTML = `<p style="color:var(--red);font-size:13px">⚠️ ${esc(e.message)}</p>`;
  }
}

// ═══════════════════════
// SCORES & HISTORY
// ═══════════════════════
let pronunStats = LS.get('pronunStats', { attempts: 0, correct: 0, streak: 0, bestStreak: 0, history: [] });

function savePronunAttempt(data) {
  pronunStats.attempts++;
  if (data.correct) { pronunStats.correct++; pronunStats.streak++; }
  else pronunStats.streak = 0;
  if (pronunStats.streak > pronunStats.bestStreak) pronunStats.bestStreak = pronunStats.streak;
  pronunStats.history.unshift({ ...data, ts: Date.now() });
  if (pronunStats.history.length > 50) pronunStats.history = pronunStats.history.slice(0, 50);
  LS.set('pronunStats', pronunStats);
  updatePronunScores();
}

function updatePronunScores() {
  const s = pronunStats;
  const el = id => document.getElementById(id);
  if (el('ps-attempts')) el('ps-attempts').textContent = s.attempts;
  if (el('ps-correct')) el('ps-correct').textContent = s.correct;
  if (el('ps-streak')) el('ps-streak').textContent = s.bestStreak;
  const pct = s.attempts ? Math.round(s.correct / s.attempts * 100) : 0;
  if (el('ps-pct')) el('ps-pct').textContent = pct + '%';
  const hist = el('ps-history');
  if (!hist) return;
  if (!s.history.length) { hist.innerHTML = '<p style="color:var(--ink-light);font-size:13px">No attempts yet.</p>'; return; }
  hist.innerHTML = s.history.slice(0, 15).map(h => {
    const d = new Date(h.ts);
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const label = h.type === 'tone' ? `Tone ${h.tone}` : h.type === 'repeat' ? `"${h.word}"` : `"${h.target}"`;
    return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--paper-dark);font-size:12px">
      <span style="color:${h.correct ? 'var(--green)' : 'var(--red)'};font-weight:700">${h.correct ? '✓' : '✗'}</span>
      <span style="flex:1;color:var(--ink-mid)">${label}</span>
      <span style="color:var(--ink-light)">${time}</span>
    </div>`;
  }).join('');
}

function clearPronunScores() {
  if (confirm('Clear all pronunciation history?')) {
    pronunStats = { attempts: 0, correct: 0, streak: 0, bestStreak: 0, history: [] };
    LS.set('pronunStats', pronunStats);
    updatePronunScores();
  }
}

// ═══ SIMILARITY HELPER ═══
function similarity(a, b) {
  if (!a || !b) return 0;
  const la = a.toLowerCase().replace(/\s/g, '');
  const lb = b.toLowerCase().replace(/\s/g, '');
  if (la === lb) return 1;
  let matches = 0;
  for (const c of la) if (lb.includes(c)) matches++;
  return matches / Math.max(la.length, lb.length);
}

// Treino de pronúncia: liga-se em cada página que o tiver
ChaPage.onInit(() => {
  if (!document.getElementById('tone-canvas')) return;
  setTimeout(() => { initToneCanvas(); loadRepeatWords(); updatePronunScores(); }, 200);
});
window.addEventListener('resize', () => {
  if (toneCanvas && toneCanvas.isConnected) { toneCanvas.width = toneCanvas.parentElement.clientWidth; drawToneGuide(); }
});

// Ao sair de uma página: desligar o microfone, a voz e os temporizadores dessa página
ChaPage.onCleanup(() => {
  toneRecording = false;
  if (toneAnimFrame) cancelAnimationFrame(toneAnimFrame);
  if (recogRecognizer) { try { recogRecognizer.abort(); } catch(e){} }
  if (repeatRecognizer) { try { repeatRecognizer.abort(); } catch(e){} }
  recogRecording = false; repeatRecording = false;
  if (micStream) { micStream.getTracks().forEach(t => t.stop()); micStream = null; }
  if (audioCtx) { try { audioCtx.close(); } catch(e){} audioCtx = null; }
  toneCanvas = null; waveCanvas = null;
  if (typeof cgTimer !== 'undefined' && cgTimer) clearInterval(cgTimer);
  if (typeof timerOn !== 'undefined' && timerOn) { try { stopTimer(); } catch(e){ clearInterval(timerInt); timerOn = false; } } // guarda os minutos estudados
  if ('speechSynthesis' in window) speechSynthesis.cancel();
});



