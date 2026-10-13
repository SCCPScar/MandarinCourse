#!/bin/bash
# Gera a apresentação e cria as imagens dos diapositivos para rever (precisa do LibreOffice e do Poppler)
cd "$(dirname "$0")"
NODE_PATH="$PWD/node_modules" node apresentacao.js || exit 1
HOME=/tmp/lohome timeout 200 soffice --headless --norestore --convert-to pdf "Apresentação - Chá.pptx" >/dev/null 2>&1
rm -f slide-*.jpg; pdftoppm -jpeg -r 55 "Apresentação - Chá.pdf" slide && ls slide-* | wc -l
