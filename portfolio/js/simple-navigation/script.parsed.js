"use strict";

/* globals getCurrentIndex checkRequiredParent */

/* exported page_ready_simple_navigation */
function page_ready_simple_navigation() {
  $('#toggleMenuSimple').click(function () {
    if ($(this).hasClass('collapsed')) {
      $('header.simple-gns').addClass('nav-open');
    } else {
      $('header.simple-gns').removeClass('nav-open');
    }
  }); //GNS first level

  $("#gns > ul > li > a").keydown(function (e) {
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
        getCurrentIndex("#gns > ul > li > a", e.target, "left");
        break;

      case 38:
        //Arrow Up
        break;

      case 39:
        //Arrow Right
        getCurrentIndex("#gns > ul > li > a", e.target, "right");
        break;

      case 40:
        //Arrow Down
        $('#gns > ul [data-toggle="dropdown"]').parent().removeClass('show');
        $(this).parent().addClass('show').find('.dropdown-menu').addClass('show');
        $(this).attr('aria-expanded', 'true');
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
  }); //GNS second level

  $("#gns .dropdown-menu ul li a").keydown(function (e) {
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
        getCurrentIndex("#gns > ul > li > a", e.target, "up");
        break;

      case 39:
        //Arrow Right
        break;

      case 40:
        //Arrow Down
        getCurrentIndex("#gns > ul > li > a", e.target, "down");
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
  SearchBoxBindings();
}

function toggleSearchBox() {
  //close if already open
  if ($('.search-wrapper').hasClass('collapsed')) {
    $('.search-wrapper').removeClass('collapsed').attr('aria-hidden', "false");
    $('.search-menu .form-control').focus();
    $(".tns-nav").addClass("active");
  } else {
    $('.search-wrapper').addClass('collapsed').attr('aria-hidden', "true");
    $('.search-menu .form-control').focusout();
    $(".tns-nav").removeClass("active");
  }
}

function closeSearchBox() {
  if ($('.search-wrapper').hasClass('collapsed') == false) {
    $('.search-menu .button').click();
  }
}

function SearchBoxBindings() {
  //click biniding
  $(".search-menu .search-box.input-group .form-control").removeAttr("value");
  $('.search-menu .button').click(function (e) {
    e.preventDefault();
    toggleSearchBox();
  }); //focus binding

  $(document).keyup(function (e) {
    if (e.which == 9) {
      var obj = e.target ? e.target : e.srcElement;
      var requiredIds = '.search-wrapper';
      var target = $(obj);

      if (checkRequiredParent(target, requiredIds) == false) {
        closeSearchBox();
      } else {
        //if its not open
        if ($('.search-wrapper').hasClass('collapsed')) {
          toggleSearchBox();
        }
      }
    }

    if (e.keyCode == 27) {
      // escape key maps to keycode `27`
      $('.search-wrapper').addClass('collapsed').attr('aria-hidden', "true");
    }
  }); //close on click outside

  $(document).mouseup(function (event) {
    var obj = event.target; //returns the object on which click event triggered

    var requiredIds = '.search-wrapper';
    var target = $(obj);

    if (checkRequiredParent(target, requiredIds) == false) {
      closeSearchBox();
    }
  });
  /*$('.search-menu .form-control').keyup(function () {
      var inputVal = $('.search-menu .form-control').val();
      inputVal = $.trim(inputVal).length;
      if (inputVal !== 0) {
          $('.search-wrapper').addClass('dirty');
      } else {
          $('.search-menu .form-control').val('');
          $('.search-wrapper').removeClass('dirty');
      }
  });*/
}