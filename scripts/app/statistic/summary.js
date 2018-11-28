let statisticSummary = function () {
    let selectedOperator;
    let statisticFromDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let statisticToDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let summaryButton = $$('#statistic-get-summary');
    let summaryTableWrapper = $$('#statistic-summary-table');
    let summaryChartTotalBetWin = graph.generate($$('#statistic-summary-graphs').children[0], 'bar', 2);
    let summaryChartRounds = graph.generate($$('#statistic-summary-graphs').children[1], 'bar');
    let summaryChartPayout = graph.generate($$('#statistic-summary-graphs').children[2], 'bar');
    let requested = false;

    on('statistic-summary-time-span/selected', function (value) {
        if (value !== 'custom') {
            $$('#statistic-summary-time-span-from').classList.add('disabled');
            $$('#statistic-summary-time-span-to').classList.add('disabled');
        } else {
            $$('#statistic-summary-time-span-from').classList.remove('disabled');
            $$('#statistic-summary-time-span-to').classList.remove('disabled');
        }
    });

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
        requested = false;

        addLoader($$('#sidebar-statistic'));
        trigger('comm/statistic/game/categories/get', {
            success: function (response) {
                removeLoader($$('#sidebar-statistic'));
                if (response.responseCode === message.codes.success) {
                    insertAfter(dropdown.generate(response.result, 'statistic-summary-categories', 'Select categories', true), $$('#statistic-summary-time-span-to'));
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

    on('currency/statistic', function () {
        if (requested) getStatistic();
    });

    function getOperators() {
        clearElement($$('#statistic-summary-operators'));
        addLoader($$('#sidebar-statistic'));
        trigger('comm/statistic/operators/get', {
            success: function (response) {
                removeLoader($$('#sidebar-statistic'));
                if (response.responseCode === message.codes.success) {
                    insertAfter(dropdown.generate(response.result, 'statistic-summary-operators', 'Select operator'), $$('#statistic-summary-categories'));
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
                    insertAfter(dropdown.generate(response.result, 'statistic-summary-portals', 'Select portals', true), $$('#statistic-summary-operators'));
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
            gameCategoryIds: $$('#statistic-summary-categories').getSelected(),
            operatorId: selectedOperator,
            portalIds: $$('#statistic-summary-portals').getSelected(),
            currencyId: currency.get().id,
            viewInterval: $$('#statistic-summary-time-interval').getSelected(),
            searchInterval: $$('#statistic-summary-time-span').getSelected() || 'custom',
            fromDate: statisticFromDate,
            toDate: statisticToDate
        };

        summaryTableWrapper.innerHTML = '';
        $$('#statistic-summary-graphs').classList.add('hidden');

        addLoader(summaryButton);
        trigger('comm/statistic/summary/get', {
            body: data,
            success: function (response) {
                removeLoader(summaryButton);
                if (response.responseCode === message.codes.success) {
                    let summary = JSON.parse(JSON.stringify(response.result.statisticsPerDate));
                    summary.push(response.result.sum);
                    summaryTableWrapper.appendChild(table.generate({
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

                    // summaryChartTotalBetWin.options.legend.dispay = !isMobile;
                    // summaryChartRounds.options.legend.dispay = !isMobile;
                    // summaryChartPayout.options.legend.dispay = !isMobile;

                    $$('#statistic-summary-graphs').style.display = isMobile ? 'none' : 'block';

                    summaryChartTotalBetWin.options.legend.position = 'right';
                    summaryChartRounds.options.legend.position = 'right';
                    summaryChartPayout.options.legend.position = 'right';

                    summaryChartTotalBetWin.data.datasets[0].data = totalBetData;
                    summaryChartTotalBetWin.data.datasets[0].label = 'Total Bet';
                    summaryChartTotalBetWin.data.datasets[1].data = totalWinData;
                    summaryChartTotalBetWin.data.datasets[1].label = 'Total Win';
                    summaryChartTotalBetWin.data.labels = labels;
                    summaryChartTotalBetWin.update();

                    summaryChartRounds.data.datasets[0].data = roundsData;
                    summaryChartRounds.data.datasets[0].label = 'Rounds';
                    summaryChartRounds.data.labels = labels;
                    summaryChartRounds.update();

                    summaryChartPayout.data.datasets[0].data = payoutData;
                    summaryChartPayout.data.datasets[0].label = 'Payout';
                    summaryChartPayout.data.labels = labels;
                    summaryChartPayout.update();

                    $$('#statistic-summary-graphs').classList.remove('hidden');
                    requested = true;
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