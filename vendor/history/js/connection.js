let token;
let playerId;
let params = getQueryParams(window.location.search);
let selectedGameId = params['gameId'];
let loadedData = {};
let selectedGame = -1;
let selectedDate;
let selectedGameType = false;
let newGame = false;
let isAmericanRoulette = false;

let gamesList = {
    0: 'Postman',
    1: 'Deep Jungle',
    2: 'Wizard',
    3: 'Fruits and Stars',
    13: 'Wild West',
    15: 'Pyramid',
    16: 'Roulette',
    17: 'Poker',
    19: 'Diamonds',
    20: 'Juicy Hot',
    21: 'Hot Stars',
    22: 'Triple Crown Roulette',
    23: 'Book of Spells',
    24: 'Mega Hot',
    25: 'Live European Roulette',
    26: 'Live American Roulette',
    27: 'Burning Ice',
    28: 'Turbo Hot 40',
    29: 'Crystals Of Magic',
    30: 'Pirates',
    31: 'Book of Bruno',
    32: 'Tropical Hot',
    33: 'Monsters',
    34: 'Forest Fruits',
    35: 'Viking Gold',
    36: 'Star Gems',
    37: 'Book of Spells',
    38: 'Templar\'s Quest',
    39: 'Space Guardians',
    40: '5 Neon Hot',
    41: 'Starlight',
    42: 'Triple Hot',
    43: 'Crystal Hot 40',
    44: 'Burning Ice Deluxe',
    45: '5 Neon Dice',
    46: 'Turbo Dice 40',
    47: 'Triple Dice',
    48: 'Flashing Dice',
    51: 'Katanas of Time',
    52: 'Retro 7 Hot',
    53: 'VIP Roulette',
    54: 'Star Runner',
    55: 'Aloha Charm'
};

/*
    IMPORTANT: New game essential updates:
    - connection.js in gameList json;
    - misc.js in drawSymbols() function;
    - references.js at the bottom;
    - in images/symbols folder;
    - in images/background folder;  
 */

$$('#games').value = gamesList[selectedGameId];

// MAIN CONNECTION -----------------------------------------------------------------------------------------------------
function connect(data) {
    gameType(0);
    loadedData = {};
    const today = new Date();
    const selectedDate = new Date(params['selectedDate']);
    const diffTime = Math.abs(today.getTime() - selectedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
    $('#datepicker').datepicker('setDate', -diffDays);
    if (data.ErrorOccured) {
        $$('#message').innerHTML = data.ExceptionMessage;
        $$('#indexPage').innerHTML = '0';
        $$('#totalPages').innerHTML = '0';
        $$('#timeSlider').max = 1;
        $$('#timeSlider').value = 1;
        selectedGame = -1;
    } else if (data.Result.length === 0) {
        $$('#indexPage').innerHTML = '0';
        $$('#totalPages').innerHTML = '0';
        $$('#timeSlider').max = 1;
        $$('#timeSlider').value = 1;
        $$('#game-screen').style.backgroundImage = '';
        $$('#message').innerHTML = language.getFragment('no-history-message');
    } else {
        loadedData = data;
        if (varInArray(loadedData.Result[0].GameID, [35, 38])) {
            loadedData.Result = cascadeParse(loadedData.Result);
        }
        newGame = !(loadedData.Result[0].JsonData === null ||
            loadedData.Result[0].JsonData === 'null' ||
            loadedData.Result[0].JsonData === undefined);
        selectedGame = 0;
        selectivePreloader(loadedData.Result[0].GameID);
    }
    // if (connectionFail) {
    //     selectedGame = -1;
    //     gameType('none');
    //     $$('#indexPage').innerHTML = '0';
    //     $$('#totalPages').innerHTML = '0';
    //     $$('#timeSlider').max = 1;
    //     $$('#timeSlider').value = 1;
    //     $$('#message').innerHTML = language.getFragment('error-message');
    //     $$('#game-screen').style.backgroundImage = '';
    // }
}

on('loaded', function () {
    $$('#message').innerHTML = '';
    $$('#indexPage').innerHTML = loadedData.Result.length - selectedGame;
    $$('#totalPages').innerHTML = loadedData.Result.length;
    readFromJSON(loadedData.Result[0]);
    $$('#timeSlider').max = loadedData.Result.length;
    $$('#timeSlider').value = loadedData.Result.length;
    resizeGame();
});

// window.addEventListener('load', function () {
//     connect();
// }, false);

window.addEventListener('message', function (event) {
    connect(event.data);
}, false);