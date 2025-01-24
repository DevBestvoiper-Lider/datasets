// Función para actualizar el estado visual de una tarjeta
function updateCardStatus(cardId, status, message, details = null) {
  console.log(cardId)
  const card = $(`#${cardId}`);

  // Actualizar clase de la tarjeta
  card.removeClass('status-green-diagnostic status-yellow-diagnostic status-red-diagnostic')
    .addClass(`status-${status}-diagnostic`);

  // Actualizar clase del icono
  const icon = card.find('.card-icon');
  icon.removeClass('text-success text-warning text-danger')
    .addClass(status === 'green' ? 'text-success' :
      status === 'yellow' ? 'text-warning' :
        'text-danger');

  // Actualizar mensaje de estado
  card.find('.status-message').text(message);

  // Actualizar detalles
  if (details) {
    card.find('.metric-value').text(details);
  }
}

// Función para agregar evento al historial
function addHistoryEvent(event) {
  const timestamp = new Date().toLocaleTimeString();
  $('#history-items').prepend(`
      <li class="mb-2">
          <small class="text-muted">${timestamp}</small><br>
          ${event}
      </li>
  `);
}

// Simulación de verificación de conexión SIP

// Simulación de métricas de red
function checkNetworkQuality() {
  // Crear un objeto de estadísticas de WebRTC
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: false, audio: true })
      .then(stream => {
        const pc = new RTCPeerConnection();
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        // Crear una conexión de prueba
        pc.createDataChannel('');
        pc.createOffer().then(offer => pc.setLocalDescription(offer));

        // Monitorear estadísticas de la conexión
        pc.addEventListener('icecandidate', () => {
          pc.getStats(null).then(stats => {
            let totalPacketLoss = 0;
            let totalJitter = 0;
            let totalLatency = 0;
            let statsCount = 0;

            stats.forEach(report => {
              if (report.type === 'inbound-rtp' || report.type === 'outbound-rtp') {
                totalPacketLoss += report.packetsLost || 0;
                totalJitter += report.jitter * 1000 || 0; // Convertir a milisegundos
                totalLatency += report.roundTripTime * 1000 || 0; // Convertir a milisegundos
                statsCount++;
              }
            });

            const latency = totalLatency / statsCount || 0;
            const jitter = totalJitter / statsCount || 0;
            const packetLoss = (totalPacketLoss / (totalPacketLoss + statsCount)) * 100 || 0;

            $('#latency').text(latency.toFixed(2));
            $('#jitter').text(jitter.toFixed(2));
            $('#packet-loss').text(packetLoss.toFixed(2));

            let status = 'green';
            let message = 'Conexión estable';

            if (latency > 80 || jitter > 15 || packetLoss > 1.5) {
              status = 'red';
              message = 'Calidad de red crítica';
            } else if (latency > 50 || jitter > 10 || packetLoss > 0.5) {
              status = 'yellow';
              message = 'Calidad de red moderada';
            }

            updateCardStatus('network-quality', status, message);
          });
        });

        // Cerrar la conexión de prueba
        pc.addEventListener('iceconnectionstatechange', () => {
          if (pc.iceConnectionState === 'closed') {
            pc.close();
          }
        });
      })
      .catch(error => {
        console.error('Error al acceder a los datos de red:', error);
        updateCardStatus('network-quality', 'red', 'Error al medir la calidad de red');
      });
  } else {
    updateCardStatus('network-quality', 'red', 'WebRTC no soportado');
  }
}

// Verificación de permisos de micrófono
async function checkMicrophonePermissionDiagnostic() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());  // Detenemos el stream después de verificar
    updateCardStatus('mic-permission', 'green', 'Micrófono permitido y activo');
  } catch (error) {
    console.error('Error al acceder al micrófono:', error);
    // Verifica si el error es por un permiso denegado
    if (error.name === 'NotAllowedError') {
      updateCardStatus('mic-permission', 'red', 'Error: Permiso de micrófono denegado');
    } else {
      updateCardStatus('mic-permission', 'red', 'Error: No se pudo acceder al micrófono');
    }
    addHistoryEvent('Error al acceder al micrófono');
  }
}
// Verificación de dispositivos de audio



// Verificación de WebRTC
function checkWebRTCStatus() {
  if (navigator.mediaDevices && window.RTCPeerConnection) {
    updateCardStatus('webrtc-status', 'green', 'WebRTC disponible y funcionando');
  } else {
    updateCardStatus('webrtc-status', 'red', 'WebRTC no soportado');
    addHistoryEvent('WebRTC no está soportado en este navegador');
  }
}

function checkSipResponseTime() {
  const ws = phone._transport.socket._ws;

  // Verificar si el WebSocket existe y está en estado abierto
  if (ws && ws.readyState === 1) {
    const startTime = Date.now();
    const targetURI = phone._configuration.uri.toString();

    const options = {
      eventHandlers: {
        succeeded: function (e) {
          const responseTime = Date.now() - startTime;
          let status = 'green';
          let message = 'Tiempo de respuesta óptimo';
          let tooltipText = 'Todo está funcionando correctamente.';

          if (responseTime > 350) {
            status = 'red';
            message = 'Tiempo de respuesta crítico';
            tooltipText = 'El tiempo de respuesta es muy alto y puede afectar la calidad de la conexión SIP.';
          } else if (responseTime > 200) {
            status = 'yellow';
            message = 'Tiempo de respuesta moderado';
            tooltipText = 'Podrían ocurrir pequeñas demoras, pero debería ser utilizable.';
          }

          updateCardStatus('sip-response', status, `${message}: ${responseTime}ms`);
          $('#sip-response').attr('title', tooltipText);
        },
        failed: function (e) {
          console.error("Error en la verificación del servidor SIP");
          updateCardStatus('sip-response', 'red', 'Error: No se pudo contactar al servidor SIP');
          $('#sip-response').attr('title', 'No se pudo conectar al servidor SIP')
        }
      }
    };

    // Enviamos un mensaje de prueba OPTIONS al servidor SIP usando `sendMessage`
    phone.sendMessage(targetURI, 'OPTIONS', options);
  } else {
    // Si el WebSocket no está conectado, actualizar el estado a rojo
    updateCardStatus('sip-response', 'red', 'WebSocket no está disponible');
  }
}


// Función para inicializar todas las verificaciones
function initializeDiagnostics() {
  // Verificaciones iniciales

  checkMicrophonePermissionDiagnostic();


  // Inicializar tooltips de Bootstrap
  const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));

  // Eventos de clic en las tarjetas para mostrar detalles
  $('.diagnostic-card').click(function () {
    const cardId = $(this).attr('id');
    const details = getCardDetails(cardId, phone);

    if (details) {
      showDetailsModal(details);
    }
  });
}
$('#mic-permission').click(function () {
  checkMicrophonePermissionDiagnostic();
});



// Función para obtener detalles específicos de cada tarjeta
function getCardDetails(cardId, ua) {
  const details = {
    'sip-connection': {
      title: 'Detalles de Conexión SIP',
      content: `
            <p><strong>Estado de la conexión con el servidor SIP</strong></p>
            <ul style="list-style: none; padding: 0;">
                ${ua ? `
                    <li title="Último intento de conexión al servidor">
                        <i class="fas fa-clock"></i> <strong>Último intento de conexión:</strong> ${new Date().toLocaleTimeString()}
                    </li>
                    <li title="Indica si el usuario está registrado en el servidor SIP">
                        <i class="fas fa-user-check"></i> <strong>Estado de registro:</strong> 
                        ${ua._registrator._registered ? '<span style="color: green;">Activo</span>' : '<span style="color: red;">Inactivo</span>'}
                    </li>
                    <li title="Indica si hay una conexión activa con el servidor SIP">
                        <i class="fas fa-signal"></i> <strong>Estado de conexión:</strong> 
                        ${ua.isConnected() ? '<span style="color: green;">Conectado</span>' : '<span style="color: red;">Desconectado</span>'}
                    </li>
                    <li title="La URI de registro que se está utilizando en la conexión">
                        <i class="fas fa-link"></i> <strong>URI de registro:</strong> ${ua._configuration.uri.toString()}
                    </li>
                    <li title="El nombre del servidor SIP con el cual se está conectando">
                        <i class="fas fa-server"></i> <strong>Servidor SIP:</strong> ${ua._configuration.hostport_params}
                    </li>
                    <li title="Usuario utilizado para autenticarse en el servidor SIP">
                        <i class="fas fa-user-shield"></i> <strong>Usuario de autenticación:</strong> ${ua._configuration.authorization_user}
                    </li>
                    <li title="El tiempo en segundos antes de que el registro expire y se deba renovar">
                        <i class="fas fa-hourglass-half"></i> <strong>Expiración del registro:</strong> ${ua._configuration.register_expires} segundos
                    </li>
                    <li title="Indica si los temporizadores de sesión están habilitados para mantener la conexión">
                        <i class="fas fa-clock"></i> <strong>Temporizadores de sesión:</strong> ${ua._configuration.session_timers ? '<span style="color: green;">Habilitados</span>' : '<span style="color: red;">Deshabilitados</span>'}
                    </li>
                    <li title="Método de refresco utilizado para actualizar la sesión SIP cuando los temporizadores de sesión están habilitados">
                        <i class="fas fa-sync-alt"></i> <strong>Método de refresco de sesión:</strong> ${ua._configuration.session_timers_refresh_method}
                    </li>
                    <li title="La URL del transporte usado para la conexión con el servidor SIP">
                        <i class="fas fa-network-wired"></i> <strong>Transporte:</strong> ${ua._transport ? ua._transport.socket.url : 'Desconocido'}
                    </li>
                ` : `
                    <li title="No hay conexión con el servidor SIP">
                        <i class="fas fa-exclamation-triangle"></i> <strong>Estado de conexión:</strong> <span style="color: red;">Desconectado</span>
                    </li>
                    <li title="Razón de la desconexión">
                        <i class="fas fa-info-circle"></i> <strong>Razón:</strong> No se pudo establecer la conexión con el servidor SIP.
                    </li>
                `}
            </ul>
        `
    },
    'network-quality': {
      title: 'Detalles de Calidad de Red',
      content: `
              <p>Métricas detalladas de red:</p>
              <ul>
                  <li>Latencia: ${$('#latency').text()}ms</li>
                  <li>Jitter: ${$('#jitter').text()}ms</li>
                  <li>Pérdida de paquetes: ${$('#packet-loss').text()}%</li>
                  <li>RTT promedio: ${Math.floor(Math.random() * 100)}ms</li>
              </ul>
          `
    },
    // Agregar más detalles para otras tarjetas según sea necesario
  };

  return details[cardId];
}

// Función para mostrar modal con detalles
function showDetailsModal(details) {
  // Eliminar modal anterior si existe
  $('.details-modal').remove();

  // Crear y mostrar nuevo modal
  const modalHtml = `
      <div class="modal details-modal" tabindex="-1">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title">${details.title}</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      ${details.content}
                  </div>
              </div>
          </div>
      </div>
  `;

  $(modalHtml).appendTo('body');
  const modal = new bootstrap.Modal(document.querySelector('.details-modal'));
  modal.show();
}

// Iniciar el panel de diagnóstico cuando el documento esté listo
$(document).ready(function () {
  initializeDiagnostics();
});