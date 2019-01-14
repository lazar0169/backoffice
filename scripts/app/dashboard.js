let dashboard = function () {
    let main = $$('#dashboard-main').children[0];
    let jackpots = $$('#dashboard-jackpots').children[0];
    let portals = $$('#dashboard-portals-wrapper');
    let players = $$('#dashboard-players').children[0];
    let playersWrapper = $$('#dashboard-players-wrapper');
    let filters = $$('#dashboard-players-filter');
    let portalListener;
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
                    fontColor: 'white',
                    generateLabels: function (chart) {
                        let data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map(function (label, i) {
                                let meta = chart.getDatasetMeta(0);
                                let ds = data.datasets[0];
                                let arc = meta.data[i];
                                let custom = arc && arc.custom || {};
                                let getValueAtIndexOrDefault = Chart.helpers.getValueAtIndexOrDefault;
                                let arcOpts = chart.options.elements.arc;
                                let fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
                                let stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
                                let bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

                                let value = chart.config.data.datasets[arc._datasetIndex].data[arc._index];

                                return {
                                    text: label + " : " + value,
                                    fillStyle: fill,
                                    strokeStyle: stroke,
                                    lineWidth: bw,
                                    hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                                    index: i
                                };
                            });
                        } else {
                            return [];
                        }
                    }
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

    on('dashboard/loaded', getDashboard);
    on('currency/dashboard', getDashboard);

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
        filters.innerHTML = '';

        let portals = [];
        for (let portal in dashboardData.latestNewPlayers) {
            portals.push({ id: portal, name: portal });
        }

        if (portalListener) off(portalListener)

        filters.appendChild(dropdown.generate(portals, 'dashboard-players-portals-list', 'Select portal'));

        let topWinners = document.createElement('div');
        let headerWinners = document.createElement('div');
        let winnersTitle = document.createElement('h2')
        winnersTitle.innerHTML = 'Top 10 Winners';
        headerWinners.appendChild(winnersTitle);
        topWinners.appendChild(headerWinners);
        playersWrapper.appendChild(topWinners);

        let topLosers = document.createElement('div');
        let headerLosers = document.createElement('div');
        let losersTitle = document.createElement('h2')
        losersTitle.innerHTML = 'Top 10 Losers';
        headerLosers.appendChild(losersTitle);
        topLosers.appendChild(headerLosers);
        playersWrapper.appendChild(topLosers);

        let latestPlayers = document.createElement('div');
        let headerLatest = document.createElement('div');
        let latestTitle = document.createElement('h2')
        latestTitle.innerHTML = 'Latest Players';
        headerLatest.appendChild(latestTitle);
        latestPlayers.appendChild(headerLatest);
        playersWrapper.appendChild(latestPlayers);

        portalListener = on('dashboard-players-portals-list/selected', function (value) {
            if (topWinners.children[1]) topWinners.children[1].remove();
            if (topLosers.children[1]) topLosers.children[1].remove();
            if (latestPlayers.children[1]) latestPlayers.children[1].remove();

            topWinners.appendChild(table.generate({
                data: dashboardData.topTenWinners[value],
                id: '',
                dynamic: false,
                sticky: true
            }));

            topLosers.appendChild(table.generate({
                data: dashboardData.topTenLosers[value],
                id: '',
                dynamic: false,
                sticky: true
            }));

            latestPlayers.appendChild(table.generate({
                data: dashboardData.latestNewPlayers[value],
                id: '',
                dynamic: false,
                sticky: true
            }));

            table.preserveHeight(playersWrapper);
        });

        $$('#dashboard-players-portals-list').children[1].children[0].click();

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
        // chart.options.legend.display = !isMobile()
        $$('#dashboard-chart-wrapper').style.display = isMobile() ? 'none' : 'block';
        chart.update();

        table.preserveHeight(playersWrapper);
    });

    on('dashboard/portals/loaded', function () {
        if (!dashboardData) return;
        portals.innerHTML = '';
        let input = $$('#dashboard-portals-search');

        input.addEventListener('input', function () {
            search(portals, input.value);
        });
        input.addEventListener('keyup', function (e) {
            if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
                input.value = '';
                search(portals, '');
            }
        });
        input.addEventListener('blur', function () {
            input.value = '';
            search(portals, '');
        });

        input.value = '';
        search(portals, '');

        for (let portal in dashboardData.portalsActivities) {
            let wrapper = document.createElement('section');
            wrapper.dataset.value = portal;
            let header = document.createElement('h2');
            header.innerHTML = portal;
            wrapper.appendChild(header);
            wrapper.appendChild(table.generate({
                data: parseData(dashboardData.portalsActivities[portal].activities),
                id: '',
                dynamic: false,
                sticky: true,
                stickyCol: true
            }));
            portals.appendChild(wrapper);
        }
        table.preserveHeight(portals);
    });

    function getDashboard() {
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
                    table.preserveHeight(main);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#sidebar-dashboard'));
            }
        });
    }

    function search(element, term) {
        for (let section of element.getElementsByTagName('section')) {
            if (section.dataset.value.toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        }
    }

    function parseData(data) {
        let keys = Object.keys(data);
        let tableData = [];
        let rows = Object.keys(data[keys[0]]);
        for (let i = 0; i < rows.length; i++) {
            let row = {};
            for (let j = 0; j < keys.length; j++) {
                row['Activity'] = transformCamelToRegular(rows[i]);
                if (j === keys.length - 1 && data[keys[j]][rows[i]] > 0) {
                    row[keys[j]] = data[keys[j]][rows[i]] + '<span style="color: limegreen;float: right; margin-left: 0.8em;">&#9650;</span>'; //If change is positive
                } else if (j === keys.length - 1 && data[keys[j]][rows[i]] < 0) {
                    row[keys[j]] = data[keys[j]][rows[i]] + '<span style="color: red;float: right; margin-left: 0.8em;">&#9660;</span>'; //If change is negative
                } else if (j === keys.length - 1 && data[keys[j]][rows[i]] == 0) {
                    row[keys[j]] = data[keys[j]][rows[i]] + '<span style="color: sandybrown;float: right; margin-left: 0.8em;">&#9644;</span>'; //If no change 
                } else {
                    row[keys[j]] = data[keys[j]][rows[i]];
                }
            }
            tableData.push(row);
        }
        return tableData;
    }
}();