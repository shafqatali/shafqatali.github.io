/* exported getCookie setCookie checkCookie deleteCookie */
function getCookie(c_name) {                                // load the cookie data into memory
    let i, x, y, arrayCookies = document.cookie.split(";");
    for (i = 0; i < arrayCookies.length; i++) {
        x = arrayCookies[i].substr(0, arrayCookies[i].indexOf("="));
        y = arrayCookies[i].substr(arrayCookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            //return unescape(y);//unescape is deprecated
            return decodeURIComponent(y);
        }
    }
}

function setCookie(c_name, value, exdays) {
    // set the cookie when the users accepts the policy
    let exDate = new Date();
    exDate.setDate(exDate.getDate() + exdays);
    let c_value = escape(value) + ((exdays == null) ? "" : `; expires=${exDate.toUTCString()}`);
    document.cookie = `${c_name}=${c_value}; path=/`;
}

function checkCookie(cookie_name, elementId) {
    try {
        // Check if the cookie is set.
        let cookieValue = getCookie(cookie_name);// Call the getCookie function and load it's content into the variable "CookieCheckboxes"
        //works only when element id is passed
        if (elementId) {
            let elementObj = document.getElementById(elementId);
            document.getElementsByTagName("footer")[0].removeAttribute("style");
            if (cookieValue) {
                // If the cookie is set, hide the message.
                elementObj.setAttribute("aria-hidden", "true");
                elementObj.classList.remove("show");
                document.getElementsByTagName("body")[0].classList.remove("cookie-overlay");
                document.getElementsByTagName("footer")[0].removeAttribute("style");
            }
            else {
                // If it's not set, show the message
                elementObj.setAttribute("aria-hidden", "false");
                elementObj.classList.add("show");
                document.getElementsByTagName("footer")[0].removeAttribute("style");
                let ElementHeight = elementObj.offsetHeight;
                document.getElementsByTagName("footer")[0].style.marginBottom = ElementHeight + "px";
                if (elementObj.getAttribute("data-placement") === "center") {
                    document.getElementsByTagName("body")[0].classList.add("cookie-overlay");
                }
            }
        }
        return cookieValue;
    } catch (e) {
        console.error(e);
        console.error("You have missed a hook id OR class in the cookie section. Please validate HTML markup.");
        return undefined;
    }
}

function deleteCookie(c_name, regex) {
    if (regex) {
        // Get an array of cookies
        let arrSplit = document.cookie.split(";");
        for (let i = 0; i < arrSplit.length; i++) {
            let cookie = arrSplit[i].trim();
            let cookieName = cookie.split("=")[0];
            // If the prefix of the cookie's name matches the one specified, remove it
            if (cookieName.indexOf(c_name) === 0) {
                // Remove the cookie
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            }
        }
    } else {
        document.cookie = `${c_name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}