/**
 * Page User List
 */

'use strict';



// Datatable (jquery)
$(function () {
  let borderColor, bodyBg, headingColor;

  if (isDarkStyle) {
    borderColor = config.colors_dark.borderColor;
    bodyBg = config.colors_dark.bodyBg;
    headingColor = config.colors_dark.headingColor;
  } else {
    borderColor = config.colors.borderColor;
    bodyBg = config.colors.bodyBg;
    headingColor = config.colors.headingColor;
  }

  // Variable declaration for table
  var dt_user_table = $('.datatables-users'),
    select2 = $('.select2'),
    userView = 'app-user-view-account.html',
    statusObj = {
      1: { title: 'Pending', class: 'bg-label-warning' },
      2: { title: 'Active', class: 'bg-label-success' },
      3: { title: 'Inactive', class: 'bg-label-secondary' }
    },
    statusPHONE = {
      A: { title: 'Active', class: 'bg-label-success' },
      H: { title: 'Active', class: 'bg-label-success' },
      D: { title: 'Inactive', class: 'bg-label-secondary' },
      N: { title: 'Inactive', class: 'bg-label-secondary' }
    };

  if (select2.length) {
    var $this = select2;
    $this.wrap('<div class="position-relative"></div>').select2({
      placeholder: 'Select Country',
      dropdownParent: $this.parent()
    });
  }

  // Users datatable
  if (dt_user_table.length) {
    var dt_user = dt_user_table.DataTable({
      ajax: 'ajax/app-show-users.php', // JSON file to add data}
      columns: [
        // columns according to JSON
        { data: '' },
        { data: 'nombre' },
        { data: 'usuario' },
        { data: 'perfil' },
        { data: 'numtel' },
        { data: 'estadoUser' },
        { data: 'Chat' },
        { data: 'verAA' },
        { data: 'AA' },
        { data: 'action' }
      ],
      columnDefs: [
        {
          // For Responsive
          className: 'control',
          searchable: false,
          orderable: false,
          responsivePriority: 2,
          targets: 0,
          render: function (data, type, full, meta) {
            return '';
          }
        },
        {
          // User full name and email
          targets: 1,
          responsivePriority: 4,
          render: function (data, type, full, meta) {
            var $name = full['nombre'],
              $email = full['correo'],
              $image = full['avatar'];
            if ($image) {
              // For Avatar image
              var $output =
                '<img src="' + assetsPath + 'img/avatars/' + $image + '" alt="Avatar" class="rounded-circle">';
            } else {
              // For Avatar badge
              var stateNum = Math.floor(Math.random() * 6);
              var states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary'];
              var $state = states[stateNum],
                $name = full['nombre'],
                $initials = $name.match(/\b\w/g) || [];
              $initials = (($initials.shift() || '') + ($initials.pop() || '')).toUpperCase();
              $output = '<span class="avatar-initial rounded-circle bg-label-' + $state + '">' + $initials + '</span>';
            }
            // Creates full output for row
            var $row_output =
              '<div class="d-flex justify-content-start align-items-center user-name">' +
              '<div class="avatar-wrapper">' +
              '<div class="avatar avatar-sm me-3">' +
              $output +
              '</div>' +
              '</div>' +
              '<div class="d-flex flex-column">' +
              '<a href="' +
              userView +
              '" class="text-body text-truncate"><span class="fw-medium">' +
              $name +
              '</span></a>' +
              '<small class="text-muted">' +
              $email +
              '</small>' +
              '</div>' +
              '</div>';
            return $row_output;
          }
        },

        {
          // Plans
          targets: 2,
          render: function (data, type, full, meta) {
            var $plan = full['usuario'];

            return '<span class="fw-medium">' + $plan + '</span>';
          }
        },
        {
          // User Role
          targets: 3,
          render: function (data, type, full, meta) {
            var $role = full['perfil'];
            var roleBadgeObj = {
              Asesor:
                '<span class="badge badge-center rounded-pill bg-label-warning w-px-30 h-px-30 me-2"><i class="bx bx-user bx-xs"></i></span>',
              Ingeniero:
                '<span class="badge badge-center rounded-pill bg-label-success w-px-30 h-px-30 me-2"><i class="bx bx-cog bx-xs"></i></span>',
            };
            return "<span class='text-truncate d-flex align-items-center'>" + roleBadgeObj[$role] + $role + '</span>';
          }
        },
        {
          // User Role
          targets: 6,
          render: function (data, type, full, meta) {
            var $chat = full['Chat'];
            var roleBadgeObj = {
              n:
                '<label class="switch switch-success"><input type="checkbox" onclick="activeXdesactiveChat(1,' + full['id'] + ');" class="switch-input"><span class="switch-toggle-slider"><span class="switch-on"><i class="bx bx-check"></i></span><span class="switch-off"><i class="bx bx-x"></i></span></span></label>',
              s:
                '<label class="switch switch-success"><input type="checkbox" onclick="activeXdesactiveChat(0,' + full['id'] + ');" class="switch-input" checked=""><span class="switch-toggle-slider"><span class="switch-on"><i class="bx bx-check"></i></span><span class="switch-off"><i class="bx bx-x"></i></span></span></label>',
            };
            return roleBadgeObj[$chat];
          }
        },
        {
          // User Status
          targets: 5,
          render: function (data, type, full, meta) {
            var $status = full['estadoUser'];

            return '<span class="badge ' + statusObj[$status].class + '">' + statusObj[$status].title + '</span>';
          }
        },
        {
          // User Role
          targets: 7,
          render: function (data, type, full, meta) {
            var $status = full['verAA'];

            return '<span class="badge ' + statusPHONE[$status].class + '">' + statusPHONE[$status].title + '</span>';
          }
        },
        {
          // User Role
          targets: 8,
          render: function (data, type, full, meta) {
            var $chat = full['Chat'];
            var roleBadgeObj = {
              n:
                '<label class="switch switch-success"><input type="checkbox" onclick="activeXdesactiveChat(1,' + full['id'] + ');" class="switch-input"><span class="switch-toggle-slider"><span class="switch-on"><i class="bx bx-check"></i></span><span class="switch-off"><i class="bx bx-x"></i></span></span></label>',
              s:
                '<label class="switch switch-success"><input type="checkbox" onclick="activeXdesactiveChat(0,' + full['id'] + ');" class="switch-input" checked=""><span class="switch-toggle-slider"><span class="switch-on"><i class="bx bx-check"></i></span><span class="switch-off"><i class="bx bx-x"></i></span></span></label>',
            };
            return roleBadgeObj[$chat];
          }
        },
        {
          // Actions
          targets: -1,
          title: 'Actions',
          searchable: false,
          orderable: false,
          render: function (data, type, full, meta) {

            if (full['estadoUser'] == "1") {
              var text = "Activar";
            } else if (full['estadoUser'] == "3") {
              var text = "Activar";
            } else if (full['estadoUser'] == "2") {
              var text = "Desactivar";
            }

            return (
              '<div class="d-inline-block text-nowrap">' +
              '<button class="btn btn-sm btn-icon" data-bs-toggle="offcanvas" data-bs-target="#offcanvasEditUser"><i class="bx bx-edit"></i></button>' +
              '<button class="btn btn-sm btn-icon delete-record" onclick="DeleteUser(' + full["id"] + ', ' + full["exten"] + ', \'' + full["agente"] + '\')"><i class="bx bx-trash"></i></button>' +
              '<button class="btn btn-sm btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="bx bx-dots-vertical-rounded me-2"></i></button>' +
              '<div class="dropdown-menu dropdown-menu-end m-0">' +
              '<a href="javascript:;" onclick="activeXdesactiveUser(' + full["estadoUser"] + ', ' + full["id"] + ');" class="dropdown-item">' + text + '</a>' +
              '<a href="javascript:;" onclick="VerPantalla();" class="dropdown-item">Ver Pantalla</a>' +
              '</div>' +
              '</div>'
            );
          }
        }
      ],
      order: [[1, 'desc']],
      dom:
        '<"row mx-2"' +
        '<"col-md-2"<"me-3"l>>' +
        '<"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>' +
        '>t' +
        '<"row mx-2"' +
        '<"col-sm-12 col-md-6"i>' +
        '<"col-sm-12 col-md-6"p>' +
        '>',
      language: {
        sLengthMenu: '_MENU_',
        search: '',
        searchPlaceholder: 'Search..'
      },
      // Buttons with Dropdown
      buttons: [
        {
          extend: 'collection',
          className: 'btn btn-label-secondary dropdown-toggle mx-3',
          text: '<i class="bx bx-export me-1"></i>Export',
          buttons: [
            {
              extend: 'print',
              text: '<i class="bx bx-printer me-2" ></i>Print',
              className: 'dropdown-item',
              exportOptions: {
                columns: [1, 2, 3, 4, 5],
                // prevent avatar to be print
                format: {
                  body: function (inner, coldex, rowdex) {
                    if (inner.length <= 0) return inner;
                    var el = $.parseHTML(inner);
                    var result = '';
                    $.each(el, function (index, item) {
                      if (item.classList !== undefined && item.classList.contains('user-name')) {
                        result = result + item.lastChild.firstChild.textContent;
                      } else if (item.innerText === undefined) {
                        result = result + item.textContent;
                      } else result = result + item.innerText;
                    });
                    return result;
                  }
                }
              },
              customize: function (win) {
                //customize print view for dark
                $(win.document.body)
                  .css('color', headingColor)
                  .css('border-color', borderColor)
                  .css('background-color', bodyBg);
                $(win.document.body)
                  .find('table')
                  .addClass('compact')
                  .css('color', 'inherit')
                  .css('border-color', 'inherit')
                  .css('background-color', 'inherit');
              }
            },
            {
              extend: 'csv',
              text: '<i class="bx bx-file me-2" ></i>Csv',
              className: 'dropdown-item',
              exportOptions: {
                columns: [1, 2, 3, 4, 5],
                // prevent avatar to be display
                format: {
                  body: function (inner, coldex, rowdex) {
                    if (inner.length <= 0) return inner;
                    var el = $.parseHTML(inner);
                    var result = '';
                    $.each(el, function (index, item) {
                      if (item.classList !== undefined && item.classList.contains('user-name')) {
                        result = result + item.lastChild.firstChild.textContent;
                      } else if (item.innerText === undefined) {
                        result = result + item.textContent;
                      } else result = result + item.innerText;
                    });
                    return result;
                  }
                }
              }
            },
            {
              extend: 'excel',
              text: '<i class="bx bxs-file-export me-2"></i>Excel',
              className: 'dropdown-item',
              exportOptions: {
                columns: [1, 2, 3, 4, 5],
                // prevent avatar to be display
                format: {
                  body: function (inner, coldex, rowdex) {
                    if (inner.length <= 0) return inner;
                    var el = $.parseHTML(inner);
                    var result = '';
                    $.each(el, function (index, item) {
                      if (item.classList !== undefined && item.classList.contains('user-name')) {
                        result = result + item.lastChild.firstChild.textContent;
                      } else if (item.innerText === undefined) {
                        result = result + item.textContent;
                      } else result = result + item.innerText;
                    });
                    return result;
                  }
                }
              }
            },
            {
              extend: 'pdf',
              text: '<i class="bx bxs-file-pdf me-2"></i>Pdf',
              className: 'dropdown-item',
              exportOptions: {
                columns: [1, 2, 3, 4, 5],
                // prevent avatar to be display
                format: {
                  body: function (inner, coldex, rowdex) {
                    if (inner.length <= 0) return inner;
                    var el = $.parseHTML(inner);
                    var result = '';
                    $.each(el, function (index, item) {
                      if (item.classList !== undefined && item.classList.contains('user-name')) {
                        result = result + item.lastChild.firstChild.textContent;
                      } else if (item.innerText === undefined) {
                        result = result + item.textContent;
                      } else result = result + item.innerText;
                    });
                    return result;
                  }
                }
              }
            },
            {
              extend: 'copy',
              text: '<i class="bx bx-copy me-2" ></i>Copy',
              className: 'dropdown-item',
              exportOptions: {
                columns: [1, 2, 3, 4, 5],
                // prevent avatar to be display
                format: {
                  body: function (inner, coldex, rowdex) {
                    if (inner.length <= 0) return inner;
                    var el = $.parseHTML(inner);
                    var result = '';
                    $.each(el, function (index, item) {
                      if (item.classList !== undefined && item.classList.contains('user-name')) {
                        result = result + item.lastChild.firstChild.textContent;
                      } else if (item.innerText === undefined) {
                        result = result + item.textContent;
                      } else result = result + item.innerText;
                    });
                    return result;
                  }
                }
              }
            }
          ]
        },
        {
          text: '<i class="bx bx-plus me-0 me-sm-1"></i><span class="d-none d-sm-inline-block">Add New User</span>',
          className: 'add-new btn btn-primary',
          attr: {
            'data-bs-toggle': 'offcanvas',
            'data-bs-target': '#offcanvasAddUser'
          }
        }
      ],
      // For responsive popup
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'Detalle de ' + data['nombre'];
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
              return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
                ? '<tr data-dt-row="' +
                col.rowIndex +
                '" data-dt-column="' +
                col.columnIndex +
                '">' +
                '<td>' +
                col.title +
                ':' +
                '</td> ' +
                '<td>' +
                col.data +
                '</td>' +
                '</tr>'
                : '';
            }).join('');

            return data ? $('<table class="table"/><tbody />').append(data) : false;
          }
        }
      },
      initComplete: function () {
        // Adding role filter once table initialized
        this.api()
          .columns(3)
          .every(function () {
            var column = this;
            var select = $(
              '<select id="UserRole" class="form-select text-capitalize"><option value=""> Seleccionar Rol </option></select>'
            )
              .appendTo('.user_role')
              .on('change', function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());
                column.search(val ? '^' + val + '$' : '', true, false).draw();
              });

            column
              .data()
              .unique()
              .sort()
              .each(function (d, j) {
                select.append('<option value="' + d + '">' + d + '</option>');
              });
          });
        // // Adding plan filter once table initialized
        // this.api()
        //   .columns(3)
        //   .every(function () {
        //     var column = this;
        //     var select = $(
        //       '<select id="UserPlan" class="form-select text-capitalize"><option value=""> Select Plan </option></select>'
        //     )
        //       .appendTo('.user_plan')
        //       .on('change', function () {
        //         var val = $.fn.dataTable.util.escapeRegex($(this).val());
        //         column.search(val ? '^' + val + '$' : '', true, false).draw();
        //       });

        //     column
        //       .data()
        //       .unique()
        //       .sort()
        //       .each(function (d, j) {
        //         select.append('<option value="' + d + '">' + d + '</option>');
        //       });
        //   });
        // Adding status filter once table initialized
        this.api()
          .columns(5)
          .every(function () {
            var column = this;
            var select = $(
              '<select id="FilterTransaction" class="form-select text-capitalize"><option value=""> Select Status </option></select>'
            )
              .appendTo('.user_status')
              .on('change', function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());
                column.search(val ? '^' + val + '$' : '', true, false).draw();
              });

            column
              .data()
              .unique()
              .sort()
              .each(function (d, j) {
                select.append(
                  '<option value="' +
                  statusObj[d].title +
                  '" class="text-capitalize">' +
                  statusObj[d].title +
                  '</option>'
                );
              });
          });
      }
    });
    // To remove default btn-secondary in export buttons
    $('.dt-buttons > .btn-group > button').removeClass('btn-secondary');
  }

  // Delete Record
  $('.datatables-users tbody').on('click', '.delete-record', function () {
    dt_user.row($(this).parents('tr')).remove().draw();
  });

  // Filter form control to default size
  // ? setTimeout used for multilingual table initialization
  setTimeout(() => {
    $('.dataTables_filter .form-control').removeClass('form-control-sm');
    $('.dataTables_length .form-select').removeClass('form-select-sm');
  }, 300);
});

// Validation & Phone mask
(function () {
  const phoneMaskList = document.querySelectorAll('.phone-mask'),
    addNewUserForm = document.getElementById('addNewUserForm');

  // Phone Number
  if (phoneMaskList) {
    phoneMaskList.forEach(function (phoneMask) {
      new Cleave(phoneMask, {
        phone: true,
        phoneRegionCode: 'US'
      });
    });
  }
  // Add New User Form Validation
  const fv = FormValidation.formValidation(addNewUserForm, {
    fields: {
      userFullname: {
        validators: {
          notEmpty: {
            message: 'Please enter fullname '
          }
        }
      },
      userEmail: {
        validators: {
          notEmpty: {
            message: 'Please enter your email'
          },
          emailAddress: {
            message: 'The value is not a valid email address'
          }
        }
      }
    },
    plugins: {
      trigger: new FormValidation.plugins.Trigger(),
      bootstrap5: new FormValidation.plugins.Bootstrap5({
        // Use this for enabling/changing valid/invalid class
        eleValidClass: '',
        rowSelector: function (field, ele) {
          // field is the field name & ele is the field element
          return '.mb-3';
        }
      }),
      submitButton: new FormValidation.plugins.SubmitButton(),
      // Submit the form when all fields are valid
      // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
      autoFocus: new FormValidation.plugins.AutoFocus()
    }
  });
})();

function DeleteUser(IdUser, interno, agente) {

  // Datos que quieres enviar
  var datos = {
    action: "DeleteUser",
    IdUser: IdUser,
    interno: interno,
    agente: agente
  };

  $.ajax({
    url: "ajax/app-users-update.php",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(datos),
    success: function (response) {
      // Acciones a realizar cuando la solicitud ha tenido éxito
      // Obtener el valor de la variable almacenada en localStorage
      var verticalMenuStyle = localStorage.getItem("templateCustomizer-vertical-menu-template--Style");

      // Verificar si la variable tiene un valor
      if (verticalMenuStyle == "dark") {
        var backgroundColor = "#2b2c40";
        var Color = "#fff";
      } else {
        var backgroundColor = "#fff";
      }


      Swal.fire({
        icon: "success",
        title: "¡Usuario Eliminado!",
        text: "",
        color: Color,
        background: backgroundColor,
        confirmButtonText: "Aceptar"
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    },
    error: function (xhr, status, error) {
      // Acciones a realizar en caso de error
      console.error("Error al hacer la solicitud:", error);
    }
  });
}

function activeXdesactiveUser(value, IdUser) {

  var valueSend;

  if (value == 2) {
    valueSend = 3;
  } else if (value == 3) {
    valueSend = 2;
  } else {
    // Si value no es ni 2 ni 3, aquí puedes manejar el caso
    valueSend = 3;
  }

  // Datos que quieres enviar
  var datos = {
    value: valueSend,
    action: "ActiveUser",
    IdUser: IdUser
  };

  $.ajax({
    url: "ajax/app-users-update.php",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(datos),
    success: function (response) {
      // Acciones a realizar cuando la solicitud ha tenido éxito

      // Obtener el valor de la variable almacenada en localStorage
      var verticalMenuStyle = localStorage.getItem("templateCustomizer-vertical-menu-template--Style");

      // Verificar si la variable tiene un valor
      if (verticalMenuStyle == "dark") {
        var backgroundColor = "#2b2c40";
        var Color = "#fff";
      } else {
        var backgroundColor = "#fff";
      }


      Swal.fire({
        icon: "success",
        title: "¡estado Usuario modificado!",
        text: "",
        color: Color,
        background: backgroundColor,
        confirmButtonText: "Aceptar"
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });

    },
    error: function (xhr, status, error) {
      // Acciones a realizar en caso de error
      console.error("Error al hacer la solicitud:", error);
    }
  });

}

function activeXdesactiveChat(value, IdUser) {

  // Datos que quieres enviar
  var datos = {
    value: value,
    action: "ActiveChat",
    IdUser: IdUser
  };

  $.ajax({
    url: "ajax/app-users-update.php",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(datos),
    success: function (response) {
      // Acciones a realizar cuando la solicitud ha tenido éxito

      // Obtener el valor de la variable almacenada en localStorage
      var verticalMenuStyle = localStorage.getItem("templateCustomizer-vertical-menu-template--Style");

      // Verificar si la variable tiene un valor
      if (verticalMenuStyle == "dark") {
        var backgroundColor = "#2b2c40";
        var Color = "#fff";
      } else {
        var backgroundColor = "#fff";
      }


      Swal.fire({
        icon: "success",
        title: "¡estado chat modificado!",
        text: "",
        color: Color,
        background: backgroundColor,
        confirmButtonText: "Aceptar"
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });

    },
    error: function (xhr, status, error) {
      // Acciones a realizar en caso de error
      console.error("Error al hacer la solicitud:", error);
    }
  });
}

function VerPantalla() {
  const socket = io('http://localhost:3000');
  const video = document.getElementById('screenVideo');
  let peer;

  socket.on('offer', (data) => {
    peer = new SimplePeer();

    peer.on('signal', data => {
      socket.emit('answer', data);
    });

    peer.signal(data);

    peer.on('stream', stream => {
      video.srcObject = stream;
    });

    peer.on('error', err => console.error('peer error', err));
  });

  socket.on('candidate', (data) => {
    peer.signal(data);
  });
}