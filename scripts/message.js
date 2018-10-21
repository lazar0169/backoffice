const message = function () {
    const codes = {
        unknown: 9999,
        clientError: 999,
        waitingResponse: 900,
        communicationError: 901,
        enterPin: 902,
        passwordsDontMatch: 903,
        notValidUserName: 904,
        passwordWillAriveShortly: 905,
        invalidCurrencyAndTimeZone: 906,
        success: 1000,
        badParameter: 1001,
        nonExistingUserName: 2001,
        badPassword: 2002,
        badPin: 2003,
        thirdTimeBadPin: 2004,
        logInWentWrong: 2005,
        logedOutFailed: 2006,
        loggedOut: 2007,
        invalidUserName: 3001,
        userNameExists: 3002,
        userNameInUse: 3003,
        weakPassword: 3004,
        passwordContainsUserName: 3005,
    };

    const description = {
        9999: 'Unknown server error! Please contact administrator for more information.',
        999: 'Client error! Please contact administrator for more information.',
        900: 'Waiting for response from server...',
        901: 'Communication error. Please check your connection.',
        902: 'Please enter PIN that you received in mail.',
        903: 'Passwords don\'t match. Please try again',
        904: 'You must enter valid user name in order to reset password',
        905: 'You will recive an email shortly with new password. When you do, use it to log in and go to: "configuration -> profile" to change it',
        906: 'Please check currency and time zone',
        1000: 'Successful!',
        1001: 'Please check you parameters.',
        2001: 'User name does not exist! Please contact your administrator.',
        2002: 'Wrong password. Attempts left: %s. If you have forgot password, please contact administrator for password reset.',
        2003: 'You have entered wrong PIN! Attempts left: %s. Contact administrator if you didn\'t recived mail with PIN.',
        2004: 'No login attempts available, please contact your administrator for password reset.',
        2005: 'Something went wrong with login. Try again, or contact administrator for more information.',
        2006: 'Server problem during logout! Please try again.',
        2007: 'Welcome: Use your credentials to log in.',
        3001: 'Invalid user name. It can only contains uppercase and lowercase letters, special characters "_" and ".", and numbers. ',
        3002: 'User name already exist. Please choose another one.',
        3003: 'User name is already in use. Please choose another one.',
        3004: 'Weak password. Password must contain at least single uppercase letter, single number and special character (!@#$%^&*;?), and to be minimum 8 character long.',
        3005: 'Password must not contain user name as its substring.',
    };

    const type = {
        9999: 3,
        999: 3,
        900: 0,
        901: 3,
        902: 1,
        903: 3,
        904: 3,
        905: 4,
        906: 2,
        1000: 4,
        1001: 3,
        2001: 3,
        2002: 3,
        2003: 3,
        2004: 2,
        2005: 2,
        2006: 4,
        2007: 1,
        3001: 3,
        3002: 3,
        3003: 3,
        3004: 3,
    };

    on('message', function (data) {
        let code = data[0];
        let message;
        if (code === undefined) {
            code = data;
            message = `${_config.development ? `[CODE: ${code}]&nbsp;&nbsp;&nbsp;&nbsp;` : ''} ${description[code]}`;
        } else {
            message = `${_config.development ? `[CODE: ${code}]&nbsp;&nbsp;&nbsp;&nbsp;` : ''} ${description[code]}`;
            for (let param of data.slice(1)) {
                message = message.replace('%s', param);
            }
        }
        if (_config.development) {
            log('MESSAGE: ' + JSON.stringify(data));
        }
        trigger('notify', { message: message, type: type[code] });
    });

    return {
        codes
    };

}();
