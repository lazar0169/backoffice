let currency = function () {
    let list = $$('.currency');
    let currencies = [];
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
                    droppdown.children[1].classList.add('hidden');
                    for (let cur of list) {
                        cur.children[0].innerHTML = option.innerHTML;
                    }
                    selected.id = option.dataset.id;
                    selected.name = option.innerHTML;
                    trigger(`currency/${droppdown.dataset.page}`);
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
        if (currencies.length > 0) return
        addLoader($$('.currency-select')[0]);
        trigger('comm/currency/get', {
            success: function (response) {
                removeLoader($$('.currency-select')[0]);
                if (response.responseCode === message.codes.success) {
                    currencies = response.result;
                    for (let droppdown of list) {
                        droppdown.children[0].innerHTML = currencies[0].name;
                        selected = currencies[0];
                        droppdown.children[1].innerHTML = '';
                        for (let currency of currencies) {
                            droppdown.children[1].innerHTML += `<a data-id="${currency.id}">${currency.name}</a>`;
                        }
                    }
                    initCurrencyDropdown();
                } else {
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