"""aplicar_molde.py: copia o cabeçalho e o rodapé do molde do professor para um .docx gerado.
Uso: python3 aplicar_molde.py gerado.docx final.docx
O único texto que muda é o marcador "[escrever aqui o teu nome]", trocado pelo nome da formanda."""
import re, shutil, sys, zipfile, os, tempfile

MOLDE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'molde.docx')
NOME = 'Scarllett Sabrina Pena'
origem, destino = sys.argv[1], sys.argv[2]

pasta = tempfile.mkdtemp()
with zipfile.ZipFile(origem) as z:
    z.extractall(pasta)
molde = zipfile.ZipFile(MOLDE)

# 1) As partes do cabeçalho e do rodapé, com as imagens (nomes novos para não chocar com as do documento)
os.makedirs(os.path.join(pasta, 'word', 'media'), exist_ok=True)
for parte in ['header1', 'header2', 'footer1', 'footer2']:
    xml = molde.read(f'word/{parte}.xml').decode('utf-8')
    if parte == 'header1':
        assert '[escrever aqui o teu nome]' in xml
        xml = xml.replace('<w:highlight w:val="lightGray"/>', '').replace('[escrever aqui o teu nome]', NOME)
    open(os.path.join(pasta, 'word', f'molde_{parte}.xml'), 'w', encoding='utf-8').write(xml)
    rels = molde.read(f'word/_rels/{parte}.xml.rels').decode('utf-8')
    rels = rels.replace('media/image1.jpeg', 'media/molde_iefp.jpeg').replace('media/image2.png', 'media/molde_fundos.png')
    os.makedirs(os.path.join(pasta, 'word', '_rels'), exist_ok=True)
    open(os.path.join(pasta, 'word', '_rels', f'molde_{parte}.xml.rels'), 'w', encoding='utf-8').write(rels)
open(os.path.join(pasta, 'word', 'media', 'molde_iefp.jpeg'), 'wb').write(molde.read('word/media/image1.jpeg'))
open(os.path.join(pasta, 'word', 'media', 'molde_fundos.png'), 'wb').write(molde.read('word/media/image2.png'))

# 2) Ligações no document.xml.rels
caminho = os.path.join(pasta, 'word', '_rels', 'document.xml.rels')
rels = open(caminho, encoding='utf-8').read()
tipo = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/'
novas = (f'<Relationship Id="rIdMoldeH1" Type="{tipo}header" Target="molde_header1.xml"/>'
         f'<Relationship Id="rIdMoldeH2" Type="{tipo}header" Target="molde_header2.xml"/>'
         f'<Relationship Id="rIdMoldeF1" Type="{tipo}footer" Target="molde_footer1.xml"/>'
         f'<Relationship Id="rIdMoldeF2" Type="{tipo}footer" Target="molde_footer2.xml"/>')
rels = rels.replace('</Relationships>', novas + '</Relationships>')
open(caminho, 'w', encoding='utf-8').write(rels)

# 3) Tipos de conteúdo
caminho = os.path.join(pasta, '[Content_Types].xml')
tipos = open(caminho, encoding='utf-8').read()
if 'Extension="jpeg"' not in tipos:
    tipos = tipos.replace('<Default ', '<Default Extension="jpeg" ContentType="image/jpeg"/><Default ', 1)
if 'Extension="png"' not in tipos:
    tipos = tipos.replace('<Default ', '<Default Extension="png" ContentType="image/png"/><Default ', 1)
ct = 'application/vnd.openxmlformats-officedocument.wordprocessingml.'
for parte in ['header1', 'header2', 'footer1', 'footer2']:
    tipo_parte = 'header' if parte.startswith('header') else 'footer'
    tipos = tipos.replace('</Types>', f'<Override PartName="/word/molde_{parte}.xml" ContentType="{ct}{tipo_parte}+xml"/></Types>')
open(caminho, 'w', encoding='utf-8').write(tipos)

# 4) A secção usa o cabeçalho e o rodapé do molde: "first" na capa, "default" nas outras páginas
caminho = os.path.join(pasta, 'word', 'document.xml')
doc = open(caminho, encoding='utf-8').read()
doc = re.sub(r'<w:headerReference [^>]*/>|<w:footerReference [^>]*/>', '', doc)
refs = ('<w:headerReference w:type="default" r:id="rIdMoldeH1"/><w:headerReference w:type="first" r:id="rIdMoldeH2"/>'
        '<w:footerReference w:type="default" r:id="rIdMoldeF1"/><w:footerReference w:type="first" r:id="rIdMoldeF2"/>')
doc = re.sub(r'<w:sectPr([^>]*)>', lambda m: f'<w:sectPr{m.group(1)}>' + refs, doc)
if '<w:titlePg' not in doc:
    doc = doc.replace('</w:sectPr>', '<w:titlePg/></w:sectPr>')
open(caminho, 'w', encoding='utf-8').write(doc)

# 5) Os estilos "Header" e "Footer" do molde (têm as tabulações que põem o nome e o número da página à direita)
caminho = os.path.join(pasta, 'word', 'styles.xml')
estilos = open(caminho, encoding='utf-8').read()
estilos_molde = molde.read('word/styles.xml').decode('utf-8')
for sid in ['Header', 'HeaderChar', 'Footer', 'FooterChar']:
    estilos = re.sub(r'<w:style [^>]*w:styleId="' + sid + r'".*?</w:style>', '', estilos, flags=re.S)
    bloco = re.search(r'<w:style [^>]*w:styleId="' + sid + r'".*?</w:style>', estilos_molde, re.S).group(0)
    estilos = estilos.replace('</w:styles>', bloco + '</w:styles>')
open(caminho, 'w', encoding='utf-8').write(estilos)

# 6) Voltar a juntar
if os.path.exists(destino):
    os.remove(destino)
with zipfile.ZipFile(destino, 'w', zipfile.ZIP_DEFLATED) as z:
    for raiz, _, ficheiros in os.walk(pasta):
        for f in ficheiros:
            completo = os.path.join(raiz, f)
            z.write(completo, os.path.relpath(completo, pasta))
shutil.rmtree(pasta)
print('Criado:', destino)
