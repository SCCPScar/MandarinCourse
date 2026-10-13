#!/bin/bash
# Gera o Relatório Final em duas passagens (a segunda escreve os números de página no índice)
cd "$(dirname "$0")"
DOC="Relatório Final - Chá"
converter() { HOME=/tmp/lohome timeout 200 soffice --headless --norestore --convert-to pdf "$DOC.docx" >/dev/null 2>&1; }
rm -f paginas.txt
python3 relatorio.py && converter && python3 paginas.py "$DOC.pdf" titulos.txt paginas.txt
python3 relatorio.py paginas.txt && converter
cp paginas.txt paginas-1.txt; python3 paginas.py "$DOC.pdf" titulos.txt paginas.txt
cmp -s paginas.txt paginas-1.txt && echo "Índice certo" || echo "As páginas mudaram: corre outra vez"
rm -f paginas-1.txt
pdfinfo "$DOC.pdf" | grep Pages
