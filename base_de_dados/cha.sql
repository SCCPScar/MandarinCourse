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

-- Algumas lições de Pequim (as outras eu adiciono depois)
INSERT INTO licoes (id, unidade_id, ordem, titulo, minutos) VALUES
  (1, 1, 1, 'Os 4 tons e o tom neutro', 15),
  (2, 1, 2, 'Iniciais do pinyin',       15),
  (3, 1, 3, 'Finais do pinyin',         15),
  (4, 2, 1, 'Cumprimentos',             15),
  (5, 2, 2, 'Qual é o seu nome?',       15),
  (6, 2, 3, 'De onde és?',              15);

-- Palavras das lições da unidade 1.2
INSERT INTO palavras (licao_id, hanzi, pinyin, traducao) VALUES
  (4, '你好',     'nǐ hǎo',        'olá'),
  (4, '您好',     'nín hǎo',       'olá (formal)'),
  (4, '谢谢',     'xièxie',        'obrigado'),
  (4, '再见',     'zàijiàn',       'adeus'),
  (5, '我',       'wǒ',            'eu'),
  (5, '你',       'nǐ',            'tu'),
  (5, '您',       'nín',           'o senhor / a senhora'),
  (5, '叫',       'jiào',          'chamar-se'),
  (5, '什么',     'shénme',        'o quê'),
  (5, '名字',     'míngzi',        'nome'),
  (6, '是',       'shì',           'ser'),
  (6, '吗',       'ma',            'partícula de pergunta (sim/não)'),
  (6, '呢',       'ne',            'e tu? (partícula)'),
  (6, '中国人',   'Zhōngguó rén',  'chinês / chinesa'),
  (6, '巴西人',   'Bāxī rén',      'brasileiro / brasileira'),
  (6, '葡萄牙人', 'Pútáoyá rén',   'português / portuguesa');
