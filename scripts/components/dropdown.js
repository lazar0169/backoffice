let dropdown = function () {

    function init(element) {
        let select = element || $$('.select');

        if (element) {
            initializeDropdown(element);
        } else {
            for (let dropdown of select) {
                initializeDropdown(dropdown);
            }
        }

        function initializeDropdown(dropdown) {
            dropdown.children[0].addEventListener('click', function () {
                dropdown.children[1].classList.toggle("hidden");
            });

            for (let option of dropdown.children[1].children) {
                option.addEventListener('click', function () {
                    dropdown.children[0].innerHTML = option.innerHTML;
                    dropdown.children[0].dataset.value = option.dataset.value;
                    dropdown.children[1].classList.add("hidden");
                });
            }

            window.addEventListener('click', function (e) {
                if (e.target.parentNode && e.target.parentNode.id !== dropdown.id) {
                    dropdown.children[1].classList.add("hidden");
                }
            });
        }
    }

    // Initialize all dropdowns
    on('load', function () { init(); });

    function generate(data = {}, id = '') {
        let select = document.createElement('div');
        let selected = document.createElement('div');
        let wrapper = document.createElement('div');

        select.id = id;
        select.className = 'select';
        selected.className = 'selected';
        selected.innerHTML = 'Select option';
        wrapper.className = 'options-wrapper hidden';

        for (let option of data) {
            let optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.dataset.value = option.id;
            optionElement.innerHTML = option[Object.keys(this)[1]];
            wrapper.appendChild(optionElement);
        }

        select.appendChild(selected);
        select.appendChild(wrapper);

        init(select);
        return select;
    }

    return {
        generate
    }
}();