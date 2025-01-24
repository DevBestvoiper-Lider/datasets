<?php

use Firebase\JWT\JWT;

class ControllersUsuarios
{


    ################ INGRESAR USUARIO ################

    static public function ctrIngresoUsuario()
    {

        if (isset($_POST["ingUsuario"])) {

            if (preg_match('/^[-a-zA-Z0-9\s]+$/', $_POST["ingUsuario"])) {

                // $encrypt = crypt ($_POST["ingPassword"], '$2a$07$asxx54ahjppf45sd87a5a4dDDGsystemdev$');
                $tabla = "crm";
                $item = "usuario";
                $valor = $_POST["ingUsuario"];

                $respuesta = ModeloUsuarios::MdlMostrarUsuarios($tabla, $item, $valor);
                // Encriptar la contraseña ingresada con MD5
                $passwordMD5 = md5($_POST["ingPassword"]);

                if (@$respuesta["usuario"] == @$_POST["ingUsuario"] && @$respuesta["password"] == $passwordMD5) {

                    $_SESSION["id"] = $respuesta["id"];
                    $_SESSION["usuario"] = $respuesta["usuario"];
                    $_SESSION["perfil"] = $respuesta["perfil"];
                    $_SESSION["auth2"] = $respuesta["auth2"];
                    $_SESSION["tel"] = $respuesta["numtel"];
                    $_SESSION["nombre"] = $respuesta["nombre"];
                    $_SESSION["estadoUser"] = $respuesta["estadoUser"];
                    $_SESSION["AA"] = $respuesta["AA"];
                    $_SESSION["verAA"] = $respuesta["verAA"];
                    $_SESSION["DND"] = $respuesta["DND"];
                    $_SESSION["verDND"] = $respuesta["verDND"];
                    $_SESSION["agente"] = $respuesta["agente"];
                    $_SESSION["exten"] = $respuesta["exten"];
                    $_SESSION["pwd"] = $respuesta["password"];
                    $_SESSION["softphone"] = $respuesta["softphone"];
                    $_SESSION["bloqueo_pendientes"] = $respuesta["bloqueo_pendientes"];

                    $payload = [
                        "id" => $respuesta["id"],
                        "usuario" => $respuesta["usuario"],
                        "perfil" => $respuesta["perfil"]
                    ];

                    // Crear el token con expiración de 1 hora

                    // Retornar el token al frontend usando JavaScript
                    echo '<script> localStorage.setItem("jwt_token", "' . $token . '");';
                    if ($_SESSION["perfil"] === "Asesor") {
                        echo 'localStorage.setItem("bloqueo_pendientes", "' . $respuesta["bloqueo_pendientes"] . '");';
                    } else {
                        echo 'localStorage.removeItem("bloqueo_pendientes");';
                    }
                    
                    echo '</script>';
                    /*============ FECHA ULTIMO LOGIN ============*/

                    date_default_timezone_set('America/Bogota');

                    $nuevoToken = bin2hex(random_bytes(16));

                    $fecha = date('Y-m-d');
                    $hora = date('H:i:s');

                    $fechaactual = $fecha . ' ' . $hora;

                    $item1 = "ultimo_login";
                    $valor1 = $fechaactual;

                    $item2 = "id";
                    $valor2 = $respuesta["id"];

                    $ultimoLogin = ModeloUsuarios::mdlActualizarUsuario($tabla, $item1, $valor1, $item2, $valor2);

                    $_SESSION['token_sesion'] = $nuevoToken;

                    // Incluye la función para obtener la IP del cliente
                    function obtenerIPCliente()
                    {
                        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
                            $ip = $_SERVER['HTTP_CLIENT_IP'];
                        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                            $ipList = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
                            $ip = trim($ipList[0]);
                        } else {
                            $ip = $_SERVER['REMOTE_ADDR'];
                        }
                        return $ip;
                    }

                    $ip_actual = obtenerIPCliente();

                    $datos = array(
                        "token_sesion" => $nuevoToken,
                        "id" => $respuesta["id"],
                        "ultima_ip" => $ip_actual
                    );

                    $nuevotoken = ModeloUsuarios::mdlActualizarUsuarioSesion($datos);



                    if ($_SESSION['estadoUser'] == 3) {
                        echo '<script>
                    
                            swal.fire ({
                                icon: "error",
                                title: "Usuario Inactivo!",
                                showConfirmButton: true,
                                confirmButtonText: "cerrar",
                                closeOnConfirm: false
            
                            }).then((result)=>{
                                window.location = "dashboard";
                            
                            });
    
                        </script>';
                    } else {
                        if ($ultimoLogin = "ok") {

                            if ($_SESSION["auth2"] == "s") {
                                echo '<script>
                        
                                window.location = "views/modules/includes/tow-auth.php";
                                </script>';
                            } else {
                                $_SESSION["iniciarsession"] = "ok";

                                echo '<script>';
                                echo 'Swal.fire({
                                          icon: "success",
                                          title: "¡Bienvenido!",
                                          text: "¡Bienvenido!",
                                          confirmButtonText: "Aceptar"
                                      }).then((result) => {
                                          if (result.isConfirmed) {
                                              window.location.href = "create-datasets";
                                          }
                                      });';
                                echo '</script>';
                            }

                            if (!isset($_SESSION["usuario"]) || empty($_SESSION["usuario"] && $_SESSION["usuario"] === "Ingeniero")) {
                                $ctrllog = new ControllersCtrlLog();
                                $ctrllog::ctrInsertarTiempoSesion();
                            }
                        }
                    }
                } else {
                    echo '<script>
                    
                    swal.fire ({
                        icon: "error",
                        title: "¡ERROR! contraseña Y/O usuario incorrecto",
                        showConfirmButton: true,
                        confirmButtonText: "cerrar",
                        closeOnConfirm: false
    
                    }).then((result)=>{
                        window.location = "dashboard";
                    
                    });
    
                    </script>';
                }
            }
        }
    }

    // ################ CREAR USUARIO ################

    static public function ctrCrearUsuario()
    {
        if (isset($_POST["NewUser"])) {

            if (preg_match('/^[-a-zA-Z0-9]+$/', $_POST["NewUser"])) {

                //     ############ VALIDAR IMAGEN ############

                function generar_contraseña($longitud = 10)
                {
                    if ($longitud < 3) {
                        throw new Exception("La longitud debe ser al menos 3 para incluir una mayúscula, una minúscula y un número.");
                    }

                    $mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    $minusculas = 'abcdefghijklmnopqrstuvwxyz';
                    $numeros = '0123456789';

                    // Garantizar al menos un carácter de cada tipo
                    $contraseña = array(
                        $mayusculas[rand(0, strlen($mayusculas) - 1)],
                        $minusculas[rand(0, strlen($minusculas) - 1)],
                        $numeros[rand(0, strlen($numeros) - 1)]
                    );

                    // Caracteres restantes
                    $todo = $mayusculas . $minusculas . $numeros;
                    for ($i = 3; $i < $longitud; $i++) {
                        $contraseña[] = $todo[rand(0, strlen($todo) - 1)];
                    }

                    // Mezclar los caracteres
                    shuffle($contraseña);

                    return implode('', $contraseña);
                }

                function Crear_exten($secret)
                {

                    $ultimaExten = ModeloUsuarios::mdlVerUltimaExten();

                    $nueva_extension = ($ultimaExten) ? $ultimaExten + 1 : 101; // Empieza en 101 si no hay extensiones

                    $fullname = $_POST["NewuserName"] . " " . $_POST["NewuserLastname"];

                    $datosext = array(
                        "name" => $nueva_extension,
                        "fullname" => $fullname,
                        "callerid" => $fullname . " <" . $nueva_extension . ">",
                        "mailbox" => $nueva_extension,
                        "type" => "friend",
                        "context" => "COLOMBIA",
                        "host" => "dynamic",
                        "secret" => $secret
                    );

                    $rescrear = ModeloUsuarios::mdlCrearExtension($datosext);

                    $res = array(
                        "rescrear" => $rescrear,
                        "exten" => $nueva_extension
                    );

                    return $res;
                }


                $password = generar_contraseña(10);

                // Aplicar MD5 a la contraseña generada

                $encrypt = md5($password);

                $rescrearexten = Crear_exten($encrypt);

                $NombreCompleto = $_POST["NewuserName"] . " " . $_POST["NewuserLastname"];

                if (isset($rescrearexten["rescrear"]) && $rescrearexten["rescrear"] == "ok") {

                    $exten = $rescrearexten["exten"];


                    if ($exten != "" && $NombreCompleto != "") {
                        $membername = $NombreCompleto;
                        $interface = "Agent/" . $exten;
                        $interno = $exten;

                        $datosagent = array(
                            "membername" => $membername,
                            "interface" => $interface,
                            "interno" => $interno,
                            "paused" => 1
                        );
                    } else {
                        $datosagent = array(
                            "membername" => "undefined",
                            "interface" => "undefined",
                            "interno" => "undefined",
                            "paused" => 1
                        );
                    }

                    $resagent = ModeloUsuarios::mdlCrearAgente($datosagent);

                    if ($resagent == "ok") {
                        $datos = array(
                            "nombre" => $NombreCompleto,
                            "usuario" => $_POST["NewUser"],
                            "password" => $encrypt,
                            "agente" => $interface,
                            "perfil" => $_POST["NewRole"],
                            "numtel" => $_POST["NewuserContact"],
                            "correo" => $_POST["NewuserEmail"],
                            "owned_by" => $_SESSION["usuario"],
                            "exten" => $exten,
                        );
                    }
                } else {
                    echo "no se creo el archivo. " . $rescrearexten["rescrear"];
                }
                $tabla = "crm";

                $res = ModeloUsuarios::mdlIngresarUsuario($tabla, $datos);

                if ($res == "ok") {

                    $usuariopopup = $_POST["NewUser"];
                    $res2 = ModeloUsuarios::mdlUserPopup($usuariopopup, $exten);
                    $res3 = ModeloUsuarios::mdlUserGestionCRM($usuariopopup, $exten, $interface);
                    $res4 = ModeloUsuarios::mdlAñadirExtaAsterisk($exten);
                    $res4 = ModeloUsuarios::mdlAñadirExtaContnumerico($exten);
                    $res5 = ModeloUsuarios::mdlReloadAsterisk();

                    $token = $res['token'];
                    error_log($token);

                    echo '<script>
                        localStorage.setItem("jwt_token", "' . $token . '");
                    </script>';

                    // echo '<script>
                    //     swal.fire({
                    //         icon: "success",
                    //         title: "¡Usuario creado!",
                    //         showConfirmButton: true,
                    //         confirmButtonText: "cerrar",
                    //         closeOnConfirm: false
                    //     }).then ((result)=>{
                    //         if(result.value){
                    //             window.location = "app-user-list";
                    //          }
                    //     });

                    // </script>';


                    // Datos a enviar
                    $to = $_POST["NewuserEmail"];
                    $Nombre = $_POST["NewuserName"] . " " . $_POST["NewuserLastname"];
                    $passwordsend = $password;
                    $NewUser = $_POST["NewUser"];

                    // URL del endpoint
                    $url = "http://localhost:3002/enviar-correo";

                    // Datos del cuerpo de la solicitud
                    $data = array(
                        "to" => $to,
                        "nombre" => $Nombre,
                        "password" => $passwordsend,
                        'user' => $NewUser
                    );

                    // Inicializar cURL
                    $ch = curl_init($url);

                    // Configurar opciones de cURL
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                        'Content-Type: application/json'
                    ));
                    curl_setopt($ch, CURLOPT_POST, true);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

                    // Ejecutar la solicitud y obtener la respuesta
                    $response = curl_exec($ch);

                    // Manejo de errores
                    if ($response === false) {
                        $error = curl_error($ch);
                        curl_close($ch);
                        die("Error: " . $error);
                    }

                    // Cerrar cURL
                    curl_close($ch);

                    // Mostrar la respuesta
                    echo $response;
                } else {
                    echo '<script>
                    
                        swal.fire({
                            icon: "error",
                            title: "¡No se pudo crear el usuario!",
                            showConfirmButton: true,
                            confirmButtonText: "cerrar",
                            closeOnConfirm: false

                        }).then ((result)=>{

                            if(result.value){

                                window.location = "app-user-list";
        
                             }
                        });
                    
                    </script>';
                }
            } else {
                echo '<script>
                    
                        swal.fire({
                            icon: "error",
                            title: "¡El usuario no puede ir vacio o llevar caracteres especiales!",
                            showConfirmButton: true,
                            confirmButtonText: "cerrar",
                            closeOnConfirm: false

                        }).then ((result)=>{

                            if(result.value){

                                window.location = "app-user-list";
        
                             }
                        });
                    
                    </script>';
            }
        }
    }

    /********** BORRAR USUARIO **********/

    static public function ctrBorrarUsuario($valor)
    {

        if (isset($valor)) {

            $tabla = "crm";

            $respuesta = ModeloUsuarios::mdlBorrarUsuario($tabla, $valor);

            if ($respuesta == "ok") {
                return "ok";
            }
        }
    }


    ################ MOSTRAR USUARIO ################


    static public function ctrMostrarUsuarios($item, $valor)
    {

        $tabla = "crm";

        $respuesta = ModeloUsuarios::MdlMostrarUsuarios($tabla, $item, $valor);

        return $respuesta;
    }

    static public function ctrActualizarUsuario($item1, $valor1, $item2, $valor2)
    {
        $tabla = "crm";

        $respuesta = ModeloUsuarios::mdlActualizarUsuario($tabla, $item1, $valor1, $item2, $valor2);

        return $respuesta;
    }

    static public function updateEMBPOPUP($actionEMB, $user, $value)
    {
        if (isset($actionEMB) && $actionEMB == 1) {

            if ($value == 0) {
                $valuesend = "s";
            } else {
                $valuesend = "n";
            }

            $respuesta = ModeloUsuarios::MdlActualizarEMBPOPUP($user, $valuesend);
            return $respuesta;
        } else {

            $respuesta = ModeloUsuarios::MdlVerEMBPOPUP($user);
            return $respuesta;
        }
    }

    static public function updateAADND()
    {

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $button = $_POST['button'] ?? "";
        $state = $_POST['state'] ?? "";
        $id = $_SESSION["id"] ?? "";

        if (empty($button) || empty($state)) {
            error_log("Faltan parámetros para actualizar AA o DND.");
            return false; // Faltan parámetros, se cancela la actualización
        }

        $respuesta = ModeloUsuarios::MdlUpdateAADND($button, $state, $id);

        if ($respuesta) {
            $_SESSION[$button] = $state;
        }
        return $respuesta;
    }

    static public function getSipCredentials()
    {

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $sipCredentials = [
            'exten' => $_SESSION["exten"] ?? "",
            'pwd' => $_SESSION["pwd"] ?? "",
            'name' => $_SESSION["nombre"] ?? "",
        ];

        return $sipCredentials;
    }



    ################ EDITAR USUARIO ################


    // static public function ctrEditarUsuario()
    // {

    //     if (isset($_POST["editarUsuario"])) {

    //         if (preg_match('/^[-a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ ]+$/', $_POST["editarNombre"])) {

    //             ############ VALIDAR IMAGEN ############
    //             $tabla = "usuariosreportscall";

    //             if ($_POST["editarPassword"] != "") {

    //                 if (preg_match('/^[-a-zA-Z0-9]+$/', $_POST["editarPassword"])) {
    //                     $encrypt = crypt($_POST["editarPassword"], '$2a$07$asxx54ahjppf45sd87a5a4dDDGsystemdev$');
    //                 } else {

    //                     echo '<script>

    //                             swal.fire({
    //                                 icon: "error",
    //                                 title: "¡La contraseña no puede ir vacia o llevar caracteres especiales!",
    //                                 showConfirmButton: true,
    //                                 confirmButtonText: "cerrar",
    //                                 closeOnConfirm: false
    //                             }).then ((result)=>{
    //                                 if(result.value){
    //                                     window.location = "usuarios";
    //                                 }
    //                             });

    //                         </script>';
    //                 }
    //             } else {
    //                 $encrypt =  $_POST["passwordActual"];
    //             }

    //             $datos = array(
    //                 "nombre" => $_POST["editarNombre"],
    //                 "usuario" => $_POST["editarUsuario"],
    //                 "password" => $encrypt,
    //                 "perfil" => $_POST["editarPerfil"],
    //                 "foto" => $ruta
    //             );

    //             $respuesta = ModeloUsuarios::MdlEditarUsuario($tabla, $datos);

    //             if ($respuesta == "ok") {
    //                 echo '
    //                     <script>

    //                         swal.fire({
    //                             icon: "success",
    //                             title: "¡Usuario editado Correctamente!",
    //                             showConfirmButton: true,
    //                             confirmButtonText: "cerrar",
    //                             closeOnConfirm: false
    //                         }).then ((result)=>{
    //                             if(result.value){
    //                                 window.location = "usuarios";
    //                             }
    //                         });
    //                 </script>';
    //             }
    //         } else {
    //             echo '<script>

    //                     swal.fire({
    //                         icon: "error",
    //                         title: "¡El nombre no puede ir vacio o llevar caracteres especiales!",
    //                         showConfirmButton: true,
    //                         confirmButtonText: "cerrar",
    //                         closeOnConfirm: false
    //                     }).then ((result)=>{
    //                         if(result.value){
    //                             window.location = "usuarios";

    //                          }
    //                     });
    //                  </script>';
    //         }
    //     }
    // }


    static public function ctrAction($action, $params = [])
    {
        switch ($action) {
            case 'updateAADND':
                $response = self::updateAADND();
                echo json_encode($response);
            case 'getSipCredentials':
                $response = self::getSipCredentials();
                echo json_encode($response);
        }
    }
}
if (isset($_POST['action'])) {
    require_once getenv('PROJECT_ROOT') . '/models/usuarios.models.php';
    ControllersUsuarios::ctrAction($_POST['action']);
}
