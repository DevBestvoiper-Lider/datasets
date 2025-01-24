<!-- Menu -->
<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
include_once "controllers/GestionComercial/Crm.controllers.php";
include_once "controllers/CRM/crmasesor.controllers.php";
$ControladorGeneralCRM = new Crm_controllers();
$ControladorAgente = new Crmasesor_controllers();
$internos = $ControladorGeneralCRM->mostrarInternosCrm();
$agentes = $ControladorGeneralCRM->mostrarAgentesCrm();
$modificar = $ControladorGeneralCRM->ModificarInternosAgenteCrm();
// $agenteObtenido = $ControladorAgente->obtenerAgente();
$agenteObtenido = $ControladorAgente->mostrarInfoAgente();
$colas = $ControladorAgente->mostrarColas();
$estados = $ControladorAgente->mostrarEstadosDropdown();
$estadoIconos = [
    'ALMUERZO' => ['icon' => 'fas fa-utensils', 'value' => 1],
    'PAUSAACTIVA' => ['icon' => 'fas fa-walking', 'value' => 2],
    'BREAK' => ['icon' => 'fas fa-coffee', 'value' => 3],
    'WC' => ['icon' => 'fas fa-restroom', 'value' => 4],
    'WAGESTION' => ['icon' => 'fas fa-phone-alt', 'value' => 5],
    'CAPACITACION' => ['icon' => 'fas fa-chalkboard-teacher', 'value' => 6],
    'SOPORTE' => ['icon' => 'fas fa-headset', 'value' => 7],
    'MALLA' => ['icon' => 'fas fa-network-wired', 'value' => 8],
    'MONITOREOS' => ['icon' => 'fas fa-tv', 'value' => 9],
    'BACKOFFICE' => ['icon' => 'fas fa-briefcase', 'value' => 10],
    'PENDIENTES EN CRM' => ['icon' => 'fas fa-clipboard-list', 'value' => 0],
    'OCIO' => ['icon' => 'fas fa-book', 'value' => 12],
];

// Inicializar variables de estado
$allOn = true;
$allOff = true;
$hasGreen = false;
$hasRed = false;
$hasBlue = false;

foreach ($colas as $cola) {

    if ($cola['state'] === 'on') {
        $hasGreen = true;  // Hay al menos un estado 'on'
        $allOff = false;   // Si hay al menos uno 'on', no todos pueden ser 'off'
    } elseif ($cola['state'] === 'off') {
        $hasRed = true;    // Hay al menos un estado 'off'
        $allOn = false;    // Si hay al menos uno 'off', no todos pueden ser 'on'
    } elseif ($cola['state'] === 'pause') {
        $hasBlue = true;
        $allOn = false;
        $allOff = false;
    }
}

// Determinar la clase del div config-box
if ($hasGreen && $hasRed) {
    // Hay mixtos, pero al menos un verde
    $class = 'btn-green-on';
} elseif ($allOff) {
    // Todos están en rojo
    $class = 'btn-red-off';
} else {
    // Todos están en verde
    $class = 'btn-green-on';
}

if ($hasBlue) {
    // Hay mixtos, pero al menos un verde
    $class = 'btn-green-on';
}
?>

<aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
    <div id="alertDisconnected"></div>
    <div class="app-brand demo">
        <a href="app-crm" class="app-brand-link">
            <span class="app-brand-logo demo">
                <img src="assets/img/favicon/LOGOBESTVOIPER.png" width="40">
            </span>
            <span class="app-brand-text demo menu-text fw-bold ms-2">BestVoiper</span>
        </a>

        <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto">
            <i class="bx bx-chevron-left bx-sm align-middle"></i>
        </a>
    </div>

    <div class="menu-inner-shadow"></div>

    <ul class="menu-inner py-1">
        <?php if ($_SESSION['perfil'] == "Ingeniero") { ?>

        <!-- Dashboards -->

        <!-- 
            <li class="menu-item">
                <a href="dashboard" class="menu-link">
                    <i class="menu-icon tf-icons bx bx-home-circle"></i>
                    <div class="text-truncate" data-i18n="Dashboards">Dashboards</div>
                </a>
            </li> -->

        <!-- Configuraciones -->
        <!-- <li class="menu-header small text-uppercase">
                <span class="menu-header-text" data-i18n="Configuraciones">Configuraciones</span>
            </li>
            <li class="menu-item">
                <a href="ivrs" class="menu-link">
                    <i class="menu-icon tf-icons bx bx-envelope"></i>
                    <div class="text-truncate" data-i18n="Ivrs">Ivrs</div>
                </a>
            </li> -->
        <li class="menu-item " id="app-user-list">
            <a href="app-user-list" class="menu-link">
                <i class="menu-icon tf-icons bx bxs-user-detail"></i>
                <div class="text-truncate" data-i18n="Usuarios">Usuarios</div>
            </a>
        </li>
        <!-- <li class="menu-item">
            <a href="createsms" class="menu-link">
                <i class="menu-icon tf-icons bx bx-message-rounded"></i>
                <div class="text-truncate" data-i18n="Crear SMS">Crear SMS</div>
            </a>
        </li>
        <li class="menu-item">
            <a href="createwpp" class="menu-link">
                <i class="menu-icon tf-icons fab fa-whatsapp"></i>
                <div class="text-truncate" data-i18n="Whatsapp">Whatsapp</div>
            </a>
        </li> -->

        <li class="menu-item" id="blacklist">
            <a href="blacklist" class="menu-link">
                <i class="menu-icon tf-icons bx bxs-user-x"></i>
                <div class="text-truncate" data-i18n="Blacklist">Blacklist</div>
            </a>
        </li>
        <!-- Callcenter -->
        <!-- <li class="menu-item" id="callcenter">
                <a href="javascript:void(0);" class="menu-link menu-toggle">
                    <i class="menu-icon tf-icons bx bx-store"></i>
                    <div class="text-truncate" data-i18n="Callcenter">Callcenter</div>
                </a>
                <ul class="menu-sub">
                    <li class="menu-item" id="Callcenter-queues">
                        <a href="Callcenter-queues" class="menu-link">
                            <div class="text-truncate" data-i18n="Colas">Colas</div>
                        </a>
                    </li>
                    <li class="menu-item" id="Callcenter-agents">
                        <a href="Callcenter-agents" class="menu-link">
                            <div class="text-truncate" data-i18n="Agentes">Agentes</div>
                        </a>
                    </li>
                </ul>
            </li> -->


        <!-- Troncales -->
        <!-- <li class="menu-item">
                <a href="javascript:void(0);" class="menu-link menu-toggle">
                    <i class="menu-icon tf-icons bx bx-layout"></i>
                    <div class="text-truncate" data-i18n="Troncales">Troncales</div>
                </a>

                <ul class="menu-sub">
                    <li class="menu-item" id="create-class">
                        <a href="create-class" class="menu-link">
                            <div class="text-truncate" data-i18n="Configurar clases">Configurar clases</div>
                        </a>
                    </li>

                    <li class="menu-header small text-uppercase" style="margin-left: 15%;">
                        <span class="menu-header-text" data-i18n="Placas PCI">Placas PCI</span>
                    </li>

                    <li class="menu-item">
                        <a href="layouts-content-navbar.html" class="menu-link">
                            <div class="text-truncate" data-i18n="Deteccion de Placas">Deteccion de Placas</div>
                        </a>
                    </li>

                    <li class="menu-item">
                        <a href="layouts-content-navbar.html" class="menu-link">
                            <div class="text-truncate" data-i18n="Lineas Analogas">Lineas Analogas</div>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a href="layouts-content-navbar-with-sidebar.html" class="menu-link">
                            <div class="text-truncate" data-i18n="Tramas y DID's">Tramas y DID's</div>
                        </a>
                    </li>

                    <li class="menu-header small text-uppercase" style="margin-left: 15%;">
                        <span class="menu-header-text" data-i18n="VoIP">VoIP</span>
                    </li>

                    <li class="menu-item">
                        <a href="../horizontal-menu-template" class="menu-link" target="_blank">
                            <div class="text-truncate" data-i18n="Troncales IP">Troncales IP</div>
                        </a>
                    </li>

                    <li class="menu-item">
                        <a href="layouts-without-menu.html" class="menu-link">
                            <div class="text-truncate" data-i18n="Red Servidor" data-tooltip="Hola">Red Servidor</div>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a href="layouts-without-navbar.html" class="menu-link">
                            <div class="text-truncate" data-i18n="DID's">DID's</div>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a href="layouts-fluid.html" class="menu-link">
                            <div class="text-truncate" data-i18n="Troncales SIP Creados (7)">Troncales SIP Creados (7)</div>
                        </a>
                    </li>
                </ul>
            </li>
            Gestion comercial(Crm)-->
        <li class="menu-header small text-uppercase">
            <span class="menu-header-text" data-i18n="Gestion comercial">Gestion comercial</span>
            <i class="menu-icon fas fa-address-book"></i>
            <!-- Administracion Crm -->
        <li class="menu-item" id="Administracion_crm">
            <a href="javascript:void(0);" class="menu-link menu-toggle">
                <i class="menu-icon tf-icons bx bx-data"></i>
                <div class="text-truncate" data-i18n="Administracion Crm">Administracion Crm</div>
            </a>
            <ul class="menu-sub">
                <li class="menu-item" id="camPersonalizados">
                    <a href="camPersonalizados" class="menu-link">
                        <div class="text-truncate" data-i18n="Campos personalizados">Campos personalizados</div>
                    </a>
                </li>
                <li class="menu-item" id="Entidades-entidad">
                    <a href="entidadConfig" class="menu-link">
                        <div class="text-truncate" data-i18n="entidad">Entidad</div>
                    </a>
                </li>
        </li>

        <li class="menu-item" id="usuarioConfig">
            <a href="usuarioConfig" class="menu-link">
                <div class="text-truncate" data-i18n="Configuracion de usuarios">Configuracion de usuarios</div>
            </a>
        </li>
        <li class="menu-item" id="Operaciones_st">
            <a href="tablas" class="menu-link">
                <div class="text-truncate" data-i18n="Operaciones sobre las tablas">Operaciones sobre las tablas
                </div>
            </a>
        </li>
        <li class="menu-item" id="tipificacion">
            <a href="tipificacion" class="menu-link">
                <div class="text-truncate" data-i18n="tipificacion">Tipificacion</div>
            </a>
        </li>
        <li class="menu-item" id="Visualizador_registros">
            <a href="visualizaRegistro" class="menu-link">
                <div class="text-truncate" data-i18n="Visualizador de registros">Visualizador de registros</div>
            </a>
        </li>
    </ul>
    </li>
    <li class="menu-item" id="CRM_Reportes">
        <a href="crm" class="menu-link">
            <i class="menu-icon tf-icons bx bx-data"></i>
            <div class="text-truncate" data-i18n="CRM Reportes">CRM Reportes</div>
        </a>
    </li>
    </li>

    <!-- Apps & Pages -->
    <!-- <li class="menu-header small text-uppercase">
                <span class="menu-header-text" data-i18n="Apps">Apps</span>
            </li>-->
    <!-- <li class="menu-item">
                <a href="app-email.html" class="menu-link">
                    <i class="menu-icon tf-icons bx bx-envelope"></i>
                    <div class="text-truncate" data-i18n="Email">Email</div>
                </a>
            </li> -->
    <!--Dashboards -->
    <!-- <li class="menu-item">
                <a href="javascript:void(0);" class="menu-link menu-toggle">
                    <i class="menu-icon tf-icons bx bx-chat"></i>
                    <div class="text-truncate" data-i18n="Chats">Chats</div>
                </a>
                <ul class="menu-sub">
                    <li class="menu-item">
                        <a href="app-chats-Estados" class="menu-link">
                            <div class="text-truncate" data-i18n="Configurar Pausas">Configurar Pausas</div>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a href="dashboards-crm.html" class="menu-link">
                            <div class="text-truncate" data-i18n="CRM">CRM</div>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a href="app-ecommerce-dashboard.html" class="menu-link">
                            <div class="text-truncate" data-i18n="eCommerce">eCommerce</div>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a href="app-logistics-dashboard.html" class="menu-link">
                            <div class="text-truncate" data-i18n="Logistics">Logistics</div>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a href="app-academy-dashboard.html" class="menu-link">
                            <div class="text-truncate" data-i18n="Academy">Academy</div>
                        </a>
                    </li>
                </ul>
            </li> -->
    <!-- Reportes -->
    <li class="menu-header small text-uppercase">
        <span class="menu-header-text" data-i18n="Reportes">Reportes</span>
        <i class="menu-icon tf-icons bx bx-pie-chart"></i>
    </li>
    <li class="menu-item" id="actividadc">
        <a href="actividadc" class="menu-link">
            <i class="menu-icon tf-icons bx bx-phone-call"></i>
            <div class="text-truncate" data-i18n="Actividad callcenter">Actividad callcenter</div>
        </a>
    </li>
    <li class="menu-item" id="recordings">
        <a href="recordings" class="menu-link">
            <i class="menu-icon tf-icons bx bx bx-album"></i>
            <div class="text-truncate" data-i18n="Grabaciones">Grabaciones</div>
        </a>
    </li>
    <li class="menu-item" id="ctrllog">
        <a href="ctrllog" class="menu-link">
            <i class="menu-icon tf-icons bx bx-user-circle"></i>

            <div class="text-truncate" data-i18n="Control de Logueos">Control de Logueos</div>
        </a>
    </li>
    <li class="menu-item" id="estcall">
        <a href="estcall" class="menu-link">
            <i class="menu-icon tf-icons bx bx-buildings"></i>

            <div class="text-truncate" data-i18n="Estadisticas callcenter">Estadisticas callcenter</div>
        </a>
    </li>

    <li class="menu-item" id="callsc">
        <a href="callsc" class="menu-link">
            <i class="menu-icon tf-icons bx bx-phone"></i>

            <div class="text-truncate" data-i18n="Llamadas Callcenter">Llamadas Callcenter</div>
        </a>
    </li>

    <li class="menu-item" id="reportCallcenter">
        <a href="reportCallcenter" class="menu-link">
            <i class="menu-icon tf-icons bx bx-file"></i>
            <div class="text-truncate" data-i18n="Reporte de Callcenter">Reporte de Callcenter</div>
        </a>
    </li>

    <li class="menu-item" id="did-records">
        <a href="did-records" class="menu-link">
            <i class="menu-icon tf-icons bx bx-list-check"></i>
            <div class="text-truncate" data-i18n="Registro DIDs">Registro DIDs</div>
        </a>
    </li>

    <li class="menu-item" id="regespera">
        <a href="regespera" class="menu-link">
            <i class="menu-icon tf-icons bx bx-time-five"></i>
            <div class="text-truncate" data-i18n="Registro en espera">Registro en espera</div>
        </a>
    </li>
    <li class="menu-item" id="reportivr">
        <a href="reportivr" class="menu-link">
            <i class="menu-icon tf-icons bx bx-network-chart"></i>
            <div class="text-truncate" data-i18n="Reporte IVR">Reporte IVR</div>
        </a>
    </li>

    <li class="menu-item" id="reportesChats">
        <a href="reportesChats" class="menu-link">
            <i class="menu-icon tf-icons bx bx-network-chart"></i>
            <div class="text-truncate" data-i18n="Reportes Chats">Reportes Chats</div>
        </a>
    </li>
    <li class="menu-item" id="reportesChatsTwo">
        <a href="reportesChatsTwo" class="menu-link">
            <i class="menu-icon tf-icons bx bx-network-chart"></i>
            <div class="text-truncate" data-i18n="Reportes Two">Reportes Two</div>
        </a>
    </li>

    <li class="menu-item" id="registrationcall">
        <a href="registrationcall" class="menu-link">
            <i class="menu-icon tf-icons bx bx-history"></i>
            <div class="text-truncate" data-i18n="Registro de llamadas">Registro de llamada</div>
        </a>
    </li>
    <!-- 
    <li class="menu-item" id="sms">
        <a href="sms" class="menu-link">
            <i class="menu-icon tf-icons bx bx-message-rounded"></i>
            <div class="text-truncate" data-i18n="SMS">SMS</div>
        </a>
    </li> -->



    <!-- <li class="menu-item" id="wpp">
        <a href="wpp" class="menu-link">
            <i class="menu-icon tf-icons fab fa-whatsapp"></i>
            <div class="text-truncate" data-i18n="Whatsapp">Whatsapp</div>
        </a>
    </li> -->

    <!-- <li class="menu-item">
                <a href="actividadc" class="menu-link">
                    <i class="menu-icon tf-icons bx bx-envelope"></i>
                    <div class="text-truncate" data-i18n="Chats">Chats</div>
                </a>
            </li> -->

    <!-- Reportes -->
    <li class="menu-header small text-uppercase">
        <span class="menu-header-text" data-i18n="SISTEMA">SISTEMA</span>
        <i class="menu-icon tf-icons bx bx-pie-chart"></i>
    </li>
    <li class="menu-item" id="anti-hack">
        <a href="anti-hack" class="menu-link">
            <i class="menu-icon tf-icons bx bx-phone-call"></i>
            <div class="text-truncate" data-i18n="Anti-Hack">Anti-Hack</div>
        </a>
    </li>
    <li class="menu-item" id="estados">
        <a href="estados" class="menu-link">
            <i class="menu-icon tf-icons bx bx-laptop"></i>
            <div class="text-truncate" data-i18n="Estados">Estados</div>
        </a>
    </li>

    <!-- <li class="menu-item">
                <a href="actividadc" class="menu-link">
                    <i class="menu-icon tf-icons bx bx-envelope"></i>
                    <div class="text-truncate" data-i18n="Chats">Chats</div>
                </a>
            </li> -->

    <?php } else { ?>

    <!-- Dashboard -->
    <!-- <li class="menu-item">
                <a href="dashboard" class="menu-link">
                    <i class="menu-icon tf-icons bx bx-envelope"></i>
                    <div class="text-truncate" data-i18n="Dashboard">Dashboard</div>
                </a>
            </li> -->

    <!-- Apps & Pages
            <li class="menu-header small text-uppercase">
                <span class="menu-header-text" data-i18n="Apps">Apps</span>
            </li>
            <li class="menu-item">
                <a href="app-email.html" class="menu-link">
                    <i class="menu-icon tf-icons bx bx-envelope"></i>
                    <div class="text-truncate" data-i18n="Email">Email</div>
                </a>
            </li> -->

    <li class="menu-item" id="Administracion_crm">
        <a href="javascript:void(0);" class="menu-link menu-toggle">
            <i class="menu-icon tf-icons bx bx-data"></i>
            <div class="text-truncate" data-i18n="Administracion Crm">Administracion Crm</div>
        </a>
        <ul class="menu-sub">
            <li class="menu-item" id="app-crm-visualizar-registro">
                <a href="app-crm-visualizar-registro" class="menu-link">
                    <div class="text-truncate" data-i18n="Visualizador de registros">Visualizador de registros</div>
                </a>
            </li>
        </ul>
    </li>
    <!-- Crm contactos -->
    <li class="menu-item">
        <a href="app-crm" class="menu-link">
            <i class="menu-icon tf-icons bx bx-user"></i>
            <div class="text-truncate" data-i18n="Crm Contactos">Crm Contactos</div>
        </a>
    </li>
    <!-- Crm Pendientes -->
    <li class="menu-item">
        <a href="app-crm-pendientes" class="menu-link">
            <i class="menu-icon tf-icons bx bx-time"></i>
            <div class="text-truncate" data-i18n="Crm Pendientes">Crm Pendientes</div>
        </a>
    </li>
    <!-- Crm reporte callcenter -->
    <li class="menu-item">
        <a href="app-crm-reportcallcenter" class="menu-link">
            <i class="menu-icon tf-icons bx bx-data"></i>
            <div class="text-truncate" data-i18n="Crm Reporte callcenter(TR)">Crm Reporte callcenter(TR)</div>
        </a>
    </li>
    <!-- Crm salientes -->
    <li class="menu-item">
        <a href="app-crm-salientes" class="menu-link">
            <i class="menu-icon tf-icons bx bx-phone"></i>
            <div class="text-truncate" data-i18n="Crm salientes">Crm salientes</div>
        </a>
    </li>
    <!-- Chats -->
    <!-- <li class="menu-item">
        <a href="app-chat" class="menu-link">
            <i class="menu-icon tf-icons bx bx-chat"></i>
            <div class="text-truncate" data-i18n="Chats">Chats</div>
            <span class="badge badge-center rounded-pill bg-danger ms-auto">5</span>
        </a>
    </li> -->

    <li class="menu-header small text-uppercase">
        <span class="menu-header-text" data-i18n="COLAS">COLAS</span>
        <i class="menu-icon tf-icons bx bx-pie-chart"></i>
    </li>

    <!-- Chats -->
    <li class="menu-item">
        <a href="#" class="menu-link">
            <div class="text-truncate" data-i18n="Abrir registros entrantes">Abrir registros entrantes</div>

            <?php
            $actionEMB = 0;
            $value = 0;
            $embpopup = ControllersUsuarios::updateEMBPOPUP($actionEMB, $usuario, $value);

            foreach ($embpopup as $data) {
                $popupactivo = $data["activo"];
            }
            ?>

            <input type="checkbox" onchange="updateCheckbox(this, '<?php echo $usuario ?>')"
                class="form-check-input ms-auto" id="bs-validation-checkbox"
                <?php echo $popupactivo == "s" ? 'checked' : ''; ?> required="">
        </a>
    </li>

    <div class="division-hr mt-3"><span></span></div>

    <?php
            // Mostrar el div con la clase correspondiente
            echo '<div id="config-box" class="config-box">
                    <i class="fas fa-power-off ' . $class . '"></i>
                </div>';
    ?>

    <div id="config-content" class="config-content">
        <!-- select Interno -->
        <div class="form-group">
            <label for="interno" class="small font-weight-normal">Interno</label>
            <select class="form-control" id="interno" name="interno" <?php
                                                                        // Verifica si $modificar no está vacío y toma el valor de 'modificarinterno'
                                                                        if (!empty($modificar) && isset($modificar[0]['modificarinterno'])) {
                                                                            echo ($modificar[0]['modificarinterno'] == 'n') ? 'disabled' : '';
                                                                        }
                                                                        ?>>
                <?php
                // Recorre el array de colas y agrega opciones al select
                $selected = '';
                if (is_array($agenteObtenido) && isset($agenteObtenido['membername']) && isset($agenteObtenido['interno'])) {
                    echo '<option class="selectMultiple" value="' . $agenteObtenido['membername'] . '" ' . $selected . '>' . $agenteObtenido['interno'] . ' | ' . $agenteObtenido['membername'] . '</option>';
                } else {
                    // Maneja el caso en el que $agenteObtenido no sea un array o no tenga los índices esperados
                    echo '<option value="">No se encontraron datos del agente</option>';
                }

                ?>
            </select>
        </div>

        <!-- Acciones para Agente de CallCenter -->
        <div class="alert alert-primary mt-2 mb-0" role="alert"
            style="border-color: #e0e0e0;border-width: 1px;padding: 6px;">
            <h6 class="mb-0 fw-bold" style="font-size: 0.870rem;">Acciones para Agente</h6>
        </div>
        <div class="form-group">
            <label for="interno" class="small font-weight-normal">Agente</label>
            <select class="form-control" id="agente" name="agente" <?php
                                                                    // Verifica si $modificar no está vacío y toma el valor de 'modificaragente'
                                                                    if (!empty($modificar) && isset($modificar[0]['modificaragente'])) {
                                                                        echo ($modificar[0]['modificaragente'] == 'n') ? 'disabled' : '';
                                                                    }
                                                                    ?>>
                <?php

                // Solo muestra el agente obtenido de obtenerAgente()
                if (isset($agenteObtenido) && is_array($agenteObtenido) && !empty($agenteObtenido)) {
                    $selected = '';
                    if (isset($_POST['agente']) && $_POST['agente'] == $agenteObtenido['membername']) {
                        $selected = 'selected';
                    }
                    // Mostrar en formato 'interface | membername'
                    echo '<option class="selectMultiple" value="' . $agenteObtenido['membername'] . '" ' . $selected . '>' . $agenteObtenido['interface'] . ' | ' . $agenteObtenido['membername'] . '</option>';
                } else {
                    echo '<option value="">No se encontró agente</option>';
                }


                // // Recorre el array de agentes y agrega opciones al select
                // if (isset($agentes) && !empty($agentes)) {
                //     foreach ($agentes as $agente) {
                //         $selected = '';
                //         if (isset($_POST['agente']) && is_array($_POST['agente'])) {
                //             foreach ($_POST['agente'] as $selectedCola) {
                //                 if ($selectedCola == $agente['membername']) {
                //                     $selected = 'selected';
                //                     break;
                //                 }
                //             }
                //         }
                //         echo '<option class="selectMultiple" value="' . $agente['membername'] . '" ' . $selected . '>' . $agente['interface'] . ' | ' . $agente['membername'] . '</option>';
                //     }
                // }
                ?>
            </select>
        </div>
        <!-- Botón padre -->
        <div class="d-flex justify-content-between align-items-center p-2 w-100">
            <?php
            // Mostrar botón según el estado
            if ($allOn) {
                echo '<button id="masterBtn" class="btn btn-circle" title="Loguear en todas las colas">
                            <i class="fas fa-power-off btn-red-off"></i>
                        </button>';
            } elseif ($allOff) {
                echo '<button id="masterBtn" class="btn btn-circle" title="Desloguear de todas las colas">
                            <i class="fas fa-power-off btn-green-on"></i>
                        </button>';
            }


            if (!$allOn && !$allOff && !$hasBlue) {
                // Si hay diferentes estados, no mostrar el botón
                echo '<button id="masterBtn" class="btn btn-circle" title="Desloguear de todas las colas"  style="display: none;">
                        <i class="fas fa-power-off btn-green-on"></i>
                    </button>';
            } else if (!$allOn && !$allOff && $hasBlue) {
                // Si hay diferentes estados, no mostrar el botón
                echo '<button id="masterBtn" class="btn btn-circle" title="Desloguear de todas las colas"">
                        <i class="fas fa-power-off btn-green-on"></i>
                    </button>';
            }
            ?>

            <div class="custom-select" id="wrapSelectStates">
                <div class="select-trigger">
                    <i class="fas fa-bars"></i>
                    <span>Seleccionar estado</span>
                    <i class="fas fa-caret-down"></i>
                </div>
                <div class="dropdown-menu mainSelectStates">
                    <?php if (!empty($estados)): ?>
                    <?php foreach ($estados as $estado): ?>
                    <?php if (isset($estado['estado'])): ?>
                    <?php
                                // Normaliza el estado a mayúsculas
                                $estadoMayusculas = strtoupper($estado['estado']);
                                $iconData = $estadoIconos[$estadoMayusculas] ?? ['icon' => 'fas fa-question', 'value' => 0]; // Icono por defecto
                                ?>
                    <div class="dropdown-item dropdownSelectStatesItem"
                        data-value="<?php echo htmlspecialchars($iconData['value'] ?? '0'); ?>"
                        data-icon="<?php echo htmlspecialchars($iconData['icon'] ?? $defaultIcon); ?>">
                        <!-- Muestra el ícono correspondiente o el ícono por defecto -->
                        <i class="<?php echo htmlspecialchars($iconData['icon'] ?? $defaultIcon); ?>"></i>
                        <?php echo htmlspecialchars($estado['estado']); ?>
                    </div>
                    <?php else: ?>
                    <div class="dropdown-item">Estado no válido</div>
                    <?php endif; ?>
                    <?php endforeach; ?>
                    <?php else: ?>
                    <div class="dropdown-item">No hay estados disponibles.</div>
                    <?php endif; ?>
                </div>

            </div>
        </div>

        <!-- Colas individuales -->
        <div class="scroll-wrapper">
            <div class="queue-container">
                <?php
                if (!empty($colas)) {

                    function getIconByValue($estadoIconos, $value)
                    {
                        foreach ($estadoIconos as $estado => $data) {
                            if ($data['value'] == $value) {
                                return $data['icon'];
                            }
                        }
                        return '';
                    }

                    foreach ($colas as $cola) {
                        echo '<div class="queue-item">';
                        echo '<span>' . $cola['queue_name'] . ' (' . $cola['queue_exten'] . ')</span>';
                        echo '<div class="d-flex align-items-center">';
                        echo '<label class="queue-label" data-text="' . ($cola['state'] === 'pause' ? $cola['queue_name'] : '') . '" data-value="' . ($cola['state'] === 'pause' ? $cola['stateID'] : '') . '"><i class="fas ' . ($cola['state'] === 'pause' ? getIconByValue($estadoIconos, $cola['stateID']) : '') . '"></i></label>';
                        echo '<button class="btn btn-circle queue-btn ms-2" data-queue-ext="' . $cola['queue_exten'] . '" data-queue-name="' . $cola['queue_name'] . '" ' . ($hasBlue ? 'disabled' : '') . ' title="Controlar cola">';
                        echo '<i class="fas fa-power-off ' .
                            ($cola['state'] === 'on' ? 'btn-green-on' : ($cola['state'] === 'pause' ? 'btn-blue-pause' : 'btn-red-off')) .
                            '"></i>';
                        echo '</button>';
                        echo '</div>';
                        echo '</div>';
                    }
                } else {
                    echo '<div class="alert alert-secondary d-flex align-items-center" role="alert">
                                    <i class="fas fa-info-circle me-2"></i>
                                    <span>No hay colas disponibles para este agente.</span>
                                </div>';
                }
                ?>
            </div>
        </div>
        <button id="close-btn" class="btn btn-primary">
            <i class="fas fa-arrow-left mr-2"></i>
        </button>
    </div>

    <?php } ?>
    </ul>
</aside>
<!-- / Menu -->