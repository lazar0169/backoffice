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
                let rowCount = table.children[0].style.gridTemplateRows.replace(/\s/g, '').replace(/fr/g, '').length;
                if (rowCount < 14) {
                    table.style.height = rowCount * 29 + 'px';
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
        let gridTemplateColumns = '';
        let gridTemplateRows = '';
        for (let fr = 0; fr < colsCount; fr++) {
            gridTemplateColumns += '1fr ';
        }
        for (let fr = 0; fr < params.data.length + 1; fr++) {
            gridTemplateRows += '1fr ';
        }
        tbody.style.gridTemplateColumns = `${gridTemplateColumns}`;
        tbody.style.gridTemplateRows = `${gridTemplateRows}`;
        tbody.id = params.id;
        tbody.className = 'tbody';

        let hiddenCols = {};
        let colIds = [];

        let t = document.createElement('div');
        t.className = params.sticky ? 'table sticky' : 'table';

        t.props = {
            id: params.id,
            body: tbody,
            colsCount: colsCount,
            colIds: colIds,
            dynamic: params.dynamic,
            sticky: params.sticky,
            stickyCol: params.stickyCol,
            options: params.options,
            gridTemplateColumns: gridTemplateColumns,
            gridTemplateRows: gridTemplateRows
        };

        t.appendChild(tbody);

        t.getHiddenCols = function () {
            return hiddenCols;
        };

        t.onChange = function () {
            return;
        };

        t.update = function (data) {
            let table = t;
            let gridTemplateRowsNew = '';
            for (let fr = 0; fr < data.length + 1; fr++) {
                gridTemplateRowsNew += '1fr ';
            }
            table.props.body.style.gridTemplateRows = `${gridTemplateRowsNew}`;
            generateBody(data, table);
        };

        t.showCol = function (id) {
            if (!hiddenCols[id]) return;
            for (let element of $$(`.col-${hiddenCols[id]}`)) {
                element.style.display = 'flex';
            }
            tbody.style.gridTemplateColumns += ' 1fr';
            delete hiddenCols[id];
            t.onChange(hiddenCols[id]);
        };

        for (let col = 0; col < colsCount; col++) {
            let colId = generateGuid();
            let head = document.createElement('div');
            head.innerHTML = transformCamelToRegular(Object.keys(params.data[0])[col]);
            head.className = `head ${t.props.stickyCol ? 'sticky-col' : ''} cell`;
            head.classList.add(`col-${colId}`);
            colIds.push(colId);
            if (t.props.dynamic) {
                let removeElem = document.createElement('div');
                removeElem.className = 'remove-btn';
                removeElem.onclick = function () {
                    for (let element of $$(`.col-${colId}`)) {
                        element.style.display = 'none';
                    }
                    hiddenCols[Object.keys(params.data[0])[col]] = colId;
                    tbody.style.gridTemplateColumns = tbody.style.gridTemplateColumns.split(' ').splice(1).join(' ');
                    t.onChange(colId);
                };
                head.appendChild(removeElem);
            }
            tbody.appendChild(head);
        }

        generateBody(params.data, t);

        function generateBody(data, table) {
            while (table.props.body.children.length > table.props.colsCount) {
                table.props.body.children[table.props.body.children.length - 1].remove();
            }
            for (let row = 0; row < data.length; row++) {
                let rowId = generateGuid();
                for (let col = 0; col < colsCount; col++) {
                    let cell = document.createElement('div');
                    let value = data[row][Object.keys(data[row])[col]];
                    // options
                    let suffix = '';
                    let prefix = '';
                    if (table.props.options.suffix && table.props.options.suffix.text && table.props.options.suffix.col === Object.keys(params.data[row])[col]) {
                        suffix = table.props.options.suffix.condition.test(convertToNumber(data[row][Object.keys(data[row])[col]])) ? options.suffix.text : '';
                    }
                    if (table.props.options.prefix && table.props.options.prefix.text && table.props.options.prefix.col === Object.keys(data[row])[col]) {
                        prefix = table.props.options.prefix.condition.test(convertToNumber(data[row][Object.keys(data[row])[col]])) ? table.props.options.prefix.text : '';
                    }
                    // -----
                    // value has to be splitted because at dashboard, parsed data comes in a form "335.01<span style="...">&#9650;</span>"
                    // and value must be extracted
                    if (value && isNumber(value.split ? value.split('<span')[0] : value)) {
                        cell.style.justifyContent = 'flex-end';
                    }
                    cell.innerHTML = prefix + value + suffix;
                    cell.className = col === 0 ? `first ${table.props.stickyCol ? 'sticky' : ''} cell` : 'cell';
                    cell.classList.add(`row-${rowId}`);
                    if (row === data.length - 1) cell.classList.add('last');
                    cell.classList.add(`col-${table.props.colIds[col]}`);
                    cell.onmouseover = function () { hoverRow(`row-${rowId}`, true); };
                    cell.onmouseout = function () { hoverRow(`row-${rowId}`, false); };
                    table.props.body.appendChild(cell);
                }
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