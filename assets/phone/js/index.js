$(function () {
  let userId = null;
  let timerInterval = null;
  let currentNotification = null;
  stateCall = "Desconocido";

  let statusCallInTransference
  //const videoPreview = document.getElementById('local-video-preview');
  sessionUserExtension = $('#sessionUserExtension').val();


  getSipCredentials()

  /*Transferir llamada*/
  let options = {
    html: true,
    title: "Transferir llamada",
    content: $('[data-name="popover-content"]'),
  };
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    bootstrap.Tooltip.getOrCreateInstance(tooltipTriggerEl)
  })
  var transferPopover = document.getElementById("transferPopover");
  new bootstrap.Popover(transferPopover, options);

  tippy('[data-tippy-content]');

  getExtensionFromUser();

  function getExtensionFromUser() {
    var user = "luis";

    $.ajax({
      url: 'models/usuarios.models.php',
      type: 'POST',

      data: {
        action: "GETextension",
        user: user
      },
      dataType: 'json', // Espera un JSON como respuesta
      success: function (data) {
        // Aquí puedes manejar la respuesta
        if (data) {
          // Mostrar el resultado en un alert
          //alert(data);
        } else {
          alert("No se obtuvo ningún dato.");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("Error en la solicitud: " + textStatus);
      }
    });
  }

  var storedServer = localStorage.getItem("server");
  var storedUsername = localStorage.getItem("sipUsername");
  var storedPassword = localStorage.getItem("sipPassword");
  var storedName = localStorage.getItem("name");

  activateDND()
  activateAA()

  $("#joinCall").click(function () {
    $('#offcanvasConference').offcanvas('open')
  });


  $("#transferPopover").click(function () {
    $("#btnHoldUnhold").click();
  });

  if (storedServer && storedUsername && storedPassword) {
    login(storedServer, storedUsername, storedPassword);
    //cambiar a block si se quiere mostrar el log card
    $("#containerStatus").hide();
  }

  $("#btnRefresh").click(function (event) {
    event.preventDefault();
    localStorage.removeItem('sipInstanceActive');
    login(storedServer, storedUsername, storedPassword);
  });



  //función para pulsar teclas del teléfono que se vá a llamar.
  $("#toCallButtons").on("click", ".dialpad-char", function (e) {
    if ($(this).hasClass("dialpad-char")) {
      let digit = $(this).attr("data-value");

      if (digit === "C") {
        const toField = $("#toField");
        toField.val("");
        if (toField.val() === "") {
          $("#wrapOptions").hide();
        }
      } else if (digit === "R") {

        const dest = localStorage.getItem("latestCall");
        //statusCall("Calling");
        if (dest) {
          phone.call(dest, callOptions);
          statusCallConference(dest, "Llamando...")
        }
        // Reiniciar el contador de duración de la llamada
        callDuration = 0
        updateUI();
        addExtension('Llamando...', dest)
        addStreams();

      } else {
        if (digit == "#") {
          digit = "pound";
        }
        if (digit == "*") {
          digit = "star";
        }
        if (digit !== "+" && audioFiles[digit]) {
          if (lastPlayedAudio) {
            // Detiene la reproducción del archivo de audio anterior si aún está reproduciéndose
            lastPlayedAudio.pause();
            lastPlayedAudio.currentTime = 0;
          }
          //audioFiles[digit].play();
          //lastPlayedAudio = audioFiles[digit]; // Actualiza el último archivo de audio reproducido
        } else {
          console.error(
            "El archivo de audio para el dígito " +
            digit +
            " no está disponible."
          );
        }

        if (digit == "pound") {
          digit = "#";
        }
        if (digit == "star") {
          digit = "*";
        }

        $("#wrapOptions").show();
        $("#toField").val($("#toField").val() + digit);
        $("#connectCall").attr("disabled", false);
        sessions.forEach((session) => {
          if (session.isEstablished()) {
            session.sendDTMF(digit);
          }
        });
      }
    }
  });

  let lastPlayedAudio = null;

  // Función para cargar los archivos de audio DTMF

  loadAudioFiles();

  //Función para borrar un número del telefono que se quiere llamar.
  $("#btnDeleteDial").on("click", function () {
    const toField = $("#toField");
    toField.val("");
    if (toField.val() === "") {
      $("#wrapOptions").hide();
    }
  });

  //Función para llamar a una extensión (botón llamar)
  $("#connectCall").click(async function () {
    const dest = $("#toField").val();
    const identificator = localStorage.getItem("sipUsername");

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    stream.getTracks().forEach(track => track.stop());

    if (dest !== "" && dest !== identificator) {
      phone.call(dest, callOptions);
      localStorage.setItem("latestCall", dest);
      updateUI();
      statusCallConference(dest, "Llamando...");
      addExtension('Llamando...', dest);
      addStreams();
    }

    $("#toField").val("");
    $(this).attr("disabled", true);
    callDuration = 0;
  });

  //Función para responder la llamada
  $("#btnAnswer").click(function () {
    closeAllNotifications()
    stopIncomingCallSound()
    sessions.forEach((session) => {
      session.answer(callOptions);
      if (currentNotification) {
        // Cerrar la notificación actual
        currentNotification.close();
        currentNotification = null; // Limpiar la referencia a la notificación
      }
      addStreams();
    });
  });

  //funcion para colgar la llamada
  $(".btnHangUp").click(function () {
    closeAllNotifications()
    stopIncomingCallSound()
    let type = $(this).data("type");
    sessions.forEach((session) => {
      session.terminate();
    });
    sessions = []
    $("#listExtension").html("");
  });
  //Función que habilita el modo - Mute de la llamada.
  $("#mute").click(function () {
    const button = $(this);
    sessions.forEach((session) => {
      if (session.isMuted().audio) {
        session.unmute({
          audio: true,
        });
        button.find("i")
          .removeClass("fa-microphone-slash")
          .addClass("fa-microphone");
        button.removeClass("btn-success").addClass("btn-light");
        $("#info-micro").show();
      } else {
        session.mute({
          audio: true,
        });
        button.find("i")
          .removeClass("fa-microphone")
          .addClass("fa-microphone-slash");
        button.removeClass("btn-light").addClass("btn-success");
      }
    });
    updateUI();
  });

  //Funcion que habilita el modo - Lllamada en espera.
  $("#btnHoldUnhold").on("click", function () {
    sessions.forEach((session) => {
      if (!session.isOnHold().local) {
        session.hold();
        $(this)
          .find("i")
          .removeClass("fa-circle-pause")
          .addClass("fa-circle-play");
        $(this).removeClass("btn-light").addClass("btn-success");
      } else {
        session.unhold();
        $(this)
          .find("i")
          .removeClass("fa-circle-play")
          .addClass("fa-circle-pause");
        $(this).removeClass("btn-success").addClass("btn-light");
      }
    });
    updateUI();
  });

  // Función para realizar la transferencia de llamada
  $(".btnTransferCall").click(function () {
    var type = $(this).data("id");
    const ext = $("#inputExtToTransfer").val();
    sessions.forEach((session) => {
      if (type == "blind") {
        //ciega
        session.refer(ext);
      } else {
        //atendida
        session.refer("sip:" + ext + "@" + storedServer, {
          referredBy: "sip:" + sipUsername + "@" + storedServer,
        });
      }
    });
    $("#inputExtToTransfer").val("");
    $("#transferPopover").popover("hide");

    $(this).find("i").removeClass("fa-circle-play").addClass("fa-circle-pause");
    $(this).removeClass("btn-success").addClass("btn-light");
  });

  // $("#toField").on("keypress", function (e) {
  //   if (e.which === 13) {
  //     // Enter
  //     $("#connectCall").click();
  //   }
  // });

  // Función que habilita el modo no molestar.(DND)
  $("#btnDND").click(function (event) {
    event.preventDefault();
    if (isDND) {
      isDND = false;
      $(this).addClass("text-bg-ligth").removeClass("text-bg-success");
    } else {
      isDND = true;
      $(this).addClass("text-bg-success").removeClass("text-bg-ligth");
    }
    updateStateAADND('DND')
  });

  //Función que habilita
  $("#btnAA").click(function (event) {
    event.preventDefault();
    if (isAA) {
      isAA = false;
      $(this).addClass("text-bg-ligth").removeClass("text-bg-success");
    } else {
      isAA = true;
      $(this).addClass("text-bg-success").removeClass("text-bg-ligth");
    }
    updateStateAADND('AA')
  });


  $("#toField").on("input", function () {
    var extension = $(this).val();

    // Permitir solo números y eliminar cualquier carácter no numérico
    if (!/^\d*$/.test(extension)) {
      extension = extension.replace(/[^\d]/g, '');
      $(this).val(extension);
    }

    // Tu lógica existente para mostrar u ocultar opciones
    if (extension.length >= 1) {
      $("#wrapOptions").show();
      $("#connectCall").attr("disabled", false);
    } else {
      $("#wrapOptions").hide();
      $("#connectCall").attr("disabled", true);
    }
  });

  $('#btnAddToConference').on('click', function () {
    const $input = $('#inputExtToConference');
    const extension = $input.val().trim();
    const identificator = localStorage.getItem("sipUsername");

    // Validar que la extensión sea un número válido
    const extensionInt = parseInt(extension, 10);
    if (extension && /^\d+$/.test(extension) && !isNaN(extensionInt)) {
      // Verificar si la extensión es diferente al identificador propio
      if (extensionInt !== parseInt(identificator, 10)) {
        // Verificar si el número de extensión ya está en una sesión activa
        let isNumberInUse = false;

        // Recorremos las sesiones activas para ver si alguna está usando el número de extensión
        sessions.forEach((session) => {
          const sessionDest = parseInt(session.remote_identity._uri._user, 10); // Convertimos el número de destino de la sesión a entero
          if (sessionDest === extensionInt) {
            isNumberInUse = true; // Si encontramos una sesión con el número de destino, marcamos como ocupado
          }
        });

        // Si la extensión no está en uso, proceder con agregar el participante
        if (!isNumberInUse) {
          // Crear el nuevo participante en HTML y agregarlo a la lista
          const $newParticipant = createParticipantHTML(extensionInt);
          $('#listExtension').append($newParticipant);
          $input.val(''); // Limpiar el campo de entrada
          addToCounterConference(); // Actualizar el contador de participantes
        } else {
          alert("La extensión " + extensionInt + " ya está en uso. No se puede agregar.");
        }
      } else {
        alert("No puedes agregar tu propia extensión.");
      }
    } else {
      alert('Por favor, ingrese una extensión válida.');
    }
  });


  function openVideoPreview() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        videoPreview.srcObject = stream;
      })
      .catch(function (err) {
        console.error('Error al acceder a la cámara:', err);
      });
  }

  function closeVideoPreview() {
    if (videoPreview.srcObject) {
      const stream = videoPreview.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach(function (track) {
        track.stop();
      });

      videoPreview.srcObject = null;
    }
  }

  function closeMicrophonePreview() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null
    }
  }

  $('#btnOpenOffcanvasPreview').click(function () {
    // Limpiar los selectores antes de llenarlos
    $('#playbackSrc').empty();
    $('#ringDevice').empty();
    $('#microphoneSrc').empty();
    $('#microphoneMessage').remove();

    navigator.mediaDevices
      .enumerateDevices()
      .then(function (devices) {
        // Filtrar los dispositivos de audio de salida (altavoces)
        var audioOutputDevices = devices.filter(function (device) {
          return device.kind === "audiooutput"; // Dispositivos de salida de audio (altavoces)
        });

        // Usar un conjunto para rastrear los nombres de los dispositivos ya agregados
        var addedOutputDeviceNames = new Set();

        // Llenar los selectores con los dispositivos encontrados
        audioOutputDevices.forEach(function (device) {
          var deviceLabel = (device.label || 'Altavoces').replace(' (Built-in)', ''); // Usar 'Altavoces' si no hay etiqueta disponible y eliminar '(Built-in)'

          // Verificar si el dispositivo ya ha sido agregado y no es "Predeterminado"
          if (!addedOutputDeviceNames.has(deviceLabel) && !deviceLabel.includes('Predeterminado')) {
            $("#playbackSrc, #ringDevice").append(
              '<option value="' +
              device.deviceId +
              '">' +
              deviceLabel +
              "</option>"
            );
            addedOutputDeviceNames.add(deviceLabel); // Agregar el nombre del dispositivo al conjunto
          }
        });

        // Filtrar los dispositivos de entrada de audio (micrófonos)
        var audioInputDevices = devices.filter(function (device) {
          return device.kind === "audioinput"; // Dispositivos de entrada de audio (micrófonos)
        });

        // Usar un conjunto para rastrear los nombres de los dispositivos ya agregados
        var addedInputDeviceNames = new Set();

        // Llenar el selector con los micrófonos
        audioInputDevices.forEach(function (device) {
          var deviceLabel = (device.label || 'Micrófono').replace(' (Built-in)', ''); // Usar 'Micrófono' si no hay etiqueta disponible y eliminar '(Built-in)'

          // Verificar si el dispositivo ya ha sido agregado y no es "Predeterminado"
          if (!addedInputDeviceNames.has(deviceLabel) && !deviceLabel.includes('Predeterminado')) {
            $("#microphoneSrc").append(
              '<option value="' + device.deviceId + '">' + deviceLabel + "</option>"
            );
            addedInputDeviceNames.add(deviceLabel); // Agregar el nombre del dispositivo al conjunto
          }
        });

        const selectedMicro = localStorage.getItem('selectedMicrophone');
        const selectedMicroName = localStorage.getItem('selectedMicrophoneName');
        if (selectedMicro) {
          $('#microphoneSrc').val(selectedMicro);
          $('#microphoneMessage').remove(); // Eliminar cualquier mensaje previo
          $('.meter-micro-preview').after(
            `<div id="microphoneMessage" class="alert alert-secondary mt-2" role="alert">
              <strong>Actual:</strong> <b>${selectedMicroName}</b>. Si desea cambiarlo, seleccione otro y la página se recargará automáticamente para aplicar los cambios.
          </div>`
          );
        } else {
          // Seleccionar el primer micrófono válido de la lista si no se encuentra el almacenado
          const firstValidMicrophoneOption = $('#microphoneSrc option').filter(function () {
            return $(this).val() !== '';
          }).first();

          if (firstValidMicrophoneOption.length > 0) {
            const firstMicrophoneId = firstValidMicrophoneOption.val();
            const firstMicrophoneName = firstValidMicrophoneOption.text();
            $('#microphoneSrc').val(firstMicrophoneId);
            localStorage.setItem('selectedMicrophone', firstMicrophoneId);
            localStorage.setItem('selectedMicrophoneName', firstMicrophoneName);
            $('#microphoneMessage').remove(); // Eliminar cualquier mensaje previo
            $('.meter-micro-preview').after(
              `<div id="microphoneMessage" class="alert alert-secondary mt-2" role="alert">
                <strong>Actual:</strong> <b>${firstMicrophoneName}</b>. Si desea cambiarlo, seleccione otro y la página se recargará automáticamente para aplicar los cambios.
            </div>`
            );
          }
        }
        if (audioInputDevices.length > 0) {
          var defaultDeviceId = audioInputDevices[0].deviceId;
          getAudioStream(defaultDeviceId);
        }
      })
      .catch(function (err) {
        console.error("Error al enumerar dispositivos de audio: " + err);
      });
  });

  $('#offcanvasPreview').on('hidden.bs.offcanvas', function () {
    // Tu código aquí para manejar el cierre del offcanvas
  });
  $('#offcanvasPreview').on('hidden.bs.offcanvas', function () {
    // Tu código aquí para manejar el cierre del offcanvas
    closeMicrophonePreview()
    stopAllAudio();
    //closeVideoPreview()
  });



  $('.floatingButton').on('click', function (e) {
    e.preventDefault();
    toggleButtonState($(this));
  });

  // Evento de otro botón que también controla el menú
  $('.btn-call-phone').on('click', function (e) {
    e.preventDefault();

    const numberPhone = $(this).siblings('input').val();
    const entity = $('#selectBase').val();
    const data = $('#data').val();
    if (!data || data.trim().length === 0) {
      showSwalAlert('error', "El campo data (indice) no puede estar vacio.");
      return;
    }
    automaticCall(numberPhone)
    $.ajax({
      type: 'POST',
      url: 'controllers/CRM/contact.controllers.php', // Cambia esto por la ruta de tu archivo PHP
      data: {
        action: 'insertTypificationWithContact',
        entity: entity,
        data: data,
        tel: numberPhone,
        type: 'E',
        pendingBy: "llamada"
      }, success: function (response) {
        console.log(response)
      }, error: function () {
        console.log("Error: al guardar")
      }
    });
  });
});


function automaticCall(numberPhone) {
  // First terminate any existing sessions
  verifyMicrophoneConnection

  if (sessions && sessions.some(session => session.isEstablished() && !session.isEnded())) {
    console.log('There is already a call in progress. Please hang up before making a new call.');
    return; // Exit the function if there is an ongoing call
  }

  clearAllParticipants()
  if (sessions && sessions.length > 0) {
    sessions.forEach(session => {
      try {
        if (session && session.isEstablished() && !session.isEnded()) {
          console.log('Terminating existing session:', session.id);
          session.terminate();
        }
      } catch (error) {
        console.error('Error terminating session:', error);
      }
    });
    // Clear sessions array
    sessions = [];
  }

  // Proceed with new call
  const toField = $("#toField");
  toField.val(numberPhone);
  toggleButtonState($('.floatingButton'), true);
  $("#connectCall").click();
}

function clearAllParticipants() {
  // Select all participant cards
  const $allParticipants = $('#listExtension .conference-participant');

  // Remove with fade animation
  if ($allParticipants.length) {
    $allParticipants.fadeOut(300, function () {
      $(this).remove();
      updateParticipantCount();
    });
  }

  // Alternative one-liner without animation
  // $('#listExtension').empty();
}

// Función para alternar el estado (abrir/cerrar) con una opción para omitir el cierre
function toggleButtonState($button, fromAutomaticCall = false) {
  if ($button.hasClass('open')) {
    // Si ya está abierto y es llamado desde automaticCall, no lo cierra
    if (fromAutomaticCall) {
      return; // No hace nada si ya está abierto
    }
    closeButton($button);
  } else {
    openButton($button);
  }
}

// Función para abrir el botón flotante
function openButton($button) {
  $button.addClass('open');
  animateImageOpen($button.find('img'));
  openMenu();
}

// Función para cerrar el botón flotante
function closeButton($button) {
  $button.removeClass('open');
  animateImageClose($button.find('img'));
  closeMenu();
}

// Anima la imagen cuando se abre (crece y aparece)
function animateImageOpen($img) {
  $img.animate({
    width: '0%',
    height: '0%',
    opacity: 0
  }, 200, function () {
    $img.attr('src', 'assets/phone/images/close.svg');
    $img.animate({
      width: '20px',
      height: '20px',
      opacity: 1
    }, 200);
  });
}

// Anima la imagen cuando se cierra (se reduce y desaparece)
function animateImageClose($img) {
  $img.animate({
    width: '0%',
    height: '0%',
    opacity: 0
  }, 200, function () {
    $img.attr('src', 'assets/phone/images/phone.svg');
    $img.animate({
      width: '20px',
      height: '20px',
      opacity: 1
    }, 200);
  });
}

// Abre el menú con efecto fadeToggle
function openMenu() {
  $('.floatingMenu').stop().fadeIn('fast', function () {
    setTimeout(() => {
      $('#toField').focus();
    }, 400);
  });
}

// Cierra el menú con efecto fadeToggle
function closeMenu() {
  $('.floatingMenu').stop().fadeOut('fast');
}

//función para activar o nó los botones de DND y AA
function activateDND() {
  // Verifica si el span con el id #btnDND existe en la página
  let $btnDND = $('#btnDND');

  if ($btnDND.length > 0) {
    // Verifica el valor del atributo data-state
    var dndState = $btnDND.attr('data-state');

    if (dndState === 'A') {
      // Si el estado es 'A', establece isDND como true y cambia las clases
      isDND = true;
      $btnDND.addClass("text-bg-success").removeClass("text-bg-ligth");
    } else {
      // Si el estado no es 'A', establece isDND como false, cambia el texto y las clases
      isDND = false;
      $btnDND.addClass("text-bg-ligth").removeClass("text-bg-success");
    }
  }
}

function activateAA() {
  // Verifica si el span con el id #btnAA existe en la página
  let $btnAA = $('#btnAA');

  if ($btnAA.length > 0) {
    // Verifica el valor del atributo data-state
    var aaState = $btnAA.attr('data-state');

    if (aaState === 'A') {
      // Si el estado es 'A', establece isAA como true y cambia las clases
      isAA = true;
      $btnAA.addClass("text-bg-success").removeClass("text-bg-ligth");
    } else {
      // Si el estado no es 'A', establece isAA como false, cambia el texto y las clases
      isAA = false;
      $btnAA.addClass("text-bg-ligth").removeClass("text-bg-success");
    }
  }
}

function getSipCredentials() {

  let SERVER = "127.0.0.1";

  $.ajax({
    url: 'controllers/usuarios.controllers.php',
    method: 'POST',
    dataType: 'json',
    data: {
      action: "getSipCredentials",
    },
    success: function (response) {
      if (typeof window.SERVER_CONFIG !== 'undefined' && window.SERVER_CONFIG.API_SERVER) {
        SERVER = window.SERVER_CONFIG.API_SERVER;
      }
      localStorage.setItem("server", SERVER);
      localStorage.setItem("sipUsername", response.exten);
      localStorage.setItem("sipPassword", response.pwd);
      localStorage.setItem("sipName", response.name);
    }
  });
}

function updateStateAADND(phoneButton) {
  let newState = "";
  // Actualizar el estado del botón según el tipo
  if (phoneButton === "AA") {
    newState = toggleState(isAA);
  } else if (phoneButton === "DND") {
    newState = toggleState(isDND);
  }
  $.ajax({
    url: 'controllers/usuarios.controllers.php',
    method: 'POST',
    data: {
      action: "updateAADND",
      button: phoneButton,
      state: newState
    },
    error: function () {
      console.log("Error: hubo un error al cambiar el estado del botón")
    }
  });
}
function toggleState(currentState) {
  return currentState === true ? "A" : "N";
}

let deviceDisconnected = false;

async function verifyMicrophoneConnection() {
  const selectedMicro = localStorage.getItem('selectedMicrophone');
  const selectedMicroName = localStorage.getItem('selectedMicrophoneName');

  if (selectedMicro && selectedMicroName) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputDevices = devices.filter(device => device.kind === 'audioinput');

      // Verificar si el dispositivo almacenado sigue disponible
      const deviceStillAvailable = audioInputDevices.some(device => device.deviceId === selectedMicro);

      if (!deviceStillAvailable && !deviceDisconnected) {
        // Mostrar una notificación de tipo toast si el dispositivo ya no está disponible
        Swal.fire({
          toast: true,
          position: 'bottom-right',
          icon: 'error',
          title: `<i class="fas fa-microphone-slash"></i> El <b>${selectedMicroName}</b> se ha desconectado.`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        console.log(`El ${selectedMicroName} se ha desconectado.`);
        deviceDisconnected = true;
      } else if (deviceStillAvailable && deviceDisconnected) {
        // Mostrar una notificación de tipo toast si el dispositivo se ha vuelto a conectar
        Swal.fire({
          toast: true,
          position: 'bottom-right',
          icon: 'success',
          title: `<i class="fas fa-microphone"></i> El <b>${selectedMicroName}</b> se ha vuelto a conectar.`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        console.log(`El ${selectedMicroName} se ha vuelto a conectar.`);
        deviceDisconnected = false;
      }
    } catch (error) {
      console.error('Error al verificar los dispositivos de audio:', error);
    }
  } else {
    console.warn('No se ha encontrado información del dispositivo en localStorage.');
  }
}

function checkMicrophoneConnection() {
  verifyMicrophoneConnection();
  navigator.mediaDevices.addEventListener('devicechange', verifyMicrophoneConnection);
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', checkMicrophoneConnection);
