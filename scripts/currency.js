const currency = function () {
    let list = $$('.currency');
    let currencies = ['EUR', 'USD', 'RSD',];
    let selected = 0;

    for (let cur of list) {
        cur.parentNode.addEventListener('click', function () {
            cur.innerHTML = currencies[++selected && (selected %= currencies.length)];
        });
    }
}();