let speakerAudio = null;
let ringAudio = null;
let audioContexts = [];
let selectedDeviceId = null; // Variable global para el dispositivo seleccionado

function getDecibels(type, audioElement) {
  let context = new (window.AudioContext || window.webkitAudioContext)();
  let src = context.createMediaElementSource(audioElement);
  let analyser = context.createAnalyser();
  analyser.fftSize = 256;
  src.connect(analyser);
  analyser.connect(context.destination);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function updateBar() {
    requestAnimationFrame(updateBar);
    analyser.getByteFrequencyData(dataArray);

    let total = 0;
    for (let i = 0; i < bufferLength; i++) {
      total += dataArray[i];
    }
    const average = total / bufferLength;

    //type => "speaker", "ring", "microphone"
    if (average > 0) {
      const levelElement = $("#" + type + "-level-preview"); // Obtener el elemento de nivel según el tipo
      const maxWidth = $(".meter-" + type + "-preview").width(); // Obtener el ancho máximo según el tipo
      const width = Math.min(maxWidth, (average * maxWidth) / 100); // Calcular el ancho del nivel

      levelElement.css("width", width + "px");
    }
  }

  updateBar();
}

async function playSpeakerLevelDevise() {
  $("#playSpeakerLevel").prop("disabled", true);
  (await navigator.mediaDevices.getUserMedia({ audio: true }))
    .getTracks()
    .forEach((track) => track.stop());

  selectedDeviceId = $("#playbackSrc").val();
  // Detener audio anterior si existe
  if (speakerAudio) {
    speakerAudio.pause();
    speakerAudio.currentTime = 0;
  }
  speakerAudio = new Audio("./assets/phone/sounds/conversation.mp3");
  speakerAudio.setSinkId(selectedDeviceId);
  speakerAudio.play();
  speakerAudio.onended = function () {
    $("#playSpeakerLevel").prop("disabled", false);
  };

  getDecibels("speaker", speakerAudio);
}

async function playRingLevelDevise() {
  $("#playRingLevel").prop("disabled", true);
  (await navigator.mediaDevices.getUserMedia({ audio: true }))
    .getTracks()
    .forEach((track) => track.stop());

  selectedDeviceId = $("#ringDevice").val();
  // Detener audio anterior si existe
  if (ringAudio) {
    ringAudio.pause();
    ringAudio.currentTime = 0;
  }
  ringAudio = new Audio("./assets/phone/sounds/ringtone.mp3");
  ringAudio.setSinkId(selectedDeviceId);
  ringAudio.play();
  ringAudio.onended = function() {
    $('#playRingLevel').prop('disabled', false);
  };

  getDecibels("ring", ringAudio);
}

function stopAllAudio() {
  // Detener audio del altavoz
  if (speakerAudio) {
    speakerAudio.pause();
    speakerAudio.currentTime = 0;
  }

  // Detener audio del timbre
  if (ringAudio) {
    ringAudio.pause();
    ringAudio.currentTime = 0;
  }

  // Cerrar todos los contextos de audio
  audioContexts.forEach(context => {
    if (context.state !== 'closed') {
      context.close();
    }
  });
  audioContexts = [];

  // Resetear las barras de nivel
  $("#speaker-level-preview").css("width", "0px");
  $("#ring-level-preview").css("width", "0px");

  // Reactivar los botones
  $("#playSpeakerLevel").prop("disabled", false);
  $("#playRingLevel").prop("disabled", false);
}

$("#playSpeakerLevel").click(playSpeakerLevelDevise);
$("#playRingLevel").click(playRingLevelDevise);
