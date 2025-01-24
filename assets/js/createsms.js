$(document).ready(function () {

$('#creategsmsTable').on('click', '.btn-editar', function() {

    $('#modalFormClienteEditar').modal('show');
    const id = $(this).data('id');
    const nombreCliente = $(this).data('nombre-cliente');
    const smsAEnviar = $(this).data('sms-a-enviar');
    const idEnvio = $(this).data('id-envio');
    const url = $(this).data('url');
    $('#editId').val(id)
    $('#editNombre').val(nombreCliente)
    $('#editsmsaenviar').val(smsAEnviar)
    $('#editidenvio').val(idEnvio)
    $('#editurl').val(url)
})

// Volver a inicializar eventos después de que DataTables haya dibujado la tabla


$('#creategsmsTable').on('click', '.btn-eliminar', function() {
    swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const id = $(this).data('id');

            $.ajax({
                url: '#',
                type: 'POST',
                data: {
                    action: "eliminar_sms",
                    id: id
                },
                success: function(response) {
                    swal.fire({
                        icon: "success",
                        title: "¡El Registro se ha eliminado exitosamente!",
                        showConfirmButton: true,
                        confirmButtonText: "Cerrar",
                        closeOnConfirm: false

                    }).then((result) => {
                        window.location.href =
                            "createsms"; // Recargar la página para actualizar la tabla
                    });

                },
                error: function(xhr, status, error) {
                    // Manejar errores de la solicitud
                    console.error(
                        'Error en la solicitud AJAX:',
                        error);

                }
            });
        }
    });
});
})
