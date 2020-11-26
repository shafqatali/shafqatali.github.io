/* globals Vue FilterComponent */
/* exported screen_change_spotlight_filter page_ready_spotlight_filter */
//code for screen change event goes here
//this function will be called from global layout
function screen_change_spotlight_filter() {
    //do nothing for now
    //use this function if you want to do something on screen change event
}

function page_ready_spotlight_filter() {
    if ($('#spotlightFilterApp').length) {
        new Vue({
            el: "#spotlightFilterApp",
            name: "filterAppSpotlightFilter",
            components: {
                spotlightFilter: FilterComponent
            }
        });
    }
}
