/**
 * interface.js
 * Aqui eu junto as partes da interface que existem em todas as páginas:
 * os avisos que aparecem em baixo (toast), a barra de leitura, o botão "voltar ao topo",
 * os atalhos de teclado e a abertura de um separador pelo endereço (ex.: praticar.php#tab-dict).
 */

// ═══ AVISOS (TOAST) ═══
// Mostro uma mensagem curta em baixo no ecrã, que desaparece sozinha.
// icone é opcional: é o nome de um ícone do css/icones.css (ex.: 'trofeu').
function mostrarAviso(mensagem, duracao = 2500, icone = '') {
  const aviso = document.getElementById('toast');
  if (!aviso) {
    return;
  }
  // textContent: a mensagem é sempre lida como texto, nunca como HTML
  aviso.textContent = mensagem;
  if (icone) {
    aviso.insertAdjacentHTML('afterbegin', '<i class="i i-' + icone + '" aria-hidden="true"></i> ');
  }
  aviso.classList.add('show');
  setTimeout(function () {
    aviso.classList.remove('show');
  }, duracao);
}

// ═══ BARRA DE LEITURA E BOTÃO "VOLTAR AO TOPO" ═══
// A cada scroll, eu calculo que percentagem da página já foi lida e alargo a barra.
// passive: true diz ao browser que eu não vou bloquear o scroll, por isso ele pode rolar sem esperar.
window.addEventListener('scroll', function () {
  const barra = document.getElementById('read-bar');
  const botaoTopo = document.getElementById('back-top');
  const jaRolado = window.scrollY;
  const totalParaRolar = document.documentElement.scrollHeight - window.innerHeight;

  if (barra) {
    let percentagem = 0;
    if (totalParaRolar > 0) {
      percentagem = (jaRolado / totalParaRolar) * 100;
    }
    barra.style.width = percentagem + '%';
  }
  if (botaoTopo) {
    botaoTopo.style.display = jaRolado > 400 ? 'block' : 'none';
  }
}, { passive: true });

// ═══ ATALHOS DE TECLADO ═══
// Nos cartões de memória: Espaço vira o cartão; 1, 2 e 3 avaliam (Difícil, Razoável, Fácil).
// Esc fecha a janela "Sessão de hoje".
document.addEventListener('keydown', function (evento) {
  // Se o aluno está a escrever numa caixa de texto, as teclas são para escrever, não são atalhos
  const alvo = evento.target;
  if (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA') {
    return;
  }

  if (evento.code === 'Escape') {
    fecharSessaoDeHoje();
  }

  // Os atalhos dos cartões só funcionam com o separador «Cartões» aberto
  const cartoesAbertos = document.querySelector('#tab-flash.active');
  if (!cartoesAbertos) {
    return;
  }

  if (evento.code === 'Space' && !alvo.closest('button, a')) {
    evento.preventDefault();   // sem isto, o Espaço também fazia a página descer
    virarCartao();
  }

  // Só avalio depois de o cartão estar virado, para o aluno ver primeiro a resposta
  if (cartaoVirado) {
    if (evento.code === 'Digit1' || evento.code === 'Numpad1') avaliarCartao('hard');
    if (evento.code === 'Digit2' || evento.code === 'Numpad2') avaliarCartao('ok');
    if (evento.code === 'Digit3' || evento.code === 'Numpad3') avaliarCartao('easy');
  }
});

// ═══ ABRIR UM SEPARADOR PELO ENDEREÇO ═══
// Ex.: praticar.php#tab-dict abre logo o Dicionário; vocabulario.php#food abre a Comida.
// Assim as lições podem ter links diretos para o separador certo.
function abrirSeparadorDoEndereco() {
  const id = decodeURIComponent(location.hash.slice(1));   // o texto depois do #

  // Só aceito nomes simples (letras minúsculas, números e hífen), por segurança
  if (!/^[a-z0-9-]+$/.test(id)) {
    return;
  }
  const painel = document.getElementById(id);
  if (!painel || !painel.matches('.tab-content, .api-tab-content')) {
    return;
  }

  // Procuro o botão que abre esse painel e "carrego" nele
  const botao = document.querySelector('[onclick*="\'' + id + '\'"]');
  if (!botao) {
    return;
  }
  botao.click();

  // Rolo até aos botões dos separadores, descontando os 90 px da barra de navegação fixa
  const posicao = botao.getBoundingClientRect().top + window.scrollY - 90;
  window.scrollTo({ top: posicao });
}

// Corro quando a página abre e quando só muda o # do endereço (sem carregar outra página)
aoAbrirPagina(abrirSeparadorDoEndereco);
window.addEventListener('hashchange', abrirSeparadorDoEndereco);
