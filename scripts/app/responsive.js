let responsive = function () {
    let isLandscape = false;
    const ratio = 4 / 3;
    const mobileDisabledCategories = [
        '#sidebar-operators',
        '#sidebar-accounting',
        '#sidebar-statistic',
        '#sidebar-players',
    ];

    const mobileDisabledTab = [
        '#configuration-navbar-currency',
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
        if (!$$(mobileDisabledCategories[0])) {
            return;
        }
        if (isMobile()) {
            for (let category of mobileDisabledCategories) {
                $$(category).style.display = 'none';
                $$(category).disable = true;
            }

            for (let tab of mobileDisabledTab) {
                $$(tab).style.display = 'none';
                $$(tab).disable = true;
            }
        }
        else {
            for (let category of mobileDisabledCategories) {
                $$(category).style.display = 'block';
                $$(category).disabled = false;
            }

            for (let tab of mobileDisabledTab) {
                $$(tab).style.display = 'inline-flex';
                $$(tab).disable = false;
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
