"use strict";

/* globals getCurrentIndex mobile */

/* exported page_ready_tabbed_navigation screen_change_tabbed_navigation */
function page_ready_tabbed_navigation() {
  $('.gns-tabbed .sub-menu-toggle').click(function (e) {
    //if item has is linked class then don't expand sub menu navigate to URL
    if ($(this).hasClass('is-linked')) return;

    if ($(this).parent('li').hasClass('expand-menu')) {
      $('.gns-tabbed .sub-nav, .tabbed-nav').removeClass('expand-menu');
      $(this).parent().find('.sub-menu').attr('aria-hidden', "true");
      $(this).attr("aria-expanded", "false");
    } else {
      $('.gns-tabbed .sub-nav, .tabbed-nav').removeClass('expand-menu');
      $(this).parent().find('.sub-menu').attr('aria-hidden', "false");
      $(this).parent('li').addClass('expand-menu');
      $('.tabbed-nav').addClass('expand-menu');
      $(this).attr("aria-expanded", "true");
    }

    e.preventDefault();
  }); //toggle menu button

  $('.toggle-menu-btn').click(function () {
    if ($("#wrapper").hasClass("slide-left")) {
      closeMobileMenu();
    } else {
      $("#wrapper").addClass("slide-left");
      $('.nav-column,.toggle-menu-btn').addClass("open");
      setTimeout(function () {
        $("#wrapper").css('overflow', 'inherit');
      }, 500);
    }
  });
  $('#loginDropdown').on('shown.bs.dropdown', function () {
    $('.user-menu-drop-box .dropdown-menu').addClass('show');
  });
  $('#loginDropdown').on('hidden.bs.dropdown', function () {
    $('.user-menu-drop-box .dropdown-menu').removeClass('show');
  });
  expandCurrentMenu();
  $("ul.gns-tabbed > li > a").keydown(function (e) {
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
        //left key
        getCurrentIndex("ul.gns-tabbed > li > a", e.target, "left");
        break;

      case 38:
        //Arrow Up
        break;

      case 39:
        //Arrow Right
        getCurrentIndex("ul.gns-tabbed > li > a", e.target, "right");
        break;

      case 40: //Arrow Down

      case 32: //SPACE key

      case 13:
        //ENTER key
        $(this).trigger('click');
        $(this).parent().find('.sub-nav-link li:first-of-type a').focus();
        break;

      default:
        break;
    }
  });
  $("ul.sub-nav-link > li > a").keydown(function (e) {
    e = e || window.event;

    switch (e.keyCode) {
      case 9:
        //tab key
        break;

      case 37:
        //Arrow Left
        getCurrentIndex("ul.sub-nav-link > li > a", e.target, "left");
        break;

      case 27: // ESC key

      case 38:
        //Arrow Up
        $(this).parents('.sub-nav').find('.sub-menu-toggle ').focus().trigger('click');
        break;

      case 39:
        //Arrow Right
        getCurrentIndex("ul.sub-nav-link > li > a", e.target, "right");
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
  });
}

function expandCurrentMenu() {
  $('.gns-tabbed .sub-menu-toggle').each(function () {
    //if item has attribute then expand it
    if ($(this).is('[data-expand-menu]') == true) {
      $(this).parent('li').addClass('expand-menu').attr("aria-expanded", "true");
      $('.tabbed-nav').addClass('expand-menu');
    }
  });
}

function screen_change_tabbed_navigation() {
  //collapse profile menu
  $('.user-menu-drop-box, .profile-box .dropdown').removeClass('open');

  if ($('.gns-tabbed').is('[data-expand-menu-on-mobile]') == true) {
    if (mobile) {
      $('.gns-tabbed .sub-menu-toggle').removeClass('is-linked');
      $('.gns-tabbed').removeClass('click-through');
    } else {
      $('.gns-tabbed .sub-menu-toggle').addClass('is-linked');
      $('.gns-tabbed').addClass('click-through');
    }
  }
}

function closeMobileMenu() {
  if ($("#wrapper").hasClass("slide-left")) {
    $("#wrapper").addClass("slide-back");
    setTimeout(function () {
      $('.nav-column,.toggle-menu-btn').removeClass('open');
      $("#wrapper").removeClass("slide-left").removeClass("slide-back");
      $('#wrapper,.nav-column').removeAttr('style');
      $("#wrapper").removeAttr('style');
    }, 500);
    $("#wrapper").removeAttr('style');
  }
}});
  $("#gns_drop_down_on_hover .dropdown-menu li > a").keydown(function (e) {
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

function bindEvents() {
  //open dropdown on hover and close when hover out
  if ($('#gns_drop_down_on_hover li.dropdown').length) {
    $("#gns_drop_down_on_hover li.dropdown").hover(function () {
      if (desktop) {
        $(this).addClass('show').find('.dropdown-menu').addClass('show').attr('aria-hidden', "false");
        $("#gns_drop_down_on_hover li.dropdown.show a.dropdown-toggle").attr("aria-expanded", "true");
      }
    }, function () {
      if (desktop) {
        $(this).removeClass('show').find('.dropdown-menu').removeClass('show').attr('aria-hidden', "true");
        $("#gns_drop_down_on_hover li.dropdown a.dropdown-toggle").attr("aria-expanded", "false");
      }
    });
  } //toggle menu button


  $('#toggleMenu').click(function () {
    if ($('#toggleMenu').hasClass('open')) {
      $('#toggleMenu span').removeClass('svg-close-mobile').addClass('svg-menu');
      $('#toggleMenu').removeClass('open');
    } else {
      $('#toggleMenu span').addClass('svg-close-mobile').removeClass('svg-menu');
      $('#toggleMenu').addClass('open');
    }

    $('.menu-inner-box').addClass('active');
    $('#nav_drop_down_with_search').slideToggle(250, "linear", function () {
      animateComplete();
    });
  });
  $('#loginDropdown').on('shown.bs.dropdown', function () {
    $('header .user-menu-drop-box .dropdown-menu').addClass('show').attr('aria-hidden', "false");
  });
  $('#loginDropdown').on('hidden.bs.dropdown', function () {
    $('header .user-menu-drop-box .dropdown-menu').removeClass('show').attr('aria-hidden', "true");
  });
}

function animateComplete() {
  if ($('#nav_drop_down_with_search:visible').length) {
    $('#nav_drop_down_with_search').addClass('open').removeClass('close');
  } else {
    $('#nav_drop_down_with_search').addClass('close').removeClass('open');
    $('.menu-inner-box').removeClass('active');
  }
}

function SearchBoxBindings() {
  //click biniding
  $('.sb-icon').click(function () {
    toggleSearchBox();
  }); //focus binding

  $(document).keyup(function (e) {
    if (e.which == 9) {
      var obj = e.target ? e.target : e.srcElement;
      var requiredIds = '.search-box';
      var target = $(obj);

      if (checkRequiredParent(target, requiredIds) == false) {
        closeSearchBox();
      } else {
        //if its not open
        if ($('.search-box').hasClass('open') == false) {
          toggleSearchBox();
        }
      }
    }

    if (e.keyCode == 27) {
      // escape key maps to keycode `27`
      $('.search-box.open').removeClass('open').attr('aria-hidden', "true");
    }
  }); //close on click outside

  $(document).mouseup(function (event) {
    var obj = event.target; //returns the object on which click event triggered

    var requiredIds = '.search-box';
    var target = $(obj);

    if (checkRequiredParent(target, requiredIds) == false) {
      closeSearchBox();
    }
  });
  $('.sb-input').keyup(function () {
    var inputVal = $('.sb-input').val();
    inputVal = $.trim(inputVal).length;

    if (inputVal !== 0) {
      $('.search-box').addClass('dirty');
    } else {
      $('.sb-input').val('');
      $('.search-box').removeClass('dirty');
    }
  });
}

function closeSearchBox() {
  if ($('.search-box').hasClass('open')) {
    $('.sb-icon').click();
  }
}

function toggleSearchBox() {
  //close if already open
  if ($('.search-box').hasClass('open')) {
    $('.search-box').removeClass('open').attr('aria-hidden', "true");
    $('.sb-input').focusout();
  } else {
    $('.search-box').addClass('open').attr('aria-hidden', "false");
    $('.sb-input').focus();
  }
} //code for screen change event goes here
//this function will be called from global layout


function screen_change_navigation_dropdowns_with_search() {
  //collapse profile menu
  $('header .user-menu-drop-box, #loginDropdown').removeClass('open').removeClass('show');

  if ($('#nav_drop_down_with_search').length) {
    if (desktop) {
      $('#nav_drop_down_with_search').removeClass('open close').removeAttr('style');
      $('.menu-inner-box').removeClass('active');
      $('#toggleMenu i').removeClass('svg-close-mobile').addClass('svg-menu');
      $('#toggleMenu').removeClass('open');
    }
  }
}var myMenu = $(this).parent('li.dropdown').find('.dropdown-menu').html();
    var newHTML = overViewLink + myMenu;
    $(this).parent('li.dropdown').find('.dropdown-menu').html(newHTML);

    if (is_iPad_device()) {
      $(this).attr('href', '#');
    }
  });
} //code for screen change event goes here
//this function will be called from global layout


function screen_change_navigation_dropdowns() {
  if ($('#nav_drop_down').length) {
    if (desktop) {
      closeMobileMenu();
    }
  }
}l_down').closest('.container').css('position', 'relative');
    $('.search-grey-box').toggleClass('active');
    $('.search-grey-box input[type="search"]').focus();
  }

  return false;
}

function closeMegaMenu_drill_down(id) {
  //remove style attribute from closest container
  $('#megaMenu_drill_down').closest('.container').removeAttr('style');
  $('#megaMenu_drill_down').removeClass('level-two');
  $('#megaMenu_drill_down > ul > li .grey-box .container .row .sub-menu').removeAttr('style'); //remove active class from all lis with but not from currently clicked item.

  $('#megaMenu_drill_down > ul.mega-menu > li').not($('#' + id).parent('li')).removeClass('active'); //current class added to make a  hook for third level menu

  $('.grey-box').removeClass('current').attr('aria-hidden', "true");
} //code for screen change event goes here
//this function will be called from global layout


function screen_change_megamenu_drill_down_cta_spotlight() {
  closeMegaMenu_drill_down('all');
}entItemIndex == 1 && (key == "left" || key == "up")) {
      //selector ul>li>a so the it will find in ul
      console.log('abc');
      $(currentItem).parent().parent().find('li:last-of-type > a').focus();
      return;
    }

    if ($(currentItem).parent().is(':last-child') && (key == "right" || key == "down")) {
      console.log('def'); //selector ul>li>a so the it will find in ul

      $(currentItem).parent().parent().find('li:nth-of-type(2) > a').focus();
      return;
    }

    return;
  }
}

function focusOrClick(id) {
  var text = $('#' + id).text();
  closeMegaMenu(id);

  if (id != "") {
    $('header #' + id).parent('li').toggleClass('active'); //add current class to current clicked item's grey-box

    if ($('header #' + id).parent('li').hasClass('active')) {
      $('#megaMenu > ul.mega-menu > li.active > a').attr("aria-expanded", "true");
    } else {
      $('#megaMenu > ul.mega-menu > li > a').attr("aria-expanded", "false");
    }

    $('#megaMenu > ul.mega-menu > li.active .grey-box').addClass('current').attr('aria-hidden', "false");
  }

  if (desktop) {
    if ($('#megaMenu > ul.mega-menu > li.active').length) {
      $('body').addClass('menu-open');
    } else {
      $('body').removeClass('menu-open');
    }
  }

  if (mobile) {
    $('.navbtn .title').html(text); //set active menu text beside button

    $('.navbtn .btn-dark-blue').focus();
    $('#megaMenu').addClass('level-two');
    $(this).parent('li').addClass('active');
    $('.navbtn .btn-dark-blue').addClass('level-two').focus();
  }

  return false;
}

function closeMegaMenu(id) {
  if (desktop) {
    //close previously opened item end before open another
    //current class added to make a  hook for third level menu
    $('.grey-box').removeClass('current').attr('aria-hidden', "true");
    $('.grey-box .sub-menu .sub.active').removeClass('active');
    $('body').removeClass('menu-open'); //remove active class from all lis with but not from currently clicked item.

    $('#megaMenu > ul.mega-menu > li').not($('#' + id).parent('li')).removeClass('active');
  }

  if (mobile && id == 'all') {
    $('#megaMenu,#toggleMenu').removeClass('active');
    $('#megaMenu,.navbtn .btn-dark-blue').removeClass('level-two').removeClass('level-three');
    $('.mega-menu>li,.sub-menu li.sub').removeClass('active');
    $('#megaMenu > .mega-menu > li > a').attr("aria-expanded", "false");
  }
} //code for screen change event goes here
//this function will be called from global layout


function screen_change_megamenu_drill_down_cta_left() {
  if ($('#header_drill_down').length) {
    if (desktop) {
      $('#tns input[type="text"]').attr('placeholder', 'SEARCH');
      $('#megaMenu > ul.mega-menu > li').show();
      $('.sub-menu > ul> li').show();
      $('#tnsMobile').hide();
      $('#tnsMobile').attr("aria-hidden", "true");
    }

    if (mobile) {
      $('body').removeClass('menu-open');
      $('#tns input[type="text"]').attr('placeholder', 'Search');
      $('#tnsMobile').show();
      $('#tnsMobile').attr("aria-hidden", "false");
    }

    closeMegaMenu('all');
  }
}

function page_ready_megamenu_drill_down_cta_left() {
  if ($('#header_drill_down').length) {
    bind_cta_left_events();
  }
}