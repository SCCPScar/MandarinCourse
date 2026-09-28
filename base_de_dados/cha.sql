-- =====================================================================
-- Chá · Base de dados
-- Eu importo este arquivo no phpMyAdmin (aba "Importar").
-- Ele cria a base "cha", as 8 tabelas e alguns dados de exemplo.
-- =====================================================================

-- Eu aviso ao MySQL que este arquivo está em UTF-8.
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
-- 1. USUÁRIOS
-- Aqui eu guardo quem tem conta no site.
-- A senha nunca fica em texto: eu guardo só o "hash" feito pelo PHP
-- com password_hash(). Por isso o campo tem 255 caracteres.
-- ---------------------------------------------------------------------
CREATE TABLE usuarios (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome            VARCHAR(80)  NOT NULL,
  email           VARCHAR(120) NOT NULL UNIQUE,
  senha_hash      VARCHAR(255) NOT NULL,
  nivel           ENUM('zero', 'basico', 'intermediario', 'avancado') NOT NULL DEFAULT 'zero',
  minutos_por_dia TINYINT UNSIGNED NOT NULL DEFAULT 60,
  sequencia_dias  SMALLINT UNSIGNED NOT NULL DEFAULT 0,  -- a "streak"
  ultimo_estudo   DATE NULL,
  aceitou_termos  DATETIME NOT NULL,                     -- quando aceitou a política de privacidade (RGPD)
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
  tema     VARCHAR(60) NOT NULL
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
-- Quais lições cada usuário já terminou (relação N:N entre usuários e lições).
-- A chave primária tem duas colunas: o mesmo usuário não termina a mesma lição duas vezes.
-- ON DELETE CASCADE: se eu apagar o usuário, o progresso dele também é apagado (RGPD).
-- ---------------------------------------------------------------------
CREATE TABLE progresso (
  usuario_id    INT UNSIGNED NOT NULL,
  licao_id      INT UNSIGNED NOT NULL,
  pontuacao     TINYINT UNSIGNED NOT NULL,   -- de 0 a 100
  concluida_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id, licao_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (licao_id)   REFERENCES licoes(id)
) ENGINE=InnoDB;


-- ---------------------------------------------------------------------
-- 7. REVISÕES (revisão espaçada / SRS)
-- Para cada palavra que o usuário já estudou, eu guardo quando ele deve revisá-la.
-- Se ele acerta, o intervalo aumenta; se erra, ele volta para 1 dia.
-- ---------------------------------------------------------------------
CREATE TABLE revisoes (
  usuario_id       INT UNSIGNED NOT NULL,
  palavra_id       INT UNSIGNED NOT NULL,
  intervalo_dias   SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  proxima_revisao  DATE NOT NULL,
  acertos          SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (usuario_id, palavra_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (palavra_id) REFERENCES palavras(id)
) ENGINE=InnoDB;


-- ---------------------------------------------------------------------
-- 8. CADERNO
-- As palavras que o usuário guardou no caderno pessoal.
-- ---------------------------------------------------------------------
CREATE TABLE caderno (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT UNSIGNED NOT NULL,
  hanzi       VARCHAR(20)  NOT NULL,
  pinyin      VARCHAR(40)  NOT NULL,
  traducao    VARCHAR(100) NOT NULL,
  criado_em   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- =====================================================================
-- DADOS DE EXEMPLO
-- Eu não crio usuários aqui: eles são criados pela página de registro,
-- porque é o PHP que faz o hash da senha.
-- =====================================================================

-- As 6 cidades da rota
INSERT INTO cidades (id, ordem, nome, nome_zh, meses, tema) VALUES
  (1, 1, 'Pequim',   '北京', '1–2',   'Os sons do mandarim'),
  (2, 2, 'Xi''an',   '西安', '3–4',   'Comer e comprar'),
  (3, 3, 'Chengdu',  '成都', '5–6',   'O dia a dia'),
  (4, 4, 'Guilin',   '桂林', '7–8',   'Viajar'),
  (5, 5, 'Hangzhou', '杭州', '9–10',  'Contar e opinar'),
  (6, 6, 'Xangai',   '上海', '11–12', 'Trabalho e cidade');

-- As 24 unidades (4 por cidade)
INSERT INTO unidades (id, cidade_id, codigo, titulo) VALUES
  (1,  1, '1.1', 'Pinyin e tons'),
  (2,  1, '1.2', 'Olá, eu sou…'),
  (3,  1, '1.3', 'Números e família'),
  (4,  1, '1.4', 'Datas e horas'),
  (5,  2, '2.1', 'Na banca de comida'),
  (6,  2, '2.2', 'Quanto custa?'),
  (7,  2, '2.3', 'Onde fica?'),
  (8,  2, '2.4', 'Pagar e planejar'),
  (9,  3, '3.1', 'Minha rotina'),
  (10, 3, '3.2', 'Gostos e tempo livre'),
  (11, 3, '3.3', 'Convites e planos'),
  (12, 3, '3.4', 'Tempo e mensagens'),
  (13, 4, '4.1', 'Passagens e trens'),
  (14, 4, '4.2', 'No hotel'),
  (15, 4, '4.3', 'Descrever lugares'),
  (16, 4, '4.4', 'Emergências'),
  (17, 5, '5.1', 'Comparar'),
  (18, 5, '5.2', 'Contar o passado'),
  (19, 5, '5.3', 'Dar opinião'),
  (20, 5, '5.4', 'Compras online e serviços'),
  (21, 6, '6.1', 'Casa e serviços'),
  (22, 6, '6.2', 'No trabalho'),
  (23, 6, '6.3', 'Entrevista de emprego'),
  (24, 6, '6.4', 'Ler a cidade');

-- Algumas lições de Pequim (as outras eu adiciono depois)
INSERT INTO licoes (id, unidade_id, ordem, titulo, minutos) VALUES
  (1, 1, 1, 'Os 4 tons e o tom neutro', 15),
  (2, 1, 2, 'Iniciais do pinyin',       15),
  (3, 1, 3, 'Finais do pinyin',         15),
  (4, 2, 1, 'Cumprimentos',             15),
  (5, 2, 2, 'Qual é o seu nome?',       15),
  (6, 2, 3, 'De onde você é?',          15);

-- Palavras das lições da unidade 1.2
INSERT INTO palavras (licao_id, hanzi, pinyin, traducao) VALUES
  (4, '你好',     'nǐ hǎo',        'olá'),
  (4, '您好',     'nín hǎo',       'olá (formal)'),
  (4, '谢谢',     'xièxie',        'obrigado'),
  (4, '再见',     'zàijiàn',       'tchau'),
  (5, '我',       'wǒ',            'eu'),
  (5, '你',       'nǐ',            'você'),
  (5, '您',       'nín',           'o senhor / a senhora'),
  (5, '叫',       'jiào',          'chamar-se'),
  (5, '什么',     'shénme',        'o quê'),
  (5, '名字',     'míngzi',        'nome'),
  (6, '是',       'shì',           'ser'),
  (6, '吗',       'ma',            'partícula de pergunta (sim/não)'),
  (6, '呢',       'ne',            'e você? (partícula)'),
  (6, '中国人',   'Zhōngguó rén',  'chinês / chinesa'),
  (6, '巴西人',   'Bāxī rén',      'brasileiro / brasileira'),
  (6, '葡萄牙人', 'Pútáoyá rén',   'português / portuguesa');
