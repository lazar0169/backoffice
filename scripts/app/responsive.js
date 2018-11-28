let responsive = function () {
    let isPortrait = false;

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
        let gameWindow = $$('#main-content') || $$('#login');
        isPortrait = window.innerWidth < window.innerHeight;
        document.body.classList[isMobile() ? 'add' : 'remove']('mobile');
        isPortrait ? gameWindow.classList.add('portrait') : gameWindow.classList.remove('portrait');
    }
}();
