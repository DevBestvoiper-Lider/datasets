<?php
require_once '../controllers/datasets.controllers.php';
require_once '../models/datasets.models.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_datasets = $_POST['datasets'];
    $id_texto = $_POST['id_texto'];

    $data_array = array();

    if (isset($_FILES['archivo'])) {
        $file = $_FILES['archivo'];
        $uploadDir = '../audios-datasets/' . $id_datasets . '/';

        $res_lastaudio = ModeloDatasets::mdlVerUltimoAudio($id_datasets);

        if ($file['error'] === UPLOAD_ERR_OK) {
            $fileName = basename($file['name']);
            $fileTmpPath = $file['tmp_name'];
            $newNumber = str_pad($res_lastaudio + 1, 4, '0', STR_PAD_LEFT);
            $destination = $uploadDir . "audio_{$newNumber}.wav";

            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            if (move_uploaded_file($fileTmpPath, $destination)) {
                $data_array = array(
                    "id_datasets" => $id_datasets,
                    "destination" => $destination,
                    'contenido' => $id_texto
                );

                $textoExistente = ModeloDatasets::mdlValidartexto('contenido_id', $id_texto, 'base_datos_id', $id_datasets);
                if (!empty($textoExistente)) {
                    echo json_encode(array("status" => "error", "message" => "¡El texto ya existe en el dataset!"));
                    exit;
                }

                $respuesta = ModeloDatasets::mdlSubirContenidoDatasets($data_array);
                if ($respuesta == "OK") {
                    echo json_encode(array("status" => "success", "message" => "¡El contenido ha sido subido correctamente!"));
                } else {
                    echo json_encode(array("status" => "error", "message" => "Error al subir el contenido."));
                }
            } else {
                echo json_encode(array("status" => "error", "message" => "Error al mover el archivo."));
            }
        } else {
            echo json_encode(array("status" => "error", "message" => "Error al subir el archivo. Código de error: " . $file['error']));
        }
    } else {
        echo json_encode(array("status" => "error", "message" => "No se recibió ningún archivo."));
    }
}
?>
