<?php

require_once 'conexion.php';

class ModeloDatasets
{
    static public function mdlMostrarDatasets($item, $valor)
    {
        if ($item != null) {
            $stmt = ConexionDatasets::conectar()->prepare("SELECT * FROM bases_datos WHERE $item = :$item");
            $stmt->bindParam(":" . $item, $valor, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll();
        } else {
            $stmt = ConexionDatasets::conectar()->prepare("SELECT * FROM bases_datos");
            $stmt->execute();
            return $stmt->fetchAll();
        }
        $stmt->close();
        $stmt = null;
    }

    static public function mdlListarTextos(){
        $conn = ConexionDatasets::conectar(); // Obtén la conexión PDO
        $stmt = $conn->prepare("SELECT * FROM textos_dispo");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    static public function mdlContarTextos($item, $valor)
    {
        if ($item != null) {
            $stmt = ConexionDatasets::conectar()->prepare("SELECT count(*) AS sum_textos FROM entradas_texto WHERE $item = :$item");
            $stmt->bindParam(":" . $item, $valor, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll();
        } else {
            $stmt = ConexionDatasets::conectar()->prepare("SELECT count(*) AS sum_textos FROM entradas_texto");
            $stmt->execute();
            return $stmt->fetchAll();
        }
        $stmt->close();
        $stmt = null;
    }

    static public function mdlContarAudios($item, $valor)
    {
        if ($item != null) {
            $stmt = ConexionDatasets::conectar()->prepare("SELECT count(*) AS sum_audios FROM audios WHERE $item = :$item");
            $stmt->bindParam(":" . $item, $valor, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll();
        } else {
            $stmt = ConexionDatasets::conectar()->prepare("SELECT count(*) AS sum_audios FROM audios");
            $stmt->execute();
            return $stmt->fetchAll();
        }
        $stmt->close();
        $stmt = null;
    }

    static public function mdlCrearDatasets($data)
    {
        if ($data != null) {
            $conn = ConexionDatasets::conectar(); // Obtén la conexión PDO
            $stmt = $conn->prepare("INSERT INTO bases_datos (nombre, genero, usuario_id) VALUES (:nombre, :genero, :usuario_id)");
            $stmt->bindParam(":usuario_id", $data["id_user"], PDO::PARAM_INT);
            $stmt->bindParam(":nombre", $data["nombre"], PDO::PARAM_STR);
            $stmt->bindParam(":genero", $data["genero"], PDO::PARAM_STR);
            if ($stmt->execute()) {
                return "OK";
            } else {
                return "ERROR";
            }
        } else {
            $stmt = ConexionDatasets::conectar()->prepare("SELECT count(*) AS sum_audios FROM audios");
            $stmt->execute();
            return $stmt->fetchAll();
        }
        $stmt->close();
        $stmt = null;
    }

    static public function mdlListarDatasDatasets($item, $valor)
    {
        if ($item != null) {
            $stmt = ConexionDatasets::conectar()->prepare("SELECT * FROM entradas_texto WHERE $item = :$item");
            $stmt->bindParam(":" . $item, $valor, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll();
        } else {
            $stmt = ConexionDatasets::conectar()->prepare("SELECT * FROM entradas_texto");
            $stmt->execute();
            return $stmt->fetchAll();
        }
        $stmt->close();
        $stmt = null;
    }

    static public function mdlVerAudioDatasets($item, $valor)
    {
        if ($item != null) {
            $stmt = ConexionDatasets::conectar()->prepare("SELECT * FROM audios WHERE $item = :$item");
            $stmt->bindParam(":" . $item, $valor, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll();
        } else {
            $stmt = ConexionDatasets::conectar()->prepare("SELECT * FROM audios");
            $stmt->execute();
            return $stmt->fetchAll();
        }
        $stmt->close();
        $stmt = null;
    }

    static public function mdlVerUltimoAudio($id_datasets){
        // Obtener el último archivo_audio ordenado por ID de forma descendente
        $stmt = ConexionDatasets::conectar()->prepare("SELECT archivo_audio FROM audios WHERE base_datos_id = :id ORDER BY id DESC LIMIT 1");
        $stmt->bindParam(":id", $id_datasets, PDO::PARAM_INT);
        $stmt->execute();
        $lastAudio = $stmt->fetchColumn();

        // Determinar el número consecutivo
        if ($lastAudio) {
            // Extraer el número del archivo actual usando una expresión regular
            preg_match('/audio_(\d+)\.wav$/', $lastAudio, $matches);
            $lastNumber = isset($matches[1]) ? (int)$matches[1] : 0;

            return $lastNumber;
        } else {
            // Si no hay registros en la base de datos, empezar desde 0
            return 0;
        }

        $stmt->close();
        $stmt = null;
    }

    static public function mdlVertexto($item, $valor)
    {
        if ($item != null) {
            $stmt = ConexionDatasets::conectar()->prepare("SELECT * FROM textos_dispo WHERE $item = :$item");
            $stmt->bindParam(":" . $item, $valor, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll();
        } else {
            $stmt = ConexionDatasets::conectar()->prepare("SELECT * FROM textos_dispo");
            $stmt->execute();
            return $stmt->fetchAll();
        }
        $stmt->close();
        $stmt = null;
    }

    static public function mdlValidartexto($item, $valor, $item2, $valor2)
    {
        if ($item != null) {
            $stmt = ConexionDatasets::conectar()->prepare("SELECT * FROM entradas_texto WHERE $item = :$item and $item2 = :$item2");
            $stmt->bindParam(":" . $item, $valor, PDO::PARAM_STR);
            $stmt->bindParam(":" . $item2, $valor2, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll();
        } else {
            $stmt = ConexionDatasets::conectar()->prepare("SELECT * FROM textos_dispo");
            $stmt->execute();
            return $stmt->fetchAll();
        }
        $stmt->close();
        $stmt = null;
    }

    static public function mdlSubirContenidoDatasets($data){
        if ($data != null) {

            $conn = ConexionDatasets::conectar(); // Obtén la conexión PDO
            $stmt = $conn->prepare("INSERT INTO audios (base_datos_id, archivo_audio) VALUES (:base_datos_id, :archivo_audio)");
            $stmt->bindParam(":base_datos_id", $data["id_datasets"], PDO::PARAM_INT);
            $stmt->bindParam(":archivo_audio", $data["destination"], PDO::PARAM_STR);

            if ($stmt->execute()) {
                $lastId = $conn->lastInsertId();

                $stmt = $conn->prepare("INSERT INTO entradas_texto (base_datos_id, contenido_id, id_audio) VALUES (:base_datos_id, :contenido_id, :id_audio)");
                $stmt->bindParam(":base_datos_id", $data["id_datasets"], PDO::PARAM_INT);
                $stmt->bindParam(":contenido_id", $data["contenido"], PDO::PARAM_STR);
                $stmt->bindParam(":id_audio", $lastId, PDO::PARAM_INT);

                if ($stmt->execute()) {
                    return "OK";
                } else {
                    return "ERROR";
                }
                $stmt->close();
                $stmt = null;
                
            } else {
                return "ERROR";
            }
        } else {
            return "ERROR AL CARGAR EL ARCHIVO";
        }
        $stmt->close();
        $stmt = null;
    }
}