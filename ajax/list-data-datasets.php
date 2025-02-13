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

    $item = "id";
    $valor = $dataset['contenido_id'];

    $texto = $datasets->ctrVertexto($item, $valor);

    $archivo = "http://158.69.158.91/" . ($audio[0]['archivo_audio'] ?? "not found");

    $data_array[] = array(
        "id" => $dataset['id'],
        "contenido" => $texto[0]['contenido'],
        "idAudio" => $audio[0]['id'],
        "obs" => $audio[0]['obs'],
        "status" => $audio[0]['status'],
        "audio" => $archivo,
    );
}

echo json_encode(array("data" => $data_array));