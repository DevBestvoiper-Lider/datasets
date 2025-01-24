// Declarar una variable para almacenar la referencia al objeto MediaStream
let mediaStream;

// Función para obtener el flujo de audio con el deviceId seleccionado
async function getAudioStream(selectedDeviceId) {
    try {
        // Detener el flujo de audio anterior si existe
        if (mediaStream && !mediaStream.stopped) {
            mediaStream.getTracks().forEach(track => track.stop());
            console.log('Analyzing audio stopped');
        }
        
        // Obtener el nuevo flujo de audio con el deviceId seleccionado
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: selectedDeviceId } } });
        
        // Conectar el flujo de audio a un AudioContext
        const audioContext = new AudioContext();
        const microphone = audioContext.createMediaStreamSource(mediaStream);
        
        // Crear un analizador de audio
        const analyser = audioContext.createAnalyser();
        microphone.connect(analyser);
        
        // Configurar el analizador de audio
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Función para analizar el audio en tiempo real
        function analyzeAudio() {
            analyser.getByteFrequencyData(dataArray);

            // Calcular el nivel de decibelios
            let total = 0;
            for (let i = 0; i < bufferLength; i++) {
                total += dataArray[i];
            }
            const average = total / bufferLength;

            // Ajustar la anchura del nivel de decibelios
            const levelElement = $('#mic-level-preview');
            const maxWidth = $('.meter-micro-preview').width();
            const width = Math.min(maxWidth, average * maxWidth / 100); // Calcular la anchura normalmente
            const leftOffset = Math.max(0, maxWidth - width); // Calcular el desplazamiento a la izquierda

            levelElement.css('width', width + 'px');
            levelElement.css('rigth', leftOffset + 'px');

            // Llamar recursivamente para continuar el análisis en tiempo real
            requestAnimationFrame(analyzeAudio);
        }

        // Iniciar el análisis de audio en tiempo real
        analyzeAudio();

        console.log('Se ha cambiado exitosamente el dispositivo de entrada de audio.');
    } catch (error) {
        console.error('Error al cambiar el dispositivo de entrada de audio:', error);
    }
}

// Evento change para el selector de dispositivos de entrada de audio
$('#microphoneSrc').change(function () {
    let selectedDeviceId = $(this).val();
    let microphoneName = $(this).find("option:selected").text();
    localStorage.setItem('selectedMicrophoneName', microphoneName);
    localStorage.setItem('selectedMicrophone', selectedDeviceId);
    
    // Mostrar un mensaje indicando que la página se recargará
    $('#microphoneMessage').remove(); // Eliminar cualquier mensaje previo
    $('.meter-micro-preview').append(
        `<div id="microphoneMessage" class="alert alert-info mt-2" role="alert">
            <strong>Cambiando a <b>${microphoneName}</b>.</strong> La página se recargará para aplicar los cambios...
        </div>`
    );

    // Esperar 2 segundos antes de recargar la página
    setTimeout(() => {
        location.reload(); // Refrescar la página para aplicar los cambios
    }, 2000);
});
