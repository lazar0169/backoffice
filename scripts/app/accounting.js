let accounting = function () {
    let pageReports = $$('#accounting-reports-tables');
    let header = $$('#accounting-reports-header');
    let footer = $$('#accounting-reports-footer');

    let template = {
        timeSpan: "",
        fromDate: "2018-10-21T17:40:43.392Z",
        toDate: "2018-10-21T17:40:43.392Z",
        operaterId: 0,
        portalIds: [0],
        bonusRate: 0
    };

    function generateReport(data, sum) {
        let array = data;
        sum[Object.keys(sum)[0]] = 'Sum';
        array.push(sum);
        return table.generate(array);
    }

    function generateHeadline(string) {
        let headline = document.createElement('h2');
        headline.innerHTML = string;
        return headline;
    }

    function afterLoad(response) {
        if (response.responseCode === message.codes.success) {
            if ($$('#accounting-operators-list')) $$('#accounting-operators-list').remove();
            let operatorsDropdown = dropdown.generate(response.result, 'accounting-operators-list', 'Select operator');
            insertAfter(operatorsDropdown, $$('#accounting-time-span-to'));

            for (let operator of $$('#accounting-operators-list').children[1].children) {
                operator.addEventListener('click', function () {
                    addLoader($$('#accounting-reports-filter'));
                    trigger('comm/accounting/portals/get', {
                        body: {
                            id: operator.dataset.value
                        },
                        success: function (response) {
                            if (response.responseCode === message.codes.success) {
                                populateFilter(response);
                                removeLoader($$('#accounting-reports-filter'));
                            } else {
                                trigger('message', response.responseCode);
                            }
                        },
                        fail: function () {
                            removeLoader($$('#accounting-reports-filter'));
                        }
                    });
                });
            }
        } else {
            trigger('message', response.responseCode);
        }
    }

    function populateFilter(response) {
        if ($$('#accounting-portals-list')) $$('#accounting-portals-list').remove();
        let portalsDropown = dropdown.generate(response.result, 'accounting-portals-list', 'Select operator', true);
        insertAfter(portalsDropown, $$('#accounting-operators-list'));
        $$('#accounting-get-reports').classList.remove('hidden');
        $$('#accounting-get-reports').addEventListener('click', function () {
            let button = this;
            let data = {
                timeSpan: "LastMonth",
                fromDate: "2018-10-21T17:40:43.392Z",
                toDate: "2018-10-21T17:40:43.392Z",
                operaterId: 0,
                portalIds: [],
                bonusRate: 0
            }
            // data.timeSpan = $$('#accounting-time-span').children[0].dataset.value;
            // data.fromDate = $$('#accounting-time-span').children[0].dataset.value;
            data.operaterId = $$('#accounting-operators-list').children[0].dataset.value;
            for (let option of $$('#accounting-portals-list').children[1].children) {
                if (option.children[0].checked) {
                    data.portalIds.push(option.children[0].dataset.id)
                }
            }
            data.bonusRate = $$('#accounting-bonus-rate').value;
            addLoader(button);
            trigger('comm/accounting/get', {
                body: data,
                success: function (response) {
                    removeLoader(button);
                    if (response.responseCode === message.codes.success) {
                        pageReports.appendChild(generateHeadline(response.result.slotAccountingSum.gameName));
                        pageReports.appendChild(generateReport(response.result.slotAccounting, response.result.slotAccountingSum));
                        pageReports.appendChild(generateHeadline(response.result.rouletteAccountingSum.gameName));
                        pageReports.appendChild(generateReport(response.result.rouletteAccounting, response.result.rouletteAccountingSum));
                        pageReports.appendChild(generateHeadline(response.result.liveEuropeanRouletteAccountingSum.gameName));
                        pageReports.appendChild(generateReport(response.result.liveEuropeanRouletteAccounting, response.result.liveEuropeanRouletteAccountingSum));
                        pageReports.appendChild(generateHeadline(response.result.tripleCrownRouletteAccountingSum.gameName));
                        pageReports.appendChild(generateReport(response.result.tripleCrownRouletteAccounting, response.result.tripleCrownRouletteAccountingSum));
                        pageReports.appendChild(generateHeadline(response.result.pokerAccountingSum.gameName));
                        pageReports.appendChild(generateReport(response.result.pokerAccounting, response.result.pokerAccountingSum));
                        pageReports.appendChild(generateHeadline(response.result.operatorAccountingSum.gameName));
                        pageReports.appendChild(generateReport([], response.result.operatorAccountingSum));

                        header.classList.remove('hidden');
                        footer.classList.remove('hidden');

                        $$('#accounting-reports-header-currency-value').innerHTML = response.result.casinoCurrency;
                        $$('#accounting-reports-header-period-value').innerHTML = response.result.period;

                        $$('#accounting-reports-footer-tax-value').innerHTML = response.result.scaledTaxFee;
                        $$('#accounting-reports-footer-deduction-value').innerHTML = response.result.deduction;
                        $$('#accounting-reports-footer-reduction-value').innerHTML = response.result.reduction;
                        $$('#accounting-reports-footer-sum-value').innerHTML = response.result.feeSum;
                    } else {
                        trigger('message', response.responseCode);
                    }
                },
                fail: function () {
                    removeLoader(button);
                }
            });
        });
    }

    on('accounting/reports/loaded', function () {
        pageReports.innerHTML = '';
        header.classList.add('hidden');
        footer.classList.add('hidden');
        addLoader($$('#sidebar-accounting'));
        trigger('comm/accounting/operators/get', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    afterLoad(response);
                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader($$('#sidebar-accounting'));
            },
            fail: function () {
                removeLoader($$('#sidebar-accounting'));
            }
        });
    });
}();