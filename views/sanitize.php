<?php
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    } else {
        return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
    }
}

$_GET = sanitizeInput($_GET);
$_POST = sanitizeInput($_POST);