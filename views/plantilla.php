<?php
session_start();
?>


<!doctype html>

<html lang="es" class="light-style layout-navbar-fixed layout-menu-fixed layout-compact" dir="ltr"
  data-theme="theme-default" data-assets-path="assets/" data-template="vertical-menu-template">

<head>
  <meta charset="utf-8" />
  <meta name="viewport"
    content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />

  <title>Bestcallcenter PRO - PBX</title>

  <meta name="description" content="" />

  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="assets/img/favicon/LOGOBESTVOIPER.png" />

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
    rel="stylesheet" />

  <!-- Icons -->
  <link rel="stylesheet" href="assets/vendor/fonts/boxicons.css" />
  <link rel="stylesheet" href="assets/vendor/fonts/fontawesome.css" />
  <link rel="stylesheet" href="assets/vendor/fonts/flag-icons.css" />

  <!-- Core CSS -->
  <link rel="stylesheet" href="assets/vendor/css/rtl/core.css" class="template-customizer-core-css" />
  <link rel="stylesheet" href="assets/vendor/css/rtl/theme-default.css" class="template-customizer-theme-css" />
  <link rel="stylesheet" href="assets/css/demo.css?v=<?= filemtime('assets/css/demo.css'); ?>" />
  <link rel="stylesheet" href="assets/css/crm.css?v=<?= filemtime('assets/css/crm.css'); ?>" />
  <link rel="stylesheet" href="assets/phone/css/diagnostic.css?v=<?= filemtime('assets/phone/css/diagnostic.css'); ?>"
    type="text/css">
  <link rel="stylesheet" href="assets/phone/css/agents.css?v=<?= filemtime('assets/phone/css/agents.css'); ?>"
    type="text/css">
  <link rel="stylesheet" href="assets/phone/css/chat.css?v=<?= filemtime('assets/phone/css/chat.css'); ?>"
    type="text/css">
  <?php if (isset($_GET["ruta"])) { ?>
    <?php if ($_GET["ruta"] == "recordings") { ?>
      <!--Recordings report-->
      <link rel="stylesheet" href="assets/css/recording.css?v=<?= filemtime('assets/css/recording.css'); ?>" />

    <?php } else if ($_GET["ruta"] == "estados") { ?>
        <link rel="stylesheet" href="assets/css/system-info.css?v=<?= filemtime('assets/css/system-info.css'); ?>" />
    <?php } else if ($_GET["ruta"] == "ivrs") { ?>

          <script src="assets/ivr/dist/drawflow.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/js/all.min.js"
            integrity="sha256-KzZiKy0DWYsnwMF+X1DvQngQ2/FxF7MF3Ff72XcpuPs=" crossorigin="anonymous"></script>
          <link rel="stylesheet" type="text/css" href="assets/ivr/docs/menu.css" />
          <link rel="stylesheet" type="text/css" href="assets/ivr/src/drawflow.css" />
          <link rel="stylesheet" type="text/css" href="assets/ivr/docs/beautiful.css" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css"
            integrity="sha256-h20CPZ0QyXlBuAw7A+KluUYx/3pK+c7lYEpqLTlxjYQ=" crossorigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
          <script src="https://unpkg.com/micromodal/dist/micromodal.min.js"></script>



    <?php }
  } ?>

  <!-- Core CSS -->

  <!-- Vendors CSS -->
  <link rel="stylesheet" href="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
  <link rel="stylesheet" href="assets/vendor/libs/typeahead-js/typeahead.css" />
  <link rel="stylesheet" href="assets/vendor/libs/apex-charts/apex-charts.css" />
  <link href="assets/vendor/css/sweetalert2.min.css" rel="stylesheet">
  <link rel="stylesheet" href="assets/vendor/libs/bootstrap-maxlength/bootstrap-maxlength.css" />

  <!-- socket.io -->
  <script src="assets/vendor/js/socket.io.min.js"></script>
  <!-- <script src="https://cdn.jsdelivr.net/npm/simple-peer@latest/simplepeer.min.js"> -->


  <!-- Vendors CSS -->
  <link rel="stylesheet" href="assets/vendor/libs/datatables-bs5/datatables.bootstrap5.css" />
  <link rel="stylesheet" href="assets/vendor/libs/datatables-responsive-bs5/responsive.bootstrap5.css" />
  <link rel="stylesheet" href="assets/vendor/libs/datatables-buttons-bs5/buttons.bootstrap5.css" />
  <link rel="stylesheet" href="assets/vendor/libs/select2/select2.css" />
  <link rel="stylesheet" href="assets/vendor/libs/@form-validation/form-validation.css" />
  <link rel="stylesheet" href="assets/vendor/libs/bootstrap-select/bootstrap-select.css" />
  <link rel="stylesheet" href="assets/vendor/libs/flatpickr/flatpickr.css" />
  <link rel="stylesheet" href="assets/vendor/libs/bootstrap-datepicker/bootstrap-datepicker.css" />
  <link rel="stylesheet" href="assets/vendor/libs/bootstrap-daterangepicker/bootstrap-daterangepicker.css" />
  <link rel="stylesheet" href="assets/vendor/libs/jquery-timepicker/jquery-timepicker.css" />
  <link rel="stylesheet" href="assets/vendor/libs/quill/typography.css" />
  <link rel="stylesheet" href="assets/vendor/libs/quill/katex.css" />
  <link rel="stylesheet" href="assets/vendor/libs/quill/editor.css" />

  <link rel="stylesheet" href="assets/vendor/libs/pickr/pickr-themes.css" />
  <script src="assets/vendor/js/jszip.min.js"></script>
  <!-- Page CSS -->
  <!-- Page -->
  <link rel="stylesheet" href="assets/vendor/css/pages/page-auth.css" />
  <link rel="stylesheet" href="assets/vendor/css/pages/app-chat.css" />


  <?php

  if (isset($_SESSION["perfil"])) {
    if ($_SESSION["perfil"] == "Asesor") { ?>

      <!-- Page CSS -->
      <!--PHONE-->
      <link rel="stylesheet" href="assets/phone/css/libs/font-awesome-6.min.css">
      <link rel="stylesheet" href="assets/phone/css/style.css?v=<?= filemtime('assets/phone/css/style.css'); ?>"
        type="text/css">
      <link rel="stylesheet" href="assets/phone/css/microphone.css?v=<?= filemtime('assets/phone/css/microphone.css'); ?>"
        type="text/css">
      <link rel="stylesheet" href="assets/phone/css/preview.css?v=<?= filemtime('assets/phone/css/preview.css'); ?>"
        type="text/css">
      <link rel="stylesheet" href="assets/phone/css/incomming.css?v=<?= filemtime('assets/phone/css/incomming.css'); ?>"
        type="text/css">
      <!--end PHONE-->

    <?php }
  } ?>
  <!-- Row Group CSS -->
  <link rel="stylesheet" href="assets/vendor/libs/datatables-rowgroup-bs5/rowgroup.bootstrap5.css" />
  <link rel="stylesheet" href="assets/vendor/libs/datatables-checkboxes-jquery/datatables.checkboxes.css" />
  <link rel="stylesheet" href="assets/vendor/libs/bs-stepper/bs-stepper.css" />


  <!-- Flatpickr -->
  <link rel="stylesheet" href="assets/vendor/css/flatpickr.min.css" />
  <!-- end Actividad callcenter -->
  <?php if (isset($_GET["ruta"])) { ?>
    <link rel="stylesheet" href="assets/vendor/css/plyr.css" />
  <?php } ?>

  <!-- <script
    src="https://js.sentry-cdn.com/8c926738e7f3bbe0c06984984cee021b.min.js"
    crossorigin="anonymous"></script> -->
  <!-- Helpers -->
  <script src="assets/vendor/js/chart.js"></script>
  <script src="assets/vendor/js/helpers.js"></script>
  <script src="assets/vendor/js/sweetalert2.all.min.js"></script>

  <script src="assets/vendor/libs/jquery/jquery.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js" type="text/javascript">
  </script>
  <script src="assets/vendor/js/datatables.js"></script>

  <?php if (isset($_SESSION["iniciarsession"]) && $_SESSION["iniciarsession"] == "ok") { ?>
    <!--! Template customizer & Theme config files MUST be included after core stylesheets and helpers.js in the <head> section -->
    <!--? Template customizer: To hide customizer set displayCustomizer value false in config.js.  -->
    <script src="assets/vendor/js/template-customizer.js"></script>


  <?php } ?>

  <!--? Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.  -->
  <script src="assets/js/config.js?v=<?= filemtime('assets/js/config.js'); ?>"></script>

  <?php if (isset($_GET["ruta"]) and $_GET["ruta"] != "app-chat") { ?>

    <!-- <script src="assets/js/mostrardatos.js"></script> -->

  <?php } ?>
  <script src="assets/js/plantilla.js?v=<?= filemtime('assets/js/plantilla.js'); ?>"></script>

</head>

<body>

  <?php

  $nombre = (isset($_SESSION["nombre"]) ? $_SESSION["nombre"] : "");
  $usuario = (isset($_SESSION["usuario"]) ? $_SESSION["usuario"] : "");
  $perfil = (isset($_SESSION["perfil"]) ? $_SESSION["perfil"] : "");
  $softphone = (isset($_SESSION["softphone"]) ? $_SESSION["softphone"] : "");

  ?>

  <?php
  require_once 'sanitize.php'; //evita que se guarde un script en la base de datos
  $MAINBAR_ENV = getenv('MAINBAR_ENV');
  if (isset($_SESSION["iniciarsession"]) && $_SESSION["iniciarsession"] == "ok") { ?>


    <!-- <div id="loader-container">
      <div class="loader"></div>
    </div> -->

    <!-- Layout wrapper -->
    <div class="layout-wrapper layout-content-navbar">
      <div class="layout-container">
        <!-- Menu -->


        <?php
        switch ($MAINBAR_ENV) {
          case 'reports':
            include_once "modules/includes/mainbarReports.php";
            break;
          case 'dondoctor':
            include_once "modules/includes/mainbarDondoctor.php";
            break;
          case 'withoutchats':
            include_once "modules/includes/mainbarWithoutChats.php";
            break;
          default:
            include_once "modules/includes/mainbar.php";
            break;
        }
        ?>

        <!-- / Menu -->

        <!-- Layout container -->
        <div class="layout-page">
          <!-- Navbar -->
          <?php include_once "modules/includes/navbar.php"; ?>
          <!-- / Navbar -->
          <?php

          if (isset($_GET["ruta"])) {
            if ($_SESSION["perfil"] == "Ingeniero") {
              if (

                /* SECCION DE ARCHIVOS PARA CONFIGURACIONES */

                // $_GET["ruta"] == "archives-apis" ||
                $_GET["ruta"] == "create-datasets" ||
                $_GET["ruta"] == "ver-datasets" ||
                $_GET["ruta"] == "list-text" ||
                $_GET["ruta"] == "salir"
              ) {
                include "modules/" . $_GET["ruta"] . ".php";
              }

              /* SECCION DE ARCHIVOS PARA REPORTES */ else if (
                $_GET["ruta"] == "dashboard" ||
                $_GET["ruta"] == "actividadc" ||
                $_GET["ruta"] == "sms" ||
                $_GET["ruta"] == "recordings" ||
                $_GET["ruta"] == "did-records" ||
                $_GET["ruta"] == "wpp" ||
                $_GET["ruta"] == "blacklist" ||
                $_GET["ruta"] == "ctrllog" ||
                $_GET["ruta"] == "callsc" ||
                $_GET["ruta"] == "regespera" ||
                $_GET["ruta"] == "reportivr" ||
                $_GET["ruta"] == "estcall" ||
                $_GET["ruta"] == "crm" ||
                $_GET["ruta"] == "registrationcall" ||
                $_GET["ruta"] == "reportesChats" ||
                $_GET["ruta"] == "reportCallcenter" ||
                $_GET["ruta"] == "reportesChatsTwo"

              ) {
                include "modules/reports/" . $_GET["ruta"] . ".php";
              }

              /* SECCION DE ARCHIVOS PARA SISTEMAS */ else if (
                $_GET["ruta"] == "anti-hack" ||
                $_GET["ruta"] == "estados"
              ) {
                include "modules/sistemas/" . $_GET["ruta"] . ".php";
              }

              /* SECCION DE ARCHIVOS PARA GESTION COMERCIAL */ else if (
                $_GET["ruta"] == "camPersonalizados" ||
                $_GET["ruta"] == "tipificacion" ||
                $_GET["ruta"] == "entidadConfig" ||
                $_GET["ruta"] == "visualizaRegistro" ||
                $_GET["ruta"] == "usuarioConfig" ||
                $_GET["ruta"] == "tablas"
              ) {
                include "modules/GestionComercial/" . $_GET["ruta"] . ".php";
              }

              /* SECCION DE ARCHIVOS PARA SISTEMAS */ else if (
                $_GET["ruta"] == "ivrs"
              ) {
                include "modules/configuraciones/" . $_GET["ruta"] . ".php";
              } else {

                include "modules/404.php";
              }
            } else if ($_SESSION["perfil"] == "Asesor") {
              if (

                $_GET["ruta"] == "app-chat" ||
                $_GET["ruta"] == "app-crm" ||
                $_GET["ruta"] == "app-crm-pendientes" ||
                $_GET["ruta"] == "app-crm-salientes" ||
                $_GET["ruta"] == "app-crm-reportcallcenter" ||
                $_GET["ruta"] == "app-crm-visualizar-registro" ||
                $_GET["ruta"] == "phone" ||
                $_GET["ruta"] == "salir"
              ) {
                include "modules/" . $_GET["ruta"] . ".php";
              } else {
                $_GET["ruta"] == "app-crm" ||


                  include "modules/404.php";
              }
            }
          }


          ?>
        </div>

      </div>

      <?php if (isset($_SESSION["perfil"])) {
        if ($_SESSION["perfil"] === "Asesor") {
          include_once "modules/includes/footer.php";
        }
      } ?>

    </div>


    <!-- Overlay -->
    <div class="layout-overlay layout-menu-toggle"></div>
    <div class="drag-target"></div>
    </div>
  <?php } else { ?>

    <?php include_once "modules/auth-login.php"; ?>

  <?php } ?>
  <!-- GENERALES -->
  <script src="assets/vendor/libs/popper/popper.js"></script>
  <script src="assets/vendor/js/bootstrap.js"></script>
  <script src="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>
  <script src="assets/vendor/libs/hammer/hammer.js"></script>
  <script src="assets/vendor/libs/i18n/i18n.js"></script>
  <script src="assets/vendor/libs/typeahead-js/typeahead.js"></script>
  <script src="assets/vendor/js/menu.js"></script>


  <!-- Vendors JS -->
  <script src="assets/vendor/libs/moment/moment.js"></script>
  <script src="assets/vendor/libs/datatables-bs5/datatables-bootstrap5.js"></script>
  <script src="assets/vendor/libs/select2/select2.js"></script>
  <script src="assets/vendor/libs/@form-validation/popular.js"></script>
  <script src="assets/vendor/libs/@form-validation/bootstrap5.js"></script>
  <script src="assets/vendor/libs/@form-validation/auto-focus.js"></script>
  <script src="assets/vendor/libs/cleavejs/cleave.js"></script>
  <script src="assets/vendor/libs/cleavejs/cleave-phone.js"></script>
  <script src="assets/vendor/libs/bs-stepper/bs-stepper.js"></script>
  <script src="assets/vendor/libs/bootstrap-select/bootstrap-select.js"></script>
  <script src="assets/vendor/libs/flatpickr/flatpickr.js"></script>
  <script src="assets/vendor/libs/bootstrap-datepicker/bootstrap-datepicker.js"></script>
  <script src="assets/vendor/libs/bootstrap-daterangepicker/bootstrap-daterangepicker.js"></script>
  <script src="assets/vendor/libs/jquery-timepicker/jquery-timepicker.js"></script>
  <script src="assets/vendor/libs/pickr/pickr.js"></script>
  <script src="assets/vendor/libs/quill/katex.js"></script>
  <script src="assets/vendor/libs/quill/quill.js"></script>

  <?php if (isset($_GET["ruta"])) { ?>
    <?php if ($_GET["ruta"] == "app-crm" || $_GET["ruta"] == "app-crm-salientes") { ?>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/plugins/confirmDate/confirmDate.min.js">
      </script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/l10n/es.min.js"></script>
      <script src="assets/js/CRM/contact.js"></script>
    <?php }
  } ?>


  <!-- Main JS -->
  <script src="assets/js/main.js?v=<?= filemtime('assets/js/main.js'); ?>"></script>


  <!-- WPP SMS -->
  <?php
  if (isset($_GET["ruta"])) {
    $ruta = $_GET["ruta"];

    // Definir un array de rutas con sus respectivos scripts
    $scripts = [
     
      "list-text" => "assets/js/text-list.js",
      "ver-datasets" => "assets/js/ver-datasets-list.js",
      "create-datasets" => "assets/js/app-ecommerce-category-list.js",
      "createsms" => "assets/js/createsms.js",
      "createwpp" => "assets/js/createwpp.js",
      "blacklist" => "assets/js/reports/blacklist.js",
      "tipificacion" => "assets/js/tipificacion.js",
      "did-records" => "assets/js/reports/didRecords.js",
      "actividadc" => "assets/js/reports/actividadC.js",
      "registrationcall" => "assets/js/reports/registrationCall.js",
      "sms" => "assets/js/reports/sms.js",
      "wpp" => "assets/js/reports/whatsapp.js",
      "callsc" => "assets/js/reports/callsc.js",
      "reportCallCenter" => "assets/js/reports/reportCallCenter.js",
      "regespera" => "assets/js/reports/regespera.js",
      "reportivr" => "assets/js/reports/reportIvr.js",
      "ctrllog" => "assets/js/reports/ctrlLog.js",
      "ctrllog#pausas" => "assets/js/reports/ctrlLog.js",
      "camPersonalizados" => "assets/js/CRM/camPersonalizados.js",
      "tablas" => "assets/js/CRM/tableOperation.js",
      "visualizaRegistro" => "assets/js/CRM/visualizaRegistro.js",
      "app-crm-reportcallcenter" => "assets/js/CRM/crmReportCall.js",
      "app-crm-visualizar-registro" => "assets/js/CRM/asesorVisualizaRegistro.js",
      "usuarioConfig" => "assets/js/CRM/usuarioConfig.js",
      "ivrs" => "assets/ivr/src/draw.js",
      "app-crm-pendientes" => "assets/js/CRM/asesorPendientes.js",
      "app-crm" => "assets/js/CRM/asesorTypificationsBefore.js",
      "crm" => "assets/js/CRM/crmReporte/crmReports.js",
      "reportesChatsTwo" => "assets/js/reports/reportesChatsTwo.js",
    ];

    // Rutas especiales con múltiples scripts
    $specialScripts = [
      "estcall" => [
        "assets/js/reports/EstCall/index.js",
        "assets/js/reports/EstCall/exportEstcall.js",
        "assets/js/reports/EstCall/callReincidentes.js",
        "assets/js/reports/EstCall/distribucionLLamadasXmin.js"
      ]
    ];

    // Incluir scripts individuales
    if (array_key_exists($ruta, $scripts)) {
      $scriptPath = $scripts[$ruta];
      $version = filemtime($scriptPath);
      echo '<script src="' . $scriptPath . '?v=' . $version . '"></script>';
    }

    // Incluir scripts múltiples para rutas especiales
    if (array_key_exists($ruta, $specialScripts)) {
      foreach ($specialScripts[$ruta] as $script) {
        $version = filemtime($script);
        echo '<script src="' . $script . '?v=' . $version . '"></script>';
      }
    }
  }
  ?>
  <!--END REPORTS -->

  <!-- SCRIPTS POR SECCION -->
  <?php
  // Scripts comunes

  if (isset($_GET["ruta"])) {
    $ruta = $_GET["ruta"];

    // Definir un array con rutas mapeadas a sus respectivos scripts
    $scripts = [
      "recordings" => "assets/js/recordings.js",
      "app-chat" => [
        "assets/js/app-chat.js",
        "views/js/chats.js"
      ],
      "app-chats-Estados" => "assets/js/app-chat-estados.js",
      "app-user-list" => "assets/js/app-user-list.js",
      "entidad" => "assets/js/databases.js",
      "create-class" => "assets/js/create-class.js",
      "Callcenter-queues" => "assets/js/queues-list.js",
      "app-crm" => "assets/js/CRM/wizard.js",
      "app-crm-salientes" => "assets/js/CRM/wizardSalientes.js"
    ];

    // Incluir scripts individuales o múltiples
    if (array_key_exists($ruta, $scripts)) {
      if (is_array($scripts[$ruta])) {
        // Si hay múltiples scripts para una ruta
        foreach ($scripts[$ruta] as $script) {
          $version = filemtime($script);
          echo '<script src="' . $script . '?v=' . $version . '"></script>';
        }
      } else {
        // Para un solo script
        $version = filemtime($scripts[$ruta]);
        echo '<script src="' . $scripts[$ruta] . '?v=' . $version . '"></script>';
      }
    }
  }
  ?>

  <!-- SCRIPTS PARA SOFTPHONE -->
  <?php

  if (isset($_SESSION["perfil"])) {
    if ($_SESSION["perfil"] == "Asesor") { ?>
      <!--<script src="assets/js/sharewindow.js"></script>-->
      <script src="assets/phone/js/libs/popper-core.js"></script>
      <script src="assets/phone/js/libs/tippy.min.js"></script>
      <script src="assets/phone/js/libs/loglevel.min.js"></script>
      <script src="assets/vendor/js/RecordRTC.js"></script>
      <script src="assets/phone/js/libs/jssip-3.10.0.min.js"></script>
      <script src="assets/phone/js/preview-speaker.js?v=<?= filemtime('assets/phone/js/preview-speaker.js'); ?>" defer>
      </script>
      <script src="assets/phone/js/addStream.js?v=<?= filemtime('assets/phone/js/addStream.js'); ?>"></script>
      <script src="assets/phone/js/recordTimeLapse.js?v=<?= filemtime('assets/phone/js/recordTimeLapse.js'); ?>"></script>
      <script src="assets/phone/js/recording.js?v=<?= filemtime('assets/phone/js/recording.js'); ?>"></script>
      <script src="assets/phone/js/connectToWS.js?v=<?= filemtime('assets/phone/js/connectToWS.js'); ?>"></script>
      <script src="assets/phone/js/login.js?v=<?= filemtime('assets/phone/js/login.js'); ?>"></script>
      <script src="assets/phone/js/chat.js?v=<?= filemtime('assets/phone/js/chat.js'); ?>"></script>
      <script src="assets/phone/js/index.js?v=<?= filemtime('assets/phone/js/index.js'); ?>" defer></script>
      <script src="assets/phone/js/completeSession.js?v=<?= filemtime('assets/phone/js/completeSession.js'); ?>"></script>
      <script src="assets/phone/js/preview-mic.js?v=<?= filemtime('assets/phone/js/preview-mic.js'); ?>"></script>
      <script src="assets/phone/js/callDuration.js?v=<?= filemtime('assets/phone/js/callDuration.js'); ?>"></script>
      <script src="assets/phone/js/loadAudioFiles.js?v=<?= filemtime('assets/phone/js/loadAudioFiles.js'); ?>"></script>
      <script src="assets/phone/js/notificationApi.js?v=<?= filemtime('assets/phone/js/notificationApi.js'); ?>"></script>
      <script src="assets/phone/js/speaker.js?v=<?= filemtime('assets/phone/js/speaker.js'); ?>"></script>
      <script src="assets/phone/js/diagnostic.js?v=<?= filemtime('assets/phone/js/diagnostic.js'); ?>"></script>



    <?php } else { ?>
      <script src="assets/js/system-info.js?v=<?= filemtime('assets/js/system-info.js'); ?>"></script>
    <?php }
  } ?>

  <!-- Código JavaScript para agregar la clase 'active' -->
  <?php if (isset($_GET["ruta"])) { ?>
    <script>
      // Asegurarse de que el DOM esté completamente cargado
      document.addEventListener("DOMContentLoaded", function () {
        // Función para hacer scroll y agregar clase
        var elemento = document.getElementById("<?php echo $_GET['ruta']; ?>");
        if (elemento) {
          // Agregar una clase al elemento
          elemento.classList.add("active");
        }
      });
    </script>
  <?php } ?>

</body>

</html>