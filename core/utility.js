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

function log(msg) {
    var stack = new Error().stack.replace('Error', 'Callstack:');
    if (_config.development) console.log(`[${new Date().toLocaleTimeString()}]:\t${typeof msg === "object" ? JSON.stringify(msg) : msg}\n${stack}`);
}

let loadElements = [];

let blockUi = function () { return; };

function addLoader(element) {
    if (element.getElementsByClassName('loading').length > 0) return;
    let loader = document.createElement('span');
    loader.className = 'loading';
    loader.style.marginLeft = '1em';
    element.appendChild(loader);
    let blocker = document.createElement('div');
    blocker.id = 'block-ui';
    document.body.appendChild(blocker);
}

function removeLoader(element) {
    if (!element.getElementsByClassName('loading')[0]) return;
    element.getElementsByClassName('loading')[0].remove();
    $$('#block-ui').remove();
}

var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

function generateGuid() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

let sortByProperty = function (property) {
    return function (x, y) {
        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
    };
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function validateNumber(value) {
    let number = Number(value);
    return number > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : number;
}

function transformCamelToRegular(string) {
    let exceptions = [
        'ggr',
        'ngr',
        'vat',
        'MTD',
        'SPLM'
    ];
    if (exceptions.includes(string)) {
        return string.toUpperCase();
    } else {
        return string
            // insert a space before all caps
            .replace(/([A-Z])/g, ' $1')
            // uppercase the first character
            .replace(/^./, function (str) { return str.toUpperCase(); })
    }
}

function preserveTableWidth(perent) {
    for (let table of perent.getElementsByClassName('table')) {
        let height = table.children[0].offsetHeight;
        if (height < 400) {
            table.style.height = height + 20 + 'px';
        }
    }

    on('resize', function () {
        for (let table of perent.getElementsByClassName('table')) {
            let height = table.children[0].offsetHeight;
            if (height < 400) {
                table.style.height = height + 20 + 'px';
            } else {
                table.style.height = '400px';
            }
        }
    })
}