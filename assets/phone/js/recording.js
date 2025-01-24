let localRecorder, remoteRecorder;
// Función para iniciar la grabación

function startRecording(localStream, remoteStream) {
    // Grabación del audio remoto
    remoteRecorder = RecordRTC(remoteStream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: StereoAudioRecorder,
        timeSlice: 1000, // grabar en segmentos de 1 segundo
        ondataavailable: function(blob) {
            document.getElementById('remoteAudioRecording').src = URL.createObjectURL(blob);
        }
    });
    

    // Grabación del audio local
    localRecorder = RecordRTC(localStream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: StereoAudioRecorder,
        timeSlice: 1000,
        ondataavailable: function(blob) {
            document.getElementById('localAudioRecording').src = URL.createObjectURL(blob);
        }
    });

    // Iniciar la grabación
    remoteRecorder.startRecording();
    localRecorder.startRecording();


}

function downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function stopRecording() {
    if (localRecorder && remoteRecorder) {
     
        localRecorder.stopRecording(function(localBlob) {
            remoteRecorder.stopRecording(function(remoteBlob) {
                // Crear un objeto FormData y añadir los blobs
                Promise.all([
                    fetchBlob(localBlob),
                    fetchBlob(remoteBlob)
                ]).then(blobs => {

                    // Download local recording
                    downloadBlob(blobs[0], `local-${Date.now()}.wav`);
                    
                    // Download remote recording
                    downloadBlob(blobs[1], `remote-${Date.now()}.wav`);
                    
                    let markersCall = localStorage.getItem('markers')
                    // Crear un objeto FormData y añadir los blobs
                    let formData = new FormData();
                    formData.append('extAgent',localStorage.getItem("sipUsername"));
                    formData.append('extUser',localStorage.getItem("latestCall"));
                    formData.append('localBlob', blobs[0]);
                    formData.append('remoteBlob', blobs[1]);
                    formData.append('timelapse',JSON.parse(markersCall));
                    formData.append('typeCall', localStorage.getItem("typeCall"));
            
                    $.ajax({

                        url: 'controllers/phone.controllers.php',
                        type: 'POST',
                        data: formData,
                        dataType: 'json',
                        processData: false,
                        contentType: false,
                        success: function(data) {
                        $('#statusRecordCall').html(data.msg)     
                        $('#wrapRecordedCompletCall').show()    
                        if (Array.isArray(data.parts)) {
                            let recordedMomentsItems = $("#recordedMoments li");
                            data.parts.forEach(function(part,index) {
                                if (index < recordedMomentsItems.length) {
                                    let icon = $(recordedMomentsItems[index]).find("#iconStatus i");
                                    icon.removeClass("fa-hourglass-start").addClass("fa-circle-check");
                                } else {
                                    return false; // Salir del bucle si no hay suficientes elementos <li>
                                }
                            });
                            data = []
                        }

                        },
                        
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.error('Error al enviar el blob de audio local:', textStatus, errorThrown);
                        }
                    });

                })
                .catch(error => {
                    console.error('Error al obtener el Blob del audio local:', error);
                });
            });
        });
    } else {
        console.error("localRecorder o remoteRecorder no están definidos o inicializados correctamente.");
    }

}
// Función para obtener un Blob de una URL blob
function fetchBlob(url) {
    return fetch(url)
        .then(response => response.blob())
        .catch(error => {
            console.error('Error al obtener el Blob:', error);
            throw error;
        });
}