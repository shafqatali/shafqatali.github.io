"use strict";

/* exported page_ready_card_carousel screen_change_card_carousel */
function page_ready_card_carousel() {
  $('.owl-carousel').owlCarousel({
    //stagePadding: 50,
    loop: true,
    margin: 30,
    center: false,
    nav: true,
    responsive: {
      0: {
        items: 3,
        slideBy: 3,
        autoHeight: true,
        mouseDrag: false,
        touchDrag: false
      },
      641: {
        items: 4,
        slideBy: 4,
        autoHeight: true
      }
    }
  });
}

function screen_change_card_carousel() {//do nothing for now
  //use this function if you want to do something on screen change event
}