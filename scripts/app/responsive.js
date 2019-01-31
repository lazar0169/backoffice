let responsive = function () {
    let isLandscape = false;
    let ratio = 4 / 3;

    window.addEventListener('resize', function () {
        resizeGame();
        trigger('resize');
    });

    window.addEventListener('load', function () {
        resizeGame();
        trigger('load');
    });

    window.addEventListener('orientationchange', function () {
        resizeGame();
    }, false);

    window.addEventListener('click', function (e) {
        trigger('window/click', e);
    });

    window.addEventListener('keydown', function (e) {
        // prevent TAB
        if (e.which === 9) {
            e.preventDefault();
        }
        trigger('window/key', e);
    });

    function resizeGame() {
        let gameWindow = $$('#main-content') || $$('#login') || $$('#reset');
        isLandscape = window.innerWidth > window.innerHeight && document.activeElement.tagName.toLowerCase() !== 'input';
        document.body.classList[isMobile() ? 'add' : 'remove']('mobile');
        if (isMobile()) document.body.style.minHeight = window.innerWidth * ratio + 'px';
        isLandscape ? document.body.classList.add('landscape') : document.body.classList.remove('landscape');
    }
}();
