let responsive = function () {
    let isPortrait = false;

    window.addEventListener('resize', function () {
        // isMobile = window.innerWidth < 580;
        resizeGame();
        trigger('resize');
    });

    window.addEventListener('load', function () {
        // isMobile = window.innerWidth < 580;
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

        // If portrait add 'portrait' class to game window, so it can apply different styles
        isPortrait ? gameWindow.classList.add('portrait') : gameWindow.classList.remove('portrait');
    }
}();