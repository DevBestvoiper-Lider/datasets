<!-- Menu -->
<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
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
            <li class="menu-item " id="create-datasets">
                <a href="create-datasets" class="menu-link">
                    <i class="menu-icon tf-icons bx bxs-user-detail"></i>
                    <div class="text-truncate" data-i18n="Datasets">Datasets</div>
                </a>
            </li>

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
    <li class="menu-item">
        <a href="app-chat" class="menu-link">
            <i class="menu-icon tf-icons bx bx-chat"></i>
            <div class="text-truncate" data-i18n="Chats">Chats</div>
            <span class="badge badge-center rounded-pill bg-danger ms-auto">5</span>
        </a>
    </li>

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