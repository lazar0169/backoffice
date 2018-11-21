let accounting = function () {
    let pageReports = $$('#accounting-reports-tables');
    let header = $$('#accounting-reports-header');
    let footer = $$('#accounting-reports-footer');
    let taxEditMode = false;
    let openedId;
    let operatorData;
    let isScaledSelected = false;
    let doc;
    let docPageCount = 0;
    let excelData = {
        operatorName: "",
        operatorAccounting: {}
    };

    let reportsFromDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    let reportsToDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';

    $$('#accounting-setup-black-overlay').addEventListener('click', hideModal);
    $$('#accounting-setup-form-cancel').addEventListener('click', hideModal);
    $$('#accounting-setup-form-tax-back').addEventListener('click', function () { tax.hide(); });
    $$('#accounting-setup-form-create-tax').addEventListener('click', function () { tax.show(); });
    $$('#accounting-setup-checkbox').addEventListener('change', function () {
        isScaledSelected = !isScaledSelected;
        $$('#accounting-setup-form-button-wrapper').classList[isScaledSelected ? 'add' : 'remove']('scaled');
        $$('#accounting-setup-form-inputs-fixed').classList[isScaledSelected ? 'add' : 'remove']('hidden');
        $$('#accounting-setup-form-inputs-scaled').classList[isScaledSelected ? 'remove' : 'add']('hidden');
    });

    $$('#accounting-reports-download').addEventListener('click', function () {
        doc.save(`accounting-${new Date().toISOString().split('T')[0]}.pdf`);
    });

    $$('#accounting-reports-download-excel').addEventListener('click', function () {
        downloadExcel();
    });

    on('accounting-time-span/selected', function (value) {
        if (value !== 'custom') {
            $$('#accounting-time-span-from').classList.add('disabled');
            $$('#accounting-time-span-to').classList.add('disabled');
        } else {
            $$('#accounting-time-span-from').classList.remove('disabled');
            $$('#accounting-time-span-to').classList.remove('disabled');
        }
    });

    function generateReport(data, sum) {
        let array = data;
        let title = sum.gameName;
        sum[Object.keys(sum)[0]] = 'Sum';
        array.push(sum);

        let columns = [];
        for (let col of Object.keys(array[0])) {
            let column = { title: '', dataKey: '' };
            column.title = transformCamelToRegular(col);
            column.dataKey = col;
            columns.push(column);
        }

        doc.autoTable(columns, array, {
            margin: { top: 60, left: 20, right: 20, bottom: 40 },
            addPageContent: function (data) {
                doc.text(title, 20, 50);
                doc.setFontSize(9);
                doc.text(`Page: ${++docPageCount}`, 20, 580);
                doc.setFontSize(16);
            }
        });

        return table.generate({
            data: array,
            id: '',
            dynamic: false,
            sticky: true
        });
    }

    function generateHeadline(string) {
        let headline = document.createElement('h2');
        headline.innerHTML = string;
        return headline;
    }

    function saveBase64(reportName, byte) {
        var link = document.createElement('a');
        link.href = byte;
        var fileName = reportName;
        link.download = fileName;
        link.click();
    };

    function downloadExcel() {
        addLoader($$('#accounting-reports-download-excel'));
        trigger('comm/accounting/excel/get', {
            body: excelData,
            success: function (response) {
                removeLoader($$('#accounting-reports-download-excel'));
                if (response.responseCode === message.codes.success) {
                    saveBase64(`${response.result.name}.xlsx`, 'data:application/octet-stream;base64,' + response.result.data);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#accounting-reports-download-excel'));
            }
        });
    }

    function afterLoad(response) {
        if (response.responseCode === message.codes.success) {
            clearElement($$('#accounting-operators-list'));
            let operatorsDropdown = dropdown.generate(response.result, 'accounting-operators-list', 'Select operator');
            insertAfter(operatorsDropdown, $$('#accounting-time-span-to'));

            on('accounting-operators-list/selected', function (value) {
                addLoader($$('#accounting-reports-filter'));
                trigger('comm/accounting/portals/get', {
                    body: {
                        id: value
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
        } else {
            trigger('message', response.responseCode);
        }
    }

    function populateFilter(response) {
        clearElement($$('#accounting-portals-list'));
        let portalsDropown = dropdown.generate(response.result, 'accounting-portals-list', 'Select portal', true);
        insertAfter(portalsDropown, $$('#accounting-operators-list'));
        $$('#accounting-get-reports').classList.remove('hidden');
        $$('#accounting-get-reports').addEventListener('click', function () {
            $$('#accounting-reports-download').classList.add('hidden');
            $$('#accounting-reports-download-excel').classList.add('hidden');
            $$('#accounting-reports-header').classList.add('hidden');
            $$('#accounting-reports-footer').classList.add('hidden');
            pageReports.innerHTML = '';
            let button = this;
            let data = {
                timeSpan: $$('#accounting-time-span').getSelected() || 'custom',
                fromDate: reportsFromDate,
                toDate: reportsToDate,
                operaterId: $$('#accounting-operators-list').getSelected(),
                portalIds: $$('#accounting-portals-list').getSelected(),
                bonusRate: $$('#accounting-reports-bonus-rate').get(),
                deduction: $$('#accounting-reports-deduction').get(),
                reduction: $$('#accounting-reports-reduction').value || 0
            }

            addLoader(button);
            trigger('comm/accounting/get', {
                body: data,
                success: function (response) {
                    removeLoader(button);
                    if (response.responseCode === message.codes.success) {
                        // Prepare pdf report
                        doc = new jsPDF('l', 'pt');
                        doc.setFontSize(9);
                        doc.text(20, 20, `Period: ${response.result.period}; Currency: ${response.result.casinoCurrency}; Operator: ${$$('#accounting-operators-list').children[0].innerHTML}; Bonus rate: ${data.bonusRate}%; Deduction: ${data.deduction}%; Reduction: ${data.reduction}`);
                        doc.setFontSize(16);
                        docPageCount = 0;

                        pageReports.appendChild(generateHeadline(response.result.slotAccountingSum.gameName));
                        pageReports.appendChild(generateReport(response.result.slotAccounting, response.result.slotAccountingSum));
                        doc.addPage();
                        pageReports.appendChild(generateHeadline(response.result.rouletteAccountingSum.gameName));
                        pageReports.appendChild(generateReport(response.result.rouletteAccounting, response.result.rouletteAccountingSum));
                        doc.addPage();
                        pageReports.appendChild(generateHeadline(response.result.liveEuropeanRouletteAccountingSum.gameName));
                        pageReports.appendChild(generateReport(response.result.liveEuropeanRouletteAccounting, response.result.liveEuropeanRouletteAccountingSum));
                        doc.addPage();
                        pageReports.appendChild(generateHeadline(response.result.tripleCrownRouletteAccountingSum.gameName));
                        pageReports.appendChild(generateReport(response.result.tripleCrownRouletteAccounting, response.result.tripleCrownRouletteAccountingSum));
                        doc.addPage();
                        pageReports.appendChild(generateHeadline(response.result.pokerAccountingSum.gameName));
                        pageReports.appendChild(generateReport(response.result.pokerAccounting, response.result.pokerAccountingSum));
                        doc.addPage();
                        pageReports.appendChild(generateHeadline(response.result.operatorAccountingSum.gameName));
                        pageReports.appendChild(generateReport([], response.result.operatorAccountingSum));

                        table.preserveHeight(pageReports);

                        header.classList.remove('hidden');
                        footer.classList.remove('hidden');

                        $$('#accounting-reports-header-currency-value').innerHTML = response.result.casinoCurrency;
                        $$('#accounting-reports-header-period-value').innerHTML = response.result.period;

                        $$('#accounting-reports-footer-tax-value').innerHTML = response.result.scaledTaxFee;
                        $$('#accounting-reports-footer-deduction-value').innerHTML = response.result.deduction;
                        $$('#accounting-reports-footer-reduction-value').innerHTML = response.result.reduction;
                        $$('#accounting-reports-footer-sum-value').innerHTML = response.result.feeSum;

                        // Prepare excel data
                        excelData.operatorName = $$('#accounting-operators-list').children[0].innerHTML;
                        excelData.operatorAccounting = response.result;

                        // Enable download button
                        $$('#accounting-reports-download').classList.remove('hidden');
                        $$('#accounting-reports-download-excel').classList.remove('hidden');
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

    // Creates operators list
    function createList(data) {
        let actions = $$(`#accounting-operators-table`);
        if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
            actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
        }
        let body = document.createElement('tbody');
        for (let row of data) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.innerHTML = row.name;
            tr.dataset.id = row.id;
            tr.onclick = function () { trigger('accounting/show/modal', { id: row.id, caller: td }) };
            tr.appendChild(td);
            body.appendChild(tr);
        }
        actions.getElementsByTagName('table')[0].appendChild(body);
        actions.classList.remove('hidden');
    }

    function createTaxList(data) {
        let actions = $$(`#accounting-setup-scaled-table`);
        if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
            actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
        }
        let body = document.createElement('tbody');

        // Header
        let trHead = document.createElement('tr');
        let thFrom = document.createElement('th');
        let thTo = document.createElement('th');
        let thFee = document.createElement('th');
        thFrom.innerHTML = 'Step From';
        thTo.innerHTML = 'Step To';
        thFee.innerHTML = 'Fee';
        trHead.appendChild(thFrom);
        trHead.appendChild(thTo);
        trHead.appendChild(thFee);
        body.appendChild(trHead);

        for (let i = 0; i < data.length; i++) {
            let tr = document.createElement('tr');
            for (let cell in data[i]) {
                let td = document.createElement('td');
                td.innerHTML = data[i][cell];
                tr.appendChild(td);
            }
            tr.onclick = function () {
                taxEditMode = true;
                tax.show(data[i], i);
            };
            body.appendChild(tr);
        }
        actions.getElementsByTagName('table')[0].appendChild(body);
        actions.classList.remove('hidden');
    }

    function showModal(data) {
        if (!data) {
            trigger('message', message.codes.badParameter);
            return;
        }
        operatorData = data;

        let gamingTax = $$('#accounting-setup-gaming-tax');
        let liveEuropeanRouletteFee = $$('#accounting-setup-live-european-roulette-fee');
        let maxBonusRate = $$('#accounting-setup-max-bonus-rate');
        let pokerFee = $$('#accounting-setup-poker-fee');
        let rouletteFee = $$('#accounting-setup-roulette-fee');
        let slotFee = $$('#accounting-setup-slot-fee');
        let tripleCrownRouletteFee = $$('#accounting-setup-triple-crown-roulette-fee');
        let vat = $$('#accounting-setup-vat');

        let buttonWrapper = $$('#accounting-setup-form-button-wrapper');

        if (operatorData.isFixedTax || !operatorData.scaledTax) { // FIXED
            buttonWrapper.classList.remove('scaled');
            isScaledSelected = false;
            operatorData.scaledTax = [];
            $$('#accounting-setup-form-inputs-fixed').classList.remove('hidden');
            $$('#accounting-setup-form-inputs-scaled').classList.add('hidden');
            $$('#accounting-setup-checkbox').checked = false;
        } else { // SCALED
            buttonWrapper.classList.add('scaled');
            isScaledSelected = true;
            operatorData.fixedTax = {
                gamingTax: 0,
                liveEuropeanRouletteFee: 0,
                maxBonusRate: 0,
                pokerFee: 0,
                rouletteFee: 0,
                slotFee: 0,
                tripleCrownRouletteFee: 0,
                vat: 0
            };
            $$('#accounting-setup-form-inputs-fixed').classList.add('hidden');
            $$('#accounting-setup-form-inputs-scaled').classList.remove('hidden');
            $$('#accounting-setup-checkbox').checked = true;
        }

        gamingTax.set(operatorData.fixedTax.gamingTax);
        liveEuropeanRouletteFee.set(operatorData.fixedTax.liveEuropeanRouletteFee);
        maxBonusRate.set(operatorData.fixedTax.maxBonusRate);
        pokerFee.set(operatorData.fixedTax.pokerFee);
        rouletteFee.set(operatorData.fixedTax.rouletteFee);
        slotFee.set(operatorData.fixedTax.slotFee);
        tripleCrownRouletteFee.set(operatorData.fixedTax.tripleCrownRouletteFee);
        vat.set(operatorData.fixedTax.vat);
        createTaxList(operatorData.scaledTax);

        $$('#accounting-setup-form-save').onclick = function () {
            let button = this;
            addLoader(button);
            if (isScaledSelected) {
                operatorData.fixedTax = null;
                operatorData.scaledTax = [];
                for (let tr of $$('#accounting-setup-scaled-table').children[0].children[1].children) {
                    let scaledTax = {
                        stepFrom: tr.children[0].innerHTML,
                        stepTo: tr.children[1].innerHTML,
                        fee: tr.children[2].innerHTML
                    };
                    operatorData.scaledTax.push(scaledTax);
                }
                operatorData.scaledTax.splice(0, 1);
                operatorData.isFixedTax = false;
            } else {
                operatorData.scaledTax = null;
                operatorData.fixedTax = {
                    gamingTax: gamingTax.get(),
                    liveEuropeanRouletteFee: liveEuropeanRouletteFee.get(),
                    maxBonusRate: maxBonusRate.get(),
                    pokerFee: pokerFee.get(),
                    rouletteFee: rouletteFee.get(),
                    slotFee: slotFee.get(),
                    tripleCrownRouletteFee: tripleCrownRouletteFee.get(),
                    vat: vat.get(),
                };
                operatorData.isFixedTax = true;
            }

            trigger(`comm/accounting/setup/operator/set/${isScaledSelected ? 'scaled' : 'fixed'}`, {
                body: operatorData,
                success: function (response) {
                    removeLoader(button);
                    if (response.responseCode === message.codes.success) {
                        trigger('accounting/setup/loaded');
                        hideModal();
                    } else {
                        trigger('message', response.responseCode);
                    }
                },
                fail: function () {
                    removeLoader(button);
                }
            });
        };

        $$('#accounting-setup-black-overlay').style.display = 'block';
        $$('#accounting-setup-form').classList.add('show');
        $$('#accounting-setup').children[0].scrollTop = 0;
        $$('#accounting-setup').children[0].style.overflow = 'hidden';
    }

    function hideModal() {
        $$('#accounting-setup-black-overlay').style.display = 'none';
        $$('#accounting-setup-form').classList.remove('show');
        $$('#accounting-setup').children[0].style.overflow = 'auto';
        tax.hide();
    }

    let tax = function () {
        let modal = $$('#accounting-setup-form-tax');
        let from = $$('#accounting-setup-tax-from');
        let to = $$('#accounting-setup-tax-to');
        let fee = $$('#accounting-setup-tax-fee');
        let saveButton = $$('#accounting-setup-form-tax-save');
        let removeButton = $$('#accounting-setup-form-tax-remove');
        let wrapper = $$('#accounting-setup-form-tax-button-wrapper');
        $$('#accounting-setup-form-tax-button-wrapper').classList[taxEditMode ? 'add' : 'remove']('edit');

        function show(element, index) {
            if (taxEditMode) {
                element = JSON.parse(JSON.stringify(element));
                from.value = index === 0 ? 0 : element.stepFrom;
                to.value = element.stepTo;
                fee.set(Number(element.fee));
                wrapper.classList.add('edit');
                console.log(element, index);
            } else {
                from.value = operatorData.scaledTax.length === 0 ? 0 : Number(operatorData.scaledTax[operatorData.scaledTax.length - 1].stepTo) + 0.01;
                to.value = '';
                fee.set(0);
                wrapper.classList.remove('edit');
            }

            modal.classList.add('show');

            saveButton.onclick = function () {
                if (Number(to.value) <= Number(from.value)) {
                    trigger('message', message.codes.badParameter);
                } else {
                    if (taxEditMode) {
                        operatorData.scaledTax[index].stepFrom = 0;
                        operatorData.scaledTax[index].fee = fee.get();
                        if (operatorData.scaledTax.length > 1) {
                            if (index > 0) {
                                operatorData.scaledTax[index].stepFrom = (Number(operatorData.scaledTax[index - 1].stepTo) + 0.01).toFixed(2);
                            }
                            for (let i = index; i < operatorData.scaledTax.length; i++) {
                                if (i < operatorData.scaledTax.length - 1) {
                                    operatorData.scaledTax[i + 1].stepTo = (Number(to.value) - Number(operatorData.scaledTax[index].stepTo) + Number(operatorData.scaledTax[i + 1].stepTo)).toFixed(2);
                                    operatorData.scaledTax[i + 1].stepFrom = i === index ? (Number(to.value) + 0.01).toFixed(2) : (Number(operatorData.scaledTax[i].stepTo) + 0.01).toFixed(2);
                                }
                            }
                        }
                        operatorData.scaledTax[index].stepTo = to.value;
                    } else {
                        operatorData.scaledTax.push({
                            stepFrom: from.value,
                            stepTo: to.value,
                            fee: fee.get()
                        });
                    }
                    sort();
                    createTaxList(operatorData.scaledTax);
                    hide();
                }
            };

            removeButton.onclick = function () {
                if (taxEditMode) {
                    operatorData.scaledTax.splice(index, 1);
                    createTaxList(operatorData.scaledTax);
                    hide();
                }
            };
        }

        function hide() {
            taxEditMode = false;
            modal.classList.remove('show');
        }

        function sort() {
            if (operatorData.scaledTax.length > 0) {
                operatorData.scaledTax.sort(sortByProperty('stepFrom'));
            }
        }

        return {
            show: show,
            hide: hide,
            sort: sort
        }
    }();

    on('date/accounting-time-span-from', function (data) {
        reportsFromDate = data;
    });
    on('date/accounting-time-span-to', function (data) {
        reportsToDate = data;
    });

    on('accounting/show/modal', function (data) {
        addLoader(data.caller);
        trigger('comm/accounting/setup/operator/get', {
            body: {
                id: data.id
            },
            success: function (response) {
                removeLoader(data.caller);
                if (response.responseCode === message.codes.success) {
                    openedId = data.id;
                    showModal(response.result);
                } else {
                    trigger('message', response.responseCode)
                }
            },
            fail: function () {
                removeLoader(data.caller);
            }
        });
    });

    on('accounting/setup/loaded', function () {
        addLoader($$('#sidebar-accounting'));
        trigger('comm/accounting/setup/get', {
            success: function (response) {
                removeLoader($$('#sidebar-accounting'));
                if (response.responseCode === message.codes.success) {
                    createList(response.result);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#sidebar-accounting'));
            }
        });
    });

    on('accounting/reports/loaded', function () {
        pageReports.innerHTML = '';
        header.classList.add('hidden');
        footer.classList.add('hidden');
        clearElement($$('#accounting-operators-list'));
        clearElement($$('#accounting-portals-list'));
        $$('#accounting-get-reports').classList.add('hidden');
        $$('#accounting-reports-download').classList.add('hidden');
        $$('#accounting-reports-download-excel').classList.add('hidden');
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