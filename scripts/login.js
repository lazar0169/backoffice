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
    loginBtn.addEventListener('click', function () {
        let username = $$('#login-username').value;
        let password = $$('#login-password').value;
        if (username === '' || password === '') {
            trigger('message', message.codes.badParameter);
            return;
        }
        trigger('message', message.codes.waitingResponse);
        loginBtn.innerHTML = '<div class="loading"></div>';
        $$('#login-form').classList.add('disabled');
        trigger('comm/login/credentials', {
            body: {
                userName: username,
                password: password
            },
            success: function (response) {
                $$('#login-form').classList.remove('disabled');
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
                loginBtn.innerHTML = 'REQUEST PIN';
                $$('#login-password').value = '';
            }
        });
    });

    // PIN --------------------------
    pinBtn.addEventListener('click', function () {
        let pin = $$('#login-pin').value;
        if (pin === '') {
            trigger('message', message.codes.badParameter);
            return;
        }
        trigger('message', message.codes.waitingResponse);
        pinBtn.innerHTML = '<div class="loading"></div>';
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
                    pinBtn.innerHTML = 'REQUEST PIN';
                }
            },
            fail: function () {
                $$('#login-form').classList.remove('disabled');
                pinBtn.innerHTML = 'LOGIN';
            }
        });
    });

}();