let configuration = function () {
    let activeSection = 'roles';
    let sections = ['users', 'actions', 'roles'];
    let rolesJson = {};
    let roles = {};
    let actions = {};
    let users = {};
    let editMode = false;
    let openedId;

    $$('#configuration-black-overlay').addEventListener('click', hideModal);

    // Shows modal with details for individual selection
    function showModal(section, data) {
        $$('#configuration-form-' + activeSection).classList.remove('active');

        let form = $$('#configuration-form-' + section);
        form.classList.add('active');
        activeSection = section;

        let wrapper;

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
                if (wrapper.getElementsByClassName('select')[0]) wrapper.getElementsByClassName('select')[0].remove();
                wrapper.prepend(dropdown.generate(roles, 'configuration-user-role'));
                $$('#configuration-user-role').getElementsByClassName('selected')[0].innerHTML = rolesJson[data.roleId];
                $$('#configuration-user-role').getElementsByClassName('selected')[0].dataset.value = data.roleId;
                $$('#configuration-user-name').value = data.name;
                $$('#configuration-user-username').value = data.userName;
                $$('#configuration-user-password').value = '';
                $$('#configuration-user-repeat-password').value = '';
                $$('#configuration-user-email').value = data.email;
                $$('#configuration-user-phone').value = data.phoneNumber;
                break;
        }

        for (let td of form.getElementsByTagName('td')) {
            td.onclick = function (e) {
                e.stopPropagation();
                td.children[0].checked = !td.children[0].checked;
            };
        }

        if (!editMode) {
            form.getElementsByClassName('configuration-form-button-wrapper')[0].classList.add('edit');
        } else {
            form.getElementsByClassName('configuration-form-button-wrapper')[0].classList.remove('edit');
        }

        $$('#configuration-black-overlay').style.display = 'block';
        $$('#configuration-form').classList.add('show');
        $$('#configuration-main').children[0].classList.add('blur');
        $$('#configuration-main').children[0].scrollTop = 0;
        $$('#configuration-main').children[0].style.overflow = 'hidden';
    }

    // Generates modal checkbox list
    function generateModalData(data) {
        let table = ''
        for (let element of data) {
            let checked = element.checked ? 'checked' : '';
            element = element.role || element.action || element;
            table += `<tr><td><input type="checkbox" ${checked} id="${element.id}"><label for="${element.id}">${element.name}</label></td></tr>`;
        }
        return `<table>${table}</table>`;
    }

    function hideModal() {
        $$('#configuration-black-overlay').style.display = 'none';
        $$('#configuration-form').classList.remove('show');
        $$('#configuration-main').children[0].classList.remove('blur');
        $$('#configuration-main').children[0].style.overflow = 'auto';
        for (let checkbox of $$('#configuration-form-' + activeSection).getElementsByTagName('input')) {
            checkbox.checked = false;
        }
        editMode = false;
    }

    // Creates users, action and roles list
    function createList(section, data) {
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
            tr.onclick = function () { trigger('configuration/show/modal', { section: section, id: this.dataset.id, caller: td }) };
            tr.appendChild(td);
            body.appendChild(tr);
        }
        actions.getElementsByTagName('table')[0].appendChild(body);
        actions.classList.remove('hidden');
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
                        list.push({
                            checked: td.children[0].checked,
                            role: {
                                id: td.children[0].id,
                                name: td.children[1].innerHTML
                            }
                        });
                    }
                    data = editMode ?
                        { action: { id: openedId, name: $$('#configuration-action-name').value }, rolesList: list } :
                        { actionName: $$('#configuration-action-name').value, rolesList: list };
                    section = 'actions';
                    break;
                case 'roles':
                    list = [];
                    for (let td of $$('#configuration-form-roles').children[2].getElementsByTagName('td')) {
                        list.push({
                            checked: td.children[0].checked,
                            action: {
                                id: td.children[0].id,
                                name: td.children[1].innerHTML
                            }
                        });
                    }
                    data = editMode ?
                        { role: { id: openedId, name: $$('#configuration-role-name').value }, actionList: list } :
                        { roleName: $$('#configuration-role-name').value, actionList: list };
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
                            enabled: true,
                            roleId: $$('#configuration-user-role').children[0].dataset.value
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
                    data.rolesList = getData('roles');
                    break;
                case 'roles':
                    data.role = {};
                    data.role.name = '';
                    data.actionsList = getData('actions');
                    break;
                case 'users':
                    data.email = "";
                    data.name = "";
                    data.password = null;
                    data.phoneNumber = "";
                    let rolesList = getData('roles');
                    data.roleId = rolesList[0] ? rolesList[0].id : '';
                    data.userName = "";
                    break;
            }
            showModal(button.dataset.section, data)
        });
    }

    function getData(section) {
        switch (section) {
            case 'actions':
                return actions;
            case 'roles':
                return roles;
            case 'users':
                return users;
        }
    }


    // When configuration page is loaded
    on('configuration/main/loaded', function () {
        addLoader($$('#sidebar-configuration'));
        let responses = 0;
        trigger('comm/configuration/actions/get', {
            success: function (response) {
                responses++;
                if (responses === 3) {
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
                if (responses === 3) {
                    removeLoader($$('#sidebar-configuration'));
                }
                if (response.responseCode === message.codes.success) {
                    for (let role of response.result) {
                        rolesJson[role.id] = role.name;
                    }
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
                if (responses === 3) {
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
    });

    on('configuration/show/modal', function (data) {
        addLoader(data.caller);
        trigger(`comm/configuration/${data.section}/get/single`, {
            body: {
                id: data.id
            },
            success: function (response) {
                editMode = true;
                openedId = response.result.action ? response.result.action.id :
                    response.result.role ? response.result.role.id :
                        response.result.userId;
                removeLoader(data.caller);
                showModal(data.section, response.result);
            }
        });
    });
}();