let operators = function () {
    let openedId;
    let editMode = false;

    $$('#operators-black-overlay').addEventListener('click', hideModal);

    $$('#operators-form-cancel').addEventListener('click', hideModal);

    $$('#operators-form-back').addEventListener('click', function () { portalModal.hide(); });

    $$('#operators-add-new').addEventListener('click', function () {
        openedId = '';
        let data = {
            portalsList: [
                {
                    id: 123,
                    name: 'operator1'
                },
                {
                    id: 125,
                    name: 'operator2'
                },
                {
                    id: 12235,
                    name: 'operator3'
                },
                {
                    id: 142125,
                    name: 'operator4'
                },
                {
                    id: 1265,
                    name: 'operator5'
                },
                {
                    id: 1225,
                    name: 'operator6'
                },
                {
                    id: 1265,
                    name: 'operator7'
                },
                {
                    id: 1725,
                    name: 'operator8'
                },
                {
                    id: 1825,
                    name: 'operator9'
                }
            ],
            gamesList: [
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

    // Shows modal with details for individual selection
    function showModal(data) {
        let form = $$('#operators-form');
        let mainPage = $$('#operators-form-main');
        let gamesWrapper = $$('#operators-games');
        let portalsWrapper = $$('#operators-portals');

        gamesWrapper.innerHTML = '';
        portalsWrapper.innerHTML = '';
        gamesWrapper.appendChild(generateModalData(data.gamesList));
        portalsWrapper.appendChild(generateModalData(data.portalsList));

        $$('#operator-name').value = '';
        $$('#operator-currency-code').value = '';
        $$('#operator-timezone-code').value = '';

        for (let td of gamesWrapper.getElementsByTagName('td')) {
            td.onclick = function (e) {
                e.stopPropagation();
                td.children[0].checked = !td.children[0].checked;
            };
        }

        if (!editMode) {
            $$('#operators-form-button-wrapper').classList.add('edit');
        } else {
            $$('#operators-form-button-wrapper').classList.remove('edit');
        }

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
        editMode = false;
    }

    let portalModal = function () {
        let portal = $$('#operators-form-portal');
        return {
            show: function () {
                portal.classList.add('show');
            },
            hide: function () {
                portal.classList.remove('show');
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

    function generateModalData(data) {
        let table = document.createElement('table');
        for (let element of data) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            if (element.game) {
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
            } else {
                td.innerHTML = element.name;
                td.onclick = function () { portalModal.show(); };
                tr.dataset.id = element.id;
            }
            tr.appendChild(td);
            table.appendChild(tr);
        }
        return table;
    }

    on('operators/show/modal', function (data) {
        addLoader(data.caller);
        trigger(`comm/operators/${data.section}/get/single`, {
            body: {
                id: data.id
            },
            success: function (response) {
                editMode = true;
                openedId = response.result.id; // CHECK IT! 
                removeLoader(data.caller);
                showModal(response.result);
            }
        });
    });
}();