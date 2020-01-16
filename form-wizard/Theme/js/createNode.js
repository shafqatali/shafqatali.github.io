
// These elements at the top are reference elements to understand what the createNode function needs to make.

//<div id="register-carousel" class="carousel slide vertical" data-ride="carousel" data-interval="false">
/*
<ol class="carousel-indicators">
    <li data-target="#register-carousel" data-slide-to="0" class="active"></li>
    <li data-target="#register-carousel" data-slide-to="1"></li>
    <li data-target="#register-carousel" data-slide-to="2"></li>
    <li data-target="#register-carousel" data-slide-to="3"></li>
    <li data-target="#register-carousel" data-slide-to="4"></li>
    <li data-target="#register-carousel" data-slide-to="5"></li>
</ol>
*/

// Create new node

function createNode() {
    var outerDiv = document.createElement('div');
    var innerDiv = document.createElement('div');
    var container = document.getElementById('C012_Col00');
    var orderList = document.createElement('ol');

    var firstItem = document.getElementsByClassName('item')[0];

    orderList.className = "carousel-indicators";

    for (var i = 0; i < 5; i++) {
        var listItem = document.createElement('li');
        listItem.setAttribute("data-target", "#register-carousel");
        listItem.setAttribute("data-slide-to", i);
        if (i == '0') {
            listItem.className = "active";
        }
        orderList.appendChild(listItem);
    }

    outerDiv.className = "carousel slide vertical";
    outerDiv.id = "register-carousel";
    outerDiv.setAttribute("data-ride", "carousel");
    outerDiv.setAttribute("data-interval", "false");

    innerDiv.className = "carousel-inner";
    innerDiv.setAttribute("role", "listbox");

    while (container.firstChild) {
        innerDiv.appendChild(container.firstChild);
    }

    outerDiv.insertBefore(firstItem, outerDiv.firstChild);

    outerDiv.appendChild(orderList);
    outerDiv.appendChild(innerDiv);
    container.appendChild(outerDiv);

    createNodeComplete = true;
}

createNode();