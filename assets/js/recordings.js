
$(document).ready(function () {

    if (typeof window.SERVER_CONFIG !== 'undefined') {
        const PORT = window.SERVER_CONFIG.PORT;
        const API_SERVER = window.SERVER_CONFIG.API_SERVER;
        const SERVER_URL = window.SERVER_CONFIG.SERVER_URL;
        const socket = new WebSocket(SERVER_URL);

         // Obtener el token del localStorage - JWT
         const jwt_token = localStorage.getItem('jwt_token');

        let selectedSymbol = localStorage.getItem('selectedSymbol');

        $(".checkboxButton").click(function () {
            $(".checkboxButton").removeClass("active");
            $(this).addClass("active");
            selectedSymbol = $(this).data("symbol");
            localStorage.setItem('selectedSymbol', selectedSymbol);
        });

        if (selectedSymbol !== null) {
            $(".checkboxButton").removeClass("active");
            $(".checkboxButton[data-symbol='" + selectedSymbol + "']").addClass("active");
        }

        $('#searchOriginCall').on('input', function () {
            const origin = $(this).val();
            if (origin.length < 3) {
                $('#origenList').empty(); // Limpiamos el datalist
                return;
            }
            else if (origin.length > 2) {
                // Verificamos si hay datos en el localStorage y si coinciden con el origen actual
                var currentData = localStorage.getItem('origenResponse');
                if (currentData) {
                    var response = JSON.parse(currentData);
                    // Filtramos los datos del localStorage para comprobar si ya tenemos la información requerida
                    var filteredResponse = response.filter(function (item) {
                        return item.origen.toLowerCase().includes(origin.toLowerCase());
                    });
                    if (filteredResponse.length > 0) {
                        // Si encontramos coincidencias en los datos del localStorage, los mostramos
                        displayResultsOrigin(filteredResponse);
                        return; // Salimos de la función ya que encontramos los resultados
                    }
                }

                // Si no hay datos en el localStorage o no coinciden con el origen actual, hacemos la solicitud AJAX
                $.ajax({
                    url: './controllers/Reports/recordings.controllers.php',
                    type: 'post',
                    data: {
                        action: 'searchByOriginCall',
                        originCall: origin,
                        fechaInicio: $('#fechaInicio').val(),
                        fechaFin: $('#fechaFin').val()
                    },
                    dataType: 'json',
                    success: function (response) {
                        // Guardamos los nuevos datos en el localStorage
                        localStorage.setItem('origenResponse', JSON.stringify(response));
                        // Mostramos los resultados
                        displayResultsOrigin(response);
                    },
                    error: function (xhr, status, error) {
                        var errorMessage = xhr.responseText;
                        $('#origenList').empty();
                    }
                });
            } else {
                $('#origenList').empty();
            }
        });

        $('#searchDestinationCall').on('input', function () {
            const destination = $(this).val();

            if (destination.length < 3) {
                $('#destinationList').empty(); // Limpiamos el datalist
                return;
            }

            if (destination.length > 2) {

                // Verificamos si hay datos en el localStorage y si coinciden con el destino actual
                var currentData = localStorage.getItem('destinationResponse');
                if (currentData) {
                    var response = JSON.parse(currentData);
                    // Filtramos los datos del localStorage para comprobar si ya tenemos la información requerida
                    var filteredResponse = response.filter(function (item) {
                        return item.destino.toLowerCase().includes(destination.toLowerCase());
                    });
                    if (filteredResponse.length > 0) {
                        // Si encontramos coincidencias en los datos del localStorage, los mostramos
                        displayResultsDestination(filteredResponse);
                        return; // Salimos de la función ya que encontramos los resultados
                    }
                }

                // Si no hay datos en el localStorage o no coinciden con el origen actual, hacemos la solicitud AJAX
                $.ajax({
                    url: 'controllers/Reports/recordings.controllers.php',
                    type: 'post',
                    data: {
                        action: 'searchByDestinationCall',
                        destinationCall: destination,
                        fechaInicio: $('#fechaInicio').val(),
                        fechaFin: $('#fechaFin').val()
                    },
                    dataType: 'json',
                    success: function (response) {
                        // Guardamos los nuevos datos en el localStorage
                        localStorage.setItem('destinationResponse', JSON.stringify(response));
                        displayResultsDestination(response);
                    },
                    error: function (xhr, status, error) {
                        var errorMessage = xhr.responseText;
                        $('#destinationList').empty();
                    }
                });
            } else {
                $('#destinationList').empty();
            }
        });


        function displayResultsOrigin(response) {
            var datalist = $('#origenList');
            datalist.empty();

            if (response.length > 0) {
                response.forEach(function (item) {
                    var option = $('<option></option>').attr('value', item.origen);
                    datalist.append(option);
                });
            }
        }

        function displayResultsDestination(response) {
            var datalist = $('#destinationList');
            datalist.empty();

            if (response.length > 0) {
                response.forEach(function (item) {
                    var option = $('<option></option>').attr('value', item.destino);
                    datalist.append(option);
                });
            }
        }
        $('#searchOriginCall').on('change', function () {
            $('#origenList').empty();
        });
        $('#searchDestinationCall').on('change', function () {
            $('#destinationList').empty();
        });
        $("#recordingTable").DataTable({
            processing: true,
            serverSide: true,
            pageLength: 20,
            ajax: {
                url: 'controllers/Reports/recordings.controllers.php',
                type: 'post',
                data: function (d) {
                    d.action = 'pagination';
                    d.draw = d.draw;
                    d.startPag = d.start;
                    d.length = d.length;
                    d.fechaInicio = $('#fechaInicio').val();
                    d.fechaFin = $('#fechaFin').val();
                    d.origin = $('#searchOriginCall').val();
                    d.destination = $('#searchDestinationCall').val();
                    d.queues = $('#queues').val();
                    d.attendedAgents = $('#attendedAgents').val();
                    d.callClasses = $('#callClasses').val();
                    d.duration = $('#durationInSeconds').val();
                    d.symbolDuration = selectedSymbol || '>='
                    d.timeInSeconds = $('#EnSeg').is(':checked')
                },
            },
            "initComplete": function (settings, json) {
                $('.containerButtonsHelper').addClass('d-flex')
            },
            "columns": [
                { "data": "fecha" },
                { "data": "origen" },
                { "data": "destino" },
                { "data": "duracion" },
                { "data": "estado" },
                { "data": "cola" },
                { "data": "agente" },

                {
                    "data": "file",
                    "render": function (data, type, row, meta) {
                        return '<button class="btn btn-sm btn-secondary btnPlayRecord" data-file="' + data + '"><i class="fas fa-volume-up"></i> </button>';
                    }
                },
                {
                    "data": "file",
                    "render": function (data, type, row, meta) {
                        return '<input type="radio" name="radioDownloadRecord_' + meta.row + '" class="form-check-input radDownloadRecord" data-row="' + meta.row + '" data-file="' + data + '">';
                    }
                },
                {
                    "data": "id",
                    "render": function (data, type, row, meta) {
                        return '<input type="radio" name="radioDeleteRecord_' + meta.row + '" class="form-check-input radDeleteRecord" data-row="' + meta.row + '" data-file="' + data + '">';
                    }
                }
            ],
            rowCallback: async function (row, data, index) {
                let file = data.file;

                let $btn = $(row).find('.btnPlayRecord');
                $btn.prop('disabled', true);
                let exist = await checkRecording(file);
                $btn.data('exist', exist);
                if (exist) {
                    $btn.prop('disabled', false);
                    $btn.removeClass('btn-danger').addClass('btn-primary');
                } else {
                    $btn.prop('disabled', true);
                    $btn.removeClass('btn-danger').addClass('btn-danger');
                }
            },
            "language": {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla =(",
                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                },
                "buttons": {
                    "copy": "Copiar",
                    "colvis": "Visibilidad"
                },
                "search": "Buscar:"
            }
        });


        $('#recordingTable').on('click', '.btnPlayRecord', function () {

            let $button = $(this);
            $button.addClass('disabled'); // Desactiva el botón mientras se descarga
            $button.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');

            let filePath = $button.data('file');
            const basePath = '/var/spool/asterisk/monitor/';
            const relativePath = filePath.replace(basePath, '');
            var fileNameWithExtension = filePath.substring(filePath.lastIndexOf('/') + 1); // Obtiene "3215793800_99_5004-Nikol Mateus_20240427-115852.WAV"
            var fileName = fileNameWithExtension.replace(/\.[^/.]+$/, ""); // Remueve la extensión y obtiene "3215793800_99_5004-Nikol Mateus_20240427-115852"

            $.ajax({
                url: `https://${API_SERVER}:${PORT}/get-recording`,
                type: 'POST',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + jwt_token);
                },
                data: JSON.stringify({ recordingName: relativePath }),
                contentType: 'application/json',
                xhrFields: {
                    responseType: 'blob'
                },
                success: function (data) {
                    var blob = new Blob([data], { type: 'audio/ogg' });
                    var blobUrl = URL.createObjectURL(blob);

                    // Eliminar el reproductor de audio actual si existe
                    $('#audio-player').remove();

                    // Crear un elemento de audio con el ID audio-player
                    var audio = $('<audio controls id="audio-player"></audio>').attr('src', blobUrl);
                    $('#sectionRecordAudioTag').empty().append(audio).show();

                    // Inicializar Plyr en el nuevo elemento de audio
                    const player = new Plyr('#audio-player', {
                        controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'download', 'settings', 'fullscreen'],
                        autoplay: true
                    });
                    // Restaura el botón
                    $button.removeClass('disabled');
                    $button.html('<i class="fas fa-volume-up"></i>');
                },
                error: function (xhr, status, error) {
                    console.error('Error al obtener el archivo:', error);
                    // Restaura el botón
                    $button.removeClass('disabled');
                    $button.html('<i class="fas fa-volume-up"></i>');
                }
            })
        });

        $('#recordingTable').on('click', '.btnDownloadRecord', function () {

            let $button = $(this);
            $button.addClass('disabled'); // Desactiva el botón mientras se descarga
            $button.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');

            let filePath = $button.data('file');
            var fileNameWithExtension = filePath.substring(filePath.lastIndexOf('/') + 1); // Obtiene "3215793800_99_5004-Nikol Mateus_20240427-115852.WAV"
            var fileName = fileNameWithExtension.replace(/\.[^/.]+$/, ""); // Remueve la extensión y obtiene "3215793800_99_5004-Nikol Mateus_20240427-115852"
            $.ajax({
                url: `https://${API_SERVER}:${PORT}/get-recording`,
                type: 'POST',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + jwt_token);
                },
                data: JSON.stringify({ recordingName: fileName }),
                contentType: 'application/json',
                xhrFields: {
                    responseType: 'blob'
                },
                success: function (data) {
                    var blob = new Blob([data], { type: 'audio/ogg' });
                    var blobUrl = URL.createObjectURL(blob);
                    // Crea un enlace de descarga dinámico
                    var downloadLink = document.createElement('a');
                    downloadLink.href = blobUrl;
                    downloadLink.download = fileNameWithExtension;

                    // Simula el clic en el enlace para iniciar la descarga
                    document.body.appendChild(downloadLink);
                    downloadLink.click();

                    setTimeout(function () {
                        URL.revokeObjectURL(blobUrl);
                        document.body.removeChild(downloadLink);

                        // Restaura el botón
                        $button.removeClass('disabled');
                        $button.html('<i class="fas fa-download"></i>');
                    }, 100);
                },
                error: function (xhr, status, error) {
                    console.error('Error al obtener el archivo:', error);

                    // Restaura el botón en caso de error
                    $button.removeClass('disabled');
                    $button.html('<i class="fas fa-download"></i>');
                }
            })
        });
        $(document).on('change', 'input[type="radio"]', function () {
            // Desactivar todos los radios hermanos en la misma fila
            $(this).closest('tr').find('input[type="radio"]').not(this).prop('checked', false);
        });

        // Función para actualizar el indicador de cantidad
        function updateCountBadge(count, $badge) {
            $badge.text(count);
            if (count > 0) {
                $badge.show();
            } else {
                $badge.hide();
            }
        }

        // // Función para actualizar el estado de los botones y los indicadores de cantidad
        function updateButtonsState() {
            var downloadCount = $('input.radDownloadRecord:checked').length;
            var deleteCount = $('input.radDeleteRecord:checked').length;

            $('#btnGetDownloadFiles').prop('disabled', downloadCount === 0);
            $('#btnGetDeleteFiles').prop('disabled', deleteCount === 0);

            updateCountBadge(downloadCount, $('#downloadCountBadge'));
            updateCountBadge(deleteCount, $('#deleteCountBadge'));

            if (downloadCount || deleteCount >= 1) {
                $('#btnUncheckSelectedItems').show()
            } else {
                $('#btnUncheckSelectedItems').hide()
            }

            if (downloadCount >= 1) {
                $('#btnGetDownloadFiles').show()
            } else {
                $('#btnGetDownloadFiles').hide()
            }
            if (deleteCount >= 1) {
                $('#btnGetDeleteFiles').show()
            } else {
                $('#btnGetDeleteFiles').hide()
            }
        }

        // Obtener los archivos seleccionados al hacer clic en el botón de descarga
        $('#btnGetDownloadFiles').on('click', function () {

            let $button = $(this);
            $button.addClass('disabled'); // Desactiva el botón mientras se descarga
            $button.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Descargando...');
            var selectedDownloadFiles = $('input.radDownloadRecord:checked').map(function () {
                let filePath = $(this).data('file');
                const basePath = '/var/spool/asterisk/monitor/';
                const relativePath = filePath.replace(basePath, '');
                return relativePath
            }).get();


            countSelectedFiles = Object.keys(selectedDownloadFiles).length
            if (countSelectedFiles > 20) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Límite de descargas alcanzado',
                    text: 'Ha alcanzado el límite de descargas permitidas. Si necesita descargar más grabaciones, por favor contacte al administrador para obtener acceso por SSH.'
                });
                $button.removeClass('disabled');
                $button.html('<i class="fas fa-download"></i> Descargar');
                return
            }


            $.ajax({
                url: `https://${API_SERVER}:${PORT}/get-recordings-zip`,
                type: 'POST',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + jwt_token);
                },
                data: JSON.stringify({ recordingNames: selectedDownloadFiles }),
                contentType: 'application/json',
                xhrFields: {
                    responseType: 'blob'
                },
                success: function (data) {
                    var blob = new Blob([data]);
                    var url = window.URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = 'recordings.zip';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);

                    $button.removeClass('disabled');
                    $button.html('<i class="fas fa-download"></i> Descargar');

                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'La descarga del archivo ZIP fue exitosa'
                    });
                },
                error: function (xhr, status, error) {
                    console.error('Error al obtener el archivo:', error);

                    $button.removeClass('disabled');
                    $button.html('<i class="fas fa-download"></i> Descargar');
                }

            });
            Swal.fire({
                title: 'Comprimiendo grabaciones',
                html: '<div id="progressBar" class="progress"><div id="progressBarValue" class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                showConfirmButton: false
            });

            // Manejar mensajes del servidor WebSocket
            socket.onmessage = function (event) {
                const message = JSON.parse(event.data);
                if (message.type === 'progress') {
                    const progressData = message.data;

                    // Actualizar la barra de progreso
                    const progressBar = document.getElementById('progressBarValue');
                    progressBar.style.width = `${progressData.percentage}%`;

                    // Si el progreso es 100%, mostrar un mensaje de carga persistente
                    if (progressData.percentage === 100) {
                        Swal.fire({
                            title: 'Descargando archivo',
                            html: 'Esto puede tomar algún tiempo...',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            allowEnterKey: false,
                            showConfirmButton: false,
                            onBeforeOpen: () => {
                                Swal.showLoading(); // Mostrar el mensaje de carga
                            }
                        });


                    }
                }
            };
        });

        // Obtener los archivos seleccionados al hacer clic en el botón de eliminar
        $('#btnGetDeleteFiles').on('click', function () {

            let $button = $(this);
            $button.addClass('disabled'); // Desactiva el botón mientras se descarga
            $button.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Esperando confirmación...');

            var selectedDeleteIds = $('input.radDeleteRecord:checked').map(function () {
                return $(this).data('file');
            }).get();

            Swal.fire({
                title: '¿Estás seguro?',
                html: 'Estás a punto de eliminar los siguientes archivos:<br>' + selectedDeleteIds.join('<br>'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    $button.html('<i class="fas fa-trash"></i> Eliminando registros...');
                    $.ajax({
                        url: 'controllers/Reports/recordings.controllers.php',
                        type: 'post',
                        data: {
                            action: 'deleteRecordingsByIds',
                            ids: selectedDeleteIds
                        },
                        dataType: 'json',
                        success: function (response) {
                            // Guardamos los nuevos datos en el localStorage
                            $('#recordingTable').DataTable().ajax.reload();
                            Swal.fire(
                                'Eliminados!',
                                'Los archivos han sido eliminados correctamente.',
                                'success'
                            );

                            $button.removeClass('disabled');
                            $button.html('<i class="fas fa-trash"></i> Eliminar');
                        },
                        error: function (xhr, status, error) {
                            var errorMessage = xhr.responseText;
                            $('#destinationList').empty();
                            $button.removeClass('disabled');
                            $button.html('<i class="fas fa-trash"></i> Eliminar');
                        }
                    });

                } else {
                    $button.removeClass('disabled');
                    $button.html('<i class="fas fa-trash"></i> Eliminar');
                }
            });
        });

        $('#recordingTable').on('page.dt', function () {
            const downloadCount = parseInt($('#downloadCountBadge').text(), 10);
            const deletedCount = parseInt($('#deleteCountBadge').text(), 10);
            if (downloadCount || deletedCount >= 1) {
                Swal.fire({
                    title: '¿Está seguro?',
                    text: 'Está a punto de cambiar de página. ¿Desea continuar?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, continuar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $('#recordingTable').DataTable().page.jumpToData(0, false);
                    }
                });
            }

        });
        // Manejar el cambio de los radios
        $(document).on('change', 'input[type="radio"]', function () {
            // Desactivar todos los radios hermanos en la misma fila
            $(this).closest('tr').find('input[type="radio"]').not(this).prop('checked', false);

            // Actualizar el estado de los botones y los indicadores de cantidad
            updateButtonsState();
        });

        $('#btnUncheckSelectedItems').click(function (e) {
            $('input[type="radio"]').prop('checked', false);
            updateButtonsState();
        })

        $('.exportReportRecording').click(function (e) {

            e.preventDefault();
            e.stopPropagation();

            let $button = $(this);
            $button.addClass('disabled');
            $button.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Descargando...');

            const exportType = $button.data('type');

            const fechaInicio = $('#fechaInicio').val();
            const fechaFin = $('#fechaFin').val();
            const origin = $('#searchOriginCall').val();
            const destination = $('#searchDestinationCall').val();
            const queues = $('#queues').val();
            const attendedAgents = $('#attendedAgents').val();
            const callClasses = $('#callClasses').val();
            const duration = $('#durationInSeconds').val();
            const EnSeg = $('#EnSeg').is(':checked');

            const checkedItems = []; // Array para almacenar los elementos checkeados
            $('.dropdown-item input:checked').each(function () { // Iterar sobre los elementos checkeados
                checkedItems.push($(this).val()); // Agregar el valor del elemento checkeado al array
            });
            $.ajax({
                url: 'controllers/Reports/recordings.controllers.php',
                type: 'post',

                data: {
                    action: 'export',
                    exportType: exportType,
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    origin: origin,
                    destination: destination,
                    queues: queues,
                    attendedAgents: attendedAgents,
                    callClasses: callClasses,
                    duration: duration,
                    symbolDuration: selectedSymbol,
                    timeInSeconds: EnSeg,
                    items: checkedItems
                },
                xhrFields: {
                    responseType: 'blob' // Indicar que la respuesta será un Blob
                },
                success: function (response) {
                    const blob = new Blob([response], { type: exportType });
                    const url = window.URL.createObjectURL(blob);
                    const fileName = `Reporte-Grabaciones_${fechaInicio}_${fechaFin}.${exportType}`;

                    let link = document.createElement('a');
                    link.href = url;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    // Restaura el botón
                    $button.removeClass('disabled');
                    const icon = exportType === 'xlsx' ? 'excel' : exportType;
                    $button.html(`<i class="fas fa-file-${icon}"></i> ${exportType.toUpperCase()}`);
                },
                error: function (xhr, status, error) {
                    console.error('Error en la solicitud de exportación:', status, error);
                    $button.removeClass('disabled');
                    $button.html('<i class="fas fa-document"></i>');
                }
            });
        })

        function getRecordingDetail(filePath) {
            return new Promise((resolve, reject) => {
                const basePath = '/var/spool/asterisk/monitor/';
                const relativePath = filePath.replace(basePath, '');
                var fileNameWithExtension = filePath.substring(filePath.lastIndexOf('/') + 1);
                var fileName = fileNameWithExtension.replace(/\.[^/.]+$/, "");
                $.ajax({
                    url: `https://${API_SERVER}:${PORT}/get-recording-details`,
                    type: 'POST',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + jwt_token);
                    },
                    data: JSON.stringify({ recordingName: relativePath }),
                    contentType: 'application/json',
                    success: function (data) {
                        resolve(true); // Se encontró la grabación
                    },
                    error: function (xhr, status, error) {
                        console.error('Error al obtener el archivo:', error);
                        resolve(false); // No se encontró la grabación o hubo un error
                    }
                });
            });
        }
        // Función asíncrona para usar await
        async function checkRecording(file) {
            return await getRecordingDetail(file);
        }
    } else {
        console.error('Las variables de configuración no están disponibles.');
    }
})
