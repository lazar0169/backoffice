let advanceAccounting = function () {
    let main = $$('#advance-statistics-main');
    let portals = $$('#advance-statistics-portals');
    let players = $$('#advance-statistics-players');
    let bets = $$('#advance-statistics-bets');
    const totalGetButton = $$('#advance-statistics-get-total');
    let firstPeriodFrom = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let firstPeriodTo = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let secondPeriodFrom = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let secondPeriodTo = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let selectedRow;

    let actionByRoles = {
        'Admin': 'comm/accounting/get',
        'Accounting': 'comm/accounting/get',
        'Manager': 'comm/accounting/manager/get',
    };

    function fillTable(tableElement, data, options) {
        let tableObject = table.generate({
            data: data,
            id: 'advance-statistics-main-table',
            dynamic: true,
            sticky: true,
            stickyCol: true,
        });
        //table.preserveHeight(tableElement.parentElement);
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

    function getTotalPerGame(){
        let mainTable = $$('#advance-statistics-main-table');
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
                    let tableOptions = {
                        dynamic: true,
                        sticky: true,
                        stickyCol: true,
                    };
                    
                    fillTable(mainTable, parseMainData(response.result), tableOptions);
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
        let mainTable = $$('#advance-statistics-main-table');
        mainTable.innerHTML = ""; 
    });

    on('advance-statistics/portals/loaded', function () {
       
    });

    on('advance-statistics/players/loaded', function () {
       
    });

    on('advance-statistics/bets/loaded', function () {
       
    });

    function parseMainData(data){
        let keys = Object.keys(data);
        let rowKeys = Object.keys(data[keys[0]]);
        let tableData = [];

        for (let key of keys) {
            let row = {};
            row['Game'] = key;
            for(let rowKey of rowKeys){
                row[rowKey] = data[key][rowKey];
            }
            tableData.push(row);
        }
        return tableData;
    };

    totalGetButton.addEventListener('click', getTotalPerGame);
}();