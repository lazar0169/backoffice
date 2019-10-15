const actions = Object.freeze({
    // Currency
    'comm/currency/getAll': '/Statistics/GetDefaultCurrencies',
    'comm/currency/set': '/Account/SetCurrency',
    'comm/currency/get': '/Account/GetCurrency',

    'comm/currency/getCurrencies': '/Currency/get-currencies',
    'comm/currency/readCurrency': '/Currency/read',
    'comm/currency/updateMainOptions': '/Currency/update-currency',
    'comm/currency/updateJackpotOptions': '/Currency/update-default-jackpot-settings',
    'comm/currency/deleteCurrency': '/Currency/delete',
    'comm/currency/createCurrency': '/Currency/create',
    'comm/currency/createCurrencyBetStep': '/Currency/add-game-bet',
    'comm/currency/deleteCurrencyBetStep': '/Currency/delete-game-bet',
    'comm/currency/updateCurrencyBetStep': '/Currency/update-game-bet',
    'comm/currency/updateRouletteBet': '/Currency/update-roullete-bet',
    'comm/currency/getGames': '/Currency/get-games',
    'comm/currency/getExistingCurrencies': '/Currency/get-existing-currency-codes',
    'comm/currency/getRealCurrencies': '/Currency/get-real-currencies',


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
    'comm/statistic/getExcel': '/Statistics/ToExcelStatistics',

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

    'comm/accounting/companies/get': '/Accounting/GetCompanies',
    'comm/accounting/companies/getOperators': '/Accounting/GetCompanyOperators',
    'comm/accounting/companies/getAccounting': '/Accounting/GetCompanyAccounting',

    // Management
    'comm/management/totalPerGame/get': '/Management/GetTotalPerGame',
    'comm/management/getGameTotal':'/Management/GetGamePerAllPortals',
    'comm/management/portalsPerGame/get': '/Management/GetPortalsPerGame',
    'comm/management/gamePerPortal/get': '/Management/GetGamePerPortal',
    'comm/management/gamePerPlayersOfPortal/get': '/Management/GetGamePerPlayersOfPortal',
    'comm/management/getMainGamePortal/get': '/Management/GetGamePerPlayersOfPortalName',
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

    'comm/configuration/jackpot/portal/get': '/Jackpot/GetJackpotSettingsForPortal',
    'comm/configuration/jackpot/active/get': '/Jackpot/GetActiveJackpots',
    'comm/configuration/jackpot/activefromtime/get': '/Jackpot/GetJackpotsFromPeriod',

    //Players
    'comm/players/getPlayersForPortal': '/Players/GetPlayersForPortal',

    //Player
    'comm/player/getPlayerData': '/Player/GetPlayer',
    'comm/player/getPlayerForPortal': '/Player/GetPlayersForPortal',
    'comm/player/getPlayerBySubstring': '/Player/SearchPlayers',
    'comm/player/EnableOrDisable': '/Player/EnableDisablePlayer',
    'comm/player/setPlayerFlags': '/Player/SetPlayerFlags',
    'comm/player/getTransactions': '/Player/GetPlayerTransactions',
    'comm/player/getUnresolvedWins': '/Player/GetPlayerUnresolvedWins',
    'comm/player/resolveUnresolvedWins': '/Player/ResolveWinForPlayerGameAndRound',
    'comm/player/getHistory': '/Player/GetPlayerHistory',
    'comm/player/getRouletteIds': '/Player/GetLiveRouleteIdsForRouleteGame',

    //Player Groups
    'comm/playerGroups/get': '/PlayerGroup/get-player-groups',
    'comm/playerGroups/getGroup': '/PlayerGroup/read',
    'comm/playerGroups/createGroup': '/PlayerGroup/create',
    'comm/playerGroups/updateGroup': '/PlayerGroup/update',
    'comm/playerGroups/getOperators': '/PlayerGroup/get-operators',
    'comm/playerGroups/getPortals': '/PlayerGroup/get-portals-of-operator',
    'comm/playerGroups/getCompleteGroup': '/PlayerGroup/get-complete-player-group',
    'comm/playerGroups/getGroupsBySubstring': '/PlayerGroup/get-suggested-players-by-substring',
    'comm/playerGroups/addPlayer': '/PlayerGroup/add-player',
    'comm/playerGroups/removePlayer': '/PlayerGroup/delete-player',
    
    'comm/playerGroups/addPlayerNew': '/PlayerGroup/add-player-new',
    'comm/playerGroups/removePlayerNew': '/PlayerGroup/delete-player-new',
    'comm/playerGroups/getPlayersBySubstringNew': '/PlayerGroup/get-all-players-by-substring',
    'comm/playerGroups/getSuggestedGroups': '/PlayerGroup/get-suggested-players',
    'comm/playerGroups/getSuggestedGroupForPlayer': '/PlayerGroup/suggested-group-for-player',
});
