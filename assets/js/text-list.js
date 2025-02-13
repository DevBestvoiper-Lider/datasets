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
    var dt_category_list_table = $('.datatables-category-list');

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
                url: 'ajax/list-text-for-datasets.php' // JSON file or API endpoint
            }, // JSON file to add data
            columns: [
                // columns according to JSON
                { data: '' },
                { data: 'id' },
                { data: '' },
                { data: 'contenido' },
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
                        var $name = full['id'];

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
                    // content
                    targets: 3,
                    responsivePriority: 3,
                    render: function (data, type, full, meta) {
                        var $content = full['contenido'];
                        return '<div class="text-sm-end">' + $content + '</div>';
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
                            '<button class="btn btn-sm btn-icon" onclick="usar(' + full['id'] + ');"><i class="bx bx-edit"></i></button>' +
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
                    // text: '<i class="bx bx-plus me-0 me-sm-1"></i>Agregar Nuevo',
                    // className: 'add-new btn btn-primary ms-2',
                    // attr: {
                    //     'data-bs-toggle': 'offcanvas',
                    //     'data-bs-target': '#offcanvasEcommerceCategoryList'
                    // }
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

function usar(id) {
    // Set the text ID in the placeholder
    var textoIdInput = document.getElementById('textoId');
    textoIdInput.placeholder = id;
    textoIdInput.value = id;
    textoIdInput.readOnly = true;
    // Open the modal
    var usarModal = new bootstrap.Modal(document.getElementById('usarModal'), {
        backdrop: true
    });
    usarModal.show();
}

$(document).ready(function () {
    $('#usarModalForm').on('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        var formData = new FormData(this);

        // Log form data for debugging
        for (var pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        $.ajax({
            url: 'ajax/postDatasets.ajax.php', // Update with the actual PHP handler path
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var res = JSON.parse(response);
                if (res.status === "success") {
                    Swal.fire({
                        icon: 'success',
                        title: res.message,
                        showConfirmButton: true,
                        confirmButtonText: 'Cerrar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            var usarModal = bootstrap.Modal.getInstance(document.getElementById('usarModal'));
                            usarModal.hide(); // Close the modal
                            $('#usarModalForm')[0].reset(); // Clear the form
                            window.location = 'list-text';
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: res.message,
                        showConfirmButton: true,
                        confirmButtonText: 'Cerrar'
                    });
                }
            },
            error: function (xhr, status, error) {
                // Handle any errors
                Swal.fire({
                    icon: 'error',
                    title: 'Error al subir el contenido.',
                    showConfirmButton: true,
                    confirmButtonText: 'Cerrar'
                });
            }
        });
    });
});