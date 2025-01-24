
let sessions = [];
let localChunks = [];
let remoteChunks = [];
let incomingCallAudio = new Audio("assets/phone/sounds/ringtone.mp3");
incomingCallAudio.loop = true;

var recordedChunks = [];

let recorder

window.oSipAudio = document.createElement("audio");
let remoteAudio = new Audio();
remoteAudio.autoplay = true;

var mixedAudioStream;
var recordedChunks = [];


function addStreams() {
    sessions.forEach((session) => {

      
      session.connection.ontrack = function(event) {
        incomingCallAudio.pause();
        remoteAudio.srcObject = event.streams[0];
        $('#info-micro').show()
        const peerconnection = session.connection;
        const local = peerconnection.getLocalStreams()[0]
        const remote = peerconnection.getRemoteStreams()[0]        

        initializeSoundMeterLocal(local);
        initializeSoundMeterRemote(remote);

        //startRecording(local, remote);
    };
    });
  }
