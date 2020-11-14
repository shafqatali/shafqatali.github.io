/* globals playYoutubeEmbeddedVideo mobile */

/* exported page_ready_embedded_spotlight iFrameLoaded */
function page_ready_embedded_spotlight() {
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
            $(this).replaceWith('<div class="video-wrap"><div id="video-' + yt_id + '" data-time="' + yt_time + '" class="embed-responsive embed-responsive-16by9 youtube-box" style="background-image:url(images/video-bg.jpg)"><span id="video-play-' + yt_id + '" class="play-icon"></span></div></div>');
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