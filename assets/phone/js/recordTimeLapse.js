jQuery(function() {
    let currentTime = 0; // Tiempo actual del temporizador
    let startTime; // Tiempo de inicio del momento actual
    let markers = []; // Arreglo para almacenar los marcadores de tiempo


    function formatTimeRec(seconds) {
        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = seconds % 60;
        return minutes.toString().padStart(2, '0') + ':' + remainingSeconds.toString().padStart(2, '0');
    }

    function formatTime(time) {
        var formattedTime = "";
        var minutes = parseInt(time.split(':')[0]);
        var seconds = parseInt(time.split(':')[1]);
    
        // Verificar si los minutos están vacíos
        if (minutes === 0 && seconds > 0) {
            formattedTime = "0:" + seconds.toString().padStart(2, '0');
        } else {
            formattedTime = time;
        }
    
        return formattedTime;
    }
    
    // Botón para marcar o detener el momento actual
    $('#markMomentBtn').click(function() {

        if (startTime === undefined) {
            // Marcar el inicio del momento actual
            startTime = callDurationFormated;
            $(this).removeClass('btn-primary').addClass('btn-danger')
            $(this).find('span#markMomentBtnText').text('Detener Momento');
        
            let button = $(this);
            button.prop('disabled', true);
            button.find('.spinner-grow').show();
        
            setTimeout(function(){
                button.prop('disabled', false);
                button.find('.spinner-grow').hide();
            }, 3000);
        
        } else {
            // Detener el momento actual y guardarlo
            let endTime = callDurationFormated;
            console.log(formatTimeRec(startTime),startTime)
            let momentFormated = startTime + '-' + endTime;
            // Formatear el tiempo
            var formattedStartTime = formatTime(startTime);
            var formattedEndTime = formatTime(endTime);

            let momentText = $('<span>');
            momentText.append(formattedStartTime + ' ');
            var arrowIcon = $('<i>').addClass('fa-solid fa-arrow-right');
            momentText.append(arrowIcon);
            momentText.append(' ' + formattedEndTime);    

            var listItem = $('<li class="list-group-item d-flex justify-content-between align-items-center"></li>').append(momentText);
            var statusPartIcon = $('<span id="iconStatus"><i class="fa-solid fa-hourglass-start"></i></span>')
            listItem.append(statusPartIcon);
            $('#recordedMoments').append(listItem);
            // Guardar el marcador de tiempo en el arreglo
            markers.push(momentFormated);
            //saved markers time in localstorage
            localStorage.setItem('markers', JSON.stringify(markers));
            startTime = undefined; // Reiniciar el tiempo de inicio
            $(this).removeClass('btn-danger').addClass('btn-primary')
            $(this).find('span#markMomentBtnText').text('Marcar Momento Actual');
            //startTime = callDurationFormated;
        }
    });

})
