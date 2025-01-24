<script>
    var user = <?php echo "'" . $usuario . "'" ?>;
</script>

<div class="col-md-12 justify-content-evenly" id="containerTableQueue" style="display: none">
    <div class="card">
        <div class="card-header">
            <div class="col logs">
                <p>Queue</p>
            </div>
            <div class="col close">
                <button id="clearLogButton"><i class="fa fa-arrow-up" aria-hidden="true"></i></button>
            </div>
        </div>
        <div class="card-body">
            <h7 class="card-title" id="user"></h7>
            <span id="queueCount" class="badge rounded-pill text-bg-info">Primary</span>

            <div id="queueInfo"></div>
        </div>
    </div>
</div>

<div id="wrapper" class="col-md-12 col-sm-12 justify-content-evenly">
    <span id="sessionUserExtension" value="<?= $_SESSION["exten"]; ?>" hidden></span>
    <div class="wrap">
        <div id="callControl">
            <div class="card">
                <div class="card-header headerPhone">
                    <div class="wrapTitleLogout">
                        <div class="wrapTitle">
                            <p id="title">Bestvoiper</p>
                            <div class="settings" data-tippy-content="Opciones" data-tippy-placement="top"
                                data-tippy-arrow="true">
                                <button class="btn-round btn-settings btn btn-light" data-bs-toggle="dropdown"><i
                                        class="fa fa-gear"></i></button>
                                <ul class="dropdown-menu dd-menu-header">
                                    <li><a class="dropdown-item" href="#" id="btnRefresh"><i
                                                class="fa-solid fa-sync"></i>
                                            <span>Refrescar registro</span></a></li>
                                    <li><a class="dropdown-item" href="#" id="btnOpenHistory" data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasCallHistory"><i
                                                class="fa-solid fa-clock-rotate-left"></i>
                                            <span>Historial de llamadas</span></a></li>
                                    <li><a id="btnOpenOffcanvasPreview" class="dropdown-item" href="#offcanvasPreview"
                                            data-bs-toggle="offcanvas" data-bs-target="#offcanvasPreview" role="button"
                                            aria-controls="offcanvasPreview"><i class="fa-solid fa-play-circle"></i>
                                            <span>Previsualizar dispositivos</span></a></li>
                                    <li>
                                        <a id="btnOpenOffcanvasDiagnostic" class="dropdown-item"
                                            href="#offcanvasDiagnostic" data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasDiagnostic" role="button"
                                            aria-controls="offcanvasDiagnostic">
                                            <i class="fas fa-tachometer-alt"></i>
                                            <span>Panel de Diagnóstico</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a id="btnOpenOffcanvasPanelAgents" class="dropdown-item"
                                            href="#offcanvasPanelAgents" data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasPanelAgents" role="button"
                                            aria-controls="offcanvasPanelAgents">
                                            <i class="fa-solid fa-users"></i>
                                            <span>Panel de asesores</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a id="btnOpenOffcanvasPanel" class="dropdown-item" href="#offcanvasPanel"
                                            data-bs-toggle="offcanvas" data-bs-target="#offcanvasPanel" role="button"
                                            aria-controls="offcanvasPanel" style="display: none;">
                                            <i class="fa-solid fa-signal"></i>
                                            <span>Monitor de calidad de red</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="info-status"><i class="fa-solid fa-mobile-retro" id="mobile-status-icon"></i> <span
                            id="statusCall" class="small text">Desconectado</span></div>
                    <div class="info-status" id="wrapTimerId" style="display: none"><i class="fa-solid fa-clock"
                            id="mobile-time-icon"></i> <span id="timerId" class="small text">00:00</span>
                    </div>
                    <div class="info-status" id="wrapCallerId" style="display: none"><i class="fa-solid fa-user"
                            id="mobile-user-icon"></i> <span id="callerId" class="small text"></span>
                    </div>



                </div>
                <div class="card-body" id="padPhone">
                    <h7 class="card-title" id="user"></h7>
                    <!--Llamada saliente-->
                    <div id="to">
                        <div class="wrapInputCall">
                            <input id="toField" type="text" placeholder="" style="display: none;" />
                            <!-- <span class="input-group-btn">
                                            <button id="btnDeleteDial" class="btn btn-default"><i
                                                    class="fa-solid fa-circle-chevron-left"></i></button>
                                        </span> -->
                        </div>
                        <div id="toCallButtons">
                            <div id="dialPad">
                                <div class="dialpad-char" data-value="1" unselectable="on">1</div>
                                <div class="dialpad-char" data-value="2" unselectable="on">2</div>
                                <div class="dialpad-char" data-value="3" unselectable="on">3</div>
                                <div class="dialpad-char" data-value="4" unselectable="on">4</div>
                                <div class="dialpad-char" data-value="5" unselectable="on">5</div>
                                <div class="dialpad-char" data-value="6" unselectable="on">6</div>
                                <div class="dialpad-char" data-value="7" unselectable="on">7</div>
                                <div class="dialpad-char" data-value="8" unselectable="on">8</div>
                                <div class="dialpad-char" data-value="9" unselectable="on">9</div>
                                <div class="dialpad-char" data-value="*" unselectable="on">*</div>
                                <div class="dialpad-char" data-value="0" unselectable="on">0</div>
                                <div class="dialpad-char" data-value="#" unselectable="on">#</div>
                                <div class="dialpad-char btn-secondary-phone" data-value="R" unselectable="on"
                                    id="reCallButton">R</div>
                                <div class="dialpad-char" data-value="+" unselectable="on">+</div>
                                <div class="dialpad-char btn-secondary-phone" data-value="C" unselectable="on"
                                    id="clearFieldButton">C</div>
                            </div>
                        </div>
                    </div>
                    <!--Llamada entrante-->
                    <div id="incomming" style="display: none;">
                        <div class="wrapIncomming">
                            <div class="rowing">
                                <div class="call-animation">
                                    <div class="ring"></div>
                                    <div class="ring"></div>
                                    <div class="ring"></div>
                                    <div class="phone-circle">
                                        <i class="fas fa-phone-volume phone-icon"></i>
                                        <span id="incommingCallerId">3157894562</span>
                                    </div>
                                </div>
                            </div>
                            <br>
                            <div class="row">
                                <div class="col text-left">
                                    <button id="btnAnswer"
                                        class="btn btn-outline-success btn-sm rounded-pill incoming-button-call btn-answer-call">
                                        <i class="fa-solid fa-phone"></i> <span>Contestar</span>
                                    </button>
                                </div>
                                <div class="col text-right">
                                    <button
                                        class="btn btn-outline-danger btn-sm rounded-pill btnHangUp incoming-button-call"
                                        data-type='reject'>
                                        <i class="fa-solid fa-phone hangup-call"></i> <span>Rechazar</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--Lllamada entrante fin-->

                    <div id="wrapOptions" style="display: none">
                        <button id="connectCall" class="btn btn-primary call-button btn-round" style="display: none">
                            <span><i class="fa-solid fa-phone"></i></span>
                        </button>
                        <button id="btnRejectCall" class="btn btn-danger call-button btn-round btnHangUp"
                            data-type='hangup'>
                            <span><i class="fa-solid fa-phone hangup-call"></i></span>
                        </button>
                    </div>

                </div>
                <div class="card-footer">

                    <div class="container text-center wrapOptionsCallFooter">
                        <div class="row">
                            <div class="col align-self-center">
                                <div id="info-micro" class="align-left" style="display: none;">
                                    <span class="meter-icon" data-tippy-content="Predeterminado"
                                        data-tippy-placement="top" data-tippy-arrow="true"><i
                                            class="fa-solid fa-headset"></i></span>
                                    <div class="meter">
                                        <span id="mic-level" class="level"></span>
                                    </div>
                                    <span class="meter-icon"><i class="fa-solid fa-microphone"></i></span>
                                    <div class="sound-meter">
                                        <span id="speaker-level" class="level"></span>
                                    </div>
                                    <span class="meter-icon">
                                        <i id="connection-quality" class="fas fa-wifi"></i>
                                    </span>

                                </div>

                                <!-- <button class="btn-round btn-settings btn btn-light" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRecordCall" aria-controls="offcanvasRecordCall" data-tippy-content="Respuesta automática" data-tippy-placement="top" data-tippy-arrow="true"><i class="fa-regular fa-circle-dot"></i></button> -->



                            </div>

                            <div id="optionsInCall" class="col align-self-center" style="display: none;">

                                <button id="mute" class="btn btn-light" data-tippy-content="Mutear"
                                    data-tippy-placement="top" data-tippy-arrow="true"><i
                                        class="fa-solid fa-microphone"></i></button>
                                <button id="btnHoldUnhold" class="btn btn-light" data-tippy-content="Poner en espera"
                                    data-tippy-placement="top" data-tippy-arrow="true"><i
                                        class="fa-solid fa-circle-pause"></i></button>
                                <button id="transferPopover" class="btnTransfer btn btn-light" data-bs-toggle="popover"
                                    data-bs-content="Contenido del popover" title="Título del popover"
                                    data-bs-placement="top" title="Transferir llamada"
                                    data-tippy-content="Transferir llamada" data-tippy-placement="top"
                                    data-tippy-arrow="true">
                                    <i class="fa-solid fa-reply icon-reply"></i>
                                </button>

                                <!-- <button id="joinCall" class="btn btn-light position-relative" data-tippy-content="Conferencia" data-tippy-placement="top" data-tippy-arrow="true" data-bs-toggle="offcanvas" data-bs-target="#offcanvasConference" aria-controls="offcanvasConference"><i class="fa fa-user-group"></i>
                                    <span id="counterConference" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        0
                                    </span>
                                </button> -->

                            </div>
                        </div>

                        <div class="col" id="phone-options">
                            <?php if ($_SESSION['verDND'] == 'A') { ?>
                                <span class="badge text-bg-ligth" id="btnDND" data-state="<?= $_SESSION['DND'] ?>"
                                    data-tippy-content="Denegar llamadas" data-tippy-placement="top"
                                    data-tippy-arrow="true">DND</span>
                            <?php } ?>

                            <?php if ($_SESSION['verAA'] == 'A') { ?>
                                <span class="badge text-bg-ligth" id="btnAA" data-state="<?= $_SESSION['AA'] ?>"
                                    data-tippy-content="Respuesta automática" data-tippy-placement="top"
                                    data-tippy-arrow="true">AA</span>
                            <?php } ?>
                        </div>


                    </div>
                </div>

            </div>
        </div>
    </div>
    <div class="container mt-5 wrapper-transfer">
        <section class="center">
            <div hidden>
                <div data-name="popover-content">
                    <div class="input-group-sm">
                        <input type="text" class="form-control form-control-sm" placeholder="Extensión" name="ext"
                            id="inputExtToTransfer">
                        <div class="d-flex justify-content-between">
                            <a class="link-offset-2 link-underline link-underline-opacity-0 btnTransferCall" href="#"
                                data-id="blind">
                                <i class="bi bi-phone fa fa-reply icon-reply"></i> Ciega
                            </a>
                            <a class="link-offset-2 link-underline link-underline-opacity-0 btnTransferCall" href="#"
                                data-id="answered">
                                <i class="bi bi-phone fa fa-reply-all icon-reply"></i> Atendida
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</div>
</div>
</div>
</div>
<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasConference"
    aria-labelledby="offcanvasConferenceLabel">
    <div class="offcanvas-header bg-light">
        <h5 class="offcanvas-title" id="offcanvasConferenceLabel">
            <i class="fas fa-users me-2"></i>
            Conferencia Activa
            <span class="badge bg-primary ms-2" id="participantCount">0</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>

    <div class="offcanvas-body p-0">
        <!-- Lista de Participantes -->
        <div class="list-group list-group-flush" id="listExtension">
            <!-- Los participantes se agregarán dinámicamente aquí -->
        </div>

        <!-- Formulario para agregar participantes -->
        <div class="input-group-custom">
            <div class="input-group">
                <span class="input-group-text bg-white">
                    <i class="fas fa-phone"></i>
                </span>
                <input type="text" class="form-control" placeholder="Ingrese extensión..." id="inputExtToConference"
                    pattern="[0-9]*">
                <button class="btn btn-primary" type="button" id="btnAddToConference">
                    <i class="fas fa-plus me-1"></i>
                    Agregar
                </button>
            </div>
        </div>
    </div>
</div>


<!--OFFCANVAS CALL HISTORY-->
<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasCallHistory"
    aria-labelledby="offcanvasCallHistoryLabel">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasCallHistoryLabel">Historial de Llamadas


        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
        <div class="call-list">
            <div id="call-history-summary"></div>
            <ul id="call-history" class="list-group">
                <!-- Las llamadas se agregarán dinámicamente aquí -->
            </ul>
        </div>
    </div>
</div>

<!--OFFCANVAS PREVIEW-->
<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasPreview" aria-labelledby="offcanvasPreviewLabel">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasPreviewLabel">Previsualizar dispositivos


        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
        <div id="options-view">
            <div class="row mb-3">
                <div class="col-sm-12">
                    <label for="playbackSrc">Altavoz:</label>
                </div>
                <div class="col-sm-12">
                    <select id="playbackSrc" class="form-select form-control"></select>
                    <div class="meter-speaker-preview">
                        <span id="speaker-level-preview" class="level-prev"></span>
                    </div>
                    <button class="btn btn-primary mt-2" id="playSpeakerLevel">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-sm-12">
                    <label for="ringDevice">Dispositivo de timbrado:</label>
                </div>
                <div class="col-sm-12">
                    <select id="ringDevice" class="form-select form-control"></select>
                    <div class="volume-indicator">
                        <div class="meter-ring-preview">
                            <span id="ring-level-preview" class="level-prev"></span>
                        </div>
                    </div>
                    <button class="btn btn-primary mt-2" id="playRingLevel">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-sm-12">
                    <label for="microphoneSrc">Micrófono:</label>
                </div>
                <div class="col-sm-12">
                    <select id="microphoneSrc" class="form-select form-control"></select>
                    <div class="meter-micro-preview">
                        <span id="mic-level-preview" class="level-prev"></span>
                    </div>
                </div>
            </div>
            <!-- <div class="row mb-3">
                <div class="col-12">
                    <label for="video">Video:</label>
                    <video id="local-video-preview" class="previewVideo" muted="" playsinline="" autoplay="" style="transform: rotateY(180deg);"></video>
                </div>
            </div> -->
            <!-- Otras opciones aquí -->
        </div>
    </div>
</div>

<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasDiagnostic"
    aria-labelledby="offcanvasDiagnosticLabel">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasDiagnosticLabel">Panel de Diagnóstico
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
        <div class="container py-4">
            <div class="row g-4">
                <!-- SIP Server Connection -->
                <div class="col-md-6">
                    <div class="card diagnostic-card h-100" id="sip-connection">
                        <div class="card-body text-center">
                            <i class="fas fa-server card-icon"></i>
                            <h5 class="card-title">Conexión Servidor SIP</h5>
                            <p class="card-text status-message">Verificando conexión...</p>
                            <div class="metric-value" id="sip-status"></div>
                        </div>
                    </div>
                </div>

                <!-- Microphone Permission -->
                <div class="col-md-6">
                    <div class="card diagnostic-card h-100" id="mic-permission">
                        <div class="card-body text-center">
                            <i class="fas fa-microphone card-icon"></i>
                            <h5 class="card-title">Permiso de Micrófono</h5>
                            <p class="card-text status-message">Verificando permisos...</p>
                        </div>
                    </div>
                </div>


                <!-- SIP Response Time -->
                <div class="col-md-6">
                    <div class="card diagnostic-card h-100" id="sip-response">
                        <div class="card-body text-center">
                            <i class="fas fa-stopwatch card-icon"></i>
                            <h5 class="card-title">Tiempo de Respuesta SIP</h5>
                            <p class="card-text status-message">Midiendo tiempo de respuesta...</p>
                            <div class="metric-value" id="response-time"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

</div>

<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasPanel" aria-labelledby="offcanvasPanelLabel">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasPanelLabel">Monitor de Calidad de Red
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
        <div id="containerNetworkState"></div>
    </div>
</div>

<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasRecordCall"
    aria-labelledby="offcanvasRecordCallLabel">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasRecordCallLabel">Selección de Momento de la Llamada</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">

        <p>Este temporizador te permite llevar un registro de la duración de la llamada.</p>

        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <h2>En llamada</h2>
                    <div id="timer">00:00</div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-12 text-center">

                    <button id="markMomentBtn" class="btn btn-primary" type="button">
                        <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"
                            style="display: none;"></span>
                        <span class="visually-hidden">Iniciando...</span>
                        <span id="markMomentBtnText">Marcar momento actual</span>
                    </button>

                </div>
            </div>
            <div class="row mt-3 wrapRecordedMoments">

                <div id="wrapRecordedCompletCall" class="col-12 text-center" style="display: none;">
                    <h4 id="statusRecordCall">Llamada completa</h4>

                </div>
                <div class="col-12">
                    <h4>Momentos Grabados</h4>
                    <ul class="list-group" id="recordedMoments">

                    </ul>
                </div>

            </div>
        </div>
    </div>
</div>

<!--Panel de agentes en linea-->
<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasPanelAgents"
    aria-labelledby="offcanvasPanelAgentsLabel">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasPanelAgentsLabel">Asesores
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
        <div class="container-fluid py-3">
            <!-- Header y Filtros -->
            <div class="filter-bar p-2 mb-3">
                <div class="row align-items-center g-2">
                    <div class="col-auto">
                        <h5 class="mb-0">
                            <i class="fas fa-headset me-2 text-primary"></i>
                            Monitor de Agentes
                        </h5>
                    </div>
                    <div class="col-auto">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary active">Todos</button>
                            <button class="btn btn-outline-primary">Disponibles</button>
                            <button class="btn btn-outline-primary">Ocupados</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Grid de Agentes -->
            <div id="agent-grid"></div>
        </div>
    </div>
</div>


</div>

</div>
<audio id="remoteAudioRecording" controls hidden></audio>
<audio id="localAudioRecording" controls hidden></audio>