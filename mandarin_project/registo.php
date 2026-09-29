<?php
// registo.php
// Aqui eu crio uma conta nova.
// 1) Mostro o formulário.  2) Quando é enviado, valido os dados.
// 3) Se estiver tudo certo, guardo o utilizador e inicio a sessão.

require 'includes/sessao.php';
require 'includes/ligacao.php';

$erros = [];
$nome = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    validar_csrf();

    // trim() tira os espaços a mais no início e no fim
    $nome = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $palavra_passe = $_POST['palavra_passe'] ?? '';
    $confirmacao = $_POST['confirmacao'] ?? '';

    // Eu valido cada campo e junto as mensagens de erro numa lista
    if (mb_strlen($nome) < 2 || mb_strlen($nome) > 80) {
        $erros[] = 'O nome tem de ter entre 2 e 80 caracteres.';
    }
    // A coluna email na base de dados tem 120 caracteres
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 120) {
        $erros[] = 'O e-mail não é válido.';
    }
    if (strlen($palavra_passe) < 8) {
        $erros[] = 'A palavra-passe tem de ter pelo menos 8 caracteres.';
    }
    // O password_hash (bcrypt) só usa os primeiros 72 bytes, por isso eu não aceito mais do que isso
    if (strlen($palavra_passe) > 72) {
        $erros[] = 'A palavra-passe pode ter no máximo 72 caracteres.';
    }
    // Uma palavra-passe igual ao e-mail ou ao nome é fácil de adivinhar
    if (strcasecmp($palavra_passe, $email) === 0 || strcasecmp($palavra_passe, $nome) === 0) {
        $erros[] = 'A palavra-passe não pode ser igual ao nome nem ao e-mail.';
    }
    if ($palavra_passe !== $confirmacao) {
        $erros[] = 'As palavras-passe não são iguais.';
    }
    // Em Portugal, a idade mínima para consentir sozinho é 13 anos (Lei n.º 58/2019, art. 16.º)
    if (!isset($_POST['idade'])) {
        $erros[] = 'Tens de confirmar que tens 13 anos ou mais.';
    }
    if (!isset($_POST['privacidade'])) {
        $erros[] = 'Tens de aceitar a Política de Privacidade.';
    }

    // Eu só procuro o e-mail na base de dados se o resto estiver certo
    if (!$erros) {
        $consulta = $pdo->prepare('SELECT id FROM utilizadores WHERE email = ?');
        $consulta->execute([$email]);
        if ($consulta->fetch()) {
            $erros[] = 'Já existe uma conta com este e-mail.';
        }
    }

    if (!$erros) {
        // password_hash transforma a palavra-passe num código que não se consegue reverter
        $hash = password_hash($palavra_passe, PASSWORD_DEFAULT);

        // Eu uso "?" em vez de juntar o texto ao SQL: assim ninguém consegue fazer SQL injection
        $inserir = $pdo->prepare(
            'INSERT INTO utilizadores (nome, email, palavra_passe, consentimento) VALUES (?, ?, ?, NOW())'
        );
        $inserir->execute([$nome, $email, $hash]);

        iniciar_sessao($pdo->lastInsertId());
        header('Location: conta.php');
        exit;
    }
}

$titulo = 'Criar conta';
require 'includes/cabecalho.php';
?>
<section class="conta-caixa">
  <h1>Criar conta</h1>
  <p>Guarda o teu progresso e continua a estudar em qualquer dispositivo.</p>

  <?php if ($erros): ?>
    <div class="aviso aviso--erro" role="alert">
      <ul>
        <?php foreach ($erros as $erro): ?>
          <li><?= e($erro) ?></li>
        <?php endforeach; ?>
      </ul>
    </div>
  <?php endif; ?>

  <form method="post" novalidate>
    <input type="hidden" name="csrf" value="<?= e(token_csrf()) ?>">

    <div class="campo">
      <label for="nome">Nome</label>
      <input id="nome" name="nome" type="text" autocomplete="name" required value="<?= e($nome) ?>">
    </div>
    <div class="campo">
      <label for="email">E-mail</label>
      <input id="email" name="email" type="email" maxlength="120" autocomplete="email" required value="<?= e($email) ?>">
    </div>
    <div class="campo">
      <label for="palavra_passe">Palavra-passe (mínimo 8 caracteres)</label>
      <input id="palavra_passe" name="palavra_passe" type="password" autocomplete="new-password" required minlength="8" maxlength="72">
    </div>
    <div class="campo">
      <label for="confirmacao">Repete a palavra-passe</label>
      <input id="confirmacao" name="confirmacao" type="password" autocomplete="new-password" required>
    </div>

    <label class="confirmar">
      <input type="checkbox" name="idade" required>
      <span>Tenho 13 anos ou mais.</span>
    </label>
    <label class="confirmar">
      <input type="checkbox" name="privacidade" required>
      <span>Li e aceito a <a href="privacidade.php" target="_blank" rel="noopener">Política de Privacidade</a>.</span>
    </label>

    <button class="botao" type="submit">Criar conta</button>
  </form>

  <p>Já tens conta? <a href="entrar.php">Inicia sessão</a>.</p>
</section>
<?php require 'includes/rodape.php'; ?>
