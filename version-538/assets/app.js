(function() {
    function all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var navButton = document.querySelector('.nav-toggle');
    var mobilePanel = document.querySelector('.mobile-panel');

    if (navButton && mobilePanel) {
        navButton.addEventListener('click', function() {
            mobilePanel.classList.toggle('open');
        });
    }

    var slider = document.querySelector('[data-hero-slider]');

    if (slider) {
        var slides = all('.hero-slide', slider);
        var dots = all('.hero-dot', slider);
        var prev = slider.querySelector('.hero-prev');
        var next = slider.querySelector('.hero-next');
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, i) {
                slide.classList.toggle('is-active', i === current);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle('is-active', i === current);
            });
        }

        function restart() {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function() {
                show(current + 1);
            }, 5000);
        }

        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                show(Number(dot.getAttribute('data-slide')) || 0);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener('click', function() {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function() {
                show(current + 1);
                restart();
            });
        }

        restart();
    }

    all('[data-filter-scope]').forEach(function(scope) {
        var root = scope.parentElement || document;
        var cards = all('[data-card]', root);
        var input = scope.querySelector('[data-search-input]');
        var regionFilter = scope.querySelector('[data-region-filter]');
        var typeFilter = scope.querySelector('[data-type-filter]');
        var yearFilter = scope.querySelector('[data-year-filter]');
        var channelFilter = scope.querySelector('[data-channel-filter]');
        var count = scope.querySelector('[data-result-count]');

        function fill(select, attr) {
            if (!select) {
                return;
            }
            var values = [];
            cards.forEach(function(card) {
                var value = card.getAttribute(attr) || '';
                if (value && values.indexOf(value) === -1) {
                    values.push(value);
                }
            });
            values.sort(function(a, b) {
                return String(b).localeCompare(String(a), 'zh-CN');
            });
            values.forEach(function(value) {
                var option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        }

        fill(regionFilter, 'data-region');
        fill(typeFilter, 'data-type');
        fill(yearFilter, 'data-year');

        function apply() {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var region = regionFilter ? regionFilter.value : '';
            var type = typeFilter ? typeFilter.value : '';
            var year = yearFilter ? yearFilter.value : '';
            var channel = channelFilter ? channelFilter.value : '';
            var visible = 0;

            cards.forEach(function(card) {
                var text = (card.getAttribute('data-search') || '').toLowerCase();
                var matched = true;
                if (keyword && text.indexOf(keyword) === -1) {
                    matched = false;
                }
                if (region && card.getAttribute('data-region') !== region) {
                    matched = false;
                }
                if (type && card.getAttribute('data-type') !== type) {
                    matched = false;
                }
                if (year && card.getAttribute('data-year') !== year) {
                    matched = false;
                }
                if (channel && card.getAttribute('data-channel') !== channel) {
                    matched = false;
                }
                card.classList.toggle('is-filtered-out', !matched);
                if (matched) {
                    visible += 1;
                }
            });

            if (count) {
                count.textContent = '当前显示 ' + visible + ' 部影片';
            }
        }

        [input, regionFilter, typeFilter, yearFilter, channelFilter].forEach(function(control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });

        apply();
    });
})();
