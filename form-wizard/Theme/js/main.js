//if (createNodeComplete) {
    $(document).ready(function () {
        $('#Textbox-1').parent().parent().addClass("active");

        //populate the modal body with a div per links that exist in the footer 
        $(".footer-links>li>a").each(function () {
            var bodyItem = jQuery('<div/>', { 'data-ftr': $(this).attr('id') });
            $('#PageModal .modal-body .pageLoader').append(bodyItem);
            $('#PageModal .modal-body div[data-ftr="' + $(this).attr('id') + '"]').load($(this).attr('href') + " .sfContentBlock").hide();
        });

        $('.page-modal').on('click', function (e) {
            e.preventDefault();
            $(".modal-body div[data-ftr]").each(function () {
                $(this).hide();
            });
            $('#PageModal').modal('show').find('.modal-body div[data-ftr="' + $(this).attr('id') + '"]').show();
        });

        $('.gns>li>a').click(function (e) {
            if (get_screen_width() < 1200)
                return;

            e.preventDefault();
            var clickedIndex = $(this).parent().index();
            var activeIndex = $('.gns>li.active').index();

            var currentActive = $('.gns>li.active > a').attr('href');
            var currentActiveClass = currentActive.replace('#', '');
            var currentActiveClassWrapper = currentActiveClass + '-active';

            // console.log('activeIndex: ' + activeIndex + ' clickedIndex:' + clickedIndex);

            var thisHref = $(this).attr('href');
            var thisClassName = thisHref.replace('#', '');
            var thisClassWrapper = thisClassName + '-active';

            $('.gns>li').removeClass('active');
            $(this).parent().addClass('active');
            $('html, body').stop().animate({ scrollTop: $('.page.' + thisClassName).offset().top }, 500);
            $('.gns').fadeOut(100, function () {
                $('.gns').fadeIn("slow");
                $('#wrapper').removeClass(currentActiveClassWrapper).addClass(thisClassWrapper);
            });
            if (clickedIndex == activeIndex) {
                $('#wrapper').addClass(currentActiveClassWrapper);
            }
        });
        $('body').addClass(getMobileOperatingSystem());

        if (getMobileOperatingSystem() == 'iOS') {
            $('body').addClass('iOS' + iOSVersion());
        }

        $('.gns>li.active > a').click();

        $('input[type="text"], input[type="email"], input[type="number"], input[type="tel"]').on("keyup", function () {
            if ($(this).val() != "") {
                $(this).parent().addClass('has-cursor');
            }
            else
                $(this).parent().removeClass('has-cursor');
        });

        if ($('body').hasClass('iOS')) {
            $('#register-carousel .step-down').click(function (e) {
                e.preventDefault();
                moveNext();
            });
        }
        else {
            $('#register-carousel .step-down').click(function (e) {
                e.preventDefault();
                moveNext();
            });
        }

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
            $('.responses .response.Textbox-5 > a').text(rbSelectedValue);
        });

    });

    /* $("#RegistrationForm").on('show.bs.modal', function () {
        setTimeout(function () {
            $(inputTargets).focus();
        }, 200);    
    }); */

    $("#register-carousel").on('slid.bs.carousel', function () {

        if ($('#div-6').parent().hasClass('active')) {
            $('.carousel-indicators').hide()
            if (get_screen_width() <= '414') {
                $('.responses').show();
            }
        }
        else {
            if (get_screen_width() <= '414') {
                $('.responses').hide();
            }
            $('.carousel-indicators').show()
        }

    });

    /* Form validation */

    $('button[type = submit]').click(function (event) {
        var checkboxObj = $(this).parents('.form-group').find('input[type=checkbox]');
        if ($(checkboxObj).is('[required]') && $(checkboxObj).is(':checked') == false) {
            event.preventDefault();
            var validationObj = $(this).parents('.form-group').find('input[data-sf-role = "violation-messages"]:last').val();
            var validationMessage = JSON.parse(validationObj).required;

            $(this).parents('.form-group').find('.error-msg').remove();
            $(".styled-checkbox").after("<span class='error-msg'><i class='exclaim'>Error!</i>" + validationMessage + "</span></div>")
        }
        else {
            $(this).parents('.form-group').find('.error-msg').remove();
        }
    });

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

            //if (!$(this).validity.valid) {
            if ($(this).is(":invalid")) {
                if ($('.shaker').length > 0) {
                    $('.shaker').removeClass('shaker');
                }
                $('.responses .response.' + this_id + ' > a').text('');
                $('.carousel-inner .item.active .step-down').removeClass('hover');
                $(this).parent().find('.error-msg').remove();
                var validationObj = $(this).parent('.form-group').find('input[data-sf-role = "violation-messages"]:last').val();
                var validationMessage = JSON.parse(validationObj).required;
                $(this).after("<span class='error-msg'><i class='exclaim'>Error!</i>" + validationMessage + "</span></div>");
                $(this).focus;
                $(this).addClass('shaker');
            }
            else {
                $(this).parent().find('.error-msg').remove();
                $('.shaker').removeClass('shaker');
                $('.carousel-inner .item.active .step-down').addClass('hover');
                $('.responses .response.' + this_id + ' > a').text($(this).val());
            }
        });
    }

    // Replace the validation UI for all forms
    var forms = $("div[data-sf-role='form-container']");// document.querySelectorAll("form");
    for (var i = 0; i < forms.length; i++) {
        replaceValidationUI(forms[i]);
    }

    function iOSVersion() {
        if (window.MSStream) {
            // There is some iOS in Windows Phone...
            // https://msdn.microsoft.com/en-us/library/hh869301(v=vs.85).aspx
            return false;
        }
        var match = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/),
            version;

        if (match !== undefined && match !== null) {
            version = [
                parseInt(match[1], 10),
                parseInt(match[2], 10),
                parseInt(match[3] || 0, 10)
            ];
            return parseFloat(version.join('.'));
        }

        return false;
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

    //$('#RegistrationForm span[data-sf-role="success-message"]').attr('id', "successMsg");
    //var blocker = document.querySelector('#successMsg');

    //var observer = new MutationObserver(function (mutations) {
    //    mutations.forEach(function (mutation) {
    //        if (mutation.attributeName !== 'style') return;
    //        submitSuccess();
    //    });
    //});
    //observer.observe(blocker, { attributes: true });
    ////observer.disconnect();

    //var sPane = document.querySelectorAll('[data-sf-role="success-message"]');
    //var ePane = document.querySelectorAll('[data-sf-role="error-message"]');
    //var formContainer = document.querySelectorAll('[data-sf-role="form-container"]');

    //$(ePane).change(function () {
    //    submitSuccess();
    //});


    function submitSuccess() {
        var success = false;
        if ($(sPane).css("display") != "none" || $(ePane).css("display") != "none") {
            if ($(sPane).css("display") != "none") {
                success = true;
                $(this).hide();
            }
            else {
                success = false;
                $('div[data-sf-role="form-container"] span[data-sf-role="error-message"]').hide();
            }

            //add class to .modal-content and update the header and body content
            $('#RegistrationForm .modal-content').addClass("response-msg");
            $('.response-screen').removeClass('hidden');
            $('.responses').hide();
            $(formContainer).hide();
            if (success) {
                $('#RegistrationForm .modal-header .container h1').html("Thanks");
                $(sPane).hide();
            }
            else {
                var err = $(ePane).html();
                $('.response-screen').html(err);
                $(ePane).html('');
            }
        }
    }

    function moveNext() {
        var validated = false;
        if ($('#div-5, #div-6').parent().hasClass('active')) {
            validated = true;
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
            setTimeout(function () {
                $('.active input.form-control').focus();
            }, 750);

        }
    }
//}