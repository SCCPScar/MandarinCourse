// Gera o Guia de Instalação do Chá (o cabeçalho e o rodapé são copiados depois do molde do professor)
const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, ImageRun, TableOfContents, PageBreak, LevelFormat,
} = require('docx');

const FONTE = 'Calibri';
const LARGURA = 8504; // A4 com margens de 1701 (as do molde): 11906 - 2 * 1701

// ── Ajudantes ──────────────────────────────────────────────
// Texto com partes a negrito: p('Abrir **XAMPP** agora')
function runs(texto, extra = {}) {
  return texto.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((parte) =>
    parte.startsWith('**')
      ? new TextRun({ text: parte.slice(2, -2), bold: true, font: FONTE, ...extra })
      : new TextRun({ text: parte, font: FONTE, ...extra }));
}
const p = (texto, opcoes = {}) => new Paragraph({ children: runs(texto), spacing: { after: 120, line: 300 }, ...opcoes });
const h1 = (texto) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: texto, font: FONTE })], pageBreakBefore: true });
const h2 = (texto) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: texto, font: FONTE })] });
const marca = (texto) => new Paragraph({ numbering: { reference: 'marcas', level: 0 }, children: runs(texto), spacing: { after: 80, line: 288 } });
let lista = 0;
function passos(itens) {
  lista++;
  return itens.map((t) => new Paragraph({ numbering: { reference: 'passos', level: 0, instance: lista }, children: runs(t), spacing: { after: 80, line: 288 } }));
}
// Caixa de aviso (uma tabela de uma célula com fundo de cor)
function caixa(titulo, texto, cor = 'FDF3DC') {
  return new Table({
    width: { size: LARGURA, type: WidthType.DXA },
    columnWidths: [LARGURA],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: LARGURA, type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: cor, color: 'auto' },
      margins: { top: 120, bottom: 120, left: 180, right: 180 },
      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, left: { style: BorderStyle.SINGLE, size: 24, color: 'C8361F' } },
      children: [new Paragraph({ children: runs('**' + titulo + '** ' + texto), spacing: { line: 288 } })],
    })] })],
  });
}
const espaco = () => new Paragraph({ children: [], spacing: { after: 60 } });
// Tabela simples: a primeira linha é o cabeçalho
function tabela(linhas, larguras) {
  const total = larguras.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: larguras,
    rows: linhas.map((linha, i) => new TableRow({
      tableHeader: i === 0,
      cantSplit: true,
      children: linha.map((celula, j) => new TableCell({
        width: { size: larguras[j], type: WidthType.DXA },
        shading: i === 0 ? { type: ShadingType.CLEAR, fill: '0E7C66', color: 'auto' } : undefined,
        margins: { top: 80, bottom: 80, left: 110, right: 110 },
        children: [new Paragraph({ children: runs(celula, i === 0 ? { bold: true, color: 'FFFFFF' } : { size: 21 }) })],
      })),
    })),
  });
}
function figura(ficheiro, largura, altura, legenda) {
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 }, children: [new ImageRun({ type: 'png', data: fs.readFileSync(ficheiro), transformation: { width: largura, height: altura } })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: legenda, italics: true, size: 20, font: FONTE, color: '5B6873' })] }),
  ];
}
const capa = (texto, tamanho, extra = {}) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [new TextRun({ text: texto, font: FONTE, size: tamanho, ...extra })] });

// ── Conteúdo ───────────────────────────────────────────────
const conteudo = [
  // CAPA (sem número de página; o cabeçalho da capa é o do molde)
  new Paragraph({ spacing: { before: 600 }, children: [] }),
  capa('Técnico/a Especialista em Tecnologias e Programação de Sistemas de Informação', 28),
  capa('Projeto Final · Ano letivo 2025/2026', 24, { color: '5B6873' }),
  new Paragraph({ spacing: { before: 700 }, children: [] }),
  capa('GUIA DE INSTALAÇÃO', 48, { bold: true }),
  capa('Chá: aprender mandarim na hora do chá', 30, { color: '0E7C66' }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 300 }, children: [new ImageRun({ type: 'png', data: fs.readFileSync('img/logo.png'), transformation: { width: 130, height: 130 } })] }),
  new Paragraph({ spacing: { before: 900 }, children: [] }),
  capa('Formador: Sérgio Santos', 24),
  capa('Formanda: Scarllett Sabrina Pena', 24),
  capa('IEFP · Centro de Emprego e Formação Profissional de Leiria', 22, { color: '5B6873' }),
  capa('Outubro de 2026', 22, { color: '5B6873' }),

  // ÍNDICE
  new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun({ text: 'Índice', font: FONTE })] }),
  new TableOfContents('Índice', { hyperlink: true, headingStyleRange: '1-2' }),
  p('Nota: se o índice aparecer vazio, carregue com o botão direito do rato sobre ele e escolha «Atualizar campo».', { spacing: { before: 200 } }),

  // 1. INTRODUÇÃO
  h1('1. Introdução'),
  p('O Chá é um site gratuito para aprender mandarim em sessões curtas, de cerca de 15 minutos por dia. Foi desenvolvido em PHP, com uma base de dados MySQL (MariaDB), HTML, CSS e JavaScript, e corre num servidor web Apache.'),
  p('Este guia explica, passo a passo e a partir do zero, como pôr o site a funcionar. Há três formas de o fazer, e cada uma serve uma situação diferente:'),
  tabela([
    ['Cenário', 'Quando usar', 'Internet'],
    ['**A.** Computador com XAMPP', 'Desenvolvimento, testes e apresentação pelo Microsoft Teams', 'Não precisa'],
    ['**B.** Pen drive com XAMPP Portable', 'Apresentar num computador de outra pessoa, sem instalar nada', 'Não precisa'],
    ['**C.** Alojamento online gratuito', 'Apresentação presencial num computador da escola e acesso a partir de qualquer dispositivo', 'Precisa'],
  ], [2700, 4204, 1600]),
  espaco(),
  p('Os cenários A e B usam o XAMPP, um pacote gratuito que junta o Apache (o servidor web), o PHP, o MariaDB (a base de dados) e o phpMyAdmin (uma página para gerir a base de dados). O cenário C usa um serviço de alojamento que já tem tudo isto instalado.'),
  caixa('Recomendação.', 'Para a apresentação final, prepare os três: o cenário C como plano principal se a apresentação for presencial, o cenário B como plano de reserva, e um vídeo curto de demonstração gravado antes, para o caso de nada funcionar.'),

  // 2. REQUISITOS
  h1('2. Requisitos'),
  h2('2.1 Computador e sistema'),
  marca('Windows 10 ou Windows 11, de 64 bits.'),
  marca('Cerca de 1 GB de espaço livre para o XAMPP e 20 MB para o site (a maior parte são fotografias).'),
  marca('Para o cenário B: uma pen drive com pelo menos 4 GB.'),
  h2('2.2 Programas'),
  tabela([
    ['Programa', 'Versão', 'Para quê'],
    ['XAMPP', '8.2 ou mais recente', 'Apache, PHP, MariaDB e phpMyAdmin (cenários A e B)'],
    ['PHP', '7.4 ou mais recente', 'Já vem no XAMPP. O site foi testado com o PHP 8.4'],
    ['MariaDB ou MySQL', '10.4 ou mais recente', 'Já vem no XAMPP. O site foi testado com o MariaDB 10.11'],
    ['Google Chrome ou Microsoft Edge', 'Atual', 'Abrir o site. São os browsers que têm voz chinesa e reconhecimento de voz'],
    ['FileZilla Client', 'Atual', 'Enviar os ficheiros para o alojamento (só no cenário C)'],
  ], [2500, 1900, 4104]),
  espaco(),
  caixa('Sobre o som.', 'Os botões «Ouvir» e «Devagar» usam a voz do próprio browser. O Chrome e o Edge trazem vozes chinesas que funcionam com internet. Sem internet, é preciso ter uma voz chinesa instalada no Windows (Definições, Hora e idioma, Voz). O site avisa quando não encontra nenhuma voz chinesa.'),
  h2('2.3 Ficheiros do projeto'),
  p('O projeto está organizado nestas pastas:'),
  tabela([
    ['Pasta ou ficheiro', 'Conteúdo'],
    ['**mandarin_project/**', 'O site completo: páginas PHP, CSS, JavaScript, imagens e bibliotecas'],
    ['**base_de_dados/cha.sql**', 'O script da base de dados para o XAMPP (cria a base «cha», as 9 tabelas e o conteúdo do curso)'],
    ['**base_de_dados/cha-alojamento.sql**', 'O mesmo script, preparado para o alojamento online (não cria a base, só as tabelas)'],
    ['**docs/**', 'Documentação técnica (base de dados, marca, rota, fotografias)'],
  ], [3300, 5204]),
  p('As pastas **prototipos/** (as primeiras versões, de junho de 2026) e **ferramentas/** (scripts de preparação) não são precisas para instalar o site.', { spacing: { before: 160 } }),

  // 3. CENÁRIO A
  h1('3. Cenário A: computador com XAMPP'),
  h2('3.1 Instalar o XAMPP'),
  ...passos([
    'Abrir **https://www.apachefriends.org** e descarregar o XAMPP para Windows (versão 8.2 ou mais recente).',
    'Executar o instalador. Se o Windows mostrar um aviso sobre o Controlo de Conta de Utilizador, carregar em **OK**.',
    'Na lista de componentes, deixar marcados pelo menos **Apache**, **MySQL**, **PHP** e **phpMyAdmin**.',
    'Instalar na pasta proposta, **C:\\xampp**. Outras pastas (por exemplo dentro de «Programas») podem dar problemas de permissões.',
    'No fim, deixar marcada a opção de abrir o **XAMPP Control Panel**.',
  ]),
  h2('3.2 Ligar o Apache e o MySQL'),
  ...passos([
    'No **XAMPP Control Panel**, carregar em **Start** na linha do **Apache** e depois na linha do **MySQL**.',
    'Se o Firewall do Windows perguntar, permitir o acesso em **redes privadas**.',
    'Os nomes «Apache» e «MySQL» ficam com fundo verde quando estão a funcionar. Se ficarem vermelhos, ver a secção 7.',
  ]),
  h2('3.3 Copiar o site'),
  ...passos([
    'Abrir a pasta **C:\\xampp\\htdocs** (é a pasta que o Apache mostra na internet).',
    'Criar lá dentro uma pasta chamada **cha**.',
    'Copiar **todo o conteúdo** da pasta **mandarin_project** para **C:\\xampp\\htdocs\\cha**. No fim, o ficheiro **index.php** deve ficar em **C:\\xampp\\htdocs\\cha\\index.php**.',
  ]),
  caixa('Ficheiro escondido.', 'A pasta tem um ficheiro chamado **.htaccess**, que o Windows pode esconder. Ele protege as pastas internas e mostra a página «não encontrada». Ao copiar a pasta inteira ele vai junto; se copiar ficheiro a ficheiro, confirme que não ficou para trás (no Explorador: Ver, Mostrar, Itens ocultos).'),
  h2('3.4 Importar a base de dados'),
  ...passos([
    'Com o Apache e o MySQL ligados, abrir **http://localhost/phpmyadmin** no browser.',
    'Sem escolher nenhuma base de dados à esquerda, carregar no separador **Importar**.',
    'Em **Ficheiro a importar**, escolher **base_de_dados/cha.sql**. O conjunto de caracteres deve ser **utf-8**.',
    'Carregar em **Importar** no fundo da página.',
    'À esquerda aparece a base **cha** com 9 tabelas. A tabela **palavras** deve ter 523 linhas e a tabela **licoes** 72.',
  ]),
  caixa('Atenção.', 'O script começa por apagar a base «cha», se ela existir. Importar outra vez apaga as contas criadas no site.'),
  h2('3.5 Abrir o site'),
  p('Abrir **http://localhost/cha/** no Chrome ou no Edge. Deve aparecer a página inicial (Figura 1). Na primeira visita aparece uma janela de boas-vindas que pergunta o nível de mandarim.'),
  ...figura('img/inicio.png', 560, 333, 'Figura 1. Página inicial do Chá a funcionar no computador local'),
  h2('3.6 Ligação à base de dados'),
  p('O PHP liga-se à base de dados no ficheiro **includes/ligacao.php**. No XAMPP não é preciso mudar nada, porque os valores já são os do XAMPP:'),
  tabela([
    ['Variável', 'Valor no XAMPP', 'O que é'],
    ['$servidor', 'localhost', 'O computador onde está a base de dados'],
    ['$base', 'cha', 'O nome da base de dados'],
    ['$utilizador_bd', 'root', 'O utilizador do MySQL'],
    ['$palavra_passe_bd', '(vazia)', 'A palavra-passe do MySQL'],
  ], [2400, 2200, 3904]),

  // 4. CENÁRIO B
  h1('4. Cenário B: pen drive com XAMPP Portable'),
  p('O XAMPP Portable é uma versão do XAMPP que corre a partir de uma pen drive, sem instalar nada no computador. Serve para apresentar o site num computador de outra pessoa.'),
  ...passos([
    'Na página de transferências do XAMPP (**https://www.apachefriends.org**, opção «Mais transferências»), descarregar a versão **Portable** para Windows, em formato .zip.',
    'Extrair o ficheiro .zip para a **raiz** da pen drive, de forma a ficar, por exemplo, **E:\\xampp**. Caminhos curtos e sem espaços evitam erros.',
    'Abrir a pasta **E:\\xampp** e executar **setup_xampp.bat** uma vez. Este ficheiro acerta os caminhos para a letra da pen drive.',
    'Executar **xampp-control.exe** e ligar o **Apache** e o **MySQL**, como na secção 3.2.',
    'Copiar o conteúdo de **mandarin_project** para **E:\\xampp\\htdocs\\cha** e importar o **cha.sql**, como nas secções 3.3 e 3.4.',
    'Abrir **http://localhost/cha/** e confirmar que tudo funciona (secção 6).',
  ]),
  caixa('Antes do dia da apresentação.', 'Testar a pen drive num computador que não seja o seu. Se a pen drive receber outra letra (por exemplo F: em vez de E:), executar outra vez o setup_xampp.bat. No fim, carregar em **Stop** no MySQL antes de retirar a pen drive, para não estragar os ficheiros da base de dados.'),
  p('Os nomes exatos dos ficheiros podem mudar um pouco entre versões do XAMPP. Se o setup_xampp.bat não existir na versão descarregada, o XAMPP Control Panel acerta os caminhos sozinho ao arrancar.'),

  // 5. CENÁRIO C
  h1('5. Cenário C: alojamento online gratuito (InfinityFree)'),
  p('Neste cenário o site fica na internet, num endereço público, e abre em qualquer computador ou telemóvel. Este guia usa o **InfinityFree** (https://www.infinityfree.com), que é gratuito e tem PHP, MySQL e phpMyAdmin. Os nomes dos menus do painel podem mudar com o tempo; os passos mantêm-se.'),
  caixa('Limites do plano gratuito.', 'Os alojamentos gratuitos podem ficar lentos ou suspender contas sem aviso. Por isso, este cenário deve ser testado na véspera da apresentação e ter sempre o cenário B como reserva.'),
  h2('5.1 Criar a conta e o alojamento'),
  ...passos([
    'Criar uma conta em **https://www.infinityfree.com** e confirmar o e-mail.',
    'Na área de cliente, criar uma nova conta de alojamento (**Create Account**) e escolher um subdomínio gratuito, por exemplo **cha-mandarim**, com uma das terminações propostas.',
    'Esperar que o alojamento fique ativo e abrir o painel de controlo (**Control Panel**).',
  ]),
  h2('5.2 Criar a base de dados'),
  ...passos([
    'No painel, abrir **MySQL Databases** e criar uma base de dados com o nome **cha**. O alojamento acrescenta um prefixo, por isso o nome final é parecido com **if0_12345678_cha**.',
    'Anotar, num sítio seguro, os quatro dados que o painel mostra: o **servidor MySQL** (por exemplo sql123.infinityfree.com), o **nome da base de dados**, o **utilizador** e a **palavra-passe**.',
  ]),
  caixa('Segurança.', 'Estes dados dão acesso total à base de dados. Não os enviar por e-mail, não os publicar no GitHub e não os colar em conversas. Ficam só no ficheiro ligacao.php do servidor.', 'FBE3DE'),
  h2('5.3 Importar a base de dados'),
  ...passos([
    'Na linha da base de dados, abrir o **phpMyAdmin** do alojamento.',
    'Escolher a base **if0_..._cha** na lista da esquerda.',
    'No separador **Importar**, escolher o ficheiro **base_de_dados/cha-alojamento.sql** (e não o cha.sql) e carregar em **Importar**.',
  ]),
  p('O cha.sql normal não funciona aqui, porque começa por criar a base «cha» e os alojamentos gratuitos não deixam criar bases de dados por SQL. O cha-alojamento.sql cria apenas as tabelas, dentro da base escolhida. Esta diferença foi testada com um utilizador sem permissão para criar bases de dados: o cha.sql falha e o cha-alojamento.sql importa sem erros, também na segunda vez.'),
  h2('5.4 Enviar os ficheiros do site'),
  ...passos([
    'No painel, abrir **FTP Details** (ou «Detalhes de FTP») e anotar o **servidor FTP** (normalmente ftpupload.net), o **utilizador** e a **palavra-passe**.',
    'Instalar o **FileZilla Client** (https://filezilla-project.org) e ligar com esses dados, na porta **21**.',
    'Do lado do servidor, abrir a pasta **htdocs** e apagar o ficheiro de boas-vindas que o alojamento lá pôs.',
    'Do lado do computador, abrir a pasta **mandarin_project**, selecionar todo o conteúdo (incluindo o **.htaccess**) e arrastá-lo para dentro de **htdocs**.',
    'Esperar que a transferência acabe. São cerca de 20 MB.',
  ]),
  h2('5.5 Configurar a ligação à base de dados'),
  ...passos([
    'No FileZilla, abrir **htdocs/includes/ligacao.php** com o botão direito do rato, opção **Ver/Editar**.',
    'Trocar os quatro valores pelos dados anotados na secção 5.2 e guardar. O FileZilla pergunta se deve enviar o ficheiro alterado: responder **Sim**.',
  ]),
  tabela([
    ['Variável', 'Valor no alojamento (exemplo)'],
    ['$servidor', 'sql123.infinityfree.com'],
    ['$base', 'if0_12345678_cha'],
    ['$utilizador_bd', 'if0_12345678'],
    ['$palavra_passe_bd', 'a palavra-passe do painel'],
  ], [3000, 5504]),
  espaco(),
  p('A cópia do ligacao.php que está no computador e no GitHub fica com os valores do XAMPP. Só a cópia do servidor tem os dados do alojamento.'),
  h2('5.6 Ativar o HTTPS'),
  p('O microfone (separador «Pronúncia» do Praticar) só funciona em ligações seguras: em **localhost** ou em endereços **https://**. No InfinityFree, o certificado SSL gratuito pede-se na área de cliente, na secção **SSL Certificates**. Depois de instalado, abrir sempre o site com **https://**. O resto do site funciona também sem HTTPS.'),
  h2('5.7 Abrir o site e proteger os dados'),
  p('Abrir o endereço do subdomínio (por exemplo **https://cha-mandarim.infinityfreeapp.com**) e fazer a verificação da secção 6.'),
  caixa('Proteção de dados (RGPD).', 'Com o site online, as contas criadas por outras pessoas ficam guardadas nos servidores do alojamento. Antes de divulgar o endereço, a Política de Privacidade (privacidade.php) deve indicar o alojamento como subcontratante e onde ficam os dados.'),

  // 6. VERIFICAÇÃO
  h1('6. Verificar a instalação'),
  p('Depois de instalar, fazer estes testes pela ordem indicada. Se algum falhar, ver a secção 7.'),
  tabela([
    ['N.º', 'Teste', 'Resultado esperado'],
    ['1', 'Abrir a página inicial', 'Aparece a página com o menu, as letras e as cores (Figura 1)'],
    ['2', 'Abrir «A rota» e uma cidade', 'Aparecem as 6 cidades e as lições da cidade'],
    ['3', 'Abrir uma lição e carregar em «Ouvir»', 'Ouve-se a palavra em chinês'],
    ['4', 'Abrir um endereço que não existe (ex.: /cha/abc)', 'Aparece a página «não encontrada» do Chá'],
    ['5', 'Criar uma conta em «Conta»', 'A conta é criada e abre a página «A minha conta»'],
    ['6', 'Concluir uma lição com a sessão iniciada', 'A lição fica marcada como feita na cidade'],
    ['7', 'Praticar, separador «Traços», botão «Animar»', 'O caractere desenha-se traço a traço (Figura 2), também sem internet'],
    ['8', 'Botão do modo escuro (lua)', 'O site muda para cores escuras'],
    ['9', 'Abrir **/cha/includes/ligacao.php**', 'Aparece a página «não encontrada» (o ficheiro está protegido)'],
  ], [700, 3900, 3904]),
  espaco(),
  ...figura('img/tracos.png', 330, 329, 'Figura 2. Separador «Traços» do Praticar, que funciona sem internet'),

  // 7. PROBLEMAS
  h1('7. Resolução de problemas'),
  tabela([
    ['Problema', 'Causa provável', 'Solução'],
    ['O Apache não arranca (fica vermelho)', 'A porta 80 está ocupada por outro programa (por exemplo o Skype ou o IIS)', 'Fechar esse programa, ou no XAMPP: Config do Apache, httpd.conf, trocar «Listen 80» por «Listen 8080» e abrir http://localhost:8080/cha/'],
    ['O MySQL não arranca', 'Outro MySQL já está a usar a porta 3306', 'Parar o outro MySQL nos Serviços do Windows, ou mudar a porta no my.ini'],
    ['«Não foi possível ligar à base de dados»', 'O MySQL está desligado ou os dados do ligacao.php estão errados', 'Ligar o MySQL no XAMPP; no alojamento, confirmar os quatro valores da secção 5.5'],
    ['Erro ao importar: «Access denied» ou «#1044»', 'Importou o cha.sql no alojamento', 'Importar o cha-alojamento.sql (secção 5.3)'],
    ['Os caracteres chineses aparecem como «???»', 'O ficheiro foi importado com outro conjunto de caracteres', 'Importar outra vez com utf-8'],
    ['A página aparece sem cores nem formatação', 'O browser está a usar uma cópia antiga do CSS', 'Carregar em Ctrl+F5'],
    ['Erro 500 em todas as páginas', 'O Apache não aceita o .htaccess (falta o mod_rewrite)', 'No XAMPP vem ligado. No httpd.conf, confirmar que a linha do mod_rewrite não começa por #'],
    ['Todas as páginas dão «não encontrada»', 'Os ficheiros ficaram numa subpasta a mais (ex.: htdocs/cha/mandarin_project)', 'Mover o conteúdo para que o index.php fique diretamente em htdocs/cha'],
    ['Os botões «Ouvir» não fazem som', 'O browser não tem voz chinesa', 'Usar o Chrome ou o Edge com internet, ou instalar a voz chinesa no Windows'],
    ['O microfone não funciona', 'O site está em http:// num endereço que não é localhost', 'Ativar o HTTPS (secção 5.6) e autorizar o microfone no browser'],
  ], [2500, 2900, 3104]),

  // 8. ATUALIZAR
  h1('8. Atualizar ou reinstalar'),
  marca('**Atualizar o site:** copiar de novo o conteúdo de mandarin_project por cima do anterior. Depois, carregar em Ctrl+F5 uma vez no browser.'),
  marca('**Atualizar a base de dados:** importar de novo o cha.sql (XAMPP) ou o cha-alojamento.sql (alojamento). Isto apaga as contas criadas.'),
  marca('**Mudar o cha.sql:** depois de qualquer mudança no cha.sql, executar **ferramentas/gerar_sql_alojamento.sh** para criar de novo o cha-alojamento.sql.'),
  marca('**Desinstalar:** apagar a pasta htdocs\\cha e, no phpMyAdmin, apagar a base «cha».'),
];

const doc = new Document({
  creator: 'Scarllett Sabrina Pena',
  title: 'Guia de Instalação · Chá',
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: FONTE, size: 24 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONTE, size: 32, bold: true, color: '1A2530' }, paragraph: { spacing: { before: 120, after: 240 }, outlineLevel: 0, keepNext: true } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONTE, size: 26, bold: true, color: '0E7C66' }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1, keepNext: true } },
    ],
  },
  numbering: {
    config: [
      { reference: 'marcas', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
      { reference: 'passos', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: { titlePage: true, page: { size: { width: 11906, height: 16838 }, margin: { top: 1843, right: 1701, bottom: 1417, left: 1701, header: 708, footer: 708 } } },
    children: conteudo,
  }],
});

Packer.toBuffer(doc).then((b) => { fs.writeFileSync('gerado.docx', b); console.log('gerado.docx'); });
