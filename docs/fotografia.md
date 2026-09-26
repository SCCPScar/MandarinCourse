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
- Cada foto escolhida é registrada em `docs/fotos-creditos.csv` (ID, URL, fotógrafo, licença, data).

## Especificações técnicas

| Tipo | Proporção | Largura máxima | Formato | Peso máximo |
|---|---|---|---|---|
| Capa de cidade / hero | 16:9 (recorte 4:5 em mobile) | 1600px | AVIF + WebP de reserva | 250 KB |
| Cabeçalho de unidade | 3:2 | 1200px | AVIF + WebP de reserva | 150 KB |

- Carregar com `loading="lazy"`, exceto a foto do primeira tela.
- Colocar sempre um gradiente escuro por baixo do texto (contraste mínimo AA).
- Escrever `alt` em português a descrever a cena (por exemplo, "Banca de noodles à noite no bairro muçulmano de Xi'an").

## Lista de fotos

As pesquisas também funcionam no Pexels (`https://www.pexels.com/search/<termos>/`).

### Gerais

| ID | Onde aparece | O que mostrar | Pesquisa |
|---|---|---|---|
| G1 | Hero da página inicial | Mãos servindo chá numa xícara pequena, com vapor e luz quente | [chinese tea pouring](https://unsplash.com/s/photos/chinese-tea-pouring) |
| G2 | Onboarding | Rua chinesa com placas legíveis em caracteres simplificados | [shanghai old street](https://unsplash.com/s/photos/shanghai-old-street) |
| G3 | Página "Sobre" | Mesa com cadernos, chá e alguém estudando | [studying tea notebook](https://unsplash.com/s/photos/studying-tea-notebook) |

### Decisões

| ID | Estado | Notas |
|---|---|---|
| G1 | ✅ Aprovada (26/09/2026) | **Duas fotos, uma por tamanho de tela** (direção de arte com `<picture>`, troca em 768px). **Computador:** Yang Louie, `photo-1601366029950-0640bbbb8ce6`, recorte horizontal `rect=0,520,3456,2041`, com o texto **à direita** sobre um degradê escuro (layout 3A). O degradê também cobre o rosto parcial de uma segunda pessoa na borda direita, que não pode ficar visível. **Celular:** Joshua Fernandez, `photo-1627491362358-6d437e65a3bc`, recorte fechado nas taças (`crop=focalpoint&fp-x=0.42&fp-y=0.5&fp-z=1.35`), que tira a tampa de plástico azul. Arquivos: `mandarin_project/img/fotos/hero-desktop-{1280,1920}` e `hero-mobile-{390,780}`, em `.avif` e `.webp`. |
| — | Reservadas | Candidatas não usadas no hero, guardadas para as cápsulas culturais: ORIENTO `photo-1531970227416-f0cddeb1f748` (mesa comprida), ORIENTO `photo-1531364380693-8f16a988e6d3` (mesa vista de cima) e o recorte vertical 3B da Yang Louie. Da escolha do G2 ficou guardada `photo-1713181011329-687f14b9c30b` (placa 茶馆相声, com o caractere 茶), boa para a cápsula cultural das casas de chá em Chengdu. Antes de usar, recortar a senhora de perfil nítida à esquerda da placa e o logotipo do McDonald's. Falta o nome do fotógrafo. |
| G2 | ✅ Aprovada (26/09/2026) | Rua antiga de Xangai na chuva, `photo-1517309230475-6736d926b979` (opção D). Foi escolhida porque tem placas legíveis em caracteres simplificados (上海制扇, 华夏风采) e porque Xangai é o destino final da rota: o aluno vê logo no início onde vai chegar. A caligrafia com pincel foi descartada por não combinar com a primeira tela. **Computador:** painel vertical ao lado das perguntas, recorte `rect=2350,0,1562,2480` (telhados, lanternas e a placa 华夏风采). **Celular:** faixa horizontal por cima das perguntas, recorte `rect=1227,0,3546,2480` (fileira de lojas). Os dois recortes ficam só na metade de cima da foto, para **não mostrar os rostos** das pessoas na rua. Arquivos: `mandarin_project/img/fotos/g2-onboarding-desktop-{340,680}` e `g2-onboarding-mobile-{390,780}`, em `.avif` e `.webp`. Fotógrafo: **Nuno Alberto** (Unsplash). |
| G3 | ✅ Aprovada (26/09/2026) | Bubble tea, `photo-1639927663411-35f23bb792b7`. Usada **só na vertical 4:5, ao lado do texto** (layout A). Na horizontal perde a tampa e o logotipo da marca fica em destaque, por isso não serve para faixas largas. Tem caracteres tradicionais (鮮) e uma marca visível, o que é aceitável numa página secundária. Ficheiros: `mandarin_project/img/fotos/g3-sobre-{640,960}.{avif,webp}`. Fotógrafo: **Kevin Canlas** (Unsplash). |

### Decisões das cidades

| ID | Estado | Notas |
|---|---|---|
| BJ0 | ✅ Aprovada (26/09/2026) | Hutong 草厂胡同 (Caochang Hutong, Dongcheng) com bicicleta antiga, violões e plantas, `photo-1719985970224-19b37fed86e7`. Não tem pessoas. **Computador (16:9):** `rect=0,632,6016,3384`, com o título embaixo à esquerda sobre um degradê escuro. **Celular (4:5):** `rect=1500,0,3213,4016`, deslocado para a direita para a bicicleta aparecer inteira. Arquivos: `mandarin_project/img/fotos/bj0-capa-desktop-{960,1600}` e `bj0-capa-mobile-{390,780}`, em `.avif` e `.webp` (todos com menos de 250 KB). Fotógrafo: **ran liwen** (Unsplash). |
| BJ1 | ✅ Aprovada (26/09/2026) | **Ilustração própria em SVG**, porque não havia foto gratuita de um 田字格 real. As candidatas do Unsplash (série de Jason Hu) eram papel 稿纸 com letras de músicas do Jay Chou (《简单爱》, 《红尘客栈》), protegidas por direitos autorais (CDADC), e misturavam caracteres simplificados e tradicionais. A ilustração mostra 你好中文 com o pinyin colorido pelos tons (nǐ e hǎo no 3.º tom, zhōng no 1.º, wén no 2.º) e uma linha para cobrir o 你. O texto foi convertido em caminhos (fontes LXGW WenKai e Lexend, as duas com licença SIL OFL), então o SVG não depende de fontes. Tem versão clara e escura: `mandarin_project/img/fotos/bj1-pinyin-tons-{claro,escuro}.svg`. O script que gera os arquivos é `ferramentas/gerar_bj1.py`. Não precisa de crédito. |
| BJ2 | ✅ Aprovada (26/09/2026) | Entrada de mercado em Pequim com as placas **天桥欢迎您** ("Tianqiao dá as boas-vindas a você") e o pavilhão 武圣亭 (placa lida da direita para a esquerda), `photo-1642747545738-a43c06ae77a7`. O 欢迎 e o 您 são vocabulário da própria unidade 1.2. A foto original tem rostos nítidos embaixo, por isso o recorte 3:2 `rect=955,0,3300,2200` para **logo acima das cabeças**. No celular o título fica embaixo da foto, e não por cima. A foto é de 2012 e o céu está amarelado, o que se aceitou por causa do texto. Arquivos: `mandarin_project/img/fotos/bj2-cumprimentos-{800,1200}.{avif,webp}` (todos com menos de 150 KB). Fotógrafo: **Serg Balak** (Unsplash). |
| BJ3 | ✅ Aprovada (26/09/2026) | Jantar de família com steamboat (火锅 de caldo claro) no centro da mesa e vários pratos à volta, `photo-1614104030967-5ca61a54247b`. As etiquetas indicam o jantar de reunião do Ano Novo Chinês (团圆饭), o que liga a foto ao tema "família". Dá para praticar números: 桌上有几盘菜？ Foi tirada em Singapura, mas a imagem não mostra o país. Não tem rostos, só a ponta de uma mão. Recorte 3:2 `rect=0,760,3024,2016`, centrado na panela. É diferente do hot pot 麻辣 de Chengdu (CD3), e os dois podem ser comparados na cápsula cultural. Arquivos: `mandarin_project/img/fotos/bj3-familia-{800,1200}.{avif,webp}` (todos com menos de 150 KB). Fotógrafa: **Cera** (Unsplash). |
| BJ4 | ✅ Aprovada (26/09/2026) | Torre do Tambor (鼓楼) de Pequim, cujos tambores marcavam as horas da cidade, `photo-1645545160282-fa5c606ad43e`. Não tem pessoas. Os fios de trólebus que cruzam a foto são reais e ficaram. O céu original era turquesa muito saturado, por isso os arquivos usam **saturação −30** (`sat=-30`, versão B), para cumprir a regra 7. A foto inteira já é 3:2, sem recorte. Arquivos: `mandarin_project/img/fotos/bj4-horas-{800,1200}.{avif,webp}` (todos com menos de 150 KB). Fotógrafo: **Steven Wilson** (Unsplash). |
| XA0 | ✅ Aprovada (26/09/2026) | Torre do Sino (钟楼) de Xi'an iluminada à noite, com prédios modernos atrás, `photo-1547253807-593ee708edab`. Trocou de lugar com a muralha: a torre passou para a capa, e a muralha foi para o XA3. O céu preto à esquerda deixa o título legível. Os recortes cortam a parte de baixo, onde estavam os carros, o táxi, uma pessoa de moto e as **placas dos carros** (a matrícula é dado pessoal no RGPD). **Computador (16:9):** `rect=0,250,6000,3375`. **Celular (4:5):** `rect=2386,300,2960,3700`. Arquivos: `mandarin_project/img/fotos/xa0-capa-desktop-{960,1600}` e `xa0-capa-mobile-{390,780}`, em `.avif` e `.webp` (todos com menos de 250 KB). Fotógrafo: **Xiaolong Wong** (Unsplash). |
| XA1 | ✅ Aprovada (26/09/2026) | Banca do 老孙家 (restaurante muçulmano famoso de Xi'an) no bairro muçulmano, à noite e com o chão molhado, `photo-1784543965983-956b090037c7`. A foto original mostra três vendedores com o rosto nítido, por isso o recorte 3:2 `rect=1008,3096,2592,1728` começa **logo abaixo dos rostos** (opção C). Ficam as placas **灌汤臭豆腐** e **火爆鱿鱼** e os espetos de lula no balcão. A plaquinha 铁板鱿鱼 20元8串 ficou de fora porque está colada ao rosto de um vendedor. Arquivos: `mandarin_project/img/fotos/xa1-banca-{800,1200}.{avif,webp}` (todos com menos de 150 KB). Fotógrafo: **Falco Negenman** (Unsplash). |
| XA2 | ✅ Aprovada (26/09/2026) | Balcão de uma banca de 麻辣烫 / 米线 com tigelas de porcelana azul e branca, `photo-1789372666719-e4bc6bf3bcf0`. Tem um cardápio bilíngue com preços (柳州螺蛳粉, 越南牛肉粉, **28元/份**), que serve para praticar 元 e 多少钱. A pessoa atrás do balcão aparece sem rosto. A foto inteira já é 3:2, sem recorte. O local não está identificado, então a foto não é necessariamente de Xi'an. Arquivos: `mandarin_project/img/fotos/xa2-precos-{800,1200}.{avif,webp}` (todos com menos de 150 KB). Fotógrafo: **Haydn** (Unsplash). |
| XA3 | ✅ Aprovada (26/09/2026) | Alto da muralha de Xi'an, com lanternas e bandeiras, pessoas de bicicleta e prédios residenciais ao fundo, `photo-1588088470830-ab765f87abd5`. O caminho em linha reta ilustra **往前走** ("siga em frente"). Não foi encontrada no Unsplash uma foto gratuita de portão com nome visível. As pessoas estão longe e de costas. O recorte 3:2 `rect=0,0,4500,3000` tira da borda direita um rapaz que estava mais perto da câmera. As lanternas foram aceitas por serem a decoração real da muralha. Arquivos: `mandarin_project/img/fotos/xa3-muralha-{800,1200}.{avif,webp}` (todos com menos de 150 KB). Fotógrafo: **Camillo Corsetti Antonini** (Unsplash). |

### 1. Pequim 北京

| ID | Onde aparece | O que mostrar | Pesquisa |
|---|---|---|---|
| BJ0 | Capa da cidade | Hutong com bicicletas e portas tradicionais | [beijing hutong](https://unsplash.com/s/photos/beijing-hutong) |
| BJ1 | 1.1 Pinyin e tons | **Ilustração própria** (não é foto): caderno 田字格 com 你好中文 e o pinyin nas cores dos tons | — |
| BJ2 | 1.2 Olá, eu sou… | Rua de Pequim com pessoas passando | [beijing street](https://unsplash.com/s/photos/beijing-street) |
| BJ3 | 1.3 Números e família | Mesa de jantar redonda com vários pratos | [chinese family dinner](https://unsplash.com/s/photos/chinese-family-dinner) |
| BJ4 | 1.4 Datas e horas | Torre do Tambor (鼓楼), que antigamente marcava as horas da cidade | [beijing drum tower](https://unsplash.com/s/photos/beijing-drum-tower) |

### 2. Xi'an 西安

| ID | Onde aparece | O que mostrar | Pesquisa |
|---|---|---|---|
| XA0 | Capa da cidade | Torre do Sino (钟楼) iluminada à noite, no centro da cidade | [xian bell tower](https://unsplash.com/s/photos/xian-bell-tower) |
| XA1 | 2.1 Na banca de comida | Comida de rua no bairro muçulmano | [xian muslim quarter food](https://unsplash.com/s/photos/xian-muslim-quarter-food) |
| XA2 | 2.2 Quanto custa? | Banca de mercado com preços escritos | [chinese market stall](https://unsplash.com/s/photos/chinese-market-stall) |
| XA3 | 2.3 Onde fica? | Caminho no alto da muralha (城墙) em linha reta, para ilustrar 往前走 | [xian city wall](https://unsplash.com/s/photos/xian-city-wall) |
| XA4 | 2.4 Pagar e planear | Pagamento com QR code no celular | [qr code payment china](https://unsplash.com/s/photos/qr-code-payment-china) |

### 3. Chengdu 成都

| ID | Onde aparece | O que mostrar | Pesquisa |
|---|---|---|---|
| CD0 | Capa da cidade | Casa de chá ao ar livre, com cadeiras de bambu | [chengdu teahouse](https://unsplash.com/s/photos/chengdu-teahouse) |
| CD1 | 3.1 Minha rotina | Metrô ou rua de manhã, com pessoas a caminho do trabalho | [china subway morning](https://unsplash.com/s/photos/china-subway-morning) |
| CD2 | 3.2 Gostos e tempo livre | Mesa de mahjong | [mahjong](https://unsplash.com/s/photos/mahjong) |
| CD3 | 3.3 Convites e planos | Hot pot (火锅) partilhado entre amigos | [sichuan hot pot](https://unsplash.com/s/photos/sichuan-hot-pot) |
| CD4 | 3.4 Tempo e mensagens | Rua na chuva, com guarda-chuvas e placas em chinês | [china rain street umbrella](https://unsplash.com/s/photos/china-rain-street-umbrella) |

### 4. Guilin 桂林

| ID | Onde aparece | O que mostrar | Pesquisa |
|---|---|---|---|
| GL0 | Capa da cidade | Rio Li com montanhas cársicas | [li river guilin](https://unsplash.com/s/photos/li-river-guilin) |
| GL1 | 4.1 Passagens e trens | Trem de alta velocidade na estação | [china high speed train](https://unsplash.com/s/photos/china-high-speed-train) |
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
3. As fotos são otimizadas (redimensionar e converter para AVIF/WebP) e registradas em `docs/fotos-creditos.csv`.
4. Todos os créditos aparecem numa página "Créditos" do site.
