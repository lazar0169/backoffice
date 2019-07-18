let configuration = function () {
    let activeSection = 'roles';
    let sections = ['users', 'actions', 'roles'];
    let rolesJson = {};
    let roles = {};
    let actions = {};
    let users = {};
    let userParameters = {};
    let editMode = false;
    let openedId;
    let activeData = undefined;
    let currencyIdSelected = undefined;
    let isImaginaryCurrencySelected = false;
    let addNewCurrencyButton = $$('#configuration-add-new-currency-button');
    let createCurrencyStepButton = $$('#configuration-currency-form-create-bet-group');
    let updateMainOptionsButton = $$('#configuration-currency-update-main-options');

    //currency props
    let originalCurrencyData = undefined;
    let newCurrencyData = {};
    let dropdownAllExistingData = undefined;
    let configurationNewCurrencyForm = $$('#configuration-new-currency-form');
    let currencyJackpotSettingsBetContribution = $$('#configuration-currency-jackpot-bet-contribution');
    let currencyJackpotSettingsMinBet = $$('#configuration-currency-jackpot-min-bet');
    let currencyJackpotSettingsBaseValue = $$('#configuration-currency-jackpot-base-jackpot-value');
    let currencyJackpotSettingsMinValue = $$('#configuration-currency-jackpot-min-jackpot-value');
    let currencyJackpotSettingsMaxValue = $$('#configuration-currency-jackpot-max-jackpot-value');
    let newCurrencyCheckbox = $$('#configuration-new-currency-checkbox');
    let rouletteOptions = {
        straight: 'Straight',
        split: 'Split',
        street: 'Street',
        square: 'Square',
        sixLine: 'Six Line',
        columnAndDozen: 'Column And Dozen',
        chances: 'Chances'
    };

    const jackpotTypes = {
        '1': 'Platinum',
        '3': 'Diamond'
    };

    let currencyTable = $$(`#configuration-currency-games-table`);
    let jackpotTable = $$(`#configuration-currency-default-jackpot-settings-list`);
    let currencyTableWrapper = $$('#configuration-currency-games-table-wrapper');
    let currencyMainOptionWrapper = $$('#configuration-currency-main-options');
    let currencyJackpotOptionWrapper = $$('#configuration-currency-default-jackpot-settings-wrapper');
    let currencyJackpotSettingsOptions = $$('#configuration-currency-default-jackpot-settings-options');

    //$$('#configuration-currency-black-overlay').addEventListener('click', hideActiveModal);

    // function hideActiveModal() {
    //     if (isModalOpened) {
    //         hideCurrencyModal();
    //     }
    // }

    $$('#configuration-black-overlay').addEventListener('click', hideModal);
    $$('#configuration-profile-save-password').addEventListener('click', function (e) {
        e.preventDefault();
        let oldPassword = $$('#configuration-profile-old-password').value;
        let newPassword = $$('#configuration-profile-new-password').value;
        let repeatedPassword = $$('#configuration-profile-repeat-password').value;

        let button = this;

        if (!newPassword && !repeatedPassword || newPassword === repeatedPassword) {
            addLoader(button);
            trigger('comm/configuration/profile/password/edit', {
                body: {
                    "oldPassword": oldPassword,
                    "newPassword": newPassword,
                    "newPasswordRepeated": repeatedPassword
                },
                success: function (response) {
                    removeLoader(button);
                    if (response.responseCode === message.codes.success) {
                        location.href = getLocation();
                    } else {
                        oldPassword = '';
                        repeatedPassword = '';
                    }
                },
                fail: function (err) {
                    removeLoader(button);
                    oldPassword = '';
                    newPassword = '';
                    repeatedPassword = '';
                }
            });
        }
    });

    $$('#configuration-profile-save-profile').addEventListener('click', function (e) {
        e.preventDefault();
        let name = $$('#configuration-profile-name').value;
        let userName = $$('#configuration-profile-user-name').value;
        let email = $$('#configuration-profile-email').value;
        let phoneNumber = $$('#configuration-profile-phone').value;
        let notifications = $$('#configuration-profile-notifications').checked;

        let button = this;

        if (name !== '' && userName !== '' && email !== '' && phoneNumber !== '') {
            addLoader(button);
            trigger('comm/configuration/profile/edit', {
                body: {
                    "name": name,
                    "userName": userName,
                    "email": email,
                    "phoneNumber": phoneNumber,
                    "notifications": notifications
                },
                success: function (response) {
                    removeLoader(button);
                },
                fail: function (err) {
                    removeLoader(button);
                }
            });
        }
    });

    function hideCurrencyView() {
        currencyMainOptionWrapper.classList.add('hidden');
        currencyTableWrapper.classList.add('hidden');
        currencyJackpotOptionWrapper.classList.add('hidden');
        currencyJackpotSettingsOptions.classList.remove('show');

    }

    function showCreateCurrencyView() {
        hideCurrencyView();
        startPopoupWizard();
    }

    function updateMainOptions() {
        addLoader(updateMainOptionsButton);
        trigger('comm/currency/updateMainOptions', {
            body: {
                id: currencyIdSelected,
                denomination: $$('#configuration-currency-denomination').value,
                ratio: $$('#configuration-currency-ratio').value,
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    trigger('message', response.responseCode);
                }
                else {
                    trigger('message', response.responseCode);
                }
                removeLoader(updateMainOptionsButton);
            },
            fail: function (response) {
                removeLoader(updateMainOptionsButton);
                trigger('message', response.responseCode);
            }
        });
    }

    function startPopoupWizard() {
        $$('#configuration-currency-form-main').classList.add('hidden');
        $$('#configuration-currency-black-overlay').style.display = 'block';
        $$('#configuration-currency').children[0].style.overflow = 'hidden';
        newCurrencyMain.show();
    }

    on('configuration/profile/loaded', function () {
        $$('#configuration-currency-navbar-buttons-wrapper').classList.add('hidden');
        $$('#configuration-profile-old-password').value = '';
        $$('#configuration-profile-new-password').value = '';
        $$('#configuration-profile-repeat-password').value = '';

        addLoader($$('#configuration-navbar-profile'));
        trigger('comm/configuration/profile/get', {
            success: function (response) {
                removeLoader($$('#configuration-navbar-profile'));
                if (response.responseCode === message.codes.success) {
                    $$('#configuration-profile-name').value = response.result.name;
                    $$('#configuration-profile-user-name').value = response.result.userName;
                    $$('#configuration-profile-email').value = response.result.email;
                    $$('#configuration-profile-phone').value = response.result.phoneNumber;
                    $$('#configuration-profile-notifications').checked = JSON.parse(response.result.notifications);
                } else {
                    $$('#configuration-profile-name').value = '';
                    $$('#configuration-profile-user-name').value = '';
                    $$('#configuration-profile-email').value = '';
                    $$('#configuration-profile-phone').value = '';
                    $$('#configuration-profile-notifications').checked = false;
                }
            },
            fail: function (err) {
                removeLoader($$('#configuration-navbar-profile'));
            }
        });
    });

    let currencyUpdatePopup = function () {
        let data = undefined;
        let gameName = undefined;
        let gameId = undefined;
        let index = undefined;
        let gameType = undefined;
        let rouletteIndex = undefined;
        let configurationCurrencyForm = $$('#configuration-currency-form');
        let rouletteCheckbox = $$('#configuration-currency-game-bet-group-checkbox');
        let isRouletteSelected = false;

        const show = (steps, name, ind, id, type, rulInd) => {
            data = steps;
            gameName = name;
            index = ind;
            gameId = id;
            gameType = type;
            rouletteIndex = rulInd;
            createBetGroupList();
            $$('#configuration-currency-switch-form').classList.add('hidden');
            rouletteCheckbox.checked = false;
            isRouletteSelected = false;
            showPopup();
        };

        const hide = () => {
            if (isRouletteSelected) {
                switchToRoulett();
            }
            $$('#configuration-currency-black-overlay').style.display = 'none';
            configurationCurrencyForm.classList.remove('show');
            $$('#configuration-currency').children[0].style.overflow = 'auto';
        };

        const showPopup = () => {
            $$('#configuration-currency-form-main').classList.remove('hidden');
            $$('#game-bet-group-title').innerHTML = `${gameName} bet groups`;
            $$('#configuration-currency-eur-value').value = '';
            $$('#configuration-currency-black-overlay').style.display = 'block';
            configurationCurrencyForm.classList.add('show');
            $$('#configuration-currency').children[0].style.overflow = 'hidden';

            if (gameType !== 0) {
                $$('#configuration-currency-switch-form').classList.remove('hidden');
            }
        };

        const createBetGroupList = () => {
            let actions = $$(`#configuration-currency-form-bet-group-table`);
            if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
                actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
            }
            let body = document.createElement('tbody');

            // Header
            let trHead = document.createElement('tr');
            let thEurStep = document.createElement('th');
            let thCurrStep = document.createElement('th');
            thEurStep.innerHTML = 'EUR Step';
            thCurrStep.innerHTML = `${$$('#configuration-currency-code').value} Step`;
            trHead.appendChild(thEurStep);
            trHead.appendChild(thCurrStep);
            body.appendChild(trHead);

            for (let element of data) {
                let tr = document.createElement('tr');
                let tdEurStep = document.createElement('td');
                tdEurStep.innerHTML = element.eurBetStep;
                let tdCurrStep = document.createElement('td');
                tdCurrStep.innerHTML = element.currencyBetStep;

                tr.appendChild(tdEurStep);
                tr.appendChild(tdCurrStep);
                body.appendChild(tr);
            }
            if (gameType !== 0) {
                createRouletteList();
            }
            actions.getElementsByTagName('table')[0].appendChild(body);
            actions.classList.remove('hidden');
        };

        const createRouletteList = () => {
            let actions = $$(`#configuration-currency-games-roulette-step-table`);
            if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
                actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
            }
            let tableBody = document.createElement('tbody');

            // Header
            let trHead = document.createElement('tr');
            let thPlay = document.createElement('th');
            let thMin = document.createElement('th');
            let thMax = document.createElement('th');
            thPlay.innerHTML = 'Play';
            thMin.innerHTML = 'Min';
            thMax.innerHTML = 'Max';
            trHead.appendChild(thPlay);
            trHead.appendChild(thMin);
            trHead.appendChild(thMax);
            tableBody.appendChild(trHead);
            actions.getElementsByTagName('table')[0].appendChild(tableBody);

            for (let key in rouletteOptions) {
                let tr = document.createElement('tr');
                let tdPlay = document.createElement('td');
                let tdMin = document.createElement('td');
                let tdMax = document.createElement('td');
                tr.appendChild(tdPlay);
                tr.appendChild(tdMin);
                tr.appendChild(tdMax);
                tableBody.appendChild(tr);

                tdPlay.innerHTML = rouletteOptions[key];
                tdMin.innerHTML = activeData.currencyRoulletteBet[rouletteIndex].roulleteMinBetSettings[key];
                tdMax.innerHTML = activeData.currencyRoulletteBet[rouletteIndex].roulleteMaxBetSettings[key];
            }

            $$('#configuration-currency-roulette-max-bet').value = activeData.currencyRoulletteBet[rouletteIndex].maxBetPerTable;
            $$('#configuration-currency-roulette-max-win').value = activeData.currencyRoulletteBet[rouletteIndex].maxWinPerTable;

            if (gameType === 2) {
                $$('#configuration-currency-roulette-triple-poker-max-bet').value = activeData.currencyRoulletteBet[rouletteIndex].triplePokerMaxBet;
                $$('#configuration-currency-roulette-triple-poker-min-bet').value = activeData.currencyRoulletteBet[rouletteIndex].triplePokerMinBet;
            }

            if (gameType === 3) {
                $$('#configuration-currency-roulette-double-zero-max-bet').value = activeData.currencyRoulletteBet[rouletteIndex].doubleZeroMaxBet;
                $$('#configuration-currency-roulette-double-zero-min-bet').value = activeData.currencyRoulletteBet[rouletteIndex].doubleZeroMinBet;
            }
        };

        const saveAndUpdate = () => {
            let eur = $$('#configuration-currency-eur-value');

            addLoader(createCurrencyStepButton);
            trigger('comm/currency/convertFromEurToCurrency', {
                body: {
                    currencyId: currencyIdSelected,
                    eurBetStep: parseFloat(eur.value),
                    gameId: gameId,
                },
                success: function (response) {
                    if (response.responseCode === message.codes.success) {
                        let rowAdded = $$('#configuration-currency-form-bet-group-table').getElementsByTagName('table')[0].getElementsByTagName('tbody')[0];
                        let tr = document.createElement('tr');
                        let tdEurValue = document.createElement('td');
                        let tdCurrValue = document.createElement('td');

                        tdEurValue.innerHTML = `${eur.value}`;
                        tdCurrValue.innerHTML = `${response.result}`;

                        tr.appendChild(tdEurValue);
                        tr.appendChild(tdCurrValue);

                        rowAdded.appendChild(tr);

                        let newData = {
                            eurBetStep: parseFloat(eur.value),
                            currencyBetStep: parseFloat(response.result),
                        };
                        activeData.currencyGamesBet[index].gameBetCurrencySteps.push(newData);
                    }
                    else {
                        trigger('message', response.responseCode);
                    }
                    removeLoader(createCurrencyStepButton);
                },
                fail: function (response) {
                    trigger('message', response.responseCode);
                    removeLoader(createCurrencyStepButton);
                }
            });
        };

        const switchToRoulett = () => {
            isRouletteSelected = !isRouletteSelected;
            if (isRouletteSelected) {
                $$('#configuration-currency-regular-games-wrapper').classList.add('hidden');
                $$('#configuration-currency-roulette-games-wrapper').classList.remove('hidden');
                $$('#configuration-currency-form-save').style.display = 'none';
                if (gameType === 2) {
                    $$('#configuration-currency-roulette-type-one-inputs').classList.remove('hidden');
                }
                if (gameType === 3) {
                    $$('#configuration-currency-roulette-type-two-inputs').classList.remove('hidden');
                }
            }
            else {
                $$('#configuration-currency-regular-games-wrapper').classList.remove('hidden');
                $$('#configuration-currency-roulette-games-wrapper').classList.add('hidden');
                $$('#configuration-currency-roulette-type-one-inputs').classList.add('hidden');
                $$('#configuration-currency-roulette-type-two-inputs').classList.add('hidden');
                $$('#configuration-currency-form-save').style.display = 'flex';
            }
        };

        $$('#configuration-currency-form-save').onclick = () => {
            hide();
        }

        $$('#configuration-currency-form-cancel').addEventListener('click', hide);

        rouletteCheckbox.onclick = switchToRoulett;

        createCurrencyStepButton.onclick = () => {
            saveAndUpdate();
        };

        return {
            show: show,
            hide: hide,
            index: index,
            gameName: gameName,
            data: data,
            gameId: gameId,
            rouletteIndex: rouletteIndex,
            isRouletteSelected: isRouletteSelected
        }

    }();

    let newCurrencyMain = function () {
        let newCurrencyMainModal = $$('#configuration-currency-form-new-currency-main');

        const show = () => {
            trigger('comm/currency/getExistingCurrencies', {
                success: (response) => {
                    if (response.responseCode === message.codes.success) {
                        isImaginaryCurrencySelected = false;
                        $$('#configuration-new-currency-checkbox').checked = false;
                        $$('#configuration-new-currency-imaginary-wrapper').classList.add('hidden');
                        populateAllExistingCurrenciesDropdown(response);
                        newCurrencyMainModal.classList.remove('hidden')
                        showNewCurrencyModal();
                    }
                    else {
                        trigger('message', response.responseCode)
                    }
                },
                fail: (response) => {
                    trigger('message', response.responseCode);
                }
            });
            trigger('comm/currency/getRealCurrencies', {
                success: (response) => {
                    if (response.responseCode === message.codes.success) {
                        populateAllRealCurrenciesDropdown(response);
                    }
                    else {
                        trigger('message', response.responseCode)
                    }
                },
                fail: (response) => {
                    trigger('message', response.responseCode);
                }
            });
        };

        const hide = () => {
            newCurrencyMainModal.classList.add('hidden');
            hideNewCurrencyModal();
        };

        const updateNewCurrencyView = () => {
            if (isImaginaryCurrencySelected) {
                $$('#configuration-new-currency-imaginary-wrapper').classList.add('show');
                $$('#configuration-new-currency-imaginary-wrapper').classList.remove('hidden');
                $$('#configuration-new-currency-code').classList.remove('hidden');
                $$('#configuration-currency-existing-currency-list-wrapper').classList.add('hidden');
            }
            else {
                $$('#configuration-new-currency-imaginary-wrapper').classList.remove('show');
                $$('#configuration-new-currency-imaginary-wrapper').classList.add('hidden');
                $$('#configuration-currency-existing-currency-list-wrapper').classList.remove('hidden');
                $$('#configuration-new-currency-code').classList.add('hidden');
            }
        };

        const populateAllExistingCurrenciesDropdown = (data) => {
            clearElement($$('#configuration-currency-existing-currency-list'));
            dropdownAllExistingData = data.result;
            let parsedData = parseAllExistingCurrenciesData(data.result);
            let dropdownCurrencies = dropdown.generate(parsedData, 'configuration-currency-existing-currency-list', 'Select currency');
            $$('#configuration-currency-existing-currency-list-wrapper').appendChild(dropdownCurrencies);
            if (!data.result) $$(`#configuration-currency-existing-currency-list-wrapper`).style.display = 'none';
        };

        const populateAllRealCurrenciesDropdown = (data) => {
            clearElement($$('#configuration-currency-real-currency-list'));
            let dropdownCurrencies = dropdown.generate(data.result, 'configuration-currency-real-currency-list', 'Select currency');
            $$('#configuration-currency-real-currency-list-wrapper').appendChild(dropdownCurrencies);
            if (!data.result) $$(`#configuration-currency-real-currency-list-wrapper`).style.display = 'none';
        };

        const closeNewCurrencyPopup = () => {
            hideNewCurrencyModal();
            hide();
            newCurrencyData = {};
            $$('#configuration-new-currency-denomination').value = '';
            $$('#configuration-new-currency-bet-group').value = '';
            $$('#configuration-new-currency-ratio').value = '';
            $$('#configuration-new-currency-code').value = '';
        };

        const saveDataAndOpenNext = () => {
            newCurrencyData.createCurrencyModel = {
                currencyCode: isImaginaryCurrencySelected ? $$('#configuration-new-currency-code').value : dropdownAllExistingData[$$('#configuration-currency-existing-currency-list').getSelected()],
                denomination: $$('#configuration-new-currency-denomination').value,
                betGroupId: $$('#configuration-new-currency-bet-group').value,
                realCurrency: !isImaginaryCurrencySelected,
                realCurrencyId: isImaginaryCurrencySelected ? $$('#configuration-currency-real-currency-list').getSelected() : 0,
                realImaginaryCurrencyRatio: isImaginaryCurrencySelected ? $$('#configuration-new-currency-ratio').value : 0
            };
            newCurrencyBetStep.show();
        };

        newCurrencyCheckbox.addEventListener('click', () => {
            isImaginaryCurrencySelected = !isImaginaryCurrencySelected;
            updateNewCurrencyView();
        });

        $$('#configuration-new-currency-form-main-cancel').addEventListener('click', closeNewCurrencyPopup);
        $$('#configuration-new-currency-form-main-next').addEventListener('click', saveDataAndOpenNext);

        return {
            show: show,
            hide: hide
        }
    }();

    let newCurrencyBetStep = function () {
        let newCurrencyBetStepModal = $$('#configuration-currency-form-new-currency-games-bet-step');
        let searchBar = $$('#configuration-new-currency-games-search');
        let searchBarCancelButton = $$('#configuration-new-currency-games-remove-search');
        let searchBody = undefined;

        const show = () => {
            trigger('comm/currency/getGames', {
                success: (response) => {
                    if (response.responseCode === message.codes.success) {
                        createNewCurrencyTable(response.result);
                        newCurrencyBetStepModal.classList.add('show');
                    }
                    else {
                        trigger('message', response.responseCode)
                    }
                },
                fail: (response) => {
                    trigger('message', response.responseCode);
                }
            });
        };

        const hide = () => {
            newCurrencyBetStepModal.classList.remove('show');
        };

        const saveData = () => {
            newCurrencyData.createCurrencyModel = {
                currencyCode: $$('#configuration-new-currency-code').value,
                denomination: $$('#configuration-new-currency-denomination').value,
                betGroupId: $$('#configuration-new-currency-bet-group').value,
                realCurrency: isImaginaryCurrencySelected,
                realCurrencyId: isImaginaryCurrencySelected ? $$('#configuration-currency-real-currency-list').getSelected() : 0,
                realImaginaryCurrencyRatio: isImaginaryCurrencySelected ? $$('#configuration-currency-ratio').value : 0
            };
            trigger('comm/currency/createCurrency', {
                body: newCurrencyData,
                success: function(response) {
                    if(response.responseCode === message.code.success){
                        //TODO: finish add new currency
                    }
                        
                    trigger('message', response.responseCode)
                },
                fail: function(response){

                }
            });
            hide();
            newCurrencyMain.hide();
        };

        const createNewCurrencyTable = (data) => {
            let wrapperTable = $$(`#configuration-new-currency-games-table-wrapper`).getElementsByTagName('table')[0];
            if (wrapperTable.getElementsByTagName('tbody').length !== 0) {
                wrapperTable.getElementsByTagName('tbody')[0].remove();
            }
            let body = document.createElement('tbody');
            wrapperTable.appendChild(body);
            hideAllRows(wrapperTable);
            for (let index in data) {
                let tr = document.createElement('tr');
                let td = document.createElement('td');

                td.className = 'collapsed';
                tr.dataset.id = index;
                tr.appendChild(td);
                body.appendChild(tr);
                td.innerHTML = data[index][`name`];
                td.onclick = () => {
                    newCurrencyGameBetStep.show(data[index][`id`], data[index][`name`], data[index][`gameType`]);
                }
            }
            searchBody = body;
        };

        const searchGames = (term) => {
            for (let tableRow of searchBody.getElementsByTagName('tr')) {
                if (tableRow.innerText.toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
                    tableRow.style.display = 'table-row';
                } else {
                    tableRow.style.display = 'none';
                }
            }
        };

        const removeSearch = () => {
            searchBar.value = '';
            searchGames('');
        };

        $$('#configuration-currency-form-new-currency-games-bet-step-back').addEventListener('click', hide);
        $$('#configuration-new-currency-form-bet-group-save').addEventListener('click', saveData);
        searchBarCancelButton.addEventListener('click', removeSearch);

        searchBar.addEventListener('input', () => {
            searchGames(searchBar.value);
        });

        searchBar.addEventListener('keyup', (e) => {
            if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
                searchBar.value = '';
                searchGames('');
            }
        });

        return {
            show: show,
            hide: hide,
            searchBody: searchBody,
        }
    }();

    let newCurrencyGameBetStep = function () {
        let modal = $$('#configuration-currency-form-new-currency-game-options');
        let gameName = undefined;
        let gameId = undefined;
        let gameType = undefined;
        let tableBody = undefined;
        let isRouletteSelected = false;
        let stepsToAdd = [];

        const show = (id, name, type) => {
            gameId = id;
            gameName = name;
            gameType = type;
            stepsToAdd = [];
            showNewCurrencyGameStepModal();
            modal.classList.add('show');
        };

        const hide = () => {
            if (isRouletteSelected) {
                switchToRoulett();
            }
            $$('#configuration-new-currency-game-bet-group-checkbox').checked = false;
            $$('#configuration-new-currency-regular-games-wrapper').classList.remove('hidden');
            $$('#configuration-new-currency-roulette-games-wrapper').classList.add('hidden');
            $$('#configuration-new-currency-roulette-type-one-inputs').classList.add('hidden');
            $$('#configuration-new-currency-roulette-type-two-inputs').classList.add('hidden');
            $$('#configuration-new-currency-switch-form').classList.add('hidden');
            modal.classList.remove('show');
        };

        const showNewCurrencyGameStepModal = () => {
            if (gameType !== 0) {
                $$('#configuration-new-currency-switch-form').classList.remove('hidden');
                drawRouletteGameView();
            }

            drawRegularGameView();
        };

        const drawRegularGameView = () => {
            let actions = $$(`#configuration-new-currency-games-step-table`);
            if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
                actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
            }
            tableBody = document.createElement('tbody');

            // Header
            let trHead = document.createElement('tr');
            let thEurStep = document.createElement('th');
            thEurStep.innerHTML = 'EUR Step';
            trHead.appendChild(thEurStep);
            tableBody.appendChild(trHead);
            actions.getElementsByTagName('table')[0].appendChild(tableBody);

            let existingElement = newCurrencyData.hasOwnProperty('currencyGameBetModel') ? findCurrencyGamesBet() : undefined;
            if (existingElement) {
                for (let step of existingElement.eurBetStep) {
                    let eurTr = document.createElement('tr');
                    let eurTd = document.createElement('td');
                    eurTd.style.textAlign = "center";
                    eurTd.innerHTML = step;
                    eurTd.innerHTML += `<img src="../images/delete-icon.png" id="${gameId}-${gameName}-${gameType}-${step}" style="float: right;"/>`;
                    eurTr.appendChild(eurTd);
                    tableBody.appendChild(eurTr);
                    $$(`#${gameId}-${gameName}-${gameType}-${step}`).onclick = () => {
                        removeElementFromData(gameId, step);
                        eurTr.remove();
                    };
                }
            }
        };

        const drawRouletteGameView = () => {
            let actions = $$(`#configuration-new-currency-games-roulette-step-table`);
            if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
                actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
            }
            tableBody = document.createElement('tbody');

            // Header
            let trHead = document.createElement('tr');
            let thPlay = document.createElement('th');
            let thMin = document.createElement('th');
            let thMax = document.createElement('th');
            thPlay.innerHTML = 'Play';
            thMin.innerHTML = 'Min';
            thMax.innerHTML = 'Max';
            trHead.appendChild(thPlay);
            trHead.appendChild(thMin);
            trHead.appendChild(thMax);
            tableBody.appendChild(trHead);
            actions.getElementsByTagName('table')[0].appendChild(tableBody);

            let existingElement = newCurrencyData.hasOwnProperty('currencyRoulletteBetModel') ? findCurrencyRouletteGameBet() : undefined;
            for (let key in rouletteOptions) {
                let tr = document.createElement('tr');
                let tdPlay = document.createElement('td');
                let tdMin = document.createElement('td');
                let tdMax = document.createElement('td');
                tr.appendChild(tdPlay);
                tr.appendChild(tdMin);
                tr.appendChild(tdMax);
                tableBody.appendChild(tr);

                tdPlay.innerHTML = rouletteOptions[key];
                tdMin.innerHTML = existingElement ? existingElement.roulleteMinBetSettings[key] : '';
                tdMax.innerHTML = existingElement ? existingElement.roulleteMaxBetSettings[key] : '';
            }
            if (existingElement) {

                $$('#configuration-new-currency-roulette-max-bet').value = existingElement.maxBetPerTable;
                $$('#configuration-new-currency-roulette-max-win').value = existingElement.maxWinPerTable;

                if (gameType === 1) {
                    $$('#configuration-new-currency-roulette-triple-poker-max-bet').value = existingElement.triplePokerMaxBet;
                    $$('#configuration-new-currency-roulette-triple-poker-min-bet').value = existingElement.triplePokerMinBet;
                }

                if (gameType === 2) {
                    $$('#configuration-new-currency-roulette-double-zero-max-bet').value = existingElement.doubleZeroMaxBet;
                    $$('#configuration-new-currency-roulette-double-zero-min-bet').value = existingElement.doubleZeroMinBet
                }
            }
            else {
                if (!newCurrencyData.hasOwnProperty('currencyRoulletteBetModel')) {
                    newCurrencyData.currencyRoulletteBetModel = {};
                    newCurrencyData.currencyRoulletteBetModel.currencyRoulletteBet = [];
                }
                newCurrencyData.currencyRoulletteBetModel.currencyRoulletteBet.push({
                    gameId: gameId,
                    gameName: gameName,
                    roulleteMinBetSettings: {
                        straight: 0,
                        split: 0,
                        street: 0,
                        square: 0,
                        sixLine: 0,
                        columnAndDozen: 0,
                        chances: 0
                    },
                    roulleteMaxBetSettings: {
                        straight: 0,
                        split: 0,
                        street: 0,
                        square: 0,
                        sixLine: 0,
                        columnAndDozen: 0,
                        chances: 0
                    },
                    maxBetPerTable: 0,
                    maxWinPerTable: 0,
                    triplePokerMinBet: 0,
                    triplePokerMaxBet: 0,
                    doubleZeroMinBet: 0,
                    doubleZeroMaxBet: 0
                });
            }
        };

        const switchToRoulett = () => {
            isRouletteSelected = !isRouletteSelected;
            if (isRouletteSelected) {
                $$('#configuration-new-currency-regular-games-wrapper').classList.add('hidden');
                $$('#configuration-new-currency-roulette-games-wrapper').classList.remove('hidden');
                if (gameType === 2) {
                    $$('#configuration-new-currency-roulette-type-one-inputs').classList.remove('hidden');
                }
                else if (gameType === 3) {
                    $$('#configuration-new-currency-roulette-type-two-inputs').classList.remove('hidden');
                }
            }
            else {
                $$('#configuration-new-currency-regular-games-wrapper').classList.remove('hidden');
                $$('#configuration-new-currency-roulette-games-wrapper').classList.add('hidden');
                $$('#configuration-new-currency-roulette-type-one-inputs').classList.add('hidden');
                $$('#configuration-new-currency-roulette-type-two-inputs').classList.add('hidden');
            }
        };

        const addStepToGame = () => {
            let eurValue = $$('#configuration-new-currency-eur-value').value;
            if (eurValue) {
                let tr = document.createElement('tr');
                let eurValueTd = document.createElement('td');
                eurValueTd.innerHTML = `${eurValue}`;
                eurValueTd.style.textAlign = "center";
                eurValueTd.oldValue = `${eurValue}`;
                tr.appendChild(eurValueTd);
                tableBody.appendChild(tr);
                stepsToAdd.push(eurValue);

                eurValueTd.innerHTML += `<img src="../images/delete-icon.png" id="${gameId}-${gameName}-${gameType}-${eurValue}" style="float: right;"/>`;
                $$(`#${gameId}-${gameName}-${gameType}-${eurValue}`).onclick = () => {
                    removeElement(eurValue);
                    tr.remove();
                };
            } else {
                trigger('message', message.codes.badParameter)
            }
        };

        const removeElementFromData = (id, value) => {
            let element = findCurrencyGamesBet(id);
            element.eurBetStep.splice(element.eurBetStep.indexOf(value), 1);
        };

        const removeElement = (eur) => {
            stepsToAdd.splice(stepsToAdd.indexOf(eur), 1);
        };

        const findCurrencyGamesBet = (id = gameId) => {
            for (let el of newCurrencyData.currencyGameBetModel.currencyGamesBet) {
                if (el.gameId === id) {
                    return el;
                }
            }
        };

        const findCurrencyRouletteGameBet = (id = gameId) => {
            for (let el of newCurrencyData.currencyRoulletteBetModel.currencyRoulletteBet) {
                if (el.gameId === id) {
                    return el;
                }
            }
        };

        const saveGameOptions = () => {
            if (stepsToAdd.length > 0) {
                if (!newCurrencyData.hasOwnProperty('currencyGameBetModel')) {
                    newCurrencyData.currencyGameBetModel = {};
                    newCurrencyData.currencyGameBetModel.currencyGamesBet = [];
                }
                newCurrencyData.currencyGameBetModel.currencyGamesBet.push({
                    gameId: gameId,
                    eurBetStep: []
                });

                let element = findCurrencyGamesBet();
                for (let step of stepsToAdd) {
                    element.eurBetStep.push(step);
                }
            }
            //TODO: validation
            if (gameType !== 0) {

            }
            newCurrencyGameBetStep.hide();
        };

        $$('#configuration-new-currency-form-create-bet-group').addEventListener('click', addStepToGame);
        $$('#configuration-new-currency-game-bet-group-checkbox').addEventListener('click', switchToRoulett);
        $$('#configuration-currency-form-new-currency-games-game-options-back').addEventListener('click', hide);
        $$('#configuration-new-currency-form-game-options-save').addEventListener('click', saveGameOptions);

        return {
            show: show,
            hide: hide,
            gameName: gameName,
            gameId: gameId,
            gameType: gameType,
            tableBody: tableBody,
            stepsToAdd: stepsToAdd,
            isRouletteSelected: isRouletteSelected
        }
    }();

    // Shows modal with details for individual selection
    function showModal(section, data) {
        $$('#configuration-form-' + activeSection).classList.remove('active');

        let form = $$('#configuration-form-' + section);
        form.classList.add('active');
        activeSection = section;

        let wrapper;

        let userRole;
        let userPortals;
        let userName = $$('#configuration-user-name');
        let userUsername = $$('#configuration-user-username');
        let userPassword = $$('#configuration-user-password');
        let userRepeat = $$('#configuration-user-repeat-password');
        let userMail = $$('#configuration-user-email');
        let userPhone = $$('#configuration-user-phone');
        let userEnabled = $$('#configuration-user-enabled');

        switch (section) {
            case 'actions':
                wrapper = form.getElementsByClassName('configuration-form-table')[0];
                $$('#configuration-action-name').value = data.action.name;
                wrapper.innerHTML = generateModalData(data.rolesList);
                break;
            case 'roles':
                wrapper = form.getElementsByClassName('configuration-form-table')[0];
                $$('#configuration-role-name').value = data.role.name;
                wrapper.innerHTML = generateModalData(data.actionsList);
                break;
            case 'users':
                wrapper = form.getElementsByClassName('configuration-form-inputs')[0];
                if ($$('#configuration-user-role')) $$('#configuration-user-role').remove();
                if ($$('#configuration-user-portals')) $$('#configuration-user-portals').remove();
                wrapper.prepend(dropdown.generate(editMode ? data.portals : userParameters.portals, 'configuration-user-portals', 'Select user portals', true));
                wrapper.prepend(dropdown.generate(userParameters.roles, 'configuration-user-role'));
                userPortals = $$('#configuration-user-portals');
                userRole = $$('#configuration-user-role');
                userRole.getElementsByClassName('selected')[0].innerHTML = rolesJson[data.roleId];
                userRole.getElementsByClassName('selected')[0].dataset.value = data.roleId;
                userName.value = data.name;
                userUsername.value = data.userName;
                userPassword.value = '';
                userRepeat.value = '';
                userMail.value = data.email;
                userPhone.value = data.phoneNumber;
                userEnabled.checked = data.enabled;
                break;
        }

        for (let input of $$('#configuration-form-users').children[1].getElementsByTagName('input')) {
            input.oninput = function () {
                if (
                    !userRole.getSelected() ||
                    !userPortals.getSelectedObject() ||
                    !userName.value ||
                    !userUsername.value ||
                    (!editMode && !userPassword.value) ||
                    (!editMode && !userRepeat.value) ||
                    !userMail.value ||
                    !userPhone.value
                ) {
                    $$('#configuration-form-users-save').classList.add('disabled');
                } else {
                    $$('#configuration-form-users-save').classList.remove('disabled');
                }
            };
        }

        $$('#configuration-action-name').oninput = function () {
            if (this.value === '') {
                $$('#configuration-form-actions-save').classList.add('disabled');
            } else {
                $$('#configuration-form-actions-save').classList.remove('disabled');
            }
        };

        $$('#configuration-role-name').oninput = function () {
            if (this.value === '') {
                $$('#configuration-form-roles-save').classList.add('disabled');
            } else {
                $$('#configuration-form-roles-save').classList.remove('disabled');
            }
        };

        for (let td of form.getElementsByTagName('td')) {
            td.onclick = function (e) {
                e.stopPropagation();
                td.children[0].checked = !td.children[0].checked;
            };
        }

        if (editMode) {
            form.getElementsByClassName('configuration-form-button-wrapper')[0].classList.remove('edit');
            $$('#configuration-form-users-save').classList.remove('disabled');
            $$('#configuration-form-actions-save').classList.remove('disabled');
            $$('#configuration-form-roles-save').classList.remove('disabled');
        } else {
            form.getElementsByClassName('configuration-form-button-wrapper')[0].classList.add('edit');
            $$('#configuration-form-users-save').classList.add('disabled');
            $$('#configuration-form-actions-save').classList.add('disabled');
            $$('#configuration-form-roles-save').classList.add('disabled');
        }

        $$('#configuration-black-overlay').style.display = 'block';
        $$('#configuration-form').classList.add('show');
        $$('#configuration-main').children[0].scrollTop = 0;
        $$('#configuration-main').children[0].style.overflow = 'hidden';
    }

    //Currency right side view
    function showCurrencyView(result) {
        removeTableData();
        $$('#configuration-currency-games-table-wrapper').classList.remove('hidden');
        $$('#configuration-currency-main-options').classList.remove('hidden');
        let currencyWithBetGroup = result.currencyWithBetGroup;
        $$('#configuration-currency-code').value = currencyWithBetGroup.currencyCode;
        $$('#configuration-currency-denomination').value = currencyWithBetGroup.denomination;
        $$('#configuration-currency-bet-group').value = currencyWithBetGroup.betGroupId;
        if (!currencyWithBetGroup.realCurrency) {
            $$('#configuration-currency-imaginary-wrapper').classList.remove('hidden');

            $$('#configuration-currency-real-currency-id').value = currencyWithBetGroup.realCurrencyCode;
            $$('#configuration-currency-ratio').value = currencyWithBetGroup.realImaginaryCurrencyRatio;
        }
        else {
            $$('#configuration-currency-imaginary-wrapper').classList.add('hidden');
        }
        createTable(result);
        for (let element of result.defaultJackpotSettings) {
            element.name = jackpotTypes[`${element.jackpotTypeId}`];
            element.id = element.jackpotTypeId;
        }
        $$('#configuration-currency-default-jackpot-settings-wrapper').classList.remove('hidden');
        createList('currency-default-jackpot-settings-list', result.defaultJackpotSettings, 2);
    }

    // Generates modal checkbox list
    function generateModalData(data) {
        let table = ''
        for (let element of data) {
            let checked = element.checked ? 'checked' : '';
            let id = generateGuid();
            element = element.role || element.action || element;
            table += `<tr><td><input type="checkbox" ${checked} id=${id} data-id="${element.id}"><label for="${id}">${element.name}</label></td></tr>`;
        }
        return `<table>${table}</table>`;
    }

    function hideModal() {
        $$('#configuration-black-overlay').style.display = 'none';
        $$('#configuration-form').classList.remove('show');
        $$('#configuration-main').children[0].style.overflow = 'auto';
        for (let checkbox of $$('#configuration-form-' + activeSection).getElementsByTagName('input')) {
            checkbox.checked = false;
        }
        editMode = false;
    }

    // Creates users, action and roles list
    function createList(section, data, dataType = 0) {
        let actions = $$(`#configuration-${section}`);
        if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
            actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
        }
        let body = document.createElement('tbody');
        for (let row of data) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.innerHTML = row.name;
            tr.dataset.id = row.id;
            tr.onclick = function () {
                if (dataType === 0) {
                    trigger('configuration/show/modal', { section: section, id: this.dataset.id, caller: td });
                }
                else {
                    currencyJackpotSettingsOptions.classList.add('show');
                    currencyJackpotSettingsBetContribution.value = row.betContribution;
                    currencyJackpotSettingsMinBet.value = row.minBet;
                    currencyJackpotSettingsBaseValue.value = row.baseJackpotValue;
                    currencyJackpotSettingsMinValue.value = row.minJackpotValue;
                    currencyJackpotSettingsMaxValue.value = row.maxJackpotValue;
                }
            };
            if (section === 'users' && !row.enabled) td.classList.add('disabled-user');
            tr.appendChild(td);
            body.appendChild(tr);
        }
        actions.getElementsByTagName('table')[0].appendChild(body);
        actions.classList.remove('hidden');
    }

    function createTable(data) {
        let wrapperTable = $$(`#configuration-currency-games-table`).getElementsByTagName('table')[0];
        let body = document.createElement('tbody');
        wrapperTable.appendChild(body);
        hideAllRows(wrapperTable);
        activeData = data;
        for (let index in data.currencyGamesBet) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');

            td.className = 'collapsed';
            tr.dataset.id = index;
            tr.appendChild(td);
            body.appendChild(tr);
            td.innerHTML = data.currencyGamesBet[index].gameName;
            let rouletteIndex = findRouletteGameOptionsIndex(data.currencyGamesBet[index].gameId);
            td.onclick = () => {
                currencyUpdatePopup.show(data.currencyGamesBet[index].gameBetCurrencySteps, data.currencyGamesBet[index].gameName, index, data.currencyGamesBet[index].gameId, data.currencyGamesBet[index].gameType, rouletteIndex);
            }
        }
    }

    function findRouletteGameOptionsIndex(id) {
        for (let element in activeData.currencyRoulletteBet) {
            if (activeData.currencyRoulletteBet[element].gameId === id) {
                return element;
            }
        }
    };

    function populateCurrencyDropdown(data) {
        clearElement($$(`#configuration-currency-list`));
        let currencyDropdown = dropdown.generate(data.result, `configuration-currency-list`, 'Select currency');
        $$(`#configuration-currency-list-wrapper`).appendChild(currencyDropdown);
        if (!data.result) $$(`#configuration-currency-list-wrapper`).style.display = 'none';

        on('configuration-currency-list/selected', selectedCurrency);
    };

    const selectedCurrency = (value) => {
        currencyIdSelected = value;
        addLoader($$('#configuration-currency-list-wrapper'));
        trigger('comm/currency/readCurrency', {
            body: {
                id: value,
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    let tbody = currencyTable.getElementsByTagName('table')[1];
                    if (tbody) {
                        tbody.remove();
                    }
                    tbody = jackpotTable.getElementsByTagName('table')[1];
                    if (tbody) {
                        tbody.remove();
                    }

                    originalCurrencyData = response.result;
                    showCurrencyView(response.result);

                }
                trigger('message', response.responseCode);
                removeLoader($$('#configuration-currency-list-wrapper'));
            },
            fail: function (response) {
                removeLoader($$('#configuration-currency-list-wrapper'));
            }
        });
    }

    for (let cancelBtn of $$('.configuration-form-cancel')) {
        cancelBtn.addEventListener('click', hideModal);
    }

    for (let section of sections) {
        on(`configuration/fill/${section}`, function (data) {
            createList(section, data);
        });
    }

    // SAVE BUTTON
    for (let button of $$('.configuration-form-save')) {
        let data = {};
        let list = [];
        let section;
        button.addEventListener('click', function (e) {
            e.preventDefault();
            switch (button.dataset.section) {
                case 'actions':
                    list = [];
                    for (let td of $$('#configuration-form-actions').children[2].getElementsByTagName('td')) {
                        list.push({ checked: td.children[0].checked, role: { id: td.children[0].dataset.id, name: td.children[1].innerText } });
                    }
                    data = { action: { id: openedId === '' ? 0 : openedId, name: $$('#configuration-action-name').value }, rolesList: list };
                    section = 'actions';
                    break;
                case 'roles':
                    list = [];
                    for (let td of $$('#configuration-form-roles').children[2].getElementsByTagName('td')) {
                        list.push({ checked: td.children[0].checked, action: { id: td.children[0].dataset.id, name: td.children[1].innerText } });
                    }
                    data = { role: { id: openedId, name: $$('#configuration-role-name').value }, actionsList: list };
                    section = 'roles';
                    break;
                case 'users':
                    if (passwordsMatch()) {
                        data = {
                            userId: openedId,
                            name: $$('#configuration-user-name').value,
                            userName: $$('#configuration-user-username').value,
                            password: $$('#configuration-user-password').value,
                            email: $$('#configuration-user-email').value,
                            phoneNumber: $$('#configuration-user-phone').value,
                            enabled: $$('#configuration-user-enabled').checked,
                            roleId: $$('#configuration-user-role').getSelected(),
                            portals: $$('#configuration-user-portals').getAll()
                        };
                    } else {
                        trigger('message', message.codes.passwordsDontMatch);
                    }
                    section = 'users';
                    break;
            }

            function wait() {
                $$(`#configuration-form-${section}`).classList.add('disabled');
                $$('#configuration-black-overlay').classList.add('disabled');
                addLoader(button);
            }

            function reset() {
                $$(`#configuration-form-${section}`).classList.remove('disabled');
                $$('#configuration-black-overlay').classList.remove('disabled');
                removeLoader(button);
            }

            wait();
            log(`editMode: ${editMode}`);
            log(data);

            trigger(`comm/configuration/${section}/${editMode ? 'edit' : 'create'}`, {
                body: data,
                success: function (response) {
                    reset();
                    trigger('message', response.responseCode);
                    removeLoader($$('#sidebar-configuration'));
                    if (response.responseCode === message.codes.success) {
                        trigger('configuration/main/loaded');
                        hideModal();
                    }
                },
                fail: function (response) {
                    reset();
                }
            });
        });

        function passwordsMatch() {
            let password = $$('#configuration-user-password').value;
            let password2 = $$('#configuration-user-repeat-password').value;
            return !password && !password2 || password === password2;
        }
    }

    // REMOVE BUTTON
    for (let button of $$('.configuration-remove')) {
        button.addEventListener('click', function () {
            let section = button.dataset.section;

            function wait() {
                $$(`#configuration-form-${section}`).classList.add('disabled');
                $$('#configuration-black-overlay').classList.add('disabled');
                addLoader(button);
            }

            function reset() {
                $$(`#configuration-form-${section}`).classList.remove('disabled');
                $$('#configuration-black-overlay').classList.remove('disabled');
                removeLoader(button);
            }

            wait();
            trigger(`comm/configuration/${section}/remove/single`, {
                body: {
                    id: openedId
                },
                success: function (response) {
                    reset();
                    trigger('message', response.responseCode);
                    removeLoader($$('#sidebar-configuration'));
                    if (response.responseCode === message.codes.success) {
                        trigger('configuration/main/loaded');
                        hideModal();
                    }
                },
                fail: function (response) {
                    reset();
                }
            });
        });
    }

    // ADD NEW BUTTON
    for (let button of $$('.configuration-add-new')) {
        button.addEventListener('click', function () {
            openedId = '';
            let data = {};
            switch (button.dataset.section) {
                case 'actions':
                    data.action = {};
                    data.action.name = '';
                    data.rolesList = roles;
                    break;
                case 'roles':
                    data.role = {};
                    data.role.name = '';
                    data.actionsList = actions;
                    break;
                case 'users':
                    data.email = '';
                    data.name = '';
                    data.password = null;
                    data.phoneNumber = '';
                    data.roleId = userParameters.roles[0] ? userParameters.roles[0].id : '';
                    data.userName = '';
                    break;
            }
            showModal(button.dataset.section, data)
        });
    }

    function showNewCurrencyModal() {
        $$('#configuration-currency-black-overlay').style.display = 'block';
        configurationNewCurrencyForm.classList.add('show');
        $$('#configuration-currency').children[0].style.overflow = 'hidden';
    }

    function hideNewCurrencyModal() {
        $$('#configuration-currency-black-overlay').style.display = 'none';
        configurationNewCurrencyForm.classList.remove('show');
        $$('#configuration-currency').children[0].style.overflow = 'auto';
    }

    // SEARCH BUTTON
    for (let button of $$('.configuration-search')) {
        button.addEventListener('click', function () {
            button.parentNode.classList.add('search');
            button.parentNode.children[1].focus();
        });
    }

    for (let input of $$('.caption-search')) {
        let table = $$(`#configuration-${input.dataset.section}`).children[1];
        input.addEventListener('input', function () {
            search(table, input.value);
        });
        input.addEventListener('keyup', function (e) {
            if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
                input.value = '';
                search(table, '');
                input.parentNode.classList.remove('search');
            }
        });
        input.addEventListener('blur', function () {
            input.value = '';
            search(table, '');
            input.parentNode.classList.remove('search');
        });
    }

    function search(element, term) {
        for (let row of element.getElementsByTagName('td')) {
            if (row.innerText.toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
                row.parentNode.style.display = 'table-row';
            } else {
                row.parentNode.style.display = 'none';
            }
        }
    }

    function hideAllRows(element) {
        for (let tableRow of element.getElementsByTagName('td')) {
            tableRow.classList.add('collapsed');
            tableRow.collapsed = true;
        }
    };

    function removeTableData() {
        let tbody = currencyTable.getElementsByTagName('table')[0].getElementsByTagName('tbody');
        if (tbody.length) {
            tbody[0].remove();
        }

        tbody = jackpotTable.getElementsByTagName('table')[0].getElementsByTagName('tbody');
        if (tbody.length) {
            tbody[0].remove();
        }
    }

    function parseAllExistingCurrenciesData(data) {
        let result = [];
        for (let index in data) {
            let object = {
                name: data[index],
                id: index
            };
            result.push(object);
        }
        return result;
    }

    on('configuration/profile/loaded', function () {
        $$('#configuration-currency-navbar-buttons-wrapper').classList.add('hidden');
    });

    on('configuration/currency/loaded', function () {
        $$('#configuration-currency-navbar-buttons-wrapper').classList.remove('hidden');
        $$('#configuration-currency-list-wrapper').classList.remove('hidden');
        removeTableData();
        hideCurrencyView();

        addLoader($$('#sidebar-configuration'));
        trigger('comm/currency/getCurrencies', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    actions = response.result;
                    populateCurrencyDropdown(response);
                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader($$('#sidebar-configuration'));
            },
            fail: function () {
                removeLoader($$('#sidebar-configuration'));
            }
        });
    });

    // When configuration page is loaded
    on('configuration/main/loaded', function () {
        $$('#configuration-currency-navbar-buttons-wrapper').classList.add('hidden');
        addLoader($$('#sidebar-configuration'));
        let responses = 0;
        let asyncRequests = 4;
        trigger('comm/configuration/actions/get', {
            success: function (response) {
                responses++;
                if (responses === asyncRequests) {
                    removeLoader($$('#sidebar-configuration'));
                }
                log(response);
                if (response.responseCode === message.codes.success) {
                    actions = response.result;
                    createList('actions', response.result);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#sidebar-configuration'));
            }
        });

        trigger('comm/configuration/roles/get', {
            success: function (response) {
                responses++;
                if (responses === asyncRequests) {
                    removeLoader($$('#sidebar-configuration'));
                }
                if (response.responseCode === message.codes.success) {
                    roles = response.result;
                    createList('roles', response.result);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#sidebar-configuration'));
            }
        });

        trigger('comm/configuration/users/get', {
            success: function (response) {
                responses++;
                if (responses === asyncRequests) {
                    removeLoader($$('#sidebar-configuration'));
                }
                if (response.responseCode === message.codes.success) {
                    users = response.result;
                    createList('users', response.result);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#sidebar-configuration'));
            }
        });

        trigger('comm/configuration/parameters/get', {
            success: function (response) {
                responses++;
                if (responses === asyncRequests) {
                    removeLoader($$('#sidebar-configuration'));
                }
                if (response.responseCode === message.codes.success) {
                    userParameters = response.result;
                    rolesJson = {};
                    for (let role of response.result.roles) {
                        rolesJson[role.id] = role.name;
                    }
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#sidebar-configuration'));
            }
        });
    });

    on('configuration/show/modal', function (data) {
        addLoader(data.caller);
        trigger(`comm/configuration/${data.section}/get/single`, {
            body: {
                id: data.id
            },
            success: function (response) {
                removeLoader(data.caller);
                editMode = true;
                openedId = response.result.action ? response.result.action.id :
                    response.result.role ? response.result.role.id :
                        response.result.userId;
                showModal(data.section, response.result);
            },
            fail: function () {
                removeLoader(data.caller);
            }
        });
    });

    addNewCurrencyButton.addEventListener('click', showCreateCurrencyView);
    updateMainOptionsButton.addEventListener('click', updateMainOptions);
}();
