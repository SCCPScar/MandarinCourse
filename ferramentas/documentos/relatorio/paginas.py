# paginas.py: descobre em que página do PDF está cada título (para o índice do relatório)
import re, subprocess, sys
pdf, titulos, saida = sys.argv[1], sys.argv[2], sys.argv[3]
total = int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout).group(1))
norm = lambda s: re.sub(r'\s+', ' ', s.replace('\xa0', ' ')).strip()
texto = {}
for n in range(3, total + 1):  # a página 2 é o próprio índice
    out = subprocess.run(['pdftotext', '-f', str(n), '-l', str(n), pdf, '-'], capture_output=True, text=True).stdout
    texto[n] = [norm(l) for l in out.split('\n')]
with open(saida, 'w', encoding='utf-8') as f:
    for t in open(titulos, encoding='utf-8').read().splitlines():
        pagina = next((n for n in texto if any(l.startswith(norm(t)[:40]) for l in texto[n])), None)
        if pagina is None:
            print('Sem página:', t)
        f.write(f'{t}\t{pagina or 0}\n')
