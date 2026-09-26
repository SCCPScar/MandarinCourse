/**
 * dictionary.js
 * Dicionário (pergunta à IA e mostra até 4 entradas)
 * 学中文 — Curso Completo de Mandarim
 */

// As entradas da última pesquisa ficam aqui. Os botões usam só o número da entrada
// (ex.: saveDictEntry(0, this)), por isso nenhum texto vindo da IA vai parar dentro de um onclick.
let dictEntries = [];

// ═══ DICTIONARY ═══
async function lookupWord(){
  const q=document.getElementById('dict-input').value.trim();if(!q)return;
  const r=document.getElementById('dict-result');
  r.innerHTML='<p style="color:var(--ink-light);font-size:13px">🔍 Looking up…</p>';
  try{
    const raw=await askClaude({maxTokens:600,messages:[{role:"user",content:`You are a Chinese dictionary. Look up: "${q}"
Respond ONLY with valid JSON no markdown:
{"entries":[{"simplified":"字","traditional":"字","pinyin":"zì","definitions":["def1","def2"]}]}
If English give Chinese. Up to 4 entries.`}]});
    let parsed;
    try { parsed=JSON.parse(raw.replace(/```json|```/g,'').trim()); }
    catch(e){ throw new Error('A resposta do dicionário veio num formato inesperado. Tente de novo.'); }
    dictEntries=(Array.isArray(parsed.entries)?parsed.entries:[]).filter(e=>e&&e.simplified).map(e=>({
      simplified:String(e.simplified), traditional:String(e.traditional||e.simplified),
      pinyin:String(e.pinyin||''), definitions:Array.isArray(e.definitions)?e.definitions.map(String):[]
    }));
    if(!dictEntries.length){r.innerHTML='<p style="color:var(--red)">No results found.</p>';return;}
    r.innerHTML=dictEntries.map((e,i)=>`<div class="dict-entry"><div style="display:flex;align-items:center;gap:9px;flex-wrap:wrap"><span class="dict-trad">${esc(e.simplified)}</span>${e.traditional!==e.simplified?`<span style="font-family:var(--font-chinese);font-size:16px;color:var(--ink-light)">(${esc(e.traditional)})</span>`:''}<button class="speak-btn" onclick="speakText(dictEntries[${i}].simplified)" aria-label="Ouvir">🔊</button><button class="learn-btn" style="position:static;margin-left:0" onclick="saveDictEntry(${i},this)">+ Save</button></div><div class="dict-pin">${esc(e.pinyin)}</div><div class="dict-defs">${e.definitions.map((d,j)=>`<span style="color:var(--ink-light);margin-right:4px">${j+1}.</span>${esc(d)}`).join('<br>')}</div></div>`).join('');
  }catch(err){r.innerHTML=`<p style="color:var(--red);font-size:13px">⚠️ ${esc(err.message)}</p>`;}
}

// Salva uma entrada do dicionário no caderno
function saveDictEntry(i,btn){
  const e=dictEntries[i];if(!e)return;
  saveNb(e.simplified,e.pinyin,e.definitions[0]||'',btn);
}
