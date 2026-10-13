/**
 * tema.js
 * Aqui eu faço o modo escuro.
 * Ao carregar no botão "Escuro", ponho a classe "dark" no <body>.
 * O css/ferramentas.css tem as cores do modo escuro para tudo o que está dentro de body.dark.
 * A escolha fica guardada no browser, para se manter nas outras páginas.
 */

function trocarModoEscuro() {
  // toggle põe a classe se ela não existir e tira-a se existir; devolve true se ficou posta
  const escuro = document.body.classList.toggle('dark');
  atualizarBotaoEscuro(escuro);
  guardar('dark', escuro);
}

// O botão mostra sempre o modo para onde se vai: no modo escuro, oferece o claro
function atualizarBotaoEscuro(escuro) {
  const botao = document.getElementById('dark-toggle');
  if (!botao) {
    return;
  }
  if (escuro) {
    botao.innerHTML = '<i class="i i-claro" aria-hidden="true"></i> <span class="site-nav__texto">Claro</span>';
    botao.title = 'Mudar para o modo claro';
  } else {
    botao.innerHTML = '<i class="i i-escuro" aria-hidden="true"></i> <span class="site-nav__texto">Escuro</span>';
    botao.title = 'Mudar para o modo escuro';
  }
}

// Os scripts estão no fim do <body>, por isso a página já existe quando isto corre.
// Se o aluno escolheu o modo escuro antes, ponho-o já, antes de a página aparecer.
if (lerGuardado('dark', false)) {
  document.body.classList.add('dark');
  atualizarBotaoEscuro(true);
}
