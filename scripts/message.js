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
        loading: 907,
        downloadFailed: 908,
        newOperator: 909,
        success: 1000,
        badParameter: 1001,
        nonExistingUserName: 2001,
        badPassword: 2002,
        badPin: 2003,
        thirdTimeBadPin: 2004,
        logInWentWrong: 2005,
        logedOutFailed: 2006,
        loggedOut: 2007,
        badResetPasswordRequest: 2008,
        disabledUser: 2009,
        notDefaultCurrency: 2010,
        invalidName: 3001,
        invalidUserName: 3002,
        invalidEmail: 3003,
        passwordContainsUserName: 3004,
        weakPassword: 3005,
        userNameExists: 3006,
        emailExists: 3007,
        duplicatedPortals: 3008,
        duplicatedRoles: 3009,
        duplicatedActions: 3010,
        portalsWithSameCurrency: 4001,
        missingTax: 5001,
    };

    const description = {
        9999: 'Unknown server error! Please contact administrator for more information.',
        999: 'Client error! Please contact administrator for more information.',
        900: 'Waiting for response from server...',
        901: 'Communication error. Please check your connection.',
        902: 'Please enter PIN that you received in mail.',
        903: 'Passwords don\'t match. Please try again',
        904: 'You must enter valid user name in order to reset password',
        905: 'You will recive an email shortly with new password. When you do, use it to log in and go to: <pre style="color: greenyellow">CONFIGURATION &#8250; PROFILE</pre> to change it. <br><br><button>OK</button>',
        906: 'Please check currency and time zone',
        907: 'Loading...',
        908: 'Download failed, please contact administrator.',
        909: 'You have successfuly created a new operator. Taxes for new operator can be configured in <pre style="color: greenyellow">ACCOUNTING &#8250; SETUP</pre> tab. <br><br><button>OK</button>',
        1000: 'Successful!',
        1001: 'Please check you parameters.',
        2001: 'User name does not exist! Please contact your administrator.',
        2002: 'Wrong password. If you have forgot password, please contact administrator for password reset.',
        2003: 'You have entered wrong PIN! Attempts left: %s. Contact administrator if you didn\'t recived mail with PIN.',
        2004: 'No login attempts available, please contact your administrator for password reset.',
        2005: 'Something went wrong with login. Try again, or contact administrator for more information.',
        2006: 'Server problem during logout! Please try again.',
        2007: 'Welcome: Use your credentials to log in.',
        2008: 'Invalid PIN. Please try to reset password again, or contact your administrator.',
        2009: 'User disabled! Please contact your supervisor in order to enable this login.',
        2010: 'Selected currency is not valid. Please contact your administrator for more info.',
        3001: 'Invalid name. It can only contains uppercase and lowercase letters and space (white space)',
        3002: 'Invalid user name. It can only contains uppercase and lowercase letters, special characters "_" and ".", and numbers.',
        3003: 'Invalid email. Email address is in correct form.',
        3004: 'Password must not contain user name as its substring.',
        3005: 'Weak password. Password must contain at least single uppercase letter, single number and special character (!@#$%^&*;?), and to be minimum 8 character long.',
        3006: 'User name already exist. Please choose another one.',
        3007: 'Email is already in use. Please choose another one.',
        3008: 'Something wenp\'t wrong. Duplicated portals found. Please contact your administrator.',
        3009: 'Something wenp\'t wrong. Duplicated roles found. Please contact your administrator.',
        3010: 'Something wenp\'t wrong. Duplicated actions found. Please contact your administrator.',
        4001: 'A portal with this currency exists. Please choose another one or contact your administrator.',
        5001: 'Tax configuration is missing for selected operator.',
    };

    const type = {
        9999: 3,
        999: 3,
        900: 0,
        901: 3,
        902: 1,
        903: 3,
        904: 3,
        905: 0,
        906: 2,
        907: 0,
        908: 3,
        909: 0,
        1000: 4,
        1001: 3,
        2001: 3,
        2002: 3,
        2003: 3,
        2004: 2,
        2005: 2,
        2006: 4,
        2007: 1,
        2008: 3,
        2009: 3,
        2010: 3,
        3001: 3,
        3002: 3,
        3003: 3,
        3004: 3,
        3005: 3,
        3006: 3,
        3007: 3,
        3008: 3,
        4001: 3,
        5001: 3,
    };

    on('message', function (data) {
        if (!data) return;
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

    on('message/hide', function () {
        trigger('notify', { message: '', type: 1, duration: 0.001 });
    });

    return {
        codes
    };

}();
