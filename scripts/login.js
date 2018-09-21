const login = function () {
    let loginBtn = $$('#login-btn');
    on('resize', function () {
        document.body.classList[isMobile ? 'add' : 'remove']('mobile');
    });
    window.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            loginBtn.click();
        }
    });
}();