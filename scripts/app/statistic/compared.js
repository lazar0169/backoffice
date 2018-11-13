let statisticCompared = function () {
    let selectedOperator;
    let statisticFromDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let statisticToDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let comparedButton = $$('#statistic-get-compared');
    let comparedTableWrapper = $$('#statistic-compared-table');

    on('statistic-compared-time-span/selected', function (value) {
        if (value !== 'custom') {
            $$('#statistic-compared-time-span-from').classList.add('disabled');
            $$('#statistic-compared-time-span-to').classList.add('disabled');
        } else {
            $$('#statistic-compared-time-span-from').classList.remove('disabled');
            $$('#statistic-compared-time-span-to').classList.remove('disabled');
        }
    });

    on('date/statistic-compared-time-span-from', function (data) {
        statisticFromDate = data;
    });
    on('date/statistic-compared-time-span-to', function (data) {
        statisticToDate = data;
    });

    on('statistic/compared/loaded', function () {
        clearElement($$('#statistic-compared-categories'));
        clearElement($$('#statistic-compared-operators'));
        clearElement($$('#statistic-compared-portals'));
        comparedTableWrapper.innerHTML = '';
        comparedButton.classList.add('hidden');

        addLoader($$('#sidebar-statistic'));
        trigger('comm/statistic/game/categories/get', {
            success: function (response) {
                removeLoader($$('#sidebar-statistic'));
                if (response.responseCode === message.codes.success) {
                    insertAfter(dropdown.generate(response.result, 'statistic-compared-categories', 'Select categories', true), $$('#statistic-compared-time-span-to'));
                    setTimeout(() => {
                        getOperators();
                    }, 0);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#sidebar-statistic'));
            }
        });
    });


    function getOperators() {
        clearElement($$('#statistic-compared-operators'));
        addLoader($$('#sidebar-statistic'));
        trigger('comm/statistic/operators/get', {
            success: function (response) {
                removeLoader($$('#sidebar-statistic'));
                if (response.responseCode === message.codes.success) {
                    insertAfter(dropdown.generate(response.result, 'statistic-compared-operators', 'Select operator'), $$('#statistic-compared-categories'));
                    on('statistic-compared-operators/selected', function (value) {
                        selectedOperator = value;
                        getPortals(value);
                        log(value);
                    });
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#sidebar-statistic'));
            }
        });
    }

    function getPortals(id) {
        clearElement($$('#statistic-compared-portals'));
        addLoader($$('#statistic-compared-filter'));
        trigger('comm/statistic/portals/get', {
            body: {
                id: id
            },
            success: function (response) {
                removeLoader($$('#statistic-compared-filter'));
                if (response.responseCode === message.codes.success) {
                    insertAfter(dropdown.generate(response.result, 'statistic-compared-portals', 'Select portals', true), $$('#statistic-compared-operators'));
                    comparedButton.classList.remove('hidden');
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#statistic-compared-filter'));
            }
        });
    }

    function getStatistic() {
        let data = {
            gameCategoryIds: [],
            operatorId: 0,
            portalIds: [],
            currencyId: 0,
            viewInterval: 0,
            searchInterval: "string",
            fromDate: "2018-10-29T11:44:24.538Z",
            toDate: "2018-10-29T11:44:24.538Z"
        };

        data.gameCategoryIds = $$('#statistic-compared-categories').getSelected();
        data.operatorId = selectedOperator;
        data.portalIds = $$('#statistic-compared-portals').getSelected();
        data.currencyId = currency.get().id;
        data.viewInterval = $$('#statistic-compared-time-interval').getSelected();
        data.searchInterval = $$('#statistic-compared-time-span').getSelected() || 'custom';
        data.fromDate = statisticFromDate;
        data.toDate = statisticToDate;

        comparedTableWrapper.innerHTML = '';

        addLoader(comparedButton);
        trigger('comm/statistic/games/compered/get', {
            body: data,
            success: function (response) {
                removeLoader(comparedButton);
                if (response.responseCode === message.codes.success) {
                    let tables = parseData(response.result);

                    let headerBet = document.createElement('div');
                    let headerWin = document.createElement('div');
                    let headerRounds = document.createElement('div');
                    let headerPayout = document.createElement('div');

                    let hiddenBet = {};
                    let hiddenWin = {};
                    let hiddenRounds = {};
                    let hiddenPayout = {};

                    headerBet.className = 'compared-header';
                    headerWin.className = 'compared-header';
                    headerRounds.className = 'compared-header';
                    headerPayout.className = 'compared-header';

                    headerBet.innerHTML = '<h2>Games Bet:</h2> <div id="compared-disabled-games-bet" class="header-games-list"></div>';
                    headerWin.innerHTML = '<h2>Games Win:</h2> <div id="compared-disabled-games-win" class="header-games-list"></div>';
                    headerRounds.innerHTML = '<h2>Table Rounds:</h2> <div id="compared-disabled-games-rounds" class="header-games-list"></div>';
                    headerPayout.innerHTML = '<h2>Table Payout:</h2> <div id="compared-disabled-games-payout" class="header-games-list"></div>';

                    comparedTableWrapper.innerHTML = `<h2>Operator: ${response.result.operater}<br>Period: ${response.result.resultForPeriod}</h2?`;

                    let tableBet = table.generate({
                        data: tables.gamesBet,
                        id: 'statistic-compared-table-bet',
                        dynamic: true,
                        sticky: true
                    });
                    let tableWin = table.generate({
                        data: tables.gamesWin,
                        id: 'statistic-compared-table-win',
                        dynamic: true,
                        sticky: true
                    });
                    let tableRounds = table.generate({
                        data: tables.gamesRounds,
                        id: 'statistic-compared-table-rounds',
                        dynamic: true,
                        sticky: true
                    });
                    let tablePayout = table.generate({
                        data: tables.gamesPayout,
                        id: 'statistic-compared-table-payout',
                        dynamic: true,
                        sticky: true
                    });

                    comparedTableWrapper.appendChild(headerBet);
                    comparedTableWrapper.appendChild(tableBet);
                    comparedTableWrapper.appendChild(headerWin);
                    comparedTableWrapper.appendChild(tableWin);
                    comparedTableWrapper.appendChild(headerRounds);
                    comparedTableWrapper.appendChild(tableRounds);
                    comparedTableWrapper.appendChild(headerPayout);
                    comparedTableWrapper.appendChild(tablePayout);

                    tableBet.onChange = function () {
                        hiddenBet = tableBet.getHiddenCols();
                        $$('#compared-disabled-games-bet').innerHTML = '';
                        for (let col in hiddenBet) {
                            let button = document.createElement('button');
                            button.className = 'config';
                            button.innerHTML = col;
                            button.onclick = function () {
                                tableBet.showCol(col);
                            }
                            $$('#compared-disabled-games-bet').appendChild(button);
                        }
                    };
                    tableWin.onChange = function () {
                        hiddenWin = tableWin.getHiddenCols();
                        $$('#compared-disabled-games-win').innerHTML = '';
                        for (let col in hiddenWin) {
                            let button = document.createElement('button');
                            button.className = 'config';
                            button.innerHTML = col;
                            button.onclick = function () {
                                tableWin.showCol(col);
                            }
                            $$('#compared-disabled-games-win').appendChild(button);
                        }
                    };
                    tableRounds.onChange = function () {
                        hiddenRounds = tableRounds.getHiddenCols();
                        $$('#compared-disabled-games-rounds').innerHTML = '';
                        for (let col in hiddenRounds) {
                            let button = document.createElement('button');
                            button.className = 'config';
                            button.innerHTML = col;
                            button.onclick = function () {
                                tableRounds.showCol(col);
                            }
                            $$('#compared-disabled-games-rounds').appendChild(button);
                        }
                    };
                    tablePayout.onChange = function () {
                        hiddenPayout = tablePayout.getHiddenCols();
                        $$('#compared-disabled-games-payout').innerHTML = '';
                        for (let col in hiddenPayout) {
                            let button = document.createElement('button');
                            button.className = 'config';
                            button.innerHTML = col;
                            button.onclick = function () {
                                tablePayout.showCol(col);
                            }
                            $$('#compared-disabled-games-payout').appendChild(button);
                        }
                    };

                    for (let i = 4; i < tableBet.getElementsByClassName('remove-btn').length; i++) {
                        tableBet.getElementsByClassName('remove-btn')[i].click();
                        tableWin.getElementsByClassName('remove-btn')[i].click();
                        tableRounds.getElementsByClassName('remove-btn')[i].click();
                        tablePayout.getElementsByClassName('remove-btn')[i].click();
                    }


                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader(comparedButton);
            }
        });
    }

    function parseData(result) {
        let tables = {
            gamesBet: [],
            gamesWin: [],
            gamesRounds: [],
            gamesPayout: []
        };

        for (let i = 0; i < result.period.length; i++) {
            let gamesBetRow = { period: result.period[i] };
            let gamesWinRow = { period: result.period[i] };
            let gamesRoundsRow = { period: result.period[i] };
            let gamesPayoutRow = { period: result.period[i] };
            for (let j = 0; j < Object.keys(result.gamesBet).length; j++) {
                gamesBetRow[Object.keys(result.gamesBet)[j]] = result.gamesBet[Object.keys(result.gamesBet)[j]][i];
                gamesWinRow[Object.keys(result.gamesWin)[j]] = result.gamesWin[Object.keys(result.gamesWin)[j]][i];
                gamesRoundsRow[Object.keys(result.gamesRounds)[j]] = result.gamesRounds[Object.keys(result.gamesRounds)[j]][i];
                gamesPayoutRow[Object.keys(result.gamesPayout)[j]] = result.gamesPayout[Object.keys(result.gamesPayout)[j]][i];
            }
            tables.gamesBet.push(gamesBetRow);
            tables.gamesWin.push(gamesWinRow);
            tables.gamesRounds.push(gamesRoundsRow);
            tables.gamesPayout.push(gamesPayoutRow);
        }
        return tables;
    }

    comparedButton.addEventListener('click', getStatistic);
}();