/* globals downloadJS Hammer */
/* exported is_touch_device check_browser_version getMobileOperatingSystem is_ie_mobile is_internet_explore get_screen_width
 * is_iOS_device is_iPad_device is_page_iframed isPostBack updateExternalLinks linkPhoneNumbers unWrapLinkedPhoneNumbers
 * bindPlayPauseEventsForCarousel bindSwipeEventsForCarousel bindEventsForCarousel centeredBackground slugifyString
 * grayScaleImage checkRequiredParent getComputedCss getCurrentIndex handle_keys_sample scrollAnchors scrollToElement wrapHtmlTag
 * stopEmbeddedVideoOnCloseDialog playYoutubeEmbeddedVideo pauseYoutubeEmbeddedVideo stopYoutubeEmbeddedVideo */
//Browser related
/*
 This function check either it is touch device or not
 and return true if it's touch device
 */
function is_touch_device() {
    let isTouchDevice = false;
    if ("ontouchstart" in window || navigator.msMaxTouchPoints) {
        isTouchDevice = true;
    }
    return isTouchDevice;
    //this code is not supported in all browsers
    /*try {
     document.createEvent("TouchEvent");
     return true;
     } catch (e) {
     return false;
     }*/
}

/*
 This function check the browser name and version
 and return info i.e safari-10, IE-11 etc
 */
function check_browser_version(appendToBodyAsClass) {
    let browserInfo = is_internet_explore();
    if (browserInfo === "not-ie") {
        let ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        browserInfo = M.join('-').toLowerCase();
    }
    if (appendToBodyAsClass) {
        $('body').addClass(browserInfo);
    }
    return browserInfo;
}

/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
function getMobileOperatingSystem(appendToBodyAsClass) {
    let userAgent = navigator.userAgent || navigator.vendor || window.opera;

    let deviceOS = 'unknown';
    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        deviceOS = "windows-phone";
    }

    if (/android/i.test(userAgent)) {
        deviceOS = "android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        deviceOS = "iOS";
    }

    // Mac detection from: http://stackoverflow.com/a/9039885/177710
    if (/Mac|mac|MAC/.test(userAgent) && !window.MSStream) {
        deviceOS = "MAC";
    }
    if (appendToBodyAsClass) {
        $('body').addClass(deviceOS);
    }
    return deviceOS;
}

/*
 This function check either it is IE Mobile
 and return true if it is
 */
function is_ie_mobile() {
    return navigator.userAgent.match(/iemobile/i);
}

function is_internet_explore(appendToBodyAsClass) {
    let version_num;
    let sAgent = window.navigator.userAgent;
    let Idx = sAgent.indexOf("MSIE");

    // If IE, return version number.
    if (Idx > 0)
        version_num = parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));

    // If IE 11 then look for Updated user agent string.
    else if (!!navigator.userAgent.match(/Trident\/7\./))
        version_num = 11;
    else
        version_num = 0; //It is not IE
    let class_name = 'greater-ie-' + version_num;
    if (version_num === 0)
        class_name = 'not-ie';
    if (appendToBodyAsClass) {
        document.querySelector("body").classList.add(class_name);
    }
    return class_name;
}

/*
 This function returns the screen width of browser.
 */
function get_screen_width() {
    return Math.min(document.documentElement.clientWidth, window.innerWidth || 0);
}

/*
 This function check either it is iOS device or not
 and return true if it's iOS device
 */
function is_iOS_device() {
    let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    return iOS;
}

/*
 This function check either it is iOS device or not
 and return true if it's iOS device
 */
function is_iPad_device() {
    let regExp = new RegExp("iPad", "i");
    return navigator.userAgent.match(regExp) == "iPad";
}

/*
 This function check either the page is loaded in browser
 or in within iFrame on the page
 */
function is_page_iframed() {
    //true if loaded within iFrame
    return window.frameElement;
}

/*
 This function check either the page is loaded default or
 loaded after a Post Back
 return true, if its a Post Back
 */
function isPostBack() {
    return document.referrer.indexOf(document.location.href) > -1;
}

//Content related
/*
 This function check href attribute for anchors to find out either
 its linked to a page that is not in current domain.
 */
function updateExternalLinks(hooksToApply = ['.standard-content']) {
    let currentDomain = document.location.protocol + '//' + document.location.hostname;
    hooksToApply.forEach(function (hook) {
        let elements = Array.from(document.querySelectorAll(`${hook} a[href^="http"]:not([href*="${currentDomain}"])`));
        if (elements) {
            elements.forEach(function (el) {
                el.classList.add("external-link");
                el.innerHTML += `<span class="sr-only">Opens in new window</span>`;
                Object.assign(el, {
                    target: '_blank'
                });
            });
        }
    });
}

/*
 This function makes a phone number link on mobile devices but not on iOS.
 */
function linkPhoneNumbers(hook) {
    if (!is_iOS_device()) {
        let elements = Array.from(document.querySelectorAll(hook));
        if(elements){
            elements.forEach(function (el) {
                let html = el.innerHTML;
                //remove all white spaces from html
                let cleanedNum = html.replace(/ /g, "");
                cleanedNum = cleanedNum.replace("+", "");
                cleanedNum = cleanedNum.replace("(", "");
                cleanedNum = cleanedNum.replace(")", "");
                let ariaLabel = el.getAttribute('aria-label');
                let phoneLink = document.createElement('a');
                phoneLink.innerHTML = html;
                el.parentNode.replaceChild(phoneLink, el);
                Object.assign(phoneLink, {
                    href: `tel:${cleanedNum}`
                });
                phoneLink.classList.add("wrapped-phone");
                if(ariaLabel){
                    phoneLink.setAttribute("aria-label",ariaLabel);
                }
            });
        }
    }
}

/*
 This function makes a phone number a normal text on desktop view.
 */
function unWrapLinkedPhoneNumbers(hook) {
    let elements = Array.from(document.querySelectorAll(hook));
    if(elements){
        elements.forEach(function (el) {
            let phoneNumber = el.innerText;
            let ariaLabel = el.getAttribute('aria-label');

            let phoneSpan = document.createElement('span');
            phoneSpan.innerText = phoneNumber;
            el.parentNode.replaceChild(phoneSpan, el);
            phoneSpan.classList.add("phone");
            if(ariaLabel){
                phoneSpan.setAttribute("aria-label",ariaLabel);
            }
        })
    }
}

//Others
/*
 This function takes a string and then remove white space,
 special characters
 */
function slugifyString(str) {
    let trimmed = str.trim();
    let slug = trimmed.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    return slug.toLowerCase();
}

/*
* This function will be use to check either the target has filter expression items as a parent or not
*/
function checkRequiredParent(target, filterExpression) {
    //parents function return true if current element is child of any
    let res = filterExpression.split(',');
    let itemHasClass = false;
    let itemHasId = false;
    //search for either clicked item is required item
    for (let i = 0; i < res.length; i++) {
        //if found any one class than skip others
        if (!itemHasClass) {
            //remove . and # from string
            let className = res[i].replace('.', '').replace('#', '');
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

/*
* Computed Style of any element
*/
function getComputedCss(element, property) {
    return window.getComputedStyle(element, null).getPropertyValue(property);
}

function wrapHtmlTag(newTagName, objectToWrap, wrapperClass = "") {
    let newWrapperTag = document.createElement(newTagName);
    objectToWrap.parentNode.insertBefore(newWrapperTag, objectToWrap);
    newWrapperTag.appendChild(objectToWrap);
    if(wrapperClass !== ""){
        let wrapClasses = wrapperClass.trim().split(" ");
        wrapClasses.forEach(function (c) {
            newWrapperTag.classList.add(c);
        });
    }
}

function scrollAnchors(e, respond = null) {
    e.preventDefault();
    let distanceToTop = el => Math.floor(el.getBoundingClientRect().top);
    let targetID = (respond) ? respond.getAttribute('href') : this.getAttribute('href');
    let targetAnchor = document.querySelector(targetID);
    if (targetAnchor) {
        let originalTop = distanceToTop(targetAnchor);
        window.scrollBy({ top: originalTop, left: 0, behavior: 'smooth' });
        let checkIfDone = setInterval(function() {
            let atBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2;
            if (distanceToTop(targetAnchor) === 0 || atBottom) {
                targetAnchor.tabIndex = '-1';
                targetAnchor.focus();
                clearInterval(checkIfDone);
            }
        }, 100);
    }else {
        alert(`page don't have an element tag with id "${targetID.replace("#","")}"`);
    }
}

function scrollToElement(targetID) {
    let distanceToTop = el => Math.floor(el.getBoundingClientRect().top);
    let targetAnchor = document.getElementById(targetID);
    if (targetAnchor) {
        let originalTop = distanceToTop(targetAnchor);
        window.scrollBy({ top: originalTop, left: 0, behavior: 'smooth' });
        let checkIfDone = setInterval(function() {
            let atBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2;
            if (distanceToTop(targetAnchor) === 0 || atBottom) {
                targetAnchor.tabIndex = '-1';
                targetAnchor.focus();
                clearInterval(checkIfDone);
            }
        }, 100);
    }else {
        alert(`page don't have an element tag with id "${targetID}"`);
    }
}


/*
 * Functions might be required in Plugin but not being used in Base Template
 * */

//#region Plugin related script
/*
 * Play/Pause events from carousel
 */
function bindPlayPauseEventsForCarousel() {
    $('.play-control').click(function () {
        let carouselId = $(this).attr('href');
        $(carouselId).carousel('cycle');
        $(carouselId).carousel('next');
        $(this).addClass('active');
        $(".pause-control[href='" + carouselId + "']").removeClass('active');
        return false;
    });
    $('.pause-control').click(function () {
        let carouselId = $(this).attr('href');
        $(carouselId).carousel('pause');
        $(this).addClass('active');
        $(".play-control[href='" + carouselId + "']").removeClass('active');
        return false;
    });
}

/*
 * Bind Swipe left/right events for carousel
 */

function bindSwipeEventsForCarousel() {
    if ($('.carousel').length && is_touch_device()) {
        downloadJS("js/libman/hammer.min.js", function () {
            let myElement = document.getElementById('wrapper');
            // create a simple instance
            // by default, it only adds horizontal recognizers
            let mc = new Hammer(myElement);
            // listen to events...
            mc.on("panleft panright", function (ev) {
                //get target element
                let angle = Math.abs(ev.angle);
                if (angle >= 90 && angle < 150)
                    return;

                if (angle > 30 && angle < 90)
                    return;
                //$('.testimonial-carousel h2').append(mc.touchAction.actions);
                //console.log(angle);
                let obj = (ev.target ? ev.target : ev.srcEvent);
                //if target is carousel then proceed further
                let carouselId = $(obj).parents('.carousel').attr('id');
                if (carouselId) {
                    if (ev.type === "panleft") {
                        $("#" + carouselId).carousel('next');
                    }
                    if (ev.type === "panright") {
                        $("#" + carouselId).carousel('prev');
                    }
                }
            });
        });
    }
}

/*
 * Bind left/right key down events for carousel
 */
function bindEventsForCarousel(hook, bindOptions) {
    if ($('.carousel').length) {
        //pause slider when anchor is in focus
        $('.carousel .carousel-inner .carousel-item a').focus(function () {
            let carouselId = $(this).parents('.carousel').attr('id');
            $("#" + carouselId).carousel('pause');
        }).blur(function () {
            let carouselId = $(this).parents('.carousel').attr('id');
            $("#" + carouselId).carousel('cycle');
        });

        //bind keyboard arrow keys event
        $(document).keydown(function (e) {
            let obj = (e.target ? e.target : e.srcElement);
            let carouselId = $(obj).parents('.carousel').attr('id');
            if (e.which === 37) {
                $("#" + carouselId).carousel('prev');
            }
            if (e.which === 39) {
                $("#" + carouselId).carousel('next');
            }
        });
        if (hook && bindOptions) {
            $(hook).carousel(bindOptions);
        } else {
            $('.carousel').carousel({
                interval: 5000,
                pause: 'hover'
            });
        }
    }
}

$.fn.toggleAttrVal = function (attr, val1, val2) {
    let test = $(this).attr(attr);
    if (test === val1) {
        $(this).attr(attr, val2);
        return this;
    }
    if (test === val2) {
        $(this).attr(attr, val1);
        return this;
    }
    $(this).attr(attr, val1);
    return this;
};

$('.dropdown').on('show.bs.dropdown', function () {
    $(this).find('.dropdown-menu').attr('aria-hidden', "false");
}).on('hide.bs.dropdown', function () {
    $(this).find('.dropdown-menu').attr('aria-hidden', "true");
});


/*
 * Show center portion of the background image
 * resetFirst: pass true then reset before start calculating differences
 * resetOnly: pass true if you want to reset only
 */

function centeredBackground(hook, resetFirst, resetOnly) {
    if ($(hook).length) {
        if (resetOnly) {
            $(hook + ' img').removeAttr('style');
            $(hook + ' img').removeAttr('data-repositioned');
            return;
        }
        if (resetFirst) {
            $(hook + ' img').removeAttr('style');
            $(hook + ' img').removeAttr('data-repositioned');
        }
        let win = get_screen_width();

        let totalItems = $(hook + ' img').length;
        let setImages = setInterval(function () {
            $(hook + ' img').each(function () {
                let bgw = $(this).width();
                if (bgw !== 0 && win < bgw) {
                    let setm = (win - bgw) / 2;
                    $(this).css('margin-left', setm);
                    $(this).attr('data-repositioned', 'yes');
                } else if (bgw !== 0 && bgw < win) {
                    $(this).css('margin', '0 auto');
                    $(this).attr('data-repositioned', 'yes');
                }
            });
            $(hook + '.loading').removeClass('loading');

            //clear interval only when all items are rerepositioned
            let imgCount = $(hook + ' img[data-repositioned^="yes"]').length;
            if (totalItems === imgCount) {
                clearInterval(setImages);
            }
        }, 1000);
    }
}

/*
 * This function will be use to make a gray image of any type i.e *.png,*.jpg
 * Take the src attribute of image tag as parameter
 */
function grayScaleImage(src) {
    try {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let imgObj = new Image();
        imgObj.src = src;
        canvas.width = imgObj.width;
        canvas.height = imgObj.height;
        ctx.drawImage(imgObj, 0, 0);
        let imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < imgPixels.height; y++) {
            for (let x = 0; x < imgPixels.width; x++) {
                let i = (y * 4) * imgPixels.width + x * 4;
                let avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                imgPixels.data[i] = avg;
                imgPixels.data[i + 1] = avg;
                imgPixels.data[i + 2] = avg;
            }
        }
        ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
        return canvas.toDataURL();
    } catch (err) {
        console.log('Error!... ' + err.message);
        return src;
    }
}

function getCurrentIndex(listSelector, currentItem, key, recursive) {
    if (recursive === undefined) {
        recursive = true;
    }
    let items = $(listSelector);
    let index = 0;
    let GNSItemIndex;
    //console.log('recursive: '+ recursive);
    if (recursive && ($(currentItem).parent().is(':first-child') || $(currentItem).parent().is(':last-child'))) {
        if ($(currentItem).parent().is(':first-child') && (key === "left" || key === "up")) {
            console.log('moving to last item');
            //selector ul>li>a so the it will find in ul
            $(currentItem).parent().parent().find('li:last-of-type > a:last-of-type').focus();
            return;
        }

        if ($(currentItem).parent().is(':last-child') && (key === "right" || key === "down")) {
            console.log('moving to first item');
            //selector ul>li>a so the it will find in ul
            $(currentItem).parent().parent().find('li:first-of-type > a:first-of-type').focus();
            return;
        }
    }
    items.each(function () {
        if ($(this).is(currentItem)) {
            GNSItemIndex = index;
        }
        index++;
    });
    switch (key) {
        case "up":
            if (GNSItemIndex >= 1) {
                items[GNSItemIndex - 1].focus();
            }
            break;
        case "right":
            if ((GNSItemIndex + 1) < items.length) {
                items[GNSItemIndex + 1].focus();
            }
            break;
        case "down":
            if ((GNSItemIndex + 1) < items.length) {
                items[GNSItemIndex + 1].focus();
            }
            break;
        case "left":
            if (GNSItemIndex >= 1) {
                items[GNSItemIndex - 1].focus();
            }
            break;
        default:
            break;
    }
}

$("ul[role='menu'] li a").keydown(function (e) {
    e = e || window.event;
    switch (e.keyCode) {
        case 9://tab key
            break;
        case 27:// ESC key
            break;
        case 37://Arrow Left
            break;
        case 38://Arrow Up
            getCurrentIndex("ul[role='menu'] li a", e.target, "up");
            break;
        case 39://Arrow Right
            break;
        case 40://Arrow Down
            getCurrentIndex("ul[role='menu'] li a", e.target, "down");
            break;
        case 32://SPACE key
            break;
        case 13://ENTER key
            break;
        default:
            break;
    }
});

function handle_keys_sample() {
    $("#selector").keydown(function (e) {
        e = e || window.event;
        console.log(e.keyCode);
        switch (e.keyCode) {
            case 9://tab key
                break;
            case 27:// ESC key
                break;
            case 37://Arrow Left
                break;
            case 38://Arrow Up
                break;
            case 39://Arrow Right
                break;
            case 40://Arrow Down
                break;
            case 32://SPACE key
                break;
            case 13://ENTER key
                break;
            default:
                break;
        }
    });
}

//#endregion


//#region Youtube Embedded Video functions
function stopEmbeddedVideoOnCloseDialog() {
    //if it's youtube embed moda
    if($('.modal iframe[src*="youtube.com/embed/"]').length){
        $('.modal').on('hidden.bs.modal', function () {
            pauseYoutubeEmbeddedVideo();
        });
    }
}
//to use these function(s) embedded URL must have the following query params
//?enablejsapi=1&version=3&playerapiid=ytplayer
function playYoutubeEmbeddedVideo() {
    $('iframe[src*="youtube.com/embed/"]')[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
}
function pauseYoutubeEmbeddedVideo() {
    $('iframe[src*="youtube.com/embed/"]')[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
}
function stopYoutubeEmbeddedVideo() {
    $('iframe[src*="youtube.com/embed/"]')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
}
//#endregion