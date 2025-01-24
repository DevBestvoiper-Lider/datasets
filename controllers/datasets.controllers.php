<?php


class ControllersDatasets{
    static public function ctrMostrarDatasets($item, $valor){
        $respuesta = ModeloDatasets::mdlMostrarDatasets($item, $valor);
        return $respuesta;
    }

    static public function ctrContarTextos($item, $valor){
        $respuesta = ModeloDatasets::mdlContarTextos($item, $valor);
        return $respuesta;
    }

    static public function ctrContarAudios($item, $valor){
        $respuesta = ModeloDatasets::mdlContarAudios($item, $valor);
        return $respuesta;
    }
    
    static public function ctrCrearDatasets($id_user){

        $data_array = array();
        
        if ($_SERVER["REQUEST_METHOD"] == "POST") {

            $nombre = $_POST['nombre'];
            $genero = $_POST['genero'];

            $data_array = array(
                "nombre" => $nombre,
                "genero" => $genero,
                "id_user" => $id_user
            );

        }

        $respuesta = ModeloDatasets::mdlCrearDatasets($data_array);

        if ($respuesta == "OK") {
            echo "<script>
                Swal.fire({
                    icon: 'success',
                    title: '¡El contenido ha sido subido correctamente!',
                    showConfirmButton: true,
                    confirmButtonText: 'Cerrar',
                    closeOnConfirm: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location = 'create-datasets';
                    }
                });</script>";
        } else {
            echo "Error al subir el contenido.";
        }
    }  

    static public function ctrListarDatasDatasets($item, $valor){

        $item = "base_datos_id";

        $respuesta = ModeloDatasets::mdlListarDatasDatasets($item, $valor);
        return $respuesta;
    }

    static public function ctrVerAudioDatasets($item, $valor){
        $respuesta = ModeloDatasets::mdlVerAudioDatasets($item, $valor);
        return $respuesta;
    }

    static public function ctrVertexto($item, $valor){
        $respuesta = ModeloDatasets::mdlVertexto($item, $valor);
        return $respuesta;
    }

    static public function ctrListarTextos(){
        $respuesta = ModeloDatasets::mdlListarTextos();
        return $respuesta;
    }

    static public function ctrSubirContenidoDatasets($genero, $id_user, $id_datasets){

        $data_array = array();

        // Directorio donde se guardarán los archivos subidos
        $uploadDir = 'audios-datasets/' . $genero . '/' . $id_user . '/' . $id_datasets . '/';

        // Verifica si se envió un archivo
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['archivo'])) {
            $file = $_FILES['archivo'];

            if($id_datasets == null){
                $id_datasets = $_POST['datasets'];
            }


            $res_lastaudio = ModeloDatasets::mdlVerUltimoAudio($id_datasets);

            // Verificar si no hubo errores en la subida
            if ($file['error'] === UPLOAD_ERR_OK) {
                $fileName = basename($file['name']);
                $fileTmpPath = $file['tmp_name'];

                // Incrementar el número para el nuevo archivo
                $newNumber = str_pad($res_lastaudio + 1, 4, '0', STR_PAD_LEFT);
                $destination = $uploadDir . "audio_{$newNumber}.wav";



                // Crear el directorio si no existe
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }

                // Mover el archivo cargado al directorio destino
                if (move_uploaded_file($fileTmpPath, $destination)) {
                    echo "El archivo se ha subido correctamente: $fileName";
                } else {
                    echo "Error al mover el archivo.";
                }
            } else {
                echo "Error al subir el archivo. Código de error: " . $file['error'];
            }

            $data_array = array(
                "id_datasets" => $id_datasets,
                "destination" => $destination,
                'contenido' => $_POST['id_texto']
            );

            // Validar si el texto ya existe en el dataset
            $textoExistente = ModeloDatasets::mdlValidartexto('contenido_id', $_POST['id_texto']);
            if (!empty($textoExistente)) {
                echo "<script>
                    Swal.fire({
                        icon: 'error',
                        title: '¡El texto ya existe en el dataset!',
                        showConfirmButton: true,
                        confirmButtonText: 'Cerrar',
                        closeOnConfirm: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location = 'list-text';
                        }
                    });</script>";
                return;
            }
        } else {
            echo "No se recibió ningún archivo.";
        }

        // Limpia $_POST después de procesarlo
        $_POST = [];

        if (isset($destination)) {
            $respuesta = ModeloDatasets::mdlSubirContenidoDatasets($data_array);

            if ($respuesta == "OK") {
                echo "<script>
                    Swal.fire({
                        icon: 'success',
                        title: '¡El contenido ha sido subido correctamente!',
                        showConfirmButton: true,
                        confirmButtonText: 'Cerrar',
                        closeOnConfirm: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location = 'ver-datasets?" . "id_datasets=". $id_datasets . "&genero=" . $genero . "';
                        }
                    });</script>";
            } else {
                echo "Error al subir el contenido.";
            }
        }
    }
}
