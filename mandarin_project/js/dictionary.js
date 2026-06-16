/**
 * dictionary.js
 * Dicionário
 * 学中文 — Curso Completo de Mandarim
 */

// ═══ DICTIONARY ═══
async function lookupWord(){
  const q=document.getElementById('dict-input').value.trim();if(!q)return;
  const r=document.getElementById('dict-result');r.innerHTML='<p style="color:var(--ink-light);font-size:13px">🔍 Looking up…</p>';
  try{
    const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:600,messages:[{role:"user",content:`You are a Chinese dictionary. Look up: "${q}"
Respond ONLY with valid JSON no markdown:
{"entries":[{"simplified":"字","traditional":"字","pinyin":"zì","definitions":["def1","def2"]}]}
If English give Chinese. Up to 4 entries.`}]})});
    const data=await resp.json();
    const raw=data.content.map(c=>c.text||'').join('').replace(/\`\`\`json|\`\`\`/g,'').trim();
    const parsed=JSON.parse(raw);
    if(!parsed.entries?.length){r.innerHTML='<p style="color:var(--red)">No results found.</p>';return;}
    r.innerHTML=parsed.entries.map(e=>`<div class="dict-entry"><div style="display:flex;align-items:center;gap:9px;flex-wrap:wrap"><span class="dict-trad">${e.simplified}</span>${e.traditional!==e.simplified?`<span style="font-family:var(--font-chinese);font-size:16px;color:var(--ink-light)">(${e.traditional})</span>`:''}<button class="speak-btn" onclick="speakText('${e.simplified}')">🔊</button><button class="learn-btn" style="position:static;margin-left:0" onclick="saveNb('${e.simplified}','${e.pinyin.replace(/'/g,"\'")}','${(e.definitions[0]||'').replace(/'/g,"\'")}',this)">+ Save</button></div><div class="dict-pin">${e.pinyin}</div><div class="dict-defs">${e.definitions.map((d,i)=>`<span style="color:var(--ink-light);margin-right:4px">${i+1}.</span>${d}`).join('<br>')}</div></div>`).join('');
  }catch(err){r.innerHTML=`<p style="color:var(--red);font-size:13px">⚠️ Error: ${err.message}</p>`;}
}

