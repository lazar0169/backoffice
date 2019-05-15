let advanceAccounting = function () {
    let main = $$('#advance-statistics-main');
    let portals = $$('#advance-statistics-portals');
    let players = $$('#advance-statistics-players');
    let bets = $$('#advance-statistics-bets');
    //main tab
    const totalGetButton = $$('#advance-statistics-get-total');
    let mainTable = $$('#advance-statistics-main-table');
    let mainFirstPeriodFrom = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let mainFirstPeriodTo = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let mainSecondPeriodFrom = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let mainSecondPeriodTo = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    //portals tab 
    const portalsGetButton = $$('#advance-statistics-get-portals');
    let portalsTable = $$('#advance-statistics-portals-table');
    let portalsFirstPeriodFrom = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let portalsFirstPeriodTo = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let portalsSecondPeriodFrom = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let portalsSecondPeriodTo = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    //players tab
    const playersGetButton = $$('#advance-statistics-get-players');
    let playersTable = $$('#advance-statistics-players-table');
    let playersFirstPeriodFrom = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let playersFirstPeriodTo = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let playersSecondPeriodFrom = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let playersSecondPeriodTo = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    //bets tab
    const betsGetButton = $$('#advance-statistics-get-bets');
    let betsTable = $$('#advance-statistics-bets-table');
    let betsFirstPeriodFrom = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let betsFirstPeriodTo = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let betsSecondPeriodFrom = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let betsSecondPeriodTo = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';


    let actionByRoles = {
        'Admin': 'comm/accounting/get',
        'Accounting': 'comm/accounting/get',
        'Manager': 'comm/accounting/manager/get',
    };

    function fillTable(tableElement, data) {
        let tableObject = table.generate({
            data: data,
            id: 'advance-statistics-main-table',
            dynamic: true,
            sticky: true,
            stickyCol: true,
        });
        tableElement.appendChild(tableObject);
    };

    on('date/accounting-time-main-first-period-span-from', function (data) {
        mainFirstPeriodFrom = data;
    });
    on('date/accounting-time-main-first-period-span-to', function (data) {
        mainFirstPeriodTo = data;
    });
    on('date/accounting-time-main-second-period-span-from', function (data) {
        mainSecondPeriodFrom = data;
    });
    on('date/accounting-time-main-second-period-span-to', function (data) {
        mainSecondPeriodTo = data;
    });

    on('date/accounting-time-portals-first-period-span-from', function (data) {
        portalsFirstPeriodFrom = data;
    });
    on('date/accounting-time-portals-first-period-span-to', function (data) {
        portalsFirstPeriodTo = data;
    });
    on('date/accounting-time-portals-second-period-span-from', function (data) {
        portalsSecondPeriodFrom = data;
    });
    on('date/accounting-time-portals-second-period-span-to', function (data) {
        portalsSecondPeriodTo = data;
    });

    on('date/accounting-time-players-first-period-span-from', function (data) {
        playersFirstPeriodFrom = data;
    });
    on('date/accounting-time-players-first-period-span-to', function (data) {
        playersFirstPeriodTo = data;
    });
    on('date/accounting-time-players-second-period-span-from', function (data) {
        playersSecondPeriodFrom = data;
    });
    on('date/accounting-time-players-second-period-span-to', function (data) {
        playersSecondPeriodTo = data;
    });

    on('date/accounting-time-bets-first-period-span-from', function (data) {
        betsFirstPeriodFrom = data;
    });
    on('date/accounting-time-bets-first-period-span-to', function (data) {
        betsFirstPeriodTo = data;
    });
    on('date/accounting-time-bets-second-period-span-from', function (data) {
        betsSecondPeriodFrom = data;
    });
    on('date/accounting-time-bets-second-period-span-to', function (data) {
        betsSecondPeriodTo = data;
    });

    function getTotalPerGame() {
        mainTable.innerHTML = "";
        addLoader(totalGetButton);
        trigger('comm/advance-statistics/totalPerGame/get', {
            body: {
                firstPeriod: {
                    fromTime: mainFirstPeriodFrom,
                    toTime: mainFirstPeriodTo,
                },
                secondPeriod: {
                    fromTime: mainSecondPeriodFrom,
                    toTime: mainSecondPeriodTo,
                },
            },
            success: function (response) {
                removeLoader(totalGetButton);
                if (response.responseCode === message.codes.success) {
                    fillTable(mainTable, parseGameData(response.result));
                } else {
                    trigger('message', response.responseCode);
                }
            }
        });
    };

    function getPortalsPerGame() {
        portalsTable.innerHTML = "";
        addLoader(portalsGetButton);
        trigger('comm/advance-statistics/portalsPerGame/get', {
            body: {
                portalId: $$('#advance-statistics-portals-portals-list').getSelected(),
                firstPeriod: {
                    fromTime: portalsFirstPeriodFrom,
                    toTime: portalsFirstPeriodTo,
                },
                secondPeriod: {
                    fromTime: portalsSecondPeriodFrom,
                    toTime: portalsSecondPeriodTo,
                },
            },
            success: function (response) {
                removeLoader(portalsGetButton);
                if (response.responseCode === message.codes.success) {
                    fillTable(portalsTable, parseGameData(response.result));
                } else {
                    trigger('message', response.responseCode);
                }
            }
        });
    };

    on('date/accounting-time-span-from', function (data) {
        reportsFromDate = data;
    });
    on('date/accounting-time-span-to', function (data) {
        reportsToDate = data;
    });

    on('advance-statistics/main/loaded', function () {
        mainTable.innerHTML = '';
    });

    on('advance-statistics/portals/loaded', function () {
        portalsTable.innerHTML = '';
        clearElement($$('#accounting-portals-list'));
        //$$('#advance-statistics-get-portals').classList.add('hidden');

        addLoader($$('#sidebar-advance-statistics'));
        trigger('comm/accounting/operators/get', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    getPortals(response.result, 'portals');
                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader($$('#sidebar-advance-statistics'));
            },
            fail: function () {
                removeLoader($$('#sidebar-advance-statistics'));
            }
        });
    });

    on('advance-statistics/players/loaded', function () {

    });

    on('advance-statistics/bets/loaded', function () {

    });

    function getPortals(data, tab) {
        clearElement($$(`#advance-statistics-${tab}-portals-list`));
        let portalsDropdown = dropdown.generate(data, `advance-statistics-${tab}-portals-list`, 'Select portal');
        $$(`#advance-statistics-${tab}-portals-list-wrapper`).appendChild(portalsDropdown);
        if (!data) $$(`#advance-statistics-${tab}-portals-list-wrapper`).style.display = 'none';
        $$('#advance-statistics-get-portals').classList.remove('hidden');
    }

    function parseGameData(data) {
        if (Object.getOwnPropertyNames(data).length === 0) {
            return [];
        }
        let keys = Object.keys(data);
        let rowKeys = Object.keys(data[keys[0]]);
        let tableData = [];

        for (let key of keys) {
            let row = {};
            row['Game'] = key;
            for (let rowKey of rowKeys) {
                row[rowKey] = data[key][rowKey];
            }
            tableData.push(row);
        }
        return tableData;
    };

    function makePortalDropdown(elementAfter, newElementId, data) {
        //TODO: implement portals dropdown generation
    };

    totalGetButton.addEventListener('click', getTotalPerGame);
    portalsGetButton.addEventListener('click', getPortalsPerGame);
}();