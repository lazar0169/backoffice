let DEFAULT_ASPECT_RATIO = 16 / 9;
let langCoef = 1;

function resizeGame() {
    let mainSection = $$('#mainSection');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let currentAspectRatio = width / height;
    let realWidth = window.innerWidth;

    // Check orientation to see is it portrait or landscape
    currentAspectRatio > DEFAULT_ASPECT_RATIO ?
        width = height * DEFAULT_ASPECT_RATIO :
        height = width / DEFAULT_ASPECT_RATIO;

    // Add width and height to elements
    mainSection.style.height = height + 'px';
    mainSection.style.width = width - 1 + 'px';

    // Scroll to top to maximize the screen on iPhone on resize
    window.scrollTo(0, 0);

    // Resize elements (dynamic css - mainly font sizes and border thickness)
    resizeLabels(width, height);
    crystalsOfMagic.resize(width, height);

    trigger('game/resized', {
        width: width,
        height: height
    });

    $('#datepicker').datepicker('hide');
    if (selectedGameType === 'roulette') rouletteAnimator.resize();
}

function resizeLabels(width, height) {
    for (let controlTitle of $$('.control-title')) {
        controlTitle.style.fontSize = width * 0.02 + 'px';
    }
    $$('#pagination').style.fontSize = width * 0.02 + 'px';
    $$('#message').style.fontSize = width * 0.02 + 'px';
    for (let controlOption of $$('.control-option')) {
        controlOption.style.fontSize = width * 0.018 + 'px';
        controlOption.style.border = width * 0.0015 + 'px solid rgba(255, 255, 255, 0.8)';
        controlOption.style.borderRadius = width * 0.006 + 'px';
    }
    for (let button of $$('.button')) {
        button.style.borderRadius = width * 0.006 + 'px';
        button.style.fontSize = width * 0.02 + 'px';
    }
    $$('#controls').style.borderRight = width * 0.0018 * 'px solid #403f3f';
    $$('.ui-widget')[0].style.border = width * 0.0015 + 'px solid #c5c5c5';
    $$('.ui-widget')[0].style.borderRadius = width * 0.004 + 'px';
    $$('.winning-number-title')[0].style.fontSize = width * 0.014;
    if ($$('#spin-aborted')) {
        $$('#spin-aborted').style.fontSize = width * 0.014;
    }
    if ($$('.block')) {
        for (let block of $$('.block')) {
            block.children[0].style.fontSize = width * 0.014;
            block.children[1].style.fontSize = width * 0.024;
        }
    }
    $$('.footer-title')[0].style.fontSize = width * 0.013;
    $$('#free-spins-label').style.fontSize = `${width * 0.017}px`;
    $$('#bonus-symbol-label').style.fontSize = `${width * 0.017}px`;
    $$('#enchantress-extra').style.fontSize = `${width * 0.01}px`;
    $$('#necro-lives').style.fontSize = `${width * 0.015}px`;

    $$('#gold-amount').style.fontSize = `${width * 0.03}px`;
    $$('#selected-scroll').style.fontSize = `${width * 0.02}px`;
    for (let scroll of $$('#other-scrolls').children) {
        scroll.style.fontSize = `${width * 0.017}px`;
    }

    document.querySelectorAll('.glyphs div').forEach((element) => { element.style.fontSize = `${width * 0.01}px`; });

    let defaultFields = document.querySelectorAll('.defaultField');
    if (window.innerWidth <= 989) {  // FOR MOBILE
        for (let i = 0; i < defaultFields.length; i++) {
            defaultFields[i].style.fontSize = width * 0.027 * langCoef * langCoef + 'px';
        }
    } else { // FOR DESKTOP
        for (let i = 0; i < defaultFields.length; i++) {
            defaultFields[i].style.fontSize = width * 0.024 * langCoef * langCoef + 'px';
        }
    }

    if (window.navigator.userAgent.indexOf('Edge') > -1) {
        $$('#timeSlider').style.height = 0.05 * width;
    }
}


if (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
    for (let controlOption of $$('.control-option')) {
        controlOption.style.width = '72.5%';
    }
}

let heightIsSet = 0;

function defHeight() {
    let width = $$('#game-frame').clientWidth;
    let height = $$('#game-frame').clientHeight;
    let currentAspectRatio = width / height;
    currentAspectRatio > DEFAULT_ASPECT_RATIO ? width = height * DEFAULT_ASPECT_RATIO : height = width / DEFAULT_ASPECT_RATIO;
    return height;
}

function defWidth() {
    let width = $$('#game-frame').clientWidth;
    let height = $$('#game-frame').clientHeight;
    let currentAspectRatio = width / height;
    currentAspectRatio > DEFAULT_ASPECT_RATIO ? width = height * DEFAULT_ASPECT_RATIO : height = width / DEFAULT_ASPECT_RATIO;
    return width;
}

window.addEventListener('load', function () {
    resizeGame();
    if (/Edge\/\d./i.test(navigator.userAgent)) $$('#timeSlider').style.height = 'calc(2vmax + 2vmin)';
}, false);

window.addEventListener('resize', function () {
    resizeGame();
}, false);