(function () {
  function initMoviePlayer(streamUrl) {
    var video = document.querySelector('[data-player]');
    var layer = document.querySelector('[data-play-layer]');
    var prepared = false;
    var hlsInstance = null;

    if (!video || !streamUrl) {
      return;
    }

    function prepare() {
      if (prepared) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = streamUrl;
      }

      prepared = true;
    }

    function start() {
      prepare();
      if (layer) {
        layer.classList.add('is-hidden');
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          if (layer) {
            layer.classList.remove('is-hidden');
          }
        });
      }
    }

    if (layer) {
      layer.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener('play', function () {
      if (layer) {
        layer.classList.add('is-hidden');
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
