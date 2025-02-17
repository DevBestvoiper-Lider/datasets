/**
 * App eCommerce Category List
 */

'use strict';

// Comment editor

const commentEditor = document.querySelector('.comment-editor');

if (commentEditor) {
  new Quill(commentEditor, {
    modules: {
      toolbar: '.comment-toolbar'
    },
    placeholder: 'Enter category description...',
    theme: 'snow'
  });
}

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

  // Variable declaration for category list table
  var dt_category_list_table = $('.datatables-category-list'),
    statusObj = {
      3: { title: 'Pendiente', class: 'bg-label-warning' },
      1: { title: 'Aprobado', class: 'bg-label-success' },
      2: { title: 'Desaprobado', class: 'bg-label-danger' }
    };

  //select2 for dropdowns in offcanvas

  var select2 = $('.select2');
  if (select2.length) {
    select2.each(function () {
      var $this = $(this);
      $this.wrap('<div class="position-relative"></div>').select2({
        dropdownParent: $this.parent(),
        placeholder: $this.data('placeholder') //for dynamic placeholder
      });
    });
  }

  // Customers List Datatable

  if (dt_category_list_table.length) {
    var dt_category = dt_category_list_table.DataTable({
      ajax: {
        url: 'ajax/list-data-datasets.php', // JSON file or API endpoint
        type: 'POST', // Tipo de solicitud (puede ser GET o POST)
        data: function (d) {
          // Agrega parámetros personalizados
          d.idDataset = id_datasets; // Envía un valor estático
        }
      }, // JSON file to add data
      columns: [
        // columns according to JSON
        { data: '' },
        { data: 'id' },
        { data: 'contenido_id' },
        { data: 'contenido' },
        { data: 'status' },
        { data: 'audio' },
        { data: '' }
      ],
      columnDefs: [
        {
          // For Responsive
          className: 'control',
          searchable: false,
          orderable: false,
          responsivePriority: 1,
          targets: 0,
          render: function (data, type, full, meta) {
            return '';
          }
        },
        {
          // For Checkboxes
          targets: 1,
          orderable: false,
          searchable: false,
          responsivePriority: 4,
          checkboxes: true,
          render: function () {
            return '<input type="checkbox" class="dt-checkboxes form-check-input">';
          },
          checkboxes: {
            selectAllRender: '<input type="checkbox" class="form-check-input">'
          }
        },
        {
          // Categories and Category Detail
          targets: 2,
          responsivePriority: 2,
          render: function (data, type, full, meta) {
            var $name = full['contenido_id'];
            // Creates full output for Categories and Category Detail
            var $row_output =
              '<div class="d-flex align-items-center">' +
              '<div class="avatar-wrapper me-2 rounded-2 bg-label-secondary">' +
              '</div>' +
              '<div class="d-flex flex-column justify-content-center">' +
              '<span class="text-body text-wrap fw-medium">' +
              $name +
              '</span>' +
              '</div>' +
              '</div>';
            return $row_output;
          }
        },
        {
          // Categories and Category Detail
          targets: 3,
          responsivePriority: 3,
          render: function (data, type, full, meta) {
            var $name = full['contenido'];

            if (full['obs'] != null) {
              var $observaciones = '<small class="text-muted">Observacion: ' + full['obs'] + '</small>';
            } else {
              var $observaciones = '';
            }

            var $url_verdatasets = 'ver-datasets?id_datasets=' + full['id'];
            // Creates full output for Categories and Category Detail
            var $row_output =
              '<div class="d-flex align-items-center">' +
              '<div class="avatar-wrapper me-2 rounded-2 bg-label-secondary">' +
              '</div>' +
              '<div class="d-flex flex-column justify-content-center">' +
              '<span class="text-body text-wrap fw-medium">' +
              $name +
              '</span>' +
              $observaciones +
              '</div>' +
              '</div>';
            return $row_output;
          }
        },

        {
          // Categories and Category Detail
          targets: 4,
          responsivePriority: 4,
          render: function (data, type, full, meta) {
            var $status = full['status'];
            // Creates full output for Categories and Category Detail
            return '<span class="badge ' + statusObj[$status].class + '">' + statusObj[$status].title + '</span>';

          }
        },

        {
          // Genero
          targets: 5,
          responsivePriority: 5,
          render: function (data, type, full, meta) {
            var $audio = full['audio'];
            var $genero = "<audio controls><source src='" + $audio + "' type='audio/mpeg'>Tu navegador no soporta el elemento de audio.</audio>";
            return '<div class="text-sm-end">' + $genero + '</div>';
          }
        },
        {
          // Actions
          targets: -1,
          title: 'Actions',
          searchable: false,
          orderable: false,
          render: function (data, type, full, meta) {
            return (
              '<div class="d-flex align-items-sm-center justify-content-sm-center">' +
              '<button class="btn btn-sm btn-icon delete-record me-2"><i class="bx bx-trash"></i></button>' +
              '<button class="btn btn-sm btn-icon" data-bs-toggle="offcanvas" data-bs-target="#offcanvasEditUser" onclick="usartexto(' + full["idAudio"] + ')"><i class="bx bx-edit"></i></button>' +
              '</div>'
            );
          }
        }
      ],
      order: [2, 'desc'], //set any columns order asc/desc
      dom:
        '<"card-header d-flex flex-wrap py-0"' +
        '<"me-5 ms-n2 pe-5"f>' +
        '<"d-flex justify-content-start justify-content-md-end align-items-baseline"<"dt-action-buttons d-flex align-items-start align-items-md-center justify-content-sm-center mb-3 mb-sm-0 gap-3"lB>>' +
        '>t' +
        '<"row mx-2"' +
        '<"col-sm-12 col-md-6"i>' +
        '<"col-sm-12 col-md-6"p>' +
        '>',
      lengthMenu: [7, 10, 20, 50, 70, 100], //for length of menu
      language: {
        sLengthMenu: '_MENU_',
        search: '',
        searchPlaceholder: 'Search Category'
      },
      // Button for offcanvas
      buttons: [
        {
          text: '<i class="bx bx-plus me-0 me-sm-1"></i>Agregar Nuevo',
          className: 'add-new btn btn-primary ms-2',
          attr: {
            'data-bs-toggle': 'offcanvas',
            'data-bs-target': '#offcanvasEcommerceCategoryList'
          }
        }
      ],
      // For responsive popup
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'Details of ' + data['categories'];
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
                '<td> ' +
                col.title +
                ':' +
                '</td> ' +
                '<td class="ps-0">' +
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
        this.api()
          .columns(3)
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
    $('.dataTables_length').addClass('mt-0 mt-md-3');
    $('.dt-action-buttons').addClass('pt-0');
  }

  // Delete Record
  $('.datatables-category-list tbody').on('click', '.delete-record', function () {
    dt_category.row($(this).parents('tr')).remove().draw();
  });

  // Filter form control to default size
  // ? setTimeout used for multilingual table initialization
  setTimeout(() => {
    $('.dataTables_filter .form-control').removeClass('form-control-sm');
    $('.dataTables_length .form-select').removeClass('form-select-sm');
  }, 300);
});

function usartexto(id) {
  // Set the text ID in the placeholder
  var textoIdInput = document.getElementById('texto_id');
  textoIdInput.placeholder = id;
  textoIdInput.value = id;
  textoIdInput.readOnly = true;
}

function actionAudio(status, Audio) {
  console.log("Selected action:", status);
  console.log("Selected Audio:", Audio);


  // // Datos que quieres enviar
  // var datos = {
  //   value: value,
  //   action: "actionAudio",
  //   IdAudio: IdAudio
  // };

  // $.ajax({
  //   url: "ajax/app-users-update.php",
  //   type: "POST",
  //   contentType: "application/json",
  //   data: JSON.stringify(datos),
  //   success: function (response) {
  //     // Acciones a realizar cuando la solicitud ha tenido éxito

  //     // Obtener el valor de la variable almacenada en localStorage
  //     var verticalMenuStyle = localStorage.getItem("templateCustomizer-vertical-menu-template--Style");

  //     // Verificar si la variable tiene un valor
  //     if (verticalMenuStyle == "dark") {
  //       var backgroundColor = "#2b2c40";
  //       var Color = "#fff";
  //     } else {
  //       var backgroundColor = "#fff";
  //     }


  //     Swal.fire({
  //       icon: "success",
  //       title: "¡estado chat modificado!",
  //       text: "",
  //       color: Color,
  //       background: backgroundColor,
  //       confirmButtonText: "Aceptar"
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         window.location.reload();
  //       }
  //     });

  //   },
  //   error: function (xhr, status, error) {
  //     // Acciones a realizar en caso de error
  //     console.error("Error al hacer la solicitud:", error);
  //   }
  // });
}