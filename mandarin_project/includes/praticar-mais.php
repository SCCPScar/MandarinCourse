<?php
// praticar-mais.php
// Aqui eu guardo, para cada unidade da rota, as páginas do site onde o aluno pode praticar mais.
// A lição mostra estas ligações no bloco «Continua a praticar».
// Cada ligação tem: [título, endereço, o que vais fazer lá].

$praticar_mais = [
    '1.1' => [
        ['Os 4 tons', 'sons.php#tones', 'Ouve cada tom e compara-os lado a lado.'],
        ['A tabela do pinyin', 'sons.php#pinyin', 'Todas as iniciais e finais, com som.'],
        ['Treino de pronúncia', 'praticar.php#tab-mic', 'Grava a tua voz e vê o desenho do tom.'],
    ],
    '1.2' => [
        ['Cumprimentos', 'basico.php#greetings', 'As frases do primeiro dia, com som.'],
        ['Gramática: 是 (shì) e 吗 (ma)', 'basico.php#grammar', 'Como dizer «ser» e fazer perguntas de sim ou não.'],
        ['Diálogos', 'praticar.php', 'Lê e ouve uma conversa de apresentação.'],
    ],
    '1.3' => [
        ['Números e horas', 'basico.php#basics', 'Do 0 ao 万 (wàn), com som em cada número.'],
        ['Pessoas e família', 'vocabulario.php#people', 'Mais palavras para falar da família.'],
        ['Cartões de memória', 'praticar.php#tab-flash', 'Revê as palavras novas até as saberes de cor.'],
    ],
    '1.4' => [
        ['Números e horas', 'basico.php#basics', 'Revê os números antes das datas e das horas.'],
        ['Tempo e frequência', 'vocabulario.php#time-words', 'Hoje, amanhã, sempre, às vezes…'],
        ['Construir frases', 'praticar.php#tab-sb', 'Põe as palavras pela ordem certa: tempo, lugar, ação.'],
    ],
    '2.1' => [
        ['Comida e bebida', 'vocabulario.php#food', 'Os nomes dos pratos e das bebidas.'],
        ['Compras e comida', 'basico.php#shopping', 'As frases para pedir numa banca ou num restaurante.'],
        ['Construir frases', 'praticar.php#tab-sb', 'Treina o 我要… (wǒ yào…) com várias palavras.'],
    ],
    '2.2' => [
        ['Números e horas', 'basico.php#basics', 'Os números grandes, para perceber os preços.'],
        ['Compras e comida', 'basico.php#shopping', 'Perguntar o preço e pedir desconto.'],
        ['Ouvir', 'praticar.php#tab-speak', 'Escreve um preço em chinês e ouve-o.'],
    ],
    '2.3' => [
        ['Lugares', 'vocabulario.php#places', 'Banco, estação, hospital e outros sítios.'],
        ['Perguntas essenciais', 'basico.php#questions', 'Onde fica…? Como se vai…?'],
        ['Gramática essencial', 'basico.php#grammar', 'A ordem das palavras numa frase chinesa.'],
    ],
    '2.4' => [
        ['Gramática essencial', 'basico.php#grammar', 'O 了 (le) de ação terminada.'],
        ['Cultura de Xi\'an', 'rota.php#cultura', 'Pagar com o telemóvel e outras curiosidades.'],
        ['Dicionário', 'praticar.php#tab-dict', 'Procura as palavras que te faltam.'],
    ],
    '3.1' => [
        ['Verbos do dia a dia', 'vocabulario.php#verbs', 'Levantar, trabalhar, comer, dormir…'],
        ['Tempo e frequência', 'vocabulario.php#time-words', 'Todos os dias, às vezes, nunca.'],
        ['Construir frases', 'praticar.php#tab-sb', 'Onde fica o advérbio na frase.'],
    ],
    '3.2' => [
        ['Verbos do dia a dia', 'vocabulario.php#verbs', 'Os verbos dos passatempos.'],
        ['Gramática essencial', 'basico.php#grammar', '会 (huì), 能 (néng) e 可以 (kěyǐ): saber, poder, ter licença.'],
        ['Cartões de memória', 'praticar.php#tab-flash', 'Revê as palavras novas.'],
    ],
    '3.3' => [
        ['Diálogos', 'praticar.php', 'Uma conversa para combinar planos.'],
        ['Frases de cortesia', 'basico.php#polite', 'Aceitar e recusar com educação.'],
        ['Construir frases', 'praticar.php#tab-sb', 'Treina o 因为…所以… (yīnwèi… suǒyǐ…).'],
    ],
    '3.4' => [
        ['Teclado chinês', 'praticar.php#tab-keyboard', 'Configura o teclado para escreveres mensagens em chinês.'],
        ['Gramática essencial', 'basico.php#grammar', '了 (le), 在 (zài) e 过 (guo).'],
        ['Caderno', 'praticar.php#tab-notebook', 'Guarda as palavras do tempo e das mensagens.'],
    ],
    '4.1' => [
        ['Lugares', 'vocabulario.php#places', 'Estação, aeroporto, bilheteira.'],
        ['Números e horas', 'basico.php#basics', 'Ler os horários dos comboios.'],
        ['Ouvir', 'praticar.php#tab-speak', 'Ouve os anúncios de uma estação.'],
    ],
    '4.2' => [
        ['Frases de cortesia', 'basico.php#polite', '请 (qǐng) e 麻烦你 (máfan nǐ) para pedir com educação.'],
        ['Dicionário', 'praticar.php#tab-dict', 'Procura o que precisas de pedir na receção.'],
        ['Cartões de memória', 'praticar.php#tab-flash', 'Revê as palavras do hotel.'],
    ],
    '4.3' => [
        ['Adjetivos', 'vocabulario.php#adjectives', 'Bonito, antigo, calmo, cheio de gente…'],
        ['Gramática essencial', 'basico.php#grammar', 'O 得 (de) para dizer como se faz alguma coisa.'],
        ['Cultura de Guilin', 'rota.php#cultura', 'O rio Li, Yangshuo e os comboios rápidos.'],
    ],
    '4.4' => [
        ['Perguntas essenciais', 'basico.php#questions', 'Pedir ajuda e perguntar onde fica.'],
        ['Dicionário', 'praticar.php#tab-dict', 'Procura sintomas e objetos.'],
        ['Treino de pronúncia', 'praticar.php#tab-mic', 'Treina as frases de emergência em voz alta.'],
    ],
    '5.1' => [
        ['Gramática essencial', 'basico.php#grammar', 'Comparar com 比 (bǐ).'],
        ['Adjetivos', 'vocabulario.php#adjectives', 'Os adjetivos para comparar.'],
        ['Cultura de Hangzhou', 'rota.php#cultura', 'O Lago do Oeste e o chá Longjing.'],
    ],
    '5.2' => [
        ['Gramática essencial', 'basico.php#grammar', '了 (le) e 过 (guo) para falar do passado.'],
        ['Tempo e frequência', 'vocabulario.php#time-words', 'Ontem, no ano passado, primeiro, depois.'],
        ['Construir frases', 'praticar.php#tab-sb', 'Conta o que fizeste por ordem.'],
    ],
    '5.3' => [
        ['Diálogos', 'praticar.php', 'Ouve duas pessoas a dar a opinião.'],
        ['Treino de pronúncia', 'praticar.php#tab-mic', 'Diz em voz alta o que pensas.'],
        ['Caderno', 'praticar.php#tab-notebook', 'Guarda as expressões de opinião.'],
    ],
    '5.4' => [
        ['Teclado chinês', 'praticar.php#tab-keyboard', 'Escreve em chinês no telemóvel.'],
        ['Dicionário', 'praticar.php#tab-dict', 'Procura as palavras das compras online.'],
        ['Cartões de memória', 'praticar.php#tab-flash', 'Revê as palavras novas.'],
    ],
    '6.1' => [
        ['Lugares', 'vocabulario.php#places', 'Banco, correios, casa.'],
        ['Dicionário', 'praticar.php#tab-dict', 'Procura as palavras de que precisas para alugar casa.'],
        ['Cultura de Xangai', 'rota.php#cultura', 'Os lòngtáng e o dialeto de Xangai.'],
    ],
    '6.2' => [
        ['Chinês para o trabalho', 'vocabulario.php#work', 'Reuniões, e-mails e vocabulário de negócios.'],
        ['Teclado chinês', 'praticar.php#tab-keyboard', 'Escreve um e-mail curto em chinês.'],
        ['Cartões de memória', 'praticar.php#tab-flash', 'Revê as palavras do escritório.'],
    ],
    '6.3' => [
        ['Chinês para o trabalho', 'vocabulario.php#work', 'Apresentar-te numa empresa.'],
        ['Treino de pronúncia', 'praticar.php#tab-mic', 'Grava a tua apresentação e ouve-a.'],
        ['Diálogos', 'praticar.php', 'Uma conversa entre colegas novos.'],
    ],
    '6.4' => [
        ['Caracteres', 'caracteres.php', 'Os radicais ajudam a adivinhar o sentido de um caractere.'],
        ['Traços', 'praticar.php#tab-hanzi', 'Escreve os caracteres das placas.'],
        ['Jogo de caracteres', 'praticar.php#tab-chargame', 'Treina a leitura contra o relógio.'],
    ],
];
