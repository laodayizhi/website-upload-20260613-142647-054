(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-site-nav]');

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  document.querySelectorAll('img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('image-hidden');
      image.setAttribute('aria-hidden', 'true');
    }, { once: true });
  });

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var previous = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === activeIndex);
      });
    }

    function schedule() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5200);
    }

    if (previous) {
      previous.addEventListener('click', function () {
        showSlide(activeIndex - 1);
        schedule();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(activeIndex + 1);
        schedule();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
        schedule();
      });
    });

    showSlide(0);
    schedule();
  }

  document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
    var scope = panel.closest('main') || document;
    var input = panel.querySelector('[data-filter-input]');
    var type = panel.querySelector('[data-filter-type]');
    var region = panel.querySelector('[data-filter-region]');
    var year = panel.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-search]'));

    function applyFilters() {
      var query = (input && input.value || '').trim().toLowerCase();
      var selectedType = type && type.value || '';
      var selectedRegion = region && region.value || '';
      var selectedYear = year && year.value || '';

      cards.forEach(function (card) {
        var searchText = card.getAttribute('data-search') || '';
        var cardType = card.getAttribute('data-type') || '';
        var cardRegion = card.getAttribute('data-region') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var ok = true;

        if (query && searchText.indexOf(query) === -1) {
          ok = false;
        }
        if (selectedType && cardType !== selectedType) {
          ok = false;
        }
        if (selectedRegion && cardRegion !== selectedRegion) {
          ok = false;
        }
        if (selectedYear && cardYear !== selectedYear) {
          ok = false;
        }

        card.classList.toggle('hidden-by-filter', !ok);
      });
    }

    [input, type, region, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');
    if (initialQuery && input) {
      input.value = initialQuery;
    }
    applyFilters();
  });

  var video = document.querySelector('[data-movie-player]');
  if (video) {
    var overlay = document.querySelector('[data-play-overlay]');
    var sourceNode = video.querySelector('source');
    var streamUrl = sourceNode ? sourceNode.getAttribute('src') : '';

    function setupVideo() {
      if (video.getAttribute('data-ready') === 'true') {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        video.hlsInstance = hls;
      } else {
        video.src = streamUrl;
      }

      video.setAttribute('data-ready', 'true');
    }

    function playVideo() {
      setupVideo();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });
  }
})();
