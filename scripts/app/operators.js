let operators = function () {
    let openedOperatorId;
    let editMode = false;
    let editModePortal = false;
    let operatorData = {};
    let openedOperatorData = {};

    $$('#operators-black-overlay').addEventListener('click', hideModal);
    $$('#operators-form-cancel').addEventListener('click', hideModal);
    $$('#operators-form-portal-back').addEventListener('click', function () { portalModal.hide(); });
    $$('#operators-form-jackpot-back').addEventListener('click', function () { jackpotModal.hide(); });

    $$('#operators-add-new').addEventListener('click', function () {
        openedOperatorId = '';
        let data = {
            portalSettingsList: [
                {
                    "portalId": '',
                    "currencyId": '',
                    "gameLaunchURL": "http://test.com",
                    "integrationType": "type1",
                    "userName": "portal1",
                    "password": "098213",
                    "warrningActiveCredit": '',
                    "blockingActiveCredit": '',
                    "platinum": {
                        "betContribution": '1',
                        "minBet": '1',
                        "baseJackpotValue": '1',
                        "minJackpotValue": '1',
                        "maxJackpotValue": '1'
                    },
                    "diamond": {
                        "betContribution": '2',
                        "minBet": '2',
                        "baseJackpotValue": '2',
                        "minJackpotValue": '2',
                        "maxJackpotValue": '2'
                    }
                }
            ],
            games: [
                {
                    checked: false,
                    game: {
                        id: 123,
                        name: 'game1'
                    }
                },
                {
                    checked: true,
                    game: {
                        id: 125,
                        name: 'game2'
                    }
                },
                {
                    checked: false,
                    game: {
                        id: 12235,
                        name: 'game3'
                    }
                },
                {
                    checked: false,
                    game: {
                        id: 142125,
                        name: 'game4'
                    }
                },
                {
                    checked: false,
                    game: {
                        id: 1265,
                        name: 'game5'
                    }
                },
                {
                    checked: true,
                    game: {
                        id: 1225,
                        name: 'game6'
                    }
                },
                {
                    checked: false,
                    game: {
                        id: 1265,
                        name: 'game7'
                    }
                },
                {
                    checked: false,
                    game: {
                        id: 1725,
                        name: 'game8'
                    }
                },
                {
                    checked: true,
                    game: {
                        id: 1825,
                        name: 'game9'
                    }
                }
            ]
        };
        showModal(data);
    });

    on('operators/main/loaded', function () {
        addLoader($$('#sidebar-operators'));
        trigger('comm/operators/get', {
            success: function (response) {
                removeLoader($$('#sidebar-operators'));
                createList(response.result);
            },
            fail: function () {
                removeLoader($$('#sidebar-operators'));
            }
        });
    });

    // Shows modal with details for individual selection
    function showModal(data) {
        operatorData = data;
        let form = $$('#operators-form');
        let mainPage = $$('#operators-form-main');
        let gamesWrapper = $$('#operators-games');
        let portalsWrapper = $$('#operators-portals');

        gamesWrapper.innerHTML = '';
        portalsWrapper.innerHTML = '';
        gamesWrapper.appendChild(generateModalData(operatorData.games, 'game'));
        portalsWrapper.appendChild(generateModalData(operatorData.portalSettingsList, 'portal'));

        $$('#operator-name').value = '';
        $$('#operator-currency-code').value = '';
        $$('#operator-timezone-code').value = '';

        for (let td of gamesWrapper.getElementsByTagName('td')) {
            td.onclick = function (e) {
                e.stopPropagation();
                td.children[0].checked = !td.children[0].checked;
            };
        }

        $$('#operators-form-save').onclick = function () {
            console.log(operatorData.portalSettingsList);
            hideModal();
        };

        $$('#operators-form-button-wrapper').classList[editMode ? 'remove' : 'add']('edit');

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
        let gameLaunchURL = $$('#operator-game-launch-url');
        let integrationType = $$('#operator-integration-type');
        let userName = $$('#operator-user-name');
        let password = $$('#operator-password');
        let warrningActiveCredit = $$('#operator-warrning-active-credit');
        let blockingActiveCredit = $$('#operator-blocking-active-credit');
        $$('#operators-form-portal-button-wrapper').classList[editModePortal ? 'add' : 'remove']('edit');
        return {
            show: function (element, index) {
                openedOperatorData = element;
                gameLaunchURL.value = element.gameLaunchURL;
                integrationType.value = element.integrationType;
                userName.value = element.userName;
                password.value = element.password;
                warrningActiveCredit.value = element.warrningActiveCredit;
                blockingActiveCredit.value = element.blockingActiveCredit;
                for (let button of $$('.operators-form-jackpot-button')) {
                    button.onclick = function () {
                        jackpotModal.show(openedOperatorData[button.dataset.jackpot], button.dataset.jackpot);
                    };
                }
                $$('#operators-form-portal-save').onclick = function () {
                    openedOperatorData.gameLaunchURL = gameLaunchURL.value;
                    openedOperatorData.integrationType = integrationType.value;
                    openedOperatorData.userName = userName.value;
                    openedOperatorData.password = password.value;
                    openedOperatorData.warrningActiveCredit = warrningActiveCredit.value;
                    openedOperatorData.blockingActiveCredit = blockingActiveCredit.value;
                    operatorData[index] = openedOperatorData;
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
                modal.classList.remove('show');
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
                    openedOperatorData[jackpot].betContribution = betContribution.value;
                    openedOperatorData[jackpot].minBet = minBet.value;
                    openedOperatorData[jackpot].baseJackpotValue = baseJackpotValue.value;
                    openedOperatorData[jackpot].minJackpotValue = minJackpotValue.value;
                    openedOperatorData[jackpot].maxJackpotValue = maxJackpotValue.value;
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
                    element = element.game;
                    let input = document.createElement('input');
                    let label = document.createElement('label');
                    input.type = 'checkbox';
                    input.checked = !!element.checked;
                    input.id = element.id;
                    label.for = element.id;
                    label.innerHTML = element.name;
                    td.appendChild(input);
                    td.appendChild(label);
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
                editMode = true;
                openedOperatorId = data.id;
                removeLoader(data.caller);
                showModal(response.result);
            },
            fail: function () {
                removeLoader(data.caller);
            }
        });
    });
}();