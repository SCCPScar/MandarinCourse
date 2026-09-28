-- =====================================================================
-- Chá · Base de dados
-- Eu importo este ficheiro no phpMyAdmin (separador "Importar").
-- Ele cria a base "cha", as 8 tabelas e alguns dados de exemplo.
-- =====================================================================

-- Eu aviso o MySQL de que este ficheiro está em UTF-8.
-- Sem esta linha, os caracteres chineses podem ficar embaralhados (ex.: "è‘¡è„").
SET NAMES utf8mb4;

-- Eu apago a base antiga (se existir) para poder importar de novo sem erros.
DROP DATABASE IF EXISTS cha;

-- Eu uso utf8mb4 para os caracteres chineses (你好) e os acentos ficarem certos.
CREATE DATABASE cha
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cha;


-- ---------------------------------------------------------------------
-- 1. UTILIZADORES
-- Aqui eu guardo quem tem conta no site.
-- A palavra-passe nunca fica em texto: eu guardo só o "hash" feito pelo PHP
-- com password_hash(). Por isso o campo tem 255 caracteres.
-- ---------------------------------------------------------------------
CREATE TABLE utilizadores (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome            VARCHAR(80)  NOT NULL,
  email           VARCHAR(120) NOT NULL UNIQUE,
  palavra_passe   VARCHAR(255) NOT NULL,  -- só o hash
  nivel           ENUM('zero', 'basico', 'intermedio', 'avancado') NOT NULL DEFAULT 'zero',
  minutos_por_dia TINYINT UNSIGNED NOT NULL DEFAULT 60,
  sequencia_dias  SMALLINT UNSIGNED NOT NULL DEFAULT 0,  -- dias seguidos a estudar
  ultimo_estudo   DATE NULL,
  consentimento   DATETIME NOT NULL,  -- quando aceitou a política de privacidade (RGPD)
  criado_em       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ---------------------------------------------------------------------
-- 2. CIDADES
-- As 6 paradas da rota de 12 meses.
-- ---------------------------------------------------------------------
CREATE TABLE cidades (
  id       TINYINT UNSIGNED PRIMARY KEY,
  ordem    TINYINT UNSIGNED NOT NULL,
  nome     VARCHAR(40) NOT NULL,
  nome_zh  VARCHAR(10) NOT NULL,
  meses    VARCHAR(10) NOT NULL,
  tema     VARCHAR(60) NOT NULL,
  capa     VARCHAR(10) NULL     -- início do nome da foto de capa (ex.: "bj0"); NULL se ainda não houver
) ENGINE=InnoDB;


-- ---------------------------------------------------------------------
-- 3. UNIDADES
-- Cada cidade tem 4 unidades. A chave estrangeira liga a unidade à cidade.
-- ---------------------------------------------------------------------
CREATE TABLE unidades (
  id         SMALLINT UNSIGNED PRIMARY KEY,
  cidade_id  TINYINT UNSIGNED NOT NULL,
  codigo     VARCHAR(5)  NOT NULL,   -- ex.: "1.2"
  titulo     VARCHAR(60) NOT NULL,
  foto       VARCHAR(30) NULL,   -- início do nome da foto (ex.: "bj2-cumprimentos"); NULL se ainda não houver
  FOREIGN KEY (cidade_id) REFERENCES cidades(id)
) ENGINE=InnoDB;


-- ---------------------------------------------------------------------
-- 4. LIÇÕES
-- Cada unidade tem várias lições curtas.
-- ---------------------------------------------------------------------
CREATE TABLE licoes (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  unidade_id  SMALLINT UNSIGNED NOT NULL,
  ordem       TINYINT UNSIGNED NOT NULL,
  titulo      VARCHAR(80) NOT NULL,
  minutos     TINYINT UNSIGNED NOT NULL DEFAULT 15,
  explicacao  TEXT NULL,   -- texto curto que explica o tema da lição
  FOREIGN KEY (unidade_id) REFERENCES unidades(id)
) ENGINE=InnoDB;


-- ---------------------------------------------------------------------
-- 5. PALAVRAS
-- O vocabulário. Cada palavra aparece pela primeira vez numa lição.
-- ---------------------------------------------------------------------
CREATE TABLE palavras (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  licao_id   INT UNSIGNED NOT NULL,
  hanzi      VARCHAR(20)  NOT NULL,
  pinyin     VARCHAR(40)  NOT NULL,
  traducao   VARCHAR(100) NOT NULL,
  FOREIGN KEY (licao_id) REFERENCES licoes(id)
) ENGINE=InnoDB;


-- ---------------------------------------------------------------------
-- 5B. FRASES
-- Frases de exemplo de cada lição, para o aluno ouvir as palavras em contexto.
-- ---------------------------------------------------------------------
CREATE TABLE frases (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  licao_id   INT UNSIGNED NOT NULL,
  hanzi      VARCHAR(60)  NOT NULL,
  pinyin     VARCHAR(120) NOT NULL,
  traducao   VARCHAR(160) NOT NULL,
  FOREIGN KEY (licao_id) REFERENCES licoes(id)
) ENGINE=InnoDB;


-- ---------------------------------------------------------------------
-- 6. PROGRESSO
-- Que lições cada utilizador já terminou (relação N:N entre utilizadores e lições).
-- A chave primária tem duas colunas: o mesmo utilizador não termina a mesma lição duas vezes.
-- ON DELETE CASCADE: se eu eliminar o utilizador, o progresso dele também é eliminado (RGPD).
-- ---------------------------------------------------------------------
CREATE TABLE progresso (
  utilizador_id    INT UNSIGNED NOT NULL,
  licao_id      INT UNSIGNED NOT NULL,
  pontuacao     TINYINT UNSIGNED NOT NULL,   -- de 0 a 100
  concluida_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (utilizador_id, licao_id),
  FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
  FOREIGN KEY (licao_id)   REFERENCES licoes(id)
) ENGINE=InnoDB;


-- ---------------------------------------------------------------------
-- 7. REVISÕES (revisão espaçada / SRS)
-- Para cada palavra que o utilizador já estudou, eu guardo quando a deve rever.
-- Se ele acerta, o intervalo aumenta; se erra, volta a 1 dia.
-- ---------------------------------------------------------------------
CREATE TABLE revisoes (
  utilizador_id       INT UNSIGNED NOT NULL,
  palavra_id       INT UNSIGNED NOT NULL,
  intervalo_dias   SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  proxima_revisao  DATE NOT NULL,
  acertos          SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (utilizador_id, palavra_id),
  FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
  FOREIGN KEY (palavra_id) REFERENCES palavras(id)
) ENGINE=InnoDB;


-- ---------------------------------------------------------------------
-- 8. CADERNO
-- As palavras que o utilizador guardou no caderno pessoal.
-- ---------------------------------------------------------------------
CREATE TABLE caderno (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  utilizador_id  INT UNSIGNED NOT NULL,
  hanzi       VARCHAR(20)  NOT NULL,
  pinyin      VARCHAR(40)  NOT NULL,
  traducao    VARCHAR(100) NOT NULL,
  criado_em   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- =====================================================================
-- DADOS DE EXEMPLO
-- Eu não crio utilizadores aqui: eles são criados na página de registo,
-- porque é o PHP que faz o hash da palavra-passe.
-- =====================================================================

-- As 6 cidades da rota
INSERT INTO cidades (id, ordem, nome, nome_zh, meses, tema, capa) VALUES
  (1, 1, 'Pequim',   '北京', '1–2',   'Os sons do mandarim', 'bj0'),
  (2, 2, 'Xi''an',   '西安', '3–4',   'Comer e comprar',     'xa0'),
  (3, 3, 'Chengdu',  '成都', '5–6',   'O dia a dia',         'cd0'),
  (4, 4, 'Guilin',   '桂林', '7–8',   'Viajar',              NULL),
  (5, 5, 'Hangzhou', '杭州', '9–10',  'Contar e opinar',     NULL),
  (6, 6, 'Xangai',   '上海', '11–12', 'Trabalho e cidade',   NULL);

-- As 24 unidades (4 por cidade)
INSERT INTO unidades (id, cidade_id, codigo, titulo, foto) VALUES
  (1,  1, '1.1', 'Pinyin e tons', 'bj1-pinyin-tons'),
  (2,  1, '1.2', 'Olá, eu sou…', 'bj2-cumprimentos'),
  (3,  1, '1.3', 'Números e família', 'bj3-familia'),
  (4,  1, '1.4', 'Datas e horas', 'bj4-horas'),
  (5,  2, '2.1', 'Na banca de comida', 'xa1-banca'),
  (6,  2, '2.2', 'Quanto custa?', 'xa2-precos'),
  (7,  2, '2.3', 'Onde fica?', 'xa3-muralha'),
  (8,  2, '2.4', 'Pagar e planear', 'xa4-pagar'),
  (9,  3, '3.1', 'Minha rotina', 'cd1-rotina'),
  (10, 3, '3.2', 'Gostos e tempo livre', 'cd2-mahjong'),
  (11, 3, '3.3', 'Convites e planos', 'cd3-hotpot'),
  (12, 3, '3.4', 'Tempo e mensagens', 'cd4-chuva'),
  (13, 4, '4.1', 'Bilhetes e comboios', NULL),
  (14, 4, '4.2', 'No hotel', NULL),
  (15, 4, '4.3', 'Descrever lugares', NULL),
  (16, 4, '4.4', 'Emergências', NULL),
  (17, 5, '5.1', 'Comparar', NULL),
  (18, 5, '5.2', 'Contar o passado', NULL),
  (19, 5, '5.3', 'Dar opinião', NULL),
  (20, 5, '5.4', 'Compras online e serviços', NULL),
  (21, 6, '6.1', 'Casa e serviços', NULL),
  (22, 6, '6.2', 'No trabalho', NULL),
  (23, 6, '6.3', 'Entrevista de emprego', NULL),
  (24, 6, '6.4', 'Ler a cidade', 'sh4-placas');

-- As 12 lições de Pequim (3 por unidade)
INSERT INTO licoes (id, unidade_id, ordem, titulo, minutos, explicacao) VALUES
  (1, 1, 1, 'Os 4 tons e o tom neutro', 15, 'Em mandarim, cada sílaba tem um tom. A mesma sílaba "ma" com tons diferentes dá palavras diferentes: mā (mãe), má (cânhamo), mǎ (cavalo) e mà (ralhar). O 1.º tom é alto e plano, o 2.º sobe, o 3.º desce e volta a subir e o 4.º cai de repente. O tom neutro é curto e leve, sem marca. Ouve cada palavra e repete em voz alta.'),
  (2, 1, 2, 'Iniciais do pinyin', 15, 'As iniciais são as consoantes do início da sílaba. Muitas parecem-se com as portuguesas, mas algumas são diferentes: o x soa como o "ch" de "chá", o q como o "tch" de "tchim-tchim", o h como o "r" de "rato", e zh, ch e sh dizem-se com a língua enrolada para trás.'),
  (3, 1, 3, 'Finais do pinyin', 15, 'As finais são a parte das vogais da sílaba. O ü diz-se com os lábios em bico, como o "u" francês. Nas finais com n, o "n" pronuncia-se no fim, sem som nasal. Nas finais com ng, o som fica no fundo da garganta, como no inglês "song".'),
  (4, 2, 1, 'Cumprimentos', 15, '你好 (nǐ hǎo) é o "olá" do dia a dia. Com pessoas mais velhas, professores ou clientes, usa 您好 (nín hǎo), que é mais educado. Repara que 你 e 好 são os dois do 3.º tom, por isso o 你 soa como 2.º tom: ní hǎo.'),
  (5, 2, 2, 'Qual é o teu nome?', 15, 'Para perguntar o nome usa 你叫什么名字？ (à letra, "tu chamas-te que nome?"). A resposta é 我叫 + o teu nome. Em mandarim, a palavra interrogativa fica no mesmo sítio onde fica a resposta.'),
  (6, 2, 3, 'De onde és?', 15, 'Para dizer a nacionalidade usa 是 (shì, "ser") + país + 人 (rén, pessoa). Para fazer uma pergunta de sim ou não, basta pôr 吗 no fim da frase. Para devolver a pergunta ("e tu?"), usa 呢.'),
  (7, 3, 1, 'Os números de 0 a 10', 15, 'Os números de 0 a 10 são a base de todos os outros. Aprende-os com o tom certo. O 一 (yī) muda de tom conforme a palavra seguinte, mas quando contas diz-se sempre yī.'),
  (8, 3, 2, 'Até 100 e a idade', 15, 'Os números até 100 formam-se como uma conta: 十一 = 10 + 1 = 11, 二十 = 2 × 10 = 20, 二十五 = 25. Para perguntar a idade a uma criança diz-se 你几岁？. A um adulto, é mais educado 你多大？. Na resposta, usa o número + 岁.'),
  (9, 3, 3, 'A minha família', 15, 'Para dizer quantas pessoas tens na família usa 有 (ter) com o classificador 个: 我有一个哥哥. Para negar, usa 没有, e nunca 不有. O 的 (de) indica posse: 我的妈妈 = a minha mãe.'),
  (10, 4, 1, 'Os dias da semana', 15, 'Os dias da semana são fáceis: 星期 (semana) + um número. Segunda-feira é 星期一, terça-feira é 星期二 e assim por diante até sábado, 星期六. O domingo é 星期天. Para perguntar o dia, troca o número por 几: 今天星期几？'),
  (11, 4, 2, 'As datas', 15, 'Em chinês a data vai do maior para o mais pequeno: ano, mês e dia. Os meses são número + 月: 九月 é setembro. O dia é número + 号. Para perguntar a data diz-se 今天几月几号？'),
  (12, 4, 3, 'As horas', 15, 'As horas dizem-se com 点 (diǎn), os minutos com 分 (fēn) e a meia hora com 半 (bàn). Para as duas horas usa-se 两点, e não 二点. A ordem da frase é: tempo, depois o que fazes. Diz-se "eu à tarde às duas horas tenho aula": 我下午两点上课.');

-- Palavras novas de cada lição
INSERT INTO palavras (licao_id, hanzi, pinyin, traducao) VALUES
  (1, '妈', 'mā', 'mãe'),
  (1, '麻', 'má', 'cânhamo / dormente'),
  (1, '马', 'mǎ', 'cavalo'),
  (1, '骂', 'mà', 'ralhar'),
  (1, '吗', 'ma', 'partícula de pergunta'),
  (2, '八', 'bā', 'oito'),
  (2, '大', 'dà', 'grande'),
  (2, '高', 'gāo', 'alto'),
  (2, '鸡', 'jī', 'galinha'),
  (2, '七', 'qī', 'sete'),
  (2, '心', 'xīn', 'coração'),
  (2, '中', 'zhōng', 'meio'),
  (2, '吃', 'chī', 'comer'),
  (2, '书', 'shū', 'livro'),
  (2, '人', 'rén', 'pessoa'),
  (3, '爱', 'ài', 'amar / amor'),
  (3, '杯', 'bēi', 'copo'),
  (3, '好', 'hǎo', 'bom / bem'),
  (3, '狗', 'gǒu', 'cão'),
  (3, '饭', 'fàn', 'arroz / refeição'),
  (3, '名', 'míng', 'nome'),
  (3, '绿', 'lǜ', 'verde'),
  (3, '鱼', 'yú', 'peixe'),
  (4, '你好', 'nǐ hǎo', 'olá'),
  (4, '您好', 'nín hǎo', 'olá (formal)'),
  (4, '谢谢', 'xièxie', 'obrigado'),
  (4, '不客气', 'bú kèqi', 'de nada'),
  (4, '对不起', 'duìbuqǐ', 'desculpa'),
  (4, '再见', 'zàijiàn', 'adeus'),
  (5, '我', 'wǒ', 'eu'),
  (5, '你', 'nǐ', 'tu'),
  (5, '您', 'nín', 'o senhor / a senhora'),
  (5, '叫', 'jiào', 'chamar-se'),
  (5, '什么', 'shénme', 'o quê / que'),
  (5, '名字', 'míngzi', 'nome'),
  (6, '是', 'shì', 'ser'),
  (6, '吗', 'ma', 'partícula de pergunta (sim ou não)'),
  (6, '呢', 'ne', 'e tu? (partícula)'),
  (6, '哪', 'nǎ', 'qual'),
  (6, '国', 'guó', 'país'),
  (6, '中国人', 'Zhōngguó rén', 'chinês / chinesa'),
  (6, '巴西人', 'Bāxī rén', 'brasileiro / brasileira'),
  (6, '葡萄牙人', 'Pútáoyá rén', 'português / portuguesa'),
  (7, '零', 'líng', 'zero'),
  (7, '一', 'yī', 'um'),
  (7, '二', 'èr', 'dois'),
  (7, '三', 'sān', 'três'),
  (7, '四', 'sì', 'quatro'),
  (7, '五', 'wǔ', 'cinco'),
  (7, '六', 'liù', 'seis'),
  (7, '七', 'qī', 'sete'),
  (7, '八', 'bā', 'oito'),
  (7, '九', 'jiǔ', 'nove'),
  (7, '十', 'shí', 'dez'),
  (8, '十一', 'shíyī', 'onze'),
  (8, '二十', 'èrshí', 'vinte'),
  (8, '一百', 'yìbǎi', 'cem'),
  (8, '岁', 'suì', 'anos (de idade)'),
  (8, '几', 'jǐ', 'quantos (números pequenos)'),
  (8, '多大', 'duō dà', 'que idade'),
  (9, '爸爸', 'bàba', 'pai'),
  (9, '妈妈', 'māma', 'mãe'),
  (9, '哥哥', 'gēge', 'irmão mais velho'),
  (9, '姐姐', 'jiějie', 'irmã mais velha'),
  (9, '弟弟', 'dìdi', 'irmão mais novo'),
  (9, '妹妹', 'mèimei', 'irmã mais nova'),
  (9, '家', 'jiā', 'casa / família'),
  (9, '有', 'yǒu', 'ter'),
  (9, '没有', 'méiyǒu', 'não ter'),
  (9, '个', 'gè', 'classificador geral'),
  (9, '的', 'de', 'partícula de posse'),
  (10, '星期', 'xīngqī', 'semana'),
  (10, '星期一', 'xīngqīyī', 'segunda-feira'),
  (10, '星期三', 'xīngqīsān', 'quarta-feira'),
  (10, '星期六', 'xīngqīliù', 'sábado'),
  (10, '星期天', 'xīngqītiān', 'domingo'),
  (10, '今天', 'jīntiān', 'hoje'),
  (10, '明天', 'míngtiān', 'amanhã'),
  (10, '昨天', 'zuótiān', 'ontem'),
  (11, '年', 'nián', 'ano'),
  (11, '月', 'yuè', 'mês'),
  (11, '号', 'hào', 'dia (do mês)'),
  (11, '生日', 'shēngrì', 'aniversário'),
  (12, '点', 'diǎn', 'hora (no relógio)'),
  (12, '半', 'bàn', 'meia'),
  (12, '分', 'fēn', 'minuto'),
  (12, '现在', 'xiànzài', 'agora'),
  (12, '上午', 'shàngwǔ', 'manhã'),
  (12, '下午', 'xiàwǔ', 'tarde'),
  (12, '两', 'liǎng', 'dois (a contar coisas)');

-- Frases de exemplo de cada lição
INSERT INTO frases (licao_id, hanzi, pinyin, traducao) VALUES
  (1, '妈妈骂马吗？', 'Māma mà mǎ ma?', 'A mãe ralha com o cavalo?'),
  (2, '我吃鸡。', 'Wǒ chī jī.', 'Eu como galinha.'),
  (2, '中国人很高。', 'Zhōngguó rén hěn gāo.', 'Os chineses são altos.'),
  (3, '我爱我的狗。', 'Wǒ ài wǒ de gǒu.', 'Adoro o meu cão.'),
  (3, '我吃鱼和饭。', 'Wǒ chī yú hé fàn.', 'Eu como peixe e arroz.'),
  (4, '你好！', 'Nǐ hǎo!', 'Olá!'),
  (4, '您好，老师！', 'Nín hǎo, lǎoshī!', 'Olá, professor!'),
  (4, '谢谢！不客气。', 'Xièxie! Bú kèqi.', 'Obrigado! De nada.'),
  (4, '对不起！', 'Duìbuqǐ!', 'Desculpa!'),
  (4, '再见！', 'Zàijiàn!', 'Adeus!'),
  (5, '你叫什么名字？', 'Nǐ jiào shénme míngzi?', 'Como te chamas?'),
  (5, '我叫玛丽亚。', 'Wǒ jiào Mǎlìyà.', 'Chamo-me Maria.'),
  (5, '您叫什么名字？', 'Nín jiào shénme míngzi?', 'Como se chama? (formal)'),
  (6, '你是哪国人？', 'Nǐ shì nǎ guó rén?', 'De que país és?'),
  (6, '我是葡萄牙人。', 'Wǒ shì Pútáoyá rén.', 'Sou português.'),
  (6, '你是巴西人吗？', 'Nǐ shì Bāxī rén ma?', 'És brasileiro?'),
  (6, '不是，我是葡萄牙人。你呢？', 'Bú shì, wǒ shì Pútáoyá rén. Nǐ ne?', 'Não, sou português. E tu?'),
  (6, '我是中国人。', 'Wǒ shì Zhōngguó rén.', 'Sou chinês.'),
  (7, '一二三四五', 'yī èr sān sì wǔ', 'um, dois, três, quatro, cinco'),
  (7, '六七八九十', 'liù qī bā jiǔ shí', 'seis, sete, oito, nove, dez'),
  (8, '你几岁？', 'Nǐ jǐ suì?', 'Quantos anos tens? (a uma criança)'),
  (8, '你多大？', 'Nǐ duō dà?', 'Que idade tens?'),
  (8, '我二十五岁。', 'Wǒ èrshíwǔ suì.', 'Tenho vinte e cinco anos.'),
  (9, '我家有四个人。', 'Wǒ jiā yǒu sì ge rén.', 'Na minha família somos quatro.'),
  (9, '我有一个哥哥。', 'Wǒ yǒu yí ge gēge.', 'Tenho um irmão mais velho.'),
  (9, '我没有妹妹。', 'Wǒ méiyǒu mèimei.', 'Não tenho irmãs mais novas.'),
  (9, '这是我的妈妈。', 'Zhè shì wǒ de māma.', 'Esta é a minha mãe.'),
  (10, '今天星期几？', 'Jīntiān xīngqī jǐ?', 'Que dia da semana é hoje?'),
  (10, '今天星期三。', 'Jīntiān xīngqīsān.', 'Hoje é quarta-feira.'),
  (10, '明天星期四。', 'Míngtiān xīngqīsì.', 'Amanhã é quinta-feira.'),
  (11, '今天几月几号？', 'Jīntiān jǐ yuè jǐ hào?', 'Que dia é hoje?'),
  (11, '今天九月二十八号。', 'Jīntiān jiǔ yuè èrshíbā hào.', 'Hoje é dia 28 de setembro.'),
  (11, '我的生日是五月三号。', 'Wǒ de shēngrì shì wǔ yuè sān hào.', 'O meu aniversário é a 3 de maio.'),
  (12, '现在几点？', 'Xiànzài jǐ diǎn?', 'Que horas são?'),
  (12, '现在三点半。', 'Xiànzài sān diǎn bàn.', 'São três e meia.'),
  (12, '我下午两点上课。', 'Wǒ xiàwǔ liǎng diǎn shàngkè.', 'Tenho aula às duas da tarde.');
