// Gera o Guião de Apresentação do Chá (uso pessoal): o que dizer em cada diapositivo, tempos e planos B
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, TableOfContents } = require('docx');
const { p, h1, h2, marca, passos, espaco, caixa, tabela, capa, configuracao, pagina, FONTE } = require('./comum');

// Um diapositivo: o que está no ecrã, o que dizer e quando passar ao seguinte
function diapositivo(n, titulo, tempo, noEcra, fala, passagem) {
  return [
    h2(`Diapositivo ${n}: ${titulo} (${tempo})`),
    p('**No ecrã:** ' + noEcra),
    espaco(),
    caixa('O que dizer:', fala, 'E6F2EF', '0E7C66'),
    ...(passagem ? [p('**Passa ao seguinte** ' + passagem, { spacing: { before: 120, after: 160 } })] : [espaco()]),
  ];
}

const conteudo = [
  ...capa('GUIÃO DE APRESENTAÇÃO', 'Chá: o que dizer, quando e o que fazer se algo falhar', 'Documento de estudo pessoal (não é para entregar)'),

  new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun({ text: 'Índice', font: FONTE })] }),
  new TableOfContents('Índice', { hyperlink: true, headingStyleRange: '1-2' }),
  p('Se o índice aparecer vazio: botão direito do rato sobre ele, «Atualizar campo».', { spacing: { before: 200 } }),

  // ═══ 1 ═══
  h1('1. Visão geral'),
  p('A apresentação está pensada para **15 minutos**, mais o tempo das perguntas. Se o formador indicar outra duração, usa a versão curta da secção 4 ou estica a demonstração.'),
  tabela([
    ['N.º', 'Diapositivo', 'Tempo', 'Acumulado'],
    ['1', 'Capa', '0:30', '0:30'],
    ['2', 'O problema', '1:00', '1:30'],
    ['3', 'A ideia e o nome', '1:00', '2:30'],
    ['4', 'Objetivos e público', '0:45', '3:15'],
    ['5', 'Tecnologias e arquitetura', '1:15', '4:30'],
    ['6', 'Planeamento', '0:45', '5:15'],
    ['7', 'Base de dados', '1:00', '6:15'],
    ['8', 'Segurança e RGPD', '1:00', '7:15'],
    ['9', 'Demonstração ao vivo', '4:30', '11:45'],
    ['10', 'Testes com utilizadores', '0:45', '12:30'],
    ['11', 'Dificuldades e aprendizagens', '0:45', '13:15'],
    ['12', 'Limitações e trabalho futuro', '0:45', '14:00'],
    ['13', 'Conclusão e perguntas', '0:45', '14:45'],
  ], [900, 4100, 1600, 1904]),
  espaco(),
  caixa('Regra de ouro.', 'Fala devagar e olha para o júri, não para o ecrã. Os diapositivos têm pouco texto de propósito: quem explica és tu. Se te perderes, olha para o título do diapositivo e diz a ideia principal dele.'),
  h2('Antes de começar'),
  marca('Abre, por esta ordem, em separadores do browser: os diapositivos, a página inicial do Chá, a lição 1 (licao.php?id=1), o Praticar e o phpMyAdmin com a tabela utilizadores.'),
  marca('Inicia sessão com a conta de demonstração (criada na véspera, com 2 ou 3 lições concluídas).'),
  marca('Liga o som e testa um botão «Ouvir».'),
  marca('Põe o zoom do browser a 100% (Ctrl+0) e confirma que se lê bem no ecrã grande.'),
  marca('Tem uma garrafa de água à mão.'),

  // ═══ 2 ═══
  h1('2. Diapositivo a diapositivo'),
  ...diapositivo(1, 'Capa', '0:30',
    'O logótipo 茶, o título «Chá: aprender mandarim na hora do chá», o teu nome, o curso, o formador e a data.',
    '«Bom dia. Chamo-me Scarllett Pena e vou apresentar o meu projeto final do curso de Técnico Especialista em Tecnologias e Programação de Sistemas de Informação: o Chá, um site para aprender mandarim na hora do chá.»',
    'logo a seguir à apresentação.'),
  ...diapositivo(2, 'O problema', '1:00',
    'Três ideias curtas: «pouco tempo», «poucos recursos em português de Portugal», «o mandarim parece difícil demais».',
    '«Quem trabalha ou estuda tem pouco tempo livre. Quem quer aprender mandarim encontra sobretudo cursos em inglês ou em português do Brasil, e muitas vezes desiste porque parece difícil demais. [[uma frase tua sobre a tua motivação]]. Por isso quis criar um curso gratuito, em português de Portugal, que coubesse num intervalo curto do dia.»',
    'quando disseres «intervalo curto do dia».'),
  ...diapositivo(3, 'A ideia e o nome', '1:00',
    'O caractere 茶 em grande, com «chá» por baixo, e uma linha: «15 minutos por dia, o tempo de um chá».',
    '«A ideia é estudar um pouco todos os dias, cerca de 15 minutos, o tempo de beber um chá. O nome tem também outra razão: a palavra portuguesa «chá» vem do chinês 茶, chá, e foi trazida de Macau pelos portugueses no século XVI. Por isso dizemos «chá» e os ingleses dizem «tea». O chá liga as duas línguas.»',
    'depois da frase sobre o inglês.'),
  ...diapositivo(4, 'Objetivos e público', '0:45',
    'Público: falantes de português de Portugal, a partir dos 13 anos. Objetivos: rota por 6 cidades, som em todo o chinês, prática sem conta, progresso guardado com conta.',
    '«O site é para falantes de português de Portugal, a partir dos 13 anos, que queiram começar do zero. Os objetivos eram: um caminho claro, uma rota por 6 cidades da China seguindo a norma oficial HSK; som em todas as palavras, também devagar; ferramentas para praticar sem precisar de conta; e, para quem cria conta, guardar as lições concluídas.»',
    'quando acabares a lista.'),
  ...diapositivo(5, 'Tecnologias e arquitetura', '1:15',
    'Um esquema com três camadas: Browser (HTML, CSS, JavaScript) ⇄ Apache com PHP ⇄ MySQL. Por baixo: XAMPP, sem frameworks.',
    '«Usei PHP e MySQL no servidor, e HTML, CSS e JavaScript no browser, sem frameworks, para conseguir explicar cada linha. Quando alguém abre uma lição, o PHP vai à base de dados buscar a lição, as palavras e as frases e monta a página. No browser, o JavaScript faz os exercícios e usa a voz do próprio browser para ler o chinês, por isso não precisei de ficheiros de áudio. Tudo corre no XAMPP.»',
    'depois de «XAMPP».'),
  ...diapositivo(6, 'Planeamento', '0:45',
    'Uma linha do tempo: junho, protótipos; setembro, marca e plano da rota; final de setembro, versão em PHP e MySQL e conteúdo; outubro, testes com utilizadores e melhorias.',
    '«Comecei em junho com protótipos numa só página, para testar a ideia. Em setembro defini a marca e a rota, e construí a versão em PHP e MySQL por fases: base de dados, contas, páginas das cidades e das lições, e o conteúdo. Em outubro testei com utilizadores e melhorei o site com o que eles pediram.»',
    'no fim da linha do tempo.'),
  ...diapositivo(7, 'Base de dados', '1:00',
    'O diagrama simplificado: cidades → unidades → lições → palavras e frases; utilizadores ⇄ progresso ⇄ lições. Os números: 9 tabelas, 72 lições, 523 palavras.',
    '«A base de dados tem 9 tabelas. O conteúdo é uma hierarquia: cada cidade tem unidades, cada unidade tem lições, e cada lição tem palavras e frases. Os utilizadores ligam-se às lições pela tabela progresso, uma relação de muitos para muitos, com uma chave primária de duas colunas para a mesma lição não ser concluída duas vezes. Esta versão tem 72 lições e 523 palavras, e acrescentar mais é só inserir linhas.»',
    'depois de «inserir linhas».'),
  ...diapositivo(8, 'Segurança e RGPD', '1:00',
    'Duas colunas. Segurança: hash bcrypt, consultas preparadas, proteção contra XSS e CSRF, limite de tentativas de login. RGPD: consentimento, idade mínima de 13 anos, eliminar a conta apaga tudo.',
    '«Na segurança, as palavras-passe nunca são guardadas: guardo só um hash bcrypt. Todas as consultas são preparadas, contra SQL injection; o texto é escapado contra XSS; os formulários têm um token contra CSRF; e ao fim de 5 tentativas falhadas o login fica bloqueado 15 minutos. Testei isto com 20 testes automáticos. No RGPD, peço só o necessário, guardo a data do consentimento, peço a idade mínima de 13 anos, como diz a lei portuguesa, e quem eliminar a conta apaga todos os seus dados.»',
    'e diz: «Agora vou mostrar o site a funcionar.»'),
  ...diapositivo(9, 'Demonstração ao vivo', '4:30',
    'Só o título «Demonstração». Muda para o browser.',
    'Segue o roteiro da secção 3. Vai dizendo o que fazes: «Agora vou abrir a primeira lição de Pequim…».',
    'quando voltares aos diapositivos.'),
  ...diapositivo(10, 'Testes com utilizadores', '0:45',
    'Antes e depois, com 3 ou 4 exemplos: letra maior, botões «Ouvir» e «Devagar», «Próxima pergunta» no quiz, página de Gramática própria.',
    '«Pedi a [[quem]] que testassem o site. As sugestões mais importantes foram letra maior, poder ouvir tudo também devagar, o quiz não passar sozinho à pergunta seguinte e separar a gramática. Fiz essas mudanças, e foram das que mais melhoraram o site.»',
    'depois dos exemplos.'),
  ...diapositivo(11, 'Dificuldades e aprendizagens', '0:45',
    'Duas listas curtas: «Dificuldades» e «O que aprendi».',
    '«A maior dificuldade foi [[a tua]]. Resolvi [[como]]. Aprendi [[duas coisas, por exemplo: a organizar um projeto grande por fases, e a importância de testar com pessoas reais]].»',
    'depois das aprendizagens.'),
  ...diapositivo(12, 'Limitações e trabalho futuro', '0:45',
    'Limitações: 72 lições da rota; progresso das ferramentas só no browser; som depende do browser. Futuro: completar a rota, guardar tudo na conta, missões e certificado, tutor com IA do lado do servidor.',
    '«O site tem limitações que conheço: esta versão tem as primeiras 72 lições da rota; o progresso das ferramentas de prática fica só no browser; e o som depende de o browser ter uma voz chinesa. No futuro quero completar a rota até ao nível 3 do HSK, guardar todo o progresso na conta, criar missões no fim de cada cidade e um certificado.»',
    'no fim.'),
  ...diapositivo(13, 'Conclusão e perguntas', '0:45',
    '«我们开始吧！ Vamos começar!», o endereço do site e «Obrigada. Perguntas?».',
    '«Com o Chá juntei o que aprendi no curso, PHP, bases de dados, JavaScript, segurança, com uma coisa de que gosto. Termino com a frase que está no fim da página inicial: 我们开始吧, wǒmen kāishǐ ba, vamos começar! Obrigada. Estou disponível para as vossas perguntas.»'),

  // ═══ 3 ═══
  h1('3. Roteiro da demonstração (4:30)'),
  p('Faz sempre pela mesma ordem. Cada passo tem o que fazer, o que dizer e o que fazer se falhar.'),
  tabela([
    ['Tempo', 'O que fazer', 'O que dizer', 'Se falhar'],
    ['0:20', 'Página inicial: descer devagar até «Porquê «Chá»?»', '«Esta é a página inicial. Explica o site e o nome.»', 'Ctrl+F5 se aparecer sem cores'],
    ['0:30', 'Menu, «A rota»: as 6 cidades e a barra de progresso', '«A rota passa por 6 cidades. Com a minha conta, a barra mostra as lições que já fiz.»', 'Se pedir sessão: entrar com a conta de demonstração'],
    ['0:20', 'Abrir Pequim', '«Cada cidade tem o nível HSK, uma descrição e 4 unidades com as lições.»', ''],
    ['1:00', 'Abrir a lição 1. Carregar em «Ouvir» e «Devagar» numa palavra. Fazer 2 perguntas do exercício (uma certa e uma errada)', '«A lição tem explicação, palavras e frases com som. O exercício usa as palavras da própria lição e mostra a correção antes de passar.»', 'Sem som: «O som usa a voz do browser; neste computador não há voz chinesa, mas noutro funciona.» e continua'],
    ['0:30', '«Concluir lição», voltar à rota', '«Ao concluir, a lição fica gravada na base de dados e o progresso sobe.»', 'Se der erro: mostrar uma lição já concluída da conta de demonstração'],
    ['0:40', 'Praticar, «Cartões»: virar um cartão, avaliar «Fácil». Depois «Traços»: «Animar»', '«As ferramentas funcionam sem conta. Os cartões usam revisão espaçada; os traços mostram a ordem de escrita, mesmo sem internet.»', 'Saltar os traços se o tempo estiver a acabar'],
    ['0:20', 'Carregar no botão do modo escuro (lua)', '«Há também modo escuro, com o contraste verificado.»', ''],
    ['0:50', 'phpMyAdmin, tabela utilizadores: mostrar a coluna palavra_passe', '«Na base de dados, a palavra-passe nunca está em texto: está este hash bcrypt, que não se consegue reverter.»', 'Sem phpMyAdmin (site online): saltar este passo'],
  ], [1000, 2500, 2950, 2054]),
  espaco(),
  caixa('Se a demonstração correr mal.', 'Diz com calma o que aconteceu («o som não está a funcionar neste computador») e passa ao passo seguinte. Não fiques a tentar arranjar mais de 20 segundos. O júri avalia o projeto e a forma como resolves problemas, não uma demonstração perfeita.'),

  // ═══ 4 ═══
  h1('4. Versão curta (10 minutos)'),
  p('Se o tempo for de 10 minutos, junta e corta assim:'),
  marca('Diapositivos 2, 3 e 4 juntos em 1:30 (problema, ideia e público).'),
  marca('Diapositivos 5 e 7 juntos em 1:15 (tecnologias e base de dados).'),
  marca('Diapositivo 6 (planeamento): uma frase só, ou saltar.'),
  marca('Demonstração em 3:00: página inicial, lição 1 com som e exercício, concluir, cartões.'),
  marca('Diapositivos 10, 11 e 12: uma frase cada.'),

  // ═══ 5 ═══
  h1('5. Planos B'),
  h2('5.1 Se a apresentação for presencial (notebook da escola)'),
  tabela([
    ['Situação', 'O que fazer'],
    ['Plano A', 'Abrir o site online (InfinityFree) no notebook da escola'],
    ['O site online não abre (sem internet ou alojamento suspenso)', 'Plano B: ligar a pen drive, abrir o XAMPP Portable, ligar o Apache e o MySQL e abrir http://localhost/cha/ (ver Guia de Instalação, secção 4)'],
    ['A pen drive também falha', 'Plano C: abrir o vídeo de demonstração que está na pen drive e na nuvem, e comentá-lo como se fosse ao vivo'],
    ['Nada abre', 'Plano D: os diapositivos de reserva no fim do PowerPoint têm capturas de ecrã de cada passo da demonstração'],
    ['Os diapositivos não abrem', 'Ter também o PDF dos diapositivos na pen drive e no e-mail'],
  ], [3300, 5204]),
  h2('5.2 Se a apresentação for pelo Teams'),
  tabela([
    ['Situação', 'O que fazer'],
    ['Plano A', 'Partilhar o ecrã do teu PC, com o site no XAMPP e os diapositivos abertos'],
    ['A internet cai', 'Ligar o PC à internet do telemóvel (hotspot) e voltar a entrar na reunião'],
    ['O júri não ouve o som do site', 'Ao partilhar o ecrã no Teams, ativar a opção «Incluir som do computador»'],
    ['O PC bloqueia', 'Avisar no chat do Teams pelo telemóvel e pedir 2 minutos'],
    ['Precaução', 'Enviar os diapositivos em PDF ao formador antes da apresentação'],
  ], [3300, 5204]),
  h2('5.3 Problemas na demonstração'),
  tabela([
    ['Problema', 'Solução rápida'],
    ['A página aparece sem cores', 'Ctrl+F5'],
    ['Não há som', 'Explicar que o som usa a voz do browser e continuar; no Chrome ou no Edge com internet costuma funcionar'],
    ['«Não foi possível ligar à base de dados»', 'O MySQL está desligado: ligá-lo no XAMPP e recarregar'],
    ['O login não entra', 'Confirmar o e-mail; ter uma segunda conta de demonstração preparada'],
    ['O texto está pequeno no ecrã grande', 'Ctrl e + para aumentar o zoom'],
    ['Estás a ficar sem tempo', 'Saltar os traços e o phpMyAdmin, e ir para o diapositivo 10'],
  ], [3300, 5204]),

  // ═══ 6 ═══
  h1('6. Ensaios'),
  ...passos([
    'Primeiro ensaio: lê o guião em voz alta com os diapositivos, sem cronómetro.',
    'Segundo ensaio: com cronómetro. Anota os diapositivos em que passas do tempo.',
    'Terceiro ensaio: sem ler o guião, só com os diapositivos. Grava-te no telemóvel.',
    'Quarto ensaio: com alguém a assistir, que te faz 3 perguntas do Guia de Estudo no fim.',
    'Último ensaio (véspera): a apresentação inteira, com a demonstração no computador ou na pen drive que vais usar.',
  ]),
  caixa('Nervos.', 'É normal. Respira fundo antes de começar, fala mais devagar do que te parece natural e lembra-te de que ninguém conhece o Chá melhor do que tu.'),
];

const doc = new Document({ ...configuracao, title: 'Guião de Apresentação · Chá', sections: [{ properties: pagina, children: conteudo }] });
Packer.toBuffer(doc).then((b) => { fs.writeFileSync('gerado.docx', b); console.log('gerado.docx'); });
