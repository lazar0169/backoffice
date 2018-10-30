let statisticSummary = function () {
    let selectedOperator;
    let statisticFromDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let statisticToDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let summaryButton = $$('#statistic-get-summary');
    let summaryTableWrapper = $$('#statistic-summary-table');
    let summaryChartTotalBetWin = graph.generate($$('#statistic-summary-graphs').children[0], 'bar', 2);
    let summaryChartRounds = graph.generate($$('#statistic-summary-graphs').children[1], 'bar');
    let summaryChartPayout = graph.generate($$('#statistic-summary-graphs').children[2], 'bar');

    on('date/statistic-summary-time-span-from', function (data) {
        statisticFromDate = data;
    });
    on('date/statistic-summary-time-span-to', function (data) {
        statisticToDate = data;
    });

    on('statistic/summary/loaded', function () {
        clearElement($$('#statistic-summary-categories'));
        clearElement($$('#statistic-summary-operators'));
        clearElement($$('#statistic-summary-portals'));
        summaryTableWrapper.innerHTML = '';
        summaryButton.classList.add('hidden');
        $$('#statistic-summary-graphs').classList.add('hidden');

        addLoader($$('#sidebar-statistic'));
        trigger('comm/statistic/game/categories/get', {
            success: function (response) {
                removeLoader($$('#sidebar-statistic'));
                if (response.responseCode === message.codes.success) {
                    insertAfter(dropdown.generate(response.result, 'statistic-summary-categories', 'Select category', true), $$('#statistic-summary-time-span-to'));
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
        clearElement($$('#statistic-summary-operators'));
        addLoader($$('#sidebar-statistic'));
        trigger('comm/statistic/operators/get', {
            success: function (response) {
                removeLoader($$('#sidebar-statistic'));
                if (response.responseCode === message.codes.success) {
                    insertAfter(dropdown.generate(response.result, 'statistic-summary-operators', 'Select category'), $$('#statistic-summary-categories'));
                    on('statistic-summary-operators/selected', function (value) {
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
        clearElement($$('#statistic-summary-portals'));
        addLoader($$('#statistic-summary-filter'));
        trigger('comm/statistic/portals/get', {
            body: {
                id: id
            },
            success: function (response) {
                removeLoader($$('#statistic-summary-filter'));
                if (response.responseCode === message.codes.success) {
                    insertAfter(dropdown.generate(response.result, 'statistic-portals', 'Select category', true), $$('#statistic-summary-operators'));
                    summaryButton.classList.remove('hidden');
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#statistic-summary-filter'));
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

        data.gameCategoryIds = $$('#statistic-summary-categories').getSelected();
        data.operatorId = selectedOperator;
        data.portalIds = $$('#statistic-portals').getSelected();
        data.currencyId = currency.get().id;
        data.viewInterval = $$('#statistic-summary-time-interval').getSelected();
        data.searchInterval = $$('#statistic-summary-time-span').getSelected() || 'custom';
        data.fromDate = statisticFromDate;
        data.toDate = statisticToDate;

        summaryTableWrapper.innerHTML = '';

        addLoader(summaryButton);
        trigger('comm/statistic/summary/get', {
            body: data,
            success: function (response) {
                removeLoader(summaryButton);
                if (response.responseCode === message.codes.success) {
                    let summary = JSON.parse(JSON.stringify(response.result.statisticsPerDate));
                    summary.push(response.result.sum);
                    summaryTableWrapper.appendChild(table.generate(summary, '', false, true));
                    table.preserveHeight(summaryTableWrapper);

                    let labels = [];
                    let totalBetData = [];
                    let totalWinData = [];
                    let roundsData = [];
                    let payoutData = [];

                    for (let row of response.result.statisticsPerDate) {
                        labels.push(row.period);
                        totalBetData.push(row.totalBet);
                        totalWinData.push(row.totalWin);
                        roundsData.push(row.rounds);
                        payoutData.push(row.payout);
                    }

                    summaryChartTotalBetWin.data.datasets[0].data = totalBetData;
                    summaryChartTotalBetWin.data.datasets[0].label = 'Total Bet';
                    summaryChartTotalBetWin.data.datasets[0].backgroundColor = generateColor();
                    summaryChartTotalBetWin.data.datasets[1].data = totalWinData;
                    summaryChartTotalBetWin.data.datasets[1].label = 'Total Win';
                    summaryChartTotalBetWin.data.datasets[1].backgroundColor = generateColor();
                    summaryChartTotalBetWin.data.labels = labels;
                    summaryChartTotalBetWin.update();



                    summaryChartRounds.data.datasets[0].data = roundsData;
                    summaryChartRounds.data.datasets[0].label = 'Rounds';
                    summaryChartRounds.data.labels = labels;
                    summaryChartRounds.data.datasets[0].backgroundColor = generateColor();

                    summaryChartPayout.data.datasets[0].data = payoutData;
                    summaryChartPayout.data.datasets[0].label = 'Payout';
                    summaryChartPayout.data.labels = labels;
                    summaryChartPayout.data.datasets[0].backgroundColor = generateColor();

                    $$('#statistic-summary-graphs').classList.remove('hidden');

                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader(summaryButton);
            }
        });
    }

    summaryButton.addEventListener('click', getStatistic);
}();