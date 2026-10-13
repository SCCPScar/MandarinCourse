/**
 * conquistas.js
 * Aqui eu faço as partes que acompanham o aluno:
 * - as conquistas (medalhas) da Introdução;
 * - a janela de boas-vindas da primeira visita, que pergunta o nível;
 * - a janela "Sessão de hoje" (botão Hoje no menu);
 * - o cartão para partilhar o progresso.
 */

// ═══ CONQUISTAS ═══
// Cada medalha tem o id do elemento na Introdução, o nome e uma função que diz se já foi ganha.
const MEDALHAS = [
  { id: 'badge-start', nome: 'Início', ganha: function (dados) { return true; } },
  { id: 'badge-10', nome: '10 palavras', ganha: function (dados) { return dados.palavras >= 10; } },
  { id: 'badge-50', nome: '50 palavras', ganha: function (dados) { return dados.palavras >= 50; } },
  { id: 'badge-100', nome: '100 palavras', ganha: function (dados) { return dados.palavras >= 100; } },
  { id: 'badge-streak3', nome: '3 dias', ganha: function (dados) { return dados.diasSeguidos >= 3; } },
  { id: 'badge-streak7', nome: '7 dias', ganha: function (dados) { return dados.diasSeguidos >= 7; } },
  { id: 'badge-streak30', nome: '30 dias', ganha: function (dados) { return dados.diasSeguidos >= 30; } },
  { id: 'badge-quiz', nome: 'Quiz', ganha: function (dados) { return dados.fezQuiz; } },
  { id: 'badge-perfect', nome: 'Perfeito', ganha: function (dados) { return dados.quizPerfeito; } },
];

// A lista dos ids das medalhas já ganhas, guardada no browser
let medalhasGanhas = lerGuardado('badges', []);

function verificarConquistas() {
  const dados = {
    palavras: Object.keys(palavrasAprendidas).length,
    diasSeguidos: contarDiasSeguidos(),
    fezQuiz: lerGuardado('quizDone', false),
    quizPerfeito: lerGuardado('quizPerfect', false),
  };

  MEDALHAS.forEach(function (medalha) {
    if (!medalha.ganha(dados)) {
      return;
    }
    // Medalha nova: guardo-a e aviso o aluno
    if (!medalhasGanhas.includes(medalha.id)) {
      medalhasGanhas.push(medalha.id);
      guardar('badges', medalhasGanhas);
      mostrarAviso('Conquista desbloqueada: ' + medalha.nome, 2500, 'trofeu');
    }
    // Na Introdução, a medalha fica dourada e diz por escrito que foi ganha
    const elemento = document.getElementById(medalha.id);
    if (elemento) {
      elemento.classList.add('earned');
      const estado = elemento.querySelector('.medalha__estado');
      if (estado) {
        estado.textContent = 'Conquistada';
      }
    }
  });

  const contador = document.getElementById('ach-count');
  if (contador) {
    contador.textContent = medalhasGanhas.length + '/' + MEDALHAS.length + ' conquistas';
  }
}

// ═══ BOAS-VINDAS (primeira visita) ═══
let nivelEscolhido = null;

// Os botões de nível: marco o escolhido e mostro o botão "Começar a aprender"
function escolherNivel(botao, nivel) {
  document.querySelectorAll('.onboard-btn').forEach(function (b) {
    b.classList.remove('selected');
  });
  botao.classList.add('selected');
  nivelEscolhido = nivel;
  document.getElementById('onboard-start').style.display = 'block';
}

// Cada nível começa numa cidade diferente da rota
function terminarBoasVindas() {
  guardar('onboarded', true);
  guardar('level', nivelEscolhido || 'zero');
  document.getElementById('onboard-overlay').style.display = 'none';
  verificarConquistas();
  mostrarAviso('Vamos começar a aprender mandarim!');

  const cidadePorNivel = {
    zero: 'cidade.php?id=1',
    basic: 'cidade.php?id=2',
    inter: 'cidade.php?id=3',
    adv: 'cidade.php?id=5',
  };
  const destino = cidadePorNivel[nivelEscolhido] || cidadePorNivel.zero;
  setTimeout(function () {
    window.location.href = destino;
  }, 500);
}

// Em cada página: na primeira visita mostro as boas-vindas; depois disso verifico as conquistas
aoAbrirPagina(function () {
  if (lerGuardado('onboarded', false)) {
    verificarConquistas();
  } else {
    setTimeout(function () {
      document.getElementById('onboard-overlay').style.display = 'flex';
    }, 800);
  }
});

// ═══ SESSÃO DE HOJE ═══
// Uma lista de 5 passos para uns 10 minutos de estudo, com palavras para rever e palavras novas.
function abrirSessaoDeHoje() {
  const diasSeguidos = contarDiasSeguidos();
  const revisao = lerGuardado('srs', {});
  const agora = new Date();

  // Palavras para rever: as que têm a data de revisão marcada para hoje ou antes (no máximo 3)
  const paraRever = TODAS_AS_PALAVRAS.filter(function (palavra) {
    const cartao = revisao[palavra.zh];
    return cartao && new Date(cartao.nextReview) <= agora;
  }).slice(0, 3);

  // Palavras novas: as que o aluno ainda nunca viu nos cartões (no máximo 2)
  const novas = TODAS_AS_PALAVRAS.filter(function (palavra) {
    return !palavrasAprendidas[palavra.zh] && !revisao[palavra.zh];
  }).slice(0, 2);

  let textoDias = 'Começa hoje e soma o teu primeiro dia!';
  if (diasSeguidos > 0) {
    textoDias = 'Continua assim! Já estudas há ' + plural(diasSeguidos, 'dia') + ' seguidos.';
  }
  let textoRever = 'Hoje não tens palavras para rever. Aprende primeiro algumas palavras novas.';
  if (paraRever.length > 0) {
    textoRever = 'Tens ' + plural(paraRever.length, 'palavra') + ' para rever hoje:';
  }
  let textoNovas = 'Excelente! Já aprendeste todas as palavras disponíveis.';
  if (novas.length > 0) {
    textoNovas = 'Aprende ' + plural(novas.length, 'palavra') + ' nova' + (novas.length === 1 ? '' : 's') + ' hoje:';
  }

  const passos = [
    { icone: 'dias', titulo: 'Dias seguidos: ' + diasSeguidos, texto: textoDias },
    { icone: 'repetir', titulo: 'Revisão espaçada', texto: textoRever, palavras: paraRever, link: 'praticar.php#tab-flash' },
    { icone: 'livro', titulo: 'Palavras novas', texto: textoNovas, palavras: novas, link: 'praticar.php#tab-flash' },
    { icone: 'gravar', titulo: 'Praticar a pronúncia', texto: 'Vai a Praticar, abre o separador Pronúncia e grava 2 ou 3 frases.', link: 'praticar.php#tab-mic' },
    { icone: 'caderno', titulo: 'Caderno', texto: 'Procura uma palavra no Dicionário, guarda-a no Caderno e escreve-a três vezes à mão.', link: 'praticar.php#tab-dict' },
  ];

  let html = '';
  passos.forEach(function (passo) {
    let palavrasHtml = '';
    if (passo.palavras) {
      passo.palavras.forEach(function (palavra) {
        palavrasHtml += `<span class="hoje-palavra"><span class="hoje-palavra__zh">${palavra.zh}</span> <span class="hoje-palavra__py">${palavra.py}</span> ${palavra.pt}</span>`;
      });
    }
    let linkHtml = '';
    if (passo.link) {
      linkHtml = `<a class="hoje-passo__link" href="${passo.link}" onclick="fecharSessaoDeHoje()">Ir agora</a>`;
    }
    html += `
      <div class="hoje-passo">
        <div class="hoje-passo__icone"><i class="i i-${passo.icone}" aria-hidden="true"></i></div>
        <div>
          <div class="hoje-passo__titulo">${passo.titulo}</div>
          <div class="hoje-passo__texto">${passo.texto}</div>
          ${palavrasHtml}
          ${linkHtml}
        </div>
      </div>`;
  });

  document.getElementById('daily-steps').innerHTML = html;
  document.getElementById('daily-modal').classList.add('open');
}

function fecharSessaoDeHoje() {
  const janela = document.getElementById('daily-modal');
  if (janela) {
    janela.classList.remove('open');
  }
}

// ═══ PARTILHAR O PROGRESSO ═══
// Mostro um cartão com o número de palavras e, se o browser deixar, abro a janela de partilha
// do telemóvel. No computador, copio o texto para o aluno colar onde quiser.
function partilharProgresso() {
  const palavras = Object.keys(palavrasAprendidas).length;
  const dias = contarDiasSeguidos();
  const cartao = document.getElementById('share-card');
  if (!cartao) {
    return;
  }
  cartao.style.display = 'block';
  cartao.innerHTML = `
    <div class="sc-zh">茶</div>
    <div class="sc-stat">${palavras} palavras</div>
    <p>Aprendi ${palavras} palavras em mandarim e estudei ${plural(dias, 'dia')} seguidos!</p>
    <p class="sc-rodape">Chá · Curso gratuito de mandarim</p>`;

  const texto = 'Aprendi ' + palavras + ' palavras em mandarim e estudei ' + plural(dias, 'dia') + ' seguidos! #Mandarim #Chá';
  if (navigator.share) {
    navigator.share({ title: 'O meu progresso em mandarim', text: texto });
  } else if (navigator.clipboard) {
    // writeText devolve uma "promessa": .then corre se copiou, .catch corre se o browser não deixou
    navigator.clipboard.writeText(texto)
      .then(function () {
        mostrarAviso('Texto copiado! Cola-o nas redes sociais.');
      })
      .catch(function () {
        mostrarAviso('Não consegui copiar o texto. Tira uma captura de ecrã ao cartão.');
      });
  }
}
