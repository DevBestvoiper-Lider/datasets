// let ws;  // Variable global para la conexión WebSocket

// let numerocontacto; // Declarar como global
// let nombreContacto; // Declarar como global
// let id_tienda; // Declarar como global

// var audio = new Audio('views/sounds/notification-18.mp3');

// function autoScroll() {
//     var scrollContainer = $('#Conversation');
//     // Scroll hacia el final del contenedor
//     scrollContainer.scrollTop(scrollContainer.prop("scrollHeight"));
// }

// function conectarSocket() {
//     if (ws && ws.readyState === WebSocket.OPEN) {

//         ws.send(JSON.stringify({
//             action: 'join_room',
//             token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjIwYWFjMzdjODEzNzI2NGIzMWU5MTViNjFmOTQwZmE3ZTkxYjY4ZDEyYTY2M2JjYmIzODljZTYxYzc3ZmU2YzAzNjRkMmU5MTVmN2Q1YTlmIn0.eyJhdWQiOiI3MSIsImp0aSI6IjIwYWFjMzdjODEzNzI2NGIzMWU5MTViNjFmOTQwZmE3ZTkxYjY4ZDEyYTY2M2JjYmIzODljZTYxYzc3ZmU2YzAzNjRkMmU5MTVmN2Q1YTlmIiwiaWF0IjoxNzMzODA5OTYwLCJuYmYiOjE3MzM4MDk5NjAsImV4cCI6MTc2NTM0NTk2MCwic3ViIjoiNyIsInNjb3BlcyI6W119.dbVWzmneYlm5ik98Fujer3OjExs_yDYBcdz9LDEVZE3pyebRpZlmJKljBpO0ULhKlozfma59qd-9ob2c32o3bWmzpkvlpl3nwD49aQRee6aE0aB5CakUu_wr-qg7j4WwQG9Fx6tkwkBLH7PvTkgnz01p4mOYR27J4K_14x2aQsr9s8P3bjt-F75hPm1LAP_qcSXLesMPOZhAQlsMkU5OCqinN9k1X27-WR18xN52X9ScMxRFx7tZNd6yGhQkIPqzwhS-gQQONzxrer0JoFiNp9PbJzP8xrrthcRbtQMAYBZ3rpyD61ZbrjMShTO-gmcTaYVCmRhFkfTXFoWAJ3hOU_29p2EJ1w0OXWzE5PCBK070YHMdS0XbS5tONXssp1fnrm50BY4OVAoOQ1TpC3vV8_n4Uv_ui0IlwO6oc_flwo5aWTeqZZUuz2zHBY1xhuMtD7QOJTOZqwGDMaOwMfBZRI58bF5yI1EzT6MCTqOKYBIZL0NDWs_CrMsD9MiS1DrjoKKHiqc06SGmxuu4hbyKFpt1Ab8kLK466tzTCMMF0TyAT8h8atreR7KzJCiC5RKWuQc9QN71g-YiWYePljN3tR_THU80kohIU8KJB80km9VRNuBFZPeVAEZfvvyrFRn477YagMoVQsTE024sFikMYsBYB4kdiQ_-tbcB9bxP7TQ',
//         }));

//         console.log('Cambio de sala a:', id_room);
//         return;
//     }

//     // Si no hay conexión, crear una nueva
//     id_room = idroom;
//     ws = new WebSocket('wss://bestcallcenterpro.bestvoiper.com:8082');
//     ws.onopen = () => {
//         console.log('Conexión establecida');

//         // Unirse a la sala
//         ws.send(JSON.stringify({
//             action: 'join_room',
//             id_room: id_room.toString(),
//             token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjIwYWFjMzdjODEzNzI2NGIzMWU5MTViNjFmOTQwZmE3ZTkxYjY4ZDEyYTY2M2JjYmIzODljZTYxYzc3ZmU2YzAzNjRkMmU5MTVmN2Q1YTlmIn0.eyJhdWQiOiI3MSIsImp0aSI6IjIwYWFjMzdjODEzNzI2NGIzMWU5MTViNjFmOTQwZmE3ZTkxYjY4ZDEyYTY2M2JjYmIzODljZTYxYzc3ZmU2YzAzNjRkMmU5MTVmN2Q1YTlmIiwiaWF0IjoxNzMzODA5OTYwLCJuYmYiOjE3MzM4MDk5NjAsImV4cCI6MTc2NTM0NTk2MCwic3ViIjoiNyIsInNjb3BlcyI6W119.dbVWzmneYlm5ik98Fujer3OjExs_yDYBcdz9LDEVZE3pyebRpZlmJKljBpO0ULhKlozfma59qd-9ob2c32o3bWmzpkvlpl3nwD49aQRee6aE0aB5CakUu_wr-qg7j4WwQG9Fx6tkwkBLH7PvTkgnz01p4mOYR27J4K_14x2aQsr9s8P3bjt-F75hPm1LAP_qcSXLesMPOZhAQlsMkU5OCqinN9k1X27-WR18xN52X9ScMxRFx7tZNd6yGhQkIPqzwhS-gQQONzxrer0JoFiNp9PbJzP8xrrthcRbtQMAYBZ3rpyD61ZbrjMShTO-gmcTaYVCmRhFkfTXFoWAJ3hOU_29p2EJ1w0OXWzE5PCBK070YHMdS0XbS5tONXssp1fnrm50BY4OVAoOQ1TpC3vV8_n4Uv_ui0IlwO6oc_flwo5aWTeqZZUuz2zHBY1xhuMtD7QOJTOZqwGDMaOwMfBZRI58bF5yI1EzT6MCTqOKYBIZL0NDWs_CrMsD9MiS1DrjoKKHiqc06SGmxuu4hbyKFpt1Ab8kLK466tzTCMMF0TyAT8h8atreR7KzJCiC5RKWuQc9QN71g-YiWYePljN3tR_THU80kohIU8KJB80km9VRNuBFZPeVAEZfvvyrFRn477YagMoVQsTE024sFikMYsBYB4kdiQ_-tbcB9bxP7TQ',
//         }));
//     };

//     ws.onmessage = (event) => {
//         const response = JSON.parse(event.data);
//         const data = response?.data?.data?.data || [];
//         console.log('Datos recibidos:', data);
//         HeaderConversation();
//         procesarMensajes(data);
//     };

//     ws.onerror = (error) => {
//         console.error('Error en la conexión WebSocket:', error);
//     };

//     ws.onclose = () => {
//         console.log('Conexión cerrada');
//     };
// }

// let previousChatsArray = [];

// // Request notification permission automatically
// if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
//     Notification.requestPermission().then(permission => {
//         if (permission === 'granted') {
//             console.log('Notification permission granted.');
//         }
//     });
// }

// function showNotification(message) {
//     if (Notification.permission === 'granted') {
//         new Notification('Bestcallcenter PRO', {
//             body: message,
//             icon: 'assets/img/favicon/LOGOBESTVOIPER.png' // Path to an icon image
//         });
//     }
// }

// function cargarDatos(response) {
//     var chats = response?.data?.data?.data || [];
//     var chatsArray = Object.values(chats).filter(chat => typeof chat === 'object' && chat !== null);
//     console.log(chatsArray);

//     var countUnRead = 0;
//     var unreads = '';

//     // Separate important chats
//     var importantChats = chatsArray.filter(chat => chat.important === 1);
//     var otherChats = chatsArray.filter(chat => chat.important !== 1);

//     // Check if the length of any array within the parent array has changed
//     let hasLengthChanged = chatsArray.some((chat, index) => {
//         return previousChatsArray[index] && chat.messages && previousChatsArray[index].messages && chat.messages.length !== previousChatsArray[index].messages.length;
//     });

//     // Play audio and show notification if there are new chats, the chatsArray has changed, the room_status_id is 1, 2, or 3, and the latest_message.sender_id is 2
//     if (hasLengthChanged) {
//         const activeChats = chatsArray.filter(chat => [1, 2, 3].includes(chat.room_status_id) && chat.latest_message?.sender_id === 2);
//         if (activeChats.length > 0) {
//             audio.play();
//             console.log('Array changed:', chatsArray);
//             previousChatsArray = JSON.parse(JSON.stringify(chatsArray)); // Deep copy

//             // Show notification with the latest message content
//             const latestMessage = 'Nuevo mensaje recibido';
//             showNotification(latestMessage);
//         }

//         // Log the specific array that changed
//         chatsArray.forEach((chat, index) => {
//             if (JSON.stringify(chat) !== JSON.stringify(previousChatsArray[index])) {
//                 console.log('Changed chat:', chat);
//             }
//         });
//     }

//     for (var i = 0; i < chatsArray.length; i++) {
//         if (chatsArray[i] && typeof chatsArray[i] === 'object') {
//             if (chatsArray[i].room_status_id === 3) {
//                 if (chatsArray[i].read_message === 0) {
//                     countUnRead++;
//                     unreads = '<span class="badge badge-center rounded-pill bg-danger ms-auto">' + countUnRead + '</span>';
//                 } else {
//                     unreads = '';
//                 }
//             }
//         }
//     }

//     var html = '<li class="chat-contact-list-item chat-contact-list-item-title"><h5 class="text-primary mb-0">Chats Activos</h5>' + unreads + '</li>';

//     // Function to generate chat HTML
//     function generateChatHtml(chat) {
//         var title = chat.title ? chat.title : 'Sin título';
//         var id = chat.id ? chat.id : 'N/A';
//         var contacto = chat.contacto ? chat.contacto : 'N/A';
//         id_tienda = chat.id_tienda ? chat.id_tienda : 'N/A';
//         var img, idImg;

//         if (chat.plataforma == "web") {
//             img = "assets/img/icons/web.png";
//             idImg = 1;
//         } else if (chat.plataforma == "whatsapp") {
//             img = "assets/img/icons/whatsapp.png";
//             idImg = 2;
//         } else if (chat.plataforma == "facebook") {
//             img = "assets/img/icons/messenger.png";
//             idImg = 3;
//         } else if (chat.plataforma == "instagram") {
//             img = "assets/img/icons/instagram.png";
//             idImg = 4;
//         }

//         var latestMessageId = chat.latest_message && chat.latest_message.sender_id ? chat.latest_message.sender_id : 'N/A';
//         var namelatestMessage = latestMessageId == 7 ? "Tu" : latestMessageId == 2 ? "Bot" : "Cliente";

//         var messageContent = chat.latest_message ? escapeHtml(chat.latest_message.content) : '';
//         var messageHtml = chat.read_message === 0 ? '<b>' + namelatestMessage + ': ' + messageContent + '</b>' : namelatestMessage + ': ' + messageContent;

//         if (chat.latest_message && ["jpeg", "jpg", "webp", "png"].includes(chat.latest_message.ext)) {
//             messageHtml = chat.read_message === 0 ? '<b>' + namelatestMessage + ': Imagen</b>' : namelatestMessage + ': Imagen';
//         } else if (chat.latest_message && chat.latest_message.ext) {
//             messageHtml = chat.read_message === 0 ? '<b>' + namelatestMessage + ': Archivo Adjunto</b>' : namelatestMessage + ': Archivo Adjunto';
//         }

//         return `
//             <li class="chat-contact-list-item">
//                 <a class="d-flex align-items-center" onclick=" InfoContacto(${contacto}); defineIdRoom(${id}, ${idImg}, ${contacto}); LeerMensaje(${id});">
//                     <div class="flex-shrink-0 avatar avatar-online">
//                         <img src="${img}" alt="Avatar" class="rounded-circle" />
//                     </div>
//                     <div class="chat-contact-info flex-grow-1 ms-3">
//                         <h6 class="chat-contact-name text-truncate m-0">${title} ${id}</h6>
//                         <p class="chat-contact-status text-truncate mb-0 text-muted">${messageHtml}</p>
//                     </div>
//                 </a>
//             </li>`;
//     }

//     // Add important chats first
//     importantChats.forEach(chat => {
//         if (chat.room_status_id == 3) {
//             html += generateChatHtml(chat);
//         }
//     });

//     // Add other active chats
//     otherChats.forEach(chat => {
//         if (chat.room_status_id == 3 || chat.room_status_id == 1) {
//             html += generateChatHtml(chat);
//         }
//     });

//     html += '<li class="chat-contact-list-item chat-contact-list-item-title"><h5 class="text-primary mb-0">Chats Nuevos</h5></li>';

//     // Add new chats
//     chatsArray.forEach(chat => {
//         if (chat.room_status_id == 2) {
//             html += generateChatHtml(chat);
//         }
//     });

//     $('#chat-list').html(html);
//     // ...existing code...
// }

// function autoScroll() {
//     var scrollContainer = $('#chatBody');
//     // Scroll hacia el final del contenedor
//     scrollContainer.scrollTop(scrollContainer.prop("scrollHeight"));
// }

// function InfoContacto(idContacto) {
//     $.ajax({
//         url: 'https://api-demo.bestvoiper.com/api/segments/' + id_tienda,
//         type: 'GET',
//         dataType: 'json',
//         success: function (response) {
//             console.log('Datos del segmento:', response);
//             var entidad = response.data.segments.tienda;
//             console.log('Entidad:', entidad);

//             // Second AJAX request nested inside the success callback of the first request
//             $.ajax({
//                 url: 'views/modules/includes/chats/get-profile.php',
//                 type: 'POST',
//                 dataType: 'json',
//                 data: { obtenerContacto: true, tel: idContacto, entity: entidad },
//                 success: function (response) {
//                     console.log('Datos del contacto:', response);

//                     data = response[0];

//                     nombreContacto = data.nombre; // Asignar nombreContacto aquí
//                     // Construct the HTML
//                     const contactInfoHtml = `
//                         <div class="sidebar-header d-flex flex-column justify-content-center align-items-center flex-wrap p-4 mt-2">
//                             <div class="avatar avatar-xl avatar-online">
//                                 <img src="assets/img/avatars/2.png" alt="Avatar" class="rounded-circle" />
//                             </div>
//                             <h6 class="mt-3 mb-1">${nombreContacto}</h6>
//                             <small class="text-muted">${data.entidad}</small>
//                             <i class="bx bx-x bx-sm cursor-pointer close-sidebar me-1 fs-4 d-block" onclick="closeSidebar()"></i>
//                         </div>
//                         <div class="sidebar-body px-4 pb-4">
//                             <div class="my-3">
//                                 <span class="text-muted text-uppercase">About</span>
//                                 <p class="mb-0 mt-2">/p>
//                             </div>
//                             <div class="my-4">
//                                 <span class="text-muted text-uppercase">Personal Information</span>
//                                 <ul class="list-unstyled d-grid gap-2 mt-2">
//                                     <li class="d-flex align-items-center">
//                                         <i class="bx bx-envelope"></i>
//                                         <span class="align-middle ms-2">${data.email}</span>
//                                     </li>
//                                     <li class="d-flex align-items-center">
//                                         <i class="bx bx-phone-call"></i>
//                                         <span class="align-middle ms-2">${data.tels}</span>
//                                     </li>
//                                 </ul>
//                             </div>
//                             <div class="mt-4">
//                                 <span class="text-muted text-uppercase">Options</span>
//                                 <ul class="list-unstyled d-grid gap-2 mt-2">
//                                     <li class="cursor-pointer d-flex align-items-center">
//                                         <i class="bx bx-bookmark"></i>
//                                         <span class="align-middle ms-2">Add Tag</span>
//                                     </li>
//                                     <li class="cursor-pointer d-flex align-items-center">
//                                         <i class="bx bx-star"></i>
//                                         <span class="align-middle ms-2">Important Contact</span>
//                                     </li>
//                                     <li class="cursor-pointer d-flex align-items-center">
//                                         <i class="bx bx-image-alt"></i>
//                                         <span class="align-middle ms-2">Shared Media</span>
//                                     </li>
//                                     <li class="cursor-pointer d-flex align-items-center">
//                                         <i class="bx bx-trash-alt"></i>
//                                         <span class="align-middle ms-2">Delete Contact</span>
//                                     </li>
//                                     <li class="cursor-pointer d-flex align-items-center">
//                                         <i class="bx bx-block"></i>
//                                         <span class="align-middle ms-2">Block Contact</span>
//                                     </li>
//                                 </ul>
//                             </div>
//                         </div>`;
//                     // Send the HTML to the element with id "app-chat-sidebar-right"
//                     $('#app-chat-sidebar-right').html(contactInfoHtml);
//                     HeaderConversation(); // Llamar a HeaderConversation después de asignar nombreContacto
//                 },
//                 error: function (xhr, status, error) {
//                     console.error('Error en la solicitud AJAX:', error);
//                 }
//             });
//         },
//         error: function (xhr, status, error) {
//             console.error('Error en la solicitud AJAX al obtener segmento:', error);
//         }
//     });
// }

// function closeSidebar() {
//     document.querySelector('#app-chat-sidebar-right').classList.remove('show');
//     document.querySelector('.app-overlay').classList.remove('show');
// }

// document.addEventListener('keydown', function (event) {
//     if (event.key === 'Escape') {
//         closeSidebar();
//     }
// });

// // Definición de la función onclick
// function defineIdRoom(id, plataform, contacto) {
//     // Definir la variable global
//     globalRoom = id;

//     numerocontacto = contacto; // Actualizar la variable global

//     console.log("contacto en defineroom: ", numerocontacto); // Imprime el número de contacto

//     if (plataform == 1) {
//         imgConversation = "assets/img/icons/web.png";
//     } else if (plataform == 2) {
//         imgConversation = "assets/img/icons/whatsapp.png";
//     } else if (plataform == 3) {
//         imgConversation = "assets/img/icons/messenger.png";
//     } else if (plataform == 4) {
//         imgConversation = "assets/img/icons/instagram.png";
//     }

//     // Llamar a cargarConversation() después de definir la variable global
//     cargarConversation(id);
//     toggleChatVisibility(true);
// }

// function enviarMensaje() {

//     mensaje = $('#mensajeToSend').val();

//     $('#mensajeToSend').val('');

//     if (typeof globalRoom !== 'undefined') {
//         $.ajax({
//             url: 'views/modules/includes/chats/send-message.php',
//             type: 'POST',
//             dataType: 'json',
//             data: { idRoom: globalRoom, Mensaje: mensaje },
//             success: function (response) {
//                 if (typeof response === 'string' && response.trim() !== '') {
//                     try {
//                         var jsonResponse = JSON.parse(response);
//                         if (jsonResponse.status === true) {
//                             // cargarConversation(globalRoom);
//                         } else {
//                             console.error('Error en la respuesta de la API:', jsonResponse.message);
//                             // cargarConversation(globalRoom);
//                         }
//                     } catch (error) {
//                         console.error('Error al analizar JSON:', error);
//                         // cargarConversation(globalRoom);
//                     }
//                 } else {
//                     console.error('La respuesta del servidor está vacía o no es válida.');
//                     // cargarConversation(globalRoom);
//                 }
//             },
//             error: function (xhr, status, error) {
//                 console.error('Error en la solicitud AJAX:', error);
//                 // Maneja el error de la solicitud AJAX
//             }
//         });
//     }
// }

// // Capturar el evento de tecla en el campo de entrada
// $('#mensajeToSend').keypress(function (e) {
//     // Verificamos si la tecla presionada es "Enter" (código 13)
//     if (e.which === 13) {
//         e.preventDefault(); // Evita el comportamiento por defecto (enviar el formulario)
//         enviarMensaje();    // Llama a la función enviarMensaje()
//     }
// });

// function LeerMensaje(id) {

//     if (typeof id !== 'undefined') {
//         $.ajax({
//             url: 'views/modules/includes/chats/read-message.php',
//             type: 'POST',
//             dataType: 'json',
//             data: { idRoom: id },
//             success: function (response) {
//                 console.log(response);
//             },
//             error: function (xhr, status, error) {
//                 // console.error('Error en la solicitud AJAX:', error);
//                 // Maneja el error de la solicitud AJAX, por ejemplo, mostrando un mensaje de error al usuario
//                 // cargarConversation(id);
//             }
//         });
//     }
// }


// function escapeHTML(texto) {
//     var caracteresHTML = {
//         "&": "&amp;",
//         "<": "",
//         ">": "",
//         "'": "&#39;"
//     };
//     return texto.replace(/[&<>"']/g, function (match) {
//         return caracteresHTML[match];
//     });
// }

function ListarChats() {
    const ws = new WebSocket('ws://localhost:8082');

    // Conectar al servidor WebSocket
    ws.onopen = () => {
        console.log('Conexión establecida con el servidor WebSocket');

        // Solicitar la lista de chats activos
        ws.send(JSON.stringify({
            action: 'get_chats',
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjIwYWFjMzdjODEzNzI2NGIzMWU5MTViNjFmOTQwZmE3ZTkxYjY4ZDEyYTY2M2JjYmIzODljZTYxYzc3ZmU2YzAzNjRkMmU5MTVmN2Q1YTlmIn0.eyJhdWQiOiI3MSIsImp0aSI6IjIwYWFjMzdjODEzNzI2NGIzMWU5MTViNjFmOTQwZmE3ZTkxYjY4ZDEyYTY2M2JjYmIzODljZTYxYzc3ZmU2YzAzNjRkMmU5MTVmN2Q1YTlmIiwiaWF0IjoxNzMzODA5OTYwLCJuYmYiOjE3MzM4MDk5NjAsImV4cCI6MTc2NTM0NTk2MCwic3ViIjoiNyIsInNjb3BlcyI6W119.dbVWzmneYlm5ik98Fujer3OjExs_yDYBcdz9LDEVZE3pyebRpZlmJKljBpO0ULhKlozfma59qd-9ob2c32o3bWmzpkvlpl3nwD49aQRee6aE0aB5CakUu_wr-qg7j4WwQG9Fx6tkwkBLH7PvTkgnz01p4mOYR27J4K_14x2aQsr9s8P3bjt-F75hPm1LAP_qcSXLesMPOZhAQlsMkU5OCqinN9k1X27-WR18xN52X9ScMxRFx7tZNd6yGhQkIPqzwhS-gQQONzxrer0JoFiNp9PbJzP8xrrthcRbtQMAYBZ3rpyD61ZbrjMShTO-gmcTaYVCmRhFkfTXFoWAJ3hOU_29p2EJ1w0OXWzE5PCBK070YHMdS0XbS5tONXssp1fnrm50BY4OVAoOQ1TpC3vV8_n4Uv_ui0IlwO6oc_flwo5aWTeqZZUuz2zHBY1xhuMtD7QOJTOZqwGDMaOwMfBZRI58bF5yI1EzT6MCTqOKYBIZL0NDWs_CrMsD9MiS1DrjoKKHiqc06SGmxuu4hbyKFpt1Ab8kLK466tzTCMMF0TyAT8h8atreR7KzJCiC5RKWuQc9QN71g-YiWYePljN3tR_THU80kohIU8KJB80km9VRNuBFZPeVAEZfvvyrFRn477YagMoVQsTE024sFikMYsBYB4kdiQ_-tbcB9bxP7TQ', // Reemplaza con tu token real
        }));
    };

    // Escuchar los mensajes del servidor
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);

            console.log('Mensaje del servidor:', data.status, data.message);

            // Manejar la respuesta del servidor
            if (data.status === 'success' && data.message === 'Chats iniciales enviados') {
                console.log('Lista inicial de chats:', data.data);
                // dataChats = data.data;
                // cargarDatos(dataChats);
            } else if (data.status === 'new_chats') {
                console.log('Nuevos chats detectados:', data.data);
                // dataChats = data.data;
                // cargarDatos(dataChats);
            } else {
                console.log('Respuesta del servidor:', data);
            }
        } catch (error) {
            console.error('Error al procesar el mensaje del servidor:', error);
        }
    };

    // Manejar errores en la conexión
    ws.onerror = (error) => {
        console.error('Error en WebSocket:', error);
    };

    // Manejar el cierre de la conexión
    ws.onclose = () => {
        console.log('Conexión WebSocket cerrada');
    };

}

ListarChats();


// function HeaderConversation() {
//     if (typeof globalRoom === 'undefined') return;

//     numerocliente = numerocontacto; // Declarar como global

//     $.ajax({
//         url: 'views/modules/includes/chats/conversation-chats.php',
//         type: 'POST',
//         dataType: 'json',
//         data: { idRoom: globalRoom },
//         success: function (response) {
//             const data = response.data.data;

//             console.log('Datos de la conversación:', data);

//             const idRoom = data.length > 0 ? data[0].room_id : null;

//             const avatar = `<img src="${imgConversation}" alt="Avatar" class="rounded-circle" id="avatarConversation" />`;
//             const nameClientConversation = `<h6 class="m-0">${nombreContacto}</h6>`; // Usar nombreContacto aquí

//             const headerConversationHtml = `
//                 <div class="d-flex justify-content-between align-items-center">
//                     <div class="d-flex overflow-hidden align-items-center">
//                         <i class="bx bx-menu bx-sm cursor-pointer d-lg-none d-block me-2" data-bs-toggle="sidebar" data-overlay data-target="#app-chat-contacts"></i>
//                         <div class="flex-shrink-0 avatar">${avatar}</div>
//                         <div class="chat-contact-info flex-grow-1 ms-3" id="NameClientConversation">${nameClientConversation}</div>
//                     </div>
//                     <div class="d-flex align-items-center">
//                         <i class="bx bx-phone-call app-chat-call-button cursor-pointer d-sm-block d-none me-3 fs-4" data-phone="${numerocliente}"></i>
//                         <div class="dropdown">
//                             <button class="btn p-0" type="button" id="chat-header-actions" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                                 Cerrar<i class="bx bx-chevron-down fs-4"></i>
//                             </button>
//                             <div class="dropdown-menu dropdown-menu-end" aria-labelledby="chat-header-actions">
//                                 <a class="dropdown-item" onclick="ClosedConversation(${idRoom}, 9);">Solicitud resuelta</a>
//                                 <a class="dropdown-item" onclick="ClosedConversation(${idRoom}, 10);">Cliente no responde</a>
//                                 <a class="dropdown-item" onclick="ClosedConversation(${idRoom}, 11);">Cerrado por tiempo</a>
//                                 <a class="dropdown-item" onclick="ClosedConversation(${idRoom}, 12);">Usuario abandonó la conversación</a>
//                                 <a class="dropdown-item" onclick="ClosedConversation(${idRoom}, 13);">Cerrado por inactividad</a>
//                                 <a class="dropdown-item" onclick="ClosedConversation(${idRoom}, 58);">Cierre jornada chat</a>
//                             </div>
//                         </div>
//                     </div>
//                 </div>`;

//             $('#chatHeader').html(headerConversationHtml);

//             // Attach event listener for call button
//             $('.app-chat-call-button').on('click', function (e) {
//                 e.preventDefault();
//                 const numberPhone = $(this).data("phone");
//                 automaticCall(numberPhone);
//             });

//             // Attach event listener for avatar click to toggle sidebar
//             $('#avatarConversation').on('click', function () {
//                 document.querySelector('#app-chat-sidebar-right').classList.add('show');
//                 document.querySelector('.app-overlay').classList.add('show');
//             });
//         },
//         error: function (error) {
//             console.error('Error en la solicitud AJAX:', error);
//         }
//     });
// }

// function cargarConversation(idroom) {
//     const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjIwYWFjMzdjODEzNzI2NGIzMWU5MTViNjFmOTQwZmE3ZTkxYjY4ZDEyYTY2M2JjYmIzODljZTYxYzc3ZmU2YzAzNjRkMmU5MTVmN2Q1YTlmIn0.eyJhdWQiOiI3MSIsImp0aSI6IjIwYWFjMzdjODEzNzI2NGIzMWU5MTViNjFmOTQwZmE3ZTkxYjY4ZDEyYTY2M2JjYmIzODljZTYxYzc3ZmU2YzAzNjRkMmU5MTVmN2Q1YTlmIiwiaWF0IjoxNzMzODA5OTYwLCJuYmYiOjE3MzM4MDk5NjAsImV4cCI6MTc2NTM0NTk2MCwic3ViIjoiNyIsInNjb3BlcyI6W119.dbVWzmneYlm5ik98Fujer3OjExs_yDYBcdz9LDEVZE3pyebRpZlmJKljBpO0ULhKlozfma59qd-9ob2c32o3bWmzpkvlpl3nwD49aQRee6aE0aB5CakUu_wr-qg7j4WwQG9Fx6tkwkBLH7PvTkgnz01p4mOYR27J4K_14x2aQsr9s8P3bjt-F75hPm1LAP_qcSXLesMPOZhAQlsMkU5OCqinN9k1X27-WR18xN52X9ScMxRFx7tZNd6yGhQkIPqzwhS-gQQONzxrer0JoFiNp9PbJzP8xrrthcRbtQMAYBZ3rpyD61ZbrjMShTO-gmcTaYVCmRhFkfTXFoWAJ3hOU_29p2EJ1w0OXWzE5PCBK070YHMdS0XbS5tONXssp1fnrm50BY4OVAoOQ1TpC3vV8_n4Uv_ui0IlwO6oc_flwo5aWTeqZZUuz2zHBY1xhuMtD7QOJTOZqwGDMaOwMfBZRI58bF5yI1EzT6MCTqOKYBIZL0NDWs_CrMsD9MiS1DrjoKKHiqc06SGmxuu4hbyKFpt1Ab8kLK466tzTCMMF0TyAT8h8atreR7KzJCiC5RKWuQc9QN71g-YiWYePljN3tR_THU80kohIU8KJB80km9VRNuBFZPeVAEZfvvyrFRn477YagMoVQsTE024sFikMYsBYB4kdiQ_-tbcB9bxP7TQ';

//     if (ws && ws.readyState === WebSocket.OPEN) {
//         ws.send(JSON.stringify({ action: 'leave_room', id_room: id_room.toString(), token }));
//         id_room = idroom;
//         ws.send(JSON.stringify({ action: 'join_room', id_room: id_room.toString(), token }));
//         console.log('Cambio de sala a:', id_room);
//         return;
//     }

//     id_room = idroom;
//     ws = new WebSocket('wss://bestcallcenterpro.bestvoiper.com:8082');
//     ws.onopen = () => {
//         console.log('Conexión establecida');
//         ws.send(JSON.stringify({ action: 'join_room', id_room: id_room.toString(), token }));
//     };

//     ws.onmessage = async (event) => {
//         const response = JSON.parse(event.data);
//         const data = response?.data?.data?.data || [];
//         InfoContacto(numerocontacto);
//         await procesarMensajes(data);
//     };

//     ws.onerror = (error) => {
//         console.error('Error en la conexión WebSocket:', error);
//     };

//     ws.onclose = () => {
//         console.log('Conexión cerrada');
//     };

//     LeerMensaje(idroom);
// }


// function procesarMensajes(data) {
//     const chatBody = $('#chatBody');
//     let BodyConversationHtml = '<ul class="list-unstyled chat-history mb-0">';

//     data.forEach(message => {
//         let AvatarChat = 'assets/img/front-pages/icons/user.png';
//         if (message.sender_id === 2) {
//             AvatarChat = 'assets/img/icons/bots.jpg';
//         }

//         let messageContent = '';
//         if (message.ext === "ogg" || message.ext === "mp3" || message.ext === "wav") {
//             messageContent = `<audio controls><source src="${message.url}" type="audio/mpeg"></audio>`;
//         } else if (["jpeg", "jpg", "webp", "png", "jpe"].includes(message.ext)) {
//             messageContent = `<a data-bs-toggle="modal" data-bs-target="#exLargeModal" target="_blank" onclick="ShowImg('${message.url}')"><img src="${message.url}" width="200px"></a>`;
//         } else {
//             messageContent = escapeHtml(message.content);
//         }

//         const messageHtml = `
//             <li class="chat-message ${message.sender_id === 7 ? 'chat-message-right' : ''}">
//                 <div class="d-flex overflow-hidden">
//                     ${message.sender_id !== 7 ? `
//                     <div class="user-avatar flex-shrink-0 me-3">
//                         <div class="avatar avatar-sm">
//                             <img src="${AvatarChat}" alt="Avatar" class="rounded-circle">
//                         </div>
//                     </div>` : ''}
//                     <div class="chat-message-wrapper flex-grow-1">
//                         <div class="chat-message-text">
//                             <p class="mb-0">${messageContent}</p>
//                         </div>
//                         <div class="text-${message.sender_id === 7 ? 'end ' : ''}text-muted mt-1">
//                             <i class="bx bx-check-double text-success"></i>
//                             <small>${message.date_sent}</small>
//                         </div>
//                     </div>
//                 </div>
//             </li>`;

//         BodyConversationHtml += messageHtml;
//     });

//     BodyConversationHtml += '</ul>';
//     chatBody.html(BodyConversationHtml);
//     $('#Chat').addClass('col app-chat-history');
//     autoScroll();
// }

// function escapeHtml(text) {
//     var map = {
//         '&': '&amp;',
//         '<': '&lt;',
//         '>': '&gt;',
//         '"': '&quot;',
//         "'": '&#039;'
//     };

//     return text.replace(/[&<>"']/g, function (m) { return map[m]; });
// }

// function ClosedConversation(id, idRoomStatus) {
//     if (typeof id !== 'undefined') {
//         $.ajax({
//             url: 'views/modules/includes/chats/closed-conversation.php',
//             type: 'POST',
//             dataType: 'json',
//             data: { idRoom: id, IdRoomStatus: idRoomStatus },
//             success: function (response) {
//                 console.log(response);

//                 Swal.fire({
//                     title: "Bien!",
//                     text: "Chat cerrado con exito!",
//                     icon: "success"
//                 });

//                 autoScroll();
//             },
//             error: function (xhr, status, error) {
//                 console.error('Error en la solicitud AJAX:', error);
//                 // Maneja el error de la solicitud AJAX, por ejemplo, mostrando un mensaje de error al usuario
//                 cargarConversation();
//                 autoScroll();
//             }
//         });
//     }
// }

// function ShowImg(img) {
//     // MODAL IMG
//     var Showimg = '';
//     Showimg += '<img class="img-fluid" src="' + img + '">';
//     $('#modalShowImg').html(Showimg);
// }

// // Cargar datos al cargar la página
// $(document).ready(function () {
//     ListarChats();
//     toggleChatVisibility(false);
//     // autoScroll();
// });

// function obtenerPerfilUsuario() {
//     $.ajax({
//         url: 'views/modules/includes/chats/get-profile.php',
//         type: 'GET',
//         dataType: 'json',
//         success: function (response) {
//             console.log('Perfil del usuario:', response);
//         },
//         error: function (xhr, status, error) {
//             console.error('Error en la solicitud AJAX:', error);
//         }
//     });
// }

// // Llamar a la función para obtener el perfil del usuario
// obtenerPerfilUsuario();

// function toggleChatVisibility(show) {
//     if (show) {
//         $('#Chat').show();
//     } else {
//         $('#Chat').hide();
//     }
// }