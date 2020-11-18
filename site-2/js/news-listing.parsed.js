"use strict";

/* globals newsPageUrl */

/* exported filterNews */
var ITEMS_TO_LOAD = 12;
var INITIAL_LOAD = 11;
var initialLoading = true;
var isFiltered = false;
var isLoadMore = false;
var loader = document.getElementById("loader");
var loadMoreLink = document.getElementById("loadMoreLink");
var year = document.getElementById("filterYear");
var featureElements = document.getElementById("featured");
var allElement = document.getElementById("listing");

function call_api(count, skip) {
  var params = "&$top=" + count;

  if (skip !== 0) {
    params += "&$skip=" + skip;
  }

  var yearValue = year.options[year.selectedIndex].value;

  if (yearValue !== "") {
    params += "&$filter=year(PublicationDate) eq " + yearValue;
  } else if (isLoadMore === false) {
    initialLoading = true;
  }

  var api_url = "js/news-records.json?" + params;
  fetch(api_url).then(function (response) {
    return response.json();
  }).then(function (data) {
    return bind_api_data(data);
  })["catch"](function (error) {
    console.log("An error occurred! " + error);
  });
}

function bind_api_data(json) {
  var total = json["@odata.count"];
  var items = json.value;

  if (items === undefined || total === undefined) {
    console.log("Invalid data received.");
    console.log(json);
    return;
  }

  var count = items.length;
  var firstThree = [];
  var list = [];
  var firstThreeMarkup = '';

  if (count === 0) {
    allElement.innerHTML = '<div class="col-sm-12 text-center"><p>No record found.</p></div>';
    featureElements.innerHTML = '';
    loadMoreLink.classList.add("d-none");
    loader.classList.add("d-none");
    initialLoading = false;
    isFiltered = false;
    isLoadMore = false;
    return;
  }

  if (initialLoading) {
    featureElements.innerHTML = '';
    allElement.innerHTML = '';

    for (var z = 0; z < items.length; z++) {
      if (z < 3) {
        firstThree.push(items[z]);
      } else {
        list.push(items[z]);
      }
    }

    firstThreeMarkup = firstThree.map(function (o, index) {
      return "<div class=\"col-sm-6 item-".concat(index, "\"><a href=\"").concat(getFullURL(o.NewsItemUrl[0]), "\" class=\"list-item-wrapper\">\n<div class=\"list-item-feature\">").concat(getImageMarkup(o.DesktopImage, o.MobileImage), "\n<div class=\"list-item news\">\n                <div class=\"title-box\"><span class=\"title\">").concat(o.Title, "</span></div>\n                <span class=\"date\"><b>DATE:</b> ").concat(extractDate(o.PublicationDate), "</span>\n                ").concat(getDescription(o.Summary, index), "\n                <div class=\"last-row\">\n                    <span class=\"cta-link\">Read more</span>\n                </div>\n            </div></div></a></div>");
    }).join('');
    var signUpMarkup = "<div class=\"col-sm-6\"><div class=\"sign-up-box dark\">\n                <span class=\"text\">Sign up to our weekly insights </span>\n                 <a href=\"#\" class=\"cta-link\">Subscribe</a>\n</div></div><div class=\"col-sm-6 item-1\">";
    firstThreeMarkup = firstThreeMarkup.replace('<div class="col-sm-6 item-1">', signUpMarkup);
    featureElements.innerHTML = firstThreeMarkup;

    for (var v = 1; v < 3; v++) {
      var pTag = document.querySelector(".col-sm-6.item-" + v + " p");

      if (pTag) {
        pTag.remove();
      }

      var rowTag = document.querySelector(".col-sm-6.item-" + v + " .last-row");

      if (rowTag) {
        rowTag.remove();
      }
    }
  } else {
    list = items;
  }

  var listMarkup = list.map(function (o, index) {
    return "<div class=\"col-sm-6 li-".concat(index, "\"><a href=\"").concat(getFullURL(o.NewsItemUrl[0]), "\" class=\"list-item-wrapper\"><div class=\"list-item news\">\n                <div class=\"title-box\"><span class=\"title\">").concat(o.Title, "</span></div>\n                <span class=\"date\"><b>DATE:</b> ").concat(extractDate(o.PublicationDate), "</span>\n                ").concat(getDescription(o.Summary, index), "\n                <div class=\"last-row\">\n                    <span class=\"cta-link\">Read more</span>\n                </div>\n            </div></a></div>");
  }).join('');
  allElement.innerHTML += listMarkup;
  var loaded = parseInt(loadMoreLink.getAttribute('data-loaded')) + count;
  loadMoreLink.setAttribute('data-loaded', loaded);

  if (loaded < total) {
    loadMoreLink.classList.remove("d-none");
  } else {
    loadMoreLink.classList.add("d-none");
  }

  loader.classList.add("d-none");
  initialLoading = false;
  isFiltered = false;
  isLoadMore = false;
  loadMoreLink.classList.remove("in-active");
}

function filterNews() {
  isFiltered = true;
  loadMoreLink.setAttribute('data-loaded', "0");
  allElement.innerHTML = '';
  featureElements.innerHTML = '';
  loader.classList.remove("d-none");
  call_api(ITEMS_TO_LOAD, 0);
}

function getFullURL(url) {
  if (url.substr(0, 1) === "/") {
    return newsPageUrl + url;
  }

  return newsPageUrl + "/" + url;
}

function getDescription(summary, index) {
  var desc;
  if (summary === null || summary === "" || summary.length === 0) desc = "";else {
    desc = "<p>".concat(summary, "</p>");
  }

  if (initialLoading || isFiltered) {
    if (index < 6) {
      return desc;
    }
  } else if (isLoadMore) {
    return "";
  } else {
    if (index < 6) {
      return desc;
    }
  }

  return "";
}

function getImageMarkup(largeImage, smalImage) {
  var mobileImage = "images/Image-desktop-read.jpg";
  var desktopImage = "images/Image-desktop-read.jpg";

  if (document.location.host.indexOf("localhost") === 0) {
    mobileImage = "images/Image-desktop-read.jpg";
    desktopImage = "images/Image-desktop-read.jpg";
  }
  /*if (largeImage.length > 0 && smalImage.length > 0) {
      desktopImage = largeImage[0].Url;
      mobileImage = smalImage[0].Url;
  }*/


  return "<picture class=\"media-box\">\n        <source data-srcset=\"".concat(mobileImage, "\" media=\"(max-width: 640px)\">\n        <source data-srcset=\"").concat(desktopImage, "\" media=\"(min-width: 641px)\">\n        <img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" alt=\"insight image\" class=\"lazyload\">\n    </picture>");
}

function extractDate(dateString) {
  if (dateString === null) {
    return "";
  }

  var d = dateString.split("T")[0].split("-");
  return d[2] + "/" + d[1] + "/" + d[0];
} //Bind click events


loadMoreLink.addEventListener("click", function (e) {
  e.preventDefault();

  if (isLoadMore) {
    return;
  }

  isLoadMore = true;
  loader.classList.remove("d-none");
  loadMoreLink.classList.add("in-active");
  var skipItems = parseInt(loadMoreLink.getAttribute('data-loaded'));
  call_api(ITEMS_TO_LOAD, skipItems);
}); //Call the API

call_api(INITIAL_LOAD, 0);