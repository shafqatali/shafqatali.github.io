<?php
//first include an external class.
require('class.pdf2text.php');
extract($_POST);
if(isset($readpdf))
{
    //check the types of file
    if($_FILES['file']['type']=="application/pdf")
    {
        $a = new PDF2Text();
        $a->setFilename($_FILES['file']['tmp_name']);
        $a->decodePDF();
        echo $a->output();
    }
    //if file types is not pdf
    else
    {
        echo "<p style='color:red;text-align:center'>Wrong file format </p>";
    }
}

?>
<html>
<head>
    <title>Read pdf php</title>
</head>
<form method="post" enctype="multipart/form-data">
    <table align="center" border="1" bgcolor="#CCCCCC">
        <Tr>
            <td>Choose Your File</td>
            <td><input type="file" name="file"/></td>
        </Tr>
        <tr>
            <td align="center" colspan="2"><input type="submit" value="Read PDF" name="readpdf"/></td>
        </tr>
    </table>
</form>
</html>
