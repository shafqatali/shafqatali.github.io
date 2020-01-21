<?php
$online_url = "http://www.zeakis.gr/museum/xml/data.xml";
$local_file = getcwd() . '/data.xml';
$path  = $local_file;
//get xml content and parse into JSON
$fileContents = file_get_contents("" . $path);
$fileContents = str_replace(array("\n", "\r", "\t"), '', $fileContents);
$fileContents = trim(str_replace('"', "'", $fileContents));
$simpleXml = simplexml_load_string($fileContents);
$json = json_encode($simpleXml);
$dec_json = json_decode($json);
$pin_json = json_encode($dec_json->Markers);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <meta name="viewport" content="width=device-width, maximum-scale=1">
    <title>interactive-annotated-image-with-legend</title>
    <link href="css/interactive-annotated-image-with-legend-default.css" rel="stylesheet"/>
    <link href="css/interactive-annotated-image-with-legend/icomoon.css" rel="stylesheet"/>
    <script type="text/javascript">
        var pins_data = <?php echo $pin_json;?>;
    </script>
</head>
<body>

</body>
</html>


