const login = function () {
    let loginBtn = $$('#login-btn');
    let pinBtn = $$('#pin-btn');
    let activeForm = 'login';

    if (localStorage.getItem('rememberLogin')) {
        $$('#login-username').value = localStorage.getItem('loginName');
        $$("#login-remember").checked = !!localStorage.getItem('rememberLogin');
    }

    on('resize', function () {
        document.body.classList[isMobile ? 'add' : 'remove']('mobile');
    });

    on('load', function () {
        addLoader($$('#login-form'));
        trigger('com/login/logged', {
            success: function (response) {
                removeLoader($$('#login-form'));
                if (response.responseCode === message.codes.success && response.result) {
                    location.href = location.origin + '/main.html';
                }
            },
            fail: function () {
                removeLoader($$('#login-form'));
            }
        });
    });

    window.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            if (activeForm === 'login') {
                loginBtn.click();
            } else if (activeForm === 'pin') {
                pinBtn.click();
            } else {
                return;
            }
        }
    });

    // LOGIN --------------------------
    loginBtn.addEventListener('click', function (e) {
        e.preventDefault();
        let username = $$('#login-username').value;
        let password = $$('#login-password').value;
        if (username === '' || password === '') {
            trigger('message', message.codes.badParameter);
            return;
        }
        trigger('message', message.codes.waitingResponse);
        addLoader(loginBtn);
        $$('#login-form').classList.add('disabled');
        trigger('comm/login/credentials', {
            body: {
                userName: username,
                password: password
            },
            success: function (response) {
                $$('#login-form').classList.remove('disabled');
                removeLoader(loginBtn);
                trigger('message', response.responseCode);
                loginBtn.innerHTML = 'REQUEST PIN';
                if (response.responseCode === message.codes.success) {
                    if ($$("#login-remember").checked) {
                        localStorage.setItem('rememberLogin', $$("#login-remember").checked);
                        localStorage.setItem('loginName', $$("#login-username").value);
                    }
                    trigger('message', message.codes.enterPin);
                    $$('#login-wrapper').classList.add('hidden');
                    $$('#pin-wrapper').classList.remove('hidden');
                    $$('#login-password').value = '';
                    activeForm = 'pin';
                    $$('#login-pin').focus();
                }
            },
            fail: function () {
                $$('#login-form').classList.remove('disabled');
                removeLoader(loginBtn);
                loginBtn.innerHTML = 'REQUEST PIN';
                $$('#login-password').value = '';
            }
        });
    });

    // PIN --------------------------
    pinBtn.addEventListener('click', function (e) {
        e.preventDefault();
        let pin = $$('#login-pin').value;
        if (pin === '') {
            trigger('message', message.codes.badParameter);
            return;
        }
        trigger('message', message.codes.waitingResponse);
        addLoader(pinBtn);
        $$('#login-form').classList.add('disabled');
        trigger('comm/login/pin', {
            body: {
                inputPin: $$('#login-pin').value
            },
            success: function (response) {
                $$('#login-form').classList.remove('disabled');
                trigger('message', response.result ? response.responseCode : response.responseCode, response.result);
                if (response.responseCode === message.codes.success) {
                    $$('#login-form').classList.add('disabled');
                    $$('#login-pin').blur();
                    setTimeout(function () {
                        location.href = location.origin + '/main.html';
                    }, notify.getIdleTime / 2);
                } else if (response.responseCode === message.codes.thirdTimeBadPin) {
                    $$('#login-form').classList.add('disabled');
                    $$('#login-pin').blur();
                    activeForm = 'blocked';
                    setTimeout(function () {
                        location.href = location.origin;
                    }, notify.getIdleTime);
                } else {
                    removeLoader(pinBtn);
                }
            },
            fail: function () {
                $$('#login-form').classList.remove('disabled');
                addLoader(pinBtn);
                pinBtn.innerHTML = 'LOGIN';
            }
        });
    });

    $$('#login-forgot-password').addEventListener('click', function (e) {
        e.preventDefault();
        let hyperlink = this;
        if (!$$('#login-username').value) {
            trigger('message', message.codes.notValidUserName);
        } else {
            let reset = confirm('Are you sure that you want to reset password?');
            if (reset) {
                addLoader(hyperlink);
                trigger('com/login/password/reset', {
                    body: {
                        userName: $$('#login-username').value
                    },
                    success: function (response) {
                        removeLoader(hyperlink);
                        if (response.responseCode === message.codes.success) {
                            trigger('message', response.passwordWillAriveShortly);
                        } else {
                            trigger('message', response.responseCode);
                        }
                    },
                    fail: function () {
                        $$('#login-form').classList.remove('disabled');
                        pinBtn.innerHTML = 'LOGIN';
                    }
                });
            }
        }
    });

}();