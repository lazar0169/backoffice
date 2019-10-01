let players = function () {
    let playersGroupsBlackOverlay = $$('#players-groups-black-overlay');
    let playersMainBlackOveraly = $$('#players-main-black-overlay');
    let playersPlayerBlackOveraly = $$('#players-player-black-overlay');

    let getPlayerButton = $$('#players-get-player');
    let playersSearchListWrapper = $$('#players-player-players-wrapper');
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
    let playerGroupsWrapper = $$('#players-player-data-groups-wrapper');
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
    let playersGroupsData;
    let winnersAndLosersFromLast24HoursData;
    let playerIdSelected;
    let portalIdSelected;
    let playerNameSelected;
    let getPlayersButton = $$('#players-get-main');

    let getGroupsButton = $$('#players-get-groups');
    let groupsPlayersSaveChanged = $$('#players-groups-save-changed-players-button');
    let groupsGetSuggestedPlayersButton = $$('#players-groups-get-suggested-players-button');
    let groupsSearchListWrapper = $$('#players-groups-groups-wrapper');
    let groupsSearchWrapper = $$('#players-groups-groups-search-wrapper');
    let groupsListWrapper = $$('#players-groups-groups-table-wrapper');
    let groupsDataWrapper = $$('#players-groups-data-wrapper');
    let groupsDashboardWrapper = $$('#players-groups-dashboard-table-wrapper');
    let groupsPlayersWrapper = $$('#players-groups-players-table-wrapper');
    let groupsPeriodWrapper = $$('#players-groups-period-canvas-wrapper');
    let groupsSuggestedPlayerWrapper = $$('#players-groups-suggested-players-list-wrapper');
    let groupsSuggestedPlayersSearchWrapper = $$('#players-groups-suggested-players-search-wrapper');
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
        console.log(data);
        playerDataWrapper.classList.remove('hidden');
        playersSearchListWrapper.classList.add('shrink');
        playerIdSelected = playerId;
        playerNameSelected = name;
        showPlayerHeaderData(data.flags, data.onlineStatus);
        showPlayerDashboardData(data.dashboard);
        showPlayerGroupsData(data.playerGroups);
        showPeriodData(data.avgBetPerHour, data.roundsPerHour, `player-data`, 0);
        showPlayerSummaryData(data.info, data.totalStats, data.jackpots);
    };

    const showGroupData = (data, id, element) => {
        console.log(data);
        groupsDataWrapper.classList.remove('hidden');
        groupsSuggestedPlayerWrapper.classList.add('hidden');
        groupsSuggestedPlayersSearchWrapper.classList.add('hidden');
        groupsSearchListWrapper.classList.add('shrink');
        showGroupsDashboardData(data.dashboard);
        showGroupsPlayersData(data.players);
        showPeriodData(data.avgBetPerHour, data.roundsPerHour, `groups-data`, 1);
        showGroupsAllPlayersData(data.allPlayers, id, element);
    };


    const showPlayerHeaderData = (flags, status) => {
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

    const showPlayerGroupsData = (data) => {
        playerGroupsWrapper.innerHTML = "";
        for (let group of data) {
            const row = document.createElement('div');
            const groupName = document.createElement('h3');
            const checkboxWrapper = document.createElement('div');
            const checkboxInput = document.createElement('input');
            const checkboxLabel = document.createElement('label');
            const questionMark = document.createElement('h2');
            row.classList.add('players-flex-wrapper');
            row.style.justifyContent = 'space-between';
            groupName.innerHTML = group.name;
            checkboxInput.type = 'checkbox';
            checkboxInput.checked = group.checked;
            checkboxLabel.addEventListener('click', () => addOrRemovePlayerToGroup(checkboxInput, group.id));
            checkboxInput.id = `group-${group.id}`;
            checkboxLabel.htmlFor = `group-${group.id}`;
            checkboxWrapper.style.alignSelf = 'center';
            questionMark.innerHTML = '❔';
            questionMark.addEventListener('click', () => playerCriteriaPopup.show(group.id, playerIdSelected));
            checkboxWrapper.appendChild(checkboxInput);
            checkboxWrapper.appendChild(checkboxLabel);
            checkboxWrapper.appendChild(questionMark);
            checkboxWrapper.classList.add('players-player-groups-checkbox-wrapper');
            row.appendChild(groupName);
            row.appendChild(checkboxWrapper);
            playerGroupsWrapper.appendChild(row);
        }
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
            // data: parseGroupsPlayersData(data),
            data: data,
            id: 'groupsDashboardData',
            sticky: true,
            stickyCol: false
        });
        groupsPlayersWrapper.appendChild(tableNode);
    };

    const addOrRemovePlayerToGroup = (checkbox, groupId) => {
        trigger(`${!checkbox.checked ? 'comm/playerGroups/addPlayer' : 'comm/playerGroups/removePlayer'}`, {
            body: {
                playerGroupId: groupId,
                playerId: playerIdSelected
            },
            success: function (response) {
                if (response.responseCode !== message.codes.success) {
                    trigger('message', response.responseCode);
                }
            },
            fail: function (response) {
                trigger('message', response.responseCode);
            }
        });
    };

    const addOrRemovePlayerFromGroup = (checkbox, groupId, playerId) => {
        trigger(`${!checkbox.checked ? 'comm/playerGroups/addPlayerNew' : 'comm/playerGroups/removePlayerNew'}`, {
            body: {
                playerGroupId: groupId,
                playerId: playerId
            },
            success: function (response) {
                if (response.responseCode !== message.codes.success) {
                    trigger('message', response.responseCode);
                }
            },
            fail: function (response) {
                trigger('message', response.responseCode);
            }
        });
    };

    const afterLoad = (tab) => {
        addLoader($$(`#players-navbar-${tab}`));
        trigger('comm/accounting/operators/get', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    getOperators(response.result, tab);
                    removeLoader($$(`#players-navbar-${tab}`));
                } else {
                    removeLoader($$(`#players-navbar-${tab}`));
                    trigger('message', response.responseCode);
                }
            },
            fail: function (response) {
                trigger('message', response.responseCode);
                removeLoader($$(`#players-navbar-${tab}`));
            }
        });
    };

    const showPlayerSummaryData = (info, total, jackpots) => {
        let infoId = $$('#players-player-data-summary-id-value');
        let infoName = $$('#players-player-data-summary-name-value');
        let totalBet = $$('#players-player-data-summary-bet-value');
        let totalWin = $$('#players-player-data-summary-win-value');
        let totalAvgBet = $$('#players-player-data-summary-avg-bet-value');
        let totalRounds = $$('#players-player-data-summary-rounds-value');
        let totalGgr = $$('#players-player-data-summary-ggr-value');

        infoId.innerHTML = info.id;
        infoName.innerHTML = info.name;
        totalBet.innerHTML = total.bet;
        totalWin.innerHTML = total.win;
        totalAvgBet.innerHTML = total.avgBet;
        totalRounds.innerHTML = total.rounds;
        totalGgr.innerHTML = total.ggr;

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
        playerSummaryHistoryButton.onclick = playerHistoryPopup.show;
    };

    const showGroupsSuggestedPlayersData = (players, id) => {
        createSuggestePlayersList(players, id);
    };

    const showGroupsAllPlayersData = (players, id, element) => {
        groupsPlayersSaveChanged.onclick = () => {
            getGroupData(id, undefined, element);
        };
        groupsGetSuggestedPlayersButton.onclick = () => {
            trigger('comm/playerGroups/getSuggestedGroups', {
                body: {
                    id: id
                },
                success: function (response) {
                    if (response.responseCode === message.codes.success) {
                        createSuggestePlayersList(response.result, id);
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
        createAllPlayersList(players, id);
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

        $$(`#players-${tab}-periods-list`).children[1].children[2].click();
    };

    const showPeriodsGraphs = (period, bet, rounds, type) => {
        if (type === 0) {
            playerBetGraph.data.datasets.length = 0;
            playerRoundsGraph.data.datasets.length = 0;

            playerBetGraph.options.legend.position = 'bottom';
            playerRoundsGraph.options.legend.position = 'bottom';

            playerBetGraph.options.title = { display: true, text: 'Avg Bet (Per Hour)', position: 'top', fontColor: 'white', fontFamily: 'roboto' };
            playerRoundsGraph.options.title = { display: true, text: 'Total Rounds (Per Hour)', position: 'top', fontColor: 'white', fontFamily: 'roboto' };

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
            groupsBetGraph.data.datasets.length = 0;
            groupsRoundsGraph.data.datasets.length = 0;

            groupsBetGraph.options.legend.position = 'bottom';
            groupsRoundsGraph.options.legend.position = 'bottom';

            groupsBetGraph.options.title = { display: true, text: 'Avg Bet (Per Hour)', position: 'top', fontColor: 'white', fontFamily: 'roboto' };
            groupsRoundsGraph.options.title = { display: true, text: 'Total Rounds (Per Hour)', position: 'top', fontColor: 'white', fontFamily: 'roboto' };

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
        $$('#players-player-main-wrapper').classList.add('hidden');

        if (!portalId) {
            trigger('message', message.codes.badParameter);
            return;
        }
        addLoader(getPlayerButton);
        trigger('comm/player/getPlayerForPortal', {
            body: {
                id: portalId
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    if (response.result.length === 0) {
                        removeLoader(getPlayerButton);
                        trigger('message', message.codes.noData);
                        return;
                    }
                    portalIdSelected = portalId;
                    createList(response.result, `player-players`, getPlayerData);
                    $$('#players-player-main-wrapper').classList.remove('hidden');
                    playersSearchListWrapper.classList.remove('shrink');
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
        $$('#players-groups-main-wrapper').classList.add('hidden');

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
                    if (response.result.length === 0) {
                        removeLoader(getGroupsButton);
                        trigger('message', message.codes.noData);
                        return;
                    }
                    createList(response.result, `groups-groups`, getGroupData);
                    $$('#players-groups-main-wrapper').classList.remove('hidden');
                    groupsSearchListWrapper.classList.remove('shrink');
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

    const getPlayerData = (id, name, element) => {
        addLoader(element);
        trigger('comm/player/getPlayerData', {
            body: {
                id: id
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    showPlayerData(response.result, id, name);
                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader(element);
            },
            fail: function (response) {
                trigger('message', response.responseCode);
                removeLoader(element);
            }
        });
    };

    const getGroupData = (id, name, element) => {
        addLoader(element);
        trigger('comm/playerGroups/getCompleteGroup', {
            body: {
                id: id
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    showGroupData(response.result, id, element);
                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader(element);
            },
            fail: function (response) {
                trigger('message', response.responseCode);
                removeLoader(element);
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

    const createAllPlayersList = (data, id) => {
        let actions = $$(`#players-groups-all-players-list-wrapper`);
        let serachBar = $$(`#players-groups-all-players-search-wrapper`);
        if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
            actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
        }
        let body = document.createElement('tbody');
        let thPlayerId = document.createElement('th');
        let thIsInGroup = document.createElement('th');
        thPlayerId.innerHTML = 'Player Id';
        thIsInGroup.innerHTML = 'Is in Group';
        let trHead = document.createElement('tr');
        trHead.appendChild(thPlayerId);
        trHead.appendChild(thIsInGroup);
        body.appendChild(trHead);
        for (let row of data) {
            let tr = document.createElement('tr');
            let tdId = document.createElement('td');
            let tdIsInGroup = document.createElement('td');
            tdId.innerHTML = row.playerId;
            const checkboxWrapper = document.createElement('div');
            const checkboxInput = document.createElement('input');
            const checkboxLabel = document.createElement('label');
            checkboxInput.type = 'checkbox';
            checkboxInput.checked = row.playerInGroup;
            checkboxLabel.addEventListener('click', () => addOrRemovePlayerFromGroup(checkboxInput, id, row.playerId));
            checkboxInput.id = `player-${row.playerId}`;
            checkboxLabel.htmlFor = `player-${row.playerId}`;
            checkboxWrapper.style.alignSelf = 'center';
            checkboxWrapper.appendChild(checkboxInput);
            checkboxWrapper.appendChild(checkboxLabel);
            tdIsInGroup.appendChild(checkboxWrapper);
            tr.dataset.id = row.playerId;
            tr.appendChild(tdId);
            tr.appendChild(tdIsInGroup);
            body.appendChild(tr);
        }

        actions.getElementsByTagName('table')[0].appendChild(body);
        actions.classList.remove('hidden');
        if (!data.length) {
            let tr = document.createElement('tr');
            let tdId = document.createElement('td');
            let tdIsInGroup = document.createElement('td');
            tdId.innerHTML = '-';
            tdIsInGroup.innerHTML = '-';
            tr.appendChild(tdId);
            tr.appendChild(tdIsInGroup);
            body.appendChild(tr);
            serachBar.classList.add('hidden');
        } else {
            serachBar.classList.remove('hidden');
        }

        let input = $$(`#players-groups-all-players-search`);

        input.addEventListener('input', function () {
            if (searchTimeoutId) {
                clearTimeout(searchTimeoutId);
                searchTimeoutId = setTimeout(() => { searchDataBySubstringNew(input.value, id) }, 800);
            }
            else {
                searchTimeoutId = setTimeout(() => { searchDataBySubstringNew(input.value, id) }, 800);
            }
        });

        input.addEventListener('keyup', function (e) {
            if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
                input.value = '';
                searchData(body, '');
            }
        });

        $$(`#players-groups-all-players-remove-search`).onclick = function () {
            input.value = '';
            searchDataBySubstringNew(input.value, id)
        };
    };

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
        if (!data.length) {
            let tr = document.createElement('tr');
            let tdId = document.createElement('td');
            let tdSimilarity = document.createElement('td');
            tdId.innerHTML = '-';
            tdSimilarity.innerHTML = '-';
            tr.appendChild(tdId);
            tr.appendChild(tdSimilarity);
            body.appendChild(tr);
            serachBar.classList.add('hidden');
        } else {
            serachBar.classList.remove('hidden');
        }

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
            tr.onclick = function () { callback(row.id, row.name, td) };
            tr.appendChild(td);
            body.appendChild(tr);
        }

        actions.getElementsByTagName('table')[0].appendChild(body);
        actions.classList.remove('hidden');
        serachBar.classList.remove('hidden');

        let input = $$(`#players-${section}-search`);

        input.value = "";
        input.addEventListener('input', function () {
            if (section === 'player-players') {
                if (searchTimeoutId) {
                    clearTimeout(searchTimeoutId);
                    searchTimeoutId = setTimeout(() => { searchPlayersBySubstring(input.value, callback) }, 800);
                }
                else {
                    searchTimeoutId = setTimeout(() => { searchPlayersBySubstring(input.value, callback) }, 800);
                }
            }
            else {
                searchData(body, input.value);
            }
        });

        input.addEventListener('keyup', function (e) {
            if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
                input.value = '';
                if (section === 'player-players') {
                    createList(data, section, callback);
                }
                else {
                    searchData(body, '');
                }
            }
        });

        $$(`#players-${section}-remove-search`).onclick = function () {
            input.value = '';
            if (section === 'player-players') {
                createList(data, section, callback);
            }
            else {
                searchData(body, '');
            }

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

    const searchDataBySubstringNew = (term, id) => {
        let actions = $$(`#players-groups-all-players-list-wrapper`);
        if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
            actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
        }
        let body = document.createElement('tbody');

        trigger('comm/playerGroups/getPlayersBySubstringNew', {
            body: {
                playerGroupId: id,
                substring: term
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    for (let row of response.result) {
                        let tr = document.createElement('tr');
                        let tdId = document.createElement('td');
                        let tdIsInGroup = document.createElement('td');
                        tdId.innerHTML = row.playerId;
                        const checkboxWrapper = document.createElement('div');
                        const checkboxInput = document.createElement('input');
                        const checkboxLabel = document.createElement('label');
                        checkboxInput.type = 'checkbox';
                        checkboxInput.checked = row.playerInGroup;
                        checkboxLabel.addEventListener('click', () => addOrRemovePlayerFromGroup(checkboxInput, id, row.playerId));
                        checkboxInput.id = `player-${row.playerId}`;
                        checkboxLabel.htmlFor = `player-${row.playerId}`;
                        checkboxWrapper.style.alignSelf = 'center';
                        checkboxWrapper.appendChild(checkboxInput);
                        checkboxWrapper.appendChild(checkboxLabel);
                        tdIsInGroup.appendChild(checkboxWrapper);
                        tr.dataset.id = row.playerId;
                        tr.appendChild(tdId);
                        tr.appendChild(tdIsInGroup);
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

    const searchPlayersBySubstring = (term, callback) => {
        let actions = $$(`#players-player-players-table-wrapper`);
        if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
            actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
        }
        let body = document.createElement('tbody');

        trigger('comm/player/getPlayerBySubstring', {
            body: {
                partialPlayerIdOrName: term,
                portalId: portalIdSelected
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    for (let row of response.result) {
                        let tr = document.createElement('tr');
                        let td = document.createElement('td');
                        td.innerHTML = row.name;
                        tr.dataset.id = row.id;
                        tr.onclick = function () { callback(row.id, row.name, td) };
                        tr.appendChild(td);
                        body.appendChild(tr);
                    }
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

    const playerFlagChanged = (event) => {
        if (!event.target.checked) {
            updatePlayerFlagsAndDisabledStatus({ interesting: false, suspicious: false, disabled: false, test: false, wasDisabled: playerDataFlagDisable.checked });
            return;
        }

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
            trigger('comm/player/EnableOrDisable', {
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
        trigger('comm/player/setPlayerFlags', {
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

    let playerCriteriaPopup = function () {
        let modal = $$('#players-player-criteria-form');
        let cancelButton = $$('#players-player-criteria-main-form-cancel');
        let tableWrapper = $$('#players-player-criteria-main-criteria-table-wrapper');
        let playerIdPlaceholder = $$('#players-player-criteria-main-info-player-id');
        let similarityPlaceholder = $$('#players-player-criteria-main-info-similarity');

        const show = (groupId) => {
            trigger('comm/playerGroups/getSuggestedGroupForPlayer', {
                body: {
                    playerGroupId: groupId,
                    playerId: playerIdSelected
                },
                success: function (response) {
                    if (response.responseCode === message.codes.success) {
                        if (!response.result) {
                            trigger('message', message.codes.noData);
                            return;
                        }
                        populateCriteria(response.result);
                        modal.classList.add('show');
                        showPopup('player');
                    } else {
                        trigger('message', response.responseCode);
                    }
                },
                fail: function (response) {
                    trigger('message', response.responseCode);
                }
            });

        };

        const hide = () => {
            modal.classList.remove('show');
            hidePopup('player');
        };

        const populateCriteria = (data) => {
            playerIdPlaceholder.innerHTML = `Player Id: ${data.playerId}`;
            similarityPlaceholder.innerHTML = `Similarity: ${data.averageSimilarityOfCriteria}%`;
            tableWrapper.innerHTML = '';
            tableWrapper.appendChild(table.generate({
                data: data.criteria,
                id: 'playerCriteriaData',
                dynamic: false,
                sticky: true,
                stickyCol: true,
            }));
            table.preserveHeight(tableWrapper);
        };

        cancelButton.addEventListener('click', hide);

        return {
            show: show,
            hide: hide
        }
    }();

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
            trigger('comm/player/getTransactions', {
                body: {
                    fromTime: playerTransactionFrom,
                    toTime: playerTransactionTo,
                    playerId: playerIdSelected
                },
                success: function (response) {
                    tableWrapper.innerHTML = '';
                    if (response.responseCode === message.codes.success) {
                        if (response.result.length === 0) {
                            trigger('message', message.codes.noData);
                            return;
                        }
                        tableWrapper.appendChild(table.generate({
                            data: response.result,
                            id: 'playerTransactionData',
                            dynamic: false,
                            sticky: true,
                            stickyCol: true,
                        }));
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
        let tableWrapper = $$('#players-player-unresolved-wins-specific-game-wrapper');
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
            trigger('comm/player/getUnresolvedWins', {
                body: {
                    caption: playerNameSelected,
                    gameId: gameId,
                    playerId: playerIdSelected
                },
                success: function (response) {
                    if (response.responseCode === message.codes.success) {
                        if (response.result.length === 0) {
                            removeLoader(loaderElement);
                            trigger('message', message.codes.noData);
                            return;
                        }
                        populateTable(response.result);
                        modal.classList.add('show');
                        removeLoader(loaderElement);
                    }
                    else {
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
            for (let element of data) {
                let resolveButton = document.createElement('button');
                resolveButton.id = `${element.caption}-${element.gameRoundId}`;
                resolveButton.innerHTML = 'Resolve';
                element['Resolve'] = resolveButton.outerHTML;
            }
            tableWrapper.innerHTML = '';
            tableWrapper.appendChild(table.generate({
                data: data,
                id: 'playerUnresolvedWinsData',
                dynamic: false,
                sticky: true,
                stickyCol: true,
            }));

            for (let element of data) {
                $$(`#${element.caption}-${element.gameRoundId}`).onclick = () => {
                    addLoader($$(`#${element.caption}-${element.gameRoundId}`));
                    trigger('comm/player/resolveUnresolvedWins', {
                        body: {
                            gameRoundId: element.gameRoundId,
                            playerId: playerIdSelected,
                            gameId: gameId,
                        },
                        success: function (response) {
                            if (response.responseCode === message.codes.success) {
                                $$(`#${element.caption}-${element.gameRoundId}`).innerHTML = 'Resolved';
                                $$(`#${element.caption}-${element.gameRoundId}`).classList.add('save');
                                $$(`#${element.caption}-${element.gameRoundId}`).disabled = true;
                            }
                            else {
                                trigger('message', response.responseCode);
                            }
                            removeLoader($$(`#${element.caption}-${element.gameRoundId}`));
                        },
                        fail: function (response) {
                            trigger('message', response.responseCode);
                            removeLoader($$(`#${element.caption}-${element.gameRoundId}`));
                        }
                    });
                }
            }
        };

        backButton.addEventListener('click', hide);

        return {
            show: show,
            hide: hide,
        }
    }();

    let playerHistoryPopup = function () {
        let modal = $$('#players-player-history-form');
        let cancelButton = $$('#players-player-history-main-form-cancel');
        let listWrapper = $$('#players-player-history-main-wrapper');

        const show = () => {
            getGames();
        };

        const hide = () => {
            modal.classList.remove('show');
            hidePopup('player');
        };

        const getGames = () => {
            addLoader(playerSummaryHistoryButton);
            trigger('comm/currency/getGames', {
                success: function (response) {
                    if (response.responseCode === message.codes.success) {
                        populateGameTable(response.result);
                        modal.classList.add('show');
                        showPopup('player');
                        removeLoader(playerSummaryHistoryButton);
                    }
                    else {
                        trigger('message', response.responseCode);
                        removeLoader(playerSummaryHistoryButton);
                    }
                },
                fail: function (response) {
                    trigger('message', response.responseCode);
                    removeLoader(playerSummaryHistoryButton);
                }
            });
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
                tr.onclick = function () { playerGameHistoryPopup.show(row.id, td) };
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

    let playerGameHistoryPopup = function () {
        let modal = $$('#players-player-game-history-form');
        let backButton = $$('#players-player-game-history-form-back');
        let iframeWrapper = $$('#players-player-game-history-iframe-wrapper');
        let getButton = $$('#players-player-game-history-get');
        let vipRouletteIdWrapper = $$('#players-player-game-history-roulette-id-wrapper');
        let historyDate = getToday();
        let gameId = undefined;
        let loaderElement = undefined;
        let vipRouletteId = 0;
        let rouletteGameIds = [16, 22, 25, 26, 53, 56];

        const show = (id, element) => {
            gameId = id;
            loaderElement = element;
            if (iframeWrapper.children.length > 0) {
                iframeWrapper.children[0].remove();
            }
            vipRouletteIdWrapper.classList.add('hidden');
            if (rouletteGameIds.includes(gameId)) {
                populateVipRouletteDropdown();
            }
            else {
                modal.classList.add('show');
            }
        };

        const hide = () => {
            modal.classList.remove('show');
        };

        const getHistory = () => {
            vipRouletteId = $$(`#players-player-game-history-roulette-id-list`) ? $$(`#players-player-game-history-roulette-id-list`).getSelected() || 0 : 0;
            if (isNaN(vipRouletteId)) {
                trigger('message', message.codes.badParameter);
                return;
            }

            let selectedDate = new Date(historyDate).toLocaleDateString();
            let selectedTime = new Date(historyDate).toLocaleTimeString();
            let offset = new Date(historyDate).getTimezoneOffset();
            let h = Math.floor(Math.abs(offset) / 60);
            let m = Math.abs(offset) % 60;
            h = h < 10 ? '0' + h : h;
            m = m < 10 ? '0' + m : m;
            let timezone = offset < 0 ? `-${h}:${m}` : `+${h}:${m}`;
            trigger('comm/player/getHistory', {
                body: {
                    date: `${selectedDate} ${selectedTime.slice(0, selectedTime.search(' '))} ${timezone}`,
                    gameId: gameId,
                    liveRouletteID: vipRouletteId,
                    playerId: playerIdSelected
                },
                success: function (response) {
                    if (response.responseCode === message.codes.success) {
                        if (iframeWrapper.children.length > 0) {
                            iframeWrapper.children[0].remove();
                        }
                        let historyElement = document.createElement('iframe');
                        historyElement.id = 'history';
                        historyElement.name = 'history';
                        historyElement.style.top = '0';
                        historyElement.style.left = '0';
                        historyElement.style.width = '100.1%';
                        historyElement.style.height = '100%';
                        historyElement.style.position = 'absoulute';
                        historyElement.style.border = 'none';
                        historyElement.src = `../vendor/history/index.html?gameId=${gameId}&liveRouletteID=${vipRouletteId}&language=ENG&selectedDate=${selectedDate}`;
                        iframeWrapper.appendChild(historyElement);
                        historyElement.onload = () => {
                            historyElement.contentWindow.postMessage(response.result, '*');
                        };
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

        const populateVipRouletteDropdown = () => {
            addLoader(loaderElement);
            trigger('comm/player/getRouletteIds', {
                body: {
                    id: gameId
                },
                success: function (response) {
                    if (response.responseCode === message.codes.success) {
                        clearElement($$(`#players-player-game-history-roulette-id-list`));
                        let rouletteIdsDropdown = dropdown.generate(response.result, `players-player-game-history-roulette-id-list`, 'Select roulette id');
                        vipRouletteIdWrapper.appendChild(rouletteIdsDropdown);
                        if (!response.result) vipRouletteIdWrapper.style.display = 'none';
                        vipRouletteIdWrapper.classList.remove('hidden');
                        removeLoader(loaderElement);
                        modal.classList.add('show');
                    }
                    else {
                        removeLoader(loaderElement);
                        trigger('message', response.responseCode);
                    }
                },
                fail: function (response) {
                    removeLoader(loaderElement);
                    trigger('message', response.responseCode);
                }
            });
        };

        backButton.addEventListener('click', hide);
        getButton.addEventListener('click', getHistory);
        on('date/players-player-game-history-date', function (data) {
            historyDate = data;
        });

        return {
            show: show,
            hide: hide
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
        $$('#players-player-data-periods-list-wrapper').style.pointerEvents = 'none';
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
        $$('#players-player-data-periods-list-wrapper').style.pointerEvents = 'auto';
    };

    const parsePlayersMainData = (data, parameterYesterday, firstColName) => {
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

        let keys = Object.keys(data); //players id
        let rowKeys = Object.keys(data[keys[0]]); //CHANGE,today,yesterday...
        let rowKeys1 = Object.keys(data[keys[0]][rowKeys[0]]); //bet,win,ggr...
        let tableData = [];

        for (let key of keys) {
            let row = {};
            row[firstColName] = key;
            for (let rowKey of rowKeys) {
                for (let fieldKey of rowKeys1) {
                    row[fieldKey] = data[key][`Change`][fieldKey];
                }
            }
            tableData.push(row);
        }
        return tableData;
    };
    const checkIfAllObjEmpty = (data) => {
        let keys = Object.keys(data); //players id
        let nmbOfNullData = 0
        let nmbKeys = 0

        for (let rowkey of keys) {
            nmbKeys++
            if (isEmpty(data[rowkey])) {
                nmbOfNullData++
            }
        }
        if (nmbKeys === nmbOfNullData) {
            return true
        }
        return false
    }

    const showPopUpInterestingPlayersTable = (rowData) => {
        let playerId = rowData.Player;
        let popUpData = interestingPlayersData[playerId];
        mainForm.show(parsePlayersMainData(popUpData, false, `Activity`));
        $$('#players-main-popup-header').innerHTML = 'Player';
        $$('#players-main-title-id-player').innerHTML = playerId;

    }
    const showPopUpLatestPlayersTable = (rowData) => {
        let playerId = rowData.Player;
        let popUpData = latestPlayersData[playerId];
        mainForm.show(parsePlayersMainData(popUpData, false, `Activity`));
        $$('#players-main-popup-header').innerHTML = 'Player';
        $$('#players-main-title-id-player').innerHTML = playerId;

    }
    const showPopUpPlayersGroupsTable = (rowData) => {
        let playerId = rowData.PlayerGroup;
        let popUpData = playersGroupsData[playerId];
        mainForm.show(parsePlayersMainData(popUpData, false, `Activity`));
        $$('#players-main-popup-header').innerHTML = 'Player Group';
        $$('#players-main-title-id-player').innerHTML = playerId;
    }

    const isEmpty = (obj) => {
        return Object.keys(obj).length === 0;
    }

    const getPlayers = () => {
        if (!$$('#players-main-portals-list').getSelected()) {
            $$('#players-main-settings-wrapper').style.display = 'none'
            trigger('message', message.codes.badParameter);
            return
        }

        addLoader(getPlayersButton);
        let portalId = $$('#players-main-portals-list').getSelected();
        trigger('comm/players/getPlayersForPortal', {
            body: {
                id: portalId
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {

                    if (checkIfAllObjEmpty(response.result) === true) {
                        trigger('message', message.codes.noData);
                        $$('#players-main-settings-wrapper').style.display = 'none'
                        return
                    }
                    $$('#players-main-settings-wrapper').style.display = 'flex'

                    interestingPlayersData = response.result.interestingPlayers;
                    $$('#interestingPlayersTable').innerHTML = '';
                    $$('#interestingPlayersTable').appendChild(table.generate({
                        data: parseData(interestingPlayersData, `Player`),
                        id: 'interestingPlayersData',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true,
                        options: {
                            onClick: showPopUpInterestingPlayersTable
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
                            onClick: showPopUpLatestPlayersTable
                        }
                    }))
                    table.preserveHeight($$('#latestPlayersTable'));
                    if (isEmpty(latestPlayersData) === true) {
                        $$(`#players-latest-players-title`).style.display = 'none';

                    } else {
                        $$(`#players-latest-players-title`).style.display = 'block';
                    }


                    playersGroupsData = response.result.playersGroups;
                    $$('#PlayersGroupsTable').innerHTML = '';
                    $$('#PlayersGroupsTable').appendChild(table.generate({
                        data: parseData(playersGroupsData, `PlayerGroup`),
                        id: 'playersGroupsData',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true,
                        options: {
                            onClick: showPopUpPlayersGroupsTable
                        }
                    }))
                    table.preserveHeight($$('#PlayersGroupsTable'));
                    if (isEmpty(playersGroupsData) === true) {
                        $$(`#players-players-groups-title`).style.display = 'none';

                    } else {
                        $$(`#players-players-groups-title`).style.display = 'block';
                    }

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


                    if (isEmpty(largestBetsData) === true) {
                        $$(`#players-winners-losers-title`).style.display = 'none';
                    } else {
                        $$(`#players-winners-losers-title`).style.display = 'block';
                    }
                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader(getPlayersButton);
            },
            fail: function (response) {
                trigger('message', response.responseCode);
                removeLoader(getPlayersButton);
            }
        });
    }

    on('players/main/loaded', function () {
        getPlayersButton.classList.add('hidden');
        $$('#players-main-settings-wrapper').style.display = 'none'
        clearElement($$(`#players-main-portals-list`));
        afterLoad(`main`);
    });

    on('players/main/unloaded', function () {
        mainForm.hide();
    });

    on('players/groups/loaded', function () {
        getGroupsButton.classList.add('hidden');
        groupsSearchWrapper.classList.add('hidden');
        groupsListWrapper.classList.add('hidden');
        groupsDataWrapper.classList.add('hidden');
        groupsPeriodWrapper.classList.add('hidden');
        groupsSearchListWrapper.classList.remove('shrink');
        clearElement($$(`#players-groups-portals-list`));
        afterLoad('groups');
    });

    on('players/player/loaded', function () {
        getPlayerButton.classList.add('hidden');
        playersSearchWrapper.classList.add('hidden');
        playersSearchWrapper.classList.add('hidden');
        playersListWrapper.classList.add('hidden');
        playerDataWrapper.classList.add('hidden');
        playerPeriodWrapper.classList.add('hidden');
        playersSearchListWrapper.classList.remove('shrink');
        clearElement($$(`#players-player-portals-list`));
        clearPlayerFlags();
        afterLoad(`player`);
    });

    on('players/player/unloaded', function () {
        playerJackpotPopup.hide();
        playerTransactionPopup.hide();
        playerUnresolvedWinsPopup.hide();
        playerUnresolvedPopup.hide();
        playerGameHistoryPopup.hide();
        playerHistoryPopup.hide();
    });

    playerDataFlagInteresting.addEventListener('click', playerFlagChanged);
    playerDataFlagSuspicious.addEventListener('click', playerFlagChanged);
    playerDataFlagDisable.addEventListener('click', playerFlagChanged);
    playerDataFlagTest.addEventListener('click', playerFlagChanged);
    getPlayerButton.addEventListener('click', getPlayer);
    getGroupsButton.addEventListener('click', getPlayerGroups);
    getPlayersButton.addEventListener('click', getPlayers);
}();
