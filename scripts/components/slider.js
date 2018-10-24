let slider = function () {
    function sliderChanged(element, prefix, sufix) {
        element.children[2].value = `${prefix || ''}${element.children[1].value}${sufix || ''}`;
    }

    function init() {
        for (let slider of $$('.slider')) {
            slider.children[1].addEventListener('input', function () {
                sliderChanged(slider, slider.dataset.prefix, slider.dataset.sufix);
            });
            slider.children[1].addEventListener('change', function () {
                sliderChanged(slider, slider.dataset.prefix, slider.dataset.sufix);
            });
        }
    }

    window.addEventListener('load', function () {
        init();
    });
}();