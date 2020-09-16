$( document ).ready(function() {

//    THIS CODE IS FOR A SINGLE BUTTON
//    var ripplyScott = (function() {
//      var circle = document.getElementById('js-ripple'),
//          ripple = document.querySelectorAll('.js-ripple');
//
//      function rippleAnimation(event, timing) {
//        var tl           = new TimelineMax();
//            x            = event.offsetX,
//            y            = event.offsetY,
//            w            = event.target.offsetWidth,
//            h            = event.target.offsetHeight,
//            offsetX      = Math.abs( (w / 2) - x ),
//            offsetY      = Math.abs( (h / 2) - y ),
//            deltaX       = (w / 2) + offsetX,
//            deltaY       = (h / 2) + offsetY,
//            scale_ratio  = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
//
//        tl.fromTo(ripple, timing, {
//          x: x,
//          y: y,
//          transformOrigin: '50% 50%',
//          scale: 0,
//          opacity: 1,
//          ease: Linear.easeIn
//        },{
//          scale: scale_ratio,
//          opacity: 0
//        });
//
//        return tl;
//      }
//
//      return {
//        init: function(target, timing) {
//          var button = document.getElementById(target);
//
//          button.addEventListener('mouseover', function(event) {
//            rippleAnimation.call(this, event, timing);
//          });
//        }
//      };
//    })();
//
//    ripplyScott.init('js-ripple-btn', 0.75);
    
    
    // THIS CODE IS FOR MULTIPLE BUTTONS
    var ripplyScott = (function () {
    function rippleAnimation(button, event, timing) {
        var ripple = button.querySelectorAll('.js-ripple'),
            tl = new TimelineMax(),
            x = event.offsetX,
            y = event.offsetY,
            w = event.target.offsetWidth,
            h = event.target.offsetHeight,
            offsetX = Math.abs((w / 2) - x),
            offsetY = Math.abs((h / 2) - y),
            deltaX = (w / 2) + offsetX,
            deltaY = (h / 2) + offsetY,
            scale_ratio = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

        tl.fromTo(ripple, timing, {
            x: x,
            y: y,
            transformOrigin: '50% 50%',
            scale: 0,
            opacity: 1,
            ease: Linear.easeIn
        }, {
            scale: scale_ratio,
            opacity: 0
        });

        return tl;
    }

    return {
        init: function (target, timing) {
            var buttons = document.querySelectorAll(target);

            [].forEach.call(buttons, function (button) {
                button.addEventListener('mouseover', function (event) { // or "click"
                    rippleAnimation.call(this, button, event, timing);
                });
            });
        }
    };
    })();

    ripplyScott.init('.button', 0.75);
    
});