let responsive = function () {
    let isLandscape = false;
    const ratio = 4 / 3;
    const mobileDisabledCategories = [
        '#sidebar-operators',
        '#sidebar-accounting',
        '#sidebar-statistic'
    ];

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
            if (typeof operators !== typeof undefined && operators.isModalOpened || typeof accounting !== typeof undefined && accounting.isModalOpened) {
                e.preventDefault();
            }
        }
        trigger('window/key', e);
    });

    function disableOrEnableSidebarMobileCategories() {
        if (isMobile()) {
            for (let category of mobileDisabledCategories) {
                $$(category).style.display = 'none';
                $$(category).disable = true;
            }
        }
        else {
            for (let category of mobileDisabledCategories) {
                $$(category).style.display = 'block';
                $$(category).disabled = false;
            }
        }
    };

    function resizeGame() {
        let gameWindow = $$('#main-content') || $$('#login') || $$('#reset');
        isLandscape = window.innerWidth > window.innerHeight && document.activeElement.tagName.toLowerCase() !== 'input';
        document.body.classList[isMobile() ? 'add' : 'remove']('mobile');
        if (isMobile()) document.body.style.minHeight = window.innerWidth * ratio + 'px';
        isLandscape ? document.body.classList.add('landscape') : document.body.classList.remove('landscape');
        disableOrEnableSidebarMobileCategories();
    };
}();
