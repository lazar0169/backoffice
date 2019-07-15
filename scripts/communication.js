let comm = function () {
    const actions = {
        // Currency
        'comm/currency/getAll': '/Statistics/GetDefaultCurrencies',
        'comm/currency/set': '/Account/SetCurrency',
        'comm/currency/get': '/Account/GetCurrency',
        
        'comm/currency/getCurrencies': '/Currency/get-currencies',
        'comm/currency/readCurrency': '/Currency/read',
        'comm/currency/updateCurrency': '/Currency/update',
        'comm/currency/deleteCurrency': '/Currency/delete',
        'comm/currency/createCurrency': '/Currency/create',
        'comm/currency/getGames': '/Currency/get-games',
        'comm/currency/getExistingCurrencies': '/Currency/get-existing-currency-codes',
        'comm/currency/getRealCurrencies': '/Currency/get-real-currencies',
        'comm/currency/convertFromEurToCurrency': '/Currency/convert-step-from-eur-to-currency',
        

        // Reset
        'comm/reset': '/Account/ChangePassword',

        // Roles
        'comm/user/role': '/Account/GetUserRole',

        // Login
        'comm/login/credentials': '/Account/LogIn',
        'comm/login/pin': '/Account/EnterPin',
        'comm/login/logout': '/Account/LogOut',
        'comm/login/password/reset': '/Account/ForgottenPassword',
        'comm/login/logged': '/Account/IsLoggedIn',

        // Authorization
        'comm/auth/token/refresh': '/Token/RefreshAccessToken',

        // Dashboard
        'comm/dashboard/get': '/Dashboard/GetDashboard',

        // Statistics
        'comm/statistic/game/categories/get': '/Statistics/GetGameCategories',
        'comm/statistic/operators/get': '/Statistics/GetOperators',
        'comm/statistic/portals/get': '/Statistics/GetPortalsByOperatorId',
        'comm/statistic/games/get': '/Statistics/GetGames',
        'comm/statistic/summary/get': '/Statistics/GetSummary',
        'comm/statistic/games/summary/get': '/Statistics/GetGamesSummary',
        'comm/statistic/games/compered/get': '/Statistics/GetCompared',
        'comm/statistic/per/game/get': '/Statistics/GetPerGameSelection',

        // Accounting
        'comm/accounting/operators/get': '/Accounting/GetOperators',
        'comm/accounting/portals/get': '/Accounting/GetPortalsByOperatorId',
        'comm/accounting/get': '/Accounting/GetAccounting',
        'comm/accounting/manager/get': '/Accounting/GetManagerAccounting',

        'comm/accounting/excel/get': '/Accounting/ToExcel',

        'comm/accounting/setup/get': '/AccountingOperators/GetOperators',
        'comm/accounting/setup/operator/get': '/AccountingOperators/ChooseOperatorsAccounting',
        'comm/accounting/setup/operator/set/fixed': '/AccountingOperators/SetFixOperatorsAccounting',
        'comm/accounting/setup/operator/set/scaled': '/AccountingOperators/SetScaleOperatorsAccounting',

        // Management
        'comm/management/totalPerGame/get': '/Management/GetTotalPerGame',
        'comm/management/portalsPerGame/get': '/Management/GetPortalsPerGame',
        'comm/management/gamePerPortal/get': '/Management/GetGamePerPortal',
        'comm/management/gamePerPlayersOfPortal/get': '/Management/GetGamePerPlayersOfPortal',
        'comm/management/playersOfGame/get': '/Management/GetPlayersOfPortal',
        'comm/management/betsOfGame/get': '/Management/GetBetsOfPortal',
        'comm/management/RecommendBetLimit/get': '/Management/RecommendBetLimit',
        'comm/management/playerGames/get': '/Management/GetPlayerPerGame',
        'comm/management/excel/get': '/Management/ToExcel',

        // Operators
        'comm/operators/get': '/Operator/GetOperators',
        'comm/operators/create': '/Operator/CreateOperator',
        'comm/operators/remove': '/Operator/RemoveOperator',
        'comm/operators/edit': '/Operator/EditOperator',
        'comm/operators/parameters/get': '/Operator/GetParameters',
        'comm/operators/get/single': '/Operator/GetOperator',

        // Configuration
        'comm/configuration/parameters/get': '/Settings/GetUserParameters',

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
        'comm/configuration/profile/password/edit': '/Settings/ChangePasswordOnProfile',

        'comm/configuration/jackpot/portal/get':'/Jackpot/GetJackpotSettingsForPortal',
        'comm/configuration/jackpot/active/get':'/Jackpot/GetActiveJackpots',
        'comm/configuration/jackpot/activefromtime/get':'/Jackpot/GetJackpotsFromPeriod',

    };

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