const login = function () {
    let loginBtn = $$('#login-btn');
    let pinBtn = $$('#pin-btn');

    if (localStorage.getItem('rememberLogin')) {
        $$('#login-username').value = localStorage.getItem('loginName');
    }

    on('resize', function () {
        document.body.classList[isMobile ? 'add' : 'remove']('mobile');
    });
    window.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            loginBtn.click();
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
        $$('#login-form').classList.add('disabled');
        trigger('comm/login/credentials', {
            body: {
                userName: username,
                password: password
            },
            success: function (response) {
                $$('#login-form').classList.remove('disabled');
                trigger('message', response.responseCode);
                if (response.responseCode === message.codes.success) {
                    if ($$("#login-remember").checked) {
                        localStorage.setItem('rememberLogin', $$("#login-remember").checked);
                        localStorage.setItem('loginName', $$("#login-username").value);
                    }
                    trigger('message', message.codes.enterPin);
                    $$('#login-wrapper').classList.add('hidden');
                    $$('#pin-wrapper').classList.remove('hidden');
                    $$('#login-password').value = '';
                }
            },
            fail: function () {
                $$('#login-form').classList.remove('disabled');
                $$('#login-password').value = '';
                trigger('message', message.codes.communicationError);
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
        $$('#login-form').classList.add('disabled');
        trigger('comm/login/pin', {
            body: {
                inputPin: $$('#login-pin').value
            },
            success: function (response) {
                $$('#login-form').classList.remove('disabled');
                trigger('message', response.responseCode);
                if (response.responseCode === message.codes.success) {
                    location.href = location.origin + '/main.html';
                }
            },
            fail: function () {
                $$('#login-form').classList.remove('disabled');
                trigger('message', message.codes.communicationError);
            }
        });
    });

}();