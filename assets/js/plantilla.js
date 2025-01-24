class DataTableConfig {
    constructor(pageLength, processing, serverSide) {
        this.pageLength = pageLength;
        this.processing = processing;
        this.serverSide = serverSide;
        this.language = {
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
        };
    }
}

$("#showMsgs").DataTable(new DataTableConfig(20, false, false));

$('#creategsmsTable').DataTable({
    pageLength: 20,
    dom: 'frtipB',
    buttons: [{
        extend: 'collection',
        className: 'exportButton',
        text: 'Exportar CSV',
        buttons: [
            {
                extend: 'csv',
                exportOptions: {
                    modifier: {
                        page: 'all',
                        search: 'none'
                    },
                    columns: ':not(:last-child)' // Excluye la última columna
                }
            },
            {
                extend: 'excel',
                exportOptions: {
                    modifier: {
                        page: 'all',
                        search: 'none'
                    },
                    columns: ':not(:last-child)' // Excluye la última columna
                }
            },
            {
                extend: 'pdf',
                orientation: 'landscape',
                exportOptions: {
                    modifier: {
                        page: 'all',
                        search: 'none'
                    },
                    columns: ':not(:last-child)' // Excluye la última columna
                }
            }
        ]
    }],
    language: {
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
    },
    paging: true
});
$("#createwppTable").DataTable(new DataTableConfig(20, false, false));
$("#ctrllogTable").DataTable(new DataTableConfig(20, false, false));

//esta función permite que el usuario no deseleccione todas las casillas que quiere exportar, dejando almenos 1 casilla checkeada.
$('#checkboxDropdown input[type="checkbox"]').click(function (event) {
    event.stopPropagation();
    var numSelected = $('#checkboxDropdown input[type="checkbox"]:checked').length;
    if (numSelected === 0) {
        $('#checkboxDropdown input[type="checkbox"]').first().prop('checked', true);
    }
});


$(document).ready(function () {

    let configOpen = false;

    $('#config-box').click(function () {
        if (!configOpen) {
            // Animación para ocultar el config-box y mostrar config-content
            $(this).animate({
                width: '0',
                opacity: 0
            }, 200, function () {
                $('#config-content').addClass('show').animate({
                    opacity: 1
                }, 200);
            });
        }
        configOpen = true;
    });

    $('#close-btn').click(function () {
        $('#config-content').animate({
            opacity: 0,
            transform: 'translateX(100%)'
        }, 200, function () {
            $('#config-content').removeClass('show');
            $('#config-box').animate({
                width: '40px',
                opacity: 1
            }, 200);
        });
        configOpen = false;
    });


    // Cambiar el estado del botón maestro (verde -> rojo)
    $('#masterBtn').click(function () {
        queuesInPause = false
        toggleBtnMaster = false // si es false, se muestra
        let queuesByAgent = []
        let masterBtn = $(this)
        if (masterBtn.find('i').hasClass('btn-green-on')) {
            // Cambiar a estado "Desloguear" con icono rojo
            toggleButtonState(masterBtn, 'btn-green-on', 'btn-red-off', 'Agente logueado');

            $('.queue-btn').each(function () {
                let queueBtn = $(this);
                const agentName = $("#agente").val();
                const queueName = queueBtn.data('queue-name');
                const queueExt = queueBtn.data('queue-ext');
                $('.queue-label').html("");
                queueBtn.prop('disabled', false);

                if (queueBtn.find('i').hasClass('btn-blue-pause')) {
                    toggleButtonState(queueBtn, 'btn-blue-pause', 'btn-green-on', 'Finalizar la pausa');

                    const queueLabel = queueBtn.siblings('.queue-label');


                    const dataText = queueLabel.data('text');
                    const dataValue = queueLabel.data('value');
                    queuesByAgent.push([agentName, queueName, queueExt, 'unpause', dataText, dataValue]);
                    queuesInPause = true
                }
            });

            // Condiciones para mostrar o ocultar el botón maestro
            function toggleMasterButton() {
                let blueCount = 0;
                let redCount = 0;
                let greenCount = 0;



                $('.queue-btn').each(function () {
                    if ($(this).find('i').hasClass('btn-blue-pause')) {
                        blueCount++;
                    } else if ($(this).find('i').hasClass('btn-red-off')) {
                        redCount++;
                    } else if ($(this).find('i').hasClass('btn-green-on')) {
                        greenCount++;
                    }
                });
                // Lógica para mostrar u ocultar el botón maestro
                if (blueCount > 0 && (redCount > 0 || greenCount > 0)) {
                    // Mostrar si hay al menos un botón azul y otros colores (rojo o verde)
                    $('#masterBtn').show();
                } else if (blueCount === 1 && redCount === 0 && greenCount === 0) {
                    // Mostrar si hay exactamente un botón azul y ningún rojo o verde
                    $('#masterBtn').show();
                } else if (blueCount > 0 && redCount === 0 && greenCount === 0) {
                    // Mostrar si todos son azules
                    $('#masterBtn').show();
                } else if (redCount > 0 && greenCount > 0 && blueCount === 0) {
                    // Ocultar si hay una mezcla de rojos y verdes, sin ningún azul
                    $('#masterBtn').hide();
                } else if (redCount > 0 && greenCount === 0 && blueCount === 0) {
                    // Mostrar si todos son rojos
                    $('#masterBtn').show();
                } else if (greenCount > 0 && redCount === 0 && blueCount === 0) {
                    // Mostrar si todos son verdes
                    $('#masterBtn').show();
                } else {
                    // Ocultar en cualquier otro caso
                    $('#masterBtn').hide();
                }
            }


            $('.queue-btn').each(function () {
                let queueBtn = $(this)
                const agentName = $("#agente").val()
                const queueName = queueBtn.data('queue-name')
                const queueExt = queueBtn.data('queue-ext')
                $('.queue-label').html("")

                const queueLabel = queueBtn.siblings('.queue-label');
                queueLabel.removeAttr('data-value');;
                queueLabel.removeAttr('data-text');;

                if (queueBtn.find('i').hasClass('btn-red-off') && !queuesInPause) {
                    toggleButtonState($(this), 'btn-red-off', 'btn-green-on', 'Finalizar la pausa');
                    queuesByAgent.push([agentName, queueName, queueExt, 'add', '', '']);
                }
            });
            // Llamamos a la función después de cada recorrido
            toggleMasterButton();
            queuesInPause = false
            currentAgentState = null
        } else {
            // Cambiar a estado "Loguear" con icono verde
            toggleButtonState(masterBtn, 'btn-red-off', 'btn-green-on', 'Agente deslogueado');
            let manageCalled = false;
            $('.queue-btn').each(function () {
                let queueBtn = $(this)
                const agentName = $("#agente").val()
                const queueName = queueBtn.data('queue-name')
                const queueExt = queueBtn.data('queue-ext')
                queueBtn.prop('disabled', false);
                toggleButtonState($(this), 'btn-green-on', 'btn-red-off', 'Loguear esta cola');
                queuesByAgent.push([agentName, queueName, queueExt, 'remove', '', '']);
                if (!manageCalled) {
                    manageCalled = true; // Cambia la bandera a true después de la primera ejecución
                }
            });
        }
        manageLoginOff(queuesByAgent)
    });

    // Función para alternar el estado del botón y el color del icono
    function toggleButtonState(button, removeClass, addClass, newTitle) {
        // Cambia las clases y el texto del botón
        button.find('i').removeClass(removeClass).addClass(addClass); // Cambia clases sin eliminar adicionales
        button.find('span').text(newTitle); // Cambia el texto

        // Verifica si el botón es `#masterBtn` para aplicar la eliminación de clases en `#config-box`
        if (button.is('#masterBtn')) {
            $('#config-box').find('i').removeClass(function (index, className) {
                return className.split(' ').slice(1).join(' '); // Elimina todas menos la primera clase
            }).addClass('fa-power-off ' + removeClass);
        } else {
            $('#config-box').find('i').removeClass(removeClass).addClass(addClass);
        }

    }


    // Cambiar el estado del botón de cada cola
    $('.queue-btn').click(function () {
        let queuesByAgent = []
        let queueBtn = $(this)
        const agentName = $("#agente").val()
        const queueName = queueBtn.data('queue-name')
        const queueExt = queueBtn.data('queue-ext')

        //LOGUEADO -> PASA A DESLOGUEADO
        if (queueBtn.find('i').hasClass('btn-green-on')) {
            toggleButtonState(queueBtn, 'btn-green-on', 'btn-red-off', 'Desloguear esta cola');
            disableInternoAgente()
            queuesByAgent.push([agentName, queueName, queueExt, 'remove', '', '']);
            //DESLOGUEADO -> PASA A LOGUEADO
        } else if (queueBtn.find('i').hasClass('btn-red-off')) {
            toggleButtonState(queueBtn, 'btn-red-off', 'btn-green-on', 'Desloguear esta cola');
            queuesByAgent.push([agentName, queueName, queueExt, 'add', '', '']);
            //EN PAUSA -> PASA A LOGUEADO
        } else if (queueBtn.find('i').hasClass('btn-blue-pause')) {
            // Inhabilita el botón si está en estado de pausa
            toggleButtonState(queueBtn, 'btn-blue-pause', 'btn-green-on', 'Desloguear esta cola');
            removeIconStateFromQueue(queueBtn)
            queuesByAgent.push([agentName, queueName, queueExt, 'unpause', '', '']);
        } else if (queueBtn.hasClass('btn-red-off')) {
            toggleButtonState(queueBtn, 'btn-red-off', 'btn-green-on', 'Loguear esta cola');
        }
        checkButtonsStateOnQueueBtn();
        manageLoginOff(queuesByAgent)
    });


    function manageLoginOff(queues) {
        if (Array.isArray(queues) && queues.length > 0) {
            $.ajax({
                url: 'controllers/CRM/crmasesor.controllers.php',
                type: 'post',
                data: {
                    action: 'gestionarLoginLogoff',
                    data: queues
                },
                success: function (data) {
                    const response = JSON.parse(data);
                    let type = 'success';
                    const pausedQueues = queues.filter(item => item[3] === "pause");
                    const unpausedQueues = queues.filter(item => item[3] === "unpause");
                    const addedQueues = queues.filter(item => item[3] === "add");
                    const removedQueues = queues.filter(item => item[3] === "remove");

                    if (pausedQueues.length > 0) {
                        showSwalAlert(
                            type,
                            pausedQueues.length > 1
                                ? `El agente entró en pausa <strong>${pausedQueues[0][4]}</strong> en las colas <strong>${pausedQueues.map(item => item[1]).join(", ")}</strong>`
                                : `El agente entró en pausa <strong>${pausedQueues[0][4]}</strong> en la cola <strong>${pausedQueues[0][1]}</strong>`
                        );
                    }

                    if (unpausedQueues.length > 0) {
                        showSwalAlert(
                            type,
                            unpausedQueues.length > 1
                                ? `El agente salió de pausa en las colas <strong>${unpausedQueues.map(item => item[1]).join(", ")}</strong> (motivo: <strong>${unpausedQueues[0][4]}</strong>)`
                                : `El agente salió de pausa en la cola <strong>${unpausedQueues[0][1]}</strong> (motivo: <strong>${unpausedQueues[0][4]}</strong>)`
                        );
                    }

                    if (addedQueues.length > 0) {
                        showSwalAlert(
                            type,
                            addedQueues.length > 1
                                ? `El agente se logueó en las colas <strong>${addedQueues.map(item => item[1]).join(", ")}</strong>`
                                : `El agente se logueó en la cola <strong>${addedQueues[0][1]}</strong>`
                        );
                    }

                    if (removedQueues.length > 0) {
                        showSwalAlert(
                            type,
                            removedQueues.length > 1
                                ? `El agente se deslogueó de las colas <strong>${removedQueues.map(item => item[1]).join(", ")}</strong>`
                                : `El agente se deslogueó de la cola <strong>${removedQueues[0][1]}</strong>`
                        );
                    }

                },
                error: function (xhr, status, error) {
                    console.error('Error al cambiar de estado', error);
                }
            });
        }
    }

    let $selectTrigger = $('.select-trigger');
    let initialText = "Seleccionar estado";  // El estado inicial que quieres mostrar
    let initialIcon = "fas fa-bars";

    $selectTrigger.on('click', function () {
        let $select = $(this).closest('.custom-select');
        $('.custom-select').not($select).removeClass('select-open');
        $select.toggleClass('select-open');
    });
    let previousAgentState = null;
    let previousAgentStateText = null;
    let currentAgentStateText = null;
    let currentAgentState = null;
    let agentWasLogged = true

    $('.queue-btn').each(function () {
        let queueBtn = $(this)
        let queueLabel = queueBtn.siblings('.queue-label');
        queueBtn.siblings('.queue-label');
        let dataValue = queueLabel.data('value');
        if (dataValue && String(dataValue).trim() !== "") {
            currentAgentState = dataValue
        }
    });
    // Seleccionar una pausa del dropdown
    $('.dropdownSelectStatesItem').on('click', function () {
        let $select = $(this).closest('.custom-select');
        let selectedText = $(this).text().trim();
        let selectedIcon = $(this).data('icon');
        let selectedValue = $(this).data('value')
        let queuesInPause = false

        let queuesByAgent = []




        if (currentAgentState !== selectedValue) {
            previousAgentState = currentAgentState;
            currentAgentState = selectedValue;

            $('.queue-btn').each(function () {
                let queueBtn = $(this)
                if (queueBtn.find('i').hasClass('btn-red-off') && queuesInPause) {
                    $(this).prop('disabled', true);
                    queueBtn.siblings('.queue-label').html("");
                }
            });

            $('.queue-btn').each(function () {
                let queueBtn = $(this)
                const agentName = $("#agente").val()
                const queueName = queueBtn.data('queue-name')
                const queueExt = queueBtn.data('queue-ext')

                if (queueBtn.find('i').hasClass('btn-green-on') || queueBtn.find('i').hasClass('btn-blue-pause')) {
                    toggleButtonState($(this), 'btn-green-on btn-red-off', 'btn-blue-pause', 'Finalizar la pausa');
                    $(this).prop('disabled', true);
                    $('.queue-label')
                        .html(`<i class="${selectedIcon}"></i>`)
                        .attr('title', selectedText)
                        .attr('data-text', selectedText)
                        .attr('data-value', selectedValue);
                    $('#masterBtn').show()
                    queuesByAgent.push([agentName, queueName, queueExt, 'pause', selectedText, selectedValue]);
                    queuesInPause = true

                }
            });
            $('.queue-btn').each(function () {
                let queueBtn = $(this)
                if (queueBtn.find('i').hasClass('btn-red-off') && queuesInPause) {
                    $(this).prop('disabled', true);
                    queueBtn.siblings('.queue-label').html("");
                }
            });
        }

        if (queuesInPause) {
            $('#config-box').find('i')
                .removeClass(function (index, className) {
                    return (className.match(/\bfa-\S+/g) || []).join(' ');
                })
                .addClass(`${selectedIcon} btn-blue-pause`)
                .attr('title', selectedText);
        } else {
            $('#config-box').find('i')
                .removeClass(function (index, className) {
                    return (className.match(/\bfa-\S+/g) || []).join(' ');
                })
                .addClass(`fas fa-power-off btn-red-off`)
                .attr('title', selectedText);
        }


        //dejar el botón master si está en rojo
        if ($('#masterBtn').find('i').hasClass('btn-red-off')) {
            $('#masterBtn').find('i').removeClass('btn-red-off').addClass('btn-green-on')
        }

        // Cambiar el texto y el ícono del select
        $select.find('.select-trigger span').text(selectedText);
        $select.find('.select-trigger i:first').attr('class', selectedIcon);

        $select.removeClass('select-open'); // Cerrar el select después de seleccionar
        resetToInitialState()

        manageLoginOff(queuesByAgent)
    });

    function resetToInitialState() {
        // Cambiar el texto y el icono del select trigger a los valores iniciales
        $selectTrigger.find('span').text(initialText);
        $selectTrigger.find('i:first').removeClass().addClass(initialIcon);

        // Restaurar los valores seleccionados (si los tienes)
        previousAgentState = null;
        previousAgentStateText = null;
    }


    // Cerrar el select si se hace clic fuera de él
    $(document).on('click', function (event) {
        if (!$(event.target).closest('.custom-select').length) {
            $('.custom-select').removeClass('select-open');
        }
    });

    //esta función remueve el icono de la cola seleccionada
    function removeIconStateFromQueue(queue) {
        var $label = queue.prev('.queue-label');
        $label.find('i').fadeOut(200, function () {
            $(this).remove();
        });
        $label.removeAttr('title');
    }

    function showSwalAlert(type, message) {
        Swal.fire({
            html: message,
            icon: type,
            position: 'bottom-end',  // Posiciona la alerta en la esquina inferior derecha
            showConfirmButton: false, // Ocultar botón de confirmación
            timer: 3000, // Duración de la alerta (3 segundos)
            toast: true, // Estilo "toast" para alerta pequeña
            customClass: {
                popup: 'swal2-toast'
            }
        });
    }

    //esta función sirve para establecer el status del botón master, a rojo o a verde, dependiendo
    //de los botones de cola, si todas estan activas, entonces el botón principal cambia a rojo, si todas las colas estan inactivas,
    //el botón principal cambia a verde.
    function checkButtonsStateOnQueueBtn() {
        let allRedOff = true;
        let allGreenOn = true;
        let allBlueOn = true;

        // Recorrer cada botón con la clase 'queue-btn'
        $('.queue-btn').each(function () {
            // Buscar el icono <i> dentro del botón y verificar si tiene la clase 'btn-red-off'
            if (!$(this).find('i').hasClass('btn-red-off')) {
                allRedOff = false; // Si alguno no tiene la clase, marcar como falso
            }
            if (!$(this).find('i').hasClass('btn-green-on')) {
                allGreenOn = false; // Si alguno no tiene la clase, marcar como falso
            }
            if (!$(this).find('i').hasClass('btn-blue-pause')) {
                allBlueOn = false; // Si alguno no tiene la clase, marcar como falso
            }
        });
        $('#masterBtn').hide()
        // Si todos los iconos tienen la clase 'btn-red-off', habilitar el botón masterBtn
        if (allRedOff) {
            $('#masterBtn').find('i').removeClass('btn-red-off').addClass('btn-green-on')
            $('#masterBtn').show()
        }
        if (allBlueOn) {
            $('.queue-btn').click(function () {
                let queueBtn = $(this)
                const agent = $("#agente").val()
                const queueName = queueBtn.data('queue-name')
                const queueExt = queueBtn.data('queue-ext')

                //LOGUEADO -> PASA A DESLOGUEADO
                if (queueBtn.find('i').hasClass('btn-blue-pause')) {
                    // Inhabilita el botón si está en estado de pausa
                    toggleButtonState(queueBtn, 'btn-blue-pause', 'btn-green-on', 'Desloguear esta cola');
                    removeIconStateFromQueue(queueBtn)

                    //manageLoginOff(agent, queueName, queueExt, true, 'pause', 'unpause')
                }
            });
        }
        if (allGreenOn) {
            $('#masterBtn').show()
            $('#masterBtn').find('i').removeClass('btn-green-on').addClass('btn-red-off')
        }

    }
});
document.addEventListener('DOMContentLoaded', function () {
    const scrollWrapper = document.querySelector('.scroll-wrapper');

    scrollWrapper.addEventListener('wheel', function (event) {
        // Solo se permite el scroll dentro de `scroll-wrapper`
        event.stopPropagation();
    });
});

function showSwalAlert(type, message) {
    Swal.fire({
        html: message,
        icon: type,
        position: 'bottom-end',  // Posiciona la alerta en la esquina inferior derecha
        showConfirmButton: false, // Ocultar botón de confirmación
        timer: 3000, // Duración de la alerta (3 segundos)
        toast: true, // Estilo "toast" para alerta pequeña
        customClass: {
            popup: 'swal2-toast'
        }
    });
}

//habilita los selects interno [inalcanzable] y agente
function enableInternoAgente() {
    $('#interno').attr('disabled', true)
    $('#agente').attr('disabled', true)
}

//inhabilita los selects interno [inalcanzable] y agente
function disableInternoAgente() {
    $('#interno').attr('disabled', false)
    $('#agente').attr('disabled', false)
}

function updateCheckbox(checkbox, user, ext) {
    // Crear un objeto XMLHttpRequest
    const xhr = new XMLHttpRequest();

    // Verificar si el checkbox está marcado o no
    const value = checkbox.checked ? 0 : 1;

    $.ajax({
        url: 'ajax/updateEMBPOPUP.php',
        type: 'POST',

        data: {
            actionEMB: 1,
            value: value,
            user: user
        },
        contentType: "application/x-www-form-urlencoded",
        success: function (response) {

            let message = `se actualizo Abrir registros entrantes`
            let type = 'success'
            showSwalAlert(type, message);

            location.reload();
        },
        error: function (xhr, status, error) {
            console.error('Error al cambiar el estado:', status, error);
        }
    });
}


function MostrarDatos(Quien, OK) {
    console.log("Datos recibidos en MostrarDatos: ", OK);

    switch (Quien) {
        case "embPopup":
            if (OK && typeof OK.openPP === "string" && OK.openPP.trim() !== "") {
                const width = 1024;
                const height = 768;
                const left = (window.screen.width - width) / 2;
                const top = (window.screen.height - height) / 2;
                const features = `width=${width},height=${height},top=${top},left=${left},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`;

                // Create popup with loading indicator
                const popupWindow = window.open('about:blank', 'PopupWindow', features);

                if (popupWindow) {
                    // Show loading spinner
                    popupWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Cargando...</title>
                            <style>
                                .loader-container {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    height: 100vh;
                                    background: #f5f5f5;
                                }
                                .loader {
                                    width: 48px;
                                    height: 48px;
                                    border: 5px solid #FFF;
                                    border-bottom-color: #FF3D00;
                                    border-radius: 50%;
                                    box-sizing: border-box;
                                    animation: rotation 1s linear infinite;
                                }
                                @keyframes rotation {
                                    0% { transform: rotate(0deg); }
                                    100% { transform: rotate(360deg); }
                                }
                            </style>
                        </head>
                        <body>
                            <div class="loader-container">
                                <div class="loader"></div>
                            </div>
                        </body>
                        </html>
                    `);

                    // Set loading timeout
                    const timeoutId = setTimeout(() => {
                        popupWindow.close();
                        console.error("Timeout al cargar la ventana");
                    }, 30000);

                    // Preload content
                    fetch(OK.openPP)
                        .then(response => {
                            if (!response.ok) throw new Error('Network response was not ok');
                            return response.text();
                        })
                        .then(() => {
                            clearTimeout(timeoutId);
                            popupWindow.location.href = OK.openPP;

                            // Apply optimizations after content loads
                            const applyOptimizations = () => {
                                try {
                                    const doc = popupWindow.document;

                                    // Apply zoom and transform
                                    doc.body.style.zoom = "80%";
                                    doc.body.style.transform = "scale(0.8)";
                                    doc.body.style.transformOrigin = "0 0";

                                    // Performance optimizations
                                    doc.body.style.willChange = "transform";
                                    doc.body.style.backfaceVisibility = "hidden";
                                    doc.body.style.webkitTransform = "translateZ(0)";

                                    // Remove event listener after first execution
                                    popupWindow.removeEventListener('load', applyOptimizations);
                                    popupWindow.focus();
                                } catch (e) {
                                    console.error("Error applying optimizations:", e);
                                }
                            };

                            popupWindow.addEventListener('load', applyOptimizations);
                        })
                        .catch(error => {
                            clearTimeout(timeoutId);
                            console.error("Error loading popup:", error);
                            popupWindow.close();
                        });

                    // Cleanup on window close
                    popupWindow.onbeforeunload = () => {
                        clearTimeout(timeoutId);
                    };
                } else {
                    console.error("Popup bloqueado por el navegador");
                }
            } else {
                console.error("URL inválida para el popup");
            }
            break;

        default:
            console.warn("Caso no manejado: ", Quien);
            break;
    }
}

function ObtenerDatos(Quien, response) {
    console.log("Entrando a ObtenerDatos con: ", Quien, response);

    let jsonResponse;

    if (typeof response === "string") {
        try {
            jsonResponse = JSON.parse(response);
            console.log("Respuesta parseada como JSON: ", jsonResponse);
        } catch (e) {
            console.error("Error al analizar la respuesta JSON: ", e);
            return;
        }
    } else {
        jsonResponse = response;
    }

    console.log("JSON final procesado: ", jsonResponse);

    if (jsonResponse.Respuesta) {
        console.log("Respuesta encontrada: ", jsonResponse.Respuesta);
        MostrarDatos(Quien, jsonResponse.Respuesta);
    } else {
        console.error("El JSON no contiene el nodo 'Respuesta'.");
    }
}


/* Función que hace la llamada AJAX */
function TraerDatos(URL, Query, Tipo, Quien) {
    $.ajax({
        url: URL,
        type: Tipo, // Puede ser 'POST' o 'GET'
        data: Query, // Los datos que envías en el Query
        success: function (response, textStatus, jqXHR) {
            console.log("Respuesta recibida correctamente: ", response);

            const contentType = jqXHR.getResponseHeader("Content-Type") || "";
            console.log("Content-Type detectado: ", contentType);

            if (contentType.includes("application/json") || typeof response === "object") {
                // Si es JSON o un objeto ya parseado
                try {
                    var jsonResponse = typeof response === "string" ? JSON.parse(response) : response;
                    console.log("JSON parseado correctamente: ", jsonResponse);
                    console.log("Llamando a ObtenerDatos con: ", Quien, jsonResponse);
                    ObtenerDatos(Quien, jsonResponse);
                } catch (e) {
                    console.error("Error al analizar la respuesta JSON: ", e);
                    if (typeof MostrarError === 'function') {
                        MostrarError("Error al analizar la respuesta JSON.");
                    }
                }
            } else {
                // console.warn("Tipo de respuesta no manejado: ", contentType);
                if (typeof MostrarError === 'function') {
                    MostrarError("Tipo de respuesta no manejado.");
                }
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            //console.error(`Error en la petición: ${textStatus}`, errorThrown);
            if (typeof MostrarError === "function") {
                MostrarError(`Error en la petición: ${textStatus}`);
            }
        }
    });
}