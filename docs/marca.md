# Chá · Identidade de marca

> Decisões aprovadas a 25/09/2026 (idioma revisto a 28/09/2026). Este documento é a referência para o design e o código.

## Nome

**Chá** (茶, *chá*). Nas pesquisas e nos textos usa-se sempre **Chá Mandarim**.

- A palavra portuguesa "chá" vem do chinês 茶, trazida pelo comércio português através de Macau. É a primeira palavra em mandarim que qualquer lusófono já conhece.
- A "hora do chá" é a metáfora da sessão diária curta.
- Domínios livres na data da verificação (25/09/2026): `chamandarim.com`, `chamandarim.pt`.
- **Pendente:** pesquisar se o nome está registado como marca no INPI (Portugal) e no EUIPO (UE), classe 41 (educação).

Slogan: *Aprende mandarim ao teu ritmo. De graça, para sempre.*

## Idioma

**Todo o projeto é escrito em português europeu (pt-PT)**: interface, lições, mensagens, código, comentários e documentação. O projeto é o trabalho final de um curso em Portugal, avaliado também por uma professora de português. O relatório segue as normas **APA (7.ª edição)**.

- Trata-se o aluno por **"tu"** (ex.: "Guarda o teu progresso").
- Usa-se o vocabulário de Portugal: utilizador, palavra-passe, registo, ficheiro, ecrã, telemóvel, comboio, bilhete, pequeno-almoço…
- Os comentários do código ficam na **primeira pessoa** (ex.: "Aqui eu guardo…") e o código deve ser simples e curto.
- Os caracteres chineses usam a escrita **simplificada**, e a romanização é o **pinyin** com as marcas de tom.
- As regras legais seguem **Portugal e a UE** (RGPD e Lei n.º 58/2019).
- **Pendente:** passar para pt-PT o que ainda está em pt-BR (as páginas HTML, os textos do JavaScript e os documentos `rota-12-meses.md` e `fotografia.md`).

## Logotipo

- **Símbolo:** um carimbo chinês (印章) vermelho, com cantos arredondados (raio de 20% do lado) e rotação de −4°. Tem o caractere 茶 em branco, com traço de pincel (fonte Ma Shan Zheng).
- **Logotipo completo:** o carimbo + a palavra "chá" em Bricolage Grotesque ExtraBold, com "MANDARIM" por baixo em versaletes espaçados.
- **Variantes:** favicon (só o carimbo, 32px) e versão para fundo escuro.
- **Feito (28/09/2026):** o 茶 foi convertido em desenho vetorial em `mandarin_project/img/logo-cha.svg`, que também serve de ícone do separador. O logótipo não depende da fonte.

## Cores

| Token | Nome | Claro | Escuro | Uso |
|---|---|---|---|---|
| `--jade` | Jade 玉 | `#0E7C66` | `#3DBE9C` | Cor principal: botões de ação, progresso, respostas certas |
| `--seal` | Carimbo 朱砂 | `#E0442E` | `#F0553D` | Logotipo, streak, carimbos. **Nunca é usado para erros** |
| `--seal-text` | Carimbo (texto) | `#C8361F` | `#FF7A64` | Texto vermelho pequeno (contraste AA) |
| `--gold` | Ouro 金 | `#E8A317` | `#F2B83A` | Conquistas. Só como fundo, com texto escuro por cima |
| `--plum` | Ameixa 梅 | `#A8325E` | `#E0679A` | Resposta errada, sempre com o ícone ✗ |
| `--ink` | Tinta 墨 | `#18212B` | `#E6ECEA` | Texto |
| `--ground` | Porcelana 瓷 | `#F4F7F6` | `#0F1519` | Fundo da página |
| `--surface` | Superfície | `#FFFFFF` | `#172026` | Cartões e painéis |

Proporção aproximada de uso: porcelana 60% · tinta 20% · jade 12% · carimbo 4% · ouro 2% · ameixa 2%.

### Cores dos tons (código de conteúdo)

As cores dos tons são iguais em todo o site. Servem para colorir o pinyin, os flashcards e os gráficos de voz.

| Tom | Claro | Escuro |
|---|---|---|
| 1.º (mā) | `#2F6FD0` | `#6FA2F0` |
| 2.º (má) | `#2E9A48` | `#5CC878` |
| 3.º (mǎ) | `#B77C06` | `#E4AE3A` |
| 4.º (mà) | `#D23A2A` | `#F26A5A` |
| Neutro (ma) | `#7A8490` | `#95A1AB` |

## Tipografia

As fontes latinas têm licença SIL Open Font License e estão **guardadas no próprio site** (`mandarin_project/fonts/`, carregadas por `css/fontes.css`), sem Google Fonts (RGPD). Para os caracteres chineses uso as fontes que já vêm no sistema, porque uma fonte chinesa completa pesa vários megabytes.

| Fonte | Função |
|---|---|
| Bricolage Grotesque | Títulos e logotipo |
| Lexend | Texto e interface |
| Fontes do sistema (PingFang SC, Microsoft YaHei, Noto Sans SC) | Caracteres chineses |
| Ma Shan Zheng | Só no carimbo |

## Movimento

| Momento | Duração |
|---|---|
| Hover e press de botões | 120–150 ms |
| Resposta certa (pop) e errada (tremida) | 320 ms |
| Virar o flashcard | 450 ms |
| Carimbo no passaporte | 420 ms |
| Mudar de ecrã | 200 ms |

Proibido: confetes, partículas, animações em loop, elementos que piscam, som automático. É obrigatório respeitar `prefers-reduced-motion`.

## Layout

- Largura máxima de 1120px e espaçamento em múltiplos de 4 (4, 8, 12, 16, 24, 32, 48, 64).
- A primeiro ecrã mostra sempre a próxima ação, a meta do dia e o progresso.
- No máximo 1 destaque forte (foto ou cor sólida) por ecrã.
- Fundo com quadrícula discreta inspirada no 田字格.

Estudo visual completo (com demonstrações interativas): https://claude.ai/artifact/3QLat173XmEtcJ7YmJsDTG
