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