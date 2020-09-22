/* globals paginateComponent desktop Vue easydropdown checkRequiredParent*/
/* exported page_ready_searchable_data_table screen_change_searchable_data_table */
var searchAbleDataTableVueApp;
var SearchAbleDataTableComponent = {
    name: "searchAbleDataTable",
    template: "#searchAbleDataTableTemplate",
    components: {
        pagination: paginateComponent
    },
    props: {},
    data: function () {
        return {
            filterData: window.filterListing,
            allOrFiltered: window.tableJson,
            pageData: null,
            noDataFound: false,
            expandedIndex: -1,
            defaultActive: -1,
            useFilters: false,
            mobileFilter: false,
            filterParams: [],
            mobileFilterText: ""
        }
    },
    methods: {
        getFilterState: function (filterFieldName) {
            var filterObj = this.getFilterKey(filterFieldName);
            if (filterObj) {
                return filterObj.filtered;
            }
            return true;
        },
        getFilterKey: function (filterFieldName) {
            var filterObj = this.filterParams[filterFieldName];
            if (filterObj) {
                return filterObj;
            }
            return false;
        },
        addFilterKeys: function () {
            var keys = [];
            for (var k = 0; k < this.filterData.checkBoxes.length; k++) {
                var keyNameA = this.filterData.checkBoxes[k].fieldName;
                var matchA = this.filterData.checkBoxes[k].match;
                var titleA = this.filterData.checkBoxes[k].title;
                var filterItemA = {"filtered": false, inputType: "checkbox", "classSelector": "filter-options", "selected": [],"match": matchA,"title": titleA};
                keys[keyNameA] = filterItemA;
            }
            for (var l = 0; l < this.filterData.dropDowns.length; l++) {
                var keyNameB = this.filterData.dropDowns[l].fieldName;
                var matchB = this.filterData.dropDowns[l].match;
                var titleB = this.filterData.checkBoxes[l].title;
                var filterItemB = {"filtered": false, inputType: "select", "classSelector": "filter-single", "selected": [],"match": matchB,"title": titleB};
                keys[keyNameB] = filterItemB;
            }
            for (var m = 0; m < this.filterData.textBoxes.length; m++) {
                var keyNameC = this.filterData.textBoxes[m].fieldName;
                var matchC = this.filterData.textBoxes[m].match;
                var titleC = this.filterData.checkBoxes[m].title;
                var filterItemC = {"filtered": false, inputType: "text", "classSelector": "filter-text", "selected": [],"match": matchC,"title": titleC};
                keys[keyNameC] = filterItemC;
            }
            this.filterParams = keys;

        },
        getClassName: function (state, value) {
            if (value === 0) {
                return (state) ? "d-none" : "d-block";
            }
            if (value === 1) {
                return (state) ? "d-block" : "d-none";
            }
        },
        getUniqueId: function (prefix, outerIndex, innerIndex) {
            return prefix + '-' + (outerIndex + 1) + '-' + (innerIndex + 1);
        },
        closeDropdown: function () {
            this.expandedIndex = this.defaultActive;
        },
        expandFilterItems: function (index) {
            if (this.expandedIndex === index) {
                this.expandedIndex = this.defaultActive;
            } else {
                this.expandedIndex = index;
            }
            closeDropdowns();
        },
        applyMobileFilter: function () {
            this.showFilterItems('');
            this.filterList();
            this.toggleFilters();
        },
        applyFilter: function () {
            this.showFilterItems('');
            this.filterList();
        },
        getSelectedValues: function() {
            var totalSelected = 0;
            var selections = [];
            var textValues = document.querySelectorAll('.filter-text');
            //iterate text
            for (var ti = 0; ti < textValues.length; ti++) {
                var txtValue = textValues[ti].value;
                if (txtValue !== "") {
                    var txtField = textValues[ti].getAttribute("data-type");
                    selections.push({"fieldName": txtField, "value": txtValue});
                    totalSelected +=1;
                }
            }
            if (desktop) {
                var cbSelections = document.querySelectorAll('.filter-options input[type="checkbox"]:checked');
                var selectValues = document.querySelectorAll('.filter-single');

                //iterate checkboxes
                for (var j = 0; j < cbSelections.length; j++) {
                    var cbValue1 = cbSelections[j].value;
                    var checkBoxType = cbSelections[j].getAttribute("class");
                    checkBoxType = checkBoxType.replace("filter-checkbox ","");
                    selections.push({"fieldName": checkBoxType, "value": cbValue1});
                }

                //iterate selects
                for (var si = 0; si < selectValues.length; si++) {
                    var selValue = selectValues[si].value;
                    if (selValue !== "") {
                        var selField = selectValues[si].getAttribute("data-type");
                        selections.push({"fieldName": selField, "value": selValue});
                    }
                }
            } else {
                var mobileCheckedInputs = document.querySelectorAll('.filter-box input:checked');
                //iterate checkboxes
                for (var mci = 0; mci < mobileCheckedInputs.length; mci++) {
                    var mcValue = mobileCheckedInputs[mci].value;
                    var mcField = mobileCheckedInputs[mci].getAttribute("class");
                    selections.push({"fieldName": mcField, "value": mcValue});
                    totalSelected +=1;
                }
            }
            var keys = Object.keys(this.filterParams);

            //update selected values into list
            for(var a=0; a< keys.length; a++){
                var values = [];
                var keyName = keys[a];
                for (var s = 0; s < selections.length; s++) {
                    if (selections[s].fieldName === keyName) {
                        values.push(selections[s].value);
                    }
                }
                this.filterParams[keyName].filtered = values.length > 0;
                this.filterParams[keyName].selected = values;
                //show selected counts
                var kType = this.filterParams[keyName].inputType;
                if(kType === "checkbox"){
                    var displayText = this.filterParams[keyName].title;
                    var mobileText = (values.length > 0) ? (values.length + "  selected") : "All";
                    if(values.length > 0) {
                        displayText = values.length + " Selected";
                        document.querySelectorAll('.filter-wrap .multi-select .filter-title.'+ keyName)[0].classList.add('selected');
                    }else {
                        document.querySelectorAll('.filter-wrap .multi-select .filter-title.'+ keyName)[0].classList.remove('selected');
                    }
                    document.querySelectorAll('.filter-wrap .multi-select .filter-title.'+ keyName)[0].textContent = displayText;

                    document.querySelectorAll('.filters-box .filter-box.'+ keyName +' .selection')[0].textContent = mobileText;
                    if(mobileText !== "All"){
                        document.querySelectorAll('.filters-box .filter-box.'+ keyName)[0].classList.add('filtered');
                    }else {
                        document.querySelectorAll('.filters-box .filter-box.'+ keyName)[0].classList.remove('filtered');
                    }
                }
                if(kType === "select") {
                    var selectLabel = (values.length) ? values[0] : "All";
                    document.querySelectorAll('.filters-box .filter-box.'+ keyName +' .selection')[0].textContent = selectLabel;
                    if(selectLabel !== "All"){
                        document.querySelectorAll('.filters-box .filter-box.'+ keyName +' .clear-btn')[0].classList.remove('d-none');
                        document.querySelectorAll('.filters-box .filter-box.'+ keyName +'')[0].classList.add('filtered');
                    }else {
                        document.querySelectorAll('.filters-box .filter-box.'+ keyName +' .clear-btn')[0].classList.add('d-none');
                        document.querySelectorAll('.filters-box .filter-box.'+ keyName +'')[0].classList.remove('filtered');
                    }
                }
                this.mobileFilterText = totalSelected + ' selected';
            }
            return selections.length;
        },
        filterList: function () {
            var selectedCount = this.getSelectedValues();
            if (selectedCount > 0) {
                var dataSet = window.tableJson;
                var keys = Object.keys(this.filterParams);
                var filteredItems = [];
                for (var c = 0; c < dataSet.length; c++) {
                    var dataItem = dataSet[c];
                    var matchCount = 0;
                    for (var k = 0; k < keys.length; k++) {
                        var key = keys[k];
                        var valueToCheck = dataItem[key];
                        var mType = this.filterParams[key].match;
                        var list = this.filterParams[key].selected;
                        var match = true;
                        if(list.length > 0) {
                            if(mType === "equals"){
                               match = list.indexOf(valueToCheck) >= 0;
                            }else if(mType === "like"){
                                var likeFound = false;
                                for (var y = 0; y < list.length; y++) {
                                    var matchText = list[y].toLowerCase();
                                    if(valueToCheck.toLowerCase().indexOf(matchText) >= 0){
                                        likeFound = true;
                                    }
                                }
                                match = likeFound;
                            }
                        }
                        if(match){
                            matchCount +=1;
                        }
                    }//end for keys
                    if(keys.length === matchCount){
                        filteredItems.push(dataItem);
                    }
                }
                this.allOrFiltered = filteredItems;
                this.useFilters = true;
                if (filteredItems.length === 0) {
                    this.noDataFound = true;
                } else {
                    this.noDataFound = false;
                }
            } else {
                this.useFilters = false;
                this.noDataFound = false;
                this.allOrFiltered = window.tableJson;
            }
            this.$refs.paginate.updateSource(this.allOrFiltered);
        },

        clearFilters: function (filterType) {
            var queryCheckboxes = '#searchAbleDataTable input:checked';
            var querySelects = '.filter-single';
            var queryTexts = '.filter-text';
            if (filterType !== '') {
                queryCheckboxes = '#searchAbleDataTable .'+ filterType+':checked';
                querySelects = '#searchAbleDataTable [data-type="'+ filterType+'"]';
                queryTexts = '#searchAbleDataTable [data-type="'+ filterType+'"]';
                this.filterParams[filterType].filtered = false;
                this.filterParams[filterType].selected = [];
            }else {
                var params = Object.keys(this.filterParams);
                for(var p=0; p< params.length; p++){
                    var key = params[p];
                    this.filterParams[key].filtered = false;
                    this.filterParams[key].selected = [];
                }
            }
            var checkboxes = document.querySelectorAll(queryCheckboxes);
            for (var c = 0; c < checkboxes.length; c++) {
                checkboxes[c].checked = false;
            }

            var filterSelects = document.querySelectorAll(querySelects);
            for (var i = 0; i < filterSelects.length; i++) {
                filterSelects[i].value = ""
            }

            var filterTexts = document.querySelectorAll(queryTexts);
            for (var t = 0; t < filterTexts.length; t++) {
                filterTexts[t].value = ""
            }
            this.filterList();
        },
        toggleFilters: function (closeThis) {
            if (closeThis) {
                this.mobileFilter = false;
            } else {
                this.mobileFilter = !this.mobileFilter;
            }
            this.showFilterItems('');
            if (this.mobileFilter) {
                document.getElementsByTagName('body')[0].classList.add('disallow-scroll');
            } else {
                document.getElementsByTagName('body')[0].classList.remove('disallow-scroll');
            }
        },
        showFilterItems: function (filterType) {
            if (filterType === '') {
                document.getElementById('mobileFiltersWrapper').classList.remove('expanded');
                document.querySelectorAll('#mobileFiltersWrapper .filter-lbl')[0].textContent = "Filters";
                var itemShown = document.querySelectorAll('.mobile-filters .filter-box.show-items');
                if(itemShown.length){
                    itemShown[0].classList.remove('show-items');
                }
            } else {
                var thisLabel = document.querySelectorAll('.mobile-filters .filter-box.' + filterType + ' .box-title .title')[0].textContent;
                document.getElementById('mobileFiltersWrapper').classList.add('expanded');
                document.querySelectorAll('#mobileFiltersWrapper .filter-lbl')[0].textContent = thisLabel;
                document.querySelectorAll('.mobile-filters .filter-box.' + filterType)[0].classList.add('show-items');
            }
        },
        renderStatus: function (status, link) {
            if (status === "Download") {
                return '<a target="_blank" href="/' + link + '" class="download-icon">' + status + '</a>';
            } else {
                return status;
            }
        },
        handleScreenChange: function () {
            this.mobileFilter = false;
            this.clearFilters('');
        },
        updatePage: function (page_list, eventType) {
            this.pageData = null;
            this.pageData = page_list;
            scrollToTop();
            eventType;
            //TODO: you can add custom code here
        }
    },
    mounted: function () {
        this.addFilterKeys();
        bindEasyDropDown();
        document.getElementById('searchAbleDataTable').classList.remove('loading-app');
    }
};

function bindSearchAbleDataTable() {
    if ($("#searchAbleDataTable").length) {
        searchAbleDataTableVueApp = new Vue({
            el: "#searchAbleDataTable",
            name: "searchAbleDataTableVueApp",
            components: {
                searchAbleDataTable: SearchAbleDataTableComponent
            }
        });

        $(document).click(function (event) {
            var obj = event.target;//returns the object on which click event triggered
            var requiredIds = ".multi-select";
            var target = $(obj);
            if (checkRequiredParent(target, requiredIds) == false) {
                //close dropdown of Vue App
                searchAbleDataTableVueApp.$refs.listener.closeDropdown();
            }
        });
    }
}

function scrollToTop() {
    $('html, body').stop().animate({scrollTop: $('.vue-app-wrapper').offset().top}, 500);
}

function bindEasyDropDown() {
    easydropdown.all({
        behavior: {
            openOnFocus: false,
            loop: true,
            useNativeUiOnMobile: false,
        },
        callbacks: {
            onSelect: function (value) {
                value;
                searchAbleDataTableVueApp.$refs.listener.filterList();
            },
            onOpen: function (value) {
                value;
                searchAbleDataTableVueApp.$refs.listener.closeDropdown();
            }
        },
        classNames: {
            select: 'edd-select filter-single'
        }
    });
}

function closeDropdowns() {
    $('.edd-root').attr('class', 'edd-root').attr('aria-expanded', 'false');
}

function handleKeys() {
    $(document).keydown(function (e) {
        var obj = (e.target ? e.target : e.srcElement);
        var target = $(obj);
        var targetObj = checkRequiredParent(target, ".multi-select");
        var isOptionObj = checkRequiredParent(target, ".multi-select .filter-options");
        if (targetObj || isOptionObj) {
            switch (e.keyCode) {
                case 9://tab key
                    break;
                case 27:// ESC key
                    e.preventDefault();
                    $('.filter-set.multi-select').removeClass('active');
                    break;
                case 38://Arrow Up
                    if (isOptionObj) {
                        e.preventDefault();
                        var eIndex = $('input.filter-checkbox').index(document.activeElement) - 1;
                        $('input.filter-checkbox').eq(eIndex).focus();
                    }
                    break;
                case 37://Arrow Left
                case 39://Arrow Right
                    e.preventDefault();
                    break;
                case 40://Arrow Down
                    if (isOptionObj) {
                        e.preventDefault();
                        var oIndex = $('input.filter-checkbox').index(document.activeElement) + 1;
                        $('input.filter-checkbox').eq(oIndex).focus();
                    }
                    break;
                case 32://SPACE key
                    break;
                case 13://ENTER key
                    if (isOptionObj) {
                        e.preventDefault();
                        $(obj).trigger('click');
                    }
                    break;
                default:
                    break;
            }
            if (e.keyCode >= 65 && e.keyCode <= 90) {
                if (e.keyCode === 65) {
                    $('.multi-select .filter-options .options-list .styled-checkbox:first-of-type input[type="checkbox"]').focus();
                } else {
                    var char = String.fromCharCode(e.keyCode - 1);
                    var selector = '.multi-select .filter-options input[type="checkbox"][value^="' + char + '"]';
                    $(selector).parent().addClass('pressed');
                    $('.multi-select .filter-options .styled-checkbox.pressed + .styled-checkbox input[type="checkbox"]').focus();
                    $('.styled-checkbox').removeClass('pressed');
                }
            }
        }
    });
}

function page_ready_searchable_data_table() {
    handleKeys();
    bindSearchAbleDataTable();
}

function screen_change_searchable_data_table() {
    if (desktop) {
        if (searchAbleDataTableVueApp) {
            searchAbleDataTableVueApp.$refs.listener.toggleFilters(true);
        }
    }
}