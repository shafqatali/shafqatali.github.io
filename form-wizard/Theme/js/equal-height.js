$(function () {
    //call fallback function when page is fully loaded.
    //no need to call from setTimeout when deffered loading will be used.
    setTimeout(function () {
        equalHeightFallBack();
    }, 1000);
});

function equalHeightFallBack() {
    //check browser support flexbox or not
    //if browser supports flexbox then return from here
    var s = document.body || document.documentElement, s = s.style;
    if (s.webkitFlexWrap == '' || s.msFlexWrap == '' || s.flexWrap == '') return true;
    var $list = $('.equal-height .row');
    var $items = $list.find('>div');//get first nexted items in list
    var setHeights = function () {
        $items.css('height', 'auto');
        //get number of items to show per row
        //we can calculate number of items to show using below formula but its better to hardcode
        var perRow = Math.floor($list.width() / $items.outerWidth());
        //var perRow = 4;
        if (perRow == null || perRow < 2) return true;
        for (var i = 0, j = $items.length; i < j; i += perRow) {
            var maxHeight = 0;
            var innerHeight = 0;
            //get items that shown in each row
            var $row = $items.slice(i, i + perRow);
            $row.each(function () {
                var itemHeight = parseInt($(this).outerHeight());
                var itemInnerHeight = parseInt($(this).find('>.spotlight').outerHeight());
                if (itemHeight > maxHeight) {
                    maxHeight = itemHeight
                    innerHeight = itemInnerHeight;
                }
            });
            $row.css('height', maxHeight);
            $row.find('>.spotlight').css('height', innerHeight);
        }
    };

    setHeights();
    $(window).on('resize', setHeights);
    $list.find('img').on('load', setHeights);
}