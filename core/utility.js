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
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let isFirefox = typeof InstallTrigger !== 'undefined';
let isSafari = navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
let isEdge = /Edge\/\d./i.test(navigator.userAgent);