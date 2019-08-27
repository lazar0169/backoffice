const multiplierAnimator = function () {
    const COEFFICIENTS = [1, 2, 3, 5];
    const BONUS_COEFFICIENTS = [3, 6, 9, 15];

    let ACTIVE_COLOR = '#ffffff';     // white
    let INACTIVE_COLOR = '#b3b5b8';   // silver
    let DEFAULT_FONT = 'Arial';

    if (selectedGameId === '38') {
        DEFAULT_FONT = 'Berlin Bold';
    } else if (selectedGameId === '35') {
        ACTIVE_COLOR = '#ffdc35';     // gold
        DEFAULT_FONT = 'Norse Bold';
    }

    let canvasTitle = $$('#multiplier-title');
    let canvas = $$('#multiplier-canvas');
    let mainSection = $$('#mainSection');
    let ctx = canvas.getContext('2d');
    let lastActiveIndex = 0;
    let canvasFont;

    function drawMultipliers(activeIndex = lastActiveIndex, isBonus = false) {
        let coefficients = isBonus ? BONUS_COEFFICIENTS : COEFFICIENTS;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${canvasFont}px ${typeof DEFAULT_FONT !== 'undefined' ? DEFAULT_FONT : 'Roboto'}`;
        if (activeIndex >= coefficients.length) activeIndex = coefficients.length - 1;
        for (let i = 0; i < coefficients.length; i++) {
            i === activeIndex ? ctx.fillStyle = ACTIVE_COLOR : ctx.fillStyle = INACTIVE_COLOR;
            ctx.fillText(`x${coefficients[i]}`, canvas.width / 12 * (i * 3 + 1), (2 * canvas.height) / 3, canvas.width / 12);
        }
        lastActiveIndex = activeIndex;
    }

    function initMultiplierAnimator() {
        let width = mainSection.clientWidth;
        let height = mainSection.clientHeight;
        canvas.width = width * 0.171 * window.devicePixelRatio;
        canvas.height = height * 0.053 * window.devicePixelRatio;
        canvasFont = width * 0.014 * window.devicePixelRatio;
        canvasTitle.style.fontSize = width * 0.008 + 'px';
        canvasTitle.style.letterSpacing = width * 0.003 + 'px';
        drawMultipliers();
    }

    window.addEventListener('load', initMultiplierAnimator, false);
    window.addEventListener('resize', initMultiplierAnimator, false);

    return {
        drawMultipliers: drawMultipliers
    };
}();