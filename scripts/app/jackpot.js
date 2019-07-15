let jackpot = function () {
    let portalJackpotSettingsTable;
    let activeJackpotData;
    let jackpotHistoryDataTable;
    let jackpotHistoryFirstPeriodFrom = getToday();
    let jackpotHistorySecondPeriodFrom = getToday();
    let jackpotHistoryTable = $$('#jackpotHistoryTable');
   

    function getActiveJackpotsTable() {
        trigger('comm/configuration/jackpot/active/get', {
            success: function (response) {
                if (response.responseCode === 1000) {
                    activeJackpotData = response.result;
                    $$('#activeJackpotTable').innerHTML = '';
                    $$('#activeJackpotTable').appendChild(table.generate({
                        data: activeJackpotData,
                        id: 'activeJackpotTable',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true
                    }));
                    table.preserveHeight($$('#activeJackpotTable'));
                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader($$('#sidebar-jackpot'));

            },
            fail: function () {
                removeLoader($$('#sidebar-jackpot'));
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
            fail: function () {
                removeLoader($$('#sidebar-jackpot'));
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
                //  addLoader($$(`#configuration-jackpot-filter`));
                trigger('comm/accounting/portals/get', {
                    body: {
                        id: value
                    },
                    success: function (response) {
                        if (response.responseCode === message.codes.success) {
                            loadJackpotPortals(response);
                            $$(`#configuration-get-jackpot`).style.display = "block"
                        } else {
                            trigger('message', response.responseCode);
                        }
                        //removeLoader($$(`#configuration-jackpot-filter`));
                    },
                    fail: function () {
                        //removeLoader($$(`#configuration-jackpot-filter`));
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
        $$(`#jackpot-get-settings`).classList.remove('hidden');

    };

    function getPortalSettingsTable() {
        trigger('comm/configuration/jackpot/portal/get', {
            body: {
                id: $$('#configuration-jackpot-portals-list').getSelected(),
            },
            success: function (response) {
                if (response.responseCode === 1000 && !response.result.isEmpty()) {
                    portalJackpotSettingsTable = response.result;
                    $$('#jackpotPortalSettingsTable').innerHTML = '';
                    $$('#jackpotPortalSettingsTable').appendChild(table.generate({
                        data: parseGameData(portalJackpotSettingsTable, 'Jackpot type'),
                        id: 'portalJackpotSettingsTable',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true
                    }));
                    table.preserveHeight($$('#portalJackpotSettingsTable'));
                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader($$('#sidebar-jackpot'));

            },
            fail: function () {
                removeLoader($$('#sidebar-jackpot'));
            }
        });
    };

    function parseGameData(data, firstColName) {
        if (Object.getOwnPropertyNames(data).length === 0) {
            return [];
        }
        let keys = Object.keys(data);
        let rowKeys = Object.keys(data[keys[0]]);
        let tableData = [];

        for (let key of keys) {
            let row = {};
            row[firstColName] = key;
            for (let rowKey of rowKeys) {
                row[rowKey] = data[key][rowKey];
            }
            tableData.push(row);
        }
        return tableData;
    };

    function getJackpotHistoryTable() {
        //addLoader(totalGetButton);
        trigger('comm/configuration/jackpot/activefromtime/get', {
            body: {

                fromTime: jackpotHistoryFirstPeriodFrom,
                toTime: jackpotHistorySecondPeriodFrom

            },
            success: function (response) {
                // removeLoader(totalGetButton);
                if (response.responseCode === message.codes.success) {
                    jackpotHistoryDataTable = response.result;
                    $$('#jackpotHistoryTable').innerHTML = '';
                    $$('#jackpotHistoryTable').appendChild(table.generate({
                        data: parseGameData(jackpotHistoryDataTable, ''),
                        id: 'jackpotHistoryTable',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true
                    }));
                    table.preserveHeight($$('#jackpotHistoryTable'));
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                // removeLoader(totalGetButton);
            }
        });
    };

    function historyJackpotFilter(){
        let wrapperTable = $$('#jackpotHistoryTable');
        let input = $$('#portals-history-search');
        
        input.oninput = () => {
            search(wrapperTable, input.value);
        };

        input.onkeyup = (e) => {
            if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
                input.value = '';
                search(wrapperTable, '');
            }
        };
    }
    function search(element, term) {
        for (let tableRow of element.getElementsByTagName('div')) {
            if (tableRow.dataset.id.toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
                tableRow.style.display = 'table-row';
            } else {
                tableRow.style.display = 'none';
            }
        }
    }

    $$('#jackpot-get-settings').addEventListener('click', getPortalSettingsTable);

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
        addLoader($$('#sidebar-jackpot'));
        getJackpotPortalSettings();
    });

    on('jackpot/history/loaded', function () {
        historyJackpotFilter();

    });
   

}();
