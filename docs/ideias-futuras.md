# Chá · Ideias para o futuro

> Versão 2 (13/10/2026). Estas ideias ficaram de fora da versão entregue, por falta de tempo ou por decisão minha. Servem para a secção "Trabalho futuro" do relatório.

## 1. Ferramentas com inteligência artificial

### O que existia

Numa versão anterior do site havia quatro ferramentas que usavam um modelo de linguagem (a IA Claude, da Anthropic):

- um **tutor** a quem o aluno podia fazer perguntas sobre gramática, vocabulário ou cultura;
- **conversas simuladas** (restaurante, táxi, mercado, médico, entrevista de emprego), em que a IA fazia de outra pessoa e corrigia os erros;
- um **dicionário** que aceitava qualquer palavra;
- um **treinador de pronúncia** que comentava o que o reconhecimento de voz tinha ouvido.

### Porque é que as tirei

- O site chamava a API diretamente do browser, o que não funciona num servidor normal (como o XAMPP) e obrigaria a mostrar a chave da API a qualquer visitante.
- A API é paga: cada pergunta de cada aluno teria um custo.
- Os textos dos alunos seriam enviados para uma empresa fora da União Europeia. Como o site aceita alunos a partir dos 13 anos, isso exigiria mais cuidados de proteção de dados (RGPD, capítulo V, e Lei n.º 58/2019).

### O que ficou no lugar

- O **dicionário** passou a procurar no vocabulário do próprio curso (`js/caderno.js`). Funciona sem internet.
- O **treinador de pronúncia** compara o que o reconhecimento de voz ouviu com a frase escolhida, com uma medida de semelhança entre textos (`parecenca`, em `js/pronuncia.js`).
- O tutor e as conversas foram retirados.

### Como se poderia voltar a pôr

1. Criar um ficheiro PHP no servidor (por exemplo `api/ia.php`) que recebe a pergunta do aluno e fala com a API da Anthropic através do SDK oficial para PHP, instalado com o Composer. Assim a chave fica guardada só no servidor, num ficheiro de configuração fora do Git.
2. Deixar usar a IA só a quem tem sessão iniciada, e limitar o número de perguntas por dia, para controlar o custo.
3. Atualizar a Política de Privacidade (transferência de dados para fora da UE, finalidade, prazo de conservação) e pedir consentimento específico.
4. Usar a IA sobretudo para corrigir frases escritas pelo aluno e para as "missões" das cidades (ver a ideia 2).

## 2. Missões das cidades e certificado

O plano da rota (`rota-12-meses.md`) prevê uma **missão** no fim de cada cidade (por exemplo, gravar um diálogo num mercado) e um **certificado Chá** no fim dos 12 meses. Na versão entregue, o aluno recebe o **carimbo da cidade** (完成) na página inicial quando conclui todas as lições dessa cidade, mas as missões e o certificado ainda não existem.

## 3. Mais conteúdo

A versão entregue tem **72 lições** (3 por unidade), com 523 palavras e 222 frases. O plano completo prevê cerca de 10 lições por unidade e 2245 palavras (nível 3 do HSK 3.0). As lições novas só precisam de linhas novas no `cha.sql`, porque as páginas PHP leem tudo da base de dados.

## 4. Guardar todo o progresso na conta do aluno

Hoje o progresso está em dois sítios:

- **Na base de dados, ligado à conta:** as lições concluídas (tabela `progresso`) e os dias seguidos a concluir lições (`utilizadores.sequencia_dias`).
- **No browser (localStorage):** as palavras aprendidas nos cartões, a revisão espaçada, o caderno, os dias de estudo, as medalhas e os resultados de pronúncia.

Por isso, se o aluno mudar de computador, perde a parte que está no browser. Numa versão anterior a base tinha as tabelas `revisoes` e `caderno` para isto, mas nenhuma página as usava, e eu tirei-as para a base ter só o que o site usa.

O passo seguinte seria:

1. Voltar a criar as tabelas `revisoes` (utilizador, palavra, intervalo, próxima data), `caderno` e `conquistas`.
2. Criar ficheiros PHP pequenos (por exemplo `api/guardar-revisao.php`) que recebem os dados do JavaScript com `fetch()` e os gravam na conta, sempre com sessão iniciada e token CSRF.
3. Quando o aluno entra na conta, juntar o que tinha no browser com o que está na base.
