let templarsQuest = function () {
    let reels = $$('#reels');
    let multiplierTitle = $$('#multiplier-title');
    let multiplierCanvas = $$('#multiplier-canvas');

    function drawCoins(matrix) {
        reels.innerHTML = '';
        reels.classList.add('new-game-with-gap');
        multiplierTitle.style.visibility = 'hidden';
        multiplierCanvas.style.visibility = 'hidden';
        $$('#game-screen').style.backgroundImage = 'url("images/bonus/TemplarsQuest/CoinHunt/bonus-background.png")';
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[i] !== 255) {
                reels.innerHTML += `<div class="symbols new-game-with-gap" id="symbol${i}"></div>`;
                $$(`#symbol${i}`).style.backgroundImage = `url("images/bonus/TemplarsQuest/CoinHunt/${matrix[i]}.png")`;
            }
        }
    }

    function livesLeft(number, self = true) {
        let bar = self ? $$('#lives') : $$('#enemy-lives');
        for (let i = 0; i < bar.children.length; i++) {
            (self ? i >= number : i < bar.children.length - number) ?
                bar.children[i].classList.add('kill') :
                bar.children[i].classList.remove('kill');
        }
    }

    function battleBonus(data, bet, denom) {
        $$('#battle-bonus').classList.remove('hidden');
        multiplierTitle.style.visibility = 'hidden';
        multiplierCanvas.style.visibility = 'hidden';
        livesLeft(data.lifesLeft, true);
        livesLeft(data.opponentLifesLeft, false);
        switch (data.gameType) {
            case 1: // Money bag
                $$('#scrolls').classList.add('hidden');
                $$('#battle').classList.add('hidden');
                $$('#gold').classList.remove('hidden');
                let moneyWon = formatMoney(data.stepData.win * bet, denom);
                $$('#gold-amount').innerHTML = moneyWon;
                break;
            case 2: // Scroll
                $$('#scrolls').classList.remove('hidden');
                $$('#battle').classList.add('hidden');
                $$('#gold').classList.add('hidden');
                let selectedField = formatMoney(data.stepData.selectedField * bet, denom);
                let fields = data.stepData.otherFields.map(value => formatMoney(value * bet, denom));
                $$('#selected-scroll').innerHTML = selectedField;
                for (let scroll = 0; scroll < $$('#other-scrolls').children.length; scroll++) {
                    $$('#other-scrolls').children[scroll].innerHTML = fields[scroll];
                }
                break;
            case 3: // Battle
                $$('#scrolls').classList.add('hidden');
                $$('#battle').classList.remove('hidden');
                $$('#gold').classList.add('hidden');
                let isWin = data.stepData.battleWon;
                $$('#battle-symbol').style.backgroundImage = `url('images/bonus/TemplarsQuest/Battle/${isWin ? 'battle-win' : 'battle-lose'}.png')`;
                break;
        }
    }

    return {
        drawCoins: drawCoins,
        battleBonus: battleBonus
    };
}();