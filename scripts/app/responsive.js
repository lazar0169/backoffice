let responsive = function () {
    let isLandscape = false;

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

    function resizeGame() {
        let gameWindow = $$('#main-content') || $$('#login') || $$('#reset');
        isLandscape = window.innerWidth > window.innerHeight && document.activeElement.tagName.toLowerCase() !== 'input';
        document.body.classList[isMobile() ? 'add' : 'remove']('mobile');
        isLandscape ? gameWindow.classList.add('landscape') : gameWindow.classList.remove('landscape');
    }
}();
