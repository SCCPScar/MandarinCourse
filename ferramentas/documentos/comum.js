// comum.js: as peças que os documentos do projeto partilham (texto, listas, tabelas, caixas, código)
const fs = require('fs');
const path = require('path');
const {
  Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType,
  ShadingType, BorderStyle, ImageRun, LevelFormat,
} = require('docx');

const FONTE = 'Calibri';
const FONTE_CODIGO = 'Consolas';
const LARGURA = 8504; // A4 com as margens do molde (1701 de cada lado)
const PROJETO = process.env.PROJETO || '/home/user/MandarinCourse';

// Texto com partes a **negrito** e `código`
function runs(texto, extra = {}) {
  return texto.split(/(\*\*[^*]+\*\*|`[^`]+`)/).filter(Boolean).map((parte) => {
    if (parte.startsWith('**')) return new TextRun({ text: parte.slice(2, -2), bold: true, font: FONTE, ...extra });
    if (parte.startsWith('`')) return new TextRun({ text: parte.slice(1, -1), font: FONTE_CODIGO, size: 20, color: 'A32A18', ...extra });
    return new TextRun({ text: parte, font: FONTE, ...extra });
  });
}
const p = (texto, opcoes = {}) => new Paragraph({ children: runs(texto), spacing: { after: 120, line: 300 }, ...opcoes });
const h1 = (texto, novaPagina = true) => new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: novaPagina, children: [new TextRun({ text: texto, font: FONTE })] });
const h2 = (texto) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: texto, font: FONTE })] });
const h3 = (texto) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: texto, font: FONTE })] });
const marca = (texto) => new Paragraph({ numbering: { reference: 'marcas', level: 0 }, children: runs(texto), spacing: { after: 80, line: 288 } });
let lista = 0;
function passos(itens) {
  lista++;
  return itens.map((t) => new Paragraph({ numbering: { reference: 'passos', level: 0, instance: lista }, children: runs(t), spacing: { after: 80, line: 288 } }));
}
const espaco = () => new Paragraph({ children: [], spacing: { after: 60 } });

function celula(filhos, largura, extra = {}) {
  return new TableCell({ width: { size: largura, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 110, right: 110 }, children: filhos, ...extra });
}
// Caixa de destaque (tabela de uma célula, com uma barra colorida à esquerda)
function caixa(titulo, texto, cor = 'FDF3DC', barra = 'C8361F') {
  return new Table({
    width: { size: LARGURA, type: WidthType.DXA },
    columnWidths: [LARGURA],
    rows: [new TableRow({ cantSplit: true, children: [celula([new Paragraph({ children: runs('**' + titulo + '** ' + texto), spacing: { line: 288 } })], LARGURA, {
      shading: { type: ShadingType.CLEAR, fill: cor, color: 'auto' },
      margins: { top: 120, bottom: 120, left: 180, right: 180 },
      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, left: { style: BorderStyle.SINGLE, size: 24, color: barra } },
    })] })],
  });
}
// "Se o júri perguntar": pergunta e resposta curta
const juri = (pergunta, resposta) => [espaco(), caixa('Se o júri perguntar: «' + pergunta + '»', resposta, 'E6F2EF', '0E7C66'), espaco()];

// Tabela simples: a primeira linha é o cabeçalho
function tabela(linhas, larguras) {
  const total = larguras.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: larguras,
    rows: linhas.map((linha, i) => new TableRow({
      tableHeader: i === 0,
      cantSplit: true,
      children: linha.map((texto, j) => celula([new Paragraph({ children: runs(texto, i === 0 ? { bold: true, color: 'FFFFFF' } : { size: 21 }) })], larguras[j],
        i === 0 ? { shading: { type: ShadingType.CLEAR, fill: '0E7C66', color: 'auto' } } : {})),
    })),
  });
}

// ── Código ────────────────────────────────────────────────
// Bloco de código com o nome do ficheiro por cima
function codigo(linhas, ficheiro = '') {
  // Tiro a indentação que todas as linhas têm em comum, para o código não ficar empurrado para a direita
  const cheias = linhas.filter((l) => l.trim() !== '');
  const comum = Math.min(...cheias.map((l) => l.match(/^ */)[0].length));
  linhas = linhas.map((l) => l.slice(comum));
  const paragrafos = [];
  if (ficheiro) paragrafos.push(new Paragraph({ children: [new TextRun({ text: ficheiro, font: FONTE, size: 18, bold: true, color: '5B6873' })], spacing: { after: 60 } }));
  linhas.forEach((linha) => paragrafos.push(new Paragraph({
    spacing: { after: 0, line: 252 },
    children: [new TextRun({ text: linha.replace(/\t/g, '    ') || ' ', font: FONTE_CODIGO, size: 17 })],
  })));
  return new Table({
    width: { size: LARGURA, type: WidthType.DXA },
    columnWidths: [LARGURA],
    rows: [new TableRow({ cantSplit: linhas.length <= 35, children: [celula(paragrafos, LARGURA, {
      shading: { type: ShadingType.CLEAR, fill: 'F3F5F4', color: 'auto' },
      margins: { top: 120, bottom: 120, left: 160, right: 160 },
      borders: { top: { style: BorderStyle.SINGLE, size: 4, color: 'D5DEDB' }, bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D5DEDB' }, left: { style: BorderStyle.SINGLE, size: 4, color: 'D5DEDB' }, right: { style: BorderStyle.SINGLE, size: 4, color: 'D5DEDB' } },
    })] })],
  });
}
// Copia um trecho de um ficheiro real do projeto: da primeira linha que tem "desde"
// até à primeira linha seguinte que tem "ate". Se não encontrar, o script para com erro,
// para o guia nunca mostrar código que já não existe.
function trecho(ficheiro, desde, ate) {
  const linhas = fs.readFileSync(path.join(PROJETO, ficheiro), 'utf8').split('\n');
  const inicio = linhas.findIndex((l) => l.includes(desde));
  if (inicio === -1) throw new Error(`Não encontrei «${desde}» em ${ficheiro}`);
  let fim = inicio;
  if (ate !== undefined) {
    // '}' e '});' só contam quando estão sozinhos na linha (o fim de uma função)
    const exato = ate === '}' || ate === '});' || ate === '?>' || ate === "');";
    fim = linhas.findIndex((l, i) => i > inicio && (exato ? l.trimEnd() === ate : l.includes(ate)));
    if (fim === -1) throw new Error(`Não encontrei «${ate}» em ${ficheiro}`);
  }
  return [espaco(), codigo(linhas.slice(inicio, fim + 1), ficheiro.replace('mandarin_project/', '') + ' (linhas ' + (inicio + 1) + ' a ' + (fim + 1) + ')'), espaco()];
}

function figura(ficheiro, largura, altura, legenda) {
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 }, children: [new ImageRun({ type: 'png', data: fs.readFileSync(ficheiro), transformation: { width: largura, height: altura } })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: legenda, italics: true, size: 20, font: FONTE, color: '5B6873' })] }),
  ];
}
const linhaCapa = (texto, tamanho, extra = {}) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [new TextRun({ text: texto, font: FONTE, size: tamanho, ...extra })] });

function capa(titulo, subtitulo, nota) {
  return [
    new Paragraph({ spacing: { before: 600 }, children: [] }),
    linhaCapa('Técnico/a Especialista em Tecnologias e Programação de Sistemas de Informação', 28),
    linhaCapa('Projeto Final · Ano letivo 2025/2026', 24, { color: '5B6873' }),
    new Paragraph({ spacing: { before: 700 }, children: [] }),
    linhaCapa(titulo, 48, { bold: true }),
    linhaCapa(subtitulo, 30, { color: '0E7C66' }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 300 }, children: [new ImageRun({ type: 'png', data: fs.readFileSync(path.join(__dirname, 'img/logo.png')), transformation: { width: 130, height: 130 } })] }),
    ...(nota ? [linhaCapa(nota, 22, { italics: true, color: 'C8361F' })] : []),
    new Paragraph({ spacing: { before: 700 }, children: [] }),
    linhaCapa('Formador: Sérgio Santos', 24),
    linhaCapa('Formanda: Scarllett Sabrina Pena', 24),
    linhaCapa('IEFP · Centro de Emprego e Formação Profissional de Leiria', 22, { color: '5B6873' }),
    linhaCapa('Outubro de 2026', 22, { color: '5B6873' }),
  ];
}

// Estilos, listas e página iguais em todos os documentos
const configuracao = {
  creator: 'Scarllett Sabrina Pena',
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: FONTE, size: 24 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONTE, size: 32, bold: true, color: '1A2530' }, paragraph: { spacing: { before: 120, after: 240 }, outlineLevel: 0, keepNext: true } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONTE, size: 26, bold: true, color: '0E7C66' }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1, keepNext: true } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONTE, size: 24, bold: true, color: '1A2530' }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2, keepNext: true } },
    ],
  },
  numbering: {
    config: [
      { reference: 'marcas', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
      { reference: 'passos', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 360 } } } }] },
    ],
  },
};
const pagina = { titlePage: true, page: { size: { width: 11906, height: 16838 }, margin: { top: 1843, right: 1701, bottom: 1417, left: 1701, header: 708, footer: 708 } } };

module.exports = { runs, p, h1, h2, h3, marca, passos, espaco, caixa, juri, tabela, codigo, trecho, figura, capa, configuracao, pagina, LARGURA, FONTE };
