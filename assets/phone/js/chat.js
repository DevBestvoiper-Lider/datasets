
const userId = '1234';
let unreadCount = 0;
let typingTimeout;
let typingTimer; // Temporizador para controlar la frecuencia de envío del evento "typing"
const typingInterval = 1000;
let notificationSound = new Audio('assets/audio/notification.mp3');;



window.addEventListener('resize', adjustChatWindowPosition);

function adjustChatWindowPosition() {
    const chatWindow = document.querySelector('.chat-window');
    const button = document.querySelector('.your-button-class'); // Reemplaza con la clase de tu botón

    if (chatWindow && button) {
        const buttonRect = button.getBoundingClientRect();
        chatWindow.style.top = `${buttonRect.bottom + window.scrollY}px`;
        chatWindow.style.left = `${buttonRect.left + buttonRect.width / 2 + window.scrollX}px`;
        chatWindow.style.transform = 'translateX(-50%)';
    }
}

// Llama a la función una vez para ajustar la posición inicial
adjustChatWindowPosition();

// Centrar la ventana del chat con respecto al botón
function centerChatWindow() {
    const button = document.querySelector('.your-button-class'); // Reemplaza con la clase de tu botón
    const chatWindow = document.querySelector('.chat-window');

    if (button && chatWindow) {
        const buttonRect = button.getBoundingClientRect();
        chatWindow.style.top = `${buttonRect.bottom + window.scrollY}px`;
        chatWindow.style.left = `${buttonRect.left + buttonRect.width / 2 + window.scrollX}px`;
        chatWindow.style.transform = 'translateX(-50%)';
    }
}

// Llama a la función una vez para ajustar la posición inicial
centerChatWindow();


// socketAgents.onmessage = function(event) {
//     const data = JSON.parse(event.data);

//     switch(data.type) {
//         case 'message':
//             addMessage(data.message, false);
//             if (!$('#chatWindow').is(':visible')) {
//                 unreadCount++;
//                 updateNotificationBadge();
//             }
//             break;
//         case 'typing':
//             if (data.senderId !== userId) {
//                 $('#typingIndicator').show();
//                 clearTimeout(typingTimeout);
//                 typingTimeout = setTimeout(() => {
//                     $('#typingIndicator').hide();
//                 }, 3000);
//             }
//             break;
//     }
// };

$('#chatToggle').click(function (e) {
    e.stopPropagation();
    $('#chatWindow').toggle();
    if ($('#chatWindow').is(':visible')) {
        unreadCount = 0;
        updateNotificationBadge();
        $('#messageInput').focus();
    }
    loadChatHistory()
});
// // Cerrar el chat si se hace clic fuera
// $(document).click(function (e) {
//     if (!$(e.target).closest('.chat-container').length) {
//         $('#chatWindow').hide();
//     }
// });

// Reposicionar al cambiar el tamaño de la ventana
$(window).resize(function () {
    if ($('#chatWindow').is(':visible')) {
        centerChatWindow();
    }
});

$('#minimizeChat').click(function () {
    $('#chatWindow').hide();
});

$('#sendMessage').click(sendMessage);

$('#messageInput').keypress(function (e) {
    const extension = $('#messageInput').data('extension');  // Obtener la extensión del destinatario

    if (e.which === 13) {  // Si se presiona Enter
        sendMessage();  // Llamar a la función para enviar el mensaje cuando se presiona Enter
        clearTimeout(typingTimer);  // Limpiar el temporizador si el usuario envía un mensaje
        socketAgents.send(JSON.stringify({
            type: 'stop-typing',  // Enviar mensaje de 'stop-typing' cuando se envía un mensaje
            senderId: String(storedUsername),
            receiverId: String(extension)
        }));
    } else {
        clearTimeout(typingTimer);  // Limpiar el temporizador si se continúa escribiendo

        // Configurar un nuevo temporizador para enviar el mensaje de 'typing' después de 1 segundo
        typingTimer = setTimeout(() => {
            socketAgents.send(JSON.stringify({
                type: 'stop-typing',  // Enviar mensaje de 'stop-typing' después de 1 segundo sin escribir
                senderId: String(storedUsername),
                receiverId: String(extension)  // ID del destinatario
            }));
        }, typingInterval);

        socketAgents.send(JSON.stringify({
            type: 'typing',  // Enviar mensaje de 'typing' si el usuario está escribiendo
            senderId: String(storedUsername),
            receiverId: String(extension)  // ID del destinatario
        }));
    }
});

function sendMessage() {
    const message = $('#messageInput').val().trim();
    const extension = $('#messageInput').data('extension');
    if (message) {
        const messageData = {
            type: 'send-message',
            senderId: String(storedUsername),
            receiverId: String(extension),
            message: message,
            timestamp: new Date().toISOString()
        };

        socketAgents.send(JSON.stringify(messageData));

        addMessage(message, true);
        saveMessageToLocalStorage(messageData);
        $('#messageInput').val('').focus();
    }
}

function saveMessageToLocalStorage(messageData) {
    const chatKey = 'chatDatabase';
    let chatDatabase = JSON.parse(localStorage.getItem(chatKey)) || {};
    const conversationKey = `${messageData.senderId}_${messageData.receiverId}`;

    if (!chatDatabase[conversationKey]) {
        chatDatabase[conversationKey] = [];
    }

    chatDatabase[conversationKey].push(messageData);
    localStorage.setItem(chatKey, JSON.stringify(chatDatabase));
}

function addMessage(message, isSent) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const messageHtml = `
        <div class="message ${isSent ? 'sent' : 'received'}">
            ${message}
            <div class="message-time d-flex justify-content-end align-items-center">
                ${time}
                ${isSent ? '<i class="fas fa-check-double message-status"></i>' : ''}
            </div>
        </div>
    `;
    $('#chatMessages').append(messageHtml);
    $('#chatMessages').scrollTop($('#chatMessages')[0].scrollHeight);
}


// Modified notification function
function updateNotificationBadge() {
    if (unreadCount > 0) {
        if (notificationSound && audioContext) {
            // Resume audio context if suspended
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            notificationSound.currentTime = 0; // Reset audio position
            notificationSound.play().catch(error => {
            });
        }

        $('#notificationBadge')
            .text(unreadCount)
            .show()
            .addClass('animate')
            .one('animationend', function() {
                $(this).removeClass('animate');
            });
    } else {
        $('#notificationBadge').hide();
    }
}

// Función para mostrar el indicador de escritura
function showTypingIndicator() {
    const typingIndicator = $('#typingIndicator');

    if (!typingIndicator.is(':visible')) {
        // Mostrar indicador con animación
        typingIndicator
            .html(`escribiendo...`)
            .fadeIn(200)
            .css({ display: 'flex', alignItems: 'center' }); // Para alinear mejor el contenido
    }

    // Agregar animación al ícono
    const typingIcon = typingIndicator.find('i');
    if (!typingIcon.hasClass('typing-animation')) {
        typingIcon.addClass('typing-animation');
    }
}

// Función para ocultar el indicador de escritura
function hideTypingIndicator() {
    const typingIndicator = $('#typingIndicator');

    // Ocultar indicador con animación
    typingIndicator.fadeOut(200, function () {
        // Limpia el contenido al ocultarlo
        typingIndicator.html('');
    });
}
function loadChatHistory() {
    const extension = $('#messageInput').data('extension');
    const chatKey = 'chatDatabase';
    const chatDatabase = JSON.parse(localStorage.getItem(chatKey)) || {};
    const conversationKey1 = `${storedUsername}_${extension}`;
    const conversationKey2 = `${extension}_${storedUsername}`;
    const chatHistory1 = chatDatabase[conversationKey1] || [];
    const chatHistory2 = chatDatabase[conversationKey2] || [];
    const chatHistory = chatHistory1.concat(chatHistory2);

    console.debug('Loading chat history for:', { storedUsername, extension });
    console.debug('Chat database:', chatDatabase);
    console.debug('Conversation keys:', { conversationKey1, conversationKey2 });
    console.debug('Chat history 1:', chatHistory1);
    console.debug('Chat history 2:', chatHistory2);
    console.debug('Combined chat history:', chatHistory);

    // Ordenar los mensajes por timestamp
    chatHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Limpiar mensajes anteriores
    $('#chatMessages').empty();

    chatHistory.forEach(messageData => {
        console.debug('Adding message:', messageData);
        addMessage(messageData.message, messageData.senderId === storedUsername);
    });
}
$(document).ready(function() {
    const chatKey = 'chatDatabase';
    const chatDatabase = JSON.parse(localStorage.getItem(chatKey)) || {};
    const conversationKeys = Object.keys(chatDatabase);

    if (conversationKeys.length > 0) {
        $('#containerChatNavbar').show();

        // Limpiar mensajes anteriores
        $('#chatMessages').empty();

        // Combinar y ordenar todos los mensajes de todas las conversaciones
        let combinedChatHistory = [];
        conversationKeys.forEach(key => {
            const chatHistory = chatDatabase[key];
            combinedChatHistory = combinedChatHistory.concat(chatHistory);
        });

        // Ordenar los mensajes por timestamp
        combinedChatHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Reconstruir el contenedor del chat
        combinedChatHistory.forEach(messageData => {
            const extension = messageData.senderId === storedUsername ? messageData.receiverId : messageData.senderId;
            $('#messageInput').attr('data-extension', extension);
            $('.chatWithAgentLabel').html(extension);


            addMessage(messageData.message, messageData.senderId === storedUsername);
        });
    }
});