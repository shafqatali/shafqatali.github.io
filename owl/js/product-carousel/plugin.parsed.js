"use strict";

/* exported page_ready_product_carousel */
var owlInterval;

function page_ready_product_carousel() {
  var owl = $('.owl-carousel');
  owl.owlCarousel({
    nav: true,
    loop: true,
    responsiveClass: true,
    dotsEach: true,
    center: true,
    responsive: {
      0: {
        items: 1
      },
      640: {
        items: 3,
        animateOut: 'slideOutDown',
        animateIn: 'flipInX',
        smartSpeed: 750,
        margin: 140,
        autoWidth: true
      }
    }
  });
  owl.on('refreshed.owl.carousel', function () {
    $('.owl-item').removeClass('current-item');
    $('.owl-item.active.center').addClass('current-item'); //console.log('hello');
  });
  owl.on('translated.owl.carousel', function () {
    $('.owl-item').removeClass('current-item');
    $('.owl-item.active.center').addClass('current-item'); //console.log('hello');
  });
  owlInterval = setInterval(bannerAnimate, 500);
}

function bannerAnimate() {
  var owlLoaded = document.querySelectorAll(".owl-loaded"); //var loadedCount = 0;

  if (owlLoaded.length > 0) {
    var isMobile = window.matchMedia("only screen and (max-width: 767px)").matches; //our jQuery plugin

    $.fn.moveItems = function () {
      $(this).children(':first-child').animate({}, 500, function () {
        $(this).appendTo($(this).parent());
      });
    }; //call the plugin.


    $(".owl-carousel.owl-loaded").moveItems();

    if (isMobile) {
      //Conditional script here
      var imageWrapperHeight = $(".owl-item .image-wrapper").height();
      imageWrapperHeight = imageWrapperHeight / 2 - 20;
      $(".owl-carousel.owl-loaded .owl-nav").css("top", imageWrapperHeight + "px");
    }

    clearInterval(owlInterval);
  }
}