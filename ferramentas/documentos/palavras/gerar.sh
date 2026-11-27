#!/bin/bash
# Gera a lista de palavras em chinês do site (PDF), a partir da base de dados, do js/palavras.js e das páginas
cd "$(dirname "$0")"
python3 extrair.py && python3 gerar_html.py && node pdf.js && rm -f palavras.json lista.html && mv "Palavras em chinês - Chá.pdf" ../../../docs/entregas/
