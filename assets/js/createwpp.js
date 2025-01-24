$(document).ready(function() {
    $('#createwppTable').on('click', '.btn-editar', function() {
        $('#modalFormClienteEditar').modal('show');
        const id = $(this).data('id');
        const clientsha = $(this).data('client-sha');
        const templateid = $(this).data('template-id');
        const clientid = $(this).data('client-id');
        const clientname = $(this).data('client-name');
        const numenvio = $(this).data('num-envio');
        $('#editId').val(id)
        $('#editclientsha').val(clientsha)
        $('#edittemplateid').val(templateid)
        $('#editclientid').val(clientid)
        $('#editclientname').val(clientname)
        $('#editnumenvio').val(numenvio)
    })

    // Volver a inicializar eventos después de que DataTables haya dibujado la tabla


    $('#createwppTable').on('click', '.btn-eliminar', function() {
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
                        action: "eliminar_wpp",
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
                                "createwpp"; // Recargar la página para actualizar la tabla
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