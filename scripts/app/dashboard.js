let dashboard = function () {
    let main = $$('#dashboard-main').children[0];
    let jackpots = $$('#dashboard-jackpots').children[0];
    let portals = $$('#dashboard-portals').children[0];
    let players = $$('#dashboard-players').children[0];
    let playersWrapper = $$('#dashboard-players-wrapper');
    let chart = new Chart($$('#dashboard-pie-chart').getContext('2d'), {
        type: 'pie',
        data: {
            datasets: [{
                data: [],
                backgroundColor: [],
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.5)",
                // hoverBackgroundColor: '#dd9853'
            }],
            labels: []
        },
        options: {
            responsive: true,
            legend: {
                position: 'right',
                labels: {
                    fontColor: 'white'
                }

            },
            title: {
                display: false,
                text: 'Number of new players',
                fontColor: 'white',
                fontSize: 24
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
    let dashboardData;

    on('dashboard/loaded', function () {
        main.innerHTML = '';
        addLoader($$('#sidebar-dashboard'));
        trigger('comm/dashboard/get', {
            success: function (response) {
                removeLoader($$('#sidebar-dashboard'));
                if (response.responseCode === message.codes.success) {
                    dashboardData = response.result;
                    main.appendChild(table.generate({
                        data: parseData(dashboardData.activities.activities),
                        id: 'dashboard-table',
                        dynamic: false,
                        sticky: true,
                        stickyCol: true
                    }));
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#sidebar-dashboard'));
            }
        });
    });

    on('dashboard/jackpots/loaded', function () {
        if (!dashboardData) return;
        jackpots.innerHTML = '';
        for (let jackpot in dashboardData.jackpots.jackpots) {
            if (dashboardData.jackpots.jackpots[jackpot].dashboardJackpots.length === 0) continue;
            let header = document.createElement('h2');
            header.innerHTML = `${transformCamelToRegular(jackpot)} Jackpot`;
            jackpots.appendChild(header);
            jackpots.appendChild(table.generate({
                data: dashboardData.jackpots.jackpots[jackpot].dashboardJackpots,
                id: `jackpot-${jackpot}-table`,
                dynamic: false,
                sticky: true
            }));
        }
        table.preserveHeight(jackpots);
    });

    on('dashboard/players/loaded', function () {
        playersWrapper.innerHTML = '';

        let portals = [];
        for (let portal in dashboardData.latestNewPlayers) {
            portals.push({ id: portal, name: portal });
        }

        let topWinners = document.createElement('div');
        let headerWinners = document.createElement('div');
        let winnersTitle = document.createElement('h2')
        winnersTitle.innerHTML = 'Top 10 Winners';
        headerWinners.appendChild(winnersTitle);
        headerWinners.appendChild(dropdown.generate(portals, 'dashboard-players-winners-portals-list', 'Select portal'));
        topWinners.appendChild(headerWinners);
        playersWrapper.appendChild(topWinners);

        let topLosers = document.createElement('div');
        let headerLosers = document.createElement('div');
        let losersTitle = document.createElement('h2')
        losersTitle.innerHTML = 'Top 10 Losers';
        headerLosers.appendChild(losersTitle);
        headerLosers.appendChild(dropdown.generate(portals, 'dashboard-players-losers-portals-list', 'Select portal'));
        topLosers.appendChild(headerLosers);
        playersWrapper.appendChild(topLosers);

        let latestPlayers = document.createElement('div');
        let headerLatest = document.createElement('div');
        let latestTitle = document.createElement('h2')
        latestTitle.innerHTML = 'Latest Players';
        headerLatest.appendChild(latestTitle);
        headerLatest.appendChild(dropdown.generate(portals, 'dashboard-players-latest-portals-list', 'Select portal'));
        latestPlayers.appendChild(headerLatest);
        playersWrapper.appendChild(latestPlayers);

        for (let portal of $$('#dashboard-players-winners-portals-list').children[1].children) {
            portal.addEventListener('click', function () {
                if (topWinners.children[1]) topWinners.children[1].remove();
                topWinners.appendChild(table.generate({
                    data: dashboardData.topTenWinners[portal.dataset.value],
                    id: '',
                    dynamic: false,
                    sticky: true
                }));
                table.preserveHeight(playersWrapper);
            });
        }

        for (let portal of $$('#dashboard-players-losers-portals-list').children[1].children) {
            portal.addEventListener('click', function () {
                if (topLosers.children[1]) topLosers.children[1].remove();
                topLosers.appendChild(table.generate({
                    data: dashboardData.topTenLosers[portal.dataset.value],
                    id: '',
                    dynamic: false,
                    sticky: true
                }));
                table.preserveHeight(playersWrapper);
            });
        }

        for (let portal of $$('#dashboard-players-latest-portals-list').children[1].children) {
            portal.addEventListener('click', function () {
                if (latestPlayers.children[1]) latestPlayers.children[1].remove();
                latestPlayers.appendChild(table.generate({
                    data: dashboardData.latestNewPlayers[portal.dataset.value],
                    id: '',
                    dynamic: false,
                    sticky: true
                }));
                table.preserveHeight(playersWrapper);
            });
        }

        $$('#dashboard-players-winners-portals-list').children[1].children[0].click();
        $$('#dashboard-players-losers-portals-list').children[1].children[0].click();
        $$('#dashboard-players-latest-portals-list').children[1].children[0].click();

        let colors = [];
        let labels = [];
        let values = [];
        for (let chart of dashboardData.pieChart) {
            labels.push(chart.portalName);
            values.push(chart.numberOfNewPlayers);
            let color = generateColor();
            while (colors.includes(color)) {
                color = generateColor();
            }
            colors.push(color);
        }

        chart.data.datasets[0].data = values;
        chart.data.datasets[0].backgroundColor = colors;
        chart.data.labels = labels;
        chart.options.legend.display = !isMobile
        chart.update();

        table.preserveHeight(playersWrapper);
    });

    on('dashboard/portals/loaded', function () {
        if (!dashboardData) return;
        portals.innerHTML = '';
        for (let portal in dashboardData.portalsActivities) {
            let header = document.createElement('h2');
            header.innerHTML = portal;
            portals.appendChild(header);
            portals.appendChild(table.generate({
                data: parseData(dashboardData.portalsActivities[portal].activities),
                id: '',
                dynamic: false,
                sticky: true,
                stickyCol: true
            }));
        }
        table.preserveHeight(portals);
    });

    function parseData(data) {
        let keys = Object.keys(data);
        let tableData = [];
        let rows = Object.keys(data[keys[0]]);
        for (let i = 0; i < rows.length; i++) {
            let row = {};
            for (let j = 0; j < keys.length; j++) {
                row['Activity'] = transformCamelToRegular(rows[i]);
                if (j === keys.length - 1 && data[keys[j]][rows[i]] > 0) {
                    row[keys[j]] = data[keys[j]][rows[i]] + '<span style="color: limegreen;float: right;">&#9650;</span>'; //If change is positive
                } else if (j === keys.length - 1 && data[keys[j]][rows[i]] < 0) {
                    row[keys[j]] = data[keys[j]][rows[i]] + '<span style="color: red;float: right;">&#9660;</span>'; //If change is negative
                } else if (j === keys.length - 1 && data[keys[j]][rows[i]] === 0) {
                    row[keys[j]] = data[keys[j]][rows[i]] + '<span style="color: sandybrown;float: right;">&#9644;</span>'; //If no change 
                } else {
                    row[keys[j]] = data[keys[j]][rows[i]];
                }
            }
            tableData.push(row);
        }
        return tableData;
    }
}();