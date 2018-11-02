let operators = function () {
    let openedOperatorId;
    let editMode = false;
    let editModePortal = false;
    let timeZones = [];
    let currencies = [];
    let currenciesModel = {};
    let defaultJackpotSettings = {};
    let operatorData = {};
    let openedPortalData = {};

    let templateOperatorData = {
        operator: {
            id: 0,
            name: ''
        },
        currencyId: 0,
        timeZoneId: 0,
        portalSettingsList: [],
        games: [],
    };

    $$('#operators-black-overlay').addEventListener('click', hideModal);
    $$('#operators-form-cancel').addEventListener('click', hideModal);
    $$('#operators-form-portal-back').addEventListener('click', function () { portalModal.hide(); });
    $$('#operators-form-jackpot-back').addEventListener('click', function () { jackpotModal.hide(); });
    $$('#operators-form-create').addEventListener('click', function () {
        portalModal.show();
    });

    $$('#operators-add-new').addEventListener('click', function () {
        operatorData = JSON.parse(JSON.stringify(templateOperatorData));
        showModal(operatorData);
    });

    on('operators/main/loaded', function () {
        addLoader($$('#sidebar-operators'));
        let operatorsList;
        trigger('comm/operators/get', {
            success: function (response) {
                operatorsList = response.result;
                trigger('comm/operators/parameters/get', {
                    success: function (response) {
                        removeLoader($$('#sidebar-operators'));
                        if (response.responseCode === message.codes.success) {
                            templateOperatorData.games = response.result.games;
                            timeZones = response.result.timeZones;
                            currencies = response.result.currencies;
                            currenciesModel = {};
                            for (let currency of currencies) {
                                currenciesModel[currency.id] = currency.name;
                            }
                            defaultJackpotSettings = response.result.defaultJackpotSettings;
                            createList(operatorsList);
                        } else {
                            trigger('message', response.responseCode);
                        }
                    },
                    fail: function () {
                        removeLoader($$('#sidebar-operators'));
                    }
                });
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
        let gamesWrapper = $$('#operators-games');
        let portalsWrapper = $$('#operators-portals');
        gamesWrapper.innerHTML = '';
        portalsWrapper.innerHTML = '';
        currencyTimezoneWrapper.innerHTML = '';

        $$('#operator-name').addEventListener('input', function () {
            if (this.value === '' || $$('#operators-portals').children[0].children.length === 0) {
                $$('#operators-form-save').classList.add('disabled');
            } else {
                $$('#operators-form-save').classList.remove('disabled');
            }
        });

        currencyTimezoneWrapper.appendChild(dropdown.generate(currencies, 'operator-currency-code', 'Select currency'));
        currencyTimezoneWrapper.appendChild(dropdown.generate(timeZones, 'operator-timezone-code', 'Select timezone'));

        if (editMode) {
            $$('#operator-currency-code').children[0].innerHTML = operatorData.currencyCode;
            $$('#operator-timezone-code').children[0].innerHTML = operatorData.timeZoneCode;
            $$('#operator-currency-code').classList.add('disabled');
            $$('#operator-timezone-code').classList.add('disabled');
            $$('#operators-form-save').classList.remove('disabled');

            $$('#operator-name').value = operatorData.operator.name;

            $$('#operators-form-remove').onclick = function () {
                let button = this;
                addLoader(button);
                trigger('comm/operators/remove', {
                    body: {
                        id: openedOperatorId
                    },
                    success: function (response) {
                        removeLoader(button);
                        if (response.responseCode === message.codes.success) {
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

            for (let td of gamesWrapper.getElementsByTagName('td')) {
                td.onclick = function (e) {
                    e.stopPropagation();
                    td.children[0].checked = !td.children[0].checked;
                };
            }

            $$('#operators-form-button-wrapper').classList.remove('edit');

        } else {
            openedOperatorId = '';
            $$('#operators-form-save').classList.add('disabled');

            $$('#operator-currency-code').classList.remove('disabled');
            $$('#operator-timezone-code').classList.remove('disabled');

            $$('#operator-name').value = '';
            $$('#operators-form-button-wrapper').classList.add('edit');
        }


        $$('#operators-form-save').onclick = function () {
            let button = this;
            let gamesList = [];
            if (editMode) {
                operatorData.currencyId = 0;
                operatorData.timeZoneId = 0;
            } else {
                operatorData.currencyId = Number($$('#operator-currency-code').children[0].dataset.value);
                operatorData.timeZoneId = Number($$('#operator-timezone-code').children[0].dataset.value);
            }
            operatorData.operator.name = $$('#operator-name').value;
            for (let tr of gamesWrapper.children[0].children) {
                let game = {
                    checked: tr.children[0].children[0].checked,
                    game: {
                        id: tr.children[0].children[0].dataset.id,
                        name: tr.children[0].children[1].innerHTML
                    }
                };
                gamesList.push(game)
            }
            operatorData.games = gamesList;

            addLoader(button);
            trigger(`comm/operators/${editMode ? 'edit' : 'create'}`, {
                body: operatorData,
                success: function (response) {
                    removeLoader(button);
                    if (response.responseCode === message.codes.success) {
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

        gamesWrapper.appendChild(generateModalData(operatorData.games, 'game'));
        portalsWrapper.appendChild(generateModalData(operatorData.portalSettingsList, 'portal'));

        $$('#operators-black-overlay').style.display = 'block';
        form.classList.add('show');
        $$('#operators-main').children[0].scrollTop = 0;
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
        editMode = false;
    }

    let portalModal = function () {
        let modal = $$('#operators-form-portal');
        let operatorsCurrencyWrapper = $$('#operators-portal-currency');
        let gameLaunchURL = $$('#operator-game-launch-url');
        let integrationType = $$('#operator-integration-type');
        let userName = $$('#operator-user-name');
        let password = $$('#operator-password');
        let warrningActiveCredit = $$('#operator-warrning-active-credit');
        let blockingActiveCredit = $$('#operator-blocking-active-credit');
        $$('#operators-form-portal-button-wrapper').classList[editModePortal ? 'add' : 'remove']('edit');
        return {
            show: function (element, index) {
                operatorsCurrencyWrapper.innerHTML = '';
                operatorsCurrencyWrapper.appendChild(dropdown.generate(currencies, 'operator-portal-currency-code', 'Select currency'));
                if (editModePortal) {
                    openedPortalData = element;
                    integrationType.value = element.integrationType;
                    gameLaunchURL.value = element.gameLaunchURL;
                    userName.value = element.userName;
                    password.value = element.password;
                    warrningActiveCredit.value = element.warrningActiveCredit;
                    blockingActiveCredit.value = element.blockingActiveCredit;
                    operatorsCurrencyWrapper.children[0].children[0].innerHTML = currenciesModel[element.currencyId];
                    operatorsCurrencyWrapper.children[0].classList.add('disabled');
                } else {
                    let currencyId = $$('#operator-currency-code').children[0].dataset.value;
                    if (currencyId && $$('#operator-timezone-code').children[0].dataset.value) {
                        openedPortalData = {
                            diamond: defaultJackpotSettings[currencyId].defaultDiamond,
                            platinum: defaultJackpotSettings[currencyId].defaultPlatinum
                        };
                    } else {
                        trigger('message', message.codes.invalidCurrencyAndTimeZone);
                        return;
                    }
                    integrationType.value = '';
                    gameLaunchURL.value = '';
                    userName.value = '';
                    password.value = '';
                    warrningActiveCredit.value = '';
                    blockingActiveCredit.value = '';
                }
                for (let button of $$('.operators-form-jackpot-button')) {
                    button.onclick = function () {
                        jackpotModal.show(openedPortalData[button.dataset.jackpot], button.dataset.jackpot);
                    };
                }
                $$('#operators-form-portal-save').onclick = function () {
                    if (!gameLaunchURL.value ||
                        !integrationType.value ||
                        !userName.value ||
                        !password.value ||
                        !warrningActiveCredit.value ||
                        !blockingActiveCredit.value ||
                        !operatorsCurrencyWrapper.children[0].children[0].dataset.value) {
                        trigger('message', message.codes.badParameter)
                        return;
                    }
                    openedPortalData.gameLaunchURL = gameLaunchURL.value;
                    openedPortalData.integrationType = integrationType.value;
                    openedPortalData.userName = userName.value;
                    openedPortalData.password = password.value;
                    openedPortalData.warrningActiveCredit = warrningActiveCredit.value;
                    openedPortalData.blockingActiveCredit = blockingActiveCredit.value;
                    openedPortalData.currencyId = operatorsCurrencyWrapper.children[0].children[0].dataset.value;
                    if (editModePortal) {
                        operatorData[index] = openedPortalData;
                    } else {
                        operatorData.portalSettingsList.push(openedPortalData);
                    }
                    let portalsWrapper = $$('#operators-portals');
                    portalsWrapper.innerHTML = '';
                    portalsWrapper.appendChild(generateModalData(operatorData.portalSettingsList, 'portal'));
                    if (operatorData.portalSettingsList.length > 0 && $$('#operator-name').innerHTML !== '') {
                        $$('#operators-form-save').classList.remove('disabled');
                    }
                    portalModal.hide();
                }
                modal.classList.add('show');
            },
            hide: function () {
                gameLaunchURL.value = '';
                integrationType.value = '';
                userName.value = '';
                password.value = '';
                warrningActiveCredit.value = '';
                blockingActiveCredit.value = '';
                editModePortal = false;
                modal.classList.remove('show');
                if (this.value === '' || $$('#operators-portals').children[0].children.length === 0) {
                    $$('#operators-form-save').classList.add('disabled');
                } else {
                    $$('#operators-form-save').classList.remove('disabled');
                }
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
                betContribution.value = element.betContribution;
                minBet.value = element.minBet;
                baseJackpotValue.value = element.baseJackpotValue;
                minJackpotValue.value = element.minJackpotValue;
                maxJackpotValue.value = element.maxJackpotValue;

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
            tr.appendChild(td);
            body.appendChild(tr);
        }
        actions.getElementsByTagName('table')[0].appendChild(body);
        actions.classList.remove('hidden');
    }

    function generateModalData(data, type) {
        let table = document.createElement('table');
        let i = 0;
        for (let element of data) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            switch (type) {
                case 'game':
                    let input = document.createElement('input');
                    let label = document.createElement('label');
                    input.type = 'checkbox';
                    input.checked = element.checked;
                    input.dataset.id = element.game.id;
                    label.for = element.game.id;
                    label.innerHTML = element.game.name;
                    td.appendChild(input);
                    td.appendChild(label);
                    td.addEventListener('click', function () {
                        input.click();
                    });
                    break;
                case 'portal':
                    td.innerHTML = element.userName;
                    td.onclick = function () {
                        editModePortal = true;
                        portalModal.show(element, i);
                    };
                    tr.dataset.id = element.id;
                    break;
            }
            tr.appendChild(td);
            table.appendChild(tr);
            i++;
        }
        return table;
    }

    on('operators/show/modal', function (data) {
        addLoader(data.caller);
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
}();