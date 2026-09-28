<?php
// sessao.php
// Aqui eu inicio a sessão e junto as funções que várias páginas usam.

// As datas (dias seguidos, revisões) seguem a hora de Portugal continental
date_default_timezone_set('Europe/Lisbon');

// Eu protejo o cookie da sessão:
// - httponly: o JavaScript não o consegue ler (ajuda contra XSS);
// - samesite Lax: o navegador não o envia em pedidos vindos de outros sites.
session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax']);
session_start();

// Eu devolvo o id do utilizador com sessão iniciada, ou null se não houver.
function id_utilizador() {
    return $_SESSION['utilizador_id'] ?? null;
}

// Nas páginas privadas: se ninguém iniciou sessão, eu mando para a página de entrada.
function exigir_sessao() {
    if (id_utilizador() === null) {
        header('Location: entrar.php');
        exit;
    }
}

// Eu inicio a sessão de um utilizador (depois do registo ou do login).
// session_regenerate_id cria um id de sessão novo, para ninguém reaproveitar um id antigo.
function iniciar_sessao($id) {
    session_regenerate_id(true);
    $_SESSION['utilizador_id'] = $id;
}

// Token CSRF: um código secreto que eu ponho em cada formulário.
// Se um site malicioso tentar enviar o formulário por ti, não sabe o código e o pedido falha.
function token_csrf() {
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function validar_csrf() {
    if (!hash_equals($_SESSION['csrf'] ?? '', $_POST['csrf'] ?? '')) {
        exit('Pedido inválido. Volta atrás e tenta outra vez.');
    }
}

// Eu escapo o texto antes de o mostrar no HTML, para ninguém conseguir injetar código (XSS).
function e($texto) {
    return htmlspecialchars($texto, ENT_QUOTES, 'UTF-8');
}
