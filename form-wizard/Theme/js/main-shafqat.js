$(function () {
    $('.page-modal').on('click', function (e) {
        e.preventDefault();
        $('#PageModal').modal('show').find('.modal-body').load($(this).attr('href'));
    });

    $('.gns>li>a').click(function (e) {
        if (get_screen_width() < 641)
            return;
        e.preventDefault();
        var clickedIndex = $(this).parent().index();
        var activeIndex = $('.gns>li.active').index();

        var currentActive = $('.gns>li.active > a').attr('href');
        var currentActiveClass = currentActive.replace('#', '');
        var currentActiveClassWrapper = currentActiveClass + '-active';

        var thisHref = $(this).attr('href');
        var thisClassName = thisHref.replace('#', '');
        var thisClassWrapper = thisClassName + '-active';

        $('.gns>li').removeClass('active');
        $(this).parent().addClass('active');
        $('html, body').stop().animate({scrollTop: $('.page.' + thisClassName).offset().top}, 500);
        $('.gns').fadeOut(100, function () {
            $('.gns').fadeIn("slow");
            $('#wrapper').removeClass(currentActiveClassWrapper).addClass(thisClassWrapper);
        });
        if (clickedIndex == activeIndex) {
            $('#wrapper').addClass(currentActiveClassWrapper);
        }
    });
    $('body').addClass(getMobileOperatingSystem());
    $('.gns>li.active > a').click();

    $('input[type="text"], input[type="email"], input[type="number"], input[type="tel"]').on("keyup", function () {
        if ($(this).val() != "") {
            $(this).parent().addClass('has-cursor');
        }
        else
            $(this).parent().removeClass('has-cursor');
    });

    $('#register-carousel .step-down').click(function (e) {
        e.preventDefault();
        var validated = false;
        if ($('#div-6').parent().hasClass('active')) {
            if ($("input[name='MultipleChoiceFieldController']:checked").length > 0) {
                validated = true;
            }
        } else {
            $('.carousel-inner .item.active input').blur();
            if ($('.carousel-inner .item.active .error-msg').length == 0) {
                validated = true;
            }
        }
        if (validated) {
            $('.responses .response a').each(function () {
                var thisText = $(this).text();
                if (thisText.length > 0) {
                    $(this).parent().show();
                } else {
                    $(this).parent().hide();
                }
            });
            var activeIndex = $('#register-carousel .item.active').index();
            $('#register-carousel').carousel('next');
            setActiveIndicators(activeIndex + 1);
        }
    });
    $('#register-carousel .step-up').click(function (e) {
        e.preventDefault();
        var activeIndex = $('#register-carousel .item.active').index();
        $('#register-carousel').carousel('prev');
        setActiveIndicators(activeIndex - 1);
    });
    $('.responses .response a').click(function (e) {
        e.preventDefault();
        var thisHref = $(this).attr('href');
        var itemIndex = $(thisHref).parent().index();
        $('#register-carousel').carousel(itemIndex);
        setActiveIndicators(itemIndex);
    });
    $('input[name="MultipleChoiceFieldController"]').change(function () {
        var rbSelectedValue = $("input[name='MultipleChoiceFieldController']:checked").val();
        $('.responses .response.Textbox-6 > a').text(rbSelectedValue);
    });
});

/* Form validation */

//custom validation
function replaceValidationUI(form) {
    // Suppress the default bubbles
    form.addEventListener("invalid", function (event) {
        event.preventDefault();
    }, true);
    // Support Safari, iOS Safari, and the Android browser—each of which do not prevent
    // form submissions by default
    form.addEventListener("submit", function (event) {
        if (!this.checkValidity()) {
            event.preventDefault();
        }
    });


    $("input[type=text], input[type=tel], input[type=email]").blur(function () {
        var this_id = $(this).attr('id');
        if ($(this).val() == "")
            $(this).parent().removeClass('has-cursor');

        if ($(this).is(":invalid")) {
            $('.responses .response.' + this_id + ' > a').text('');
            $('.carousel-inner .item.active .step-down').removeClass('hover');
            $(this).parent().find('.error-msg').remove();
            $(this).after("<span class='error-msg'><i class='exclaim'>Error!</i>" + this.validationMessage + "</span></div>")
            $(this).focus;
        }
        else {
            $(this).parent().find('.error-msg').remove();
            $('.carousel-inner .item.active .step-down').addClass('hover');
            $('.responses .response.' + this_id + ' > a').text($(this).val());
        }
    });
}

// Replace the validation UI for all forms
var forms = document.querySelectorAll("form");
for (var i = 0; i < forms.length; i++) {
    replaceValidationUI(forms[i]);
}

/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "windows-phone";
    }

    if (/android/i.test(userAgent)) {
        return "android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

function get_screen_width() {
    var screenWidth = Math.min(document.documentElement.clientWidth, window.innerWidth || 0);
    return screenWidth
}

function setActiveIndicators(itemIndex) {
    for (var i = 0; i <= itemIndex; i++) {
        var z = i + 1;
        $('#register-carousel .carousel-indicators li:nth-of-type(' + z + ')').addClass('active');
    }
}