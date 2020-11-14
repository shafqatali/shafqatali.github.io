"use strict";

/* globals is_page_iframed updateExternalLinks screen_change_default mobile linkPhoneNumbers desktop
unWrapLinkedPhoneNumbers isLiveSite wrapHtmlTag scrollToElement
checkCookie modificationDate setCookie */

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

    skipContentLink.onkeydown = function (e) {
      if (e.keyCode === 32) {
        e.preventDefault();
        skipContentLink.click();
      }
    };
  }

  updateStandardContent('.standard-content', '16by9', 'table-striped');
  updateStandardContent('section', '16by9', 'table-striped'); // External links function

  updateExternalLinks(['.standard-content', ".ds-elements"]);
  /*
      $('.date.form-control').datepicker({
          markup: 'bootstrap4',
          inputFormat: 'dd/MM/yy',
          outputFormat: 'dd/MM/y',
          titleFormat: 'EEEE d MMMM y',
          gainFocusOnConstruction: false
      });
        $('.date.form-control').keydown(function (e) {
          const validKeys = /[0-9.-/]/;
          if ((e.key.match(validKeys))) {
              return true;
          } else if (e.keyCode == 8 || e.keyCode == 9) {
              return true;
          } else {
              return false;
          }
      });
  */

  var notificationDate = checkCookie("notification");

  if (notificationDate && notificationDate === modificationDate) {
    $('.notification-banner').alert('close');
  } else {
    $('.notification-banner').on('closed.bs.alert', function () {
      // do something...
      setCookie("notification", modificationDate, 60);
    }).removeClass("d-none");
  }
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
    var tables = Array.from(document.querySelectorAll("".concat(hook, " table:not(.table-striped)")));

    if (tables) {
      var hasDirtyTables = false;
      tables.forEach(function (t) {
        if (t.classList.contains("EditingFormTable") === false && t.classList.contains("CaptchaTable") === false && t.classList.contains("table-reflow") === false) {
          t.classList.add("table", tableclass);
          t.classList.add("table-hover");
          wrapHtmlTag("div", t, "table-wrapper");

          if (t.innerHTML.indexOf("<thead>") == -1) {
            t.classList.add('no-thead');
            hasDirtyTables = true;
          }
        }
      });

      if (hasDirtyTables) {
        //fix dirty tables
        //remove style attributes
        var dirtyTableRows = Array.from(document.querySelectorAll("".concat(hook, " table.no-thead tbody tr, ").concat(hook, " table.no-thead tbody tr td")));
        dirtyTableRows.forEach(function (item) {
          item.removeAttribute("style");
        }); //add thead tag

        var dirtyTables = Array.from(document.querySelectorAll("".concat(hook, " table.no-thead > tbody > tr:first-of-type")));
        dirtyTables.forEach(function (item) {
          var thisMarkup = item.outerHTML.replace(/<td>/g, "<th>").replace(/<\/td>/g, "</th>");
          var tableTag = item.parentNode.parentNode;
          item.remove();
          var newItem = document.createElement("THEAD");
          newItem.innerHTML = thisMarkup;
          tableTag.insertBefore(newItem, tableTag.childNodes[0]); //tableTag.classList.remove("no-thead");
        });
      }
    }

    var excludeList = Array.from(document.querySelectorAll("".concat(hook, " ol.pagination, ").concat(hook, " ol.breadcrumb, ").concat(hook, " .sidebar ul, ").concat(hook, " .nav-sitemap, ").concat(hook, " .nav-sitemap ul")));

    if (excludeList) {
      excludeList.forEach(function (el) {
        el.classList.add("excluded");
      });
    }

    var nestedItems = document.querySelectorAll("".concat(hook, " ol:not(.excluded), ").concat(hook, " ul:not(.excluded)")).length;

    for (var z = 0; z < nestedItems; z++) {
      var listItems = Array.from(document.querySelectorAll("".concat(hook, " ol:not(.excluded):not(.wrapped) > li, ").concat(hook, " ul:not(.excluded):not(.wrapped) > li")));

      if (listItems) {
        listItems.forEach(function (li) {
          li.innerHTML = "<span>".concat(li.innerHTML, "</span>");
          li.parentNode.classList.add("wrapped");
        });
      }
    }

    if (hook !== "section") {
      var iFrames = Array.from(document.querySelectorAll("".concat(hook, " iframe")));

      if (iFrames) {
        iFrames.forEach(function (frame) {
          var src = frame.getAttribute("src");
          var fSrc = frame.getAttribute("data-src");
          var isSurveySrc = src && src.indexOf("dotmailer-surveys.com") >= 0 ? true : false;
          var isSurveyFSrc = fSrc && fSrc.indexOf("dotmailer-surveys.com") >= 0 ? true : false;

          if (isSurveySrc === false && isSurveyFSrc === false) {
            frame.classList.add("embed-responsive-item");

            if (frame.classList.contains("lazyloaded")) {
              frame.setAttribute("src", frame.getAttribute("data-src"));
            }

            wrapHtmlTag("div", frame, "embed-responsive embed-responsive-".concat(videoclass));
          }
        });
      }
    }
  }
}