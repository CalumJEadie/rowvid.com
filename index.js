sochivid = {}

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    videoProps = getVideoPropsFromURL()
    sochivid.id = videoProps.id
    sochivid.time = videoProps.time

    player = new YT.Player('player', {
        height: '480',
            width: '853',
        videoId: videoProps.id,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        // playerVars: { 'autohide': 1 }
    });

    setInterval(updateUI, 100);
}

sochivid.init = function() {

    if (isVideoPropsInURL()) {

        mixpanel.track("Video player loaded")

        $("#play-video").show();

        // 2. This code loads the IFrame Player API code asynchronously.
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    } else {

        mixpanel.track("Video chooser loaded")

        $("#choose-video").show();

        $("#choose-video form").submit(function(event) {
            videoFuzzy = $("#video-fuzzy").val()
            videoID = extractVideoID(videoFuzzy)
            url = "/?v=" + videoID
            window.location.href = url
            event.preventDefault();
        });

        $("#video-fuzzy").focus()

    }

}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    // event.target.playVideo();
    player.seekTo(sochivid.time);
}

// 5. The API calls this function when the player's state changes.
function onPlayerStateChange(event) {

}

function getVideoPropsFromURL() {
    videoProps = {
        "id": "Mbc7oynavxw",
        "time": 0,
        "speed": 1
    }

    if (window.location.href.indexOf("?") != -1) {
        args = window.location.href.split("?")[1]
        args = args.split("&")
        for (var i in args) {
            keyValuePair = args[i]
            key = keyValuePair.split("=")[0]
            value = keyValuePair.split("=")[1]
            switch(key) {
                case "v":
                    videoProps.id = value;
                    break;
                case "t":
                    videoProps.time = value;
                    break;
                case "s":
                    videoProps.speed = value;
                    break;
            }
        }
    }

    return videoProps
}

function isVideoPropsInURL() {
    return window.location.href.indexOf("?") != -1
}

function updateUI() {
    videoID = 
    shareURL = "http://sochivid.com/?v="
        + sochivid.id
        + "&t="
        + preciseRound(player.getCurrentTime(), 2)
        + "&s="
        + player.getPlaybackRate()

    // document.getElementById("share-url").value = shareURL
    // document.getElementById("share-url").select()

    document.getElementById("timer").value = preciseRound(player.getCurrentTime(), 2)
}

function preciseRound(num, decimals) {
   return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function extractVideoID(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if ( match && match[7].length == 11 ){
        return match[7];
    }else{
        alert("Could not extract video ID.");
    }
}


function isSpeedChangeSupported() {
    // Flash player [1]
    // HTML5 player [0.25,0.5,1,1.5,2 ]
    // playbackRates == [1] if using Flash player
    // https://developers.google.com/youtube/js_api_reference#getAvailablePlaybackRates
    playbackRates = player.getAvailablePlaybackRates()
    console.log("available playback rates: " + player.getAvailablePlaybackRates())
    return playbackRates[0] != 1
}

function alertNeedHTML5Player() {
    alert("Your browser doesn't currently support changing video speeds, pop over to http://www.youtube.com/html5, start the HTML5 trail and then you're sorted!")
    window.open("http://www.youtube.com/html5")
}

function setPlaybackRateAndPlay(speed) {
    if( isSpeedChangeSupported() ) {
        setPlaybackRate(speed)
        player.playVideo()
    }else{
        alertNeedHTML5Player()
    }
}

function setPlaybackRate(speed) {
    player.setPlaybackRate(speed)
}

function nextFrame() {
    player.pauseVideo()
    currentTime = player.getCurrentTime()
    framesPerSecond = 25 // worked out by quick profiling of videos using stats for nerd feature of player
    numFramesToAdvance = 1
    timeToAdvance = (1/framesPerSecond) * numFramesToAdvance
    newTime = currentTime + timeToAdvance
    player.seekTo(newTime)
}

function prevFrame() {
    player.pauseVideo()
    currentTime = player.getCurrentTime()
    framesPerSecond = 25 // worked out by quick profiling of videos using stats for nerd feature of player
    numFramesToAdvance = 1
    timeToAdvance = (1/framesPerSecond) * numFramesToAdvance
    newTime = currentTime - timeToAdvance
    player.seekTo(newTime)
}