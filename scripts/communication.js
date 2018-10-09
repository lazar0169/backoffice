let comm = function () {
    const apiUrl = 'http://backofficewebapitest.com';

    const actions = {
        // Login
        'comm/login/credentials': '/Account/LogIn',
        'comm/login/pin': '/Account/EnterPin',
        'comm/login/logout': '/Account/LogOut',
        // Configuration
        'comm/configuration/actions/create': '/Action/CreateAction',
        'comm/configuration/roles/create': '/Role/CreateRoles',
        'comm/configuration/users/create': '/User/CreateUsers',
        'comm/configuration/actions/get': '/Action/GetActions',
        'comm/configuration/roles/get': '/Role/GetRoles',
        'comm/configuration/users/get': '/User/GetUsers',
        'comm/configuration/actions/remove': '/Action/RemoveAction',
        'comm/configuration/roles/remove': '/Role/RemoveRoles',
        'comm/configuration/users/remove': '/User/RemoveUsers',
    };

    function get(action, callback, body = {}) {
        fetch(apiUrl + action, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'credentials': 'include'
            },
            body: JSON.stringify(body)
        }).then(function (response) {
            // log(response.headers.get("content-type"));
            return response.json();
        }).then(function (json) {
            json.responseCode === message.codes.loggedOut ?
                location.href = location.origin :
                callback.success(json);
        }).catch((err) => {
            callback.fail(err);
            log(err, 2);
        });
    }

    function connect(action, data) {
        get(action, {
            success: function (response) {
                data.success(response);
            },
            fail: function (err) {
                data.fail(err);
            }
        }, data.body);
    }

    for (let action in actions) {
        on(action, function (data) {
            connect(actions[action], data);
        });
    }

}();