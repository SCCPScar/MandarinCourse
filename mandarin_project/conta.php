<?php
// conta.php
// Aqui eu mostro "A minha conta". Só entra quem tem sessão iniciada.

require 'includes/sessao.php';
require 'includes/ligacao.php';

exigir_sessao();

$consulta = $pdo->prepare('SELECT nome, email, criado_em FROM utilizadores WHERE id = ?');
$consulta->execute([id_utilizador()]);
$utilizador = $consulta->fetch();

// Se a conta já não existe (por exemplo, foi eliminada noutro separador), eu termino a sessão
if (!$utilizador) {
    session_destroy();
    header('Location: entrar.php');
    exit;
}

// Eu mostro a data no formato de Portugal: dia/mês/ano
$membro_desde = date('d/m/Y', strtotime($utilizador['criado_em']));

$titulo = 'A minha conta';
require 'includes/cabecalho.php';
?>
<section class="conta-caixa">
  <h1>Olá, <?= e($utilizador['nome']) ?>!</h1>
  <p>E-mail: <?= e($utilizador['email']) ?><br>Membro desde <?= e($membro_desde) ?></p>

  <a class="botao" href="index.html" style="display:grid;place-items:center;text-decoration:none">Continuar a estudar</a>

  <form method="post" action="sair.php">
    <input type="hidden" name="csrf" value="<?= e(token_csrf()) ?>">
    <button class="botao botao--simples" type="submit">Terminar sessão</button>
  </form>

  <div class="zona-perigo">
    <h2>Eliminar conta</h2>
    <p>Isto apaga para sempre a tua conta, o teu progresso, as tuas revisões e o teu caderno.</p>
    <form method="post" action="eliminar-conta.php">
      <input type="hidden" name="csrf" value="<?= e(token_csrf()) ?>">
      <label class="confirmar">
        <input type="checkbox" name="confirmo" required>
        <span>Confirmo que quero eliminar a minha conta.</span>
      </label>
      <button class="botao botao--perigo" type="submit">Eliminar a minha conta</button>
    </form>
  </div>
</section>
<?php require 'includes/rodape.php'; ?>
