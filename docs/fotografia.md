# Chá · Guia de fotografia

> Versão 1 (25/09/2026). São 33 fotos: 3 gerais, mais 5 por cidade (1 capa + 1 por unidade).

## Regras de seleção

Uma foto só entra se cumprir **todas** estas condições:

1. **Mostra a situação da lição.** Se a lição é sobre comida, a foto mostra uma banca de comida, não uma paisagem.
2. **Mostra a China real e de hoje.** Pessoas comuns e situações do dia a dia. Nada de postais nem de clichés (dragões e lanternas em todo o lado).
3. **Tem texto chinês visível sempre que possível** (placas, menus, sinais), porque também é conteúdo.
4. **Deixa espaço para o título.** A zona de baixo (ou a da esquerda) deve ser calma, para o texto por cima se ler bem.
5. **A foto não é Unsplash+.** As fotos premium (selo "+", link `plus.unsplash.com/premium_photo-…`) são pagas e não entram na licença gratuita.
6. **As pessoas não são o assunto principal**, a não ser que se veja pouco o rosto. Em Portugal, o direito à imagem (art. 79.º do Código Civil) protege as pessoas identificáveis, e os bancos de imagens gratuitos não garantem autorização dos retratados.
7. **Tem luz natural e cor real.** Nada de filtros fortes nem de HDR exagerado.

## Fontes e licenças

- **Unsplash** e **Pexels**: uso gratuito, também comercial, sem pedir autorização. **Creditamos sempre o fotógrafo**, por ser boa prática e por respeito. Não se podem revender as fotos tal como estão.
- Não usar fotos do Google Imagens nem de redes sociais sem licença explícita.
- Cada foto escolhida é registada em `docs/fotos-creditos.csv` (ID, URL, fotógrafo, licença, data).

## Especificações técnicas

| Tipo | Proporção | Largura máxima | Formato | Peso máximo |
|---|---|---|---|---|
| Capa de cidade / hero | 16:9 (recorte 4:5 em mobile) | 1600px | AVIF + WebP de reserva | 250 KB |
| Cabeçalho de unidade | 3:2 | 1200px | AVIF + WebP de reserva | 150 KB |

- Carregar com `loading="lazy"`, exceto a foto do primeiro ecrã.
- Pôr sempre um gradiente escuro por baixo do texto (contraste mínimo AA).
- Escrever `alt` em português a descrever a cena (por exemplo, "Banca de noodles à noite no bairro muçulmano de Xi'an").

## Lista de fotos

As pesquisas também funcionam no Pexels (`https://www.pexels.com/search/<termos>/`).

### Gerais

| ID | Onde aparece | O que mostrar | Pesquisa |
|---|---|---|---|
| G1 | Hero da página inicial | Mãos a servir chá numa chávena pequena, com vapor e luz quente | [chinese tea pouring](https://unsplash.com/s/photos/chinese-tea-pouring) |
| G2 | Onboarding | Pincel a escrever caracteres em papel | [chinese calligraphy brush](https://unsplash.com/s/photos/chinese-calligraphy-brush) |
| G3 | Página "Sobre" | Mesa com cadernos, chá e alguém a estudar | [studying tea notebook](https://unsplash.com/s/photos/studying-tea-notebook) |

### Decisões

| ID | Estado | Notas |
|---|---|---|
| G1 | ❌ Rejeitada | A candidata era Unsplash+ (paga) e mostrava chá turco. Falta escolher outra. |
| G2 | ❌ Rejeitada | A candidata era Unsplash+ (paga) e os caracteres não eram legíveis. Falta escolher outra. |
| G3 | ✅ Aprovada (26/09/2026) | Bubble tea, `photo-1639927663411-35f23bb792b7`. Usada **só na vertical 4:5, ao lado do texto** (layout A). Na horizontal perde a tampa e o logótipo da marca fica em destaque, por isso não serve para faixas largas. Tem caracteres tradicionais (鮮) e uma marca visível, o que é aceitável numa página secundária. Ficheiros: `mandarin_project/img/fotos/g3-sobre-{640,960}.{avif,webp}`. **Falta o nome do fotógrafo.** |

### 1. Pequim 北京

| ID | Onde aparece | O que mostrar | Pesquisa |
|---|---|---|---|
| BJ0 | Capa da cidade | Hutong com bicicletas e portas tradicionais | [beijing hutong](https://unsplash.com/s/photos/beijing-hutong) |
| BJ1 | 1.1 Pinyin e tons | Caderno quadriculado (田字格) com caracteres escritos | [chinese character practice](https://unsplash.com/s/photos/chinese-character-practice) |
| BJ2 | 1.2 Olá, eu sou… | Rua de Pequim com pessoas a passar | [beijing street](https://unsplash.com/s/photos/beijing-street) |
| BJ3 | 1.3 Números e família | Mesa de jantar redonda com vários pratos | [chinese family dinner](https://unsplash.com/s/photos/chinese-family-dinner) |
| BJ4 | 1.4 Datas e horas | Torre do Tambor (鼓楼), que antigamente marcava as horas da cidade | [beijing drum tower](https://unsplash.com/s/photos/beijing-drum-tower) |

### 2. Xi'an 西安

| ID | Onde aparece | O que mostrar | Pesquisa |
|---|---|---|---|
| XA0 | Capa da cidade | Muralha da cidade ao entardecer | [xian city wall](https://unsplash.com/s/photos/xian-city-wall) |
| XA1 | 2.1 Na banca de comida | Comida de rua no bairro muçulmano | [xian muslim quarter food](https://unsplash.com/s/photos/xian-muslim-quarter-food) |
| XA2 | 2.2 Quanto custa? | Banca de mercado com preços escritos | [chinese market stall](https://unsplash.com/s/photos/chinese-market-stall) |
| XA3 | 2.3 Onde fica? | Torre do Sino, no centro da cidade, com as ruas à volta | [xian bell tower](https://unsplash.com/s/photos/xian-bell-tower) |
| XA4 | 2.4 Pagar e planear | Pagamento com QR code no telemóvel | [qr code payment china](https://unsplash.com/s/photos/qr-code-payment-china) |

### 3. Chengdu 成都

| ID | Onde aparece | O que mostrar | Pesquisa |
|---|---|---|---|
| CD0 | Capa da cidade | Casa de chá ao ar livre, com cadeiras de bambu | [chengdu teahouse](https://unsplash.com/s/photos/chengdu-teahouse) |
| CD1 | 3.1 A minha rotina | Metro ou rua de manhã, com pessoas a caminho do trabalho | [china subway morning](https://unsplash.com/s/photos/china-subway-morning) |
| CD2 | 3.2 Gostos e tempo livre | Mesa de mahjong | [mahjong](https://unsplash.com/s/photos/mahjong) |
| CD3 | 3.3 Convites e planos | Hot pot (火锅) partilhado entre amigos | [sichuan hot pot](https://unsplash.com/s/photos/sichuan-hot-pot) |
| CD4 | 3.4 Tempo e mensagens | Rua à chuva, com guarda-chuvas e placas em chinês | [china rain street umbrella](https://unsplash.com/s/photos/china-rain-street-umbrella) |

### 4. Guilin 桂林

| ID | Onde aparece | O que mostrar | Pesquisa |
|---|---|---|---|
| GL0 | Capa da cidade | Rio Li com montanhas cársicas | [li river guilin](https://unsplash.com/s/photos/li-river-guilin) |
| GL1 | 4.1 Bilhetes e comboios | Comboio de alta velocidade na estação | [china high speed train](https://unsplash.com/s/photos/china-high-speed-train) |
| GL2 | 4.2 No hotel | Pousada ou receção em Yangshuo | [yangshuo guesthouse](https://unsplash.com/s/photos/yangshuo-guesthouse) |
| GL3 | 4.3 Descrever lugares | Paisagem de Yangshuo com arrozais e montanhas | [yangshuo landscape](https://unsplash.com/s/photos/yangshuo-landscape) |
| GL4 | 4.4 Emergências | Fachada de farmácia com cruz verde e texto chinês | [chinese pharmacy](https://unsplash.com/s/photos/chinese-pharmacy) |

### 5. Hangzhou 杭州

| ID | Onde aparece | O que mostrar | Pesquisa |
|---|---|---|---|
| HZ0 | Capa da cidade | Lago do Oeste (西湖) com um barco ou um pagode | [west lake hangzhou](https://unsplash.com/s/photos/west-lake-hangzhou) |
| HZ1 | 5.1 Comparar | Plantação de chá Longjing em socalcos | [longjing tea plantation](https://unsplash.com/s/photos/longjing-tea-plantation) |
| HZ2 | 5.2 Contar o passado | Rua antiga com lojas tradicionais | [hangzhou old street](https://unsplash.com/s/photos/hangzhou-old-street) |
| HZ3 | 5.3 Dar opinião | Café moderno com mesas e conversa | [china cafe](https://unsplash.com/s/photos/china-cafe) |
| HZ4 | 5.4 Compras online | Estafeta de entregas em scooter | [delivery scooter china](https://unsplash.com/s/photos/delivery-scooter-china) |

### 6. Xangai 上海

| ID | Onde aparece | O que mostrar | Pesquisa |
|---|---|---|---|
| SH0 | Capa da cidade | O Bund (外滩) com Pudong ao fundo | [shanghai bund](https://unsplash.com/s/photos/shanghai-bund) |
| SH1 | 6.1 Casa e serviços | Casas shikumen (石库门) ou prédios residenciais | [shanghai shikumen](https://unsplash.com/s/photos/shanghai-shikumen) |
| SH2 | 6.2 No trabalho | Escritório moderno com vista para a cidade | [shanghai office](https://unsplash.com/s/photos/shanghai-office) |
| SH3 | 6.3 Entrevista de emprego | Reunião numa mesa, com as mãos e documentos em destaque | [business meeting table](https://unsplash.com/s/photos/business-meeting-table) |
| SH4 | 6.4 Ler a cidade | Placas e letreiros de néon em chinês | [shanghai neon signs](https://unsplash.com/s/photos/shanghai-neon-signs) |

## Processo de escolha

1. Para cada ID, a família escolhe **2 candidatas** e cola os links numa lista.
2. Na revisão escolhe-se 1 por ID, com base nas regras de seleção.
3. As fotos são otimizadas (redimensionar e converter para AVIF/WebP) e registadas em `docs/fotos-creditos.csv`.
4. Todos os créditos aparecem numa página "Créditos" do site.
