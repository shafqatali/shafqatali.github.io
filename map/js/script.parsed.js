"use strict";

// Initilise function
$('#tabAccordion').tabCollapse();abbed_subnav*/
function page_ready_tabbed_subnav() {
  $(".tabbed-subnav-list > li > a").keydown(function (e) {
    e = e || window.event;
    console.log(e.keyCode);

    switch (e.keyCode) {
      case 9:
        //tab key
        break;

      case 27:
        // ESC key
        break;

      case 37:
        //Arrow Left
        getCurrentIndex(".tabbed-subnav-list > li > a", e.target, "left");
        break;

      case 38:
        //Arrow Up
        break;

      case 39:
        //Arrow Right
        getCurrentIndex(".tabbed-subnav-list> li > a", e.target, "right");
        break;

      case 40: //Arrow Down

      case 32: //SPACE key

      case 13:
        //ENTER key
        break;

      default:
        break;
    }
  });
}e.target, "right");
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
}.removeClass('out').removeClass('last');
        }, 500);
      }
    }
  });
  $(document).on("click", ".case-studies-wrapper.list-view .btn-view", function () {
    window.location = $(this).attr('data-url');
  });
  $("#grid-view, #list-view, #loadMoreList .loadMore,#load-more-sm, .btn").keydown(function (e) {
    e = e || window.event;

    switch (e.keyCode) {
      case 32: //SPACE key

      case 13:
        //ENTER key
        $(this).trigger('click');
        console.log($(this).text());
        break;

      default:
        break;
    }
  });
  $(document).keydown(function (e) {
    e = e || window.event;

    if (e.target.tagName == 'SPAN' && e.target.classList.value == "btn btn-view") {
      switch (e.target) {
        case 32: //SPACE key

        case 13:
          //ENTER key
          $(e.target).trigger('click');
          break;

        default:
          break;
      }
    }
  });
}

function prepareListView() {
  $('.case-studies .image-block.grid-item').each(function () {
    var csId = $(this).attr('id');

    if ($('#' + csId).hasClass('grid-item')) {
      var dataBg = $('#' + csId + ' .text-wraper').attr('data-bg');
      var displayOrder = $('#' + csId).attr('data-order');
      $('#' + csId + ' .text-wraper').css('color', dataBg);
      $('#' + csId + ' .text-wraper').wrap('<div class="col-a"></div>');
      $('#' + csId + ' .imgs').wrap('<div class="col-b"></div>');
      $('#' + csId).wrap('<div class="col-full"></div>').wrap('<div class="container"></div>');
      $('#' + csId).parents('.col-full').css('order', displayOrder);
      $('#' + csId).removeClass('grid-item').addClass('list-item');
    }
  });

  if ($('.case-studies .items > .col-full').length) {
    $('.case-studies .items > .col-full').appendTo('.case-studies');
  }
}

function prepareGridView() {
  $('.case-studies .image-block.list-item').each(function () {
    var csId = $(this).attr('id');

    if ($('#' + csId).hasClass('list-item')) {
      $('#' + csId + ' .text-wraper').removeAttr('style');
      $('#' + csId + ' .text-wraper').unwrap('.col-a');
      $('#' + csId + ' .imgs').unwrap('.col-b');
      $('#' + csId).unwrap('.container');
      $('#' + csId).unwrap('.col-full');
      $('#' + csId).removeClass('list-item').addClass('grid-item');
    }
  });

  if ($('.case-studies > .grid-item').length) {
    setDesktopGrid();
  }
}

function setDesktopGrid() {
  $('.case-studies > .grid-item').removeAttr('style');
  $('.case-studies > .grid-item[data-column="col1"]').appendTo('.items.col1');
  $('.case-studies > .grid-item[data-column="col2"]').appendTo('.items.col2');
  $('.case-studies > .grid-item[data-column="col3"]').appendTo('.items.col3');
  $('.case-studies > .grid-item').remove();
}

function toggleGridView() {
  if ($('#grid-view').hasClass('active')) {
    if (mobile) {
      $('.case-studies .items > .grid-item').appendTo('.case-studies');
      $('.case-studies > .grid-item').each(function () {
        var displayOrder = $(this).attr('data-order');
        $(this).css('order', displayOrder);
      });
    } else {
      setDesktopGrid();
    }
  }
}

function reArrangeNewItems() {
  var myId = $('.toggle-view > span.active').attr('id');

  if (myId == 'list-view') {
    $('.case-studies-wrapper').removeClass('grid-view').addClass('list-view');
    prepareListView();
  }

  if (myId == 'grid-view') {
    $('.case-studies-wrapper').removeClass('list-view').addClass('grid-view');
    prepareGridView();

    if (mobile) {
      toggleGridView();
    }
  }

  $('.case-studies-wrapper').addClass('active');
  $('.case-studies-wrapper .image-block').unbind('click').click(function (e) {
    if ($('.case-studies-wrapper').hasClass('list-view')) {
      e.preventDefault();
    }
  });
}

function screen_change_clients_widget() {//do nothing for now
  //use this function if you want to do something on screen change event
}

function page_ready_clients_widget() {
  ourWorkBindings();
  CallCaseStudy($('#skip').text());
}