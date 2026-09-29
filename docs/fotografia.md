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

- Carregar com `loading="lazy"`, exceto a foto da primeiro ecrã.
- Colocar sempre um gradiente escuro por baixo do texto (contraste mínimo AA).
- Escrever `alt` em português a descrever a cena (por exemplo, "Banca de noodles à noite no bairro muçulmano de Xi'an").

## Lista de fotos

As pesquisas também funcionam no Pexels (`https://www.pexels.com/search/<termos>/`).

### Gerais

| ID | Onde aparece | O que mostrar | Pesquisa |
|---|---|---|---|
| G1 | Hero da página inicial | Mãos a servir chá numa taça pequena, com vapor e luz quente | [chinese tea pouring](https://unsplash.com/s/photos/chinese-tea-pouring) |
| G2 | Onboarding | Rua chinesa com placas legíveis em caracteres simplificados | [shanghai old street](https://unsplash.com/s/photos/shanghai-old-street) |
| G3 | Página "Sobre" | Mesa com cadernos, chá e alguém a estudar | [studying tea notebook](https://unsplash.com/s/photos/studying-tea-notebook) |

### Decisões

| ID | Estado | Notas |
|---|---|---|
| G1 | ✅ Aprovada (26/09/2026) | **Duas fotos, uma por tamanho de ecrã** (direção de arte com `<picture>`, troca em 768px). **Computador:** Yang Louie, `photo-1601366029950-0640bbbb8ce6`, recorte horizontal `rect=0,520,3456,2041`, com o texto **à direita** sobre um degradê escuro (layout 3A). O degradê também cobre o rosto parcial de uma segunda pessoa na borda direita, que não pode ficar visível. **Telemóvel:** Joshua Fernandez, `photo-1627491362358-6d437e65a3bc`, recorte fechado nas taças (`crop=focalpoint&fp-x=0.42&fp-y=0.5&fp-z=1.35`), que tira a tampa de plástico azul. Ficheiros: `mandarin_project/img/fotos/hero-desktop-{1280,1920}` e `hero-mobile-{390,780}`, em `.avif` e `.webp`. |
| — | Reservadas | Candidatas não usadas no hero, guardadas para as cápsulas culturais: ORIENTO `photo-1531970227416-f0cddeb1f748` (mesa comprida), ORIENTO `photo-1531364380693-8f16a988e6d3` (mesa vista de cima) e o recorte vertical 3B da Yang Louie. |
| G2 | ✅ Aprovada (26/09/2026) | Rua antiga de Xangai na chuva, `photo-1517309230475-6736d926b979` (opção D). Foi escolhida porque tem placas legíveis em caracteres simplificados (上海制扇, 华夏风采) e porque Xangai é o destino final da rota: o aluno vê logo no início onde vai chegar. A caligrafia com pincel foi descartada por não combinar com a primeiro ecrã. **Computador:** painel vertical ao lado das perguntas, recorte `rect=2350,0,1562,2480` (telhados, lanternas e a placa 华夏风采). **Telemóvel:** faixa horizontal por cima das perguntas, recorte `rect=1227,0,3546,2480` (fileira de lojas). Os dois recortes ficam só na metade de cima da foto, para **não mostrar os rostos** das pessoas na rua. Ficheiros: `mandarin_project/img/fotos/g2-onboarding-desktop-{340,680}` e `g2-onboarding-mobile-{390,780}`, em `.avif` e `.webp`. Fotógrafo: **Nuno Alberto** (Unsplash). |
| G3 | ✅ Aprovada (26/09/2026) | Bubble tea, `photo-1639927663411-35f23bb792b7`. Usada **só na vertical 4:5, ao lado do texto** (layout A). Na horizontal perde a tampa e o logotipo da marca fica em destaque, por isso não serve para faixas largas. Tem caracteres tradicionais (鮮) e uma marca visível, o que é aceitável numa página secundária. Ficheiros: `mandarin_project/img/fotos/g3-sobre-{640,960}.{avif,webp}`. Fotógrafo: **Kevin Canlas** (Unsplash). |

### Decisões das cidades

| ID | Estado | Notas |
|---|---|---|
| BJ0 | ✅ Aprovada (26/09/2026) | Hutong 草厂胡同 (Caochang Hutong, Dongcheng) com bicicleta antiga, violões e plantas, `photo-1719985970224-19b37fed86e7`. Não tem pessoas. **Computador (16:9):** `rect=0,632,6016,3384`, com o título embaixo à esquerda sobre um degradê escuro. **Telemóvel (4:5):** `rect=1500,0,3213,4016`, deslocado para a direita para a bicicleta aparecer inteira. Ficheiros: `mandarin_project/img/fotos/bj0-capa-desktop-{960,1600}` e `bj0-capa-mobile-{390,780}`, em `.avif` e `.webp` (todos com menos de 250 KB). Fotógrafo: **ran liwen** (Unsplash). |
| BJ1 | ✅ Aprovada (26/09/2026) | **Ilustração própria em SVG**, porque não havia foto gratuita de um 田字格 real. As candidatas do Unsplash (série de Jason Hu) eram papel 稿纸 com letras de músicas do Jay Chou (《简单爱》, 《红尘客栈》), protegidas por direitos autorais (CDADC), e misturavam caracteres simplificados e tradicionais. A ilustração mostra 你好中文 com o pinyin colorido pelos tons (nǐ e hǎo no 3.º tom, zhōng no 1.º, wén no 2.º) e uma linha para cobrir o 你. O texto foi convertido em caminhos (fontes LXGW WenKai e Lexend, as duas com licença SIL OFL), então o SVG não depende de fontes. Tem versão clara e escura: `mandarin_project/img/fotos/bj1-pinyin-tons-{claro,escuro}.svg`. O script que gera os ficheiros é `ferramentas/gerar_bj1.py`. Não precisa de crédito. |
| BJ2 | ✅ Aprovada (26/09/2026) | Entrada de mercado em Pequim com as placas **天桥欢迎您** ("Tianqiao dá-te as boas-vindas") e o pavilhão 武圣亭 (placa lida da direita para a esquerda), `photo-1642747545738-a43c06ae77a7`. O 欢迎 e o 您 são vocabulário da própria unidade 1.2. A foto original tem rostos nítidos embaixo, por isso o recorte 3:2 `rect=955,0,3300,2200` para **logo acima das cabeças**. No telemóvel o título fica embaixo da foto, e não por cima. A foto é de 2012 e o céu está amarelado, o que se aceitou por causa do texto. Ficheiros: `mandarin_project/img/fotos/bj2-cumprimentos-{800,1200}.{avif,webp}` (todos com menos de 150 KB). Fotógrafo: **Serg Balak** (Unsplash). |
| BJ3 | ✅ Aprovada (26/09/2026) | Jantar de família com steamboat (火锅 de caldo claro) no centro da mesa e vários pratos à volta, `photo-1614104030967-5ca61a54247b`. As etiquetas indicam o jantar de reunião do Ano Novo Chinês (团圆饭), o que liga a foto ao tema "família". Dá para praticar números: 桌上有几盘菜？ Foi tirada em Singapura, mas a imagem não mostra o país. Não tem rostos, só a ponta de uma mão. Recorte 3:2 `rect=0,760,3024,2016`, centrado na panela. É diferente do hot pot 麻辣 de Chengdu (CD3), e os dois podem ser comparados na cápsula cultural. Ficheiros: `mandarin_project/img/fotos/bj3-familia-{800,1200}.{avif,webp}` (todos com menos de 150 KB). Fotógrafa: **Cera** (Unsplash). |
| BJ4 | ✅ Aprovada (26/09/2026) | Torre do Tambor (鼓楼) de Pequim, cujos tambores marcavam as horas da cidade, `photo-1645545160282-fa5c606ad43e`. Não tem pessoas. Os fios de trólebus que cruzam a foto são reais e ficaram. O céu original era turquesa muito saturado, por isso os ficheiros usam **saturação −30** (`sat=-30`, versão B), para cumprir a regra 7. A foto inteira já é 3:2, sem recorte. Ficheiros: `mandarin_project/img/fotos/bj4-horas-{800,1200}.{avif,webp}` (todos com menos de 150 KB). Fotógrafo: **Steven Wilson** (Unsplash). |
| XA0 | ✅ Aprovada (26/09/2026) | Torre do Sino (钟楼) de Xi'an iluminada à noite, com prédios modernos atrás, `photo-1547253807-593ee708edab`. Trocou de lugar com a muralha: a torre passou para a capa, e a muralha foi para o XA3. O céu preto à esquerda deixa o título legível. Os recortes cortam a parte de baixo, onde estavam os carros, o táxi, uma pessoa de moto e as **placas dos carros** (a matrícula é dado pessoal no RGPD). **Computador (16:9):** `rect=0,250,6000,3375`. **Telemóvel (4:5):** `rect=2386,300,2960,3700`. Ficheiros: `mandarin_project/img/fotos/xa0-capa-desktop-{960,1600}` e `xa0-capa-mobile-{390,780}`, em `.avif` e `.webp` (todos com menos de 250 KB). Fotógrafo: **Xiaolong Wong** (Unsplash). |
| XA1 | ✅ Aprovada (26/09/2026) | Banca do 老孙家 (restaurante muçulmano famoso de Xi'an) no bairro muçulmano, à noite e com o chão molhado, `photo-1784543965983-956b090037c7`. A foto original mostra três vendedores com o rosto nítido, por isso o recorte 3:2 `rect=1008,3096,2592,1728` começa **logo abaixo dos rostos** (opção C). Ficam as placas **灌汤臭豆腐** e **火爆鱿鱼** e os espetos de lula no balcão. A plaquinha 铁板鱿鱼 20元8串 ficou de fora porque está colada ao rosto de um vendedor. Ficheiros: `mandarin_project/img/fotos/xa1-banca-{800,1200}.{avif,webp}` (todos com menos de 150 KB). Fotógrafo: **Falco Negenman** (Unsplash). |
| XA2 | ✅ Aprovada (26/09/2026) | Balcão de uma banca de 麻辣烫 / 米线 com tigelas de porcelana azul e branca, `photo-1789372666719-e4bc6bf3bcf0`. Tem um ementa bilingue com preços (柳州螺蛳粉, 越南牛肉粉, **28元/份**), que serve para praticar 元 e 多少钱. A pessoa atrás do balcão aparece sem rosto. A foto inteira já é 3:2, sem recorte. O local não está identificado, então a foto não é necessariamente de Xi'an. Ficheiros: `mandarin_project/img/fotos/xa2-precos-{800,1200}.{avif,webp}` (todos com menos de 150 KB). Fotógrafo: **Haydn** (Unsplash). |
| XA3 | ✅ Aprovada (26/09/2026) | Alto da muralha de Xi'an, com lanternas e bandeiras, pessoas de bicicleta e prédios residenciais ao fundo, `photo-1588088470830-ab765f87abd5`. O caminho em linha reta ilustra **往前走** ("siga em frente"). Não foi encontrada no Unsplash uma foto gratuita de portão com nome visível. As pessoas estão longe e de costas. O recorte 3:2 `rect=0,0,4500,3000` tira da borda direita um rapaz que estava mais perto da câmera. As lanternas foram aceitas por serem a decoração real da muralha. Ficheiros: `mandarin_project/img/fotos/xa3-muralha-{800,1200}.{avif,webp}` (todos com menos de 150 KB). Fotógrafo: **Camillo Corsetti Antonini** (Unsplash). |
| XA4 | ✅ Aprovada (26/09/2026) | Balcão de comida em Pequim com os suportes de pagamento do **Alipay (支付宝)** e do **WeChat Pay (微信支付)**, e preços legíveis: 烤脑花 25元/对, 烤猪蹄 18元1份 30元2份, 烤猪皮 3元/串, `photo-1540109296173-755cfc624a5a`. O vendedor aparecia com o rosto nítido, por isso o recorte 3:2 (`rect=2880,2170,3465,2310` no original) começa **logo abaixo do queixo**. Os **dois QR codes eram reais e escaneáveis, por isso foram desfocados** (desfoque gaussiano com bordas suaves, feito com Pillow). Os ficheiros foram gerados a partir dessa versão editada, e não diretamente do Unsplash. A foto é de Pequim, não de Xi'an. Ficheiros: `mandarin_project/img/fotos/xa4-pagar-{800,1200}.{avif,webp}`. Fotógrafo: **Steve Long** (Unsplash). |
| CD0 | ✅ Aprovada (28/09/2026) | Rua antiga com a placa **茶馆相声** ("casa de chá com *xiangsheng*", a comédia de diálogo) e a multidão borrada por longa exposição, `photo-1713181011329-687f14b9c30b`. Liga a capa ao nome **Chá** (茶) e às casas de chá (茶馆) da cultura de Chengdu. A legenda 津味相声 indica que a foto deve ser de **Tianjin**, e não de Chengdu, o que se aceitou pelo tema. Havia **uma senhora com o rosto nítido** de perfil e um **logotipo do McDonald's** logo à esquerda da placa: **os dois foram desfocados** (desfoque gaussiano com bordas suaves, feito com Pillow), e os ficheiros saem dessa versão editada. **Computador (16:9):** recorte `396,0,4085,2075`. **Telemóvel (4:5):** recorte `1665,0,3325,2075`. Ficheiros: `mandarin_project/img/fotos/cd0-capa-desktop-{960,1600}` e `cd0-capa-mobile-{390,780}`, em `.avif` e `.webp` (todos com menos de 250 KB). **Falta o nome do fotógrafo.** |
| CD1 | ✅ Aprovada (28/09/2026) | Placa iluminada do metro de Pequim **14号线 · Line 14 · 乘车 To Subway**, num corredor escuro, `photo-1615592315136-598868a2bddf`. Liga a lição à frase 我每天坐地铁上班. Não tem pessoas nem logotipo que identifique a cidade (Chengdu também tem linha 14). Recorte 3:2 `rect=306,0,5388,3592`. Foi exportada com qualidade mais alta (AVIF 65, WebP 75) para o fundo escuro não criar faixas. Ficheiros: `mandarin_project/img/fotos/cd1-rotina-{800,1200}.{avif,webp}`. Fotógrafo: **Brady Bellini** (Unsplash). |
| CD2 | ✅ Aprovada (28/09/2026) | Partida de mahjong numa festa do Ano Novo Lunar, com as peças no centro e só mãos e braços dos jogadores, `photo-1643508522267-2c9a1c544187`. Uma peça mostra **北** ("norte"), já vista na unidade de direções. O local não é Chengdu, mas o assunto é o jogo, o passatempo mais famoso da cidade. A foto inteira já é 3:2, sem recorte. Ficheiros: `mandarin_project/img/fotos/cd2-mahjong-{800,1200}.{avif,webp}`. Fotógrafo: **Mick Haupt** (Unsplash). |
| CD3 | ✅ Aprovada (28/09/2026) | Mesa de hot pot em Chongqing com um **鸳鸯锅** (metade tomate, metade 麻辣), vários pratos para dividir e três pares de pauzinhos, `photo-1703945530505-2f06e3e1cf97`. Ilustra o convite 一起去吃火锅吧！ Chongqing é vizinha de Chengdu e fez parte de Sichuan até 1997. Não tem rostos. Contrasta com o hot pot de caldo claro do BJ3. A foto inteira já é 3:2, sem recorte. Ficheiros: `mandarin_project/img/fotos/cd3-hotpot-{800,1200}.{avif,webp}` (todos com menos de 150 KB). Fotógrafo: **Yihan Wang** (Unsplash). |
| CD4 | ✅ Aprovada (28/09/2026) | Dia de chuva num pátio de templo em Chengdu: uma pessoa de guarda-chuva passa em frente ao muro com **精妙冠世** em dourado (lido da direita para a esquerda), com o chão molhado refletindo tudo e prédios residenciais ao fundo, `photo-1627542424169-3122c2a3c998`. Serve para ensinar 下雨了 (了 de mudança). O rosto da pessoa fica escondido pelo guarda-chuva e pela sombra e não é identificável. A foto inteira já é 3:2, sem recorte. Ficheiros: `mandarin_project/img/fotos/cd4-chuva-{800,1200}.{avif,webp}`. Fotógrafo: **Chris** (Unsplash). |
| GL0 | ✅ Aprovada (28/09/2026) | Rio Li em Yangshuo com os montes cársicos dos dois lados e um barco ao centro, `photo-1659233306527-226a26a08634`. Não tem pessoas nem texto. A água escura e calma em baixo deixa o título legível. **Computador (16:9):** `rect=0,400,5158,2901` (corta só um pouco do céu). **Telemóvel (4:5):** `rect=1590,0,2751,3439`, centrado no barco. Ficheiros: `mandarin_project/img/fotos/gl0-capa-desktop-{960,1600}` e `gl0-capa-mobile-{390,780}`, em `.avif` e `.webp` (todos com menos de 250 KB). Fotógrafo: **Sergio Li** (Unsplash). |
| GL1 | ✅ Aprovada (28/09/2026) | Comboio de alta velocidade 和谐号 (Héxié Hào) a entrar numa estação com neve, `photo-1706275033319-9bc9ddad1369`. O nome do comboio em chinês fica bem visível na frente e serve de vocabulário extra. A estação é a de Zibo (Shandong), não a de Guilin, o que não faz mal porque a unidade fala de comboios em geral. O recorte `rect=0,250,2850,1900` tira a mancha escura desfocada da direita (o ombro de alguém em primeiro plano). A neve deixa os ficheiros pesados, por isso a versão de 1200 px usa qualidade mais baixa para ficar abaixo de 150 KB. Ficheiros: `mandarin_project/img/fotos/gl1-comboios-{800,1200}.{avif,webp}`. Fotógrafo: **KUA YUE** (Unsplash). |
| GL2 | ✅ Aprovada (28/09/2026) | Entrada do **和平饭店** (Hépíng Fàndiàn, Peace Hotel), no Bund de Xangai, num dia de chuva, `photo-1517205831530-8bfe1c4f070b`. O nome em chinês aparece em letras douradas por cima da entrada e ensina que 饭店 também quer dizer "hotel" (além de 酒店 e 宾馆). O hotel fica em Xangai e não em Guilin, tal como a estação da GL1 fica em Zibo; a unidade fala de hotéis em geral. As pessoas passam pequenas, de guarda-chuva, e não são identificáveis. A foto é vertical: o recorte 3:2 `rect=0,1300,2832,1888` fica à volta da placa e da entrada. Ficheiros: `mandarin_project/img/fotos/gl2-hotel-{800,1200}.{avif,webp}`. Fotógrafo: **Yiran Ding** (Unsplash). |
| — | Reservada | **Ilustração própria da receção** (placa 桂林酒店 com 欢迎光临, balcão com 前台, cartão 房卡 e campainha), feita antes de aparecer a foto do 和平饭店. Fica guardada para usar dentro das lições. Ficheiros: `mandarin_project/img/fotos/gl2-ilustracao-{claro,escuro}.svg`, gerados por `ferramentas/gerar_gl2.py` (fontes LXGW WenKai e Lexend, SIL OFL). Foram recusadas duas fotos por não mostrarem um hotel: um restaurante de hotpot (蜀香楼 老火锅) e um templo (四民崇祀仰善神). Um lobby europeu também foi recusado por não ter nada da China. |
| GL3 | ✅ Aprovada (28/09/2026) | Centro de Yangshuo junto à 西街 (West Street), com os montes cársicos ao fundo refletidos na água, `photo-1615077967405-29cd8915acbf`. Mostra o antigo e o moderno lado a lado (um pavilhão tradicional ao lado de um McDonald's e de um Starbucks), que é o tema da lição 4.3.2. Tem texto chinês legível no prédio do McDonald's: **西街味道**. As marcas são aceitáveis numa foto de rua e ajudam a mostrar o contraste. As pessoas aparecem muito pequenas e não são identificáveis. A foto já é 3:2, sem recorte. Ficheiros: `mandarin_project/img/fotos/gl3-yangshuo-{800,1200}.{avif,webp}`. Fotógrafo: **Federico Mata** (Unsplash). |
| GL4 | ✅ Aprovada (28/09/2026) | Farmácia de Hong Kong à noite, com o caractere **藥** (medicamento) em néon laranja e a montra cheia de caixas com texto chinês, `photo-1786179737157-2f19fd0f5d32`. Como é Hong Kong, os caracteres são **tradicionais**: 藥 é a forma tradicional de 药. Por isso juntei essa nota à explicação da lição 4.4.1 ("Estou doente"). A foto é vertical: o recorte 3:2 `rect=0,1100,3456,2304` fica à volta do 藥 e da montra e deixa de fora o rosto de uma funcionária (atrás das prateleiras, mais abaixo) e uma pessoa na borda direita. A versão de 1200 px usa qualidade mais baixa para ficar abaixo de 150 KB. Ficheiros: `mandarin_project/img/fotos/gl4-farmacia-{800,1200}.{avif,webp}`. Fotógrafo: **Sirius Harrison** (Unsplash). |
| HZ0 | ✅ Aprovada (28/09/2026) | Pavilhão tradicional de dois andares sobre o Lago Oeste (西湖), com um cais de madeira, um barco e as montanhas ao fundo na névoa, `photo-1587153662967-c9d9977bf8d3`. O Lago Oeste aparece nas lições 5.1 e 5.2. Há um grupo de turistas no pavilhão, mas são muito pequenos, a maioria de costas, e ninguém é identificável. Não tem texto chinês, o que é normal numa capa de paisagem. **Computador (16:9):** `rect=0,750,4000,2250` (corta parte do céu; o título fica sobre a água, em baixo à esquerda). **Telemóvel (4:5):** `rect=1600,0,2400,3000`, à volta do pavilhão e da árvore. Ficheiros: `mandarin_project/img/fotos/hz0-capa-desktop-{960,1600}` e `hz0-capa-mobile-{390,780}`, em `.avif` e `.webp` (todos com menos de 250 KB). Fotógrafo: **A F** (Unsplash). |
| HZ1 | ✅ Aprovada (28/09/2026) | Plantação de chá Longjing (龙井) em Hangzhou, com as folhas em primeiro plano, as montanhas na névoa ao fundo e, ao centro, a escultura do bule gigante da zona do chá, `photo-1680535105125-0f719ce3b2c8`. Liga à frase da lição 5.1: 龙井是杭州最有名的茶. Não tem pessoas. A foto é vertical: o recorte 3:2 `rect=0,2150,4480,2987` vai das montanhas até às folhas e tira o céu branco. O autor pede o crédito "Bluesea Tea". A versão de 1200 px usa qualidade mais baixa para ficar abaixo de 150 KB. Ficheiros: `mandarin_project/img/fotos/hz1-cha-{800,1200}.{avif,webp}`. Fotógrafo: **Bluesea Tea** (Unsplash). |
| HZ2 | ✅ Aprovada (28/09/2026) | Canal da vila de água de **Wuzhen (乌镇)**, perto de Hangzhou (Zhejiang), com casas antigas, lojas iluminadas ao fundo e um barco de madeira a remos, `photo-1786462806200-493db6488087`. Encaixa na lição 5.2.3 "Contar uma viagem". Há um barqueiro e um senhor a varrer, pequenos, de lado ou a olhar para baixo, e não são identificáveis. Luz natural, sem filtros fortes. Foi recusada antes uma foto de um templo de Hangzhou (monges em prática religiosa como assunto principal e filtro de cor forte). A foto é quadrada: o recorte 3:2 usa `crop=focalpoint&fp-x=0.5&fp-y=0.52`, que tira as folhas de cima e as pedras escuras de baixo. A água cheia de reflexos deixa os ficheiros pesados, por isso a versão de 1200 px usa qualidade mais baixa para ficar abaixo de 150 KB. Ficheiros: `mandarin_project/img/fotos/hz2-wuzhen-{800,1200}.{avif,webp}`. Fotógrafo: **mark wang** (Unsplash). |
| HZ3 | ✅ Aprovada (28/09/2026) | Esplanada de comida de rua em Xiamen (Fujian), com amigos à mesa, bebidas e cadeiras de plástico amarelas, `photo-1742635870269-72d0b1968956`. Tem muito chinês simplificado legível: **漳州卤面**, **沙茶面** e **独一风味 · 传承手艺** (e 厦门名小吃 na foto inteira). Serve para frases como 你觉得这个面怎么样？ **Direito à imagem:** o recorte 3:2 `rect=1644,411,4933,3289` deixa de fora uma rapariga de perfil com o rosto visível; a outra rapariga está de costas; o rosto do rapaz de cinzento foi **desfocado** (desfoque gaussiano numa elipse, com Pillow). Por isso os ficheiros são gerados a partir de uma cópia local e não diretamente do Unsplash. Antes foi considerada uma foto de placas de um café em Yanji (延吉, com pinyin), posta de lado por misturar chinês e coreano e não mostrar pessoas a conversar. Ficheiros: `mandarin_project/img/fotos/hz3-esplanada-{800,1200}.{avif,webp}`. Fotógrafo: **Zhen Yao** (Unsplash). |
| HZ4 | ✅ Aprovada (29/09/2026) | Estafeta de costas numa rua de Fuzhou (Fujian), com a caixa verde da aplicação de supermercado online **朴朴** (se lê 上朴朴), `photo-1765341448837-35361bd0c2d0`. Liga ao tema da unidade (网购, 快递, 外卖). Tem placas de rua com chinês e pinyin: **八一七路 (Bayiqi Rd.)**, **工业路** e **延平路**. Ninguém mostra a cara: o estafeta e a senhora de camisola vermelha estão de costas e o peão ao fundo é minúsculo. A **matrícula do carro cinzento foi desfocada** (é dado pessoal no RGPD, como na XA0), por isso os ficheiros são gerados a partir de uma cópia local. A foto é vertical: o recorte 3:2 `rect=0,2612,3482,2321` fica com as placas, o estafeta e a rua. Foi recusada uma foto de um estafeta em Wuhan com o rosto de perfil em destaque. Ficheiros: `mandarin_project/img/fotos/hz4-estafeta-{800,1200}.{avif,webp}`. Fotógrafo: **CHEN HENG** (Unsplash). |
| SH4 | ✅ Escolhida (28/09/2026) | Placa do metro de Xangai **13号线 · Line 13 · 50m**, com a placa **2号线 / 12号线** logo abaixo, `photo-1755227826685-8d2974bf149e`. Foi testada para o CD1, mas o logotipo do metro e a rua 吴江路 mostram que é Xangai, por isso ficou para a unidade "Ler a cidade". Não tem pessoas. O recorte 3:2 `rect=0,1250,2239,1493` tira da foto um **outdoor de cerveja com um ator famoso** (rosto identificável e publicidade) e o logotipo da GAP. Ficheiros: `mandarin_project/img/fotos/sh4-placas-{800,1200}.{avif,webp}`. Fotógrafo: **Gabriel Federa** (Unsplash). |

### 1. Pequim 北京

| ID | Onde aparece | O que mostrar | Pesquisa |
|---|---|---|---|
| BJ0 | Capa da cidade | Hutong com bicicletas e portas tradicionais | [beijing hutong](https://unsplash.com/s/photos/beijing-hutong) |
| BJ1 | 1.1 Pinyin e tons | **Ilustração própria** (não é foto): caderno 田字格 com 你好中文 e o pinyin nas cores dos tons | — |
| BJ2 | 1.2 Olá, eu sou… | Rua de Pequim com pessoas a passar | [beijing street](https://unsplash.com/s/photos/beijing-street) |
| BJ3 | 1.3 Números e família | Mesa de jantar redonda com vários pratos | [chinese family dinner](https://unsplash.com/s/photos/chinese-family-dinner) |
| BJ4 | 1.4 Datas e horas | Torre do Tambor (鼓楼), que antigamente marcava as horas da cidade | [beijing drum tower](https://unsplash.com/s/photos/beijing-drum-tower) |

### 2. Xi'an 西安

| ID | Onde aparece | O que mostrar | Pesquisa |
|---|---|---|---|
| XA0 | Capa da cidade | Torre do Sino (钟楼) iluminada à noite, no centro da cidade | [xian bell tower](https://unsplash.com/s/photos/xian-bell-tower) |
| XA1 | 2.1 Na banca de comida | Comida de rua no bairro muçulmano | [xian muslim quarter food](https://unsplash.com/s/photos/xian-muslim-quarter-food) |
| XA2 | 2.2 Quanto custa? | Banca de mercado com preços escritos | [chinese market stall](https://unsplash.com/s/photos/chinese-market-stall) |
| XA3 | 2.3 Onde fica? | Caminho no alto da muralha (城墙) em linha reta, para ilustrar 往前走 | [xian city wall](https://unsplash.com/s/photos/xian-city-wall) |
| XA4 | 2.4 Pagar e planear | Balcão com os suportes de QR code do Alipay e do WeChat Pay e preços em 元 | [qr code payment china](https://unsplash.com/s/photos/qr-code-payment-china) |

### 3. Chengdu 成都

| ID | Onde aparece | O que mostrar | Pesquisa |
|---|---|---|---|
| CD0 | Capa da cidade | Rua antiga com a placa **茶馆相声** (casa de chá com *xiangsheng*), ligada ao nome Chá e à cultura das casas de chá | — |
| CD1 | 3.1 Minha rotina | Placa do metro com 号线 e 乘车, para falar do caminho para o trabalho | [china subway sign](https://unsplash.com/s/photos/china-subway-sign) |
| CD2 | 3.2 Gostos e tempo livre | Mesa de mahjong | [mahjong](https://unsplash.com/s/photos/mahjong) |
| CD3 | 3.3 Convites e planos | Hot pot (火锅) compartilhado entre amigos | [sichuan hot pot](https://unsplash.com/s/photos/sichuan-hot-pot) |
| CD4 | 3.4 Tempo e mensagens | Rua na chuva, com guarda-chuvas e placas em chinês | [china rain street umbrella](https://unsplash.com/s/photos/china-rain-street-umbrella) |

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
| HZ1 | 5.1 Comparar | Plantação de chá Longjing em terraços | [longjing tea plantation](https://unsplash.com/s/photos/longjing-tea-plantation) |
| HZ2 | 5.2 Contar o passado | Rua antiga com lojas tradicionais | [hangzhou old street](https://unsplash.com/s/photos/hangzhou-old-street) |
| HZ3 | 5.3 Dar opinião | Café moderno com mesas e conversa | [china cafe](https://unsplash.com/s/photos/china-cafe) |
| HZ4 | 5.4 Compras online | Entregador de moto | [delivery scooter china](https://unsplash.com/s/photos/delivery-scooter-china) |

### 6. Xangai 上海

| ID | Onde aparece | O que mostrar | Pesquisa |
|---|---|---|---|
| SH0 | Capa da cidade | O Bund (外滩) com Pudong ao fundo | [shanghai bund](https://unsplash.com/s/photos/shanghai-bund) |
| SH1 | 6.1 Casa e serviços | Casas shikumen (石库门) ou prédios residenciais | [shanghai shikumen](https://unsplash.com/s/photos/shanghai-shikumen) |
| SH2 | 6.2 No trabalho | Escritório moderno com vista para a cidade | [shanghai office](https://unsplash.com/s/photos/shanghai-office) |
| SH3 | 6.3 Entrevista de emprego | Reunião numa mesa, com as mãos e documentos em destaque | [business meeting table](https://unsplash.com/s/photos/business-meeting-table) |
| SH4 | 6.4 Ler a cidade | Placas de metro e de rua bilingues (号线, distâncias, 东 / 西) | [shanghai metro sign](https://unsplash.com/s/photos/shanghai-metro-sign) |

## Processo de escolha

1. Para cada ID, a família escolhe **2 candidatas** e cola os links numa lista.
2. Na revisão escolhe-se 1 por ID, com base nas regras de seleção.
3. As fotos são otimizadas (redimensionar e converter para AVIF/WebP) e registadas em `docs/fotos-creditos.csv`.
4. Todos os créditos aparecem numa página "Créditos" do site.
