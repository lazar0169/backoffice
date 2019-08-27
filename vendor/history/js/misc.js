// USABLE FUNCTIONS ---------------------------------------------------------------------------------------------------------

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ':' + seconds;
    return strTime;
}

function $$(selector) {
    switch (selector[0]) {
        case '.':
            return document.getElementsByClassName(selector.substring(1));
        case '#':
            return document.getElementById(selector.substring(1));
        default:
            return document.getElementsByTagName(selector);
    }
};

function resetBonus() {
    $$('#gnome').classList.add('hidden');
    $$('#necromancer').classList.add('hidden');
    $$('#enchantress').classList.add('hidden');
    $$('#wizard').classList.add('hidden');
    $$('#battle-bonus').classList.add('hidden');
}

function gameType(n) {
    $$('#multiplier-title').style.visibility = 'hidden';
    $$('#multiplier-canvas').style.visibility = 'hidden';
    switch (n) {
        case 'slot':
            $$('#slots').style.visibility = 'visible';
            $$('#gamble').style.visibility = 'hidden';
            $$('#roulette').style.visibility = 'hidden';
            $$('#poker').style.visibility = 'hidden';
            $$('#free-spins-label').style.visibility = 'hidden';
            $$('#free-spins-text').style.visibility = 'hidden';
            $$('#bonus-symbol-label').style.visibility = 'hidden';
            $$('#bonus-symbol').style.visibility = 'hidden';
            selectedGameType = 'slot';
            break;
        case 'gamble':
            $$('#slots').style.visibility = 'hidden';
            $$('#gamble').style.visibility = 'visible';
            $$('#roulette').style.visibility = 'hidden';
            $$('#poker').style.visibility = 'hidden';
            $$('#free-spins-label').style.visibility = 'hidden';
            $$('#free-spins-text').style.visibility = 'hidden';
            $$('#bonus-symbol-label').style.visibility = 'hidden';
            $$('#bonus-symbol').style.visibility = 'hidden';
            selectedGameType = 'gamble';
            break;
        case 'poker':
            $$('#slots').style.visibility = 'hidden';
            $$('#gamble').style.visibility = 'hidden';
            $$('#roulette').style.visibility = 'hidden';
            $$('#poker').style.visibility = 'visible';
            $$('#free-spins-label').style.visibility = 'hidden';
            $$('#free-spins-text').style.visibility = 'hidden';
            $$('#bonus-symbol-label').style.visibility = 'hidden';
            $$('#bonus-symbol').style.visibility = 'hidden';
            selectedGameType = 'poker';
            break;
        case 'roulette':
            $$('#slots').style.visibility = 'hidden';
            $$('#gamble').style.visibility = 'hidden';
            $$('#roulette').style.visibility = 'visible';
            $$('#poker').style.visibility = 'hidden';
            $$('#free-spins-label').style.visibility = 'hidden';
            $$('#free-spins-text').style.visibility = 'hidden';
            $$('#bonus-symbol-label').style.visibility = 'hidden';
            $$('#bonus-symbol').style.visibility = 'hidden';
            selectedGameType = 'roulette';
            break;
        default:
            $$('#bottom-wrapper').innerHTML = '';
            $$('#slots').style.visibility = 'hidden';
            $$('#gamble').style.visibility = 'hidden';
            $$('#roulette').style.visibility = 'hidden';
            $$('#poker').style.visibility = 'hidden';
            $$('#free-spins-label').style.visibility = 'hidden';
            $$('#free-spins-text').style.visibility = 'hidden';
            $$('#bonus-symbol-label').style.visibility = 'hidden';
            $$('#bonus-symbol').style.visibility = 'hidden';
            selectedGameType = false;
            break;
    }
}

function varInArray(variable, array) {
    for (let i = 0; i < array.length; i++) {
        if (variable === array[i]) {
            return true;
        }
    }
    return false;
}

function getExpandingWildMatrix(matrix) {
    let result = matrix;
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i] === 12) {
            result[i % 5] = result[i % 5 + 5] = result[i % 5 + 10] = 12;
        }
    }
    return result;
}

function drawSymbols(slot) {
    let symbols = [];
    if (newGame) {
        symbols = JSON.parse(slot.JsonData).symbols;
    } else {
        symbols = slot.Data.slice();
        symbols.length = 15;
    }
    let helpClass = '';
    switch (slot.GameID) {
        case 27:
        case 42:
        case 44:
        case 47:
        case 48:
        case 52:
            helpClass = 'three-reels';
            break;
        case 28:
        case 31:
        case 32:
        case 33:
        case 34:
        case 35:
        case 36:
        case 39:
        case 40:
        case 41:
        case 43:
        case 45:
        case 46:
        case 51:
        case 54:
        case 55:
            helpClass = 'new-game';
            break;
        case 38:
            symbols = getExpandingWildMatrix(symbols);
            helpClass = 'new-game-with-gap';
            break;
        default:
            helpClass = '';
            break;
    }
    if (helpClass !== '') {
        $$('#reels').classList.add(helpClass);
    }
    $$('#reels').innerHTML = '';
    // AJAX returns 16 elements in array for slots. 15 of them are for symbols and 16th is bonus symbol
    // For some games there are less than 15 symbols so unnecessary fields are filled with 255
    for (let i = 0; i < symbols.length; i++) {
        if (symbols[i] !== 255) {
            $$('#reels').innerHTML += `<div class="symbols ${helpClass}" id="symbol${i}"></div>`;
            let element = '#symbol' + i;
            $$(element).style.backgroundImage = `url("images/symbols/${slot.GameID}/${symbols[i]}.png")`;
        }
    }
}

function drawCards(gamble) {
    for (let card of $$('.top-cards')) {
        card.style.backgroundImage = '';
    }
    if (newGame) {
        let cards = JSON.parse(gamble.JsonData).cardsHistory;
        for (let i = 0; i < cards.length; i++) {
            let element = `#gamble-card${(2 * i + 3)}`;
            $$(element).style.backgroundImage = `url("images/cards/${cards[i].Sign}.png")`;
        }
    } else {
        for (let i = 3; i < 10; i += 2) {
            let element = '#gamble-card' + i;
            $$(element).style.backgroundImage = `url("images/cards/${gamble.Data[i]}.png")`;
        }
    }
}

function insertData(title, data, overwrite) {
    if (overwrite) {
        $$('#bottom-wrapper').innerHTML = '';
    }
    $$('#bottom-wrapper').innerHTML += `<div class="block"><h3>${title}</h3><h1>${data}</h1></div>`;
}

function drawChips(betMatrix) {
    rouletteAnimator.drawChips(betMatrix);
}

function navigate(direction) {
    if (loadedData.Result !== undefined) {
        switch (direction) {
            case 0:
                if (selectedGame !== 0) {
                    selectedGame--;
                    readFromJSON(loadedData.Result[selectedGame]);
                }
                break;
            case 1:
                if (selectedGame !== loadedData.Result.length - 1) {
                    selectedGame++;
                    readFromJSON(loadedData.Result[selectedGame]);
                }
                break;
            default:
                break;
        }
        $$('#timeSlider').value = loadedData.Result.length - selectedGame;
        $$('#indexPage').innerHTML = loadedData.Result.length - selectedGame;
    }
}

function formatMoney(val, denom = 100) {
    let fixedValue = denom < Math.pow(10, 6) ? 2 : 8;
    return (val / Math.pow(10, fixedValue)).toFixed(fixedValue).replace(/(\d)(?=(\d{3})+\.)/g, '$1');
}

function selectivePreloader(gameId) {
    let total = resources[gameId].length;
    let loadedImages = [];
    let progress = 0;
    for (let i = 0; i < total; i++) {
        let image = new Image();
        image.src = resources[gameId][i];
        loadedImages[i] = image;
        progress = ((i / (total - 1)) * 100).toFixed(2);
        trigger('loading', {
            progress: progress
        });
    }
    loadedResources = loadedImages;
    trigger('loaded');
}

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