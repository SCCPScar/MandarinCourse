/**
 * hanzi.js
 * Aqui eu uso a biblioteca Hanzi Writer (licença MIT) para mostrar a ordem dos traços
 * dos caracteres chineses, no separador «Traços» do Praticar:
 * - Animar: o caractere desenha-se sozinho, traço a traço;
 * - Praticar: o aluno desenha com o rato ou com o dedo e a biblioteca corrige cada traço.
 * A biblioteca está em vendor/hanzi-writer/ e os desenhos dos traços em vendor/hanzi-writer-data/.
 */

let escritor = null;   // o objeto do Hanzi Writer para o caractere que está à vista

// ═══ ONDE ESTÃO OS TRAÇOS ═══
// O Hanzi Writer pede-me os dados de cada caractere através desta função.
// Primeiro procuro na pasta vendor/ do próprio site (funciona sem internet).
// Se o caractere não estiver lá, vou buscá-lo à internet (CDN jsDelivr).
// fetch() pede um ficheiro; .then() corre quando a resposta chega; .catch() corre se der erro.
function carregarTracos(caractere, quandoChegar, seDerErro) {
  const nome = encodeURIComponent(caractere) + '.json';
  fetch('vendor/hanzi-writer-data/' + nome)
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error('O caractere não está na pasta vendor');
      }
      return resposta.json();
    })
    .catch(function () {
      return fetch('https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/' + nome)
        .then(function (resposta) {
          if (!resposta.ok) {
            throw new Error('O caractere não existe');
          }
          return resposta.json();
        });
    })
    .then(quandoChegar)
    .catch(seDerErro);
}

function escreverDica(texto) {
  const dica = document.getElementById('hanzi-hint');
  if (dica) {
    dica.innerHTML = texto;
  }
}

// Um caractere chinês está no intervalo Unicode 4E00 a 9FFF
function eChines(texto) {
  return /[一-鿿]/.test(texto);
}

// ═══ MOSTRAR UM CARACTERE ═══
function mostrarCaractere(caractere) {
  const desenho = document.getElementById('hanzi-target');
  if (!desenho) {
    return;
  }
  const caixa = document.getElementById('hanzi-input');
  if (caixa) {
    caixa.value = caractere;
  }

  desenho.innerHTML = '';   // apago o caractere anterior
  escritor = HanziWriter.create('hanzi-target', caractere, {
    width: 200,
    height: 200,
    padding: 16,
    strokeColor: '#C8361F',          // cor dos traços
    radicalColor: '#A32A18',         // cor do radical (a parte do caractere que dá a pista do significado)
    outlineColor: '#D5DEDB',         // cor do contorno de fundo
    showOutline: true,
    strokeAnimationSpeed: 1,
    delayBetweenStrokes: 200,        // milissegundos entre traços
    rendererType: 'svg',
    charDataLoader: carregarTracos,
    onLoadCharDataError: function () {
      escreverDica('Não encontrei os traços deste caractere.');
    },
  });
  escreverDica('Carrega em <i class="i i-jogar" aria-hidden="true"></i> Animar ou <i class="i i-escrever" aria-hidden="true"></i> Praticar');
}

// Quando a página abre, mostro o caractere 中 (China) e os conjuntos para treinar
aoAbrirPagina(function () {
  if (document.getElementById('hanzi-target')) {
    mostrarCaractere('中');
    mostrarConjuntosTracos();
  }
});

// Leio o que está escrito na caixa; se não for chinês, aviso e devolvo ''
function caractereDaCaixa() {
  const caixa = document.getElementById('hanzi-input');
  const caractere = caixa ? caixa.value.trim() : '';
  if (!eChines(caractere)) {
    escreverDica('Escreve primeiro um caractere chinês.');
    return '';
  }
  return caractere;
}

// ═══ BOTÃO «ANIMAR» ═══
function animarTracos() {
  const caractere = caractereDaCaixa();
  if (!caractere) {
    return;
  }
  mostrarCaractere(caractere);
  escritor.animateCharacter();
  escreverDica('Repara na ordem dos traços!');
}

// ═══ BOTÃO «PRATICAR» ═══
// O quiz do Hanzi Writer chama as minhas funções a cada traço certo, a cada erro e no fim
function praticarTracos() {
  const caractere = caractereDaCaixa();
  if (!caractere) {
    return;
  }
  mostrarCaractere(caractere);
  escreverDica('<i class="i i-escrever" aria-hidden="true"></i> Desenha o caractere e segue a ordem dos traços.');
  escritor.quiz({
    onMistake: function () {
      escreverDica('Traço errado! O vermelho mostra o traço certo.');
    },
    onCorrectStroke: function (dados) {
      escreverDica('✓ Traço ' + (dados.strokeNum + 1) + ' certo! Continua…');
    },
    onComplete: function (dados) {
      if (dados.totalMistakes === 0) {
        escreverDica('Perfeito! Sem erros!');
      } else {
        escreverDica('✓ Feito! ' + dados.totalMistakes + ' erro(s). Tenta outra vez!');
      }
    },
  });
}

// ═══ CONJUNTOS DE CARACTERES PARA TREINAR ═══
// Os caracteres mais úteis do HSK 1 e 2, arrumados por temas, com o pinyin.
const CONJUNTOS_TRACOS = [
  { nome: 'Números', caracteres: [['一', 'yī'], ['二', 'èr'], ['三', 'sān'], ['四', 'sì'], ['五', 'wǔ'], ['六', 'liù'], ['七', 'qī'], ['八', 'bā'], ['九', 'jiǔ'], ['十', 'shí'], ['百', 'bǎi'], ['千', 'qiān']] },
  { nome: 'Pessoas', caracteres: [['人', 'rén'], ['我', 'wǒ'], ['你', 'nǐ'], ['他', 'tā'], ['她', 'tā'], ['们', 'men'], ['女', 'nǚ'], ['子', 'zǐ'], ['父', 'fù'], ['母', 'mǔ']] },
  { nome: 'Natureza', caracteres: [['日', 'rì'], ['月', 'yuè'], ['水', 'shuǐ'], ['火', 'huǒ'], ['山', 'shān'], ['木', 'mù'], ['土', 'tǔ'], ['天', 'tiān'], ['雨', 'yǔ'], ['花', 'huā']] },
  { nome: 'Verbos', caracteres: [['吃', 'chī'], ['喝', 'hē'], ['说', 'shuō'], ['看', 'kàn'], ['听', 'tīng'], ['写', 'xiě'], ['学', 'xué'], ['去', 'qù'], ['来', 'lái'], ['买', 'mǎi']] },
  { nome: 'Lugares e coisas', caracteres: [['中', 'zhōng'], ['国', 'guó'], ['家', 'jiā'], ['门', 'mén'], ['车', 'chē'], ['书', 'shū'], ['茶', 'chá'], ['饭', 'fàn'], ['钱', 'qián'], ['路', 'lù']] },
  { nome: 'Palavras pequenas', caracteres: [['大', 'dà'], ['小', 'xiǎo'], ['好', 'hǎo'], ['不', 'bù'], ['是', 'shì'], ['有', 'yǒu'], ['的', 'de'], ['在', 'zài'], ['很', 'hěn'], ['上', 'shàng'], ['下', 'xià']] },
];

// Cada conjunto tem um título, um link para a folha de impressão e um botão por caractere
function mostrarConjuntosTracos() {
  const caixa = document.getElementById('hanzi-presets');
  if (!caixa) {
    return;
  }
  let html = '';
  CONJUNTOS_TRACOS.forEach(function (conjunto) {
    let todos = '';
    let botoes = '';
    conjunto.caracteres.forEach(function (par) {
      const zh = par[0];
      const py = par[1];
      todos += zh;
      botoes += `<button type="button" class="preset-char" onclick="mostrarCaractere('${zh}')"><span lang="zh-CN">${zh}</span><small>${py}</small></button>`;
    });
    html += `
      <div class="conjunto-tracos">
        <div class="conjunto-tracos__topo">
          <h5>${conjunto.nome}</h5>
          <a class="conjunto-tracos__imprimir" href="folha.php?c=${encodeURIComponent(todos)}" target="_blank" rel="noopener"><i class="i i-imprimir" aria-hidden="true"></i> Folha para imprimir</a>
        </div>
        <div class="conjunto-tracos__lista">${botoes}</div>
      </div>`;
  });
  caixa.innerHTML = html;
}

// ═══ FOLHA PARA IMPRIMIR ═══
// Abro a folha de treino (folha.php) com os caracteres escritos na caixa
function imprimirFolhaTracos() {
  const caixaFolha = document.getElementById('hanzi-folha');
  const caixaTracos = document.getElementById('hanzi-input');
  let texto = '';
  if (caixaFolha && caixaFolha.value.trim()) {
    texto = caixaFolha.value.trim();
  } else if (caixaTracos) {
    texto = caixaTracos.value.trim();
  }
  window.open('folha.php?c=' + encodeURIComponent(texto), '_blank', 'noopener');
}
