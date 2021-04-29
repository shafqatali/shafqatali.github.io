//code for page ready goes here
//this function will be called from global layout
function page_ready_default() {
    checkCookie("CookieCheckboxes", "cookie");


    loadCookieChecboxes();

    updateStandardContent('.standard-content', '16by9', 'table-striped');

}

function screen_change_default() {

}

function updateStandardContent(hook, videoclass, tableclass) {
    if (isLiveSite) {
        $(hook + ' table').each(function () {
            $(this).addClass('table ' + tableclass);
            $(this).wrap('<div class="table-wrapper"></div>');
        });

        $(hook + ' ol:not(.pagination) li, ' + hook + ' ul:not(.pagination) li').each(function () {
            $(this).contents().wrap('<span></span>');
        });
        $(hook + ' ol:not(.pagination), ' + hook + ' ul:not(.pagination)').addClass('wrapped');

        $(hook + ' iframe').addClass('embed-responsive-item').wrap('<div class="embed-responsive embed-responsive-' + videoclass + '"></div>');
    }
}

function loadCookieChecboxes() {
    //bind update button event
    $('#updateCookieBtn').click(function () {
        //defined in cookie.js
        createCookie('.cookie-data .cookie-checkbox');
        initializeScripts();
        return false;
    });

    var getCookieData = getCookie("CookieCheckboxes");
    if (getCookieData) {
        var parsedData = JSON.parse(getCookieData);
        for (var i = 0; i < parsedData.length; i++) {
            if (parsedData[i].value === 'true') {
                $('.cookie-data input[name="' + parsedData[i].name + '"]').prop("checked", true);
            }
        }
        $('.cookie-data').addClass('show');
    } else {
        console.log('cookie is not saved');
    }
}
