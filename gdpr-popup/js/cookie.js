function getCookie(c_name) {                                // load the cookie data into memory
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function setCookie(c_name, value, exdays) { // set the cookie when the users accepts the policy
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value + "; path=/";
}

function checkCookie(cookie_name, elementId) {
    try {
        // Check if the cookie is set.
        var cookieValue = getCookie(cookie_name);// Call the getCookie function and load it's content into the variable 'CookieCheckboxes'
        //works only when element id is passed
        if (elementId != undefined && elementId != null && elementId != "") {
            document.getElementsByTagName('footer')[0].removeAttribute("style");
            if (cookieValue != null && cookieValue != "") {
                // If the cookie is set, hide the message.
                document.getElementById(elementId).setAttribute('aria-hidden', 'true');
                document.getElementById(elementId).classList.remove("show");
                document.getElementsByTagName('body')[0].classList.remove("cookie-overlay");
                document.getElementsByTagName('footer')[0].removeAttribute("style");
            }
            else {
                // If it's not set, show the message
                document.getElementById(elementId).setAttribute('aria-hidden', 'false');
                document.getElementById(elementId).classList.add("show");
                document.getElementsByTagName('footer')[0].removeAttribute("style");
                var ElementHeight = document.getElementById(elementId).offsetHeight;
                document.getElementsByTagName('footer')[0].style.marginBottom = ElementHeight + "px";
                if (document.getElementById(elementId).getAttribute('data-placement') === 'center') {
                    document.getElementsByTagName('body')[0].classList.add("cookie-overlay");
                }
            }
        }
        return cookieValue;
    } catch (e) {
        console.log(e);
        console.log('You have missed a hook id OR class in the cookie section. Please validate HTML markup.');
        return undefined;
    }
}

function deleteCookie(c_name, regex) {
    if (regex) {
        // Get an array of cookies
        var arrSplit = document.cookie.split(";");
        for (var i = 0; i < arrSplit.length; i++) {
            var cookie = arrSplit[i].trim();
            var cookieName = cookie.split("=")[0];
            // If the prefix of the cookie's name matches the one specified, remove it
            if (cookieName.indexOf(c_name) === 0) {
                // Remove the cookie
                document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }
        }
    } else {
        document.cookie = c_name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
}

function screen_change_cookie() {
    checkCookie("CookieCheckboxes", "cookie");
}

function createCookie(hook) {
    var arr = "";
    var x = document.querySelectorAll(hook);
    //prepare an array item
    for (var i = 0; i < x.length; i++) {
        arr += '{"name": "' + x[i].getAttribute('name') + '", "value": "' + x[i].checked + '"},';
    }
    //remove last comma (,)
    arr = arr.slice(0, -1);
    //put in an array
    arr = "[" + arr + "]";

    setCookie("CookieCheckboxes", arr, 365);
    return true;
}

function bindClickEvents() {
    document.addEventListener('click', function (event) {
        if (event.target.id === 'cookieBtn') {
            createCookie('.cookie-checkbox');
            checkCookie("CookieCheckboxes", "cookie");
            initializeScripts();
            return false;
        }
    });
}

function initializeScripts() {
    var runAnalytics = false;
    var runPerformance = false;
    var getCookieData = getCookie("CookieCheckboxes");
    if (getCookieData) {
        var parsedData = JSON.parse(getCookieData);
        for (var i = 0; i < parsedData.length; i++) {
            var thisVal = parsedData[i].value === 'true';
            switch (parsedData[i].name) {
                case "Analytics":
                    runAnalytics = thisVal;
                    break;
                case "Performance":
                    runPerformance = thisVal;
                    break;
            }
        }
    }

    if (runAnalytics && (typeof GoogleCodeType !== 'undefined')) {
        console.log('Please make sure you have updated GooglePropertyID, current GooglePropertyID is "'+ GooglePropertyID+'"');
        console.log('Analytics check box is checked, and loading "'+ GoogleCodeType +'" script.');
        if (GoogleCodeType == 'classic') {
            loadClassicGA();
        } else if (GoogleCodeType == 'analytics') {
            loadAnalyticsJS();
        } else if (GoogleCodeType == 'GTM') {
            loadGTM();
        }
    }

    if (runPerformance) {
        console.log('TODO: Performance check box is checked, You can add required functionality.');
    }
}

function loadClassicGA() {
    var jsPath = siteRootPath + 'js/ga.js';
    var queryJs = 'script[src="' + jsPath + '"]';
    if (document.querySelectorAll(queryJs).length === 0) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = jsPath;
        head.appendChild(script);
    }
}

function loadAnalyticsJS() {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = siteRootPath + 'js/analytics.js';
    head.appendChild(script);

    var head = document.getElementsByTagName('head')[0];
    var scriptAsync = document.createElement('script');
    scriptAsync.type = 'text/javascript';
    scriptAsync.src = 'https://www.google-analytics.com/analytics.js';
    scriptAsync.setAttribute("async", "");
    head.appendChild(scriptAsync);
}

function loadGTM() {
    var head = document.getElementsByTagName('head')[0];
    var scriptAsync = document.createElement('script');
    scriptAsync.type = 'text/javascript';
    scriptAsync.src = 'https://www.googletagmanager.com/gtag/js?id=' + GooglePropertyID;
    scriptAsync.setAttribute("async", "");
    head.appendChild(scriptAsync);

    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = siteRootPath + 'js/gtm.js';
    head.appendChild(script);
}

bindClickEvents();
initializeScripts();
