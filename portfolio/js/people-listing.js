/* globals peopleParentID preFilterServiceID*/
/* exported filterPeopleList peopleTitles itemSelectedEvent */
const loader = document.getElementById("loader");
const service = document.getElementById("filterServices");
const role = document.getElementById("filterRoles");
let peopleList = [];
let peopleTitles = [];
let roles = [
    {"Id": "1", "Title": "Managing Partner", "Visible": "false"},
    {"Id": "2", "Title": "Chair", "Visible": "true"},
    {"Id": "4", "Title": "Partner", "Visible": "true"},
    {"Id": "8", "Title": "Tax Principal", "Visible": "true"},
    {"Id": "16", "Title": "Of Counsel", "Visible": "true"},
    {"Id": "32", "Title": "Associate", "Visible": "true"},
    {"Id": "64", "Title": "PSL", "Visible": "true"},
    {"Id": "128", "Title": "Other Professionals", "Visible": "true"}
];

function call_api() {
    let guid = peopleParentID;
    let api_url = "/js/people-records.json";

    console.log(api_url);
    fetch(api_url)
        .then(response => response.json())
        .then(data => bind_api_data(data))
        .catch(function (error) {
            console.log("An error occurred! " + error);
        });
}

function bind_api_data(json) {
    let items = json.value;
    if (items === undefined) {
        console.log("Invalid data received.");
        console.log(json);
        return;
    }
    //let count = items.length;

    peopleList = items;
    filterPeopleList();
    //bind auto complete search
    bindAutoSearch();
}

function bindList(items, count) {
    const allElement = document.getElementById("listing");

    if (count === 0) {
        allElement.innerHTML = '<div class="col-sm-12 text-center"><p>No record found.</p></div>';
        loader.classList.add("d-none");
        return;
    }

    peopleTitles = items.map( o=> o.Title);
    let listMarkup = items.map(o => `<div class="col-sm-4 ${getClassForFirst(o.PersonRole)}">
        <div class="people-list-card">
            <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="${o.Title}">
            <div class="info-box">
                <div class="highlighted-box">
                    <a href="${o.ViewUrl}" class="title">${o.Title}</a>
                    ${getUserRole(o.CustomRoleTitle, o.PersonRole)}
                </div>
                <span class="contact">${o.PrimaryTelephone}</span>
                <span class="email"><a href="mailto:${o.EmailAddress}">${o.EmailAddress}</a></span>
            </div>
        </div>
    </div>`).join('');

    allElement.innerHTML = listMarkup;
    let firstElement = document.querySelector(".col-sm-4.show-first");
    if (firstElement) {
        let firstMarkup = firstElement.outerHTML;
        firstElement.remove();
        let otherItems = allElement.innerHTML;
        allElement.innerHTML = firstMarkup + otherItems;
    }
    loader.classList.add("d-none");
}

function getImageUrl(objArray) {
    if(objArray.length){
        return objArray[0].Url;
    }else {
        return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    }
}

function getClassForFirst(role) {
    return (role === "1") ? "show-first" : "";
}

function getUserRole(cr, pr) {
    let userRole = '';
    if (cr === null || cr === undefined || cr === "") {
        let myRole = roles.filter(x => x.Id === pr);
        if (myRole.length > 0) {
            userRole = myRole[0].Title;
        }
    } else {
        userRole = cr;
    }
    return `<span class="title-2">${userRole}</span>`;
}

function filterPeopleList() {
    let serviceValue = service.options[service.selectedIndex].value;
    let roleValue = role.options[role.selectedIndex].value;

    let filtered = [];
    for (let i = 0; i < peopleList.length; i++) {
        let p = peopleList[i];
        let servicesMatched = false;
        let roleMatched = false;

        if(serviceValue !== "" && roleValue === ""){
            servicesMatched = p.Services.filter(x => x.Id === serviceValue).length > 0;
        }

        if(roleValue !== "" && serviceValue === ""){
            if (roleValue === "4") {
                roleMatched = p.PersonRole === roleValue || p.PersonRole === "1";
            } else {
                roleMatched = p.PersonRole === roleValue;
            }
        }
        
        if ((roleValue === "" && serviceValue === "") || servicesMatched || roleMatched) {
            filtered.push(p);
        }
    }
    bindList(filtered, filtered.length);
}

function itemSelectedEvent(selectedValue){
    let selItem = peopleList.filter(x => x.Title === selectedValue);
    if(selItem.length > 0) {
        document.location = selItem[0].ViewUrl;
    }
}

let rolesMarkup = roles.filter(x => x.Visible === "true").map(o => `<option value="${o.Id}">${o.Title}</option>`).join('');
role.innerHTML = '<option value="">Filter By Role</option>' + rolesMarkup;
role.selectedIndex = 2;

role.addEventListener("change", function(){
    let serviceValue = service.options[service.selectedIndex].value;
    let roleValue = role.options[role.selectedIndex].value;

    if(roleValue !== "" && serviceValue !== "") {
        service.value = "";
    } else if(roleValue === ""){
        service.value = "";
        role.value = "4";
    }
    filterPeopleList();
});

service.addEventListener("change", function(){
    let serviceValue = service.options[service.selectedIndex].value;
    let roleValue = role.options[role.selectedIndex].value;

    if(serviceValue !== "" && roleValue !== ""){
        role.value = "";
    }
    filterPeopleList();
});

if(preFilterServiceID !== "00000000-0000-0000-0000-000000000000"){
    service.value = preFilterServiceID;
    role.value = "";
}
//Call the API
call_api();
