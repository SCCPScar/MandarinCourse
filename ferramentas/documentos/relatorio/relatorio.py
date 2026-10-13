# relatorio.py: preenche o molde do formador (molde.docx) com o Relatório Final do Chá.
# Uso: python3 relatorio.py [ficheiro_de_paginas.txt]
# O índice tem os números de página escritos à mão: o gerar_relatorio.sh corre este script
# duas vezes, a primeira para saber em que página fica cada título.
import copy, os, re, sys
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_COLOR_INDEX, WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

AQUI = os.path.dirname(os.path.abspath(__file__))
PROJETO = os.environ.get('PROJETO', '/home/user/MandarinCourse')
MOLDE = os.environ.get('MOLDE', os.path.join(PROJETO, 'ferramentas/documentos/molde.docx'))
IMG = os.path.join(AQUI, 'img')
SAIDA = os.environ.get('SAIDA', os.path.join(AQUI, 'Relatório Final - Chá.docx'))
NOME = 'Scarllett Sabrina Pena'
LARGURA_UTIL = 15.0  # cm (A4 com as margens do molde)

# Páginas de cada título (vêm da primeira passagem; sem ficheiro ficam a 0)
paginas = {}
if len(sys.argv) > 1 and os.path.exists(sys.argv[1]):
    for linha in open(sys.argv[1], encoding='utf-8'):
        if '\t' in linha:
            t, n = linha.rstrip('\n').split('\t')
            paginas[t] = n

doc = Document(MOLDE)
corpo = doc.element.body
titulos_indice = []  # (nível, texto) pela ordem em que aparecem
# As tabelas do molde (guardo-as já, porque as tabelas novas mudam a numeração)
MOLDE_TABELAS = list(doc.tables)


# ── Texto ─────────────────────────────────────────────────
# **negrito**, *itálico*, `código` e [[texto a completar]] (fica a amarelo)
def escrever(par, texto, tamanho=12, cor=None, negrito=False, italico=False):
    for parte in re.split(r'(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[\[[^\]]+\]\])', texto):
        if not parte:
            continue
        r = None
        if parte.startswith('**'):
            r = par.add_run(parte[2:-2]); r.bold = True
        elif parte.startswith('[['):
            r = par.add_run('[' + parte[2:-2] + ']'); r.font.highlight_color = WD_COLOR_INDEX.YELLOW
        elif parte.startswith('`'):
            r = par.add_run(parte[1:-1]); r.font.name = 'Consolas'; r.font.size = Pt(tamanho - 1.5)
            continue
        elif parte.startswith('*'):
            r = par.add_run(parte[1:-1]); r.italic = True
        else:
            r = par.add_run(parte)
        r.font.size = Pt(tamanho)
        if negrito: r.bold = True
        if italico: r.italic = True
        if cor: r.font.color.rgb = RGBColor.from_string(cor)
    return par


def nivel_de_titulo(par, nivel):
    # outlineLvl faz o Word reconhecer o parágrafo como título (para o índice e o painel de navegação)
    pPr = par._p.get_or_add_pPr()
    o = OxmlElement('w:outlineLvl'); o.set(qn('w:val'), str(nivel))
    rPr = pPr.find(qn('w:rPr'))
    if rPr is not None: rPr.addprevious(o)
    else: pPr.append(o)



def larguras_colunas(tabela, larguras):
    # O Word e o LibreOffice leem a largura das colunas da grelha da tabela (tblGrid)
    tabela.autofit = False
    for col, w in zip(tabela._tbl.tblGrid.findall(qn('w:gridCol')), larguras):
        col.set(qn('w:w'), str(int(w * 567)))
    for row in tabela.rows:
        for cel, w in zip(row.cells, larguras):
            cel.width = Cm(w)


class Cursor:
    """Insere elementos uns a seguir aos outros, a partir de um elemento do molde."""
    def __init__(self, depois_de):
        self.el = depois_de

    def _por(self, el):
        self.el.addnext(el); self.el = el

    def p(self, texto='', tamanho=12, alinhar=None, depois=120, antes=0, junto=False, recuo=None, recuo_pendente=None, **kw):
        par = doc.add_paragraph()
        escrever(par, texto, tamanho, **kw)
        f = par.paragraph_format
        f.space_after = Pt(depois / 20); f.space_before = Pt(antes / 20)
        if alinhar: par.alignment = alinhar
        if junto: f.keep_with_next = True
        if recuo is not None: f.left_indent = Cm(recuo)
        if recuo_pendente is not None:
            f.left_indent = Cm(recuo_pendente); f.first_line_indent = Cm(-recuo_pendente)
        self._por(par._p)
        return par

    def sub(self, texto):
        # Subtítulo (3.1, 3.2...): negrito, 12 pt, entra no índice
        par = self.p('**' + texto + '**', antes=240, depois=100, junto=True)
        nivel_de_titulo(par, 1)
        titulos_indice.append((1, texto))
        return par

    def marca(self, texto):
        par = self.p('•\t' + texto, depois=60, recuo_pendente=0.63)
        return par

    def imagem(self, ficheiro, largura, legenda_num=None, titulo=None, nota=None):
        # Figura em estilo APA: número a negrito, título em itálico, imagem e nota
        if legenda_num:
            self.p(f'**Figura {legenda_num}**', depois=0, antes=200, junto=True)
            self.p(f'*{titulo}*', depois=80, junto=True)
        par = doc.add_paragraph()
        par.add_run().add_picture(os.path.join(IMG, ficheiro), width=Cm(largura))
        par.alignment = WD_ALIGN_PARAGRAPH.CENTER
        par.paragraph_format.space_after = Pt(4)
        if nota: par.paragraph_format.keep_with_next = True
        self._por(par._p)
        if nota:
            self.p(f'*Nota.* {nota}', tamanho=10, depois=200)
        return par

    def imagens_lado_a_lado(self, ficheiros, largura):
        par = doc.add_paragraph()
        for i, f in enumerate(ficheiros):
            if i: par.add_run('     ')
            par.add_run().add_picture(os.path.join(IMG, f), width=Cm(largura))
        par.alignment = WD_ALIGN_PARAGRAPH.CENTER
        par.paragraph_format.keep_with_next = True
        par.paragraph_format.space_after = Pt(4)
        self._por(par._p)

    def tabela(self, linhas, larguras, numero=None, titulo=None, tamanho=10, nota=None):
        # Tabela em estilo APA: número e título por cima; cabeçalho com a cor da tabela do molde
        if numero:
            self.p(f'**Tabela {numero}**', depois=0, antes=200, junto=True)
            self.p(f'*{titulo}*', depois=80, junto=True)
        t = doc.add_table(rows=len(linhas), cols=len(larguras))
        t.style = doc.styles['Table Grid']
        for i, linha in enumerate(linhas):
            row = t.rows[i]
            # a linha não se parte entre páginas e o cabeçalho repete-se
            trPr = row._tr.get_or_add_trPr()
            cs = OxmlElement('w:cantSplit'); trPr.append(cs)
            if i == 0:
                th = OxmlElement('w:tblHeader'); trPr.append(th)
            for j, texto in enumerate(linha):
                c = row.cells[j]
                c.width = Cm(larguras[j])
                par = c.paragraphs[0]
                escrever(par, texto, tamanho, cor='FFFFFF' if i == 0 else None, negrito=(i == 0))
                par.paragraph_format.space_after = Pt(2)
                par.paragraph_format.space_before = Pt(2)
                if i == 0:
                    tcPr = c._tc.get_or_add_tcPr()
                    shd = OxmlElement('w:shd'); shd.set(qn('w:val'), 'clear'); shd.set(qn('w:color'), 'auto'); shd.set(qn('w:fill'), '4F81BD')
                    tcPr.append(shd)
        larguras_colunas(t, larguras)
        self._por(t._tbl)
        if nota:
            self.p(f'*Nota.* {nota}', tamanho=10, antes=60, depois=200)
        else:
            self.p('', depois=60)
        return t

    def codigo(self, ficheiro, desde, ate, legenda):
        # Copia as linhas do ficheiro real do projeto: se o código mudar, o relatório acompanha
        linhas = open(os.path.join(PROJETO, ficheiro), encoding='utf-8').read().split('\n')
        i = next(k for k, l in enumerate(linhas) if desde in l)
        f = next(k for k in range(i + 1, len(linhas)) if ate in linhas[k])
        bloco = linhas[i:f + 1]
        comum = min(len(l) - len(l.lstrip(' ')) for l in bloco if l.strip())
        self.p(legenda + f' (`{ficheiro.replace("mandarin_project/", "")}`, linhas {i + 1} a {f + 1})', tamanho=10, depois=40, junto=True, cor='404040')
        t = doc.add_table(rows=1, cols=1)
        t.style = doc.styles['Table Grid']
        c = t.rows[0].cells[0]
        larguras_colunas(t, [LARGURA_UTIL])
        # o bloco de código não se parte entre duas páginas
        t.rows[0]._tr.get_or_add_trPr().append(OxmlElement('w:cantSplit'))
        tcPr = c._tc.get_or_add_tcPr()
        shd = OxmlElement('w:shd'); shd.set(qn('w:val'), 'clear'); shd.set(qn('w:color'), 'auto'); shd.set(qn('w:fill'), 'F2F2F2')
        tcPr.append(shd)
        primeiro = True
        for l in bloco:
            par = c.paragraphs[0] if primeiro else c.add_paragraph()
            primeiro = False
            r = par.add_run(l[comum:] or ' ')
            r.font.name = 'Consolas'; r.font.size = Pt(8)
            par.paragraph_format.space_after = Pt(0)
            par.paragraph_format.line_spacing = 1.0
        self._por(t._tbl)
        self.p('', depois=120)

    def quebra(self):
        par = doc.add_paragraph()
        par.add_run().add_break(__import__('docx').enum.text.WD_BREAK.PAGE)
        self._por(par._p)


# ── Encontrar partes do molde ─────────────────────────────
def paragrafo(comeca):
    for par in doc.paragraphs:
        if par.text.strip().startswith(comeca):
            return par
    raise SystemExit('Não encontrei no molde: ' + comeca)


def apagar(par):
    par._p.getparent().remove(par._p)


def trocar_texto(par, novo, tirar_realce=True):
    # Mantém a formatação do primeiro run do marcador e troca o texto
    runs = par.runs
    # junta todo o texto a partir do "[" num só run
    inicio = next(i for i, r in enumerate(runs) if '[' in r.text)
    antes = runs[inicio].text.split('[')[0]
    runs[inicio].text = antes + novo
    if tirar_realce:
        runs[inicio].font.highlight_color = None
    for r in runs[inicio + 1:]:
        r._r.getparent().remove(r._r)
    return runs[inicio]


# ═══ Cabeçalho: o nome da formanda (o resto do molde fica igual) ═══
for sec in doc.sections:
    for cab in (sec.header, sec.first_page_header):
        for par in cab.paragraphs:
            if '[escrever aqui o teu nome]' in par.text:
                for r in par.runs:
                    if '[' in r.text or ']' in r.text or 'escrever' in r.text or 'nome' in r.text or 'teu' in r.text or 'aqui' in r.text:
                        r.text = ''
                        r.font.highlight_color = None
                par.runs[-1].text = NOME

# ═══ 1. Capa ═══
trocar_texto(paragrafo('[escrever aqui o nome do projeto]'), 'Chá: aprender mandarim na hora do chá')
p_img = paragrafo('[colocar aqui uma imagem')
for r in p_img.runs:
    r._r.getparent().remove(r._r)
p_img.add_run().add_picture(os.path.join(IMG, 'logo.png'), width=Cm(3.2))
trocar_texto(paragrafo('Formando:'), NOME)

# ═══ 2. Índice ═══
p_indice = paragrafo('2. Índice')
# Os títulos são conhecidos antes de escrever o resto, por isso o índice é preenchido no fim (ver mais abaixo)

# ═══ Títulos principais do molde: passam a contar para o índice ═══
TITULOS = ['3. INTRODUÇÃO', '4. ESTRUTURA DO PROJETO', '5. Planificação', '6. Ficha de planeamento',
           '7. Imagens do projeto', '8. Conclusão', '9. Fontes de pesquisa', '10. Anexos']
for t in TITULOS:
    nivel_de_titulo(paragrafo(t), 0)


def limpar_marcador(comeca):
    par = paragrafo(comeca)
    anterior = par._p.getprevious()
    apagar(par)
    return anterior


def tirar_pontos(depois_de_titulo):
    # o molde tem parágrafos com "." soltos antes da quebra de página; tiro só o ponto
    for par in doc.paragraphs:
        if par.text.strip() in ('.', '. '):
            for r in par.runs:
                if r.text.strip() == '.':
                    r.text = ''


# ═══ 3. Introdução ═══
c = Cursor(limpar_marcador('[aqui deverás escrever quais foram'))
titulos_indice.append((0, '3. INTRODUÇÃO'))
c.p('Este relatório descreve o projeto final do curso de Técnico/a Especialista em Tecnologias e Programação de Sistemas de Informação: o **Chá**, um site gratuito para aprender mandarim, em português de Portugal, a partir do zero. O documento apresenta as razões da escolha do tema, a estrutura do site, a planificação e o registo das tarefas, as imagens do resultado final, as conclusões e as fontes consultadas.')
c.sub('3.1 Razões da escolha do tema')
c.p('O mandarim é a língua materna com mais falantes no mundo, mas quem quer começar a aprendê-lo em Portugal encontra sobretudo cursos pagos ou materiais em inglês e em português do Brasil. Muitas pessoas desistem cedo porque a língua parece difícil demais e porque têm pouco tempo livre para estudar.')
c.p('[[Escreve aqui, em uma ou duas frases, a tua motivação pessoal para escolher o mandarim.]]')
c.p('O nome do projeto junta as duas ideias principais. A palavra portuguesa «chá» vem do chinês 茶 (*chá*) e chegou a Portugal através do comércio com Macau, no século XVI; por isso, em português dizemos «chá» e em inglês diz-se «tea». Ao mesmo tempo, cada lição foi pensada para cerca de 15 minutos, o tempo de beber uma chávena de chá.')
c.sub('3.2 O que pretendia desenvolver e mostrar')
c.p('O objetivo foi criar um curso que qualquer pessoa pudesse começar sem pagar e sem criar conta, com um caminho claro do primeiro som até conversas do dia a dia. Para isso defini os seguintes objetivos:')
for m in [
    'uma **rota de aprendizagem por 6 cidades da China** (Pequim, Xi\'an, Chengdu, Guilin, Hangzhou e Xangai), organizada pelos níveis do exame oficial HSK; esta versão tem as primeiras **72 lições**, com **523 palavras** e **222 frases** de exemplo, e a rota completa está planeada até ao nível 3 do HSK;',
    '**som em todo o chinês do site**, à velocidade normal e devagar, sem ficheiros de áudio;',
    '**exercícios em cada lição** e **ferramentas de prática** que funcionam sem conta: quiz, cartões com revisão espaçada, ordem dos traços dos caracteres, treino de pronúncia, dicionário e caderno;',
    '**contas de utilizador opcionais**, para guardar as lições concluídas e os dias seguidos de estudo;',
    '**segurança e proteção de dados** de acordo com o Regulamento Geral sobre a Proteção de Dados (Parlamento Europeu e Conselho da União Europeia, 2016) e a Lei n.º 58/2019;',
    '**um site acessível**, legível no computador e no telemóvel, com modo escuro e contraste de cores verificado segundo as WCAG 2.2 (World Wide Web Consortium, 2023).',
]:
    c.marca(m)
c.p('Com o projeto pretendia também mostrar, num trabalho completo, o que aprendi ao longo do curso: programação para a web do lado do cliente e do servidor, modelação e programação de bases de dados, segurança e controlo de versões.', antes=120)
c.sub('3.3 Linguagens de programação')
c.tabela([
    ['Linguagem', 'Onde é usada', 'Para quê'],
    ['HTML5', 'Browser', 'Estrutura e conteúdo de todas as páginas.'],
    ['CSS3', 'Browser', 'Aspeto visual, adaptação ao telemóvel e modo escuro.'],
    ['JavaScript', 'Browser', 'Exercícios, ferramentas de prática, som (Web Speech API) e progresso guardado no browser.'],
    ['PHP 8', 'Servidor', 'Páginas geradas a partir da base de dados, contas de utilizador e segurança.'],
    ['SQL', 'Base de dados', 'Criação das tabelas e consultas a partir do PHP, com consultas preparadas (PDO).'],
], [2.6, 2.8, 9.6], numero=1, titulo='Linguagens usadas no projeto e a sua função')
c.p('Escolhi estas linguagens porque são as que estudei nas unidades de programação para a web (cliente e servidor) e de bases de dados, e porque são suportadas por quase todos os alojamentos gratuitos. Não usei frameworks: todo o código é HTML, CSS, JavaScript e PHP simples e comentado, para conseguir explicar cada parte do projeto. O som usa a Web Speech API do próprio browser (Mozilla, s.d.-c) e a ordem dos traços dos caracteres usa a biblioteca Hanzi Writer (Chanin, s.d.), guardada no site para funcionar sem internet.')
c.sub('3.4 Software utilizado')
c.tabela([
    ['Software', 'Utilização', 'Razão da escolha'],
    ['XAMPP (Apache, MariaDB, PHP e phpMyAdmin)', 'Servidor local para desenvolver e testar o site.', 'Gratuito, instala tudo de uma vez e foi o ambiente usado no curso (Apache Friends, s.d.).'],
    ['phpMyAdmin', 'Criação e gestão da base de dados.', 'Permite importar o script SQL e ver as tabelas e as ligações.'],
    ['[[Editor de código que usaste]]', 'Escrita do código.', '[[Porque o escolheste]]'],
    ['Git e GitHub', 'Controlo de versões e cópia de segurança do código.', 'Regista cada alteração com data, o que permitiu fazer o registo das tarefas deste relatório.'],
    ['Google Chrome e Mozilla Firefox', 'Testes do site e ferramentas de programador.', 'São os browsers mais usados; o Chrome tem a voz chinesa e o reconhecimento de voz.'],
    ['Microsoft Word e PowerPoint', 'Relatório, guias e apresentação.', 'Formato pedido para a entrega.'],
], [4.2, 4.8, 6.0], numero=2, titulo='Software utilizado no desenvolvimento')

# ═══ 4. Estrutura do projeto ═══
c = Cursor(limpar_marcador('[aqui deverá ser apresentada de forma gráfica'))
titulos_indice.append((0, '4. ESTRUTURA DO PROJETO'))
# o exemplo do molde (as caixas «Página principal», «Pagina1»...) sai; fica a quebra de página
el = c.el.getnext()
while el is not None and 'w:type="page"' not in el.xml:
    seguinte = el.getnext()
    el.getparent().remove(el)
    el = seguinte
c.p('A Figura 1 mostra a estrutura do site. Todas as páginas partilham a mesma barra de navegação e o mesmo rodapé, por isso a partir de qualquer página é possível chegar às outras. As páginas a verde formam o percurso principal: a rota leva às cidades, cada cidade às suas lições, e cada lição pode ser marcada como concluída.')
c.imagem('estrutura.png', LARGURA_UTIL, 1, 'Estrutura das páginas do site Chá',
         'Cada caixa tem o nome da página e o ficheiro PHP correspondente. As páginas da cidade e da lição são as mesmas para todas as cidades e lições: o PHP recebe o número no endereço (por exemplo, licao.php?id=4) e vai buscar o conteúdo à base de dados.')
c.p('Os ficheiros do projeto estão organizados em pastas, de acordo com a sua função (Tabela 3).')
c.tabela([
    ['Pasta', 'Conteúdo'],
    ['`mandarin_project/`', 'As páginas PHP do site (22 páginas e 4 ficheiros que só processam formulários).'],
    ['`includes/`', 'Partes comuns a todas as páginas: ligação à base de dados, sessões, navegação, topo e rodapé.'],
    ['`css/`', 'Folhas de estilo, uma por tema (base, componentes, lições, praticar, conta, modo escuro).'],
    ['`js/`', '17 ficheiros JavaScript, um por tema (som, exercícios, cartões, quiz, traços, pronúncia).'],
    ['`img/` e `fonts/`', 'Fotografias, ilustrações, ícones e as fontes de letra guardadas no site.'],
    ['`vendor/`', 'A biblioteca Hanzi Writer e os dados dos traços dos caracteres.'],
    ['`dados/`', 'Dados lidos pelo PHP, como os créditos das fotografias.'],
    ['`base_de_dados/`', 'Os scripts SQL: um para o XAMPP e outro para o alojamento online.'],
    ['`docs/` e `prototipos/`', 'Documentação do projeto e os protótipos iniciais.'],
], [4.0, 11.0], numero=3, titulo='Organização das pastas do projeto')

# ═══ 5. Planificação ═══
c = Cursor(limpar_marcador('[aqui deverá ser apresentada a grelha de planificação'))
titulos_indice.append((0, '5. Planificação, Calendarização e registo de execução das tarefas'))
c.p('A grelha seguinte regista as tarefas do projeto com as datas reais de início e de fim, retiradas do histórico de versões (Git). Em junho fiz os protótipos para testar a ideia; o desenvolvimento do site final decorreu entre o fim de setembro e outubro.')
TAREFAS = [
    ('Protótipos do curso', 'Cinco versões de uma página HTML para testar a ideia, o conteúdo e o aspeto do curso.', '15/06/2026', '16/06/2026'),
    ('Marca e plano da rota', 'Nome, cores, logótipo e rota de 12 meses por 6 cidades da China.', '25/09/2026', '25/09/2026'),
    ('Fotografias das cidades', 'Escolha, otimização e créditos das fotografias de cada cidade e unidade.', '26/09/2026', '29/09/2026'),
    ('Navegação e transições', 'Barra de navegação e transições entre páginas.', '26/09/2026', '28/09/2026'),
    ('Base de dados', 'Tabelas MySQL para cidades, unidades, lições, palavras, frases, utilizadores e progresso.', '28/09/2026', '28/09/2026'),
    ('Contas de utilizador', 'Registo, início e fim de sessão em PHP, com hash das palavras-passe.', '28/09/2026', '28/09/2026'),
    ('Identidade visual', 'Cores e letras da marca e nova página inicial.', '28/09/2026', '28/09/2026'),
    ('Cidades e lições em PHP', 'Páginas das cidades e das lições geradas a partir da base de dados.', '28/09/2026', '28/09/2026'),
    ('Português de Portugal', 'Tradução das páginas e dos textos do JavaScript para português de Portugal.', '28/09/2026', '28/09/2026'),
    ('Conteúdo das lições', '72 lições das 6 cidades, com explicação, palavras e frases.', '28/09/2026', '28/09/2026'),
    ('Créditos e privacidade', 'Página de Créditos e Política de Privacidade de acordo com o RGPD.', '29/09/2026', '29/09/2026'),
    ('Dicionário local', 'Funcionalidades que dependiam de serviços externos trocadas por um dicionário no próprio site.', '29/09/2026', '29/09/2026'),
    ('Segurança e acessibilidade', 'Página 404, proteção contra XSS e CSRF, contraste das cores e revisão do texto.', '29/09/2026', '30/09/2026'),
    ('Revisão da Biblioteca', 'Verificação e troca das ligações externas que não funcionavam.', '05/10/2026', '06/10/2026'),
    ('Treino de pronúncia', 'Gráfico do tom da voz e botão para parar o jogo.', '12/10/2026', '12/10/2026'),
    ('Páginas em PHP', 'Páginas do curso passam a PHP, com uma só navegação para todas.', '12/10/2026', '12/10/2026'),
    ('Testes com utilizadores', 'Alterações pedidas: letra maior, som devagar, página da rota, exercícios e Praticar.', '12/10/2026', '12/10/2026'),
    ('Funcionar sem internet', 'Hanzi Writer guardado no site, aviso de voz e site pronto para alojamento.', '13/10/2026', '13/10/2026'),
    ('Simplificação do código', 'JavaScript num ficheiro por tema e CSS organizado em classes.', '13/10/2026', '13/10/2026'),
    ('Versão final da base', 'Remoção do que não era usado e documentação da base de dados.', '13/10/2026', '13/10/2026'),
    ('Guia e apresentação', 'Guia de Instalação e diapositivos da apresentação.', '13/10/2026', '13/10/2026'),
    ('Relatório final', 'Elaboração deste relatório.', '13/10/2026', '13/10/2026'),
]
grelha = MOLDE_TABELAS[1]


def escrever_celula(celula, texto, centrar=False, branco=False):
    par = celula.paragraphs[0]
    for r in par.runs:
        r._r.getparent().remove(r._r)
    r = par.add_run(texto)
    r.font.name = 'Calibri'; r.font.size = Pt(8)
    r.font.color.rgb = RGBColor.from_string('FFFFFF' if branco else '000000')
    par.alignment = WD_ALIGN_PARAGRAPH.CENTER if centrar else WD_ALIGN_PARAGRAPH.LEFT
    celula.vertical_alignment = 1  # ao centro, para as linhas de duas linhas ficarem alinhadas


escrever_celula(grelha.rows[2].cells[2], NOME)
for i, (titulo, descricao, inicio, fim) in enumerate(TAREFAS):
    linha = grelha.rows[5 + i]
    # a altura do molde é mínima: deixo a linha crescer quando o texto ocupa duas linhas
    altura = linha._tr.trPr.find(qn('w:trHeight'))
    if altura is not None: altura.set(qn('w:hRule'), 'atLeast')
    celulas = linha.cells
    escrever_celula(celulas[1], fim, True)
    escrever_celula(celulas[2], titulo)
    escrever_celula(celulas[3], descricao)
    escrever_celula(celulas[4], inicio, True)
    escrever_celula(celulas[5], fim, True)
# A grelha e a nota enchem a página: a quebra de página do molde passaria para a página seguinte
# e deixava-a em branco. Por isso tiro os parágrafos vazios a seguir à grelha e o título 6 começa numa página nova.
el = grelha._tbl.getnext()
while el is not None and 'Ficha de planeamento' not in ''.join(el.itertext()):
    seguinte = el.getnext()
    el.getparent().remove(el)
    el = seguinte
paragrafo('6. Ficha de planeamento').paragraph_format.page_break_before = True
c = Cursor(grelha._tbl)
c.p('*Nota.* Na coluna «Data» está a data de registo da tarefa, que corresponde ao dia em que foi concluída.', tamanho=10, antes=120)

# ═══ 6. Ficha de planeamento ═══
limpar_marcador('[aqui deverá ser apresentada a ficha de planeamento')
titulos_indice.append((0, '6. Ficha de planeamento'))


def preencher(tabela, linha, texto):
    celula = MOLDE_TABELAS[tabela].rows[linha].cells[0]
    for par in celula.paragraphs[1:]:
        par._p.getparent().remove(par._p)
    par = celula.paragraphs[0]
    for r in par.runs:
        r._r.getparent().remove(r._r)
    escrever(par, texto, 12)
    par.paragraph_format.space_after = Pt(4)
    return celula


preencher(2, 1, 'Chá: aprender mandarim na hora do chá')
preencher(2, 3, '[[endereço do site online]]  (versão local: http://localhost/cha/)')
preencher(2, 5, NOME)
preencher(3, 1, 'Falantes de português, sobretudo residentes em Portugal, a partir dos 13 anos, que queiram começar a aprender mandarim do zero e tenham pouco tempo livre por dia. Não é preciso saber nada de chinês nem criar conta para estudar: a conta é opcional e serve para guardar o progresso.')
cel = preencher(4, 1, 'Desenvolver um site gratuito, em português de Portugal, que ensine mandarim em sessões curtas de cerca de 15 minutos, através de uma rota por 6 cidades da China organizada pelos níveis HSK. Cada lição tem explicação, palavras e frases com som e um exercício; as ferramentas de prática (quiz, cartões, ordem dos traços, pronúncia, dicionário e caderno) funcionam sem conta. Quem cria conta guarda as lições concluídas na base de dados. O site deve ser seguro, cumprir o RGPD e ser acessível no computador e no telemóvel.')

# ═══ 7. Imagens do projeto ═══
c = Cursor(limpar_marcador('[Aqui deverá colocar prints do projeto]'))
titulos_indice.append((0, '7. Imagens do projeto'))
c.p('As imagens seguintes foram captadas no site a funcionar no servidor local (XAMPP), com uma conta de demonstração que já tem três lições concluídas.')
FIGURAS = [
    ('inicio.png', 'Página inicial', 'Apresenta o curso, explica a origem do nome e leva ao início da rota.'),
    ('rota.png', 'Página da rota', 'As 6 cidades, com o nível HSK de cada uma e a barra de progresso do utilizador com sessão iniciada.'),
    ('cidade.png', 'Página de uma cidade (Pequim)', 'Descrição da cidade, as 4 unidades com as suas lições e curiosidades culturais.'),
    ('licao.png', 'Página de uma lição', 'Explicação, palavras novas com pinyin e botões para ouvir à velocidade normal e devagar.'),
    ('exercicio.png', 'Exercício no fim da lição', 'As perguntas usam as palavras da própria lição e mostram a correção antes de passar à seguinte.'),
    ('sons.png', 'Página Sons', 'Os quatro tons e o tom neutro, com som em todos os exemplos.'),
    ('vocabulario.png', 'Página Vocabulário', 'Palavras organizadas por temas, com carácter, pinyin, tradução e som.'),
    ('praticar.png', 'Página Praticar', 'Diálogos e ferramentas de prática que funcionam sem conta.'),
    ('cartoes.png', 'Cartões de memorização', 'Revisão espaçada: o utilizador avalia a dificuldade e o cartão volta mais cedo ou mais tarde.'),
    ('tracos.png', 'Ordem dos traços', 'A biblioteca Hanzi Writer anima a escrita do carácter, traço a traço, mesmo sem internet.'),
    ('registo.png', 'Criar conta', 'Formulário com confirmação da idade mínima de 13 anos e aceitação da Política de Privacidade.'),
    ('conta.png', 'A minha conta', 'Lições concluídas, dias seguidos de estudo e as opções de terminar sessão e eliminar a conta.'),
    ('escuro.png', 'Modo escuro', 'A mesma lição no modo escuro, com o contraste das cores verificado.'),
    ('biblioteca.png', 'Página Biblioteca', 'Recursos gratuitos e legais para continuar a aprender, organizados por nível.'),
    ('404.png', 'Página de erro 404', 'Mostrada quando o endereço não existe; aproveita para ensinar uma frase em chinês.'),
]
n = 2
for f, titulo, nota in FIGURAS:
    c.imagem(f, LARGURA_UTIL - 1.0, n, titulo, nota)
    n += 1
c.p(f'**Figura {n}**', depois=0, antes=200, junto=True)
c.p('*O site no telemóvel*', depois=80, junto=True)
c.imagens_lado_a_lado(['movel-inicio.png', 'movel-licao.png'], 5.2)
c.p('*Nota.* À esquerda, a página inicial; à direita, uma lição. O menu fica recolhido no botão «Menu».', tamanho=10, depois=200)
n += 1

# ═══ 8. Conclusão ═══
c = Cursor(limpar_marcador('[Aqui deverás explicar que conclusão'))
titulos_indice.append((0, '8. Conclusão'))
c.p('O desenvolvimento do Chá permitiu-me aplicar, num único projeto, conteúdos de várias unidades do curso: a programação para a web do lado do cliente e do servidor, a modelação e a programação de bases de dados, a segurança dos sistemas e o controlo de versões com Git.')
c.p('Os objetivos definidos na ficha de planeamento foram cumpridos. O site tem 72 lições organizadas em 6 cidades, com 523 palavras e 222 frases de exemplo, som em todo o chinês, exercícios em cada lição e ferramentas de prática que funcionam sem conta. As contas de utilizador guardam as palavras-passe com hash bcrypt, usam consultas preparadas, proteção contra XSS e CSRF e um limite de tentativas de início de sessão, e o utilizador pode eliminar a conta e todos os seus dados a qualquer momento, como prevê o RGPD.')
c.p('Os testes com utilizadores foram uma das fases mais úteis. [[Quem testou o site]] mostraram problemas que eu não tinha visto, como o tamanho da letra, a necessidade de ouvir o chinês mais devagar e o quiz passar sozinho à pergunta seguinte. As alterações feitas a partir dessas sugestões estão no Anexo E.')
c.p('[[A tua maior dificuldade durante o projeto e a forma como a resolveste.]]')
c.p('Com este trabalho aprendi a dividir um projeto grande em fases, a planear a base de dados antes de escrever as páginas, a proteger os dados de quem usa o site e a escrever código simples e comentado, que outra pessoa consiga ler e manter. Aprendi também que um projeto só fica bom depois de ser testado por pessoas reais.')
c.p('O projeto tem limitações que identifiquei e que ficam como trabalho futuro:')
for m in [
    'completar a rota até ao nível 3 do HSK, a partir das 72 lições desta versão;',
    'guardar na conta também o progresso das ferramentas de prática, que hoje fica apenas no browser;',
    'o som depende de o browser ter uma voz chinesa instalada; no futuro poderia usar ficheiros de áudio gravados;',
    'criar missões no fim de cada cidade e um certificado de conclusão;',
    'acrescentar um tutor de conversação com inteligência artificial, a funcionar do lado do servidor.',
]:
    c.marca(m)
c.p('Termino com a frase que fecha a página inicial do site: 我们开始吧 (*wǒmen kāishǐ ba*), «vamos começar!».', antes=120)

# ═══ 9. Webgrafia (APA 7.ª edição) ═══
c = Cursor(limpar_marcador('[aqui deverás colocar os links dos sites'))
titulos_indice.append((0, '9. Fontes de pesquisa (Webgrafia)'))
REFERENCIAS = [
    'AllSet Learning. (s.d.). *Chinese grammar wiki*. https://resources.allsetlearning.com/chinese/grammar/',
    'American Psychological Association. (s.d.). *Webpage on a website references*. APA Style. https://apastyle.apa.org/style-grammar-guidelines/references/examples/webpage-website-references',
    'Apache Friends. (s.d.). *XAMPP Apache + MariaDB + PHP + Perl*. https://www.apachefriends.org/',
    'Apache Software Foundation. (s.d.). *Apache module mod_rewrite*. Apache HTTP Server Documentation. https://httpd.apache.org/docs/2.4/mod/mod_rewrite.html',
    'Chanin, D. (s.d.). *Hanzi Writer*. https://hanziwriter.org/',
    'Chinese Testing International. (s.d.). *HSK: Chinese proficiency test*. https://www.chinesetest.cn/',
    'Comissão Nacional de Proteção de Dados. (s.d.). *CNPD*. https://www.cnpd.pt/',
    'Google. (s.d.-a). *Bricolage Grotesque*. Google Fonts. https://fonts.google.com/specimen/Bricolage+Grotesque',
    'Google. (s.d.-b). *Lexend*. Google Fonts. https://fonts.google.com/specimen/Lexend',
    'HSK Academy. (s.d.). *HSK Academy*. https://hsk.academy/',
    'Kishore, S. (s.d.). *Make Me a Hanzi* [Repositório de código]. GitHub. https://github.com/skishore/makemeahanzi',
    'Lei n.º 58/2019, de 8 de agosto. (2019). *Diário da República*, 1.ª série, n.º 151. https://diariodarepublica.pt/dr/detalhe/lei/58-2019-123815982',
    'MariaDB Foundation. (s.d.). *MariaDB documentation*. MariaDB Knowledge Base. https://mariadb.com/kb/en/documentation/',
    'Mozilla. (s.d.-a). *View Transition API*. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API',
    'Mozilla. (s.d.-b). *Web Audio API*. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API',
    'Mozilla. (s.d.-c). *Web Speech API*. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API',
    'Mozilla. (s.d.-d). *Window.localStorage*. MDN Web Docs. https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage',
    'OWASP Foundation. (s.d.-a). *Cross-site request forgery prevention cheat sheet*. OWASP Cheat Sheet Series. https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html',
    'OWASP Foundation. (s.d.-b). *Password storage cheat sheet*. OWASP Cheat Sheet Series. https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html',
    'OWASP Foundation. (s.d.-c). *SQL injection prevention cheat sheet*. OWASP Cheat Sheet Series. https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html',
    'Parlamento Europeu e Conselho da União Europeia. (2016). *Regulamento (UE) 2016/679, relativo à proteção das pessoas singulares no que diz respeito ao tratamento de dados pessoais e à livre circulação desses dados (Regulamento Geral sobre a Proteção de Dados)*. Jornal Oficial da União Europeia, L 119. https://eur-lex.europa.eu/eli/reg/2016/679/oj',
    'SIL International. (s.d.). *SIL Open Font License*. https://openfontlicense.org/',
    'The PHP Group. (s.d.-a). *Manual do PHP*. https://www.php.net/manual/pt_BR/',
    'The PHP Group. (s.d.-b). *password_hash*. Manual do PHP. https://www.php.net/manual/pt_BR/function.password-hash.php',
    'The PHP Group. (s.d.-c). *PHP Data Objects*. Manual do PHP. https://www.php.net/manual/pt_BR/book.pdo.php',
    'Unsplash. (s.d.). *Unsplash license*. https://unsplash.com/license',
    'World Wide Web Consortium. (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*. https://www.w3.org/TR/WCAG22/',
]
c.p('As referências seguem as normas APA (7.ª edição). Os sítios sem data de publicação indicam «s.d.» (sem data); todos foram consultados entre junho e outubro de 2026.')
for ref in REFERENCIAS:
    c.p(ref, recuo_pendente=1.27, depois=100)

# ═══ 10. Anexos ═══
c = Cursor(limpar_marcador('(todo o processo de desenvolvimento'))
titulos_indice.append((0, '10. Anexos'))
c.p('Os anexos documentam o processo de desenvolvimento, por ordem temporal:')
for m in ['**Anexo A**: protótipos iniciais (junho de 2026);', '**Anexo B**: registo cronológico do desenvolvimento;',
          '**Anexo C**: modelo da base de dados;', '**Anexo D**: excertos do código, com a data em que foram criados;',
          '**Anexo E**: testes com utilizadores e verificações técnicas;', '**Anexo F**: documentos complementares.']:
    c.marca(m)

c.sub('Anexo A: Protótipos iniciais')
c.p('Antes de construir o site final, fiz cinco protótipos numa única página HTML, a 15 e 16 de junho de 2026, para testar a ideia, a organização do conteúdo e o aspeto. Os protótipos estavam em inglês e depois em português do Brasil; a versão final passou a português de Portugal, com uma identidade visual nova e o conteúdo numa base de dados.')
c.imagem('prototipo-v1.png', LARGURA_UTIL - 1.5, n, 'Primeiro protótipo (15/06/2026)', 'Página única em inglês, com o conteúdo escrito diretamente no HTML.'); n += 1
c.imagem('prototipo-v5.png', LARGURA_UTIL - 1.5, n, 'Quinto protótipo (16/06/2026)', 'Já traduzido e com o painel de progresso; serviu de ponto de partida para o site final (ver Figura 2).'); n += 1

c.sub('Anexo B: Registo cronológico do desenvolvimento')
c.p('Cada alteração ao código foi registada no Git com data e descrição. A Tabela 4 resume esse registo por dia de trabalho.')
c.tabela([
    ['Data', 'Registos', 'Trabalho realizado'],
    ['15/06/2026', '1', 'Primeiro protótipo do curso numa página HTML.'],
    ['16/06/2026', '5', 'Protótipos 2 a 5: novas secções, tradução e painel de progresso.'],
    ['25/09/2026', '1', 'Decisões da marca (nome, cores, logótipo) e plano da rota de 12 meses.'],
    ['26/09/2026', '16', 'Navegação, correções de segurança no texto mostrado e escolha das fotografias de Pequim e Xi\'an.'],
    ['28/09/2026', '28', 'Base de dados, contas em PHP, identidade visual, páginas das cidades e das lições, português de Portugal, conteúdo das 72 lições e fotografias de Chengdu, Guilin e Hangzhou.'],
    ['29/09/2026', '13', 'Fotografias de Xangai, Créditos, Política de Privacidade, dicionário local e revisão de segurança, contraste e texto.'],
    ['30/09/2026', '1', 'Correção da documentação da base de dados.'],
    ['05/10/2026 e 06/10/2026', '2', 'Revisão das ligações da Biblioteca.'],
    ['12/10/2026', '10', 'Melhorias pedidas nos testes com utilizadores e páginas do curso em PHP.'],
    ['13/10/2026', '11', 'Funcionamento sem internet, simplificação do código, versão final da base de dados, guias e apresentação.'],
], [3.0, 1.8, 10.2], numero=4, titulo='Registo do trabalho por dia', nota='A coluna «Registos» indica o número de alterações gravadas no Git nesse dia.')

c.sub('Anexo C: Modelo da base de dados')
c.p('A base de dados `cha` tem 9 tabelas, com o conjunto de caracteres utf8mb4 para guardar corretamente os caracteres chineses. O conteúdo forma uma hierarquia (cidades, unidades, lições, palavras e frases) e os utilizadores ligam-se às lições através da tabela `progresso`, uma relação de muitos para muitos. As chaves estrangeiras usam ON DELETE CASCADE: ao eliminar uma conta, o progresso dessa pessoa é apagado automaticamente.')
c.tabela([
    ['Tabela', 'Guarda', 'Ligações'],
    ['`utilizadores`', 'Nome, e-mail, hash da palavra-passe, data do consentimento e dias seguidos de estudo.', 'Tem muitas linhas em `progresso`.'],
    ['`cidades`', 'As 6 cidades da rota, com o nível HSK e a descrição.', 'Tem 4 unidades e 4 curiosidades.'],
    ['`unidades`', 'As 24 unidades (4 por cidade), com a fotografia e a legenda.', 'Pertence a uma cidade; tem 3 lições.'],
    ['`cultura`', 'As 24 curiosidades culturais das cidades.', 'Pertence a uma cidade.'],
    ['`licoes`', 'As 72 lições, com o título, a duração e a explicação.', 'Pertence a uma unidade.'],
    ['`palavras`', 'As 523 palavras, com carácter, pinyin e tradução.', 'Pertence a uma lição.'],
    ['`frases`', 'As 222 frases de exemplo.', 'Pertence a uma lição.'],
    ['`progresso`', 'As lições concluídas por cada utilizador. A chave primária tem duas colunas, para a mesma lição não contar duas vezes.', 'Liga `utilizadores` e `licoes`.'],
    ['`tentativas_login`', 'As tentativas falhadas de início de sessão dos últimos 15 minutos.', 'Sem ligações.'],
], [3.2, 7.6, 4.2], numero=5, titulo='Tabelas da base de dados', tamanho=9.5)

c.sub('Anexo D: Excertos do código')
c.p('Os excertos seguintes mostram as partes mais importantes da segurança e da gravação do progresso. Foram criados a 28/09/2026, na fase das contas de utilizador, e revistos a 13/10/2026, na simplificação do código.', junto=True)
c.codigo('mandarin_project/registo.php', '// password_hash transforma', "'INSERT INTO utilizadores", 'Excerto 1: a palavra-passe é guardada como hash bcrypt e a inserção usa uma consulta preparada')
c.codigo('mandarin_project/entrar.php', '// Proteção contra força bruta', 'exit;', 'Excerto 2: limite de 5 tentativas falhadas em 15 minutos e verificação da palavra-passe')
c.codigo('mandarin_project/concluir-licao.php', '// 1) Progresso.', '$inserir->execute', 'Excerto 3: a lição concluída é gravada uma só vez na tabela progresso')

c.sub('Anexo E: Testes com utilizadores e verificações técnicas')
c.p('Depois da primeira versão completa, pedi a [[quem testou o site]] que usassem o site e dessem a sua opinião. A Tabela 6 mostra as principais sugestões e o que foi alterado.')
c.tabela([
    ['Sugestão', 'Alteração feita'],
    ['A letra era pequena e o site parecia apertado.', 'Letra maior, área de leitura mais larga e mais cor nas páginas.'],
    ['Os emojis não pareciam profissionais.', 'Troca dos emojis por ícones simples.'],
    ['Não se percebia o que era o site nem por onde começar.', 'Nova página inicial a explicar o curso e página própria para a rota.'],
    ['Faltava ouvir o chinês com calma.', 'Botões «Ouvir» e «Devagar» em todo o chinês do site.'],
    ['As lições não diziam o nível nem o que vinha a seguir.', 'Nível HSK, número da lição, exercício no fim e botão para a próxima lição.'],
    ['A gramática estava misturada com outros temas.', 'Página de Gramática própria.'],
    ['O quiz passava sozinho à pergunta seguinte.', 'O quiz mostra a correção e espera pelo botão «Próxima pergunta».'],
    ['Os cartões eram difíceis de ler.', 'Cartões maiores, com mais contraste.'],
], [7.0, 8.0], numero=6, titulo='Sugestões dos utilizadores e alterações feitas')
c.p('Além disso, verifiquei o funcionamento e a segurança do site com os testes da Tabela 7, repetidos no fim do desenvolvimento.')
c.tabela([
    ['Verificação', 'Resultado'],
    ['Um nome com código `<script>` aparece como texto e não é executado (XSS).', 'Passou'],
    ['Um utilizador não vê os dados de outro, mesmo mudando o endereço.', 'Passou'],
    ['A palavra-passe fica guardada como hash bcrypt (custo 12); nenhuma fica em texto.', 'Passou'],
    ['Sem sessão iniciada, a conta não abre e o progresso não é gravado.', 'Passou'],
    ['Eliminar a conta sem o token CSRF é recusado.', 'Passou'],
    ['Uma tentativa de SQL injection no início de sessão não entra.', 'Passou'],
    ['À 6.ª tentativa falhada o e-mail fica bloqueado 15 minutos; outros e-mails continuam a entrar.', 'Passou'],
    ['Palavras-passe curtas ou iguais ao e-mail são recusadas.', 'Passou'],
    ['O cookie de sessão não pode ser lido pelo JavaScript (HttpOnly).', 'Passou'],
    ['As pastas `includes/` e `dados/` e os endereços que não existem mostram a página 404.', 'Passou'],
    ['As 72 lições abrem, com som, exercício e botão de concluir.', 'Passou'],
    ['As ferramentas da página Praticar funcionam sem conta.', 'Passou'],
    ['A ordem dos traços funciona sem ligação à internet.', 'Passou'],
    ['O contraste das cores cumpre o nível AA das WCAG 2.2, no modo claro e no escuro.', 'Passou'],
    ['A base de dados importa num alojamento sem permissão para criar bases (`cha-alojamento.sql`).', 'Passou'],
], [12.5, 2.5], numero=7, titulo='Verificações técnicas')

c.sub('Anexo F: Documentos complementares')
c.p('Acompanham este relatório os seguintes documentos:')
for m in ['**Guia de Instalação**: como instalar o site no XAMPP e publicá-lo num alojamento gratuito;',
          '**Apresentação** em PowerPoint, usada na defesa do projeto;',
          '**Documentação da base de dados** (`docs/base-de-dados.md`), com o diagrama entidade-relação;',
          '**Scripts SQL** (`base_de_dados/cha.sql` e `cha-alojamento.sql`).']:
    c.marca(m)

# ═══ Índice (preenchido agora que todos os títulos são conhecidos) ═══
def run_campo(tipo=None, instr=None):
    r = OxmlElement('w:r')
    if tipo:
        f = OxmlElement('w:fldChar'); f.set(qn('w:fldCharType'), tipo); r.append(f)
    else:
        t = OxmlElement('w:instrText'); t.set(qn('xml:space'), 'preserve'); t.text = instr; r.append(t)
    return r


ci = Cursor(p_indice._p)
entradas = []
for nivel, texto in titulos_indice:
    par = doc.add_paragraph()
    f = par.paragraph_format
    f.tab_stops.add_tab_stop(Cm(LARGURA_UTIL), alignment=2, leader=1)  # direita, com pontos
    f.space_after = Pt(4 if nivel else 6)
    if nivel: f.left_indent = Cm(0.6)
    r = par.add_run(texto); r.font.size = Pt(11 if nivel else 12); r.bold = not nivel
    r2 = par.add_run('\t' + paginas.get(texto, '0')); r2.font.size = Pt(11 if nivel else 12)
    ci._por(par._p)
    entradas.append(par)
# o índice é um campo do Word: quem abrir o documento pode atualizá-lo (botão direito, «Atualizar campo»)
primeiro, ultimo = entradas[0]._p, entradas[-1]._p
pos = primeiro.find(qn('w:pPr'))
for k, el in enumerate([run_campo('begin'), run_campo(instr=' TOC \\u \\o "1-2" \\h \\z '), run_campo('separate')]):
    pos.addnext(el); pos = el
ultimo.append(run_campo('end'))
# primeiro parágrafo do índice com um pequeno espaço depois do título
p_indice.paragraph_format.space_after = Pt(12)

# Os parágrafos "." soltos do molde
tirar_pontos(None)

# Propriedades do documento
doc.core_properties.author = NOME
doc.core_properties.title = 'Relatório Final - Chá'
doc.core_properties.last_modified_by = NOME

doc.save(SAIDA)
# Lista dos títulos, para a segunda passagem encontrar as páginas
with open(os.path.join(AQUI, 'titulos.txt'), 'w', encoding='utf-8') as f:
    for nivel, texto in titulos_indice:
        f.write(texto + '\n')
print('Gravado:', SAIDA)
