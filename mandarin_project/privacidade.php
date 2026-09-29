<?php
// privacidade.php
// Aqui eu explico que dados o site guarda e porquê (RGPD).
// ATENÇÃO: antes de publicar, eu tenho de trocar o nome e o e-mail entre [ ] pelos dados verdadeiros.

require 'includes/sessao.php';

$titulo = 'Política de Privacidade';
require 'includes/cabecalho.php';
?>
<section class="conta-caixa">
  <h1>Política de Privacidade</h1>
  <p>Última atualização: 29 de setembro de 2026</p>

  <h2>Quem é o responsável</h2>
  <p>[Nome do responsável], [e-mail de contacto]. O Chá é um projeto escolar e gratuito.</p>

  <h2>Que dados eu guardo</h2>
  <p>O teu nome, o teu e-mail, a tua palavra-passe (só em forma cifrada, nunca em texto), a data em que aceitaste esta política e o teu progresso no curso (lições, revisões e caderno).</p>

  <h2>Para quê</h2>
  <p>Só para guardar a tua conta e o teu progresso. Eu não vendo nem partilho os teus dados, não mostro publicidade e não uso cookies de rastreio. Uso apenas um cookie de sessão, necessário para manter a sessão iniciada.</p>

  <h2>O que fica guardado no teu browser</h2>
  <p>Algumas preferências ficam só no teu browser (armazenamento local), e não chegam ao servidor: o modo escuro, o nível que escolheste na primeira visita, e o caderno, as revisões, os dias seguidos e as conquistas dos exercícios das páginas de prática. Podes apagá-las quando quiseres nas definições do browser.</p>

  <h2>Serviços de outras empresas</h2>
  <p>Na página Caracteres, a animação dos traços usa a biblioteca Hanzi Writer, que o browser descarrega do jsDelivr. Para isso, o jsDelivr recebe o teu endereço IP, como acontece em qualquer site. Nos exercícios de pronúncia, o reconhecimento de voz é feito pelo próprio browser: no Chrome e no Edge, o áudio é enviado para os servidores da Google ou da Microsoft para ser convertido em texto. Só acontece quando carregas no botão do microfone.</p>

  <h2>Base legal</h2>
  <p>O teu consentimento, dado ao criar a conta (art. 6.º, n.º 1, alínea a) do RGPD). Para te registares tens de ter 13 anos ou mais (art. 16.º da Lei n.º 58/2019).</p>

  <h2>Durante quanto tempo</h2>
  <p>Enquanto a tua conta existir. Quando a eliminas, todos os teus dados são apagados de imediato.</p>

  <h2>Os teus direitos</h2>
  <p>Podes consultar, corrigir e apagar os teus dados, e retirar o consentimento a qualquer momento. Para apagar tudo, usa o botão "Eliminar a minha conta" na página da conta. Também podes apresentar reclamação à Comissão Nacional de Proteção de Dados (<a href="https://www.cnpd.pt" target="_blank" rel="noopener">www.cnpd.pt</a>).</p>
</section>
<?php require 'includes/rodape.php'; ?>
