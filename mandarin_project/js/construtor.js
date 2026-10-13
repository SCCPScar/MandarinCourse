/**
 * construtor.js
 * Aqui eu faço o construtor de frases do Praticar.
 * O aluno escolhe um padrão de gramática (ex.: Sujeito + Verbo + Objeto),
 * vê uns espaços vazios e carrega nas palavras pela ordem certa para montar a frase.
 */

// Cada exercício tem:
//   espacos     = o que aparece em cada espaço vazio
//   certa       = a frase certa, palavra a palavra
//   palavras    = as palavras que o aluno pode escolher (as certas e algumas erradas)
//   significado = a tradução da frase
//   fixos       = (opcional) os números dos espaços que já vêm preenchidos (começa em 0)
const PADROES_DE_FRASES = {
  svo: [
    { espacos: ['[Sujeito]', '[Verbo]', '[Objeto]'], certa: ['我', '喝', '茶'], palavras: ['我', '你', '他', '喝', '吃', '买', '茶', '咖啡', '书'], significado: 'Eu bebo chá' },
    { espacos: ['[Sujeito]', '[Verbo]', '[Objeto]'], certa: ['她', '买', '书'], palavras: ['我', '她', '他', '买', '喝', '学', '书', '茶', '中文'], significado: 'Ela compra um livro' },
  ],
  shi: [
    { espacos: ['[Sujeito]', '是', '[Nome]'], certa: ['我', '是', '学生'], palavras: ['我', '你', '是', '有', '学生', '老师', '朋友'], significado: 'Eu sou estudante', fixos: [1] },
    { espacos: ['[Sujeito]', '是', '[Nome]'], certa: ['他', '是', '老师'], palavras: ['他', '我', '是', '有', '老师', '学生', '朋友'], significado: 'Ele é professor', fixos: [1] },
  ],
  neg: [
    { espacos: ['[Sujeito]', '不', '[Verbo]'], certa: ['我', '不', '喜欢'], palavras: ['我', '你', '不', '没', '喜欢', '去', '吃', '来'], significado: 'Eu não gosto', fixos: [1] },
    { espacos: ['[Sujeito]', '没有', '[Objeto]'], certa: ['我', '没有', '钱'], palavras: ['我', '你', '没有', '有', '不', '钱', '书', '时间'], significado: 'Eu não tenho dinheiro', fixos: [1] },
  ],
  modal: [
    { espacos: ['[Sujeito]', '想', '[Verbo]'], certa: ['我', '想', '去'], palavras: ['我', '你', '想', '会', '去', '来', '吃', '学'], significado: 'Eu quero ir', fixos: [1] },
    { espacos: ['[Sujeito]', '会', '说中文'], certa: ['他', '会', '说中文'], palavras: ['他', '你', '会', '能', '说中文', '学', '写'], significado: 'Ele sabe falar chinês', fixos: [1] },
  ],
  time: [
    { espacos: ['[Tempo]', '[Sujeito]', '[Verbo]'], certa: ['今天', '我', '去'], palavras: ['今天', '明天', '我', '你', '去', '来', '吃'], significado: 'Hoje eu vou' },
    { espacos: ['[Tempo]', '[Sujeito]', '[Verbo]'], certa: ['明天', '他', '来'], palavras: ['今天', '明天', '他', '我', '来', '去', '学'], significado: 'Amanhã ele vem' },
  ],
};

let exercicioFrase = null;   // o exercício que está à vista
let escolhidas = [];         // o que o aluno pôs em cada espaço (null = vazio)

// Um espaço é fixo se o número dele estiver na lista "fixos" do exercício
function espacoFixo(numero) {
  return Boolean(exercicioFrase.fixos && exercicioFrase.fixos.includes(numero));
}

// ═══ ESCOLHER UM EXERCÍCIO ═══
// Chamada quando o aluno escolhe o padrão na lista e quando carrega em "Nova frase"
function novaFrase() {
  const padrao = document.getElementById('sb-pattern').value;
  if (!padrao) {
    return;
  }
  exercicioFrase = aoAcaso(PADROES_DE_FRASES[padrao]);
  limparFrase();
}

// ═══ ESVAZIAR OS ESPAÇOS ═══
function limparFrase() {
  if (!exercicioFrase) {
    return;
  }
  escolhidas = exercicioFrase.espacos.map(function () {
    return null;
  });
  mostrarFrase();
}

// ═══ DESENHAR OS ESPAÇOS E AS PALAVRAS ═══
function mostrarFrase() {
  // Os espaços, separados por setas
  const espacosHtml = exercicioFrase.espacos.map(function (texto, numero) {
    if (espacoFixo(numero)) {
      return '<div class="sb-slot fixed">' + exercicioFrase.certa[numero] + '</div>';
    }
    const palavra = escolhidas[numero];
    if (palavra) {
      return '<div class="sb-slot filled" onclick="tirarPalavra(' + numero + ')">' + palavra + '</div>';
    }
    return '<div class="sb-slot" onclick="tirarPalavra(' + numero + ')">' + texto + '</div>';
  });
  document.getElementById('sb-slots').innerHTML = espacosHtml.join('<span class="sb-seta">→</span>');

  // As palavras para escolher; as que já foram usadas ficam com a classe "used"
  const palavrasHtml = exercicioFrase.palavras.map(function (palavra) {
    const usada = escolhidas.includes(palavra) ? ' used' : '';
    return '<div class="sb-word' + usada + '" onclick="porPalavra(\'' + palavra + '\')">' + palavra + '</div>';
  });
  document.getElementById('sb-pool').innerHTML = palavrasHtml.join('');

  document.getElementById('sb-result').style.display = 'none';
}

// ═══ PÔR UMA PALAVRA NO PRIMEIRO ESPAÇO VAZIO ═══
function porPalavra(palavra) {
  if (!exercicioFrase || escolhidas.includes(palavra)) {
    return;
  }
  for (let numero = 0; numero < exercicioFrase.espacos.length; numero++) {
    if (!escolhidas[numero] && !espacoFixo(numero)) {
      escolhidas[numero] = palavra;
      mostrarFrase();
      return;
    }
  }
}

// ═══ TIRAR A PALAVRA DE UM ESPAÇO ═══
function tirarPalavra(numero) {
  if (exercicioFrase && !espacoFixo(numero)) {
    escolhidas[numero] = null;
    mostrarFrase();
  }
}

// ═══ VERIFICAR A FRASE ═══
function verificarFrase() {
  if (!exercicioFrase) {
    return;
  }
  // Junto a frase do aluno: nos espaços fixos uso a palavra certa
  const fraseDoAluno = exercicioFrase.espacos.map(function (texto, numero) {
    if (espacoFixo(numero)) {
      return exercicioFrase.certa[numero];
    }
    return escolhidas[numero] || '';
  }).join('');
  const fraseCerta = exercicioFrase.certa.join('');
  const acertou = fraseDoAluno === fraseCerta;

  const resultado = document.getElementById('sb-result');
  resultado.style.display = 'block';
  if (acertou) {
    resultado.className = 'sb-result good';
    resultado.textContent = '✓ Certo! "' + fraseCerta + '" significa: ' + exercicioFrase.significado;
    falar(fraseCerta);
  } else {
    resultado.className = 'sb-result bad';
    resultado.textContent = '✗ A ordem certa é: ' + exercicioFrase.certa.join(' ') + ' (' + exercicioFrase.significado + ')';
  }
}
