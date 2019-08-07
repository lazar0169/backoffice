let advanceAccounting = function () {
    let main = $$('#management-main');
    let portals = $$('#management-portals');
    let players = $$('#management-players');
    let bets = $$('#management-bets');
    //main tab
    const totalGetButton = $$('#management-get-total');
    const getTotalExcelButton = $$('#management-excel-total');
    const mainCheckbox = $$('#management-main-period-checkbox');
    let mainTable = $$('#management-main-table');
    let mainFirstPeriodFrom = getToday();
    let mainFirstPeriodTo = getToday();
    let mainSecondPeriodFrom = getToday();
    let mainSecondPeriodTo = getToday();
    //portals tab 
    const portalsGetButton = $$('#management-get-portals');
    const portalCheckbox = $$('#management-portals-period-checkbox');
    const getPortalsExcelButton = $$('#management-excel-portals');
    const getPortalsFormExcelButton = $$('#portals-form-download-excel');
    const getPortalsPlayersFormExcelButton = $$('#portals-player-form-download-excel');
    let portalsTable = $$('#management-portals-table');
    let portalFormTable = $$('#portals-form-table');
    let portalPlayerFormTable = $$('#portals-player-form-table');
    let portalsFirstPeriodFrom = getToday();
    let portalsFirstPeriodTo = getToday();
    let portalsSecondPeriodFrom = getToday();
    let portalsSecondPeriodTo = getToday();
    //players tab
    const playersGetButton = $$('#management-get-players');
    const playerCheckbox = $$('#management-players-period-checkbox');
    const getPlayersExcelButton = $$('#management-excel-players');
    const getPlayerExcelButton = $$('#players-form-download-excel');
    let playersTable = $$('#management-players-table');
    let playersFormTable = $$('#players-form-table');
    let playersFirstPeriodFrom = getToday();
    let playersFirstPeriodTo = getToday();
    let playersSecondPeriodFrom = getToday();
    let playersSecondPeriodTo = getToday();
    //bets tab
    const betsGetButton = $$('#management-get-bets');
    let betsTable = $$('#management-bets-table');
    let betsFirstPeriodFrom = getToday();
    let betsFirstPeriodTo = getToday();
    let checkedGames = [];
    let betsResult = [];
    let selectedGames = null;
    let popupHidden = true;
    let selectedRowId = null;
    let isPortalPoupOpened = false;
    let portalsSelected = [];
    let portalsDataList = undefined
    let portalGameName = undefined;
    let activeCategory = undefined;

    let totalData;
    let portalsData;
    let playersData;
    let playerData;
    let portalFormData;
    let portalPlayerFormData;

    let isPerNumberOfHandsSelected = false;
    const secondFilterButton = $$('#management-get-bets-percentage');
    let betsCheckbox = $$('#management-bets-checkbox');

    $$('#portals-black-overlay').addEventListener('click', hidePortalPopup);
    $$('#portals-player-form-back').addEventListener('click', hidePlayerPortalPopup);
    $$('#portals-form-cancel').addEventListener('click', hidePortalPopup);
    $$('#players-black-overlay').addEventListener('click', hidePopup);
    $$('#players-form-cancel').addEventListener('click', hidePopup);

    
    function changePerNumberOfView() {
        if (isPerNumberOfHandsSelected) {
            for (let game in betsResult.perNumberOfHands) {
                let tableViewHands = $$(`#${game}-per-number-of-hands`);
                let tableViewPlayers = $$(`#${game}-per-number-of-players`);
                if (tableViewHands) {
                    tableViewHands.parentElement.classList.remove('hidden');
                }
                if (tableViewPlayers) {
                    tableViewPlayers.parentElement.classList.add('hidden');
                }
            }
        }
        else {
            for (let game in betsResult.perNumberOfPlayers) {
                let tableViewPlayers = $$(`#${game}-per-number-of-players`);
                let tableViewHands = $$(`#${game}-per-number-of-hands`);
                if (tableViewPlayers) {
                    tableViewPlayers.parentElement.classList.remove('hidden');
                }
                if (tableViewHands) {
                    tableViewHands.parentElement.classList.add('hidden');
                }
            }
        }
    };

    function addGameToList(event) {
        const gameIndex = checkedGames.indexOf(event.target.innerHTML);
        gameIndex === -1 ? checkedGames.push(event.target.innerHTML) : checkedGames.splice(gameIndex, 1);
    };

    function fillTable(tableElement, data, callback, tableName, sum, preserveHeight = false) {
        let tableObject = table.generate({
            data: data,
            id: tableName,
            sum: sum,
            sticky: true,
            stickyCol: false,
            options: {
                onClick: callback
            }
        });
        tableElement.appendChild(tableObject);
        if (preserveHeight) {
            table.preserveHeight(tableElement.parentElement);
        }
    };

    function prepareBetsTable(games) {
        $$('#management-wanted-percentage').value = "";
        $$('#management-second-filter-result').value = "";
        let wrapperTable = betsTable.getElementsByTagName('table')[0];
        //let input = $$('#management-bets-search');
        betsTable.classList.remove('hidden');

        // IF NEEDED SEARCH BAR UNCOMMENT 
        // input.addEventListener('input', function () {
        //     searchGames(wrapperTable, input.value);
        // });

        // input.addEventListener('keyup', function (e) {
        //     if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
        //         input.value = '';
        //         searchGames(wrapperTable, '');
        //     }
        // });

        // $$('#management-bets-remove-search').onclick = function () {
        //     input.value = '';
        //     searchGames(wrapperTable, '');
        // };

        //input.value = '';
        searchGames(wrapperTable, '');
        let body = document.createElement('tbody');
        wrapperTable.appendChild(body);
        hideAllRows(wrapperTable);

        for (let game in games.result.perNumberOfHands) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            //checkbox things
            let gameCheckboxWrapper = document.createElement('div');
            let gameCheckbox = document.createElement('input');
            let gameCheckboxLabel = document.createElement('label');
            gameCheckboxWrapper.id = 'management-bets-game-checkbox-wrapper';
            gameCheckboxWrapper.classList.add('game-title');

            gameCheckbox.id = `management-bets-game-checkbox-${game}`;
            gameCheckbox.type = 'checkbox';
            gameCheckbox.value = game;
            gameCheckbox.name = game;

            gameCheckboxLabel.htmlFor = `management-bets-game-checkbox-${game}`;
            gameCheckboxLabel.innerHTML = `${game}`;
            gameCheckboxLabel.addEventListener('click', addGameToList);

            gameCheckboxWrapper.appendChild(gameCheckbox);
            gameCheckboxWrapper.appendChild(gameCheckboxLabel);
            //checkbox things end
            td.appendChild(gameCheckboxWrapper);
            td.className = 'collapsed';
            tr.dataset.id = game;
            tr.appendChild(td);
            body.appendChild(tr);
            td.collapsed = true;
            td.onclick = () => {
                if (td.collapsed) {
                    if (!td.created) {
                        let tPerNumberOfHands = table.generate({
                            data: games.result.perNumberOfHands[game],
                            id: `${game}-per-number-of-hands`,
                            dynamic: false,
                            sticky: true,
                            stickyCol: true
                        });
                        let tPerNumberOfPlayers = table.generate({
                            data: games.result.perNumberOfPlayers[game],
                            id: `${game}-per-number-of-players`,
                            dynamic: false,
                            sticky: true,
                            stickyCol: true
                        })
                        td.appendChild(tPerNumberOfHands);
                        td.appendChild(tPerNumberOfPlayers);
                        td.created = true;
                        table.preserveHeight(td);

                        if (isPerNumberOfHandsSelected) {
                            tPerNumberOfPlayers.classList.add('hidden');
                        }
                        else {
                            tPerNumberOfHands.classList.add('hidden');
                        }
                    }
                    td.collapsed = false;
                    td.classList.remove('collapsed');
                } else {
                    td.classList.add('collapsed');
                    td.collapsed = true;
                }
            }
        }
    };

    on('date/management-main-first-period-time-span-from', function (data) {
        mainFirstPeriodFrom = data;
    });
    on('date/management-main-first-period-time-span-to', function (data) {
        mainFirstPeriodTo = data;
    });
    on('date/management-main-second-period-time-span-from', function (data) {
        mainSecondPeriodFrom = data;
    });
    on('date/management-main-second-period-time-span-to', function (data) {
        mainSecondPeriodTo = data;
    });

    on('date/management-portals-first-period-time-span-from', function (data) {
        portalsFirstPeriodFrom = data;
    });
    on('date/management-portals-first-period-time-span-to', function (data) {
        portalsFirstPeriodTo = data;
    });
    on('date/management-portals-second-period-time-span-from', function (data) {
        portalsSecondPeriodFrom = data;
    });
    on('date/management-portals-second-period-time-span-to', function (data) {
        portalsSecondPeriodTo = data;
    });

    on('date/management-players-first-period-time-span-from', function (data) {
        playersFirstPeriodFrom = data;
    });
    on('date/management-players-first-period-time-span-to', function (data) {
        playersFirstPeriodTo = data;
    });
    on('date/management-players-second-period-time-span-from', function (data) {
        playersSecondPeriodFrom = data;
    });
    on('date/management-players-second-period-time-span-to', function (data) {
        playersSecondPeriodTo = data;
    });

    on('date/management-bets-first-period-time-span-from', function (data) {
        betsFirstPeriodFrom = data;
    });
    on('date/management-bets-first-period-time-span-to', function (data) {
        betsFirstPeriodTo = data;
    });

    function getTotalPerGame() {
        mainTable.innerHTML = "";
        addLoader(totalGetButton);
        trigger('comm/management/totalPerGame/get', {
            body: {
                firstPeriod: {
                    fromTime: mainFirstPeriodFrom,
                    toTime: mainFirstPeriodTo,
                },
                secondPeriod: mainCheckbox.checked ? {
                    fromTime: mainSecondPeriodFrom,
                    toTime: mainSecondPeriodTo,
                } : null,
            },
            success: function (response) {
                removeLoader(totalGetButton);
                if (response.responseCode === message.codes.success) {
                    totalData = response.result;
                    fillTable(mainTable, parseGameData(response.result, `Game`), undefined, 'management-main-table-div', getGameSumData(response.result, `Game`));
                    mainTable.classList.remove('hidden');
                    getTotalExcelButton.classList.remove('hidden');
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader(totalGetButton);
            }
        });
    };

    function getPortalsPerGame() {
        portalsTable.innerHTML = "";
        portalsSelected = $$('#management-portals-portals-list').getSelected();
        addLoader(portalsGetButton);
        trigger('comm/management/portalsPerGame/get', {
            body: {
                portals: portalsSelected,
                firstPeriod: {
                    fromTime: portalsFirstPeriodFrom,
                    toTime: portalsFirstPeriodTo,
                },
                secondPeriod: portalCheckbox.checked ? {
                    fromTime: portalsSecondPeriodFrom,
                    toTime: portalsSecondPeriodTo,
                } : null,
            },
            success: function (response) {
                removeLoader(portalsGetButton);
                if (response.responseCode === message.codes.success) {
                    portalsData = response.result;
                    fillTable(portalsTable, parseGameData(response.result, `Game`), showPortalPopup, 'management-portals-table-div', getGameSumData(response.result, `Game`));
                    portalsTable.classList.remove('hidden');
                    getPortalsExcelButton.classList.remove('hidden');
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader(portalsGetButton);
            }
        });
    };

    function getPlayersOfPortal() {
        playersTable.innerHTML = "";
        addLoader(playersGetButton);
        trigger('comm/management/playersOfGame/get', {
            body: {
                portalId: $$('#management-players-portals-list').getSelected(),
                firstPeriod: {
                    fromTime: playersFirstPeriodFrom,
                    toTime: playersFirstPeriodTo,
                },
                secondPeriod: playerCheckbox.checked ? {
                    fromTime: playersSecondPeriodFrom,
                    toTime: playersSecondPeriodTo,
                } : null,
            },
            success: function (response) {
                removeLoader(playersGetButton);
                if (response.responseCode === message.codes.success) {
                    playersData = response.result;
                    fillTable(playersTable, parseGameData(response.result, `Player`), showPlayersPopup, 'management-players-table-div', getGameSumData(response.result, `Player`));
                    playersTable.classList.remove('hidden');
                    getPlayersExcelButton.classList.remove('hidden');
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader(playersGetButton);
            }
        });
    };

    function getBetsOfPortal() {
        checkedGames = [];
        betsResult = [];

        let tbody = betsTable.getElementsByTagName('table')[0].getElementsByTagName('tbody');
        if (tbody.length) {
            tbody[0].remove();
        }

        addLoader(betsGetButton);
        trigger('comm/management/betsOfGame/get', {
            body: {
                portalId: $$('#management-bets-portals-list').getSelected(),
                fromTime: betsFirstPeriodFrom,
                toTime: betsFirstPeriodTo,
            },
            success: function (response) {
                removeLoader(betsGetButton);
                if (response.responseCode === message.codes.success) {
                    betsResult = response.result;
                    prepareBetsTable(response);
                    $$('#management-bets-table-wrapper').classList.remove('hidden');
                    $$('#switch-and-search-wrapper').classList.remove('hidden');
                    $$('#bets-second-filter').classList.remove('hidden');
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader(betsGetButton);
            }
        });
    };

    function getRecommendedBetLimit() {
        selectedGames = getSelectedGames();

        addLoader(secondFilterButton);
        trigger('comm/management/RecommendBetLimit/get', {
            body: {
                betRangesItems: selectedGames,
                wantedPercentage: $$('#management-wanted-percentage').get(),
            },
            success: function (response) {
                removeLoader(secondFilterButton);
                if (response.responseCode === message.codes.success) {
                    $$('#management-second-filter-result').value = response.result;
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader(secondFilterButton);
            }
        });
    };

    function getTotalExcelData() {
        addLoader(getTotalExcelButton);
        trigger('comm/management/excel/get', {
            body: {
                managementResult: totalData,
                fileName: 'TotalPerGame',
                itemType: 'game',
                singleOrCompared: !mainCheckbox.checked
            },
            success: function (response) {
                removeLoader(getTotalExcelButton);
                if (response.responseCode === message.codes.success) {
                    saveBase64(`${response.result.name}.xlsx`, 'data:application/octet-stream;base64,' + response.result.data);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader(getTotalExcelButton);
            }
        });
    };

    function getPortalsExcelData() {
        addLoader(getPortalsExcelButton);
        trigger('comm/management/excel/get', {
            body: {
                managementResult: portalsData,
                fileName: 'PortalPerGame',
                itemType: 'game',
                singleOrCompared: !portalCheckbox.checked
            },
            success: function (response) {
                removeLoader(getPortalsExcelButton);
                if (response.responseCode === message.codes.success) {
                    saveBase64(`${response.result.name}.xlsx`, 'data:application/octet-stream;base64,' + response.result.data);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader(getPortalsExcelButton);
            }
        });
    };

    function getPlayersExcelData() {
        addLoader(getPlayersExcelButton);
        trigger('comm/management/excel/get', {
            body: {
                managementResult: playersData,
                fileName: 'PlayersOfPortal',
                itemType: 'player',
                singleOrCompared: !playerCheckbox.checked
            },
            success: function (response) {
                removeLoader(getPlayersExcelButton);
                if (response.responseCode === message.codes.success) {
                    saveBase64(`${response.result.name}.xlsx`, 'data:application/octet-stream;base64,' + response.result.data);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader(getPlayersExcelButton);
            }
        });
    };

    function getPlayerExcelData() {
        addLoader(getPlayerExcelButton);
        trigger('comm/management/excel/get', {
            body: {
                managementResult: playerData,
                fileName: 'PlayerPerGame',
                itemType: 'player',
                singleOrCompared: !playerCheckbox.checked
            },
            success: function (response) {
                removeLoader(getPlayerExcelButton);
                if (response.responseCode === message.codes.success) {
                    saveBase64(`${response.result.name}.xlsx`, 'data:application/octet-stream;base64,' + response.result.data);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader(getPlayerExcelButton);
            }
        });
    };

    function getPortalsFormExcelData() {
        addLoader(getPortalsFormExcelButton);
        trigger('comm/management/excel/get', {
            body: {
                managementResult: portalFormData,
                fileName: 'GamePerPortal',
                itemType: 'portal',
                singleOrCompared: !portalCheckbox.checked
            },
            success: function (response) {
                removeLoader(getPortalsFormExcelButton);
                if (response.responseCode === message.codes.success) {
                    saveBase64(`${response.result.name}.xlsx`, 'data:application/octet-stream;base64,' + response.result.data);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader(getPortalsFormExcelButton);
            }
        });
    };

    function getPortalsPlayersExcelData() {
        addLoader(getPortalsPlayersFormExcelButton);
        trigger('comm/management/excel/get', {
            body: {
                managementResult: portalPlayerFormData,
                fileName: 'GamePerPlayersOfPortal',
                itemType: 'player',
                singleOrCompared: !portalCheckbox.checked
            },
            success: function (response) {
                removeLoader(getPortalsPlayersFormExcelButton);
                if (response.responseCode === message.codes.success) {
                    saveBase64(`${response.result.name}.xlsx`, 'data:application/octet-stream;base64,' + response.result.data);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader(getPortalsPlayersFormExcelButton);
            }
        });
    };

    on('currency/management', function () {
        switch (activeCategory) {
            case 'main':
                getTotalPerGame();
                break;
            case 'portals':
                if ($$('#management-portals-portals-list')) {
                    getPortalsPerGame();
                }
                break;
            case 'players':
                if ($$('#management-players-portals-list')) {
                    getPlayersOfPortal();
                }
                break;
            case 'bets':
                if ($$('#management-bets-portals-list')) {
                    getBetsOfPortal();
                }
                break;
            default: return;
        }
    });

    on('management/main/loaded', function () {
        mainTable.innerHTML = '';
        mainTable.classList.add('hidden');
        getTotalExcelButton.classList.add('hidden');
        // $$('#management-main-second-period-wrapper').classList.add('hidden');
        //  $$('#management-main-second-period-wrapper').style.display = "none";
        activeCategory = `main`;
    });

    on('management/portals/loaded', function () {
        portalsTable.innerHTML = '';
        // $$('#management-portals-second-period-wrapper').classList.add('hidden');
        portalsTable.classList.add('hidden');
        getPortalsExcelButton.classList.add('hidden');
        clearElement($$('#management-portals-operators-list'));
        clearElement($$('#management-portals-portals-list'));
        $$('#management-get-portals').classList.add('hidden');
        activeCategory = `portals`;

        addLoader($$('#sidebar-management'));

        trigger('comm/accounting/operators/get', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    afterLoad(response, `portals`);
                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader($$('#sidebar-management'));
            },
            fail: function () {
                removeLoader($$('#sidebar-management'));
            }
        });
    });

    on('management/players/loaded', function () {
        hidePopup();
        playersTable.innerHTML = '';
        // $$('#management-players-second-period-wrapper').classList.add('hidden');
        playersTable.classList.add('hidden');
        getPlayersExcelButton.classList.add('hidden');
        playersFormTable.innerHTML = '';
        clearElement($$('#management-players-operators-list'));
        clearElement($$('#management-players-portals-list'));
        $$('#management-get-players').classList.add('hidden');
        activeCategory = `players`;

        addLoader($$('#sidebar-management'));

        trigger('comm/accounting/operators/get', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    afterLoad(response, `players`);
                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader($$('#sidebar-management'));
            },
            fail: function () {
                removeLoader($$('#sidebar-management'));
            }
        });
    });

    on('management/bets/loaded', function () {
        isPerNumberOfHandsSelected = false;
        betsCheckbox.checked = true;
        checkedGames = [];
        betsResult = [];
        clearElement($$('#management-bets-operators-list'));
        clearElement($$('#management-bets-portals-list'));
        activeCategory = `bets`;

        $$('#switch-and-search-wrapper').classList.add('hidden');
        $$('#bets-second-filter').classList.add('hidden');
        $$('#management-get-bets').classList.add('hidden');
        betsTable.classList.add('hidden');

        let tbody = betsTable.getElementsByTagName('table')[0].getElementsByTagName('tbody');
        if (tbody.length) {
            tbody[0].remove();
        }

        addLoader($$('#sidebar-management'));

        trigger('comm/accounting/operators/get', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    afterLoad(response, `bets`);
                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader($$('#sidebar-management'));
            },
            fail: function () {
                removeLoader($$('#sidebar-management'));
            }
        });
    });

    function parseGameData(data, firstColName) {
        if (Object.getOwnPropertyNames(data.managementItems).length === 0) {
            return [];
        }
        let keys = Object.keys(data.managementItems);
        let rowKeys = Object.keys(data.managementItems[keys[0]]);
        let tableData = [];

        for (let key of keys) {
            let row = {};
            row[firstColName] = key;
            for (let rowKey of rowKeys) {
                row[rowKey] = data.managementItems[key][rowKey];
            }
            tableData.push(row);
        }
        return tableData;
    };

    function afterLoad(response, tab) {
        if (response.responseCode === message.codes.success) {
            clearElement($$(`#management-${tab}-operators-list`));
            let operatorsDropdown = dropdown.generate(response.result, `management-${tab}-operators-list`, 'Select operator');
            $$(`#management-${tab}-operators-list-wrapper`).appendChild(operatorsDropdown);
            if (!response.result) $$(`#management-${tab}-operators-list-wrapper`).style.display = 'none';

            on(`management-${tab}-operators-list/selected`, function (value) {
                addLoader($$(`#management-${tab}-filter`));
                trigger('comm/accounting/portals/get', {
                    body: {
                        id: value
                    },
                    success: function (response) {
                        if (response.responseCode === message.codes.success) {
                            getPortals(response, tab);
                        } else {
                            trigger('message', response.responseCode);
                        }
                        removeLoader($$(`#management-${tab}-filter`));
                    },
                    fail: function () {
                        removeLoader($$(`#management-${tab}-filter`));
                    }
                });
            });

        } else {
            trigger('message', response.responseCode);
        }
    };

    function getPortals(data, tab) {
        clearElement($$(`#management-${tab}-portals-list`));
        let isMultiple = undefined;
        if (tab == 'portals') {
            isMultiple = true;
            portalsDataList = data.result;
        }
        let portalsDropdown = dropdown.generate(data.result, `management-${tab}-portals-list`, 'Select portal', isMultiple);
        $$(`#management-${tab}-portals-list-wrapper`).appendChild(portalsDropdown);
        if (!data.result) $$(`#management-${tab}-portals-list-wrapper`).style.display = 'none';
        $$(`#management-get-${tab}`).classList.remove('hidden');
    };

    function showPlayersPopup(rowData, rowId) {
        if (popupHidden) {
            hidePopup();
            return;
        }
        popupHidden = !popupHidden;
        playersFormTable.innerHTML = '';
        let form = $$(`#players-form`);
        selectedRowId = rowId;
        let sumRow = makePlayerGamesSumRow(rowData);

        trigger('comm/management/playerGames/get', {
            body: {
                player: rowData.Player,
                firstPeriod: {
                    fromTime: playersFirstPeriodFrom,
                    toTime: playersFirstPeriodTo,
                },
                secondPeriod: !playerCheckbox ? {
                    fromTime: playersSecondPeriodFrom,
                    toTime: playersSecondPeriodTo,
                } : null,
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    playerData = response.result;
                    fillTable(playersFormTable, parseGameData(response.result, `Game`), undefined, 'management-players-form-table-div', sumRow, true);
                    $$('#players-form-title-player-id').innerHTML = rowData.Player;
                    $$('#players-form-title-player-id-mobile').innerHTML = rowData.Player;
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                console.error('Failed to get row data!');
            }
        });

        $$('#players-black-overlay').style.display = 'block';
        form.classList.add('show');
        players.children[0].style.overflow = 'hidden';
    };

    function showPortalPlayerPopup(rowData) {
        if (rowData['Portal'] === 'SUM') {
            return;
        }
        $$('#portals-player-from').classList.add('show');
        portalPlayerFormTable.innerHTML = '';
        trigger('comm/management/gamePerPlayersOfPortal/get', {
            body: {
                gameName: portalGameName,
                portalId: getPortalId(rowData['Portal']),
                firstPeriod: {
                    fromTime: portalsFirstPeriodFrom,
                    toTime: portalsFirstPeriodTo,
                },
                secondPeriod: portalCheckbox.checked ? {
                    fromTime: portalsSecondPeriodFrom,
                    toTime: portalsSecondPeriodTo,
                } : null,
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    portalPlayerFormData = response.result;
                    fillTable(portalPlayerFormTable, parseGameData(response.result, `Player`), undefined, 'management-protals-players-form-table-div', getPortalSumData(response.result, 'SUM'), true);
                    $$('#portals-player-form-title-player-id').innerHTML = rowData['Portal'];
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                console.error('Failed to get row data!');
            }
        });

    };

    function showPortalPopup(rowData) {
        portalFormTable.innerHTML = '';
        portalGameName = rowData['Game'];
        trigger('comm/management/gamePerPortal/get', {
            body: {
                gameName: portalGameName,
                portals: portalsSelected,
                firstPeriod: {
                    fromTime: portalsFirstPeriodFrom,
                    toTime: portalsFirstPeriodTo,
                },
                secondPeriod: portalCheckbox.checked ? {
                    fromTime: portalsSecondPeriodFrom,
                    toTime: portalsSecondPeriodTo,
                } : null,
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    portalFormData = response.result;
                    fillTable(portalFormTable, parseGameData(response.result, `Portal`), showPortalPlayerPopup, 'management-protals-form-table-div', getPortalSumData(response.result, 'SUM'), true);
                    $$('#portals-form-title-game-id').innerHTML = portalGameName;
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                console.error('Failed to get row data!');
            }
        });

        $$('#portals-black-overlay').style.display = 'block';
        $$('#portals-form').classList.add('show');
        $$('#management-portals').children[0].style.overflow = 'hidden';
        isPortalPoupOpened = true;
    }

    function hidePortalPopup() {
        $$('#portals-black-overlay').style.display = 'none';
        $$('#portals-form').classList.remove('show');
        $$('#portals-player-from').classList.remove('show');
        $$('#management-portals').children[0].style.overflow = 'auto';
        isPortalPoupOpened = false;
    }

    function hidePlayerPortalPopup() {
        $$('#portals-player-from').classList.remove('show');
    }

    function getSelectedGames() {
        let resultArray = {};
        for (let game of checkedGames) {
            resultArray[game] = isPerNumberOfHandsSelected ? betsResult.perNumberOfHands[game] : betsResult.perNumberOfPlayers[game];
        }
        return resultArray;
    };

    function hidePopup() {
        playersFormTable.innerHTML = ``;
        $$('#players-black-overlay').style.display = 'none';
        $$('#players-form').classList.remove('show');
        players.children[0].style.overflow = 'auto';
        popupHidden = !popupHidden;
    };

    function searchGames(element, term) {
        for (let tableRow of element.getElementsByTagName('tr')) {
            if (tableRow.dataset.id.toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
                tableRow.style.display = 'table-row';
            } else {
                tableRow.style.display = 'none';
            }
        }
    };

    function hideAllRows(element) {
        for (let tableRow of element.getElementsByTagName('td')) {
            tableRow.classList.add('collapsed');
            tableRow.collapsed = true;
        }
    };

    function getPortalId(portalName) {
        let realPortalName = portalName.substring(portalName.indexOf('-') + 1, portalName.length);
        for (let portal of portalsDataList) {
            if (portal.name === realPortalName) {
                return portal.id;
            }
        }
    }

    function makePlayerGamesSumRow(data) {
        let sumObject = {};
        sumObject['Game'] = 'SUM';
        for (let column in data) {
            sumObject[`${column}`] = data[`${column}`];
        }
        delete sumObject['Player'];
        return sumObject;
    };

    function getGameSumData(data, firstColName) {
        let sumData = {};
        sumData[`${firstColName}`] = 'SUM';
        for (let element in data.managementItemsSum) {
            sumData[`${element}`] = data.managementItemsSum[`${element}`];
        }
        return sumData;
    };

    function getPortalSumData(data, firstColName) {
        let sumData = {};
        sumData[`${firstColName}`] = 'SUM';
        for (let element in data.managementItemsSum) {
            sumData[`${element}`] = data.managementItemsSum[`${element}`];
        }
        return sumData;
    }

    mainCheckbox.addEventListener('change', function () {
        mainCheckbox.checked ? $$('#management-main-second-period-wrapper').style.display = "inline" : $$('#management-main-second-period-wrapper').style.display = "none";
    });

    portalCheckbox.addEventListener('change', function () {
        portalCheckbox.checked ? $$('#management-portals-second-period-wrapper').style.display = 'inline' : $$('#management-portals-second-period-wrapper').style.display = "none";
    });

    playerCheckbox.addEventListener('change', function () {
        playerCheckbox.checked ? $$('#management-players-second-period-wrapper').style.display = 'inline' : $$('#management-players-second-period-wrapper').style.display = "none";
    });

    betsCheckbox.addEventListener('change', function () {
        isPerNumberOfHandsSelected = !isPerNumberOfHandsSelected;
        changePerNumberOfView();
    });

    //buttons events
    totalGetButton.addEventListener('click', getTotalPerGame);
    portalsGetButton.addEventListener('click', getPortalsPerGame);
    playersGetButton.addEventListener('click', getPlayersOfPortal);
    betsGetButton.addEventListener('click', getBetsOfPortal);
    secondFilterButton.addEventListener('click', getRecommendedBetLimit);

    getTotalExcelButton.addEventListener('click', getTotalExcelData);
    getPortalsExcelButton.addEventListener('click', getPortalsExcelData);
    getPlayersExcelButton.addEventListener('click', getPlayersExcelData);
    getPlayerExcelButton.addEventListener('click', getPlayerExcelData);
    getPortalsFormExcelButton.addEventListener('click', getPortalsFormExcelData);
    getPortalsPlayersFormExcelButton.addEventListener('click', getPortalsPlayersExcelData);
}();