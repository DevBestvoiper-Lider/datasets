<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);



// Modulos
require_once 'models/usuarios.models.php';

// controladores
require_once 'controllers/usuarios.controllers.php';
require_once 'controllers/plantilla.controllers.php';


$plantilla = new ControllersPlantilla();

$plantilla -> ctrPlantilla();



// echo phpinfo();

?>