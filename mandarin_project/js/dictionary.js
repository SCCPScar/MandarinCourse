/**
 * dictionary.js
 * Aqui eu faço o dicionário: procuro a palavra no vocabulário do curso (allVocab, em data.js)
 * e mostro até 6 resultados. Funciona sem internet e sem IA.
 */

// Os resultados da última pesquisa ficam aqui. Os botões usam só o número do resultado
// (ex.: saveDictEntry(0, this)), por isso nenhum texto vai parar dentro de um onclick.
let dictEntries = [];

// Eu tiro os acentos e passo a minúsculas, para "gōngzuò", "gongzuo" e "GONGZUO" serem iguais.
// normalize('NFD') separa a letra do acento, e o replace apaga os acentos que ficaram soltos.
function semAcentos(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, '');
}

function lookupWord() {
  const q = document.getElementById('dict-input').value.trim();
  const r = document.getElementById('dict-result');
  if (!q) return;

  const busca = semAcentos(q);
  // Uma palavra entra nos resultados se a pesquisa aparecer no chinês, no pinyin ou na tradução
  dictEntries = allVocab.filter(p =>
    p.zh.includes(q) ||
    semAcentos(p.py).includes(busca) ||
    semAcentos(p.en).includes(busca)
  ).slice(0, 6);

  if (!dictEntries.length) {
    r.innerHTML = '<p style="color:var(--red)">Não encontrei esta palavra no vocabulário do curso.</p>';
    return;
  }

  // Nota: no data.js a tradução portuguesa está no campo "en" (nome antigo do campo)
  r.innerHTML = dictEntries.map((p, i) => `
    <div class="dict-entry">
      <div style="display:flex;align-items:center;gap:9px;flex-wrap:wrap">
        <span class="dict-trad">${esc(p.zh)}</span>
        <button class="speak-btn" onclick="speakText(dictEntries[${i}].zh)" aria-label="Ouvir">🔊</button>
        <button class="learn-btn" style="position:static;margin-left:0" onclick="saveDictEntry(${i},this)">+ Guardar</button>
      </div>
      <div class="dict-pin">${esc(p.py)}</div>
      <div class="dict-defs">${esc(p.en)}</div>
    </div>`).join('');
}

// Eu guardo um resultado do dicionário no caderno
function saveDictEntry(i, btn) {
  const p = dictEntries[i];
  if (!p) return;
  saveNb(p.zh, p.py, p.en, btn);
}
