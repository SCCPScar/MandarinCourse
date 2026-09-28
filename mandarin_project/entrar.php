<?php
// entrar.php
// Aqui eu faço o login (iniciar sessão).

require 'includes/sessao.php';
require 'includes/ligacao.php';

// Se a pessoa já tem sessão iniciada, eu mando-a direto para a conta
if (id_utilizador() !== null) {
    header('Location: conta.php');
    exit;
}

$erro = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    validar_csrf();

    $email = trim($_POST['email'] ?? '');
    $palavra_passe = $_POST['palavra_passe'] ?? '';

    $consulta = $pdo->prepare('SELECT id, palavra_passe FROM utilizadores WHERE email = ?');
    $consulta->execute([$email]);
    $utilizador = $consulta->fetch();

    // password_verify compara a palavra-passe escrita com o hash guardado
    if ($utilizador && password_verify($palavra_passe, $utilizador['palavra_passe'])) {
        iniciar_sessao($utilizador['id']);
        header('Location: conta.php');
        exit;
    }

    // Eu uso a mesma mensagem nos dois casos (e-mail ou palavra-passe errados),
    // para ninguém descobrir que e-mails têm conta no site
    $erro = 'E-mail ou palavra-passe incorretos.';
}

$titulo = 'Iniciar sessão';
require 'includes/cabecalho.php';
?>
<section class="conta-caixa">
  <h1>Iniciar sessão</h1>

  <?php if (isset($_GET['eliminada'])): ?>
    <div class="aviso aviso--ok" role="status">A tua conta e todos os teus dados foram eliminados.</div>
  <?php endif; ?>

  <?php if ($erro): ?>
    <div class="aviso aviso--erro" role="alert"><?= e($erro) ?></div>
  <?php endif; ?>

  <form method="post">
    <input type="hidden" name="csrf" value="<?= e(token_csrf()) ?>">

    <div class="campo">
      <label for="email">E-mail</label>
      <input id="email" name="email" type="email" autocomplete="email" required value="<?= e($email) ?>">
    </div>
    <div class="campo">
      <label for="palavra_passe">Palavra-passe</label>
      <input id="palavra_passe" name="palavra_passe" type="password" autocomplete="current-password" required>
    </div>

    <button class="botao" type="submit">Entrar</button>
  </form>

  <p>Ainda não tens conta? <a href="registo.php">Cria uma aqui</a>.</p>
</section>
<?php require 'includes/rodape.php'; ?>
