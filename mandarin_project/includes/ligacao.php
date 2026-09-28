<?php
// ligacao.php
// Aqui eu ligo o PHP à base de dados "cha" do XAMPP.
// Todas as páginas que precisam da base de dados fazem: require 'includes/ligacao.php';

// No XAMPP o utilizador do MySQL é "root" e não tem palavra-passe.
// Num servidor a sério eu usaria outro utilizador, com palavra-passe forte.
$servidor = 'localhost';
$base     = 'cha';
$utilizador_bd = 'root';
$palavra_passe_bd = '';

try {
    // Eu uso utf8mb4 para os caracteres chineses (你好) chegarem certos.
    $pdo = new PDO("mysql:host=$servidor;dbname=$base;charset=utf8mb4", $utilizador_bd, $palavra_passe_bd);

    // Se uma consulta SQL falhar, eu quero uma exceção (um erro visível), e não um silêncio.
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Assim cada linha vem como array associativo, por exemplo $linha['nome'].
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Eu não mostro o erro verdadeiro ao visitante, porque pode revelar dados do servidor.
    // Guardo-o no registo de erros do Apache para eu o ler.
    error_log($e->getMessage());
    exit('Não foi possível ligar à base de dados. Confirma se o MySQL está ligado no XAMPP.');
}
