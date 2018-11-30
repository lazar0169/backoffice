const login = function () {
    let resetBtn = $$('#reset-btn');

    on('load', function () {
        addLoader($$('#login-form'));
        trigger('com/login/logged', {
            success: function (response) {
                removeLoader($$('#login-form'));
                if (response.responseCode === message.codes.success && response.result) {
                    location.href = getLocation() + '/main.html';
                }
            },
            fail: function () {
                removeLoader($$('#login-form'));
            }
        });
    });

    // LOGIN --------------------------
    resetBtn.addEventListener('click', loginEvent);

    function loginEvent(e) {
        if (e) e.preventDefault();
        let password = $$('#password').value;
        let repeatPassword = $$('#repeat-password').value;

        if (password === '' || repeatPassword === '') {
            trigger('message', message.codes.badParameter);
            return;
        } else if (password === repeatPassword) {
            trigger('message', message.codes.passwordsDontMatch);
            return;
        }

        trigger('message', message.codes.waitingResponse);
        addLoader(resetBtn);
        $$('#reset-form').classList.add('disabled');
        trigger('comm/reset', {
            body: {
                userName: urlData.getItem('username'),
                newPassword: password,
                pin: urlData.getItem('pin')
            },
            success: function (response) {
                $$('#reset-form').classList.remove('disabled');
                removeLoader(resetBtn);
                trigger('message', response.responseCode);
                if (response.responseCode === message.codes.success) {
                    $$('#reset-form').classList.add('disabled');
                    $$('#reset-form').blur();
                    setTimeout(function () {
                        location.href = getLocation();
                    }, notify.getIdleTime / 2);
                }
            },
            fail: function () {
                $$('#reset-form').classList.remove('disabled');
                removeLoader(resetBtn);
                password = '';
                repeatPassword = '';
            }
        });
    }

}();