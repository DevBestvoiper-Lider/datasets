<?php

session_destroy();

// include_once "controllers/Reports/Ctrllog.controllers.php";
// $ctrllog = new ControllersCtrlLog();
// $ctrllog::ctrActualizarTiempoSesion();

echo '<script>
    window.location = "auth-login";
</script>';