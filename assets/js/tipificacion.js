$('.btnAddLevel').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    let $button = $(this);
    var tipoSeleccionado = $('#tipificacionSelect').val();
    var nombreTipificacion = $('#nombreTipPlantilla').val();

    // Validación de campos
    if (!tipoSeleccionado || !nombreTipificacion.trim()) {
        Swal.fire({
            icon: 'error',
            title: 'Campos incompletos',
            text: 'Por favor, seleccione una opción o escriba el nombre',
        });
        return;
    }
    $button.addClass('disabled');
    $button.html('Guardando...');

    $.ajax({
        url: 'controllers/GestionComercial/tipificacion.controllers.php',
        type: 'post',

        data: {
            action: tipoSeleccionado,
            tipificacion: nombreTipificacion,
        },
        success: function(response) {
            if (response === "false") {
                Swal.fire({
                    icon: "error",
                    title: "Nombre Duplicado",
                    text: "El nombre ingresado ya se encuentra registrado en nuestra base de datos. Por favor, utilice un nombre diferente.",
                    confirmButtonText: "Aceptar"
                });
                $button.html('Guardar').removeClass('disabled');
                return
            }
            try {

                let data = (typeof response === "string") ? JSON.parse(response) : response;
                let type = tipoSeleccionado === "nivel1" ? "1" : "2";
                // Crear un nuevo elemento de lista con el registro insertado
                let newListItem = $(`<li class="list-group-item d-flex justify-content-between align-items-center highlight" id="level${type}Item${data.id}">`);
                newListItem.append(data.nombre);
                newListItem.append(`
                    <form method="post">
                      <input type="hidden" name="id" value="${data.id}">
                      <button type="button" name="eliminarLevel" data-id="${data.id}" data-name="${data.nombre}"  data-type="${type}" class="btn btn-ligth btnDeleteLevel">
                        <i class="fas fa-trash"></i>
                      </button>
                    </form>
                  `);
                // Agregar el nuevo elemento de lista al contenedor
                let newOption = $('<option value="' + data.nombre + '">' + data.nombre + '</option>');
                if (tipoSeleccionado === "nivel1") {
                    $('#tipifLvl1List').prepend(newListItem);
                    $('#Nivel1').prepend(newOption);
                } else if (tipoSeleccionado === "nivel2") {
                    $('#tipifLvl2List').prepend(newListItem);
                    $('#Nivel2').prepend(newOption);
                } else {
                    $('#plantilla').prepend(newOption);
                    $('#plantillasList').prepend(newListItem);
                }

                var tipoSeleccionadoTexto = $('#tipificacionSelect option:selected').text();
                // Mostrar mensaje de éxito con SweetAlert2
                Swal.fire({
                    icon: 'success',
                    title: 'Guardado exitoso',
                    text: `La ${tipoSeleccionadoTexto} se ha guardado correctamente.`,
                    confirmButtonText: 'Aceptar'
                });
                $button.html('Guardar').removeClass('disabled');

                // Limpiar los campos después de guardar
                $('#tipificacionSelect').val('');
                $('#nombreTipPlantilla').val('');

                // Quitar la clase de resalte después de 2 segundos
                setTimeout(function() {
                    newListItem.removeClass('highlight');
                }, 3000);
                $('.btnDeleteLevel').click(function(e) {
                    let $button = $(this);
                    deleteLevel(e, $button)
                });

            } catch (e) {
                console.error('Error al analizar JSON:', e);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al guardar la tipificación:', status, error);
            $button.html('Guardar').removeClass('disabled');
        }
    });
})

$('.btnRelacionar').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    let $button = $(this);

    var plantillaSeleccionada = $('#plantilla').val();
    var nivel1Seleccionado = $('#Nivel1').val();
    var nivel2Seleccionado = $('#Nivel2').val();

    // Validación de campos
    if (!plantillaSeleccionada || !nivel1Seleccionado || !nivel2Seleccionado) {
        Swal.fire({
            icon: 'error',
            title: 'Campos incompletos',
            text: 'Por favor, seleccione una plantilla y niveles de tipificación válidos.',
        });
        return;
    }

    $button.addClass('disabled');
    $button.html('Relacionando...');
    $.ajax({
        url: 'controllers/GestionComercial/tipificacion.controllers.php',
        type: 'post',
        data: {
            action: 'addRelation',
            plantilla: plantillaSeleccionada,
            nivel1: nivel1Seleccionado,
            nivel2: nivel2Seleccionado,
        },
        success: function(response) {

            try {
                let data;
                if (typeof response === "string") {
                    // Si la respuesta es una cadena, intentar analizar JSON
                    data = JSON.parse(response);
                } else {
                    // Si la respuesta ya es un objeto, usarlo directamente
                    data = response;
                }

                // Manejar errores específicos devueltos por el servidor
                if (data.error) {
                    // Verifica el mensaje de error para mostrar el error de duplicado
                    if (data.message.includes('Los datos ya existen')) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Datos Duplicados',
                            text: 'La relación que intentas agregar ya existe.',
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al relacionar',
                            text: data.message || 'Ocurrió un error al guardar la relación.',
                        });
                    }
                    $button.html('Relacionar').removeClass('disabled');
                    return;
                }

                // Mostrar mensaje de éxito con SweetAlert2
                Swal.fire({
                    icon: 'success',
                    title: 'Relación exitosa',
                    text: 'La relación se ha guardado correctamente.',
                    confirmButtonText: 'Aceptar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload();
                    }
                });
                $button.html('Relacionar').removeClass('disabled');

                // Limpiar los campos después de guardar
                $('#plantilla').val('');
                $('#Nivel1').val('');
                $('#Nivel2').val('');

                $('#alertaRelacionesNoEncontradas').hide()

                let dataRelacion = {
                    id: data['id'],
                    plantilla: plantillaSeleccionada,
                    principal: nivel1Seleccionado,
                    secundario: nivel2Seleccionado
                };

                insertarRelacion(dataRelacion);

                // Asignar evento de eliminación a los nuevos botones
                $('.btnDeleteRelation').click(function(e) {
                    let $button = $(this);
                    deleteRelation(e, $button);
                });
            } catch (e) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al procesar la respuesta',
                    text: 'Ocurrió un error al analizar la respuesta del servidor.',
                });
                console.error('Error al analizar JSON:', e);
                $button.html('Relacionar').removeClass('disabled');
            }
        },
        error: function(xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al relacionar',
                text: 'Ocurrió un error al enviar la solicitud.',
            });
            console.error('Error al relacionar:', status, error);
            $button.html('Relacionar').removeClass('disabled');
        }
    });
});

$('.btnDeleteLevel').click(function(e) {
    let $button = $(this);
    deleteLevel(e, $button)
});

function deleteLevel(e, button) {
    e.preventDefault();
    e.stopPropagation();

    button.addClass('disabled');
    lvlid = button.data('id');
    lvlname = button.data('name');

    type = button.data('type')
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres eliminar: ${lvlname}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: 'controllers/GestionComercial/tipificacion.controllers.php',
                method: 'POST',
                data: { action: "deleteLevel", levelId: lvlid, lvlType: type },
                success: function(response) {
                    if (response) {
                        $(`#level${type}Item${lvlid}`).slideUp("fast", function() {
                            $(this).remove();
                        });
                        if (type === 1) {
                            $('#Nivel1 option[value="' + lvlname + '"]').remove();
                            $('table tbody tr').each(function() {
                                var nivel1 = $(this).find('td:nth-child(2)').text().trim();
                                if (nivel1 === lvlname) {
                                    $(this).slideUp(function() {
                                        $(this).remove(); // Eliminar la fila después de la animación
                                    });
                                }
                            });
                        } else if (type === 2) {
                            $('#Nivel2 option[value="' + lvlname + '"]').remove();
                            $('table tbody tr').each(function() {
                                $(this).find('td:nth-child(3) .d-flex').each(function() {
                                    var nivel2 = $(this).find('span').text().trim();
                                    if (nivel2 === lvlname) {
                                        $(this).slideUp(function() {
                                            $(this).remove(); // Elimina el bloque de Nivel 2 y su botón después de la animación
                                        });
                                    }
                                });
                            });
                        } else {
                            $('#plantilla option[value="' + lvlname + '"]').remove();
                        }
                    }
                    button.removeClass('disabled');
                },
                error: function() {
                    Swal.fire('Error!', 'No se pudo eliminar el registro.', 'error');
                    button.removeClass('disabled');
                }
            });
        } else {
            button.removeClass('disabled');
        }
    });
}


$('.btnDeleteRelation').click(function(e) {
    let $button = $(this);
    deleteRelation(e, $button)
});

function deleteRelation(e, button) {
    e.preventDefault();
    e.stopPropagation();

    button.addClass('disabled');
    relid = button.data('relid');
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres eliminar la relación: ${relid}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: 'controllers/GestionComercial/tipificacion.controllers.php',
                method: 'POST',
                data: { action: "deleteRel", relid: relid },
                success: function(response) {
                    if (response) {
                        $(`#relid${relid}`).slideUp("fast", function() {
                            $(this).remove();
                        });
                    }
                    button.removeClass('disabled');
                },
                error: function() {
                    Swal.fire('Error!', 'No se pudo eliminar el registro.', 'error');
                    button.removeClass('disabled');
                }
            });
        } else {
            button.removeClass('disabled');
        }
    });
}
$('.btnDeleteSecundario').click(function(e) {
    let $button = $(this);
    deleteSecundario(e, $button);
});

function deleteSecundario(e, button) {
    e.preventDefault();
    e.stopPropagation();

    button.addClass('disabled');
    let relid = button.data('relid');
    let rellvl2 = button.data('rellvl2');
    let hashid = button.data('hashid');
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres eliminar el secundario: ${rellvl2}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: 'controllers/GestionComercial/tipificacion.controllers.php',
                method: 'POST',
                data: { action: "deleteSecundario", relid: relid, rellvl2: rellvl2 },
                success: function(response) {
                    if (response) {
                        $(`#relLvl2Group${hashid}`).slideUp("fast", function() {
                            $(this).remove();
                        });
                    }
                    button.removeClass('disabled');
                },
                error: function() {
                    Swal.fire('Error!', 'No se pudo eliminar el registro.', 'error');
                    button.removeClass('disabled');
                }
            });
        } else {
            button.removeClass('disabled');
        }
    });
}


function insertarRelacion(data) {
    let plantillaSeleccionada = data.plantilla;
    let plantillaId = `tblRelacion-${plantillaSeleccionada.replace(/\s+/g, '')}`;
    let seccionRelaciones = $('#seccionRelaciones');

    // Crear la tabla si no existe
    if ($(`#${plantillaId}`).length === 0) {
        let newTableHTML = `
            <h5 class="mt-4 fw-bold">${plantillaSeleccionada.charAt(0).toUpperCase() + plantillaSeleccionada.slice(1).toLowerCase()}</h5>
            <div class="table-responsive" id="${plantillaId}">
                <table class="table table-bordered table-hover">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col" style="width: 5%;">#</th>
                            <th scope="col" style="width: 20%;">Nivel 1</th>
                            <th scope="col" style="width: 60%;">Nivel 2</th>
                            <th scope="col" style="width: 15%;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        `;
        seccionRelaciones.append(newTableHTML);
    }

    // Crear la nueva fila
    let secundariosHTML = '';
    data.secundario.forEach(secundario => {
        let secundarioStr = secundario.trim();
        let hashId = generateHashId(secundario.trim(), data.id);
        secundariosHTML += `
            <div class="d-flex align-items-center mb-2" id="relLvl2Group${hashId}">
                <button type="button" class="btnDeleteSecundario btn btn-light btn-sm mr-2" data-hashid="${hashId}" data-relid="${data.id}" data-rellvl2="${secundarioStr}">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <span class="bg-light p-2 rounded text-truncate" style="max-width: 300px;">${secundarioStr}</span>
            </div>
        `;
    });

    let newRow = `
        <tr id="relid${data.id}">
            <td class="align-middle">${data.id}</td>
            <td class="align-middle">${data.principal}</td>
            <td class="align-middle">${secundariosHTML}</td>
            <td class="align-middle">
                <form method="POST">
                    <input type="hidden" name="principal" value="${data.principal}">
                    <input type="hidden" name="secundario" value="${data.secundario}">
                    <button type="button" class="btnDeleteRelation btn btn-danger btn-sm" data-relid="${data.id}">Eliminar</button>
                </form>
            </td>
        </tr>
    `;

    // Añadir la nueva fila a la tabla
    $(`#${plantillaId} tbody`).append(newRow);
    $('.btnDeleteSecundario').click(function(e) {
        let $button = $(this);
        deleteSecundario(e, $button);
    });

}

function generateHashId(text, id) {
    const combined = text + id;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convierte a 32bit integer
    }
    return Math.abs(hash).toString(16).substr(0, 8);
}