/**
 * pronuncia.js
 * Aqui eu faço o separador «Pronúncia» do Praticar. Tem quatro partes:
 *   1. Ver os tons: o aluno grava a voz e eu desenho a altura da voz por cima do tom certo;
 *   2. Repetir: o aluno diz uma palavra e o browser reconhece o que ele disse;
 *   3. Reconhecimento de voz: o mesmo, com frases à escolha;
 *   4. Os meus resultados: as tentativas guardadas no browser.
 *
 * Uso duas ferramentas do próprio browser (não precisam de servidor):
 *   - Web Audio API: recebe o som do microfone e dá-me os números da onda sonora;
 *   - Web Speech API (SpeechRecognition): transforma a fala em texto (só no Chrome e no Edge).
 */

// ═══ SEPARADORES DA PRONÚNCIA ═══
function abrirTreinoPronuncia(evento, idDoPainel) {
  document.querySelectorAll('.mic-tab').forEach(function (botao) {
    botao.classList.remove('active');
  });
  document.querySelectorAll('.mic-tab-content').forEach(function (painel) {
    painel.classList.remove('active');
  });
  evento.target.classList.add('active');
  const painel = document.getElementById(idDoPainel);
  if (painel) {
    painel.classList.add('active');
  }
}

// ═══ MICROFONE ═══
let microfone = null;      // o "stream" de som que vem do microfone
let contextoDeAudio = null;
let analisador = null;     // o AnalyserNode dá-me os números da onda sonora

// Peço autorização para usar o microfone (o browser pergunta ao aluno).
// async/await: espero pela resposta do aluno sem bloquear a página.
async function pedirMicrofone() {
  if (microfone) {
    return microfone;
  }
  try {
    microfone = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    return microfone;
  } catch (erro) {
    alert('O acesso ao microfone foi recusado. Autoriza o microfone nas definições do browser e tenta outra vez.');
    return null;
  }
}

function ligarAnalisador(stream) {
  if (contextoDeAudio) {
    contextoDeAudio.close();
  }
  contextoDeAudio = new AudioContext();
  analisador = contextoDeAudio.createAnalyser();
  analisador.fftSize = 2048;               // quantos números leio de cada vez
  analisador.smoothingTimeConstant = 0.7;
  contextoDeAudio.createMediaStreamSource(stream).connect(analisador);
}

// ═══ DESCOBRIR A ALTURA DA VOZ (em Hz) ═══
// Uso a autocorrelação: comparo a onda com ela própria, deslocada um bocadinho de cada vez.
// Quando a onda deslocada fica quase igual à original, encontrei o "período" da voz
// (o tempo que a onda demora a repetir-se). A frequência é: amostras por segundo / período.
// Devolvo -1 quando há silêncio ou quando não consigo descobrir.
function alturaDaVoz(amostras, amostrasPorSegundo) {
  const tamanho = amostras.length;
  const metade = Math.floor(tamanho / 2);

  // 1. Volume (RMS): se for muito baixo, é silêncio
  let somaDosQuadrados = 0;
  for (let i = 0; i < tamanho; i++) {
    somaDosQuadrados += amostras[i] * amostras[i];
  }
  const volume = Math.sqrt(somaDosQuadrados / tamanho);
  if (volume < 0.01) {
    return -1;
  }

  // 2. Para cada deslocamento, somo os produtos da onda com ela própria deslocada
  const parecenca = new Array(metade).fill(0);
  for (let deslocamento = 0; deslocamento < metade; deslocamento++) {
    for (let j = 0; j < metade; j++) {
      parecenca[deslocamento] += amostras[j] * amostras[j + deslocamento];
    }
  }

  // 3. Salto a primeira descida e procuro o ponto mais alto a seguir: é o período
  let inicio = 0;
  while (inicio < metade - 1 && parecenca[inicio] > parecenca[inicio + 1]) {
    inicio++;
  }
  let maior = -1;
  let periodo = -1;
  for (let i = inicio; i < metade; i++) {
    if (parecenca[i] > maior) {
      maior = parecenca[i];
      periodo = i;
    }
  }
  if (periodo <= 0) {
    return -1;
  }
  return amostrasPorSegundo / periodo;
}

// ═══ 1. VER OS TONS ═══
let aGravarTom = false;
let animacao = null;          // o número do requestAnimationFrame, para o poder parar
let alturasGravadas = [];     // as alturas da voz (Hz) durante a gravação
let tomEscolhido = 1;
let graficoTom = null;        // o <canvas> do tom
let pincelTom = null;         // o "pincel" (contexto 2D) para desenhar nesse canvas
let graficoOnda = null;
let pincelOnda = null;
let vigiaTamanho = null;      // o ResizeObserver que redesenha quando o tamanho muda

const CORES_DOS_TONS = { 1: '#2F6FD0', 2: '#0E7C66', 3: '#E8A317', 4: '#C8361F' };
const NOMES_DOS_TONS = { 1: '1.º tom: alto e plano', 2: '2.º tom: a subir', 3: '3.º tom: desce e sobe', 4: '4.º tom: a descer' };

// A forma ideal de cada tom, em 8 pontos. 0 é o topo do gráfico (voz aguda) e 1 é o fundo (voz grave).
const FORMAS_DOS_TONS = {
  1: [0.15, 0.15, 0.14, 0.15, 0.15, 0.14, 0.15, 0.15],   // fica em cima
  2: [0.85, 0.78, 0.68, 0.56, 0.43, 0.32, 0.22, 0.15],   // sobe
  3: [0.45, 0.52, 0.62, 0.72, 0.78, 0.72, 0.60, 0.45],   // desce e sobe
  4: [0.15, 0.22, 0.32, 0.45, 0.58, 0.70, 0.82, 0.90],   // desce
};

// À esquerda do gráfico fica uma margem para as legendas (Alto, Médio...)
const MARGEM_ESQUERDA = 100;

function escolherTom(cartao, tom) {
  document.querySelectorAll('.tone-target-card').forEach(function (c) {
    c.classList.remove('selected');
  });
  cartao.classList.add('selected');
  tomEscolhido = tom;
  limparGraficoTom();
}

function limparGraficoTom() {
  alturasGravadas = [];
  desenharGuia();
  const correcao = document.getElementById('tone-feedback');
  if (correcao) {
    correcao.innerHTML = '';
  }
}

// O tamanho interno do canvas tem de ser igual ao tamanho no ecrã; senão o desenho fica esticado.
// Em ecrãs de alta resolução (devicePixelRatio = 2) desenho com o dobro dos pontos, para ficar nítido.
function ajustarCanvas(canvas, altura) {
  const escala = window.devicePixelRatio || 1;
  const largura = canvas.clientWidth;
  canvas.width = Math.round(largura * escala);
  canvas.height = Math.round(altura * escala);
  canvas.larguraCss = largura;
  canvas.alturaCss = altura;
  const pincel = canvas.getContext('2d');
  pincel.setTransform(escala, 0, 0, escala, 0, 0);   // assim continuo a desenhar em píxeis normais
  return pincel;
}

// Converto um nível (0 = alto, 1 = muito baixo) na posição vertical dentro do gráfico.
// Os primeiros 30 px ficam livres para o título.
function posicaoVertical(nivel, altura) {
  const topo = 30;
  const fundo = altura - 10;
  return topo + nivel * (fundo - topo);
}

function prepararGraficos() {
  graficoTom = document.getElementById('tone-canvas');
  graficoOnda = document.getElementById('wave-canvas');
  if (!graficoTom || !graficoOnda) {
    return;
  }
  redesenharGraficos();
  // Quando o separador aparece ou a janela muda de tamanho, volto a desenhar
  vigiaTamanho = new ResizeObserver(redesenharGraficos);
  vigiaTamanho.observe(graficoTom);
}

function redesenharGraficos() {
  // Com o separador escondido a largura é 0: espero que ele apareça
  if (!graficoTom || graficoTom.clientWidth === 0) {
    return;
  }
  pincelTom = ajustarCanvas(graficoTom, 140);
  pincelOnda = ajustarCanvas(graficoOnda, 80);
  if (aGravarTom) {
    return;   // a gravar, o próximo quadro já desenha tudo
  }
  if (alturasGravadas.length > 1) {
    desenharVoz();
  } else {
    desenharGuia();
  }
  desenharOndaParada();
}

// O guia: cinco linhas tracejadas (os níveis da voz) e a forma do tom escolhido, a dourado
function desenharGuia() {
  if (!pincelTom) {
    return;
  }
  const largura = graficoTom.larguraCss;
  const altura = graficoTom.alturaCss;
  pincelTom.clearRect(0, 0, largura, altura);

  const niveis = [
    { valor: 0, nome: 'Alto (5)' },
    { valor: 0.25, nome: 'Médio-alto (4)' },
    { valor: 0.5, nome: 'Médio (3)' },
    { valor: 0.75, nome: 'Baixo (2)' },
    { valor: 1, nome: 'Muito baixo (1)' },
  ];
  pincelTom.font = '11px Lexend, sans-serif';
  niveis.forEach(function (nivel) {
    const y = posicaoVertical(nivel.valor, altura);
    pincelTom.strokeStyle = 'rgba(100, 100, 100, 0.2)';
    pincelTom.lineWidth = 1;
    pincelTom.setLineDash([4, 4]);   // linha tracejada: 4 px de traço, 4 px de espaço
    pincelTom.beginPath();
    pincelTom.moveTo(MARGEM_ESQUERDA, y);
    pincelTom.lineTo(largura - 10, y);
    pincelTom.stroke();
    pincelTom.setLineDash([]);
    pincelTom.fillStyle = 'rgba(86, 101, 115, 0.7)';
    pincelTom.fillText(nivel.nome, 4, y + 4);
  });

  // A forma ideal do tom, a dourado e tracejada
  const forma = FORMAS_DOS_TONS[tomEscolhido];
  const passo = (largura - MARGEM_ESQUERDA - 20) / (forma.length - 1);
  pincelTom.strokeStyle = '#E8A317';
  pincelTom.lineWidth = 2.5;
  pincelTom.setLineDash([6, 4]);
  pincelTom.beginPath();
  forma.forEach(function (nivel, i) {
    const x = MARGEM_ESQUERDA + 10 + i * passo;
    const y = posicaoVertical(nivel, altura);
    if (i === 0) {
      pincelTom.moveTo(x, y);
    } else {
      pincelTom.lineTo(x, y);
    }
  });
  pincelTom.stroke();
  pincelTom.setLineDash([]);

  // O título do tom e a legenda "Alvo"
  pincelTom.font = 'bold 12px Lexend, sans-serif';
  pincelTom.fillStyle = CORES_DOS_TONS[tomEscolhido];
  pincelTom.fillText(NOMES_DOS_TONS[tomEscolhido], MARGEM_ESQUERDA + 10, 16);
  pincelTom.fillStyle = '#E8A317';
  pincelTom.fillText('── Alvo', largura - 80, 16);
}

// A linha vermelha da voz do aluno, por cima do guia
function desenharVoz() {
  const comVoz = alturasGravadas.filter(function (hz) { return hz > 0; });
  if (!pincelTom || comVoz.length < 2) {
    return;
  }
  desenharGuia();
  const largura = graficoTom.larguraCss;
  const altura = graficoTom.alturaCss;

  // A voz mais grave fica em baixo e a mais aguda em cima (com 5% de folga)
  const minimo = Math.min(...comVoz) * 0.95;
  const maximo = Math.max(...comVoz) * 1.05;
  const intervalo = maximo - minimo || 1;
  const passo = (largura - MARGEM_ESQUERDA - 20) / Math.max(alturasGravadas.length - 1, 1);

  pincelTom.strokeStyle = '#C8361F';
  pincelTom.lineWidth = 3;
  pincelTom.lineJoin = 'round';
  pincelTom.lineCap = 'round';
  pincelTom.beginPath();
  let comecou = false;
  alturasGravadas.forEach(function (hz, i) {
    if (hz <= 0) {
      return;   // salto os momentos de silêncio
    }
    const x = MARGEM_ESQUERDA + 10 + i * passo;
    const nivel = 1 - (hz - minimo) / intervalo;
    const y = posicaoVertical(nivel, altura);
    if (!comecou) {
      pincelTom.moveTo(x, y);
      comecou = true;
    } else {
      pincelTom.lineTo(x, y);
    }
  });
  pincelTom.stroke();
}

// A onda do som: cada número vai de 0 a 255 (128 é o silêncio, a meio)
function desenharOnda(numeros) {
  if (!pincelOnda) {
    return;
  }
  const largura = graficoOnda.larguraCss;
  const altura = graficoOnda.alturaCss;
  // A cor de fundo vem da variável --fundo-escuro do CSS (muda no modo escuro)
  pincelOnda.fillStyle = getComputedStyle(document.body).getPropertyValue('--fundo-escuro').trim() || '#18212B';
  pincelOnda.fillRect(0, 0, largura, altura);
  pincelOnda.strokeStyle = '#C8361F';
  pincelOnda.lineWidth = 1.5;
  pincelOnda.beginPath();
  const passo = largura / (numeros.length - 1);
  numeros.forEach(function (numero, i) {
    const x = i * passo;
    const y = (numero / 255) * altura;
    if (i === 0) {
      pincelOnda.moveTo(x, y);
    } else {
      pincelOnda.lineTo(x, y);
    }
  });
  pincelOnda.stroke();
}

// Antes de gravar, a caixa da onda mostra uma linha parada e uma dica
function desenharOndaParada() {
  if (!pincelOnda) {
    return;
  }
  desenharOnda(new Array(64).fill(128));
  pincelOnda.fillStyle = 'rgba(255, 255, 255, 0.6)';
  pincelOnda.font = '12px Lexend, sans-serif';
  pincelOnda.textAlign = 'center';
  pincelOnda.fillText('A onda da tua voz aparece aqui quando gravares', graficoOnda.larguraCss / 2, 26);
  pincelOnda.textAlign = 'start';
}

function mostrarBotaoGravarTom(aGravar) {
  const botao = document.getElementById('tone-mic-btn');
  if (aGravar) {
    botao.className = 'mic-btn recording';
    botao.innerHTML = '<i class="i i-parar" aria-hidden="true"></i> Parar a gravação';
  } else {
    botao.className = 'mic-btn idle';
    botao.innerHTML = '<i class="i i-gravar" aria-hidden="true"></i> Começar a gravar';
  }
}

// O botão grava ou para (se já estiver a gravar). A gravação para sozinha ao fim de 3 segundos.
async function gravarTom() {
  if (!graficoTom) {
    prepararGraficos();
  }
  if (aGravarTom) {
    pararGravacaoTom();
    return;
  }

  const stream = await pedirMicrofone();
  if (!stream) {
    return;
  }
  ligarAnalisador(stream);
  aGravarTom = true;
  alturasGravadas = [];
  mostrarBotaoGravarTom(true);
  limparGraficoTom();

  const amostras = new Float32Array(analisador.fftSize);
  const onda = new Uint8Array(analisador.frequencyBinCount);
  let quadro = 0;

  // requestAnimationFrame chama a função outra vez no próximo quadro do ecrã (cerca de 60 vezes por segundo)
  function aCadaQuadro() {
    if (!aGravarTom) {
      return;
    }
    animacao = requestAnimationFrame(aCadaQuadro);
    quadro++;
    // A altura da voz dá mais trabalho a calcular: faço-o só de 3 em 3 quadros
    if (quadro % 3 === 0) {
      analisador.getFloatTimeDomainData(amostras);
      alturasGravadas.push(alturaDaVoz(amostras, contextoDeAudio.sampleRate));
      desenharVoz();
    }
    analisador.getByteTimeDomainData(onda);
    desenharOnda(onda);
  }
  aCadaQuadro();

  setTimeout(function () {
    if (aGravarTom) {
      pararGravacaoTom();
    }
  }, 3000);
}

function pararGravacaoTom() {
  aGravarTom = false;
  cancelAnimationFrame(animacao);
  mostrarBotaoGravarTom(false);
  avaliarTom();
}

// A média de uma lista de números
function media(numeros) {
  let soma = 0;
  numeros.forEach(function (n) { soma += n; });
  return soma / numeros.length;
}

// ═══ AVALIAR O TOM ═══
// Divido a gravação em três partes (início, meio e fim) e comparo as médias:
//   1.º tom: a voz quase não muda;
//   2.º tom: o fim é mais agudo do que o início;
//   3.º tom: o meio é mais grave do que as pontas;
//   4.º tom: o fim é mais grave do que o início.
function avaliarTom() {
  const comVoz = alturasGravadas.filter(function (hz) { return hz > 0; });
  const correcao = document.getElementById('tone-feedback');
  if (comVoz.length < 4) {
    correcao.innerHTML = '<div class="feedback-badge fb-try">Foi muito curto. Tenta outra vez e fala claramente durante 1 ou 2 segundos.</div>';
    return;
  }

  const terco = Math.floor(comVoz.length / 3);
  const inicio = media(comVoz.slice(0, terco));
  const meio = media(comVoz.slice(terco, 2 * terco));
  const fim = media(comVoz.slice(2 * terco));
  const mediaTotal = media(comVoz);
  const variacao = Math.max(...comVoz) - Math.min(...comVoz);

  // Cada tom: quanto mediu, o objetivo e a mensagem quando está bem
  let medida, objetivo, pontuacao, mensagemBoa, mensagemFraca;
  if (tomEscolhido === 1) {
    medida = variacao;
    objetivo = mediaTotal * 0.18;
    pontuacao = Math.round((1 - Math.min(variacao / mediaTotal, 1)) * 100);
    mensagemBoa = '✓ Plano e estável. Ótimo 1.º tom!';
    mensagemFraca = 'Tenta manter a voz completamente plana. Variação: ' + Math.round(medida) + ' Hz (o objetivo é menos de ' + Math.round(objetivo) + ' Hz)';
  } else if (tomEscolhido === 2) {
    medida = fim - inicio;
    objetivo = 30;
    pontuacao = Math.round(Math.max(0, Math.min(medida / 60, 1)) * 100);
    mensagemBoa = '✓ Boa subida. Ótimo 2.º tom!';
    mensagemFraca = 'A tua voz precisa de subir mais. Subida: ' + Math.round(medida) + ' Hz (o objetivo é mais de 30 Hz)';
  } else if (tomEscolhido === 3) {
    medida = Math.min(inicio, fim) - meio;
    objetivo = 20;
    pontuacao = Math.round(Math.max(0, Math.min(medida / 50, 1)) * 100);
    mensagemBoa = '✓ Boa descida e subida. Bom 3.º tom!';
    mensagemFraca = 'A voz deve descer a meio e depois subir. Descida: ' + Math.round(medida) + ' Hz (o objetivo é mais de 20 Hz)';
  } else {
    medida = inicio - fim;
    objetivo = 30;
    pontuacao = Math.round(Math.max(0, Math.min(medida / 60, 1)) * 100);
    mensagemBoa = '✓ Descida firme. Excelente 4.º tom!';
    mensagemFraca = 'A tua voz precisa de descer com mais força. Descida: ' + Math.round(medida) + ' Hz (o objetivo é mais de 30 Hz)';
  }

  // No 1.º tom a medida tem de ser PEQUENA; nos outros tem de ser GRANDE
  const bom = tomEscolhido === 1 ? medida < objetivo : medida > objetivo;
  let classe = 'fb-try';
  if (bom) {
    classe = 'fb-great';
  } else if (pontuacao > 40) {
    classe = 'fb-good';
  }

  correcao.innerHTML = `
    <div class="feedback-badge ${classe}">${bom ? mensagemBoa : mensagemFraca}</div>
    <div class="tom-detalhe">Altura da voz: ${Math.round(Math.min(...comVoz))} a ${Math.round(Math.max(...comVoz))} Hz · Pontuação: ${pontuacao}/100</div>`;

  guardarTentativa({ type: 'tone', tone: tomEscolhido, score: pontuacao, correct: pontuacao >= 60 });
}

// O botão "Ouvir o tom": uma palavra "ma" em cada tom
function ouvirTomAlvo() {
  const palavras = { 1: '妈', 2: '麻', 3: '马', 4: '骂' };
  falar(palavras[tomEscolhido], 0.7);
}

// ═══ RECONHECIMENTO DE VOZ ═══
// O SpeechRecognition só existe no Chrome e no Edge (no Chrome com o nome webkitSpeechRecognition)
function criarReconhecimento(alternativas) {
  const Reconhecimento = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Reconhecimento) {
    return null;
  }
  const reconhecimento = new Reconhecimento();
  reconhecimento.lang = 'zh-CN';
  reconhecimento.maxAlternatives = alternativas;   // quantos palpites o browser me dá
  return reconhecimento;
}

// Quão parecidos são dois textos, de 0 (nada) a 1 (iguais):
// conto quantos caracteres do primeiro aparecem no segundo
function parecenca(a, b) {
  if (!a || !b) {
    return 0;
  }
  const textoA = a.toLowerCase().replace(/\s/g, '');
  const textoB = b.toLowerCase().replace(/\s/g, '');
  if (textoA === textoB) {
    return 1;
  }
  let iguais = 0;
  for (const letra of textoA) {
    if (textoB.includes(letra)) {
      iguais++;
    }
  }
  return iguais / Math.max(textoA.length, textoB.length);
}

// ═══ 2. REPETIR PALAVRAS ═══
const PALAVRAS_PARA_REPETIR = {
  greetings: [
    { zh: '你好', py: 'nǐ hǎo', pt: 'Olá' },
    { zh: '谢谢', py: 'xièxie', pt: 'Obrigado' },
    { zh: '再见', py: 'zàijiàn', pt: 'Adeus' },
    { zh: '早上好', py: 'zǎoshang hǎo', pt: 'Bom dia' },
    { zh: '不客气', py: 'bú kèqi', pt: 'De nada' },
  ],
  numbers: [
    { zh: '一二三', py: 'yī èr sān', pt: 'Um, dois, três' },
    { zh: '四五六', py: 'sì wǔ liù', pt: 'Quatro, cinco, seis' },
    { zh: '七八九十', py: 'qī bā jiǔ shí', pt: 'Sete, oito, nove, dez' },
    { zh: '一百', py: 'yī bǎi', pt: 'Cem' },
    { zh: '一千', py: 'yī qiān', pt: 'Mil' },
  ],
  food: [
    { zh: '米饭', py: 'mǐfàn', pt: 'Arroz' },
    { zh: '好吃', py: 'hǎo chī', pt: 'Delicioso' },
    { zh: '我要这个', py: 'wǒ yào zhège', pt: 'Quero este' },
    { zh: '太辣了', py: 'tài là le', pt: 'Muito picante' },
    { zh: '买单', py: 'mǎidān', pt: 'A conta, por favor' },
  ],
  work: [
    { zh: '你好', py: 'nǐ hǎo', pt: 'Olá' },
    { zh: '我同意', py: 'wǒ tóngyì', pt: 'Concordo' },
    { zh: '没问题', py: 'méi wèntí', pt: 'Não há problema' },
    { zh: '收到谢谢', py: 'shōudào xièxie', pt: 'Recebido, obrigado' },
    { zh: '请问', py: 'qǐngwèn', pt: 'Com licença, posso perguntar' },
  ],
  tones: [
    { zh: '买卖', py: 'mǎi mài', pt: 'Comprar / vender (3.º e 4.º tom)' },
    { zh: '妈麻马骂', py: 'mā má mǎ mà', pt: 'Os quatro tons em "ma"' },
    { zh: '书熟鼠树', py: 'shū shú shǔ shù', pt: 'Os quatro tons em "shu"' },
    { zh: '飞', py: 'fēi', pt: 'Voar (1.º tom)' },
    { zh: '学习', py: 'xuéxí', pt: 'Estudar (2.º e 2.º tom)' },
  ],
};

let palavraParaRepetir = null;
let aOuvirRepeticao = false;
let reconhecimentoRepetir = null;

function palavrasDaCategoria() {
  const lista = document.getElementById('repeat-category');
  const categoria = lista ? lista.value : 'greetings';
  return PALAVRAS_PARA_REPETIR[categoria] || [];
}

function mostrarPalavrasParaRepetir() {
  const lista = document.getElementById('repeat-word-list');
  if (!lista) {
    return;
  }
  let html = '';
  palavrasDaCategoria().forEach(function (palavra, numero) {
    html += `
      <div class="repeat-word">
        <div class="rw-zh">${palavra.zh}</div>
        <div class="rw-py">${palavra.py}</div>
        <div class="rw-pt">${palavra.pt}</div>
        <button class="speak-btn" onclick="falar('${palavra.zh}', 0.7)" aria-label="Ouvir"><i class="i i-ouvir" aria-hidden="true"></i></button>
        <button class="rw-praticar" onclick="escolherPalavraParaRepetir(${numero})">Praticar</button>
        <div class="rw-result" id="rwr-${numero}"></div>
      </div>`;
  });
  lista.innerHTML = html;
  document.getElementById('repeat-active-wrap').style.display = 'none';
}

function escolherPalavraParaRepetir(numero) {
  palavraParaRepetir = palavrasDaCategoria()[numero];
  document.getElementById('repeat-target-zh').textContent = palavraParaRepetir.zh;
  document.getElementById('repeat-target-py').textContent = palavraParaRepetir.py;
  document.getElementById('repeat-target-en').textContent = palavraParaRepetir.pt;
  document.getElementById('repeat-result').textContent = '';
  const caixa = document.getElementById('repeat-active-wrap');
  caixa.style.display = 'block';
  caixa.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  falar(palavraParaRepetir.zh, 0.7);
}

function ouvirPalavraAlvo() {
  if (palavraParaRepetir) {
    falar(palavraParaRepetir.zh, 0.7);
  }
}

function mostrarBotaoRepetir(aOuvir) {
  const botao = document.getElementById('repeat-mic-btn');
  if (aOuvir) {
    botao.className = 'mic-btn recording';
    botao.innerHTML = '<i class="i i-parar" aria-hidden="true"></i> Parar';
  } else {
    botao.className = 'mic-btn idle';
    botao.innerHTML = '<i class="i i-gravar" aria-hidden="true"></i> Dizer';
  }
}

function gravarRepeticao() {
  if (aOuvirRepeticao) {
    aOuvirRepeticao = false;
    mostrarBotaoRepetir(false);
    reconhecimentoRepetir.stop();
    return;
  }
  if (!palavraParaRepetir) {
    return;
  }
  const resultado = document.getElementById('repeat-result');
  reconhecimentoRepetir = criarReconhecimento(3);
  if (!reconhecimentoRepetir) {
    resultado.innerHTML = '<span class="erro-voz">Este browser não reconhece a voz. Usa o Chrome ou o Edge.</span>';
    return;
  }

  aOuvirRepeticao = true;
  mostrarBotaoRepetir(true);
  resultado.innerHTML = '<i class="i i-gravar" aria-hidden="true"></i> A ouvir…';

  // Quando o browser percebe o que foi dito
  reconhecimentoRepetir.onresult = function (evento) {
    // Os palpites do browser (até 3), do mais provável para o menos provável
    const palpites = Array.from(evento.results[0]).map(function (p) { return p.transcript.trim(); });
    const ouvido = palpites[0];
    const alvo = palavraParaRepetir.zh;
    const acertou = palpites.some(function (p) {
      return p.includes(alvo) || alvo.includes(p) || parecenca(p, alvo) > 0.6;
    });

    if (acertou) {
      resultado.innerHTML = '<span class="recog-match">✓ 太好了！(tài hǎo le!) Reconhecido: "' + escapar(ouvido) + '"</span>';
    } else {
      resultado.innerHTML = '<span class="recog-miss">✗ Ouvi: "' + escapar(ouvido) + '". Pretendido: "' + escapar(alvo) + '". Tenta outra vez!</span>';
    }
    guardarTentativa({ type: 'repeat', word: alvo, heard: ouvido, correct: acertou });

    // Ponho ✓ ou ✗ na linha da palavra, na lista
    palavrasDaCategoria().forEach(function (palavra, numero) {
      const marca = document.getElementById('rwr-' + numero);
      if (palavra.zh === alvo && marca) {
        marca.textContent = acertou ? '✓' : '✗';
        marca.className = 'rw-result ' + (acertou ? 'ok' : 'bad');
      }
    });
  };
  reconhecimentoRepetir.onerror = function (evento) {
    resultado.innerHTML = '<span class="erro-voz">Erro: ' + escapar(evento.error) + '. Confirma se o microfone está autorizado.</span>';
  };
  // onend acontece sempre no fim, com ou sem resultado
  reconhecimentoRepetir.onend = function () {
    aOuvirRepeticao = false;
    mostrarBotaoRepetir(false);
  };
  reconhecimentoRepetir.start();
}

// ═══ 3. RECONHECIMENTO DE VOZ (frases à escolha) ═══
let fraseParaDizer = '';
let aOuvirFrase = false;
let reconhecimentoFrase = null;

// O aluno carrega numa das frases sugeridas
function escolherFraseParaDizer(elemento) {
  fraseParaDizer = elemento.textContent;
  document.getElementById('recog-target-display').innerHTML =
    '<span class="recog-diz">Diz: </span><span class="recog-alvo">' + escapar(fraseParaDizer) + '</span>';
}

function mostrarBotaoFrase(aOuvir) {
  const botao = document.getElementById('recog-mic-btn');
  if (aOuvir) {
    botao.className = 'mic-btn recording';
    botao.innerHTML = '<i class="i i-parar" aria-hidden="true"></i> Parar';
  } else {
    botao.className = 'mic-btn idle';
    botao.innerHTML = '<i class="i i-gravar" aria-hidden="true"></i> Gravar';
  }
}

function gravarFalaLivre() {
  if (aOuvirFrase) {
    aOuvirFrase = false;
    mostrarBotaoFrase(false);
    reconhecimentoFrase.stop();
    return;
  }
  const resultado = document.getElementById('recog-result');
  reconhecimentoFrase = criarReconhecimento(5);
  if (!reconhecimentoFrase) {
    resultado.innerHTML = '<p class="erro-voz">Este browser não reconhece a voz. Usa o Chrome ou o Edge.</p>';
    return;
  }
  // interimResults: o browser vai mostrando o texto enquanto o aluno ainda está a falar
  reconhecimentoFrase.interimResults = true;

  aOuvirFrase = true;
  mostrarBotaoFrase(true);
  resultado.innerHTML = '<p class="recog-espera"><i class="i i-gravar" aria-hidden="true"></i> A ouvir… Fala devagar e com clareza, em mandarim.</p>';
  document.getElementById('recog-feedback').innerHTML = '';

  reconhecimentoFrase.onresult = function (evento) {
    // Junto o texto: o "final" já está decidido; o "provisório" ainda pode mudar
    let final = '';
    let provisorio = '';
    for (const parte of evento.results) {
      if (parte.isFinal) {
        final += parte[0].transcript;
      } else {
        provisorio += parte[0].transcript;
      }
    }
    const terminou = evento.results[evento.results.length - 1].isFinal;
    resultado.innerHTML = `
      <div class="recog-estado">${terminou ? '✓ Transcrição final' : 'Transcrição provisória'}:</div>
      <div class="recog-zh">${escapar(final || provisorio)}</div>`;

    if (terminou) {
      aOuvirFrase = false;
      mostrarBotaoFrase(false);
      if (fraseParaDizer) {
        compararFrase(fraseParaDizer, final);
      }
    }
  };
  reconhecimentoFrase.onerror = function (evento) {
    let mensagem = 'Erro: ' + escapar(evento.error);
    if (evento.error === 'not-allowed') {
      mensagem = 'O acesso ao microfone foi recusado.';
    }
    resultado.innerHTML = '<p class="erro-voz">' + mensagem + '</p>';
  };
  reconhecimentoFrase.onend = function () {
    aOuvirFrase = false;
    mostrarBotaoFrase(false);
  };
  reconhecimentoFrase.start();
}

// Comparo o que o browser ouviu com a frase escolhida: acima de 0,7 de parecença conto como certo
function compararFrase(alvo, ouvido) {
  const acertou = ouvido === alvo || parecenca(ouvido, alvo) > 0.7;
  let texto;
  if (acertou) {
    texto = '✓ Muito bem! Disseste a frase corretamente.';
  } else {
    texto = 'Querias dizer <span class="recog-zh">' + escapar(alvo) + '</span>, mas ouvi <span class="recog-zh">' + escapar(ouvido)
      + '</span>. Ouve a frase outra vez com o <i class="i i-ouvir" aria-hidden="true"></i> e repete devagar, com atenção aos tons.';
  }
  document.getElementById('recog-feedback').innerHTML =
    '<div class="recog-caixa ' + (acertou ? 'recog-caixa--certo' : 'recog-caixa--tenta') + '">' + texto + '</div>';
  guardarTentativa({ type: 'recog', target: alvo, heard: ouvido, correct: acertou });
}

// ═══ 4. OS MEUS RESULTADOS ═══
// Guardo as tentativas no browser: total, certas, melhor sequência e as últimas 50
const RESULTADOS_VAZIOS = { attempts: 0, correct: 0, streak: 0, bestStreak: 0, history: [] };
let resultados = lerGuardado('pronunStats', RESULTADOS_VAZIOS);

function guardarTentativa(tentativa) {
  resultados.attempts++;
  if (tentativa.correct) {
    resultados.correct++;
    resultados.streak++;
  } else {
    resultados.streak = 0;
  }
  resultados.bestStreak = Math.max(resultados.bestStreak, resultados.streak);

  tentativa.ts = Date.now();                 // a hora da tentativa
  resultados.history.unshift(tentativa);     // unshift põe no início da lista
  resultados.history = resultados.history.slice(0, 50);
  guardar('pronunStats', resultados);
  mostrarResultados();
}

function mostrarResultados() {
  escreverNumero('ps-attempts', resultados.attempts);
  escreverNumero('ps-correct', resultados.correct);
  escreverNumero('ps-streak', resultados.bestStreak);
  let percentagem = 0;
  if (resultados.attempts > 0) {
    percentagem = Math.round((resultados.correct / resultados.attempts) * 100);
  }
  escreverNumero('ps-pct', percentagem + '%');

  const historico = document.getElementById('ps-history');
  if (!historico) {
    return;
  }
  if (resultados.history.length === 0) {
    historico.innerHTML = '<p class="ps-vazio">Ainda não há tentativas.</p>';
    return;
  }
  let html = '';
  resultados.history.slice(0, 15).forEach(function (t) {
    const hora = new Date(t.ts).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    let nome;
    if (t.type === 'tone') {
      nome = 'Tom ' + t.tone;
    } else if (t.type === 'repeat') {
      nome = '"' + escapar(t.word) + '"';
    } else {
      nome = '"' + escapar(t.target) + '"';
    }
    html += `
      <div class="ps-linha">
        <span class="ps-marca ${t.correct ? 'ps-marca--certo' : 'ps-marca--errado'}">${t.correct ? '✓' : '✗'}</span>
        <span class="ps-nome">${nome}</span>
        <span class="ps-hora">${hora}</span>
      </div>`;
  });
  historico.innerHTML = html;
}

function apagarHistoricoPronuncia() {
  if (confirm('Apagar todo o histórico de pronúncia?')) {
    resultados = { attempts: 0, correct: 0, streak: 0, bestStreak: 0, history: [] };
    guardar('pronunStats', resultados);
    mostrarResultados();
  }
}

// ═══ LIGAR E DESLIGAR ═══
aoAbrirPagina(function () {
  if (document.getElementById('tone-canvas')) {
    prepararGraficos();
    mostrarPalavrasParaRepetir();
    mostrarResultados();
  }
});

// Ao sair da página: desligo o microfone, o reconhecimento de voz e os desenhos
aoSairDaPagina(function () {
  aGravarTom = false;
  cancelAnimationFrame(animacao);
  if (reconhecimentoFrase) {
    reconhecimentoFrase.abort();
  }
  if (reconhecimentoRepetir) {
    reconhecimentoRepetir.abort();
  }
  if (microfone) {
    microfone.getTracks().forEach(function (pista) { pista.stop(); });
    microfone = null;
  }
  if (contextoDeAudio) {
    contextoDeAudio.close();
    contextoDeAudio = null;
  }
  if (vigiaTamanho) {
    vigiaTamanho.disconnect();
  }
});
