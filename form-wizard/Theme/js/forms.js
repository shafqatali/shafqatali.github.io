window.onload = function () {

    if ($('#Hide-1').length > 0) {
        var newId = (2 + Math.random()).toString(36).substring(7);
        $("#Hide-1").attr("id", newId);
    }


};