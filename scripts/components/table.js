let table = function () {
    function removeCol(buttonElement) {
        buttonElement.parentNode.parentNode.parentNode.style.gridTemplateColumns = buttonElement.parentNode.parentNode.parentNode.style.gridTemplateColumns.split(" ").splice(1).join(' ');
        buttonElement.parentNode.parentNode.remove();
    }

    function hoverRow(element, index, highlight = false) {
        let table = element.parentNode.parentNode;
        for (let col of table.children) {
            col.children[index + 1].classList[highlight ? "add" : "remove"]('hover');
        }
    }

    function generate(json, id = '', dynamic = false, sticky = false) {
        let numberOfCols = Object.keys(json[0]).length;
        let tempTable = document.createElement('div');

        let col = '';
        for (let i = 0; i < numberOfCols; i++) {
            let rows = '';
            let rowIndex = 0;
            for (let row of json) {
                if (rowIndex === 0) {
                    rows += `<div class="table-head"><div class="table-head-title">${Object.keys(row)[i]}</div>${dynamic ? '<div class="remove-btn" onclick="table.removeCol(this)">x</div>' : ''}</div>`;
                }
                rows += `<div onmouseover="table.hoverRow(this, ${rowIndex}, true)" onmouseout="table.hoverRow(this, ${rowIndex}, false)">${row[Object.keys(row)[i]]}</div>`;
                rowIndex++;
            }
            col += `<div class="table-col">${rows}</div>`;
        }

        tempTable.className = `table ${sticky ? 'sticky' : ''}`;
        tempTable.innerHTML = `<div style="grid-template-columns: repeat(${numberOfCols}, 1fr)" id="${id}" class="tbody">${col}</div>`;

        return tempTable;
    }

    return {
        generate,
        hoverRow,
        removeCol
    };
}();