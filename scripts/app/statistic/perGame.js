let statisticPerGame = function () {
    let selectedOperator;
    let selectedGameId;
    let statisticFromDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let statisticToDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let perGameButton = $$('#statistic-get-per-game');
    let perGameTableWrapper = $$('#statistic-per-game-table');
    let getGamesEvent;
    let requested = false;

    on('statistic-per-game-time-span/selected', function (value) {
        if (value !== 'custom') {
            $$('#statistic-per-game-time-span-from').classList.add('disabled');
            $$('#statistic-per-game-time-span-to').classList.add('disabled');
        } else {
            $$('#statistic-per-game-time-span-from').classList.remove('disabled');
            $$('#statistic-per-game-time-span-to').classList.remove('disabled');
        }
        filterPeriod($$('#statistic-per-game-time-interval'), value);
    });

    on('date/statistic-per-game-time-span-from', function (data) {
        statisticFromDate = data;
    });
    on('date/statistic-per-game-time-span-to', function (data) {
        statisticToDate = data;
    });

    on('statistic/per-game-selection/loaded', function () {
        clearElement($$('#statistic-per-game-categories'));
        clearElement($$('#statistic-per-game-operators'));
        clearElement($$('#statistic-per-game-portals'));
        perGameTableWrapper.innerHTML = '';
        perGameButton.classList.add('hidden');
        requested = false;

        addLoader($$('#sidebar-statistic'));
        trigger('comm/statistic/game/categories/get', {
            success: function (response) {
                removeLoader($$('#sidebar-statistic'));
                if (response.responseCode === message.codes.success) {
                    insertAfter(dropdown.generate(response.result, 'statistic-per-game-categories', 'Select categories', true), $$('#statistic-per-game-time-span-to'));
                    on('statistic-per-game-categories/selected', getGames);
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
        clearElement($$('#statistic-per-game-operators'));
        addLoader($$('#sidebar-statistic'));
        trigger('comm/statistic/operators/get', {
            success: function (response) {
                removeLoader($$('#sidebar-statistic'));
                if (response.responseCode === message.codes.success) {
                    insertAfter(dropdown.generate(response.result, 'statistic-per-game-operators', 'Select operater'), $$('#statistic-per-game-categories'));
                    on('statistic-per-game-operators/selected', function (value) {
                        selectedOperator = value;
                        getPortals(value);
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
        clearElement($$('#statistic-per-game-portals'));
        addLoader($$('#statistic-per-game-filter'));
        trigger('comm/statistic/portals/get', {
            body: {
                id: id
            },
            success: function (response) {
                removeLoader($$('#statistic-per-game-filter'));
                if (response.responseCode === message.codes.success) {
                    insertAfter(dropdown.generate(response.result, 'statistic-per-game-portals', 'Select portals', true), $$('#statistic-per-game-operators'));
                    on('statistic-per-game-portals/selected', getGames);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#statistic-per-game-filter'));
            }
        });
    }

    function getGames() {
        if (!$$('#statistic-per-game-categories') || !$$('#statistic-per-game-portals') || !$$('#statistic-per-game-categories').getSelected() || !$$('#statistic-per-game-portals').getSelected()) return;
        clearElement($$('#statistic-per-game-games'));
        addLoader($$('#statistic-per-game-filter'));
        trigger('comm/statistic/games/get', {
            body: {
                gameCategoryIds: $$('#statistic-per-game-categories').getSelected(),
                portalIds: $$('#statistic-per-game-portals').getSelected()
            },
            success: function (response) {
                removeLoader($$('#statistic-per-game-filter'));
                if (response.responseCode === message.codes.success) {
                    insertAfter(dropdown.generate(response.result, 'statistic-per-game-games', 'Select game'), $$('#statistic-per-game-portals'));
                    on('statistic-per-game-games/selected', function (value) {
                        selectedGameId = value;
                        perGameButton.classList.remove('hidden');
                    });
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#statistic-per-game-filter'));
            }
        });
    }

    function getStatistic() {
        let data = {
            gameCategoryIds: $$('#statistic-per-game-categories').getSelected(),
            operatorId: selectedOperator,
            portalIds: $$('#statistic-per-game-portals').getSelected(),
            currencyId: currency.get().id,
            viewInterval: $$('#statistic-per-game-time-interval').getSelected(),
            searchInterval: $$('#statistic-per-game-time-span').getSelected() || 'custom',
            fromDate: statisticFromDate,
            toDate: statisticToDate,
            gameId: selectedGameId
        };

        perGameTableWrapper.innerHTML = '';

        addLoader(perGameButton);
        trigger('comm/statistic/per/game/get', {
            body: data,
            success: function (response) {
                removeLoader(perGameButton);
                if (response.responseCode === message.codes.success) {
                    let summary = JSON.parse(JSON.stringify(response.result.gameStatisticsPerDate));
                    summary.push(response.result.sum);
                    perGameTableWrapper.innerHTML = `<h2>Operator: ${response.result.operater}<br>Period: ${response.result.period}<br>Game: ${response.result.gameName}</h2?`;
                    perGameTableWrapper.appendChild(table.generate({
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
                    table.preserveHeight(perGameTableWrapper);
                    requested = true;
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader(perGameButton);
            }
        });
    }

    perGameButton.addEventListener('click', getStatistic);
}();