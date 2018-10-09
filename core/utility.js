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

function log(msg, code = 1) {
    // let codes = {
    //     1: '',
    //     2: 'COMMUNICATION ERROR',
    //     3: 'USER ERROR',
    // };

    // let alertCodes = [2, 3];

    // if (alertCodes.includes(code)) {
    //     trigger('notify', { message: `${codes[code]}: ${typeof msg === "object" ? JSON.stringify(msg) : msg}`, type: 3 });
    // }

    // console.log(`[${new Date().toLocaleTimeString()}] ${codes[code]}:\t${typeof msg === "object" ? JSON.stringify(msg) : msg}`);
    console.log(`[${new Date().toLocaleTimeString()}]:\t${typeof msg === "object" ? JSON.stringify(msg) : msg}`);
}