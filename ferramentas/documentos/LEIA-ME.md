# Documentos do projeto

Aqui estão os scripts que geram os documentos Word em `docs/entregas/`.

- `molde.docx`: o modelo do formador. O cabeçalho e o rodapé dos documentos vêm daqui, sem alterações.
- `guia_instalacao.js`: o conteúdo do Guia de Instalação (usa a biblioteca `docx`, em Node.js).
- `guia_codigo.js`: o conteúdo do Guia de Código. Os trechos de código são copiados dos ficheiros do projeto no momento em que o documento é gerado; se um trecho deixar de existir, o script para com erro.
- `comum.js`: as peças que os documentos partilham (tabelas, caixas, blocos de código, capa).
- `aplicar_molde.py`: copia o cabeçalho e o rodapé do molde para o documento gerado e põe o nome da formanda.
- `gerar.sh`: junta os dois passos e cria uma pré-visualização em imagens (precisa do LibreOffice e do Poppler).
- `img/`: as capturas de ecrã usadas nos documentos.

Uso: `npm install docx@9` e depois, por exemplo, `bash gerar.sh guia_codigo "Guia de Código - Chá"`.
A variável `PROJETO` indica a pasta do projeto (por omissão `/home/user/MandarinCourse`).
