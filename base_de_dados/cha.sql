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
  (9,  3, '3.1', 'A minha rotina', 'cd1-rotina'),
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

-- As lições de Pequim e de Xi'an (3 por unidade)
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
  (12, 4, 3, 'As horas', 15, 'As horas dizem-se com 点 (diǎn), os minutos com 分 (fēn) e a meia hora com 半 (bàn). Para as duas horas usa-se 两点, e não 二点. A ordem da frase é: tempo, depois o que fazes. Diz-se "eu à tarde às duas horas tenho aula": 我下午两点上课.'),
  (13, 5, 1, 'Pedir comida', 15, 'Na banca, para pedir basta dizer 我要 (wǒ yào, "eu quero") + a quantidade + o que queres: 我要一个肉夹馍. Para seres mais educado, começa com 请给我 (qǐng gěi wǒ, "por favor, dá-me"). O 肉夹馍 é o petisco mais famoso de Xi''an: carne estufada dentro de um pão achatado.'),
  (14, 5, 2, 'Comer e beber', 15, 'Os verbos 吃 (chī, comer) e 喝 (hē, beber) vêm antes da comida ou da bebida, tal como em português. Para dizer o que te apetece usa 想 (xiǎng) + verbo: 我想喝茶 = apetece-me beber chá. Em Xi''an come-se muita massa, 面 (miàn), e muitos 饺子 (jiǎozi), uns pastéis cozidos recheados.'),
  (15, 5, 3, 'Os sabores', 15, 'Para descrever a comida usa 很 (hěn) + adjetivo: 很辣 = muito picante. Em mandarim não se põe 是 antes do adjetivo: diz-se 这个很好吃, e nunca 这个是好吃. Para dizer "demasiado" usa 太…了: 太辣了! Se não queres picante, diz 不要辣.'),
  (16, 6, 1, 'O dinheiro', 15, 'A moeda da China é o 人民币 (rénmínbì) e a unidade é o 元 (yuán). Na conversa, porém, diz-se 块 (kuài). A décima parte do yuan é o 毛 (máo). Para perguntar o preço diz-se 多少钱？ (à letra, "quanto dinheiro?"). A resposta é número + 块: 十五块.'),
  (17, 6, 2, 'Contar coisas', 15, 'Em mandarim, entre o número e a coisa aparece sempre um classificador. O mais comum é 个 (gè), mas muitas coisas têm o seu: 一杯茶 (um copo de chá), 一碗面 (uma tigela de massa), 一瓶水 (uma garrafa de água). Com classificadores, o 2 diz-se 两 e não 二: 两碗面.'),
  (18, 6, 3, 'Regatear', 15, 'Nos mercados de rua é normal negociar o preço, mas nas lojas com o preço marcado não. Diz 太贵了 (é demasiado caro) e propõe um valor com 可以吗？ ("pode ser?"). 便宜一点儿 quer dizer "um pouco mais barato". Se o preço não baixar, agradece com um sorriso e segue em frente.'),
  (19, 7, 1, 'Lugares da cidade', 15, 'Para perguntar onde fica um sítio usa 在哪儿？ (zài nǎr?): 厕所在哪儿？ = Onde fica a casa de banho? A resposta também usa 在: 在这儿 (aqui) ou 在那儿 (ali). Em Xi''an vais ouvir muitas vezes 城墙 (chéngqiáng), a muralha antiga que rodeia o centro da cidade.'),
  (20, 7, 2, 'Direções', 15, 'As palavras de posição vêm depois do sítio de referência: 银行旁边 = ao lado do banco (à letra, "banco lado"). Para indicar o caminho usa 往 (wǎng, "em direção a") + direção + verbo: 往左拐 = vira à esquerda, 往前走 = segue em frente.'),
  (21, 7, 3, 'Longe ou perto', 15, 'Para falar de distância usa 离 (lí): A 离 B 很近 = A fica perto de B. Para perguntar o caminho diz 去…怎么走？ ("para ir a… como se anda?"). O tempo que demora diz-se com 分钟 (minutos): 走路十分钟 = dez minutos a pé.'),
  (22, 8, 1, 'Pagar com o telemóvel', 15, 'Na China quase tudo se paga com o telemóvel, através do 微信 (Wēixìn, WeChat) ou do 支付宝 (Zhīfùbǎo, Alipay). O vendedor mostra um código QR e tu 扫码 (sǎo mǎ, lês o código). Mesmo assim, leva sempre algum 现金 (notas e moedas) para as bancas mais pequenas.'),
  (23, 8, 2, 'Planear o dia', 15, 'Para dizer o que queres fazer usa 想 + 去 + lugar. Para pôr as coisas por ordem usa 先…然后… (primeiro… depois…). Lembra-te de que o tempo vem antes do verbo: 明天上午我想去看兵马俑 = amanhã de manhã quero ir ver os Guerreiros de Terracota.'),
  (24, 8, 3, 'Pedir ajuda', 15, 'Quando não percebes, não faz mal: diz 我听不懂 (não percebo) e pede 请说慢一点儿 (fala mais devagar, por favor). Para fazer uma pergunta a um desconhecido começa com 请问 ("posso perguntar?"). E 可以帮我吗？ quer dizer "podes ajudar-me?".');

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
  (12, '两', 'liǎng', 'dois (a contar coisas)'),
  (13, '要', 'yào', 'querer'),
  (13, '请', 'qǐng', 'por favor'),
  (13, '给', 'gěi', 'dar'),
  (13, '肉夹馍', 'ròujiāmó', 'pão recheado com carne'),
  (13, '这个', 'zhège', 'este / isto'),
  (13, '那个', 'nàge', 'aquele / aquilo'),
  (13, '老板', 'lǎobǎn', 'dono (da banca ou loja)'),
  (14, '吃', 'chī', 'comer'),
  (14, '喝', 'hē', 'beber'),
  (14, '想', 'xiǎng', 'apetecer / querer'),
  (14, '水', 'shuǐ', 'água'),
  (14, '茶', 'chá', 'chá'),
  (14, '面', 'miàn', 'massa'),
  (14, '饺子', 'jiǎozi', 'pastéis cozidos (jiaozi)'),
  (14, '米饭', 'mǐfàn', 'arroz cozido'),
  (15, '很', 'hěn', 'muito'),
  (15, '太', 'tài', 'demasiado'),
  (15, '辣', 'là', 'picante'),
  (15, '甜', 'tián', 'doce'),
  (15, '咸', 'xián', 'salgado'),
  (15, '好吃', 'hǎochī', 'saboroso (comida)'),
  (15, '好喝', 'hǎohē', 'saboroso (bebida)'),
  (15, '不要', 'bú yào', 'não querer'),
  (16, '钱', 'qián', 'dinheiro'),
  (16, '多少', 'duōshao', 'quanto'),
  (16, '块', 'kuài', 'yuan (na conversa)'),
  (16, '元', 'yuán', 'yuan (por escrito)'),
  (16, '毛', 'máo', 'dez cêntimos de yuan'),
  (16, '人民币', 'rénmínbì', 'renminbi (moeda chinesa)'),
  (16, '一共', 'yígòng', 'no total'),
  (17, '杯', 'bēi', 'copo (classificador)'),
  (17, '碗', 'wǎn', 'tigela (classificador)'),
  (17, '瓶', 'píng', 'garrafa (classificador)'),
  (17, '斤', 'jīn', 'meio quilo'),
  (17, '张', 'zhāng', 'classificador de coisas planas'),
  (17, '苹果', 'píngguǒ', 'maçã'),
  (18, '贵', 'guì', 'caro'),
  (18, '便宜', 'piányi', 'barato'),
  (18, '一点儿', 'yìdiǎnr', 'um pouco'),
  (18, '可以', 'kěyǐ', 'poder / pode ser'),
  (18, '买', 'mǎi', 'comprar'),
  (18, '卖', 'mài', 'vender'),
  (18, '吧', 'ba', 'partícula de sugestão'),
  (19, '在', 'zài', 'estar em / ficar'),
  (19, '哪儿', 'nǎr', 'onde'),
  (19, '这儿', 'zhèr', 'aqui'),
  (19, '那儿', 'nàr', 'ali'),
  (19, '厕所', 'cèsuǒ', 'casa de banho'),
  (19, '地铁站', 'dìtiězhàn', 'estação de metro'),
  (19, '银行', 'yínháng', 'banco'),
  (19, '城墙', 'chéngqiáng', 'muralha da cidade'),
  (20, '左', 'zuǒ', 'esquerda'),
  (20, '右', 'yòu', 'direita'),
  (20, '前', 'qián', 'frente'),
  (20, '后面', 'hòumiàn', 'atrás'),
  (20, '旁边', 'pángbiān', 'ao lado'),
  (20, '往', 'wǎng', 'em direção a'),
  (20, '拐', 'guǎi', 'virar'),
  (20, '一直', 'yìzhí', 'sempre a direito'),
  (21, '远', 'yuǎn', 'longe'),
  (21, '近', 'jìn', 'perto'),
  (21, '离', 'lí', 'a (distância de)'),
  (21, '去', 'qù', 'ir'),
  (21, '走', 'zǒu', 'andar / ir'),
  (21, '怎么', 'zěnme', 'como'),
  (21, '分钟', 'fēnzhōng', 'minutos (de duração)'),
  (21, '走路', 'zǒulù', 'ir a pé'),
  (21, '打车', 'dǎchē', 'apanhar um táxi'),
  (22, '手机', 'shǒujī', 'telemóvel'),
  (22, '微信', 'Wēixìn', 'WeChat'),
  (22, '支付宝', 'Zhīfùbǎo', 'Alipay'),
  (22, '扫码', 'sǎo mǎ', 'ler o código QR'),
  (22, '付钱', 'fù qián', 'pagar'),
  (22, '现金', 'xiànjīn', 'notas e moedas'),
  (22, '用', 'yòng', 'usar'),
  (23, '先', 'xiān', 'primeiro'),
  (23, '然后', 'ránhòu', 'depois'),
  (23, '看', 'kàn', 'ver'),
  (23, '兵马俑', 'Bīngmǎyǒng', 'Guerreiros de Terracota'),
  (23, '晚上', 'wǎnshang', 'à noite'),
  (23, '我们', 'wǒmen', 'nós'),
  (23, '一起', 'yìqǐ', 'juntos'),
  (24, '请问', 'qǐngwèn', 'posso perguntar?'),
  (24, '帮', 'bāng', 'ajudar'),
  (24, '听', 'tīng', 'ouvir'),
  (24, '懂', 'dǒng', 'perceber'),
  (24, '说', 'shuō', 'falar / dizer'),
  (24, '慢', 'màn', 'devagar'),
  (24, '再', 'zài', 'outra vez'),
  (24, '中文', 'Zhōngwén', 'chinês (língua)');

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
  (12, '我下午两点上课。', 'Wǒ xiàwǔ liǎng diǎn shàngkè.', 'Tenho aula às duas da tarde.'),
  (13, '老板，我要一个肉夹馍。', 'Lǎobǎn, wǒ yào yí ge ròujiāmó.', 'Queria um pão com carne, se faz favor.'),
  (13, '请给我这个。', 'Qǐng gěi wǒ zhège.', 'Dá-me este, por favor.'),
  (13, '你要什么？', 'Nǐ yào shénme?', 'O que queres?'),
  (14, '我想喝茶。', 'Wǒ xiǎng hē chá.', 'Apetece-me beber chá.'),
  (14, '你想吃什么？', 'Nǐ xiǎng chī shénme?', 'O que te apetece comer?'),
  (14, '我想吃饺子。', 'Wǒ xiǎng chī jiǎozi.', 'Apetece-me comer jiaozi.'),
  (15, '这个很好吃！', 'Zhège hěn hǎochī!', 'Isto é muito bom!'),
  (15, '太辣了！', 'Tài là le!', 'É demasiado picante!'),
  (15, '不要辣，谢谢。', 'Bú yào là, xièxie.', 'Sem picante, obrigado.'),
  (16, '这个多少钱？', 'Zhège duōshao qián?', 'Quanto custa isto?'),
  (16, '十五块。', 'Shíwǔ kuài.', 'Quinze yuan.'),
  (16, '一共多少钱？', 'Yígòng duōshao qián?', 'Quanto é no total?'),
  (17, '我要两碗面。', 'Wǒ yào liǎng wǎn miàn.', 'Quero duas tigelas de massa.'),
  (17, '一瓶水多少钱？', 'Yì píng shuǐ duōshao qián?', 'Quanto custa uma garrafa de água?'),
  (17, '苹果一斤五块。', 'Píngguǒ yì jīn wǔ kuài.', 'As maçãs custam cinco yuan o meio quilo.'),
  (18, '太贵了！', 'Tài guì le!', 'É demasiado caro!'),
  (18, '便宜一点儿吧。', 'Piányi yìdiǎnr ba.', 'Faz um pouco mais barato.'),
  (18, '二十块，可以吗？', 'Èrshí kuài, kěyǐ ma?', 'Vinte yuan, pode ser?'),
  (19, '请问，厕所在哪儿？', 'Qǐngwèn, cèsuǒ zài nǎr?', 'Desculpe, onde fica a casa de banho?'),
  (19, '地铁站在那儿。', 'Dìtiězhàn zài nàr.', 'A estação de metro é ali.'),
  (19, '银行在哪儿？', 'Yínháng zài nǎr?', 'Onde fica o banco?'),
  (20, '往左拐。', 'Wǎng zuǒ guǎi.', 'Vira à esquerda.'),
  (20, '一直往前走。', 'Yìzhí wǎng qián zǒu.', 'Segue sempre em frente.'),
  (20, '银行在地铁站旁边。', 'Yínháng zài dìtiězhàn pángbiān.', 'O banco fica ao lado da estação de metro.'),
  (21, '城墙离这儿远吗？', 'Chéngqiáng lí zhèr yuǎn ma?', 'A muralha fica longe daqui?'),
  (21, '不远，走路十分钟。', 'Bù yuǎn, zǒulù shí fēnzhōng.', 'Não, são dez minutos a pé.'),
  (21, '去地铁站怎么走？', 'Qù dìtiězhàn zěnme zǒu?', 'Como se vai para a estação de metro?'),
  (22, '可以用支付宝吗？', 'Kěyǐ yòng Zhīfùbǎo ma?', 'Posso pagar com Alipay?'),
  (22, '请扫这个码。', 'Qǐng sǎo zhège mǎ.', 'Lê este código, por favor.'),
  (22, '我没有现金。', 'Wǒ méiyǒu xiànjīn.', 'Não tenho notas nem moedas.'),
  (23, '明天上午我想去看兵马俑。', 'Míngtiān shàngwǔ wǒ xiǎng qù kàn Bīngmǎyǒng.', 'Amanhã de manhã quero ir ver os Guerreiros de Terracota.'),
  (23, '我们先吃饭，然后去城墙。', 'Wǒmen xiān chīfàn, ránhòu qù chéngqiáng.', 'Primeiro comemos e depois vamos à muralha.'),
  (23, '晚上一起去吃饺子吧！', 'Wǎnshang yìqǐ qù chī jiǎozi ba!', 'À noite vamos juntos comer jiaozi!'),
  (24, '我听不懂。', 'Wǒ tīng bu dǒng.', 'Não percebo.'),
  (24, '请说慢一点儿。', 'Qǐng shuō màn yìdiǎnr.', 'Fala mais devagar, por favor.'),
  (24, '请再说一遍。', 'Qǐng zài shuō yí biàn.', 'Repete, por favor.'),
  (24, '可以帮我吗？', 'Kěyǐ bāng wǒ ma?', 'Podes ajudar-me?');
