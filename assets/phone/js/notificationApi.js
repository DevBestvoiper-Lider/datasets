function notify(title, message) {
  if (Notification) {
    // Verificar los permisos de la notificación
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Crear las opciones de la notificación
    const extra = {
      icon: "assets/phone/images/incomming-call.ico",
      body: message,
    };

    // Crear la notificación
    let notification = new Notification(title, extra);

    // Acción al hacer clic en la notificación
    notification.onclick = function () {
      try {
        window.focus();
      } catch (ex) {}
    };

    // Cerrar la notificación después de 30 segundos (30000 ms)
    setTimeout(() => {
      notification.close();
    }, 300000);  // Cambia este valor a la cantidad de tiempo que desees (en milisegundos)
  }
}