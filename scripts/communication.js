let comm = function () {
    // const apiUrl = 'http://backoffice.com';
    const apiUrl = 'http://backofficewebapi.com';

    const actions = {
        // Login
        'comm/login/credentials': '/Account/LogIn',
        'comm/login/pin': '/Account/EnterPin',
        'comm/login/logout': '/Account/LogOut',
        'com/login/password/reset': '/Account/ForgottenPassword',

        // Accounting
        'comm/accounting/operators/get': '/Accounting/GetOperators',
        'comm/accounting/portals/get': '/Accounting/GetPortalsByOperatorId',
        'comm/accounting/get': '/Accounting/GetAccounting',


        // Operators
        'comm/operators/get': '/Operator/GetOperators',
        'comm/operators/create': '/Operator/CreateOperator',
        'comm/operators/remove': '/Operator/RemoveOperator',
        'comm/operators/edit': '/Operator/EditOperator',
        'comm/operators/parameters/get': '/Operator/GetParameters',
        'comm/operators/get/single': '/Operator/GetOperator',

        // Configuration
        'comm/configuration/actions/create': '/Settings/CreateAction',
        'comm/configuration/roles/create': '/Settings/CreateRole',
        'comm/configuration/users/create': '/Settings/CreateUser',

        'comm/configuration/actions/edit': '/Settings/EditAction',
        'comm/configuration/roles/edit': '/Settings/EditRole',
        'comm/configuration/users/edit': '/Settings/EditUser',

        'comm/configuration/actions/get': '/Settings/GetActions',
        'comm/configuration/roles/get': '/Settings/GetRoles',
        'comm/configuration/users/get': '/Settings/GetUsers',

        'comm/configuration/actions/get/single': '/Settings/GetAction',
        'comm/configuration/roles/get/single': '/Settings/GetRole',
        'comm/configuration/users/get/single': '/Settings/GetUser',

        'comm/configuration/actions/remove/single': '/Settings/RemoveAction',
        'comm/configuration/roles/remove/single': '/Settings/RemoveRole',
        'comm/configuration/users/remove/single': '/Settings/RemoveUser',

        'comm/configuration/profile/get': '/Settings/GetProfile',
        'comm/configuration/profile/edit': '/Settings/UpdateProfile',
        'comm/configuration/profile/password/edit': '/Settings/ChangePassword',
    };

    function get(action, callback, body) {
        fetch(apiUrl + action, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'credentials': 'include'
            },
            // mode: "no-cors",
            body: JSON.stringify(body)
        }).then(function (response) {
            // log(response.headers.get("content-type"));
            return response.json();
        }).then(function (json) {
            log(json);
            if (json.responseCode === message.codes.loggedOut) {
                location.href = location.origin;
            }
            callback.success(json);
        }).catch((err) => {
            callback.fail(err);
            trigger('message', message.codes.communicationError);
            log(err);
            // setTimeout(() => {
            //     location.href = location.origin;
            // }, 1000);
        });
    }

    function connect(action, data = {}) {
        get(action, {
            success: function (response) {
                data.success = data.success || function () { }
                data.success(response);
            },
            fail: function (err) {
                data.fail = data.fail || function () { }
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