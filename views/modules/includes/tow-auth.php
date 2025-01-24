<?php session_start();
?>


<!doctype html>

<html lang="es" class="light-style layout-navbar-fixed layout-menu-fixed layout-compact" dir="ltr" data-theme="theme-default" data-assets-path="../../../assets/" data-template="vertical-menu-template">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />

  <title>Bestcallcenter PRO - PBX</title>

  <meta name="description" content="" />

  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="../../../assets/img/favicon/LOGOBESTVOIPER.png" />

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />

  <!-- Icons -->
  <link rel="stylesheet" href="../../../assets/vendor/fonts/boxicons.css" />
  <link rel="stylesheet" href="../../../assets/vendor/fonts/fontawesome.css" />
  <link rel="stylesheet" href="../../../assets/vendor/fonts/flag-icons.css" />

  <!-- Core CSS -->
  <link rel="stylesheet" href="../../../assets/vendor/css/rtl/core.css" class="template-customizer-core-css" />
  <link rel="stylesheet" href="../../../assets/vendor/css/rtl/theme-default.css" class="template-customizer-theme-css" />
  <link rel="stylesheet" href="../../../assets/css/demo.css" />

  <!-- Vendors CSS -->
  <link rel="stylesheet" href="../../../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
  <link rel="stylesheet" href="../../../assets/vendor/libs/typeahead-js/typeahead.css" />
  <link rel="stylesheet" href="../../../assets/vendor/libs/apex-charts/apex-charts.css" />
  <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.10.5/dist/sweetalert2.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../../../assets/vendor/libs/bootstrap-maxlength/bootstrap-maxlength.css" />

  <!-- Cargar el estilo de CodeMirror con tema 'dracula' -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/theme/dracula.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/codemirror.min.css">
  <!-- Cargar el script principal de CodeMirror -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/codemirror.min.js"></script>
  <!-- Cargar modos para varios lenguajes -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/mode/javascript/javascript.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/mode/php/php.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/mode/python/python.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/mode/perl/perl.min.js"></script>

  <!-- Cargar addons para resaltar paréntesis y otros elementos -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/addon/edit/matchbrackets.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/addon/edit/closebrackets.min.js"></script>


  <!-- Vendor -->
  <link rel="stylesheet" href="../../../assets/vendor/libs/@form-validation/form-validation.css" />

  <!-- Page CSS -->
  <!-- Page -->
  <link rel="stylesheet" href="../../../assets/vendor/css/pages/page-auth.css" />
  <link rel="stylesheet" href="../../../assets/vendor/css/pages/app-chat.css" />

  <!-- Page CSS -->

  <!-- Helpers -->
  <script src="../../../assets/vendor/js/helpers.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.10.5/dist/sweetalert2.all.min.js"></script>

  <!--? Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.  -->
  <script src="../../../assets/js/config.js"></script>
</head>

<body>


  <?php

  // Función para generar un código OTP de 6 dígitos
  function generarCodigoOTP()
  {
    return sprintf('%06d', mt_rand(0, 999999));
  }

  $numeroCliente = $_SESSION["tel"];

  // Función para enviar el código por SMS (simulación)
  function enviarCodigoPorSMS($numeroCliente, $codigo)
  {
    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => 'https://dashboard.360nrs.com/api/rest/sms',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS => '{
        "to": ["57' . $numeroCliente . '"],
        "from": "TEST",
        "message": "' . $codigo . '"
      }',
      CURLOPT_HTTPHEADER => array(
        'Content-Type: application/json',
        'Authorization: Basic YmVzdHZvaXBlcjM2MDpmZVNNdzhOdA=='
      ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    echo $response;
  }

  // Obtener los últimos dos dígitos
  $ultimosDosDigitos = substr($numeroCliente, -4);

  // Verificar si ya se generó un código para este cliente en la sesión
  if (!isset($_SESSION['codigo_generado'])) {
    // Generar código OTP
    $codigoGenerado = generarCodigoOTP();

    // Almacenar el código en la sesión
    $_SESSION['codigo_generado'] = $codigoGenerado;

    // Simular envío de código por SMS
    enviarCodigoPorSMS($numeroCliente, $codigoGenerado);
  } else {
    // Si ya existe un código en la sesión, usar ese en lugar de generar uno nuevo
    $codigoGenerado = $_SESSION['codigo_generado'];
  }

  echo $codigoGenerado;

  // Verificar el código ingresado por el usuario (simulación)
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $concatenatedDigits = $_POST['digit1'] . $_POST['digit2'] . $_POST['digit3'] . $_POST['digit4'] . $_POST['digit5'] . $_POST['digit6'];
    $codigoIngresado = $concatenatedDigits; // Este valor se obtendría del formulario

    if (isset($_POST['reenviar'])) {
      if ($_POST['reenviar'] == 'reenviar') {
        // Limpiar el código almacenado en la sesión después de haber sido utilizado
        unset($_SESSION['codigo_generado']);
      }
    } else if ($codigoIngresado == $codigoGenerado) {
      // Aquí puedes realizar las acciones necesarias cuando el código es correcto
      $_SESSION["iniciarsession"] = "ok";

      echo '<script>';
      echo 'Swal.fire({
                icon: "success",
                title: "¡Código Aceptado!",
                text: "¡Bienvenido!",
                confirmButtonText: "Aceptar"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "../../../dashboard";
                }
            });';
      echo '</script>';

      // Limpiar el código almacenado en la sesión después de haber sido utilizado
      unset($_SESSION['codigo_generado']);
    } else {
      // Aquí puedes realizar las acciones necesarias cuando el código es incorrecto
      echo '<script>';
      echo 'Swal.fire({
                icon: "error",
                title: "¡Error! Código incorrecto",
                text: "Por favor, ingresa el código correctamente.",
                confirmButtonText: "Aceptar"
            });';
      echo '</script>';
    }
  }

  ?>

  <div class="authentication-wrapper authentication-basic px-4">
    <div class="authentication-inner">
      <!--  Two Steps Verification -->
      <div class="card">
        <div class="card-body">
          <!-- Logo -->
          <div class="app-brand justify-content-center">
            <a href="#" class="app-brand-link gap-2">
              <span class="app-brand-logo demo">
                <img src="../../../assets/img/favicon/LOGOBESTVOIPER.png" width="50">
              </span>
              <span class="app-brand-text demo text-body fw-bold">BestVoiper
              </span>
              <span>PBX</span>
            </a>
          </div>
          <!-- /Logo -->
          <h4 class="mb-2">Verificacion en dos pasos 💬</h4>
          <p class="text-start mb-4">
            Te enviamos un código de verificación a tu móvil. Introduce el código del móvil en el campo de abajo.
            <span class="fw-medium d-block mt-2">+57 ******<?php echo $ultimosDosDigitos; ?></span>
          </p>
          <p class="mb-0 fw-medium">Escribe tu código de seguridad de 6 dígitos</p>
          <!-- Tu formulario HTML con campos de entrada -->
          <!-- Tu formulario HTML con campos de entrada -->
          <form id="twoStepsForm" method="POST">
            <div class="auth-input-wrapper d-flex align-items-center justify-content-sm-between numeral-mask-wrapper">
              <input type="tel" name="digit1" class="form-control auth-input h-px-50 text-center numeral-mask mx-1 my-2" maxlength="1" autofocus />
              <input type="tel" name="digit2" class="form-control auth-input h-px-50 text-center numeral-mask mx-1 my-2" maxlength="1" />
              <input type="tel" name="digit3" class="form-control auth-input h-px-50 text-center numeral-mask mx-1 my-2" maxlength="1" />
              <input type="tel" name="digit4" class="form-control auth-input h-px-50 text-center numeral-mask mx-1 my-2" maxlength="1" />
              <input type="tel" name="digit5" class="form-control auth-input h-px-50 text-center numeral-mask mx-1 my-2" maxlength="1" />
              <input type="tel" name="digit6" class="form-control auth-input h-px-50 text-center numeral-mask mx-1 my-2" maxlength="1" />
            </div>
            <button id="verificarBtn" class="btn btn-primary d-grid w-100 mb-3">Verificar</button>
            <!-- Botón para volver a enviar el código -->
            <button id="reenviarBtn" class="btn btn-secondary d-grid w-100 mb-3" name="reenviar" value="reenviar" disabled>Volver a enviar código <span id="contador"></span></button>
          </form>
        </div>
      </div>
      <!-- / Two Steps Verification -->
    </div>
  </div>

  <!-- / Content -->
  <script>
    // Temporizador de 30 segundos para habilitar el botón de reenvío
    var segundosRestantes = 30;

    function actualizarContador() {
      document.getElementById('contador').textContent = segundosRestantes + ' seg';
    }

    // Función para contar el tiempo restante y habilitar el botón de reenvío
    function iniciarContador() {
      var contadorInterval = setInterval(function() {
        segundosRestantes--;
        if (segundosRestantes <= 0) {
          clearInterval(contadorInterval);
          document.getElementById('reenviarBtn').removeAttribute('disabled');
          document.getElementById('contador').textContent = '';
        } else {
          actualizarContador();
        }
      }, 1000);
    }

    // Iniciar el contador cuando se carga la página
    window.onload = function() {
      iniciarContador();
    };
  </script>


  <script src="../../../assets/vendor/libs/jquery/jquery.js"></script>
  <script src="../../../assets/vendor/libs/popper/popper.js"></script>
  <script src="../../../assets/vendor/js/bootstrap.js"></script>
  <script src="../../../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>
  <script src="../../../assets/vendor/libs/hammer/hammer.js"></script>
  <script src="../../../assets/vendor/libs/i18n/i18n.js"></script>
  <script src="../../../assets/vendor/libs/typeahead-js/typeahead.js"></script>
  <script src="../../../assets/vendor/js/menu.js"></script>
  <script src="../../../views/js/chats.js"></script>

  <!-- endbuild -->

  <!-- Vendors JS -->
  <script src="../../../assets/vendor/libs/apex-charts/apexcharts.js"></script>
  <script src="../../../assets/vendor/libs/bootstrap-maxlength/bootstrap-maxlength.js"></script>

  <!-- Main JS -->
  <script src="../../../assets/js/main.js"></script>

  <!-- Page JS -->
  <script src="../../../assets/js/dashboards-analytics.js"></script>

  <!-- Page JS -->
  <script src="../../../assets/js/pages-auth.js"></script>
  <script src="../../../assets/js/pages-auth-two-steps.js"></script>
</body>

</html>