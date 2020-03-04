"use strict";

/* globals is_page_iframed updateExternalLinks screen_change_default mobile linkPhoneNumbers desktop
unWrapLinkedPhoneNumbers isLiveSite wrapHtmlTag scrollToElement*/

/* exported page_ready_default screen_change_default */
//code for page ready goes here
//this function will be called from global layout
function page_ready_default() {
  if (!is_page_iframed()) {
    document.querySelector("body").classList.add("not-iframed");
  } else {
    document.querySelector("body").classList.add("ds-iframed");
  }

  var skipContentLink = document.querySelector("a.skip-content");

  if (skipContentLink) {
    skipContentLink.onclick = function (event) {
      event.preventDefault();
      var targetId = this.getAttribute("href").replace("#", "");
      scrollToElement(targetId);
      return false;
    };
  }

  updateStandardContent('.standard-content', '16by9', 'table-striped'); // External links function

  updateExternalLinks();
  $('.date.form-control').datepicker({
    markup: 'bootstrap4',
    inputFormat: 'dd/MM/yy',
    outputFormat: 'dd/MM/y',
    titleFormat: 'EEEE d MMMM y',
    gainFocusOnConstruction: false
  });
  $('.date.form-control').keydown(function (e) {
    var validKeys = /[0-9\.\-\/]/;

    if (e.key.match(validKeys)) {
      return true;
    } else if (e.keyCode == 8 || e.keyCode == 9) {
      return true;
    } else {
      return false;
    }
  });
}

function screen_change_default() {
  if (mobile) {
    linkPhoneNumbers('.phone');
  } else if (desktop) {
    unWrapLinkedPhoneNumbers('.wrapped-phone');
  }
}

function updateStandardContent(hook, videoclass, tableclass) {
  if (isLiveSite) {
    var tables = Array.from(document.querySelectorAll("".concat(hook, " table")));

    if (tables) {
      tables.forEach(function (t) {
        if (t.classList.contains("EditingFormTable") === false && t.classList.contains("CaptchaTable") === false) {
          t.classList.add("table", tableclass);
          wrapHtmlTag("div", t, "table-wrapper");
        }
      });
    }

    var nestedItems = document.querySelectorAll("".concat(hook, " ol:not(.pagination), ").concat(hook, " ul:not(.pagination)")).length;

    for (var z = 0; z < nestedItems; z++) {
      var listItems = Array.from(document.querySelectorAll("".concat(hook, " ol:not(.pagination):not(.wrapped) > li, ").concat(hook, " ul:not(.pagination):not(.wrapped) > li")));

      if (listItems) {
        listItems.forEach(function (li) {
          li.innerHTML = "<span>".concat(li.innerHTML, "</span>");
          li.parentNode.classList.add("wrapped");
        });
      }
    }

    var iFrames = Array.from(document.querySelectorAll("".concat(hook, " iframe")));

    if (iFrames) {
      iFrames.forEach(function (frame) {
        frame.classList.add("embed-responsive-item");
        wrapHtmlTag("div", frame, "embed-responsive embed-responsive-".concat(videoclass));
      });
    }
  }
}