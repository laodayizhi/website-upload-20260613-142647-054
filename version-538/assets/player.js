function initPlayer(source) {
    var video = document.querySelector('.player-video');
    var cover = document.querySelector('.player-cover');
    var button = document.querySelector('.play-action');
    var ready = false;

    if (!video || !source) {
        return;
    }

    function prepare() {
        if (ready) {
            return;
        }
        ready = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (window.Hls && Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            video.src = source;
        }
        video.controls = true;
    }

    function play() {
        prepare();
        if (cover) {
            cover.classList.add('is-hidden');
        }
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(function() {});
        }
    }

    if (button) {
        button.addEventListener('click', play);
    }
    if (cover) {
        cover.addEventListener('click', play);
    }
    video.addEventListener('click', function() {
        if (video.paused) {
            play();
        }
    });
}
