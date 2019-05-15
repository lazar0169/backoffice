const reset = function () {
    let resetBtn = $$('#reset-btn');

    on('load', function () {
        addLoader($$('#reset-form'));

        if (urlData.getItem('username') || urlData.getItem('pin')) {
            location.href = getLocation();
        }

        trigger('comm/login/logged', {
            success: function (response) {
                removeLoader($$('#reset-form'));
                if (response.responseCode === message.codes.success && response.result) {
                    location.href = getLocation() + '/main.html';
                }
            },
            fail: function () {
                removeLoader($$('#reset-form'));
            }
        });
    });

    // RESET --------------------------
    resetBtn.addEventListener('click', resetEvent);

    function resetEvent(e) {
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