/**
 * jogo.js
 * Aqui eu faço o jogo de caracteres do Praticar.
 * Aparece um caractere e o aluno tem 8 segundos para acertar no pinyin.
 * Há dois modos:
 *   'choice' = escolher entre 4 opções;
 *   'type'   = escrever o pinyin (sem os acentos dos tons).
 */

const SEGUNDOS_POR_PERGUNTA = 8;

let modoDoJogo = '';          // '' quer dizer que o jogo está parado
let pontosDoJogo = 0;
let recorde = lerGuardado('cgBest', 0);
let palavraDoJogo = null;     // a palavra que está à vista
let segundosQueFaltam = 0;
let relogio = null;           // o setInterval que conta os segundos
let perguntaRespondida = false;

// ═══ COMEÇAR ═══
function comecarJogo(modo) {
  modoDoJogo = modo;
  pontosDoJogo = 0;
  document.getElementById('cg-parar').style.display = '';
  mostrarPontos();
  proximaPalavra();
}

function mostrarPontos() {
  document.getElementById('cg-score-label').textContent = 'Pontos: ' + pontosDoJogo + ' | Recorde: ' + recorde;
}

// Soma um ponto e, se passar o recorde, guardo o novo recorde
function ganharPonto() {
  pontosDoJogo++;
  if (pontosDoJogo > recorde) {
    recorde = pontosDoJogo;
    guardar('cgBest', recorde);
  }
  mostrarPontos();
}

// ═══ PRÓXIMA PALAVRA ═══
function proximaPalavra() {
  if (!modoDoJogo) {
    return;   // o jogo foi parado: não passo à pergunta seguinte
  }
  perguntaRespondida = false;
  palavraDoJogo = aoAcaso(TODAS_AS_PALAVRAS);
  segundosQueFaltam = SEGUNDOS_POR_PERGUNTA;

  const topo = `
    <div class="cg-tempo" id="cg-tempo"><i class="i i-relogio" aria-hidden="true"></i> ${segundosQueFaltam}s</div>
    <div class="cg-timer-bar"><div class="cg-tfill" id="cg-fill" style="width: 100%"></div></div>
    <div class="cg-big-zh">${palavraDoJogo.zh}</div>`;

  const area = document.getElementById('cg-area');

  if (modoDoJogo === 'choice') {
    // 3 opções erradas (com pinyin diferente) + a certa, baralhadas
    const erradas = baralhar(TODAS_AS_PALAVRAS.filter(function (p) {
      return p.py !== palavraDoJogo.py;
    })).slice(0, 3);
    const opcoes = baralhar([...erradas, palavraDoJogo]);

    let opcoesHtml = '';
    opcoes.forEach(function (opcao) {
      opcoesHtml += `<div class="cg-opt" onclick="escolherNoJogo(this)">${opcao.py}<br><span class="cg-opt-significado">${opcao.pt}</span></div>`;
    });
    area.innerHTML = topo + `
      <p class="cg-instrucao">Escolhe o pinyin certo:</p>
      <div class="cg-opts">${opcoesHtml}</div>`;
    // Guardo o pinyin de cada opção no próprio botão, para comparar quando o aluno carregar
    area.querySelectorAll('.cg-opt').forEach(function (botao, numero) {
      botao.dataset.pinyin = opcoes[numero].py;
    });
  } else {
    area.innerHTML = topo + `
      <p class="cg-instrucao">Escreve o pinyin (sem acentos dos tons):</p>
      <input class="cg-input-field" id="cg-inp" type="text" placeholder="ex.: wo" onkeydown="if (event.key === 'Enter') verificarPinyinEscrito()">
      <button type="button" class="cg-verificar" onclick="verificarPinyinEscrito()">Verificar</button>`;
    document.getElementById('cg-inp').focus();
  }

  falar(palavraDoJogo.zh, 0.7);

  // O relógio: a cada 1000 ms (1 segundo) tiro um segundo e encurto a barra
  clearInterval(relogio);
  relogio = setInterval(contarUmSegundo, 1000);
}

function contarUmSegundo() {
  segundosQueFaltam--;
  const tempo = document.getElementById('cg-tempo');
  const barra = document.getElementById('cg-fill');
  if (tempo) {
    tempo.innerHTML = '<i class="i i-relogio" aria-hidden="true"></i> ' + segundosQueFaltam + 's';
  }
  if (barra) {
    barra.style.width = (segundosQueFaltam / SEGUNDOS_POR_PERGUNTA) * 100 + '%';
    // Nos últimos 3 segundos a barra fica vermelha
    barra.classList.toggle('cg-tfill--pouco', segundosQueFaltam <= 3);
  }
  if (segundosQueFaltam <= 0) {
    clearInterval(relogio);
    tempoEsgotado();
  }
}

// ═══ MODO "ESCOLHER" ═══
function escolherNoJogo(botaoEscolhido) {
  if (perguntaRespondida) {
    return;
  }
  perguntaRespondida = true;
  clearInterval(relogio);

  // Pinto a opção certa de verde e a escolhida de vermelho (se estiver errada)
  document.querySelectorAll('.cg-opt').forEach(function (botao) {
    if (botao.dataset.pinyin === palavraDoJogo.py) {
      botao.classList.add('correct');
    } else if (botao === botaoEscolhido) {
      botao.classList.add('wrong');
    }
  });

  if (botaoEscolhido.dataset.pinyin === palavraDoJogo.py) {
    ganharPonto();
  }
  setTimeout(proximaPalavra, 1200);
}

// ═══ MODO "ESCREVER" ═══
// Tiro os acentos e os espaços e passo a minúsculas, para "wǒ", "wo" e "WO" contarem como iguais
function pinyinSimples(texto) {
  return texto.normalize('NFD')               // separa cada letra do seu acento (ǒ fica o + ̌)
    .replace(/[̀-ͯ]/g, '')          // apaga os acentos que ficaram soltos
    .replace(/\s/g, '')                       // apaga os espaços
    .toLowerCase();
}

function verificarPinyinEscrito() {
  if (perguntaRespondida) {
    return;
  }
  const caixa = document.getElementById('cg-inp');
  if (!caixa) {
    return;
  }
  perguntaRespondida = true;
  clearInterval(relogio);

  const acertou = pinyinSimples(caixa.value) === pinyinSimples(palavraDoJogo.py);
  caixa.classList.add(acertou ? 'cg-input-field--certo' : 'cg-input-field--errado');

  let mensagem;
  if (acertou) {
    ganharPonto();
    mensagem = '✓ Certo! ' + palavraDoJogo.zh + ' = ' + palavraDoJogo.py;
  } else {
    mensagem = '✗ Resposta: ' + palavraDoJogo.py + ' (' + palavraDoJogo.pt + ')';
  }
  mostrarCorrecaoDoJogo(caixa, acertou, mensagem);
  setTimeout(proximaPalavra, 1400);
}

// ═══ O TEMPO ACABOU ═══
function tempoEsgotado() {
  perguntaRespondida = true;
  const caractere = document.querySelector('#cg-area .cg-big-zh');
  if (caractere) {
    mostrarCorrecaoDoJogo(caractere, false, 'Tempo esgotado! Era: ' + palavraDoJogo.py + ' = ' + palavraDoJogo.pt);
  }
  setTimeout(proximaPalavra, 1400);
}

// Ponho a correção logo a seguir a um elemento (com textContent: é sempre texto)
function mostrarCorrecaoDoJogo(depoisDe, acertou, mensagem) {
  const correcao = document.createElement('div');
  correcao.className = 'quiz-feedback cg-correcao ' + (acertou ? 'good' : 'bad');
  correcao.textContent = mensagem;
  depoisDe.after(correcao);
}

// ═══ PARAR O JOGO ═══
// O relógio para, a voz cala-se e aparece a mensagem com os pontos.
// Sem isto, o jogo continuava a passar sozinho às perguntas seguintes e a falar para sempre.
function pararJogo() {
  if (!modoDoJogo) {
    return;   // o jogo já estava parado
  }
  modoDoJogo = '';
  perguntaRespondida = true;
  clearInterval(relogio);
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
  document.getElementById('cg-parar').style.display = 'none';
  document.getElementById('cg-area').innerHTML =
    '<div class="cg-parado">Jogo parado. Fizeste ' + plural(pontosDoJogo, 'ponto') + '. Escolhe um modo para jogar outra vez!</div>';
}

// Ao sair da página, o jogo também para
aoSairDaPagina(pararJogo);
