let currency = function () {
    let list = $$('.currency');
    let currenciesArray = [];
    let currencies = {};
    let selected = { id: 0, name: '' };
    let listener;

    function initCurrencyDropdown() {
        if (listener) off(listener);

        for (let droppdown of list) {
            droppdown.children[0].onclick = function () {
                droppdown.children[1].classList.toggle('hidden');
            }
            for (let option of droppdown.children[1].children) {
                option.onclick = function () {
                    addLoader(droppdown.children[0]);
                    droppdown.children[1].classList.add('hidden');
                    trigger('comm/currency/set', {
                        body: { id: Number(selected.id) },
                        success: function (response) {
                            removeLoader(droppdown.children[0]);
                            if (response.responseCode === message.codes.success) {
                                for (let cur of list) {
                                    cur.children[0].innerHTML = option.innerHTML;
                                }
                                selected.id = option.dataset.id;
                                selected.name = option.innerHTML;
                                trigger(`currency/${droppdown.dataset.page}`);
                            } else {
                                trigger('message', response.responseCode);
                            }
                        },
                        fail: function () {
                            removeLoader(droppdown.children[0]);
                        }
                    });
                }
            }
        }

        listener = on('window/click', function (e) {
            if (
                e.target.parentNode && !e.target.parentNode.classList.contains('currency-wrapper') && !e.target.parentNode.classList.contains('currency')
            ) {
                for (let droppdown of list) {
                    droppdown.children[1].classList.add('hidden');
                }
            }
        });
    }


    on('dashboard/loaded', function () {
        if (currenciesArray.length > 0) return
        addLoader($$('.currency-select')[0]);
        trigger('comm/currency/getAll', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    currenciesArray = response.result;
                    for (let droppdown of list) {
                        droppdown.children[0].innerHTML = currenciesArray[0].name;
                        selected = currenciesArray[0];
                        droppdown.children[1].innerHTML = '';
                        for (let currency of currenciesArray) {
                            currencies[currency.id] = currency.name;
                            droppdown.children[1].innerHTML += `<a data-id="${currency.id}">${currency.name}</a>`;
                        }
                    }

                    trigger('comm/currency/get', {
                        success: function (response) {
                            removeLoader($$('.currency-select')[0]);
                            if (response.responseCode === message.codes.success) {
                                for (let selector of $$('.currency-select')) {
                                    selector.innerHTML = currencies[response.result];
                                }
                            } else {
                                trigger('message', response.responseCode);
                            }
                        },
                        fail: function () {
                            removeLoader($$('.currency-select')[0]);
                        }
                    });

                    initCurrencyDropdown();
                } else {
                    removeLoader($$('.currency-select')[0]);
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('.currency-select')[0]);
            }
        });
    });



    return {
        get: function () {
            return selected;
        }
    };
}();