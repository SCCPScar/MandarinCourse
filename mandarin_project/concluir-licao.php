<?php
// concluir-licao.php
// Aqui eu guardo que o aluno terminou uma lição. Faço duas coisas:
// 1) registo a lição no progresso;
// 2) atualizo os dias seguidos a concluir lições.

require 'includes/sessao.php';
require 'includes/ligacao.php';

exigir_sessao();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}
validar_csrf();

$licao_id = (int) ($_POST['licao_id'] ?? 0);
$aluno_id = id_utilizador();

// Eu confirmo que a lição existe e descubro a cidade dela (para voltar lá no fim)
$consulta = $pdo->prepare('
    SELECT u.cidade_id FROM licoes l JOIN unidades u ON u.id = l.unidade_id WHERE l.id = ?
');
$consulta->execute([$licao_id]);
$cidade_id = $consulta->fetchColumn();

if (!$cidade_id) {
    header('Location: index.php');
    exit;
}

$hoje = date('Y-m-d');
$ontem = date('Y-m-d', strtotime('-1 day'));

// 1) Progresso. INSERT IGNORE: se a lição já estava feita, a chave primária impede
//    a linha repetida e o MySQL simplesmente ignora, sem dar erro.
$inserir = $pdo->prepare('INSERT IGNORE INTO progresso (utilizador_id, licao_id, pontuacao) VALUES (?, ?, 100)');
$inserir->execute([$aluno_id, $licao_id]);

// 2) Dias seguidos (a concluir lições).
//    Se já estudou hoje, fica igual. Se estudou ontem, soma 1. Senão, recomeça em 1.
$consulta = $pdo->prepare('SELECT sequencia_dias, ultimo_estudo FROM utilizadores WHERE id = ?');
$consulta->execute([$aluno_id]);
$aluno = $consulta->fetch();

if ($aluno['ultimo_estudo'] === $hoje) {
    $sequencia = $aluno['sequencia_dias'];
} elseif ($aluno['ultimo_estudo'] === $ontem) {
    $sequencia = $aluno['sequencia_dias'] + 1;
} else {
    $sequencia = 1;
}

$atualizar = $pdo->prepare('UPDATE utilizadores SET sequencia_dias = ?, ultimo_estudo = ? WHERE id = ?');
$atualizar->execute([$sequencia, $hoje, $aluno_id]);

// Volto à lição, que mostra «Lição concluída» e o botão para a próxima
header('Location: licao.php?id=' . $licao_id . '&feita=1');
exit;
