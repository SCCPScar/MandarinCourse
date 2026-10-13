#!/bin/bash
# gerar_sql_alojamento.sh
# Aqui eu crio o base_de_dados/cha-alojamento.sql a partir do cha.sql.
# Os alojamentos gratuitos (como o InfinityFree) não deixam criar nem apagar bases de dados com SQL:
# a base é criada no painel do alojamento. Por isso esta versão não tem DROP DATABASE, CREATE DATABASE nem USE.
# Em vez disso, apaga as 9 tabelas (se existirem), para se poder importar outra vez.
# Uso: bash ferramentas/gerar_sql_alojamento.sh (sempre que mudar o cha.sql)

cd "$(dirname "$0")/.."
{
  echo "-- ====================================================================="
  echo "-- Chá · Base de dados para o ALOJAMENTO ONLINE"
  echo "-- Ficheiro gerado a partir do cha.sql por ferramentas/gerar_sql_alojamento.sh."
  echo "-- Antes de importar, eu escolho a base de dados à esquerda no phpMyAdmin do alojamento."
  echo "-- ====================================================================="
  echo ""
  echo "SET NAMES utf8mb4;"
  echo ""
  echo "-- Eu apago as tabelas antigas (se existirem), das que dependem de outras para as outras."
  echo "DROP TABLE IF EXISTS tentativas_login, progresso, frases, palavras, licoes, cultura, unidades, cidades, utilizadores;"
  # Do cha.sql, salto tudo até à linha "USE cha;" (inclusive)
  sed '1,/^USE cha;$/d' base_de_dados/cha.sql
} > base_de_dados/cha-alojamento.sql
echo "Criado: base_de_dados/cha-alojamento.sql"
