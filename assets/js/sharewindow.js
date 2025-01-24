const socket = io('http://localhost:3000'); // Conectarse al servidor en el puerto 3000
        let peer;

        async function startScreenShare() {
            try {
                // Intentamos capturar la pantalla de la página actual sin preguntar al usuario
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        mediaSource: 'screen' // Esto aún pedirá permiso al usuario
                    }
                });

                peer = new SimplePeer({ initiator: true, stream: stream });

                peer.on('signal', data => {
                    socket.emit('offer', data);
                });

                socket.on('answer', data => {
                    peer.signal(data);
                });

                socket.on('candidate', data => {
                    peer.signal(data);
                });

                peer.on('error', err => console.error('peer error', err));
            } catch (err) {
                console.error('Error accessing display media.', err);
            }
        }

        // Start sharing the screen as soon as the page loads
        window.onload = startScreenShare;

        socket.on('candidate', (data) => {
            peer.signal(data);
        });