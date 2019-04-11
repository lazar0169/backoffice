let slider = function () {
    function sliderChanged(element, prefix, suffix) {
        element.children[2].value = `${prefix || ''}${element.children[1].value}${suffix || ''}`;
    }

    function init() {
        for (let slider of $$('.slider')) {
            slider.children[1].addEventListener('input', function () {
                sliderChanged(slider, slider.dataset.prefix, slider.dataset.suffix);
            });
            slider.children[1].addEventListener('change', function () {
                sliderChanged(slider, slider.dataset.prefix, slider.dataset.suffix);
            });
            slider.set = function (value) {
                slider.children[1].value = value;
                sliderChanged(slider, slider.dataset.prefix, slider.dataset.suffix);
            };
            slider.get = function () {
                return Number(slider.children[1].value);
            }
            slider.children[2].addEventListener('change', function () {
                slider.set(Number(slider.children[2].value.replace('%', '')));
            });
        }
    }

    window.addEventListener('load', function () {
        init();
    });
}();