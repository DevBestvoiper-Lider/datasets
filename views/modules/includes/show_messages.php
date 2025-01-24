<?php
if (isset($_SESSION['error']) || isset($_SESSION['success'])): ?>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            <?php if (isset($_SESSION['error'])): ?>
                Swal.fire({
                    icon: 'error',
                    title: '¡Oops!',
                    text: '<?= $_SESSION['error']; ?>',
                    confirmButtonText: 'Aceptar'
                });
                <?php unset($_SESSION['error']); ?>
            <?php endif; ?>

            <?php if (isset($_SESSION['success'])): ?>
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: '<?= $_SESSION['success']; ?>',
                    confirmButtonText: 'Aceptar'
                });
                <?php unset($_SESSION['success']); ?>
            <?php endif; ?>
        });
    </script>
<?php endif; ?>
