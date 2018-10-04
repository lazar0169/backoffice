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

    loginBtn.addEventListener('click', function () {
        trigger('notify', { message: 'WAITING FOR RESPONSE...', type: 0 });
        $$('#login-form').classList.add('disabled');
        trigger('comm/login/credentials', {
            body: {
                userName: $$('#login-username').value,
                password: $$('#login-password').value
            },
            success: function (response) {
                $$('#login-form').classList.remove('disabled');
                let isError = Boolean(response.errorOccured);
                if (isError) {
                    trigger('notify', { message: 'WRONG CREDENTIALS! PLEASE TRY AGAIN.', type: 3 });
                } else {
                    if ($$("#login-remember").checked) {
                        localStorage.setItem('rememberLogin', $$("#login-remember").checked);
                        localStorage.setItem('loginName', $$("#login-username").value);
                    }
                    trigger('notify', { message: 'PLEASE ENTER THE PIN THAT YOU RECEIVED IN THE EMAIL', type: 1 });
                    $$('#login-wrapper').classList.add('hidden');
                    $$('#pin-wrapper').classList.remove('hidden');
                    $$('#login-password').value = '';
                }
            },
            fail: function () {
                $$('#login-form').classList.remove('disabled');
                $$('#login-password').value = '';
            }
        });
    });

    pinBtn.addEventListener('click', function () {
        trigger('notify', { message: 'WAITING FOR RESPONSE...', type: 0 });
        $$('#login-form').classList.add('disabled');
        trigger('comm/login/pin', {
            body: {
                inputPin: $$('#login-pin').value
            },
            success: function (response) {
                $$('#login-form').classList.remove('disabled');
                let isError = Boolean(response.errorOccured);
                if (isError) {
                    trigger('notify', { message: 'WRONG PIN! PLEASE TRY AGAIN.', type: 3 });
                } else {
                    location.href = location.origin + '/main.html';
                }
            },
            fail: function () {
                $$('#login-form').classList.remove('disabled');
            }
        });
    });

}();