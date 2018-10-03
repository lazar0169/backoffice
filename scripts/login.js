const login = function () {
    let loginBtn = $$('#login-btn');
    let pinBtn = $$('#pin-btn');
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
                let success = new Boolean(response);
                if (success) {
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
                let success = new Boolean(response);
                if (success) {
                    console.log(response);
                }
            },
            fail: function () {
                $$('#login-form').classList.remove('disabled');
            }
        });
    });

}();