<body>
  <!-- Content -->

      <div class="container-xxl">
      <div class="authentication-wrapper authentication-basic container-p-y">
        <div class="authentication-inner">
          <!-- Register -->
          <div class="card">
            <div class="card-body">
              <!-- Logo -->
              <div class="app-brand justify-content-center">
                <a href="index.html" class="app-brand-link gap-2">
                  <span class="app-brand-logo demo">
                    <img src="assets/img/favicon/LOGOBESTVOIPER.png" width="50">
                  </span>
                  <span class="app-brand-text demo text-body fw-bold">BestVoiper</span>
                </a>
              </div>
              <!-- /Logo -->
              <h4 class="mb-2">Bienvenido a Bestcallcenter PRO! 👋</h4>
              <p class="mb-4">Inicie sesión en su cuenta y comience la aventura.</p>

              <form id="formAuthentication" class="mb-3" method="POST">
                <div class="mb-3">
                  <label for="email" class="form-label">Email O Usuario</label>
                  <input type="text" class="form-control" id="email" name="ingUsuario" placeholder="Ingresa tu Email o Usuario" autofocus />
                </div>
                <div class="mb-3 form-password-toggle">
                  <div class="d-flex justify-content-between">
                    <label class="form-label" for="password" id="password">Contraseña</label>
                    <a href="views/modules/reset-password.php">
                    <small>¿Olvidaste la contraseña?</small>
                    </a>
                  </div>
                  <div class="input-group input-group-merge">
                  <input type="password" id="password" class="form-control" name="ingPassword" placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" aria-describedby="password" />
                  <span class="input-group-text cursor-pointer"><i class="bx bx-hide"></i></span>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="remember-me" />
                    <label class="form-check-label" for="remember-me"> Remember Me </label>
                  </div>
                </div>
                <div class="mb-3">
                  <button class="btn btn-primary d-grid w-100" type="submit" id="loginForm">Iniciar sesión</button>
                </div>
              </form>

              <?php

              $login = new ControllersUsuarios();
              $login->ctrIngresoUsuario();

              ?>
            </div>
          </div>
          <!-- /Register -->
        </div>
      </div>
    </div>

    <!-- / Content -->