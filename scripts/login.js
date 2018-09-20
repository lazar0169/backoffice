const login = function () {
    on('resize', function () {
        document.body.classList[isMobile ? 'add' : 'remove']('mobile');
    });
}();