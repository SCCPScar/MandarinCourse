# Documentos do projeto

Aqui estão os scripts que geram os documentos Word em `docs/entregas/`.

- `molde.docx`: o modelo do formador. O cabeçalho e o rodapé dos documentos vêm daqui, sem alterações.
- `guia_instalacao.js`: o conteúdo do Guia de Instalação (usa a biblioteca `docx`, em Node.js).
- `aplicar_molde.py`: copia o cabeçalho e o rodapé do molde para o documento gerado e põe o nome da formanda.
- `gerar.sh`: junta os dois passos e cria uma pré-visualização em imagens (precisa do LibreOffice e do Poppler).
- `img/`: as capturas de ecrã usadas nos documentos.

Uso: `npm install docx@9` e depois `bash gerar.sh guia_instalacao "Guia de Instalação - Chá"`.
