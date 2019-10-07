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
                let rowCount = table.props.perPage || table.props.rowCount;
                if (rowCount > (isMobile() ? 8 : 14)) {
                    table.children[1].style.height = '400px';
                }
            }
        }
    }

    function generate(params) {
        params = params || {};
        params.dynamic = params.dynamic || false;
        params.sticky = params.sticky || false;
        params.stickyCol = params.stickyCol || false;
        params.headHidden = params.headHidden || false;
        params.sum = params.sum || false;
        params.canSearch = params.canSearch || false;
        params.perPage = params.perPage ? params.data.length < params.perPage ? params.data.length : params.perPage : params.data.length;
        params.page = params.page || 0;
        params.options = params.options || {};

        if (!params.data || params.data.length === 0) {
            console.error('Failed to generate table', params);
            let obj = document.createElement('template');
            return obj;
        } else {
            params.data = getCopy(params.data);
        }

        let colsCount = Object.keys(params.data[0]).length;
        let tbody = document.createElement('div');
        let pagination = document.createElement('div');
        let search = document.createElement('div');
        let gridTemplateColumns = '';
        let numberOfRows = 0;
        for (let fr = 0; fr < colsCount; fr++) {
            gridTemplateColumns += '1fr ';
        }
        for (let fr = params.headHidden ? 1 : 0; fr < (params.perPage + 1 || params.data.length + 1); fr++) {
            numberOfRows++;
        }
        tbody.style.gridTemplateColumns = `${gridTemplateColumns}`;
        tbody.id = params.id;
        tbody.className = 'tbody';
        pagination.className = 'pagination';
        search.className = 'search';

        let hiddenCols = {};
        let colIds = [];

        let t = document.createElement('div');
        t.className = params.sticky ? 'table sticky' : 'table';

        t.props = {
            id: params.id,
            body: tbody,
            pagination: pagination,
            search: search,
            data: params.data,
            originalData: params.data,
            colsCount: colsCount,
            rowCount: numberOfRows,
            sum: params.sum,
            colIds: colIds,
            dynamic: params.dynamic,
            sticky: params.sticky,
            stickyCol: params.stickyCol,
            options: params.options,
            perPage: params.perPage,
            paginationPerPage: params.perPage,
            page: params.page,
            pageCount: Math.ceil(params.data.length / params.perPage),
            headers: [],
            gridTemplateColumns: gridTemplateColumns
        };

        t.onclick = function (e) {
            e.stopPropagation();
        };

        t.appendChild(search);
        t.appendChild(tbody);
        t.appendChild(pagination);

        t.getHiddenCols = function () {
            return hiddenCols;
        };

        t.onChange = function () {
            return;
        };

        t.update = function (data, reset = false, overwrite = true) {
            const table = t;
            if (data === undefined) {
                data = table.props.data;
                overwrite = false;
            }
            table.props.perPage = data.length < table.props.perPage ? data.length : table.props.paginationPerPage;
            table.props.pageCount = Math.ceil(data.length / table.props.perPage);
            let gridTemplateRowsNew = '';
            for (let fr = 0; fr < (table.props.perPage + 1 || data.length + 1); fr++) {
                gridTemplateRowsNew += '1fr ';
            }
            generateBody(data, table, reset, overwrite);
        };

        t.sortCol = function (col, order = 1) {
            const table = t;
            order = convertToNumber(order);
            table.props.data.sort((a, b) => {
                if (isNumber(a[col])) {
                    return convertToNumber(a[col]) > convertToNumber(b[col]) ? order ? 1 : -1 : order ? -1 : 1;
                } else {
                    return a[col] > b[col] ? order ? 1 : -1 : order ? -1 : 1;
                }
            });
            setPage(0, table);
            table.update();
        };

        t.goToPage = function (pageNumber) {
            const table = t;
            if (pageNumber < table.props.pageCount) {
                setPage(pageNumber, table);
                table.update();
            }
        }

        t.showCol = function (id) {
            if (!hiddenCols[id]) return;
            for (let element of $$(`.col-${hiddenCols[id]}`)) {
                element.style.display = 'flex';
            }
            tbody.style.gridTemplateColumns += ' 1fr';
            delete hiddenCols[id];
            t.onChange(hiddenCols[id]);
        };

        t.search = function (term = '', col) {
            const table = t;
            const filtered = table.props.originalData.filter((row) => {
                if (col) {
                    return row[col].toString().toLowerCase().includes(term.toString().toLowerCase());
                } else {
                    for (let col of Object.keys(row)) {
                        if (row[col].toString().toLowerCase().includes(term.toString().toLowerCase())) {
                            return true;
                        }
                    }
                    return false;
                }
            });
            table.update(filtered, true, false);
        }

        for (let col = 0; col < colsCount; col++) {
            let colId = generateGuid();
            let head = document.createElement('div');
            let value = Object.keys(params.data[0])[col];
            t.props.headers.push(value);
            head.dataset.id = value;
            head.innerHTML = transformCamelToRegular(value);
            head.className = `head ${t.props.stickyCol ? 'sticky-col' : ''} cell ${params.headHidden ? 'head-hidden' : ''}`;
            head.classList.add(`col-${colId}`);
            colIds.push(colId);
            // Table can either be dynamic (with an X in header) or sortable (click on header),
            // but it can not be both due to data mutation problem (col hiding is only visual representation)
            if (t.props.dynamic) {
                let removeElem = document.createElement('div');
                removeElem.className = 'remove-btn';
                removeElem.onclick = function () {
                    for (let element of $$(`.col-${colId}`)) {
                        element.style.display = 'none';
                    }
                    hiddenCols[value] = colId;
                    tbody.style.gridTemplateColumns = tbody.style.gridTemplateColumns.split(' ').splice(1).join(' ');
                    t.onChange(colId);
                };
                head.appendChild(removeElem);
            } else {
                head.onclick = function () {
                    for (let headElement of tbody.getElementsByClassName('head')) {
                        if (headElement.dataset.id !== value && headElement.dataset.sortingOrder !== undefined) {
                            delete headElement.dataset.sortingOrder;
                            headElement.getElementsByTagName('span')[0].remove();
                        }
                    }
                    if (head.dataset.sortingOrder === undefined) {
                        head.dataset.sortingOrder = 1;
                        head.innerHTML += `<span style="color: white;float: right; margin-left: 0.8em;">${ARROW_UP}</span>`;
                    }
                    if (convertToNumber(head.dataset.sortingOrder)) {
                        head.dataset.sortingOrder = 0;
                        head.getElementsByTagName('span')[0].innerHTML = ARROW_DOWN;
                    } else {
                        head.dataset.sortingOrder = 1;
                        head.getElementsByTagName('span')[0].innerHTML = ARROW_UP;
                    }
                    t.sortCol(value, head.dataset.sortingOrder);
                };
            }
            tbody.appendChild(head);
        }

        generateBody(params.data, t);
        setPage(0, t);
        if (params.canSearch) {
            generateSearch(t);
        }
        function generateBody(data, table, reset, overwrite) {
            while (table.props.body.children.length > table.props.colsCount) {
                table.props.body.children[table.props.body.children.length - 1].remove();
            }
            if (overwrite) { table.props.originalData = getCopy(data); }
            table.props.data = getCopy(data);
            generatePagination(table);
            if (reset) { setPage(0, table); }
            if (table.props.sum) { data.push(table.props.sum); }

            for (let row = table.props.page * table.props.perPage; row <= (table.props.page + 1) * table.props.perPage; row++) {
                let rowId = generateGuid();
                for (let col = 0; col < colsCount; col++) {
                    let cell = document.createElement('div');
                    let value = '';
                    if (data[row] === undefined) continue;
                    value = data[row][Object.keys(data[row])[col]];
                    // options
                    let suffix = '';
                    let prefix = '';
                    if (table.props.options.suffix && table.props.options.suffix.text && table.props.options.suffix.col === Object.keys(params.data[row])[col]) {
                        suffix = table.props.options.suffix.condition.test(convertToNumber(value)) ? options.suffix.text : '';
                    }
                    if (table.props.options.prefix && table.props.options.prefix.text && table.props.options.prefix.col === Object.keys(data[row])[col]) {
                        prefix = table.props.options.prefix.condition.test(convertToNumber(value)) ? table.props.options.prefix.text : '';
                    }
                    if (table.props.options.onClick) {
                        cell.onclick = () => {
                            let clickedData = {};
                            let rowElements = table.props.body.getElementsByClassName(`row-${rowId}`);
                            for (let i = 0; i < rowElements.length; i++) {
                                clickedData[table.props.headers[i]] = isNumber(rowElements[i].dataset.value) ? convertToNumber(rowElements[i].dataset.value) : rowElements[i].dataset.value;
                            }
                            table.props.options.onClick(clickedData, rowId);
                        }
                    }
                    // -----
                    // value has to be splitted because at dashboard, parsed data comes in a form "335.01<span style="...">${ARROW_UP}</span>"
                    // and value must be extracted
                    if ((value || value === 0) && isNumber(value.split ? value.split('<span')[0] : value)) {
                        cell.style.justifyContent = 'flex-end';
                        cell.dataset.value = isNumber(value) ? value : convertToNumber(value.split('<span')[0]);
                    } else {
                        if (value) {
                            cell.dataset.value = isNumber(value) ? convertToNumber(value) : value;
                        }
                        else {
                            cell.dataset.value = 'NaN';
                        }
                    }
                    cell.innerHTML = prefix + (value || value === 0 ? value : 'NaN') + suffix;
                    cell.className = col === 0 ? `first ${table.props.stickyCol ? 'sticky' : ''} cell` : 'cell';
                    cell.classList.add(`row-${rowId}`);
                    if (row === data.length - 1 && table.props.sum) {
                        cell.classList.add('last');
                    }
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

        function generatePagination(table) {
            table.props.pagination.innerHTML = '';
            if (table.props.pageCount > 1) {
                for (let i = 0; i < table.props.pageCount; ++i) {
                    let page = document.createElement('a');
                    page.innerText = i + 1;
                    page.className = 'pagination-page';
                    page.onclick = function () {
                        table.goToPage(i);
                    }
                    table.props.pagination.appendChild(page);
                }
                setPage(table.props.page, table);
            }
        }

        function generateSearch(table) {
            let searchField = document.createElement('input');
            searchField.placeholder = 'Search table';
            searchField.className = 'search-input';
            searchField.addEventListener('keyup', (e) => {
                if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
                    searchField.value = '';
                }
                table.search(searchField.value);
            });
            let xButton = document.createElement('button');
            xButton.className = 'cancel';
            xButton.innerHTML = 'X';
            xButton.addEventListener('click', () => {
                table.props.search.children[0].value = '';
                table.search(table.props.search.children[0].value.value);
            })
            table.props.search.appendChild(searchField);
            table.props.search.appendChild(xButton);
        }

        function setPage(page, table) {
            let pagination = table.getElementsByClassName('pagination')[0];
            for (let page of pagination.children) {
                page.classList.remove('active');
            }
            if (table.props.pageCount > 1) {
                if (table.props.pageCount <= page) {
                    page = 0;
                }
                pagination.children[page].classList.add('active');
            }
            table.props.page = page;
        }
        return t;
    }

    return {
        generate,
        preserveHeight
    };
}();