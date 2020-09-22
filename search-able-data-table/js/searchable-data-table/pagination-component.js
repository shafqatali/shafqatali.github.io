/*
* Pagination Component For Vue.JS
* This component has six input parameters
*
* data-list: Which should be an Array
* page-size: it should be a number, no of item(s) to show on the page
* paging-links: it should be a number, no of links to show
* jump-links: it should be a boolean, first/last links will be shown if its true
* query-parameter: it should be a string, parameter name in the URL for page number
* dynamic-routing: it should be a boolean, new links will be created for page(s) if its true
*
* @update-page: emits data which should be handled in the parent component, it pass the data array for the current page
*               and event type to parent's component.
*               NOTE: we can use either @ OR v-on its same thing.
* Here is the sample code to use this component
* <pagination v-bind:data-list="eventsData" v-bind:page-size="6" v-bind:paging-links="5" @update-page="updatePage"
        v-bind:query-parameter="'pn'" v-bind:dynamic-routing="true" v-bind:jump-links="true"></pagination>
*/
/* exported paginateComponent */
const paginateComponent = {
    template: `<nav v-if="TotalPages > 1" class="pagination-nav" v-bind:class="Wrapper_Class" role="navigation" aria-label="Pagination Navigation">
        <ol class="pagination justify-content-sm-center justify-content-between" v-if="SeparateUrl === true">
            <li v-if="Jump_Links" class="page-item d-none d-sm-inline-block" v-bind:class="{disabled: CurrentPage == 1}">
                <a class="page-link" v-bind:aria-disabled="CurrentPage == 1" v-bind:href="'?' + Query_Parameter + '=1'" aria-label="Goto First Page">First</a>
            </li>
            <li class="page-item" v-bind:class="{disabled: CurrentPage == 1}">
                <a class="page-link" v-bind:aria-disabled="CurrentPage == 1" v-bind:href="'?' + Query_Parameter + '=' + (CurrentPage - 1)" aria-label="Goto Previous Page">Previous</a>
            </li>
            <li class="page-item" v-for="n in TotalPages" v-if="pageLimit(n)" v-bind:class="getItemClasses(n)">
                <a class="page-link" v-bind:href="'?' + Query_Parameter +'=' + n" v-bind:aria-label="getLinkAriaLabel(n)" v-html="n">2</a>
            </li>
            <li class="page-item" v-bind:class="{disabled: CurrentPage == TotalPages}">
                <a class="page-link" v-bind:aria-disabled="CurrentPage == TotalPages" v-bind:href="'?' + Query_Parameter +'=' + (CurrentPage + 1)" aria-label="Goto Next Page">Next</a>
            </li>
            <li v-if="Jump_Links" class="page-item d-none d-sm-inline-block" v-bind:class="{disabled: CurrentPage == TotalPages}">
                <a class="page-link" v-bind:aria-disabled="CurrentPage == TotalPages" v-bind:href="'?' + Query_Parameter +'=' + TotalPages" aria-label="Goto last Page">Last</a>
            </li>
        </ol>
        <ol class="pagination justify-content-sm-center justify-content-between" v-if="SeparateUrl === false">
            <li v-if="Jump_Links" class="page-item d-none d-sm-inline-block" v-bind:class="{disabled: CurrentPage == 1}">
                <a class="page-link" v-bind:aria-disabled="CurrentPage == 1" href="#first"
                   v-on:click.stop.prevent="getPageData(1,'link')" aria-label="Goto First Page">First</a>
            </li>
            <li class="page-item" v-bind:class="{disabled: CurrentPage == 1}">
                <a class="page-link" v-bind:aria-disabled="CurrentPage == 1" href="#previous"
                   v-on:click.stop.prevent="getPageData('prev','link')" aria-label="Goto Previous Page">Previous</a>
            </li>
            <li class="page-item" v-for="n in TotalPages" v-if="pageLimit(n)" v-bind:class="getItemClasses(n)">
                <a class="page-link" v-bind:href="n" v-on:click.stop.prevent="getPageData(n,'link')" v-bind:aria-label="getLinkAriaLabel(n)" v-html="n">2</a>
            </li>
            <li class="page-item" v-bind:class="{disabled: CurrentPage == TotalPages}">
                <a class="page-link" v-bind:aria-disabled="CurrentPage == TotalPages" href="#next" v-on:click.stop.prevent="getPageData('next','link')" aria-label="Goto Next Page">Next</a>
            </li>
            <li v-if="Jump_Links" class="page-item d-none d-sm-inline-block" v-bind:class="{disabled: CurrentPage == TotalPages}">
                <a class="page-link" v-bind:aria-disabled="CurrentPage == TotalPages" href="#last" v-on:click.stop.prevent="getPageData(TotalPages,'link')" aria-label="Goto last Page">Last</a>
            </li>
        </ol>
        <p class="paging-summary text-center">Displaying <span v-html="StartNumber"></span> - <span v-html="EndNumber"></span> of <span v-html="TotalRecords"></span></p>
    </nav>`,
    props: {
        dataList: Array,
        pagingLinks: {
            type: Number,
            default: 5
        },
        pageSize: {
            type: Number,
            default: 10
        },
        jumpLinks: {
            type: Boolean,
            default: false
        },
        dynamicRouting: {
            type: Boolean,
            default: false
        },
        queryParameter: {
            type: String,
            default: "page"
        },
        wrapperClass: {
            type: String,
            default: "page"
        }
    },
    data: function () {
        return {
            page_size: 10,
            paging_links: 5,
            Jump_Links: false,
            Query_Parameter: "page",
            Wrapper_Class: "",
            SeparateUrl: false,
            CurrentPage: 1,
            TotalPages: 0,
            TotalRecords: 0,
            StartNumber: 0,
            EndNumber: 0
        }
    },
    mounted: function () {
        //assign properties to data if its not undefined
        if (this.pagingLinks) {
            this.paging_links = this.pagingLinks
        }
        if (this.pageSize) {
            this.page_size = this.pageSize
        }
        if (this.jumpLinks) {
            this.Jump_Links = this.jumpLinks
        }

        if (this.dynamicRouting) {
            this.SeparateUrl = this.dynamicRouting
        }
        if (this.queryParameter) {
            this.Query_Parameter = this.queryParameter
        }
        if (this.wrapperClass) {
            this.Wrapper_Class = this.wrapperClass
        }

        let page_num = 1;
        if (this.SeparateUrl) {
            page_num = this.getQueryParameter();
        }
        this.CurrentPage = page_num;
        this.getTotalPages();
        this.getPageData(page_num, 'default');
    },
    methods: {
        getLinkAriaLabel: function(n){
            if(n === this.CurrentPage){
                return "Current Page, Page " + n;
            }else {
                return "Goto Page " + n;
            }
        },
        getItemClasses: function(n){
          if(n === this.CurrentPage){
              return 'active';
          }else {
              return 'd-none d-sm-inline-block';
          }
        },
        getQueryParameter: function () {
            let default_value = 1;
            let name = this.Query_Parameter;
            let queryString = location.search.replace("?", '');
            let params = queryString.split('=');
            let nIndex = params.indexOf(name);
            let paraValue = default_value;
            if (nIndex !== -1) {
                paraValue = params[nIndex + 1];
            }
            return parseInt(paraValue);
        },
        getTotalPages: function () {
            this.TotalRecords = this.dataList.length;
            if (this.dataList.length > 0) {
                let n = this.dataList.length / this.page_size;
                //rounds a number up to the next largest whole number
                this.TotalPages = Math.ceil(n);
            } else {
                this.TotalPages = 0;
            }
        },
        getPageData: function (pageNum, eventType) {
            if (pageNum === 'prev') {
                this.CurrentPage -= 1;
            } else if (pageNum === 'next') {
                this.CurrentPage += 1;
            } else {
                this.CurrentPage = pageNum;
            }
            if (this.CurrentPage < 1) {
                this.CurrentPage = this.TotalPages;
            } else if (this.CurrentPage > this.TotalPages) {
                this.CurrentPage = 1
            }
            let startIndex = 0;
            let endIndex = 0;
            let items = this.dataList;
            let totalItems = items.length;
            //decide which index(s) items will be shown
            if (items.length < this.page_size) {
                startIndex = 1;
                endIndex = items.length;
            } else {
                if (this.CurrentPage === 1) {
                    startIndex = 1;
                    endIndex = this.page_size;
                } else {
                    endIndex = (this.CurrentPage * this.page_size);
                    startIndex = endIndex - this.page_size;
                    if (endIndex > totalItems) {
                        endIndex = items.length;
                    }
                }
            }
            let pageItems = [];
            if (startIndex === 1) {
                startIndex = 0;
            }
            for (let c = startIndex; c < endIndex; c++) {
                pageItems.push(items[c]);
            }
            this.StartNumber = startIndex + 1;
            this.EndNumber = endIndex;
            this.$emit('update-page', pageItems, eventType);
        },
        pageLimit: function (page_num) {
            let linksToShow = this.paging_links;
            let half = Math.ceil(linksToShow / 2);
            let nonActive = Math.floor(linksToShow / 2);
            let previousIndex = this.CurrentPage - nonActive;
            let nextIndex = this.CurrentPage + nonActive;
            let lastGroup = this.TotalPages - nonActive;
            let showThis = false;
            if (this.CurrentPage > lastGroup) {
                // change previous index here
                let diff = this.CurrentPage - lastGroup;
                previousIndex = previousIndex - diff;
            }
            if (this.CurrentPage < half && page_num <= linksToShow) {
                showThis = true;
            } else if (page_num >= previousIndex && page_num <= nextIndex) {
                showThis = true;
            }
            return showThis;
        },
        updateSource: function (list) {
            let page_num = 1;
            if (this.SeparateUrl) {
                page_num = this.getQueryParameter();
            }
            this.dataList = null;
            this.dataList = list;
            this.getTotalPages();
            this.getPageData(page_num, 'default');
        }
        /*
        updatePage: function (page_list, eventType) {
            //assign page list to variable that binds the data in application
            this.pageRecords = null;
            this.pageRecords = page_list;
        }
        */
    }
};