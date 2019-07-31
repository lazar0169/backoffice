let players = function () {
    let blackOverlay = $$('#players-groups-black-overlay');

    let getPlayerButton = $$('#players-get-player');
    let playersSearchWrapper = $$('#players-player-players-search-wrapper');
    let playersListWrapper = $$('#players-player-players-table-wrapper');
    let playerDataWrapper = $$('#players-player-data-wrapper');
    let playerPeriodWrapper = $$('#players-player-data-periods-wrapper');
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

    let getPlayersButton = $$('#players-get-main');


    let getGroupsButton = $$('#players-get-groups');
    let groupsSearchWrapper = $$('#players-groups-groups-search-wrapper');
    let groupsListWrapper = $$('#players-groups-groups-table-wrapper');
    let groupsDataWrapper = $$('#players-groups-data-wrapper');
    let groupsDashboardWrapper = $$('#players-groups-dashboard-table-wrapper');
    let groupsPlayersWrapper = $$('#players-groups-players-table-wrapper');
    let groupsPeriodWrapper = $$('#players-groups-period-graphs-wrapper');
    let groupsBetGraph = graph.generate($$(`#player-groups-data-bet-graph-wrapper`).children[0], 'line');
    let groupsRoundsGraph = graph.generate($$(`#player-groups-data-rounds-graph-wrapper`).children[0], 'line');
    let searchTimeoutId = undefined;

    const showPlayerData = (data, playerId) => {
        playerDataWrapper.classList.remove('hidden');
        showPlayerHeaderData(playerId, data.flags, data.onlineStatus);
        showPlayerDashboardData(data.dashboard);
        // showPlayerGroupsData();
        showPlayerSummaryData(data.info, data.totalStats);
        //showPeriodData(data.avgBetPerHour, data.roundsPerHour, `player-data`, 0);
        console.log(data);
    };

    const showGroupData = (data) => {
        groupsDataWrapper.classList.remove('hidden');
        showGroupsDashboardData(data.dashboard);
        showGroupsPlayersData(data.players);
        showGroupsSuggestedPlayersData(data.suggestedPlayers);
        //showPeriodData(data.avgBetPerHour, data.roundsPerHour, `player-data`, 1); //change to adapt to groups
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

    const showGroupsDashboardData = (data) => {
        if (groupsDashboardWrapper.children.length > 0) {
            groupsDashboardWrapper.children[0].remove();
        }

        let tableNode = table.generate({
            data: parsePlayerDashboardData(data),
            id: 'groupsDashboardData',
            sticky: true,
            stickyCol: false
        });
        groupsDashboardWrapper.appendChild(tableNode);
    };

    const showGroupsPlayersData = (data) => {
        if (groupsPlayersWrapper.children.length > 0) {
            groupsPlayersWrapper.children[0].remove();
        }

        let tableNode = table.generate({
            data: parseGroupsPlayersData(data),
            id: 'groupsDashboardData',
            sticky: true,
            stickyCol: false
        });
        groupsPlayersWrapper.appendChild(tableNode);
    };

    const afterLoad = (tab) => {
        addLoader($$(`#players-navbar-${tab}`));
        trigger('comm/playerGroups/getOperators', {
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

    const showGroupsSuggestedPlayersData = (players) => {
        // TODO: implmenet this function with pagination
        createSuggestePlayersList(players);
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
            trigger('comm/playerGroups/getPortals', {
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
        let portalId = $$('#players-groups-portals-list').getSelected();

        if (!portalId) {
            trigger('message', message.codes.badParameters);
            return;
        }
        addLoader(getGroupsButton);
        trigger('comm/playerGroups/get', {
            body: {
                id: portalId
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    createList(response.result, `groups-groups`, getGroupData);
                }
                else {
                    trigger('message', response.responseCode);
                }
                removeLoader(getGroupsButton);
            },
            fail: function (response) {
                trigger('message', response.responseCode);
                removeLoader(getGroupsButton);
            }
        });
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
    };

    const getGroupData = (id) => {
        trigger('comm/playerGroups/getCompleteGroup', {
            body: {
                id: id
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    showGroupData(response.result);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function (response) {
                trigger('message', response.responseCode);
            }
        });
    };

    let suggestedPlayersPopup = function () {
        let criteria = undefined;
        let cancelButton = $$('#players-groups-criteria-form-cancel');
        let modal = $$('#players-groups-form');


        const show = (crit) => {
            //TODO : change to work for array
            criteria = crit;
            createList();
            blackOverlay.style.display = 'block';
            modal.classList.add('show');
            $$('#players-groups').children[0].style.overflow = 'hidden';
        };

        const hide = () => {
            blackOverlay.style.display = 'none';
            modal.classList.remove('show');
            $$('#players-groups').children[0].style.overflow = 'auto';
        };

        const createList = () => {
            let actions = $$(`#players-groups-criteria-list-wrapper`);
            if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
                actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
            }
            let body = document.createElement('tbody');
            for (let row of criteria) {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.innerHTML = row.name;
                tr.dataset.id = row.playerId;
                tr.onclick = function () { criteriaPlayersPopup.show({name: row.name, playerValue: row.playerValue, groupValue: row.groupValue, similarity: row.similarity}) };
                tr.appendChild(td);
                body.appendChild(tr);
            }
    
            actions.getElementsByTagName('table')[0].appendChild(body);
            actions.classList.remove('hidden');
        };

        cancelButton.addEventListener('click', hide);

        return {
            show: show,
            hide: hide
        }
    }();

    let criteriaPlayersPopup = function () {
        let modal = $$('#players-groups-criteria-details-form');
        let criteriaData = undefined;
        let nameInput = $$('#players-groups-criteria-name');
        let playerValueInput = $$('#players-groups-criteria-player-value');
        let groupValueInput = $$('#players-groups-criteria-group-value');
        let similarityInput = $$('#players-groups-criteria-similarity');
        let backButton = $$('#players-groups-criteria-details-form-back');

        const show = (data) => {
            criteriaData = data;
            fillInputs();
            modal.classList.add('show');
        };

        const hide = () => {
            modal.classList.remove('show');
        };

        const fillInputs = () => {
            nameInput.value = criteriaData.name;
            playerValueInput.value = criteriaData.playerValue;
            groupValueInput.value = criteriaData.groupValue;
            similarityInput.value = criteriaData.similarity;
        };

        backButton.addEventListener('click', hide);

        return {
            show: show,
            hide: hide
        }
    }();

    const createSuggestePlayersList = (data) => {
        let actions = $$(`#players-groups-suggested-players-list-wrapper`);
        let serachBar = $$(`#players-groups-suggested-players-search-wrapper`);
        if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
            actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
        }
        let body = document.createElement('tbody');
        for (let row of data) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.innerHTML = `${row.playerId} <span>${row.averageSimilarityOfCriteria}% similarity</span>`;
            tr.dataset.id = row.playerId;
            tr.onclick = function () { suggestedPlayersPopup.show(row.criteria) };
            tr.appendChild(td);
            body.appendChild(tr);
        }

        actions.getElementsByTagName('table')[0].appendChild(body);
        actions.classList.remove('hidden');
        serachBar.classList.remove('hidden');

        let input = $$(`#players-groups-suggested-players-search`);

        input.addEventListener('input', function () {
            searchData(body, input.value);
        });

        input.addEventListener('keyup', function (e) {
            if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
                input.value = '';
                searchData(body, '');
            }
        });

        $$(`#players-groups-suggested-players-remove-search`).onclick = function () {
            input.value = '';
            searchData(body, '');
        };
    };

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
                ' ': transformCamelToRegular(key)
            };
            for (let firstKey of firstColKeys) {
                row[firstKey] = data[firstKey][key];
            }
            resultData.push(row);
        }
        return resultData;
    };

    const parseGroupsPlayersData = (data) => {
        let keys = Object.keys(data[0]);

        let resultData = [];
        for (let element of data) {
            let row = {};
            for (let key of keys) {
                row[key] = element[key];
            }
            resultData.push(row);
        }
        return resultData;
    };

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

    on('players/main/loaded', function () {
        getPlayersButton.classList.add('hidden');
        afterLoad(`main`);
    });

    on('players/groups/loaded', function () {
        getPlayerButton.classList.add('hidden');
        groupsSearchWrapper.classList.add('hidden');
        groupsListWrapper.classList.add('hidden');
        groupsDataWrapper.classList.add('hidden');
        groupsPeriodWrapper.classList.add('hidden');
        clearElement($$(`#players-groups-portals-list`));
        afterLoad('groups');
    });

    on('players/player/loaded', function () {
        getPlayerButton.classList.add('hidden');
        playersSearchWrapper.classList.add('hidden');
        playersListWrapper.classList.add('hidden');
        playerDataWrapper.classList.add('hidden');
        playerPeriodWrapper.classList.add('hidden');
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
    //  getPlayersButton.addEventListener('click',getPlayers)
}();