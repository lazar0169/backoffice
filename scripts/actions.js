const actions = Object.freeze({
    // Currency
    'comm/currency/getAll': '/Statistics/GetDefaultCurrencies',
    'comm/currency/set': '/Account/SetCurrency',
    'comm/currency/get': '/Account/GetCurrency',

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
});
