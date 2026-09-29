/**
 * exercises.js
 * Aqui eu faço o jogo de caracteres: o aluno vê um caractere e escolhe ou escreve o pinyin.
 */

// ═══ JOGO DE CARACTERES ═══
let cgScore=0,cgBest=LS.get('cgBest',0),cgMode='',cgCur=null,cgTimer=null,cgTime=0,cgDone=false;
function startCG(mode){cgMode=mode;cgScore=0;document.getElementById('cg-score-label').textContent=`Pontos: 0 | Recorde: ${cgBest}`;nextCG();}
function nextCG(){
  cgDone=false;cgCur=allVocab[Math.floor(Math.random()*allVocab.length)];cgTime=8;
  const a=document.getElementById('cg-area');
  if(cgMode==='choice'){
    const wrong=allVocab.filter(w=>w.py!==cgCur.py).sort(()=>Math.random()-.5).slice(0,3);
    const opts=[...wrong,cgCur].sort(()=>Math.random()-.5);
    a.innerHTML=`<div style="font-size:12px;color:var(--ink-light);text-align:center">⏱ ${cgTime}s</div><div class="cg-timer-bar"><div class="cg-tfill" id="cg-fill" style="width:100%"></div></div><div class="cg-big-zh">${cgCur.zh}</div><p style="text-align:center;font-size:12px;color:var(--ink-light);margin-bottom:6px">Escolhe o pinyin certo:</p><div class="cg-opts">${opts.map(o=>`<div class="cg-opt" onclick="cgAns('${o.py}')">${o.py}<br><span style="font-size:11px;color:var(--ink-light)">${o.en}</span></div>`).join('')}</div>`;
  }else{
    a.innerHTML=`<div style="font-size:12px;color:var(--ink-light);text-align:center">⏱ ${cgTime}s</div><div class="cg-timer-bar"><div class="cg-tfill" id="cg-fill" style="width:100%"></div></div><div class="cg-big-zh">${cgCur.zh}</div><p style="text-align:center;font-size:12px;color:var(--ink-light)">Escreve o pinyin (sem acentos dos tons):</p><input class="cg-input-field" id="cg-inp" type="text" placeholder="ex.: wo" onkeydown="if(event.key==='Enter')cgCheckTyped()"><button onclick="cgCheckTyped()" style="display:block;margin:7px auto;background:var(--blue);color:#fff;border:none;padding:7px 18px;border-radius:10px;font-size:13px;cursor:pointer;font-family:var(--font-main)">Verificar</button>`;
    setTimeout(()=>document.getElementById('cg-inp')?.focus(),80);
  }
  speakText(cgCur.zh,0.7);
  if(cgTimer)clearInterval(cgTimer);
  cgTimer=setInterval(()=>{cgTime--;const f=document.getElementById('cg-fill');const t=a.querySelector('div');if(t)t.textContent=`⏱ ${cgTime}s`;if(f){f.style.width=(cgTime/8*100)+'%';f.style.background=cgTime<=3?'var(--red)':'#0E7C66';}if(cgTime<=0){clearInterval(cgTimer);cgTimeout();}},1000);
}
function cgAns(py){if(cgDone)return;cgDone=true;clearInterval(cgTimer);document.querySelectorAll('.cg-opt').forEach(o=>{if(o.textContent.trim().startsWith(cgCur.py))o.classList.add('correct');else if(o.textContent.trim().startsWith(py))o.classList.add('wrong');});if(py===cgCur.py){cgScore++;if(cgScore>cgBest){cgBest=cgScore;LS.set('cgBest',cgBest);}}document.getElementById('cg-score-label').textContent=`Pontos: ${cgScore} | Recorde: ${cgBest}`;setTimeout(nextCG,1200);}
function cgCheckTyped(){if(cgDone)return;cgDone=true;clearInterval(cgTimer);const inp=document.getElementById('cg-inp');if(!inp)return;const strip=s=>s.replace(/[āáǎà]/g,'a').replace(/[ēéěè]/g,'e').replace(/[īíǐì]/g,'i').replace(/[ōóǒò]/g,'o').replace(/[ūúǔù]/g,'u').replace(/[ǖǘǚǜ]/g,'u').replace(/\s/g,'').toLowerCase();const ok=strip(inp.value)===strip(cgCur.py);inp.style.borderColor=ok?'#0E7C66':'var(--red)';if(ok){cgScore++;if(cgScore>cgBest){cgBest=cgScore;LS.set('cgBest',cgBest);}}document.getElementById('cg-score-label').textContent=`Pontos: ${cgScore} | Recorde: ${cgBest}`;const fb=document.createElement('div');fb.className='quiz-feedback '+(ok?'good':'bad');fb.style.maxWidth='280px';fb.style.margin='6px auto';fb.textContent=ok?`✓ Certo! ${cgCur.zh} = ${cgCur.py}`:`✗ Resposta: ${cgCur.py} (${cgCur.en})`;inp.after(fb);setTimeout(nextCG,1400);}
function cgTimeout(){cgDone=true;const a=document.getElementById('cg-area');const fb=document.createElement('div');fb.className='quiz-feedback bad';fb.style.maxWidth='280px';fb.style.margin='6px auto';fb.textContent=`⏱ Tempo esgotado! Era: ${cgCur.py} = ${cgCur.en}`;const big=a.querySelector('.cg-big-zh');if(big)big.after(fb);setTimeout(nextCG,1400);}

