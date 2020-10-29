/* globals newsPageUrl */
/* exported filterNews */
const ITEMS_TO_LOAD = 12;
const INITIAL_LOAD = 11;
let initialLoading = true;
let isFiltered = false;
let isLoadMore = false;

const loader = document.getElementById("loader");
const loadMoreLink = document.getElementById("loadMoreLink");
const year = document.getElementById("filterYear");
const featureElements = document.getElementById("featured");
const allElement = document.getElementById("listing");

function call_api(count, skip) {
    let params = "&$top=" + count;
    if (skip !== 0) {
        params += "&$skip=" + skip;
    }

    let yearValue = year.options[year.selectedIndex].value;

    if (yearValue !== "") {
        params += "&$filter=year(PublicationDate) eq " + yearValue;
    }else if(isLoadMore === false) {
        initialLoading = true;
    }

    let api_url = "js/news-records.json?" + params;

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
        initialLoading = false;
        isFiltered = false;
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
        firstThreeMarkup = firstThree.map((o, index) => `<div class="col-sm-6 item-${index}"><a href="${getFullURL(o.NewsItemUrl[0])}" class="list-item-wrapper">
<div class="list-item-feature">${getImageMarkup(o.DesktopImage, o.MobileImage)}
<div class="list-item news">
                <div class="title-box"><span class="title">${o.Title}</span></div>
                <span class="date"><b>DATE:</b> ${extractDate(o.PublicationDate)}</span>
                ${getDescription(o.Summary, index)}
                <div class="last-row">
                    <span class="cta-link">Read more</span>
                </div>
            </div></div></a></div>`).join('');

        let signUpMarkup = `<div class="col-sm-6"><div class="sign-up-box dark">
                <span class="text">Sign up to our weekly insights </span>
                 <a href="#" class="cta-link">Subscribe</a>
</div></div><div class="col-sm-6 item-1">`;

        firstThreeMarkup = firstThreeMarkup.replace('<div class="col-sm-6 item-1">', signUpMarkup);
        featureElements.innerHTML = firstThreeMarkup;

        for (let v = 1; v < 3; v++) {
            let pTag = document.querySelector(".col-sm-6.item-" + v + " p");
            if (pTag) {
                pTag.remove();
            }
            let rowTag = document.querySelector(".col-sm-6.item-" + v + " .last-row");
            if (rowTag) {
                rowTag.remove();
            }
        }
    } else {
        list = items;
    }

    let listMarkup = list.map((o, index) => `<div class="col-sm-6 li-${index}"><a href="${getFullURL(o.NewsItemUrl[0])}" class="list-item-wrapper"><div class="list-item news">
                <div class="title-box"><span class="title">${o.Title}</span></div>
                <span class="date"><b>DATE:</b> ${extractDate(o.PublicationDate)}</span>
                ${getDescription(o.Summary, index)}
                <div class="last-row">
                    <span class="cta-link">Read more</span>
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

function getImageMarkup(largeImage, smalImage) {
    let mobileImage = "images/Image-desktop-read.jpg";
    let desktopImage = "images/Image-desktop-read.jpg";
    if (document.location.host.indexOf("localhost") === 0) {
        mobileImage = "images/Image-desktop-read.jpg";
        desktopImage = "images/Image-desktop-read.jpg";
    }

    /*if (largeImage.length > 0 && smalImage.length > 0) {
        desktopImage = largeImage[0].Url;
        mobileImage = smalImage[0].Url;
    }*/
    return `<picture class="media-box">
        <source data-srcset="${mobileImage}" media="(max-width: 640px)">
        <source data-srcset="${desktopImage}" media="(min-width: 641px)">
        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="insight image" class="lazyload">
    </picture>`;
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
    if(isLoadMore){
        return;
    }
    isLoadMore = true;
    loader.classList.remove("d-none");
    loadMoreLink.classList.add("in-active");
    let skipItems = parseInt(loadMoreLink.getAttribute('data-loaded'));
    call_api(ITEMS_TO_LOAD, skipItems)
});

//Call the API
call_api(INITIAL_LOAD, 0);