// Shorter replacement for DOM selection
function $$(selector) {
    switch (selector[0]) {
        case '.':
            return document.getElementsByClassName(selector.substring(1));
        case '#':
            return document.getElementById(selector.substring(1));
        default:
            return document.getElementsByTagName(selector);
    }
}

// Global flags
let isAndroid = navigator.userAgent.toLowerCase().indexOf('android') > -1;
let isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
let isIphone = navigator.platform && /iPhone|iPod/.test(navigator.platform);
// let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let isMobile = false;
let isFirefox = typeof InstallTrigger !== 'undefined';
let isSafari = navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
let isEdge = /Edge\/\d./i.test(navigator.userAgent);

let urlData = function () {
    let data = getQueryParams(window.location.search);
    return {
        getItem: function (key) {
            if (data[key] === undefined)
                return '';
            else
                return data[key];
        }
    };
}();

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

// function generateTable(json, properties = { class: "", id: "" }, dynamic = false) {
//     let rows = '',
//         head = '<tr>';

//     for (let prop in json[0]) {
//         head += `<th><div class="table-head"><span class="table-head-title">${prop}</span>${dynamic ? '<span class="remove-btn">x</span>' : ''}<div></th>`;
//     }
//     head += '</tr>'

//     for (let row of json) {
//         let cells = '';
//         for (let cell in row) {
//             cells += `<td>${row[cell]}</td>`;
//         }
//         rows += `<tr>${cells}</tr>`;
//     }


//     if (!properties.class) properties.class = "";
//     if (!properties.id) properties.id = "";

//     return `<table id="${properties.id}" class="${properties.class}">${head}${rows}</table>`;
// }

// function removeCol(table, index) {
//     let rows = table.children[0].children;

//     for (let row of rows) {
//         row.deleteCell(index);
//     }
// }

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

function generateTable(json, id = '', dynamic = false) {
    let numberOfCols = Object.keys(json[0]).length;

    let col = '';
    for (let i = 0; i < numberOfCols; i++) {
        let rows = '';
        let rowIndex = 0;
        for (let row of json) {
            if (rowIndex === 0) {
                rows += `<div class="table-head"><div class="table-head-title">${Object.keys(row)[i]}</div>${dynamic ? '<div class="remove-btn" onclick="removeCol(this)">x</div>' : ''}</div>`;
            }
            rows += `<div onmouseover="hoverRow(this, ${rowIndex}, true)" onmouseout="hoverRow(this, ${rowIndex}, false)">${row[Object.keys(row)[i]]}</div>`;
            rowIndex++;
        }
        col += `<div class="table-col">${rows}</div>`;
    }

    return `<div class="table"><div style="grid-template-columns: repeat(${numberOfCols}, 1fr)" id="${id}" class="tbody">${col}</div></div>`;
}