let graph = function () {
    let hideSlicesPlugin = {
        afterUpdate: function (chartInstance) {
            // If `hiddenSlices` has been set.
            if (chartInstance.config.data.hiddenSlices !== undefined && !chartInstance.config.options.isSlicesHidden) {
                // Iterate all datasets.
                for (var i = 0; i < chartInstance.data.datasets.length; ++i) {
                    // Iterate all indices of slices to be hidden.
                    chartInstance.config.data.hiddenSlices.forEach(function (index) {
                        // Hide this slice for this dataset.
                        if (chartInstance.getDatasetMeta(i).data.length !== 0) {
                            chartInstance.getDatasetMeta(i).data[index].hidden = true;
                        }
                    });
                }
                chartInstance.config.options.isSlicesHidden = true;
                // chartInstance.update();
            }
        }
    };
    Chart.pluginService.register(hideSlicesPlugin);
    function generate(element, type, count = 1) {
        let chart = new Chart(element.getContext('2d'), {
            type: type,
            data: {
                datasets: [],
                labels: [],
                fontColor: 'rgba(255, 255, 255, 1)'
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                    labels: {
                        fontColor: 'rgba(255, 255, 255, 1)'
                    }

                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            fontColor: "rgba(255, 255, 255, 1)",
                        },
                        gridLines: {
                            display: true,
                            color: "rgba(255, 255, 255, 0.1)"
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            fontColor: "rgba(255, 255, 255, 1)",
                        },
                        gridLines: {
                            display: true,
                            color: "rgba(255, 255, 255, 0.1)"
                        },
                    }],
                }
            }
        });

        for (let i = 0; i < count; i++) {
            let color = generateColor();
            chart.data.datasets.push({
                data: [],
                label: '',
                backgroundColor: color,
                fontColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1,
                borderColor: color,
                fill: false,
            });
        }

        chart.update();
        return chart;
    }

    return {
        generate
    };
}();