let dashboard = function () {
    let main = $$('#dashboard-main').children[0];

    on('dashboard/loaded', function () {
        main.innerHTML = '';
        addLoader($$('#sidebar-dashboard'));
        trigger('comm/dashboard/get', {
            success: function (response) {
                removeLoader($$('#sidebar-dashboard'));
                // if (response.responseCode === message.codes.success) {
                //     createList(response.result);
                // } else {
                //     trigger('message', response.responseCode);
                // }
                main.appendChild(table.generate(parseData(response.result.activities), 'dashboard-table', false, true));
            },
            fail: function () {
                removeLoader($$('#sidebar-dashboard'));
            }
        });
    });

    function parseData(data) {
        let keys = Object.keys(data);
        let tableData = [];
        let rows = Object.keys(data[keys[0]]);
        for (let i = 0; i < rows.length; i++) {
            let row = {};
            for (let j = 0; j < keys.length; j++) {
                row['Activity'] = transformCamelToRegular(rows[i]);
                if (j === keys.length - 1 && data[keys[j]][rows[i]] > 0) {
                    row[keys[j]] = data[keys[j]][rows[i]] + '<span style="color: limegreen;float: right;">&#9650;</span>'; //If change is positive
                } else if (j === keys.length - 1 && data[keys[j]][rows[i]] < 0) {
                    row[keys[j]] = data[keys[j]][rows[i]] + '<span style="color: red;float: right;">&#9660;</span>'; //If change is negative
                } else if (j === keys.length - 1 && data[keys[j]][rows[i]] === 0) {
                    row[keys[j]] = data[keys[j]][rows[i]] + '<span style="color: sandybrown;float: right;">&#9644;</span>'; //If no change 
                } else {
                    row[keys[j]] = data[keys[j]][rows[i]];
                }
            }
            tableData.push(row);
        }
        return tableData;
    }
}();