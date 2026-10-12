<?php
// rodape-site.php
// Aqui eu escrevo o rodapé das páginas do curso: uma faixa da largura toda, com o conteúdo numa linha.
// À esquerda a marca, ao meio o lema em chinês (com pinyin e som) e à direita os links.
?>
<footer class="rodape">
  <div class="rodape__dentro">
    <div class="rodape__marca">
      <img src="img/logo-cha.svg" alt="" width="36" height="36">
      <div>
        <strong>Chá</strong>
        <span>Mandarim gratuito, um chá de cada vez.</span>
      </div>
    </div>

    <!-- O lema também se pode ouvir: o js/ouvir.js trata dos elementos com a classe zh-ex -->
    <div class="rodape__lema">
      <span class="zh-ex" lang="zh-CN">加油！继续学习！</span>
      <span class="rodape__pinyin">jiāyóu! jìxù xuéxí!</span>
      <span>Força! Continua a aprender!</span>
    </div>

    <nav class="rodape__links" aria-label="Rodapé">
      <a href="privacidade.php">Política de Privacidade</a>
      <a href="creditos.php">Créditos</a>
      <a href="biblioteca.php">Biblioteca</a>
    </nav>
  </div>
  <p class="rodape__fim">Projeto final do CET em Tecnologias e Programação de Sistemas de Informação · IEFP Leiria · 2026</p>
</footer>
