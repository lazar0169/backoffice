let configuration = function () {
    let activeSection = 'roles';
    let sections = ['users', 'actions', 'roles'];

    $$('#configuration-black-overlay').addEventListener('click', hideModal);

    function showModal(section) {
        $$('#configuration-form-' + activeSection).classList.remove('active');
        $$('#configuration-form-' + section).classList.add('active');
        activeSection = section;

        for (let td of $$('#configuration-form-' + activeSection).getElementsByTagName('td')) {
            td.onclick = function (e) {
                e.stopPropagation();
                td.children[0].checked = !td.children[0].checked;
            };
        }

        $$('#configuration-black-overlay').style.display = 'block';
        $$('#configuration-form').classList.add('show');
        $$('#configuration-main').children[0].classList.add('blur');
        $$('#configuration-main').children[0].scrollTop = 0;
        $$('#configuration-main').children[0].style.overflow = 'hidden';
    }

    function hideModal() {
        $$('#configuration-black-overlay').style.display = 'none';
        $$('#configuration-form').classList.remove('show');
        $$('#configuration-main').children[0].classList.remove('blur');
        $$('#configuration-main').children[0].style.overflow = 'auto';
        for (let checkbox of $$('#configuration-form-' + activeSection).getElementsByTagName('input')) {
            checkbox.checked = false;
        }
    }

    function createList(section, data) {
        let actions = $$(`#configuration-${section}`);
        if (actions.getElementsByTagName('table')[0].getElementsByTagName('tbody').length !== 0) {
            actions.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].remove();
        }
        let body = document.createElement('tbody');
        for (let row of data) {
            let tr = document.createElement('tr');
            tr.dataset.id = row.id;
            tr.onclick = function () { trigger('configuration/show/modal', { section: section, id: this.dataset.id }) };
            let td = document.createElement('td');
            td.innerHTML = row.name;
            tr.appendChild(td);
            body.appendChild(tr);
        }
        actions.getElementsByTagName('table')[0].appendChild(body);
    }

    for (let cancelBtn of $$('.configuration-form-cancel')) {
        cancelBtn.addEventListener('click', hideModal);
    }

    for (let section of sections) {
        on(`configuration/fill/${section}`, function (data) {
            createList(section, data);
        });
    }

    // EXAMPLE:
    // trigger('configuration/fill/actions', [
    //     {
    //         id: "ident1",
    //         name: "ime1"
    //     },
    //     {
    //         id: "ident2",
    //         name: "ime2"
    //     }
    // ]);

    on('configuration/show/modal', function (data) {
        // trigger(`comm/configuration/${data.section}/get`, {
        //     body: {
        //         id: data.id
        //     },
        //     success: function (response) {
        //         log(response);
        //     },
        //     fail: function () {
        //         // TODO
        //     }
        // });
        showModal(data.section);
    });
}();