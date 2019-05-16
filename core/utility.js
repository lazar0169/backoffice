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
function isMobile() {
    return navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
        || window.innerWidth < 580;
};
const IS_FIREFOX = typeof InstallTrigger !== 'undefined';
const IS_SAFARI = navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
const IS_EDGE = /Edge\/\d./i.test(navigator.userAgent);
const ARROW_UP = '&#9650;';
const ARROW_DOWN = '&#9660;';
const NEUTRAL_LINE = '&#9644;';

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
    if (_config.development) console.log(`[${new Date().toLocaleTimeString()}]:\t${typeof msg === "object" ? JSON.stringify(msg) : msg}\n`, stack);
}

let loadElements = [];

function addLoader(element) {
    if (element.getElementsByClassName('loading').length > 0) return;
    let loader = document.createElement('span');
    loader.className = 'loading';
    loader.style.marginLeft = '1em';
    element.appendChild(loader);
    let blocker = document.createElement('div');
    blocker.id = 'block-ui';
    document.body.appendChild(blocker);
    trigger('message', message.codes.loading);
}

function removeLoader(element) {
    if (!element.getElementsByClassName('loading')[0]) {
        if ($$('#block-ui')) $$('#block-ui').remove();
        return;
    };
    element.getElementsByClassName('loading')[0].remove();
    $$('#block-ui').remove();
    trigger('message/hide');
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

function randomizeNumber(maximum, minimum = 0) {
    return Math.floor(Math.random() * (maximum - minimum)) + minimum;
};

function generateColor(max = 192, min = 64) {
    return 'rgb(' + (randomizeNumber(max, min)) + ',' + (randomizeNumber(max, min)) + ',' + (randomizeNumber(max, min)) + ')';
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

function clearElement(element) {
    if (element) {
        element.parentNode.removeChild(element);
        if (events[`${element.id}/selected`]) {
            delete events[`${element.id}/selected`];
        };
        if (events[`${element.id}/collapsed`]) {
            delete events[`${element.id}/collapsed`];
        };
    }
}

function transformCamelToRegular(string) {
    let exceptions = [
        'ggr',
        'ngr',
        'vat',
        'MTD',
        'SPLM'
    ];
    string = string.toString();
    if (exceptions.includes(string)) {
        return string.toUpperCase();
    } else {
        return string
            // insert a space before all caps
            .replace(/([A-Z])/g, ' $1')
            // trim whitespace
            .trim()
            // uppercase the first character
            .replace(/^./, function (str) {
                return str.toUpperCase();
            })
    }
}

function getLocation() {
    let path = location.pathname.split('/');
    path.splice(-1, 1);
    path.join('/');
    return location.origin + path;
}

function filterPeriod(element, period = 'custom') {
    let map = {
        'custom': [0, 1, 2, 3],
        'Today': [0],
        'Yasterday': [0],
        'LastThreeDays': [0, 1],
        'LastWeek': [1],
        'LastMonth': [1, 2],
        'LastMonth': [1, 2],
        'LastQuarter': [2, 3],
        'LastYear': [2, 3]
    };

    let firstAvailable;

    for (let option of element.getElementsByClassName('option')) {
        if (map[period].includes(Number(option.dataset.value))) {
            option.style.display = 'block';
            if (!firstAvailable) firstAvailable = { value: option.dataset.value, name: option.innerText };
        } else {
            option.style.display = 'none';
        }
    }

    return firstAvailable;
}

function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}

function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

function isNumber(value) {
    if (value.replace) value = value.replace(/\s/g, '');
    if (value === '') return false;
    function check(val) {
        return typeof val === typeof Number() && !isNaN(val);
    }
    return check(value)
        || check(Number(value))
        || check(Number(value.replace(/,/g, '')))
        || value.includes('%');
}

function getToday() {
    return new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
}

function logOut() {
    location.href = getLocation();
}

function convertToNumber(value) {
    if (value.replace) value = value.replace(/\s/g, '').replace(/,/g, '').replace(/%/g, '');
    return value !== '' && !isNaN(Number(value)) ? Number(value) : value;
}

function getCopy(data) {
    return JSON.parse(JSON.stringify(data));
}