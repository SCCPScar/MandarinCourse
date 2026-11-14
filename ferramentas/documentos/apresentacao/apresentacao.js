// Gera a apresentação do Chá (PowerPoint), com as falas do guião nas notas do orador.
// Regras que sigo para a apresentação abrir bem em qualquer PowerPoint:
//  - só uso a letra Calibri, que existe em todos os computadores com Office;
//  - o texto chinês e o esquema da base de dados entram como imagens (não dependem das letras instaladas);
//  - cada caixa de texto tem espaço a mais, e nada fica a menos de 0,6 polegadas da borda;
//  - depois de gerar, o verificar.py mede cada texto e procura sobreposições.
const pptxgen = require('pptxgenjs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const lu = require('react-icons/lu');
const NOTAS = require('./notas.js');
// Aqui eu aplico as cores do tema ao ficheiro final, se a ferramenta indicada em APLICAR_TEMA existir
const applyTheme = process.env.APLICAR_TEMA ? require(process.env.APLICAR_TEMA).applyTheme : null;

// As cores da marca Chá (as mesmas do site, css/base.css)
const COR = { jade: '0E7C66', jadeEscuro: '0A5C4C', selo: 'C8361F', ouro: 'E8A317', tinta: '18212B', cinza: '46535D', papel: 'F4F7F6', branco: 'FFFFFF', jadeClaro: 'D8EEE8', rosa: 'FBE3DE', azul: '2F6FD0' };
const THEME = {
  name: 'Chá',
  headFontFace: 'Calibri',
  bodyFontFace: 'Calibri',
  colors: { dk1: COR.tinta, lt1: COR.branco, dk2: COR.jade, lt2: COR.papel, accent1: COR.jade, accent2: COR.selo, accent3: COR.ouro, accent4: COR.azul, accent5: 'A8325E', accent6: COR.cinza, hlink: COR.jade, folHlink: COR.jadeEscuro },
};

const W = 13.333; // largura do diapositivo (polegadas)
const M = 0.7;    // margem
const LARG = W - 2 * M; // largura útil
const TOPO = 1.75;      // onde começa o conteúdo, por baixo do título

// Um ícone da biblioteca Lucide, desenhado em PNG
async function icone(Componente, cor) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Componente, { color: '#' + cor, size: 256, strokeWidth: 2 }));
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + png.toString('base64');
}

// Texto chinês em imagem: assim aparece igual em qualquer computador
async function chinesEmImagem(texto, tamanho, cor) {
  const largura = Math.ceil(texto.length * tamanho * 1.05);
  const altura = Math.ceil(tamanho * 1.35);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}">
    <text x="50%" y="${tamanho * 1.02}" text-anchor="middle" font-family="WenQuanYi Zen Hei" font-size="${tamanho}" fill="#${cor}">${texto}</text></svg>`;
  const png = await sharp(Buffer.from(svg), { density: 216 }).png().toBuffer();
  return { data: 'image/png;base64,' + png.toString('base64'), proporcao: largura / altura };
}

// O esquema da base de dados em imagem (caixas e setas)
async function esquemaBaseDeDados() {
  const L = 190, A = 64, colX = [20, 265, 510, 755], linY = [20, 150, 280];
  const caixa = (nome, c, l, cor) => `<rect x="${colX[c]}" y="${linY[l]}" width="${L}" height="${A}" rx="12" fill="#${cor}"/>
    <text x="${colX[c] + L / 2}" y="${linY[l] + A / 2 + 9}" text-anchor="middle" font-family="Carlito" font-weight="700" font-size="26" fill="#FFFFFF">${nome}</text>`;
  const seta = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#46535D" stroke-width="3" marker-end="url(#p)"/>`;
  const meio = (c) => colX[c] + L / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="965" height="364">
    <defs><marker id="p" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#46535D"/></marker></defs>
    ${caixa('cidades', 0, 0, COR.jade)}${caixa('unidades', 1, 0, COR.jade)}${caixa('lições', 2, 0, COR.jade)}
    ${caixa('palavras', 3, 0, COR.cinza)}${caixa('frases', 3, 1, COR.cinza)}${caixa('cultura', 0, 1, COR.cinza)}
    ${caixa('utilizadores', 1, 2, COR.selo)}${caixa('progresso', 2, 2, COR.ouro)}
    ${seta(colX[0] + L, linY[0] + A / 2, colX[1] - 4, linY[0] + A / 2)}
    ${seta(colX[1] + L, linY[0] + A / 2, colX[2] - 4, linY[0] + A / 2)}
    ${seta(colX[2] + L, linY[0] + A / 2, colX[3] - 4, linY[0] + A / 2)}
    ${seta(colX[2] + L, linY[0] + A - 6, colX[3] - 4, linY[1] + 10)}
    ${seta(meio(0), linY[0] + A, meio(0), linY[1] - 4)}
    ${seta(meio(2), linY[0] + A, meio(2), linY[2] - 4)}
    ${seta(colX[1] + L, linY[2] + A / 2, colX[2] - 4, linY[2] + A / 2)}
  </svg>`;
  const png = await sharp(Buffer.from(svg), { density: 192 }).png().toBuffer();
  return 'image/png;base64,' + png.toString('base64');
}

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE'; // 13,33 x 7,5 polegadas
  pres.author = 'Scarllett Sabrina Pena';
  pres.title = 'Chá: aprender mandarim na hora do chá';
  pres.theme = { headFontFace: 'Calibri', bodyFontFace: 'Calibri' };
  const C = pres.SchemeColor;

  // ── Layouts ──
  pres.defineSlideMaster({ title: 'CAPA', background: { color: COR.jade }, objects: [] });
  pres.defineSlideMaster({
    title: 'CONTEUDO',
    background: { color: COR.branco },
    objects: [
      { image: { path: 'img/logo.png', x: W - M - 0.4, y: 6.8, w: 0.4, h: 0.4 } },
      { placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.45, w: LARG, h: 0.9, fontSize: 32, bold: true, color: C.text1, align: 'left', valign: 'middle', margin: 0 }, text: '' } },
    ],
    slideNumber: { x: M, y: 6.85, w: 0.8, h: 0.3, fontSize: 11, color: COR.cinza, margin: 0 },
  });
  pres.defineSlideMaster({
    title: 'SECCAO',
    background: { color: COR.tinta },
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: M, y: 2.5, w: LARG, h: 1.3, fontSize: 44, bold: true, color: C.background1, align: 'center', valign: 'middle', margin: 0 }, text: '' } },
    ],
  });
  pres.defineSlideMaster({
    title: 'CAPTURA',
    background: { color: COR.papel },
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.35, w: LARG, h: 0.6, fontSize: 24, bold: true, color: C.text1, align: 'left', valign: 'middle', margin: 0 }, text: '' } },
    ],
    slideNumber: { x: M, y: 6.85, w: 0.8, h: 0.3, fontSize: 11, color: COR.cinza, margin: 0 },
  });

  // ── Peças que repito ──
  function texto(slide, t, o) { slide.addText(t, { isTextBox: true, fontFace: 'Calibri', color: COR.tinta, margin: 0, valign: 'top', ...o }); }
  function cartao(slide, x, y, w, h, cor = COR.papel) {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: cor }, line: { color: cor } });
  }
  // Ícone dentro de um círculo de cor (o motivo visual repetido em toda a apresentação)
  async function circuloIcone(slide, Componente, x, y, d, fundo, corIcone = COR.branco) {
    slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fundo }, line: { color: fundo } });
    const m = d * 0.25;
    slide.addImage({ data: await icone(Componente, corIcone), x: x + m, y: y + m, w: d - 2 * m, h: d - 2 * m, altText: '' });
  }
  // Lista com marcas
  const lista = (itens) => itens.map((t, j) => ({ text: t, options: { bullet: { indent: 18 }, breakLine: j < itens.length - 1 } }));
  // Dois cartões lado a lado, cada um com ícone, título e lista (diapositivos 8, 11 e 12)
  async function doisCartoes(slide, blocos, tamanho = 18) {
    const w = (LARG - 0.4) / 2;
    for (let i = 0; i < 2; i++) {
      const [Icone, titulo, cor, itens] = blocos[i];
      const x = M + i * (w + 0.4);
      cartao(slide, x, TOPO, w, 4.75);
      await circuloIcone(slide, Icone, x + 0.4, TOPO + 0.35, 0.8, cor);
      texto(slide, titulo, { x: x + 1.4, y: TOPO + 0.35, w: w - 1.8, h: 0.8, fontSize: 24, bold: true, valign: 'middle' });
      texto(slide, lista(itens), { x: x + 0.4, y: TOPO + 1.45, w: w - 0.8, h: 3.1, fontSize: tamanho, paraSpaceAfter: 10 });
    }
  }

  // ═══ 1. CAPA ═══
  pres.addSection({ title: 'Apresentação' });
  let s = pres.addSlide({ masterName: 'CAPA', sectionTitle: 'Apresentação' });
  s.addImage({ path: 'img/logo.png', x: M, y: 0.8, w: 1.2, h: 1.2, altText: 'Logótipo do Chá: o caractere 茶 num carimbo vermelho' });
  texto(s, 'Chá', { x: M, y: 2.2, w: 5.8, h: 1.3, fontSize: 66, bold: true, color: COR.branco });
  texto(s, 'Aprender mandarim na hora do chá', { x: M, y: 3.6, w: 5.8, h: 0.6, fontSize: 24, color: COR.jadeClaro });
  texto(s, [
    { text: 'Scarllett Sabrina Pena', options: { bold: true, breakLine: true } },
    { text: 'Técnico/a Especialista em Tecnologias e Programação de Sistemas de Informação', options: { breakLine: true } },
    { text: 'Formador: Sérgio Santos · IEFP Leiria · novembro de 2026' },
  ], { x: M, y: 4.7, w: 5.8, h: 1.9, fontSize: 15, color: COR.branco, paraSpaceAfter: 6 });
  s.addImage({ path: 'img/inicio.png', x: 7.0, y: 1.9, w: 5.6, h: 3.15, altText: 'A página inicial do Chá' });
  s.addNotes(NOTAS.capa);

  // ═══ 2. O PROBLEMA ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('Porque é que tão poucos começam o mandarim', { placeholder: 'title' });
  const problemas = [
    [lu.LuClock, 'Pouco tempo', 'Quem trabalha ou estuda tem poucos minutos livres por dia.'],
    [lu.LuLanguages, 'Poucos cursos gratuitos', 'Os cursos completos são pagos, e quase todos em inglês ou português do Brasil.'],
    [lu.LuMountain, 'Parece difícil demais', 'Tons, caracteres e pinyin assustam quem começa do zero.'],
  ];
  const w3 = (LARG - 0.8) / 3;
  for (let i = 0; i < 3; i++) {
    const x = M + i * (w3 + 0.4);
    cartao(s, x, TOPO, w3, 4.6);
    await circuloIcone(s, problemas[i][0], x + 0.4, TOPO + 0.4, 1.0, i === 1 ? COR.selo : COR.jade);
    texto(s, problemas[i][1], { x: x + 0.4, y: TOPO + 1.7, w: w3 - 0.8, h: 0.9, fontSize: 22, bold: true });
    texto(s, problemas[i][2], { x: x + 0.4, y: TOPO + 2.7, w: w3 - 0.8, h: 1.6, fontSize: 17, color: COR.cinza });
  }
  s.addNotes(NOTAS.problema);

  // ═══ 3. A IDEIA E O NOME ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('Um pouco todos os dias, no tempo de um chá', { placeholder: 'title' });
  cartao(s, M, TOPO, 4.4, 4.6);
  s.addImage({ path: 'img/logo.png', x: M + 0.9, y: TOPO + 0.45, w: 2.6, h: 2.6, altText: 'O caractere 茶 (chá) no carimbo do logótipo' });
  texto(s, 'chá', { x: M + 0.3, y: TOPO + 3.35, w: 3.8, h: 0.8, fontSize: 28, italic: true, align: 'center', fontFace: 'Calibri' });
  texto(s, '15 minutos', { x: 5.7, y: TOPO, w: 6.9, h: 1.1, fontSize: 54, bold: true, color: COR.jade });
  texto(s, 'por dia: o tempo de beber uma chávena de chá', { x: 5.7, y: TOPO + 1.15, w: 6.9, h: 0.6, fontSize: 20, color: COR.cinza });
  texto(s, 'O nome liga as duas línguas', { x: 5.7, y: TOPO + 2.2, w: 6.9, h: 0.5, fontSize: 22, bold: true });
  texto(s, 'A palavra portuguesa «chá» vem do chinês, trazida de Macau no século XVI. Por isso dizemos «chá», como em Pequim, e os ingleses dizem «tea».', { x: 5.7, y: TOPO + 2.8, w: 6.9, h: 1.7, fontSize: 18, color: COR.cinza });
  s.addNotes(NOTAS.ideia);

  // ═══ 4. OBJETIVOS E PÚBLICO ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('Para quem é e o que queria conseguir', { placeholder: 'title' });
  cartao(s, M, TOPO, 4.0, 4.6, COR.jade);
  await circuloIcone(s, lu.LuUsers, M + 0.4, TOPO + 0.4, 1.0, COR.branco, COR.jade);
  texto(s, 'Público', { x: M + 0.4, y: TOPO + 1.7, w: 3.2, h: 0.6, fontSize: 24, bold: true, color: COR.branco });
  texto(s, 'Falantes de português de Portugal, a partir dos 13 anos, que querem começar o mandarim do zero.', { x: M + 0.4, y: TOPO + 2.4, w: 3.2, h: 1.9, fontSize: 17, color: COR.branco });
  const objetivos = [
    [lu.LuMap, 'Uma rota com objetivo', '6 cidades da China, pelos níveis do exame HSK'],
    [lu.LuVolume2, 'Som em todo o chinês', 'Botões «Ouvir» e «Devagar» em cada palavra'],
    [lu.LuDumbbell, 'Praticar sem conta', 'Quiz, cartões, jogo, traços e pronúncia'],
    [lu.LuUserCheck, 'Progresso guardado', 'Com conta, as lições concluídas ficam guardadas'],
  ];
  for (let i = 0; i < 4; i++) {
    const y = TOPO + 0.05 + i * 1.15;
    await circuloIcone(s, objetivos[i][0], 5.2, y, 0.8, COR.jadeClaro, COR.jade);
    texto(s, objetivos[i][1], { x: 6.25, y: y - 0.05, w: 6.35, h: 0.45, fontSize: 19, bold: true });
    texto(s, objetivos[i][2], { x: 6.25, y: y + 0.42, w: 6.35, h: 0.45, fontSize: 16, color: COR.cinza });
  }
  s.addNotes(NOTAS.publico);

  // ═══ 5. TECNOLOGIAS E ARQUITETURA ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('Três camadas, sem frameworks', { placeholder: 'title' });
  const camadas = [
    [lu.LuMonitor, 'Browser', 'HTML · CSS · JavaScript', 'Mostra as páginas, faz os exercícios e lê o chinês', COR.azul],
    [lu.LuServer, 'Apache + PHP', 'Servidor web', 'Monta as páginas com os dados e trata das contas', COR.jade],
    [lu.LuDatabase, 'MySQL / MariaDB', '9 tabelas', 'Guarda a rota, as lições, as contas e o progresso', COR.selo],
  ];
  const wc = 3.3, passo = (LARG - wc) / 2; // 3 cartões com espaço para as setas entre eles
  for (let i = 0; i < 3; i++) {
    const x = M + i * passo;
    cartao(s, x, TOPO, wc, 3.9);
    await circuloIcone(s, camadas[i][0], x + (wc - 1.0) / 2, TOPO + 0.35, 1.0, camadas[i][4]);
    texto(s, camadas[i][1], { x: x + 0.25, y: TOPO + 1.55, w: wc - 0.5, h: 0.55, fontSize: 22, bold: true, align: 'center' });
    texto(s, camadas[i][2], { x: x + 0.25, y: TOPO + 2.1, w: wc - 0.5, h: 0.45, fontSize: 15, bold: true, color: camadas[i][4], align: 'center' });
    texto(s, camadas[i][3], { x: x + 0.3, y: TOPO + 2.6, w: wc - 0.6, h: 1.1, fontSize: 15, color: COR.cinza, align: 'center' });
    if (i < 2) {
      // seta entre os cartões (uma forma do PowerPoint, não um símbolo de texto)
      const xs = x + wc + 0.12, ws = passo - wc - 0.24;
      s.addShape(pres.shapes.LEFT_RIGHT_ARROW, { x: xs, y: TOPO + 1.65, w: ws, h: 0.45, fill: { color: COR.cinza }, line: { color: COR.cinza } });
    }
  }
  texto(s, 'Tudo corre no XAMPP. Sem ficheiros de áudio: o som vem da voz do próprio browser.', { x: M, y: 6.0, w: LARG - 1.0, h: 0.5, fontSize: 17 });
  s.addNotes(NOTAS.tecnologias);

  // ═══ 6. PLANEAMENTO ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('Do protótipo ao site em PHP', { placeholder: 'title' });
  const fases = [
    ['Junho 2026', 'Protótipos', 'Uma página HTML para testar a ideia'],
    ['25 set.', 'Planeamento', 'Marca, rota de 12 meses e fotografias'],
    ['26 a 29 set.', 'PHP e MySQL', 'Base de dados, contas, cidades e lições'],
    ['Outubro', 'Testes e melhorias', 'Sugestões de quem testou, segurança e código mais simples'],
  ];
  const wf = LARG / 4; // cada fase ocupa uma coluna
  s.addShape(pres.shapes.LINE, { x: M + wf / 2, y: TOPO + 1.3, w: LARG - wf, h: 0, line: { color: COR.jadeClaro, width: 4 } });
  for (let i = 0; i < 4; i++) {
    const x = M + i * wf, cx = x + wf / 2;
    texto(s, fases[i][0], { x: x + 0.15, y: TOPO + 0.2, w: wf - 0.3, h: 0.5, fontSize: 17, color: COR.cinza, align: 'center' });
    s.addShape(pres.shapes.OVAL, { x: cx - 0.32, y: TOPO + 0.98, w: 0.64, h: 0.64, fill: { color: i === 3 ? COR.selo : COR.jade }, line: { color: COR.branco, width: 3 } });
    texto(s, String(i + 1), { x: cx - 0.32, y: TOPO + 0.98, w: 0.64, h: 0.64, fontSize: 20, bold: true, color: COR.branco, align: 'center', valign: 'middle' });
    texto(s, fases[i][1], { x: x + 0.15, y: TOPO + 1.95, w: wf - 0.3, h: 0.5, fontSize: 20, bold: true, align: 'center' });
    texto(s, fases[i][2], { x: x + 0.2, y: TOPO + 2.5, w: wf - 0.4, h: 1.5, fontSize: 16, color: COR.cinza, align: 'center' });
  }
  s.addNotes(NOTAS.planeamento);

  // ═══ 7. BASE DE DADOS ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('A base de dados', { placeholder: 'title' });
  // o esquema é uma imagem de 965 x 364 (proporção 2,65)
  s.addImage({ data: await esquemaBaseDeDados(), x: M, y: TOPO + 0.2, w: 7.4, h: 7.4 / 2.65, altText: 'Esquema das tabelas: cidades, unidades, lições, palavras, frases, cultura, utilizadores e progresso' });
  texto(s, 'A tabela progresso liga utilizadores e lições (N:N): um aluno conclui muitas lições, e cada lição é concluída por muitos alunos.', { x: M, y: TOPO + 3.35, w: 7.2, h: 1.0, fontSize: 16, color: COR.cinza });
  const numeros = [['9', 'tabelas'], ['72', 'lições'], ['523', 'palavras']];
  for (let i = 0; i < 3; i++) {
    const y = TOPO + i * 1.55;
    cartao(s, 8.6, y, 4.03, 1.3);
    texto(s, numeros[i][0], { x: 8.9, y, w: 1.7, h: 1.3, fontSize: 48, bold: true, color: COR.jade, valign: 'middle' });
    texto(s, numeros[i][1], { x: 10.7, y, w: 1.8, h: 1.3, fontSize: 22, valign: 'middle' });
  }
  s.addNotes(NOTAS.base);

  // ═══ 8. SEGURANÇA E RGPD ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('Segurança e proteção de dados', { placeholder: 'title' });
  await doisCartoes(s, [
    [lu.LuShieldCheck, 'Segurança', COR.jade, ['Palavras-passe só como hash bcrypt', 'Consultas preparadas (SQL injection)', 'Texto escapado (XSS)', 'Token em cada formulário (CSRF)', '5 falhas de login: 15 min de bloqueio']],
    [lu.LuScale, 'RGPD', COR.selo, ['Só nome, e-mail e palavra-passe', 'Consentimento com data guardada', 'Idade mínima: 13 anos (Lei 58/2019)', 'Eliminar a conta apaga tudo', 'Sem publicidade nem rastreio']],
  ], 17);
  s.addNotes(NOTAS.seguranca);

  // ═══ 9. DEMONSTRAÇÃO ═══
  s = pres.addSlide({ masterName: 'SECCAO', sectionTitle: 'Apresentação' });
  s.addText('Demonstração', { placeholder: 'title' });
  texto(s, 'cha-mandarim.infinityfreeapp.com', { x: M, y: 4.0, w: LARG, h: 0.6, fontSize: 24, color: COR.jadeClaro, align: 'center' });
  s.addNotes(NOTAS.demonstracao);

  // ═══ 10. TESTES COM UTILIZADORES ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('O que os testes com utilizadores mudaram', { placeholder: 'title' });
  const testes = [
    ['A letra parecia pequena', 'Letra maior em todo o site'],
    ['Queriam ouvir o chinês devagar', 'Botões «Ouvir» e «Devagar» em todo o chinês'],
    ['O quiz passava sozinho', 'Botão «Próxima pergunta»'],
    ['A gramática estava misturada', 'Página própria de Gramática'],
  ];
  const wt = (LARG - 0.8) / 2; // duas colunas com uma seta no meio
  texto(s, 'Pedido', { x: M + 0.3, y: TOPO, w: wt - 0.3, h: 0.45, fontSize: 17, bold: true, color: COR.selo });
  texto(s, 'O que mudei', { x: M + wt + 0.8 + 0.3, y: TOPO, w: wt - 0.3, h: 0.45, fontSize: 17, bold: true, color: COR.jade });
  for (let i = 0; i < 4; i++) {
    const y = TOPO + 0.6 + i * 1.05;
    cartao(s, M, y, wt, 0.85, COR.rosa);
    texto(s, testes[i][0], { x: M + 0.3, y, w: wt - 0.6, h: 0.85, fontSize: 18, valign: 'middle' });
    s.addShape(pres.shapes.RIGHT_ARROW, { x: M + wt + 0.2, y: y + 0.25, w: 0.4, h: 0.35, fill: { color: COR.cinza }, line: { color: COR.cinza } });
    cartao(s, M + wt + 0.8, y, wt, 0.85, COR.jadeClaro);
    texto(s, testes[i][1], { x: M + wt + 1.1, y, w: wt - 0.6, h: 0.85, fontSize: 18, valign: 'middle' });
  }
  s.addNotes(NOTAS.testes);

  // ═══ 11. DIFICULDADES E APRENDIZAGENS ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('Dificuldades e aprendizagens', { placeholder: 'title' });
  await doisCartoes(s, [
    [lu.LuAlertCircle, 'A maior dificuldade', COR.selo, ['Garantir que o site era bom de ouvir e fácil de ver', 'Testei as vozes no Chrome e no Edge e criei o botão «Devagar»', 'Letra maior e contraste verificado (WCAG 2.2 AA)']],
    [lu.LuLightbulb, 'O que aprendi', COR.ouro, ['PHP e back-end: pesquisar antes de programar', 'Ouvir quem testa e mudar, mesmo sem concordar à partida', 'Mais mandarim, ao rever as lições']],
  ]);
  s.addNotes(NOTAS.dificuldades);

  // ═══ 12. LIMITAÇÕES E TRABALHO FUTURO ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('Limitações e próximos passos', { placeholder: 'title' });
  await doisCartoes(s, [
    [lu.LuAlertTriangle, 'Limitações', COR.cinza, ['Esta versão tem as primeiras 72 lições', 'O progresso da prática fica só no browser', 'O som depende da voz chinesa do browser']],
    [lu.LuRocket, 'Trabalho futuro', COR.jade, ['Completar a rota até ao HSK 3, com revisão de nativos', 'Guardar todo o progresso na conta', 'Missões e certificado', 'Modo de cores para daltónicos', 'Tutor com IA, no servidor']],
  ], 17);
  s.addNotes(NOTAS.limitacoes);

  // ═══ 13. CONCLUSÃO ═══
  s = pres.addSlide({ masterName: 'CAPA', sectionTitle: 'Apresentação' });
  const frase = await chinesEmImagem('我们开始吧！', 120, COR.branco);
  const hf = 1.25; // altura da imagem com a frase em chinês
  s.addImage({ data: frase.data, x: (W - hf * frase.proporcao) / 2, y: 1.2, w: hf * frase.proporcao, h: hf, altText: 'Wǒmen kāishǐ ba: vamos começar!' });
  texto(s, 'wǒmen kāishǐ ba · Vamos começar!', { x: M, y: 2.75, w: LARG, h: 0.6, fontSize: 24, italic: true, color: COR.jadeClaro, align: 'center' });
  texto(s, 'Obrigada. Perguntas?', { x: M, y: 3.9, w: LARG, h: 0.9, fontSize: 40, bold: true, color: COR.branco, align: 'center' });
  s.addImage({ path: 'img/logo.png', x: W / 2 - 0.45, y: 5.3, w: 0.9, h: 0.9, altText: 'Logótipo do Chá' });
  s.addNotes(NOTAS.conclusao);

  // ═══ RESERVA: CAPTURAS DA DEMONSTRAÇÃO ═══
  pres.addSection({ title: 'Reserva' });
  s = pres.addSlide({ masterName: 'SECCAO', sectionTitle: 'Reserva' });
  s.addText('Reserva: capturas da demonstração', { placeholder: 'title' });
  s.addNotes(NOTAS.reserva);
  const capturas = [
    ['inicio', 'Página inicial'],
    ['rota', 'A rota: 6 cidades e o progresso da conta'],
    ['cidade', 'Pequim: descrição, nível HSK e unidades'],
    ['licao', 'Lição: explicação, palavras e frases com som'],
    ['exercicio', 'Exercício da lição, com a correção antes de passar'],
    ['cartoes', 'Praticar: cartões de memória com revisão espaçada'],
    ['tracos', 'Praticar: ordem dos traços, também sem internet'],
    ['escuro', 'Modo escuro'],
    ['conta', 'A minha conta: terminar sessão e eliminar a conta'],
  ];
  for (const [ficheiro, legenda] of capturas) {
    s = pres.addSlide({ masterName: 'CAPTURA', sectionTitle: 'Reserva' });
    s.addText(legenda, { placeholder: 'title' });
    // As capturas têm 1600 x 900 píxeis (16:9): 9,7 x 5,46 polegadas, centradas entre o título e o número
    s.addImage({ path: `img/${ficheiro}.png`, x: (W - 9.7) / 2, y: 1.15, w: 9.7, h: 5.46, altText: legenda, line: { color: 'D5DEDB', width: 1 } });
  }

  await pres.writeFile({ fileName: 'Apresentação - Chá.pptx' });
  if (applyTheme) await applyTheme('Apresentação - Chá.pptx', THEME);
  console.log('Apresentação - Chá.pptx');
})();
