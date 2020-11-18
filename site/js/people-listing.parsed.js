"use strict";

/* globals peopleParentID preFilterServiceID*/

/* exported filterPeopleList peopleTitles itemSelectedEvent */
var loader = document.getElementById("loader");
var service = document.getElementById("filterServices");
var role = document.getElementById("filterRoles");
var peopleList = [];
var peopleTitles = [];
var roles = [{
  "Id": "1",
  "Title": "Managing Partner",
  "Visible": "false"
}, {
  "Id": "2",
  "Title": "Chair",
  "Visible": "true"
}, {
  "Id": "4",
  "Title": "Partner",
  "Visible": "true"
}, {
  "Id": "8",
  "Title": "Tax Principal",
  "Visible": "true"
}, {
  "Id": "16",
  "Title": "Of Counsel",
  "Visible": "true"
}, {
  "Id": "32",
  "Title": "Associate",
  "Visible": "false"
}, {
  "Id": "64",
  "Title": "PSL",
  "Visible": "false"
}, {
  "Id": "128",
  "Title": "Other Professionals",
  "Visible": "true"
}];

function call_api() {
  var guid = peopleParentID;
  var api_url = "js/people-records.json";
  fetch(api_url).then(function (response) {
    return response.json();
  }).then(function (data) {
    return bind_api_data(data);
  })["catch"](function (error) {
    console.log("An error occurred! " + error);
  });
}

function bind_api_data(json) {
  var items = json.value;

  if (items === undefined) {
    console.log("Invalid data received.");
    console.log(json);
    return;
  } //let count = items.length;


  peopleList = items;
  filterPeopleList(); //bind auto complete search

  bindAutoSearch();
}

function bindList(items, count) {
  var allElement = document.getElementById("listing");

  if (count === 0) {
    allElement.innerHTML = '<div class="col-sm-12 text-center"><p>No record found.</p></div>';
    loader.classList.add("d-none");
    return;
  }

  peopleTitles = items.map(function (o) {
    return o.Title;
  });
  var listMarkup = items.map(function (o) {
    return "<div class=\"col-sm-4 ".concat(getClassForFirst(o.PersonRole), "\">\n        <div class=\"people-list-card\">\n            <img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" class=\"lazyload\" alt=\"").concat(o.Title, "\">\n            <div class=\"info-box\">\n                <div class=\"highlighted-box\">\n                    <a href=\"").concat(o.ViewUrl, "\" class=\"title\">").concat(o.Title, "</a>\n                    ").concat(getUserRole(o.CustomRoleTitle, o.PersonRole), "\n                </div>\n                <span class=\"contact\">").concat(o.PrimaryTelephone, "</span>\n                <span class=\"email\"><a href=\"mailto:").concat(o.EmailAddress, "\">").concat(o.EmailAddress, "</a></span>\n            </div>\n        </div>\n    </div>");
  }).join('');
  allElement.innerHTML = listMarkup;
  var firstElement = document.querySelector(".col-sm-4.show-first");

  if (firstElement) {
    var firstMarkup = firstElement.outerHTML;
    firstElement.remove();
    var otherItems = allElement.innerHTML;
    allElement.innerHTML = firstMarkup + otherItems;
  }

  loader.classList.add("d-none");
}

function getImageUrl(objArray) {
  if (objArray.length) {
    return objArray[0].Url;
  } else {
    return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  }
}

function getClassForFirst(role) {
  return role === "1" ? "show-first" : "";
}

function getUserRole(cr, pr) {
  var userRole = '';

  if (cr === null || cr === undefined || cr === "") {
    var myRole = roles.filter(function (x) {
      return x.Id === pr;
    });

    if (myRole.length > 0) {
      userRole = myRole[0].Title;
    }
  } else {
    userRole = cr;
  }

  return "<span class=\"title-2\">".concat(userRole, "</span>");
}

function filterPeopleList() {
  var serviceValue = service.options[service.selectedIndex].value;
  var roleValue = role.options[role.selectedIndex].value;
  var filtered = [];

  for (var i = 0; i < peopleList.length; i++) {
    var p = peopleList[i];
    var servicesMatched = false;
    var roleMatched = false;

    if (serviceValue !== "" && roleValue === "") {
      servicesMatched = p.Services.filter(function (x) {
        return x.Id === serviceValue;
      }).length > 0;
    }

    if (roleValue !== "" && serviceValue === "") {
      if (roleValue === "4") {
        roleMatched = p.PersonRole === roleValue || p.PersonRole === "1";
      } else {
        roleMatched = p.PersonRole === roleValue;
      }
    }

    if (roleValue === "" && serviceValue === "" || servicesMatched || roleMatched) {
      filtered.push(p);
    }
  }

  bindList(filtered, filtered.length);
}

function itemSelectedEvent(selectedValue) {
  var selItem = peopleList.filter(function (x) {
    return x.Title === selectedValue;
  });

  if (selItem.length > 0) {
    document.location = selItem[0].ViewUrl;
  }
}

var rolesMarkup = roles.filter(function (x) {
  return x.Visible === "true";
}).map(function (o) {
  return "<option value=\"".concat(o.Id, "\">").concat(o.Title, "</option>");
}).join('');
role.innerHTML = '<option value="">Filter By Role</option>' + rolesMarkup;
role.selectedIndex = 2;
role.addEventListener("change", function () {
  var serviceValue = service.options[service.selectedIndex].value;
  var roleValue = role.options[role.selectedIndex].value;

  if (roleValue !== "" && serviceValue !== "") {
    service.value = "";
  } else if (roleValue === "") {
    service.value = "";
    role.value = "4";
  }

  filterPeopleList();
});
service.addEventListener("change", function () {
  var serviceValue = service.options[service.selectedIndex].value;
  var roleValue = role.options[role.selectedIndex].value;

  if (serviceValue !== "" && roleValue !== "") {
    role.value = "";
  }

  filterPeopleList();
});

if (preFilterServiceID !== "00000000-0000-0000-0000-000000000000") {
  service.value = preFilterServiceID;
  role.value = "";
} //Call the API


call_api();