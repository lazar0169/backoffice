let advanceAccounting = function () {
    let main = $$('#management-main');
    let portals = $$('#management-portals');
    let players = $$('#management-players');
    let bets = $$('#management-bets');
    //main tab
    const totalGetButton = $$('#management-get-total');
    let mainTable = $$('#management-main-table');
    let mainFirstPeriodFrom = getToday();
    let mainFirstPeriodTo = getToday();
    let mainSecondPeriodFrom = getToday();
    let mainSecondPeriodTo = getToday();
    //portals tab 
    const portalsGetButton = $$('#management-get-portals');
    let portalsTable = $$('#management-portals-table');
    let portalsFirstPeriodFrom = getToday();
    let portalsFirstPeriodTo = getToday();
    let portalsSecondPeriodFrom = getToday();
    let portalsSecondPeriodTo = getToday();
    //players tab
    const playersGetButton = $$('#management-get-players');
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

    let isPerNumberOfHandsSelected = false;
    const secondFilterButton = $$('#management-get-bets-percentage');
    let betsCheckbox = $$('#management-bets-checkbox');
    
    $$('#players-black-overlay').addEventListener('click', hidePopup);
    $$('#players-form-cancel').addEventListener('click', hidePopup);
    betsCheckbox.addEventListener('change', function () {
        isPerNumberOfHandsSelected = !isPerNumberOfHandsSelected;
        changePerNumberOfView();
    });

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

    $$('#management-wanted-percentage').addEventListener('keydown', function (e) {
        if (((e.keyCode < 48 || e.keyCode > 57) || (e.keyCode < 96 || e.keyCode > 105)) && e.keyCode !== 190 && e.keyCode !== 8) {
            e.preventDefault();
        }
    });

    function addGameToList(event) {
        const gameIndex = checkedGames.indexOf(event.target.innerHTML);
        gameIndex === -1 ? checkedGames.push(event.target.innerHTML) : checkedGames.splice(gameIndex, 1);
    };

    let actionByRoles = {
        'Admin': 'comm/accounting/get',
        'Accounting': 'comm/accounting/get',
        'Manager': 'comm/accounting/manager/get',
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
        if(preserveHeight){
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
                secondPeriod: {
                    fromTime: mainSecondPeriodFrom,
                    toTime: mainSecondPeriodTo,
                },
            },
            success: function (response) {
                removeLoader(totalGetButton);
                if (response.responseCode === message.codes.success) {
                    fillTable(mainTable, parseGameData(response.result, `Game`), undefined, 'management-main-table-div');
                    mainTable.classList.remove('hidden');
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
        addLoader(portalsGetButton);
        trigger('comm/management/portalsPerGame/get', {
            body: {
                portalId: $$('#management-portals-portals-list').getSelected(),
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
                    fillTable(portalsTable, parseGameData(response.result, `Game`), undefined, 'management-portals-table-div');
                    portalsTable.classList.remove('hidden');
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
                secondPeriod: {
                    fromTime: playersSecondPeriodFrom,
                    toTime: playersSecondPeriodTo,
                },
            },
            success: function (response) {
                removeLoader(playersGetButton);
                if (response.responseCode === message.codes.success) {
                    fillTable(playersTable, parseGameData(response.result, `Player`), showPlayersPopup, 'management-players-table-div');
                    playersTable.classList.remove('hidden');
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
                wantedPercentage: $$('#management-wanted-percentage').value,
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

    on('management/main/loaded', function () {
        mainTable.innerHTML = '';
        mainTable.classList.add('hidden');
    });

    on('management/portals/loaded', function () {
        portalsTable.innerHTML = '';
        portalsTable.classList.add('hidden');
        clearElement($$('#management-portals-operators-list'));
        clearElement($$('#management-portals-portals-list'));
        $$('#management-get-portals').classList.add('hidden');

        addLoader($$('#sidebar-management'));

        trigger('comm/accounting/operators/get', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {

                    // Prevent operator change
                    if (roles.getRole() === 'Manager') {
                        response = {
                            responseCode: 1000
                        };
                    }

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
        playersTable.classList.add('hidden');
        playersFormTable.innerHTML = '';
        clearElement($$('#management-players-operators-list'));
        clearElement($$('#management-players-portals-list'));
        $$('#management-get-players').classList.add('hidden');

        addLoader($$('#sidebar-management'));

        trigger('comm/accounting/operators/get', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {

                    // Prevent operator change
                    if (roles.getRole() === 'Manager') {
                        response = {
                            responseCode: 1000
                        };
                    }

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

                    // Prevent operator change
                    if (roles.getRole() === 'Manager') {
                        response = {
                            responseCode: 1000
                        };
                    }

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

            // Prevent operator change
            if (roles.getRole() === 'Manager') {
                trigger('accounting-operators-list/selected', 0);
            }

        } else {
            trigger('message', response.responseCode);
        }
    };

    function getPortals(data, tab) {
        clearElement($$(`#management-${tab}-portals-list`));
        let portalsDropdown = dropdown.generate(data.result, `management-${tab}-portals-list`, 'Select portal');
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
                secondPeriod: {
                    fromTime: playersSecondPeriodFrom,
                    toTime: playersSecondPeriodTo,
                },
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    fillTable(playersFormTable, parseGameData(response.result, `Game`), undefined, 'management-players-form-table-div', sumRow, true);
                    // highlightRow();
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
        // removeHighlightRow();
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

    // function highlightRow() {
    //     if (!selectedRowId) {
    //         return;
    //     }

    //     let columns = $$(`.row-${selectedRowId}`);
    //     for (let column of columns) {
    //         column.classList.add('hover');
    //     }
    // };

    // function removeHighlightRow() {
    //     if (!selectedRowId) {
    //         return;
    //     }

    //     let columns = $$(`.row-${selectedRowId}`);
    //     for (let column of columns) {
    //         column.classList.remove('hover');
    //     }
    // };

    function makePlayerGamesSumRow(data) {
        let sumObject = {};
        sumObject['Game'] = 'SUM';
        for (let column in data) {
            sumObject[`${column}`] = data[`${column}`];
        }
        delete sumObject['Player'];
        return sumObject;
    };

    totalGetButton.addEventListener('click', getTotalPerGame);
    portalsGetButton.addEventListener('click', getPortalsPerGame);
    playersGetButton.addEventListener('click', getPlayersOfPortal);
    betsGetButton.addEventListener('click', getBetsOfPortal);
    secondFilterButton.addEventListener('click', getRecommendedBetLimit);
}();