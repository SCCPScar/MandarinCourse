/**
 * ouvir.js
 * Aqui eu junto tudo o que tem a ver com ouvir o chinês:
 * - a função falar(), que usa a voz do próprio browser (Web Speech API, sem internet nem servidor);
 * - os botões «Ouvir» e «Devagar»;
 * - os elementos das páginas em que se pode carregar para ouvir (cartões, tabelas, diálogos);
 * - o aviso quando o computador não tem voz chinesa.
 */

// As duas velocidades da voz. 1 é a velocidade normal; menos de 1 é mais devagar.
const VELOCIDADE_NORMAL = 0.9;
const VELOCIDADE_DEVAGAR = 0.55;

// ═══ FALAR ═══
// Leio um texto em chinês em voz alta.
function falar(texto, velocidade) {
  if (!texto) {
    return;
  }

  // Browsers muito antigos não têm voz nenhuma
  if (!('speechSynthesis' in window)) {
    mostrarAviso('Este browser não consegue ler texto em voz alta. Usa o Chrome ou o Edge.', 5000, 'sem-som');
    return;
  }

  speechSynthesis.cancel();   // paro o que estiver a ser dito antes

  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = 'zh-CN';

  // Procuro uma voz chinesa: primeiro da China continental (zh-CN), depois qualquer uma em chinês
  const vozes = speechSynthesis.getVoices();
  const vozChinesa = vozes.find(function (voz) { return voz.lang.includes('zh') && voz.lang.includes('CN'); })
                  || vozes.find(function (voz) { return voz.lang.startsWith('zh'); });
  if (vozChinesa) {
    fala.voice = vozChinesa;
  } else if (vozes.length > 0) {
    // As vozes já carregaram e nenhuma é chinesa: aviso no momento do clique
    mostrarAviso('Este computador não tem voz chinesa, por isso pode não se ouvir nada. Usa o Chrome ou o Edge.', 5000, 'sem-som');
  }

  // Se não me derem a velocidade, uso a do controlo deslizante da ferramenta "Ouvir" (Praticar)
  if (velocidade) {
    fala.rate = velocidade;
  } else {
    const controlo = document.getElementById('speak-rate');
    fala.rate = controlo ? parseFloat(controlo.value) : 0.85;
  }

  speechSynthesis.speak(fala);

  // Na ferramenta "Ouvir" do Praticar mostro "A falar…" enquanto a voz fala
  const estado = document.getElementById('speak-status');
  if (estado) {
    estado.innerHTML = '<i class="i i-ouvir" aria-hidden="true"></i> A falar…';
    fala.onend = function () {
      estado.textContent = '';
    };
  }
}

// ═══ BOTÕES «OUVIR» E «DEVAGAR» ═══
// Devolvo o HTML dos dois botões. É o mesmo que a função botoes_ouvir() do PHP (includes/funcoes.php),
// para o HTML que é feito em JavaScript. O chinês vai no atributo data-falar.
function botoesOuvir(hanzi, rotulo) {
  const chines = escapar(hanzi);
  const nome = escapar(rotulo || hanzi);
  return '<span class="ouvir-par">'
    + '<button type="button" class="ouvir-btn" data-falar="' + chines + '" onclick="falar(this.dataset.falar, VELOCIDADE_NORMAL)" aria-label="Ouvir ' + nome + '">'
    + '<i class="i i-ouvir" aria-hidden="true"></i> Ouvir</button>'
    + '<button type="button" class="ouvir-btn ouvir-btn--devagar" data-falar="' + chines + '" onclick="falar(this.dataset.falar, VELOCIDADE_DEVAGAR)" aria-label="Ouvir devagar ' + nome + '">'
    + '<i class="i i-devagar" aria-hidden="true"></i> Devagar</button>'
    + '</span>';
}

// ═══ TIRAR SÓ O CHINÊS DE UM TEXTO ═══
// 一-鿿 é o intervalo Unicode dos caracteres chineses mais comuns; junto também a pontuação chinesa.
// Ex.: soChines('妈 mā = mãe') → '妈'
function soChines(texto) {
  const pedacos = texto.match(/[一-鿿，。？！、]+/g);
  if (!pedacos) {
    return '';
  }
  return pedacos.join('');
}

// Num elemento, eu prefiro o texto de .zh; se não houver, uso o texto do próprio elemento
function chinesDe(elemento) {
  const zh = elemento.querySelector('.zh');
  if (zh) {
    return soChines(zh.textContent);
  }
  return soChines(elemento.textContent);
}

// ═══ ELEMENTOS EM QUE SE PODE CARREGAR PARA OUVIR ═══
const ALVOS_OUVIR = '.card, .zh-cell, .zh-ex, .tone-card .example, .num-card, .bubble';

aoAbrirPagina(function (conteudo) {
  conteudo.querySelectorAll(ALVOS_OUVIR).forEach(function (elemento) {
    const texto = chinesDe(elemento);
    // Sem chinês, ou o elemento já tem outra ação: não mexo
    if (!texto || elemento.hasAttribute('onclick')) {
      return;
    }
    elemento.classList.add('pode-ouvir');
    elemento.setAttribute('role', 'button');
    elemento.setAttribute('tabindex', '0');   // assim também se chega lá com a tecla Tab
    elemento.setAttribute('title', 'Carrega para ouvir');
    elemento.setAttribute('aria-label', 'Ouvir ' + texto);
  });
});

// Na página Sons, os exemplos das tabelas e dos cartões dos tons ganham os botões «Ouvir» e «Devagar»
aoAbrirPagina(function (conteudo) {
  if (conteudo.dataset.page !== 'sons') {
    return;
  }
  conteudo.querySelectorAll('td, .tone-card .example').forEach(function (elemento) {
    const texto = soChines(elemento.textContent);
    if (!texto || elemento.querySelector('.ouvir-par')) {
      return;
    }
    elemento.insertAdjacentHTML('beforeend', '<div class="ouvir-na-tabela">' + botoesOuvir(texto) + '</div>');
  });
});

// Um só "ouvinte" de cliques para a página inteira (chama-se delegação de eventos):
// quando se carrega num elemento .pode-ouvir, eu leio o chinês dele.
document.addEventListener('click', function (evento) {
  const elemento = evento.target.closest('.pode-ouvir');
  if (elemento) {
    falar(chinesDe(elemento));
  }
});

// O mesmo com o teclado: Enter ou Espaço num elemento .pode-ouvir
document.addEventListener('keydown', function (evento) {
  if (!evento.target.closest) {
    return;
  }
  const elemento = evento.target.closest('.pode-ouvir');
  if (elemento && (evento.key === 'Enter' || evento.key === ' ')) {
    evento.preventDefault();
    falar(chinesDe(elemento));
  }
});

// ═══ CONTROLO DA VELOCIDADE (ferramenta "Ouvir" do Praticar) ═══
aoAbrirPagina(function () {
  const controlo = document.getElementById('speak-rate');
  const etiqueta = document.getElementById('speak-rate-label');
  if (controlo && etiqueta) {
    controlo.addEventListener('input', function () {
      etiqueta.textContent = controlo.value + '×';
    });
  }
});

// ═══ AVISO "SEM VOZ CHINESA" AO ABRIR A PÁGINA ═══
// Aviso uma vez por visita, para o aluno saber porque não ouve nada.
function avisarSemVozChinesa() {
  const vozes = speechSynthesis.getVoices();
  if (vozes.length === 0) {
    return;   // as vozes ainda não carregaram; o browser volta a chamar esta função quando carregarem
  }
  const temChines = vozes.some(function (voz) {
    const lingua = voz.lang.toLowerCase();
    return lingua.startsWith('zh') || lingua.startsWith('cmn');
  });
  if (!temChines && !sessionStorage.getItem('aviso-voz')) {
    sessionStorage.setItem('aviso-voz', '1');
    mostrarAviso('Este browser não tem voz chinesa. Para ouvires o chinês, usa o Chrome ou o Edge.', 6000, 'sem-som');
  }
}

if ('speechSynthesis' in window) {
  speechSynthesis.addEventListener('voiceschanged', avisarSemVozChinesa);
  setTimeout(avisarSemVozChinesa, 1500);
}

// Ao sair da página, a voz cala-se
aoSairDaPagina(function () {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
});
