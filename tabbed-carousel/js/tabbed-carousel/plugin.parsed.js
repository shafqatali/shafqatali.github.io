"use strict";

/* globals TabbedCarouselComponent Vue */

/* exported page_ready_tabbed_carousel screen_change_tabbed_carousel */
function page_ready_tabbed_carousel() {
  if ($('#tabbedCarouselApp').length) {
    new Vue({
      el: "#tabbedCarouselApp",
      name: "tabbedCarouselApp",
      components: {
        tabbedCarousel: TabbedCarouselComponent
      }
    });
  }
}

function screen_change_tabbed_carousel() {//do nothing for now
  //use this function if you want to do something on screen change event
}