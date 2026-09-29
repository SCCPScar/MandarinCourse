/**
 * tools.js
 * Aqui eu junto o caderno e o temporizador de estudo.
 */

// ═══ CADERNO ═══
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

// ═══ TEMPORIZADOR E DIAS SEGUIDOS ═══
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

// ═══════════════════════════════════════════════════════
// 🔔 AVISOS (TOAST)
// ═══════════════════════════════════════════════════════
