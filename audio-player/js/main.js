$( document ).ready(function() {

    /* For Default Version */

    $(function () {
        $('#default-audio-player').mediaelementplayer({
            alwaysShowControls: true,
            features: ['playpause', 'progress','volume'],
            audioVolume: 'horizontal',
            audioWidth: 450,
            audioHeight: 70
        });
    });

    /* For Customized Version */

    $('.customized-audio').mediaelementplayer({
        alwaysShowControls: true,
        features: ['progress', 'current', 'duration', 'tracks' ],
        audioVolume: 'horizontal',
        audioWidth: 450,
        timeFormat: 'mm:ss',
        timeAndDurationSeparator: "<span> / </span>",
        startVolume: .6,
        success: function (mediaElement, originalNode, instance) {
            var thisID = "#" + $(originalNode).parents(".audio-player").attr('id');
            console.log("Parent ID is:" + thisID);
            console.log(mediaElement);
            var _mediaElement = mediaElement;
            $(thisID + ' .mejs-controls').prepend('<div>' + '<button class="play" type="button" title="Play" aria-label="Play"></button>' +
                '<button class="pause" type="button" title="Pause" aria-label="Pause"></button>' +
                '<button class="reset" type="button" title="Reset" aria-label="Reset"></button>' + '</div>');
            $(thisID + ' .mejs-controls').append('<div class="vol-icon" tabindex="0" data-vol=".6"><a href="#" class="vol-low" tabindex="0">-</a>' +
                '<span class="active"></span><span class="active"></span><span class="active"></span><span></span><span></span><a href="#" class="vol-up" tabindex="0">+</a></div>');
            $(document).on('click', thisID + ' .vol-low', function () {
                //console.log("Parent ID is:" + thisID);

                var vol = parseInt($(thisID + ' .vol-icon').attr('data-vol') * 100);
                var newVol = vol - 20;
                if (vol > 0) {
                    mediaElement.setVolume(newVol / 100)
                    $(thisID + ' .vol-icon').attr('data-vol', newVol / 100)
                }
                return false;
            })
            $(document).on('click', thisID + ' .vol-up', function () {
                var vol = parseInt($(thisID + ' .vol-icon').attr('data-vol') * 100);
                var newVol = vol + 20;
                if (vol < 100) {
                    mediaElement.setVolume(newVol / 100)
                    $(thisID + ' .vol-icon').attr('data-vol', newVol / 100)
                }
                return false;
            })
            $(document).on('click', thisID + ' .reset', function () {
                mediaElement.setCurrentTime(-1)
            })

            $(document).on('click', thisID + ' .play', function () {
                console.log("sdfsdfsdf");
                mediaElement.play();
                $(thisID + ' .pause').removeClass('active')
                $(this).addClass('active')
            })
            $(document).on('click', thisID + ' .pause', function () {
                mediaElement.pause();
                $(thisID + ' .play').removeClass('active')
                $(this).addClass('active')
            })

            $(document).on('click', thisID + ' .vol-icon span:nth-of-type(1)', function () {
                mediaElement.setVolume(.2)
                $(thisID + ' .vol-icon').attr('data-vol', .2)
            })
            $(document).on('click', thisID + ' .vol-icon span:nth-of-type(2)', function () {
                mediaElement.setVolume(.4)
                $(thisID + ' .vol-icon').attr('data-vol', .4)
            })
            $(document).on('click', thisID + ' .vol-icon span:nth-of-type(3)', function () {
                mediaElement.setVolume(.6)
                $(thisID + ' .vol-icon').attr('data-vol', .6)
            })
            $(document).on('click', thisID + ' .vol-icon span:nth-of-type(4)', function () {
                mediaElement.setVolume(.8)
                $(thisID + ' .vol-icon').attr('data-vol', .8)
            })
            $(document).on('click', thisID + ' .vol-icon span:nth-of-type(5)', function () {
                mediaElement.setVolume(1)
                $(thisID + ' .vol-icon').attr('data-vol', 1)
            })
            mediaElement.addEventListener("volumechange", function () {
                var vol = instance.media.volume * 100;
                if (vol <= 20 && vol > 0) {
                    $(thisID + ' .vol-icon span').removeClass('active');
                    $(thisID + ' .vol-icon span:nth-of-type(1)').addClass('active');
                }
                if (vol <= 40 && vol > 20) {
                    $(thisID + ' .vol-icon span').removeClass('active');
                    $(thisID + ' .vol-icon span:nth-of-type(1),'+ thisID +' .vol-icon span:nth-of-type(2)').addClass('active');
                }
                if (vol <= 60 && vol > 40) {
                    $(thisID + ' .vol-icon span').removeClass('active');
                    $(thisID + ' .vol-icon span:nth-of-type(1),'+ thisID +' .vol-icon span:nth-of-type(2),'+ thisID +' .vol-icon span:nth-of-type(3)').addClass('active');
                }
                if (vol <= 80 && vol > 60) {
                    $(thisID + ' .vol-icon span').removeClass('active');
                    $(thisID + ' .vol-icon span:nth-of-type(1),'+ thisID +' .vol-icon span:nth-of-type(2),'+ thisID +' .vol-icon span:nth-of-type(3),'+ thisID +' .vol-icon span:nth-of-type(4)').addClass('active');
                }
                if (vol <= 100 && vol > 80) {
                    $(thisID + ' .vol-icon span').removeClass('active');
                    $(thisID + ' .vol-icon span:nth-of-type(1),'+thisID +' .vol-icon span:nth-of-type(2),'+ thisID +' .vol-icon span:nth-of-type(3),'+ thisID +' .vol-icon span:nth-of-type(4),'+ thisID +' .vol-icon span:nth-of-type(5)').addClass('active');
                }
                if (vol == 0) {
                    $(thisID + ' .vol-icon span').removeClass('active');
                }
            }, true);
        }
    });

});
