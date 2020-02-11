var markers = null;
var imageCount = 5;
var autoInterval = null;

function bind_maps(json_data) {
    markers = json_data;
    $('.annotated-bg').removeClass("show-details");

    var wrapperId = "interactive_map";
    drawPins(wrapperId);

    //bind click event for map markers
    $('.map-pins span').click(function () {
        var wrapperId = $(this).attr("data-parent");
        $('#' + wrapperId + ' .annotated-bg').removeClass("show-details");
        var dHref = $(this).attr('data-href');
        if (dHref.length > 0 && dHref !== '#') {
            fetchPlaceData(wrapperId, dHref.replace('#', ''));
        }
    });

    //bind click event for button to close the place details
    $('#backToAllPlaces').click(function (e) {
        e.preventDefault();
        $('.annotated-bg').removeClass("show-details");
        reset360Viewer();
    });

    //handle keyboard events
    $(document).keydown(function (e) {
        var obj = (e.target ? e.target : e.srcElement);
        var target = $(obj);
        var isPinObj = checkRequiredParent(target, ".marker");
        var isParent = checkRequiredParent(target, ".annotated-bg");
        if (isPinObj || isParent) {
            switch (e.keyCode) {
                case 27:// ESC key
                    e.preventDefault();
                    $('.annotated-bg').removeClass("show-details");
                    break;
                case 13://ENTER key
                    if (isPinObj) {
                        e.preventDefault();
                        $(obj).trigger('click');
                    }
                    break;
                case 9://tab key
                    break;
                case 38://Arrow Up
                    break;
                case 37://Arrow Left
                    break;
                case 39://Arrow Right
                    break;
                case 40://Arrow Down
                    break;
                case 32://SPACE key
                    break;
                default:
                    break;
            }
        }
    });
    //handle hashed pin, if it's available in URL then it's shown by default.
    if (window.location.hash.length > 0) {
        $('.annotated-bg').removeClass("show-details");
        var hash = window.location.hash.replace('#', '');
        hash = hash.replace('/', '');
        if (hash.length) {
            var wrapperId = $('.annotated-wrapper span[data-href="#' + hash + '"]').attr("data-parent");
            if (wrapperId !== undefined) {
                fetchPlaceData(wrapperId, hash);
            }
        }
    }

    //bind tooltips for map markers
    $('.annotated-bg [data-toggle="tooltip"]').tooltip();
    $('body').tooltip({
        selector: '[data-toggle=tooltip]'
    });
}

/*
* This function will draw pins on the map
* */
function drawPins(wrapperId) {
    var html = "";
    for (var i = 0; i < markers.length; i++) {
        //get the properties from json that makes the marker's markup.
        var xPos = markers[i]['PosX'];
        var yPos = markers[i]['PosY'];
        var hoverInfo = markers[i]['HoverInfo'];
        var title = markers[i]['Title'];

        var pinIdx = 'pin_' + xPos + '_' + yPos;
        var pinId = slugifyString(title);

        html += '<span style="left: ' + xPos + 'px; top:' + yPos + 'px;" class="marker" id="' + pinId + '" tabindex="0" data-href="#' + pinId + '" data-toggle="tooltip" data-placement="bottom" title="' + hoverInfo + '" role="tooltip" aria-label="' + title + '" data-parent="' + wrapperId + '"></span>';
    }
    $('#' + wrapperId + ' .annotated-bg .map-pins').append(html);
}

/*
* This function will filter the data from JSON and show it's detail
* */
function fetchPlaceData(wrapperId, placeToFind) {
    if (placeToFind == undefined) {
        return false;
    }
    //get required place form JSON Object
    var place = markers.filter(
        function (data) {
            return slugifyString(data.Title) == placeToFind;
        });

    if (place.length) {
        var placeImg = place[0]['FolderName'];
        var placeTitle = place[0]['Title'];
        var placeInfo = place[0]['Info'];
        var fileCount = place[0]['filecount'];
        //remove the next line once image path is available in JSON
        //placeImg = "images/temple-zeus.jpg";
        var placeImage = '<img src="' + placeImg + '/0.jpg" alt="' + placeTitle + '" />';
        if(fileCount > 1){
            reset360Viewer();
            var markup360 = '<div class="threesixty" data-path="ROOT_PATH/{index}.jpg" data-count="ITEM_COUNT"><div class="ui-spinner"><span class="side side-left"><span class="fill"></span></span><span class="side side-right"><span class="fill"></span></span></div></div>';
            markup360 = markup360.replace("ROOT_PATH",placeImg);
            markup360 = markup360.replace("ITEM_COUNT",fileCount);
            var multiClass = (fileCount <= imageCount) ? "multi" : "rotate";
            $('#' + wrapperId + ' .place-image.threesixty-wrapper').html(markup360);
            $('#' + wrapperId + ' .place-info').addClass(multiClass).removeClass('single');
            bind360Viewer(fileCount);
        }else {
            $('#' + wrapperId + ' .place-image.single').html(placeImage);
            $('#' + wrapperId + ' .place-info').addClass('single').removeClass('rotate').removeClass('multi');
        }

        $('#' + wrapperId + ' .name').html(placeTitle);
        $('#' + wrapperId + ' .description').html(placeInfo);

        //if you don't want to scroll the page then uncomment the next line
        //$('#' + wrapperId + ' .annotated-bg').addClass("show-details");

        //if you don't want to scroll the page then comment the next line
        scrolledToDetails(wrapperId);
    }

}

//Scroll the page top
function scrolledToDetails(wrapperId) {
    setTimeout(function () {
        $('html, body').stop().animate({scrollTop: $('.annotated-wrapper').offset().top}, 250, "linear", function () {
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
    if (parsed.length == 0) {
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

function bind360Viewer(filesCount) {
    var $threeSixty = $('.threesixty');

    if(filesCount <= imageCount){
        $threeSixty.threeSixty({
            dragDirection: 'vertical',
            useKeys: false,
            draggable: false,
            loadingComplete: function () {
                $('.annotated-wrapper .place-info').addClass('loaded');
            }
        });
        $('.next').click(function(e){
            e.preventDefault();
            $threeSixty.nextFrame();
        });

        $('.prev').click(function(e){
            e.preventDefault();
            $threeSixty.prevFrame();
        });

    }else {
        $threeSixty.threeSixty({
            dragDirection: 'horizontal',
            useKeys: true,
            draggable: true,
            loadingComplete: function () {
                $('.annotated-wrapper .place-info').addClass('loaded');
            }
        });

        $("#autoPlay").click(function (e) {
            e.preventDefault();
            if($(this).hasClass('active')){
                clearInterval(autoInterval);
                $(this).removeClass('active');
            }else {
                $(this).addClass('active');
                autoInterval = setInterval(function () {
                    $('.threesixty').nextFrame();
                },100);
            }
        });
    }
}

function reset360Viewer() {
    $('.annotated-wrapper .place-info').removeClass('loaded').removeClass('single').removeClass('rotate').removeClass('multi');
    $('.annotated-wrapper .place-image').html('');
    $('.annotated-wrapper .play-pause').removeClass('active');
    clearInterval(autoInterval);
}