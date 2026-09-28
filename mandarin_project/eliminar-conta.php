<?php
// eliminar-conta.php
// Aqui eu elimino a conta do utilizador e todos os dados dele.
// É o "direito ao apagamento" do RGPD (art. 17.º).

require 'includes/sessao.php';
require 'includes/ligacao.php';

exigir_sessao();

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['confirmo'])) {
    header('Location: conta.php');
    exit;
}
validar_csrf();

// Basta apagar o utilizador: o ON DELETE CASCADE da base de dados
// apaga também o progresso, as revisões e o caderno dele.
$apagar = $pdo->prepare('DELETE FROM utilizadores WHERE id = ?');
$apagar->execute([id_utilizador()]);

$_SESSION = [];
session_destroy();

header('Location: entrar.php?eliminada=1');
exit;
