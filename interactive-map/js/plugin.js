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
        $('.annotated-bg').removeClass("show-details");
    });

    $(document).keydown(function (e) {
        var obj = (e.target ? e.target : e.srcElement);
        var target = $(obj);
        var isPinObj = checkRequiredParent(target,".marker");
        var isParent = checkRequiredParent(target,".annotated-bg");
        if(isPinObj || isParent) {
            switch (e.keyCode) {
                case 9://tab key
                    break;
                case 27:// ESC key
                    e.preventDefault();
                    $('.annotated-bg').removeClass("show-details");
                    break;
                case 38://Arrow Up
                case 37://Arrow Left
                case 39://Arrow Right
                case 40://Arrow Down
                    break;
                case 32://SPACE key
                    break;
                case 13://ENTER key
                    if(isPinObj){
                        e.preventDefault();
                        $(obj).trigger('click');
                    }
                    break;
                default:
                    break;
            }
        }
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

    //$('#' + wrapperId + ' .annotated-bg').addClass("show-details");
    scrolledToDetails(wrapperId);
}

function scrolledToDetails(wrapperId) {
    setTimeout(function () {
        $('html, body').stop().animate({scrollTop: $('.annotated-wrapper').offset().top}, 250,"linear",function () {
            $('#' + wrapperId + ' .annotated-bg').addClass("show-details");
        });
    }, 250);
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

/*
* This function will be use to check either the target has filter expression items as a parent or not
*/
function checkRequiredParent(target, filterExpression) {
    //parents function return true if current element is child of any
    var res = filterExpression.split(',');
    var itemHasClass = false;
    var itemHasId = false;
    //search for either clicked item is required item
    for (var i = 0; i < res.length; i++) {
        //if found any one class than skip others
        if (!itemHasClass) {
            //remove . and # from string
            var className = res[i].replace('.', '').replace('#', '');
            itemHasClass = target.hasClass(className);
        }
        //if found a single id then skip others
        if (!itemHasId) {
            itemHasId = target.is(res[i]);
        }
    }
    //search for clicked item has required item as parent
    if (target.parents(filterExpression).length || itemHasClass || itemHasId) {
        //console.log('filterExpression found or item has it as a class');
        return true;
    } else {
        //console.log('filterExpression not found. other item');
        return false;
    }
}