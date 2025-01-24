<!-- Footer -->
<footer class="content-footer footer bg-footer-theme">
   
<script>
        document.addEventListener("DOMContentLoaded", function () {
            localStorage.removeItem("divTop");
            localStorage.removeItem("divLeft");
            localStorage.removeItem("floatingMenuVisible");

            loadCoordinates();

            let limitTop, limitLeft, limitBottom, limitRight;

            function updateLimits() {
                if (window.innerWidth <= 700) {
                    limitTop = -500;
                    limitLeft = -500;
                    limitBottom = -100;
                    limitRight = -100;
                } else {
                    limitTop = -700;
                    limitLeft = -1200;
                    limitBottom = -300;
                    limitRight = -300;
                }
            }
            updateLimits();
            window.addEventListener('resize', updateLimits);

            const div = document.getElementById("div");
            const initialPos = {
                top: div.offsetTop,
                left: div.offsetLeft
            };

            dragElement(div, initialPos, limitTop, limitLeft, limitBottom, limitRight);

            const floatingButton = document.querySelector('.floatingButton');
            const floatingMenu = document.getElementById('div');

            const menuVisible = localStorage.getItem('floatingMenuVisible');
            if (menuVisible === 'true') {
                floatingMenu.style.display = 'block';
            } else {
                floatingMenu.style.display = 'none';
            }

            floatingButton.addEventListener('click', function (e) {
                e.preventDefault();
                if (floatingMenu.style.display === 'none' || floatingMenu.style.display === '') {
                    floatingMenu.style.display = 'block';
                    localStorage.setItem('floatingMenuVisible', 'true');
                } else {
                    floatingMenu.style.display = 'none';
                    localStorage.setItem('floatingMenuVisible', 'false');
                }
            });

            const resetButton = document.getElementById('resetButton');
            resetButton.addEventListener('click', function () {
                resetPosition(div, initialPos);
            });
        });

        function dragElement(elmnt, initialPos, limitTop, limitLeft, limitBottom, limitRight) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            if (document.getElementById(elmnt.id + "header")) {
                document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
            } else {
                elmnt.onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                let newTop = elmnt.offsetTop - pos2;
                let newLeft = elmnt.offsetLeft - pos1;

                if (newTop < initialPos.top + limitTop) {
                    newTop = initialPos.top + limitTop;
                } else if (newTop > initialPos.top + limitBottom) {
                    newTop = initialPos.top + limitBottom;
                }

                if (newLeft < initialPos.left + limitLeft) {
                    newLeft = initialPos.left + limitLeft;
                } else if (newLeft > initialPos.left + limitRight) {
                    newLeft = initialPos.left + limitRight;
                }

                elmnt.style.top = newTop + "px";
                elmnt.style.left = newLeft + "px";

                updateCoordinates(elmnt);
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        function updateCoordinates(elmnt) {
            var posTop = elmnt.offsetTop;
            var posLeft = elmnt.offsetLeft;

            var posCoordinatesElement = document.getElementById("posCoordinates");
            if (posCoordinatesElement) {
                posCoordinatesElement.innerHTML = "Top: " + posTop + "px, Left: " + posLeft + "px";
            }

            localStorage.setItem("divTop", posTop);
            localStorage.setItem("divLeft", posLeft);
        }

        function loadCoordinates() {
            var storedTop = localStorage.getItem("divTop");
            var storedLeft = localStorage.getItem("divLeft");

            if (storedTop !== null && storedLeft !== null) {
                var div = document.getElementById("div");
                div.style.top = storedTop + "px";
                div.style.left = storedLeft + "px";

                var posCoordinatesElement = document.getElementById("posCoordinates");
                if (posCoordinatesElement) {
                    posCoordinatesElement.innerHTML = "Top: " + storedTop + "px, Left: " + storedLeft + "px";
                }
            }
        }

        function resetPosition(elmnt) {
            const resetTop = -408;
            const resetLeft = -300;

            elmnt.style.top = resetTop + "px";
            elmnt.style.left = resetLeft + "px";

            updateCoordinates(elmnt);
        }
    </script>


<?php

// session_start();
// Contenido específico para la vista de chat si $_SESSION["in_chat_view"] es verdadero
if (isset($_GET["ruta"]) and $_GET["ruta"] !== "app-chat") {

    $_SESSION["in_chat_view"] = false;

    if ($_SESSION["perfil"] === "Asesor") {

        if (isset($popupactivo) && $popupactivo) {
            if ($popupactivo == "s") {
                $ruta = "ajax/embPOPUP.php";
                $ext = $_SESSION["exten"]; ?>
                <script>
                    TraerDatos("<?php echo $ruta; ?>", "ext=<?php echo $ext . "&User=" . $usuario; ?>&emb=s", "POST", "embPopup");
                    var Funcion1 = "TraerDatos(\"<?php echo $ruta; ?>\", \"ext=";
                    Funcion1 += "<?php echo $ext . "&User=" . $usuario; ?>" + "&emb=s\", \"POST\", \"embPopup\", 66);";
                    // console.log(Funcion1);
                    setInterval(Funcion1, 3000);
                </script>
            <?php
            }
        }
        if (isset($softphone)) {
            
            // Comprobamos si el valor de $softphone es "s"
            if ($softphone === "s") { ?>
           
              
                
           <div class="floatingButtonWrap">
        <!-- Botón para resetear la posición -->
        <button id="resetButton" style="padding: 10px; margin-right:80px; border-radius: 50%; border: 1px solid #7db443">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: #7db443;transform: ;msFilter:;"><path d="m12 17 1-2V9.858c1.721-.447 3-2 3-3.858 0-2.206-1.794-4-4-4S8 3.794 8 6c0 1.858 1.279 3.411 3 3.858V15l1 2z"></path><path d="m16.267 10.563-.533 1.928C18.325 13.207 20 14.584 20 16c0 1.892-3.285 4-8 4s-8-2.108-8-4c0-1.416 1.675-2.793 4.267-3.51l-.533-1.928C4.197 11.54 2 13.623 2 16c0 3.364 4.393 6 10 6s10-2.636 10-6c0-2.377-2.197-4.46-5.733-5.437z"></path></svg>
        </button>

        <!-- Indicador de coordenadas -->
      

        <div class="floatingButtonInner">
            <!-- Botón flotante (ícono del teléfono) -->
            <a class="floatingButton">
                <img src="assets/phone/images/phone.svg" class="icon-default" alt="Phone Icon">
            </a>

            <!-- Menú flotante -->
            <ul class="floatingMenu" id="div">
                <!--<div style="width: 200px; background:#7db443; color:white;border-radius:10px; padding:5px">
                    <strong>Coordenadas:</strong>
                    <br/>
                    <span id="posCoordinates">Top: , Left: </span>
                    
                </div>-->
                <li>
                    <?php include_once "phone.php"; ?>
                </li>
            </ul>
        </div>
    </div>
                    
                
                </div>
            <?php
            }
        }
    }
} else {
    $_SESSION["in_chat_view"] = true;
}
?>

    <div class="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
        <div class="mb-2 mb-md-0">
            <script>
                document.write(new Date().getFullYear());
            </script>
            ©
            <a href="https://bestvoiper.com.co" target="_blank" class="footer-link fw-medium">BestVoiper</a>
        </div>
    </div>
</footer>