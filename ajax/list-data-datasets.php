<?php

// Modulos
require_once '../models/datasets.models.php';
// controladores
require_once '../controllers/datasets.controllers.php';

$datasets = new ControllersDatasets();

$data_array = array();

$item = "usuario_id";
$valor = $_POST['idDataset'] ?? null;

$data_datasets = $datasets->ctrListarDatasDatasets($item, $valor);

// echo $data_datasets;

foreach ($data_datasets as $dataset) {
    $item = "id";
    $valor = $dataset['id_audio'];
    // print_r($dataset);
    $audio = $datasets->ctrVerAudioDatasets($item, $valor);

    $archivo = $audio[0]['archivo_audio'] ?? "not found";

    $data_array[] = array(
        "id" => $dataset['id'],
        "contenido" => $dataset['contenido'],
        "audio" => $archivo,
    );
}

echo json_encode(array("data" => $data_array));