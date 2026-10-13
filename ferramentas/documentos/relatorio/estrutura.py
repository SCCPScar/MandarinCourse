# Desenha a estrutura do site Chá em SVG (árvore de páginas)
import html
W=1540
raiz=('Página inicial','index.php')
grupos=[
 (('A rota','rota.php'),[ (('Cidade (6)','cidade.php'),[ (('Lição (72)','licao.php'),[ (('Concluir lição','concluir-licao.php'),[]) ]) ]) ]),
 (('Conteúdos','menu principal'),[ ((n,f),[]) for n,f in [('Introdução','introducao.php'),('Sons','sons.php'),('Básico','basico.php'),('Gramática','gramatica.php'),('Vocabulário','vocabulario.php'),('Caracteres','caracteres.php'),('Cultura','cultura.php'),('Biblioteca','biblioteca.php')] ]),
 (('Praticar','praticar.php'),[ (('Folha para imprimir','folha.php'),[]) ]),
 (('Conta','conta.php'),[ (('Entrar','entrar.php'),[]), (('Criar conta','registo.php'),[]), (('Eliminar conta','eliminar-conta.php'),[]), (('Sair','sair.php'),[]) ]),
 (('Rodapé','todas as páginas'),[ (('Privacidade','privacidade.php'),[]), (('Créditos','creditos.php'),[]), (('Página 404','404.php'),[]) ]),
]
cores=['0E7C66','5B6873','C8361F','E8A317','18212B']
BW,BH=210,62; SW,SH=190,56; GAP=82
out=[]
def caixa(x,y,w,h,t,f,cor,forte=False):
    fill = '#'+cor if forte else '#FFFFFF'
    tc = '#FFFFFF' if forte else '#18212B'
    fc = '#E6F2EF' if forte else '#5B6873'
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" stroke="#{cor}" stroke-width="2.5"/>')
    out.append(f'<text x="{x+w/2}" y="{y+h/2-3}" text-anchor="middle" font-size="21" font-weight="700" fill="{tc}">{html.escape(t)}</text>')
    out.append(f'<text x="{x+w/2}" y="{y+h/2+19}" text-anchor="middle" font-size="15" fill="{fc}">{html.escape(f)}</text>')
def linha(pts):
    out.append('<polyline points="'+' '.join(f'{a},{b}' for a,b in pts)+'" fill="none" stroke="#8A979F" stroke-width="2"/>')
rx,ry=W/2-130,20
caixa(rx,ry,260,70,*raiz,'C8361F',True)
colw=W/len(grupos); ytop=170; ybar=130
linha([(colw/2,ybar),(W-colw/2,ybar)]); linha([(W/2,ry+70),(W/2,ybar)])
maxy=0
def filhos(lista,x0,y,cor,prof):
    global maxy
    topo=y+SH  # a linha vertical começa por baixo da caixa de cima
    for (n,f),sub in lista:
        y+=GAP
        bx=x0+22
        meio=y+SH/2
        out.append(f'<polyline points="{x0},{topo} {x0},{meio} {bx},{meio}" fill="none" stroke="#8A979F" stroke-width="2"/>')
        topo=meio
        caixa(bx,y,SW-prof*10,SH,n,f,cor)
        maxy=max(maxy,y+SH)
        if sub: y=filhos(sub,bx+20,y,cor,prof+1)
    return y
for i,((n,f),sub) in enumerate(grupos):
    cx=colw*i+colw/2; x=cx-BW/2+ (0)
    x=colw*i+30
    linha([(cx,ybar),(cx,ytop)]) if False else None
    out.append(f'<polyline points="{cx},{ybar} {cx},{ytop}" fill="none" stroke="#8A979F" stroke-width="2"/>')
    x=cx-BW/2
    caixa(x,ytop,BW,BH,n,f,cores[i],True)
    # o primeiro filho liga-se pela esquerda da caixa do grupo
    ystart=ytop+BH-SH
    # ajusto: a linha vertical sai de baixo do grupo, a 20 px da esquerda
    y=ytop+BH-SH
    filhos(sub,x+20,y+ (0),cores[i],0)
H=maxy+30
svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Calibri, Carlito, sans-serif"><rect width="{W}" height="{H}" fill="#FFFFFF"/>'+''.join(out)+'</svg>'
open('estrutura.svg','w').write(svg); print(W,H)
