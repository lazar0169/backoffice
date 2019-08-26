let operators = function () {
    let openedOperatorId;
    let editMode = false;
    let editModePortal = false;
    let timeZones = [];
    let currencies = []; // userd for portals
    let defaultCurrencies = []; // userd for operators
    let availableCurrencies = [];
    let integrationTypes = [];
    let currenciesModel = {};
    let defaultJackpotSettings = {};
    let operatorData = {};
    let openedPortalData = {};
    let selectedRow;
    let isModalOpened = false;

    let templateOperatorData = {
        operator: {
            id: 0,
            name: ''
        },
        currencyId: 0,
        timeZoneId: 0,
        portalSettingsList: [],
        games: [],
        enabled: false
    };

    $$('#operators-black-overlay').addEventListener('click', hideModal);
    $$('#operators-form-cancel').addEventListener('click', hideModal);
    $$('#operators-form-portal-back').addEventListener('click', function () { portalModal.hide(); });
    $$('#operators-form-jackpot-back').addEventListener('click', function () { jackpotModal.hide(); });
    $$('#operators-form-create').addEventListener('click', function () {
        portalModal.show();
    });

    $$('#operators-add-new').addEventListener('click', function () {
        operatorData = getCopy(templateOperatorData);
        showModal(operatorData);
    });

    on('operators/main/loaded', function () {
        addLoader($$('#sidebar-operators'));
        let input = $$('#operators-main-search');
        input.value = '';
        let operatorsList;
        trigger('comm/operators/get', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    operatorsList = response.result;
                    trigger('comm/operators/parameters/get', {
                        success: function (response) {
                            removeLoader($$('#sidebar-operators'));
                            if (response.responseCode === message.codes.success) {
                                templateOperatorData.games = response.result.games;
                                timeZones = response.result.timeZones;
                                currencies = response.result.currencies;
                                defaultCurrencies = response.result.defaultCurrencies;
                                if (defaultCurrencies.length === 0) defaultCurrencies = currencies;
                                currenciesModel = {};
                                for (let currency of currencies) {
                                    currenciesModel[currency.id] = currency.name;
                                }
                                defaultJackpotSettings = response.result.defaultJackpotSettings;
                                integrationTypes = response.result.integrationTypes.map(integration => {
                                    return {
                                        name: integration,
                                        id: integration
                                    }
                                });
                                createList(operatorsList);
                            } else {
                                trigger('message', response.responseCode);
                            }
                        },
                        fail: function () {
                            removeLoader($$('#sidebar-operators'));
                        }
                    });
                }
                else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#sidebar-operators'));
            }
        });
    });

    // Shows modal with details for individual selection
    function showModal(data) {
        if (!data) {
            trigger('message', message.codes.badParameter);
            return;
        }
        operatorData = data;
        let form = $$('#operators-form');
        let currencyTimezoneWrapper = $$('#operator-currency-timezone');
        let gamesWrapper = $$('#operators-games-wrapper');
        let portalsWrapper = $$('#operators-portals');
        gamesWrapper.innerHTML = '';
        portalsWrapper.innerHTML = '';
        currencyTimezoneWrapper.innerHTML = '';

        filterCurrencies();

        $$('#operator-name').addEventListener('input', function () {
            if (this.value === '' || $$('#operators-portals').children[0].children.length === 0) {
                $$('#operators-form-save').classList.add('disabled');
            } else {
                $$('#operators-form-save').classList.remove('disabled');
            }
        });

        currencyTimezoneWrapper.appendChild(dropdown.generate(defaultCurrencies, 'operator-currency-code', 'Select currency'));
        currencyTimezoneWrapper.appendChild(dropdown.generate(timeZones, 'operator-timezone-code', 'Select timezone'));

        if (editMode) {
            $$('#operator-currency-code').children[0].innerHTML = operatorData.currencyCode;
            $$('#operator-timezone-code').children[0].innerHTML = operatorData.timeZoneCode;
            $$('#operator-currency-code').children[0].dataset.value = defaultCurrencies.filter((currency) => currency.name === operatorData.currencyCode)[0].id;
            $$('#operator-timezone-code').children[0].dataset.value = timeZones.filter((zone) => zone.name === operatorData.timeZoneCode)[0].id;
            $$('#operator-currency-code').classList.add('disabled');
            $$('#operator-timezone-code').classList.add('disabled');
            $$('#operator-name').classList.add('disabled');
            $$('#operators-form-save').classList.remove('disabled');
            $$('#operators-operator-enabled').checked = operatorData.operator.enabled;

            $$('#operator-name').value = operatorData.operator.name;

            $$('#operators-form-button-wrapper').classList.remove('edit');

        } else {
            openedOperatorId = '';
            $$('#operators-form-save').classList.add('disabled');

            $$('#operator-currency-code').classList.remove('disabled');
            $$('#operator-timezone-code').classList.remove('disabled');
            $$('#operator-name').classList.remove('disabled');

            $$('#operator-name').value = '';
            $$('#operators-form-button-wrapper').classList.add('edit');
            $$('#operators-operator-enabled').checked = true;
        }

        $$('#operators-form-save').onclick = function () {
            let button = this;

            operatorData.currencyId = Number($$('#operator-currency-code').children[0].dataset.value);
            operatorData.timeZoneId = Number($$('#operator-timezone-code').children[0].dataset.value);

            operatorData.operator.name = $$('#operator-name').value;

            operatorData.games = gamesWrapper.children[0].getSelectedObject().map((option) => {
                return {
                    checked: option.checked,
                    game: {
                        id: option.id,
                        name: option.name
                    }
                }
            });

            operatorData.operator.enabled = $$('#operators-operator-enabled').checked;

            addLoader(button);
            trigger(`comm/operators/${editMode ? 'edit' : 'create'}`, {
                body: operatorData,
                success: function (response) {
                    removeLoader(button);
                    if (response.responseCode === message.codes.success) {
                        if (editMode) trigger('message', message.codes.newOperator);
                        hideModal();
                        trigger('operators/main/loaded');
                    } else {
                        trigger('message', response.responseCode);
                    }
                },
                fail: function () {
                    removeLoader(button);
                }
            });

        };

        let games = operatorData.games.map((game) => {
            return {
                checked: game.checked,
                id: game.game.id,
                name: game.game.name
            };
        });

        gamesWrapper.appendChild(dropdown.generate(games, 'operators-games', 'Select games', true));
        portalsWrapper.appendChild(generatePortalsTable(operatorData.portalSettingsList));

        $$('#operators-black-overlay').style.display = 'block';
        form.classList.add('show');
        $$('#operators-main').children[0].style.overflow = 'hidden';
    }

    function hideModal() {
        $$('#operators-black-overlay').style.display = 'none';
        $$('#operators-form').classList.remove('show');
        $$('#operators-main').children[0].style.overflow = 'auto';
        for (let checkbox of $$('#operators-games').getElementsByTagName('input')) {
            checkbox.checked = false;
        }
        portalModal.hide();
        jackpotModal.hide();
        if (selectedRow) {
            selectedRow.classList.remove('hover');
        }
        editMode = false;
    }

    let portalModal = function () {
        let modal = $$('#operators-form-portal');
        let operatorsCurrencyWrapper = $$('#operators-portal-currency');
        let gameLaunchURL = $$('#operator-game-launch-url');
        let userName = $$('#operator-user-name');
        let password = $$('#operator-password');
        let integrationTypeWrapper = $$('#operator-integration-type');
        let warningActiveCredit = $$('#operator-warning-active-credit');
        let blockingActiveCredit = $$('#operator-blocking-active-credit');
        return {
            show: function (element, index) {
                operatorsCurrencyWrapper.innerHTML = '';
                integrationTypeWrapper.innerHTML = '';
                integrationTypeWrapper.appendChild(dropdown.generate(integrationTypes, 'operator-integration-type', 'Integration Type'));
                if (editModePortal) {
                    operatorsCurrencyWrapper.appendChild(dropdown.generate(currencies, 'operator-portal-currency-code', 'Select currency'));
                    openedPortalData = element;
                    integrationTypeWrapper.children[0].children[0].innerHTML = element.integrationType;
                    integrationTypeWrapper.children[0].children[0].dataset.value = element.integrationType;
                    gameLaunchURL.value = element.gameLaunchURL;
                    userName.value = element.userName;
                    password.value = element.password;
                    warningActiveCredit.value = element.warningActiveCredit;
                    blockingActiveCredit.value = element.blockingActiveCredit;
                    operatorsCurrencyWrapper.children[0].children[0].innerHTML = currenciesModel[element.currencyId];
                    operatorsCurrencyWrapper.children[0].children[0].dataset.value = element.currencyId;
                    operatorsCurrencyWrapper.children[0].classList.add('disabled');
                    integrationTypeWrapper.children[0].classList.add('disabled');
                    $$('#operators-operator-form-enabled').checked = element.enabled;
                } else {
                    operatorsCurrencyWrapper.appendChild(dropdown.generate(availableCurrencies, 'operator-portal-currency-code', 'Select currency'));
                    let currencyId = $$('#operator-currency-code').children[0].dataset.value;
                    if (currencyId && $$('#operator-timezone-code').children[0].dataset.value) {
                        openedPortalData = {
                            portal: {
                                id: 0,
                                name: ''
                            },
                            diamond: defaultJackpotSettings[currencyId] ? defaultJackpotSettings[currencyId].defaultDiamond ? defaultJackpotSettings[currencyId].defaultDiamond : undefined : undefined,
                            platinum: defaultJackpotSettings[currencyId] ? defaultJackpotSettings[currencyId].defaultPlatinum ? defaultJackpotSettings[currencyId].defaultPlatinum : undefined : undefined
                        };
                    } else {
                        trigger('message', message.codes.invalidCurrencyAndTimeZone);
                        return;
                    }
                    gameLaunchURL.value = '';
                    userName.value = '';
                    password.value = '';
                    warningActiveCredit.value = '';
                    blockingActiveCredit.value = '';

                    on(`operator-portal-currency-code/selected`, function (value) {
                        openedPortalData.diamond = defaultJackpotSettings[value] ? defaultJackpotSettings[value].defaultDiamond ? defaultJackpotSettings[value].defaultDiamond : undefined : undefined;
                        openedPortalData.platinum = defaultJackpotSettings[value] ? defaultJackpotSettings[value].defaultPlatinum ? defaultJackpotSettings[value].defaultPlatinum : undefined : undefined;
                    });
                }
                for (let button of $$('.operators-form-jackpot-button')) {
                    button.onclick = function () {
                        jackpotModal.show(openedPortalData[button.dataset.jackpot], button.dataset.jackpot);
                    };
                }

                function refreshPortalList() {
                    let portalsWrapper = $$('#operators-portals');
                    portalsWrapper.innerHTML = '';
                    portalsWrapper.appendChild(generatePortalsTable(operatorData.portalSettingsList, 'portal'));
                }

                $$('#operators-form-portal-save').onclick = function () {
                    if (!gameLaunchURL.value ||
                        !integrationTypeWrapper.children[0].getSelected() ||
                        !warningActiveCredit.value ||
                        parseInt(warningActiveCredit.value) < 0 ||
                        parseInt(warningActiveCredit.value) > 18000000 ||
                        !blockingActiveCredit.value ||
                        parseInt(blockingActiveCredit.value) < 0 ||
                        parseInt(blockingActiveCredit.value) > 21000000 ||
                        parseInt(blockingActiveCredit.value) < parseInt(warningActiveCredit.value) ||
                        parseInt(blockingActiveCredit.value) === parseInt(warningActiveCredit.value) ||
                        !operatorsCurrencyWrapper.children[0].children[0].dataset.value) {
                        trigger('message', message.codes.badParameter);
                        return;
                    }
                    openedPortalData.gameLaunchURL = gameLaunchURL.value;
                    openedPortalData.integrationType = integrationTypeWrapper.children[0].getSelected();
                    openedPortalData.userName = userName.value;
                    openedPortalData.password = password.value;
                    openedPortalData.warningActiveCredit = Number(warningActiveCredit.value);
                    openedPortalData.blockingActiveCredit = Number(blockingActiveCredit.value);
                    openedPortalData.currencyId = Number(operatorsCurrencyWrapper.children[0].children[0].dataset.value);
                    openedPortalData.portal.name = `${$$('#operator-name').value}-${$$('#operator-portal-currency-code').children[0].innerText}`;
                    openedPortalData.enabled = $$('#operators-operator-form-enabled').checked;
                    if (editModePortal) {
                        operatorData.portalSettingsList[index] = openedPortalData;
                    } else {
                        operatorData.portalSettingsList.push(openedPortalData);
                    }
                    refreshPortalList();
                    if (operatorData.portalSettingsList.length > 0 && $$('#operator-name').value !== '') {
                        $$('#operators-form-save').classList.remove('disabled');
                    }
                    portalModal.hide();
                }

                modal.classList.add('show');
                isModalOpened = true;
            },
            hide: function () {
                gameLaunchURL.value = '';
                userName.value = '';
                password.value = '';
                warningActiveCredit.value = '';
                blockingActiveCredit.value = '';
                editModePortal = false;
                modal.classList.remove('show');
                filterCurrencies();
                if ($$('#operator-name').value === '' || $$('#operators-portals').children[0].children.length === 0) {
                    $$('#operators-form-save').classList.add('disabled');
                } else {
                    $$('#operators-form-save').classList.remove('disabled');
                }
                isModalOpened = false;
            }
        }
    }();

    let jackpotModal = function () {
        let modal = $$('#operators-form-jackpot');
        let betContribution = $$('#operator-bet-contribution');
        let minBet = $$('#operator-min-bet');
        let baseJackpotValue = $$('#operator-base-jackpot-value');
        let minJackpotValue = $$('#operator-min-jackpot-value');
        let maxJackpotValue = $$('#operator-max-jackpot-value');
        return {
            show: function (element, jackpot) {
                if (element) {
                    betContribution.value = element.betContribution;
                    minBet.value = element.minBet;
                    baseJackpotValue.value = element.baseJackpotValue;
                    minJackpotValue.value = element.minJackpotValue;
                    maxJackpotValue.value = element.maxJackpotValue;
                } else {
                    betContribution.value = 0;
                    minBet.value = 0;
                    baseJackpotValue.value = 0;
                    minJackpotValue.value = 0;
                    maxJackpotValue.value = 0;
                }

                $$('#operators-form-jackpots-save').onclick = function () {
                    openedPortalData[jackpot].betContribution = betContribution.value;
                    openedPortalData[jackpot].minBet = minBet.value;
                    openedPortalData[jackpot].baseJackpotValue = baseJackpotValue.value;
                    openedPortalData[jackpot].minJackpotValue = minJackpotValue.value;
                    openedPortalData[jackpot].maxJackpotValue = maxJackpotValue.value;
                    jackpotModal.hide();
                };
                modal.classList.add('show');
            },
            hide: function () {
                betContribution.value = '';
                minBet.value = '';
                baseJackpotValue.value = '';
                minJackpotValue.value = '';
                maxJackpotValue.value = '';
                modal.classList.remove('show');
            }
        }
    }();

    // Creates operators list
    function createList(data) {
        let actions = $$(`#operators-table`);
        let serachBar = $$(`#operators-main-search-wrapper`);
        if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
            actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
        }
        let body = document.createElement('tbody');
        for (let row of data) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.innerHTML = row.name;
            tr.dataset.id = row.id;
            tr.onclick = function () { trigger('operators/show/modal', { id: row.id, caller: td }) };
            if (!row.enabled) td.classList.add('disabled-portal');
            tr.appendChild(td);
            body.appendChild(tr);
        }
        actions.getElementsByTagName('table')[0].appendChild(body);
        actions.classList.remove('hidden');
        serachBar.classList.remove('hidden');

        let input = $$('#operators-main-search');

        input.addEventListener('input', function () {
            searchOperators(body, input.value);
        });

        input.addEventListener('keyup', function (e) {
            if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
                input.value = '';
                searchOperators(body, '');
            }
        });

        $$('#operators-main-remove-search').onclick = function () {
            input.value = '';
            searchOperators(body, '');
        };
    }

    function filterCurrencies() {
        availableCurrencies = currencies.filter((currency) => {
            for (let portal of operatorData.portalSettingsList) {
                if (portal.currencyId === currency.id) return false;
            }
            return true;
        });
    }

    function generatePortalsTable(data) {
        let table = document.createElement('table');
        let i = 0;
        for (let element of data) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.innerHTML = element.portal.name;
            if (!element.enabled) {
                td.style.color = '#ff7373';
            }
            let index = Number(i);
            td.onclick = function () {
                editModePortal = true;
                portalModal.show(element, index);
            };
            tr.dataset.id = element.portal.id;
            tr.appendChild(td);
            table.appendChild(tr);
            i++;
        }
        return table;
    }

    function searchOperators(element, term) {
        for (let tableRow of element.getElementsByTagName('tr')) {
            if (tableRow.innerText.toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
                tableRow.style.display = 'table-row';
            } else {
                tableRow.style.display = 'none';
            }
        }
    };

    on('operators/show/modal', function (data) {
        addLoader(data.caller);
        selectedRow = data.caller.parentNode;
        selectedRow.classList.add('hover');
        trigger('comm/operators/get/single', {
            body: {
                id: data.id
            },
            success: function (response) {
                removeLoader(data.caller);
                if (response.responseCode === message.codes.success) {
                    editMode = true;
                    openedOperatorId = data.id;
                    showModal(response.result);
                } else {
                    trigger('message', response.responseCode)
                }
            },
            fail: function () {
                removeLoader(data.caller);
            }
        });
    });

    return {
        get isModalOpened() {
            return isModalOpened;
        }
    }
}();