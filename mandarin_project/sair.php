<?php
// sair.php
// Aqui eu termino a sessão. Só aceito pedidos POST com o token CSRF,
// para nenhum site de fora conseguir terminar a sessão de alguém com um simples link.

require 'includes/sessao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: conta.php');
    exit;
}
validar_csrf();

$_SESSION = [];      // apago os dados da sessão
session_destroy();   // e destruo a sessão no servidor

header('Location: entrar.php');
exit;
