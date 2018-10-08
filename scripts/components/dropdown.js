let dropdown = function () {
    // Initialize all dropdowns
    on('load', function () {
        for (let dropdown of $$('.select')) {
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
    });
}();