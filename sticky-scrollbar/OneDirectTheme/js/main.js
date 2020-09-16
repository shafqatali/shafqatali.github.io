// sidebar to be fixed on scroll
enquire.register("screen and (min-width: 768px)", {
    match: function () {
        console.log('desktop');
        //JS for desktop only handling here
        $(document).ready(function () {
            if ($('#GreenNav').length) {
                var affixWidth = 0;
                var affixLeft = 0;
                affixWidth = $('#GreenNav').outerWidth();
                affixLeft = $('#GreenNav').offset().left;
                console.log('affixWidth:' + affixWidth + ' affixLeft:' + affixLeft);
                $('#GreenNav').on('affixed.bs.affix', function () {
                    $('#GreenNav').css('left', affixLeft);
                    $('#GreenNav').css('width', affixWidth);
                    $('#GreenNav').css('top', '30px');
                });
                $('#GreenNav').on('affix-top.bs.affix', function () {
                    $('#GreenNav').removeAttr('style');
                });
            }
        });
    },
    unmatch: function () {
        console.log('mobile');
        //JS for mobile only handling here
    }
});