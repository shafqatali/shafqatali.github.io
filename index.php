<?php
$links = '';
$path = getcwd();
//$path = 'E:\Workplace\HTML-Work';
$folders = scandir($path);
foreach ($folders as $folder) {
    if ($folder != '..' && $folder != '.') {
        $isFolder = is_dir($folder);
        if ($isFolder) {
            $links .= '<li><a href="' . $folder . '">' . $folder . '</a></li>';
        } else {
            if ($folder == 'robots.txt' || $folder == 'index.php' || $folder == 'web.config') {
                $links .= ' ';
            } else {
                $links .= '<li><a href="' . $folder . '">' . $folder . '</a></li>';
            }
        }
    }
}
?>
<html lang="en">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;"/>
    <title>Site Links</title>

    <style type="text/css" scoped="scoped">
        body {
            font-family: sans-serif;
            font-size: 16px;
        }

        .container {
            padding: 0 15px;
            width: 1170px;
            margin: 0 auto;
        }

        .templates {
            width: 100%;
            margin: 0 0 15px;
            display: inline-block;
        }

        .templates li {
            padding: 10px 0;
            width: 30%;
            float: left;
        }

        .templates li a {
            outline: none;
            line-height: 1;
            width: auto;
            display: inline-block;
            text-decoration: none;
        }

        .templates li a.uncheck > .glyphicon {
            display: none;
        }

        @media (max-width: 640px) {
            .container {
                width: 100%;
                margin: 0 auto;
            }

            .templates li {
                margin: 10px 0;
                width: 100%;
                float: none;
            }

            .templates li a {
                font-size: 16px;
            }
        }

        @media (min-width: 641px) and (max-width: 1199px) {
            .templates li {
                margin: 10px 0;
                width: 50%;
            }

            .templates li a {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <h1>List of HTML Sites</h1>
    <ul class="templates">
        <?php echo $links ?>
    </ul>
</div>
</body>
</html>
