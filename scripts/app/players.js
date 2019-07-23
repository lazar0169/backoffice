let players = function () {

    let getPlayerButton = $$('#players-get-player');
    let playersSearchWrapper = $$('#players-player-players-search-wrapper');
    let playersListWrapper = $$('#players-player-players-table-wrapper');

    const showPlayerData = (data) => {
        console.log(data);
    };

    const afterLoad = (tab) => {
        addLoader($$(`#players-navbar-${tab}`));
        trigger('comm/accounting/operators/get', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {

                    // Prevent operator change
                    // if (roles.getRole() === 'Manager') {
                    //     response = {
                    //         responseCode: 1000
                    //     };
                    // }

                    getOperators(response.result, tab);
                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader($$(`#players-navbar-${tab}`));
            },
            fail: function () {
                trigger('message', response.responseCode);
                removeLoader($$(`#players-navbar-${tab}`));
            }
        });
    };

    const getOperators = (data, tab) => {
        clearElement($$(`#players-${tab}-operators-list`));
        let operatorsDropdown = dropdown.generate(data, `players-${tab}-operators-list`, 'Select operator');
        $$(`#players-${tab}-operators-list-wrapper`).appendChild(operatorsDropdown);
        if (!data) $$(`#players-${tab}-operators-list-wrapper`).style.display = 'none';

        on(`players-${tab}-operators-list/selected`, function (value) {
            addLoader($$(`#players-navbar-${tab}`));
            trigger('comm/accounting/portals/get', {
                body: {
                    id: value
                },
                success: function (response) {
                    if (response.responseCode === message.codes.success) {
                        getPortals(response.result, tab);
                    } else {
                        trigger('message', response.responseCode);
                    }
                    removeLoader($$(`#players-navbar-${tab}`));
                },
                fail: function () {
                    trigger('message', response.responseCode);
                    removeLoader($$(`#players-navbar-${tab}`));
                }
            });
        });

        // Prevent operator change
        // if (roles.getRole() === 'Manager') {
        //     trigger('accounting-operators-list/selected', 0);
        // }
    };

    const getPortals = (data, tab) => {
        clearElement($$(`#players-${tab}-portals-list`));
        let portalsDropdown = dropdown.generate(data, `players-${tab}-portals-list`, 'Select portal');
        $$(`#players-${tab}-portals-list-wrapper`).appendChild(portalsDropdown);
        if (!data) $$(`#players-${tab}-portals-list-wrapper`).style.display = 'none';
        $$(`#players-get-${tab}`).classList.remove('hidden');
    };

    const getPlayer = () => {
        let portalId = $$('#players-player-portals-list').getSelected();

        if (!portalId) {
            trigger('message', message.codes.badParameters);
            return;
        }
        addLoader(getPlayerButton);
        trigger('comm/players/getPlayerForPortal', {
            body: {
                id: portalId
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    createList(response.result, `player-players`, getPlayerData);
                }
                else {
                    trigger('message', response.responseCode);
                }
                removeLoader(getPlayerButton);
            },
            fail: function (response) {
                trigger('message', response.responseCode);
                removeLoader(getPlayerButton);
            }
        });
    };

    const getPlayerData = (id) => {
        trigger('comm/players/getPlayerData', {
            body: {
                id: id
            },
            success: function (response) {
                if (response.responseCode === message.codes.success) {
                    showPlayerData(response.result);
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function (response) {
                trigger('message', response.responseCode);
            }
        });
    }

    const createList = (data, section, callback) => {
        let actions = $$(`#players-${section}-table-wrapper`);
        let serachBar = $$(`#players-${section}-search-wrapper`);
        if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
            actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
        }
        let body = document.createElement('tbody');
        for (let row of data) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.innerHTML = row.name;
            tr.dataset.id = row.id;
            tr.onclick = function () { callback(row.id) };
            tr.appendChild(td);
            body.appendChild(tr);
        }

        actions.getElementsByTagName('table')[0].appendChild(body);
        actions.classList.remove('hidden');
        serachBar.classList.remove('hidden');

        let input = $$(`#players-${section}-search`);

        input.addEventListener('input', function () {
            searchData(body, input.value);
        });

        input.addEventListener('keyup', function (e) {
            if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
                input.value = '';
                searchData(body, '');
            }
        });

        $$(`#players-${section}-remove-search`).onclick = function () {
            input.value = '';
            searchData(body, '');
        };
    };

    const searchData = (element, term) => {
        for (let tableRow of element.getElementsByTagName('tr')) {
            if (tableRow.innerText.toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
                tableRow.style.display = 'table-row';
            } else {
                tableRow.style.display = 'none';
            }
        }
    }

    on('players/main/loaded', function () {

    });

    on('players/groups/loaded', function () {

    });

    on('players/player/loaded', function () {
        getPlayerButton.classList.add('hidden');
        playersSearchWrapper.classList.add('hidden');
        playersListWrapper.classList.add('hidden');
        clearElement($$(`#players-player-portals-list`));
        afterLoad(`player`);
    });

    getPlayerButton.addEventListener('click', getPlayer);
}();