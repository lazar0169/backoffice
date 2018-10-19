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
            dropdown.children[0].addEventListener('click', function () {
                dropdown.children[1].classList.toggle("hidden");
            });

            for (let option of dropdown.children[1].children) {
                option.addEventListener('click', function () {
                    if (isMultiple) {
                        option.children[0].click();
                        dropdown.children[0].innerHTML = readCheck(dropdown, placeholder);
                    } else {
                        dropdown.children[0].innerHTML = option.innerHTML;
                        dropdown.children[0].dataset.value = option.dataset.value;
                        dropdown.children[1].classList.add("hidden");
                    }
                });
            }

            window.addEventListener('click', function (e) {
                if (
                    !isMultiple && e.target.parentNode.id !== dropdown.id ||
                    isMultiple && e.target.parentNode.id !== dropdown.id && !e.target.parentNode.classList.contains('option') && !e.target.parentNode.classList.contains('options-wrapper')
                ) {
                    dropdown.children[1].classList.add("hidden");
                }
            });
        }

        function readCheck(dropdown, placeholder) {
            let selected = [];
            for (let option of dropdown.children[1].children) {
                if (option.children[0].checked) {
                    selected.push(option.children[1].innerHTML);
                }
            }
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

        for (let option of data) {
            let optionElement = document.createElement('div');
            optionElement.className = 'option';
            if (isMultiple) {
                let input = document.createElement('input');
                let label = document.createElement('label');
                input.type = 'checkbox';
                input.checked = false;
                input.dataset.id = option.id;
                label.innerHTML = option.name;
                optionElement.appendChild(input);
                optionElement.appendChild(label);
            } else {
                optionElement.dataset.value = option.id;
                optionElement.innerHTML = option[Object.keys(option)[1]];
            }
            wrapper.appendChild(optionElement);
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