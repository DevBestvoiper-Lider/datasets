<?php
// echo $_POST['fechainicio'];
// echo $_POST['fechafin'];
// print_r($_POST['colas']);

// Verificar si se ha hecho clic en el botón de exportar tabla
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['accion']) && $_POST['accion'] == 'exportar_tabla') {
    // Incluir la librería PhpSpreadsheet
    require_once getenv('PROJECT_ROOT') . '/vendor/autoload.php';

    // Crear un nuevo objeto Spreadsheet
    $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();

    // Seleccionar la hoja activa
    $sheet = $spreadsheet->getActiveSheet();

    // Obtener los datos del formulario o de la base de datos
    // $dataArray2 = ControllersCtrlLog::ctrObtenerDatosTabla(null, null); // Ajusta según tu lógica para obtener los datos

    // Definir los datos de la cabecera
    $headerData = array('Agente', 'Ultimo Logueo', 'Ultimo Deslogueo', 'T. de Sesión', 'Logueado', 'En Pausas', 'Tiempo en gestion', 'Hablando', 'Prom. Hablando', 'Tiempo Libre');

    // Agregar los nombres de otros campos a la cabecera
    // $headerData = array_merge($headerData, array('Campo1', 'Campo2', 'Campo3', /* ... otros campos ... */));

    $sheet->getStyle('A1:Z1')->getFont()->setName('Tahoma'); // Ajusta 'Z' según la cantidad de campos
    // Establecer la cabecera en la hoja de cálculo
    $sheet->fromArray([$headerData], NULL, 'A1');

    // Obtener los datos del formulario o de la base de datos
    $sumTiempoTotalPorAgente = [];
    $countLlamadasPorAgente = [];

    // foreach ($timeHablando as $hablando) {
    //     $agenteId = $hablando['agent'];

    //     // Verificar si ya existe un registro para el agente
    //     if (!isset($HablandoPorAgente[$agenteId])) {
    //         $HablandoPorAgente[$agenteId] = array(
    //             'agente' => $agenteId,
    //             'tiempoTotal' => 0,
    //             'llamadasCount' => 0,
    //             'promedioTiempo' => 0, // Nueva clave para almacenar el promedio
    //         );
    //     }

    //     // Calcular el tiempo total de habla para el agente si las fechas no son NULL
    //     if (isset($hablando['calltime'])) {
    //         $HablandoPorAgente[$agenteId]['tiempoTotal'] += $hablando['calltime'];
    //         $HablandoPorAgente[$agenteId]['llamadasCount']++;

    //         // Actualizar la suma total y la cantidad de veces para el agente
    //         if (!isset($sumTiempoTotalPorAgente[$agenteId])) {
    //             $sumTiempoTotalPorAgente[$agenteId] = 0;
    //         }
    //         if (!isset($countLlamadasPorAgente[$agenteId])) {
    //             $countLlamadasPorAgente[$agenteId] = 0;
    //         }

    //         $sumTiempoTotalPorAgente[$agenteId] += $hablando['calltime'];
    //         $countLlamadasPorAgente[$agenteId]++;

    //         // Calcular y actualizar el promedio en el array principal
    //         $HablandoPorAgente[$agenteId]['promedioTiempo'] = ($countLlamadasPorAgente[$agenteId] > 0) ? ($sumTiempoTotalPorAgente[$agenteId] / $countLlamadasPorAgente[$agenteId]) : 0;
    //     }
    // }

    // ...

    foreach ($dataArray2 as $index => $row) {
        // Lógica para obtener los datos de cada fila
        $agente = $row['agente'];

        $agenteEncontrado = false;

        foreach ($agenteData as $agenteId => $row2) {
            if ($agente == $agenteId) {
                $agenteEncontrado = true;

                $datelogin = intval($row2['primer_login']);
                $datelogoff = intval($row2['ultimo_logoff']);

                // Calcular el "Tiempo de Sesión"
                $tiempoSesion = '0'; // Ajusta según tu lógica para calcular el tiempo de sesión

                // Obtener el tiempo total de logueo para el agente actual
                $tiempoTotalLogueo = isset($tiempoLogueoTotal[$agenteId]) ? $tiempoLogueoTotal[$agenteId] : 0;

                // Calcular horas, minutos y segundos para el tiempo total de logueo
                $horasLogueo = floor($tiempoTotalLogueo / 3600);
                $minutosLogueo = floor(($tiempoTotalLogueo % 3600) / 60);
                $segundosLogueo = $tiempoTotalLogueo % 60;

                // Formatear el tiempo total de logueo
                $tiempoTotalLogueoFormatted = sprintf('%02d:%02d:%02d', $horasLogueo, $minutosLogueo, $segundosLogueo);


                $ultimoLogueo = isset($datelogin) ? date('Y-m-d H:i:s', $datelogin) : 'Fecha no válida';
                $ultimoDeslogueo = ($datelogoff > 0) ? date('Y-m-d H:i:s', $datelogoff) : 'logueado';
            }
        }

        // Si el agente no se encuentra en $agenteData, asignar valores predeterminados
        if (!$agenteEncontrado) {
            $ultimoLogueo = 'Nunca se Logueó';
            $ultimoDeslogueo = '';
            $tiempoSesion = '0'; // O cualquier otro valor predeterminado
            $tiempoTotalLogueo = 0; // O cualquier otro valor predeterminado
            // Otros campos...
        }

        // Obtener el tiempo total de pausas para el agente actual
        $tiempoTotalPausas = isset($pausasPorAgente[$agente]['tiempoTotal']) ? $pausasPorAgente[$agente]['tiempoTotal'] : 0;

        // Calcular horas, minutos y segundos para el tiempo total de pausas
        $horasPausas = floor($tiempoTotalPausas / 3600);
        $minutosPausas = floor(($tiempoTotalPausas % 3600) / 60);
        $segundosPausas = $tiempoTotalPausas % 60;

        // Formatear el tiempo total de pausas
        $tiempoTotalPausasFormatted = sprintf('%02d:%02d:%02d', $horasPausas, $minutosPausas, $segundosPausas);

        // Calcular el tiempo en gestión para el agente actual
        $tiempoEnGestion = ($tiempoTotalPausas - $tiempoLogueoTotal[$agente]);

        // Calcular horas, minutos y segundos para el tiempo en gestión
        $horasGestion = floor(abs($tiempoEnGestion) / 3600);
        $minutosGestion = floor((abs($tiempoEnGestion) % 3600) / 60);
        $segundosGestion = abs($tiempoEnGestion) % 60;

        // Formatear el tiempo en gestión
        $tiempoEnGestionFormatted = sprintf('%02d:%02d:%02d', $horasGestion, $minutosGestion, $segundosGestion);

        // Obtener el tiempo total hablando para el agente actual
        foreach ($HablandoPorAgente as $agenteId => $tiempoTotal) {
            if ($row['nombre'] == $agenteId) {
                // Obtener el tiempo total de pausas para el agente actual
                $agenteEncontrado = true;

                if (isset($HablandoPorAgente[$row['nombre']])) {
                    $tiempoTotalHablando = $HablandoPorAgente[$row['nombre']]['tiempoTotal'];

                    // Calcular horas, minutos y segundos
                    $horasHablando = floor($tiempoTotalHablando / 3600);
                    $minutosHablando = floor(($tiempoTotalHablando % 3600) / 60);
                    $segundosHablando = $tiempoTotalHablando % 60;

                    // Formatear tiempo total de pausas
                    $tiempoTotalHablandoFormatted = sprintf('%02d:%02d:%02d', $horasHablando, $minutosHablando, $segundosHablando);

                    if ($HablandoPorAgente[$row['nombre']]['tiempoTotal'] == 0) {
                    } else {
                        // Formatear el promedio de tiempo hablando (entero)
                        $promedioTiempoHablando = $HablandoPorAgente[$row['nombre']]['promedioTiempo'];
                        $promedioTiempoHablando = intval($promedioTiempoHablando);
                        $promedioTiempoFormatted = sprintf('%02d:%02d:%02d', floor($promedioTiempoHablando / 3600), floor(($promedioTiempoHablando % 3600) / 60), $promedioTiempoHablando % 60);
                    }
                }
            }
        }

        // Obtener el tiempo libre para el agente actual
        $tiempoLibre = $tiempoEnGestion - $tiempoTotalHablando;

        // Calcular horas, minutos y segundos para el tiempo libre
        $horasLibre = floor(abs($tiempoLibre) / 3600);
        $minutosLibre = floor((abs($tiempoLibre) % 3600) / 60);
        $segundosLibre = abs($tiempoLibre) % 60;

        // Formatear el tiempo libre
        $tiempoLibreFormatted = sprintf('%02d:%02d:%02d', $horasLibre, $minutosLibre, $segundosLibre);

        // Si el agente no se encuentra en $agenteData, asignar valores predeterminados
        if (!$agenteEncontrado) {
            $dateloginFormatted = 'NN';
            $datelogoffFormatted = '';
            $tiempoSesion = '0'; // O cualquier otro valor predeterminado
            $tiempoTotalLogueoFormatted = 0; // O cualquier otro valor predeterminado
            $tiempoTotalPausasFormatted = '00:00:00';
            $tiempoEnGestionFormatted = '00:00:00';
            $tiempoTotalHablandoFormatted = '00:00:00';
            $promedioTiempoFormatted = '00:00:00';
            $tiempoLibreFormatted = '00:00:00';
        }

        // Añadir los datos a la hoja de cálculo
        $sheet->fromArray([$agente, $ultimoLogueo, $ultimoDeslogueo, $tiempoSesion, $tiempoTotalLogueoFormatted, $tiempoTotalPausasFormatted, $tiempoEnGestionFormatted, $tiempoTotalHablandoFormatted, $promedioTiempoFormatted, $tiempoLibreFormatted], NULL, 'A' . ($index + 2));
    }

    // Crear un objeto Writer
    $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);

    // Establecer el delimitador como punto y coma
    // $writer->setDelimiter(';');

    // Guardar el archivo CSV en el sistema de archivos
    $filename = 'control_logs.xlsx';
    $writer->save($filename);

    // Crear un archivo ZIP
    $zip = new ZipArchive();
    $zipFilename = 'control_logs.zip';
    $zip->open($zipFilename, ZipArchive::CREATE);

    // Agregar el archivo CSV al ZIP
    $zip->addFile($filename, 'control_logs.xlsx');

    // Cerrar el ZIP
    $zip->close();

    // Descargar el archivo ZIP
    header('Content-Type: application/zip');
    header('Content-Disposition: attachment;filename="' . $zipFilename . '"');
    header('Cache-Control: max-age=0');
    readfile($zipFilename);

    // Finaliza el script para evitar que se muestre el HTML
    exit();
}


// foreach ($dataArray2 as $index => $row) {
//     // Lógica para obtener los datos de cada fila
//     $agente = $row['agente'];

//     $agenteEncontrado = false;

//     foreach ($agenteData as $agenteId => $row2) {
//         if ($agente == $agenteId) {
//             $agenteEncontrado = true;

//             $datelogin = intval($row2['primer_login']);
//             $datelogoff = intval($row2['ultimo_logoff']);

//             // Calcular el "Tiempo de Sesión"
//             $tiempoSesion = '0'; // Ajusta según tu lógica para calcular el tiempo de sesión

//             // Calcular el tiempo total de logueo
//             $tiempoTotalLogueo = ($datelogoff > 0) ? ($datelogoff - $datelogin) : 0;

//             $ultimoLogueo = isset($datelogin) ? date('Y-m-d H:i:s', $datelogin) : 'Fecha no válida';
//             $ultimoDeslogueo = ($datelogoff > 0) ? date('Y-m-d H:i:s', $datelogoff) : 'logueado';
//         }
//     }

//     // Si el agente no se encuentra en $agenteData, asignar valores predeterminados
//     if (!$agenteEncontrado) {
//         $ultimoLogueo = 'Nunca se Logueo';
//         $ultimoDeslogueo = '';
//         $tiempoSesion = '0'; // O cualquier otro valor predeterminado
//         $tiempoTotalLogueo = 0; // O cualquier otro valor predeterminado
//         // Otros campos...
//     }

//     // Añadir los datos a la hoja de cálculo
//     $sheet->fromArray([
//         $agente,
//         $ultimoLogueo,
//         $ultimoDeslogueo,
//         $tiempoSesion,
//         gmdate('H:i:s', $tiempoTotalLogueo),
//         '00:00:00', // Tiempo total de pausas
//         '00:00:00', // Tiempo en gestión
//         '00:00:00', // Tiempo total hablando
//         '00:00:00', // Promedio de tiempo hablando
//         '00:00:00'  // Tiempo libre
//     ], NULL, 'A' . ($index + 2));
// }
