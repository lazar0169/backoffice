let players = function () {

    let getPlayerButton = $$('#players-get-player');
    let playersSearchWrapper = $$('#players-player-players-search-wrapper');
    let playersListWrapper = $$('#players-player-players-table-wrapper');
    let playerDataWrapper = $$('#players-player-data-wrapper');
    let playerDataFlagInteresting = $$('#player-flag-interesting');
    let playerDataFlagSuspicious = $$('#player-flag-suspicious');
    let playerDataFlagDisable = $$('#player-flag-disable');
    let playerDataFlagTest = $$('#player-flag-test');
    let playerDashboardWrapper = $$('#players-player-data-dashboard-wrapper');
    let playerBetGraph = graph.generate($$(`#player-player-data-bet-graph-wrapper`).children[0], 'line');
    let playerRoundsGraph = graph.generate($$(`#player-player-data-rounds-graph-wrapper`).children[0], 'line');
    let timePeriods = [
        { name: `MTD`, id: 0 },
        { name: `Month`, id: 1 },
        { name: `Quarter`, id: 2 },
        { name: `SPLM`, id: 3 },
        { name: `ThreeDays`, id: 4 },
        { name: `Today`, id: 5 },
        { name: `Week`, id: 6 },
        { name: `Yesterday`, id: 7 }
    ];
    let interestingPlayersData;
    let latestPlayersData;
    let largestBetsData;
    let largestWinsData;
    let winnersAndLosersFromLast24HoursData;
    let getPlayersButton = $$('#players-get-main');


    let getGroupsButton = $$('#players-get-groups')

    const showPlayerData = (data, playerId) => {
        playerDataWrapper.classList.remove('hidden');
        showPlayerHeaderData(playerId, data.flags, data.onlineStatus);
        showPlayerDashboardData(data.dashboard);
        // showPlayerGroupsData();
        showPlayerSummaryData(data.info, data.totalStats);
        showPeriodData(data.avgBetPerHour, data.roundsPerHour, `player-data`, 0);
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
        if (playerDashboardWrapper.children.length > 0) {
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

    const showPeriodData = (bet, rounds, tab, type) => {
        // type param: 0-for player tab, 1-for player group tab
        let periodWrapper = $$(`#players-${tab}-periods-list-wrapper`);
        clearElement($$(`#players-${tab}-periods-list`));
        let operatorsDropdown = dropdown.generate(timePeriods, `players-${tab}-periods-list`, 'Select period');
        periodWrapper.appendChild(operatorsDropdown);

        on(`players-${tab}-periods-list/selected`, (id) => {
            showPeriodsGraphs($$(`#players-${tab}-periods-list`).getSelectedName(), bet, rounds, type);
        });
    };

    const showPeriodsGraphs = (period, bet, rounds, type) => {
        if (type === 0) {
            playerBetGraph.data.datasets.length = 0;
            playerRoundsGraph.data.datasets.length = 0;

            playerBetGraph.options.legend.position = 'right';
            playerRoundsGraph.options.legend.position = 'right';

            playerBetGraph.options.title = { display: true, text: 'Total Bet', position: 'top', fontColor: 'white', fontFamily: 'roboto' };
            playerRoundsGraph.options.title = { display: true, text: 'Avg Bet', position: 'top', fontColor: 'white', fontFamily: 'roboto' };

            playerBetGraph.data.labels = ['0', 'time'];
            playerRoundsGraph.data.labels = ['0', 'time'];

            let color = generateColor();
            playerBetGraph.data.datasets.push({
                data: bet[period],
                // label: games[i],
                backgroundColor: color,
                fontColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 2,
                borderColor: color,
                fill: false,
            });

            playerRoundsGraph.data.datasets.push({
                data: rounds[period],
                // label: games[i],
                backgroundColor: color,
                fontColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 2,
                borderColor: color,
                fill: false,
            });

            playerBetGraph.update();
            playerRoundsGraph.update();
        }

        if (type === 1) {

        }
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
                fail: function (response) {
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

    const getPlayerGroups = () => {
        // let portalId = $$('#players-player-groups-portals-list').getSelected();

        // if (!portalId) {
        //     trigger('message', message.codes.badParameters);
        //     return;
        // }
        // addLoader(getPlayerGroupsButton);
        // trigger('comm/players/getPlayerForPortal', {
        //     body: {
        //         id: portalId
        //     },
        //     success: function (response) {
        //         if (response.responseCode === message.codes.success) {
        //             createList(response.result, `player-players`, getPlayerData);
        //         }
        //         else {
        //             trigger('message', response.responseCode);
        //         }
        //         removeLoader(getPlayerGroupsButton);
        //     },
        //     fail: function (response) {
        //         trigger('message', response.responseCode);
        //         removeLoader(getPlayerGroupsButton);
        //     }
        // });
    }

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

    const playerFlagChanged = (event) => {
        if (event.target === playerDataFlagSuspicious) {
            playerDataFlagInteresting.checked = false;
            playerDataFlagDisable.checked = false;
            playerDataFlagTest.checked = false;
            return;
        }

        if (event.target === playerDataFlagDisable) {
            playerDataFlagSuspicious.checked = false;
            playerDataFlagInteresting.checked = false;
            playerDataFlagTest.checked = false;
            return;
        }

        if (event.target === playerDataFlagTest) {
            playerDataFlagSuspicious.checked = false;
            playerDataFlagInteresting.checked = false;
            playerDataFlagDisable.checked = false;
            return;
        }

        if (event.target === playerDataFlagInteresting) {
            playerDataFlagSuspicious.checked = false;
            playerDataFlagDisable.checked = false;
            playerDataFlagTest.checked = false;
            return;
        }
    };

    const parsePlayersMainData = (data, parameterYesterday, firstColName) => {



        if (Object.getOwnPropertyNames(data).length === 0) {
            return [];
        }

        let keys = Object.keys(data);
        let rowKeys = Object.keys(data[keys[0]]);
        let rowKeys1 = Object.keys(data[keys[0]][rowKeys[0]]);
        let tableData = [];



        for (let key of keys) {
            let row = {};
            row[firstColName] = key;

            for (let rowKey of rowKeys) {

                row[rowKey] = data[key][rowKey];
            }
            if (parameterYesterday === true) {
                tableData.push(row.Change);
            }
            else {
                tableData.push(row);

            }
        }
        return tableData;
    };

    const parseData = (data, firstColName) => {



        if (Object.getOwnPropertyNames(data).length === 0) {
            return [];
        }

        let keys = Object.keys(data);//players id
        let rowKeys = Object.keys(data[keys[0]]);//CHANGE,today,yesterday...
        let rowKeys1 = Object.keys(data[keys[0]][rowKeys[0]]);//bet,win,ggr...
        let tableData = [];

        for (let key of keys) {
            let row = {};
            row[firstColName] = key;

            for (let rowKey of rowKeys) {

                for (let fieldKey of rowKeys1) {
                    // row[fieldKey] = data[key][rowKey][fieldKey];
                    row[fieldKey] = data[key][`Change`][fieldKey];
                }

            }
            tableData.push(row);
        }
        return tableData;
    };

    const showPopUpTable = (rowData) => {
        
         let playerId = rowData.Player;
         
        let popUpData = interestingPlayersData[playerId];
                    $$('#popUpTable').innerHTML = '';
                    $$('#popUpTable').appendChild(table.generate({
                        data: parsePlayersMainData(popUpData,false,`Activity`),
                        id: 'popUpData',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true,
                       
                    }))
                    table.preserveHeight($$('#popUpTable'));
           
    }
    const getPlayers = () => {

        let portalId = $$('#players-main-portals-list').getSelected();
        trigger('comm/players/getPlayersForPortal', {
            body: {
                id: portalId
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {

                    interestingPlayersData = response.result.interestingPlayers;
                    $$('#interestingPlayersTable').innerHTML = '';
                    $$('#interestingPlayersTable').appendChild(table.generate({
                        data: parseData(interestingPlayersData,`Player`),
                        id: 'interestingPlayersData',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true,
                        options: {
                            onClick: showPopUpTable
                        }
                    }))
                    table.preserveHeight($$('#interestingPlayersTable'));
                    $$(`#players-interesting-players-title`).style.display = 'block';

                    latestPlayersData = response.result.latestPlayers;
                    $$('#latestPlayersTable').innerHTML = '';
                    $$('#latestPlayersTable').appendChild(table.generate({
                        data: parseData(latestPlayersData, `Player`),
                        id: 'latestPlayersData',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true,
                        options: {
                            onClick: showPopUpTable
                        }
                    }))
                    table.preserveHeight($$('#latestPlayersTable'));
                    $$(`#players-latest-players-title`).style.display = 'block';


                    //Player Groups TO DO, because in response getting empty object



                    largestBetsData = response.result.largestBets;
                    $$('#largestBets').innerHTML = '';
                    $$('#largestBets').appendChild(table.generate({
                        data: parsePlayersMainData(largestBetsData, false, `Player`),
                        id: 'largestBetsData',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true
                    }))
                    table.preserveHeight($$('#largestBets'));
                    $$(`#players-largest-bets-title`).style.display = 'block';

                    largestWinsData = response.result.largestWins;
                    $$('#largestWins').innerHTML = '';
                    $$('#largestWins').appendChild(table.generate({
                        data: parsePlayersMainData(largestWinsData, false, `Player`),
                        id: 'largestWinsData',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true
                    }))
                    table.preserveHeight($$('#largestWins'));
                    $$(`#players-largest-wins-title`).style.display = 'block';


                    winnersAndLosersFromLast24HoursData = response.result.winnersAndLosersFromLast24Hours;
                    $$('#winnersAndLosersFromLast24Hours').innerHTML = '';
                    $$('#winnersAndLosersFromLast24Hours').appendChild(table.generate({
                        data: parsePlayersMainData(winnersAndLosersFromLast24HoursData, false, `Player`),
                        id: 'winnersAndLosersFromLast24HoursData',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true
                    }))
                    table.preserveHeight($$('#winnersAndLosersFromLast24Hours'));
                    $$(`#players-winners-losers-title`).style.display = 'block';


                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function (response) {
                trigger('message', response.responseCode);
            }
        });
    }

    on('players/main/loaded', function () {
        getPlayersButton.classList.add('hidden');
        clearElement($$(`#players-main-portals-list`));
        afterLoad(`main`);


    });

    on('players/groups/loaded', function () {
        getPlayerButton.classList.add('hidden');
        afterLoad('groups');
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
    getGroupsButton.addEventListener('click', getPlayerGroups);

    getPlayersButton.addEventListener('click', getPlayers);

}();
