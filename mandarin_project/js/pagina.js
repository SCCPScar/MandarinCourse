/**
 * pagina.js
 * Aqui eu organizo o que corre quando uma página abre e o que paro quando ela sai.
 *
 * Os outros ficheiros não correm o código logo. Em vez disso, entregam-me funções:
 *   aoAbrirPagina(funcao)   → a funcao corre quando a página acabar de carregar
 *   aoSairDaPagina(funcao)  → a funcao corre quando o aluno sai para outra página
 *
 * Porquê? Porque todos os ficheiros JavaScript são carregados em todas as páginas,
 * mas cada página só tem algumas partes (o quiz só existe no Praticar, por exemplo).
 * Assim tenho um sítio único para arrancar tudo e outro para desligar
 * o microfone, a voz e os temporizadores ao sair.
 */

const funcoesAoAbrir = [];
const funcoesAoSair = [];

function aoAbrirPagina(funcao) {
  funcoesAoAbrir.push(funcao);
}

function aoSairDaPagina(funcao) {
  funcoesAoSair.push(funcao);
}

// Corro cada função dentro de try/catch: se uma der erro, as outras continuam a correr
function correrComSeguranca(funcao, valor) {
  try {
    funcao(valor);
  } catch (erro) {
    console.error('Erro ao preparar a página:', erro);
  }
}

// DOMContentLoaded: o HTML da página já foi todo lido pelo browser.
// Entrego a cada função o <main class="page">, onde está o conteúdo da página.
document.addEventListener('DOMContentLoaded', function () {
  const conteudo = document.querySelector('main.page') || document.body;
  funcoesAoAbrir.forEach(function (funcao) {
    correrComSeguranca(funcao, conteudo);
  });
});

// pagehide: o aluno está a sair da página (link, botão "voltar" ou fechar o separador)
window.addEventListener('pagehide', function () {
  funcoesAoSair.forEach(function (funcao) {
    correrComSeguranca(funcao);
  });
});
