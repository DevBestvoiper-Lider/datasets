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
        <h4 class="py-3 mb-4"><span class="text-muted fw-light">Textos /</span> Textos Disponibles</h4>
        <div class="app-ecommerce-category">
            <!-- Category List Table -->
            <div class="card">
                <div class="card-datatable table-responsive">
                    <table class="datatables-category-list table border-top">
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th>id</th>
                                <th class="text-nowrap text-sm-end">Contenido</th>
                                <th class="text-lg-center">Actions</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
            <!-- Offcanvas to add new customer -->
            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasEcommerceCategoryList" aria-labelledby="offcanvasEcommerceCategoryListLabel">
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

    <!-- Modal -->
    <div class="modal fade" id="usarModal" tabindex="-1" aria-labelledby="usarModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="usarModalLabel">Usar Texto</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Modal body content -->
                    <form class="pt-0" id="eCommerceCategoryListForm" role="form" method="POST" enctype="multipart/form-data">
                        <!-- Title -->
                        <div class="mb-3">
                            <label class="form-label" for="ecommerce-category-title">Contenido</label>
                            <input
                                type="text"
                                class="form-control"
                                id="textoId"
                                placeholder="Enter category title"
                                name="id_texto"
                                aria-label="category title"
                                readonly></input>
                        </div>
                        <!-- Parent category -->
                        <div class="mb-3 ecommerce-select2-dropdown">
                            <label class="form-label" for="ecommerce-category-parent-category">Datasets</label>
                            <select
                                id="ecommerce-category-parent-category"
                                class="select2 form-select"
                                name="datasets"
                                data-placeholder="Select parent category">
                                <option value="">Selecciona un Datasets</option>
                                <?php
                                $valor = $_SESSION['id'];
                                $item = "usuario_id";
                                $datasets = new ControllersDatasets();
                                $data_datasets = $datasets->ctrMostrarDatasets($item, $valor);
                                foreach($data_datasets as $dataset){
                                    echo '<option value="'.$dataset['id'].'">'.$dataset['nombre'].'</option>';
                                }
                                ?>
                            </select>
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
                <!-- <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary">Guardar cambios</button>
                </div> -->
            </div>
        </div>
    </div>
    <!-- / Modal -->

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

<!-- Overlay -->
<div class="layout-overlay layout-menu-toggle"></div>

<!-- Drag Target Area To SlideIn Menu On Small Screens -->
<div class="drag-target"></div>
</div>

<script>
    var id_datasets = <?php echo $_GET['id_datasets']; ?>;
</script>