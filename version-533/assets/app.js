document.addEventListener("DOMContentLoaded", function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var menuPanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && menuPanel) {
        menuButton.addEventListener("click", function () {
            menuPanel.classList.toggle("is-open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, current) {
            slide.classList.toggle("is-active", current === activeIndex);
        });

        dots.forEach(function (dot, current) {
            dot.classList.toggle("is-active", current === activeIndex);
        });
    }

    function startSlider() {
        if (slides.length <= 1) {
            return;
        }

        timer = window.setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5200);
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            if (timer) {
                window.clearInterval(timer);
            }
            showSlide(index);
            startSlider();
        });
    });

    showSlide(0);
    startSlider();

    var urlParams = new URLSearchParams(window.location.search);
    var initialQuery = urlParams.get("q") || "";
    var filterInputs = Array.prototype.slice.call(document.querySelectorAll(".js-filter-input"));

    function applyFilter(value) {
        var query = String(value || "").trim().toLowerCase();
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search]"));
        var visibleCount = 0;

        cards.forEach(function (card) {
            var haystack = String(card.getAttribute("data-search") || "").toLowerCase();
            var matched = !query || haystack.indexOf(query) !== -1;
            card.style.display = matched ? "" : "none";
            if (matched) {
                visibleCount += 1;
            }
        });

        var emptyState = document.querySelector("[data-empty-state]");
        if (emptyState) {
            emptyState.classList.toggle("is-visible", cards.length > 0 && visibleCount === 0);
        }
    }

    filterInputs.forEach(function (input) {
        if (initialQuery && !input.value) {
            input.value = initialQuery;
        }

        input.addEventListener("input", function () {
            applyFilter(input.value);
        });
    });

    if (initialQuery) {
        applyFilter(initialQuery);
    }
});

function initMoviePlayer(options) {
    var video = document.getElementById(options.videoId);
    var button = document.querySelector(options.buttonSelector);
    var source = options.source;
    var hlsInstance = null;
    var prepared = false;

    if (!video || !source) {
        return;
    }

    function hideButton() {
        if (button) {
            button.classList.add("is-hidden");
        }
    }

    function playVideo() {
        var result = video.play();
        if (result && typeof result.catch === "function") {
            result.catch(function () {});
        }
    }

    function preparePlayer() {
        if (prepared) {
            playVideo();
            return;
        }

        prepared = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            video.addEventListener("loadedmetadata", playVideo, { once: true });
            video.load();
            playVideo();
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                playVideo();
            });
            return;
        }

        video.src = source;
        video.load();
        playVideo();
    }

    function start() {
        hideButton();
        preparePlayer();
    }

    if (button) {
        button.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
        if (!prepared || video.paused) {
            start();
        }
    });

    video.addEventListener("play", hideButton);

    window.addEventListener("pagehide", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
