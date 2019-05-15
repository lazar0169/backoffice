const login = function () {
    let loginBtn = $$('#login-btn');
    let pinBtn = $$('#pin-btn');

    let warningSafariModal = $$('#warning-safari-modal');
    let warningButton = $$('#warning-modal-btn');

    if (localStorage.getItem('rememberLogin')) {
        $$('#login-username').value = localStorage.getItem('loginName');
        $$("#login-remember").checked = !!localStorage.getItem('rememberLogin');
    }

    on('load', function () {
        addLoader($$('#login-form'));
        trigger('comm/login/logged', {
            success: function (response) {
                removeLoader($$('#login-form'));
                if (response.responseCode === message.codes.success && response.result) {
                    location.href = getLocation() + '/main.html';
                }
                if (
                    isMobile() &&
                    IS_SAFARI &&
                    !JSON.parse(localStorage.getItem('rememberWarning'))) {
                    warningSafariModal.classList.remove('hidden');
                }
            },
            fail: function () {
                removeLoader($$('#login-form'));
            }
        });
    });

    // LOGIN --------------------------
    loginBtn.addEventListener('click', loginEvent);

    // PIN ----------------------------
    pinBtn.addEventListener('click', pinEvent);

    // WARNING ------------------------
    warningButton.addEventListener('click', function () {
        localStorage.setItem('rememberWarning', $$("#warning-modal-dont-show").checked);
        warningSafariModal.classList.add('hidden');
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
                trigger('comm/login/password/reset', {
                    body: {
                        userName: $$('#login-username').value,
                        link: getLocation() + '/reset.html'
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

    function loginEvent(e) {
        if (e) e.preventDefault();
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
                    }
                    localStorage.setItem('loginName', $$("#login-username").value);
                    localStorage.setItem('accessToken', response.result.accessToken);
                    localStorage.setItem('refreshToken', response.result.refreshToken);
                    trigger('message', message.codes.enterPin);
                    $$('#login-wrapper').classList.add('hidden');
                    $$('#pin-wrapper').classList.remove('hidden');
                    $$('#login-password').value = '';
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
    }

    function pinEvent(e) {
        if (e) e.preventDefault();
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
                removeLoader(pinBtn);
                trigger('message', response.result ? response.responseCode : response.responseCode, response.result);
                if (response.responseCode === message.codes.success) {
                    $$('#login-form').classList.add('disabled');
                    $$('#login-pin').blur();
                    setTimeout(function () {
                        location.href = getLocation() + '/main.html';
                    }, notify.getIdleTime / 2);
                } else if (response.responseCode === message.codes.thirdTimeBadPin) {
                    $$('#login-form').classList.add('disabled');
                    $$('#login-pin').blur();
                    setTimeout(function () {
                        location.href = getLocation();
                    }, notify.getIdleTime);
                }
            },
            fail: function () {
                $$('#login-form').classList.remove('disabled');
                removeLoader(pinBtn);
                pinBtn.innerHTML = 'LOGIN';
            }
        });
    }

}();