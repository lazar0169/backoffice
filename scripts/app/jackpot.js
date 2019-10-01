let jackpot = function () {
    let portalJackpotSettingsTable;
    let activeJackpotData;
    let jackpotHistoryDataTable;
    let jackpotHistoryFirstPeriodFrom = getToday();
    let jackpotHistorySecondPeriodFrom = getToday();
    let currentHistoryTable;
    let historyTable;
    let activeTable;

    function getActiveJackpotsTable() {
        trigger('comm/configuration/jackpot/active/get', {
            success: function (response) {
                if (response.responseCode === 1000) {
                    $$('#activeJackpotTable').innerHTML = '';
                    activeJackpotData = response.result;
                    activeTable = table.generate({
                        data: activeJackpotData,
                        dynamic: false,
                        sticky: true,
                        stickyCol: true,
                        canSearch: true,
                        perPage: 20
                    });
                    $$('#activeJackpotTable').appendChild(activeTable);

                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader($$('#sidebar-jackpot'));

            },
            fail: function (response) {
                removeLoader($$('#sidebar-jackpot'));
                trigger('message', response.responseCode);
            }

        });
    }

    function getJackpotPortalSettings() {
        trigger('comm/accounting/operators/get', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    // Prevent operator change
                    if (roles.getRole() === 'Manager') {
                        response = {
                            responseCode: 1000
                        };
                    }
                    loadJackpotOperators(response);
                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader($$('#sidebar-jackpot'));
            },
            fail: function (response) {
                removeLoader($$('#sidebar-jackpot'));
                trigger('message', response.responseCode);
            }
        });
    }

    function loadJackpotOperators(response) {
        if (response.responseCode === message.codes.success) {
            clearElement($$(`#configuration-jackpot-operators-list`));
            let operatorsDropdown = dropdown.generate(response.result, `configuration-jackpot-operators-list`, 'Select operator');
            $$(`#configuration-jackpot-operators-list-wrapper`).appendChild(operatorsDropdown);
            if (!response.result) $$(`#configuration-jackpot-operators-list-wrapper`).style.display = 'none';

            on(`configuration-jackpot-operators-list/selected`, function (value) {
                trigger('comm/accounting/portals/get', {
                    body: {
                        id: value
                    },
                    success: function (response) {
                        if (response.responseCode === message.codes.success) {
                            loadJackpotPortals(response);
                        } else {
                            trigger('message', response.responseCode);
                        }
                    },
                    fail: function (response) {
                        trigger('message', response.responseCode);
                    }
                });
            });

            // Prevent operator change
            if (roles.getRole() === 'Manager') {
                trigger('accounting-operators-list/selected', 0);
            }

        } else {
            trigger('message', response.responseCode);
        }
    };

    function loadJackpotPortals(data) {
        clearElement($$(`#configuration-jackpot-portals-list`));
        let portalsDropdown = dropdown.generate(data.result, `configuration-jackpot-portals-list`, 'Select portal');
        $$(`#configuration-jackpot-portals-list-wrapper`).appendChild(portalsDropdown);
        if (!data.result) $$(`#configuration-jackpot-portals-list-wrapper`).style.display = 'none';
        $$(`#jackpot-get-settings-button`).classList.remove('hidden');
        $$('#jackpot-get-settings-button').style.display = 'block'


    };

    function getPortalSettingsTable() {
        addLoader($$('#jackpot-get-settings-button'));
        if (!$$('#configuration-jackpot-portals-list').getSelected()) {
            removeLoader($$('#jackpot-get-settings-button'));
            trigger('message', message.codes.badParameter);
            return
        }
        trigger('comm/configuration/jackpot/portal/get', {
            body: {
                id: $$('#configuration-jackpot-portals-list').getSelected(),
            },
            success: function (response) {
                removeLoader($$('#jackpot-get-settings-button'));
                if (response.responseCode === 1000 && !response.result.isEmpty()) {
                    if (isEmpty(response.result) === true) {
                        trigger('message', message.codes.noData);
                        $$('#jackpotPortalSettingsTable').style.display = 'none'
                        return
                    }
                    portalJackpotSettingsTable = response.result;
                    $$('#jackpotPortalSettingsTable').innerHTML = '';
                    $$('#jackpotPortalSettingsTable').appendChild(table.generate({
                        data: parseGameData(portalJackpotSettingsTable, 'Jackpot type'),
                        id: 'portalJackpotSettingsTable',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true
                    }));
                    $$('#jackpotPortalSettingsTable').style.display = 'block'
                    table.preserveHeight($$('#portalJackpotSettingsTable'));

                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader($$('#sidebar-jackpot'));

            },
            fail: function (response) {
                removeLoader($$('#jackpot-get-settings-button'));
                trigger('message', response.responseCode);
                removeLoader($$('#sidebar-jackpot'));
            }
        });
    };

    function parseGameData(data) {
        if (Object.getOwnPropertyNames(data).length === 0) {
            return [];
        }
        let keys = Object.keys(data);
        let rowKeys = Object.keys(data[keys[0]]);
        let tableData = [];

        for (let key of keys) {
            let row = {};
            for (let rowKey of rowKeys) {
                row[rowKey] = data[key][rowKey];
            }
            tableData.push(row);
        }
        return tableData;
    };

    function getJackpotHistoryTable() {
        $$('#jackpotHistoryTable').style.display = 'none';
        trigger('comm/configuration/jackpot/activefromtime/get', {
            body: {
                fromTime: jackpotHistoryFirstPeriodFrom,
                toTime: jackpotHistorySecondPeriodFrom
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    if (isEmpty(response.result) === true) {
                        trigger('message', message.codes.noData);
                        $$('#jackpotHistoryTable').style.display = 'none';
                        return
                    }
                    jackpotHistoryDataTable = response.result;
                    $$('#jackpotHistoryTable').innerHTML = '';
                    currentHistoryTable = parseGameData(jackpotHistoryDataTable, '');
                    historyTable = table.generate({
                        data: parseGameData(jackpotHistoryDataTable, ''),
                        id: 'jackpotHistoryTable',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true,
                        canSearch: true,
                        perPage: 20
                    });
                    $$('#jackpotHistoryTable').style.display = 'block'
                    $$('#jackpotHistoryTable').appendChild(historyTable);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function (response) {
                trigger('message', response.responseCode);
            }
        });
    };

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    $$('#jackpot-get-settings-button').addEventListener('click', getPortalSettingsTable);

    $$('#jackpot-get-history').addEventListener('click', getJackpotHistoryTable);

    on('date/jackpot-first-period-time-span-from', function (data) {
        jackpotHistoryFirstPeriodFrom = data;
    });

    on('date/jackpot-second-period--time-span-to', function (data) {
        jackpotHistorySecondPeriodFrom = data;
    });

    on('jackpot/active/loaded', function () {
        addLoader($$('#sidebar-jackpot'));
        getActiveJackpotsTable();
    });

    on('jackpot/settings/loaded', function () {
        $$('#jackpot-get-settings-button').style.display = 'none'
        $$('#jackpotPortalSettingsTable').style.display = 'none'
        addLoader($$('#sidebar-jackpot'));
        clearElement($$(`#configuration-jackpot-portals-list`));
        getJackpotPortalSettings();

    });

    on('jackpot/history/loaded', function () {
        $$('#jackpotHistoryTable').style.display = 'none'
    });


}();
