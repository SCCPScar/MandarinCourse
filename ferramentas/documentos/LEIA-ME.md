# Documentos do projeto

Aqui estão os scripts que geram os documentos Word em `docs/entregas/`.

- `molde.docx`: o modelo do formador. O cabeçalho e o rodapé dos documentos vêm daqui, sem alterações.
- `guia_instalacao.js`: o conteúdo do Guia de Instalação (usa a biblioteca `docx`, em Node.js).
- `guia_codigo.js`: o conteúdo do Guia de Código. Os trechos de código são copiados dos ficheiros do projeto no momento em que o documento é gerado; se um trecho deixar de existir, o script para com erro.
- `guia_estudo.js`: o conteúdo do Guia de Estudo (o texto entre [[ ]] fica marcado a amarelo, para a formanda completar).
- `guiao.js`: o Guião de Apresentação (diapositivos, tempos, demonstração e planos B).
- `comum.js`: as peças que os documentos partilham (tabelas, caixas, blocos de código, capa).
- `aplicar_molde.py`: copia o cabeçalho e o rodapé do molde para o documento gerado e põe o nome da formanda.
- `gerar.sh`: junta os dois passos e cria uma pré-visualização em imagens (precisa do LibreOffice e do Poppler).
- `img/`: as capturas de ecrã usadas nos documentos.

Uso: `npm install docx@9` e depois, por exemplo, `bash gerar.sh guia_codigo "Guia de Código - Chá"`.
A variável `PROJETO` indica a pasta do projeto (por omissão `/home/user/MandarinCourse`).

## Apresentação (PowerPoint)

A pasta `apresentacao/` gera o ficheiro `docs/entregas/Apresentação - Chá.pptx`.

- `apresentacao.js`: os diapositivos e as notas do orador (os textos do Guião). Usa a biblioteca `pptxgenjs` e os ícones da `react-icons`.
- `img/`: as capturas de ecrã do site, tiradas com uma conta de demonstração.
- `gerar.sh`: cria o ficheiro e as imagens de pré-visualização.

Uso: `npm install` dentro de `apresentacao/` e depois `bash gerar.sh`.

## Relatório Final

A pasta `relatorio/` gera o ficheiro `docs/entregas/Relatório Final - Chá.docx` a partir do `molde.docx` do formador.
Ao contrário dos guias, o relatório é escrito **dentro do próprio molde**: a capa, o cabeçalho, o rodapé, a grelha de planificação e a ficha de planeamento são os do formador, só preenchidos.

- `relatorio.py`: o texto do relatório e o preenchimento do molde (usa a biblioteca `python-docx`). Os excertos de código do Anexo D são copiados dos ficheiros reais do projeto.
- `estrutura.py`: desenha o esquema da estrutura do site (`img/estrutura.png`, convertido a partir do SVG).
- `paginas.py`: descobre em que página fica cada título, para o índice.
- `gerar_relatorio.sh`: corre tudo em duas passagens (a segunda escreve os números de página no índice). Precisa do LibreOffice e do Poppler.
- `img/`: as capturas de ecrã do site e dos protótipos.

Uso: `pip install python-docx` e depois `bash relatorio/gerar_relatorio.sh`.
O texto entre [ ] marcado a amarelo é para a formanda completar no Word.
