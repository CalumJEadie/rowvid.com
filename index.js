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

    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

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

function updateUI() {
    videoID = 
    shareURL = "http://sochivid.com/?v="
        + sochivid.id
        + "&t="
        + preciseRound(player.getCurrentTime(), 2)
        + "&s="
        + player.getPlaybackRate()

        document.getElementById("share-url").value = shareURL
        document.getElementById("share-url").select()
}

function preciseRound(num, decimals) {
   return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
