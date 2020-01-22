var pins = null;
function bind_maps() {
    pins = locationsList.Markers;
    var count = 0;
    $('.annotated-bg').removeClass("show-details");
    $('.annotated-wrapper').each(function () {
        count += 1;
        var wrapperId = $(this).attr("id");
        var filter = false;
        drawPins(wrapperId, count, filter);
    });

    //bind tooltips
    $('.annotated-bg [data-toggle="tooltip"]').tooltip();
    $('body').tooltip({
        selector: '[data-toggle=tooltip]'
    });
    
    //bind click event for map pins
    $('.map-pins span').click(function () {
        var wrapperId = $(this).attr("data-parent");
        $('#' + wrapperId + ' .annotated-bg').removeClass("show-details");
        var dHref = $(this).attr('data-href');
        if (dHref.length > 0 && dHref != '#') {
            fetchPlaceData(wrapperId, dHref.replace('#', ''));
        }
    });

    $('#backButton').click(function (e) {
        e.preventDefault();
        $('.annotated-bg.show-details').addClass("hide-again");
        setTimeout(function () {
            $('.annotated-bg.show-details').removeClass("show-details").removeClass("hide-again");
        },1200);
    });
    //scroll to hashed pin
    if (window.location.hash.length > 0) {
        $('.annotated-bg').removeClass("show-details");
        var hash = window.location.hash.replace('#', '');
        hash = hash.replace('/', '');
        if (hash.length) {
            var wrapperId = $('.annotated-wrapper span[data-href="#' + hash + '"]').attr("data-parent");
            if(wrapperId !== undefined){
                fetchPlaceData(wrapperId, hash);
            }
        }
    }
}

function drawPins(wrapperId, counter, filter) {
    //console.log('drawPins: wrapperId: '+ wrapperId + ' >>counter: '+ counter +' >>filter: '+ filter);
    var html = "";
    for (var i = 0; i < pins.length; i++) {
        counter = i;
        var xPos = pins[i]['PosX'];
        var yPos = pins[i]['PosY'];
        var hoverInfo = pins[i]['HoverInfo'];
        var title = pins[i]['Title'];
        var info = pins[i]['Info'];
        var folderName = pins[i]['FolderName']['#text'];
        var pinIdx = 'pin_'+xPos+'_'+yPos;
        var pinId = slugifyString(title);

        html += '<span style="left: ' + xPos + 'px; top:' + yPos + 'px;" class="marker" id="' + pinId + '-' + counter + '" tabindex="0" data-href="#' + pinId + '" data-toggle="tooltip" data-placement="bottom" title="' + title + '" role="tooltip" aria-label="' + title + '" data-parent="' + wrapperId + '"></span>';
    }
    $('#' + wrapperId + ' .annotated-bg .map-pins').append(html);
}

function fetchPlaceData(wrapperId, dPlace) {
    //console.log('fetchPlaceData wrapperId: '+ wrapperId + ' >>dPlace,: '+ dPlace);
    if (dPlace == undefined) {
        return false;
    }
    //get required place form JSON Object
    var place = pins.filter(
        function (data) {
            return slugifyString(data.Title) == dPlace;
        });

    var placeImage = '<img src="images/temple-zeus.jpg" alt="placeholder" />';
    $('#' + wrapperId + ' .place-image').html(placeImage);

    $('#' + wrapperId + ' .name').html(place[0].Title);
    $('#' + wrapperId + ' .description').html(place[0].Info);

    $('#' + wrapperId + ' .annotated-bg').addClass("show-details");
    //scrolledToDetails(wrapperId);
}

function scrolledToDetails(wrapperId) {
    setTimeout(function () {
        $('html, body').stop().animate({scrollTop: $('#' + wrapperId + '').offset().top}, 250,"linear",function () {
            $('#' + wrapperId + ' .annotated-bg').addClass("show-details");
        });
    }, 500);
}

/*
 This function takes a string and then remove white space,
 special characters
 */
function slugifyString(str) {
    let trimmed = str.trim();
    let slug = trimmed.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    var parsed = slug.toLowerCase();
    if(parsed.length == 0){
        parsed = trimmed;
    }
    return parsed;
}