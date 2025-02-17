<?php
if (isset($_GET['genero'])) {
    $genero = $_GET['genero'];
    $id_user = $_SESSION["id"];
    $id_datasets = $_GET['id_datasets'];
} else {
    $genero = null;
    $id_user = null;
    $id_datasets = null;
}

// controllers
require_once 'controllers/datasets.controllers.php';
//models
require_once 'models/datasets.models.php';

?>



<div class="content-wrapper">
            <!-- Content -->

            <div class="container-xxl flex-grow-1 container-p-y">
              <h4 class="py-3 mb-4"><span class="text-muted fw-light">Datasets /</span> Contenido Datasets</h4>

              <div class="app-ecommerce-category">
                <!-- Category List Table -->
                <div class="card">
                  <div class="card-datatable table-responsive">
                    <table class="datatables-category-list table border-top">
                      <thead>
                        <tr>
                          <th></th>
                          <th></th>
                          <th>Id</th>
                          <th>Texto</th>
                          <th>Status</th>
                          <th class="text-nowrap text-sm-end">Audio</th>
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
                        <label class="form-label" for="ecommerce-category-title">Contenido</label>
                        <textarea
                          type="textarea"
                          class="form-control"
                          id="ecommerce-category-title"
                          placeholder="Enter category title"
                          name="contenido"
                          aria-label="category title"></textarea>
                      </div>
                     
                      <!-- Parent category -->
                      <div class="mb-3 ecommerce-select2-dropdown">
                        <label class="form-label" for="ecommerce-category-parent-category">Selecciona un audio: </label>
                        <input type="file" class="form-control" name="archivo" id="archivo" required>
                      </div>
                      <!-- Submit and reset -->
                      <div class="mb-3">
                      <button type="submit" class="btn btn-primary me-sm-3 me-1 data-submit">Crear</button>
                      <button type="reset" class="btn btn-label-secondary" data-bs-dismiss="offcanvas">Cancelar</button>
                      </div>

                      <?php

                      $crearDatasets = new ControllersDatasets();
                      $crearDatasets->ctrSubirContenidoDatasets($genero, $id_user, $id_datasets);

                      ?>

                    </form>
                  </div>
                </div>
              </div>
            </div>
            <!-- / Content -->

            <!-- Footer -->
            <footer class="content-footer footer bg-footer-theme">
              <div class="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
                <div class="mb-2 mb-md-0">
                  ©
                  <script>
                    document.write(new Date().getFullYear());
                  </script>
                  , made with ❤️ by
                  <a href="https://themeselection.com" target="_blank" class="footer-link fw-medium">ThemeSelection</a>
                </div>
                <div class="d-none d-lg-inline-block">
                  <a href="https://themeselection.com/license/" class="footer-link me-4" target="_blank">License</a>
                  <a href="https://themeselection.com/" target="_blank" class="footer-link me-4">More Themes</a>

                  <a
                    href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/documentation/"
                    target="_blank"
                    class="footer-link me-4"
                    >Documentation</a
                  >

                  <a
                    href="https://themeselection.com/support/"
                    target="_blank"
                    class="footer-link d-none d-sm-inline-block"
                    >Support</a
                  >
                </div>
              </div>
            </footer>
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
      var id_datasets = <?php echo $_GET['id_datasets']; ?>;
    </script>


  <!-- Offcanvas to add new user -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasEditUser" aria-labelledby="offcanvasEditUserLabel">
    <div class="offcanvas-header">
      <h5 id="offcanvasAddUserLabel" class="offcanvas-title">Editar Frase</h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body mx-0">
      <form class="add-new-user pt-0" id="editAudioForm" role="form" method="POST" enctype="multipart/form-data">
        <div class="mb-3">
          <input type="text" id="texto_id" class="form-control" placeholder="" name="idAudio" aria-label="Id Texto">
          <label class="form-label" for="add-user-fullname">Observacion</label>
          <textarea class="form-control" id="add-user-fullname" placeholder="Observacion..." name="observacion" aria-label="Observacion"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label" for="Accion">Accion</label>
          <select id="Accion" name="status" class="select2 form-select">
            <option value="">Seleccionar</option>
            <option value="1">Aprobar</option>
            <option value="2">Desaprobar</option>
          </select>
        </div>
        <div class="mb-3">
            <button type="submit" class="btn btn-primary me-sm-3 me-1 data-submit">Guardar</button>
            <button type="reset" class="btn btn-label-secondary" data-bs-dismiss="offcanvas">Cancelar</button>
        </div>
      
        <?php
          $editarTexto = new ControllersDatasets();
          $editarTexto->ctrSubirObservacionAudio($id_datasets, $genero);
        ?>
      
      </form>
    </div>
  </div>