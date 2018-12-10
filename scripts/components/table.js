let table = function () {
    let preserveTableEvents = {};

    function preserveHeight(element) {
        if (preserveTableEvents[element.id]) {
            off(preserveTableEvents[element.id]);
            delete preserveTableEvents[element.id];
        }

        fixHeight(element);
        let preserveEvent = on('resize', function () {
            fixHeight(element);
        });

        preserveTableEvents[element.id] = preserveEvent;

        function fixHeight(element) {
            for (let table of element.getElementsByClassName('table')) {
                let height = table.children[0].offsetHeight;
                if (height < 400) {
                    table.style.height = height + 20 + 'px';
                } else {
                    table.style.height = '400px';
                }
            }
        }
    }

    function generate(params) {
        params = params || {};
        params.dynamic = params.dynamic || false;
        params.sticky = params.sticky || false;
        params.stickyCol = params.stickyCol || false;
        params.options = params.options || {};

        if (!params.data || params.data.length === 0) {
            console.error('Failed to generate table! Invalid object passed!');
            let obj = document.createElement('template');
            return obj;
        }

        let colsCount = Object.keys(params.data[0]).length;
        let tbody = document.createElement('div');
        tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
        tbody.style.gridTemplateRows = `repeat(${params.data.length}, 1fr)`;
        tbody.id = params.id;
        tbody.className = 'tbody';

        let hiddenColls = {};
        let colIds = [];

        let t = document.createElement('div');
        t.className = params.sticky ? 'table sticky' : 'table';
        t.appendChild(tbody);

        t.getHiddenCols = function () {
            return hiddenColls;
        };

        t.onChange = function () {
            return;
        };

        t.showCol = function (id) {
            if (!hiddenColls[id]) return;
            for (let element of $$(`.col-${hiddenColls[id]}`)) {
                element.style.display = 'flex';
            }
            tbody.style.gridTemplateColumns += ' 1fr';
            delete hiddenColls[id];
            t.onChange(hiddenColls[id]);
        };

        for (let col = 0; col < colsCount; col++) {
            let colId = generateGuid();
            let head = document.createElement('div');
            head.innerHTML = transformCamelToRegular(Object.keys(params.data[0])[col]);
            head.className = `head ${params.stickyCol ? 'sticky-col' : ''} cell`;
            head.classList.add(`col-${colId}`);
            colIds.push(colId);
            if (params.dynamic) {
                let removeElem = document.createElement('div');
                removeElem.className = 'remove-btn';
                removeElem.onclick = function () {
                    for (let element of $$(`.col-${colId}`)) {
                        element.style.display = 'none';
                    }
                    hiddenColls[Object.keys(params.data[0])[col]] = colId;
                    tbody.style.gridTemplateColumns = tbody.style.gridTemplateColumns.split(' ').splice(1).join(' ');
                    t.onChange(colId);
                };
                head.appendChild(removeElem);
            }
            tbody.appendChild(head);
        }

        for (let row = 0; row < params.data.length; row++) {
            let rowId = generateGuid();
            for (let col = 0; col < colsCount; col++) {
                let cell = document.createElement('div');
                let value = params.data[row][Object.keys(params.data[row])[col]];
                // options
                let sufix = '';
                let prefix = '';
                if (params.options.sufix && params.options.sufix.text && params.options.sufix.col === Object.keys(params.data[row])[col]) {
                    sufix = params.options.sufix.condition.test(params.data[row][Object.keys(params.data[row])[col]]) ? params.options.sufix.text : '';
                }
                if (params.options.prefix && params.options.prefix.text && params.options.prefix.col === Object.keys(params.data[row])[col]) {
                    prefix = params.options.prefix.condition.test(params.data[row][Object.keys(params.data[row])[col]]) ? params.options.prefix.text : '';
                }
                // -----
                // value has to be splitted because at dashboard, parsed data comes in a form "335.01<span style="color: limegreen;float: right;">&#9650;</span>"
                // and value must be extracted
                if (isNumber(value.split ? value.split('<span')[0] : value)) {
                    cell.style.justifyContent = 'flex-end';
                }
                cell.innerHTML = prefix + value + sufix;
                cell.className = col === 0 ? `first ${params.stickyCol ? 'sticky' : ''} cell` : 'cell';
                cell.classList.add(`row-${rowId}`);
                if (row === params.data.length - 1) cell.classList.add('last');
                cell.classList.add(`col-${colIds[col]}`);
                cell.onmouseover = function () { hoverRow(`row-${rowId}`, true); };
                cell.onmouseout = function () { hoverRow(`row-${rowId}`, false); };
                tbody.appendChild(cell);
            }
        }

        function hoverRow(elements, highlight = false) {
            for (let element of document.getElementsByClassName(elements)) { element.classList[highlight ? "add" : "remove"]('hover'); }
        }

        return t;
    }

    return {
        generate,
        preserveHeight
    };
}();