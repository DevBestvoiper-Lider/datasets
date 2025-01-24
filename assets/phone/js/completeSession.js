function completeSession(extension) {
  // Check WebSocket readyState
  if (socketAgents.readyState === WebSocket.OPEN) {
    socketAgents.send(JSON.stringify({
      type: 'status-update',
      agentId: String(storedUsername),
      status: "disponible"
    }));
  } else {
    // Wait for connection to open
    socketAgents.addEventListener('open', () => {
      socketAgents.send(JSON.stringify({
        type: 'status-update',
        agentId: String(storedUsername),
        status: "disponible"
      }));
    });

    console.log('WebSocket connecting... Message will be sent when connected');
  }
  document.title = "Bestcallcenter PRO - PBX";
  const favicon = document.querySelector("link[rel='icon']");
  favicon.href = "assets/phone/images/favicon.ico";
  incomingCallAudio.pause();
  $("#connectCall").attr("disabled", false);
  $('#btnOpenOffcanvasPanel').hide()
  var foundSession = sessions.find(function (session) {
    return session.remote_identity.uri.user === extension;
  });

  localStorage.setItem("typeCall", causeCall);

  if (foundSession !== undefined && sessions[foundSession]) {
    // Finaliza todas las sesiones activas
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
  }

  if (foundSession) {
    let listItem = $("#listExtension")
      .find("[data-extension='" + extension + "']")
      .closest(".list-group-item");
    listItem.remove();

    sessions.splice(foundSession, 1);



    deleteCallerIdFromInfo(extension)

  }
  if (sessions.length == 0) {
    $('#offcanvasConference').offcanvas('hide');

    $("#wrapOptions").show();
    //$("#connectCall").show();
    $("#btnRejectCall").hide();

    $("#phone-options").show();
    $("#toField").val("");

    $("#callerId").text();
    $("#wrapCallerId").hide();
    $("#wrapTimerId").hide();
    $("#optionsInCall").hide();
    $("#info-micro").addClass("align-left");
    //ocultar el input de escribir.
    $(".wrapInputCall").show();
    statusCall("Llamada Finalizada");
    $("#mobile-status-icon")
      .removeClass("fa-mobile-retro")
      .addClass("fa-phone-slash")
      .addClass('fa-square-phone"')
      .css("color", "orange");

    //close transfer popover
    $("#inputExtToTransfer").val("");
    $("#transferPopover").popover("hide");

    //mostrar teclado, ocultar vista de contestar llamada
    $("#to").show();
    $("#incomming").hide();
    $("#info-micro").hide();

  }

  setTimeout(function () {
    statusCall("En linea");
    $("#mobile-status-icon")
      .css("color", "green")
      .removeClass("fa-phone-slash")
      .addClass("fa-mobile-retro");
  }, 2000);

  // setTimeout(function () {
  //   $("#offcanvasRecordCall").offcanvas('hide')
  //   $('#recordedMoments').html("")
  //   $('#statusRecordCall').html("")
  //   $('#wrapRecordedMoments').hide();
  // }, 5000);  
  addToCallHistory(stateCall);

  stateCall = null;
  stopTimer();
  updateUI();
  addToCounterConference()

  //stopRecording()

}

function closeAllNotifications() {
  activeNotifications.forEach((notification) => notification.close());
  // Vaciar el arreglo de notificaciones activas
  activeNotifications = [];
}

function deleteCallerIdFromInfo(callerId) {
  var currentUser = $("#callerId").text();
  var idList = currentUser.split(', ');
  var index = idList.indexOf(callerId);
  if (index !== -1) {
    idList.splice(index, 1);
  }
  var newText = idList.join(', ');
  $("#callerId").text(newText);
}
