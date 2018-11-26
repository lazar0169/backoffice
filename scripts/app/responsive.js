let responsive = function () {
    window.addEventListener('resize', function () {
        // isMobile = window.innerWidth < 580;
        trigger('resize');
    });

    window.addEventListener('load', function () {
        // isMobile = window.innerWidth < 580;
        trigger('resize');
        trigger('load');
    });

    window.addEventListener('click', function (e) {
        trigger('window/click', e);
    });
}();