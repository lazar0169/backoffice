let advanceAccounting = function () {
    let main = $$('#advance-statistics-main');
    let portals = $$('#advance-statistics-portals');
    let players = $$('#advance-statistics-players');
    let bets = $$('#advance-statistics-bets');
    const totalGetButton = $$('#advance-statistics-get-total');
    let mainTable = $$('#advance-statistics-main-table');
    let portalsTable = $$('#advance-statistics-portals-table');
    let firstPeriodFrom = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let firstPeriodTo = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let secondPeriodFrom = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let secondPeriodTo = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';

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
        firstPeriodFrom = data;
    });
    on('date/accounting-time-main-first-period-span-to', function (data) {
        firstPeriodTo = data;
    });
    on('date/accounting-time-main-second-period-span-from', function (data) {
        secondPeriodFrom = data;
    });
    on('date/accounting-time-main-second-period-span-to', function (data) {
        secondPeriodTo = data;
    });

    function getTotalPerGame() {
        mainTable.innerHTML = "";
        addLoader(totalGetButton);
        trigger('comm/advance-statistics/totalPerGame/get', {
            body: {
                firstPeriod: {
                    fromTime: firstPeriodFrom,
                    toTime: firstPeriodTo,
                },
                secondPeriod: {
                    fromTime: secondPeriodFrom,
                    toTime: secondPeriodTo,
                },
            },
            success: function (response) {
                removeLoader(totalGetButton);
                if (response.responseCode === message.codes.success) {
                    fillTable(mainTable, parseMainData(response.result));
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
        $$('#advance-statistics-get-portals').classList.add('hidden');

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

    function parseMainData(data) {
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
    }

    totalGetButton.addEventListener('click', getTotalPerGame);
}();