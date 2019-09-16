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

    // $$('#configuration-black-overlay').addEventListener('click', hideModal);
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

    on('configuration/profile/loaded', function () {
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
            if (section === 'users' && !row.enabled) td.classList.add('disabled-user');
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
            input.parentNode.classList[input.value !== '' ? 'add' : 'remove']('typed');
            if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
                input.value = '';
                search(table, '');
                input.parentNode.classList.remove('search');
            }
        });
        input.addEventListener('blur', function () {
            // input.value = '';
            // search(table, '');
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

    on('configuration/profile/loaded', function () {
        // TODO
    });

    on('configuration/main/unloaded', function() {
        hideModal();
    });
    
    // When configuration page is loaded
    on('configuration/main/loaded', function () {
        addLoader($$('#sidebar-configuration'));
        let responses = 0;
        let asyncRequests = 4;
        for (let input of $$('.caption-search')) {
            input.value = '';
            input.parentNode.classList.remove('typed');
        }
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
}();