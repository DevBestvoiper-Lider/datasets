<?php

// Modulos
require_once '../models/datasets.models.php';
// controladores
require_once '../controllers/datasets.controllers.php';

$datasets = new ControllersDatasets();

$datasets_array = array();

$item = "usuario_id";
$valor = $_POST['id_user'] ?? null;

$data_datasets = $datasets->ctrMostrarDatasets($item, $valor);

foreach ($data_datasets as $dataset) {
    $item = "base_datos_id";
    $valor = $dataset['id'];
    // print_r($dataset);
    $count_text = $datasets->ctrContarTextos($item, $valor);
    $count_audio = $datasets->ctrContarAudios($item, $valor);
    $dataset['count_text'] = $count_text[0]['sum_textos'] ?? 0;
    $dataset['count_audio'] = $count_audio[0]['sum_audios'] ?? 0;

    $datasets_array[] = array(
        "id" => $dataset['id'],
        "nombre" => $dataset['nombre'],
        "genero" => $dataset['genero'],
        "count_text" => $dataset['count_text'],
        "count_audio" => $dataset['count_audio']
    );
}


echo json_encode(array("data" => $datasets_array));