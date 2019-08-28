function readFromJSON(dataStructure) {
    switch (dataStructure.GameType) {
        case 1: // NORMAL SLOT GAME =======================================================================
        case 2: // FREE SPIN GAME =========================================================================
        case 6: // BONUS GAME =============================================================================
            let symbolsVisible = true;
            gameType('slot');
            resetBonus();
            $$('#game-screen').style.backgroundImage = `url("images/backgrounds/${dataStructure.GameID}.png")`;
            insertData(language.getFragment('jackpot-win'), formatMoney(dataStructure.JackpotWin, dataStructure.InternalCreditDenomination), true);
            insertData(language.getFragment('cash'), formatMoney(dataStructure.Credit, dataStructure.InternalCreditDenomination));
            insertData(language.getFragment('win'), formatMoney(dataStructure.Win, dataStructure.InternalCreditDenomination));
            insertData(language.getFragment('total-bet'), formatMoney(dataStructure.TotalBet, dataStructure.InternalCreditDenomination));
            insertData(language.getFragment('lines'), dataStructure.NumberOfLinesOrGamblingAttempts);

            if (varInArray(dataStructure.GameID, [35, 38])) { // For VikingGold and Templar's Quest show multipliers
                if (dataStructure.GameID === 38) {
                    $$('#multiplier-title').style.fontFamily = 'berlin bold';
                    $$('#multiplier-title').style.color = '#2d0004';
                }
                $$('#multiplier-title').style.visibility = 'visible';
                $$('#multiplier-canvas').style.visibility = 'visible';
                multiplierAnimator.drawMultipliers(dataStructure.Multiplier);
            }

            if (dataStructure.GameID === 27 || dataStructure.GameID === 44 || dataStructure.GameID === 48) { // For BurningIce and BurningIceDelux, just display total bet
                insertData(language.getFragment('bet'), formatMoney(dataStructure.TotalBet, dataStructure.InternalCreditDenomination));
            } else {
                insertData(language.getFragment('bet'), formatMoney(dataStructure.TotalBet / dataStructure.NumberOfLinesOrGamblingAttempts, dataStructure.InternalCreditDenomination));
            }

            $$('#timepicker').value = dataStructure.Time.substr(11, 8);

            if (dataStructure.GameType === 2) { // Free spin
                if (varInArray(dataStructure.GameID, [0, 2, 13, 15, 23, 29, 30, 31, 33, 35, 37, 51, 55])) {
                    $$('#free-spins-label').style.visibility = 'visible';
                    $$('#free-spins-text').style.visibility = 'visible';
                    $$('#free-spins-text').innerHTML = dataStructure.NumberOfGratisGame;
                    $$('#bottom-wrapper').children[2].children[1].innerHTML = formatMoney(dataStructure.FreeGamesOrDoubleUpWin, dataStructure.InternalCreditDenomination);

                    if (dataStructure.GameID === 35) { // For VikingGold show bonus multipliers
                        multiplierAnimator.drawMultipliers(dataStructure.Multiplier, true);
                    }

                    if (varInArray(dataStructure.GameID, [23, 31, 37])) { // Bonus symbol
                        $$('#bonus-symbol').style.backgroundImage = `url("images/symbols/${dataStructure.GameID}/${dataStructure.Data[15]}.png")`;
                        $$('#bonus-symbol-label').style.visibility = 'visible';
                        $$('#bonus-symbol').style.visibility = 'visible';
                    }

                    if (dataStructure.GameID === 29) { // Crystals of Magic
                        let bonusObject = JSON.parse(dataStructure.JsonData).bonusObject;
                        if (bonusObject.bonusType === 3) { // Enchantress
                            let crystalValues = ['x2', 'x10', `+50 x ${language.getFragment('bet')}`, `+500 x ${language.getFragment('bet')}`, `3 ${language.getFragment('free-spins')}`];
                            let crystalYPos = [10.6, 25.6, 40.6, 55.6, 70.6];
                            let extraBonus = bonusObject.bonusData.extraBonus;
                            let extraBonusElement = $$('#enchantress-extra');
                            if (extraBonus === 0) {
                                extraBonusElement.innerHTML = '';
                            } else {
                                extraBonusElement.innerHTML = crystalValues[extraBonus - 1];
                                extraBonusElement.style.top = `${crystalYPos[extraBonus - 1]}%`;
                            }
                            crystalsOfMagic.select('ench');
                            $$('#game-screen').style.backgroundImage = `url("images/backgrounds/${dataStructure.GameID}_free_spins_3.png")`;
                        } else if (bonusObject.bonusType === 4) { // Wizard
                            $$('#free-spins-label').style.visibility = 'hidden';
                            $$('#free-spins-text').style.visibility = 'hidden';
                            crystalsOfMagic.select('wizard');
                            $$('#game-screen').style.backgroundImage = `url("images/backgrounds/${dataStructure.GameID}_free_spins_4.png")`;
                        }
                    } else {
                        $$('#game-screen').style.backgroundImage = `url("images/backgrounds/${dataStructure.GameID}_free_spins.png")`;
                    }
                }
            } else {
                $$('#free-spins-label').style.visibility = 'hidden';
                $$('#free-spins-text').style.visibility = 'hidden';
                $$('#bonus-symbol-label').style.visibility = 'hidden';
                $$('#bonus-symbol').style.visibility = 'hidden';
            }

            if (dataStructure.GameType === 6) { // Bonus game
                let bonusObject = JSON.parse(dataStructure.JsonData).bonusObject;
                symbolsVisible = false;
                switch (dataStructure.GameID) {
                    case 29: // Crystals of Magic
                        switch (bonusObject.bonusType) {
                            case 1: // Necromancer
                                crystalsOfMagic.constructNecromancerBonus(bonusObject.bonusData, formatMoney(dataStructure.TotalBet / dataStructure.NumberOfLinesOrGamblingAttempts, dataStructure.InternalCreditDenomination));
                                break;
                            case 2: // Gnome
                                crystalsOfMagic.constructGnomeBonus(bonusObject.bonusData, formatMoney(dataStructure.TotalBet / dataStructure.NumberOfLinesOrGamblingAttempts, dataStructure.InternalCreditDenomination));
                                break;
                        }
                        break;
                    case 38: // Templar's Quest
                        switch (bonusObject.bonusType) {
                            case 1: // Coin bonus
                                let matrix = bonusObject.bonusData.fields;
                                templarsQuest.drawCoins(matrix);
                                break;
                            case 2: // Battle bonus
                                templarsQuest.battleBonus(bonusObject.bonusData, dataStructure.TotalBet / dataStructure.NumberOfLinesOrGamblingAttempts, dataStructure.InternalCreditDenomination);
                                break;
                        }
                        break;
                }
            }

            if (symbolsVisible) drawSymbols(dataStructure);
            break;

        case 5: // GAMBLE ================================================================================================
            gameType('gamble');
            $$('#game-screen').style.backgroundImage = `url("images/backgrounds/${dataStructure.GameID}_gamble.png")`;
            $$('#timepicker').value = dataStructure.Time.substr(11, 8);
            $$('#gamble-card').style.backgroundImage = newGame ? `url("images/cards/${JSON.parse(dataStructure.JsonData).pickedCardSign}.png")` : `url("images/cards/${dataStructure.Data[1]}.png")`;
            drawCards(dataStructure);

            insertData(language.getFragment('attempts'), dataStructure.NumberOfLinesOrGamblingAttempts, true);
            insertData(language.getFragment('win'), formatMoney(dataStructure.Win, dataStructure.InternalCreditDenomination));
            insertData(language.getFragment('gamble-amount'), formatMoney(dataStructure.TotalBet, dataStructure.InternalCreditDenomination));
            break;

        case 7: // ROULETTE ================================================================================================
            gameType('roulette');
            let rouletteType = 0;
            let vipRoulette = 53;
            if (dataStructure.GameID === 26) {
                $$('#board').style.backgroundImage = ' url("images/backgrounds/double-zero-board.png")';
                isAmericanRoulette = true;
            } else if (dataStructure.GameID === vipRoulette) {
                $$('#board').style.backgroundImage = ' url("images/backgrounds/roulette-board-vip.png")';
                $$('#roulette').style.backgroundImage = ' url("images/backgrounds/vip-bg.png")';
            }
            rouletteAnimator.drawChips(dataStructure.Data);
            $$('#history-line').innerHTML = '';
            insertData(language.getFragment('jackpot-win'), formatMoney(dataStructure.JackpotWin, dataStructure.InternalCreditDenomination), true);
            insertData(language.getFragment('cash'), formatMoney(dataStructure.Credit, dataStructure.InternalCreditDenomination));
            insertData(language.getFragment('win'), formatMoney(dataStructure.Win, dataStructure.InternalCreditDenomination));
            insertData(language.getFragment('total-bet'), formatMoney(dataStructure.TotalBet, dataStructure.InternalCreditDenomination));
            if (dataStructure.Win === 0 && dataStructure.TotalBet === 0) {  // In case of power down
                $$('#history-line').innerHTML = `<div id="spin-aborted">${language.getFragment('spin-aborted')}</div>`;
            } else {
                for (let j = 0; j < 3 && dataStructure.WinningNumbers[j] < 255; j++) {
                    rouletteType++;
                    $$('#history-line').innerHTML += `<img class="history-number ${dataStructure.GameID === vipRoulette ? 'vip' : ''}" src="images/numbers${dataStructure.GameID === vipRoulette ? '-vip' : ''}/${dataStructure.WinningNumbers[j]}.png">`;
                }
            }
            if (rouletteType > 1 || dataStructure.GameID === 22) {
                $$('.winning-number-title')[0].innerHTML = language.getFragment('winning-numbers');
                insertData(language.getFragment('triple-poker-bet'), formatMoney(dataStructure.TriplePokerBet, dataStructure.InternalCreditDenomination));
            }

            $$('#timepicker').value = dataStructure.Time.substr(11, 8);
            break;

        case 8: // POKER ================================================================================================
            gameType('poker');
            $$('#game-screen').style.backgroundImage = 'url("images/backgrounds/17.png")';
            let card = 0;
            for (let i = 0; i < 15; i++) {
                if (i < 10) {
                    if (i % 2 === 0) {
                        $$(`#card${card}`).src = `images/cards/${dataStructure.Data[i]}${dataStructure.Data[i + 1]}.png`;
                        card++;
                    }
                } else {
                    if (dataStructure.Data[i] === 1 && dataStructure.Win > 0) $$('#frame' + i).src = 'images/frame.png';
                    else $$('#frame' + i).src = 'images/empty.gif';
                }
            }
            $$('#timepicker').value = dataStructure.Time.substr(11, 8);

            insertData(language.getFragment('jackpot-win'), formatMoney(dataStructure.JackpotWin, dataStructure.InternalCreditDenomination), true);
            insertData(language.getFragment('cash'), formatMoney(dataStructure.Credit, dataStructure.InternalCreditDenomination));
            insertData(language.getFragment('win'), formatMoney(dataStructure.Win, dataStructure.InternalCreditDenomination));
            insertData(language.getFragment('total-bet'), formatMoney(dataStructure.TotalBet, dataStructure.InternalCreditDenomination));
            break;
    }

    formatBottomLabels();
    resizeGame();
}

function cascadeParse(allData) {
    let parsedData = [];
    for (let i = 0; i < allData.length; ++i) {
        let data = allData[i];
        let recallData = JSON.parse(data.JsonData);
        if (data.GameType === 5) { // if gamble, just push row data (without parsing) 
            parsedData.push(data);
        } else {
            for (let j = recallData.gamesData.length - 1; j >= 0; j--) {
                let element = {
                    'GameID': data.GameID,
                    'JackpotWin': data.JackpotWin,
                    'Credit': data.Credit,
                    'Win': recallData.gamesData[j].totalSum,
                    'TotalBet': data.TotalBet,
                    'NumberOfLinesOrGamblingAttempts': data.NumberOfLinesOrGamblingAttempts,
                    'Time': data.Time,
                    'GameType': data.GameType,
                    'FreeGamesOrDoubleUpWin': data.FreeGamesOrDoubleUpWin,
                    'NumberOfGratisGame': data.NumberOfGratisGame,
                    'Multiplier': j,
                    'JsonData': {
                        'symbols': recallData.gamesData[j].symbols,
                        'pickedCardSign': recallData.gamesData[j].pickedCardSign,
                        'cardsHistory': recallData.gamesData[j].cardsHistory,
                        'bonusObject': recallData.bonusObject
                    }
                };
                element.JsonData = JSON.stringify(element.JsonData); // because of parsing in DrawSymbols() function
                parsedData.push(element);
            }
        }
    }
    return parsedData;
}