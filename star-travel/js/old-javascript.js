function bind_page_events() {
    if ($('#slider-revolution').length) {
        $('#slider-revolution').show().revolution({
            ottedOverlay: "none",
            delay: 10000,
            startwidth: 1600,
            startheight: 650,
            hideThumbs: 200,
            thumbWidth: 100,
            thumbHeight: 50,
            thumbAmount: 5,
            simplifyAll: "off",
            navigationType: "none",
            navigationArrows: "solo",
            navigationStyle: "preview4",
            touchenabled: "on",
            onHoverStop: "on",
            nextSlideOnWindowFocus: "off",
            swipe_threshold: 0.7,
            swipe_min_touches: 1,
            drag_block_vertical: false,
            parallax: "mouse",
            parallaxBgFreeze: "on",
            parallaxLevels: [7, 4, 3, 2, 5, 4, 3, 2, 1, 0],
            keyboardNavigation: "off",
            navigationHAlign: "center",
            navigationVAlign: "bottom",
            navigationHOffset: 0,
            navigationVOffset: 20,
            soloArrowLeftHalign: "left",
            soloArrowLeftValign: "center",
            soloArrowLeftHOffset: 20,
            soloArrowLeftVOffset: 0,
            soloArrowRightHalign: "right",
            soloArrowRightValign: "center",
            soloArrowRightHOffset: 20,
            soloArrowRightVOffset: 0,
            shadow: 0,
            fullWidth: "on",
            fullScreen: "off",
            spinner: "spinner2",
            stopLoop: "off",
            stopAfterLoops: -1,
            stopAtSlide: -1,
            shuffle: "off",
            autoHeight: "off",
            forceFullWidth: "off",
            hideThumbsOnMobile: "off",
            hideNavDelayOnMobile: 1500,
            hideBulletsOnMobile: "off",
            hideArrowsOnMobile: "off",
            hideThumbsUnderResolution: 0,

            hideSliderAtLimit: 0,
            hideCaptionAtLimit: 0,
            hideAllCaptionAtLilmit: 0,
            startWithSlide: 0
        });
    }
    $(".tabs").tabs({
        active: 0,
        show: {
            effect: "fade",
            duration: 200
        },
        hide: {
            effect: "fade",
            duration: 200
        }
    });

    $('#derpartureDate').on('changeDate', function (e) {
        startDate = new Date(e.date.valueOf());
        endDate = new Date($("#returnDate").datepicker("getDate"));

        if (endDate < startDate) {
            $("#returnDate").datepicker("setDate", "");
        }
        $('#returnDate').datepicker('minDate', startDate);
    });
    //console.log("bind page events end here");
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};


function  runScript(event) {
    $(".book-now").click(function () {
        var item = $(this).data('flight');
        item = JSON.parse(item);
        this.$store.commit('detail', item);
        this.$store.commit('search', this.$route.query);
        //console.log(item);
        alert('cehck it bro');
        this.$router.push("/flight-booking");
    });
}
