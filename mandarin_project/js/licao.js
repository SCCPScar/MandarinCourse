/**
 * licao.js
 * Aqui eu faço o exercício das lições (licao.php), com as palavras da própria lição.
 * Há três tipos de pergunta:
 *   - ouvir:      oiço a palavra e escolho o caractere certo;
 *   - significado: vejo o caractere e o pinyin e escolho a tradução;
 *   - escrever:   vejo a tradução e escolho o caractere.
 * O exercício nunca passa sozinho à pergunta seguinte: o aluno lê a correção e carrega em «Próxima pergunta».
 * No fim mostro as palavras que errou, com som, e deixo repetir só essas.
 */

let exPalavras = [], exPerguntas = [], exAtual = 0, exCertas = 0, exErradas = [];

// Monto as perguntas: cada palavra aparece em dois tipos diferentes, até um máximo de 12
function montarPerguntas(palavras) {
  const tipos = ['ouvir', 'significado', 'escrever'];
  const perguntas = [];
  palavras.forEach((p, i) => {
    perguntas.push({ palavra: p, tipo: tipos[i % 3] });
    perguntas.push({ palavra: p, tipo: tipos[(i + 1) % 3] });
  });
  return baralhar(perguntas).slice(0, 12);
}

function comecarExercicio(soAsErradas) {
  const dados = document.getElementById('palavras-licao');
  if (!dados) return;
  exPalavras = JSON.parse(dados.textContent);
  const base = soAsErradas && exErradas.length ? exErradas : exPalavras;
  exPerguntas = montarPerguntas(base);
  exAtual = 0; exCertas = 0; exErradas = [];
  mostrarPergunta();
}

function mostrarPergunta() {
  const caixa = document.getElementById('exercicio');
  const { palavra, tipo } = exPerguntas[exAtual];
  // As opções: a certa e até 3 erradas, tiradas das outras palavras da lição
  const outras = baralhar(exPalavras.filter(p => p.hanzi !== palavra.hanzi)).slice(0, 3);
  const opcoes = baralhar([palavra, ...outras]);

  let enunciado, textoOpcao;
  if (tipo === 'ouvir') {
    enunciado = `<p class="ex__pergunta">Ouve e escolhe a palavra certa.</p>${botoesOuvir(palavra.hanzi, 'a palavra')}`;
    textoOpcao = o => `<span class="ex__zh" lang="zh-CN">${escapar(o.hanzi)}</span>`;
    setTimeout(() => falar(palavra.hanzi, VELOCIDADE_NORMAL), 300);   // toca logo uma vez
  } else if (tipo === 'significado') {
    enunciado = `<p class="ex__pergunta">O que quer dizer?</p>
      <p class="ex__grande"><span lang="zh-CN">${escapar(palavra.hanzi)}</span> <span class="ex__py">${escapar(palavra.pinyin)}</span></p>
      ${botoesOuvir(palavra.hanzi, palavra.pinyin)}`;
    textoOpcao = o => escapar(o.traducao);
  } else {
    enunciado = `<p class="ex__pergunta">Como se diz em chinês?</p><p class="ex__grande">«${escapar(palavra.traducao)}»</p>`;
    textoOpcao = o => `<span class="ex__zh" lang="zh-CN">${escapar(o.hanzi)}</span>`;
  }

  caixa.innerHTML = `
    <p class="ex__contador">Pergunta ${exAtual + 1} de ${exPerguntas.length}</p>
    ${enunciado}
    <div class="ex__opcoes">
      ${opcoes.map(o => `<button type="button" class="ex__opcao" data-hanzi="${escapar(o.hanzi)}">${textoOpcao(o)}</button>`).join('')}
    </div>
    <div class="ex__correcao" role="status"></div>`;

  caixa.querySelectorAll('.ex__opcao').forEach(botao => botao.addEventListener('click', () => responder(botao)));
}

function responder(botao) {
  const caixa = document.getElementById('exercicio');
  const { palavra } = exPerguntas[exAtual];
  const certo = botao.dataset.hanzi === palavra.hanzi;

  // Bloqueio as opções e pinto a certa (e a errada, se foi o caso)
  caixa.querySelectorAll('.ex__opcao').forEach(b => {
    b.disabled = true;
    if (b.dataset.hanzi === palavra.hanzi) b.classList.add('ex__opcao--certa');
  });
  if (certo) exCertas++;
  else {
    botao.classList.add('ex__opcao--errada');
    if (!exErradas.some(p => p.hanzi === palavra.hanzi)) exErradas.push(palavra);
  }

  const ultima = exAtual === exPerguntas.length - 1;
  caixa.querySelector('.ex__correcao').innerHTML = `
    <p class="${certo ? 'ex__certo' : 'ex__errado'}">
      <i class="i ${certo ? 'i-certo' : 'i-errado'}" aria-hidden="true"></i>
      ${certo ? 'Certo!' : 'Ainda não.'}
      <span lang="zh-CN">${escapar(palavra.hanzi)}</span> · ${escapar(palavra.pinyin)} · ${escapar(palavra.traducao)}
    </p>
    <button type="button" class="botao-cha" id="ex-seguinte">${ultima ? 'Ver o resultado' : 'Próxima pergunta'} <i class="i i-seguinte" aria-hidden="true"></i></button>`;
  const seguinte = document.getElementById('ex-seguinte');
  seguinte.addEventListener('click', () => { exAtual++; ultima ? mostrarResultado() : mostrarPergunta(); });
  seguinte.focus();
}

function mostrarResultado() {
  const caixa = document.getElementById('exercicio');
  const total = exPerguntas.length;
  const lista = exErradas.map(p => `
    <li><span class="ex__zh" lang="zh-CN">${escapar(p.hanzi)}</span> <span class="ex__py">${escapar(p.pinyin)}</span> ${escapar(p.traducao)} ${botoesOuvir(p.hanzi, p.pinyin)}</li>`).join('');

  caixa.innerHTML = `
    <p class="ex__pontos">${exCertas} de ${total} certas</p>
    ${exErradas.length
      ? `<p>Revê estas palavras antes de continuar:</p><ul class="ex__erradas">${lista}</ul>
         <button type="button" class="botao-cha" onclick="comecarExercicio(true)"><i class="i i-repetir" aria-hidden="true"></i> Repetir só as que errei</button>`
      : `<p class="ex__certo"><i class="i i-trofeu" aria-hidden="true"></i> Perfeito! Acertaste todas.</p>`}
    <button type="button" class="botao-cha botao-cha--claro" onclick="comecarExercicio()">Fazer outra vez</button>`;
}
