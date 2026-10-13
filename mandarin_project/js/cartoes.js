/**
 * cartoes.js
 * Aqui eu faço os cartões de memória do Praticar e a revisão espaçada.
 *
 * Como funciona um cartão:
 *   1. vejo a palavra em chinês;
 *   2. viro o cartão e vejo o pinyin e o significado (e oiço a palavra);
 *   3. digo se foi Difícil, Razoável ou Fácil.
 *
 * Revisão espaçada: as palavras fáceis voltam daqui a muitos dias, as difíceis voltam amanhã.
 * É uma versão simplificada do algoritmo SM-2, usado em aplicações como o Anki.
 */

let baralho = [];          // as palavras baralhadas
let posicaoNoBaralho = 0;  // o número do cartão que está à vista
let cartaoVirado = false;

// ═══ COMEÇAR ═══
function comecarCartoes() {
  if (!document.getElementById('fc-card')) {
    return;   // esta página não tem cartões
  }
  baralho = baralhar(TODAS_AS_PALAVRAS);
  posicaoNoBaralho = 0;
  mostrarCartao();
}

aoAbrirPagina(comecarCartoes);

// ═══ MOSTRAR O CARTÃO ATUAL (com a frente virada para cima) ═══
function mostrarCartao() {
  const palavra = baralho[posicaoNoBaralho];

  document.getElementById('fc-zh-front').textContent = palavra.zh;
  document.getElementById('fc-zh-back').textContent = palavra.zh;
  document.getElementById('fc-py-back').textContent = palavra.py;
  document.getElementById('fc-en-back').textContent = palavra.pt;

  document.getElementById('fc-speak').onclick = function () {
    falar(palavra.zh, VELOCIDADE_NORMAL);
  };
  document.getElementById('fc-speak-devagar').onclick = function () {
    falar(palavra.zh, VELOCIDADE_DEVAGAR);
  };

  document.getElementById('fc-card').classList.remove('flipped');
  cartaoVirado = false;
  document.getElementById('fc-controls').style.display = 'none';
  document.getElementById('fc-prog').textContent = 'Cartão ' + (posicaoNoBaralho + 1) + ' de ' + baralho.length;
}

// ═══ VIRAR O CARTÃO ═══
// A classe "flipped" faz a animação de virar (está no CSS)
function virarCartao() {
  if (cartaoVirado) {
    return;
  }
  cartaoVirado = true;
  document.getElementById('fc-card').classList.add('flipped');
  document.getElementById('fc-controls').style.display = 'flex';
  falar(baralho[posicaoNoBaralho].zh);
}

// ═══ AVALIAR O CARTÃO ═══
// avaliacao é 'hard' (Difícil), 'ok' (Razoável) ou 'easy' (Fácil)
function avaliarCartao(avaliacao) {
  const palavra = baralho[posicaoNoBaralho];

  marcarRevisao(palavra.zh, avaliacao);

  // Razoável ou Fácil: a palavra conta como aprendida
  if (avaliacao === 'ok' || avaliacao === 'easy') {
    palavrasAprendidas[palavra.zh] = true;
    guardar('learned', palavrasAprendidas);
    atualizarProgresso();
  }

  // Passo ao cartão seguinte; no fim do baralho, baralho outra vez e recomeço
  posicaoNoBaralho++;
  if (posicaoNoBaralho >= baralho.length) {
    baralho = baralhar(TODAS_AS_PALAVRAS);
    posicaoNoBaralho = 0;
  }
  mostrarCartao();
  verificarConquistas();
}

// ═══ REVISÃO ESPAÇADA ═══
// Para cada palavra eu guardo:
//   intervalo   = daqui a quantos dias a palavra volta
//   fator       = quanto o intervalo cresce de cada vez (começa em 2,5)
//   repeticoes  = quantas vezes seguidas o aluno acertou
//   proximaData = o dia em que a palavra volta a aparecer na "Sessão de hoje"
// No browser, os campos ficam com os nomes antigos em inglês (interval, ef, reps, nextReview)
// para não se perder o progresso de quem já usava o site.
let dadosRevisao = lerGuardado('srs', {});

function marcarRevisao(chines, avaliacao) {
  let cartao = dadosRevisao[chines];
  if (!cartao) {
    cartao = { interval: 1, ef: 2.5, reps: 0, nextReview: new Date().toISOString() };
  }

  if (avaliacao === 'hard') {
    // Difícil: volta amanhã e as repetições recomeçam do zero
    cartao.interval = 1;
    cartao.reps = 0;
  } else {
    cartao.reps = cartao.reps + 1;
    if (cartao.reps === 1) {
      cartao.interval = 1;          // 1.ª vez certa: volta amanhã
    } else if (cartao.reps === 2) {
      cartao.interval = 3;          // 2.ª vez certa: volta daqui a 3 dias
    } else {
      cartao.interval = Math.round(cartao.interval * cartao.ef);   // depois disso, o intervalo multiplica
    }
    // Fácil: o fator sobe um pouco, por isso a palavra vai aparecer cada vez menos
    if (avaliacao === 'easy') {
      cartao.ef = cartao.ef + 0.1;
    }
  }

  const proxima = new Date();
  proxima.setDate(proxima.getDate() + cartao.interval);
  cartao.nextReview = proxima.toISOString();

  dadosRevisao[chines] = cartao;
  guardar('srs', dadosRevisao);
}
