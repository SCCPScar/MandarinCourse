#!/bin/bash
# gera um documento: bash gerar.sh guia_instalacao "Guia de Instalação - Chá"
cd "$(dirname "$0")"
node "$1.js" && python3 aplicar_molde.py gerado.docx "$2.docx" && cp "$2.docx" verificar.docx \
 && HOME=/tmp/lohome timeout 200 soffice --headless --norestore --convert-to pdf verificar.docx >/dev/null 2>&1 \
 && rm -f pg-*.jpg grade-*.jpg && pdftoppm -jpeg -r 45 verificar.pdf pg && python3 - <<'PY'
from PIL import Image
import glob
fs=sorted(glob.glob('pg-*.jpg')); ims=[Image.open(f) for f in fs]
w,h=ims[0].size; cols=4
for n in range(0,len(ims),8):
    g=Image.new('RGB',(w*cols,h*2),'white')
    for i,im in enumerate(ims[n:n+8]): g.paste(im,((i%cols)*w,(i//cols)*h))
    g.save(f'grade-{n//8}.jpg')
print(len(ims),'páginas')
PY
