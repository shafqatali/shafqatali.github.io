$(function () {
    //each quantity div should have unique Id
    $(".quantity .btn-plain").click(function () {
        var objId = $(this).parent(".quantity").attr("id");
        var objValue = parseInt($("#" + objId + " .text").text());
        var newValue;
        if($(this).hasClass('minus')){
            newValue = objValue - 1;
        }else {
            newValue = objValue + 1;
        }
        if (newValue > 0 && newValue < 10) {
            newValue = "0" + newValue;
        }
        if (newValue > 0) {
            $("#" + objId + " .text").text(newValue);
        }
    });
});