<?php

// controllers
require_once 'controllers/datasets.controllers.php';
//models
require_once 'models/datasets.models.php';

?>



<div class="content-wrapper">
            <!-- Content -->

            <div class="container-xxl flex-grow-1 container-p-y">
              <h4 class="py-3 mb-4"><span class="text-muted fw-light">Datasets /</span> Lista Datasets</h4>

              <div class="app-ecommerce-category">
                <!-- Category List Table -->
                <div class="card">
                  <div class="card-datatable table-responsive">
                    <table class="datatables-category-list table border-top">
                      <thead>
                        <tr>
                          <th></th>
                          <th></th>
                          <th>Datasets</th>
                          <th class="text-nowrap text-sm-end">Genero</th>
                          <th class="text-nowrap text-sm-end">Total textos &nbsp;</th>
                          <th class="text-nowrap text-sm-end">Total audios</th>
                          <th class="text-lg-center">Actions</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
                <!-- Offcanvas to add new customer -->
                <div
                  class="offcanvas offcanvas-end"
                  tabindex="-1"
                  id="offcanvasEcommerceCategoryList"
                  aria-labelledby="offcanvasEcommerceCategoryListLabel">
                  <!-- Offcanvas Header -->
                  <div class="offcanvas-header py-4">
                    <h5 id="offcanvasEcommerceCategoryListLabel" class="offcanvas-title">Agregar Datasets</h5>
                    <button
                      type="button"
                      class="btn-close bg-label-secondary text-reset"
                      data-bs-dismiss="offcanvas"
                      aria-label="Close"></button>
                  </div>
                  <!-- Offcanvas Body -->
                  <div class="offcanvas-body border-top">
                    <form class="pt-0" id="eCommerceCategoryListForm" role="form" method="POST" enctype="multipart/form-data">
                      <!-- Title -->
                      <div class="mb-3">
                        <label class="form-label" for="ecommerce-category-title">Nombre</label>
                        <input
                          type="text"
                          class="form-control"
                          id="ecommerce-category-title"
                          placeholder="Enter category title"
                          name="nombre"
                          aria-label="category title" />
                      </div>
                     
                      <!-- Parent category -->
                      <div class="mb-3 ecommerce-select2-dropdown">
                        <label class="form-label" for="ecommerce-category-parent-category">Genero</label>
                        <select
                          id="ecommerce-category-parent-category"
                          class="select2 form-select"
                          name="genero"
                          data-placeholder="Select parent category">
                          <option value="">Selecciona un Genero</option>
                          <option value="female">Femenino</option>
                          <option value="male">Masculino</option>
                        </select>
                      </div>
                      <!-- Submit and reset -->
                      <div class="mb-3">
                      <button type="submit" class="btn btn-primary me-sm-3 me-1 data-submit">Crear</button>
                      <button type="reset" class="btn btn-label-secondary" data-bs-dismiss="offcanvas">Cancelar</button>
                      </div>

                      <?php

                      $id_user = $_SESSION['id'];
                      $crearDatasets = new ControllersDatasets();
                      $crearDatasets->ctrCrearDatasets($id_user);

                      ?>

                    </form>
                  </div>
                </div>
              </div>
            </div>
            <!-- / Content -->

            <!-- Footer -->

            <!-- / Footer -->

            <div class="content-backdrop fade"></div>
          </div>
          <!-- Content wrapper -->
        </div>
        <!-- / Layout page -->
      </div>

      <!-- Overlay -->
      <div class="layout-overlay layout-menu-toggle"></div>

      <!-- Drag Target Area To SlideIn Menu On Small Screens -->
      <div class="drag-target"></div>
    </div>

    <script>
      var id_User = <?php echo $_SESSION['id']; ?>;
    </script>