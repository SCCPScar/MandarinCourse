/**
 * tools.js
 * Aqui eu junto o caderno, o temporizador de estudo, o tutor IA e as conversas com IA.
 */

// ═══ NOTEBOOK ═══
let notebook=LS.get('notebook',[]);
function saveNb(zh,py,en,btn){if(notebook.find(n=>n.zh===zh)){btn.textContent='Guardado ✓';return;}notebook.push({zh,py,en,done:false});LS.set('notebook',notebook);btn.textContent='Guardado ✓';renderNb();}
function renderNb(){
  const el=document.getElementById('nb-list');if(!el)return;
  if(!notebook.length){el.innerHTML='<div style="text-align:center;padding:2rem;color:var(--ink-light);font-size:13px">O teu caderno está vazio.<br>Procura palavras no separador Dicionário e carrega em "+ Guardar".</div>';return;}
  el.innerHTML=notebook.map((n,i)=>`<div class="nb-entry"><div class="nb-zh-txt">${esc(n.zh)}</div><div class="nb-py-txt">${esc(n.py)}</div><div class="nb-en-txt">${esc(n.en)}</div><button class="speak-btn" onclick="speakText(notebook[${i}].zh)" aria-label="Ouvir">🔊</button><button class="nb-mark${n.done?' done':''}" onclick="toggleNb(${i},this)">${n.done?'✓ Sabida':'Marcar como sabida'}</button><button class="nb-del" onclick="delNb(${i})">✕</button></div>`).join('');
}
function toggleNb(i,btn){notebook[i].done=!notebook[i].done;LS.set('notebook',notebook);btn.textContent=notebook[i].done?'✓ Sabida':'Marcar como sabida';btn.className='nb-mark'+(notebook[i].done?' done':'');}
function delNb(i){notebook.splice(i,1);LS.set('notebook',notebook);renderNb();}
function clearNotebook(){if(confirm('Apagar todas as palavras guardadas?')){notebook=[];LS.set('notebook',notebook);renderNb();}}
function exportNotebook(){const txt=notebook.map(n=>`${n.zh}\t${n.py}\t${n.en}`).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download='caderno-mandarim.txt';a.click();}

// ═══ STUDY TIMER & STREAK ═══
let timerSec=0,timerOn=false,timerInt=null;
function startTimer(){if(timerOn)return;timerOn=true;document.getElementById('t-start').style.display='none';document.getElementById('t-stop').style.display='inline-block';timerInt=setInterval(()=>{timerSec++;const m=String(Math.floor(timerSec/60)).padStart(2,'0');const s=String(timerSec%60).padStart(2,'0');document.getElementById('timer-display').textContent=`${m}:${s}`;},1000);const today=new Date().toDateString();const log=LS.get('studyLog',{});log[today]=log[today]||0;LS.set('studyLog',log);updateStreak();}
function stopTimer(){if(!timerOn)return;timerOn=false;clearInterval(timerInt);document.getElementById('t-start').style.display='inline-block';document.getElementById('t-stop').style.display='none';const today=new Date().toDateString();const log=LS.get('studyLog',{});log[today]=(log[today]||0)+Math.floor(timerSec/60);LS.set('studyLog',log);document.getElementById('total-mins').textContent=Object.values(log).reduce((a,b)=>a+b,0);}
function resetTimer(){stopTimer();timerSec=0;document.getElementById('timer-display').textContent='00:00';}
function updateStreak(){
  const log=LS.get('studyLog',{});
  let streak=0;const now=new Date();
  for(let i=0;i<365;i++){const d=new Date(now);d.setDate(d.getDate()-i);if(log[d.toDateString()])streak++;else break;}
  document.getElementById('streak-num').textContent=streak;
  document.getElementById('total-days').textContent=Object.keys(log).length;
  document.getElementById('total-mins').textContent=Object.values(log).reduce((a,b)=>a+b,0);
  if(streak>=3){const b=document.getElementById('streak-banner');document.getElementById('streak-text').textContent=`🔥 ${streak} dias seguidos! 加油！`;b.classList.add('show');}
  const wg=document.getElementById('week-grid');
  if(wg){const days=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];wg.innerHTML=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);const ok=!!log[d.toDateString()];return`<div style="text-align:center"><div style="width:32px;height:32px;border-radius:50%;background:${ok?'#0E7C66':'var(--paper-dark)'};display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff">${ok?'✓':''}</div><div style="font-size:10px;color:var(--ink-light);margin-top:2px">${days[d.getDay()]}</div></div>`;}).join('');}
}

// ═══ AI TUTOR ═══
let tutorH=[];
function sendChip(el){document.getElementById('tutor-input').value=el.textContent;sendTutor();}
async function sendTutor(){
  const inp=document.getElementById('tutor-input'),send=document.getElementById('tutor-send'),msgs=document.getElementById('tutor-messages');
  const text=inp.value.trim();if(!text)return;
  msgs.innerHTML+=`<div class="tutor-msg user">${esc(text)}</div>`;
  inp.value='';send.disabled=true;send.textContent='…';msgs.scrollTop=msgs.scrollHeight;
  tutorH.push({role:'user',content:text});
  const lid='l'+Date.now();msgs.innerHTML+=`<div class="tutor-msg ai" id="${lid}"><em style="color:var(--ink-light)">A pensar…</em></div>`;msgs.scrollTop=msgs.scrollHeight;
  try{
    const reply=await askClaude({maxTokens:800,system:"You are an expert Mandarin Chinese tutor for a learner who lives in Portugal. Respond in European Portuguese (Portugal), addressing the learner as 'tu'. Always include Chinese examples as: 你好 (nǐ hǎo) = Olá. Be encouraging, practical, concise. Under 300 words. Use bullets for vocabulary lists.",messages:tutorH});
    tutorH.push({role:'assistant',content:reply});
    document.getElementById(lid).innerHTML=formatAIText(reply);
    LS.set('tutorUsed',true);if(typeof checkAchievements==='function')checkAchievements();
  }catch(err){document.getElementById(lid).innerHTML=`<span style="color:var(--red)">⚠️ ${esc(err.message)}</span>`;tutorH.pop();}
  send.disabled=false;send.textContent='Enviar';msgs.scrollTop=msgs.scrollHeight;
}

// ═══ CONVERSATION ═══
const scenarios=[
  {emoji:'🏢',title:'Primeiro dia de trabalho',sub:'Conhece os colegas',prompt:'You are a Chinese colleague. I am a new foreign employee. Greet me, ask my name and where I am from. Keep replies to 1-2 sentences. If I make grammar mistakes, note the correction in brackets at the end, explained in European Portuguese. Start with: 你好！'},
  {emoji:'🍜',title:'Pedir comida',sub:'Num restaurante chinês',prompt:'You are a waiter at a Chinese restaurant. I am a customer. Greet me and take my order. Keep replies short. Correct grammar mistakes in brackets, explained in European Portuguese. Start with: 欢迎光临！'},
  {emoji:'🚕',title:'Apanhar um táxi',sub:'Andar pela cidade',prompt:'You are a taxi driver. I am a foreign passenger. Ask where I am going, confirm the route and price. Correct grammar mistakes in brackets, explained in European Portuguese. Start with: 你好，去哪儿？'},
  {emoji:'💼',title:'Entrevista de emprego',sub:'Numa empresa chinesa',prompt:'You are interviewing me for a job. Ask about my background, skills and why I want to work in China. Correct big grammar mistakes in brackets, explained in European Portuguese. Start with: 你好，请坐。请介绍一下你自己。'},
  {emoji:'🏪',title:'Compras no mercado',sub:'Regatear preços',prompt:'You are a market vendor. I am a customer. Show items, state prices, let me bargain. Correct grammar mistakes in brackets, explained in European Portuguese. Start with: 你好！来看看！'},
  {emoji:'🏥',title:'No médico',sub:'Descrever sintomas',prompt:'You are a Chinese doctor. I am a patient who does not feel well. Ask about symptoms and give advice. Correct grammar mistakes in brackets, explained in European Portuguese. Start with: 你好，哪里不舒服？'},
];
let convH=[],activeScenario=null;
function renderScenarios(){const g=document.getElementById('scenario-grid');if(!g)return;g.innerHTML=scenarios.map((s,i)=>`<div class="scenario-card" onclick="startScenario(${i})"><div class="sc-emoji">${s.emoji}</div><div class="sc-title">${s.title}</div><div class="sc-sub">${s.sub}</div></div>`).join('');}
async function startScenario(i){
  activeScenario=scenarios[i];convH=[];
  document.querySelectorAll('.scenario-card').forEach((c,j)=>c.classList.toggle('active',j===i));
  const box=document.getElementById('conv-box');box.style.display='block';
  document.getElementById('conv-messages').innerHTML='';
  document.getElementById('conv-reset-btn').style.display='inline-block';
  document.getElementById('conv-send').disabled=true;
  try{
    const reply=await askClaude({maxTokens:200,system:activeScenario.prompt,messages:[{role:"user",content:"[Start]"}]});
    convH.push({role:'user',content:'[Start]'});convH.push({role:'assistant',content:reply});
    addConvMsg(reply,'ai');speakText(reply.match(/[一-鿿]+/g)?.join('')||'');
  }catch(e){addConvMsg('⚠️ '+e.message,'ai');}
  document.getElementById('conv-send').disabled=false;
}
function addConvMsg(text,role){const msgs=document.getElementById('conv-messages');const div=document.createElement('div');div.className='conv-msg '+role;div.innerHTML=formatAIText(text);msgs.appendChild(div);msgs.scrollTop=msgs.scrollHeight;}
async function sendConv(){
  if(!activeScenario)return;const inp=document.getElementById('conv-input'),send=document.getElementById('conv-send');const text=inp.value.trim();if(!text)return;
  addConvMsg(text,'user');inp.value='';send.disabled=true;convH.push({role:'user',content:text});
  try{const reply=await askClaude({maxTokens:200,system:activeScenario.prompt,messages:convH});convH.push({role:'assistant',content:reply});addConvMsg(reply,'ai');speakText(reply.match(/[一-鿿]+/g)?.join('')||'');}catch(e){addConvMsg('⚠️ '+e.message,'ai');convH.pop();}
  send.disabled=false;
}
function resetConv(){document.getElementById('conv-box').style.display='none';document.getElementById('conv-reset-btn').style.display='none';document.querySelectorAll('.scenario-card').forEach(c=>c.classList.remove('active'));convH=[];activeScenario=null;}

// ═══════════════════════════════════════════════════════
// 🔔 TOAST
// ═══════════════════════════════════════════════════════
