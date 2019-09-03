let accounting = function () {
    let pageReports = $$('#accounting-reports-tables');
    let companyPageReports = $$('#accounting-comapnies-reports-tables');
    let header = $$('#accounting-reports-header');
    // let footer = $$('#accounting-reports-footer');
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
    let selectedRow;
    let isModalOpened = false;

    let actionByRoles = {
        'Admin': 'comm/accounting/get',
        'Accounting': 'comm/accounting/get',
        'Manager': 'comm/accounting/manager/get',
    }

    let companyGetOperatorsButton = $$('#accounting-companies-get-operators');
    let companyGetReportsButton = $$('#accounting-companies-get-reports');
    let companyDataWrapper = $$('#accounting-companies-data');
    let companyReportsDataWrapper = $$('#accounting-comapnies-data-reports');

    let reportsFromDate = getToday();
    let reportsToDate = getToday();
    let companiesToDate = getToday();
    let companiesFromDate = getToday();

    let companyIdSelected;
    let companyOperators;
    let companyReportsData;

    let defaultSelectionValue = 'LastMonth';

    // $$('#accounting-setup-black-overlay').addEventListener('click', hideModal);
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

    $$('#accounting-companies-pdf-download').addEventListener('click', function () {
        doc.save(`accounting-${new Date().toISOString().split('T')[0]}.pdf`);
    });

    $$('#accounting-companies-excel-download').addEventListener('click', function () {
        downloadExcel();
    });

    on('accounting-time-span/selected', function (value) {
        if (value !== 'custom') {
            $$('#accounting-time-span-fieldset').classList.add('disabled');
        } else {
            $$('#accounting-time-span-fieldset').classList.remove('disabled');
        }
    });

    on('accounting-companies-time-span/selected', function (value) {
        if (value !== 'custom') {
            $$('#accounting-companies-time-span-fieldset').classList.add('disabled');
        } else {
            $$('#accounting-companies-time-span-fieldset').classList.remove('disabled');
        }
    });

    function selectDefault(section) {
        // Default time stamp selection
        if (section === 'reports') {
            $$('#accounting-time-span').select(defaultSelectionValue);
        }
        if (section === 'companies') {
            $$('#accounting-companies-time-span').select(defaultSelectionValue);
        }
    }

    function generateReport(data, sum) {
        let array = getCopy(data);
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
    }

    function generateHeadline(string) {
        let headline = document.createElement('h2');
        headline.innerHTML = string.replace(' Sum', '');
        return headline;
    }

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

    const afterCompaniesLoad = (data) => {
        clearElement($$('#accounting-companies-list'));
        let companiesDropdown = dropdown.generate(data, 'accounting-companies-list', 'Select company');
        $$('#accounting-companies-companies-list-wrapper').appendChild(companiesDropdown);
        if (!data) $$('#accounting-companies-companies-list-wrapper').style.display = 'none';

        on('accounting-companies-list/selected', function (value) {
            companyIdSelected = value;
            companyGetOperatorsButton.classList.remove('hidden');
            companyGetOperatorsButton.onclick = () => {
                companyReportsDataWrapper.classList.add('hidden');
                $$('#accounting-comapnies-reports-header').classList.add('hidden');
                $$('#accounting-companies-time-span').classList.add('hidden');
                $$('#accounting-companies-pdf-download').classList.add('hidden');
                $$('#accounting-companies-excel-download').classList.add('hidden');
                addLoader(companyGetOperatorsButton);
                trigger('comm/accounting/companies/getOperators', {
                    body: {
                        id: companyIdSelected
                    },
                    success: function (response) {
                        if (response.responseCode === message.codes.success) {
                            if (!response.result.length) {
                                trigger('message', message.codes.noData);
                                return;
                            }
                            populateCompanyOperators(response.result);
                        }
                        else {
                            trigger('message', response.responseCode);
                        }
                        removeLoader(companyGetOperatorsButton);
                    },
                    fail: function (response) {
                        removeLoader(companyGetOperatorsButton);
                        trigger('message', response.responseCode);
                    }
                });
            };
            companyGetReportsButton.onclick = () => {
                let result = [];
                for (let operator of companyOperators) {
                    let resultOperator = {};
                    let bonusRateValue = $$(`#bonus-rate-${operator.name}`).value;
                    let deductionValue = $$(`#deduction-${operator.name}`).value;
                    let reductionValue = $$(`#reduction-${operator.name}`).value;
                    resultOperator.operatorId = operator.id;
                    resultOperator.actualBonusRate = bonusRateValue && bonusRateValue > 0 ? bonusRateValue : 0;
                    resultOperator.deduction = deductionValue && deductionValue > 0 ? deductionValue : 0;
                    resultOperator.reduction = reductionValue && reductionValue > 0 ? reductionValue : 0;
                    result.push(resultOperator);
                }
                addLoader(companyGetReportsButton);
                trigger('comm/accounting/companies/getAccounting', {
                    body: {
                        timeSpan: $$('#accounting-companies-time-span').getSelected() || 'custom',
                        fromDate: companiesFromDate,
                        toDate: companiesToDate,
                        operatorReportSetUps: result
                    },
                    success: function (response) {
                        if (response.responseCode === message.codes.success) {
                            populateReportsData(response.result);
                        }
                        else {
                            trigger('message', response.responseCode);
                        }
                        removeLoader(companyGetReportsButton);
                    },
                    fail: function (response) {
                        removeLoader(companyGetReportsButton);
                        trigger('message', response.responseCode);
                    }
                })
            };
        });
    };

    const populateReportsData = (data) => {
        companyReportsData = data;
        let operatorsList = [];

        for (let operatorId in data) {
            let row = {
                name: data[operatorId].operatorName,
                id: operatorId
            };
            operatorsList.push(row);
        }
        clearElement($$('#accounting-companies-operators-dropdown'))
        let operatorsWrapper = $$('#accounting-companies-operators');
        let operatorsDropdown = dropdown.generate(operatorsList, `accounting-companies-operators-dropdown`, 'Select operator');
        operatorsWrapper.appendChild(operatorsDropdown);
        if (!operatorsList) operatorsWrapper.style.display = 'none';

        on(`accounting-companies-operators-dropdown/selected`, function (value) {
            populateSpecificOperator(value);
        });
        companyDataWrapper.classList.add('hidden');
        companyReportsDataWrapper.classList.remove('hidden');
        $$('#accounting-comapnies-reports-header').classList.remove('hidden');
        $$('#accounting-companies-time-span').classList.remove('hidden');
        $$('#accounting-companies-pdf-download').classList.remove('hidden');
        $$('#accounting-companies-excel-download').classList.remove('hidden');
        operatorsDropdown.children[1].children[data.length].click();
    };

    const populateSpecificOperator = (id) => {
        let specificOperatorData = companyReportsData[id];

        // Prepare pdf report
        doc = new jsPDF('l', 'pt');
        doc.setFontSize(9);
        doc.text(20, 20, `Period: ${specificOperatorData.period}; Currency: ${specificOperatorData.casinoCurrency}; Operator: ${specificOperatorData.operatorName};`);
        // doc.text(20, 20, `Period: ${response.result.period}; Currency: ${response.result.casinoCurrency}; Operator: ${response.result.operatorName}; Bonus rate: ${data.bonusRate}%; Deduction: ${data.deduction}%; Reduction: ${data.reduction}`);
        doc.setFontSize(16);
        docPageCount = 0;
        companyPageReports.innerHTML = "";

        companyPageReports.appendChild(generateHeadline(specificOperatorData.slotAccountingSum.gameName));
        generateReport(specificOperatorData.slotAccounting, specificOperatorData.slotAccountingSum);
        companyPageReports.appendChild(table.generate({ data: specificOperatorData.slotAccounting, id: '', sum: specificOperatorData.slotAccountingSum, dynamic: false, sticky: true }));
        doc.addPage();
        companyPageReports.appendChild(generateHeadline(specificOperatorData.rouletteAccountingSum.gameName));
        generateReport(specificOperatorData.rouletteAccounting, specificOperatorData.rouletteAccountingSum);
        companyPageReports.appendChild(table.generate({ data: specificOperatorData.rouletteAccounting, id: '', sum: specificOperatorData.rouletteAccountingSum, dynamic: false, sticky: true }));
        doc.addPage();
        companyPageReports.appendChild(generateHeadline(specificOperatorData.liveEuropeanRouletteAccountingSum.gameName));
        generateReport(specificOperatorData.liveEuropeanRouletteAccounting, specificOperatorData.liveEuropeanRouletteAccountingSum);
        companyPageReports.appendChild(table.generate({ data: specificOperatorData.liveEuropeanRouletteAccounting, id: '', sum: specificOperatorData.liveEuropeanRouletteAccountingSum, dynamic: false, sticky: true }));
        doc.addPage();
        companyPageReports.appendChild(generateHeadline(specificOperatorData.tripleCrownRouletteAccountingSum.gameName));
        generateReport(specificOperatorData.tripleCrownRouletteAccounting, specificOperatorData.tripleCrownRouletteAccountingSum);
        companyPageReports.appendChild(table.generate({ data: specificOperatorData.tripleCrownRouletteAccounting, id: '', sum: specificOperatorData.tripleCrownRouletteAccountingSum, dynamic: false, sticky: true }));
        doc.addPage();
        companyPageReports.appendChild(generateHeadline(specificOperatorData.pokerAccountingSum.gameName));
        generateReport(specificOperatorData.pokerAccounting, specificOperatorData.pokerAccountingSum);
        companyPageReports.appendChild(table.generate({ data: specificOperatorData.pokerAccounting, id: '', sum: specificOperatorData.pokerAccountingSum, dynamic: false, sticky: true }));
        doc.addPage();
        companyPageReports.appendChild(document.createElement('hr'));
        companyPageReports.appendChild(generateHeadline(specificOperatorData.operatorAccountingSum.gameName));
        companyPageReports.appendChild(table.generate({ data: [specificOperatorData.operatorAccountingSum], id: '', dynamic: false, sticky: true }));

        table.preserveHeight(companyPageReports);

        // footer.classList.remove('hidden');

        $$('#accounting-comapnies-reports-header-currency-value').innerHTML = specificOperatorData.casinoCurrency;
        $$('#accounting-comapnies-reports-header-period-value').innerHTML = specificOperatorData.period;

        // $$('#accounting-reports-footer-tax-value').innerHTML = response.result.scaledTaxFee;
        // $$('#accounting-reports-footer-deduction-value').innerHTML = response.result.deduction;
        // $$('#accounting-reports-footer-reduction-value').innerHTML = response.result.reduction;
        // $$('#accounting-reports-footer-sum-value').innerHTML = response.result.feeSum;

        // Prepare excel data
        excelData.operatorName = specificOperatorData.operatorName;
        excelData.operatorAccounting = specificOperatorData;

        // Enable download button
        // $$('#accounting-reports-download').classList.remove('hidden');
        // $$('#accounting-reports-download-excel').classList.remove('hidden');
    };

    function afterLoad(response) {
        if (response.responseCode === message.codes.success) {
            clearElement($$('#accounting-operators-list'));
            let operatorsDropdown = dropdown.generate(response.result, 'accounting-operators-list', 'Select operator');
            $$('#accounting-operators-list-wrapper').appendChild(operatorsDropdown);
            if (!response.result) $$('#accounting-operators-list-wrapper').style.display = 'none';

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

            // Prevent operator change
            if (roles.getRole() === 'Manager') {
                trigger('accounting-operators-list/selected', 0);
            }

        } else {
            trigger('message', response.responseCode);
        }
    }

    function populateFilter(response) {
        clearElement($$('#accounting-portals-list'));
        let portalsDropown = dropdown.generate(response.result, 'accounting-portals-list', 'Select portal', true);
        $$('#accounting-portals-list-wrapper').appendChild(portalsDropown);
        $$('#accounting-get-reports').classList.remove('hidden');

        $$('#accounting-get-reports').onclick = function () {
            $$('#accounting-reports-download').classList.add('hidden');
            $$('#accounting-reports-download-excel').classList.add('hidden');
            $$('#accounting-reports-header').classList.add('hidden');
            // $$('#accounting-reports-footer').classList.add('hidden');
            pageReports.innerHTML = '';
            let button = this;
            let data;

            switch (roles.getRole()) {
                case 'Manager':
                    data = {
                        timeSpan: $$('#accounting-time-span').getSelected() || 'custom',
                        fromDate: reportsFromDate,
                        toDate: reportsToDate,
                        portalIds: $$('#accounting-portals-list').getSelected(),
                    }
                    break;

                default:
                    data = {
                        timeSpan: $$('#accounting-time-span').getSelected() || 'custom',
                        fromDate: reportsFromDate,
                        toDate: reportsToDate,
                        operaterId: $$('#accounting-operators-list').getSelected(),
                        portalIds: $$('#accounting-portals-list').getSelected(),
                        bonusRate: $$('#accounting-reports-bonus-rate').get(),
                        deduction: $$('#accounting-reports-deduction').get(),
                        reduction: $$('#accounting-reports-reduction').value || 0
                    }
                    break;
            }

            addLoader(button);
            trigger(actionByRoles[roles.getRole()], {
                body: data,
                success: function (response) {
                    removeLoader(button);
                    if (response.responseCode === message.codes.success) {
                        // Prepare pdf report
                        doc = new jsPDF('l', 'pt');
                        doc.setFontSize(9);
                        doc.text(20, 20, `Period: ${response.result.period}; Currency: ${response.result.casinoCurrency}; Operator: ${response.result.operatorName};`);
                        // doc.text(20, 20, `Period: ${response.result.period}; Currency: ${response.result.casinoCurrency}; Operator: ${response.result.operatorName}; Bonus rate: ${data.bonusRate}%; Deduction: ${data.deduction}%; Reduction: ${data.reduction}`);
                        doc.setFontSize(16);
                        docPageCount = 0;

                        pageReports.appendChild(generateHeadline(response.result.slotAccountingSum.gameName));
                        generateReport(response.result.slotAccounting, response.result.slotAccountingSum);
                        pageReports.appendChild(table.generate({ data: response.result.slotAccounting, id: '', sum: response.result.slotAccountingSum, dynamic: false, sticky: true }));
                        doc.addPage();
                        pageReports.appendChild(generateHeadline(response.result.rouletteAccountingSum.gameName));
                        generateReport(response.result.rouletteAccounting, response.result.rouletteAccountingSum);
                        pageReports.appendChild(table.generate({ data: response.result.rouletteAccounting, id: '', sum: response.result.rouletteAccountingSum, dynamic: false, sticky: true }));
                        doc.addPage();
                        pageReports.appendChild(generateHeadline(response.result.liveEuropeanRouletteAccountingSum.gameName));
                        generateReport(response.result.liveEuropeanRouletteAccounting, response.result.liveEuropeanRouletteAccountingSum);
                        pageReports.appendChild(table.generate({ data: response.result.liveEuropeanRouletteAccounting, id: '', sum: response.result.liveEuropeanRouletteAccountingSum, dynamic: false, sticky: true }));
                        doc.addPage();
                        pageReports.appendChild(generateHeadline(response.result.tripleCrownRouletteAccountingSum.gameName));
                        generateReport(response.result.tripleCrownRouletteAccounting, response.result.tripleCrownRouletteAccountingSum);
                        pageReports.appendChild(table.generate({ data: response.result.tripleCrownRouletteAccounting, id: '', sum: response.result.tripleCrownRouletteAccountingSum, dynamic: false, sticky: true }));
                        doc.addPage();
                        pageReports.appendChild(generateHeadline(response.result.pokerAccountingSum.gameName));
                        generateReport(response.result.pokerAccounting, response.result.pokerAccountingSum);
                        pageReports.appendChild(table.generate({ data: response.result.pokerAccounting, id: '', sum: response.result.pokerAccountingSum, dynamic: false, sticky: true }));
                        doc.addPage();
                        pageReports.appendChild(document.createElement('hr'));
                        pageReports.appendChild(generateHeadline(response.result.operatorAccountingSum.gameName));
                        pageReports.appendChild(table.generate({ data: [response.result.operatorAccountingSum], id: '', dynamic: false, sticky: true }));

                        table.preserveHeight(pageReports);

                        header.classList.remove('hidden');
                        // footer.classList.remove('hidden');

                        $$('#accounting-reports-header-operator-value').innerHTML = response.result.operatorName;
                        $$('#accounting-reports-header-currency-value').innerHTML = response.result.casinoCurrency;
                        $$('#accounting-reports-header-period-value').innerHTML = response.result.period;

                        // $$('#accounting-reports-footer-tax-value').innerHTML = response.result.scaledTaxFee;
                        // $$('#accounting-reports-footer-deduction-value').innerHTML = response.result.deduction;
                        // $$('#accounting-reports-footer-reduction-value').innerHTML = response.result.reduction;
                        // $$('#accounting-reports-footer-sum-value').innerHTML = response.result.feeSum;

                        // Prepare excel data
                        excelData.operatorName = response.result.operatorName;
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
        };
    }

    const populateCompanyOperators = (data) => {
        let wrapperTable = $$('#accounting-companies-operators-table').getElementsByTagName('table')[0];
        if (wrapperTable.getElementsByTagName('tbody').length !== 0) {
            wrapperTable.getElementsByTagName('tbody')[0].remove();
        }

        let body = document.createElement('tbody');
        wrapperTable.appendChild(body);
        companyOperators = data;

        for (let operator of data) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            let operatorTitle = document.createElement('div');
            // portalTitle.className = 'portal-title';
            operatorTitle.innerText = operator.name;
            let inputWrapper = document.createElement('div');
            let bonusRateInput = document.createElement('input');
            let deductionInput = document.createElement('input');
            let reductionInput = document.createElement('input');
            bonusRateInput.id = `bonus-rate-${operator.name}`;
            deductionInput.id = `deduction-${operator.name}`;
            reductionInput.id = `reduction-${operator.name}`;
            bonusRateInput.type = 'number';
            deductionInput.type = `number`;
            reductionInput.type = `number`;
            bonusRateInput.placeholder = 'Bonus Rate';
            deductionInput.placeholder = `Deduction`;
            reductionInput.placeholder = `Reduction`;
            td.appendChild(operatorTitle);
            td.appendChild(inputWrapper);
            inputWrapper.appendChild(bonusRateInput);
            inputWrapper.appendChild(deductionInput);
            inputWrapper.appendChild(reductionInput);
            tr.dataset.id = operator.name;
            tr.appendChild(td);
            body.appendChild(tr);
        }
        companyDataWrapper.classList.remove('hidden');
    };

    // Creates operators list
    function createList(data) {
        let actions = $$(`#accounting-operators-table`);
        let serachBar = $$(`#accounting-setup-search-wrapper`);
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
        serachBar.classList.remove('hidden');

        let input = $$('#accounting-setup-search');

        input.oninput = () => {
            searchOperators(body, input.value);
        };

        input.onkeyup = (e) => {
            if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
                input.value = '';
                searchOperators(body, '');
            }
        };

        $$('#accounting-setup-remove-search').onclick = function () {
            input.value = '';
            searchOperators(body, '');
        };
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

    function searchOperators(element, term) {
        for (let tableRow of element.getElementsByTagName('tr')) {
            if (tableRow.innerText.toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
                tableRow.style.display = 'table-row';
            } else {
                tableRow.style.display = 'none';
            }
        }
    };

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
                        stepFrom: tr.children[0].innerText,
                        stepTo: tr.children[1].innerText,
                        fee: tr.children[2].innerText
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
        $$('#accounting-setup').children[0].style.overflow = 'hidden';
        isModalOpened = true;
    }

    function hideModal() {
        $$('#accounting-setup-black-overlay').style.display = 'none';
        $$('#accounting-setup-form').classList.remove('show');
        $$('#accounting-setup').children[0].style.overflow = 'auto';
        selectedRow.classList.remove('hover');
        tax.hide();
        isModalOpened = false;
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
                element = getCopy(element);
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

    on('date/accounting-companies-time-span-from', function (data) {
        companiesFromDate = data;
    });
    on('date/accounting-companies-time-span-to', function (data) {
        companiesToDate = data;
    });

    on('data/')

    on('accounting/show/modal', function (data) {
        addLoader(data.caller);
        selectedRow = data.caller.parentNode;
        selectedRow.classList.add('hover');
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
        // footer.classList.add('hidden');
        clearElement($$('#accounting-operators-list'));
        clearElement($$('#accounting-portals-list'));
        $$('#accounting-get-reports').classList.add('hidden');
        $$('#accounting-reports-download').classList.add('hidden');
        $$('#accounting-reports-download-excel').classList.add('hidden');
        $$('#accounting-time-span-from').reset();
        $$('#accounting-time-span-to').reset();

        selectDefault('reports');

        addLoader($$('#sidebar-accounting'));
        trigger('comm/accounting/operators/get', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {

                    // Prevent operator change
                    if (roles.getRole() === 'Manager') {
                        response = {
                            responseCode: 1000
                        };
                    }

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

    on('accounting/companies/loaded', function () {
        companyGetOperatorsButton.classList.add('hidden');
        companyDataWrapper.classList.add('hidden');
        selectDefault('companies');
        addLoader($$('#accounting-navbar-companies'));
        trigger('comm/accounting/companies/get', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    if (!response.result.length) {
                        trigger('message', message.codes.noData);
                        return;
                    }
                    afterCompaniesLoad(response.result);
                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader($$('#accounting-navbar-companies'));
            },
            fail: function (response) {
                removeLoader($$('#accounting-navbar-companies'));
                trigger('message', response.responseCode);
            }
        });
    });

    return {
        get isModalOpened() {
            return isModalOpened;
        }
    }
}();