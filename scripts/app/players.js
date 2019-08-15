let players = function () {
    let playersGroupsBlackOverlay = $$('#players-groups-black-overlay');
    let playersMainBlackOveraly = $$('#players-main-black-overlay');
    let playersPlayerBlackOveraly = $$('#players-player-black-overlay');

    let getPlayerButton = $$('#players-get-player');
    let playersSearchWrapper = $$('#players-player-players-search-wrapper');
    let playersListWrapper = $$('#players-player-players-table-wrapper');
    let playerDataWrapper = $$('#players-player-data-wrapper');
    let playerPeriodWrapper = $$('#players-player-periods-canvas-wrapper');
    let playerDataFlagInteresting = $$('#player-flag-interesting');
    let playerDataFlagSuspicious = $$('#player-flag-suspicious');
    let playerDataFlagDisable = $$('#player-flag-disable');
    let playerDataFlagTest = $$('#player-flag-test');
    let playerSummaryJackpotButton = $$('#players-player-data-jackpot');
    let playerSummaryTransactionButton = $$('#players-player-data-transaction');
    let playerSummaryHistoryButton = $$('#players-player-data-history');
    let playerSummaryUnresolvedButton = $$('#players-player-data-usresloved');
    let playerTransactionFrom = getToday();
    let playerTransactionTo = getToday();
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
    let playerIdSelected;
    let playerNameSelected;
    let getPlayersButton = $$('#players-get-main');
    let playersPlayersWraper = $$('#players-main-settings-wrapper');
    let playersPlayersPopupWraper = $$('#players-main-form');


    let getGroupsButton = $$('#players-get-groups');
    let groupsSearchWrapper = $$('#players-groups-groups-search-wrapper');
    let groupsListWrapper = $$('#players-groups-groups-table-wrapper');
    let groupsDataWrapper = $$('#players-groups-data-wrapper');
    let groupsDashboardWrapper = $$('#players-groups-dashboard-table-wrapper');
    let groupsPlayersWrapper = $$('#players-groups-players-table-wrapper');
    let groupsPeriodWrapper = $$('#players-groups-period-canvas-wrapper');
    let groupsBetGraph = graph.generate($$(`#player-groups-data-bet-graph-wrapper`).children[0], 'line');
    let groupsRoundsGraph = graph.generate($$(`#player-groups-data-rounds-graph-wrapper`).children[0], 'line');
    let searchTimeoutId = undefined;

    on('date/players-player-transaction-time-span-from', function (data) {
        playerTransactionFrom = data;
    });

    on('date/players-player-transaction-time-span-to', function (data) {
        playerTransactionTo = data;
    });

    const showPlayerData = (data, playerId, name) => {
        playerDataWrapper.classList.remove('hidden');
        playerIdSelected = playerId;
        playerNameSelected = name;
        showPlayerHeaderData(playerId, data.flags, data.onlineStatus);
        showPlayerDashboardData(data.dashboard);
        // showPlayerGroupsData();
        showPlayerSummaryData(data.info, data.totalStats, data.jackpots);
        showPeriodData(data.avgBetPerHour, data.roundsPerHour, `player-data`, 0);
        console.log(data);
    };

    const showGroupData = (data, id) => {
        groupsDataWrapper.classList.remove('hidden');
        showGroupsDashboardData(data.dashboard);
        showGroupsPlayersData(data.players);
        showGroupsSuggestedPlayersData(data.suggestedPlayers, id);
        showPeriodData(data.avgBetPerHour, data.roundsPerHour, `groups-data`, 1);
    };


    const showPlayerHeaderData = (id, flags, status) => {
        $$('#players-player-data-id').innerHTML = id;
        clearPlayerFlags();
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

        // if (flags.test) {
        //     playerDataFlagTest.checked = true;
        //     return;
        // }
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
        trigger('comm/accounting/operators/get', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {

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

    const showPlayerSummaryData = (info, total, jackpots) => {
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

        if (jackpots.length === 0) {
            playerSummaryJackpotButton.classList.add('cancel');
            playerSummaryJackpotButton.disabled = true;
        }
        else {
            playerSummaryJackpotButton.disabled = false;
            playerSummaryJackpotButton.classList.remove('cancel');
            playerSummaryJackpotButton.onclick = () => { playerJackpotPopup.show(jackpots) };
        }

        playerSummaryTransactionButton.onclick = playerTransactionPopup.show;
        playerSummaryUnresolvedButton.onclick = playerUnresolvedPopup.show;
    };

    const showGroupsSuggestedPlayersData = (players, id) => {
        // TODO: implmenet this function with pagination
        createSuggestePlayersList(players, id);
    };

    const showPeriodData = (bet, rounds, tab, type) => {
        // type param: 0-for player tab, 1-for player group tab
        let periodWrapper = $$(`#players-${tab}-periods-list-wrapper`);
        clearElement($$(`#players-${tab}-periods-list`));
        let operatorsDropdown = dropdown.generate(timePeriods, `players-${tab}-periods-list`, 'Select period');
        periodWrapper.appendChild(operatorsDropdown);

        on(`players-${tab}-periods-list/selected`, (id) => {
            showPeriodsGraphs($$(`#players-${tab}-periods-list`).getSelectedName(), bet, rounds, type);
            if (type === 0) {
                playerPeriodWrapper.classList.remove('hidden');
            }
            if (type === 1) {
                groupsPeriodWrapper.classList.remove('hidden');
            }
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

            let labelsBet = [];
            let labelsRounds = [];
            let dataBet = [];
            let dataRounds = [];
            for (let element of bet[period]) {
                labelsBet.push(element.hour);
                dataBet.push(element.averageBet);
            }
            for (let element of rounds[period]) {
                labelsRounds.push(element.hour);
                dataRounds.push(element.numberOfRounds);
            }

            playerBetGraph.data.labels = labelsBet;
            playerRoundsGraph.data.labels = labelsRounds;

            let color = generateColor();
            playerBetGraph.data.datasets.push({
                data: dataBet,
                label: 'bet',
                backgroundColor: color,
                fontColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 2,
                borderColor: color,
                fill: false,
            });

            playerRoundsGraph.data.datasets.push({
                data: dataRounds,
                label: 'rounds',
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
            debugger;
            groupsBetGraph.data.datasets.length = 0;
            groupsRoundsGraph.data.datasets.length = 0;

            groupsBetGraph.options.legend.position = 'right';
            groupsRoundsGraph.options.legend.position = 'right';

            groupsBetGraph.options.title = { display: true, text: 'Total Bet', position: 'top', fontColor: 'white', fontFamily: 'roboto' };
            groupsRoundsGraph.options.title = { display: true, text: 'Avg Bet', position: 'top', fontColor: 'white', fontFamily: 'roboto' };

            let labelsBet = [];
            let labelsRounds = [];
            let dataBet = [];
            let dataRounds = [];
            for (let element of bet[period]) {
                labelsBet.push(element.hour);
                dataBet.push(element.averageBet);
            }
            for (let element of rounds[period]) {
                labelsRounds.push(element.hour);
                dataRounds.push(element.numberOfRounds);
            }

            groupsBetGraph.data.labels = labelsBet;
            groupsRoundsGraph.data.labels = labelsRounds;

            let color = generateColor();
            groupsBetGraph.data.datasets.push({
                data: dataBet,
                label: 'bet',
                backgroundColor: color,
                fontColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 2,
                borderColor: color,
                fill: false,
            });

            groupsRoundsGraph.data.datasets.push({
                data: dataRounds,
                label: 'rounds',
                backgroundColor: color,
                fontColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 2,
                borderColor: color,
                fill: false,
            });

            groupsBetGraph.update();
            groupsRoundsGraph.update();
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
        playerDataWrapper.classList.add('hidden');
        playerPeriodWrapper.classList.add('hidden');

        if (!portalId) {
            trigger('message', message.codes.badParameter);
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
        groupsDataWrapper.classList.add('hidden');
        groupsPeriodWrapper.classList.add('hidden');

        if (!portalId) {
            trigger('message', message.codes.badParameter);
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

    const getPlayerData = (id, name) => {
        trigger('comm/players/getPlayerData', {
            body: {
                id: id
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    showPlayerData(response.result, id, name);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function (response) {
                trigger('message', response.responseCode);
            }
        });
    };

    const getGroupData = (id, name) => {
        trigger('comm/playerGroups/getCompleteGroup', {
            body: {
                id: id
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    showGroupData(response.result, id);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function (response) {
                trigger('message', response.responseCode);
            }
        });
    };

    let mainForm = function () {
        let modal = $$('#players-main-form');
        let tableWrapper = $$('#players-main-criteria-table-wrapper');
        let data = undefined;
        let cancelButton = $$('#players-main-criteria-form-cancel');

        const show = (tableData) => {
            data = tableData;
            makeTable();
            modal.classList.add('show');
            showPopup('main');
        };

        const hide = () => {
            modal.classList.remove('show');
            hidePopup('main');
        };

        const makeTable = () => {

            tableWrapper.innerHTML = '';
            tableWrapper.appendChild(table.generate({
                data: data,
                id: 'table-data',
                dynamic: false,
                sticky: true,
                stickyCol: true,

            }))
            table.preserveHeight(tableWrapper);
        };

        cancelButton.addEventListener('click', hide);

        return {
            show: show,
            hide: hide
        }
    }();

    let suggestedPlayersPopup = function () {
        let criteria = undefined;
        let cancelButton = $$('#players-groups-criteria-form-cancel');
        let modal = $$('#players-groups-form');


        const show = (crit) => {
            criteria = crit;
            createList();
            modal.classList.add('show');
            showPopup('groups');
        };

        const hide = () => {
            modal.classList.remove('show');
            hidePopup('groups');
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
                tr.onclick = function () { criteriaPlayersPopup.show({ name: row.name, playerValue: row.playerValue, groupValue: row.groupValue, similarity: row.similarity }) };
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

    const createSuggestePlayersList = (data, id) => {
        let actions = $$(`#players-groups-suggested-players-list-wrapper`);
        let serachBar = $$(`#players-groups-suggested-players-search-wrapper`);
        if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
            actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
        }
        let body = document.createElement('tbody');
        let thPlayerId = document.createElement('th');
        let thSimilarity = document.createElement('th');
        thPlayerId.innerHTML = 'Player Id';
        thSimilarity.innerHTML = 'Similarity';
        let trHead = document.createElement('tr');
        trHead.appendChild(thPlayerId);
        trHead.appendChild(thSimilarity);
        body.appendChild(trHead);
        for (let row of data) {
            let tr = document.createElement('tr');
            let tdId = document.createElement('td');
            let tdSimilarity = document.createElement('td');
            // td.innerHTML = `${row.playerId} <span style="float: right;">${row.averageSimilarityOfCriteria}% similarity</span>`;
            tdId.innerHTML = row.playerId;
            tdSimilarity.innerHTML = row.averageSimilarityOfCriteria;
            tr.dataset.id = row.playerId;
            tr.onclick = function () { suggestedPlayersPopup.show(row.criteria) };
            tr.appendChild(tdId);
            tr.appendChild(tdSimilarity);
            body.appendChild(tr);
        }

        actions.getElementsByTagName('table')[0].appendChild(body);
        actions.classList.remove('hidden');
        serachBar.classList.remove('hidden');

        let input = $$(`#players-groups-suggested-players-search`);

        input.addEventListener('input', function () {
            if (searchTimeoutId) {
                clearTimeout(searchTimeoutId);
                searchTimeoutId = setTimeout(() => { searchDataBySubstring(input.value, id) }, 800);
            }
            else {
                searchTimeoutId = setTimeout(() => { searchDataBySubstring(input.value, id) }, 800);
            }
        });

        input.addEventListener('keyup', function (e) {
            if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
                input.value = '';
                searchData(body, '');
            }
        });

        $$(`#players-groups-suggested-players-remove-search`).onclick = function () {
            input.value = '';
            searchDataBySubstring(input.value, id)
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
            tr.onclick = function () { callback(row.id, row.name) };
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

    const searchDataBySubstring = (term, id) => {
        let actions = $$(`#players-groups-suggested-players-list-wrapper`);
        if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
            actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
        }
        let body = document.createElement('tbody');

        trigger('comm/playerGroups/getGroupsBySubstring', {
            body: {
                playerGroupId: id,
                substring: term
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    for (let row of response.result) {
                        let tr = document.createElement('tr');
                        let td = document.createElement('td');
                        td.innerHTML = `${row.playerId} <span style="float: right;">${row.averageSimilarityOfCriteria}% similarity</span>`;
                        tr.dataset.id = row.playerId;
                        tr.onclick = function () { suggestedPlayersPopup.show(row.criteria) };
                        tr.appendChild(td);
                        body.appendChild(tr);
                    }
                }
                else {
                    trigger('message', message.codes.success);
                }
            },
            fail: function (response) {
                trigger('message', response.responseCode);
            }
        });

        actions.getElementsByTagName('table')[0].appendChild(body);
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
        // playerDataFlagTest.checked = false;
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
            updatePlayerFlagsAndDisabledStatus({ interesting: false, suspicious: true, disabled: false, test: false, wasDisabled: playerDataFlagDisable.checked });
            return;
        }

        if (event.target === playerDataFlagDisable) {
            updatePlayerFlagsAndDisabledStatus({ interesting: false, suspicious: false, disabled: true, test: false, wasDisabled: false });
            return;
        }

        // if (event.target === playerDataFlagTest) {
        //     updatePlayerFlagsAndDisabledStatus({ interesting: false, suspicious: false, disabled: false, test: true, wasDisabled: playerDataFlagDisable.checked });
        //     return;
        // }

        if (event.target === playerDataFlagInteresting) {
            updatePlayerFlagsAndDisabledStatus({ interesting: true, suspicious: false, disabled: false, test: false, wasDisabled: playerDataFlagDisable.checked });
            return;
        }
    };

    const updatePlayerFlagsAndDisabledStatus = (flags) => {
        if (flags.wasDisabled || flags.disabled) {
            trigger('comm/players/EnableOrDisable', {
                body: {
                    id: playerIdSelected
                },
                success: function (response) {
                    if (response.responseCode === message.codes.success) {
                        updatePlayerFlags(flags);
                    }
                    else {
                        trigger('message', response.responseCode);
                    }
                },
                fail: function (response) {
                    trigger('message', response.responseCode);
                }
            });
        }
        else {
            updatePlayerFlags(flags);
        }
    };

    const updatePlayerFlags = (flags) => {
        trigger('comm/players/setPlayerFlags', {
            body: {
                playerId: playerIdSelected,
                interesting: flags.interesting,
                suspicious: flags.suspicious
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    clearPlayerFlags();
                    showPlayerFlagData(flags);
                }
                else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function (response) {
                trigger('message', response.responseCode);
            }
        });
    };

    let playerJackpotPopup = function () {
        let jackpotData = undefined;
        let modal = $$('#players-player-jackpot-form');
        let cancelButton = $$('#players-player-jackpot-main-form-cancel');
        let tableWrapper = $$('#players-player-jackpot-table-wrapper');

        const show = (data) => {
            jackpotData = data;
            populateJackpotTable();
            modal.classList.add('show');
            showPopup('player');
        };

        const hide = () => {
            modal.classList.remove('show');
            hidePopup('player');
        };

        const populateJackpotTable = () => {
            tableWrapper.innerHTML = '';
            tableWrapper.appendChild(table.generate({
                data: jackpotData,
                id: 'playerJackpotData',
                dynamic: false,
                sticky: true,
                stickyCol: true,
            }));
            table.preserveHeight(tableWrapper);
        };

        cancelButton.addEventListener('click', hide);

        return {
            show: show,
            hide: hide,
        }
    }();

    let playerTransactionPopup = function () {
        let modal = $$('#players-player-transaction-form');
        let cancelButton = $$('#players-player-transaction-main-form-cancel');
        let tableWrapper = $$('#players-player-transaction-table-wrapper');
        let getButton = $$('#players-player-transaction-get');

        const show = () => {
            modal.classList.add('show');
            showPopup('player');
        };

        const hide = () => {
            modal.classList.remove('show');
            hidePopup('player');
        };

        const getTransactions = () => {
            trigger('comm/players/getTransactions', {
                body: {
                    fromTime: playerTransactionFrom,
                    toTime: playerTransactionTo,
                    playerId: playerIdSelected
                },
                success: function (response) {
                    if (response.responseCode === message.codes.success) {
                        if (response.result.length === 0) {
                            trigger('message', message.codes.noData);
                            return;
                        }
                        tableWrapper.innerHTML = '';
                        tableWrapper.appendChild(table.generate({
                            data: response.result,
                            id: 'playerTransactionData',
                            dynamic: false,
                            sticky: true,
                            stickyCol: true,
                        }));
                        table.preserveHeight(tableWrapper);
                    }
                    else {
                        trigger('message', response.responseCode);
                    }
                },
                fail: function (response) {
                    trigger('message', response.responseCode);
                }
            });
        };

        cancelButton.addEventListener('click', hide);
        getButton.addEventListener('click', getTransactions);

        return {
            show: show,
            hide: hide,
        }
    }();

    let playerUnresolvedPopup = function () {
        let modal = $$('#players-player-unresolved-wins-form');
        let cancelButton = $$('#players-player-unresolved-wins-main-form-cancel');
        let listWrapper = $$('#players-player-unresolved-wins-main-wrapper');

        const show = () => {
            getGames();
        };

        const hide = () => {
            modal.classList.remove('show');
            hidePopup('player');
        };

        const getGames = () => {
            addLoader(playerSummaryUnresolvedButton);
            trigger('comm/currency/getGames', {
                body: {

                },
                success: function (response) {
                    if (response.responseCode === message.codes.success) {
                        populateGameTable(response.result);
                        modal.classList.add('show');
                        showPopup('player');
                        removeLoader(playerSummaryUnresolvedButton);
                    }
                    else {
                        trigger('message', response.responseCode);
                        removeLoader(playerSummaryUnresolvedButton);
                    }
                },
                fail: function (response) {
                    trigger('message', response.responseCode);
                    removeLoader(playerSummaryUnresolvedButton);
                }
            })
        };

        const populateGameTable = (data) => {
            if (listWrapper.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
                listWrapper.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
            }
            let body = document.createElement('tbody');
            for (let row of data) {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.innerHTML = row.name;
                tr.dataset.id = row.id;
                tr.onclick = function () { playerUnresolvedWinsPopup.show(row.id, td) };
                tr.appendChild(td);
                body.appendChild(tr);
            }

            listWrapper.getElementsByTagName('table')[0].appendChild(body);
            listWrapper.classList.remove('hidden');
        };

        cancelButton.addEventListener('click', hide);

        return {
            show: show,
            hide: hide,
        }
    }();

    let playerUnresolvedWinsPopup = function () {
        let modal = $$('#players-player-unresolved-wins-specific-game-form');
        let backButton = $$('#players-player-unresolved-wins-specific-game-form-back');
        let gameId = undefined;
        let loaderElement = undefined;

        const show = (id, element) => {
            loaderElement = element;
            gameId = id;
            getWins();
        };

        const hide = () => {
            modal.classList.remove('show');
        };

        const getWins = () => {
            addLoader(loaderElement);
            trigger('comm/playerGroups/getGroupsBySubstring', {
                body: {
                    caption: playerNameSelected,
                    gameId: gameId,
                    playerId: playerIdSelected
                },
                success: function (response) {
                    if(response.responseCode === message.codes.success){
                        populateTable(response.result);
                        modal.classList.add('show');
                        removeLoader(loaderElement);
                    }
                    else{
                        trigger('message', response.responseCode);
                        removeLoader(loaderElement);
                    }
                },
                fail: function (response) {
                    trigger('message', response.responseCode);
                    removeLoader(loaderElement);
                }
            });
        };

        const populateTable = (data) => {
            console.log(data);
        };

        backButton.addEventListener('click', hide);

        return {
            show: show,
            hide: hide,
        }
    }();

    const showPopup = (tab) => {
        switch (tab) {
            case 'main':
                playersMainBlackOveraly.style.display = 'block';
                break;
            case 'player':
                playersPlayerBlackOveraly.style.display = 'block';
                break;
            case 'groups':
                playersGroupsBlackOverlay.style.display = 'block';
                break;
        }

        $$(`#players-${tab}`).children[0].style.overflow = 'hidden';
    };

    const hidePopup = (tab) => {
        switch (tab) {
            case 'main':
                playersMainBlackOveraly.style.display = 'none';
                break;
            case 'player':
                playersPlayerBlackOveraly.style.display = 'none';
                break;
            case 'groups':
                playersGroupsBlackOverlay.style.display = 'none';
                break;
        }
        $$(`#players-${tab}`).children[0].style.overflow = 'auto';
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
        mainForm.show(parsePlayersMainData(popUpData, false, `Activity`));
        // $$('#popUpTable').innerHTML = '';
        // $$('#popUpTable').appendChild(table.generate({
        //     data: parsePlayersMainData(popUpData, false, `Activity`),
        //     id: 'popUpData',
        //     dynamic: false,
        //     sticky: true,
        //     stickyCol: true,

        // }))
        // table.preserveHeight($$('#popUpTable'));

    }

    const isEmpty = (obj) => {
        return Object.keys(obj).length === 0;
    }

    const getPlayers = () => {

        $$('#players-main-settings-wrapper').style.display = 'flex'
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
                        data: parseData(interestingPlayersData, `Player`),
                        id: 'interestingPlayersData',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true,
                        options: {
                            onClick: showPopUpTable
                        }
                    }))
                    table.preserveHeight($$('#interestingPlayersTable'));
                    if (isEmpty(interestingPlayersData) === true) {
                        $$(`#players-interesting-players-title`).style.display = 'none';

                    } else {
                        $$(`#players-interesting-players-title`).style.display = 'block';
                    }

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
                    if (isEmpty(latestPlayersData) === true) {
                        $$(`#players-latest-players-title`).style.display = 'none';

                    } else {
                        $$(`#players-latest-players-title`).style.display = 'block';
                    }

                    //Player Groups TO DO, because in response getting empty object
                    interestingPlayersData = response.result.interestingPlayers;
                    $$('#PlayersGroupsTable').innerHTML = '';
                    $$('#PlayersGroupsTable').appendChild(table.generate({
                        data: parseData(interestingPlayersData, `Player`),
                        id: 'interestingPlayersData',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true,
                        options: {
                            onClick: showPopUpTable
                        }
                    }))
                    table.preserveHeight($$('#PlayersGroupsTable'));
                    if (isEmpty(interestingPlayersData) === true) {
                        $$(`#players-players-groups-title`).style.display = 'none';

                    } else {
                        $$(`#players-players-groups-title`).style.display = 'block';
                    }
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


                    if (isEmpty(largestBetsData) === true) {
                        $$(`#players-largest-bets-title`).style.display = 'none';
                    } else {
                        $$(`#players-largest-bets-title`).style.display = 'block';
                    }

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
                    if (isEmpty(largestBetsData) === true) {
                        $$(`#players-largest-wins-title`).style.display = 'none';
                    } else {
                        $$(`#players-largest-wins-title`).style.display = 'block';
                    }


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
                    $$(`#players-largest-wins-title`).style.display = 'block';

                    if (isEmpty(largestBetsData) === true) {
                        $$(`#players-winners-losers-title`).style.display = 'none';
                    } else {
                        $$(`#players-winners-losers-title`).style.display = 'block';
                    }


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
        $$('#players-main-settings-wrapper').style.display = 'none'
        clearElement($$(`#players-main-portals-list`));
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
    getPlayersButton.addEventListener('click', getPlayers);

}();
