"use strict";

/* exported CallCaseStudy */
function CallCaseStudy(skipCount) {
  $.ajax({
    type: "GET",
    //GET or POST or PUT or DELETE verb
    url: "js/clients-widget/clients-data.json",
    // Location of the service
    data: 'skipCount=' + skipCount,
    //Data sent to server
    contentType: "application/json; charset=utf-8",
    // content type sent to server
    dataType: "json",
    //Expected data format from server
    processdata: true,
    //True or False
    success: function success(msg) {
      //On Successfull service call
      CaseStudySucceeded(msg, skipCount);
    },
    error: function error(xhr, textStatus, _error) {
      ServiceFailed(xhr, textStatus, _error);
    } // When Service call fails

  });
}

function CaseStudySucceeded(result, skipCount) {
  var uniqueId = parseInt(skipCount);
  $.each(result, function (index, val) {
    var count = 0;
    var casestudyItem = "";

    for (var i in val.SpotlightItems) {
      if (val.SpotlightItems[i].ItemCount == 1) {
        count++;
      }

      var myClass = "";

      if (val.SpotlightItems[i].ImageStyle == 'Background') {
        myClass = "spot-image-is-bg";
      } else {
        myClass = "spot-image-is-bg";
      }

      uniqueId += 1;
      casestudyItem += "<a id=\"cs-" + uniqueId + "\" data-column=\"col" + count + "\" data-order=\"" + uniqueId + "\" class=\"image-block " + myClass + " grid-item\" href=\"" + val.SpotlightItems[i].Page + "\">";
      casestudyItem += "<div class=\"text-wraper " + val.SpotlightItems[i].TextStyle + "\" data-bg=\"#" + val.SpotlightItems[i].ActiveColour + "\">";
      casestudyItem += "<span class=\"client\">" + val.SpotlightItems[i].ClientItem + "</span>";
      casestudyItem += "<span class=\"title\">" + val.SpotlightItems[i].Title + "</span>";
      casestudyItem += "<span data-url=\"" + val.SpotlightItems[i].Page + "\" class=\"btn btn-view\" tabindex='0'>View Case Study</span>";
      casestudyItem += "</div>";
      casestudyItem += "<div class='imgs'>";
      casestudyItem += "<img class='list' alt=\"" + val.SpotlightItems[i].SpotlightImageAlt + "\" src=\"" + val.SpotlightItems[i].ListViewImage.replace("~", "") + "\" />";
      casestudyItem += "<img class='grid' alt=\"" + val.SpotlightItems[i].SpotlightImageAlt + "\" src=\"" + val.SpotlightItems[i].SpotlightImage.replace("~", "") + "\" />";
      casestudyItem += "</div>";
      casestudyItem += "</a>";
      $(".case-studies .items.col" + count).append(casestudyItem);
      casestudyItem = "";
    }

    if (val.Remaining == false) {
      $('.loadMore').hide();
      $('#loadMoreList').hide();
    } else {
      $('#skip').text(parseInt(skipCount) + 12);
    }

    reArrangeNewItems();
  });
}

function ServiceFailed(xhr, textStatus, error) {
  Type = null;
  varUrl = null;
  Data = null;
  ContentType = null;
  DataType = null;
  ProcessData = null;

  if (xhr.responseText) {
    var err = xhr.responseText;

    if (err) {
      console.log("Error : " + error);
      console.log("Error Status: " + xhr.status + " " + xhr.statusText);
    } else {
      console.log({
        Message: "Unknown server error."
      });
    }
  }

  return;
}