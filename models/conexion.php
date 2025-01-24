<?php

$environment = getenv('APP_ENV');

// Credenciales estáticas para la conexión ConexionUsers
$usersHost = 'consumos.bestvoiper.com';
$usersUser = 'developers';
$usersPass = 'luis123*+++';

// Credenciales para las otras conexiones según el entorno

$hostDB = '158.69.158.91';
$userDB = 'developers';
$passDB = 'UcP12#{|y42>';

class ConexionUsers
{
    static public function conectar()
    {
        global $usersHost, $usersUser, $usersPass;
        $link = new PDO("mysql:host=" . $usersHost . ";dbname=usuarios", $usersUser, $usersPass);
        $link->exec("set names utf8");
        return $link;
    }
}

class ConexionDatasets
{
    static public function conectar()
    {
        global $hostDB, $userDB, $passDB;

        try {
            $link = new PDO("mysql:host=" . $hostDB . ";dbname=db_datasets", $userDB, $passDB);
            $link->exec("set names utf8");
            return $link;
        } catch (PDOException $e) {
            die("Error en la conexión: " . $e->getMessage());
        }
    }
}