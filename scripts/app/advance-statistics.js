let advanceAccounting = function () {
    let main = $$('#advance-statistics-main');
    let portals = $$('#advance-statistics-portals');
    let players = $$('#advance-statistics-players');
    let bets = $$('#advance-statistics-bets');
    //main tab
    const totalGetButton = $$('#advance-statistics-get-total');
    let mainTable = $$('#advance-statistics-main-table');
    let mainFirstPeriodFrom = getToday();
    let mainFirstPeriodTo = getToday();
    let mainSecondPeriodFrom = getToday();
    let mainSecondPeriodTo = getToday();
    //portals tab 
    const portalsGetButton = $$('#advance-statistics-get-portals');
    let portalsTable = $$('#advance-statistics-portals-table');
    let portalsFirstPeriodFrom = getToday();
    let portalsFirstPeriodTo = getToday();
    let portalsSecondPeriodFrom = getToday();
    let portalsSecondPeriodTo = getToday();
    //players tab
    const playersGetButton = $$('#advance-statistics-get-players');
    const playersFormCancelButton = $$('#players-form-cancel');
    let playersTable = $$('#advance-statistics-players-table');
    let playersFormTable = $$('#players-form-table');
    let playersFirstPeriodFrom = getToday();
    let playersFirstPeriodTo = getToday();
    let playersSecondPeriodFrom = getToday();
    let playersSecondPeriodTo = getToday();
    //bets tab
    const betsGetButton = $$('#advance-statistics-get-bets');
    let betsTable = $$('#advance-statistics-bets-table');
    let betsFirstPeriodFrom = getToday();
    let betsFirstPeriodTo = getToday();
    let betsSecondPeriodFrom = getToday();
    let betsSecondPeriodTo = getToday();
    let checkedGames = [];
    let betsResult = [];

    let isPerNumberOfHandsSelected = true;
    const secondFilterButton = $$('#advance-statistics-get-bets-percentage');




    $$('#players-black-overlay').addEventListener('click', hidePopup);
    $$('#players-form-cancel').addEventListener('click', hidePopup);
    $$('#accounting-setup-checkbox').addEventListener('change', function () {
        isPerNumberOfHandsSelected = !isPerNumberOfHandsSelected;
    });

    function addGameToList(event) {
        const gameIndex = checkedGames.indexOf(event.target.innerHTML);
        if (gameIndex === -1) {
            checkedGames.push(event.target.innerHTML);
        }
        else {
            checkedGames.splice(gameIndex, 1);
        }
    };

    let actionByRoles = {
        'Admin': 'comm/accounting/get',
        'Accounting': 'comm/accounting/get',
        'Manager': 'comm/accounting/manager/get',
    };

    function fillTable(tableElement, data, callback) {
        let tableObject = table.generate({
            data: data,
            id: 'advance-statistics-main-table',
            sticky: true,
            stickyCol: true,
            options: {
                onClick: callback
            }
        });
        tableElement.appendChild(tableObject);
    };

    function prepareBetsTable(games) {
        let wrapperTable = betsTable.getElementsByTagName('table')[0];
        let input = $$('#advance-statistics-bets-search');
        betsTable.classList.remove('hidden');

        input.addEventListener('input', function () {
            searchGames(wrapperTable, input.value);
        });

        input.addEventListener('keyup', function (e) {
            if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
                input.value = '';
                searchGames(wrapperTable, '');
            }
        });

        $$('#advance-statistics-bets-remove-search').onclick = function () {
            input.value = '';
            searchGames(wrapperTable, '');
        };

        input.value = '';
        searchGames(wrapperTable, '');
        let body = document.createElement('tbody');
        wrapperTable.appendChild(body);
        hideAllRows(wrapperTable);

        for (let game in games.result) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            //checkbox things
            let gameCheckboxWrapper = document.createElement('div');
            let gameCheckbox = document.createElement('input');
            let gameCheckboxLabel = document.createElement('label');
            gameCheckboxWrapper.id = 'advance-statistics-bets-game-checkbox-wrapper';
            gameCheckboxWrapper.classList.add('game-title');

            gameCheckbox.id = `advance-statistics-bets-game-checkbox-${game}`;
            gameCheckbox.type = 'checkbox';
            gameCheckbox.value = game;
            gameCheckbox.name = game;

            gameCheckboxLabel.htmlFor = `advance-statistics-bets-game-checkbox-${game}`;
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
                //TODO: implement when switching tables
                if (td.collapsed) {
                    if (!td.created) {
                        let t = table.generate({
                            data: [games.result[game]],
                            id: `portal-${game}`,
                            dynamic: false,
                            sticky: true,
                            stickyCol: true
                        })
                        td.appendChild(t);
                        td.created = true;
                        table.preserveHeight(td);
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

    on('date/advance-statistics-main-first-period-time-span-from', function (data) {
        mainFirstPeriodFrom = data;
    });
    on('date/advance-statistics-main-first-period-time-span-to', function (data) {
        mainFirstPeriodTo = data;
    });
    on('date/advance-statistics-main-second-period-time-span-from', function (data) {
        mainSecondPeriodFrom = data;
    });
    on('date/advance-statistics-main-second-period-time-span-to', function (data) {
        mainSecondPeriodTo = data;
    });

    on('date/advance-statistics-portals-first-period-time-span-from', function (data) {
        portalsFirstPeriodFrom = data;
    });
    on('date/advance-statistics-portals-first-period-time-span-to', function (data) {
        portalsFirstPeriodTo = data;
    });
    on('date/advance-statistics-portals-second-period-time-span-from', function (data) {
        portalsSecondPeriodFrom = data;
    });
    on('date/advance-statistics-portals-second-period-time-span-to', function (data) {
        portalsSecondPeriodTo = data;
    });

    on('date/advance-statistics-players-first-period-time-span-from', function (data) {
        playersFirstPeriodFrom = data;
    });
    on('date/advance-statistics-players-first-period-time-span-to', function (data) {
        playersFirstPeriodTo = data;
    });
    on('date/advance-statistics-players-second-period-time-span-from', function (data) {
        playersSecondPeriodFrom = data;
    });
    on('date/advance-statistics-players-second-period-time-span-to', function (data) {
        playersSecondPeriodTo = data;
    });

    on('date/advance-statistics-bets-first-period-time-span-from', function (data) {
        betsFirstPeriodFrom = data;
    });
    on('date/advance-statistics-bets-first-period-time-span-to', function (data) {
        betsFirstPeriodTo = data;
    });
    on('date/advance-statistics-bets-second-period-time-span-from', function (data) {
        betsSecondPeriodFrom = data;
    });
    on('date/advance-statistics-bets-second-period-time-span-to', function (data) {
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
                    fillTable(mainTable, parseGameData(response.result, `Game`));
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
                    fillTable(portalsTable, parseGameData(response.result, `Game`));
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
        trigger('comm/advance-statistics/playersOfGame/get', {
            body: {
                portalId: $$('#advance-statistics-players-portals-list').getSelected(),
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
                    fillTable(playersTable, parseGameData(response.result, `Player`), showPlayersPopup);
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
        betsResult = [];
        $$('#switch-and-search-wrapper').classList.remove('hidden');
        $$('#bets-second-filter').classList.remove('hidden');

        addLoader(betsGetButton);
        trigger('comm/advance-statistics/playersOfGame/get', {
            body: {
                portalId: $$('#advance-statistics-bets-portals-list').getSelected(),
                firstPeriod: {
                    fromTime: betsFirstPeriodFrom,
                    toTime: betsFirstPeriodTo,
                },
                secondPeriod: {
                    fromTime: betsSecondPeriodFrom,
                    toTime: betsSecondPeriodTo,
                },
            },
            success: function (response) {
                removeLoader(betsGetButton);
                if (response.responseCode === message.codes.success) {
                    betsResult = parseGameData(response.result, 'Game');
                    prepareBetsTable(response);
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
        //TODO: implement recommend bet limit
        selectedGames = getSelectedGames();

        addLoader(secondFilterButton);
        trigger('comm/advance-statistics/betsOfGame/get', {
            body: {
                //TODO: see what parameters are needed here 

                wantedPercentage: $$('#advance-statistics-wanted-percentage').value,
                selectedGames: selectedGames,
            },
            success: function (response) {
                removeLoader(secondFilterButton);
                // if (response.responseCode === message.codes.success) {
                //     fillTable(playersTable, parseGameData(response.result, `Player`), showPlayersPopup);
                // } else {
                //     trigger('message', response.responseCode);
                // }
            },
            fail: function () {
                removeLoader(secondFilterButton);
            }
        });
    };

    on('advance-statistics/main/loaded', function () {
        mainTable.innerHTML = '';
    });

    on('advance-statistics/portals/loaded', function () {
        portalsTable.innerHTML = '';
        clearElement($$('#advance-statistics-portals-operators-list'));
        clearElement($$('#advance-statistics-portals-portals-list'));
        $$('#advance-statistics-get-portals').classList.add('hidden');

        addLoader($$('#sidebar-advance-statistics'));

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
                removeLoader($$('#sidebar-advance-statistics'));
            },
            fail: function () {
                removeLoader($$('#sidebar-advance-statistics'));
            }
        });
    });

    on('advance-statistics/players/loaded', function () {
        hidePopup();
        playersTable.innerHTML = '';
        playersFormTable.innerHTML = '';
        clearElement($$('#advance-statistics-players-operators-list'));
        clearElement($$('#advance-statistics-players-portals-list'));
        $$('#advance-statistics-get-players').classList.add('hidden');

        addLoader($$('#sidebar-advance-statistics'));

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
                removeLoader($$('#sidebar-advance-statistics'));
            },
            fail: function () {
                removeLoader($$('#sidebar-advance-statistics'));
            }
        });
    });

    on('advance-statistics/bets/loaded', function () {
        checkedGames = [];
        betsResult = [];
        clearElement($$('#advance-statistics-bets-operators-list'));
        clearElement($$('#advance-statistics-bets-portals-list'));

        $$('#switch-and-search-wrapper').classList.add('hidden');
        $$('#bets-second-filter').classList.add('hidden');
        betsTable.classList.add('hidden');

        let tbody = betsTable.getElementsByTagName('table')[0].getElementsByTagName('tbody');
        if (tbody.length) {
            tbody[0].remove();
        }

        addLoader($$('#sidebar-advance-statistics'));

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
                removeLoader($$('#sidebar-advance-statistics'));
            },
            fail: function () {
                removeLoader($$('#sidebar-advance-statistics'));
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
            clearElement($$(`#advance-statistics-${tab}-operators-list`));
            let operatorsDropdown = dropdown.generate(response.result, `advance-statistics-${tab}-operators-list`, 'Select operator');
            $$(`#advance-statistics-${tab}-operators-list-wrapper`).appendChild(operatorsDropdown);
            if (!response.result) $$(`#advance-statistics-${tab}-operators-list-wrapper`).style.display = 'none';

            on(`advance-statistics-${tab}-operators-list/selected`, function (value) {
                addLoader($$(`#advance-statistics-${tab}-filter`));
                trigger('comm/accounting/portals/get', {
                    body: {
                        id: value
                    },
                    success: function (response) {
                        if (response.responseCode === message.codes.success) {
                            getPortals(response, tab);
                            removeLoader($$(`#advance-statistics-${tab}-filter`));
                        } else {
                            trigger('message', response.responseCode);
                        }
                    },
                    fail: function () {
                        removeLoader($$(`#advance-statistics-${tab}-filter`));
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
        clearElement($$(`#advance-statistics-${tab}-portals-list`));
        let portalsDropdown = dropdown.generate(data.result, `advance-statistics-${tab}-portals-list`, 'Select portal');
        $$(`#advance-statistics-${tab}-portals-list-wrapper`).appendChild(portalsDropdown);
        if (!data.result) $$(`#advance-statistics-${tab}-portals-list-wrapper`).style.display = 'none';
        $$(`#advance-statistics-get-${tab}`).classList.remove('hidden');
    };

    function showPlayersPopup(rowData) {
        playersFormTable.innerHTML = '';
        let form = $$(`#players-form`);
        console.log(rowData);

        trigger('comm/advance-statistics/playerGames/get', {
            body: {
                playerId: rowData.Player,
                firstInterval: {
                    fromTime: playersFirstPeriodFrom,
                    toTime: playersFirstPeriodTo,
                },
                secondInterval: {
                    fromTime: playersSecondPeriodFrom,
                    toTime: playersSecondPeriodTo,
                },
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    fillTable(playersFormTable, parseGameData(response.result, `Game`));
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

    };

    function hidePopup() {
        playersFormTable.innerHTML = ``;
        $$('#players-black-overlay').style.display = 'none';
        $$('#players-form').classList.remove('show');
        players.children[0].style.overflow = 'auto';
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

    totalGetButton.addEventListener('click', getTotalPerGame);
    portalsGetButton.addEventListener('click', getPortalsPerGame);
    playersGetButton.addEventListener('click', getPlayersOfPortal);
    betsGetButton.addEventListener('click', getBetsOfPortal);
    secondFilterButton.addEventListener('click', getRecommendedBetLimit);
}();