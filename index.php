<?php
$title = "Color Palette Generator";

require 'config.php';
require 'src/ColorPalette.php';

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- style & fonts -->
    <link rel="stylesheet" href="<?= APP_PATH ?>style.css">
    <link rel="stylesheet" href="<?= APP_PATH ?>lib/fonts/montserrat/montserrat.css">
    <title><?= $title ?></title>
</head>

<body>
    <div class="title-container">
        <h1><?= $title ?></h1>
    </div>
    <?php

    new ColorPalette(5)

    ?>
    <!-- font awesome -->
    <link rel="stylesheet" href="<?= APP_PATH ?>lib/fonts/font-awesome/all.css">
</body>

</html>