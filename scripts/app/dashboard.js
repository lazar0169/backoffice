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
                        sticky: true
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
        for (let jackpot in dashboardData.jackpots) {
            let header = document.createElement('h2');
            header.innerHTML = `${transformCamelToRegular(jackpot)} Jackpot`;
            jackpots.appendChild(header);
            jackpots.appendChild(table.generate({
                data: dashboardData.jackpots[jackpot].dashboardJackpots,
                id: `jackpot-${jackpot}-table`,
                dynamic: false,
                sticky: true
            }));
        }
        table.preserveHeight(jackpots);
    });

    on('dashboard/players/loaded', function () {
        playersWrapper.innerHTML = '';
        let topWinners = document.createElement('div');
        let headerWinners = document.createElement('h2');
        headerWinners.innerHTML = 'Top 10 Winners';
        topWinners.appendChild(headerWinners);
        topWinners.appendChild(table.generate({
            data: dashboardData.topTenWinners,
            id: '',
            dynamic: false,
            sticky: true
        }));
        let topLosers = document.createElement('div');
        let headerLosers = document.createElement('h2');
        headerLosers.innerHTML = 'Top 10 Winners';
        topLosers.appendChild(headerLosers);
        topLosers.appendChild(table.generate({
            data: dashboardData.topTenLosers,
            id: '',
            dynamic: false,
            sticky: true
        }));
        playersWrapper.appendChild(topWinners);
        playersWrapper.appendChild(topLosers);
        let portals = [];
        for (let portal in dashboardData.latestNewPlayers) {
            portals.push({ id: portal, name: portal });
        }
        let latestPlayers = document.createElement('div');
        let headerLatest = document.createElement('div');
        let title = document.createElement('h2')
        title.innerHTML = 'Latest Players';
        headerLatest.appendChild(title);
        headerLatest.appendChild(dropdown.generate(portals, 'dashboard-players-portals-list', 'Select portal'));
        latestPlayers.appendChild(headerLatest);
        playersWrapper.appendChild(latestPlayers);

        for (let portal of $$('#dashboard-players-portals-list').children[1].children) {
            portal.addEventListener('click', function () {
                if (latestPlayers.children[1]) latestPlayers.children[1].remove();
                latestPlayers.appendChild(table.generate({
                    data: dashboardData.latestNewPlayers[portal.dataset.value].latestPlayers,
                    id: '',
                    dynamic: false,
                    sticky: true
                }));
                table.preserveHeight(playersWrapper);
            });
        }

        $$('#dashboard-players-portals-list').children[1].children[0].click();

        let colors = [];
        let labels = [];
        let values = [];
        for (let chart of dashboardData.pieChart) {
            labels.push(chart.portalName);
            values.push(chart.numberOfNewPlayers);
            colors.push(generateColor());
        }

        chart.data.datasets[0].data = values;
        chart.data.datasets[0].backgroundColor = colors;
        chart.data.labels = labels;
        chart.update(1000);

        table.preserveHeight(playersWrapper);
    });

    on('dashboard/portals/loaded', function () {
        if (!dashboardData) return;
        portals.innerHTML = '';
        for (let portal of dashboardData.portalsActivities) {
            portals.appendChild(table.generate({
                data: parseData(portal.activities),
                id: '',
                dynamic: false,
                sticky: true
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