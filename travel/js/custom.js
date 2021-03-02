function BindCustomLibraryEvents() {
    setTimeout(function () {

    }, 1000);
}

function scrollToListing(elementSelector) {
    if($(elementSelector) === undefined){
        return;
    }
    setTimeout(function () {
        $('html, body').stop().animate({scrollTop: $(elementSelector).offset().top}, 500);
    }, 250);
}


function expandAllFlightInfo() {
    $('a[href*="flightInformation-"]').each(function () {
        $(this).click();
    });
}
