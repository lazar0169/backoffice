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

    function generate(json, id = '', dynamic = false, sticky = false) {
        if (!json || json.length === 0) {
            console.error('Failed to generate table! Invalid object passed!');
            return;
        }

        let colsCount = Object.keys(json[0]).length;
        let tbody = document.createElement('div');
        tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
        tbody.style.gridTemplateRows = `repeat(${json.length}, 1fr)`;
        tbody.id = id;
        tbody.className = 'tbody';

        let hiddenColls = {};
        let colIds = [];

        let t = document.createElement('div');
        t.className = sticky ? 'table sticky' : 'table';
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
            head.innerHTML = transformCamelToRegular(Object.keys(json[0])[col]);
            head.className = 'head cell';
            head.classList.add(`col-${colId}`);
            colIds.push(colId);
            if (dynamic) {
                let removeElem = document.createElement('div');
                removeElem.className = 'remove-btn';
                removeElem.onclick = function () {
                    for (let element of $$(`.col-${colId}`)) {
                        element.style.display = 'none';
                    }
                    hiddenColls[Object.keys(json[0])[col]] = colId;
                    tbody.style.gridTemplateColumns = tbody.style.gridTemplateColumns.split(' ').splice(1).join(' ');
                    t.onChange(colId);
                };
                head.appendChild(removeElem);
            }
            tbody.appendChild(head);
        }

        for (let row = 0; row < json.length; row++) {
            let rowId = generateGuid();
            for (let col = 0; col < colsCount; col++) {
                let cell = document.createElement('div');
                cell.innerHTML = json[row][Object.keys(json[row])[col]];
                cell.className = col === 0 ? 'first cell' : 'cell';
                cell.classList.add(`row-${rowId}`);
                if (row === json.length - 1) cell.classList.add('last');
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