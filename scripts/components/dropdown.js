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
            dropdown.getSelected = function () { return dropdown.children[0].dataset.value; };
            dropdown.getSelectedName = function () { return dropdown.children[0].innerHTML; }
            dropdown.prevCollapsed = true;

            dropdown.children[0].addEventListener('click', function () {
                dropdown.prevCollapsed = dropdown.children[1].classList.contains('hidden');
                dropdown.children[1].classList.toggle('hidden');
            });

            for (let option of dropdown.children[1].children) {
                option.addEventListener('click', function (e) {
                    event.preventDefault();
                    e.stopPropagation();
                    if (isMultiple) {
                        option.children[0].checked = !option.children[0].checked;
                        dropdown.children[0].innerHTML = readCheck(dropdown, placeholder);
                    } else {
                        dropdown.children[0].innerHTML = option.innerHTML;
                        dropdown.children[0].dataset.value = option.dataset.value;
                        dropdown.children[1].classList.add("hidden");
                    }
                    trigger(`${dropdown.id}/selected`, dropdown.getSelected());
                });
            }

            if (isMultiple) {
                dropdown.children[0].innerHTML = readCheck(dropdown, placeholder);
            }

            window.addEventListener('click', function (e) {
                if (
                    !isMultiple && e.target.parentNode && e.target.parentNode.id !== dropdown.id ||
                    isMultiple && e.target.parentNode && e.target.parentNode.id !== dropdown.id && !e.target.parentNode.classList.contains('option') && !e.target.parentNode.classList.contains('options-wrapper')
                ) {
                    dropdown.children[1].classList.add("hidden");
                    if (!dropdown.prevCollapsed) trigger(`${dropdown.id}/collapsed`);
                }
            });
        }

        function readCheck(dropdown, placeholder) {
            let selected = [];
            let ids = [];
            let objects = [];
            let total = [];
            for (let option of dropdown.children[1].children) {
                if (option.children[0].checked) {
                    selected.push(option.children[1].innerHTML);
                    ids.push(option.children[0].dataset.id);
                    objects.push({
                        checked: option.children[0].checked,
                        id: option.children[0].dataset.id,
                        name: option.children[1].innerHTML
                    });
                }
                total.push({
                    checked: option.children[0].checked,
                    id: option.children[0].dataset.id,
                    name: option.children[1].innerHTML
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
        let wrapper = document.createElement('div');

        select.id = id;
        select.className = `select ${isMultiple ? 'multiple' : ''}`;
        selected.className = 'selected';
        selected.innerHTML = placeholder;
        wrapper.className = 'options-wrapper hidden';

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
            let placeholder = document.createElement('span');
            placeholder.style.display = 'none';
            placeholder.id = id;
            return placeholder;
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