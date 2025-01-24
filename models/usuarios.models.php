
<?php

require_once 'conexion.php';

class ModeloUsuarios
{
    static public function MdlMostrarUsuarios($tabla, $item, $valor)
    {
        if ($item != null) {
            $stmt = ConexionUsers::conectar()->prepare("SELECT * FROM $tabla WHERE $item = :$item");

            $stmt->bindParam(":" . $item, $valor, PDO::PARAM_STR);

            $stmt->execute();
            return $stmt->fetch();
        } else {

            $stmt = ConexionUsers::conectar()->prepare("SELECT * FROM $tabla");

            $stmt->execute();
            return $stmt->fetchAll();
        }
        $stmt->close();
        $stmt = null;
    }

    static public function mdlVerUltimaExten(){

        // Consulta para obtener la última extensión asignada
        $stmt = ConexionAsterisk::conectar()->query("SELECT MAX(name) AS ultima_extension FROM sip_table");
        $ultima_extension = $stmt->fetch(PDO::FETCH_ASSOC)['ultima_extension'];

        return $ultima_extension;

    }

    static public function validarSesion($usuarioId, $tokenSesion) {
    
        $stmt = ConexionUsers::conectar()->prepare("
        SELECT token_sesion FROM crm
        WHERE id = :id
        ");
        $stmt->execute(['id' => $usuarioId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Agregar depuración para analizar valores
        if ($user === false) {
            error_log("Usuario no encontrado para id: $usuarioId");
            return false; // Usuario no encontrado
        }

        if ($user['token_sesion'] === $tokenSesion) {
            return true; // Sesión válida
        }

        error_log("Token actual: {$user['token_sesion']}, Token recibido: $tokenSesion");
        return false; // Token no coincide
    }

    static public function mdlCrearExtension($datos) {

        $db = ConexionAsterisk::conectar();

        $stmt = $db->prepare("INSERT INTO sip_table (name, fullname, type, callerid, context, host, mailbox, secret) VALUES (:name, :fullname, :type, :callerid, :context, :host, :mailbox, :secret)");
        $stmt ->bindParam(":name", $datos["name"], PDO::PARAM_STR);
        $stmt ->bindParam(":fullname", $datos["fullname"], PDO::PARAM_STR);
        $stmt ->bindParam(":type", $datos["type"], PDO::PARAM_STR);
        $stmt ->bindParam(":context", $datos["context"], PDO::PARAM_STR);
        $stmt ->bindParam(":host", $datos["host"], PDO::PARAM_STR);
        $stmt ->bindParam(":secret", $datos["secret"], PDO::PARAM_STR);
        $stmt ->bindParam(":mailbox", $datos["mailbox"], PDO::PARAM_STR);
        $stmt ->bindParam(":callerid", $datos["callerid"], PDO::PARAM_STR);
        
        $exten = $datos["name"];

        function creararchivoexten($exten, $db) {
            // Mapeo de claves del array a las claves requeridas en el archivo final
            $map = [
                'type' => 'type',
                'context' => 'context',
                'disallow' => 'disallow',
                'allow' => 'allow',
                'dtmfmode' => 'dtmfmode',
                'qualify' => 'qualify',
                'secret' => 'secret',
                'subscribecontext' => 'subscribecontext',
                'mohinterpret' => 'mohinterpret',
                'callerid' => 'callerid',
                'host' => 'host',
                'canreinvite' => 'canreinvite',
                'allowtransfer' => 'transfer',
                'mailbox' => 'mailbox',
                'rtptimeout' => 'rtptimeout',
                'rtpholdtimeout' => 'rtpholdtimeout',
                'call-limit' => 'call-limit',
                'callgroup' => 'callgroup',
                'pickupgroup' => 'pickupgroup',
                'language' => 'language'
            ];
        
            // Parámetros adicionales con valores predeterminados
            $default_params = [
                'nat' => 'no', // Forzar NAT a 'no'
                'transport' => 'wss', // Forzar transporte a WSS
                'qualifyfreq' => '20', // Definir qualifyfreq aquí
                'encryption' => 'yes', // Forzar encryption a 'yes'
                'avpf' => 'yes',
                'icesupport' => 'yes',
                'force_avp' => 'yes',
                'rtcp_mux' => 'yes',
                'dtlsenable' => 'yes',
                'dtlsverify' => 'fingerprint',
                'dtlscertfile' => '/etc/asterisk/keys/asterisk-BestVoiper.crt',
                'dtlsprivatekey' => '/etc/asterisk/keys/asterisk-BestVoiper.key',
                'dtlssetup' => 'actpass',
                'rtptimeout' => '60',
                'rtpholdtimeout' => '300'
            ];
        
            // Consulta para obtener los datos de la base de datos
            $stmt2 = $db->prepare("SELECT * FROM sip_table WHERE name = :name");
            $stmt2->bindParam(":name", $exten, PDO::PARAM_STR);
            $stmt2->execute();
            $extension = $stmt2->fetchAll();
        
            foreach ($extension as $data) {
                $id = $data['name'];
                $archivo_contenido = "[" . $id . "]\n";
        
                // Procesar mapeo de parámetros
                foreach ($map as $key => $nombre_clave) {
                    if (isset($data[$key]) && !empty($data[$key])) {
                        $archivo_contenido .= $nombre_clave . "=" . $data[$key] . "\n";
                    }
                }
        
                // Forzar valores de 'nat', 'transport' y 'encryption'
                $archivo_contenido .= "nat=no\n";
                $archivo_contenido .= "transport=wss\n";
        
                // Agregar parámetros adicionales con valores por defecto
                foreach ($default_params as $key => $value) {
                    if (!isset($data[$key]) || empty($data[$key])) {
                        $archivo_contenido .= $key . "=" . $value . "\n";
                    }
                }
        
                // Ruta del archivo .conf
                $filename = getenv('PROJECT_ROOT') . '/extensiones/' . $exten . '.conf';
                file_put_contents($filename, $archivo_contenido);
        
                if (file_exists($filename)) {
                    return "ok";
                } else {
                    return "error";
                }
            }
        }        
        
        

        if ($stmt->execute()){
            $respuesta = creararchivoexten($exten, $db);

            if ($respuesta == "ok") {
                return $respuesta;
            } else {
                return "error";
            }
        }else {
            return "error";
        }

        $stmt -> close();
        $stmt = null;

    }

    static public function mdlUserPopup($usuariopopup, $exten){
        $db = ConexionGestionComercial::conectar();

        $stmt = $db->prepare("INSERT INTO popups_activos (usuario, interno) VALUES (:usuario, :interno)");
        $stmt ->bindParam(":usuario", $usuariopopup, PDO::PARAM_STR);
        $stmt ->bindParam(":interno", $exten, PDO::PARAM_STR);

        if ($stmt->execute()){
            return "ok";
        }else {
            return "error";
        }
        $stmt -> close();
        $stmt = null;


    }

    static public function mdlUserGestionCRM($usuariopopup, $exten, $agente) {
        $db = ConexionGestionComercial::conectar();

        $stmt = $db->prepare("INSERT INTO usuarios (usuario, interno, seleccion, agente) VALUES (:usuario, :interno, :seleccion, :agente)");
        $stmt ->bindParam(":usuario", $usuariopopup, PDO::PARAM_STR);
        $stmt ->bindParam(":interno", $exten, PDO::PARAM_STR);
        $stmt ->bindValue(":seleccion", "######A", PDO::PARAM_STR);
        $stmt ->bindParam(":agente", $agente, PDO::PARAM_STR);

        if ($stmt->execute()){
            return "ok";
        }else {
            return "error";
        }
        $stmt -> close();
        $stmt = null;

    }

    static public function mdlAñadirExtaContnumerico($exten) {
        $db = ConexionAsterisk::conectar();

        $stmt = $db->prepare("INSERT INTO contnumerico (id, contexto, descripcion, tipo) VALUES (:id, :contexto, :descripcion, :tipo)");
        $stmt ->bindParam(":id", $exten, PDO::PARAM_STR);
        $stmt ->bindValue(":contexto", "internos", PDO::PARAM_STR);
        $stmt ->bindValue(":descripcion", "por un Interno SIP.", PDO::PARAM_STR);
        $stmt ->bindValue(":tipo", "InternoSIP", PDO::PARAM_STR);

        if ($stmt->execute()) {
            error_log("insertamos datos en contnumerico");
            return "ok";
        } else {
            return "error";
        }
    }

    static public function mdlCrearAgente($datos) {
        try {

            $db = ConexionAsterisk::conectar();

            $stmt = $db->prepare("INSERT INTO queue_member_table (membername, interface, interno, paused) VALUES (:membername, :interface, :interno, :paused)");
            $stmt ->bindParam(":membername", $datos["membername"], PDO::PARAM_STR);
            $stmt ->bindParam(":interface", $datos["interface"], PDO::PARAM_STR);
            $stmt ->bindParam(":interno", $datos["interno"], PDO::PARAM_STR);
            $stmt ->bindParam(":paused", $datos["paused"], PDO::PARAM_INT);



            if ($stmt->execute()) {

                        
                // Consulta para obtener la última extensión asignada
                $stmt2 = $db->query("SELECT MAX(var_metric) AS ultima_var FROM ast_config WHERE filename = 'agents.conf'");

                if ($stmt2) {
                    $ultima_var = $stmt2->fetch(PDO::FETCH_ASSOC)['ultima_var'];
                    $nueva_var = ($ultima_var) ? $ultima_var + 1 : 1;
                } else {
                    // La consulta falló, maneja el error
                    echo "Error en la consulta.";
                }

                $var_val = $datos["interno"] . ",," . $datos["membername"];

                $stmt3 = $db->prepare("INSERT INTO ast_config (cat_metric, var_metric, commented, filename, category, var_name, var_val) VALUES (:cat_metric, :var_metric, :commented, :filename, :category, :var_name, :var_val)");
                // Vincular los valores usando bindValue para constantes
                $stmt3->bindValue(":cat_metric", 1, PDO::PARAM_INT);
                $stmt3->bindParam(":var_metric", $nueva_var, PDO::PARAM_INT); // Aquí sí usamos bindParam porque $nueva_var es una variable
                $stmt3->bindValue(":commented", 0, PDO::PARAM_INT);
                $stmt3->bindValue(":filename", "agents.conf", PDO::PARAM_STR);
                $stmt3->bindValue(":category", "agents", PDO::PARAM_STR);
                $stmt3->bindValue(":var_name", "agent", PDO::PARAM_STR);
                $stmt3->bindParam(":var_val", $var_val, PDO::PARAM_STR); // El valor es dinámico

                // Ejecutar y comprobar errores
                if ($stmt3->execute()) {
                                         // Preparar la consulta
                                         $query = "
                                         INSERT INTO incoming_ext (context, exten, priority, app, appdata, recibir)
                                         VALUES (:context, :exten, :priority, :app, :appdata, :recibir)
                                         ";
                 
                                         // Conexión a la base de datos
                                         $stmt4 = $db->prepare($query);
                 
                                         $exten =  $datos["interno"];
                 
                                         // Datos a insertar
                                         $data = [
                                         ':context' => 'users',
                                         ':exten' => $exten,
                                         ':priority' => 1,
                                         ':app' => 'Goto',
                                         ':appdata' => "sub-interno_call_monitor|$exten|1",
                                         ':recibir' => "s"
                                         ];
                 
                                         // Ejecutar la consulta
                                         if ($stmt4->execute($data)) {
                                             error_log("insertamos datos en incoming_ext");
                                             
                                            $contnumerico = self::mdlAñadirExtaContnumerico($exten);

                                            return $contnumerico;
                                         } else {
                                             return "error";
                                        }
                } else {
                    // Mostrar detalles del error si la consulta falla
                    $errorInfo = $stmt3->errorInfo();
                    return "Error: " . $errorInfo[2];
                }

            } else {
                return "false";
            }


        } catch (Exception $e) {
            // Capturar cualquier error y retornar falso
            return false;
        } finally {
            // Cerrar el statement y la conexión
            $stmt = null;
            $db = null;
        }
    }

    static public function mdlIngresarUsuario($tabla, $datos){

        $stmt = ConexionUsers::conectar()->prepare("INSERT INTO $tabla(nombre, usuario, password, perfil, numtel, correo, agente, owned_by, exten) VALUES (:nombre, :usuario, :password, :perfil, :numtel, :correo, :agente, :owned_by, :exten)");
        $stmt ->bindParam(":nombre", $datos["nombre"], PDO::PARAM_STR);
        $stmt ->bindParam(":usuario", $datos["usuario"], PDO::PARAM_STR);
        $stmt ->bindParam(":password", $datos["password"], PDO::PARAM_STR);
        $stmt ->bindParam(":perfil", $datos["perfil"], PDO::PARAM_STR);
        $stmt ->bindParam(":numtel", $datos["numtel"], PDO::PARAM_STR);
        $stmt ->bindParam(":correo", $datos["correo"], PDO::PARAM_STR);
        $stmt ->bindParam(":agente", $datos["agente"], PDO::PARAM_STR);
        $stmt ->bindParam(":owned_by", $datos["owned_by"], PDO::PARAM_STR);
        $stmt ->bindParam(":exten", $datos["exten"], PDO::PARAM_STR);

        if ($stmt->execute()){
            return "ok";
        }else {
            return "error";
        }
        $stmt -> close();
        $stmt = null;
    }


    static public function MdlUpdateAADND($button, $state, $id)
    {
        try {
            //$button representa AA o DND en la tabla crm
            //state representa 'A' O 'N'

            // Conexion a la base de datos
            $db = ConexionUsers::conectar();
            // Preparar la consulta de actualización
            $stmt = $db->prepare("UPDATE crm SET $button = :state WHERE id = :id");
            // Asignar el valor a la variable de estado, columna: AA O DND
            $stmt->bindParam(":state", $state, PDO::PARAM_STR);
            $stmt->bindParam(":id", $id, PDO::PARAM_STR);
    


            // Ejecutar la consulta y verificar si se actualizó correctamente
            if ($stmt->execute()) {
                return true; // Actualización exitosa
            } else {
                return false; // Falló la actualización
            }
    
        } catch (Exception $e) {
            // Capturar cualquier error y retornar falso
            return false;
        } finally {
            // Cerrar el statement y la conexión
            $stmt = null;
            $db = null;
        }
    }

    static public function MdlVerEMBPOPUP($user)
    {
        try {

            // Conexion a la base de datos
            $db = ConexionGestionComercial::conectar();

            // Preparar la consulta de actualización
            $stmt = $db->prepare("SELECT * FROM popups_activos WHERE usuario = :user");
            // Asignar el valor a la variable de estado, columna: AA O DND
            $stmt->bindParam(":user", $user, PDO::PARAM_STR);
    
            $stmt->execute();
            return $stmt->fetchAll();
    
        } catch (Exception $e) {
            // Capturar cualquier error y retornar falso
            return false;
        } finally {
            // Cerrar el statement y la conexión
            $stmt = null;
            $db = null;
        }
    }

    static public function MdlActualizarEMBPOPUP($user, $value){
        try {
            // Conexion a la base de datos
            $db = ConexionGestionComercial::conectar();

            // Preparar la consulta de actualización
            $stmt = $db->prepare("UPDATE popups_activos SET activo = :value WHERE usuario = :user");
            // Asignar el valor a la variable de estado, columna: AA O DND
            $stmt->bindParam(":value", $value, PDO::PARAM_STR);
            $stmt->bindParam(":user", $user, PDO::PARAM_STR);
    


            // Ejecutar la consulta y verificar si se actualizó correctamente
            if ($stmt->execute()) {
                return true; // Actualización exitosa
            } else {
                return false; // Falló la actualización
            }
    
        } catch (Exception $e) {
            // Capturar cualquier error y retornar falso
            return false;
        } finally {
            // Cerrar el statement y la conexión
            $stmt = null;
            $db = null;
        }
    }

    static public function GETextension($user)
    {
        try {

            if (isset($_POST["action"]) && $_POST["action"] == "GETextension") {

                $user = $_POST["user"];
                $json_data = json_encode($user);
                echo $json_data; // Cambia return a echo
                exit; // Asegúrate de detener la ejecución aquí
            }

            // // Conexion a la base de datos
            // $db = ConexionGestionComercial::conectar();

            // // Preparar la consulta de actualización
            // $stmt = $db->prepare("SELECT * FROM popups_activos WHERE usuario = :user");
            // // Asignar el valor a la variable de estado, columna: AA O DND
            // $stmt->bindParam(":user", $user, PDO::PARAM_STR);
    
            // $stmt->execute();
            // return $stmt->fetchAll();
    
        } catch (Exception $e) {
            // Capturar cualquier error y retornar falso
            return false;
        } finally {
            // Cerrar el statement y la conexión
            $stmt = null;
            $db = null;
        }
    }


    // static public function mdlEditarUsuario($tabla, $datos){




    //     $stmt = ConexionUsers::conectar()->prepare("UPDATE $tabla SET nombre= :nombre, password = :password, perfil = :perfil, foto = :foto WHERE usuario = :usuario");




    //     $stmt ->bindParam(":nombre", $datos["nombre"], PDO::PARAM_STR);

    //     $stmt ->bindParam(":usuario", $datos["usuario"], PDO::PARAM_STR);

    //     $stmt ->bindParam(":password", $datos["password"], PDO::PARAM_STR);

    //     $stmt ->bindParam(":perfil", $datos["perfil"], PDO::PARAM_STR);

    //     $stmt ->bindParam(":foto", $datos["foto"], PDO::PARAM_STR);




    //     if($stmt->execute()){




    //         return "ok";




    //     }else{




    //         return "error";




    //     }




    //     $stmt -> close();




    //     $stmt = null;




    // }




    /*********************************

     * ACTUALIZAR USUARIO

     ********************************/
    static public function mdlActualizarUsuario($tabla, $item1, $valor1, $item2, $valor2)
    {
        $stmt = ConexionUsers::conectar()->prepare("UPDATE $tabla SET $item1= :$item1 WHERE $item2 = :$item2");
        $stmt->bindParam(":" . $item1, $valor1, PDO::PARAM_STR);
        $stmt->bindParam(":" . $item2, $valor2, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return "ok";
        } else {
            return "error";
        }

        $stmt->close();
        $stmt = null;
    }
        /*********************************

     * ACTUALIZAR SESION

     ********************************/
    static public function mdlActualizarUsuarioSesion($datos)
    {
        $stmt = ConexionUsers::conectar()->prepare('UPDATE crm SET ultima_ip = :ultima_ip, token_sesion = :token_sesion, ultima_conexion = NOW() WHERE id = :id');
        $stmt->bindParam(":id", $datos["id"], PDO::PARAM_INT);
        $stmt->bindParam(":ultima_ip", $datos["ultima_ip"], PDO::PARAM_STR);
        $stmt->bindParam(":token_sesion", $datos["token_sesion"], PDO::PARAM_STR);

        if ($stmt->execute()) {
            return "ok";
        } else {
            return "error";
        }

        $stmt->close();
        $stmt = null;
    }
    /*********************************

    * BORRAR USUARIO

    ********************************/




    static public function mdlBorrarUsuario($tabla, $valor){
        $stmt = ConexionUsers::conectar()->prepare("DELETE FROM $tabla WHERE id = :id");
        $stmt -> bindParam(":id", $valor['IdUser'], PDO::PARAM_INT);

        if($stmt -> execute()){
            $idPattern = '%' . $valor['interno'] . '%'; // Añade los comodines de búsqueda
            $stmt2 = ConexionAsterisk::conectar()->prepare("DELETE FROM ast_config WHERE var_val LIKE :var_val");
            $stmt2->bindParam(":var_val", $idPattern, PDO::PARAM_STR);
            $stmt2->execute();

            if($stmt2 -> execute()){
                $stmt3 = ConexionAsterisk::conectar()->prepare("DELETE FROM sip_table WHERE name = :name");
                $stmt3 -> bindParam(":name", $valor['interno'], PDO::PARAM_INT);

                if($stmt3 -> execute()){

                    $stmt4 = ConexionAsterisk::conectar()->prepare("DELETE FROM queue_member_table WHERE interface = :interface");
                    $stmt4 -> bindParam(":interface", $valor['agente'], PDO::PARAM_STR);

                    if($stmt4 -> execute()){
                        $stmt5 = ConexionGestionComercial::conectar()->prepare("DELETE FROM popups_activos WHERE interno = :interno");
                        $stmt5 -> bindParam(":interno", $valor['interno'], PDO::PARAM_STR);
                        if($stmt5 -> execute()){

                            $stmt6 = ConexionGestionComercial::conectar()->prepare("DELETE FROM usuarios WHERE interno = :interno");
                            $stmt6 -> bindParam(":interno", $valor['interno'], PDO::PARAM_STR);

                            if($stmt6 -> execute()){
                                $filename = getenv('PROJECT_ROOT') . '/extensiones/' . $valor['interno'] . '.conf';

                                if (file_exists($filename)) {
                                    if (unlink($filename)) {
                                        echo "El archivo $filename se eliminó correctamente.";
                                    } else {
                                        echo "No se pudo eliminar el archivo $filename.";
                                    }
                                } else {
                                    echo "El archivo $filename no existe.";
                                }

                                return "ok";
                            }
                        }
                    }
                }
            }
        }else {
            return "error";
        }

        $stmt -> close();

        $stmt = null;
    }

    static public function mdlReloadAsterisk(){
        $asteriskDB = ConexionAsterisk::conectar();

        // Consulta SQL de inserción
        $sql = "
            INSERT INTO en_donde (fechahora, sector, param1, param2, ejecutado, toco, error_en, permisos, usuario, nodo)
            VALUES (:fechahora, :sector, :param1, :param2, :ejecutado, :toco, :error_en, :permisos, :usuario, :nodo)
        ";

        // Preparar la consulta
        $stmtAsterisk = $asteriskDB->prepare($sql);
        
        // Variables de ejemplo para los valores a insertar
        $fechahora = date("Y-m-d H:i:s"); // Formato de fecha y hora actual
        $sector = "APLICAR";
        $param1 = "Agts,Voice,IntSIP";
        $param2 = "";
        $ejecutado = "n";
        $toco = "Agts,Voice,IntSIP";
        $error_en = "";
        $permisos = "NO APLICA";
        $usuario = $_SESSION["usuario"];
        $nodo = 1;

        // Asignar parámetros
        $stmtAsterisk->bindParam(':fechahora', $fechahora, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':sector', $sector, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':param1', $param1, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':param2', $param2, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':ejecutado', $ejecutado, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':toco', $toco, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':error_en', $error_en, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':permisos', $permisos, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':usuario', $usuario, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':nodo', $nodo, PDO::PARAM_STR);

        // Ejecutar la consulta
        if ($stmtAsterisk->execute()) {
            error_log("guardado en donde");

        } else {
            // Captura el error y lo guarda en el log
            $errorInfo = $stmtAsterisk->errorInfo();
            error_log("Error al guardar en donde" . $errorInfo[2]);
        }
    }


    static public function mdlAñadirExtaAsterisk($exten){
        $asteriskDB = ConexionAsterisk::conectar();

        // Consulta SQL de inserción
        $sql = "
            INSERT INTO en_donde (fechahora, sector, param1, param2, ejecutado, toco, error_en, permisos, usuario, nodo)
            VALUES (:fechahora, :sector, :param1, :param2, :ejecutado, :toco, :error_en, :permisos, :usuario, :nodo)
        ";

        // Preparar la consulta
        $stmtAsterisk = $asteriskDB->prepare($sql);
        
        // Variables de ejemplo para los valores a insertar
        $fechahora = date("Y-m-d H:i:s"); // Formato de fecha y hora actual
        $sector = "INTM";
        $param1 = "sip";
        $param2 = $exten;
        $ejecutado = "n";
        $toco = "hints.conf\nincoming_ext.conf\nincoming_digital.conf\nincoming_voip.conf\n/etc/asterisk/pbx/default_voicemail.conf";
        $error_en = "";
        $permisos = "[PERMISOS] OK \n[PERMISOS] OK\n [PERMISOS] OK\n [PERMISOS] OK\n [PERMISOS] OK\n [PERMISOS] OK";
        $usuario = $_SESSION["usuario"];
        $nodo = 1;

        // Asignar parámetros
        $stmtAsterisk->bindParam(':fechahora', $fechahora, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':sector', $sector, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':param1', $param1, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':param2', $param2, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':ejecutado', $ejecutado, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':toco', $toco, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':error_en', $error_en, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':permisos', $permisos, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':usuario', $usuario, PDO::PARAM_STR);
        $stmtAsterisk->bindParam(':nodo', $nodo, PDO::PARAM_STR);

        // Ejecutar la consulta
        if ($stmtAsterisk->execute()) {
            error_log("guardado en donde");

        } else {
            // Captura el error y lo guarda en el log
            $errorInfo = $stmtAsterisk->errorInfo();
            error_log("Error al guardar en donde" . $errorInfo[2]);
        }
    }


    // /*********************************

    // * ACTUALIZAR CONTRASEÑA

    // ********************************/




    // static public function mdlActualizarPassword($tabla, $datos){




    //     $stmt = ConexionUsers::conectar()->prepare("UPDATE $tabla SET password = :password, estado = 0 WHERE usuario = :usuario");




    //     $stmt ->bindParam(":usuario", $datos["usuario"], PDO::PARAM_STR);

    //     $stmt ->bindParam(":password", $datos["password"], PDO::PARAM_STR);




    //     if($stmt->execute()){




    //         return "ok";




    //     }else{




    //         return "error";




    //     }




    //     $stmt -> close();




    //     $stmt = null;




    // }







}

ModeloUsuarios::GETextension("");