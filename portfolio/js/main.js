/* globals is_page_iframed updateExternalLinks screen_change_default mobile linkPhoneNumbers desktop
unWrapLinkedPhoneNumbers isLiveSite wrapHtmlTag scrollToElement bindEventsForCarousel
bindPlayPauseEventsForCarousel checkRequiredParent autocomplete playYoutubeEmbeddedVideo */

/* exported page_ready_default screen_change_default populateAccordionsAlternative iFrameLoaded */
//code for page ready goes here
//this function will be called from global layout
function page_ready_default() {
    if ($("ol.breadcrumb").parents(".bg-primary").length) {
        $("#wrapper").addClass("no-shadow");
    }
    if ($(".bg-primary.search-box-wrapper").length) {
        $("#wrapper").addClass("no-shadow");
    }
    if (!is_page_iframed()) {
        document.querySelector("body").classList.add("not-iframed");
    } else {
        document.querySelector("body").classList.add("ds-iframed");
    }
    const skipContentLink = document.querySelector("a.skip-content");
    if (skipContentLink) {
        skipContentLink.onclick = function (event) {
            event.preventDefault();
            let targetId = this.getAttribute("href").replace("#", "");
            scrollToElement(targetId);
            return false;
        };
        skipContentLink.onkeydown = function(e){
            if (e.keyCode === 32) {
                e.preventDefault();
                skipContentLink.click();
            }
        };
    }
    populateAccordions();
    updateStandardContent('.standard-content', '16by9', 'table-striped');
    // External links function
    updateExternalLinks();

    bindEventsForCarousel();
    bindPlayPauseEventsForCarousel();

    $(".article-content img").each(function () {
        var target = $(this);
        var requiredIds = ".media-box";
        if (checkRequiredParent(target, requiredIds) == false) {
            var altText = $(this).attr("alt");
            $(this).wrap("<figure></figure>");
            $(this).parent().append("<figcaption>" + altText + "</figcaption>");
        }
    });

    embeddedYoutubeLink();
    scrollToTeams();
}

function screen_change_default() {
    if (mobile) {
        linkPhoneNumbers('.phone');
    } else if (desktop) {
        unWrapLinkedPhoneNumbers('.wrapped-phone')
    }
}

function updateStandardContent(hook, videoclass, tableclass) {
    if (isLiveSite) {
        const tables = Array.from(document.querySelectorAll(`${hook} table`));
        if (tables) {
            let hasDirtyTables = false;
            tables.forEach(function (t) {
                if (t.classList.contains("EditingFormTable") === false && t.classList.contains("CaptchaTable") === false && t.classList.contains("table-reflow") === false) {
                    t.classList.add("table", tableclass);
                    wrapHtmlTag("div", t, "table-wrapper");

                    if (t.innerHTML.indexOf("<thead>") == -1) {
                        t.classList.add('no-thead');
                        hasDirtyTables = true;
                    }
                }
            });
            if (hasDirtyTables) {
                //fix dirty tables
                //remove style attributes
                const dirtyTableRows = Array.from(document.querySelectorAll(`${hook} table.no-thead tbody tr, ${hook} table.no-thead tbody tr td`));
                dirtyTableRows.forEach(function (item) {
                    item.removeAttribute("style");
                });
                //add thead tag
                const dirtyTables = Array.from(document.querySelectorAll(`${hook} table.no-thead > tbody > tr:first-of-type`));
                dirtyTables.forEach(function (item) {
                    let thisMarkup = item.outerHTML.replace(/<td>/g, "<th>")
                        .replace(/<\/td>/g, "</th>");
                    let tableTag = item.parentNode.parentNode;
                    item.remove();

                    var newItem = document.createElement("THEAD");
                    newItem.innerHTML = thisMarkup;
                    tableTag.insertBefore(newItem, tableTag.childNodes[0]);
                    //tableTag.classList.remove("no-thead");

                });
            }
        }

        const nestedItems = document.querySelectorAll(`${hook} ol:not(.pagination), ${hook} ul:not(.pagination)`).length;
        for (var z = 0; z < nestedItems; z++) {
            let listItems = Array.from(document.querySelectorAll(`${hook} ol:not(.pagination):not(.wrapped) > li, ${hook} ul:not(.service-team):not(.pagination):not(.wrapped) > li`));
            if (listItems) {
                listItems.forEach(function (li) {
                    li.innerHTML = `<span>${li.innerHTML}</span>`;
                    li.parentNode.classList.add("wrapped");
                });
            }
        }

        const iFrames = Array.from(document.querySelectorAll(`${hook} iframe`));
        if (iFrames) {
            iFrames.forEach(function (frame) {
                let frameSrc = frame.getAttribute("src");
                if(frameSrc.indexOf("soundcloud.com") === -1){
                    frame.classList.add("embed-responsive-item");
                    wrapHtmlTag("div", frame, `embed-responsive embed-responsive-${videoclass}`);
                }
            });
        }
    }
}

function populateAccordions() {
    const accordHeaders = Array.from(document.querySelectorAll(".accordion-layout:not(.wrapped) > .card-header > .sf_colsIn"));
    if (accordHeaders) {
        accordHeaders.forEach(function (objectToWrap, index) {
            let newWrapperTag = document.createElement("a");
            objectToWrap.parentNode.insertBefore(newWrapperTag, objectToWrap);
            newWrapperTag.appendChild(objectToWrap);
            newWrapperTag.setAttribute("class", "card-link");
            newWrapperTag.setAttribute("href", "#");
            newWrapperTag.setAttribute("data-toggle", "collapse");
            newWrapperTag.setAttribute("data-target", "#collapse" + index);
            newWrapperTag.setAttribute("aria-expanded", "false");
            newWrapperTag.setAttribute("aria-controls", "collapse" + index);
            newWrapperTag.setAttribute("id", "heading" + index);
        });
    }

    const accordBody = Array.from(document.querySelectorAll(".accordion-layout:not(.wrapped) > .card-body"));
    if (accordBody) {
        accordBody.forEach(function (objectToWrap, index) {
            let newWrapperTag = document.createElement("div");
            objectToWrap.parentNode.insertBefore(newWrapperTag, objectToWrap);
            newWrapperTag.appendChild(objectToWrap);
            newWrapperTag.setAttribute("id", "collapse" + index);
            newWrapperTag.setAttribute("class", "collapse");
            newWrapperTag.setAttribute("aria-labelledby", "heading" + index);
            newWrapperTag.setAttribute("data-parent", "#accordion" + index);
        });
    }

    const accords = Array.from(document.querySelectorAll(".accordion-layout:not(.wrapped)"));
    if (accords) {
        accords.forEach(function (objectToWrap, index) {
            let newWrapperTag = document.createElement("div");
            objectToWrap.parentNode.insertBefore(newWrapperTag, objectToWrap);
            objectToWrap.classList.add("wrapped");
            newWrapperTag.appendChild(objectToWrap);
            newWrapperTag.setAttribute("id", "accordion" + index);
            newWrapperTag.setAttribute("class", "accordion no-gap");
        });
    }
}

function populateAccordionsAlternative() {
    const accords = Array.from(document.querySelectorAll(".accordion-layout"));
    if (accords) {
        accords.forEach(function (t, index) {
            let startTag = '<a class="card-link" href="#" data-toggle="collapse" data-target="#collapse' + index + '" aria-expanded="false" aria-controls="collapse' + index + '">';
            let bodyTag = '<div id="collapse' + index + '" class="collapse" aria-labelledby="heading' + index + '" data-parent="#accordion' + index + '">';
            let innerHtml = t.innerHTML.replace("<!--card-link-start-->", startTag);
            innerHtml = innerHtml.replace("<!--card-link-end-->", "</a>");
            innerHtml = innerHtml.replace("<!--card-body-start-->", bodyTag);
            innerHtml = innerHtml.replace("<!--card-body-end-->", "</div>");
            t.innerHTML = innerHtml;

            let newWrapperTag = document.createElement("div");
            t.parentNode.insertBefore(newWrapperTag, t);
            newWrapperTag.appendChild(t);
            newWrapperTag.setAttribute("id", "accordion" + index);
            newWrapperTag.setAttribute("class", "accordion");
        });
    }
}

function embeddedYoutubeLink() {
    $('main').find('a[href*="youtube.com/watch"]').each(function () {
        var yt_url = this.href,
            yt_url_id = yt_url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/),
            yt_id = yt_url_id[1].substring(0, 11),
            yt_time = yt_url.split('?t=')[1],
            yt_imageQuality = '';
        if ($(this).parents('section, article').length) {
            if (mobile) {
                yt_imageQuality = '/hqdefault.jpg';
            } else {
                yt_imageQuality = '/maxresdefault.jpg';
            }
            if (yt_time == null) {
                yt_time = 0;
            }
            $(this).replaceWith('<div class="video-wrap"><div id="video-' + yt_id + '" data-time="' + yt_time + '" class="embed-responsive embed-responsive-16by9 youtube-box" style="background-image:url(https://img.youtube.com/vi/' + yt_id + yt_imageQuality + ');"><span id="video-play-' + yt_id + '" class="play-icon"></span></div></div>');
        } else {
            $(this).replaceWith('<div class="video-wrap"><div class="embed-responsive embed-responsive-16by9"><iframe allowfullscreen="allowfullscreen" width=vidWidth height=vidHeight class="embed-responsive-item" src="https://www.youtube.com/embed/' + yt_id + '?start=' + yt_time + '&modestbranding=0' + '"frameborder="0"  allow="autoplay"></iframe></div></div>');
        }
    });
    $('.youtube-box').closest('.container').addClass('video-container');
    $('div.youtube-box').click(function () {
        var yt_id = $(this).attr("id");
        yt_id = yt_id.replace("video-", "");
        var yt_time = $(this).attr("data-time");
        var markupIframe = '<div id="video-' + yt_id + '" class="embed-responsive embed-responsive-16by9"><iframe onload="iFrameLoaded(\'' + yt_id + '\')" allowfullscreen="allowfullscreen" class="youtube-frame" src="https://www.youtube.com/embed/' + yt_id + '?enablejsapi=1&version=3&playerapiid=ytplayer&rel=0&autoplay=1SET_TIME" allow="autoplay"></iframe></div>';

        // If time specified
        if (yt_time != 0) {
            markupIframe = markupIframe.replace("SET_TIME", "&start=" + yt_time);
        } else {
            markupIframe = markupIframe.replace("SET_TIME", "");
        }
        $(this).replaceWith(markupIframe)
    });
}

function iFrameLoaded(wrapperId) {
    playYoutubeEmbeddedVideo('#video-' + wrapperId);
}

function scrollToTeams() {
    if ($(".service-details .cta-chevron-link").length) {
        //add id attribute to H2
        $(".sf_colsIn.article-content").find("h2:contains('Our Team')").attr("id", "serviceTeam");
        $(".sf_colsIn.article-content .serviceTeam > ul").addClass("service-team");
        //handle click
        $(".cta-chevron-link").click(function (e) {
            e.preventDefault();
            var selector = ($("#serviceTeam").length) ? "#serviceTeam" : ".sf_colsIn.article-content h2";
            $('html, body').stop().animate({scrollTop: $(selector).offset().top}, 500);
        });
    }
}

function bindAutoSearch() {
    let acs = document.querySelectorAll('.autocomplete .form-control');
    for (let i = 0; i < acs.length; i++) {
        let dataList = acs[i].getAttribute("data-list");
        let arrayList = [];
        if (dataList !== undefined && dataList !== null) {
            arrayList = eval(dataList);
        }
        autocomplete(acs[i], arrayList);
    }
    console.log("auto search bounded");
}