let statisticGamesSummary = function () {
    let selectedOperator;
    let statisticFromDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let statisticToDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let gamesSummaryButton = $$('#statistic-get-games-summary');
    let gamesSummaryTableWrapper = $$('#statistic-games-summary-table');
    let gamesSummaryChartTotalBet = graph.generate($$('#statistic-games-summary-graphs').children[0], 'line');
    let gamesSummaryChartTotalWin = graph.generate($$('#statistic-games-summary-graphs').children[1], 'line');
    let gamesSummaryChartRounds = graph.generate($$('#statistic-games-summary-graphs').children[2], 'line');
    let gamesSummaryChartPayout = graph.generate($$('#statistic-games-summary-graphs').children[3], 'line');

    on('statistic-games-summary-time-span/selected', function (value) {
        if (value !== 'custom') {
            $$('#statistic-games-summary-time-span-from').classList.add('disabled');
            $$('#statistic-games-summary-time-span-to').classList.add('disabled');
        } else {
            $$('#statistic-games-summary-time-span-from').classList.remove('disabled');
            $$('#statistic-games-summary-time-span-to').classList.remove('disabled');
        }
    });

    on('date/statistic-games-summary-time-span-from', function (data) {
        statisticFromDate = data;
    });
    on('date/statistic-games-summary-time-span-to', function (data) {
        statisticToDate = data;
    });

    on('statistic/games-summary/loaded', function () {
        clearElement($$('#statistic-games-summary-categories'));
        clearElement($$('#statistic-games-summary-operators'));
        clearElement($$('#statistic-games-summary-portals'));
        gamesSummaryTableWrapper.innerHTML = '';
        gamesSummaryButton.classList.add('hidden');
        $$('#statistic-games-summary-graphs').classList.add('hidden');

        addLoader($$('#sidebar-statistic'));
        trigger('comm/statistic/game/categories/get', {
            success: function (response) {
                removeLoader($$('#sidebar-statistic'));
                if (response.responseCode === message.codes.success) {
                    insertAfter(dropdown.generate(response.result, 'statistic-games-summary-categories', 'Select categories', true), $$('#statistic-games-summary-time-span-to'));
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
        clearElement($$('#statistic-games-summary-operators'));
        addLoader($$('#sidebar-statistic'));
        trigger('comm/statistic/operators/get', {
            success: function (response) {
                removeLoader($$('#sidebar-statistic'));
                if (response.responseCode === message.codes.success) {
                    insertAfter(dropdown.generate(response.result, 'statistic-games-summary-operators', 'Select operator'), $$('#statistic-games-summary-categories'));
                    on('statistic-games-summary-operators/selected', function (value) {
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
        clearElement($$('#statistic-games-summary-portals'));
        addLoader($$('#statistic-games-summary-filter'));
        trigger('comm/statistic/portals/get', {
            body: {
                id: id
            },
            success: function (response) {
                removeLoader($$('#statistic-games-summary-filter'));
                if (response.responseCode === message.codes.success) {
                    insertAfter(dropdown.generate(response.result, 'statistic-games-summary-portals', 'Select portals', true), $$('#statistic-games-summary-operators'));
                    gamesSummaryButton.classList.remove('hidden');
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#statistic-games-summary-filter'));
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

        data.gameCategoryIds = $$('#statistic-games-summary-categories').getSelected();
        data.operatorId = selectedOperator;
        data.portalIds = $$('#statistic-games-summary-portals').getSelected();
        data.currencyId = currency.get().id;
        data.viewInterval = $$('#statistic-games-summary-time-interval').getSelected();
        data.searchInterval = $$('#statistic-games-summary-time-span').getSelected() || 'custom';
        data.fromDate = statisticFromDate;
        data.toDate = statisticToDate;

        gamesSummaryTableWrapper.innerHTML = '';

        addLoader(gamesSummaryButton);
        trigger('comm/statistic/games/summary/get', {
            body: data,
            success: function (response) {
                removeLoader(gamesSummaryButton);
                if (response.responseCode === message.codes.success) {
                    let summary = JSON.parse(JSON.stringify(response.result.gameStatisticsPerGame));
                    summary.push(response.result.gameStatisticsSum);
                    gamesSummaryTableWrapper.appendChild(table.generate({
                        data: summary,
                        id: '',
                        dynamic: false,
                        sticky: true,
                        options: {
                            sufix: {
                                col: 'payout',
                                text: '<span style="color: yellow;float: right;">&#9888;</span>',
                                condition: /^([0-9]{3,})(\.[0-9]{0,})?$/gm
                            }
                        }
                    }));
                    table.preserveHeight(gamesSummaryTableWrapper);

                    let labels = [];
                    let games = [];
                    let totalBetData = {};
                    let totalWinData = {};
                    let roundsData = {};
                    let payoutData = {};

                    gamesSummaryChartTotalBet.data.datasets.length = 0;
                    gamesSummaryChartTotalWin.data.datasets.length = 0;
                    gamesSummaryChartRounds.data.datasets.length = 0;
                    gamesSummaryChartPayout.data.datasets.length = 0;

                    gamesSummaryChartTotalBet.options.legend.display = !isMobile;
                    gamesSummaryChartTotalWin.options.legend.display = !isMobile;
                    gamesSummaryChartRounds.options.legend.display = !isMobile;
                    gamesSummaryChartPayout.options.legend.display = !isMobile;

                    gamesSummaryChartTotalBet.options.legend.position = 'right';
                    gamesSummaryChartTotalWin.options.legend.position = 'right';
                    gamesSummaryChartRounds.options.legend.position = 'right';
                    gamesSummaryChartPayout.options.legend.position = 'right';

                    gamesSummaryChartTotalBet.options.title = { display: true, text: 'Total Bet', position: 'top', fontColor: 'white', fontFamily: 'roboto' };
                    gamesSummaryChartTotalWin.options.title = { display: true, text: 'Total Win', position: 'top', fontColor: 'white', fontFamily: 'roboto' };
                    gamesSummaryChartRounds.options.title = { display: true, text: 'Rounds', position: 'top', fontColor: 'white', fontFamily: 'roboto' };
                    gamesSummaryChartPayout.options.title = { display: true, text: 'Payout', position: 'top', fontColor: 'white', fontFamily: 'roboto' };

                    if (response.result.gameStatisticsPerGame.length !== 0) {

                        for (let row of response.result.operaterGamesStatistics[Object.keys(response.result.operaterGamesStatistics)[0]]) {
                            labels.push(row.period);
                        }

                        for (let game in response.result.operaterGamesStatistics) {
                            games.push(game);
                            totalBetData[game] = [];
                            totalWinData[game] = [];
                            roundsData[game] = [];
                            payoutData[game] = [];
                            for (let row of response.result.operaterGamesStatistics[game]) {
                                totalBetData[game].push(row.totalBet);
                                totalWinData[game].push(row.totalWin);
                                roundsData[game].push(row.rounds);
                                payoutData[game].push(row.payout);
                            }
                        }

                        for (let i = 0; i < games.length; i++) {
                            let color = generateColor();
                            gamesSummaryChartTotalBet.data.datasets.push({
                                data: totalBetData[games[i]],
                                label: games[i],
                                backgroundColor: color,
                                fontColor: 'rgba(255, 255, 255, 1)',
                                borderWidth: 2,
                                borderColor: color,
                                fill: false,
                            });
                            gamesSummaryChartTotalWin.data.datasets.push({
                                data: totalWinData[games[i]],
                                label: games[i],
                                backgroundColor: color,
                                fontColor: 'rgba(255, 255, 255, 1)',
                                borderWidth: 2,
                                borderColor: color,
                                fill: false,
                            });
                            gamesSummaryChartRounds.data.datasets.push({
                                data: roundsData[games[i]],
                                label: games[i],
                                backgroundColor: color,
                                fontColor: 'rgba(255, 255, 255, 1)',
                                borderWidth: 2,
                                borderColor: color,
                                fill: false,
                            });
                            gamesSummaryChartPayout.data.datasets.push({
                                data: payoutData[games[i]],
                                label: games[i],
                                backgroundColor: color,
                                fontColor: 'rgba(255, 255, 255, 1)',
                                borderWidth: 2,
                                borderColor: color,
                                fill: false,
                            });
                        }
                    }

                    gamesSummaryChartTotalBet.data.labels = labels;
                    gamesSummaryChartTotalWin.data.labels = labels;
                    gamesSummaryChartRounds.data.labels = labels;
                    gamesSummaryChartPayout.data.labels = labels;

                    gamesSummaryChartTotalBet.update();
                    gamesSummaryChartTotalWin.update();
                    gamesSummaryChartRounds.update();
                    gamesSummaryChartPayout.update();

                    $$('#statistic-games-summary-graphs').classList.remove('hidden');

                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader(gamesSummaryButton);
            }
        });
    }

    gamesSummaryButton.addEventListener('click', getStatistic);
}();