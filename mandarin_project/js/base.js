/**
 * base.js
 * Aqui eu junto as funções pequenas que todos os outros ficheiros usam:
 * guardar e ler dados no browser, proteger texto antes de o pôr no HTML,
 * baralhar listas e trocar de separador.
 * Este ficheiro é carregado primeiro (ver includes/scripts.php).
 */

// ═══ GUARDAR DADOS NO BROWSER (localStorage) ═══
// O localStorage só guarda texto. Por isso eu transformo os dados em texto com JSON.stringify
// quando guardo, e volto a transformá-los em objetos com JSON.parse quando leio.
// Uso try/catch porque o browser pode bloquear o localStorage (por exemplo, numa janela privada).

function lerGuardado(chave, valorSeNaoExistir) {
  try {
    const texto = localStorage.getItem(chave);
    if (texto === null) {
      return valorSeNaoExistir;
    }
    return JSON.parse(texto);
  } catch (erro) {
    return valorSeNaoExistir;
  }
}

function guardar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    // Se o browser não deixar guardar, o site continua a funcionar, só não se lembra do progresso
  }
}

// ═══ PROTEGER TEXTO (contra XSS) ═══
// Antes de pôr um texto dentro do HTML, eu troco os símbolos especiais pelos seus códigos.
// Assim, se alguém escrever <script>, aparece o texto "<script>" e o browser não o executa.
// É o mesmo que a função e() faz no PHP (includes/sessao.php).
function escapar(texto) {
  if (texto === null || texto === undefined) {
    texto = '';
  }
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ═══ BARALHAR UMA LISTA ═══
// Algoritmo de Fisher-Yates: percorro a lista de trás para a frente
// e troco cada elemento com outro escolhido ao acaso.
// Trabalho numa cópia, para não mexer na lista original.
function baralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const guardado = copia[i];
    copia[i] = copia[j];
    copia[j] = guardado;
  }
  return copia;
}

// ═══ ESCOLHER UM ELEMENTO AO ACASO ═══
function aoAcaso(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

// ═══ PLURAL ═══
// plural(1, 'dia') → "1 dia" e plural(3, 'dia') → "3 dias"
function plural(numero, palavra) {
  if (numero === 1) {
    return numero + ' ' + palavra;
  }
  return numero + ' ' + palavra + 's';
}

// ═══ SEPARADORES (TABS) DAS PÁGINAS DE CONTEÚDO ═══
// Cada grupo tem botões .tab-btn e painéis .tab-content.
// Ao carregar num botão, eu tiro a classe "active" de todos e ponho-a só no botão e no painel escolhidos.
function abrirSeparador(evento, idDoPainel) {
  const grupo = evento.target.closest('.tabs').parentElement;

  grupo.querySelectorAll('.tab-btn').forEach(function (botao) {
    botao.classList.remove('active');
  });
  grupo.querySelectorAll('.tab-content').forEach(function (painel) {
    painel.classList.remove('active');
  });

  evento.target.classList.add('active');
  const painel = grupo.querySelector('#' + idDoPainel);
  if (painel) {
    painel.classList.add('active');
  }
}

// ═══ SEPARADORES DA PÁGINA PRATICAR ═══
// Funciona como o abrirSeparador, mas com as classes .api-tab-btn e .api-tab-content.
function abrirFerramenta(evento, idDoPainel) {
  const botao = evento.target;
  const barra = botao.parentElement;
  const grupo = barra.parentElement;

  barra.querySelectorAll('.api-tab-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  grupo.querySelectorAll('.api-tab-content').forEach(function (painel) {
    painel.classList.remove('active');
  });

  botao.classList.add('active');
  const painel = grupo.querySelector('#' + idDoPainel);
  if (painel) {
    painel.classList.add('active');
  }

  // Se saio do separador do jogo de caracteres, o jogo para (senão continuava a falar escondido)
  if (idDoPainel !== 'tab-chargame' && typeof pararJogo === 'function') {
    pararJogo();
  }
}

// ═══ MOSTRAR OU ESCONDER O PINYIN ═══
// A caixa "Mostrar pinyin" da página Sons.
function mostrarOuEsconderPinyin() {
  const caixa = document.getElementById('show-pinyin-toggle');
  const mostrar = caixa ? caixa.checked : true;

  document.querySelectorAll('.zh-with-pinyin').forEach(function (elemento) {
    elemento.classList.toggle('pinyin-hidden', !mostrar);
  });
  document.querySelectorAll('.ttc-py, #repeat-target-py, .repeat-py').forEach(function (elemento) {
    elemento.style.display = mostrar ? '' : 'none';
  });
}
