let graph = function () {
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