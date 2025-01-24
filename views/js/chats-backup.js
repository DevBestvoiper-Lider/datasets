const ws = new WebSocket('ws://localhost:8080');

var audio = new Audio('views/sounds/notification-18.mp3');

function autoScroll() {
    var scrollContainer = $('#Conversation');
    // Scroll hacia el final del contenedor
    scrollContainer.scrollTop(scrollContainer.prop("scrollHeight"));
}


function cargarDatos() {
    $.ajax({
        url: 'views/modules/includes/chats/list-chats.php',  // Reemplaza 'ruta/al/archivo.php' con la ruta correcta a tu archivo PHP
        type: 'GET',  // Puedes usar 'POST' si es necesario
        dataType: 'json',  // Espera una respuesta en formato JSON
        success: function (response) {

            var chats = response.data.data.data;

            var chatsArray = Object.values(chats);

            console.log(chatsArray);

            var countUnRead = 0;
            var unreads = '';

            for (var i = 0; i < chatsArray.length; i++) {
                if (chatsArray[i] && typeof chatsArray[i] === 'object') {

                    if (chatsArray[i].room_status_id != null) {
                        if (chatsArray[i].room_status_id == 3) {

                            if (chatsArray[i].read_message === 0) {
                                countUnRead++;
                                // Si es igual a 0, agrega <b>...</b> alrededor del texto
                                unreads = '<span class="badge badge-center rounded-pill bg-danger ms-auto">' + countUnRead + '</span>';
                            } else {
                                unreads = '';
                            }

                        }
                    }
                }
            }

            // autoScroll();

            // console.log(countUnRead);

            var html = '<li class="chat-contact-list-item chat-contact-list-item-title"><h5 class="text-primary mb-0">Chats Activos</h5>' + unreads + '</li>';

            // html += '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            // html += '<h2>Chats:</h2>';
            for (var i = 0; i < chatsArray.length; i++) {

                // console.log(chatsArray);
                // Verifica si el elemento es un objeto y no es null
                if (chatsArray[i] && typeof chatsArray[i] === 'object') {
                    // Accede a la propiedad title solo si existe
                    var title = chatsArray[i].title ? chatsArray[i].title : 'Sin título';
                    var id = chatsArray[i].id ? chatsArray[i].id : 'N/A';
                    var contacto = chatsArray[i].contacto ? chatsArray[i].contacto : 'N/A';
                    // html += '<li>title: ' + title + '</li>';

                    if (chatsArray[i].plataforma == "web") {
                        var img = "assets/img/icons/web.png";
                        var idImg = 1;
                    } else if (chatsArray[i].plataforma == "whatsapp") {
                        var img = "assets/img/icons/whatsapp.png";
                        var idImg = 2;
                    } else if (chatsArray[i].plataforma == "facebook") {
                        var img = "assets/img/icons/messenger.png";
                        var idImg = 3;
                    } else if (chatsArray[i].plataforma == "instagram") {
                        var img = "assets/img/icons/instagram.png";
                        var idImg = 4;
                    }


                    // // Accede al campo id dentro del objeto latest_message solo si existe
                    var latestMessageId = chatsArray[i].latest_message && chatsArray[i].latest_message.sender_id ? chatsArray[i].latest_message.sender_id : 'N/A';
                    // html += '<li>id: ' + latestMessageId + '</li>';

                    if (chatsArray[i].room_status_id == 3) {
                        html += '<li class="chat-contact-list-item ">';
                        html += '<a class="d-flex align-items-center" onclick="defineIdRoom(' + id + ', ' + idImg + '); LeerMensaje(' + id + ');">';
                        html += '<div class="flex-shrink-0 avatar avatar-online">';
                        html += '<img src="' + img + '" alt="Avatar" class="rounded-circle" />';
                        html += '</div>';
                        html += '<div class="chat-contact-info flex-grow-1 ms-3">';
                        html += '<h6 class="chat-contact-name text-truncate m-0">' + title + ' ' + id + '</h6>';

                        if (latestMessageId == 7) {
                            var namelatestMessage = "Tu";
                        }
                        if (latestMessageId == 2) {
                            var namelatestMessage = "Bot";
                        }
                        if (latestMessageId == 1) {
                            var namelatestMessage = "Cliente";
                        }

                        // Verifica si el read_id es igual a 0
                        if (chatsArray[i].read_message === 0) {
                            if (chatsArray[i].latest_message != null) {
                                if (chatsArray[i].latest_message.ext === null || chatsArray[i].latest_message.ext === "") {
                                    html += '<p class="chat-contact-status text-truncate mb-0 text-muted"><b>' + namelatestMessage + ': ' + escapeHtml(chatsArray[i].latest_message.content) + '</b></p>';
                                } else if (chatsArray[i].latest_message.ext === "jpeg" || chatsArray[i].latest_message.ext === "jpg" || chatsArray[i].latest_message.ext === "webp" || chatsArray[i].latest_message.ext === "png") {
                                    html += '<p class="chat-contact-status text-truncate mb-0 text-muted"><b>' + namelatestMessage + ': Imagen</b></p>';
                                } else {
                                    html += '<p class="chat-contact-status text-truncate mb-0 text-muted"><b>' + namelatestMessage + ': Archivo Adjunto</b></p>';
                                }
                            }

                        } else {
                            if (chatsArray[i].latest_message.ext === null || chatsArray[i].latest_message.ext === "") {
                                html += '<p class="chat-contact-status text-truncate mb-0 text-muted">' + namelatestMessage + ': ' + escapeHtml(chatsArray[i].latest_message.content) + '</p>';
                            } else if (chatsArray[i].latest_message.ext === "jpeg" || chatsArray[i].latest_message.ext === "jpg" || chatsArray[i].latest_message.ext === "webp" || chatsArray[i].latest_message.ext === "png") {
                                html += '<p class="chat-contact-status text-truncate mb-0 text-muted">' + namelatestMessage + ': Imagen</p>';
                            } else {
                                html += '<p class="chat-contact-status text-truncate mb-0 text-muted">' + namelatestMessage + ': Archivo Adjunto</p>';
                            }
                        }
                        html += '</div>';
                        html += '</a>';
                        html += '</li>';

                    }
                    // // Puedes acceder a otros campos del objeto de manera similar
                    // var userId = chatsArray[i].user_id ? chatsArray[i].user_id : 'N/A';
                    // html += '<li>user_id: ' + userId + '</li>';
                    // ... Añade más campos según sea necesario
                }
            }
            html += '<li class="chat-contact-list-item chat-contact-list-item-title"><h5 class="text-primary mb-0">Chats Nuevos</h5></li>';
            for (var i = 0; i < chatsArray.length; i++) {

                // Verifica si el elemento es un objeto y no es null
                if (chatsArray[i] && typeof chatsArray[i] === 'object') {
                    // Accede a la propiedad title solo si existe
                    var title = chatsArray[i].title ? chatsArray[i].title : 'Sin título';
                    var id = chatsArray[i].id ? chatsArray[i].id : 'N/A';
                    // html += '<li>title: ' + title + '</li>';

                    if (chatsArray[i].plataforma == "web") {
                        var img = "assets/img/icons/web.png";
                        var idImg = 1;
                    } else if (chatsArray[i].plataforma == "whatsapp") {
                        var img = "assets/img/icons/whatsapp.png";
                        var idImg = 2;
                    } else if (chatsArray[i].plataforma == "facebook") {
                        var img = "assets/img/icons/messenger.png";
                        var idImg = 3;
                    } else if (chatsArray[i].plataforma == "instagram") {
                        var img = "assets/img/icons/instagram.png";
                        var idImg = 4;
                    }

                    // // Accede al campo id dentro del objeto latest_message solo si existe
                    var latestMessageId = chatsArray[i].latest_message && chatsArray[i].latest_message.sender_id ? chatsArray[i].latest_message.sender_id : 'N/A';
                    // html += '<li>id: ' + latestMessageId + '</li>';
                    if (chatsArray[i].room_status_id == 2) {

                        html += '<li class="chat-contact-list-item">';
                        html += '<a class="d-flex align-items-center" onclick="defineIdRoom(' + id + ', ' + idImg + '); LeerMensaje(' + id + '); ">';
                        html += '<div class="flex-shrink-0 avatar ">';
                        html += '<img src="' + img + '" alt="Avatar" class="rounded-circle" />';
                        html += '</div>';
                        html += '<div class="chat-contact-info flex-grow-1 ms-3">';
                        html += '<h6 class="chat-contact-name text-truncate m-0">' + title + ' ' + id + '</h6>';

                        if (latestMessageId == 7) {
                            var namelatestMessage = "Tu";
                        }
                        if (latestMessageId == 2) {
                            var namelatestMessage = "Bot";
                        }
                        if (latestMessageId == 1) {
                            var namelatestMessage = "Cliente";
                        }

                        // Verifica si el read_id es igual a 0
                        if (chatsArray[i].read_message === 0) {
                            if (chatsArray[i].latest_message != null) {
                                if (chatsArray[i].latest_message.ext === null || chatsArray[i].latest_message.ext === "") {
                                    html += '<p class="chat-contact-status text-truncate mb-0 text-muted"><b>' + namelatestMessage + ': ' + escapeHtml(chatsArray[i].latest_message.content) + '</b></p>';
                                } else if (chatsArray[i].latest_message.ext === "jpeg" || chatsArray[i].latest_message.ext === "jpg" || chatsArray[i].latest_message.ext === "webp" || chatsArray[i].latest_message.ext === "png") {
                                    html += '<p class="chat-contact-status text-truncate mb-0 text-muted"><b>' + namelatestMessage + ': Imagen</b></p>';
                                } else {
                                    html += '<p class="chat-contact-status text-truncate mb-0 text-muted"><b>' + namelatestMessage + ': Archivo Adjunto</b></p>';
                                }
                            }

                        } else {
                            if (chatsArray[i].latest_message.ext === null || chatsArray[i].latest_message.ext === "") {
                                html += '<p class="chat-contact-status text-truncate mb-0 text-muted">' + namelatestMessage + ': ' + escapeHtml(chatsArray[i].latest_message.content) + '</p>';
                            } else if (chatsArray[i].latest_message.ext === "jpeg" || chatsArray[i].latest_message.ext === "jpg" || chatsArray[i].latest_message.ext === "webp" || chatsArray[i].latest_message.ext === "png") {
                                html += '<p class="chat-contact-status text-truncate mb-0 text-muted">' + namelatestMessage + ': Imagen</p>';
                            } else {
                                html += '<p class="chat-contact-status text-truncate mb-0 text-muted">' + namelatestMessage + ': Archivo Adjunto</p>';
                            }
                        }
                        html += '</div>';
                        html += '</a>';
                        html += '</li>';

                    }

                    // // Puedes acceder a otros campos del objeto de manera similar
                    // var userId = chatsArray[i].user_id ? chatsArray[i].user_id : 'N/A';
                    // html += '<li>user_id: ' + userId + '</li>';
                    // ... Añade más campos según sea necesario
                }

            }

            // html += '<li class="chat-contact-list-item chat-contact-list-item-title"><h5 class="text-primary mb-0">Chats Cerrados</h5></li>';
            // for (var i = 0; i < chatsArray.length; i++) {

            //     // Verifica si el elemento es un objeto y no es null
            //     if (chatsArray[i] && typeof chatsArray[i] === 'object') {
            //         // Accede a la propiedad title solo si existe
            //         var title = chatsArray[i].title ? chatsArray[i].title : 'Sin título';
            //         var id = chatsArray[i].id ? chatsArray[i].id : 'N/A';
            //         // html += '<li>title: ' + title + '</li>';

            //         if(chatsArray[i].plataforma == "web"){
            //             var img = "assets/img/icons/web.png";
            //             var idImg = 1;
            //         } else if (chatsArray[i].plataforma == "whatsapp"){
            //             var img = "assets/img/icons/whatsapp.png";
            //             var idImg = 2;
            //         } else if (chatsArray[i].plataforma == "facebook"){
            //             var img = "assets/img/icons/messenger.png";
            //             var idImg = 3;
            //         } else if (chatsArray[i].plataforma == "instagram"){
            //             var img = "assets/img/icons/instagram.png";
            //             var idImg = 4;
            //         }

            //         // // Accede al campo id dentro del objeto latest_message solo si existe
            //         var latestMessageId = chatsArray[i].latest_message && chatsArray[i].latest_message.sender_id ? chatsArray[i].latest_message.sender_id : 'N/A';
            //         // html += '<li>id: ' + latestMessageId + '</li>';  
            //         if (chatsArray[i].room_status_id == 9){
            //             html += '<li class="chat-contact-list-item">';
            //             html += '<a class="d-flex align-items-center" onclick="defineIdRoom(' +id+ ', ' + idImg +');">';
            //             html += '<div class="flex-shrink-0 avatar avatar-offline">';
            //             html += '<img src="'+ img +'" alt="Avatar" class="rounded-circle" />';
            //             html += '</div>';
            //             html += '<div class="chat-contact-info flex-grow-1 ms-3">';
            //             html += '<h6 class="chat-contact-name text-truncate m-0">'+ title + ' ' + id +'</h6>';

            //             if (latestMessageId == 7){
            //                 var namelatestMessage = "Tu";
            //             }
            //             if (latestMessageId == 2){
            //                 var namelatestMessage = "Bot";
            //             }
            //             if (latestMessageId == 1){
            //                 var namelatestMessage = "Cliente";
            //             }

            //             if (chatsArray[i].latest_message != null) {
            //                 if (chatsArray[i].latest_message.ext != null || chatsArray[i].latest_message.ext != "") {
            //                     html += '<p class="chat-contact-status text-truncate mb-0 text-muted">'+ namelatestMessage + ': ' + chatsArray[i].latest_message.content +'</p>';
            //                 } else if (chatsArray[i].latest_message.ext === "jpeg" || chatsArray[i].latest_message.ext === "jpg" || chatsArray[i].latest_message.ext === "webp" || chatsArray[i].latest_message.ext === "png"){
            //                     html += '<p class="chat-contact-status text-truncate mb-0 text-muted">'+ namelatestMessage + ': Imagen</p>';
            //                 } else {
            //                     html += '<p class="chat-contact-status text-truncate mb-0 text-muted">'+ namelatestMessage + ': Archivo Adjunto</p>';
            //                 }
            //             }
            //             html += '</div>';
            //             html += '<small class="text-muted mb-auto">5 Minutes</small>';
            //             html += '</a>';
            //             html += '</li>';

            //         }
            //         // // Puedes acceder a otros campos del objeto de manera similar
            //         // var userId = chatsArray[i].user_id ? chatsArray[i].user_id : 'N/A';
            //         // html += '<li>user_id: ' + userId + '</li>';
            //         // ... Añade más campos según sea necesario
            //     }

            // }

            $('#chat-list').html(html);

            // Maneja la respuesta exitosa
            // console.log(response);
            // Puedes procesar los datos recibidos aquí
        },
        error: function (error) {
            // Maneja el error
            console.error('Error en la solicitud AJAX:', error);
        }
    });
}

function autoScroll() {
    var scrollContainer = $('#chatBody');
    // Scroll hacia el final del contenedor
    scrollContainer.scrollTop(scrollContainer.prop("scrollHeight"));
}

function ValidarContacto(idContacto) {
}

// Definición de la función onclick
function defineIdRoom(id, plataform) {
    // Definir la variable global
    globalRoom = id;

    if (plataform == 1) {
        imgConversation = "assets/img/icons/web.png";
    } else if (plataform == 2) {
        imgConversation = "assets/img/icons/whatsapp.png";
    } else if (plataform == 3) {
        imgConversation = "assets/img/icons/messenger.png";
    } else if (plataform == 4) {
        imgConversation = "assets/img/icons/instagram.png";
    }

    // Llamar a cargarConversation() después de definir la variable global
    cargarConversation();
}




function enviarMensaje() {

    mensaje = $('#mensajeToSend').val();

    $('#mensajeToSend').val('');

    if (typeof globalRoom !== 'undefined') {
        $.ajax({
            url: 'views/modules/includes/chats/send-message.php',
            type: 'POST',
            dataType: 'json',
            data: { idRoom: globalRoom, Mensaje: mensaje },
            success: function (response) {
                if (typeof response === 'string' && response.trim() !== '') {
                    try {
                        var jsonResponse = JSON.parse(response);
                        if (jsonResponse.status === true) {
                            cargarConversation();
                        } else {
                            console.error('Error en la respuesta de la API:', jsonResponse.message);
                            cargarConversation();
                        }
                    } catch (error) {
                        console.error('Error al analizar JSON:', error);
                        cargarConversation();
                    }
                } else {
                    console.error('La respuesta del servidor está vacía o no es válida.');
                    cargarConversation();
                }
            },
            error: function (xhr, status, error) {
                console.error('Error en la solicitud AJAX:', error);
                // Maneja el error de la solicitud AJAX
            }
        });
    }
}

// Capturar el evento de tecla en el campo de entrada
$('#mensajeToSend').keypress(function (e) {
    // Verificamos si la tecla presionada es "Enter" (código 13)
    if (e.which === 13) {
        e.preventDefault(); // Evita el comportamiento por defecto (enviar el formulario)
        enviarMensaje();    // Llama a la función enviarMensaje()
    }
});

function LeerMensaje(id) {

    if (typeof id !== 'undefined') {
        $.ajax({
            url: 'views/modules/includes/chats/read-message.php',
            type: 'POST',
            dataType: 'json',
            data: { idRoom: id },
            success: function (response) {
                console.log(response);
            },
            error: function (xhr, status, error) {
                // console.error('Error en la solicitud AJAX:', error);
                // Maneja el error de la solicitud AJAX, por ejemplo, mostrando un mensaje de error al usuario
                cargarConversation();
            }
        });
    }
}


function escapeHTML(texto) {
    var caracteresHTML = {
        "&": "&amp;",
        "<": "",
        ">": "",
        '"': "&quot;",
        "'": "&#39;"
    };
    return texto.replace(/[&<>"']/g, function (match) {
        return caracteresHTML[match];
    });
}

function HeaderConversation() {
    if (typeof globalRoom !== 'undefined') {
        $.ajax({
            url: 'views/modules/includes/chats/conversation-chats.php', // Reemplaza 'ruta/al/archivo.php' con la ruta correcta a tu archivo PHP
            type: 'POST', // Usaremos el método POST para enviar datos
            dataType: 'json', // Espera una respuesta en formato JSON
            data: { idRoom: globalRoom }, // Envía el ID de la habitación como un parámetro
            success: function (response) {

                data = response.data.data;
                for (var i = 0; i < data.length; i++) {
                    var idRoom = data[i].room_id;
                }

                avatar = '<img src="' + imgConversation + '" alt="Avatar" class="rounded-circle" data-bs-toggle="sidebar" data-overlay data-target="#app-chat-sidebar-right" />'

                NameClientConversation = '<h6 class="m-0">' + nombreContacto;

                // chat Header

                var HeaderConversationHtml = '<div class="d-flex justify-content-between align-items-center">';
                HeaderConversationHtml += '<div class="d-flex overflow-hidden align-items-center">';
                HeaderConversationHtml += '<i class="bx bx-menu bx-sm cursor-pointer d-lg-none d-block me-2" data-bs-toggle="sidebar" data-overlay data-target="#app-chat-contacts"></i>';
                HeaderConversationHtml += '<div class="flex-shrink-0 avatar" id="avatarConversation">';
                HeaderConversationHtml += avatar;
                HeaderConversationHtml += '</div>';
                HeaderConversationHtml += '<div class="chat-contact-info flex-grow-1 ms-3" id="NameClientConversation">' + NameClientConversation;
                HeaderConversationHtml += '</div>';
                HeaderConversationHtml += '</div>';
                HeaderConversationHtml += '<div class="d-flex align-items-center">';
                HeaderConversationHtml += '<i class="bx bx-phone-call app-chat-call-button cursor-pointer d-sm-block d-none me-3 fs-4" data-phone=' + nombreContacto + '></i>';
                HeaderConversationHtml += '<div class="dropdown">';
                HeaderConversationHtml += '<button class="btn p-0" type="button" id="chat-header-actions" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Cerrar<i class="bx bx-chevron-down fs-4"></i></button>';
                HeaderConversationHtml += '<div class="dropdown-menu dropdown-menu-end" aria-labelledby="chat-header-actions">';
                HeaderConversationHtml += '<a class="dropdown-item" onclick="ClosedConversation(' + idRoom + ', 9);">Solicitud resuelta</a>';
                HeaderConversationHtml += '<a class="dropdown-item" onclick="ClosedConversation(' + idRoom + ', 10);">Cliente no responde</a>';
                HeaderConversationHtml += '<a class="dropdown-item" onclick="ClosedConversation(' + idRoom + ', 11);">Cerrado por tiempo</a>';
                HeaderConversationHtml += '<a class="dropdown-item" onclick="ClosedConversation(' + idRoom + ', 12);">Usuario abandonó la conversación</a>';
                HeaderConversationHtml += '<a class="dropdown-item" onclick="ClosedConversation(' + idRoom + ', 13);">Cerrado por inactividad</a>';
                HeaderConversationHtml += '<a class="dropdown-item" onclick="ClosedConversation(' + idRoom + ', 58);;">Cierre jornada chat</a>';
                HeaderConversationHtml += '</div>';
                HeaderConversationHtml += '</div>';
                HeaderConversationHtml += '</div>';
                HeaderConversationHtml += '</div>';


                $('#chatHeader').html(HeaderConversationHtml);

                //llamar al teléfono que está en el chat.
                $('.app-chat-call-button').on('click', function (e) {
                    e.preventDefault();
                    let numberPhone = $(this).data("phone");
                    automaticCall(numberPhone)
                });
            },
            error: function (error) {
                // Maneja el error
                console.error('Error en la solicitud AJAX:', error);
            }
        });
    }
}

ws.onopen = () => {
    console.log('Conexión establecida');

    // Unirse a una sala
    ws.send(JSON.stringify({
        action: 'join_room',
        id_room: '94',
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJjMGI0N2VkMjJhMjFiZjQ2NjU5MGJkNzI1NzI5ODAxMmJhNTdjNjVhOGRmMDJlYzg1NjVlZTNhOWI4NmI3YWUzMjY5NTg2MzA3NWJjODNiIn0.eyJhdWQiOiI3MSIsImp0aSI6ImJjMGI0N2VkMjJhMjFiZjQ2NjU5MGJkNzI1NzI5ODAxMmJhNTdjNjVhOGRmMDJlYzg1NjVlZTNhOWI4NmI3YWUzMjY5NTg2MzA3NWJjODNiIiwiaWF0IjoxNzMwMTI1MDE4LCJuYmYiOjE3MzAxMjUwMTgsImV4cCI6MTc2MTY2MTAxOCwic3ViIjoiNyIsInNjb3BlcyI6W119.l7qFoRV8nH8gA4ysaL7GjtAy92yuGjz3x5Wj5ZO240HxGQ2-GXj42CM0BYkSJejUImWxhQ2EgXb-lS86plbPZGFie_7k3hNUMxeplLMxxNuP6vjzUwxWgR52YbSsLT7UOmIbf1FizVnghx5mFxkJX2xOBOWlLiatFe5dtmHiEdKyul-bkRjVqsFwTBmbwXVgjMsNxiNWSyEHy-mghE8jo_ntAQ8_dCqHD9DxjOczd4SSwkVkWDbDREakmoxwGMDNe6iuPHcGrYqjYKBm4eVFRRFKq5aGZ9CLTwXD6E2nziVBEKh8vfYf5mIFF-FnpGFeeHqYvi839Nw7mlFc6Dx2dd1vFKp8P2hJbfI-eUSERNkphq4IWGy-Mnp5jh7Kcluzj6p6oXMy4pRPELUV3BrUiR3XaHxBb81LfYugrJlmeLRCUxZ9b5Xz6NsYJ6oZ6if1JVDOFOg0EeNjz9E5_pY8wVjpJcSduufy2pQOaM7KdWN5dKiM_jJUSGCD6czyuEalomHorryelfaaVbYOQnvJ4ojSQoJKWG9lTVEZa8NuozmyHwcgarNJCUeD2Qg1_4dyGqwmezDMbYdB2fuu7JLOsPTo4uuGyyUuJlqZ5_1LNIBl-WA-CjE2ioW8vMxWl7-vK26xlv5_yqmwJXJ2jCWCPKePmsSl_FQRCgYrPPiXk60',
    }));
};

function cargarConversation() {

    HeaderConversation();

    // Asegúrate de que el WebSocket esté inicializado antes de configurar el onmessage
    if (!ws) {
        console.log("WebSocket no está inicializado.");
        return;  // Salimos si ws no está inicializado
    }

    ws.onmessage = (event) => {

        // console.log("Datos recibidos:", data);
        const response = JSON.parse(event.data);

        // Acceder al array específico
        const data = response?.data?.data?.data || [];

        if (response.status === 'new_messages') {
            console.log('Nuevos mensajes en la sala:', response.data);
            console.log("Datos recibidos:", data);
        } else {
            console.log('mensajes:', response.data);
            console.log("Datos recibidos:", data);
        }

        for (var i = 0; i < data.length; i++) {
            var idRoom = data[i].room_id;
        }

        console.log("conversacion");
        // console.log(response.data);

        // Obtener el último registro del array
        var ultimoRegistro = data[data.length - 1];

        console.log(ultimoRegistro);

        // Validar si el último registro contiene la propiedad y si su valor es igual a 0
        if (ultimoRegistro && ultimoRegistro.hasOwnProperty('read') && ultimoRegistro.read === 0) {
            autoScroll();
            console.log("entro aqui");
        }

        // chat Body

        BodyConversationHtml = '<ul class="list-unstyled chat-history mb-0">';

        for (var i = 0; i < data.length; i++) {
            if (data[i].sender_id === 1 || data[i].sender_id === 2) {

                if (data[i].sender_id === 1) {
                    AvatarChat = 'assets/img/front-pages/icons/user.png';
                } else if (data[i].sender_id === 2) {

                    AvatarChat = 'assets/img/icons/bots.jpg';
                }

                if (data[i].ext === "jpeg" || data[i].ext === "jpg" || data[i].ext === "webp" || data[i].ext === "png") {
                    BodyConversationHtml += '<li class="chat-message">';
                    BodyConversationHtml += '<div class="d-flex overflow-hidden">';
                    BodyConversationHtml += '<div class="user-avatar flex-shrink-0 me-3">';
                    BodyConversationHtml += '<div class="avatar avatar-sm">';
                    BodyConversationHtml += '<img src="' + AvatarChat + '" alt="Avatar" class="rounded-circle">';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '<div class="chat-message-wrapper flex-grow-1">';
                    BodyConversationHtml += '<div class="chat-message-text">';
                    BodyConversationHtml += '<p class="mb-0"><a data-bs-toggle="modal" data-bs-target="#exLargeModal" target="_blank" onclick="ShowImg(\'' + data[i].url + '\')"><img src="' + data[i].url + '" width="200px"></a></p>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '<div class="text-muted mt-1">';
                    BodyConversationHtml += '<i class="bx bx-check-double text-success"></i>';
                    BodyConversationHtml += '<small>' + data[i].date_sent + '</small>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</li>';

                } else if (data[i].ext === null || data[i].ext === "") {
                    BodyConversationHtml += '<li class="chat-message">';
                    BodyConversationHtml += '<div class="d-flex overflow-hidden">';
                    BodyConversationHtml += '<div class="user-avatar flex-shrink-0 me-3">';
                    BodyConversationHtml += '<div class="avatar avatar-sm">';
                    BodyConversationHtml += '<img src="' + AvatarChat + '" alt="Avatar" class="rounded-circle">';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '<div class="chat-message-wrapper flex-grow-1">';
                    BodyConversationHtml += '<div class="chat-message-text">';
                    BodyConversationHtml += '<p class="mb-0">' + escapeHtml(data[i].content) + '</p>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '<div class="text-muted mt-1">';
                    BodyConversationHtml += '<i class="bx bx-check-double text-success"></i>';
                    BodyConversationHtml += '<small>' + data[i].date_sent + '</small>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</li>';
                } else {
                    BodyConversationHtml += '<li class="chat-message">';
                    BodyConversationHtml += '<div class="d-flex overflow-hidden">';
                    BodyConversationHtml += '<div class="user-avatar flex-shrink-0 me-3">';
                    BodyConversationHtml += '<div class="avatar avatar-sm">';
                    BodyConversationHtml += '<img src="' + AvatarChat + '" alt="Avatar" class="rounded-circle">';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '<div class="chat-message-wrapper flex-grow-1">';
                    BodyConversationHtml += '<div class="chat-message-text">';
                    BodyConversationHtml += '<p class="mb-0">' + escapeHtml(data[i].content) + '</p>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '<div class="text-muted mt-1">';
                    BodyConversationHtml += '<i class="bx bx-check-double text-success"></i>';
                    BodyConversationHtml += '<small>' + data[i].date_sent + '</small>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</li>';
                }
            } else if (data[i].sender_id === 7) {

                if (data[i].ext != null) {
                    BodyConversationHtml += '<li class="chat-message chat-message-right">';
                    BodyConversationHtml += '<div class="d-flex overflow-hidden">';
                    BodyConversationHtml += '<div class="chat-message-wrapper flex-grow-1">';
                    BodyConversationHtml += '<div class="chat-message-text">';
                    BodyConversationHtml += '<p class="mb-0">' + data[i].url + '</p>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '<div class="text-end text-muted mt-1">';
                    BodyConversationHtml += '<i class="bx bx-check-double text-success"></i>';
                    BodyConversationHtml += '<small>' + data[i].date_sent + '</small>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</li>';
                } else {
                    BodyConversationHtml += '<li class="chat-message chat-message-right">';
                    BodyConversationHtml += '<div class="d-flex overflow-hidden">';
                    BodyConversationHtml += '<div class="chat-message-wrapper flex-grow-1">';
                    BodyConversationHtml += '<div class="chat-message-text">';
                    BodyConversationHtml += '<p class="mb-0">' + escapeHtml(data[i].content) + '</p>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '<div class="text-end text-muted mt-1">';
                    BodyConversationHtml += '<i class="bx bx-check-double text-success"></i>';
                    BodyConversationHtml += '<small>' + data[i].date_sent + '</small>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</div>';
                    BodyConversationHtml += '</li>';
                }
            }
        }
        BodyConversationHtml += '</ul>';

        $('#chatBody').html(BodyConversationHtml);
        $('#Chat').addClass('col app-chat-history');

        // console.log(data);

        LeerMensaje(idRoom);
        // Puedes procesar los datos recibidos aquí
    };
}

function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

function ClosedConversation(id, idRoomStatus) {
    if (typeof id !== 'undefined') {
        $.ajax({
            url: 'views/modules/includes/chats/closed-conversation.php',
            type: 'POST',
            dataType: 'json',
            data: { idRoom: id, IdRoomStatus: idRoomStatus },
            success: function (response) {
                console.log(response);

                Swal.fire({
                    title: "Bien!",
                    text: "Chat cerrado con exito!",
                    icon: "success"
                });

                location.reload(true);

                Actualizar();
                autoScroll();
            },
            error: function (xhr, status, error) {
                console.error('Error en la solicitud AJAX:', error);
                // Maneja el error de la solicitud AJAX, por ejemplo, mostrando un mensaje de error al usuario
                cargarConversation();
                autoScroll();
            }
        });
    }
}

function ShowImg(img) {
    // MODAL IMG
    var Showimg = '';
    Showimg += '<img class="img-fluid" src="' + img + '">';
    $('#modalShowImg').html(Showimg);
}

function Actualizar() {
    cargarDatos();
    cargarConversation();
}

// Cargar datos al cargar la página
$(document).ready(function () {
    cargarDatos();

    // autoScroll();
});