"use strict";

/* globals desktop mobile getCurrentIndex is_ie_mobile */

/* exported page_ready_megamenu_multi_level screen_change_megamenu_multi_level */
function page_ready_megamenu_multi_level() {
  if ($('.gns_multi_level').length) {
    bindGnsEvents;
  } //get list of toplevel GNS items
  //GNS first level hover


  $(".gns_multi_level .nav.navbar-nav > li.dropdown").hover(function () {
    if (desktop) {
      $(this).children('.dropdown-toggle').attr("aria-expanded", "true").addClass('show');
      $(this).children('.dropdown-menu').addClass('show');
      $(this).children('.dropdown-menu').attr("aria-hidden", "false");
    }
  }, function () {
    if (desktop) {
      $(this).children('.dropdown-toggle').attr("aria-expanded", "false").removeClass('show');
      $(this).children('.dropdown-menu').removeClass('show');
      $(this).children('.dropdown-menu').attr("aria-hidden", "true");
    }
  }); //GNS first level

  $(".gns_multi_level .dropdown-toggle").keydown(function (e) {
    e = e || window.event;

    switch (e.keyCode) {
      case 9:
        //tab key
        break;

      case 38: //Arrow Up

      case 27:
        // ESC key
        $('.gns_multi_level [data-toggle="dropdown"]').removeClass('show').attr('aria-expanded', 'false');
        $('.gns_multi_level .dropdown-menu').removeClass('show').attr("aria-hidden", "true");
        break;

      case 37:
        //Arrow Left
        //getCurrentIndex(".gns_multi_level .dropdown-toggle", e.target, "left");
        break;

      case 39:
        //Arrow Right
        //getCurrentIndex(".gns_multi_level .dropdown-toggle", e.target, "right");
        break;

      case 13:
        //ENTER key
        break;

      case 40: //Arrow Down

      case 32:
        //SPACE key
        $('.gns_multi_level [data-toggle="dropdown"]').removeClass('show').attr('aria-expanded', 'false');
        $('.gns_multi_level .dropdown-menu').removeClass('show').attr("aria-hidden", "true");
        $(this).parent().find('.dropdown-menu').addClass('show').attr("aria-hidden", "false");
        $(this).addClass('show').attr('aria-expanded', 'true');
        $(".gns_multi_level .dropdown-menu ul.ul-cols > li:first-of-type > a").focus();
        break;

      default:
        break;
    }
  }).click(function (e) {
    if (mobile) {
      e.preventDefault();

      if ($(this).hasClass("show")) {
        $(this).attr("aria-expanded", "false").removeClass('show');
        $(this).parent().children('.dropdown-menu').removeClass('show');
        $(this).parent().children('.dropdown-menu').attr("aria-hidden", "true");
      } else {
        $(this).attr("aria-expanded", "true").addClass('show');
        $(this).parent().children('.dropdown-menu').addClass('show');
        $(this).parent().children('.dropdown-menu').attr("aria-hidden", "false");
      }
    }
  }); //GNS second level

  $(".gns_multi_level .dropdown-menu ul li a").keydown(function (e) {
    e = e || window.event;

    switch (e.keyCode) {
      case 9:
        //tab key
        break;

      case 27:
        // ESC key
        $(this).parents('li.dropdown').find('.dropdown-toggle').focus();
        $(this).parents('li.dropdown').removeClass('show').find('.dropdown-menu').removeClass('show');
        break;

      case 37:
        //Arrow Left
        break;

      case 38:
        //Arrow Up
        getCurrentIndex(".gns_multi_level .dropdown-menu ul li a", e.target, "up", false);
        break;

      case 39:
        //Arrow Right
        break;

      case 40:
        //Arrow Down
        getCurrentIndex(".gns_multi_level .dropdown-menu ul li a", e.target, "down", false);
        break;

      case 32:
        //SPACE key
        break;

      case 13:
        //ENTER key
        break;

      default:
        break;
    }
  });
  $(".gns_multi_level .dropdown-menu ul:last-of-type li:last-of-type a").keydown(function (e) {
    e = e || window.event;

    switch (e.keyCode) {
      case 9:
        //tab key
        break;

      case 27:
        // ESC key
        $(this).parents('li.dropdown').find('.dropdown-toggle').focus();
        $(this).parents('li.dropdown').removeClass('show').find('.dropdown-menu').removeClass('show');
        break;

      case 37:
        //Arrow Left
        break;

      case 38:
        //Arrow Up
        break;

      case 39:
        //Arrow Right
        break;

      case 40:
        //Arrow Down
        $(".gns_multi_level .dropdown-menu ul:first-of-type li:first-of-type a").focus();
        break;

      case 32:
        //SPACE key
        break;

      case 13:
        //ENTER key
        break;

      default:
        break;
    }
  });
  $(".gns_multi_level .dropdown-menu ul:first-of-type li:first-of-type a").keydown(function (e) {
    e = e || window.event;

    switch (e.keyCode) {
      case 9:
        //tab key
        break;

      case 27:
        // ESC key
        break;

      case 37:
        //Arrow Left
        break;

      case 38:
        //Arrow Up
        $(".gns_multi_level .dropdown-menu ul:last-of-type li:last-of-type a").focus();
        break;

      case 39:
        //Arrow Right
        break;

      case 40:
        //Arrow Down
        break;

      case 32:
        //SPACE key
        break;

      case 13:
        //ENTER key
        break;

      default:
        break;
    }
  }); //TNS first level

  $(".tns_multi_level_left > ul > li > a").keydown(function (e) {
    e = e || window.event;

    switch (e.keyCode) {
      case 9:
        //tab key
        break;

      case 27:
        // ESC key
        break;

      case 37:
        //Arrow Left
        getCurrentIndex(".tns_multi_level_left > ul > li > a", e.target, "left");
        break;

      case 38:
        //Arrow Up
        break;

      case 39:
        //Arrow Right
        getCurrentIndex(".tns_multi_level_left > ul > li > a", e.target, "right");
        break;

      case 40: //Arrow Down

      case 32: //SPACE key

      case 13:
        //ENTER key
        $('.tns_multi_level_left > ul [data-toggle="dropdown"]').parent().removeClass('show');
        $(this).parent().addClass('show').find('.dropdown-menu').addClass('show');
        $(this).attr('aria-expanded', 'true');
        $(".tns_multi_level_left > ul .dropdown-menu li:first-of-type > a").focus();
        break;

      default:
        break;
    }
  }); //TNS second level

  $(".tns_multi_level_left > ul .dropdown-menu li a").keydown(function (e) {
    e = e || window.event;

    switch (e.keyCode) {
      case 9:
        //tab key
        break;

      case 27:
        // ESC key
        break;

      case 37:
        //Arrow Left
        break;

      case 38:
        //Arrow Up
        getCurrentIndex(".tns_multi_level_left > ul .dropdown-menu li a", e.target, "up");
        break;

      case 39:
        //Arrow Right
        break;

      case 40:
        //Arrow Down
        getCurrentIndex(".tns_multi_level_left > ul .dropdown-menu li a", e.target, "down");
        break;

      case 32:
        //SPACE key
        break;

      case 13:
        //ENTER key
        break;

      default:
        break;
    }
  });
}

function bindGnsEvents() {
  if (is_ie_mobile) {
    $('.gns_multi_level .navbar.navbar-default a').click(function () {
      if ($(this).attr('href') != "#") {
        location.href = $(this).attr('href');
      }
    });
  }
}

function change_event() {
  //var isNavDesktop = false;
  var isNavMobile = false;

  if (desktop) {
    $('nav .container .navbar .navbar-collapse .tns_multi_level_left').remove();
  }

  if (mobile) {
    if (!$('nav .container .navbar .navbar-collapse .tns_multi_level_left').length) {
      $('.tns_multi_level_left').clone().appendTo('nav .container .navbar .navbar-collapse');
    }

    if (!isNavMobile) {
      //below tring to fix that icon that appears is not reversed when click X
      $("nav .navbar-header button").click(function () {
        $(".navbar-collapse-grid ul li.dropdown a").removeClass("minus-icon");
      }); //below trying to fix that icon that appears is not reversed

      $(".navbar-collapse-grid ul li.dropdown a.plus-icon").click(function () {
        if ($(this).hasClass('minus-icon')) {
          $(this).removeClass('minus-icon');
        } else {
          $(".navbar-collapse-grid ul li.dropdown a.plus-icon").removeClass("minus-icon");
          $(this).addClass('minus-icon');
        }
      });
      $(".navbar-header .navbar-toggle").click(function () {
        $(this).find('span').toggleClass("x-icon");
        $('nav').toggleClass("grad-mob-drop");
        $('nav .navbar.navbar-default').toggleClass('bg-trans');
        $('nav > .gns_multi_level > div:nth-of-type(1) > div > a').toggleClass("mm-logo-w");
      });
      isNavMobile = true;
    }
  }
} //code for screen change event goes here
//this function will be called from global layout


function screen_change_megamenu_multi_level() {
  if ($('.gns_multi_level').length) {
    change_event();
  }
}