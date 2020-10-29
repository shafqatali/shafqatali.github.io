/* globals insightPageUrl preFilterServiceID */
/* exported filterInsights */
const ITEMS_TO_LOAD = 12;
const INITIAL_LOAD = 11;
let initialLoading = true;
let isFiltered = false;
let isLoadMore = false;
const loader = document.getElementById("loader");
const loadMoreLink = document.getElementById("loadMoreLink");
const featureElements = document.getElementById("featured");
const allElement = document.getElementById("listing");
const category = document.getElementById("filterCategory");
const year = document.getElementById("filterYear");

function call_api(count, skip) {
    let params = "$top=" + count;
    if (skip !== 0) {
        params += "&$skip=" + skip;
    }

    let categoryValue = category.options[category.selectedIndex].value;
    let yearValue = year.options[year.selectedIndex].value;

    if (categoryValue !== "" && yearValue !== "") {
        params += "&$filter=contains(FilterServicesIDs,'" + categoryValue + "') and  year(InsightDate) eq " + yearValue;
    } else {
        if (categoryValue !== "" && yearValue === "") {
            params += "&$filter=contains(FilterServicesIDs,'" + categoryValue + "')";
        }
        if (yearValue !== "" && categoryValue === "") {
            params += "&$filter=year(InsightDate) eq " + yearValue;
        }
    }

    if (categoryValue === "" && yearValue === "" && isLoadMore === false) {
        initialLoading = true;
    }

    let api_url = "js/insights-records.json?" + params;
    console.log(api_url);
    fetch(api_url)
        .then(response => response.json())
        .then(data => bind_api_data(data))
        .catch(function (error) {
            console.log("An error occurred! " + error);
        });
}

function bind_api_data(json) {
    let total = json["@odata.count"];
    //let context = json["@odata.context"];
    let items = json.value;
    if (items === undefined || total === undefined) {
        console.log("Invalid data received.");
        console.log(json);
        return;
    }
    let count = items.length;
    let firstThree = [];
    let list = [];
    let firstThreeMarkup = '';

    if (count === 0) {
        allElement.innerHTML = '<div class="col-sm-12 text-center"><p>No record found.</p></div>';
        featureElements.innerHTML = '';

        loadMoreLink.classList.add("d-none");
        loader.classList.add("d-none");
        isFiltered = false;
        initialLoading = false;
        isLoadMore = false;
        return;
    }
    if (initialLoading) {
        featureElements.innerHTML = '';
        allElement.innerHTML = '';
        for (let z = 0; z < items.length; z++) {
            if (z < 3) {
                firstThree.push(items[z]);
            } else {
                list.push(items[z]);
            }
        }

        firstThreeMarkup = firstThree.map((o, index) => `<div class="col-sm-6 item-${index}"><a href="${getFullURL(o.UrlName)}" class="list-item-wrapper">
<div class="list-item-feature">${getImageMarkup(o.DesktopImage, o.MobileImage, o.InsightType)}
<div class="list-item">
                <div class="title-box"><span class="title">${o.Title}</span></div>
                <span class="date"><b>DATE:</b> ${extractDate(o.InsightDate)}</span>
                ${getDescription(o.Summary, index)}
                <div class="last-row">
                    <span class="cta-link">Read more</span>
                    ${getAbstract(o.InsightType, o.EngagementTime)}
                </div>
            </div></div></a></div>`).join('');

        let signUpMarkup = `<div class="col-sm-6"><div class="sign-up-box">
                <span class="text">Sign up to our weekly insights </span>
                 <a href="#" class="cta-link">Subscribe</a>
</div></div><div class="col-sm-6 item-1">`;

        firstThreeMarkup = firstThreeMarkup.replace('<div class="col-sm-6 item-1">', signUpMarkup);
        featureElements.innerHTML = firstThreeMarkup;

        for (let v = 1; v < 3; v++) {
            let dateItem = document.querySelector(".col-sm-6.item-" + v + " .date");
            if(dateItem){
                let d1markup = dateItem.outerHTML;
                dateItem.remove();
                document.querySelector(".col-sm-6.item-" + v + " .last-row .cta-link").outerHTML = d1markup;
                let pTag = document.querySelector(".col-sm-6.item-" + v + " p");
                if (pTag) {
                    pTag.remove();
                }
            }
        }
    } else {
        //featureElements.innerHTML = '';
        list = items;
    }

    let listMarkup = list.map((o, index) => `<div class="col-sm-6 li-${index}"><a href="${getFullURL(o.UrlName)}" class="list-item-wrapper"><div class="list-item">
                <div class="title-box"><span class="title">${o.Title}</span></div>
                <span class="date"><b>DATE:</b> ${extractDate(o.InsightDate)}</span>
                ${getDescription(o.Summary, index)}
                <div class="last-row">
                    <span class="cta-link">Read more</span>
                    ${getAbstract(o.InsightType, o.EngagementTime)}
                </div>
            </div></a></div>`).join('');

    allElement.innerHTML += listMarkup;

    let loaded = parseInt(loadMoreLink.getAttribute('data-loaded')) + count;
    loadMoreLink.setAttribute('data-loaded', loaded);
    if (loaded < total) {
        loadMoreLink.classList.remove("d-none");
    } else {
        loadMoreLink.classList.add("d-none");
    }
    loader.classList.add("d-none");
    isFiltered = false;
    initialLoading = false;
    isLoadMore = false;
    loadMoreLink.classList.remove("in-active");
}

function getFullURL(url) {
    if (url.substr(0, 1) === "/") {
        return insightPageUrl + url;
    }
    return insightPageUrl + "/" + url;
}

function filterInsights() {
    isFiltered = true;
    loadMoreLink.setAttribute('data-loaded', "0");
    allElement.innerHTML = '';
    featureElements.innerHTML = '';
    loader.classList.remove("d-none");
    call_api(ITEMS_TO_LOAD, 0);
}

function getDescription(summary, index) {
    let desc;
    if (summary === null || summary === "" || summary.length === 0)
        desc = "";
    else {
        desc = `<p>${summary}</p>`;
    }

    if ((initialLoading || isFiltered)) {
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

function getImageMarkup(largeImage, smalImage, type) {
    let mobileImage = "images/Image-desktop-read.jpg";
    let desktopImage = "images/Image-desktop-read.jpg";
    if (document.location.host.indexOf("localhost") === 0) {
        mobileImage = "images/Image-desktop-read.jpg";
        desktopImage = "images/Image-desktop-read.jpg";
    }
    let typeClass = getTypeName(type)[0];
    if (largeImage.length > 0 && smalImage.length > 0) {
        desktopImage = largeImage[0].Url;
        mobileImage = smalImage[0].Url;
    }
    return `<picture class="media-box ${typeClass}">
        <source data-srcset="${mobileImage}" media="(max-width: 640px)">
        <source data-srcset="${desktopImage}" media="(min-width: 641px)">
        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="insight image" class="lazyload">
    </picture>`;
}

function getAbstract(type, time) {
    if (time == null)
        return '';
    let typeClass = getTypeName(type);
    if(typeClass[1] === "read"){
        return `<span class="icon ${typeClass[0]}">${time} min ${typeClass[1]}</span>`
    }else {
        return `<span class="icon ${typeClass[0]}">${time} ${typeClass[1]}</span>`
    }
}

function getTypeName(type) {
    let typeName;
    let typeClass;
    switch (type) {
        case "1":
            typeName = "read";
            typeClass = "read";
            break;
        case "2":
            typeName = "podcast";
            typeClass = "listen";
            break;
        case "4":
            typeName = "video";
            typeClass = "watch";
            break;
        default:
            typeName = "read";
            typeClass = "read";
            break;
    }
    return [typeClass, typeName];
}

function extractDate(dateString) {
    if (dateString === null) {
        return "";
    }
    let d = dateString.split("T")[0].split("-");
    return d[2] + "/" + d[1] + "/" + d[0];
}

//Bind click events
loadMoreLink.addEventListener("click", function (e) {
    e.preventDefault();
    if(isLoadMore)
        return;
    isLoadMore = true;
    loadMoreLink.classList.add("in-active");
    loader.classList.remove("d-none");
    let skipItems = parseInt(loadMoreLink.getAttribute('data-loaded'));
    call_api(ITEMS_TO_LOAD, skipItems)
});

if(preFilterServiceID !== "00000000-0000-0000-0000-000000000000"){
    category.value = preFilterServiceID;
    isFiltered = true;
    initialLoading = false;
}
//Call the API
call_api(INITIAL_LOAD, 0);
