let statisticCompared = function () {
    let selectedOperator;
    let statisticFromDate = getToday();
    let statisticToDate = getToday();
    let comparedButton = $$('#statistic-get-compared');
    let comparedTableWrapper = $$('#statistic-compared-table');
    let comparedHeader = $$('#statistic-compared-header');
    let requested = false;

    let defaultSelectionValue = 'LastMonth';

    on('statistic-compared-time-span/selected', function (value) {
        if (value !== 'custom') {
            $$('#statistic-compared-fieldset').classList.add('disabled');
        } else {
            $$('#statistic-compared-fieldset').classList.remove('disabled');
        }
        let firstAvailable = filterPeriod($$('#statistic-compared-time-interval'), value);

        // Select first available period
        $$('#statistic-compared-time-interval').select(firstAvailable.value);
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
        $$('#statistic-compared-time-span-from').reset();
        $$('#statistic-compared-time-span-to').reset();
        comparedTableWrapper.innerHTML = '';
        comparedHeader.innerHTML = '';
        comparedButton.classList.add('hidden');
        requested = false;

        addLoader($$('#sidebar-statistic'));
        trigger('comm/statistic/game/categories/get', {
            success: function (response) {
                removeLoader($$('#sidebar-statistic'));
                if (response.responseCode === message.codes.success) {
                    insertAfter(dropdown.generate(response.result, 'statistic-compared-categories', 'Select categories', true), $$('#statistic-compared-fieldset'));
                    getOperators();
                    selectDefault();
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#sidebar-statistic'));
            }
        });
    });

    on('currency/statistic', function () {
        if (requested) getStatistic();
    });

    function selectDefault() {
        // Default time stamp selection
        let options = $$('#statistic-compared-time-span').select(defaultSelectionValue);
    }

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
            gameCategoryIds: $$('#statistic-compared-categories').getSelected(),
            operatorId: selectedOperator,
            portalIds: $$('#statistic-compared-portals').getSelected(),
            currencyId: currency.get().id,
            viewInterval: $$('#statistic-compared-time-interval').getSelected(),
            searchInterval: $$('#statistic-compared-time-span').getSelected() || 'custom',
            fromDate: statisticFromDate,
            toDate: statisticToDate
        };

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

                    comparedHeader.innerHTML = `Operator: ${response.result.operator}<br>Period: ${response.result.resultForPeriod}`;
                    comparedHeader.style.display = 'block';

                    let tableBet = table.generate({
                        data: tables.gamesBet,
                        id: 'statistic-compared-table-bet',
                        dynamic: true,
                        sticky: true,
                        stickyCol: true
                    });
                    let tableWin = table.generate({
                        data: tables.gamesWin,
                        id: 'statistic-compared-table-win',
                        dynamic: true,
                        sticky: true,
                        stickyCol: true
                    });
                    let tableRounds = table.generate({
                        data: tables.gamesRounds,
                        id: 'statistic-compared-table-rounds',
                        dynamic: true,
                        sticky: true,
                        stickyCol: true
                    });
                    let tablePayout = table.generate({
                        data: tables.gamesPayout,
                        id: 'statistic-compared-table-payout',
                        dynamic: true,
                        sticky: true,
                        stickyCol: true
                    });

                    comparedTableWrapper.appendChild(headerBet);
                    comparedTableWrapper.appendChild(tableBet);
                    comparedTableWrapper.appendChild(headerWin);
                    comparedTableWrapper.appendChild(tableWin);
                    comparedTableWrapper.appendChild(headerRounds);
                    comparedTableWrapper.appendChild(tableRounds);
                    comparedTableWrapper.appendChild(headerPayout);
                    comparedTableWrapper.appendChild(tablePayout);

                    table.preserveHeight(comparedTableWrapper);

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

                    for (let i = 6; i < tableBet.getElementsByClassName('remove-btn').length; i++) {
                        tableBet.getElementsByClassName('remove-btn')[i].click();
                        tableWin.getElementsByClassName('remove-btn')[i].click();
                        tableRounds.getElementsByClassName('remove-btn')[i].click();
                        tablePayout.getElementsByClassName('remove-btn')[i].click();
                    }

                    requested = true;

                } else {
                    comparedHeader.style.display = 'none';
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