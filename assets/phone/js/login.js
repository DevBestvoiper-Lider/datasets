/*Login*/
const $agentGrid = $('#agent-grid');
let loginButton = $("#loginButton");
let userLabel = $("#user");

JsSIP.debug.disable("JsSIP:*");
let configuration = null;
let session = null;
let socketAgents = null;
let stunServer = 'stun:158.69.34.91:3478';

let savedSTUN = localStorage.getItem('selectedSTUN');
if (savedSTUN) {
  stunServer = savedSTUN;
  // Si hay un servidor STUN guardado, lo seleccionamos en el select
  $('#stunSelect').val(savedSTUN);
} else {
  // Si no hay un STUN guardado, seleccionamos el predeterminado
  $('#stunSelect').val('stun:global.stun.twilio.com:3478');
}


/* Opciones de JSSIP */
let selectedMicrophone = localStorage.getItem('selectedMicrophone');
let selectedMicrophoneName = localStorage.getItem('selectedMicrophoneName');
if (selectedMicrophoneName) {
  $('.meter-icon').attr('data-tippy-content', selectedMicrophoneName);
}
let callOptions = {
  mediaConstraints: {
    audio: {
      deviceId: selectedMicrophone ? { exact: selectedMicrophone } : undefined,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    },
    video: false,
  },
  pcConfig: {
    iceTransportPolicy: 'relay', // Usar solo TURN para garantizar conectividad
    bundlePolicy: 'balanced', // Permitir más flexibilidad en los flujos RTP
    rtcpMuxPolicy: 'negotiate', // Evitar problemas con multiplexado forzado
    iceServers: [
      {
        urls: 'stun:158.69.34.91:3478' // Servidor STUN sin transporte específico
      },
      {
        urls: 'turn:158.69.34.91:3478', // TURN sin especificar transporte
        username: 'bestvoiper',
        credential: 'Bestvoiper2024*'
      }
    ]
  },
  media: {
    codecs: [
      { name: 'PCMA', channels: 1, clockRate: 8000 },  // G.711 A-law
      { name: 'PCMU', channels: 1, clockRate: 8000 }   // G.711 u-law
    ]
  }
};

// Mostrar o esconder el campo de entrada personalizado según la opción seleccionada
$('#stunSelect').change(function () {
  if ($(this).val() === 'custom') {
    $('#customSTUNContainer').show(); // Mostrar campo de entrada personalizada
  } else {
    $('#customSTUNContainer').hide(); // Ocultar campo de entrada personalizada
  }
});

$('#applySTUNButton').click(function () {
  let selectedSTUN = $('#stunSelect').val();
  if (selectedSTUN === 'custom') {
    selectedSTUN = $('#customSTUNInput').val().trim();
    if (!selectedSTUN) {
      alert("Por favor, ingresa un servidor STUN válido.");
      return;
    }
  }
  localStorage.setItem('selectedSTUN', selectedSTUN);
  // Actualizar la configuración de la llamada
  callOptions = {
    mediaConstraints: {
      audio: {
        deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      },
      video: false,
    },
    pcConfig: {
      iceTransportPolicy: 'relay', // Usar solo TURN para garantizar conectividad
      bundlePolicy: 'balanced', // Permitir más flexibilidad en los flujos RTP
      rtcpMuxPolicy: 'negotiate', // Evitar problemas con multiplexado forzado
      iceServers: [
        {
          urls: 'stun:158.69.34.91:3478' // Servidor STUN sin transporte específico
        },
        {
          urls: 'turn:158.69.34.91:3478', // TURN sin especificar transporte
          username: 'bestvoiper',
          credential: 'Bestvoiper2024*'
        }
      ]
    }
  };
  $('#offcanvasConference').offcanvas('hide');

  Swal.fire({
    icon: 'info',
    title: 'Aplicando cambios...',
    text: 'Por favor, espera un momento.',
    position: 'bottom-right',
    showConfirmButton: false,
    timer: 2000,
    toast: true, // Modo "toast" para hacerlo más pequeño
  }).then(() => {
    // Recargar la página después de mostrar el mensaje
    location.reload();
  });
});


/*Opciones de JSSIP*/

let callOptionsIncomming = {
  extraHeaders: ["X-Foo: foo", "X-Bar: bar"],
  mediaConstraints: {
    audio: {
      deviceId: selectedMicrophone ? { exact: selectedMicrophone } : undefined,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    },
    video: false,
  },
  pcConfig: {
    iceTransportPolicy: 'relay', // Usar solo TURN para garantizar conectividad
    bundlePolicy: 'balanced', // Permitir más flexibilidad en los flujos RTP
    rtcpMuxPolicy: 'negotiate', // Evitar problemas con multiplexado forzado
    iceServers: [
      {
        urls: 'stun:158.69.34.91:3478' // Servidor STUN sin transporte específico
      },
      {
        urls: 'turn:158.69.34.91:3478', // TURN sin especificar transporte
        username: 'bestvoiper',
        credential: 'Bestvoiper2024*'
      }
    ]
  },
};

let storedServer = localStorage.getItem("server");
let storedUsername = localStorage.getItem("sipUsername");
let storedPassword = localStorage.getItem("sipPassword");
let storedName = localStorage.getItem("sipName")

logContainer = $("#status");
loginButton = $("#loginButton");
logoutButton = $("#logoutButton");
// Función para mostrar el formulario de inicio de sesión
function showLogin() {
  $("#wrapLogin").show();
  $("#wrapper").hide();
  setLoginFromValues();
}

// Función para ocultar el formulario de inicio de sesión
function hideLogin() {
  $("#wrapLogin").hide();
  $("#wrapper").show();
}

// Función para establecer los valores del formulario de inicio de sesión desde el almacenamiento local
function setLoginFromValues() {
  $("#server").val(storedServer);
  $("#sipUsername").val(storedUsername);
  $("#sipPassword").val(storedPassword);
}

// Función para iniciar sesión
function login(server, sipUsername, sipPassword) {


  if (localStorage.getItem('sipInstanceActive')) {
    console.log('SIP session already active in another tab');
    $('.floatingButtonWrap').hide()
    return false;
  }

  let selectedMicrophone = localStorage.getItem('selectedMicrophone');
  let selectedMicrophoneName = localStorage.getItem('selectedMicrophoneName');
  if (selectedMicrophoneName) {
    $('.meter-icon').attr('data-tippy-content', selectedMicrophoneName);
  }

  //JsSIP.debug.enable("JsSIP:*");
  userLabel.text("sip:" + sipUsername + "@" + server);
  const socket = new JsSIP.WebSocketInterface(`wss://${server}:8089/ws`);
  configuration = {
    sockets: [socket],
    uri: "sip:" + sipUsername + "@" + server,
    password: sipPassword,
    mediaConstraints: {
      audio: {
        deviceId: selectedMicrophone ? { exact: selectedMicrophone } : undefined,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      },
      video: false,
    },
  };

  // Mark instance as active
  localStorage.setItem('sipInstanceActive', 'true');

  // Clear on window close
  window.addEventListener('beforeunload', () => {
    localStorage.removeItem('sipInstanceActive');
  });

  connectToWS(configuration);
}

if (typeof window.SERVER_CONFIG !== 'undefined') {
  const WS_AGENTS_URL = window.SERVER_CONFIG.WS_AGENTS_URL;
  const jwt_token = localStorage.getItem('jwt_token');
  socketAgents = new WebSocket(WS_AGENTS_URL);
  // Heartbeat
  // const heartbeat = setInterval(() => {
  //   if (socketAgents.readyState === Websocket.OPEN) {
  //     socketAgents.send(JSON.stringify({ type: 'ping' }));
  //   }
  // }, 30000);
  // Elemento para el grid de agentes

  const noAgentsMessage = `
  <div class="alert alert-secondary text-center" role="alert">
      <i class="fas fa-smile-beam fa-2x mb-2"></i>
      <br>No hay asesores conectados en este momento.
      <br>¡Vuelve pronto para ver a tus compañeros!
  </div>`;
  $agentGrid.append(noAgentsMessage);

  // Conexión WebsocketAgents
  socketAgents.onopen = function () {
    // Send initial agent login message
    socketAgents.send(JSON.stringify({
      type: 'agent-login',
      extension: storedUsername,
      name: storedName
    }));
  };
  socketAgents.onmessage = function (event) {
    try {
      const data = JSON.parse(event.data);
      let agents = null
      let filteredAgents = null
      // Suponiendo que los datos de los agentes están en data.agents
      if (data) {
        // Filtrar los agentes para excluir tu propio usuario
        if (data.agents) {
          agents = data.agents;
          filteredAgents = agents.filter(agent => agent.extension !== storedUsername);
        }
        switch (data.type) {
          case 'chat-message':
            $('#containerChatNavbar').show()
            addMessage(data.message, false);
            saveMessageToLocalStorage({
              type: 'chat-message',
              senderId: data.senderId,
              receiverId: storedUsername,
              message: data.message,
              timestamp: new Date().toISOString()
          });
            $('#messageInput').attr('data-extension', data.senderId);
            $('.chatWithAgentLabel').html(data.senderName)
            if (!$('#chatWindow').is(':visible')) {
              unreadCount++;
              updateNotificationBadge();
            }
            break;
          case 'typing':
            showTypingIndicator();
            break;
          case 'stop-typing':
            hideTypingIndicator();
          case 'status-update':
            updateAgentGrid(filteredAgents);
            break;
          case 'make-call':
            // Check if we have required data
            if (!data.agentId) {
              console.error('Missing agentId in make-call event');
              return;
            }

            // Find the agent card and update status
            const $agentCard = $(`.agent-card [data-id="${data.agentId}"]`).closest('.agent-card');
            console.log($agentCard)
            // Update visual status
            $agentCard.find('.status-dot')
              .removeClass('status-online')
              .addClass('status-busy');

            $agentCard.find('.status-label')
              .removeClass('text-success')
              .addClass('text-danger')
              .text('Ocupado');

            // Update buttons state
            $agentCard.find('.send-message, .make-call')
              .prop('disabled', true)
              .addClass('disabled');

            // Optional: Update agents list if provided
            if (data.agents) {
              updateAgentGrid(filteredAgents);
            }
            break;

          case 'call-ended':
            // Reset agent status when call ends
            const $endedCard = $(`.agent-card [data-id="${data.agentId}"]`).closest('.agent-card');

            $endedCard.find('.status-dot')
              .removeClass('status-busy')
              .addClass('status-online');

            $endedCard.find('.status-label')
              .removeClass('text-danger')
              .addClass('text-success')
              .text('Disponible');

            // Re-enable buttons
            $endedCard.find('.send-message, .make-call')
              .prop('disabled', false)
              .removeClass('disabled');
            break;

          case 'error':
            console.error('WebsocketAgents error:', data.message);
            // Show error toast
            const errorToast = `
                <div class="toast bg-danger text-white" role="alert">
                  <div class="toast-body">
                    Error: ${data.message}
                  </div>
                </div>`;
            $('.toast-container').append(errorToast);
            $('.toast').toast('show');
            break;
        }
      } else {
        console.warn('No agents data received');
      }
    } catch (error) {
      console.error('Error processing WebsocketAgents message:', error);
    }
  };
  socketAgents.onerror = function (error) {
    console.error('Error en WebsocketAgents:', error);
  };
  socketAgents.onclose = function (event) {
    console.warn('WebSocket closed, attempting to reconnect...', event);
    // Attempt to reconnect after a delay
    setTimeout(() => {
      socketAgents = new WebSocket(WS_AGENTS_URL);
      // Reattach event handlers
      socketAgents.onopen = this.onopen;
      socketAgents.onmessage = this.onmessage;
      socketAgents.onerror = this.onerror;
      socketAgents.onclose = this.onclose;
    }, 5000); // Reconnect after 5 seconds
  };
  // socketAgents.onclose = function () {
  //   clearInterval(heartbeat);
  //   setTimeout(connectWebsocketAgents, 5000);
  // };

  // Actualizar grid de agentes
  function updateAgentGrid(agents) {
    $agentGrid.empty();

    if (!agents || agents.length === 0) {
      const noAgentsMessage = `
              <div class="alert alert-secondary text-center" role="alert">
                  <i class="fas fa-smile-beam fa-2x mb-2"></i>
                  <br>No hay asesores conectados en este momento.
                  <br>¡Vuelve pronto para ver a tus compañeros!
              </div>`;
      $agentGrid.append(noAgentsMessage);
      return;
    }

    // Contenedor con row y sin gutters
    const $gridContainer = $('<div class="row row-cols-1 row-cols-md-2 g-4">');
    agents.forEach(agent => {
      const statusClass = agent.status === 'disponible' ? 'status-online' : 'status-busy';
      const statusLabel = agent.status === 'disponible' ? 'Disponible' : 'Ocupado';
      const statusTextClass = agent.status === 'disponible' ? 'text-success' : 'text-danger';
      const isDisabled = agent.status === 'ocupado' ? 'disabled' : '';
      const agentCard = `
              <div class="col"> 
                  <div class="agent-card p-3 border rounded shadow-sm h-100">
                      <div class="d-flex align-items-center mb-2">
                          <div class="flex-grow-1">
                              <div class="d-flex justify-content-between align-items-start">
                                  <div>
                                      <h6 class="mb-0 text-truncate">${agent.name || 'Sin nombre'}</h6>
                                      <div class="d-flex align-items-center">
                                          <span class="status-dot ${statusClass} me-2"></span>
                                          <span class="status-label ${statusTextClass}">${statusLabel}</span>
                                      </div>
                                  </div>
                                  <div class="text-end">
                                      <small class="text-muted">${agent.extension}</small>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="d-flex gap-2 justify-content-center mt-2">
                          <button class="btn btn-info btn-sm send-message" data-id="${agent.extension}" data-name="${agent.name || 'Sin nombre'}" ${isDisabled}>
                              <i class="fas fa-comment"></i>
                          </button>
                          <button class="btn btn-success btn-sm make-call" data-id="${agent.extension}" ${isDisabled}>
                              <i class="fas fa-phone-alt"></i>
                          </button>
                      </div>
                  </div>
              </div>`;
      $gridContainer.append(agentCard);
    });
    $agentGrid.append($gridContainer);
  }
  // Filtrar agentes por estado
  $('#filter-buttons button').on('click', function () {
    const filter = $(this).data('filter');
    $('#filter-buttons button').removeClass('active');
    $(this).addClass('active');
    $('.agent-card').each(function () {
      const status = $(this).find('.status-label').text().toLowerCase();
      if (filter === 'all' || status.includes(filter)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });
  // // Enviar acciones a WebsocketAgents
$agentGrid.on('click', '.send-message', function () {
    $('#offcanvasPanelAgents').offcanvas('hide');
    $('#containerChatNavbar').show();
    const extension = $(this).data('id');
    const nombre = $(this).data('name');
    $('#messageInput').attr('data-extension', extension);
    $('.chatWithAgentLabel').html(nombre);
    $('#chatWindow').toggle();

    // Limpiar mensajes anteriores
    $('#chatMessages').empty();

    // Cargar el historial de chat para el agente seleccionado
    loadChatHistory();
});

  $agentGrid.on('click', '.make-call', function () {
    const extension = $(this).data('id');
    automaticCall(extension)
  });
}

// Función para cerrar sesión
function logout() {
  if (phone) {
    sessions.forEach((session) => {
      if (session && typeof session.terminate === "function") {
        try {
          // Intenta terminar la sesión, sin importar su estado
          session.terminate();
        } catch (error) {
          // Maneja errores si no es posible terminar la sesión
          console.error("Error al intentar forzar la terminación:", error);
        }
      }
    });
    localStorage.removeItem("server");
    localStorage.removeItem("sipUsername");
    localStorage.removeItem("sipPassword");
    localStorage.removeItem('sipInstanceActive');
    localStorage.removeItem('chatDatabase');
    
    phone.stop();
  }
}

let alertTimeout;

function handleConnectionStatus(isOnline) {
  if (alertTimeout) {
    clearTimeout(alertTimeout);
  }

  const isMenuCollapsed = localStorage.getItem('templateCustomizer-vertical-menu-template--LayoutCollapsed') === 'true';

  const alertConfig = isOnline ? {
    type: 'success',
    icon: '<i class="fas fa-wifi"></i>',
    text: 'En línea'
  } : {
    type: 'danger',
    icon: `
      <div style="position: relative; display: inline-block;">
        <i class="fas fa-wifi"></i>
        <div style="
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: red;  /* Color de la línea */
          transform: rotate(-45deg);  /* Rotar la línea */
          transform-origin: center;
        "></div>
      </div>
    `,
    text: 'Desconectado'
  }

  const newAlert = $(`
    <div class="alert alert-${alertConfig.type} m-0 border-0 rounded-0">
      <div class="d-flex align-items-center justify-content-center">
        <div class="me-2 fs-6">${alertConfig.icon}</div>
        ${!isMenuCollapsed ? `<div class="fs-6">${alertConfig.text}</div>` : ''}
      </div>
    </div>
  `);

  $('#alertDisconnected').empty().append(newAlert);

  if (isOnline) {
    alertTimeout = setTimeout(() => {
      newAlert.fadeOut(() => newAlert.remove());
    }, 2000);
  }
}

// Event listeners
window.addEventListener('online', () => handleConnectionStatus(true));
window.addEventListener('offline', () => handleConnectionStatus(false));