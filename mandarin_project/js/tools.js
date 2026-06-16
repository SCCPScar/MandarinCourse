/**
 * tools.js
 * Notebook, Timer, Scenario, Conversação, Tutor
 * 学中文 — Curso Completo de Mandarim
 */

// ═══ NOTEBOOK ═══
let notebook=LS.get('notebook',[]);
function saveNb(zh,py,en,btn){if(notebook.find(n=>n.zh===zh)){btn.textContent='Saved ✓';return;}notebook.push({zh,py,en,done:false});LS.set('notebook',notebook);btn.textContent='Saved ✓';renderNb();}
function renderNb(){
  const el=document.getElementById('nb-list');if(!el)return;
  if(!notebook.length){el.innerHTML='<div style="text-align:center;padding:2rem;color:var(--ink-light);font-size:13px">Your notebook is empty.<br>Look up words in the Dictionary tab and click "+ Save".</div>';return;}
  el.innerHTML=notebook.map((n,i)=>`<div class="nb-entry"><div class="nb-zh-txt">${n.zh}</div><div class="nb-py-txt">${n.py}</div><div class="nb-en-txt">${n.en}</div><button class="speak-btn" onclick="speakText('${n.zh}')">🔊</button><button class="nb-mark${n.done?' done':''}" onclick="toggleNb(${i},this)">${n.done?'✓ Done':'Mark Done'}</button><button class="nb-del" onclick="delNb(${i})">✕</button></div>`).join('');
}
function toggleNb(i,btn){notebook[i].done=!notebook[i].done;LS.set('notebook',notebook);btn.textContent=notebook[i].done?'✓ Done':'Mark Done';btn.className='nb-mark'+(notebook[i].done?' done':'');}
function delNb(i){notebook.splice(i,1);LS.set('notebook',notebook);renderNb();}
function clearNotebook(){if(confirm('Clear all saved words?')){notebook=[];LS.set('notebook',notebook);renderNb();}}
function exportNotebook(){const txt=notebook.map(n=>`${n.zh}\t${n.py}\t${n.en}`).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download='mandarin_notebook.txt';a.click();}

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
  if(streak>=3){const b=document.getElementById('streak-banner');document.getElementById('streak-text').textContent=`🔥 ${streak}-day streak! 加油！`;b.classList.add('show');}
  const wg=document.getElementById('week-grid');
  if(wg){const days=['Su','Mo','Tu','We','Th','Fr','Sa'];wg.innerHTML=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);const ok=!!log[d.toDateString()];return`<div style="text-align:center"><div style="width:32px;height:32px;border-radius:50%;background:${ok?'#1E8449':'var(--paper-dark)'};display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff">${ok?'✓':''}</div><div style="font-size:10px;color:var(--ink-light);margin-top:2px">${days[d.getDay()]}</div></div>`;}).join('');}
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
  const lid='l'+Date.now();msgs.innerHTML+=`<div class="tutor-msg ai" id="${lid}"><em style="color:var(--ink-light)">Thinking…</em></div>`;msgs.scrollTop=msgs.scrollHeight;
  try{
    const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:800,system:"You are an expert Mandarin Chinese tutor for a Portuguese person learning Mandarin to work in China. Respond in English. Always include Chinese examples as: 你好 (nǐ hǎo) = Hello. Be encouraging, practical, concise. Under 300 words. Use bullets for vocabulary lists.",messages:tutorH})});
    const data=await resp.json();const reply=data.content.map(c=>c.text||'').join('');
    tutorH.push({role:'assistant',content:reply});
    const fmt=reply.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>').replace(/([一-鿿]+)/g,'<span style="font-family:var(--font-chinese);color:var(--red);font-weight:700">$1</span>').replace(/\n/g,'<br>');
    document.getElementById(lid).innerHTML=fmt;
  }catch(err){document.getElementById(lid).innerHTML=`<span style="color:var(--red)">⚠️ ${err.message}</span>`;tutorH.pop();}
  send.disabled=false;send.textContent='Send →';msgs.scrollTop=msgs.scrollHeight;
}

// ═══ CONVERSATION ═══
const scenarios=[
  {emoji:'🏢',title:'First Day at Work',sub:'Meet your colleagues',prompt:'You are a Chinese colleague. I am a new foreign employee. Greet me, ask my name and where I am from. Keep replies to 1-2 sentences. If I make grammar mistakes, note the correction in brackets at the end. Start with: 你好！'},
  {emoji:'🍜',title:'Ordering Food',sub:'At a Chinese restaurant',prompt:'You are a waiter at a Chinese restaurant. I am a customer. Greet me and take my order. Keep replies short. Correct grammar mistakes in brackets. Start with: 欢迎光临！'},
  {emoji:'🚕',title:'Taking a Taxi',sub:'Getting around the city',prompt:'You are a taxi driver. I am a foreign passenger. Ask where I am going, confirm the route and price. Correct grammar mistakes in brackets. Start with: 你好，去哪儿？'},
  {emoji:'💼',title:'Job Interview',sub:'Interview at Chinese company',prompt:'You are interviewing me for a job. Ask about my background, skills and why I want to work in China. Correct big grammar mistakes in brackets. Start with: 你好，请坐。请介绍一下你自己。'},
  {emoji:'🏪',title:'Market Shopping',sub:'Bargaining for goods',prompt:'You are a market vendor. I am a customer. Show items, state prices, let me bargain. Correct grammar mistakes in brackets. Start with: 你好！来看看！'},
  {emoji:'🏥',title:'At the Doctor',sub:'Describe symptoms',prompt:'You are a Chinese doctor. I am a patient who does not feel well. Ask about symptoms and give advice. Correct grammar mistakes in brackets. Start with: 你好，哪里不舒服？'},
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
    const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:200,system:activeScenario.prompt,messages:[{role:"user",content:"[Start]"}]})});
    const data=await resp.json();const reply=data.content.map(c=>c.text||'').join('');
    convH.push({role:'user',content:'[Start]'});convH.push({role:'assistant',content:reply});
    addConvMsg(reply,'ai');speakText(reply.match(/[一-鿿]+/g)?.join('')||'');
  }catch(e){addConvMsg('⚠️ Error starting. Check internet.','ai');}
  document.getElementById('conv-send').disabled=false;
}
function addConvMsg(text,role){const msgs=document.getElementById('conv-messages');const fmt=text.replace(/([一-鿿]+)/g,'<span style="font-family:var(--font-chinese);color:var(--red);font-weight:700;font-size:15px">$1</span>').replace(/\n/g,'<br>');msgs.innerHTML+=`<div class="conv-msg ${role}">${fmt}</div>`;msgs.scrollTop=msgs.scrollHeight;}
async function sendConv(){
  if(!activeScenario)return;const inp=document.getElementById('conv-input'),send=document.getElementById('conv-send');const text=inp.value.trim();if(!text)return;
  addConvMsg(text,'user');inp.value='';send.disabled=true;convH.push({role:'user',content:text});
  try{const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:200,system:activeScenario.prompt,messages:convH})});const data=await resp.json();const reply=data.content.map(c=>c.text||'').join('');convH.push({role:'assistant',content:reply});addConvMsg(reply,'ai');speakText(reply.match(/[一-鿿]+/g)?.join('')||'');}catch(e){addConvMsg('⚠️ Error. Try again.','ai');convH.pop();}
  send.disabled=false;
}
function resetConv(){document.getElementById('conv-box').style.display='none';document.getElementById('conv-reset-btn').style.display='none';document.querySelectorAll('.scenario-card').forEach(c=>c.classList.remove('active'));convH=[];activeScenario=null;}

// ═══ HELPERS ═══
// ═══ INIT ═══

// ═══════════════════════════════════════════════════════
// 🔔 TOAST
// ═══════════════════════════════════════════════════════
