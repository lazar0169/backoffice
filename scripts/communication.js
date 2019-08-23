let comm = function () {
    let apiUrl = _config.local ? `http://${location.hostname}:${_config.port}` : `${_config.api}:${_config.port}`;
    let accessToken;

    function get(action, callback, body) {
        accessToken = localStorage.getItem('accessToken');
        fetch(apiUrl + action, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'credentials': 'include',
                'Authorization': `Bearer ${accessToken}`
            },
            // mode: "no-cors",
            body: JSON.stringify(body)
        }).then(function (response) {
            // log(response.headers.get("content-type"));
            if (response.status === 401) {
                refreshAccessToken(action, callback, body);
                throw Error('refresh');
            } else {
                return response.json();
            }
        }).then(function (json) {
            log(json);
            if (json.responseCode === message.codes.invalidToken || json.responseCode === message.codes.loggedOut) {
                logOut();
            }
            callback.success(json);
        }).catch((err) => {
            if (err.message !== 'refresh') {
                callback.fail(err);
                trigger('message', message.codes.clientError);
                console.error(err.stack);
            }
        });
    }

    function refreshAccessToken(action, callback, body) {
        connect(actions['comm/auth/token/refresh'], {
            body: {
                userName: localStorage.getItem('loginName'),
                accessToken: localStorage.getItem('accessToken'),
                refreshToken: localStorage.getItem('refreshToken')
            },
            success: function (response) {
                localStorage.setItem('accessToken', response.result.accessToken);
                localStorage.setItem('refreshToken', response.result.refreshToken);
                accessToken = response.result.accessToken;
                get(action, callback, body);
            },
            fail: function () {
                logOut();
            }
        }, 'comm/auth/token/refresh');
    }

    function connect(action, data = {}, callerAction) {
        get(action, {
            success: function (response) {
                data.success = data.success || function () { }
                data.success(response);
                loading.validate(callerAction);
            },
            fail: function (err) {
                data.fail = data.fail || function () { }
                data.fail(err);
                loading.validate(callerAction);
            }
        }, data.body);
    }

    for (let action in actions) {
        on(action, function (data) {
            connect(actions[action], data, action);
        });
    }
}();