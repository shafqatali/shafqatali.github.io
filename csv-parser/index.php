<?php
define("HOST", "localhost");
define("U_Name", "root");
define("U_Pass", "");
define("Db_Name", "test-db");
define("Table_Name", "services");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <title>CSV Parser</title>
    <meta name="viewport" content="width=device-width, maximum-scale=1">
    <link rel="stylesheet" href="css/bootstrap.min.css">
</head>
<body>
<header>
    <div class="container">
        <h1>Parse CSV to Array</h1>
    </div>
</header>
<main class="container" style="height: 100vh;">
    <form method="post" enctype="multipart/form-data"  accept-charset="utf-8">
        <div class="form-group">
            <div class="custom-file">
                <input type="file" class="custom-file-input" name="csv_file" id="csv_file" required>
                <label class="custom-file-label" for="csv_file">Choose CSV file</label>
            </div>
        </div>
        <div class="form-group">
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" name="head_row" id="head_row" checked="checked">
                <label class="custom-control-label" for="head_row">Uncheck if the first row is not a header?</label>
            </div>
        </div>
        <div class="form-group">
            <input type="submit" class="btn btn-primary" value="Upload CSV" name="submit_file">
        </div>
        <?php
        $result = '';
        function exec_query($sql, $multi = false) {
            $conn = new mysqli(HOST, U_Name, U_Pass, Db_Name);
            if ($conn->connect_error) {
                $result = "<p class='alert alert-danger'>Connection failed".$conn->connect_error."</p>";
                //die("Connection failed: " . $conn->connect_error);
            }
            $conn->set_charset("utf8");
            $r = $multi ? $conn->multi_query($sql) : $conn->query($sql);
            if ($r === TRUE) {
                $outPut = true;
            } else {
                $outPut = "Error: " . $sql . "<br>" . $conn->error;
            }
            $conn->close();
            return $outPut;
        }

        function getDataFromCSV($fileName, $hasHeader){
            $lines = [];
            if (($handle = fopen("".$fileName, "r")) !== FALSE) {
                while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
                    array_push($lines, $data);
                }
                fclose($handle);
            }
            if($hasHeader){
                array_shift($lines);
            }
            return $lines;
        }

        function parseCSVData($data) {
            $numberOfColumns = 80;
            $mqs = '';
            $rows = count($data);
            for ($r = 0; $r < $rows; $r++) {
                $sql = '';
                $row = $data[$r];
                $cells = count($row);
                for ($c = 0; $c < $numberOfColumns; $c++) {
                    $sql.= ($c < $cells) ? "'" . $row[$c] . "'," : '"",';
                }
                $values = rtrim($sql, ',');
                $mqs.= "INSERT INTO " . Table_Name . " VALUES (" . $values . ");";
            }
            return true;
            //return exec_query("" . $mqs, true);
        }

        function html_table($data = array())
        {
            $rows = array();
            foreach ($data as $row) {
                $cells = array();
                foreach ($row as $cell) {
                    $cells[] = "<td>{$cell}</td>";
                }
                $rows[] = "<tr>" . implode('', $cells) . "</tr>";
            }
            return "<table class='table table-bordered table-striped'>" . implode('', $rows) . "</table>";
        }

        if (isset($_POST["submit_file"])) {
            try {
                $fileName = $_FILES["csv_file"]["tmp_name"];
                $hasHeading = isset($_POST['head_row']) ? $_POST['head_row'] : false;

                $lines = getDataFromCSV("" . $fileName, $hasHeading);
                $total = count($lines);

                if ($total > 0) {
                    $result = "<p class='alert alert-success'>" . $total . " rows added into the table.</p>";
                    echo html_table($lines);
                    /*//truncate table
                    $out = exec_query("TRUNCATE TABLE " . Table_Name);
                    if($out){
                        $added = parseCSVData($lines);
                        if($added){
                            $result = "<p class='alert alert-success'>" . $total . " rows added into the table.</p>";
                            echo '<pre>';
                            print_r($lines);
                            echo '</pre>';
                            echo html_table($lines);
                        }
                        else {
                            $result = "<p class='alert alert-danger'>An error occurred while adding new records: " . $out . "</p>";
                        }
                    }else {
                        $result = "<p class='alert alert-danger'>Can't Truncate Table." . $out . "</p>";
                    }*/
                } else {
                    $result = "<p class='alert alert-danger'>No record found in CSV file.</p>";
                }
            } catch (Exception $e) {
                $result = "<p class='alert alert-danger'>An error occurred: " . $e->getMessage() . "</p>";
            }
        }
        echo $result;
        ?>
    </form>
</main>
<footer>
    <div class="container">
        <div class="text-center">&copy; 2020</div>
    </div>
</footer>
</body>
</html>
