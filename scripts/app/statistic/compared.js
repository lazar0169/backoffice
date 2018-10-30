let statisticCompared = function () {
    let selectedOperator;
    let statisticFromDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let statisticToDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let comparedButton = $$('#statistic-get-compared');
    let comparedTableWrapper = $$('#statistic-compared-table');

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
                    getOperators();
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

                    let headerBet = document.createElement('h2');
                    let headerWin = document.createElement('h2');
                    let headerRounds = document.createElement('h2');
                    let headerPayout = document.createElement('h2');
                    headerBet.innerHTML = 'Games Bet:';
                    headerWin.innerHTML = 'Games Win:';
                    headerRounds.innerHTML = 'Table Rounds:';
                    headerPayout.innerHTML = 'Table Payout:';

                    comparedTableWrapper.innerHTML = `<h2>Operator: ${response.result.operater}<br>Period: ${response.result.resultForPeriod}</h2?`;

                    comparedTableWrapper.appendChild(headerBet);
                    comparedTableWrapper.appendChild(table.generate(tables.gamesBet, 'statistic-compared-table-bet', true, true));
                    comparedTableWrapper.appendChild(headerWin);
                    comparedTableWrapper.appendChild(table.generate(tables.gamesWin, 'statistic-compared-table-win', true, true));
                    comparedTableWrapper.appendChild(headerRounds);
                    comparedTableWrapper.appendChild(table.generate(tables.gamesRounds, 'statistic-compared-table-rounds', true, true));
                    comparedTableWrapper.appendChild(headerPayout);
                    comparedTableWrapper.appendChild(table.generate(tables.gamesPayout, 'statistic-compared-table-payout', true, true));
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