let currency = function () {
    let list = $$('.currency');
    let currenciesArray = [];
    let currencies = {};
    let selected = { id: 0, name: '' };
    let listener;

    function initCurrencyDropdown() {
        if (listener) off(listener);

        for (let dropdown of list) {
            dropdown.children[0].onclick = function () {
                dropdown.children[1].classList.toggle('hidden');
            }
            for (let option of dropdown.children[1].children) {
                option.onclick = function () {
                    addLoader(dropdown.children[0]);
                    dropdown.children[1].classList.add('hidden');
                    trigger('comm/currency/set', {
                        body: { id: Number(option.dataset.id) },
                        success: function (response) {
                            removeLoader(dropdown.children[0]);
                            if (response.responseCode === message.codes.success) {
                                for (let cur of list) {
                                    cur.children[0].innerHTML = option.innerText;
                                }
                                selected.id = option.dataset.id;
                                selected.name = option.innerText;
                                trigger(`currency/${dropdown.dataset.page}`);
                            } else {
                                trigger('message', response.responseCode);
                            }
                        },
                        fail: function () {
                            removeLoader(dropdown.children[0]);
                        }
                    });
                }
            }
        }

        listener = on('window/click', function (e) {
            if (
                e.target.parentNode && !e.target.parentNode.classList.contains('currency-wrapper') && !e.target.parentNode.classList.contains('currency')
            ) {
                for (let dropdown of list) {
                    dropdown.children[1].classList.add('hidden');
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
                    for (let dropdown of list) {
                        dropdown.children[0].innerHTML = currenciesArray[0].name;
                        selected = currenciesArray[0];
                        dropdown.children[1].innerHTML = '';
                        for (let currency of currenciesArray) {
                            currencies[currency.id] = currency.name;
                            dropdown.children[1].innerHTML += `<a data-id="${currency.id}">${currency.name}</a>`;
                        }
                    }

                    trigger('comm/currency/get', {
                        success: function (response) {
                            removeLoader($$('.currency-select')[0]);
                            if (response.responseCode === message.codes.success) {
                                for (let selector of $$('.currency-select')) {
                                    selector.innerHTML = currencies[response.result];
                                }
                                $$('#refresh-button').innerHTML = 'REFRESH <img src="../images/refresh-icon.png" class="refresh-image"></span>';
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