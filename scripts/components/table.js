let table = function () {
    function generate(json, id = '', dynamic = false, sticky = false) {
        let colsCount = Object.keys(json[0]).length;
        let tbody = document.createElement('div');
        tbody.style.gridTemplateColumns = `repeat(${colsCount}, 1fr)`;
        tbody.className = 'tbody';

        for (let col = 0; col < colsCount; col++) { // Iterate through colons
            let colElem = document.createElement('div');
            colElem.className = 'table-col';
            for (let row = 0; row < json.length; row++) { // Iterate through rows
                if (row === 0) { // First row is head row
                    let headElem = document.createElement('div');
                    headElem.className = 'table-head table-cell';
                    let headTitle = document.createElement('div');
                    headTitle.innerHTML = transformCamelToRegular(Object.keys(json[row])[col]);
                    headTitle.className = 'table-head-title';
                    headElem.appendChild(headTitle);
                    if (dynamic) {
                        let removeElem = document.createElement('div');
                        removeElem.className = 'remove-btn';
                        removeElem.innerHTML = 'x';
                        removeElem.onclick = function () { tbody.style.gridTemplateColumns = tbody.style.gridTemplateColumns.split(' ').splice(1).join(' '); colElem.remove(); }
                        headElem.appendChild(removeElem);
                    }
                    colElem.appendChild(headElem);
                }
                let rowElem = document.createElement('div');
                rowElem.className = `table-cell row-${row}`;
                rowElem.innerHTML = json[row][Object.keys(json[row])[col]];
                rowElem.onmouseover = function () { for (let element of tbody.getElementsByClassName(`row-${row}`)) { element.classList.add('hover'); } };
                rowElem.onmouseout = function () { for (let element of tbody.getElementsByClassName(`row-${row}`)) { element.classList.remove('hover'); } };
                colElem.appendChild(rowElem);
            }
            tbody.appendChild(colElem);
        }

        let table = document.createElement('div');
        table.id = id;
        table.className = sticky ? 'sticky table' : 'table';
        table.appendChild(tbody);
        return table;
    }

    return {
        generate
    };
}();