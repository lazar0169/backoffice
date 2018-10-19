let accounting = function () {
    let operatorsWrapper = $$('#accounting-operators-wrapper');

    on('accounting/reports/loaded', function () {
        addLoader($$('#sidebar-accounting'));
        trigger('comm/accounting/operators/get', {
            success: function (response) {
                removeLoader($$('#sidebar-accounting'));
                operatorsWrapper.innerHTML = '';
                operatorsWrapper.appendChild(dropdown.generate(response.result, 'accounting-operators-list', 'Select operator'));
                for (let operator of $$('#accounting-operators-list').children[1].children) {
                    operator.addEventListener('click', function () {
                        addLoader($$('#accounting-operators-wrapper'));
                        trigger('comm/accounting/portals/get', {
                            body: {
                                id: operator.dataset.value
                            },
                            success: function (response) {
                                removeLoader($$('#accounting-operators-wrapper'));
                                // operatorsWrapper.appendChild(dropdown.generate(response.result, 'accounting-operators-list', 'Select operator', true));
                            },
                            fail: function () {
                                removeLoader($$('#accounting-operators-wrapper'));
                            }
                        });
                    });
                }
            },
            fail: function () {
                removeLoader($$('#sidebar-accounting'));
            }
        });
    });
}();