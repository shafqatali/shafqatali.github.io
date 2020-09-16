$( document ).ready(function() {

    var mobileSize = 640;
    var desktop = true;
    var mobile = false;

    enquire.register("screen and (min-width: " + (mobileSize + 1) + "px)", {
        match: function () {
            desktop = true;
            mobile = false;
            //screenChange();
        },
        unmatch: function () {
            desktop = false;
        }
    });
    enquire.register("screen and (max-width: " + mobileSize + "px)", {
        match: function () {
            mobile = true;
            desktop = false;
            //screenChange();
        },
        unmatch: function () {
            mobile = false;
            desktop = true;
        }
    });

    $('.heading').css('display', 'none');
    $('.icons').css('display', 'none');
    $('.read-more').css('display', 'none');

    $('.pulse-y').click(function() {
      $('.info-box').fadeToggle(1000, 'swing').toggleClass('expand');

    if ($('.info-box').hasClass('expand')) {
        $('.heading').fadeIn(1600);
        $('.icons').fadeIn(2400);
        $('.read-more').fadeIn(3000);
    } else {
        $('.heading').css('display', 'none');
        $('.icons').css('display', 'none');
        $('.read-more').css('display', 'none');
    }

    });

    var fooReveal = {
        origin      : 'bottom',
        distance    : '20px',
        duration    : 1500,
        delay       : 0,
        opacity     : 0,
        scale       : 1,
        easing      : 'cubic-bezier(0.6, 0.2, 0.1, 1)'
    };

    window.sr = ScrollReveal();
    sr.reveal('.jumbotron', fooReveal);
    sr.reveal('.box-shadow, .sq', {
      origin: 'bottom',
      duration : 1000,
      distance : '50px',
      delay    : 200,
      easing   : 'ease-in-out',
      scale    : 1
    }, 100);
    sr.reveal('.pin', {
      origin: 'top',
      duration : 1000,
      distance : '80px',
      delay    : 200,
      easing   : 'ease-in-out',
      scale    : 1
    }, 300);
    sr.reveal('.pulse-l', {
      origin: 'top',
      duration : 1000,
      distance : '80px',
      delay    : 200,
      easing   : 'ease-in-out',
      scale    : 1
    }, 300);

    // Scroll reveal animation on Location Banner

    ScrollReveal().reveal('.airlines', { delay: 200, easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)'});
    ScrollReveal().reveal('.flights', { delay: 400, easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)' });
    ScrollReveal().reveal('.destinations', { delay: 600, easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)' });
    ScrollReveal().reveal('.weekly-flights', { delay: 800, easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)' });
    ScrollReveal().reveal('.rank', { delay: 1000, easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)' });
    ScrollReveal().reveal('.growth', { delay: 1200, easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)' });
    ScrollReveal().reveal('.location-banner .btn-link', { delay: 1500, easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)' });

    $('.img-parallax').each(function(){
        var img = $(this);
        var imgParent = $(this).parent();
        function parallaxImg () {
            var speed = img.data('speed');
            var imgY = imgParent.offset().top;
            var winY = $(this).scrollTop();
            var winH = $(this).height();
            var parentH = imgParent.innerHeight();


            // The next pixel to show on screen
            var winBottom = winY + winH;

            // If block is shown on screen
            if (winBottom > imgY && winY < imgY + parentH) {
                // Number of pixels shown after block appear
                var imgBottom = ((winBottom - imgY) * speed);
                // Max number of pixels until block disappear
                var imgTop = winH + parentH;
                // Porcentage between start showing until disappearing
                var imgPercent = ((imgBottom / imgTop) * 100) + (50 - (speed * 50));
            }
            img.css({
                top: imgPercent + '%',
                transform: 'translate(-50%, -' + imgPercent + '%)'
            });
        }
        $(document).on({
            scroll: function () {
                if(desktop) {
                    parallaxImg();
                }
            }, ready: function () {

                if(desktop) {
                    parallaxImg();
                }
            }
        });
    });

});

