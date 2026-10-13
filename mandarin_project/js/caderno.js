/**
 * caderno.js
 * Aqui eu faço duas ferramentas do Praticar que trabalham juntas:
 * - o Dicionário: procura uma palavra nas 114 palavras do curso (sem internet);
 * - o Caderno: as palavras que o aluno guardou, para rever e marcar como sabidas.
 * O caderno fica guardado no browser (localStorage), com a chave 'notebook'.
 */

// ═══ DICIONÁRIO ═══

// Os resultados da última pesquisa. Os botões usam só o número do resultado
// (ex.: guardarDoDicionario(0, this)), por isso nenhum texto escrito pelo aluno vai parar dentro de um onclick.
let resultadosDoDicionario = [];

// Tiro os acentos e os espaços e passo a minúsculas, para "gōngzuò", "gongzuo" e "GONG ZUO" serem iguais
function semAcentos(texto) {
  return texto.normalize('NFD')               // separa cada letra do seu acento
    .replace(/[̀-ͯ]/g, '')          // apaga os acentos que ficaram soltos
    .replace(/\s+/g, '')                      // apaga os espaços
    .toLowerCase();
}

function procurarPalavra() {
  const pesquisa = document.getElementById('dict-input').value.trim();
  const caixa = document.getElementById('dict-result');
  if (!pesquisa) {
    return;
  }

  // Uma palavra entra nos resultados se a pesquisa aparecer no chinês, no pinyin ou no significado
  const procura = semAcentos(pesquisa);
  resultadosDoDicionario = TODAS_AS_PALAVRAS.filter(function (palavra) {
    return palavra.zh.includes(pesquisa)
      || semAcentos(palavra.py).includes(procura)
      || semAcentos(palavra.pt).includes(procura);
  }).slice(0, 6);   // mostro no máximo 6

  if (resultadosDoDicionario.length === 0) {
    caixa.innerHTML = '<p class="dict-vazio">Não encontrei esta palavra no vocabulário do curso.</p>';
    return;
  }

  let html = '';
  resultadosDoDicionario.forEach(function (palavra, numero) {
    html += `
      <div class="dict-entry">
        <div class="dict-linha">
          <span class="dict-trad">${escapar(palavra.zh)}</span>
          <button class="speak-btn" onclick="falar(resultadosDoDicionario[${numero}].zh)" aria-label="Ouvir"><i class="i i-ouvir" aria-hidden="true"></i></button>
          <button class="learn-btn dict-guardar" onclick="guardarDoDicionario(${numero}, this)">+ Guardar</button>
        </div>
        <div class="dict-pin">${escapar(palavra.py)}</div>
        <div class="dict-defs">${escapar(palavra.pt)}</div>
      </div>`;
  });
  caixa.innerHTML = html;
}

function guardarDoDicionario(numero, botao) {
  const palavra = resultadosDoDicionario[numero];
  if (palavra) {
    guardarNoCaderno(palavra, botao);
  }
}

// ═══ CADERNO ═══
let caderno = lerGuardado('notebook', []);

// Nas versões antigas do site o significado ficava no campo "en"; passo-o para "pt"
caderno.forEach(function (entrada) {
  if (!entrada.pt) {
    entrada.pt = entrada.en || '';
  }
});

function guardarCaderno() {
  guardar('notebook', caderno);
}

function guardarNoCaderno(palavra, botao) {
  // some() devolve true se alguma entrada do caderno já tiver esta palavra
  const jaExiste = caderno.some(function (entrada) {
    return entrada.zh === palavra.zh;
  });
  if (!jaExiste) {
    caderno.push({ zh: palavra.zh, py: palavra.py, pt: palavra.pt, done: false });
    guardarCaderno();
    mostrarCaderno();
  }
  botao.textContent = 'Guardado ✓';
}

function mostrarCaderno() {
  const lista = document.getElementById('nb-list');
  if (!lista) {
    return;
  }
  if (caderno.length === 0) {
    lista.innerHTML = '<div class="nb-vazio">O teu caderno está vazio.<br>Procura palavras no separador Dicionário e carrega em "+ Guardar".</div>';
    return;
  }

  let html = '';
  caderno.forEach(function (entrada, numero) {
    const sabida = entrada.done ? ' done' : '';
    const textoDoBotao = entrada.done ? '✓ Sabida' : 'Marcar como sabida';
    html += `
      <div class="nb-entry">
        <div class="nb-zh-txt">${escapar(entrada.zh)}</div>
        <div class="nb-py-txt">${escapar(entrada.py)}</div>
        <div class="nb-en-txt">${escapar(entrada.pt)}</div>
        <button class="speak-btn" onclick="falar(caderno[${numero}].zh)" aria-label="Ouvir"><i class="i i-ouvir" aria-hidden="true"></i></button>
        <button class="nb-mark${sabida}" onclick="marcarComoSabida(${numero})">${textoDoBotao}</button>
        <button class="nb-del" onclick="apagarDoCaderno(${numero})" aria-label="Apagar">✕</button>
      </div>`;
  });
  lista.innerHTML = html;
}

aoAbrirPagina(mostrarCaderno);

// O ! troca true por false e false por true
function marcarComoSabida(numero) {
  caderno[numero].done = !caderno[numero].done;
  guardarCaderno();
  mostrarCaderno();
}

// splice(numero, 1) tira 1 elemento da lista, na posição "numero"
function apagarDoCaderno(numero) {
  caderno.splice(numero, 1);
  guardarCaderno();
  mostrarCaderno();
}

function apagarCaderno() {
  if (confirm('Apagar todas as palavras guardadas?')) {
    caderno = [];
    guardarCaderno();
    mostrarCaderno();
  }
}

// ═══ DESCARREGAR O CADERNO ═══
// Faço um ficheiro de texto com uma palavra por linha (separadas por tabulações, abre no Excel)
// e "carrego" num link invisível para o browser o descarregar.
function exportarCaderno() {
  const linhas = caderno.map(function (entrada) {
    return entrada.zh + '\t' + entrada.py + '\t' + entrada.pt;
  });
  const ficheiro = new Blob([linhas.join('\n')], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(ficheiro);
  link.download = 'caderno-mandarim.txt';
  link.click();
}
