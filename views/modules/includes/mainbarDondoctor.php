<!-- Menu -->

<aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
    <div class="app-brand demo">
        <a href="index.html" class="app-brand-link">
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
            <li class="menu-item">
                <a href="createsms" class="menu-link">
                    <i class="menu-icon tf-icons bx bx-message-rounded"></i>
                    <div class="text-truncate" data-i18n="Crear SMS">Crear SMS</div>
                </a>
            </li>
            <li class="menu-item">
                <a href="createwpp" class="menu-link">
                    <i class="menu-icon tf-icons fab fa-whatsapp"></i>
                    <div class="text-truncate" data-i18n="createwpp">Whatsapp</div>
                </a>
            </li>

            <li class="menu-item" id="blacklist">
                <a href="blacklist" class="menu-link">
                    <i class="menu-icon tf-icons bx bxs-user-x"></i>
                    <div class="text-truncate" data-i18n="Blacklist">Blacklist</div>
                </a>
            </li>
            <!-- Callcenter -->
            <li class="menu-item" id="callcenter">
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
            </li>


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
                <span class="menu-header-text" data-i18n="Gestion comercial(Crm)">Gestion comercial(Crm)</span>
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

                    <li class="menu-item" id="Usuarios_Crm">
                        <a href="entidad" class="menu-link">
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
            </li>
            <li class="menu-item">
                <a href="app-email.html" class="menu-link">
                    <i class="menu-icon tf-icons bx bx-envelope"></i>
                    <div class="text-truncate" data-i18n="Email">Email</div>
                </a>
            </li>
            <!-- Dashboards -->
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

            <li class="menu-item" id="registrationcall">
                <a href="registrationcall" class="menu-link">
                    <i class="menu-icon tf-icons bx bx-history"></i>
                    <div class="text-truncate" data-i18n="Registro de llamadas">Registro de llamada</div>
                </a>
            </li>

            <li class="menu-item" id="sms">
                <a href="sms" class="menu-link">
                    <i class="menu-icon tf-icons bx bx-message-rounded"></i>
                    <div class="text-truncate" data-i18n="SMS">SMS</div>
                </a>
            </li>



            <li class="menu-item" id="wpp">
                <a href="wpp" class="menu-link">
                    <i class="menu-icon tf-icons fab fa-whatsapp"></i>
                    <div class="text-truncate" data-i18n="Whatsapp">Whatsapp</div>
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
            <li class="menu-item">
                <a href="dashboard" class="menu-link">
                    <i class="menu-icon tf-icons bx bx-envelope"></i>
                    <div class="text-truncate" data-i18n="Dashboard">Dashboard</div>
                </a>
            </li>

            <!-- Apps & Pages -->
            <li class="menu-header small text-uppercase">
                <span class="menu-header-text" data-i18n="Apps">Apps</span>
            </li>
            <li class="menu-item">
                <a href="app-email.html" class="menu-link">
                    <i class="menu-icon tf-icons bx bx-envelope"></i>
                    <div class="text-truncate" data-i18n="Email">Email</div>
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

        <?php } ?>
    </ul>
</aside>
<!-- / Menu -->