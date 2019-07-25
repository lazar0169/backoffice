let players = function () {

    let getPlayerButton = $$('#players-get-player');
    let playersSearchWrapper = $$('#players-player-players-search-wrapper');
    let playersListWrapper = $$('#players-player-players-table-wrapper');
    let playerDataWrapper = $$('#players-player-data-wrapper');
    let playerDataFlagInteresting = $$('#player-flag-interesting');
    let playerDataFlagSuspicious = $$('#player-flag-interesting');
    let playerDataFlagDisable = $$('#player-flag-interesting');
    let playerDataFlagTest = $$('#player-flag-test');
    let playerDashboardWrapper = $$('#players-player-data-dashboard-wrapper');

    const showPlayerData = (data, playerId) => {
        playerDataWrapper.classList.remove('hidden');
        showPlayerHeaderData(playerId, data.flags, data.onlineStatus);
        showPlayerDashboardData(data.dashboard);
        // showPlayerGroupsData();
        showPlayerSummaryData(data.info, data.totalStats);
        // showPlayerPeriodData();
        console.log(data);
    };

    const showPlayerHeaderData = (id, flags, status) => {
        $$('#players-player-data-id').innerHTML = id;
        showPlayerFlagData(flags);
    };

    const showPlayerFlagData = (flags) => {
        if (flags.interesting) {
            playerDataFlagInteresting.checked = true;
            return;
        }

        if (flags.suspicious) {
            playerDataFlagSuspicious.checked = true;
            return;
        }

        if (flags.disabled) {
            playerDataFlagDisable.checked = true;
            return;
        }

        if (flags.test) {
            playerDataFlagTest.checked = true;
            return;
        }
    };

    const showPlayerDashboardData = (data) => {
        if(playerDashboardWrapper.children.length > 0){
            playerDashboardWrapper.children[0].remove();
        }
        
        let tableNode = table.generate({
            data: parsePlayerDashboardData(data),
            id: 'playerDashboardData',
            sticky: true,
            stickyCol: false
        });
        playerDashboardWrapper.appendChild(tableNode);
    };

    const afterLoad = (tab) => {
        addLoader($$(`#players-navbar-${tab}`));
        trigger('comm/accounting/operators/get', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {

                    // Prevent operator change
                    // if (roles.getRole() === 'Manager') {
                    //     response = {
                    //         responseCode: 1000
                    //     };
                    // }

                    getOperators(response.result, tab);
                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader($$(`#players-navbar-${tab}`));
            },
            fail: function () {
                trigger('message', response.responseCode);
                removeLoader($$(`#players-navbar-${tab}`));
            }
        });
    };

    const showPlayerSummaryData = (info, total) => {
        clearSummaryData();
        let infoId = $$('#players-player-data-summary-id');
        let infoName = $$('#players-player-data-summary-name');
        let totalBet = $$('#players-player-data-summary-bet');
        let totalWin = $$('#players-player-data-summary-win');
        let totalAvgBet = $$('#players-player-data-summary-avg-bet');
        let totalRounds = $$('#players-player-data-summary-rounds');
        let totalGgr = $$('#players-player-data-summary-ggr');

        infoId.innerHTML += info.id;
        infoName.innerHTML += info.name;
        totalBet.innerHTML += total.bet;
        totalWin.innerHTML += total.win;
        totalAvgBet.innerHTML += total.avgBet;
        totalRounds.innerHTML += total.rounds;
        totalGgr.innerHTML += total.ggr;
    };

    const getOperators = (data, tab) => {
        clearElement($$(`#players-${tab}-operators-list`));
        let operatorsDropdown = dropdown.generate(data, `players-${tab}-operators-list`, 'Select operator');
        $$(`#players-${tab}-operators-list-wrapper`).appendChild(operatorsDropdown);
        if (!data) $$(`#players-${tab}-operators-list-wrapper`).style.display = 'none';

        on(`players-${tab}-operators-list/selected`, function (value) {
            addLoader($$(`#players-navbar-${tab}`));
            trigger('comm/accounting/portals/get', {
                body: {
                    id: value
                },
                success: function (response) {
                    if (response.responseCode === message.codes.success) {
                        getPortals(response.result, tab);
                    } else {
                        trigger('message', response.responseCode);
                    }
                    removeLoader($$(`#players-navbar-${tab}`));
                },
                fail: function () {
                    trigger('message', response.responseCode);
                    removeLoader($$(`#players-navbar-${tab}`));
                }
            });
        });

        // Prevent operator change
        // if (roles.getRole() === 'Manager') {
        //     trigger('accounting-operators-list/selected', 0);
        // }
    };

    const getPortals = (data, tab) => {
        clearElement($$(`#players-${tab}-portals-list`));
        let portalsDropdown = dropdown.generate(data, `players-${tab}-portals-list`, 'Select portal');
        $$(`#players-${tab}-portals-list-wrapper`).appendChild(portalsDropdown);
        if (!data) $$(`#players-${tab}-portals-list-wrapper`).style.display = 'none';
        $$(`#players-get-${tab}`).classList.remove('hidden');
    };

    const getPlayer = () => {
        let portalId = $$('#players-player-portals-list').getSelected();

        if (!portalId) {
            trigger('message', message.codes.badParameters);
            return;
        }
        addLoader(getPlayerButton);
        trigger('comm/players/getPlayerForPortal', {
            body: {
                id: portalId
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    createList(response.result, `player-players`, getPlayerData);
                }
                else {
                    trigger('message', response.responseCode);
                }
                removeLoader(getPlayerButton);
            },
            fail: function (response) {
                trigger('message', response.responseCode);
                removeLoader(getPlayerButton);
            }
        });
    };

    const getPlayerData = (id) => {
        trigger('comm/players/getPlayerData', {
            body: {
                id: id
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    showPlayerData(response.result, id);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function (response) {
                trigger('message', response.responseCode);
            }
        });
    }

    const createList = (data, section, callback) => {
        let actions = $$(`#players-${section}-table-wrapper`);
        let serachBar = $$(`#players-${section}-search-wrapper`);
        if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
            actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
        }
        let body = document.createElement('tbody');
        for (let row of data) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.innerHTML = row.name;
            tr.dataset.id = row.id;
            tr.onclick = function () { callback(row.id) };
            tr.appendChild(td);
            body.appendChild(tr);
        }

        actions.getElementsByTagName('table')[0].appendChild(body);
        actions.classList.remove('hidden');
        serachBar.classList.remove('hidden');

        let input = $$(`#players-${section}-search`);

        input.addEventListener('input', function () {
            searchData(body, input.value);
        });

        input.addEventListener('keyup', function (e) {
            if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
                input.value = '';
                searchData(body, '');
            }
        });

        $$(`#players-${section}-remove-search`).onclick = function () {
            input.value = '';
            searchData(body, '');
        };
    };

    const searchData = (element, term) => {
        for (let tableRow of element.getElementsByTagName('tr')) {
            if (tableRow.innerText.toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
                tableRow.style.display = 'table-row';
            } else {
                tableRow.style.display = 'none';
            }
        }
    };

    const parsePlayerDashboardData = (data) => {
        let firstColKeys = Object.keys(data);
        let colsKeys = Object.keys(data[firstColKeys[0]]);

        let resultData = [];
        for (let key of colsKeys) {
            let row = {
                ' ': transformCamelToRegular(key)//key.charAt(0).toLocaleUpperCase() + key.slice(1)
            };
            for (let firstKey of firstColKeys) {
                row[firstKey] = data[firstKey][key];
            }
            resultData.push(row);
        }
        return resultData;
    }

    const clearPlayerFlags = () => {
        playerDataFlagInteresting.checked = false;
        playerDataFlagSuspicious.checked = false;
        playerDataFlagDisable.checked = false;
        playerDataFlagTest.checked = false;
    };

    const clearSummaryData = () => {
        let infoId = $$('#players-player-data-summary-id');
        let infoName = $$('#players-player-data-summary-name');
        let totalBet = $$('#players-player-data-summary-bet');
        let totalWin = $$('#players-player-data-summary-win');
        let totalAvgBet = $$('#players-player-data-summary-avg-bet');
        let totalRounds = $$('#players-player-data-summary-rounds');
        let totalGgr = $$('#players-player-data-summary-ggr');

        infoId.innerHTML = 'Id: ';
        infoName.innerHTML = 'Name: ';
        totalBet.innerHTML = 'Bet: ';
        totalWin.innerHTML = 'Win: ';
        totalAvgBet.innerHTML = 'Avg Bet: ';
        totalRounds.innerHTML = 'Rounds: ';
        totalGgr.innerHTML = 'GGR; ';
    };

    const playerFlagChanged = () => {
        if (playerDataFlagInteresting.checked) {
            playerDataFlagSuspicious.checked = false;
            playerDataFlagDisable.checked = false;
            playerDataFlagTest.checked = false;
            return;
        }

        if (playerDataFlagSuspicious.checked) {
            playerDataFlagInteresting.checked = false;
            playerDataFlagDisable.checked = false;
            playerDataFlagTest.checked = false;
            return;
        }

        if (playerDataFlagDisable.checked) {
            playerDataFlagSuspicious.checked = false;
            playerDataFlagInteresting.checked = false;
            playerDataFlagTest.checked = false;
            return;
        }

        if (playerDataFlagTest.checked) {
            playerDataFlagSuspicious.checked = false;
            playerDataFlagInteresting.checked = false;
            playerDataFlagDisable.checked = false;
            return;
        }
    };

    on('players/main/loaded', function () {

    });

    on('players/groups/loaded', function () {

    });

    on('players/player/loaded', function () {
        getPlayerButton.classList.add('hidden');
        playersSearchWrapper.classList.add('hidden');
        playersListWrapper.classList.add('hidden');
        playerDataWrapper.classList.add('hidden');
        clearElement($$(`#players-player-portals-list`));
        clearPlayerFlags();
        afterLoad(`player`);
    });

    playerDataFlagInteresting.addEventListener('click', playerFlagChanged);
    playerDataFlagSuspicious.addEventListener('click', playerFlagChanged);
    playerDataFlagDisable.addEventListener('click', playerFlagChanged);
    playerDataFlagTest.addEventListener('click', playerFlagChanged);
    getPlayerButton.addEventListener('click', getPlayer);
    
}();