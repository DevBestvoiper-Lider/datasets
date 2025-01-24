
let phone;
let isDND = false;
let isAA = false;
let userRemoteExtension = null;
let loadCallHistoryInit = false;
let causeCall = "Desconocido";
let statsManager;
let activeNotifications = [];
let callTaked = false;

// Referencias DOM ALERTA DESCONEXIÓN
const statusAlert = document.getElementById('statusAlert');
const statusText = document.getElementById('statusText');

// Inicialización del contexto de Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let noiseReductionGainNode;
const incomingCallSound = new Audio("assets/phone/sounds/ringtone.mp3");

// Función para configurar la reducción de ruido en el flujo remoto
function setupNoiseReduction(stream) {
  const source = audioContext.createMediaStreamSource(stream);

  // Nodo de ganancia para ajustar el nivel de reducción de ruido
  noiseReductionGainNode = audioContext.createGain();
  noiseReductionGainNode.gain.value = 0.5; // Nivel de reducción inicial (50%)

  // Conectar el flujo de audio al contexto y aplicar el nodo de ganancia
  source.connect(noiseReductionGainNode).connect(audioContext.destination);
}

function statusCall(status) {
  $("#statusCall").html(status);
}
function createParticipantHTML(extension, name = 'Usuario') {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return $(`
      <li class="conference-participant" data-extension="${extension}">
          <div class="conference-participant-avatar">
              ${initials}
              <div class="conference-participant-status-badge calling"></div>
          </div>
          <div class="conference-participant-details">
              <h6 class="conference-participant-name">${name}</h6>
              <div class="conference-participant-extension">
                  <i class="fas fa-phone-alt me-1"></i>
                  ${extension}
              </div>
              <div class="conference-participant-status">
                  <span class="badge bg-warning dinamicStatusConference">Llamando...</span>
              </div>
          </div>
          <div>
              <span class="conference-participant-timer text-muted">00:00</span>
              <button class="btn btn-outline-danger btn-sm btn-end-call" data-extension="${extension}">
                  <i class="fas fa-phone-slash"></i>
              </button>
          </div>
      </li>
  `);
}

// Función mejorada para actualizar el estado
window.statusCallConference = function (extension, status) {
  const foundSession = sessions.find(function (session) {
    return session.remote_identity.uri.user === extension;
  });

  if (foundSession) {
    const $listItem = $(`[data-extension="${extension}"]`);
    if ($listItem.length) {
      const $statusBadge = $listItem.find('.dinamicStatusConference');
      const $statusIndicator = $listItem.find('.status-badge');
      const $timer = $listItem.find('.conference-participant-timer');
      $statusBadge.text(status);

      // Actualizar estilo según el estado
      if (status === 'Llamada aceptada') {
        $listItem.addClass('active').removeClass('calling');
        $statusBadge.removeClass('bg-warning').addClass('bg-success');
        $statusIndicator.removeClass('calling').addClass('online');

        closeAllNotifications()
        stopIncomingCallSound()
        // Iniciar temporizador
        startTimerConference($timer);
      } else if (status === 'Llamando...') {
        $listItem.addClass('calling').removeClass('active');
      }
    }
  }
};

// Función para manejar el temporizador
function startTimerConference($timer) {
  let seconds = 0;

  // Limpiar temporizador anterior si existe
  const oldTimer = $timer.data('timerId');
  if (oldTimer) clearInterval(oldTimer);

  const timer = setInterval(function () {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    // Actualizar solo el texto del temporizador, sin sobrescribir el HTML innecesariamente
    $timer.html("<strong>" + String(minutes).padStart(2, '0') + ":" + String(remainingSeconds).padStart(2, '0') + "</strong>");

  }, 1000);

  $timer.data('timerId', timer);
}

// Función para actualizar el contador de participantes
function updateParticipantCount() {
  const count = $('.participant-card').length;
  $('#participantCount').text(count);
}


// Event Handler para el botón de colgar (usando delegación de eventos)
$('#listExtension').on('click', '.btn-end-call', function () {
  const $listItem = $(this).closest('.participant-card');
  const extension = $(this).data('extension');
  const $timer = $listItem.find('.call-timer');

  // Limpiar el temporizador
  const timerId = $timer.data('timerId');
  if (timerId) clearInterval(timerId);
  sessions.forEach((session) => {
    let sessionDest = session.remote_identity._uri._user; // Obtener el número de la sesión
    sessionDest = parseInt(sessionDest.replace(/'+/g, ''), 10)
    if (sessionDest == extension) {
      // Si la sesión coincide con el número de destino, colgarla
      session.terminate();
      // Encontrar y remover el participante de la lista
      const $participantToRemove = $(`#listExtension .participant-card[data-extension="${extension}"]`);
      if ($participantToRemove.length) {
        $participantToRemove.fadeOut(300, function () {
          $(this).remove();
          updateParticipantCount();
        });
      }
    }
  });

  $listItem.fadeOut(300, function () {
    $(this).remove();
    updateParticipantCount();
  });
});

// Event Handler para el input (permite Enter)
$('#inputExtToConference').on('keypress', function (e) {
  if (e.which === 13) {
    $('#btnAddToConference').click();
  }
});
// Función para agregar un nuevo participante
window.addExtension = function (type, extension) {
  const $newParticipant = createParticipantHTML(extension);
  $('#listExtension').append($newParticipant);

  // Actualizar estado del nuevo participante
  window.statusCallConference(extension, type);

  // Actualizar contador de participantes
  updateParticipantCount();
};

function addUserToCallerIdInfo(callerId) {
  let currentUser = $("#callerId").text();
  let callers = currentUser ? currentUser.split(', ') : [];

  // Only add if not already in the list
  if (!callers.includes(callerId)) {
    if (currentUser !== "") {
      $("#callerId").text(currentUser + ', ' + callerId);
    } else {
      $("#callerId").text(callerId);
    }
  }
}

function addToCounterConference() {

  let numberOfElements = $('#listExtension').children().length;
  // Increment the value of the span inside the badge
  let span = $('#counterConference');
  span.text(numberOfElements);
  $('#participantCount').text(numberOfElements);
}
// Función para conectar con el WebSocket
function connectToWS(configuration) {
  if (configuration && configuration.uri && configuration.password) {
    JsSIP.debug.enable("JsSIP:*"); // more detailed debug output
    phone = new JsSIP.UA(configuration);
    log.setLevel("debug");
    // WebSocket connection events
    phone.on("connecting", function (ev) {
      statusCall("Connectando");
    });
    phone.on("connected", function (ev) {
      statusCall("Connectado");
      checkSipResponseTime();
    });
    phone.on("disconnected", function (ev) {
      statusCall("Desconectado");
    });
    // SIP registration events
    phone.on("unregistered", function (ev) {
      statusCall("sin registrar");
      showLogin();
      $("#status").text("");
      $("#callControl").hide();
      updateCardStatus('sip-connection', 'yellow', 'Desconectado del servidor SIP');
    });
    phone.on("registered", async function (ev) {
      $("#to").show();
      $("#incomming").hide();
      statusCall("En linea");
      $("#mobile-status-icon")
        .css("color", "green")
        .removeClass("fa-phone-slash")
        .addClass("fa-mobile-retro");
      hideLogin();
      loadCallHistory();
      updateCardStatus('sip-connection', 'green', 'Conexión estable con el servidor');
      addHistoryEvent('Conexión SIP establecida exitosamente');
      $("#callControl").show();

      // const savedCall = JSON.parse(sessionStorage.getItem('activeCall'));
      // if (savedCall) {
      //   try {
      //     $('.meter-icon').attr('data-tippy-content', selectedDeviceId);
      //     console.log('Attempting to recover session:', savedCall);
      //     // Create new call with original remote URI
      //     const session = phone.call(savedCall.remoteUri, {
      //       sessionTimers: true,
      //       mediaConstraints: {
      //         audio: {
      //           deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
      //           echoCancellation: true,
      //           noiseSuppression: true,
      //           autoGainControl: true
      //         },
      //         video: false,
      //       },
      //       extraHeaders: [`X-Recover-Call-ID: ${savedCall.callId}`]
      //     });

      //     session.on('confirmed', () => {
      //       console.log('Session confirmed, attempting media renegotiation');

      //       sessions.pop();
      //       // Store new session
      //       sessions.push(session);
      //       sessionStorage.removeItem('activeCall');

      //       // Add delay before putting call on hold
      //       setTimeout(() => {
      //         session.hold()
      //           .then(() => {
      //             // Update UI to show call is on hold
      //             $('#holdButton')
      //               .find("i")
      //               .removeClass("fa-circle-pause")
      //               .addClass("fa-circle-play");
      //             $('#holdButton')
      //               .removeClass("btn-light")
      //               .addClass("btn-success");
      //             console.log('Call placed on hold successfully');
      //           })
      //           .catch(error => {
      //             console.error('Failed to put call on hold:', error);
      //           });
      //       }, 1500); // 1.5 second delay

      //     });

      //     session.on('failed', (e) => {
      //       console.error('Session recovery failed:', e);
      //       sessionStorage.removeItem('activeCall');
      //     });

      //   } catch (error) {
      //     console.error('Error recovering session:', error);
      //     sessionStorage.removeItem('activeCall');
      //   }
      // }
    });
    phone.on("registrationFailed", function (ev) {
      statusCall("Error en el registro");
      logout();
      updateUI();
      updateCardStatus('sip-connection', 'red', 'Error de conexión con el servidor SIP');
    });
    phone.on("newRTCSession", function (ev) {
      var newSession = ev.session;

      monitorConnectionQuality(newSession);
      sessions.push(newSession);
      userRemoteExtension = ev.session.remote_identity.uri.user;

      $('#toField').hide()

      if (ev.originator === "local") {
        stateCall = "Saliente";
        statusCall("Llamada saliente");
        //socketAgents.send(JSON.stringify({ type: 'status-update', agentId: String(storedUsername), status: "ocupado" }));
      } else {


        if (isDND) {
          session?.terminate({
            status_code: 486,
            reason_phrase: "DND",
          });
        } else {

          stateCall = "Entrante";
          statusCall("Llamada entrante");
          // socketAgents.send(JSON.stringify({ type: 'status-update', agentId: String(storedUsername), status: "ocupado" }));
          document.title = "¡Llamada entrante!";
          const favicon = document.querySelector("link[rel='icon']");
          favicon.href = "assets/phone/images/incomming-call.ico";

          currentNotification = notify(
            "!Alerta!",
            "LLamada entrante de: " + ev.session.remote_identity.uri.user
          );

          $("#connectCall").hide();
          //mostrar teclado, ocultar vista de contestar llamada

          $("#to").hide();
          $("#incommingCallerId").text(ev.session.remote_identity.uri.user);
          $("#phone-options").hide();

          openFloatingWindowPhone()



          if (isAA) {
            closeAllNotifications()
            stopIncomingCallSound()
            sessions.forEach((session) => {
              session.answer(callOptions);
              if (typeof currentNotification !== 'undefined' && currentNotification) {
                // Cerrar la notificación actual
                currentNotification.close();
                alert("Notificación closed");
                currentNotification = null; // Limpiar la referencia a la notificación
              }
              addStreams();
            });
            statusCall("Llamada entrante, aceptando...");

          } else {
            $("#incomming").show();
            statusCall("¡Llamada entrante!");
            // Reproducir un sonido para la llamada entrante
            incomingCallSound.loop = true; // Hacer que el sonido se repita
            incomingCallSound.play().catch(err => {
              console.error("Error reproduciendo el sonido:", err);
            });
          }
        }
      }
      // session handlers/callbacks
      sessions.forEach((session) => {
        const ext = session.remote_identity.uri.user;
        session.on("peerconnection", function (e) {
          statusCall("Conexión Establecida");
        });
        session.on("connecting", function (e) {
          $('#reCallButton').css({
            'pointer-events': 'none',
            'opacity': '0.5'
          })
          $('#clearFieldButton').css({
            'pointer-events': 'none',
            'opacity': '0.5'
          })
          statusCall("Llamando a: " + ext);
          $("#wrapOptions").show();
          $("#connectCall").animate({
            opacity: 0, // Hacer que la opacidad sea 0 para que desaparezca gradualmente
          }, 500, function () {
            $("#connectCall").css('opacity', 1).hide()
            $("#btnRejectCall").show();
          });
          //$("#btnRejectCall").show();
          statusCallConference(ext, "Llamando...")
        });
        session.on("process", function (e) {
          statusCall("Procesando Llamada");
        });
        session.on("ended", function (e) {
          causeCall = e.cause;
          statusCall("Llamada Finalizada");
          sessionStorage.removeItem('currentSession');
          if (socketAgents.readyState === WebSocket.OPEN) {
            socketAgents.send(JSON.stringify({ type: 'status-update', agentId: String(storedUsername), status: "disponible" }));
          } else {
            socketAgents.addEventListener('open', function onOpen() {
              socketAgents.send(JSON.stringify({ type: 'status-update', agentId: String(storedUsername), status: "disponible" }));
              socketAgents.removeEventListener('open', onOpen);
            });
          }
          $('#reCallButton').css({
            'pointer-events': 'auto',
            'opacity': '1'
          });
          $('#clearFieldButton').css({
            'pointer-events': 'auto',
            'opacity': '1'
          });

          statusCallConference(ext, "Llamada finalizada");
          causeCall = e.cause;
          completeSession(ext);
          statsManager.stop();

          activeNotifications = activeNotifications.filter((n) => n !== notification);
          stopIncomingCallSound();

          // Mapeo de mensajes claros para el evento "ended"
          const messages = {
            'Completed': 'La llamada se completó correctamente.',
            'Canceled': 'La llamada fue cancelada antes de ser contestada.',
            'Unavailable': 'El número llamado no está disponible.',
            'Busy': 'El destinatario está ocupado.',
            'No Answer': 'El destinatario no respondió a la llamada.',
            'Failed': 'La llamada falló inesperadamente.',
            'Unknown Cause': 'La llamada terminó por una causa desconocida.'
          };

          // Mensaje predeterminado
          const message = messages[causeCall] || 'La llamada ha finalizado.';

          // Mostrar alerta con SweetAlert
          Swal.fire({
            html: message,
            icon: 'info',  // Puedes ajustar el icono según el mensaje
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            toast: true,
            customClass: {
              popup: 'swal2-toast swal2-high-zindex'
            }
          });
        });
        session.on('peerconnection:setremotedescriptionfailed', () => {
          handleRenegotiation(session);
        });
        session.on("failed", function (e) {
          const response = e.message; // Mensaje SIP completo
          const statusCode = e
          currentCall = e.cause;
          // Mapear la causa a mensajes claros
          const messages = {
            // Errores comunes
            'Not Found': 'El número no existe (404).',
            'Unavailable': 'El número está temporalmente inaccesible (503).',
            'Busy': 'El destinatario está ocupado (486).',
            'Rejected': 'La llamada fue rechazada por el destinatario.',
            'Canceled': 'La llamada fue cancelada antes de ser contestada.',
            'Failed': 'Hubo un problema al intentar realizar la llamada.',
            'Service Unavailable': 'El número está fuera de servicio (503).',
            'Server Internal Error': 'Error interno del servidor (500).',
            'Invalid URI': 'La marcación es incorrecta. Por favor, verifica el número ingresado.',
            'Sip Failure Code': 'No disponible temporalmente (503)',
            // Errores relacionados con tiempo de espera
            'Request Timeout': 'La solicitud expiró (408). El destinatario no respondió.',
            'Timeout': 'La llamada no pudo completarse debido a un tiempo de espera prolongado.',

            // Errores de autenticación y permisos
            'Unauthorized': 'No autorizado (401). Verifica tus credenciales SIP.',
            'Forbidden': 'Acceso denegado (403). No tienes permiso para realizar esta llamada.',

            // Problemas de red
            'Address Incomplete': 'La dirección de destino está incompleta (484).',
            'Temporarily Unavailable': 'El número no está disponible temporalmente (480).',
            'Network Error': 'Error en la red. Por favor, verifica tu conexión.',

            // Errores específicos de dispositivos
            'Busy Here': 'El dispositivo del destinatario está ocupado (486).',
            'Request Terminated': 'La solicitud fue terminada antes de completarse (487).',

            // Errores del servidor
            'Bad Gateway': 'Puerta de enlace incorrecta (502).',
            'Version Not Supported': 'El servidor no soporta la versión requerida (505).',
            'Not Acceptable Here': 'El destino no acepta la llamada en el formato solicitado (488).',

            // Errores del cliente
            'Bad Request': 'Solicitud incorrecta (400). Verifica el formato del número marcado.',
            'Gone': 'El número ya no está disponible (410).',

            // Errores de compatibilidad
            'Unsupported Media Type': 'El servidor no admite el formato multimedia solicitado (415).',
            'Unsupported URI Scheme': 'El esquema de URI no es compatible (416).',

            'User Denied Media Access': 'El usuario denegó el acceso al micrófono. Revisa los permisos del navegador.',

            // Errores de capacidad
            'Too Many Hops': 'Se excedió el límite de saltos en la red (483).',
            'Temporarily Overloaded': 'El servidor está temporalmente sobrecargado (503).',

            // Casos generales y desconocidos
            'Unknown Cause': 'Se produjo un error desconocido. Por favor, intenta nuevamente.',
            'Unknown Response': 'El servidor devolvió una respuesta no especificada.'
          };
          causeCall = e.cause;

          // Obtener el mensaje claro o usar un mensaje genérico
          const message = messages[causeCall] || 'Ocurrió un error inesperado durante la llamada.';


          // Mostrar la alerta con el mensaje claro
          Swal.fire({
            html: message,        // Muestra el mensaje claro
            icon: 'error',        // Tipo de alerta
            position: 'bottom-end',  // Posiciona la alerta en la esquina inferior derecha
            showConfirmButton: false, // Oculta el botón de confirmación
            timer: 3000,          // Duración de la alerta (3 segundos)
            toast: true,          // Estilo "toast"
            customClass: {
              popup: 'swal2-toast swal2-high-zindex'
            }
          });
          statusCall("Llamada Fallida", causeCall);
          statusCallConference(ext, "Llamada fallida")
          $("#mobile-status-icon")
            .removeClass("fa-mobile-retro")
            .addClass("fa-phone-slash")
            .css("color", "red");

          if (sessions.length == 1) {
            sessions = []
            $("#listExtension").html("")
          }

          setTimeout(() => {
            let listItem = $("#listExtension")
              .find("[data-extension='" + e + "']")
              .closest(".list-group-item");
            listItem.remove();

            completeSession(e);
          }, 1000);

          $('#reCallButton').css({
            'pointer-events': 'auto',
            'opacity': '1'
          });
          $('#clearFieldButton').css({
            'pointer-events': 'auto',
            'opacity': '1'
          })
        });

        session.on("accepted", function (e) {
          statusCall("Llamada Aceptada");
          currentCall = "answer";
          const activeSession = sessions[sessions.length - 1];
          // sessionStorage.setItem('activeCall', JSON.stringify({
          //   remoteUri: activeSession.remote_identity.uri.toString(),
          //   callId: activeSession.id,
          //   sdp: activeSession.remote_sdp?.toString()
          // }));
          statusCallConference(ext, "Llamada aceptada")
          addToCounterConference()
          updateUI();
          $('#btnOpenOffcanvasPanel').show()
          let callerId = session.remote_identity.uri.user;
          addUserToCallerIdInfo(callerId)

          activeNotifications = activeNotifications.filter((n) => n !== notification);
          stopIncomingCallSound()

        });
        session.on("confirmed", function (e) {
          // localStorage.setItem('active_call', JSON.stringify({
          //   session_id: session.id,
          //   remote_identity: session.remote_identity.uri.toString(),
          // }));
          statusCall("Llamada Confirmada");
          const localStreams = session.connection.getLocalStreams()[0];
          statusCall("number of local streams: " + localStreams.length);

          const remoteStreams = session.connection.getRemoteStreams()[0];

          if (remoteStreams) {
            setupNoiseReduction(remoteStreams);
          }


          //statusCall("number of remote streams: " + remoteStreams.length);
          statusCall("Llamada en progreso");
          updateUI();
          ({ statsManager } = initializeNetworkStats(session));
          //addExtension("Name", session.remote_identity.uri.user);
        });

        session.on("newInfo", function (data) {
          const customHeader = data.request.getHeader("X-MyCustom-Message");
        });

        //Llamada entrante.
        // Llamada entrante.
        if (session.direction === "incoming") {
          // Crear la notificación estándar del navegador

          //si isDND es true, no entran llamada, estária en modo no molestar




          const notification = new Notification(
            "¡Atención! Nueva llamada entrante",
            {
              body: "Llamada de: " + ev.session.remote_identity.uri.user +
                "\nHaz clic para responder.",
              icon: "assets/phone/images/incomming-call.ico" // Si lo deseas, puedes agregar un icono
            }
          );

          // Asignar acción al hacer clic en la notificación
          notification.onclick = function () {
            // Si está en modo No Molestar (DND), termina la llamada
            if (isDND) {
              session.terminate({
                status_code: 486,
                reason_phrase: "DND",
              });
            } else {
              // Responde la llamada independientemente de si es AA o no
              session.answer();
              statusCall("Llamada entrante, contestando...");
            }
            // Cerrar la notificación inmediatamente después de hacer clic
            notification.close();
          };

          // Ocultar la notificación después de 30 segundos
          setTimeout(() => {
            notification.close();
            activeNotifications = activeNotifications.filter((n) => n !== notification);
            stopIncomingCallSound()

          }, 10000);

          activeNotifications.push(notification);

          // Si está en modo No Molestar, la llamada es rechazada sin mostrar la notificación

        }

      });
    });
    phone.start();

  }
}

//Función que actualiza la vista dependiendo de los cambios que sucedan con la sessión.
function updateUI() {
  if (configuration && configuration.uri && configuration.password) {
    $("#wrapLogin").hide();
    $("#wrapper").show();

    if (sessions && sessions.length > 0) {
      sessions.forEach((session) => {

        if (session) {
          const ext = session.remote_identity.uri.user;
          //statusCall("valid session");
          if (session.isInProgress()) {
            if (session.direction === "incoming" && callTaked == false) {
              statusCall("¡Llamada entrante!");

              $("#incomingCallNumber").html(session.remote_identity.uri);
              //$("#incomingCall").show();
              $("#callControl").hide();
            } else if (session.direction === "incoming" && callTaked == true) {
              session.answer(callOptionsIncomming);
              deleteRowByUserId(userId);
            } else {
              statusCall("Timbrando...");
              statusCallConference(ext, "Timbrando...")
              $("#callInfoText").html("Timbrando...");
              $("#mobile-status-icon")
                .removeClass("fa-phone-slash")
                .removeClass("fa-mobile-retro")
                .addClass("fa-phone-volume")
                .css("color", "green");
              $("#callInfoNumber").html(session.remote_identity.uri.user);

              $("#connectCall").hide();
              $("#btnRejectCall").hide();
              //$("#callStatus").show();
            }
          } else if (session.isEstablished()) {
            if (session.direction === 'incoming') {
              session.hold()
              setTimeout(() => {
                session.unhold()
              }, 500);
            }
            $("#dinamicStatusConference").html("¡Llamada en progreso!");


            $("#mobile-status-icon")
              .removeClass("fa-phone-slash")
              .addClass("fa-phone-volume")
              .css("color", "green");
            $("#incomingCall").hide();
            $("#phone-options").hide();

            //ocultar el input de escribir.
            $(".wrapInputCall").hide();

            //$("#inCallButtons").show();



            incomingCallAudio.pause();

            $("#wrapOptions").show();



            $("#to").show();

            $("#incomming").hide();


            $("#optionsInCall").show();
            $("#wrapCallerId").show();
            $("#wrapTimerId").show();


            // Iniciar el temporizador
            startTimer();
            $("#info-micro").removeClass("align-left");

            //$("#callControl").hide();
          }
        } else {
          $("#incomingCall").hide();
          $("#callControl").show();
          $("#callStatus").hide();
          $("#inCallButtons").hide();
          incomingCallAudio.pause();
          $("#info-micro").addClass("align-left");
        }
        // Icono de micrófono silenciado
        if (session && session.isMuted().audio) {
          $("#mute i")
            .addClass("fa-microphone-slash")
            .removeClass("fa-microphone");
        } else {
          $("#mute i")
            .removeClass("fa-microphone-slash")
            .addClass("fa-microphone");
        }
      });

    }
  } else {
    $("#wrapper").hide();
    $("#wrapLogin").show();
  }
}

function loadCallHistory() {
  loadCallHistoryInit = true;

  // Get existing call history from localStorage
  let callHistory = getCallHistory();
  if (Object.keys(callHistory).length === 0) {
    const calltag =
      '<li class="list-group-item text-muted">El historial de llamadas está vacío</li>';
    $("#call-history").html(calltag);
  } else {
    callHistory.forEach(function (call) {
      addCall(call);
    });
    updateCallHistorySummary(callHistory);
  }
}

function updateCallHistorySummary(callHistory) {
  const causeCounts = callHistory.reduce((acc, call) => {
    const cause = call.cause || 'Sin causa';
    acc[cause] = (acc[cause] || 0) + 1;
    return acc;
  }, {});

  const dailyCounts = callHistory.reduce((acc, call) => {
    const date = new Date(call.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { Entrante: 0, Saliente: 0 };
    }
    if (call.type === 'Entrante' || call.type === 'Saliente') {
      acc[date][call.type]++;
    }
    return acc;
  }, {});

  const causeColors = {
    'User Denied Media Access': 'bg-danger',
    'Sin causa': 'bg-secondary',
    'Terminated': 'bg-success',
    'Rejected': 'bg-warning',
    'Canceled': 'bg-info'
  };

  let summaryHtml = '<ul class="list-group">';
  for (const [cause, count] of Object.entries(causeCounts)) {
    const colorClass = causeColors[cause] || 'bg-primary';
    let causeInSpanish;

    switch (cause) {
      case 'User Denied Media Access':
        causeInSpanish = 'Acceso a medios denegado por el usuario';
        break;
      case 'Sin causa':
        causeInSpanish = 'Sin causa';
        break;
      case 'Terminated':
        causeInSpanish = 'Terminada';
        break;
      case 'Rejected':
        causeInSpanish = 'Rechazada';
        break;
      case 'Canceled':
        causeInSpanish = 'Cancelada';
        break;
      case 'Busy':
        causeInSpanish = 'Ocupado';
        break;
      case 'SIP Failure Code':
        causeInSpanish = 'No disponible';
        break;
      default:
        causeInSpanish = cause;
    }

    summaryHtml += `<li class="list-group-item d-flex justify-content-between align-items-center">
                      ${causeInSpanish}
                      <span class="badge ${colorClass}">${count}</span>
                    </li>`;
  }
  summaryHtml += '</ul>';

  summaryHtml += '</ul><br><h5>Llamadas por día</h5><ul class="list-group">';
  for (const [date, counts] of Object.entries(dailyCounts)) {
    summaryHtml += `<li class="list-group-item">
                      ${date}: Entrantes - ${counts.Entrante}, Salientes - ${counts.Saliente}
                    </li><br>`;
  }
  summaryHtml += '</ul>';

  $("#call-history-summary").html(summaryHtml);
}

function formatDuration(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;
  var duration = "";
  if (minutes > 0) {
    duration += minutes + "m ";
  }
  duration += remainingSeconds + "s";
  return duration;
}

function addCall(call) {
  const callStatuses = {
    answer: {
      message: "Recibiste una audio llamada",
      icon: '<i class="fas fa-phone-volume"></i>',
      color: "text-success",
      badge: "text-success"
    },
    call: {
      message: "Hiciste una audio llamada",
      icon: '<i class="fas fa-phone"></i>',
      color: "text-primary",
      badge: "text-primary"
    },
    hangup: {
      message: "Llamada finalizada",
      icon: '<i class="fas fa-phone-slash"></i>',
      color: "text-danger",
      badge: "text-danger"
    },
    reject: {
      message: "Llamada rechazada",
      icon: '<i class="fas fa-times-circle"></i>',
      color: "text-warning",
      badge: "text-warning"
    },
    missed: {
      message: "Perdiste una llamada",
      icon: '<i class="fas fa-phone-slash"></i>',
      color: "text-danger",
      badge: "text-danger"
    },
    voicemail: {
      message: "Correo de Voz",
      icon: '<i class="fas fa-voicemail"></i>',
      color: "text-info",
      badge: "text-info"
    },
    busy: {
      message: "Llamada ocupada",
      icon: '<i class="fas fa-user-times"></i>',
      color: "text-warning",
      badge: "text-warning"
    },
    no_answer: {
      message: "Llamada sin respuesta",
      icon: '<i class="fas fa-phone-slash"></i>',
      color: "text-muted",
      badge: "text-muted"
    },
    canceled: {
      message: "Llamada cancelada",
      icon: '<i class="fas fa-phone-slash"></i>',
      color: "text-danger",
      badge: "text-danger"
    }
  };

  const callCauses = {
    Terminated: {
      message: "Llamada terminada",
      icon: '<i class="fas fa-check-circle text-success"></i>',
      color: "text-success",
      badge: "bg-success"
    },
    Rejected: {
      message: "Llamada rechazada",
      icon: '<i class="fas fa-ban text-danger"></i>',
      color: "text-danger",
      badge: "bg-danger"
    },
    "No Answer": {
      message: "Llamada sin respuesta",
      icon: '<i class="fas fa-phone-slash text-muted"></i>',
      color: "text-muted",
      badge: "bg-secondary"
    },
    Busy: {
      message: "Llamada ocupada",
      icon: '<i class="fas fa-user-times text-warning"></i>',
      color: "text-warning",
      badge: "bg-warning"
    },
    Canceled: {
      message: "Llamada cancelada",
      icon: '<i class="fas fa-phone-slash text-danger"></i>',
      color: "text-danger",
      badge: "bg-danger"
    },
    "Not Found": {
      message: "Número no encontrado",
      icon: '<i class="fas fa-exclamation-circle text-danger"></i>',
      color: "text-danger",
      badge: "bg-danger"
    },
    Failed: {
      message: "Llamada fallida",
      icon: '<i class="fas fa-times-circle text-danger"></i>',
      color: "text-danger",
      badge: "bg-danger"
    },
    "Network Error": {
      message: "Error de red",
      icon: '<i class="fas fa-exclamation-triangle text-warning"></i>',
      color: "text-warning",
      badge: "bg-warning"
    }
  };

  let status = callStatuses[call.type] || callStatuses.call;
  if (call.cause in callCauses) {
    status = callCauses[call.cause];
  } else {
    status = callStatuses[call.type] || callStatuses.call;
  }

  const callTime = call.timestamp instanceof Date && !isNaN(call.timestamp)
    ? call.timestamp
    : new Date();

  const timeFormatter = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
  const now = new Date();
  const diffInHours = (now - callTime) / (1000 * 60 * 60);

  let formattedTime;
  if (diffInHours < 24) {
    formattedTime = callTime.toLocaleTimeString("es", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  } else {
    formattedTime = timeFormatter.format(-Math.floor(diffInHours / 24), 'day');
  }

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    if (minutes === 0) {
      return `${seconds} segundos`;
    } else {
      return `${minutes} minutos ${seconds} segundos`;
    }
  };

  let callMessage = status.message;
  if (call.type === "answer" || call.type === "call") {
    callMessage += `, y hablaste durante ${formatDuration(call.duration)}`;
  } else if (call.type === "missed" || call.type === "canceled") {
    callMessage += ` (${call.cause})`;
  }

  const messagesTranslated = {
    // Errores comunes
    'Not Found': 'El número no existe (404).',
    'Unavailable': 'El número está temporalmente inaccesible (503).',
    'Busy': 'El destinatario está ocupado (486).',
    'Rejected': 'La llamada fue rechazada por el destinatario.',
    'Canceled': 'La llamada fue cancelada antes de ser contestada.',
    'Failed': 'Hubo un problema al intentar realizar la llamada.',
    'Service Unavailable': 'El número está fuera de servicio (503).',
    'Server Internal Error': 'Error interno del servidor (500).',
    'Invalid URI': 'La marcación es incorrecta. Por favor, verifica el número ingresado.',
    'Terminated': 'La llamada fue terminada.',
    'Sip Failure Code': 'No disponible temporalmente (503)',
    // Errores relacionados con tiempo de espera
    'Request Timeout': 'La solicitud expiró (408). El destinatario no respondió.',
    'Timeout': 'La llamada no pudo completarse debido a un tiempo de espera prolongado.',

    // Errores de autenticación y permisos
    'Unauthorized': 'No autorizado (401). Verifica tus credenciales SIP.',
    'Forbidden': 'Acceso denegado (403). No tienes permiso para realizar esta llamada.',

    // Problemas de red
    'Address Incomplete': 'La dirección de destino está incompleta (484).',
    'Temporarily Unavailable': 'El número no está disponible temporalmente (480).',
    'Network Error': 'Error en la red. Por favor, verifica tu conexión.',

    // Errores específicos de dispositivos
    'Busy Here': 'El dispositivo del destinatario está ocupado (486).',
    'Request Terminated': 'La solicitud fue terminada antes de completarse (487).',

    // Errores del servidor
    'Bad Gateway': 'Puerta de enlace incorrecta (502).',
    'Version Not Supported': 'El servidor no soporta la versión requerida (505).',
    'Not Acceptable Here': 'El destino no acepta la llamada en el formato solicitado (488).',

    // Errores del cliente
    'Bad Request': 'Solicitud incorrecta (400). Verifica el formato del número marcado.',
    'Gone': 'El número ya no está disponible (410).',

    // Errores de compatibilidad
    'Unsupported Media Type': 'El servidor no admite el formato multimedia solicitado (415).',
    'Unsupported URI Scheme': 'El esquema de URI no es compatible (416).',

    'User Denied Media Access': 'El usuario denegó el acceso al micrófono. Revisa los permisos del navegador.',

    // Errores de capacidad
    'Too Many Hops': 'Se excedió el límite de saltos en la red (483).',
    'Temporarily Overloaded': 'El servidor está temporalmente sobrecargado (503).',

    // Casos generales y desconocidos
    'Unknown Cause': 'Se produjo un error desconocido. Por favor, intenta nuevamente.',
    'Unknown Response': 'El servidor devolvió una respuesta no especificada.'
  };

  const callTypeIcon = call.type === 'Entrante' ? 'fas fa-arrow-down text-success' : 'fas fa-arrow-up text-danger';

  const callHistoryItem = `
    <div class="card mb-2 shadow-sm">
        <div class="card-body p-2">
            <div class="d-flex align-items-center">
                <div class="rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style="background-color: ${status.color}; color: white; width: 40px; height: 40px;">
                    ${status.icon}
                </div>
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between small mb-1">
                        <span style="color: ${status.color}; font-weight: bold;">
                            ${callMessage}
                        </span>
                        <span class="text-muted">${formattedTime}</span>
                    </div>
                    <div class="small text-muted">
                        <div class="mb-1"><strong><i class="${callTypeIcon}"></i> Tipo:</strong> ${call.type}</div>
                        <div class="mb-1"><strong><i class="fas fa-exclamation-circle"></i> Causa:</strong> ${messagesTranslated[call.cause] || call.cause}</div>
                        <div class="mb-1"><strong><i class="fas fa-user"></i> Usuario:</strong> ${call.user}</div>
                        <div class="mb-1"><strong><i class="fas fa-clock"></i> Duración:</strong> ${formatDuration(call.duration)}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
  if (status.message) {
    $("#call-history").prepend(callHistoryItem);

    const maxHistoryItems = 50;
    $('#call-history .card').slice(maxHistoryItems).remove();
  }

  causeCall = null;
}

function getCallHistory() {
  return JSON.parse(localStorage.getItem("callHistory")) || [];
}

function openFloatingWindowPhone() {
  if (!$('.floatingMenu').hasClass('open')) {
    $('.floatingMenu').stop().fadeIn('fast');
  }
}

// Function to add a call to the call history
function addToCallHistory(type) {
  //type = 'answer','call,'hangup','reject'
  // Create a call object with current timestamp

  type = type || '';
  causeCall = causeCall || '';

  let call = {
    type: type,
    duration: callDuration,
    timestamp: new Date(),
    icon: "",
    user: userRemoteExtension,
    cause: causeCall,
  };
  let callHistory = getCallHistory();
  // Get existing call history from localStorage
  callHistory.push(call);

  // Verificar si el almacenamiento local está vacío
  if (localStorage.getItem("callHistory") === null) {
    $("#call-history").html("");
  }
  localStorage.setItem("callHistory", JSON.stringify(callHistory));
  addCall(call);
}


// Función para monitorear la calidad de la conexión
function monitorConnectionQuality(rtcSession) {
  let statsInterval;

  // Iniciamos el monitoreo cuando la llamada está activa
  rtcSession.on('confirmed', () => {
    statsInterval = setInterval(async () => {
      try {
        const pc = rtcSession.connection; // Mover la declaración de pc aquí
        if (pc) {
          const stats = await pc.getStats();
          let packetLoss = 0;
          let jitter = 0;
          let rtt = 0;

          stats.forEach(report => {
            if (report.type === 'inbound-rtp' && report.kind === 'audio') {
              // Calculamos pérdida de paquetes
              if (report.packetsLost && report.packetsReceived) {
                packetLoss = (report.packetsLost /
                  (report.packetsLost + report.packetsReceived)) * 100;
              }
              // Obtenemos el jitter
              if (report.jitter) {
                jitter = report.jitter * 1000; // Convertimos a ms
              }
            }

            // Obtenemos el RTT (Round Trip Time)
            if (report.type === 'candidate-pair' && report.currentRoundTripTime) {
              rtt = report.currentRoundTripTime * 1000; // Convertimos a ms
            }
          });

          // Determinamos la calidad basada en los parámetros
          const quality = calculateQuality(packetLoss, jitter, rtt);
          updateQualityIndicator(quality);
        } else {
          console.error("RTCPeerConnection is null, cannot get stats.");
        }
      } catch (error) {
        console.error('Error getting WebRTC stats:', error);
      }
    }, 2000); // Actualizamos cada 2 segundos
  });

  // Limpiamos el intervalo cuando la llamada termina
  rtcSession.on('ended', () => {
    if (statsInterval) {
      clearInterval(statsInterval);
    }
  });
}

// Función para calcular la calidad general
function calculateQuality(packetLoss, jitter, rtt) {
  // Umbrales de calidad
  const thresholds = {
    excellent: {
      packetLoss: 1,
      jitter: 30,
      rtt: 100
    },
    good: {
      packetLoss: 3,
      jitter: 50,
      rtt: 200
    },
    fair: {
      packetLoss: 5,
      jitter: 100,
      rtt: 300
    }
  };

  if (packetLoss <= thresholds.excellent.packetLoss &&
    jitter <= thresholds.excellent.jitter &&
    rtt <= thresholds.excellent.rtt) {
    return 'excellent';
  } else if (packetLoss <= thresholds.good.packetLoss &&
    jitter <= thresholds.good.jitter &&
    rtt <= thresholds.good.rtt) {
    return 'good';
  } else if (packetLoss <= thresholds.fair.packetLoss &&
    jitter <= thresholds.fair.jitter &&
    rtt <= thresholds.fair.rtt) {
    return 'fair';
  } else {
    return 'poor';
  }
}

// Función para actualizar el indicador visual
function updateQualityIndicator(quality) {
  const qualityColors = {
    excellent: '#4CAF50', // Verde
    good: '#8BC34A',      // Verde claro
    fair: '#FFC107',      // Amarillo
    poor: '#F44336'       // Rojo
  };

  // Ejemplo de actualización visual
  const indicator = document.getElementById('connection-quality');
  if (indicator) {
    indicator.style.color = qualityColors[quality];
    // Agrega una transición suave
    indicator.style.transition = 'color 0.3s ease';
  }
}


// Clase para manejar las estadísticas de red
class NetworkStatisticsManager {
  constructor(rtcSession) {
    this.rtcSession = rtcSession;
    this.statsInterval = null;
    this.previousStats = new Map();
    this.listeners = new Set();
    this.intervalTime = 1000; // 1 segundo
  }

  start() {
    if (this.statsInterval) return;
    this.statsInterval = setInterval(() => this.gatherStats(), this.intervalTime);
  }

  stop() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
  }

  async gatherStats() {
    try {
      const stats = await this.rtcSession.connection.getStats();
      const processedStats = this.processStats(stats);
      this.notifyListeners(processedStats);
      this.previousStats = stats;
    } catch (error) {
      console.error('Error gathering WebRTC stats:', error);
    }
  }

  processStats(stats) {
    const networkStats = {
      timestamp: new Date(),
      audio: {
        inbound: {
          bytesReceived: 0,
          packetsReceived: 0,
          packetsLost: 0,
          jitter: 0,
          latency: 0,
          codec: '',
          level: 0,
          bitrate: 0
        },
        outbound: {
          bytesSent: 0,
          packetsSent: 0,
          packetsLost: 0,
          jitter: 0,
          latency: 0,
          codec: '',
          level: 0,
          bitrate: 0
        }
      },
      connection: {
        rtt: 0,
        localIP: '',
        remoteIP: '',
        protocol: '',
        networkType: '',
        candidateType: '',
        quality: 'unknown'
      }
    };

    stats.forEach(report => {
      this.processReport(report, networkStats);
    });

    return networkStats;
  }

  processReport(report, networkStats) {
    switch (report.type) {
      case 'inbound-rtp':
        if (report.kind === 'audio') {
          this.processInboundAudio(report, networkStats);
        }
        break;

      case 'outbound-rtp':
        if (report.kind === 'audio') {
          this.processOutboundAudio(report, networkStats);
        }
        break;

      case 'candidate-pair':
        if (report.state === 'succeeded') {
          this.processConnection(report, networkStats);
        }
        break;

      case 'local-candidate':
      case 'remote-candidate':
        this.processCandidate(report, networkStats);
        break;

      case 'codec':
        this.processCodec(report, networkStats);
        break;
    }
  }

  processInboundAudio(report, networkStats) {
    const previous = this.previousStats.get(report.id);
    const timeDiff = previous ? (report.timestamp - previous.timestamp) / 1000 : 1;

    const bytesReceived = report.bytesReceived - (previous?.bytesReceived || 0);

    networkStats.audio.inbound = {
      ...networkStats.audio.inbound,
      bytesReceived: report.bytesReceived,
      packetsReceived: report.packetsReceived,
      packetsLost: report.packetsLost,
      jitter: report.jitter * 1000, // Convertir a ms
      bitrate: (bytesReceived * 8) / timeDiff // bits por segundo
    };
  }

  processOutboundAudio(report, networkStats) {
    const previous = this.previousStats.get(report.id);
    const timeDiff = previous ? (report.timestamp - previous.timestamp) / 1000 : 1;

    const bytesSent = report.bytesSent - (previous?.bytesSent || 0);

    networkStats.audio.outbound = {
      ...networkStats.audio.outbound,
      bytesSent: report.bytesSent,
      packetsSent: report.packetsSent,
      bitrate: (bytesSent * 8) / timeDiff
    };
  }

  processConnection(report, networkStats) {
    networkStats.connection = {
      ...networkStats.connection,
      rtt: report.currentRoundTripTime * 1000, // Convertir a ms
      availableOutgoingBitrate: report.availableOutgoingBitrate,
      availableIncomingBitrate: report.availableIncomingBitrate,
      protocol: report.protocol,
      quality: this.calculateQuality(report)
    };
  }

  processCandidate(report, networkStats) {
    if (report.type === 'local-candidate') {
      networkStats.connection.localIP = report.ip;
      networkStats.connection.networkType = report.networkType;
    } else {
      networkStats.connection.remoteIP = report.ip;
    }
    networkStats.connection.candidateType = report.candidateType;
  }

  processCodec(report, networkStats) {
    if (report.mimeType.toLowerCase().includes('audio')) {
      const codecInfo = `${report.mimeType.split('/')[1]} ${report.clockRate}Hz`;
      networkStats.audio.inbound.codec = codecInfo;
      networkStats.audio.outbound.codec = codecInfo;
    }
  }

  calculateQuality(report) {
    const rtt = report.currentRoundTripTime * 1000;
    const packetsLost = report.packetsLost || 0;
    const totalPackets = report.packetsSent || 0;
    const lossRate = totalPackets > 0 ? (packetsLost / totalPackets) * 100 : 0;

    if (rtt < 100 && lossRate < 1) return 'excellent';
    if (rtt < 200 && lossRate < 3) return 'good';
    if (rtt < 300 && lossRate < 5) return 'fair';
    return 'poor';
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners(stats) {
    this.listeners.forEach(callback => callback(stats));
  }
}

// Componente UI para mostrar las estadísticas
const createNetworkStatsUI = () => {
  const container = document.createElement('div');
  container.className = 'network-stats-container';

  // Añadir HTML para la UI
  container.innerHTML = `
  <div class="stats-panel">
    <div class="stats-header">
      <h5>Calidad de Llamada</h5>
      <div class="quality-indicator">
        <i class="fas fa-signal"></i>
        <span class="quality-text">Midiendo...</span>
      </div>
    </div>
    
    <div class="stats-body">
      <div class="stats-section">
        <h5>Audio Entrante (Lo que recibes)</h5>
        <div class="stat-row">
          <span>
            <i class="fas fa-tachometer-alt fa-xs" title="Tasa de bits de audio entrante, que refleja la calidad y claridad del sonido que recibes. Una velocidad más alta generalmente indica mejor calidad de audio."></i> 
            Velocidad:
          </span>
          <span class="inbound-bitrate">0 kbps</span>
        </div>
        <div class="stat-row">
          <span>
            <i class="fas fa-exclamation-triangle fa-xs" title="Número de paquetes de audio que se han perdido durante la transmisión. Una pérdida significativa puede resultar en audio entrecortado o de mala calidad."></i> 
            Pérdida de Audio:
          </span>
          <span class="inbound-packets-lost">0 paquetes</span>
        </div>
        <div class="stat-row">
          <span>
            <i class="fas fa-sync-alt fa-xs" title="Medida de la variabilidad en el tiempo de llegada de los paquetes de audio. Un jitter bajo indica una transmisión más estable y de mejor calidad."></i> 
            Estabilidad:
          </span>
          <span class="inbound-jitter">0 ms</span>
        </div>
      </div>

      <div class="stats-section">
        <h5>Audio Saliente (Lo que envías)</h5>
        <div class="stat-row">
          <span>
            <i class="fas fa-tachometer-alt fa-xs" title="Tasa de bits del audio que envías, que es importante para determinar la calidad de audio que el receptor experimenta. Un bitrate alto puede mejorar la claridad."></i> 
            Velocidad:
          </span>
          <span class="outbound-bitrate">0 kbps</span>
        </div>
        <div class="stat-row">
          <span>
            <i class="fas fa-paper-plane fa-xs" title="Cantidad de paquetes de audio que se han enviado durante la llamada. Este número es esencial para evaluar si la transmisión es consistente."></i> 
            Paquetes Enviados:
          </span>
          <span class="outbound-packets">0</span>
        </div>
      </div>

      <div class="stats-section">
        <h5>Estado de Conexión</h5>
        <div class="stat-row">
          <span>
            <i class="fas fa-stopwatch fa-xs" title="Tiempo de respuesta entre el envío y la recepción de datos. Un valor bajo es ideal, indicando que la conexión es rápida y eficiente."></i> 
            Tiempo de Respuesta:
          </span>
          <span class="connection-rtt">0 ms</span>
        </div>
        <div class="stat-row">
          <span>
            <i class="fas fa-microphone-alt fa-xs" title="El códec de audio utilizado para la llamada. Diferentes códecs pueden afectar la calidad y el ancho de banda. Es importante asegurarse de que ambos extremos sean compatibles."></i> 
            Formato de Audio:
          </span>
          <span class="audio-codec">Midiendo...</span>
        </div>
        <div class="stat-row">
          <span>
            <i class="fas fa-wifi fa-xs" title="El tipo de red que se está utilizando (por ejemplo, Wi-Fi o conexión por cable). La calidad de la red puede tener un impacto significativo en la calidad de la llamada."></i> 
            Tipo de Red:
          </span>
          <span class="network-type">Midiendo...</span>
        </div>
      </div>
    </div>
  </div>
  `;

  // Añadir estilos
  const style = document.createElement('style');
  style.textContent = `

    .stats-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .quality-indicator {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .stats-section {
      margin-bottom: 15px;
    }

    .stats-section h4 {
      color: #666;
      margin-bottom: 8px;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 14px;
    }

    .quality-excellent { color: #4CAF50; }
    .quality-good { color: #8BC34A; }
    .quality-fair { color: #FFC107; }
    .quality-poor { color: #F44336; }
  `;

  document.head.appendChild(style);
  return container;
}

// Uso:
const initializeNetworkStats = (rtcSession) => {
  const statsManager = new NetworkStatisticsManager(rtcSession);
  const uiContainer = createNetworkStatsUI();
  $('#containerNetworkState').html(uiContainer);

  // Actualizar UI con estadísticas
  statsManager.addListener(stats => {
    // Actualizar indicador de calidad
    const qualityIndicator = uiContainer.querySelector('.quality-indicator i');
    qualityIndicator.className = `fas fa-wifi quality-${stats.connection.quality}`;

    // Actualizar valores
    uiContainer.querySelector('.inbound-bitrate').textContent =
      `${(stats.audio.inbound.bitrate / 1000).toFixed(1)} kbps`;
    uiContainer.querySelector('.inbound-packets-lost').textContent =
      stats.audio.inbound.packetsLost;
    uiContainer.querySelector('.inbound-jitter').textContent =
      `${stats.audio.inbound.jitter.toFixed(1)} ms`;
    uiContainer.querySelector('.outbound-bitrate').textContent =
      `${(stats.audio.outbound.bitrate / 1000).toFixed(1)} kbps`;
    uiContainer.querySelector('.outbound-packets').textContent =
      stats.audio.outbound.packetsSent;
    uiContainer.querySelector('.connection-rtt').textContent =
      `${stats.connection.rtt.toFixed(1)} ms`;
    uiContainer.querySelector('.audio-codec').textContent =
      stats.audio.inbound.codec;
    uiContainer.querySelector('.network-type').textContent =
      stats.connection.networkType || 'Unknown';
  });

  // Iniciar monitoreo
  statsManager.start();

  return {
    statsManager,
    uiContainer
  };
};

// Detener el sonido
function stopIncomingCallSound() {
  incomingCallSound.pause(); // Detiene la reproducción
  incomingCallSound.currentTime = 0; // Reinicia el audio al principio
  incomingCallSound.loop = false; // Opcional: evitar que siga repitiéndose si se reinicia accidentalmente
}

function closeAllNotifications() {
  activeNotifications.forEach((notification) => notification.close());
  // Vaciar el arreglo de notificaciones activas
  activeNotifications = [];
}

function handleRenegotiation(session) {
  const options = {
    useUpdate: false,
    extraHeaders: [
      'X-Renegotiation: true'
    ],
    rtcOfferConstraints: {
      offerToReceiveAudio: true,
      offerToReceiveVideo: false
    }
  };
  session.renegotiate(options, (success) => {
    if (success) {
      updateCardStatus('sip-connection', 'green', 'Llamada reconectada exitosamente');
    } else {
      updateCardStatus('sip-connection', 'red', 'Error en reconexión de llamada');
    }
  });
}