let currency = function () {
    let list = $$('.currency');
    let currencies = [];
    let selected = 0;

    on('dashboard/loaded', function () {
        if (currencies.length > 0) return
        addLoader($$('.currency-label')[0]);
        trigger('comm/currency/get', {
            success: function (response) {
                removeLoader($$('.currency-label')[0]);
                if (response.responseCode === message.codes.success) {
                    currencies = response.result;
                    for (let cur of list) {
                        cur.parentNode.onclick = function () {
                            for (let curr of list) {
                                curr.innerHTML = currencies[++selected && (selected %= currencies.length)].name;
                            }
                        };
                    }
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('.currency-label')[0]);
            }
        });
    });



    return {
        get: function () {
            return currencies[selected];
        }
    };
}();