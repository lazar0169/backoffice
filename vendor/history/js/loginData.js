let loginData = function () {
    let data = getQueryParams(window.location.search);
    data.language = 'BUL';
    function getQueryParams(qs) {
        qs = qs.split('+').join(' ');

        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }
    return {
        getItem: function (key) {
            if (data[key] === undefined)
                return '';
            else
                return data[key];
        }
    };
}();