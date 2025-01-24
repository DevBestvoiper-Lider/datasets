<?php


// Modulos
require_once '../models/datasets.models.php';
// controladores
require_once '../controllers/datasets.controllers.php';

$list_textos = new ControllersDatasets();

$textos = $list_textos->ctrListarTextos();

echo json_encode(array("data" => $textos));