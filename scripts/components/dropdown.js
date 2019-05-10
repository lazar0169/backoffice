let dropdown = function () {

    function init(element, placeholder = 'Select', isMultiple) {
        let select = element || $$('.select');

        if (element) {
            initializeDropdown(element, placeholder, isMultiple);
        } else {
            for (let dropdown of select) {
                initializeDropdown(dropdown, placeholder, isMultiple);
            }
        }

        function initializeDropdown(dropdown, placeholder, isMultiple) {
            let selected = dropdown.children[0];
            let optionsWrapper = dropdown.children[1];
            let options = optionsWrapper.getElementsByClassName('option');
            let searchVisible = options.length > 8; // if less than 8 items, don't show search
            let searchWrapper = optionsWrapper.getElementsByClassName('select-search')[0];
            let searchButton = optionsWrapper.getElementsByClassName('select-search-button')[0];
            let selectAllCheckbox = optionsWrapper.getElementsByClassName('select-search-checkbox')[0];
            let selectAllLabel = optionsWrapper.getElementsByClassName('select-search-label')[0];
            let searchInput = optionsWrapper.getElementsByClassName('select-search-input')[0];

            dropdown.getSelected = function () { return selected.dataset.value; };
            dropdown.getSelectedName = function () { return selected.innerText; }
            dropdown.search = function (term = '') {
                for (let option of optionsWrapper.getElementsByClassName('option')) {
                    if (isMultiple && option.children[1].innerHTML.toLocaleLowerCase().includes(term.toLocaleLowerCase()) ||
                        option.innerHTML.toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
                        option.style.display = 'block';
                    } else {
                        option.style.display = 'none';
                    }
                }
                optionsWrapper.focusedItemIndex = -1;
                for (let e of optionsWrapper.querySelectorAll('.option')) {
                    e.classList.remove('focused');
                }
            };
            dropdown.selectAll = function (mode = true) {
                let options = optionsWrapper.getElementsByClassName('option');
                for (let option of options) {
                    option.children[0].checked = mode;
                }
                selected.innerHTML = readCheck(dropdown, placeholder);
            };
            dropdown.prevCollapsed = true;

            if (!searchVisible || isMobile()) {
                searchWrapper.style.display = 'none';
            }

            selected.addEventListener('click', function () {
                dropdown.prevCollapsed = optionsWrapper.classList.contains('hidden');
                optionsWrapper.focusedItemIndex = -1;
                for (let e of optionsWrapper.querySelectorAll('.option')) {
                    e.classList.remove('focused');
                }
                optionsWrapper.classList.toggle('hidden');
                if (isMultiple) {
                    optionsWrapper.children[0].classList.add('collapsed');
                } else if (!isMobile() && searchVisible) {
                    searchInput.value = '';
                    searchInput.focus();
                    dropdown.search('');
                }
            });

            if (searchButton) {
                searchButton.onclick = function () {
                    searchWrapper.classList.remove('collapsed');
                    searchInput.value = '';
                    searchInput.focus();
                    dropdown.search('');
                }
            }

            searchInput.onkeyup = function (e) {
                if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') {
                    searchInput.value = '';
                    dropdown.search('');
                    if (isMultiple) {
                        searchWrapper.classList.add('collapsed');
                    }
                } else if (e.keyCode !== 40 && e.keyCode !== 38) {
                    dropdown.search(searchInput.value);
                }
            };

            for (let option of optionsWrapper.getElementsByClassName('option')) {
                option.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isMultiple) {
                        option.children[0].checked = !option.children[0].checked;
                        selected.innerHTML = readCheck(dropdown, placeholder);
                        selectAllCheckbox.checked = dropdown.isAllChecked;
                    } else {
                        selected.innerHTML = option.innerText;
                        selected.dataset.value = option.dataset.value;
                        optionsWrapper.classList.add('hidden');
                        optionsWrapper.focusedItemIndex = -1;
                        for (let e of optionsWrapper.querySelectorAll('.option')) {
                            e.classList.remove('focused');
                        }
                        if (searchVisible) {
                            dropdown.search();
                        }
                    }
                    trigger(`${dropdown.id}/selected`, dropdown.getSelected());
                });
            }

            if (isMultiple) {
                selectAllLabel.onclick = function () {
                    dropdown.selectAll(!selectAllCheckbox.checked);
                    selectAllCheckbox.checked = !selectAllCheckbox.checked;
                };
                selected.innerHTML = readCheck(dropdown, placeholder);
            }

            window.addEventListener('click', function (e) {
                if (
                    !isMultiple && e.target.parentNode && e.target.parentNode.id !== dropdown.id &&
                    !e.target.parentNode.classList.contains('select-search') &&
                    !e.target.parentNode.classList.contains('select-search-button') &&
                    !e.target.parentNode.classList.contains('select-search-input') ||
                    isMultiple && e.target.parentNode && e.target.parentNode.id !== dropdown.id &&
                    !e.target.parentNode.classList.contains('select-search') &&
                    !e.target.parentNode.classList.contains('select-search-button') &&
                    !e.target.parentNode.classList.contains('select-search-input') &&
                    !e.target.parentNode.classList.contains('select-search-label') &&
                    !e.target.parentNode.classList.contains('option') &&
                    !e.target.parentNode.classList.contains('options-wrapper')
                ) {
                    optionsWrapper.classList.add("hidden");
                    optionsWrapper.focusedItemIndex = -1;
                    for (let e of optionsWrapper.querySelectorAll('.option')) {
                        e.classList.remove('focused');
                    }
                    if (searchVisible) {
                        dropdown.search();
                    }
                    if (isMultiple) {
                        optionsWrapper.children[0].classList.add('collapsed');
                    }
                    if (!dropdown.prevCollapsed) trigger(`${dropdown.id}/collapsed`);
                }
            });
        }

        function readCheck(dropdown, placeholder) {
            let selected = [];
            let ids = [];
            let objects = [];
            let total = [];
            let allChecked = true;
            for (let option of dropdown.children[1].getElementsByClassName('option')) {
                if (option.children[0].checked) {
                    selected.push(option.children[1].innerText);
                    ids.push(option.children[0].dataset.id);
                    objects.push({
                        checked: option.children[0].checked,
                        id: option.children[0].dataset.id,
                        name: option.children[1].innerText
                    });
                } else if (allChecked) {
                    allChecked = false;
                }
                total.push({
                    checked: option.children[0].checked,
                    id: option.children[0].dataset.id,
                    name: option.children[1].innerText
                });
            }
            dropdown.getSelected = function () {
                return ids;
            };
            dropdown.getSelectedNames = function () {
                return selected;
            };
            dropdown.getSelectedObject = function () {
                return objects;
            };
            dropdown.getAll = function () {
                return total;
            };
            dropdown.isAllChecked = allChecked;

            return selected.length !== 0 ? selected.join(', ') : placeholder;
        }
    }

    // Initialize all dropdowns
    on('load', function () {
        init();
    });

    function generate(data = [], id = '', placeholder = 'Select', isMultiple = false) {
        let select = document.createElement('div');
        let selected = document.createElement('div');
        let search = document.createElement('div');
        let wrapper = document.createElement('div');

        select.id = id;
        select.className = `select ${isMultiple ? 'multiple' : ''}`;
        selected.className = 'selected';
        selected.innerHTML = placeholder;
        wrapper.className = 'options-wrapper hidden';
        search.className = `select-search ${isMultiple ? 'collapsed' : ''}`;

        let searchButton = document.createElement('button');
        searchButton.className = 'select-search-button save';
        searchButton.innerHTML = '<img src="images/search.png" alt="search">';
        let searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search';
        searchInput.className = 'select-search-input';
        let selectAll = document.createElement('input');
        selectAll.className = 'select-search-checkbox';
        let selectAllID = generateGuid();
        selectAll.id = selectAllID;
        selectAll.type = 'checkbox';
        let selectAllLabel = document.createElement('label');
        selectAllLabel.className = 'select-search-label';
        selectAllLabel.for = selectAllID;
        selectAllLabel.innerText = 'Select all';

        search.appendChild(searchInput);
        search.appendChild(searchButton);
        if (isMultiple) {
            search.appendChild(selectAll);
            search.appendChild(selectAllLabel);
        }
        wrapper.appendChild(search);
        wrapper.focusedItemIndex = -1;
        searchInput.onkeydown = function (e) {
            let elements = Array.prototype.slice.call(wrapper.querySelectorAll('.option')).filter((element) => { return element.style.display !== 'none' });
            switch (e.keyCode) {
                case 40:
                    e.preventDefault();
                    if (wrapper.focusedItemIndex < elements.length - 1) {
                        wrapper.focusedItemIndex++;
                    } else {
                        wrapper.focusedItemIndex = elements.length - 1;
                    }
                    break;
                case 38:
                    e.preventDefault();
                    if (wrapper.focusedItemIndex > 0) {
                        wrapper.focusedItemIndex--;
                    }
                    break;
                case 13:
                    elements[wrapper.focusedItemIndex].click();
                    break;
            }
            for (let e of wrapper.querySelectorAll('.option')) {
                e.classList.remove('focused');
            }
            if (wrapper.focusedItemIndex > -1) {
                try {
                    elements[wrapper.focusedItemIndex].classList.add('focused');
                    elements[wrapper.focusedItemIndex].scrollIntoView(false);
                } catch (error) { }
            }
        }

        if (data && data.length > 0) {
            for (let option of data) {
                let optionElement = document.createElement('div');
                optionElement.className = 'option';
                if (isMultiple) {
                    let input = document.createElement('input');
                    let label = document.createElement('label');
                    input.type = 'checkbox';
                    input.checked = option.checked || false;
                    input.dataset.id = option.id;
                    label.innerHTML = option.name || option.category;
                    label.title = option.name || option.category;
                    optionElement.appendChild(input);
                    optionElement.appendChild(label);
                } else {
                    optionElement.dataset.value = option.id;
                    optionElement.innerHTML = option.name || option.category;
                    optionElement.title = option.name || option.category;
                }
                wrapper.appendChild(optionElement);
            }
        } else {
            select.style.display = 'none';
        }

        select.appendChild(selected);
        select.appendChild(wrapper);

        init(select, placeholder, isMultiple);
        return select;
    }

    return {
        generate
    }
}();