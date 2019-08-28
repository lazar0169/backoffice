//  DISABLE ZOOM ON iOS.

if (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
    document.addEventListener('touchend', function (e) {
        e.preventDefault();
        e.target.click();
    }, { passive: false });

    // DISABLE SCROLL ON SAFARI BROWSER
    if (navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
        let prevTouchY = 0;
        document.addEventListener('touchmove', function (event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            } else {
                let scrollingUp = event.pageY > prevTouchY;
                try {
                    if (typeof helpVisible !== 'undefined' && helpVisible) {
                        if (!scrollingUp && helpScreenBottomReached) {
                            event.preventDefault();
                        } else {
                            return;
                        }
                        prevTouchY = parseFloat(event.pageY.toString().slice());
                    } else if (event.target.type === 'range' || swipeUp.isShown) {
                        return;
                    } else {
                        event.preventDefault();
                    }
                } catch (error) {
                    if (event.target.type === 'range') {
                        return;
                    } else {
                        event.preventDefault();
                    }
                }
            }
        }, { passive: false });
    }

    try {
        if (navigator.platform && /iPhone|iPod/.test(navigator.platform)) {
            $$('#mainSection').style.position = 'absolute';
            $$('#mainSection').style.top = 'auto';
            $$('#mainSection').style.bottom = 'auto';
        }
    } catch (ex) {
        console.log(ex);
    }
}