// Gera a apresentação do Chá (PowerPoint), com as falas do guião nas notas do orador
const pptxgen = require('pptxgenjs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const lu = require('react-icons/lu');
// Aqui eu aplico as cores do tema ao ficheiro final, se a ferramenta indicada em APLICAR_TEMA existir
const applyTheme = process.env.APLICAR_TEMA ? require(process.env.APLICAR_TEMA).applyTheme : null;

// As cores da marca Chá (as mesmas do site, css/base.css)
const COR = { jade: '0E7C66', jadeEscuro: '0A5C4C', selo: 'C8361F', ouro: 'E8A317', tinta: '18212B', cinza: '46535D', papel: 'F4F7F6', papelMeio: 'EAF0EE', branco: 'FFFFFF', jadeClaro: 'D8EEE8', azul: '2F6FD0' };
const THEME = {
  name: 'Chá',
  headFontFace: 'Calibri',
  bodyFontFace: 'Calibri',
  colors: { dk1: COR.tinta, lt1: COR.branco, dk2: COR.jade, lt2: COR.papel, accent1: COR.jade, accent2: COR.selo, accent3: COR.ouro, accent4: COR.azul, accent5: 'A8325E', accent6: COR.cinza, hlink: COR.jade, folHlink: COR.jadeEscuro },
};

async function icone(Componente, cor) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Componente, { color: '#' + cor, size: 256, strokeWidth: 2 }));
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + png.toString('base64');
}

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE'; // 13,33 x 7,5 polegadas
  pres.author = 'Scarllett Sabrina Pena';
  pres.title = 'Chá: aprender mandarim na hora do chá';
  pres.theme = { headFontFace: 'Calibri', bodyFontFace: 'Calibri' };
  const C = pres.SchemeColor;
  const W = 13.333;
  const M = 0.6; // margem

  // ── Layouts ──
  pres.defineSlideMaster({
    title: 'CAPA',
    background: { color: COR.jade },
    objects: [],
  });
  pres.defineSlideMaster({
    title: 'CONTEUDO',
    background: { color: COR.branco },
    objects: [
      { image: { path: 'img/logo.png', x: W - M - 0.4, y: 7.5 - 0.62, w: 0.36, h: 0.36 } },
      { placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.4, w: W - 2 * M, h: 0.9, fontSize: 36, bold: true, color: C.text1, align: 'left', valign: 'top', margin: 0 }, text: '' } },
    ],
    slideNumber: { x: M, y: 7.5 - 0.6, w: 1, h: 0.3, fontSize: 11, color: COR.cinza },
  });
  pres.defineSlideMaster({
    title: 'SECCAO',
    background: { color: COR.tinta },
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: M, y: 2.6, w: W - 2 * M, h: 1.2, fontSize: 48, bold: true, color: C.background1, align: 'center', valign: 'middle' }, text: '' } },
    ],
  });
  pres.defineSlideMaster({
    title: 'CAPTURA',
    background: { color: COR.papel },
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.3, w: W - 2 * M, h: 0.6, fontSize: 24, bold: true, color: C.text1, align: 'left', margin: 0 }, text: '' } },
    ],
    slideNumber: { x: M, y: 7.5 - 0.45, w: 1, h: 0.3, fontSize: 11, color: COR.cinza },
  });

  // Ícone dentro de um círculo de cor (o motivo visual repetido em toda a apresentação)
  async function circuloIcone(slide, Componente, x, y, d, fundo, corIcone = COR.branco) {
    slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fundo }, line: { color: fundo }, objectName: 'circulo-icone' });
    const m = d * 0.24;
    slide.addImage({ data: await icone(Componente, corIcone), x: x + m, y: y + m, w: d - 2 * m, h: d - 2 * m, altText: '' });
  }
  function texto(slide, t, o) { slide.addText(t, { isTextBox: true, fontFace: 'Calibri', color: COR.tinta, margin: 0, ...o }); }
  function cartao(slide, x, y, w, h, cor = COR.papel) {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: cor }, line: { color: cor } });
  }

  // ═══ 1. CAPA ═══
  pres.addSection({ title: 'Apresentação' });
  let s = pres.addSlide({ masterName: 'CAPA', sectionTitle: 'Apresentação' });
  s.addImage({ path: 'img/logo.png', x: M + 0.1, y: 0.9, w: 1.3, h: 1.3, altText: 'Logótipo do Chá: o caractere 茶 num carimbo vermelho' });
  texto(s, 'Chá', { x: M + 0.1, y: 2.45, w: 6, h: 1.2, fontSize: 72, bold: true, color: COR.branco });
  texto(s, 'Aprender mandarim na hora do chá', { x: M + 0.1, y: 3.6, w: 6.2, h: 0.6, fontSize: 26, color: COR.jadeClaro });
  texto(s, [
    { text: 'Scarllett Sabrina Pena', options: { bold: true, breakLine: true } },
    { text: 'Técnico/a Especialista em Tecnologias e Programação de Sistemas de Informação', options: { breakLine: true } },
    { text: 'Formador: Sérgio Santos · IEFP Leiria · novembro de 2026' },
  ], { x: M + 0.1, y: 4.9, w: 6.3, h: 1.4, fontSize: 15, color: COR.branco, paraSpaceAfter: 4, valign: 'top' });
  s.addImage({ path: 'img/inicio.png', x: 7.15, y: 1.35, w: 5.6, h: 3.15, rounding: false, altText: 'A página inicial do Chá', shadow: { type: 'outer', color: '000000', opacity: 0.35, blur: 12, offset: 4, angle: 90 } });
  s.addNotes('Bom dia. Chamo-me Scarllett Pena e vou apresentar o meu projeto final do curso de Técnico Especialista em Tecnologias e Programação de Sistemas de Informação: o Chá, um site para aprender mandarim na hora do chá. (0:30)');

  // ═══ 2. O PROBLEMA ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('Porque é que tão poucos começam o mandarim', { placeholder: 'title' });
  const problemas = [
    [lu.LuClock, 'Pouco tempo', 'Quem trabalha ou estuda tem poucos minutos livres por dia.'],
    [lu.LuLanguages, 'Poucos cursos em PT-PT', 'A maioria dos cursos está em inglês ou em português do Brasil.'],
    [lu.LuMountain, 'Parece difícil demais', 'Tons, caracteres e pinyin assustam quem começa do zero.'],
  ];
  for (let i = 0; i < 3; i++) {
    const x = M + i * 4.1;
    cartao(s, x, 2.0, 3.8, 4.0);
    await circuloIcone(s, problemas[i][0], x + 0.35, 2.35, 1.0, i === 1 ? COR.selo : COR.jade);
    texto(s, problemas[i][1], { x: x + 0.35, y: 3.65, w: 3.2, h: 0.6, fontSize: 21, bold: true });
    texto(s, problemas[i][2], { x: x + 0.35, y: 4.3, w: 3.1, h: 1.4, fontSize: 16, color: COR.cinza, valign: 'top' });
  }
  s.addNotes('Quem trabalha ou estuda tem pouco tempo livre. Quem quer aprender mandarim encontra sobretudo cursos em inglês ou em português do Brasil, e muitas vezes desiste porque parece difícil demais. [A tua motivação numa frase.] Por isso quis criar um curso gratuito, em português de Portugal, que coubesse num intervalo curto do dia. (1:00)');

  // ═══ 3. A IDEIA E O NOME ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('Um pouco todos os dias, no tempo de um chá', { placeholder: 'title' });
  cartao(s, M, 1.9, 4.6, 4.6, COR.papel);
  texto(s, '茶', { x: M, y: 2.05, w: 4.6, h: 3.0, fontSize: 170, color: COR.selo, align: 'center', valign: 'middle', fontFace: 'Microsoft YaHei' });
  texto(s, 'chá', { x: M, y: 5.2, w: 4.6, h: 0.8, fontSize: 32, italic: true, color: COR.tinta, align: 'center' });
  texto(s, '15 min', { x: 5.9, y: 1.95, w: 6.8, h: 1.1, fontSize: 64, bold: true, color: COR.jade });
  texto(s, 'por dia: o tempo de beber uma chávena de chá', { x: 5.9, y: 3.05, w: 6.8, h: 0.5, fontSize: 18, color: COR.cinza });
  texto(s, [
    { text: 'O nome liga as duas línguas', options: { bold: true, breakLine: true, fontSize: 20 } },
    { text: 'A palavra portuguesa «chá» vem do chinês 茶 (chá), trazida de Macau no século XVI. Por isso dizemos «chá», como em Pequim, e os ingleses dizem «tea».', options: { fontSize: 17, color: COR.cinza } },
  ], { x: 5.9, y: 4.0, w: 6.8, h: 2.2, valign: 'top', paraSpaceAfter: 6 });
  s.addNotes('A ideia é estudar um pouco todos os dias, cerca de 15 minutos, o tempo de beber um chá. O nome tem também outra razão: a palavra portuguesa «chá» vem do chinês 茶, chá, e foi trazida de Macau pelos portugueses no século XVI. Por isso dizemos «chá» e os ingleses dizem «tea». O chá liga as duas línguas. (1:00)');

  // ═══ 4. OBJETIVOS E PÚBLICO ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('Para quem é e o que queria conseguir', { placeholder: 'title' });
  cartao(s, M, 1.9, 4.3, 4.6, COR.jade);
  await circuloIcone(s, lu.LuUsers, M + 0.4, 2.25, 1.0, COR.branco, COR.jade);
  texto(s, 'Público', { x: M + 0.4, y: 3.5, w: 3.5, h: 0.6, fontSize: 24, bold: true, color: COR.branco });
  texto(s, 'Falantes de português de Portugal, a partir dos 13 anos, que querem começar o mandarim do zero.', { x: M + 0.4, y: 4.15, w: 3.5, h: 2.0, fontSize: 17, color: COR.branco, valign: 'top' });
  const objetivos = [
    [lu.LuMap, 'Uma rota com objetivo', '6 cidades da China, seguindo a norma oficial HSK 3.0'],
    [lu.LuVolume2, 'Som em todo o chinês', 'Botões «Ouvir» e «Devagar» em cada palavra e frase'],
    [lu.LuDumbbell, 'Praticar sem conta', 'Quiz, cartões de memória, jogo, traços e pronúncia'],
    [lu.LuUserCheck, 'Progresso guardado', 'Com conta, as lições concluídas ficam na base de dados'],
  ];
  for (let i = 0; i < 4; i++) {
    const y = 1.95 + i * 1.15;
    await circuloIcone(s, objetivos[i][0], 5.4, y, 0.75, COR.jadeClaro, COR.jade);
    texto(s, objetivos[i][1], { x: 6.35, y: y - 0.02, w: 6.3, h: 0.4, fontSize: 19, bold: true });
    texto(s, objetivos[i][2], { x: 6.35, y: y + 0.38, w: 6.3, h: 0.4, fontSize: 15, color: COR.cinza });
  }
  s.addNotes('O site é para falantes de português de Portugal, a partir dos 13 anos, que queiram começar do zero. Os objetivos eram: um caminho claro, uma rota por 6 cidades da China seguindo a norma oficial HSK; som em todas as palavras, também devagar; ferramentas para praticar sem precisar de conta; e, para quem cria conta, guardar as lições concluídas. (0:45)');

  // ═══ 5. TECNOLOGIAS E ARQUITETURA ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('Três camadas, sem frameworks', { placeholder: 'title' });
  const camadas = [
    [lu.LuMonitor, 'Browser', 'HTML · CSS · JavaScript', 'Mostra as páginas, faz os exercícios e lê o chinês com a voz do browser', COR.azul],
    [lu.LuServer, 'Apache + PHP', 'Servidor web', 'Monta cada página com os dados da base e trata das contas e da segurança', COR.jade],
    [lu.LuDatabase, 'MySQL / MariaDB', '9 tabelas', 'Guarda a rota, as lições, as palavras, as contas e o progresso', COR.selo],
  ];
  for (let i = 0; i < 3; i++) {
    const x = M + i * 4.2;
    cartao(s, x, 1.9, 3.7, 3.9);
    await circuloIcone(s, camadas[i][0], x + 1.35, 2.2, 1.0, camadas[i][4]);
    texto(s, camadas[i][1], { x: x + 0.2, y: 3.35, w: 3.3, h: 0.5, fontSize: 22, bold: true, align: 'center' });
    texto(s, camadas[i][2], { x: x + 0.2, y: 3.85, w: 3.3, h: 0.4, fontSize: 15, color: camadas[i][4], bold: true, align: 'center' });
    texto(s, camadas[i][3], { x: x + 0.3, y: 4.35, w: 3.1, h: 1.3, fontSize: 15, color: COR.cinza, align: 'center', valign: 'top' });
    if (i < 2) texto(s, '⇄', { x: x + 3.7, y: 3.3, w: 0.5, h: 0.6, fontSize: 30, color: COR.cinza, align: 'center', valign: 'middle' });
  }
  texto(s, 'Tudo corre no XAMPP. Sem ficheiros de áudio: o som vem da Web Speech API do browser.', { x: M, y: 6.1, w: W - 2 * M - 1, h: 0.45, fontSize: 16, color: COR.tinta });
  s.addNotes('Usei PHP e MySQL no servidor, e HTML, CSS e JavaScript no browser, sem frameworks, para conseguir explicar cada linha. Quando alguém abre uma lição, o PHP vai à base de dados buscar a lição, as palavras e as frases e monta a página. No browser, o JavaScript faz os exercícios e usa a voz do próprio browser para ler o chinês, por isso não precisei de ficheiros de áudio. Tudo corre no XAMPP. (1:15)');

  // ═══ 6. PLANEAMENTO ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('Do protótipo ao site em PHP', { placeholder: 'title' });
  const fases = [
    ['Junho 2026', 'Protótipos', 'Uma só página HTML para testar a ideia'],
    ['25 set.', 'Planeamento', 'Marca, rota de 12 meses e fotografias'],
    ['26 a 29 set.', 'Versão PHP e MySQL', 'Base de dados, contas, cidades, 72 lições'],
    ['Outubro', 'Testes e melhorias', 'Sugestões de utilizadores, segurança, simplificação'],
  ];
  s.addShape(pres.shapes.LINE, { x: M + 0.9, y: 3.0, w: W - 2 * M - 1.8, h: 0, line: { color: COR.jadeClaro, width: 4 } });
  for (let i = 0; i < 4; i++) {
    const cx = M + 0.9 + i * ((W - 2 * M - 1.8) / 3);
    s.addShape(pres.shapes.OVAL, { x: cx - 0.3, y: 2.7, w: 0.6, h: 0.6, fill: { color: i === 3 ? COR.selo : COR.jade }, line: { color: COR.branco, width: 3 } });
    texto(s, String(i + 1), { x: cx - 0.3, y: 2.7, w: 0.6, h: 0.6, fontSize: 18, bold: true, color: COR.branco, align: 'center', valign: 'middle' });
    texto(s, fases[i][0], { x: cx - 1.4, y: 1.95, w: 2.8, h: 0.5, fontSize: 16, color: COR.cinza, align: 'center' });
    texto(s, fases[i][1], { x: cx - 1.4, y: 3.6, w: 2.8, h: 0.5, fontSize: 20, bold: true, align: 'center' });
    texto(s, fases[i][2], { x: cx - 1.4, y: 4.15, w: 2.8, h: 1.3, fontSize: 15, color: COR.cinza, align: 'center', valign: 'top' });
  }
  s.addNotes('Comecei em junho com protótipos numa só página, para testar a ideia. Em setembro defini a marca e a rota, e construí a versão em PHP e MySQL por fases: base de dados, contas, páginas das cidades e das lições, e o conteúdo. Em outubro testei com utilizadores e melhorei o site com o que eles pediram. (0:45)');

  // ═══ 7. BASE DE DADOS ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('A base de dados', { placeholder: 'title' });
  function caixaTabela(nome, x, y, cor = COR.jade) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 1.75, h: 0.6, rectRadius: 0.1, fill: { color: cor }, line: { color: cor } });
    texto(s, nome, { x, y, w: 1.75, h: 0.6, fontSize: 15, bold: true, color: COR.branco, align: 'center', valign: 'middle' });
  }
  const seta = (x, y, w, h) => s.addShape(pres.shapes.LINE, { x, y, w, h, line: { color: COR.cinza, width: 1.5, endArrowType: 'triangle' } });
  // Linha 1: o conteúdo da rota. Linha 2: o que cada lição e cidade tem. Linha 3: as contas.
  caixaTabela('cidades', M, 2.0); seta(M + 1.75, 2.3, 0.45, 0);
  caixaTabela('unidades', M + 2.2, 2.0); seta(M + 3.95, 2.3, 0.45, 0);
  caixaTabela('lições', M + 4.4, 2.0);
  caixaTabela('cultura', M, 3.3, COR.cinza); seta(M + 0.87, 2.6, 0, 0.7);
  caixaTabela('palavras', M + 3.3, 3.3, COR.cinza); seta(M + 4.8, 2.6, -0.63, 0.7);
  caixaTabela('frases', M + 5.35, 3.3, COR.cinza); seta(M + 5.75, 2.6, 0.47, 0.7);
  seta(M + 5.27, 2.6, 0, 2.3);
  caixaTabela('utilizadores', M + 1.9, 4.9, COR.selo); seta(M + 3.65, 5.2, 0.75, 0);
  caixaTabela('progresso', M + 4.4, 4.9, COR.ouro);
  texto(s, 'N:N: um aluno conclui muitas lições; uma lição é concluída por muitos alunos', { x: M + 1.9, y: 5.7, w: 5.1, h: 0.7, fontSize: 14, color: COR.cinza, valign: 'top' });
  const numeros = [['9', 'tabelas'], ['72', 'lições'], ['523', 'palavras']];
  for (let i = 0; i < 3; i++) {
    const y = 1.9 + i * 1.5;
    cartao(s, 8.1, y, 4.6, 1.3);
    texto(s, numeros[i][0], { x: 8.4, y, w: 1.9, h: 1.3, fontSize: 54, bold: true, color: COR.jade, valign: 'middle' });
    texto(s, numeros[i][1], { x: 10.3, y, w: 2.2, h: 1.3, fontSize: 22, color: COR.tinta, valign: 'middle' });
  }
  s.addNotes('A base de dados tem 9 tabelas. O conteúdo é uma hierarquia: cada cidade tem unidades, cada unidade tem lições, e cada lição tem palavras e frases. Os utilizadores ligam-se às lições pela tabela progresso, uma relação de muitos para muitos, com uma chave primária de duas colunas para a mesma lição não ser concluída duas vezes. Esta versão tem 72 lições e 523 palavras, e acrescentar mais é só inserir linhas. (1:00)');

  // ═══ 8. SEGURANÇA E RGPD ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('Segurança e proteção de dados', { placeholder: 'title' });
  const colunas = [
    [lu.LuShieldCheck, 'Segurança', COR.jade, ['Palavras-passe só como hash bcrypt', 'Consultas preparadas contra SQL injection', 'Texto escapado contra XSS', 'Token contra CSRF em cada formulário', '5 falhas de login: bloqueio de 15 minutos']],
    [lu.LuScale, 'RGPD', COR.selo, ['Só nome, e-mail e palavra-passe', 'Consentimento com data guardada', 'Idade mínima de 13 anos (Lei n.º 58/2019)', 'Eliminar a conta apaga todos os dados', 'Sem publicidade nem cookies de rastreio']],
  ];
  for (let i = 0; i < 2; i++) {
    const x = M + i * 6.2;
    cartao(s, x, 1.9, 5.9, 4.4);
    await circuloIcone(s, colunas[i][0], x + 0.35, 2.15, 0.85, colunas[i][2]);
    texto(s, colunas[i][1], { x: x + 1.4, y: 2.25, w: 4.2, h: 0.65, fontSize: 24, bold: true, valign: 'middle' });
    texto(s, colunas[i][3].map((t, j) => ({ text: t, options: { bullet: true, breakLine: j < 4 } })), { x: x + 0.4, y: 3.25, w: 5.2, h: 2.8, fontSize: 17, color: COR.tinta, paraSpaceAfter: 8, valign: 'top' });
  }
  texto(s, 'Testado com 20 testes automáticos de segurança: todos passam.', { x: M, y: 6.45, w: 10, h: 0.4, fontSize: 15, italic: true, color: COR.cinza });
  s.addNotes('Na segurança, as palavras-passe nunca são guardadas: guardo só um hash bcrypt. Todas as consultas são preparadas, contra SQL injection; o texto é escapado contra XSS; os formulários têm um token contra CSRF; e ao fim de 5 tentativas falhadas o login fica bloqueado 15 minutos. Testei isto com 20 testes automáticos. No RGPD, peço só o necessário, guardo a data do consentimento, peço a idade mínima de 13 anos, como diz a lei portuguesa, e quem eliminar a conta apaga todos os seus dados. Depois diz: «Agora vou mostrar o site a funcionar.» (1:00)');

  // ═══ 9. DEMONSTRAÇÃO ═══
  s = pres.addSlide({ masterName: 'SECCAO', sectionTitle: 'Apresentação' });
  s.addText('Demonstração', { placeholder: 'title' });
  texto(s, '[endereço do site]', { x: M, y: 3.9, w: W - 2 * M, h: 0.6, fontSize: 22, color: COR.jadeClaro, align: 'center' });
  s.addNotes('Muda para o browser e segue o roteiro da demonstração do guião (4:30): página inicial, a rota, Pequim, lição 1 com som e exercício, concluir lição, cartões e traços, modo escuro, phpMyAdmin com o hash. Se algo falhar, os diapositivos de reserva no fim têm as capturas de cada passo.');

  // ═══ 10. TESTES COM UTILIZADORES ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('O que os testes com utilizadores mudaram', { placeholder: 'title' });
  const testes = [
    ['A letra parecia pequena', 'Letra maior em todo o site'],
    ['Queriam ouvir tudo, também devagar', 'Botões «Ouvir» e «Devagar» e pinyin em todo o chinês'],
    ['O quiz passava sozinho à pergunta seguinte', 'Botão «Próxima pergunta» e lista das erradas no fim'],
    ['A gramática estava misturada no Básico', 'Página própria de Gramática'],
  ];
  texto(s, 'Pedido', { x: M + 0.3, y: 1.85, w: 5.2, h: 0.4, fontSize: 16, bold: true, color: COR.selo });
  texto(s, 'O que mudei', { x: 6.95, y: 1.85, w: 5.5, h: 0.4, fontSize: 16, bold: true, color: COR.jade });
  for (let i = 0; i < 4; i++) {
    const y = 2.35 + i * 1.0;
    cartao(s, M, y, 5.6, 0.85, 'FBE3DE');
    texto(s, testes[i][0], { x: M + 0.3, y, w: 5.1, h: 0.85, fontSize: 17, valign: 'middle' });
    texto(s, '→', { x: 6.25, y, w: 0.5, h: 0.85, fontSize: 24, color: COR.cinza, align: 'center', valign: 'middle' });
    cartao(s, 6.75, y, 5.98, 0.85, COR.jadeClaro);
    texto(s, testes[i][1], { x: 6.95, y, w: 5.6, h: 0.85, fontSize: 17, valign: 'middle' });
  }
  s.addNotes('Pedi a [quem] que testassem o site. As sugestões mais importantes foram letra maior, poder ouvir tudo também devagar, o quiz não passar sozinho à pergunta seguinte e separar a gramática. Fiz essas mudanças, e foram das que mais melhoraram o site. (0:45)');

  // ═══ 11. DIFICULDADES E APRENDIZAGENS ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('Dificuldades e aprendizagens', { placeholder: 'title' });
  const blocos = [
    [lu.LuAlertCircle, 'Dificuldades', COR.selo, ['[A tua maior dificuldade]', '[Como a resolveste]']],
    [lu.LuLightbulb, 'O que aprendi', COR.ouro, ['[Por exemplo: organizar um projeto grande por fases]', '[Por exemplo: testar com pessoas reais]']],
  ];
  for (let i = 0; i < 2; i++) {
    const x = M + i * 6.2;
    cartao(s, x, 1.9, 5.9, 4.4);
    await circuloIcone(s, blocos[i][0], x + 0.35, 2.15, 0.85, blocos[i][2]);
    texto(s, blocos[i][1], { x: x + 1.4, y: 2.25, w: 4.2, h: 0.65, fontSize: 24, bold: true, valign: 'middle' });
    texto(s, blocos[i][3].map((t, j) => ({ text: t, options: { bullet: true, breakLine: j < blocos[i][3].length - 1 } })), { x: x + 0.4, y: 3.25, w: 5.2, h: 2.8, fontSize: 18, color: COR.tinta, paraSpaceAfter: 10, valign: 'top' });
  }
  s.addNotes('A maior dificuldade foi [a tua]. Resolvi [como]. Aprendi [duas coisas]. (0:45)');

  // ═══ 12. LIMITAÇÕES E TRABALHO FUTURO ═══
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Apresentação' });
  s.addText('Limitações e próximos passos', { placeholder: 'title' });
  const futuro = [
    [lu.LuAlertTriangle, 'Limitações', COR.cinza, ['Esta versão tem as primeiras 72 lições da rota', 'O progresso das ferramentas fica só no browser', 'O som depende de o browser ter voz chinesa']],
    [lu.LuRocket, 'Trabalho futuro', COR.jade, ['Completar a rota até ao nível 3 do HSK', 'Guardar todo o progresso na conta', 'Missões no fim de cada cidade e certificado', 'Tutor com IA, do lado do servidor']],
  ];
  for (let i = 0; i < 2; i++) {
    const x = M + i * 6.2;
    cartao(s, x, 1.9, 5.9, 4.4);
    await circuloIcone(s, futuro[i][0], x + 0.35, 2.15, 0.85, futuro[i][2]);
    texto(s, futuro[i][1], { x: x + 1.4, y: 2.25, w: 4.2, h: 0.65, fontSize: 24, bold: true, valign: 'middle' });
    texto(s, futuro[i][3].map((t, j) => ({ text: t, options: { bullet: true, breakLine: j < futuro[i][3].length - 1 } })), { x: x + 0.4, y: 3.25, w: 5.2, h: 2.8, fontSize: 17, color: COR.tinta, paraSpaceAfter: 8, valign: 'top' });
  }
  s.addNotes('O site tem limitações que conheço: esta versão tem as primeiras 72 lições da rota; o progresso das ferramentas de prática fica só no browser; e o som depende de o browser ter uma voz chinesa. No futuro quero completar a rota até ao nível 3 do HSK, guardar todo o progresso na conta, criar missões no fim de cada cidade e um certificado. (0:45)');

  // ═══ 13. CONCLUSÃO ═══
  s = pres.addSlide({ masterName: 'CAPA', sectionTitle: 'Apresentação' });
  texto(s, '我们开始吧！', { x: M, y: 1.5, w: W - 2 * M, h: 1.5, fontSize: 66, bold: true, color: COR.branco, align: 'center', fontFace: 'Microsoft YaHei' });
  texto(s, 'wǒmen kāishǐ ba! · Vamos começar!', { x: M, y: 3.0, w: W - 2 * M, h: 0.6, fontSize: 24, italic: true, color: COR.jadeClaro, align: 'center' });
  texto(s, 'Obrigada. Perguntas?', { x: M, y: 4.4, w: W - 2 * M, h: 0.9, fontSize: 40, bold: true, color: COR.branco, align: 'center' });
  s.addImage({ path: 'img/logo.png', x: W / 2 - 0.4, y: 5.7, w: 0.8, h: 0.8, altText: 'Logótipo do Chá' });
  s.addNotes('Com o Chá juntei o que aprendi no curso, PHP, bases de dados, JavaScript, segurança, com uma coisa de que gosto. Termino com a frase que está no fim da página inicial: 我们开始吧, wǒmen kāishǐ ba, vamos começar! Obrigada. Estou disponível para as vossas perguntas. (0:45)');

  // ═══ RESERVA: CAPTURAS DA DEMONSTRAÇÃO ═══
  pres.addSection({ title: 'Reserva' });
  s = pres.addSlide({ masterName: 'SECCAO', sectionTitle: 'Reserva' });
  s.addText('Reserva: capturas da demonstração', { placeholder: 'title' });
  s.addNotes('Diapositivos de reserva: usa-os só se o site não abrir. Comenta cada captura como se fosse a demonstração ao vivo.');
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
    // As capturas têm 1600 x 900 píxeis (16:9): 10,4 x 5,85 polegadas, centradas
    s.addImage({ path: `img/${ficheiro}.png`, x: (W - 10.4) / 2, y: 1.05, w: 10.4, h: 5.85, altText: legenda, line: { color: 'D5DEDB', width: 1 } });
  }

  await pres.writeFile({ fileName: 'Apresentação - Chá.pptx' });
  if (applyTheme) await applyTheme('Apresentação - Chá.pptx', THEME);
  console.log('Apresentação - Chá.pptx');
})();
