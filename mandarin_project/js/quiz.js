/**
 * quiz.js
 * Aqui eu faço o quiz rápido do Praticar: 8 perguntas de escolha múltipla, tiradas ao acaso.
 * O quiz não passa sozinho à pergunta seguinte: o aluno lê a correção e carrega em «Próxima pergunta».
 * No fim mostro a pontuação e a lista das perguntas erradas, e deixo repetir só essas.
 */

// Cada pergunta tem: o texto, o chinês (e o pinyin, se houver), as 4 opções
// e o número da opção certa (a primeira opção é a 0).
const PERGUNTAS_DO_QUIZ = [
  { pergunta: 'O que significa 你好?', zh: '你好', py: 'nǐ hǎo', opcoes: ['Adeus', 'Olá', 'Obrigado', 'Desculpa'], certa: 1 },
  { pergunta: 'Em que tom está mā?', zh: 'mā', opcoes: ['Tom a subir', 'Tom a descer', 'Tom alto e plano', 'Tom que desce e sobe'], certa: 2 },
  { pergunta: 'O que significa 谢谢?', zh: '谢谢', py: 'xièxie', opcoes: ['Por favor', 'Desculpa', 'Obrigado', 'Bem-vindo'], certa: 2 },
  { pergunta: 'Como se diz "não percebo"?', zh: '我不懂', py: 'wǒ bù dǒng', opcoes: ['wǒ bù dǒng', 'wǒ bù hǎo', 'wǒ bù lái', 'wǒ bù gāo'], certa: 0 },
  { pergunta: 'Qual é o classificador para livros?', zh: '量词 para 书', py: 'liàngcí para shū', opcoes: ['个 gè', '张 zhāng', '本 běn', '条 tiáo'], certa: 2 },
  { pergunta: 'Como se pergunta "quanto custa?"', zh: '多少钱?', py: 'duōshao qián?', opcoes: ['Nǐ hǎo ma?', 'Duōshao qián?', 'Zài nǎlǐ?', 'Shénme shíhou?'], certa: 1 },
  { pergunta: 'Para que serve 不 (bù)?', zh: '不', py: 'bù', opcoes: ['Indica o passado', 'Nega verbos e adjetivos', 'Indica posse', 'Faz perguntas'], certa: 1 },
  { pergunta: 'Que caractere significa "pessoa"?', zh: 'Qual é "pessoa"?', opcoes: ['口', '人', '心', '手'], certa: 1 },
  { pergunta: 'Como se pede a conta num restaurante?', zh: '买单 / 结账', py: 'mǎidān / jiézhàng', opcoes: ['Wǒ yào chī', 'Tài guì le', 'Mǎidān / jiézhàng', 'Yǒu méiyǒu'], certa: 2 },
  { pergunta: 'O que exprime 我去过北京?', zh: '我去过北京', py: 'wǒ qùguo Běijīng', opcoes: ['Vou a Pequim', 'Estou em Pequim', 'Já estive em Pequim (experiência de vida)', 'Quero ir a Pequim'], certa: 2 },
  { pergunta: 'O que indica 的 (de)?', zh: '的', py: 'de', opcoes: ['Uma ação terminada', 'Uma pergunta', 'Posse ou descrição', 'Uma negação'], certa: 2 },
  { pergunta: 'Que número é 三十五 (sānshíwǔ)?', zh: '三十五', py: 'sānshíwǔ', opcoes: ['53', '35', '305', '350'], certa: 1 },
  { pergunta: 'Como se diz "tenho uma reunião às 14h"?', zh: '下午两点开会', py: 'xiàwǔ liǎng diǎn kāihuì', opcoes: ['Wǒ míngtiān yǒu huì', 'Xiàwǔ liǎng diǎn kāihuì', 'Wǒmen chī fàn ba', 'Nǐ shì lǎoshī ma'], certa: 1 },
  { pergunta: 'Qual é a forma educada de "tu"?', zh: '"Tu" formal', opcoes: ['你 nǐ', '他 tā', '您 nín', '我 wǒ'], certa: 2 },
  { pergunta: 'O que significa 加油?', zh: '加油', py: 'jiāyóu', opcoes: ['Pôr água', 'Vai-te embora', 'Força! Tu consegues!', 'Tem cuidado'], certa: 2 },
];

let perguntasDoQuiz = [];   // as 8 perguntas desta ronda
let numeroDaPergunta = 0;
let pontos = 0;
let jaRespondeu = false;
let perguntasErradas = [];

// ═══ COMEÇAR ═══
// soAsErradas = true quando o aluno carrega em "Repetir as que errei"
function comecarQuiz(soAsErradas) {
  if (soAsErradas && perguntasErradas.length > 0) {
    perguntasDoQuiz = [...perguntasErradas];
  } else {
    perguntasDoQuiz = baralhar(PERGUNTAS_DO_QUIZ).slice(0, 8);
  }
  numeroDaPergunta = 0;
  pontos = 0;
  perguntasErradas = [];
  document.getElementById('quiz-comecar').style.display = 'none';
  mostrarPerguntaDoQuiz();
}

// ═══ MOSTRAR A PERGUNTA ATUAL ═══
function mostrarPerguntaDoQuiz() {
  if (numeroDaPergunta >= perguntasDoQuiz.length) {
    mostrarFimDoQuiz();
    return;
  }
  const p = perguntasDoQuiz[numeroDaPergunta];
  const total = perguntasDoQuiz.length;
  const percentagem = (numeroDaPergunta / total) * 100;
  jaRespondeu = false;

  // Se a pergunta tem chinês, mostro o pinyin e os botões Ouvir / Devagar
  let pinyinHtml = '';
  if (p.py) {
    pinyinHtml = '<div class="quiz-pinyin">' + p.py + '</div>';
  }
  let ouvirHtml = '';
  const chines = soChines(p.zh);
  if (chines) {
    ouvirHtml = '<div class="quiz-ouvir">' + botoesOuvir(chines, p.py || chines) + '</div>';
  }

  let opcoesHtml = '';
  p.opcoes.forEach(function (opcao, numero) {
    opcoesHtml += '<button class="quiz-btn" onclick="responderQuiz(' + numero + ')">' + opcao + '</button>';
  });

  document.getElementById('quiz-area').innerHTML = `
    <div class="quiz-contador">Pergunta ${numeroDaPergunta + 1} de ${total}</div>
    <div class="progress-bar-wrap"><div class="progress-bar" style="width: ${percentagem}%"></div></div>
    <div class="quiz-question"><strong>${p.pergunta}</strong></div>
    <div class="big-chinese">${p.zh}</div>
    ${pinyinHtml}
    ${ouvirHtml}
    <div class="quiz-options">${opcoesHtml}</div>
    <div id="qfeedback"></div>`;
}

// ═══ O ALUNO RESPONDE ═══
// Pinto a opção certa de verde e, se errou, a escolhida de vermelho
function responderQuiz(escolha) {
  if (jaRespondeu) {
    return;
  }
  jaRespondeu = true;

  const p = perguntasDoQuiz[numeroDaPergunta];
  const acertou = escolha === p.certa;
  const botoes = document.querySelectorAll('.quiz-btn');

  botoes.forEach(function (botao) {
    botao.disabled = true;
  });
  botoes[p.certa].classList.add('correct');

  if (acertou) {
    pontos++;
  } else {
    botoes[escolha].classList.add('wrong');
    perguntasErradas.push(p);
  }

  const ultima = numeroDaPergunta === perguntasDoQuiz.length - 1;
  const textoDoBotao = ultima ? 'Ver o resultado' : 'Próxima pergunta';
  const correcao = document.getElementById('qfeedback');

  if (acertou) {
    correcao.className = 'quiz-feedback good';
    correcao.innerHTML = '✓ Certo!';
  } else {
    correcao.className = 'quiz-feedback bad';
    correcao.innerHTML = '✗ A resposta certa é: <strong>' + p.opcoes[p.certa] + '</strong>';
  }
  correcao.innerHTML += '<div><button type="button" class="botao-cha quiz-seguinte" id="quiz-seguinte">'
    + textoDoBotao + ' <i class="i i-seguinte" aria-hidden="true"></i></button></div>';

  const seguinte = document.getElementById('quiz-seguinte');
  seguinte.addEventListener('click', function () {
    numeroDaPergunta++;
    mostrarPerguntaDoQuiz();
  });
  seguinte.focus();   // o foco vai para o botão, para se poder continuar com o Enter
}

// ═══ FIM DO QUIZ ═══
function mostrarFimDoQuiz() {
  const total = perguntasDoQuiz.length;
  const percentagem = Math.round((pontos / total) * 100);

  // Guardo para as conquistas «Quiz» e «Perfeito»
  guardar('quizDone', true);
  if (percentagem === 100) {
    guardar('quizPerfect', true);
  }
  verificarConquistas();

  let mensagem;
  if (percentagem >= 80) {
    mensagem = 'Excelente! Estás pronto para o nível seguinte.';
  } else if (percentagem >= 60) {
    mensagem = 'Bom trabalho! Revê as perguntas em que erraste.';
  } else {
    mensagem = 'Continua a estudar e volta à gramática e ao vocabulário.';
  }
  const classe = percentagem >= 80 ? 'good' : 'bad';

  // Lista das perguntas erradas, com a resposta certa
  let erradasHtml = '';
  if (perguntasErradas.length > 0) {
    let lista = '';
    perguntasErradas.forEach(function (p) {
      lista += '<li><strong>' + p.pergunta + '</strong> <span class="quiz-certa">' + p.opcoes[p.certa] + '</span></li>';
    });
    erradasHtml = `
      <h4 class="quiz-erradas-titulo">Para estudar depois</h4>
      <ul class="quiz-erradas">${lista}</ul>
      <button type="button" class="botao-cha" onclick="comecarQuiz(true)"><i class="i i-repetir" aria-hidden="true"></i> Repetir as que errei</button>`;
  }

  document.getElementById('quiz-area').innerHTML = `
    <div class="quiz-score">${pontos}/${total} · ${percentagem}%</div>
    <div class="quiz-feedback quiz-mensagem-final ${classe}">${mensagem}</div>
    ${erradasHtml}`;

  const comecar = document.getElementById('quiz-comecar');
  comecar.textContent = 'Fazer outro quiz';
  comecar.style.display = 'inline-block';
}
