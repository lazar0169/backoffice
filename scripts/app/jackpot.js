let jackpot = function () {
    let portalJackpotSettingsTable;
    let activeJackpotData;
    let jackpotHistoryDataTable;
    let jackpotHistoryFirstPeriodFrom = getToday();
    let jackpotHistorySecondPeriodFrom = getToday();
    let currentHistoryTable;
    let historyTable;
    let activeTable;
    let inputHistoryValue = $$('#portals-history-search');
    let inputActiveValue = $$('#portals-active-search');


    function getActiveJackpotsTable() {
        trigger('comm/configuration/jackpot/active/get', {
            success: function (response) {
                if (response.responseCode === 1000) {
                    $$('#activeJackpotTable').innerHTML = '';
                    activeJackpotData = response.result;
                    activeTable = table.generate({
                        data: activeJackpotData,
                        id: 'activeJackpotTable',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true
                    });
                    $$('#activeJackpotTable').appendChild(activeTable);
                    $$('#search-active-mobile-width').style.display = 'flex'; 
                    
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
                    fail: function () {
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
      
        if(!$$('#configuration-jackpot-portals-list').getSelected()){
            trigger('message', message.codes.badParameter);
            return
        }
        $$('#jackpotPortalSettingsTable').style.display = 'block'
      
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
        $$('#jackpotHistoryTable').style.display = 'block'
        trigger('comm/configuration/jackpot/activefromtime/get', {
            body: {

                fromTime: jackpotHistoryFirstPeriodFrom,
                toTime: jackpotHistorySecondPeriodFrom

            },
            success: function (response) {
                if (response.responseCode === message.codes.success && response.result.length > 0) {
                    jackpotHistoryDataTable = response.result;
                    $$('#jackpotHistoryTable').innerHTML = '';
                    currentHistoryTable = parseGameData(jackpotHistoryDataTable, '');
                    historyTable = table.generate({
                        data: parseGameData(jackpotHistoryDataTable, ''),
                        id: 'jackpotHistoryTable',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true
                    });
                    $$('#jackpotHistoryTable').appendChild(historyTable);
                    $$('#search-history-mobile-width').style.display = 'flex'; 
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
            }
        });
    };


    inputHistoryValue.oninput = () => {
        historyTable.update(search(currentHistoryTable, inputHistoryValue.value), true);

    };
    inputHistoryValue.onkeyup = (e) => {
        if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
            inputHistoryValue.value = '';
            historyTable.update(search(currentHistoryTable, inputHistoryValue.value), true); 
         }
    };

    inputActiveValue.oninput = () => {
        activeTable.update(search(activeJackpotData, inputActiveValue.value), true);

    };
    inputActiveValue.onkeyup = (e) => {
        if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
            inputActiveValue.value = '';
            activeTable.update(search(activeJackpotData, inputActiveValue.value), true); 
         }
    };
    // function historyJackpotFilter(inputField, table, tableToUpdate ) {
    //     //let wrapperTable = $$('#jackpotHistoryTable');
    //     let input = inputField;

    //     input.oninput = () => {
    //        // search(table, input.value);
    //         tableToUpdate.update(search(table, input.value), true);
    //         //search(wrapperTable, input.value,7);
    //     };

    //     input.onkeyup = (e) => {
    //         if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
    //             input.value = '';
    //             //  search(wrapperTable, '',7);
    //         }
    //     };
    // }
    function search(elements, term) {
        let res = [];

        for (let el of elements) {
            let columnKeys = Object.keys(el);
            for(let key of columnKeys){
                if (String(el[`${key}`]).toLocaleLowerCase().includes((term.toLocaleLowerCase()))) {
                    res.push(el);
                    break;
                }
            }
        }
        return res;

        //1
        // for (let tableRow of element.getElementsByTagName('tr')) {
        //     if (tableRow.outerText.toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
        //         tableRow.style.display = 'table-row';
        //     } else {
        //         tableRow.style.display = 'none';
        //     }
        // }


        //2
        //   let input = term;
        //   let filter = input.toUpperCase();
        //   let table = element;
        //   let tr = table.getElementsByTagName("tr");

        //   for (let i = 0; i < tr.length; i++) {
        //     let td = tr[i].getElementsByTagName("td")[columnToSort];
        //     if (td) {
        //      let txtValue = td.textContent || td.innerText;
        //       if (txtValue.toUpperCase().indexOf(filter) > -1) {
        //         tr[i].style.display = "";
        //       } else {
        //         tr[i].style.display = "none";
        //       }
        //     }       
        //   }
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
        $$('#search-active-mobile-width').style.display = 'none'; 
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
        $$('#search-history-mobile-width').style.display = 'none'; 
        $$('#jackpotHistoryTable').style.display = 'none'
    });


}();
