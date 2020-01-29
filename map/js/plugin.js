var forIpad = false;

function bind_maps() {
    var count = 0;
    $('.pin-details').hide().removeClass('d-none');
    $('.annotated-wrapper').each(function () {
        count += 1;
        var wrapperId = $(this).attr("id");
        var filter = $('#' + wrapperId + ' .map-pins').attr("data-filter") == "yes";
        var criteria = $('#' + wrapperId + ' .map-pins').attr("data-match");
        drawPins(wrapperId, count, filter, criteria);
    });

    //bind tooltips
    $('.annotated-bg [data-toggle="tooltip"]').tooltip();
    $('body').tooltip({
        selector: '[data-toggle=tooltip]'
    });

    //bind pin filter
    $(document).on('click', '.filter-box input', function () {
        var wrapperId = $(this).parents('.annotated-wrapper').attr("id");
        var typeClass = $(this).val();
        $('#' + wrapperId + ' .map-pins span.' + typeClass).fadeToggle();
    });

    //bind click event for map pins
    $('.map-pins span').click(function () {
        var wrapperId = $(this).attr("data-parent");
        $('#' + wrapperId + ' .pin-details').hide();
        $('#' + wrapperId + ' .type').removeClass('thermal').removeClass('hydro').removeClass('wind').removeClass('pumped').removeClass('biomass').removeClass(' storage');
        var dHref = $(this).attr('data-href');
        if (dHref.length > 0 && dHref != '#') {
            fetchPinData(wrapperId, dHref.replace('#', ''), $(this).attr('class'));
        }
    });
    //scroll to hashed pin
    if (window.location.hash.length > 0) {
        $('.pin-details').hide();
        $('.type').removeClass('thermal').removeClass('hydro').removeClass('wind').removeClass('pumped').removeClass('biomass').removeClass(' storage');
        var hash = window.location.hash.replace('#', '');
        hash = hash.replace('/', '');
        if (hash.length) {
            var wrapperId = $('.annotated-wrapper span[data-href="#' + hash + '"]').attr("data-parent");
            if(wrapperId !== undefined){
                //if hash has any value then call this method
                var dType = $('.' + hash).parents('.collapseContent ').attr('data-location');
                fetchPinData(wrapperId, hash, dType);
            }
        }
    }
}

function mobileViewBindings() {
    //bind heading click event for mobile view
    $('.collapse-heading').click(function () {
        var i = this.href;
        i = i.substr(i.lastIndexOf('#') + 1, i.length);
        $(this).toggleClass('active');
        $('#' + i).slideToggle('fast');
        if ($(this).hasClass("active")) {
            $(this).attr("aria-expanded", "true");
        }
        else {
            $(this).attr("aria-expanded", "false");
        }
        return false;
    });
    //bind click event of city link
    $('.collapseable-wrapper li a').click(function () {
        var wrapperId = $(this).parents('.annotated-wrapper').attr("id");
        $('#' + wrapperId + ' .pin-details').hide();
        $('#' + wrapperId + ' .collapseable-wrapper .collapseContent').slideUp('slow');
        $('#' + wrapperId + ' .collapseable-wrapper .collapse-heading').removeClass('active');
        $('#' + wrapperId + ' .type').removeClass('thermal').removeClass('hydro').removeClass('wind').removeClass('pumped').removeClass('biomass').removeClass(' storage');
        var dHref = $(this).attr('href');
        var dType = $(this).parents('.collapseContent ').attr('data-location')
        if (dHref.length > 0 && dHref != '#') {
            fetchPinData(wrapperId, dHref.replace('#', ''), dType);
        }
    });
}

function drawPins(wrapperId, counter, filter, criteria) {
    var html = "";
    var pins = locationsList;
    if (filter) {
        pins = locationsList.filter(
            function (data) {
                return data.id == criteria;
            });
    }
    for (var i = 0; i < pins.length; i++) {
        var type = pins[i]['id'];
        var cities = pins[i]['cities'];
        for (var j = 0; j < cities.length; j++) {
            var leftPos = cities[j]['left'];
            var topPos = cities[j]['top'];
            var cityName = cities[j]['cityName'];
            var cityId = slugifyString(cityName);
            if (forIpad) {
                html += '<span style="left: ' + leftPos + '; top:' + topPos + ';" class="' + type + '" id="' + cityId + '-' + counter + '" tabindex="0" data-href="#' + cityId + '" aria-label="' + cityName + '" data-parent="' + wrapperId + '"></span>';
            } else {
                html += '<span style="left: ' + leftPos + '; top:' + topPos + ';" class="' + type + '" id="' + cityId + '-' + counter + '" tabindex="0" data-href="#' + cityId + '" data-toggle="tooltip" data-placement="bottom" title="' + cityName + '" role="tooltip" aria-label="' + cityName + '" data-parent="' + wrapperId + '"></span>';
            }
        }
    }
    $('#' + wrapperId + ' .annotated-bg .map-pins').append(html);
}

function fetchPinData(wrapperId, dCity, dType) {
    if (dCity == undefined) {
        return false;
    }
    //get required type locationsList form JSON Object
    var type = locationsList.filter(
        function (data) {
            return data.id == dType;
        });
    var cities = type[0].cities;
    //get required city form JSON Object
    var city = cities.filter(
        function (data) {
            return slugifyString(data.cityName) == dCity;
        });
    $('#' + wrapperId + ' .name').html(city[0].cityName);
    $('#' + wrapperId + ' .type').html(dType).addClass(dType);
    if (city[0].ImageVisible) {
        $('#' + wrapperId + ' .image').show();
        var myimg = '<img src="images/placeholder.png" alt=" " />';
        $('#' + wrapperId + ' .image').html(myimg);
    } else {
        $('#' + wrapperId + ' .image').hide();
    }
    $('#' + wrapperId + ' .description').html(city[0].Description);
    $('#' + wrapperId + ' .place').html(city[0].Location);
    $('#' + wrapperId + ' .pin-details').show();
    if (forIpad && city[0].ImageVisible) {
        $('#' + wrapperId + ' .image img').bind('load', function () {
            scrolledToDetails(wrapperId);
        });
    } else {
        scrolledToDetails(wrapperId);
    }
}

function scrolledToDetails(wrapperId) {
    setTimeout(function () {
        $('html, body').stop().animate({scrollTop: $('#' + wrapperId + ' .pin-details').offset().top}, 500);
    }, 500);
}

function draw_pins_on_image() {
    if ($('.annotated-wrapper').length) {
        bind_maps();
        mobileViewBindings();
    }
}

function slugifyString(str) {
    let trimmed = str.trim();
    let slug = trimmed.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    return slug.toLowerCase();
}
