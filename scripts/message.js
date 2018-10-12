const message = function () {
    const codes = {
        unknown: 9999,
        waitingResponse: 900,
        communicationError: 901,
        enterPin: 902,
        passwordsDontMatch: 903,
        success: 1000,
        badParameter: 1001,
        nonExistingUserName: 2001,
        badPassword: 2002,
        badPin: 2003,
        thirdTimeBadPin: 2004,
        logInWentWrong: 2005,
        logedOutFailed: 2006,
        loggedOut: 2007
    };

    const CODE = {
        9999: {
            description: 'Unknown error! Please contact administrator for more information.',
            type: 3
        },
        900: {
            description: 'Waiting for response from server...',
            type: 0
        },
        901: {
            description: 'Communication error. Please check your connection.',
            type: 3
        },
        902: {
            description: 'Please enter PIN that you received in mail.',
            type: 1
        },
        903: {
            description: 'Passwords don\'t match. Please try again',
            type: 3
        },
        1000: {
            description: 'Successful!',
            type: 4
        },
        1001: {
            description: 'Please check you parameters.',
            type: 3
        },
        2001: {
            description: 'User name does not exist! Please contact your administrator.',
            type: 3
        },
        2002: {
            description: 'Wrong password. Attempts left: %s. If you have forgot password, please contact administrator for password reset.',
            type: 3
        },
        2003: {
            description: 'You have entered wrong PIN! Attempts left: %s. Contact administrator if you didn\'t recived mail with PIN.',
            type: 3
        },
        2004: {
            description: 'No login attempts available, please contact your administrator for password reset.',
            type: 2
        },
        2005: {
            description: 'Something went wrong with login. Try again, or contact administrator for more information.',
            type: 2
        },
        2006: {
            description: 'Server problem during logout! Please try again',
            type: 4
        },
        2007: {
            description: 'Welcome: Use your credentials to log in',
            type: 1
        }
    };

    Object.freeze(CODE);

    on('message', function (data) {
        let code = data[0];
        let message;
        if (code === undefined) {
            code = data;
            message = `${_config.development ? `[CODE: ${code}]&nbsp;&nbsp;&nbsp;&nbsp;` : ''} ${CODE[code].description}`;
        } else {
            message = `${_config.development ? `[CODE: ${code}]&nbsp;&nbsp;&nbsp;&nbsp;` : ''} ${CODE[code].description}`;
            for (let param of data.slice(1)) {
                message = message.replace('%s', param);
            }
        }
        if (_config.development) {
            log('MESSAGE: ' + JSON.stringify(data));
        }
        trigger('notify', { message: message, type: CODE[code].type });
    });

    return {
        codes
    };

}();
