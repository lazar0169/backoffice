$$('#datepicker').readOnly = true;

on('language/changed', function (event, data) {
    $('#datepicker').datepicker({
        dateFormat: language.getFragment('dateFormat'),
        firstDay: language.getFragment('firstDay'),
        monthNames: language.getFragment('monthNames'),
        monthNamesShort: language.getFragment('monthNamesShort'),
        dayNames: language.getFragment('dayNames'),
        dayNamesShort: language.getFragment('dayNamesShort'),
        dayNamesMin: language.getFragment('dayNamesMin')
    }).datepicker('setDate', '0');

    switch (data) {
        case 'GER':
        case 'POR':
            langCoef = 0.8;
            break;
        default:
            langCoef = 1;
            break;
    }
});

$$('#datepicker-overlay').addEventListener('click', function () {
    $('#datepicker').datepicker('show');
});

$$('#game-frame').addEventListener('hover', function () {
    $('#datepicker').datepicker('hide');
});

$('#datepicker').change(function () {
    connect();
});

$$('#prev').addEventListener('click', function () {
    navigate(1);
});

$$('#next').addEventListener('click', function () {
    navigate(0);
});

$$('#timeSlider').addEventListener('input', function () {
    selectedGame = loadedData.Result.length - this.value;
    $$('#indexPage').innerHTML = this.value;
    readFromJSON(loadedData.Result[selectedGame]);
});

document.onkeydown = function (e) {
    switch (e.which) {
        case 37:
            navigate(1);
            break;
        case 39:
            navigate(0);
            break;
    }
};

function formatBigMoney(value) {
    // Set UI chip value
    let showValue = value / 100;
    let suffix = '';
    let shouldTrim = true;
    // Trim UI chip value if needed
    if (shouldTrim) {
        let trimmedData = trimValue(showValue);
        showValue = trimmedData.value;
        suffix = trimmedData.suffix;
    }

    // In 'CASH' view round value (toFixed) since it cannot have more then 2 decimals
    return formatShowValue(trimDecimals(showValue), suffix);

    // UTILITY FUNCTIONS ----------------------------------------------------------------------------------------------------
    function trimDecimals(value) {
        let decimalCount = value.toString().indexOf('.') !== -1 ? value.toString().split('.')[1].length : 0;
        // If needed trim some decimals
        if (decimalCount > 8)
            return value.toString().slice(0, 8 - decimalCount).replace(/(\d)(?=(\d{3})+\.)/g, '$1');
        else
            return value.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1');
    }

    // Used for final UI value formating
    function formatShowValue(value, suffix) {
        // Trim zeros from right if value has sufix and decimal part
        if (suffix !== '' && value.indexOf('.') !== -1) {
            while (value[value.length - 1] === '0')
                value = value.slice(0, -1);
            if (value[value.length - 1] === '.')
                value = value.slice(0, -1);
        }

        if(value.indexOf('-') !== -1){
            let decimalCount = Number(value.toString().split('-')[1]);
            value = Number(value).toFixed(decimalCount);
        }

        // Append sufix to value
        return value + suffix;
    }
}

// Used for initial trimming
function trimValue(value) {
    // Trim if larger then million or thousand
    if (value >= 1000000000)
        return { value: value / 1000000000, suffix: 'B' };
    else if (value >= 1000000)
        return { value: value / 1000000, suffix: 'M' };
    else if (value >= 1000)
        return { value: value / 1000, suffix: 'K' };
    else
        return { value: value, suffix: '' };
}

function formatBottomLabels() {
    let maxWidth = 0;
    let bottomElements = document.querySelectorAll('.block');
    for (let i = 0; i < bottomElements.length; i++) {
        maxWidth += parseFloat(window.getComputedStyle(bottomElements[i]).width.replace('px', ''));
        maxWidth += parseFloat(window.getComputedStyle(bottomElements[i]).marginLeft.replace('px', ''));
        maxWidth += parseFloat(window.getComputedStyle(bottomElements[i]).marginRight.replace('px', ''));
    }
    if (maxWidth > parseFloat(window.getComputedStyle($$('#bottom-wrapper')).width.replace('px', ''))) {
        for (let i = 0; i < bottomElements.length; i++) {
            bottomElements[i].children[1].innerHTML = formatBigMoney(bottomElements[i].children[1].innerHTML * 100);
        }
    }
}